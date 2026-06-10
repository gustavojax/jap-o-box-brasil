import React from 'react';
import { ArrowRight, Plane } from 'lucide-react';

interface RedirectBannerProps {
  onRedirectClick: () => void;
}

export default function RedirectBanner({
  onRedirectClick,
}: RedirectBannerProps) {
  return (
    <div className="w-full bg-white py-8 px-4 border-y-2 border-red-600 shadow-md">
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

        {/* Botão */}
        <button
          onClick={onRedirectClick}
          className="bg-red-600 text-white font-black px-8 py-3 rounded-full flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg"
        >
          COMO FUNCIONA
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
