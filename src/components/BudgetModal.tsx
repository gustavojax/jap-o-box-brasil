import React, { useState, useMemo } from "react";
import { X, Plane, Send, CheckCircle2, Loader2 } from "lucide-react";
import { YEN_TO_BRL_RATE } from "../data";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

// 👑 FIX DO ROLLUP: Exportação default garantida de forma explícita para o App.tsx
export default function BudgetModal({ isOpen, onClose }: BudgetModalProps) {
  // Estados do formulário
  const [link, setLink] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoYen, setPrecoYen] = useState<number>(3000);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [instrucoes, setInstrucoes] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Estados de envio da requisição
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Motor de cálculo dinâmico baseado na cotação operacional do data.ts
  const calculos = useMemo(() => {
    // 🔄 Ajuste de escopo para bater perfeitamente com a variável de estado
    const produtoConvertido = precoYen * YEN_TO_BRL_RATE * quantidade;
    const assessoria = 25.00;
    const freteToquio = 50.00;
    const taxaCorreios = (produtoConvertido + assessoria + freteToquio) * 0.15; 
    const totalGeral = produtoConvertido + assessoria + freteToquio + taxaCorreios;

    return {
      produtoConvertido,
      assessoria,
      freteToquio,
      taxaCorreios,
      totalGeral
    };
  }, [precoYen, quantidade]);

  if (!isOpen) return null;

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!link || !nomeCliente || !whatsapp) {
      alert("Por favor, preencha os campos obrigatórios (*)");
      return;
    }

    setIsSubmitting(true);

    const dadosParaEnvio = {
      _subject: `📦 Nova Cotação de Produto: ${nomeCliente}`,
      emailLoja: "japaoboxbrasiljp26@gmail.com",
      clienteNome: nomeCliente,
      clienteWhatsApp: whatsapp,
      produtoLink: link,
      produtoNomeFranquia: nomeProduto || "Não informado",
      precoOriginalYen: `¥ ${precoYen}`,
      quantidadeSolicitada: quantidade,
      instrucoesEspeciais: instrucoes || "Nenhuma instrução informada",
      estimativaConversaoBRL: `R$ ${calculos.produtoConvertido.toFixed(2)}`,
      estimativaTotalChaveNaMao: `R$ ${calculos.totalGeral.toFixed(2)}`
    };

    try {
      const response = await fetch("https://formspree.io/f/xwvzrwpk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(dadosParaEnvio)
      });

      if (response.ok) {
        setIsSuccess(true);
        setLink("");
        setNomeProduto("");
        setInstrucoes("");
        setNomeCliente("");
        setWhatsapp("");
      } else {
        alert("Ocorreu um erro ao processar. Certifique-se de que o formulário está ativado no painel do Formspree.");
      }
    } catch (error) {
      console.error("Erro ao enviar cotação:", error);
      alert("Erro de conexão. Verifique sua internet antes de tentar novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] md:max-h-none overflow-y-auto">
        
        {/* CABEÇALHO DO MODAL */}
        <div className="p-6 pb-0 flex justify-between items-start">
          <div className="text-left">
            <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase flex items-center gap-1 w-fit">
              <Plane className="w-3 h-3" /> Personal Shopper Tóquio
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-2">
              Solicitar Qualquer Produto do Japão!
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Achou um item específico em lojas online, sebos de bonecos do Japão, lojas de cosméticos ou sites especializados? Preencha os campos abaixo de forma simples.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1 p-1 cursor-pointer transition-colors"
          >
            Fechar <X className="w-4 h-4" />
          </button>
        </div>

        {/* FEEDBACK DE ENVIO DO MODAL */}
        {isSuccess ? (
          <div className="p-12 text-center space-y-4 max-w-md mx-auto flex flex-col items-center justify-center min-h-[350px]">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 stroke-1 animate-pulse" />
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Solicitação Enviada!</h3>
              <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                Sua solicitação foi enviada, aguarde nosso contato.
              </p>
            </div>
            <button 
              onClick={() => { setIsSuccess(false); onClose(); }}
              className="mt-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Voltar para a Loja
            </button>
          </div>
        ) : (
          /* FORMULÁRIO OPERACIONAL DE CAPTURA */
          <form onSubmit={handleSubmitForm} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left">
            
            {/* ENTRADAS TÉCNICAS (COLUNA ESQUERDA) */}
            <div className="md:col-span-7 space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Link Japonês do Produto *</label>
                <input 
                  type="url" 
                  required
                  placeholder="Cole aqui o link do site japonês..." 
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Nome / Franquia do Produto (Se souber)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Figures Demon Slayer, Jill Stuart Gloss" 
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Preço em Yen Japão (¥)</label>
                  <input 
                    type="number" 
                    min="1"
                    placeholder="3000" 
                    value={precoYen}
                    onChange={(e) => setPrecoYen(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 text-xs font-black font-mono focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Quantidade</label>
                  <input 
                    type="number" 
                    min="1"
                    placeholder="1" 
                    value={quantidade}
                    onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 text-xs font-black font-mono focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Instruções Especiais de Compra</label>
                <textarea 
                  rows={2}
                  placeholder="Ex: Quero com a caixa lacrada. Se tiver a cor rosa, prefiro rosa..." 
                  value={instrucoes}
                  onChange={(e) => setInstrucoes(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Sua Ficha de Contato *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    required
                    placeholder="Nome Sobrenome" 
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                  <input 
                    type="text" 
                    required
                    placeholder="WhatsApp (C/ DDD)" 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

            </div>

            {/* BOX DE PREVISÃO TÉCNICA */}
            <div className="md:col-span-5 bg-slate-950 text-white rounded-3xl p-5 flex flex-col justify-between shadow-xl min-h-[380px]">
              <div className="space-y-4">
                <div className="text-center border-b border-white/10 pb-3">
                  <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block">Simulação Dinâmica Preço Estimado</span>
                  <h4 className="text-sm font-black tracking-tight mt-0.5">Previsão no Brasil Chave na Mão</h4>
                </div>

                <div className="space-y-2 text-xs font-medium text-slate-300">
                  <div className="flex justify-between">
                    <span>Produto Convertido:</span>
                    <span className="font-bold text-white">R$ {calculos.produtoConvertido.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shopper assessoria:</span>
                    <span className="font-bold text-white">R$ {calculos.assessoria.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete Econômico Tóquio:</span>
                    <span className="font-bold text-white">R$ {calculos.freteToquio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Previsão Taxa Correios:</span>
                    <span>R$ {calculos.taxaCorreios.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Valor Total de Referência</span>
                  <p className="text-2xl font-black text-yellow-400 mt-1">R$ {calculos.totalGeral.toFixed(2)}</p>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-800 disabled:text-slate-500"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processando...
                    </>
                  ) : (
                    <>
                      Pedir Cotação Oficial Japão <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <p className="text-[9px] text-slate-400 leading-relaxed text-center italic">
                  *Nosso personal shopper irá checar se o estoque está disponível nas lojas físicas ou portais digitais e vai te responder um link final de compra consolidada diretamente no WhatsApp no mesmo dia!
                </p>
              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}
