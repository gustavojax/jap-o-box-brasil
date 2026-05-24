import React, { useState } from "react";
import { ShoppingBag, Search, ClipboardList, ShieldCheck, HelpCircle } from "lucide-react";
import japaoBoxLogo from "../assets/images/japaobox_logo_1779433940457.png";

interface HeaderProps {
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  cartCount: number;
  onOpenCart: () => void;
  onOpenBudgetModal: () => void;
  onScrollToCalculator: () => void;
}

export default function Header({
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  cartCount,
  onOpenCart,
  onOpenBudgetModal,
  onScrollToCalculator,
}: HeaderProps) {
  const [searchVal, setSearchVal] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchVal);
    // Smooth scroll to catalog
    const catalogEl = document.getElementById("catalog-section");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    const catalogEl = document.getElementById("catalog-section");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all duration-300">
      {/* Promo Bar */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white text-xs py-2 px-4 font-sans text-center font-medium tracking-wide flex justify-center items-center gap-1.5 md:gap-4 flex-wrap">
        <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold">100% Original</span>
        <span>🇯🇵 Direto de Tóquio para o Brasil com Seguro de Importação Incluso!</span>
        <span className="hidden md:inline">|</span>
        <button 
          onClick={onScrollToCalculator}
          className="underline hover:text-rose-100 font-bold tracking-tight text-left cursor-pointer"
        >
          Calcular Impostos na Hora ➔
        </button>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => handleCategoryClick("Todos")}>
            <div className="flex items-center gap-2">
              <div className="relative w-11 h-11 md:w-14 md:h-14 flex items-center justify-center">
                <img
                  src={japaoBoxLogo}
                  alt="JapãoBox Brasil Logo"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-lg md:text-2xl font-black tracking-tighter text-gray-900 block leading-none">
                  JAPÃO<span className="text-red-600">BOX</span>
                </span>
                <span className="text-[9px] md:text-xs font-mono tracking-wider text-gray-500 uppercase block font-semibold leading-tight">
                  BRASIL • EXCLUSIVO
                </span>
              </div>
            </div>
          </div>

          {/* Premium Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Buscar figuras, Labubu, cosméticos, snacks..."
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                onSearchChange(e.target.value);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-sans text-gray-800"
            />
            <button type="submit" className="absolute right-3.5 top-3 text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          {/* Secondary Quick Call-to-Actions */}
          <div className="flex items-center gap-2.5 md:gap-4">
            
            {/* Interactive Calculator Scroll Badge */}
            <button 
              onClick={onScrollToCalculator}
              className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50/50 text-amber-800 text-xs font-semibold hover:bg-amber-50 cursor-pointer transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Calculadora de Taxa</span>
              <span className="sm:hidden">Simular Imposto</span>
            </button>

            {/* Custom Budget request badge */}
            <button
              onClick={onOpenBudgetModal}
              id="request-bgt-btn"
              className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
            >
              <ClipboardList className="w-3.5 h-3.5 text-red-100" />
              <span>Pedir Qualquer Produto ✈️</span>
            </button>

            {/* Real Shopping Cart Bag */}
            <button
              onClick={onOpenCart}
              id="open-cart-btn"
              className="relative p-2.5 hover:bg-rose-50 rounded-full text-gray-800 hover:text-red-600 transition-colors cursor-pointer"
              aria-label="Ver carrinho"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 h-5 w-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white ring-1 ring-red-300 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar Row */}
        <form onSubmit={handleSearchSubmit} className="flex md:hidden mt-3 relative">
          <input
            type="text"
            placeholder="Buscar Labubu, Shiseido, animes..."
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              onSearchChange(e.target.value);
            }}
            className="w-full bg-slate-100 border border-transparent rounded-full py-2 px-4 pl-3.5 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white focus:border-red-500 transition-all text-gray-800"
          />
          <button type="submit" className="absolute right-3.5 top-2.5 text-gray-500 hover:text-red-600 transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Categories Ribbons */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-rose-50 overflow-x-auto pb-1 no-scrollbar select-none">
          <button
            onClick={() => handleCategoryClick("Todos")}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 ${
              selectedCategory === "Todos"
                ? "bg-red-500 text-white shadow-sm"
                : "bg-slate-50 text-gray-600 hover:bg-rose-50/50 hover:text-red-500 border border-slate-100"
            }`}
          >
            🇯🇵 Todos os Produtos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`flex-shrink-0 px-3.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-slate-50 text-gray-600 hover:bg-rose-50/50 hover:text-red-600 border border-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
