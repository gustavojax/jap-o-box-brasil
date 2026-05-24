import React, { useState, useMemo, useEffect } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBadges from "./components/TrustBadges";
import CostCalculator from "./components/CostCalculator";
import ProductCard from "./components/ProductCard";
import SubscriptionClub from "./components/SubscriptionClub";
import Testimonials from "./components/Testimonials";
import BlogSection from "./components/BlogSection";
import TrackingWidget from "./components/TrackingWidget";
import CartDrawer from "./components/CartDrawer";
import BudgetModal from "./components/BudgetModal";
import AuthModal from "./components/AuthModal";

import { PRODUCTS } from "./data";
import type { Product, CartItem } from "./types";

import { ArrowUpDown, CheckCircle2 } from "lucide-react";

import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function App() {

  // =========================
  // AUTH STATE
  // =========================
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

    useEffect(() => {
    // 1. Checagem imediata (força o mobile a ler o usuário atual se já entrar logado)
    if (auth.currentUser) {
      console.log("USUÁRIO DETECTADO IMEDIATAMENTE:", auth.currentUser);
      setUser({ ...auth.currentUser });
    }

    // 2. Ouvinte normal para mudanças futuras
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log("MUDANÇA DE ESTADO FIREBASE:", u);
      if (u) {
        setUser({ ...u });
        setIsAuthOpen(false); 
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

    r

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
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
  // CATEGORIES
  // =========================
  const categories = useMemo(() => {
    const list = new Set(PRODUCTS.map(p => p.category));
    return ["Todos", ...Array.from(list)];
  }, []);

  // =========================
  // FILTER PRODUCTS
  // =========================
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCategory =
        selectedCategory === "Todos" || p.category === selectedCategory;

      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.jpName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    }).sort((a, b) => {
      const totalA =
        a.priceBRL + a.serviceFeeBRL + a.shippingEstBRL + a.estimatedTaxBRL;

      const totalB =
        b.priceBRL + b.serviceFeeBRL + b.shippingEstBRL + b.estimatedTaxBRL;

      if (sortBy === "priceAsc") return totalA - totalB;
      if (sortBy === "priceDesc") return totalB - totalA;
      if (sortBy === "name") return a.name.localeCompare(b.name);

      return b.rating - a.rating;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  // =========================
  // CART
  // =========================
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);

      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { product, quantity: 1, selectedUpsells: [] }];
    });

    setIsCartOpen(true);
    showNotification(`${product.name} adicionado ao carrinho`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* NOTIFICAÇÃO */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl flex items-center gap-2">
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

      {/* HERO */}
      <Hero />

      <main className="flex-1 w-full relative z-10 clear-both block">

        {/* TRUST BADGES */}
        <div className="w-full block">
          <TrustBadges />
        </div>

        {/* ========================= */}
        {/* 🔥 ÁREA DO CLIENTE - BLINDADA CONTRA ERROS */}
        {/* ========================= */}
        {user ? (
          <section className="w-full max-w-7xl mx-auto px-4 py-8 block relative z-30">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-red-500 block text-left">

              <h2 className="text-2xl font-black text-slate-900 block mb-1">
                Minha Conta (Área Ativa)
              </h2>

              <p className="text-sm text-gray-600 mb-6 block font-mono bg-slate-100 p-2 rounded">
                ID do Usuário: {user?.uid || "ID Não encontrado"}
              </p>

              <div className="border-t border-gray-200 pt-6 block">
                <h3 className="font-bold mb-4 text-slate-800 block">
                  Rastreamento de Pedidos
                </h3>
                
                <div className="w-full bg-slate-50 p-4 rounded-xl block min-h-[150px] border border-slate-200">
                  <TrackingWidget />
                </div>
              </div>

            </div>
          </section>
        ) : (
          <div className="text-center p-2 bg-gray-100 text-gray-400 text-[10px] font-mono">
            [Aguardando login para ativar área do cliente]
          </div>
        )}

        {/* PRODUTOS */}
        <section className="max-w-7xl mx-auto px-4 py-10 block">

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900">
              Produtos Importados
            </h2>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-xl px-4 py-2 bg-white"
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
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

        </section>

        <SubscriptionClub onSubscribe={() => {}} />
        <CostCalculator onOpenBudgetModalWithData={() => {}} />
        <Testimonials />
        <BlogSection />

      </main>

      {/* CART */}
      {isCartOpen && (
        <CartDrawer
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
        />
      )}

      {/* MODAIS */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSubmit={() => {}}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

    </div>
  );
}
