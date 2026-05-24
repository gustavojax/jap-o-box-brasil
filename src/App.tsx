import React, { useState, useMemo } from "react";

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

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user] = useState<any>(null);

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [prefilledBudgetData] = useState<any>(null);

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // =========================
  // CATEGORIAS (ORIGINAL)
  // =========================
  const categories = useMemo(() => {
    const list = new Set(PRODUCTS.map((p) => p.category));
    return ["Todos", ...Array.from(list)];
  }, []);

  // =========================
  // PRODUTOS FILTRADOS (ORIGINAL)
  // =========================
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCategory =
        selectedCategory === "Todos" ||
        p.category === selectedCategory;

      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.jpName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    }).sort((a, b) => {
      const totalA =
        a.priceBRL +
        a.serviceFeeBRL +
        a.shippingEstBRL +
        a.estimatedTaxBRL;

      const totalB =
        b.priceBRL +
        b.serviceFeeBRL +
        b.shippingEstBRL +
        b.estimatedTaxBRL;

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
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        { product, quantity: 1, selectedUpsells: [] },
      ];
    });

    setIsCartOpen(true);
    showNotification(`${product.name} adicionado ao carrinho`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* NOTIFICAÇÃO */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2">
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
        cartCount={cartItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        )}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
      />

      {/* HERO */}
      <Hero />

      <main className="flex-1">
        <TrustBadges />

        {/* CATALOG */}
        <section className="max-w-7xl mx-auto px-4 py-16">

          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black">
              Produtos Exclusivos Importados
            </h2>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-xl px-4 py-2"
              >
                <option value="popular">Popularidade</option>
                <option value="priceAsc">Menor preço</option>
                <option value="priceDesc">Maior preço</option>
                <option value="name">Nome A-Z</option>
              </select>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

        </section>

        <SubscriptionClub onSubscribe={() => {}} />
        <CostCalculator onOpenBudgetModalWithData={() => {}} />
        <Testimonials />
        <TrackingWidget />
        <BlogSection />
      </main>

      {/* CART */}
      {isCartOpen && (
        <CartDrawer
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
        />
      )}

      {/* MODALS */}
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
