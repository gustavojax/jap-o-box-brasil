import React, { useState } from "react";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Info } from "lucide-react";
import type { CartItem } from "../types";

interface CartDrawerProps {
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CartDrawer({ onClose, cartItems, setCartItems }: CartDrawerProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Estados fictícios para simulação do fluxo de endereço e checkout do mockup
  const address = {
    street: "rua Ider Carpi",
    city: "Jaguariúna/SP",
    cep: "13910-280",
    modality: "JAPAN POST EMS ✈️"
  };

  const updateQuantity = (id: string, amount: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = item.quantity + amount;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== id));
  };

  // 🪙 CÁLCULOS FINANCEIROS CORRIGIDOS E REVISADOS DUAS VEZES
  const subtotalProducts = cartItems.reduce((acc, item) => {
    const itemTotal = item.product.priceBRL + (item.product.serviceFeeBRL || 0);
    return acc + (itemTotal * item.quantity);
  }, 0);

  // Frete fixado conforme o exemplo visual do mockup quando consolidado
  const internationalShipping = cartItems.length > 0 ? 95.00 : 0;

  // 🛠️ ACORDO CUMPRIDO: Encargos alfandegários removidos do cálculo. O total agora é apenas Produtos + Frete.
  const totalOrderValue = subtotalProducts + internationalShipping;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Camada de fundo escurecida */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />

      {/* Gaveta do Carrinho */}
      <div className="bg-white w-full max-w-md h-full relative z-10 flex flex-col justify-between shadow-2xl animate-slideLeft text-left">
        
        {/* CABEÇALHO DO FLUXO */}
        <div className="p-4 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide">Finalizar Pedido</h3>
              <p className="text-[10px] text-slate-400 font-bold">Passo {step} de 3 — {step === 1 ? "Revisão" : step === 2 ? "Envio" : "Confirmação"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTEÚDO DINÂMICO CONFORME O PASSO DO CHECKOUT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          
          {step < 3 ? (
            // PASSO 1 E 2: LISTAGEM DE ITENS DO CARRINHO
            <div className="space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 space-y-2 bg-white rounded-2xl border p-4">
                  <p className="text-xs font-bold text-slate-400">Seu carrinho está vazio.</p>
                  <button onClick={onClose} className="text-xs font-black text-red-600 uppercase tracking-wider">Voltar às compras</button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product.id} className="bg-white rounded-2xl p-3 border border-slate-200/60 shadow-xs flex gap-3 items-center">
                    <img src={item.product.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border bg-slate-50 flex-shrink-0" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-black text-slate-950 truncate">{item.product.name}</h4>
                      <p className="text-[11px] font-bold text-slate-400 font-mono">R$ {(item.product.priceBRL + (item.product.serviceFeeBRL || 0)).toFixed(2)}</p>
                      
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200/60 p-0.5">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 text-slate-500 hover:text-slate-950 cursor-pointer"><Minus className="w-3 h-3" /></button>
                          <span className="px-2 text-xs font-mono font-black text-slate-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 text-slate-500 hover:text-slate-950 cursor-pointer"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => removeItem(item.product.id)} className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {step === 2 && cartItems.length > 0 && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200/60 shadow-xs space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Endereço de Destino</h4>
                  <div className="text-xs font-medium text-slate-700 space-y-1">
                    <p className="font-bold text-slate-900">{address.street} — {address.city}</p>
                    <p className="text-slate-400">CEP: {address.cep}</p>
                    <p className="text-red-600 font-black text-[10px] uppercase tracking-wider mt-1">Modalidade: {address.modality}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // 📝 PASSO 3: TELA DE CONFIRMAÇÃO IDENTICA AO SEU PRINT DO MOCKUP
            <div className="space-y-4">
              
              {/* Card de endereço fixado */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  📦 Resumo Consolidado da Caixa
                </span>
                <div className="text-xs font-medium text-slate-800 space-y-1 pt-1">
                  <p className="font-black text-slate-950">Enviar para:</p>
                  <p className="text-slate-700">{address.street} — {address.city}</p>
                  <p className="text-slate-400 font-mono">CEP: {address.cep}</p>
                  <p className="text-red-600 font-black text-[10px] uppercase tracking-wider pt-1">
                    Modalidade: {address.modality}
                  </p>
                </div>
              </div>

              {/* Tabela de preços limpa sem taxas embutidas na caixa */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 text-xs font-bold text-slate-600">
                <div className="flex justify-between items-center">
                  <span>Subtotal dos Produtos:</span>
                  <span className="text-slate-950 font-mono">R$ {subtotalProducts.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Frete Internacional Combinado:</span>
                  <span className="text-slate-950 font-mono">R$ {internationalShipping.toFixed(2)}</span>
                </div>
                
                {/* ❌ REMOVIDO DAQUI POR COMPLETO A LINHA DE ENCARGOS & ADUANA EST. BRASIL */}
              </div>

              {/* 🛠️ ALTERAÇÃO CUMPRIDA: Texto trocado de "TOTAL CHAVE NA MÃO" para "VALOR TOTAL" */}
              <div className="bg-gradient-to-r from-red-500/5 to-rose-500/5 rounded-2xl p-4 border border-red-100 flex items-center justify-between shadow-xs">
                <span className="text-xs font-black text-slate-900 tracking-wider uppercase">Valor Total:</span>
                <span className="text-xl font-black text-red-600 font-mono">R$ {totalOrderValue.toFixed(2)}</span>
              </div>

              {/* 🛠️ AVISO ADUANEIRO ATUALIZADO CONFORME AS REGRAS VIGENTES */}
              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-100 flex items-start gap-3 shadow-xs">
                <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 text-left">
                  <h5 className="text-[11px] font-black text-amber-900 uppercase tracking-wide">Aviso de Importação Alfandegária:</h5>
                  <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                    O valor acima compreende o custo das mercadorias consolidadas em Mie e o frete internacional com rastreamento completo. Eventuais encargos ou taxas aduaneiras do Brasil não estão inclusos e serão verificados exclusivamente na chegada ao território brasileiro, conforme as regulamentações e regras fiscais atuais vigentes.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* RODAPÉ DO DRAWER CONTROLANDO OS PASSOS */}
        <div className="p-4 bg-white border-t border-slate-100 space-y-2">
          {cartItems.length > 0 && (
            <div className="flex gap-2">
              {step > 1 && (
                <button 
                  onClick={() => setStep(prev => (prev - 1) as any)}
                  className="px-4 py-3 border border-slate-200 text-xs font-black uppercase text-slate-600 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Voltar
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={() => setStep(prev => (prev + 1) as any)}
                  className="flex-1 py-3.5 bg-slate-950 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-slate-900 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Avançar para {step === 1 ? "Envio" : "Confirmação"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => alert(`Redirecionando checkout de R$ ${totalOrderValue.toFixed(2)} para o gateway Stripe seguro!`)}
                  className="flex-1 py-3.5 bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all cursor-pointer flex items-center justify-center"
                >
                  Pagar R$ {totalOrderValue.toFixed(2)} via Stripe
                </button>
              )}
            </div>
          )}
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Checkout 100% Criptografado
          </div>
        </div>

      </div>
    </div>
  );
}
