import React, { useState } from 'react';
import { ArrowRight, Plane, ChevronDown, ChevronUp, Info, AlertCircle } from 'lucide-react';

interface RedirectBannerProps {
  onRedirectClick: () => void;
}

// Taxa de conversão usada no projeto
const YEN_TO_BRL_RATE = 0.038;

export default function RedirectBanner({ onRedirectClick }: RedirectBannerProps) {
  const [isTableOpen, setIsTableOpen] = useState(false);

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
                onClick={onRedirectClick}
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

              {/* AVISO IMPORTANTE */}
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-start gap-2 text-[11px] text-blue-900 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">⚠️ Aviso Importante</span>
                  As taxas de importação, tributos e eventuais cobranças alfandegárias são definidas pelos órgãos competentes e são de responsabilidade do comprador. A Japão Box Brasil não tem controle ou responsabilidade sobre esses valores. Agradecemos a compreensão! 🇯🇵📦
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </>
  );
}







