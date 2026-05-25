import React, { useState } from "react";
import { 
  LayoutDashboard, User, Wallet, ShoppingBag, Users, Headphones, 
  Package, Boxes, Send, Calculator, HelpCircle, Share2, FileText, LogOut, FlaskConical 
} from "lucide-react";

interface ClientDashboardProps {
  user: any;
  orders: any[];
  loadingOrders: boolean;
  onCreateMockOrder: () => void;
  onLogout: () => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

export default function ClientDashboard({ 
  user, orders, loadingOrders, onCreateMockOrder, onLogout, getStatusBadge 
}: ClientDashboardProps) {
  
  // Estado para controlar qual sub-aba do painel está ativa
  const [subTab, setSubTab] = useState("dashboard");

  // Gera um número de suíte fixo e único baseado nas letras do UID do usuário
  const suiteNumber = React.useMemo(() => {
    if (!user?.uid) return "0000";
    let hash = 0;
    for (let i = 0; i < user.uid.length; i++) {
      hash = user.uid.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs((hash % 9000) + 1000); // Garante um número de 4 dígitos entre 1000 e 9999
  }, [user?.uid]);

  // Itens do Menu Lateral baseados no print fornecido
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "account", label: "Minha Conta", icon: User },
    { id: "wallet", label: "Minha Carteira", icon: Wallet, badge: "JP¥ 0,00" },
    { id: "store_redirect", label: "Loja", icon: ShoppingBag },
    { id: "groups", label: "Grupo de Compras", icon: Users },
    { id: "services", label: "Serviços Contratados", icon: Headphones },
    { id: "suite", label: "Minha Suíte", icon: Package },
    { id: "boxes", label: "Caixas Recebidas", icon: Boxes },
    { id: "shipments", label: "Envios", icon: Send },
    { id: "simulator", label: "Simulador de Frete", icon: Calculator },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "affiliates", label: "Afiliados", icon: Share2 },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 grid grid-cols-1 md:grid-cols-12 min-h-[80vh]">
      
      {/* 🔴 MENU LATERAL (SIDEBAR ESTILO BOXCONTROL) */}
      <div className="md:col-span-4 bg-slate-50 border-r border-slate-200 flex flex-col justify-between">
        <div>
          {/* Cabeçalho Vermelho de Identificação */}
          <div className="bg-red-600 text-white p-6 text-center rounded-b-2xl shadow-md space-y-1 mx-2 mt-2">
            <div className="flex items-center justify-center gap-2 font-mono font-black text-lg tracking-wider">
              <Boxes className="w-5 h-5 text-red-200" />
              SUÍTE {suiteNumber}
            </div>
            <p className="text-xs font-bold text-red-100 truncate max-w-full">
              {user?.displayName || user?.email?.split("@")[0].toUpperCase() || "Cliente Japão Box"}
            </p>
          </div>

          {/* Lista de Navegação */}
          <nav className="p-4 space-y-1 max-h-[500px] overflow-y-auto">
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2">BOXCONTROL JAPÃO</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = subTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSubTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                      ? "bg-slate-900 text-white shadow-sm" 
                      : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-red-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono font-black bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé Fixo do Menu Lateral */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <button 
            onClick={() => setSubTab("terms")}
            className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4 text-red-200" />
            Termos de Uso
          </button>
          <button 
            onClick={onLogout}
            className="w-full bg-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair do Painel
          </button>
        </div>
      </div>

      {/* 🖥️ ÁREA DE CONTEÚDO CENTRAL DINÂMICO */}
      <div className="md:col-span-8 p-6 md:p-8 bg-white">
        
        {/* Renderiza a view dependendo da sub-aba selecionada */}
        {subTab === "dashboard" && (
          <div className="space-y-6">
            {/* Bloco de Teste Rápido */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-amber-600" /> Simulação de Encomendas Ativa
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">Injete um pacote simulado vindo do armazém de Mie para testar.</p>
              </div>
              <button
                onClick={onCreateMockOrder}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-md transition-all text-center"
              >
                ⚡ SIMULAR NOVO PACOTE
              </button>
            </div>

            {/* Listagem de Pedidos */}
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                📦 Minhas Caixas e Compras Recentes
              </h3>

              {loadingOrders ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-slate-500 font-medium">Buscando informações do servidor japonês...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 px-4">
                  <Package className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">Nenhuma caixa registrada na sua suíte</p>
                  <p className="text-xs text-slate-500 mt-0.5">Seus pacotes consolidados ou compras assistidas aparecerão aqui.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-slate-100 bg-slate-50/70 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-slate-200 transition-colors">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-slate-500">REF: #{order.id.slice(0,8).toUpperCase()}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 pt-0.5">{order.itemsSummary}</h4>
                        <p className="text-[11px] text-slate-400">Origem: Armazém Mie, Japão</p>
                      </div>
                      {order.trackingCode && (
                        <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-right">
                          <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">CÓDIGO DE ENVIO</span>
                          <span className="text-xs font-mono font-black text-slate-800">{order.trackingCode}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {subTab === "wallet" && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900">🪙 Minha Carteira Japonesa</h3>
            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl shadow-lg border border-slate-800 space-y-4">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Saldo Disponível</p>
                <p className="text-4xl font-black font-mono mt-1 text-emerald-400">JP¥ 0,00</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adicione créditos em Ienes via Pix para realizar compras assistidas instantâneas em sites como Mercari JP, Yahoo Auctions e Rakuten sem depender da flutuação cambial no momento da compra.
              </p>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all">
                + Adicionar Fundos via PIX
              </button>
            </div>
          </div>
        )}

        {/* Telas Fallback para as outras abas do print */}
        {subTab !== "dashboard" && subTab !== "wallet" && (
          <div className="text-center py-16 space-y-2">
            <Boxes className="w-10 h-10 text-slate-300 mx-auto animate-bounce" />
            <h4 className="font-bold text-slate-800 text-base">Seção em Integração</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Esta aba do sistema BoxControl está sendo mapeada com o banco de dados e estará totalmente funcional em breve.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

