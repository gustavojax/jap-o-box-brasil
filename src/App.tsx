import React, { useState, useMemo, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import RedirectBanner from "./components/RedirectBanner";
import TrustBadges from "./components/TrustBadges";
import ProductCard from "./components/ProductCard";
import Testimonials from "./components/Testimonials";
import BlogSection from "./components/BlogSection";
import CartDrawer from "./components/CartDrawer";
import BudgetModal from "./components/BudgetModal";
import AuthModal from "./components/AuthModal";
import ClubModal from "./components/ClubModal";
import WhatsAppFloat from "./components/WhatsAppFloat";

import ClientDashboard from "./components/ClientDashboard";
import AdminDashboard from "./components/AdminDashboard";
import type { Product, CartItem } from "./types";
import PRODUCTS from "./components/products";

import { CheckCircle2, Clock, Truck, MapPin, ExternalLink, Info } from "lucide-react";
// ... resto do código

import { auth, db } from "./firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

// ==========================================
// BASE DE DADOS DE PRODUTOS COMPLETA E REVISADA
// ==========================================


export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showTaxNotice, setShowTaxNotice] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "store" | "redirect" | "account" | "about" | "admin"
  >("store");

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [notification, setNotification] =
    useState<string | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);

        try {
          const adminRef = doc(db, "admins", u.uid);
          const adminSnap = await getDoc(adminRef);
          setIsAdmin(adminSnap.exists());
        } catch (error) {
          console.error("Erro ao verificar administrador:", error);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user || !db) {
      setOrders([]);
      setLoadingOrders(false);
      return;
    }

    setLoadingOrders(true);

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setOrders(data);
        setLoadingOrders(false);
      },
      (error) => {
        console.error("Erro ao buscar pedidos:", error);
        setLoadingOrders(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      setActiveTab("store");
      showNotification("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // ==========================================
  // FUNÇÃO DE STATUS DO PEDIDO
  // ==========================================
  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { icon: React.ReactNode; color: string; text: string } } = {
      "pending": {
        icon: <Clock className="w-4 h-4" />,
        color: "bg-yellow-100 text-yellow-800",
        text: "Pendente"
      },
      "processing": {
        icon: <CheckCircle2 className="w-4 h-4" />,
        color: "bg-blue-100 text-blue-800",
        text: "Processando"
      },
      "shipped": {
        icon: <Truck className="w-4 h-4" />,
        color: "bg-purple-100 text-purple-800",
        text: "Enviado"
      },
      "delivered": {
        icon: <CheckCircle2 className="w-4 h-4" />,
        color: "bg-green-100 text-green-800",
        text: "Entregue"
      },
      "cancelled": {
        icon: <CheckCircle2 className="w-4 h-4" />,
        color: "bg-red-100 text-red-800",
        text: "Cancelado"
      }
    };

    const badge = statusMap[status] || statusMap["pending"];
    return badge;
  };

  // ==========================================
  // FUNÇÃO DE ADICIONAR AO CARRINHO
  // ==========================================
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Se o produto já existe no carrinho, aumenta a quantidade
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Adiciona novo produto ao carrinho
        return [...prev, { product, quantity: 1 }];
      }
    });
    
    showNotification(`${product.name} adicionado ao carrinho!`);
    setIsCartOpen(true);
  };

  const allCategories = useMemo(() => {
    return [
      "Todos",
      "Skincare e Tratamentos Faciais",
      "Shampoo e Condicionador",
      "Cuidados Capilares",
      "Maquiagem",
      "Aparelhos Estéticos e Tecnologia",
      "Higiene e Cuidados Pessoais"
    ];
  }, []);

  const filteredProducts = useMemo(() => {
    // ✅ FIX: Verificar se PRODUCTS existe e é um array antes de filtrar
    if (!PRODUCTS || !Array.isArray(PRODUCTS)) {
      console.warn('PRODUCTS não está disponível ou não é um array', PRODUCTS);
      return [];
    }

    console.log('DADOS CHEGANDO NO CARRINHO:', PRODUCTS.length); // Debug
    
    return PRODUCTS.filter(p => {
      const matchCat = selectedCategory === "Todos" || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.jpName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    }).sort((a, b) => {
      const totalA = a.priceBRL + a.serviceFeeBRL;
      const totalB = b.priceBRL + b.serviceFeeBRL;
      if (sortBy === "priceAsc") return totalA - totalB;
      if (sortBy === "priceDesc") return totalB - totalA;
      if (sortBy === "name") {
        // FIX: Comparação de string segura (não usa localeCompare que pode travar)
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
      }
      return b.rating - a.rating;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
  <Header
  onSearchChange={setSearchQuery}
  selectedCategory={selectedCategory}
  onSelectCategory={setSelectedCategory}
  categories={allCategories}
  cartCount={cartItems.length}
  onOpenCart={() => setIsCartOpen(true)}
  onOpenAuth={() => setIsAuthOpen(true)}
  user={user}
  onLogout={handleLogout}
  onLogoClick={() => setActiveTab("store")}
  onAboutClick={() => setActiveTab("about")}
  onRedirectClick={() => setActiveTab("redirect")}
  onAdminClick={() => setActiveTab("admin")}
  activeTab={activeTab}
  isAdmin={isAdmin}
/>

      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          {notification}
        </div>
      )}

      {activeTab === "store" ? (
        <>
          <Hero onClubClick={() => setIsClubModalOpen(true)} />
          <RedirectBanner onRedirectClick={() => setActiveTab("redirect")} />
          <TrustBadges />
          <main className="flex-1 bg-slate-50 py-12 px-4">
            <section className="max-w-7xl mx-auto">
              <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">
                    Catálogo Completo
                  </h2>
                  <p className="text-slate-600 font-bold">
                    {filteredProducts.length} produtos disponíveis
                  </p>
                </div>
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {allCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="popular">Popularidade</option>
                    <option value="priceAsc">Menor preço</option>
                    <option value="priceDesc">Maior preço</option>
                    <option value="name">Nome A-Z</option>
                  </select>
                </div>
              </div>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60 p-6">
                  <p className="text-sm font-bold text-slate-400">Nenhum produto encontrado nesta categoria no momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAddToCart={() => handleAddToCart(p)}
                    />
                  ))}
                </div>
              )}
            </section>
            <Testimonials />
            <BlogSection />
          </main>
        </>
      ) : activeTab === "redirect" ? (
        <main className="flex-1 bg-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-red-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MapPin className="w-48 h-48 text-red-600" />
              </div>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight text-red-600">📦 Compre em Qualquer Loja do Japão</h2>
                  <div className="text-black space-y-4 text-sm font-bold mb-8">
                    <p>Muitas lojas online japonesas não enviam produtos para o exterior. É para isso que estamos aqui!</p>
                    <p>Com o nosso serviço de <strong className="text-red-600">Redirecionamento</strong>, você faz compras nos seus sites favoritos como se morasse no Japão usando o nosso endereço de remessas.</p>
                    <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl flex gap-3 text-red-700 mt-6">
                      <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed font-bold"><strong>Como fazer:</strong> Copie o endereço abaixo e cole na hora de finalizar a compra na loja japonesa. Assim que o pagamento for confirmado, enviamos para você!</div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-600 border border-red-100 relative">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Seu Endereço no Japão</p>
                    <p className="font-black text-xl leading-snug mb-1 text-black">The Tomorrow</p>
                    <p className="text-gray-700 font-bold">2-chōme-3-15 Matsutera, Yokkaichi</p>
                    <p className="text-gray-700 font-bold">Mie 510-8021</p>
                    <p className="text-black font-black mt-2">(Japão)</p>
                  </div>
                  <button
                    onClick={() => window.open("https://wa.me/817014074971?text=...", "_blank")}
                    className="mt-8 bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider py-4 px-6 rounded-xl transition-all w-full"
                  >
                    💬 Dúvidas? Chame no WhatsApp
                  </button>
                </div>

                {/* Lojas Recomendadas */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black mb-4 text-red-600">🔗 Lojas Recomendadas</h3>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white p-5 rounded-2xl border-2 border-red-200 shadow-md hover:border-red-500 transition-all">
                      <h4 className="text-sm font-black text-red-600 mb-3 uppercase tracking-wider">Marcas de Roupa e Calçados</h4>
                      <ul className="space-y-4 text-sm font-bold text-black">
                        <li><a href="https://www.adidas.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> Adidas JP</a></li>
                        <li><a href="https://www.gu-global.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> GU Global</a></li>
                        <li><a href="https://www.onitsukatiger.com/jp/ja-jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> Onitsuka Tiger</a></li>
                        <li><a href="https://www.uniqlo.com/jp/ja/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> Uniqlo JP</a></li>
                        <li><a href="https://www.nike.com/jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> Nike JP</a></li>
                        <li><a href="https://www.crocs.co.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> Crocs</a></li>
                        <li><a href="https://shop.newbalance.jp" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> New Balance JP</a></li>
                      </ul>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border-2 border-red-200 shadow-md hover:border-red-500 transition-all">
                      <h4 className="text-sm font-black text-red-600 mb-3 uppercase tracking-wider">Marketplaces</h4>
                      <ul className="space-y-4 text-sm font-bold text-black">
                        <li><a href="https://www.rakuten.co.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> Rakuten</a></li>
                        <li><a href="https://www.amazon.co.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> Amazon JP</a></li>
                        <li><a href="https://jp.mercari.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> Mercari JP</a></li>
                      </ul>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border-2 border-red-200 shadow-md hover:border-red-500 transition-all">
                      <h4 className="text-sm font-black text-red-600 mb-3 uppercase tracking-wider">Joias & Moda</h4>
                      <ul className="space-y-4 text-sm font-bold text-black">
                        <li><a href="https://www.zara.com/jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> Zara JP</a></li>
                      </ul>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border-2 border-red-200 shadow-md hover:border-red-500 transition-all">
                      <h4 className="text-sm font-black text-red-600 mb-3 uppercase tracking-wider">Entretenimento & Colecionáveis</h4>
                      <ul className="space-y-4 text-sm font-bold text-black">
                        <li><a href="https://weverse.co" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> Weverse</a></li>
                        <li><a href="https://popmart.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> Pop Mart</a></li>
                        <li><a href="https://www.pokemon-card.com/?hl=pt-BR" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> Pokémon Card</a></li>
                        <li><a href="https://www.sanrio.com/collections/kuromi#shop_character" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> Kuromi</a></li>
                        <li><a href="https://www.sootang.jp" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group"><ExternalLink className="w-4 h-4" /> Sootang</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : activeTab === "about" ? (
        <main className="flex-1 bg-slate-50 py-12 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 md:p-12">
            <h1 className="text-3xl font-black text-slate-900 mb-6">✨ Bem-vindos à Japão Box Brasil ✨</h1>
            <p className="text-slate-600 mb-4">Iniciamos nossa empresa com um sonho: levar até o Brasil os melhores produtos do Japão.</p>
          </div>
        </main>
      ) : activeTab === "admin" ? (
        // ✅ ADMIN PANEL - RESTAURADO
        isAdmin ? (
          <main className="flex-1 bg-slate-50 py-8 px-4 min-h-[85vh]">
            <AdminDashboard
              user={user}
              onLogout={handleLogout}
              getStatusBadge={getStatusBadge}
            />
          </main>
        ) : (
          <main className="flex-1 bg-slate-50 py-12 px-4 flex items-center justify-center">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-red-600">
              <h2 className="text-2xl font-black text-red-600 mb-3">🔒 Acesso Negado</h2>
              <p className="text-gray-600 font-bold">Você não tem permissão para acessar o painel de administração.</p>
            </div>
          </main>
        )
      ) : activeTab === "account" ? (
        // ✅ CLIENT DASHBOARD - PEDIDOS DO CLIENTE
        <main className="flex-1 bg-slate-50 py-8 px-4 min-h-[85vh]">
          {user ? (
            <ClientDashboard
              user={user}
              orders={orders}
              loadingOrders={loadingOrders}
              onCreateMockOrder={() => {}}
              onLogout={handleLogout}
              getStatusBadge={getStatusBadge}
            />
          ) : (
            <p className="text-center">Por favor, faça o login.</p>
          )}
          <footer className="w-full bg-white border-t border-slate-200 text-slate-600 pt-12 pb-24 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="mb-6">
                <img
                  src="https://raw.githubusercontent.com/gustavojax/jap-o-box-brasil/main/src/assets/images/3.png"
                  alt="PagBank"
                  className="mx-auto h-24 w-auto object-contain"
                />
              </div>
              <p>© 2026 Japão Box Brasil. Todos os direitos reservados.</p>
            </div>
          </footer>
        </main>
      ) : (
        // ✅ STORE (PADRÃO)
        <>
          <Hero onClubClick={() => setIsClubModalOpen(true)} />
          <RedirectBanner onRedirectClick={() => setActiveTab("redirect")} />
          <TrustBadges />
          <main className="flex-1 bg-slate-50 py-12 px-4">
            {/* ... resto do código da loja ... */}
          </main>
        </>
      )}

      {/* MODAIS E CARRINHO */}
      {isCartOpen && <CartDrawer cartItems={cartItems} setCartItems={setCartItems} onClose={() => setIsCartOpen(false)} />}
      <BudgetModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ClubModal isOpen={isClubModalOpen} onClose={() => setIsClubModalOpen(false)} />
      <WhatsAppFloat />
    </div>
  );
}

