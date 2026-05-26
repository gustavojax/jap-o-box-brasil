import React, { useState } from "react";
import { ShoppingCart, Menu, ChevronDown, User, LogOut, Search } from "lucide-react";

interface Props {
  onSearchChange: (v: string) => void;
  selectedCategory: string;
  onSelectCategory: (v: string) => void;
  categories: string[];
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  user: any;
  onLogout: () => void;
  onLogoClick: () => void;
  // Nova prop para integrar com a troca de abas que já existe no seu App.tsx
  activeTab: "store" | "account" | "about";
  setActiveTab: (tab: "store" | "account" | "about") => void;
}

export default function Header({
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  cartCount,
  onOpenCart,
  onOpenAuth,
  user,
  onLogout,
  onLogoClick,
  activeTab,
  setActiveTab
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50 border-b border-slate-200">
      
      {/* LINHA 1: BARRA PRINCIPAL DE OPERAÇÃO */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-6">
        
        {/* LOGO E IDENTIDADE */}
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-3.5 min-w-[220px] cursor-pointer hover:opacity-90 transition-opacity select-none"
        >
          <img
            src="https://i.ibb.co/jZDQ1vd4/IMG-20260515-WA0037.jpg"
            alt="Japão Box Brasil"
            className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-100"
          />
          <div className="flex flex-col text-left">
            <span className="text-xl font-black text-slate-900 leading-tight tracking-tight">
              Japão Box Brasil
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Mie ➔ Brasil 🇯🇵
            </span>
          </div>
        </div>

        {/* BUSCA ESTILO MARKETPLACE */}
        <div className="flex-1 hidden md:flex max-w-xl relative">
          <input
            type="text"
            placeholder="Buscar produtos, marcas e subcategorias do Japão..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border border-slate-200 bg-slate-50/50 rounded-xl pl-4 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        </div>

        {/* AÇÕES DE CONTA E SACOLA */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 bg-slate-50 border p-1 pr-3 rounded-xl">
              <div className="bg-slate-900 text-white w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden lg:block max-w-[120px] truncate">
                {user.email}
              </span>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer bg-white"
            >
              Entrar
            </button>
          )}

          <button
            onClick={onOpenCart}
            className="relative bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">Carrinho</span>
            {cartCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm -mt-1">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* LINHA 2: NAVEGAÇÃO PREMIUM E DEPARTAMENTOS UNIFICADOS */}
      <div className="border-t border-slate-100 bg-slate-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4 relative">
          
          {/* MENU DROPDOWN DE CATEGORIAS ORGANIZADO */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-black text-slate-800 transition-all cursor-pointer"
            >
              <Menu className="w-3.5 h-3.5 text-slate-500" />
              <span>Categorias Japão</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 grid grid-cols-1 gap-0.5 animate-fadeIn text-left">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onSelectCategory(cat);
                        setIsDropdownOpen(false);
                        setActiveTab("store"); // Garante que volta pra loja ao filtrar
                        document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-red-50 text-red-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* MENUS INSTITUCIONAIS UNIFICADOS (Tirados do meio da página) */}
          <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-slate-200/60 shadow-sm">
            <button
              onClick={() => setActiveTab("store")}
              className={`px-3 py-1.5 rounded-lg font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "store" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              Loja
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-3 py-1.5 rounded-lg font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "about" ? "bg-red-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              Sobre Nós
            </button>
            <button
              onClick={() => user ? setActiveTab("account") : onOpenAuth()}
              className={`px-3 py-1.5 rounded-lg font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "account" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              Minha Suíte 📦
            </button>
          </div>

        </div>
      </div>

    </header>
  );
}
