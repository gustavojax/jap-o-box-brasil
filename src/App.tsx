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

  // =========================
  // CONTROLE DE CATEGORIAS
  // =========================
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [showCatalog, setShowCatalog] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("popular");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [prefilledBudgetData] = useState<any>(null);

  const [selectedProductDetail, setSelectedProductDetail] =
    useState<Product | null>(null);

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // =========================
  // CATEGORIAS
  // =========================
  const categories = useMemo(() => {
    const list = new Set(PRODUCTS.map((p) => p.category));
    return ["Todos", ...Array.from(list)];
  }, []);

  // =========================
  // FILTRO DE PRODUTOS
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
  // CARRINHO
  // =========================
  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevItems,
        {
          product,
          quantity: 1,
          selectedUpsells: [],
        },
      ];
    });

    setIsCartOpen(true);
    showNotification(`${product.name} adicionado ao carrinho`);
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
  };

  const handleUpdateCartQuantity = (
    productId: string,
    quantity: number
  ) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // =========================
  // SCROLLS
  // =========================
  const handleScrollToCatalog = () => {
    const section = document.getElementById("catalog-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToCalculator = () => {
    const section = document.getElementById("tax-calculator-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToClub = () => {
    const section = document.getElementById(
      "subscription-club-section"
    );
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  // =========================
  // NEWSLETTER
  // =========================
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterSubscribed(true);
    showNotification("Cadastro realizado com sucesso!");

    setTimeout(() => {
      setNewsletterSubscribed(false);
      setNewsletterEmail("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* NOTIFICATION */}
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
        onSelectCategory={(cat: string) => {
          setSelectedCategory(cat);
          setShowCatalog(true); // 👈 AQUI ESTÁ A MÁGICA
        }}
        categories={categories}
        cartCount={cartItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        )}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onScrollToCalculator={handleScrollToCalculator}
      />

      {/* HERO */}
      <Hero
        onScrollToCatalog={() => {
          setShowCatalog(true);
          handleScrollToCatalog();
        }}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onScrollToClub={handleScrollToClub}
      />

      <main className="flex-1">
        <TrustBadges />

        {/* CATALOGO */}
        <section id="catalog-section" className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <span className="text-red-600 font-bold uppercase text-xs tracking-widest">
                Catálogo Japão Box Brasil
              </span>

              <h2 className="text-3xl font-black text-slate-900 mt-2">
                Produtos Exclusivos Importados
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-500" />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2 text-sm bg-white"
              >
                <option value="popular">Popularidade</option>
                <option value="priceAsc">Menor preço</option>
                <option value="priceDesc">Maior preço</option>
                <option value="name">Nome A-Z</option>
              </select>
            </div>
          </div>

          {/* 👇 AGORA SÓ APARECE SE ABRIU CATEGORIA */}
          {showCatalog ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onSelectProduct={setSelectedProductDetail}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              Selecione uma categoria para ver os produtos
            </p>
          )}
        </section>

        <SubscriptionClub onSubscribe={() => {}} />
        <CostCalculator onOpenBudgetModalWithData={() => {}} />
        <Testimonials />
        <TrackingWidget />
        <BlogSection />
      </main>

      {/* NEWSLETTER */}
      <section className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 py-14 px-4 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-black">
            Receba Ofertas Exclusivas
          </h3>

          <p className="text-sm text-rose-100 mt-3">
            Novidades do Japão direto no seu email.
          </p>

          {!newsletterSubscribed ? (
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 mt-6"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) =>
                  setNewsletterEmail(e.target.value)
                }
                placeholder="Seu email..."
                className="flex-1 rounded-xl px-4 py-3 text-slate-900"
              />

              <button
                type="submit"
                className="bg-slate-900 hover:bg-black rounded-xl px-6 py-3 font-bold"
              >
                Cadastrar
              </button>
            </form>
          ) : (
            <div className="mt-6 bg-white/10 rounded-xl p-4">
              Cadastro realizado com sucesso!
            </div>
          )}
        </div>
      </section>

      {/* CART */}
      {isCartOpen && (
        <CartDrawer
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
        />
      )}

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        prefilledData={prefilledBudgetData}
        onSubmit={() => {}}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* WHATSAPP */}
      <a
        href="https://wa.me/817014074971"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          width: "70px",
          height: "70px",
          backgroundColor: "#25D366",
          borderRadius: "9999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "34px",
          color: "white",
          zIndex: 999999,
        }}
      >
        💬
      </a>
    </div>
  );
}
