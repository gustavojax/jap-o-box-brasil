import React, { useState, useMemo, useEffect } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBadges from "./components/TrustBadges";
import CostCalculator from "./components/CostCalculator";
import ProductCard from "./components/ProductCard";
import SubscriptionClub from "./components/SubscriptionClub";
import Testimonials from "./components/Testimonials";
import BlogSection from "./components/BlogSection";
import CartDrawer from "./components/CartDrawer";
import BudgetModal from "./components/BudgetModal";
import AuthModal from "./components/AuthModal";
import TrackingWidget from "./components/TrackingWidget";

import { PRODUCTS } from "./data";
import type { Product, CartItem } from "./types";

import { ArrowUpDown, CheckCircle2 } from "lucide-react";

import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function App() {

  // =========================
  // AUTH
  // =========================
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

useEffect(() => {
  const unsub = onAuthStateChanged(auth, (u) => {
    console.log("USER:", u); // 🔥 DEBUG IMPORTANTE
    setUser(u);
  });

  return () => unsub();
}, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  // =========================
  // UI
  // =========================
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // =========================
  // CATEGORIAS
  // =========================
  const categories = useMemo(() => {
    const list = new Set(PRODUCTS.map(p => p.category));
    return ["Todos", ...Array.from(list)];
  }, []);

  // =========================
  // FILTRO
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* NOTIFICAÇÃO */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl">
          <CheckCircle2 className="inline mr-2 text-green-400" />
          {notification}
        </div>
      )}

      {/* HEADER */}
      <Header
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* HERO */}
      <Hero />

      <main className="flex-1">

        <TrustBadges />

        {/* ========================= */}
        {/* 🔥 ÁREA DO CLIENTE (SÓ LOGADO) */}
        {/* ========================= */}
        {user && (
          <section className="max-w-7xl mx-auto px-4 py-10">

            <h2 className="text-2xl font-black mb-6">
              Área do Cliente
            </h2>

            <div className="bg-white rounded-2xl p-6 shadow-sm">

              <p className="mb-4 text-sm text-slate-600">
                Acompanhe seus pedidos e rastreamentos abaixo:
              </p>

              {/* 🔥 RASTREAMENTO SÓ AQUI */}
              <TrackingWidget />

            </div>

          </section>
        )}

        {/* PRODUTOS */}
        <section className="max-w-7xl mx-auto px-4 py-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={() => {}}
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
        isOpen={false}
        onClose={() => {}}
        onSubmit={() => {}}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

    </div>
  );
}
