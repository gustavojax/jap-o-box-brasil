import React, { useState, useMemo, useEffect } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBadges from "./components/TrustBadges";
import CostCalculator from "./components/CostCalculator";
import ProductCard from "./components/ProductCard";
import Testimonials from "./components/Testimonials";
import BlogSection from "./components/BlogSection";
import TrackingWidget from "./components/TrackingWidget";
import CartDrawer from "./components/CartDrawer";
import BudgetModal from "./components/BudgetModal";
import AuthModal from "./components/AuthModal";

import { PRODUCTS } from "./data";
import type { Product, CartItem } from "./types";

import { ArrowUpDown, CheckCircle2, ShoppingBag, User, ShieldCheck, HelpCircle, Package, Clock, Truck, CheckCircle, FlaskConical } from "lucide-react";

import { auth, db } from "./firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
// 🔥 IMPORTANTE: Adicionado 'addDoc' e 'serverTimestamp' para criar o pedido via código
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp } from "firebase/firestore";

export default function App() {

  // =========================
  // AUTH & NAVIGATION STATE
  // =========================
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"store" | "account">("store");
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({ ...u });
        setIsAuthOpen(false); 
      } else {
        setUser(null);
        setOrders([]);
        setActiveTab("store");
      }
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user?.uid || !db) return;

    setLoadingOrders(true);

    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("userId", "==", user.uid)
    );

    const unsubOrders = onSnapshot(q, (snapshot) => {
      const ordersList: any[] = [];
      snapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() });
      });
      
      // Ordenação manual no Front-end para evitar o erro de falta de Índice do Firebase!
      ordersList.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setOrders(ordersList);
      setLoadingOrders(false);
    }, (error) => {
      console.error("Erro ao buscar pedidos no Firestore:", error);
      setLoadingOrders(false);
    });

    return () => unsubOrders();
  }, [user?.uid]);

  // 🔥 FUNÇÃO DE SIMULAÇÃO RÁPIDA: Cria um pedido direto no Firestore ao clicar no botão
  const handleCreateMockOrder = async () => {
    if (!user?.uid) return;
    
    try {
      const statuses = ["pending", "shipped", "delivered"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomItems = [
        "Kit Hair Care Shiseido Fino Premium",
        "Protetor Solar Bioré Aqua Rich FPS 50",
        "Tênis Asics Gel-Quantum Original JP",
        "Loção Hidratante Hada Labo Gokujyun"
      ];
      const randomItem = randomItems[Math.floor(Math.random() * randomItems.length)];

      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        itemsSummary: randomItem,
        status: randomStatus,
        trackingCode: `NX${Math.floor(100000000 + Math.random() * 900000000)}JP`,
        createdAt: serverTimestamp()
      });

      showNotification("Pedido simulado gerado com sucesso!");
    } catch (e) {
      console.error("Erro ao simular pedido:", e);
      alert("Erro ao simular pedido. Verifique o console.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setActiveTab("store");
  };

  // =========================
  // UI STATES
  // =========================
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // =========================
  // CATEGORIES & FILTER PRODUCTS
  // =========================
  const categories = useMemo(() => {
    const list = new Set(PRODUCTS.map(p => p.category));
    return ["Todos", ...Array.from(list)];
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCategory = selectedCategory === "Todos" || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.jpName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    }).sort((a, b) => {
      const totalA = a.priceBRL + a.serviceFeeBRL + a.shippingEstBRL + a.estimatedTaxBRL;
      const totalB = b.priceBRL + b.serviceFeeBRL + b.shippingEstBRL + b.estimatedTaxBRL;
      if (sortBy === "priceAsc") return totalA - totalB;
      if (sortBy === "priceDesc") return totalB - totalA;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return b.rating - a.rating;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1, selectedUpsells: [] }];
    });
    setIsCartOpen(true);
    showNotification(`${product.name} adicionado ao carrinho`);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "aguardando":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Processando</span>;
      case "shipped":
      case "enviado":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Enviado do Japão</span>;
      case "delivered":
      case "entregue":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Entregue</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600">Recebido</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0 font-sans text-slate-900 antialiased">

      {/* TARJA DE ANÚNCIOS SUPERIOR */}
      <div className="w-full bg-slate-900 text-white text-center py-2 px-4 text-xs font-medium tracking-wide flex items-center justify-center gap-4">
        <span className="flex items-center gap-1">🇯🇵 PRODUTOS 100% ORIGINAIS DIRETO DE MIE, JAPÃO</span>
        <span className="hidden md:inline text-slate-400">|</span>
        <span className="hidden md:flex items-center gap-1">📦 RASTREAMENTO COMPLETO EM TODAS AS ENCOMENDAS</span>
      </div>

      {/* NOTIFICAÇÃO */}
      {notification && (
        <div className="fixed bottom-20 right-4 md:bottom-4 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl flex items-center gap-2 shadow-2xl">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          {notification}
        </div>
      )}

      {/* HEADER */}
      <Header
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        cartCount={cartItems.reduce((a, i) => a + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* MENU DE ABAS DISCRETO E ALINHADO À DIREITA */}
      {user && (
        <div className="max-w-7xl mx-auto w-full px-4 pt-4 flex justify-end">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex gap-1">
            <button
              onClick={() => setActiveTab("store")}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                activeTab === "store" 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Loja
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                activeTab === "account" 
                  ? "bg-emerald-600 text-white shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Minha Conta & Pedidos
            </button>
          </div>
        </div>
      )}

      {/* CONDICIONAL DE TELAS */}
      {activeTab === "store" ? (
        <>
          <Hero 
            onScrollToCatalog={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}
            onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          />
          <main className="flex-1">
            <TrustBadges />
            
            {/* PRODUTOS */}
            <section id="catalogo" className="max-w-7xl mx-auto px-4 py-10">
              <div className="flex items-center justify-between mb-8 border-b pb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Produtos Importados</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Explore os melhores itens direto do mercado japonês</p>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-xl px-3 py-2 bg-white text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="popular">Popularidade</option>
                    <option value="priceAsc">Menor preço</option>
                    <option value="priceDesc">Maior preço</option>
                    <option value="name">Nome A-Z</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
                ))}
              </div>
            </section>

            <CostCalculator onOpenBudgetModalWithData={() => {}} />
            <Testimonials />
            <BlogSection />
          </main>
        </>
      ) : (
        /* PAINEL DO CLIENTE */
        <main className="flex-1 bg-slate-50 py-10 px-4 min-h-[80vh]">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
            
            <div className="flex items-center justify-between border-b pb-6 mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Painel do Cliente</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Acessando como: <span className="font-semibold text-slate-700">{user?.email || "Cliente"}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* ⚡ BOTÃO DE SIMULAÇÃO DIRETA: Clique para injetar um pedido aleatório */}
                <button
                  onClick={handleCreateMockOrder}
                  className="bg-amber-100 border border-amber-300 text-amber-800 hover:bg-amber-200 px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all"
                >
                  <FlaskConical className="w-4 h-4" /> Simular Pedido
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl font-bold text-xs transition-colors"
                >
                  Sair da Conta
                </button>
              </div>
            </div>

            {/* SEÇÃO PRINCIPAL DE PEDIDOS */}
            <div className="mb-10">
              <h2 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-700" /> Meus Pedidos Recentes
              </h2>

              {loadingOrders ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-slate-500 font-medium">Buscando encomendas no Firestore...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 px-4">
                  <Package className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-base font-bold text-slate-800">Você ainda não possui pedidos</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">Clique no botão "Simular Pedido" ali em cima para testar na hora!</p>
                  <button 
                    onClick={() => setActiveTab("store")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-slate-800 transition-all"
                  >
                    Ir às Compras
                  </button>
                </div>
              ) : (
                /* LISTAGEM DOS CARDS DE PEDIDOS REAIS */
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-500">ID: #{order.id.slice(0, 8).toUpperCase()}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 pt-1">
                          {order.itemsSummary || "Item solicitado"}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Data: {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("pt-BR") : "Recente"}
                        </p>
                      </div>

                      {order.trackingCode && (
                        <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200/60 flex items-center justify-between md:justify-end gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Código de Rastreio</span>
                            <span className="text-xs font-mono font-black text-slate-800 block">{order.trackingCode}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* WIDGET DE BUSCA MANUAL DO RASTREIO */}
            <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                🔍 Busca Manual por Código
              </h3>
              <div className="w-full bg-white rounded-xl p-2 min-h-[250px]">
                <TrackingWidget />
              </div>
            </div>

          </div>
        </main>
      )}

      {/* RODAPÉ INSTITUCIONAL ROBUSTO */}
      <footer className="w-full bg-white border-t border-slate-200 text-slate-600 pt-12 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-black text-slate-900 text-lg mb-4">Japão Box Brasil</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              Sua ponte definitiva com o mercado japonês. Facilitamos a simulação de custos, compra e o envio de caixas e produtos direto de nosso armazém em Mie para a sua casa no Brasil de forma 100% segura e transparente.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li><button onClick={() => setActiveTab("store")} className="hover:text-slate-900 transition-colors">Ver Catálogo</button></li>
              <li><button onClick={() => { if(user) { setActiveTab("account") } else { setIsAuthOpen(true) } }} className="hover:text-slate-900 transition-colors">Rastrear Pedido</button></li>
              <li><a href="#calculator" className="hover:text-slate-900 transition-colors">Calculadora de Custos</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li className="flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-slate-400" /> <span className="hover:text-slate-900 cursor-pointer">Central de Ajuda (FAQ)</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Políticas de Envio e Prazos</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Termos de Serviço e Reembolso</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Fale Conosco</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-4">Segurança e Pagamento</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold font-mono">PIX</span>
              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold font-mono">CREDIT CARD</span>
              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold font-mono">BOLETO</span>
            </div>
            <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Ambiente seguro com criptografia de ponta a ponta.</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-slate-100 text-center text-xs text-slate-400 space-y-2">
          <p>© 2026 Japão Box Brasil. Todos os direitos reservados. Importações do Japão intermediadas de forma legal.</p>
          <p className="text-[11px] font-medium tracking-wide text-slate-500 pt-1">
            Desenvolvimento por <span className="text-slate-800 font-bold">Gustavo Jax Audiovisual</span>
          </p>
        </div>
      </footer>

      {/* BOTTOM NAVIGATION PARA MOBILE */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-40 shadow-lg">
          <button 
            onClick={() => setActiveTab("store")}
            className={`flex flex-col items-center text-xs font-bold ${activeTab === "store" ? "text-slate-950" : "text-slate-400"}`}
          >
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            Loja
          </button>
          <button 
            onClick={() => setActiveTab("account")}
            className={`flex flex-col items-center text-xs font-bold ${activeTab === "account" ? "text-emerald-600" : "text-slate-400"}`}
          >
            <User className="w-5 h-5 mb-0.5" />
            Rastreio
          </button>
        </div>
      )}

      {/* BOTÃO FLUTUANTE DO WHATSAPP */}
      <a
        href="https://wa.me/817014074971"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed right-4 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center ${
          user ? "bottom-20 md:bottom-6" : "bottom-6"
        }`}
        aria-label="Contato via WhatsApp"
      >
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66.986 3.288 1.448 4.805 1.449 5.423 0 9.834-4.394 9.837-9.8 0-2.617-1.019-5.076-2.87-6.931C16.51 2.016 14.056.995 11.5.995 6.082.995 1.671 5.39 1.668 10.79c0 1.572.463 3.102 1.34 4.509l-.989 3.61 3.725-.976zm11.267-6.398c-.287-.144-1.702-.84-1.966-.935-.264-.
