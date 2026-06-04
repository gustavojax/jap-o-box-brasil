import React, { useState, useMemo } from "react";
import { X, Plane, Send, CheckCircle2, Loader2, AlertTriangle, Truck } from "lucide-react";
import { YEN_TO_BRL_RATE } from "../data";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

// Opções reais baseadas nos Correios do Japão
const SHIPPING_OPTIONS = [
  { id: "epacket", name: "E-Packet Light (Até 2kg)", price: 64.00, time: "40 dias úteis" },
  { id: "ems", name: "EMS Express (Até 30kg)", price: 141.00, time: "15 dias úteis" },
  { id: "parcel", name: "Post Parcel (Até 30kg)", price: 178.00, time: "30 dias úteis" }
];

export default function BudgetModal({ isOpen, onClose }: BudgetModalProps) {
  // Estados do formulário
  const [link, setLink] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoYen, setPrecoYen] = useState<number>(3000);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [instrucoes, setInstrucoes] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [shippingMethod, setShippingMethod] = useState<string>("epacket");

  // Estados de envio da requisição
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Motor de cálculo dinâmico atualizado com as regras da Receita Federal (Fora do Remessa Conforme)
  const calculos = useMemo(() => {
    const produtoConvertido = precoYen * YEN_TO_BRL_RATE * quantidade;
    const assessoria = 25.00;
    
    const freteSelecionado = SHIPPING_OPTIONS.find(s => s.id === shippingMethod);
    const freteToquio = freteSelecionado ? freteSelecionado.price : 64.00;
    
    // Base de Cálculo (Valor Aduaneiro = Produto + Frete + Seguros/Taxas)
    const valorAduaneiro = produtoConvertido + assessoria + freteToquio;
    
    // Imposto de Importação (60%)
    const impostoImportacao = valorAduaneiro * 0.60;
    
    // ICMS (17% calculado "por dentro")
    const aliquotaICMS = 0.17;
    const baseCalculoICMS = (valorAduaneiro + impostoImportacao) / (1 - aliquotaICMS);
    const icms = baseCalculoICMS * aliquotaICMS;
    
    const totalImpostos = impostoImportacao + icms;
    const totalGeral = valorAduaneiro + totalImpostos;

    return {
      produtoConvertido,
      assessoria,
      freteToquio,
      impostoImportacao,
      icms,
      totalImpostos,
      totalGeral,
      nomeFrete: freteSelecionado?.name || "Frete Padrão"
    };
  }, [precoYen, quantidade, shippingMethod]);

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
      freteDesejado: calculos.nomeFrete,
      instrucoesEspeciais: instrucoes || "Nenhuma instrução informada",
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
        setShippingMethod("epacket");
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
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-y-auto">
        
        {/* CABEÇALHO DO MODAL */}
        <div className="p-6 pb-4 flex justify-between items-start border-b border-slate-100">
          <div className="text-left">
            <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase flex items-center gap-1 w-fit">
              <Plane className="w-3 h-3" /> Personal Shopper Tóquio
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-2">
              Solicitar Orçamento de Produto
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1 p-1 cursor-pointer transition-colors"
          >
            Fechar <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 stroke-1 animate-pulse" />
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Solicitação Enviada!</h3>
              <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                Nossa equipe no Japão vai verificar o estoque e entrar em contato com o valor consolidado.
              </p>
            </div>
            <button 
              onClick={() => { setIsSuccess(false); onClose(); }}
              className="mt-4 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Voltar para a Loja
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitForm} className="grid grid-cols-1 lg:grid-cols-12 flex-1">
            
            {/* ENTRADAS TÉCNICAS (COLUNA ESQUERDA) */}
            <div className="lg:col-span-7 p-6 space-y-5 overflow-y-auto">
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Link Japonês do Produto *</label>
                <input 
                  type="url" 
                  required
                  placeholder="Cole aqui o link do site japonês..." 
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Nome / Franquia do Produto</label>
                <input 
                  type="text" 
                  placeholder="Ex: Tênis Asics Gel, Figures Demon Slayer..." 
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Preço do site em Yen (¥) *</label>
                  <input 
                    type="number" 
                    min="1"
                    placeholder="3000" 
                    value={precoYen}
                    onChange={(e) => setPrecoYen(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 text-sm font-black font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Quantidade *</label>
                  <input 
                    type="number" 
                    min="1"
                    placeholder="1" 
                    value={quantidade}
                    onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 text-sm font-black font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* SELEÇÃO DO FRETE */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Opção de Envio JP Post
                </label>
                <div className="relative">
                  <select 
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  >
                    {SHIPPING_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name} - R$ {opt.price.toFixed(2).replace('.', ',')} ({opt.time})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Instruções de Compra (Opcional)</label>
                <textarea 
                  rows={2}
                  placeholder="Detalhes de cor, tamanho ou estado do produto..." 
                  value={instrucoes}
                  onChange={(e) => setInstrucoes(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Seu Contato *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    required
                    placeholder="Nome Completo" 
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                  <input 
                    type="text" 
                    required
                    placeholder="WhatsApp (C/ DDD)" 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

            </div>

            {/* BOX DE PREVISÃO TÉCNICA E IMPOSTOS (COLUNA DIREITA) */}
            <div className="lg:col-span-5 bg-slate-900 text-white p-6 md:p-8 flex flex-col justify-between shadow-[inset_10px_0_20px_-10px_rgba(0,0,0,0.3)]">
              
              <div className="space-y-5">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block">Simulador de Custos Base</span>
                  <h4 className="text-base font-black tracking-tight mt-1">Valores a Pagar para a Japão Box</h4>
                </div>

                <div className="space-y-3 text-sm font-medium text-slate-300">
                  <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span>Produto ({quantidade}x)</span>
                    <span className="font-black text-white">R$ {calculos.produtoConvertido.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span>Taxa Shopper</span>
                    <span className="font-black text-white">R$ {calculos.assessoria.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="max-w-[180px] leading-tight">Frete Internacional <br/><span className="text-[10px] text-slate-500">{calculos.nomeFrete}</span></span>
                    <span className="font-black text-white">R$ {calculos.freteToquio.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                {/* ALERTA DE TRIBUTAÇÃO */}
                <div className="bg-blue-950/40 border border-blue-800 p-4 rounded-2xl mt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Impostos Alfandegários
                  </p>
                  <div className="space-y-2 text-[11px] text-blue-200 font-medium">
                    <div className="flex justify-between">
                      <span>I. Importação (60% federal)</span>
                      <span>R$ {calculos.impostoImportacao.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ICMS (Média 17% estadual)</span>
                      <span>R$ {calculos.icms.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between font-black pt-2 border-t border-blue-800 text-white text-xs mt-1">
                      <span>Previsão Taxa Correios BR</span>
                      <span>R$ {calculos.totalImpostos.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 mt-4 border-t border-white/10">
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Custo Total Chave na Mão (Est.)</span>
                  <p className="text-3xl font-black text-white">R$ {calculos.totalGeral.toFixed(2).replace('.', ',')}</p>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#e60012] hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-900/50 flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-800 disabled:text-slate-500"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Gerando Orçamento...
                    </>
                  ) : (
                    <>
                      Enviar Solicitação à Equipe <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}
