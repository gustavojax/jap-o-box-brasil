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

import { ArrowUpDown, CheckCircle2, Clock, Truck, CheckCircle, Heart, MapPin, ExternalLink, Info } from "lucide-react";

import { auth, db } from "./firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

// ==========================================
// BASE DE DADOS DE PRODUTOS COMPLETA E REVISADA
// ==========================================
const PRODUCTS: Product[] = [
  // --- SKINCARE E TRATAMENTOS FACIAIS ---

  {
    id: "medicube-forever-cherry-ager-booster",
    name: "Medicube x Forever Cherry Age-R Booster (Edição Especial)",
    jpName: "",
    description: "Dispositivo facial multifuncional com escova vibratória rosa em edição especial com laço. Ideal para limpeza profunda, esfoliação e melhor absorção de sérum.",
    priceBRL: 189.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/Hx8b2BgB/IMG-0671.jpg",
    rating: 5.0,
    reviewsCount: 12,
    department: "Beleza, Higiene e Saúde",
    category: "Acessórios e Dispositivos Estéticos",
    stock: 5
  },
  {
    id: "femimore-glutathione-bubble-soap",
    name: "Femimore Glutathione Bubble Soap",
    jpName: "",
    description: "Sabonete em espuma com Glutathione. Proporciona limpeza suave, ajuda no controle de oleosidade, odor e promove clareamento leve da pele.",
    priceBRL: 110.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/sf9MRtwB/femimore.jpg",
    rating: 4.7,
    reviewsCount: 45,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  // ... rest of products remain the same (truncated for brevity in this example)
];

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

  const allCategories = useMemo(() => {
    return [
      "Todos",
      "Skincare e Tratamentos Faciais",
      "Cuidados Capilares",
      "Maquiagem",
      "Aparelhos Estéticos e Tecnologia",
      "Higiene e Cuidados Pessoais"
    ];
  }, []);

  const filteredProducts = useMemo(() => {
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
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return b.rating - a.rating;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const currentList = Array.isArray(prev) ? [...prev] : [];

      const existingIndex = currentList.findIndex(i => i.product.id === product.id);

      if (existingIndex >= 0) {
        const newList = [...currentList];
        newList[existingIndex] = {
          ...newList[existingIndex],
          quantity: newList[existingIndex].quantity + 1
        };
        return newList;
      }

      return [...currentList, { product, quantity: 1, selectedUpsells: [] }];
    });

    setIsCartOpen(true);
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

  const handleReturnToStore = () => {
    setSelectedCategory("Todos");
    setSearchQuery("");
    setActiveTab("store");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0 font-sans text-slate-900 antialiased">
      {showTaxNotice && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl border-2 border-red-600">
            <h3 className="font-black text-red-600 mb-2">📦 Aviso Importante</h3>
            <p className="text-slate-700 text-sm mb-4">
              Compras internacionais podem estar sujeitas à cobrança de 60% de imposto de importação, além do ICMS. Essas taxas são de responsabilidade do comprador.
            </p>
            <label className="flex items-center gap-2 text-xs font-bold mb-4 cursor-pointer">
              <input type="checkbox" onChange={(e) => setAcceptedTerms(e.target.checked)} />
              Li e concordo.
            </label>
            <button
              onClick={() => { if(acceptedTerms) setShowTaxNotice(false); }}
              className={`w-full text-white font-bold py-2 rounded-lg transition-opacity ${acceptedTerms ? 'bg-red-600' : 'bg-red-400 cursor-not-allowed'}`}
              disabled={!acceptedTerms}
            >
              ESTOU CIENTE
            </button>
          </div>
        </div>
      )}

      <div className="w-full bg-slate-900 text-white text-center py-2 px-4 text-xs font-medium tracking-wide flex items-center justify-center gap-4">
        <span>🇯🇵 PRODUTOS 100% ORIGINAIS DIRETO DE MIE, JAPÃO</span>
        <span className="hidden md:inline text-slate-400">|</span>
        <span className="hidden md:flex items-center gap-1">📦 RASTREAMENTO COMPLETO EM TODAS AS ENCOMENDAS</span>
      </div>

      {notification && (
        <div className="fixed bottom-20 right-4 md:bottom-4 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl flex items-center gap-2 shadow-2xl">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          {notification}
        </div>
      )}

      <Header
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={allCategories}
        cartCount={cartItems.reduce((a, i) => a + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => {
          if (user) {
            setActiveTab("account");
          } else {
            setIsAuthOpen(true);
          }
        }}
        user={user}
        onLogout={handleLogout}
        onLogoClick={handleReturnToStore}
      />

      <RedirectBanner onRedirectClick={() => {
        setActiveTab("redirect");
        setShowTaxNotice(true);
      }} />

      <div className="max-w-7xl mx-auto w-full px-4 pt-4 flex justify-end">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex gap-1 flex-wrap justify-end">
          <button
            onClick={handleReturnToStore}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === "store" ? "bg-red-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            🛍️ Loja
          </button>
          <button
            onClick={() => { setActiveTab("redirect"); setShowTaxNotice(true); }}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === "redirect" ? "bg-red-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            🌐 Redirecionamento
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === "about" ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            ℹ️ Sobre
          </button>
          <button
            onClick={() => { if (user) { setActiveTab("account"); } else { setIsAuthOpen(true); } }}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === "account" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            👤 Conta
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === "admin" ? "bg-red-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              ⚙️ Admin
            </button>
          )}
        </div>
      </div>

      {activeTab === "store" ? (
        <>
          <Hero
            onScrollToCatalog={() => {
              setSelectedCategory("Todos");
              document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
            }}
            onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          />
          <main className="flex-1">
            <TrustBadges />
            <section id="catalogo" className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="text-left">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">🛒 Vitrine de Importação</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Filtro ativo no cabeçalho: <span className="text-red-600 font-bold">{selectedCategory}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 bg-white text-xs font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
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
                    <p>Com o nosso serviço de <strong className="text-red-600">Redirecionamento</strong>, você faz compras nos seus sites favoritos como se morasse no Japão usando o nosso endereco de remessas.</p>
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
                      </ul>
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
      ) : (
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
