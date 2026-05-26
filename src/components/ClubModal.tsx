import React from "react";
import { X, Check, Crown, ShieldCheck, Zap, Box } from "lucide-react";

interface ClubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClubModal({ isOpen, onClose }: ClubModalProps) {
  if (!isOpen) return null;

  const planos = [
    {
      nome: "Sakura Standard",
      preco: "29,90",
      icon: <Zap className="w-5 h-5 text-rose-500" />,
      cor: "border-slate-200 bg-white text-slate-900",
      botao: "bg-slate-900 text-white hover:bg-slate-800",
      vantagens: [
        "Desconto de 50% na Taxa de Despacho",
        "45 dias de armazenamento gratuito",
        "Descarte de caixas originais grátis",
        "Fotos padrão de recebimento (2 por caixa)",
      ],
    },
    {
      nome: "Sakura VIP Pro",
      preco: "59,90",
      icon: <Crown className="w-5 h-5 text-amber-500" />,
      cor: "border-amber-500 bg-slate-950 text-white ring-4 ring-amber-500/20 relative",
      botao: "bg-amber-500 text-slate-950 hover:bg-amber-400 font-black",
      badge: "Mais Assinado 🚀",
      vantagens: [
        "TAXA DE DESPACHO R$ 0,00 (Isenção Total)",
        "60 dias de armazenamento gratuito",
        "Fotos detalhadas ilimitadas (HD)",
        "Consolidação de pacotes prioritária",
        "Suporte direto via WhatsApp preferencial",
      ],
    },
    {
      nome: "Shogun Master",
      preco: "119,90",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      cor: "border-slate-200 bg-white text-slate-900",
      botao: "bg-slate-900 text-white hover:bg-slate-800",
      vantagens: [
        "TAXA DE DESPACHO R$ 0,00 (Isenção Total)",
        "90 dias de armazenamento gratuito",
        "Seguro contra perdas incluso (até R$ 1.500)",
        "Acesso antecipado de 24h a lotes da vitrine",
        "Atendimento Personal Shopper por chamada",
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-50 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col p-6 md:p-8 relative my-8 animate-fadeIn text-left">
        
        {/* FECHAR */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-900 transition-colors p-1 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* INTRODUÇÃO */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase flex items-center gap-1 w-fit mx-auto">
            <Box className="w-3 h-3" /> Clube de Assinatura Logística
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-3">
            Clube Sakura VIP Importer
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-2 font-medium">
            Seja um assinante e ganhe superpoderes na sua suíte de Mie. Economize eliminando taxas de manuseio, estendendo o armazenamento e garantindo fotos HD de todas as suas mercadorias do Japão.
          </p>
        </div>

        {/* GRID DOS PLANOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {planos.map((plano) => (
            <div 
              key={plano.nome}
              className={`border rounded-3xl p-6 flex flex-col justify-between shadow-sm transition-all hover:shadow-md ${plano.cor}`}
            >
              {plano.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                  {plano.badge}
                </span>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider opacity-90">{plano.nome}</span>
                  {plano.icon}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold opacity-70">R$</span>
                  <span className="text-3xl font-black tracking-tight">{plano.preco}</span>
                  <span className="text-xs font-medium opacity-60">/mês</span>
                </div>

                <ul className="space-y-2.5 pt-2 text-xs font-medium opacity-90">
                  {plano.vantagens.map((vantagem, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{vantagem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => alert("Integração de pagamento em homologação (Gateway Checkout).")}
                  className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer ${plano.botao}`}
                >
                  Assinar Plano
                </button>
              </div>

            </div>
          ))}
        </div>

        <p className="text-[10px] text-slate-400 text-center mt-6 italic font-medium">
          * Sem fidelidade. Você pode cancelar ou alterar o plano da sua suíte diretamente pelo painel administrativo a qualquer momento.
        </p>

      </div>
    </div>
  );
}
