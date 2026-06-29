import React, { useState } from 'react';
import { ArrowRight, Plane, ChevronDown, ChevronUp, Info, ShieldAlert } from 'lucide-react';
import CustomsWarningModal from './CustomsWarningModal';

interface RedirectBannerProps {
  onRedirectClick: () => void;
}

// Taxa de conversão usada no projeto
const YEN_TO_BRL_RATE = 0.038;

export default function RedirectBanner({ onRedirectClick }: RedirectBannerProps) {
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [showCustomsWarning, setShowCustomsWarning] = useState(false);
  const [redirectAccepted, setRedirectAccepted] = useState(false);

  const handleComoFunciona = () => {
    if (!redirectAccepted) {
      setShowCustomsWarning(true);
    } else {
      onRedirectClick();
    }
  };

  const handleCustomsWarningAccept = () => {
    setRedirectAccepted(true);
    setShowCustomsWarning(false);
    onRedirectClick();
  };

  return (
    <>
      <div className="w-full bg-white border-y-2 border-red-600 shadow-md">
        {/* Banner Principal */}
        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Ícone e Texto */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-600 rounded-2xl shadow-lg">
                <Plane className="w-8 h-8 text-white" />
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-red-600">
                  Redirecionamento
                </h2>
                <p className="text-black font-bold text-sm md:text-base">
                  Compre em qualquer loja do Japão!
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setIsTableOpen(!isTableOpen)}
                className="w-full sm:w-auto bg-slate-100 text-slate-800 font-black px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-slate-200 transition-all border border-slate-300"
              >
                <Info className="w-4 h-4 text-red-600" />
                VER TABELA DE TAXAS
                {isTableOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <button
                onClick={handleComoFunciona}
                className="w-full sm:w-auto bg-red-600 text-white font-black px-8 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/30"
              >
                COMO FUNCIONA
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

        {/* ABA RETRÁTIL DA TABELA DE PREÇOS */}
        {isTableOpen && (
          <div className="bg-slate-50 border-t border-slate-200 py-6 px-4 animate-fadeIn text-left">
            <div className="max-w-xl mx-auto space-y-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Info className="w-4 h-4 text-red-600" />
                <h4 className="text-xs font-black uppercase tracking-wider">Custo do Serviço de Redirecionamento</h4>
              </div>
              
              <p className="text-xs text-slate-600 leading-relaxed">
                A nossa taxa de assessoria é calculada de forma transparente com base no valor total das suas compras consolidadas na caixa:
              </p>

              {/* TABELA DE TAXAS DINÂMICA */}
              <div className="w-full bg-white rounded-xl border border-slate-200 text-xs overflow-hidden shadow-sm">
                <div className="grid grid-cols-2 bg-slate-100 p-3 font-bold text-slate-700 border-b border-slate-200">
                  <span>Valor total da compra (Ienes)</span>
                  <span className="text-right">Taxa de Serviço</span>
                </div>
                <div className="grid grid-cols-2 p-3 text-slate-600 border-b border-slate-100">
                  <span>De ¥4.000 até ¥20.000</span>
                  <span className="text-right font-black text-slate-900">
                    ¥4.000 <span className="text-slate-400 font-normal text-[10px] block sm:inline">(~R$ ${(4000 * YEN_TO_BRL_RATE).toFixed(2)})</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 p-3 text-slate-600">
                  <span>Acima de ¥20.000</span>
                  <span className="text-right font-black text-red-600">
                    20% <span className="text-slate-400 font-normal text-[10px] block sm:inline">do valor dos produtos</span>
                  </span>
                </div>
              </div>

              {/* AVISO IMPORTANTE ALFANDEGÁRIO */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2 text-[11px] text-amber-900 leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Informativo de Importação (Regras 2026):</span>
                  O valor da taxa de serviço acima e o frete internacional são calculados e fixados na hora do fechamento físico da sua caixa. Lembre-se que envios internacionais podem estar sujeitos a tributações alfandegárias na entrada do Brasil.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Aviso Alfandegário */}
      <CustomsWarningModal 
        isOpen={showCustomsWarning}
        onClose={() => setShowCustomsWarning(false)}
        onAccept={handleCustomsWarningAccept}
        type="redirect"
      />
    </>
  );
}
