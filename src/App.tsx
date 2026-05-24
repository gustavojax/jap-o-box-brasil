import React, { useState, useMemo, useEffect } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBadges from "./components/TrustBadges";
import ProductCard from "./components/ProductCard";
import TrackingWidget from "./components/TrackingWidget";

import { PRODUCTS } from "./data";
import type { Product, CartItem } from "./types";

import { CheckCircle2 } from "lucide-react";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedSubcategory, setSelectedSubcategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // =========================================
  // RESET SCROLL (CORREÇÃO DO BUG VISUAL)
  // =========================================
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedCategory, selectedSubcategory]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // =========================================
  // CATEGORIAS
  // =========================================
  const categories = useMemo(() => {
    const list = new Set(PRODUCTS.map((p) => p.category));
    return ["Todos", ...Array.from(list)];
  }, []);

  // =========================================
  // SUBCATEGORIAS
  // =========================================
  const subcategories = useMemo(() => {
    const list = new Set(
      PRODUCTS.filter(
        (p) =>
          selectedCategory === "Todos" ||
          p.category === selectedCategory
      )
        .map((p) => p.subcategory)
        .filter(Boolean)
    );

    return ["Todos", ...Array.from(list) as string[]];
  }, [selectedCategory]);

  // =========================================
  // FILTRO DE PRODUTOS
  // =========================================
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCategory =
        selectedCategory === "Todos" ||
        p.category === selectedCategory;

      const matchSubcategory =
        selectedSubcategory === "Todos" ||
        p.subcategory === selectedSubcategory;

      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.jpName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSubcategory && matchSearch;
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
  }, [selectedCategory, selectedSubcategory, searchQuery, sortBy]);

  // =========================================
  // CART
  // =========================================
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);

      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { product, quantity: 1, selectedUpsells: [] }];
    });

    showNotification("Produto adicionado ao carrinho");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* NOTIFICAÇÃO */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 size={18} />
          {notification}
        </div>
      )}

      {/* HERO */}
      <Hero />

      {/* CATEGORIAS */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubcategory("Todos");
              }}
              className={`px-4 py-2 rounded-xl border ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SUBCATEGORIAS */}
        <div className="flex gap-2 flex-wrap mt-3">
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-3 py-1 rounded-lg text-sm border ${
                selectedSubcategory === sub
                  ? "bg-red-600 text-white"
                  : "bg-white"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUTOS */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={`${product.id}-${selectedCategory}-${selectedSubcategory}-${index}`}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* TRACKING */}
      <TrackingWidget />
    </div>
  );
}
