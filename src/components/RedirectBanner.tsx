import React from 'react';
import { ArrowRight, Package, Plane } from 'lucide-react';

export default function RedirectBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-700 to-blue-900 py-8 px-4 text-white shadow-xl">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Ícones e Título */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Plane className="w-8 h-8 text-blue-200" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Redirecionamento</h2>
            <p className="text-blue-200 font-medium text-sm">Compre em qualquer loja do Japão!</p>
          </div>
        </div>

        {/* Botão de Ação */}
        <button 
          onClick={() => document.getElementById('redirect-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-white text-blue-900 font-black px-8 py-3 rounded-full flex items-center gap-2 hover:bg-blue-50 transition-all shadow-lg shadow-blue-950/20"
        >
          COMO FUNCIONA <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
