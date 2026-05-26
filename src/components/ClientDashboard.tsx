import React, { useState, useMemo } from "react";
import { YEN_TO_BRL_RATE } from "../data";
import { 
  User, 
  Wallet, 
  ShoppingBag, 
  Users, 
  Layers, 
  Package, 
  Box, 
  Truck, 
  HelpCircle, 
  Award, 
  Copy, 
  LogOut, 
  Scale,
  ShieldAlert,
  Calculator
} from "lucide-react";

interface ClientDashboardProps {
  user: any;
  orders: any[];
  loadingOrders: boolean;
  onCreateMockOrder: () => void;
  onLogout: () => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

type TabOptions = 
  | "conta" 
  | "carteira" 
  | "loja" 
  | "grupos" 
  | "servicos" 
  | "suite" 
  | "caixas" 
  | "envios" 
  | "simulador" 
  | "faq" 
  | "afiliados";

export default function ClientDashboard({ 
  user, 
  orders, 
  loadingOrders, 
  onCreateMockOrder, 
  onLogout, 
  getStatusBadge 
}: ClientDashboardProps) {
  
  const [activeSubTab, setActiveSubTab] = useState<TabOptions>("simulador");

  // Estados locais do Simulador de Frete Interno
  const [simulatedWeight, setSimulatedWeight] = useState<number>(0.5);
  const [simulatedMethod, setSimulatedMethod] = useState<"ems" | "air">("ems");

  // Motor de cálculo do simulador da área do cliente
  const simulationResults = useMemo(() => {
    // Tarifação base: EMS (95 BRL) ou Air Mail (60 BRL) para o primeiro 0.5kg
    const baseRate = simulatedMethod === "ems" ? 95 : 60;
    
    // Adicional por peso: R$ 30 a cada 500g adicionais
    const additionalWeightMultiplier = Math.max(0, (simulatedWeight - 0.5) / 0.5);
    const calculatedShipping = baseRate + (additionalWeightMultiplier * 30);
    
    // Taxa de manuseio/assessoria fixa do galpão convertida operacionalmente
    const warehouseServiceFee = 35; 
    
    // Encargos estimativos de importação e aduana (20%)
    const subtotal = calculatedShipping + warehouseServiceFee;
    const calculatedTax = Math.round(subtotal * 0.20);
    
    const finalTotal = subtotal + calculatedTax;

    return {
      shipping: calculatedShipping,
      serviceFee: warehouseServiceFee,
      tax: calculatedTax,
      total: finalTotal
    };
  }, [simulatedWeight, simulatedMethod]);

  const copiarParaTransferencia = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado com sucesso!");
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left">
      
      {/* MENU LATERAL - SINCRONIZADO COM image_434cb1.png */}
      <div className="md:col-span-4 lg:col-span-3 space-y-4">
        
        {/* BANNER DA SUÍTE */}
        <div className="bg-red-600 text-white rounded-3xl p-6 text-center shadow-md relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="flex justify-center mb-2">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm">
              <Box className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider">Suíte 7047</h2>
          <p className="text-xs text-red-100 font-mono mt-0.5 font-bold">{user?.displayName || user?.email || "GUSTAVOJAX2018"}</p>
        </div>

        {/* LISTA DE BOTÕES DO MENU */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200/60 shadow-sm space-y-0.5 font-medium">
          <button 
            onClick={() => setActiveSubTab("conta")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === "conta" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <User className="w-4 h-4 opacity-70" /> Minha Conta
          </button>

          <button 
            onClick={() => setActiveSubTab("carteira")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === "carteira" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Wallet className="w-4 h-4 opacity-70" /> Minha Carteira
            <span className="ml-auto bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-md border border-rose-100">JP¥ 0,00</span>
          </button>

          <button 
            onClick={() => setActiveSubTab("loja")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === "loja" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <ShoppingBag className="w-4 h-4 opacity-70" /> Loja
          </button>

          <button 
            onClick={() => setActiveSubTab("grupos")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === "grupos" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Users className="w-4 h-4 opacity-70" /> Grupo de Compras
          </button>

          <button 
            onClick={() => setActiveSubTab("servicos")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === "servicos" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Layers className="w-4 h-4 opacity-70" /> Serviços Contratados
          </button>

          <button 
            onClick={() => setActiveSubTab("suite")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === "suite" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Box className="w-4 h-4 opacity-70" /> Minha Suíte
          </button>

          <button 
            onClick={() => setActiveSubTab("caixas")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === "caixas" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Package className="w-4 h-4 opacity-70" /> Caixas Recebidas
          </button>

          <button 
            onClick={() => setActiveSubTab("envios")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === "envios" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Truck className="w-4 h-4 opacity-70" /> Envios
          </button>

          <button 
            onClick={() => setActiveSubTab("simulador")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === "simulador" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Calculator className="w-4 h-4 opacity-70" /> Simulador de Frete
          </button>

          <button 
            onClick={() => setActiveSubTab("faq")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === "faq" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <HelpCircle className="w-4 h-4 opacity-70" /> FAQ
          </button>

          <button 
            onClick={() => setActiveSubTab("afiliados")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === "afiliados" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Award className="w-4 h-4 opacity-70" /> Afiliados
          </button>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer border-t border-slate-100 mt-2"
          >
            <LogOut className="w-4 h-4" /> Sair do Painel
          </button>
        </div>
      </div>

      {/* PAINEL DINÂMICO CENTRAL */}
      <div className="md:col-span-8 lg:col-span-9 bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm min-h-[520px]">
        
        {/* 🛠️ MODULO SIMULADOR INTEGRADO NA SUÍTE DO CLIENTE */}
        {activeSubTab === "simulador" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Calculator className="w-5 h-5 text-red-600" /> Simular Custo de Envio (Mie ➔ Brasil)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Insira o peso estimado do seu volume para prever os custos unificados e planejar sua consolidação.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Controles do Simulador */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Slider de Peso */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5" /> Peso Estimado da Caixa
                    </label>
                    <div className="bg-slate-100 px-3 py-1 rounded-xl text-xs font-black font-mono text-slate-900">
                      {simulatedWeight.toFixed(1)} kg
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="30" 
                    step="0.5" 
                    value={simulatedWeight}
                    onChange={(e) => setSimulatedWeight(parseFloat(e.target.value))}
                    className="w-full accent-slate-900 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer border"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 font-mono">
                    <span>MÍN: 0.5 kg</span>
                    <span>MÁX: 30.0 kg</span>
                  </div>
                </div>

                {/* Métodos de Envio */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Modalidade de Frete Internacional
                  </label>
                  
                  <div className="space-y-2">
                    <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${simulatedMethod === "ems" ? "border-slate-900 bg-slate-50 shadow-sm" : "border-slate-200"}`}>
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="radio" 
                          name="dash-sim-shipping" 
                          checked={simulatedMethod === "ems"} 
                          onChange={() => setSimulatedMethod("ems")} 
                          className="accent-slate-900" 
                        />
                        <div>
                          <p className="text-xs font-black text-slate-900">Japan Post EMS (Expresso)</p>
                          <p className="text-[10px] text-slate-400">7 a 15 dias • Rastreio prioritário ponta a ponta</p>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${simulatedMethod === "air" ? "border-slate-900 bg-slate-50 shadow-sm" : "border-slate-200"}`}>
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="radio" 
                          name="dash-sim-shipping" 
                          checked={simulatedMethod === "air"} 
                          onChange={() => setSimulatedMethod("air")} 
                          className="accent-slate-900" 
                        />
                        <div>
                          <p className="text-xs font-black text-slate-900">Air Mail (Econômico Aéreo)</p>
                          <p className="text-[10px] text-slate-400">15 a 25 dias • Rastreio padrão internacional</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Box de Resumo e Preços */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="space-y-2 text-xs font-medium text-slate-600 border-b pb-4">
                  <div className="flex justify-between">
                    <span>Frete da Caixa ({simulatedMethod.toUpperCase()}):</span>
                    <span className="font-bold text-slate-900">R$ {simulationResults.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de Despacho Galpão:</span>
                    <span className="font-bold text-slate-900">R$ {simulationResults.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Encargos & Taxas Est.:</span>
                    <span>R$ {simulationResults.tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-center p-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Custo Total Chave na Mão</span>
                  <p className="text-2xl font-black text-red-600 mt-0.5">R$ {simulationResults.total.toFixed(2)}</p>
                  <span className="text-[9px] font-semibold text-slate-400 block mt-1">Sem surpresas ou cobranças extras na entrega</span>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-start gap-2 text-[10px] text-amber-900 leading-relaxed">
                  <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Informativo de Importação (Regras 2026):</span>
                    Os valores simulados contemplam as projeções de tributos alfandegários consolidados para o Brasil. Cuidamos do desembaraço para assegurar trânsito limpo até sua casa.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "suite" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">🇯🇵 Seu Endereço Exclusivo de Entrega no Japão</h3>
              <p className="text-xs text-slate-500 mt-0.5">Utilize estes dados exatamente como descritos abaixo para enviar suas compras de qualquer e-commerce japonês.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-5 border font-mono text-xs text-slate-700 space-y-3 relative">
              <button 
                onClick={() => copiarParaTransferencia("〒513-0836 Mie-ken, Suzuka-shi, Manafuka 123-4 - JPB Suíte 7047")}
                className="absolute right-4 top-4 p-2 bg-white border rounded-xl shadow-sm text-slate-400 hover:text-slate-900 transition-colors"
                title="Copiar Endereço Completo"
              >
                <Copy className="w-4 h-4" />
              </button>
              <p><strong>Postal Code (郵便番号):</strong> 513-0836</p>
              <p><strong>Prefecture (都道府県):</strong> Mie-ken (三重県)</p>
              <p><strong>City (市区町村):</strong> Suzuka-shi (鈴鹿市)</p>
              <p><strong>Address (町村・番地):</strong> Manafuka 123-4 (間那古 123-4)</p>
              <p className="text-red-600 font-bold"><strong>Complemento / Suíte (建物名・部屋番号):</strong> JPB Suíte 7047</p>
            </div>
          </div>
        )}

        {activeSubTab === "carteira" && (
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">💰 Controle de Saldo & Créditos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-400">Saldo Disponível</span>
                <p className="text-2xl font-black mt-1">R$ 0,00</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border flex flex-col justify-center">
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-400">Cotação Operacional</span>
                <p className="text-sm font-bold text-slate-800 mt-1">1 JP¥ = R$ {YEN_TO_BRL_RATE.toFixed(3)}</p>
              </div>
            </div>
            <button className="w-full sm:w-auto px-5 py-3 bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-red-700 transition-all cursor-pointer">
              Adicionar Saldo via PIX
            </button>
          </div>
        )}

        {activeSubTab === "caixas" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">📦 Caixas e Encomendas no Armazém</h3>
              <p className="text-xs text-slate-500 mt-0.5">Aqui aparecem as mercadorias que as lojas entregaram na sua suíte em Mie.</p>
            </div>
            <div className="text-center py-12 border border-dashed rounded-2xl text-slate-400">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-bold">Nenhum volume físico identificado no depósito no momento.</p>
            </div>
          </div>
        )}

        {activeSubTab === "envios" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">✈️ Histórico de Envios Internacionais</h3>
                <p className="text-xs text-slate-500 mt-0.5">Acompanhe suas caixas despachadas para o Brasil.</p>
              </div>
              <button 
                onClick={onCreateMockOrder}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black rounded-xl transition-all cursor-pointer"
              >
                + Simular Entrada
              </button>
            </div>

            {loadingOrders ? (
              <p className="text-xs text-slate-500 font-bold">Carregando dados da suíte...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Truck className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-bold">Nenhuma ordem de despacho internacional registrada.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-900">{order.itemsSummary}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Rastreio: <span className="text-slate-700 font-bold underline cursor-pointer">{order.trackingCode}</span></p>
                    </div>
                    <div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMPORTAMENTO SEGURO PARA ABAS EM DESENVOLVIMENTO */}
        {!["suite", "carteira", "caixas", "envios", "simulador"].includes(activeSubTab) && (
          <div className="text-center py-16 space-y-3">
            <HelpCircle className="w-12 h-12 mx-auto text-slate-300 stroke-1 animate-pulse" />
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase">Módulo em Integração Homologada</h4>
              <p className="text-xs text-slate-400 mt-0.5 max-w-sm mx-auto">A interface para a funcionalidade de {activeSubTab.toUpperCase()} está sendo acoplada ao seguro do Jap-o-Box.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
