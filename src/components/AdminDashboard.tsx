import React, { useState, useEffect, useMemo } from "react";
import { 
  ShieldAlert, Package, Truck, CheckCircle, Clock, 
  Search, Save, RefreshCw, BarChart3, User, Hash, Clipboard
} from "lucide-react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

interface Order {
  id: string;
  userId: string;
  itemsSummary: string;
  status: string;
  trackingCode?: string;
  createdAt?: { seconds: number };
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Estados para edição de rastreio inline
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [inputTracking, setInputTracking] = useState("");
  const [inputStatus, setInputStatus] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Busca TODOS os pedidos do banco de dados em tempo real
  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const ordersRef = collection(db, "orders");
    
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const allOrders: Order[] = [];
      snapshot.forEach((doc) => {
        allOrders.push({ id: doc.id, ...doc.data() } as Order);
      });

      // Ordena por data mais recente
      allOrders.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      
      setOrders(allOrders);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar dados administrativos:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Estatísticas Dinâmicas
  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending" || o.status === "aguardando").length,
      shipped: orders.filter(o => o.status === "shipped" || o.status === "enviado").length,
      delivered: orders.filter(o => o.status === "delivered" || o.status === "entregue").length,
    };
  }, [orders]);

  // Filtros de busca e status
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const matchesSearch = 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.trackingCode && o.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  // Iniciar modo de edição inline
  const startEditing = (order: Order) => {
    setEditingOrderId(order.id);
    setInputTracking(order.trackingCode || "");
    setInputStatus(order.status);
  };

  // Salvar alterações no Firebase
  const handleUpdateOrder = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const orderDocRef = doc(db, "orders", orderId);
      await updateDoc(orderDocRef, {
        status: inputStatus,
        trackingCode: inputTracking.trim().toUpperCase()
      });
      setEditingOrderId(null);
    } catch (error) {
      console.error("Erro ao atualizar o pedido:", error);
      alert("Falha ao salvar as alterações no banco de dados.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen text-left">
      
      {/* CABEÇALHO ADMIN */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-red-50 p-3 rounded-2xl border border-red-100 text-[#e60012]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Painel de Controle Central</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5 font-mono">Gestão de Armazém — Mie, Japão</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-slate-600 text-xs font-mono font-bold">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" /> Sincronizado em tempo real
        </div>
      </div>

      {/* METRICAS DE OPERAÇÃO */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-100 text-slate-700 hidden sm:block"><BarChart3 className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total de Caixas</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 hidden sm:block"><Clock className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Processando</p>
            <p className="text-2xl font-black text-amber-600 mt-0.5">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 hidden sm:block"><Truck className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Em Trânsito</p>
            <p className="text-2xl font-black text-blue-600 mt-0.5">{stats.shipped}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 hidden sm:block"><CheckCircle className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Recebidos</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{stats.delivered}</p>
          </div>
        </div>
      </div>

      {/* BARRA DE FILTROS E BUSCA */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrar por ID do pedido, ID do cliente, itens ou código de barras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 text-xs font-bold shadow-sm focus:outline-none text-slate-700"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Apenas Processando</option>
            <option value="shipped">Apenas Em Trânsito</option>
            <option value="delivered">Apenas Recebidos</option>
          </select>
        </div>
      </div>

      {/* TABELA DE PEDIDOS OPERACIONAIS */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-[#e60012] rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 font-bold mt-4">Carregando painel operacional...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium text-sm">
            Nenhuma caixa corresponde aos filtros definidos.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-wider">
                  <th className="p-4 pl-6"><Hash className="w-3.5 h-3.5 inline mr-1" /> Pedido / Cliente</th>
                  <th className="p-4"><Clipboard className="w-3.5 h-3.5 inline mr-1" /> Conteúdo Consolidado</th>
                  <th className="p-4"><Truck className="w-3.5 h-3.5 inline mr-1" /> Código de Rastreio (Japan Post)</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrders.map((order) => {
                  const isEditing = editingOrderId === order.id;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Identificadores */}
                      <td className="p-4 pl-6 space-y-1 max-w-[180px]">
                        <div className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border w-fit truncate">
                          ID: {order.id.slice(0, 8)}...
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <User className="w-3 h-3" /> {order.userId.slice(0, 12)}...
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 font-mono">
                          {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : "Sem data"}
                        </div>
                      </td>

                      {/* Itens */}
                      <td className="p-4 font-bold text-slate-800 max-w-[280px]">
                        <p className="truncate" title={order.itemsSummary}>{order.itemsSummary}</p>
                      </td>

                      {/* Rastreio e Status */}
                      <td className="p-4">
                        {isEditing ? (
                          <div className="flex flex-col sm:flex-row gap-2 max-w-[280px]">
                            <input
                              type="text"
                              value={inputTracking}
                              placeholder="Ex: NX123456789JP"
                              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                              className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 font-mono text-xs font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <select
                              value={inputStatus}
                              onChange={(e) => setInputStatus(e.target.value)}
                              className="border border-slate-300 rounded-xl px-2 py-1.5 bg-white text-xs font-bold"
                            >
                              <option value="pending">PROCESSANDO</option>
                              <option value="shipped">EM TRÂNSITO</option>
                              <option value="delivered">RECEBIDO</option>
                            </select>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {order.trackingCode ? (
                              <span className="font-mono font-black text-slate-900 bg-white border px-2 py-0.5 rounded shadow-2xs">
                                {order.trackingCode}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 italic">Aguardando Postagem</span>
                            )}
                            <div className="w-fit">
                              {order.status === "pending" && <span className="px-2 py-0.5 text-[9px] font-black rounded bg-amber-100 text-amber-800">PROCESSANDO</span>}
                              {order.status === "shipped" && <span className="px-2 py-0.5 text-[9px] font-black rounded bg-blue-100 text-blue-800">EM TRÂNSITO</span>}
                              {order.status === "delivered" && <span className="px-2 py-0.5 text-[9px] font-black rounded bg-emerald-100 text-emerald-800">RECEBIDO</span>}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Botões de Ação */}
                      <td className="p-4 text-center">
                        {isEditing ? (
                          <button
                            onClick={() => handleUpdateOrder(order.id)}
                            disabled={updatingId === order.id}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" /> {updatingId === order.id ? "Salvando..." : "Salvar"}
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditing(order)}
                            className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all mx-auto cursor-pointer shadow-2xs"
                          >
                            Despachar / Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
