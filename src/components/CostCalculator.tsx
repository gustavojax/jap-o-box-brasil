import React, { useState, useMemo } from "react";
import { Calculator, Info, ShieldAlert, Truck, HelpCircle } from "lucide-react";

export default function CostCalculator() {
  // 1. Estados para as informações fornecidas pelo cliente
  const [itemWeight, setItemWeight] = useState<number>(0.5); // Peso padrão em kg
  const [shippingMethod, setShippingMethod] = useState<"ems" | "air" | "sea">("ems");

  // Preço base do produto simulado (já com a sua taxa de assessoria embutida de forma oculta)
  const productPriceBRL = 235.20; 

  // 2. Cálculo dinâmico do Frete com base nas informações do cliente
  const shippingCostBRL = useMemo(() => {
    // Valores de frete simulados por KG saindo de Mie
    const rates = {
      ems: 120, // Rápido com rastreio total
      air: 85,  // Econômico aéreo
      sea: 45   // Navio (demorado)
    };
    return Math.round(itemWeight * rates[shippingMethod]);
  }, [itemWeight, shippingMethod]);

  // 3. Estimativa de Imposto conforme as regras atuais de importação do Brasil (2026)
  // (Ex: Alíquota unificada de ICMS + Imposto de Importação simplificado)
  const estimatedTaxBRL = useMemo(() => {
    const subtotal = productPriceBRL + shippingCostBRL;
    return Math.round(subtotal * 0.20); // Simulação de 20% de carga tributária aproximada do Remessa Conforme
  }, [shippingCostBRL]);

  // 4. Valor Final Chave na Mão
  const totalCostBRL = productPriceBRL + shippingCostBRL + estimatedTaxBRL;

  return (
    <section id="calculator" className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="bg-slate-900 text-white p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-black flex items-center gap-2 tracking-tight">
            <Calculator className="w-6 h-6 text-rose-500" /> Simular Custo de Envio (Mie ➔ Brasil)
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Insira o peso estimado do seu pacote para calcular o frete exato e ver o valor final chave na mão.
          </p>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* COLUNA DA ESQUERDA: ENTRADA DE DADOS DO CLIENTE */}
          <div className="md:col-span-6 space-y-5">
            
            {/* Peso do Pacote */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider block">
                Peso Estimado do Pacote (Kg)
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0.1" 
                  max="10" 
                  step="0.1"
                  value={itemWeight}
                  onChange={(e) => setItemWeight(parseFloat(e.target.value))}
                  className="w-full accent-slate-900"
                />
                <span className="font-mono font-black text-sm bg-slate-100 px-3 py-1 rounded-lg text-slate-800 min-w-[70px] text-center">
                  {itemWeight} kg
                </span>
              </div>
            </div>

            {/* Método de Envio */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider block">
                Modalidade de Frete Internacional
              </label>
              <div className="grid grid-cols-1 gap-2">
                <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${shippingMethod === "ems" ? "border-slate-950 bg-slate-50 shadow-sm" : "border-slate-200 hover:bg-slate-50/50"}`}>
                  <div className="flex items-center gap-2.5">
                    <input type="radio" name="shipping" checked={shippingMethod === "ems"} onChange={() => setShippingMethod("ems")} className="accent-slate-900" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900">Japan Post EMS (Expresso)</p>
                      <p className="text-[10px] text-slate-400">7 a 15 dias • Rastreio ponta a ponta</p>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${shippingMethod === "air" ? "border-slate-950 bg-slate-50 shadow-sm" : "border-slate-200 hover:bg-slate-50/50"}`}>
                  <div className="flex items-center gap-2.5">
                    <input type="radio" name="shipping" checked={shippingMethod === "air"} onChange={() => setShippingMethod("air")} className="accent-slate-900" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900">Air Mail (Econômico Aéreo)</p>
                      <p className="text-[10px] text-slate-400">15 a 25 dias • Rastreio padrão</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* COLUNA DA DIREITA: EXIBIÇÃO CLEAN DO PREÇO FINAL */}
          <div className="md:col-span-6 bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-4">
            
            {/* Lista de Valores Limpa */}
            <div className="space-y-2.5 border-b pb-4 text-sm font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Preço do Item</span>
                <span className="font-bold text-slate-900">R$ {productPriceBRL.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete Internacional (Mie ➔ BR)</span>
                <span className="font-bold text-slate-900">R$ {shippingCostBRL.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Encargos e Taxas Est.</span>
                <span>R$ {estimatedTaxBRL.toFixed(2)}</span>
              </div>
            </div>

            {/* Preço de Grande E-commerce Chave na Mão */}
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Custo Total Chave na Mão</span>
              <span className="text-3xl font-black text-rose-600 block mt-0.5">R$ {totalCostBRL.toFixed(2)}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Sem surpresas ou cobranças extras na entrega</span>
            </div>

            {/* ⚠️ AVISO LEGAL SOBRE AS TAXAS ATUAIS DO BRASIL */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-900 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Informativo de Importação (Regras 2026):</span>
                Os valores simulados já contemplam a estimativa dos tributos de importação vigentes no Brasil de acordo com as diretrizes de alfândega e comércio eletrônico internacional. Nós cuidamos do desembaraço para que seu pacote chegue direto na sua casa de forma legalizada.
              </div>
            </div>

            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3.5 rounded-xl transition-all uppercase tracking-wider shadow-sm">
              Prosseguir com a Caixa ➔
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
