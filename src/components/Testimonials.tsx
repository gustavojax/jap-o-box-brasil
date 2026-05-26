import React from "react";
import { Smile, ShieldCheck, Box, Star, Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="w-full bg-slate-50 py-16 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        
        {/* GRID DE MÉTRICAS E ESTATÍSTICAS TOTALMENTE ALINHADO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Métrica 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 flex items-center gap-4 shadow-xs">
            <div className="p-3 bg-red-50 rounded-xl text-red-600 flex-shrink-0 border border-red-100/50">
              <Smile className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xl font-black text-slate-900 tracking-tight">+5.000</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clientes Felizes</p>
            </div>
          </div>

          {/* Métrica 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 flex items-center gap-4 shadow-xs">
            <div className="p-3 bg-red-50 rounded-xl text-red-600 flex-shrink-0 border border-red-100/50">
              <Box className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xl font-black text-slate-900 tracking-tight">+12.000</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Caixas Enviadas</p>
            </div>
          </div>

          {/* Métrica 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 flex items-center gap-4 shadow-xs">
            <div className="p-3 bg-red-50 rounded-xl text-red-600 flex-shrink-0 border border-red-100/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xl font-black text-slate-900 tracking-tight">100%</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Seguro de Carga</p>
            </div>
          </div>

          {/* Métrica 4 */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 flex items-center gap-4 shadow-xs">
            <div className="p-3 bg-red-50 rounded-xl text-red-600 flex-shrink-0 border border-red-100/50">
              <Star className="w-5 h-5 fill-red-600" />
            </div>
            <div className="text-left">
              <p className="text-xl font-black text-slate-900 tracking-tight">4.9 / 5</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avaliação Média</p>
            </div>
          </div>

        </div>

        {/* ÁREA DE DEPOIMENTO PREMIUM */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/60 p-8 md:p-10 relative shadow-sm overflow-hidden group">
            
            {/* Ícone decorativo de aspas de fundo */}
            <Quote className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-50 opacity-[0.03] pointer-events-none transform -rotate-12 group-hover:scale-105 transition-transform duration-500" />
            
            <div className="flex flex-col items-center text-center space-y-6 relative z-10">
              {/* Estrelas de avaliação */}
              <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                ))}
                <span className="text-[10px] font-black text-slate-700 ml-1">DEPOIMENTO REAL</span>
              </div>

              {/* Texto do depoimento */}
              <p className="text-sm md:text-base text-slate-700 font-medium italic leading-relaxed max-w-2xl">
                "Minha primeira importação de cosméticos com a Japão Box foi perfeita. A Paula foi extremamente atenciosa no atendimento, consolidou meus produtos com segurança em Mie e a caixa chegou impecável no interior de SP, sem nenhuma avaria."
              </p>

              {/* Assinatura / Autor */}
              <div className="pt-4 border-t border-slate-100 w-full max-w-xs">
                <p className="text-sm font-black text-slate-950 tracking-tight">Mariana Silva</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Importadora • São Paulo - SP</p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
