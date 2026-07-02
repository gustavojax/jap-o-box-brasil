import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface HeroProps {
  onClubClick: () => void;
}

export default function Hero({ onClubClick }: HeroProps) {
  
  return (
    <div className="relative bg-slate-950 text-white overflow-hidden py-20 px-4 text-center">
      
      {/* CONTEÚDO PRINCIPAL DO HERO */}
      <div className="max-w-4xl mx-auto space-y-4">
        <span className="bg-red-600/10 text-red-500 border border-red-500/20 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
          ** Encomendas Direto de Mie **
        </span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
          Compre do Japão <br />
          <span className="text-red-500">Sem Pegadinhas</span> <br />
          Sem Taxas Ocultas!
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Nós compramos em lojas físicas ou direto de sites japoneses, preparamos a caixa no nosso armazém localizado em Mie e despachamos direto para seu endereço no Brasil com rastreio completo e sem surpresas na alfândega.
        </p>
      </div>
      
      {/* BOTÕES DE AÇÃO */}
      <div className="flex flex-wrap gap-4 justify-center mt-8 max-w-3xl mx-auto">
        
        {/* BOTÃO: CLUBE SAKURA */}
        <button 
          onClick={onClubClick}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          Conhecer Clube de Assinatura 🌸
        </button>

        {/* BOTÃO: PERSONAL SHOPPER */}
        <button 
          onClick={() => alert("Personal Shopper em breve!")}
          className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Personal Shopper
        </button>
        
      </div>

    </div>
  );
}
