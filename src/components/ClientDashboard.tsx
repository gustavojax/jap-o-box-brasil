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
  Calculator,
  Gift,
  CheckCircle,
  TrendingUp
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
  
  const [activeSubTab, setActiveSubTab] = useState<TabOptions>("afiliados");

  // Estados do Simulador
  const [simulatedWeight, setSimulatedWeight] = useState<number>(0.5);
  const [simulatedMethod, setSimulatedMethod] = useState<"ems" | "air">("ems");

  // Dados Mockados de Afiliados
  const suiteId = "7047";
  const linkAfiliado = `https://japobox.com.br/?ref=suite${suiteId}`;
  const cupomAfiliado = `JAPO10-SUITE${suiteId}`;

  // Motor de cálculo do simulador
  const simulationResults = useMemo(() => {
    const baseRate = simulatedMethod === "ems" ? 95 : 60;
    const additionalWeightMultiplier = Math.max(0, (simulatedWeight - 0.5) / 0.5);
    const calculatedShipping = baseRate + (additionalWeightMultiplier * 30);
    const warehouseServiceFee = 35; 
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

  const copiarParaTransferencia = (text: string, mensagem: string = "Copiado com sucesso!") => {
    navigator.clipboard.writeText(text);
    alert(mensagem);
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left">
      
      {/* MENU LATERAL */}
      <div className="md:col-span-4 lg:col-span-3 space-y-4">
        
        {/* BANNER DA SUÍTE */}
        <div className="bg-red-600 text-white rounded-3xl p-6 text-center shadow-md relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="flex justify-center mb-2">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm">
              <Box className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider">Suíte {suiteId}</h2>
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
        
        {/* 🏆 MÓDULO DE AFILIADOS COM SISTEMA DE DESCONTO DE 10% */}
        {activeSubTab === "afiliados" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-red-600" /> Programa de Indicações Jap-o-Box
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Partilhe o seu link exclusivo. Quem se registar através dele ganha automaticamente <strong>10% de desconto</strong> no primeiro envio!</p>
            </div>

            {/* Cards de Métricas Rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Cliques no Link</span>
                <p className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" /> 24
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">Amigos Registados</span>
                <p className="text-xl font-black text-slate-900 mt-1">3</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl bg-gradient-to-br from-red-50 to-white border-red-100">
                <span className="text-[10px] font-black tracking-wider uppercase text-red-500 block">Descontos Gerados</span>
                <p className="text-xl font-black text-red-600 mt-1">10% OFF</p>
              </div>
            </div>

            {/* Caixa de Ferramentas de Partilha */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-red-600" /> Suas Ferramentas de Divulgação
              </h4>
              
              {/* Opção 1: Link de Afiliado */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 block">Seu Link de Convite (Garante 10% de Desconto ao Convidado):</label>
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <input 
                    type="text" 
                    readOnly 
                    value={linkAfiliado} 
                    className="flex-1 px-3 py-2 text-xs font-mono text-slate-600 bg-slate-50/50 outline-none select-all"
                  />
                  <button 
                    onClick={() => copiarParaTransferencia(linkAfiliado, "Link de afiliado copiado!")}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[11px] px-4 uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copiar
                  </button>
                </div>
              </div>

              {/* Opção 2: Código do Cupão */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-bold text-slate-600 block">Ou use o seu Código de Cupão direto no Checkout:</label>
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm max-w-md">
                  <input 
                    type="text" 
                    readOnly 
                    value={cupomAfiliado} 
                    className="flex-1 px-3 py-2 text-xs font-black font-mono text-red-600 bg-white outline-none tracking-wide text-center"
                  />
                  <button 
                    onClick={() => copiarParaTransferencia(cupomAfiliado, "Código do cupão copiado!")}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] px-4 transition-colors flex items-center gap-1 cursor-pointer border-l"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copiar Cupão
                  </button>
                </div>
              </div>
            </div>

            {/* Regras Simples de Funcionamento */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 text-xs text-slate-700">
              <span className="font-black text-[10px] uppercase text-slate-400 tracking-wider block">Como funciona o benefício?</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-medium">
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p><strong>Para o indicado:</strong> Assim que ele aceder pelo seu link ou aplicar o seu cupão no checkout, recebe 10% de desconto imediato sobre o valor do frete internacional.</p>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p><strong>Para si:</strong> Ganha relevância e acumula pontos na plataforma para resgatar em serviços adicionais no galpão (fotos extras, seguro ou caixa reforçada).</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🧮 MÓDULO SIMULADOR */}
        {activeSubTab === "simulador" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Calculator className="w-5 h-5 text-red-600" /> Simular Custo de Envio (Mie ➔ Brasil)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Insira o peso estimado do seu volume para prever os custos unificados e planejar sua consolidação.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-5">
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
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Modalidade de Frete Internacional
                  </label>
                  <div className="space-y-2">
                    <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${simulatedMethod === "ems" ? "border-slate-900 bg-slate-50 shadow-sm" : "border-slate-200"}`}>
                      <div className="flex items-center gap-2.5">
                        <input type="radio" checked={simulatedMethod === "ems"} onChange={() => setSimulatedMethod("ems")} className="accent-slate-900" />
                        <div>
                          <p className="text-xs font-black text-slate-900">Japan Post EMS (Expresso)</p>
                          <p className="text-[10px] text-slate-400">7 a 15 dias • Rastreio prioritário ponta a ponta</p>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${simulatedMethod === "air" ? "border-slate-900 bg-slate-50 shadow-sm" : "border-slate-200"}`}>
                      <div className="flex items-center gap-2.5">
                        <input type="radio" checked={simulatedMethod === "air"} onChange={() => setSimulatedMethod("air")} className="accent-slate-900" />
                        <div>
                          <p className="text-xs font-black text-slate-900">Air Mail (Econômico Aéreo)</p>
                          <p className="text-[10px] text-slate-400">15 a 25 dias • Rastreio padrão internacional</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

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
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OUTRAS ABAS MANUTIDAS PARA PRESERVAR INTEGRIDADE */}
        {activeSubTab === "suite" && (
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">🇯🇵 Seu Endereço Exclusivo</h3>
            <div className="bg-slate-50 rounded-2xl p-5 border font-mono text-xs text-slate-700">
              <p><strong>Postal Code:</strong> 513-0836</p>
              <p><strong>Address:</strong> Mie-ken, Suzuka-shi, Manafuka 123-4 - JPB Suíte {suiteId}</p>
            </div>
          </div>
        )}

        {activeSubTab === "carteira" && (
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">💰 Controle de Saldo</h3>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5">
              <p className="text-2xl font-black">R$ 0,00</p>
            </div>
          </div>
        )}

        {activeSubTab === "caixas" && (
          <div className="space-y-6 text-center py-12 text-slate-400">
            <p className="text-xs font-bold">Nenhum volume no depósito no momento.</p>
          </div>
        )}

        {activeSubTab === "envios" && (
          <div className="space-y-6 text-center py-12 text-slate-400">
            <p className="text-xs font-bold">Nenhuma ordem de despacho internacional registrada.</p>
          </div>
        )}

        {!["suite", "carteira", "caixas", "envios", "simulador", "afiliados"].includes(activeSubTab) && (
          <div className="text-center py-16 space-y-3">
            <HelpCircle className="w-12 h-12 mx-auto text-slate-300 stroke-1 animate-pulse" />
            <h4 className="text-sm font-black text-slate-800 uppercase">Módulo em Integração Homologada</h4>
          </div>
        )}

      </div>
    </div>
  );
}
