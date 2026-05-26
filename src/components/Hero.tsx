import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface HeroProps {
  onScrollToCatalog: () => void;
  onOpenBudgetModal: () => void;
  onOpenClubModal: () => void;
}

export default function Hero({ 
  onScrollToCatalog, 
  onOpenBudgetModal, 
  onOpenClubModal 
}: HeroProps) {
  
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
          Nós compramos em lojas físicas ou direto de sites japoneses rústicos, preparamos a caixa no nosso armazém japonês localizado em Mie e despachamos direto para seu endereço no Brasil. Você simula o preço exato com impostos estimados antes de pagar!
        </p>
      </div>
      
      {/* BOTÕES DE AÇÃO TOTALMENTE ALINHADOS E SIMÉTRICOS */}
      <div className="flex flex-wrap gap-4 justify-center mt-8 max-w-3xl mx-auto">
        
        {/* BOTÃO 1: VER PRODUTOS */}
        <button 
          onClick={onScrollToCatalog}
          className="bg-white text-slate-950 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center gap-2 min-w-[200px]"
        >
          Explorar Catálogo <ArrowRight className="w-4 h-4" />
        </button>

        {/* BOTÃO 2: CLUBE SAKURA (REESTILIZADO PARA ACABAR COM A QUEBRA DO DESIGN) */}
        <button 
          onClick={onOpenClubModal}
          className="bg-slate-900/50 text-yellow-400 border border-slate-800 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-slate-800 hover:text-yellow-300 transition-all cursor-pointer flex items-center justify-center gap-2 min-w-[240px] shadow-md"
        >
          Conhecer Clube de Assinatura 🌸
        </button>

        {/* BOTÃO 3: PERSONAL SHOPPER */}
        <button 
          onClick={onOpenBudgetModal}
          className="bg-slate-900 text-slate-300 border border-slate-800 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2 min-w-[200px]"
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Personal Shopper
        </button>
        
      </div>

    </div>
  );
}
