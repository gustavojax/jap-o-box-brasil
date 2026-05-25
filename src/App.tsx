import React, { useState, useMemo, useEffect } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBadges from "./components/TrustBadges";
import CostCalculator from "./components/CostCalculator";
import ProductCard from "./components/ProductCard";
import Testimonials from "./components/Testimonials";
import BlogSection from "./components/BlogSection";
import CartDrawer from "./components/CartDrawer";
import BudgetModal from "./components/BudgetModal";
import AuthModal from "./components/AuthModal";

import ClientDashboard from "./components/ClientDashboard";

import { PRODUCTS } from "./data";
import type { Product, CartItem } from "./types";

import { ArrowUpDown, CheckCircle2, ShoppingBag, User, ShieldCheck, HelpCircle, Clock, Truck, CheckCircle, Heart } from "lucide-react";

import { auth, db } from "./firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

export default function App() {

  // =========================
  // AUTH & NAVIGATION STATE
  // =========================
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"store" | "account" | "about">("store");
  
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
        if (activeTab === "account") setActiveTab("store");
      }
    });
    return () => unsubAuth();
  }, [activeTab]);

  useEffect(() => {
    if (!user?.uid || !db) {
      setLoadingOrders(false);
      return;
    }

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

      showNotification("Pedido de teste injetado na suíte!");
    } catch (e) {
      console.error("Erro ao simular pedido:", e);
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
        return <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-amber-100 text-amber-800 flex items-center gap-1"><Clock className="w-3 h-3" /> PROCESSANDO</span>;
      case "shipped":
      case "enviado":
        return <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-blue-100 text-blue-800 flex items-center gap-1"><Truck className="w-3 h-3" /> EM TRÂNSITO</span>;
      case "delivered":
      case "entregue":
        return <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> RECEBIDO</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-slate-100 text-slate-700">CONCLUÍDO</span>;
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

      {/* MENU DE ABAS SUPERIOR */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-4 flex justify-end">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex gap-1">
          <button
            onClick={() => setActiveTab("store")}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
              activeTab === "store" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Loja
          </button>
          
          <button
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
              activeTab === "about" ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Sobre Nós
          </button>

          <button
            onClick={() => {
              if (user) {
                setActiveTab("account");
              } else {
                setIsAuthOpen(true);
              }
            }}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
              activeTab === "account" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Minha Suíte & Painel 📦
          </button>
        </div>
      </div>

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

            <CostCalculator />
            <Testimonials />
            <BlogSection />
          </main>
        </>
      ) : activeTab === "about" ? (
        /* PÁGINA SOBRE NÓS */
        <main className="flex-1 bg-slate-50 py-12 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-5 bg-slate-950 relative min-h-[350px] md:min-h-full flex items-center justify-center">
              <img 
                src="https://i.ibb.co/RpRMDSMd/file-0000000060ec720e8b0c4f2d1dcdbb5f.png" 
                alt="Paula Takashiro" 
                className="w-full h-full object-cover absolute inset-0 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center space-y-6">
              <div>
                <span className="text-xs font-black text-rose-600 uppercase tracking-widest block mb-2">Nossa História</span>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">✨ Bem-vindos à Japão Box Brasil ✨</h1>
              </div>
              <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed font-medium">
                <p>Iniciamos nossa empresa com um sonho: levar até o Brasil os melhores produtos nacionais e importados, trazendo qualidade, beleza, tecnologia e novidades que conquistam o mundo inteiro. 🇯🇵🇰🇷</p>
                <p>Selecionamos cada produto com carinho para oferecer itens originais, tendências de skincare, cosméticos, cuidados pessoais e muito mais, diretamente do Japão e da Coreia para você.</p>
                <p>A Japão Box Brasil nasceu para aproximar culturas e entregar experiências únicas, com confiança, dedicação e amor em cada envio.</p>
                <p className="font-semibold text-slate-800">Obrigada por fazer parte do começo dessa história com a gente!</p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Atenciosamente,</p>
                  <p className="text-lg font-black text-slate-900 tracking-wide mt-0.5">Paula Takashiro</p>
                </div>
                <Heart className="w-8 h-8 text-rose-500 fill-rose-100 stroke-1" />
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* PAINEL DO CLIENTE */
        <main className="flex-1 bg-slate-50 py-8 px-4 min-h-[85vh]">
          {user ? (
            <ClientDashboard 
              user={user}
              orders={orders}
              loadingOrders={loadingOrders}
              onCreateMockOrder={handleCreateMockOrder}
              onLogout={handleLogout}
              getStatusBadge={getStatusBadge}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-slate-500">Por favor, realize o login para acessar sua suíte.</p>
            </div>
          )}
        </main>
      )}

      {/* RODAPÉ INSTITUCIONAL */}
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
              <li><button onClick={() => setActiveTab("about")} className="hover:text-slate-900 transition-colors">Sobre Nós</button></li>
              <li><button onClick={() => { if(user) { setActiveTab("account") } else { setIsAuthOpen(true) } }} className="hover:text-slate-900 transition-colors">Rastrear Pedido</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li className="flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-slate-400" /> <span className="hover:text-slate-900 cursor-pointer">Central de Ajuda (FAQ)</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Políticas de Envio e Prazos</span></li>
              <li><span className="hover:text-slate-900 cursor-pointer">Termos de Serviço e Reembolso</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-4">Segurança e Pagamento</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold font-mono">PIX</span>
              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold font-mono">CREDIT CARD</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-slate-100 text-center text-xs text-slate-400 space-y-2">
          <p>© 2026 Japão Box Brasil. Todos os direitos reservados.</p>
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
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66.986 3.288 1.448 4.805 1.449 5.423 0 9.834-4.394 9.837-9.8 0-2.617-1.019-5.076-2.87-6.931C16.51 2.016 14.056.995 11.5.995 6.082.995 1.671 5.39 1.668 10.79c0 1.572.463 3.102 1.34 4.509l-.989 3.61 3.725-.976zm11.267-6.398c-.287-.144-1.702-.84-1.966-.935-.264-.096-.456-.144-.648.144-.192.288-.744.936-.912 1.129-.168.192-.336.216-.624.072-2.926-1.46-3.83-2.422-4.571-3.69-.192-.336-.024-.517.144-.684.152-.15.336-.39.504-.585.168-.192.224-.312.336-.52.112-.216.056-.402-.024-.546-.08-.144-.648-1.56-.888-2.136-.234-.564-.473-.488-.648-.497-.168-.008-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.399 0 1.416 1.032 2.784 1.176 2.976.144.192 2.032 3.102 4.921 4.348.687.296 1.224.473 1.643.606.69.219 1.32.188 1.817.114.553-.083 1.702-.696 1.944-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.192-.552-.336z" />
        </svg>
      </a>

      {/* MODAIS GLOBAIS DE INTERAÇÃO */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
      {isCartOpen && (
        <CartDrawer 
          onClose={() => setIsCartOpen(false)} 
          cartItems={cartItems} 
          setCartItems={setCartItems} 
        />
      )}
      
      <BudgetModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} onSubmit={() => {}} />

    </div>
  );
}
