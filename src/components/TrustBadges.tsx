import React from "react";
import { Shield, Truck, RefreshCw } from "lucide-react";

export default function TrustBadges() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 relative">
      
      {/* 🌟 BALÃO FLUTUANTE CORRIGIDO PARA MIE → BRASIL */}
      <div className="absolute -top-12 right-4 z-20 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex flex-col gap-1 max-w-[180px]">
        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 tracking-wider">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          JAPAN POST EMS
        </div>
        <div className="text-sm font-black text-slate-900">
          MIE → BRASIL
        </div>
        <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
          ✓ RASTREIO ATIVO
        </div>
        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-1">
          <div className="bg-rose-500 h-full w-3/4 rounded-full" />
        </div>
      </div>

      {/* COMPONENTES DE BENEFÍCIOS ABAIXO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mt-6">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-900">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Rastreio Inteligente</h4>
            <p className="text-xs text-slate-500 mt-0.5">Postagem e atualização em tempo real.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-900">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">100% Declarado</h4>
            <p className="text-xs text-slate-500 mt-0.5">Sem multas surpresa na alfândega.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-900">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Seguro Total</h4>
            <p className="text-xs text-slate-500 mt-0.5">Reembolso garantido em caso de extravio.</p>
          </div>
        </div>
      </div>

    </section>
  );
}
