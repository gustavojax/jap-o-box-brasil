import React from "react";
// Importe os ícones que você já usa no Hero (exemplo: Box, Sparkles, ArrowRight...)
import { Box, Sparkles, ArrowRight } from "lucide-react";

// 1. ADICIONE 'onOpenClubModal' NAS PROPRIEDADES (INTERFACE) DO HERO
interface HeroProps {
  onScrollToCatalog: () => void;
  onOpenBudgetModal: () => void;
  onOpenClubModal: () => void; // 👈 Adicione essa linha aqui
}

export default function Hero({ 
  onScrollToCatalog, 
  onOpenBudgetModal, 
  onOpenClubModal // 👈 Receba a função aqui
}: HeroProps) {
  
  return (
    <div className="relative bg-slate-950 text-white overflow-hidden py-20 px-4">
      {/* ... Todo o resto do seu layout, textos e estilização do Hero ... */}
      
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <button 
          onClick={onScrollToCatalog}
          className="bg-white text-slate-950 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-2"
        >
          Ver Produtos <ArrowRight className="w-4 h-4" />
        </button>

        {/* 2. ADICIONE O ONCLICK NO BOTÃO DO CLUBE SAKURA */}
        <button 
          onClick={onOpenClubModal} // 👈 Adicione exatamente isso no clique desse botão!
          className="bg-rose-600 text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20 cursor-pointer flex items-center gap-2"
        >
          Conhecer Clube de Assinatura 🌸
        </button>

        <button 
          onClick={onOpenBudgetModal}
          className="bg-slate-900 text-slate-300 border border-slate-800 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Personal Shopper
        </button>
      </div>

    </div>
  );
}
