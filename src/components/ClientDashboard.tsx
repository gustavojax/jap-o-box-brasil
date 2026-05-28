import React, { useState } from "react";
import { Package, MapPin, LogOut, Copy, CheckCircle2, Clock, Truck, PlusCircle } from "lucide-react";

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
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    const addressText = `〒510-8021 三重県四日市市松寺二丁目3-15 The Tomorrow`;
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* CABEÇALHO DO PAINEL */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Olá, {user?.displayName || "Cliente"}! 👋
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Bem-vindo à sua suíte de importação Japão Box Brasil.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-colors w-fit"
        >
          <LogOut className="w-4 h-4" /> Sair da conta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* COLUNA ESQUERDA: ENDEREÇO DA SUÍTE */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <MapPin className="w-24 h-24 text-white" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Seu Endereço no Japão
              </h2>

              <div className="space-y-4">
                {/* Formato Japonês (Mais usado) */}
                <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Formato Japonês (Lojas Locais)</p>
                  <p className="text-sm text-white font-medium leading-relaxed font-mono">
                    〒510-8021<br />
                    三重県四日市市松寺二丁目3-15<br />
                    The Tomorrow
                  </p>
                  <button 
                    onClick={handleCopyAddress}
                    className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Endereço Copiado!" : "Copiar Endereço"}
                  </button>
                </div>

                {/* Formato Internacional/Romaji */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Formato Internacional (Romaji)</p>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    <strong>The Tomorrow</strong><br />
                    2-chōme-3-15 Matsutera<br />
                    Yokkaichi, Mie 510-8021<br />
                    Japan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: PEDIDOS E CAIXAS */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm min-h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <Package className="w-5 h-5 text-rose-600" /> Minhas Caixas e Encomendas
              </h2>
              <button 
                onClick={onCreateMockOrder}
                className="text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Simular Pedido
              </button>
            </div>

            {loadingOrders ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-rose-600 rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 font-bold mt-4">Carregando sua suíte...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-600">Nenhuma encomenda ainda.</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Compre em sites japoneses usando seu endereço ao lado e os itens aparecerão aqui.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border border-slate-100 bg-slate-50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200 uppercase tracking-widest">
                          ID: {order.id.slice(0, 8)}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-2">{order.itemsSummary}</p>
                      {order.trackingCode && (
                        <p className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-1">
                          <Truck className="w-3 h-3" /> {order.trackingCode}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400">Data de Entrada</p>
                      <p className="text-xs font-bold text-slate-700">
                        {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : "Processando..."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
