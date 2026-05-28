import React, { useState } from "react";
import { 
  Package, MapPin, LogOut, Copy, CheckCircle2, Truck, 
  PlusCircle, Award, Gift, Check, Search, ChevronRight, Clock
} from "lucide-react";

interface ClientDashboardProps {
  user: any;
  orders: any[];
  loadingOrders: boolean;
  onCreateMockOrder: () => void;
  onLogout: () => void;
  getStatusBadge: (status: string) => JSX.Element;
}

export default function ClientDashboard({
  user,
  orders,
  loadingOrders,
  onCreateMockOrder,
  onLogout,
  getStatusBadge
}: ClientDashboardProps) {
  // Controle do Menu Lateral
  const [activeMenu, setActiveMenu] = useState<"address" | "orders" | "tracking" | "referral">("address");

  // Controle de Cópias
  const [copied, setCopied] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);

  // Controle do Rastreio
  const [trackingInput, setTrackingInput] = useState("");
  const [isTracking, setIsTracking] = useState(false);

  const couponCode = "JAPO10-SUITE7047";

  const handleCopyAddress = () => {
    const addressText = `〒510-8021 三重県四日市市松寺二丁目3-15 The Tomorrow`;
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2000);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim() !== "") {
      setIsTracking(true);
    }
  };

  const MENU_ITEMS = [
    { id: "address", label: "Endereço no Japão", icon: MapPin },
    { id: "orders", label: "Minhas Encomendas", icon: Package },
    { id: "tracking", label: "Rastreamento", icon: Search },
    { id: "referral", label: "Indique e Ganhe", icon: Award },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* CABEÇALHO DO PAINEL */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Olá, {user?.displayName || "Cliente"}! 👋
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Sua suíte de importação Japão Box Brasil está pronta para uso.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-colors w-fit"
        >
          <LogOut className="w-4 h-4" /> Sair da conta
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* ==========================================
            PAINEL LATERAL ESQUERDO (SIDEBAR)
        ========================================== */}
        <aside className="w-full md:w-72 flex-shrink-0 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap md:whitespace-normal text-left ${
                  isActive 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-rose-400" : "text-slate-400"}`} />
                <span className="flex-1">{item.label}</span>
                <ChevronRight className={`w-4 h-4 hidden md:block ${isActive ? "opacity-100" : "opacity-0"}`} />
              </button>
            );
          })}
        </aside>

        {/* ==========================================
            SESSÃO PRINCIPAL DIREITA (CONTEÚDO DINÂMICO)
        ========================================== */}
        <main className="flex-1 w-full bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm min-h-[500px]">
          
          {/* ABA 1: ENDEREÇO NO JAPÃO */}
          {activeMenu === "address" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <MapPin className="w-6 h-6 text-rose-600" />
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Seu Endereço no Japão</h2>
              </div>
              
              <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <MapPin className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10 space-y-4">
                  {/* Formato Japonês */}
                  <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Formato Japonês (Copie para lojas locais)</p>
                    <p className="text-sm md:text-base text-white font-medium leading-relaxed font-mono">
                      〒510-8021<br />
                      三重県四日市市松寺二丁目3-15<br />
                      The Tomorrow
                    </p>
                    <button 
                      onClick={handleCopyAddress}
                      className="mt-4 flex items-center justify-center w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors gap-2"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Endereço Copiado!" : "Copiar Endereço Japonês"}
                    </button>
                  </div>

                  {/* Formato Internacional */}
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Formato Internacional (Romaji)</p>
                    <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
                      <strong>The Tomorrow</strong><br />
                      2-chōme-3-15 Matsutera<br />
                      Yokkaichi, Mie 510-8021<br />
                      Japan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: MINHAS ENCOMENDAS */}
          {activeMenu === "orders" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-rose-600" />
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Caixas e Encomendas</h2>
                </div>
                <button 
                  onClick={onCreateMockOrder}
                  className="text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors w-fit"
                >
                  <PlusCircle className="w-4 h-4" /> Simular Pedido de Teste
                </button>
              </div>

              {loadingOrders ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-10 h-10 border-4 border-slate-100 border-t-rose-600 rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-400 font-bold mt-4 tracking-widest uppercase">Carregando suíte...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-base font-bold text-slate-700">Sua suíte está vazia.</p>
                  <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                    Faça compras em sites japoneses utilizando seu endereço exclusivo. Quando as caixas chegarem ao armazém, elas aparecerão aqui.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-widest font-mono">
                            ID: {order.id.slice(0, 8)}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm font-black text-slate-900">{order.itemsSummary}</p>
                        {order.trackingCode && (
                          <p className="text-xs text-slate-500 font-mono mt-1.5 flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5" /> Código: {order.trackingCode}
                          </p>
                        )}
                      </div>
                      <div className="text-left md:text-right bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Data de Entrada</p>
                        <p className="text-sm font-bold text-slate-700 mt-0.5">
                          {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : "Processando..."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABA 3: RASTREAMENTO */}
          {activeMenu === "tracking" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <Search className="w-6 h-6 text-rose-600" />
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Rastreamento Global</h2>
              </div>
              
              <div className="max-w-xl">
                <p className="text-sm text-slate-600 font-medium mb-4">
                  Acompanhe sua encomenda saindo do nosso armazém em Mie até a porta da sua casa no Brasil.
                </p>
                <form onSubmit={handleTrack} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu código (Ex: NX...JP)"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 uppercase transition-all"
                  />
                  <button 
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 rounded-xl font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" /> Buscar
                  </button>
                </form>
              </div>

              {isTracking && trackingInput && (
                <div className="mt-8 bg-slate-50 rounded-3xl p-6 border border-slate-200 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Código de Rastreio</p>
                      <p className="text-lg font-mono font-black text-slate-900">{trackingInput}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 font-black px-3 py-1 rounded-lg text-xs uppercase tracking-wider">
                      Em Trânsito
                    </span>
                  </div>

                  {/* Linha do Tempo Simulada */}
                  <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                    <div className="relative pl-6">
                      <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 border-4 border-slate-50"></div>
                      <p className="text-sm font-black text-slate-900">Encaminhado para fiscalização aduaneira</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Curitiba, PR / BR</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Hoje, 08:30</p>
                    </div>
                    <div className="relative pl-6 opacity-60">
                      <div className="absolute w-4 h-4 bg-slate-300 rounded-full -left-[9px] top-1 border-4 border-slate-50"></div>
                      <p className="text-sm font-black text-slate-900">Recebido no Brasil</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Unidade de Tratamento Internacional</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Ontem, 14:15</p>
                    </div>
                    <div className="relative pl-6 opacity-40">
                      <div className="absolute w-4 h-4 bg-slate-300 rounded-full -left-[9px] top-1 border-4 border-slate-50"></div>
                      <p className="text-sm font-black text-slate-900">Objeto Postado</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Japão Box Brasil Armazém - Mie / JP</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Há 3 dias</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABA 4: INDIQUE E GANHE (REFERRAL) */}
          {activeMenu === "referral" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <Award className="w-6 h-6 text-rose-600" />
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Programa de Indicações</h2>
              </div>

              <p className="text-sm text-slate-600 font-medium max-w-2xl">
                Indique amigos e dê a eles <span className="font-bold text-rose-600">10% de desconto</span> no primeiro envio internacional. Quanto mais amigos indicar, mais benefícios você acumula na sua suíte!
              </p>

              <div className="bg-[#cc0022] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg shadow-rose-600/20">
                <div className="text-white space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Seu Cupom Exclusivo</p>
                  <p className="text-2xl md:text-4xl font-mono font-black tracking-wider break-all">{couponCode}</p>
                  <p className="text-xs font-medium text-white/80 pt-1">
                    Compartilhe este código para ser aplicado no checkout de seus amigos.
                  </p>
                </div>
                
                <button 
                  onClick={handleCopyCoupon}
                  className="w-full md:w-auto bg-white text-rose-600 hover:bg-slate-50 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 flex-shrink-0"
                >
                  {couponCopied ? (
                    <><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Copiado!</>
                  ) : (
                    <><Copy className="w-5 h-5" /> Copiar Cupom</>
                  )}
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mt-6">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-rose-600" /> Como funciona o benefício?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    Seu amigo insere o código <strong className="text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">{couponCode}</strong> durante o fechamento da caixa.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    Ele ganha 10% de desconto imediato sobre o valor do frete internacional vindo de Mie.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    Você ganha relevância na plataforma e acumula vantagens exclusivas de pontuação para usar no armazém.
                  </li>
                </ul>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
