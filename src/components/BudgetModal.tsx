import React, { useState, useEffect } from "react";
import { YEN_TO_BRL_RATE } from "../data";
import { Plane, HelpCircle, Send, ClipboardCheck, Sparkles } from "lucide-react";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledData?: {
    link: string;
    jpPriceYen: number;
    category: string;
    description: string;
  } | null;
  onSubmitBudget: (formData: any) => void;
}

export default function BudgetModal({ isOpen, onClose, prefilledData, onSubmitBudget }: BudgetModalProps) {
  const [productLink, setProductLink] = useState("");
  const [productName, setProductName] = useState("");
  const [priceYen, setPriceYen] = useState<number>(3000);
  const [qty, setQty] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prefill hook
  useEffect(() => {
    if (prefilledData) {
      setProductLink(prefilledData.link);
      setPriceYen(prefilledData.jpPriceYen);
      setInstructions(prefilledData.description);
    } else {
      setProductLink("");
      setPriceYen(3000);
      setInstructions("");
    }
  }, [prefilledData, isOpen]);

  if (!isOpen) return null;

  // Real-time calculation helper
  const baseBRL = priceYen * YEN_TO_BRL_RATE * qty;
  const shopperFeeBRL = baseBRL < 150 ? 25 : baseBRL * 0.10;
  const estimatedShippingBRL = Math.max(40, 35 + (qty * 15)); // lighter weight assumption
  const estimatedTaxBRL = (baseBRL + estimatedShippingBRL) < 275 ? (baseBRL + estimatedShippingBRL) * 0.205 : (baseBRL + estimatedShippingBRL) * 0.44;
  const estimatedTotalBRL = baseBRL + shopperFeeBRL + estimatedShippingBRL + estimatedTaxBRL;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productLink || !buyerName || !buyerPhone) return;

    setSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      onSubmitBudget({
        productLink,
        productName: productName || "Item Desconhecido (Análise do Link)",
        priceYen,
        qty,
        instructions,
        buyerName,
        buyerEmail,
        buyerPhone,
        estimatedTotalBRL
      });
      setSubmitting(false);
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset fields
        setProductName("");
        setBuyerName("");
        setBuyerEmail("");
        setBuyerPhone("");
      }, 3500);

    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-sans">
      
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl scrollbar-thin">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 px-2.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 text-xs font-black font-mono cursor-pointer"
        >
          FECHAR ✕
        </button>

        {!success ? (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* Header Title */}
            <div className="text-center sm:text-left border-b border-rose-100 pb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider font-mono">
                <Plane className="w-3.5 h-3.5 text-red-600 animate-bounce" />
                Personal Shopper Tóquio
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                Solicitar Qualquer Produto do Japão!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Achou um item específico em lojas online, sebos de bonecos do Japão, lojas de cosméticos ou sites especializados? Preencha os campos abaixo de forma simples.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Form Input Side */}
              <div className="space-y-4">
                
                {/* Link */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                    Link Japonês do Produto *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="Cole aqui o link do site japonês..."
                    value={productLink}
                    onChange={(e) => setProductLink(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white"
                  />
                </div>

                {/* Name of Product */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                    Nome / Franquia do Produto (Se souber)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Figures Demon Slayer, Jill Stuart Gloss"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white"
                  />
                </div>

                {/* Yen Price & Qty Side by side */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                      Preço em Yen Japão (¥)
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ex: 2500"
                      value={priceYen || ""}
                      onChange={(e) => setPriceYen(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                    Instruções Especiais de Compra
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Quero com a caixa lacrada. Se tiver a cor rosa, prefiro rosa..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white resize-none"
                  />
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">Sua Ficha de Contato:</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Nome Sobrenome"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="WhatsApp (C/ DDD)"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Estimate Calculation Live display on the right Side */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 space-y-4 self-stretch flex flex-col justify-between">
                
                <div>
                  <div className="pb-3 border-b border-white/10 mb-4 text-center">
                    <span className="text-[10px] font-mono text-rose-300 font-bold uppercase tracking-wider block">
                      SIMULAÇÃO DINÂMICA PREÇO ESTIMADO
                    </span>
                    <h4 className="text-sm font-bold text-gray-300 mt-1">Previsão no Brasil Chave na Mão</h4>
                  </div>

                  <div className="space-y-3 text-[11px] text-gray-400">
                    
                    <div className="flex justify-between items-center">
                      <span>Produto Convertido</span>
                      <span className="font-mono text-white">R$ {baseBRL.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Shopper assessoria</span>
                      <span className="font-mono text-white">R$ {shopperFeeBRL.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Frete Econômico Tóquio</span>
                      <span className="font-mono text-white">R$ {estimatedShippingBRL.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-rose-300">
                      <span>Previsão Taxa Correios</span>
                      <span className="font-mono font-bold">R$ {estimatedTaxBRL.toFixed(2)}</span>
                    </div>

                  </div>

                  {/* Total line */}
                  <div className="border-t border-white/10 mt-5 pt-4 text-center">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">VALOR TOTAL DE REFERÊNCIA</span>
                    <span className="text-xl md:text-2xl font-black text-amber-300 font-mono">
                      R$ {estimatedTotalBRL.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-2.5">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase rounded-xl shadow-lg transition-transform text-center cursor-pointer select-none"
                  >
                    {submitting ? "Verificando Link..." : "Pedir Cotação Oficial Japão ➔"}
                  </button>
                  <p className="text-[9px] text-gray-500 text-center leading-tight">
                    *Nosso personal shopper irá checar se o estoque está disponível nas lojas físicas ou portais digitais e vai te responder um link final de compra consolidada diretamente no WhatsApp no mesmo dia!
                  </p>
                </div>

              </div>

            </div>

          </form>
        ) : (
          /* Success Screen */
          <div className="py-16 text-center space-y-4 animate-in fade-in duration-300 font-sans">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto shadow-md">
              🌸
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Pedido de Orçamento Cadastrado!</h3>
              <p className="text-sm text-amber-600 font-semibold">Tóquio já está em busca da sua mercadoria.</p>
              <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-2 pt-2 mt-4 text-left">
                <p><strong>Cliente:</strong> {buyerName}</p>
                <p className="truncate"><strong>Link Enviado:</strong> {productLink}</p>
                <p className="font-mono text-rose-600 font-semibold"><strong>Previsão Estimada total:</strong> R$ {estimatedTotalBRL.toFixed(2)}</p>
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto pt-4 leading-relaxed">
                Nossos representantes em Tóquio enviarão a confirmação com fotos de estoque e cotação de frete final diretamente para o seu WhatsApp cadastrado.
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
