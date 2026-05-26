import React, { useState } from "react";
import { ShoppingCart, Menu, ChevronDown, LogOut, Search } from "lucide-react";

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
    // 🌸 Fundo rosa sakura leve (bg-rose-50/60) com desfoque de fundo (backdrop-blur)
    <header className="w-full bg-rose-50/60 backdrop-blur-md sticky top-0 z-50 border-b border-rose-100/80 shadow-sm relative overflow-hidden">
      
      {/* DETALHES DE SAKURA FLUTUANTES NO FUNDO (VISUAL PREMIUM JAPÃO) */}
      <div className="absolute top-1 left-4 text-rose-300/30 text-xs select-none pointer-events-none font-serif">🌸</div>
      <div className="absolute bottom-2 left-1/3 text-rose-300/20 text-sm select-none pointer-events-none font-serif animate-pulse">🌸</div>
      <div className="absolute top-2 right-1/4 text-rose-300/20 text-xs select-none pointer-events-none font-serif">🌸</div>
      <div className="absolute bottom-1 right-12 text-rose-300/30 text-sm select-none pointer-events-none font-serif">🌸</div>

      {/* LINHA 1: BARRA PRINCIPAL DE OPERAÇÃO */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6 relative z-10">
        
        {/* LOGO AMPLIADO E ATUALIZADO */}
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-4 min-w-[260px] cursor-pointer hover:opacity-95 transition-opacity select-none"
        >
          {/* 🔄 Link direto oficial atualizado com sucesso e tamanho w-20 h-20 para dar nitidez */}
          <img
            src="https://iili.io/CJbmWhP.jpg"
            alt="Japão Box Brasil Logo"
            className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white bg-white transform hover:scale-105 transition-transform"
          />
          <div className="flex flex-col text-left">
            <span className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
              Japão Box <span className="text-red-600">Brasil</span>
            </span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
              Redirecionamento 🇯🇵 ➔ 🇧🇷
            </span>
          </div>
        </div>

        {/* BUSCA CENTRALIZADA */}
        <div className="flex-1 hidden md:flex max-w-xl relative">
          <input
            type="text"
            placeholder="Buscar produtos, marcas e subcategorias do Japão..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border border-rose-200/60 bg-white/80 rounded-xl pl-4 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        </div>

        {/* AÇÕES DE CONTA E SACOLA */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 bg-white/90 border border-rose-100 p-1 pr-3 rounded-xl shadow-sm">
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
              className="border border-rose-200 bg-white hover:border-red-400 text-slate-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              Entrar
            </button>
          )}

          <button
            onClick={onOpenCart}
            className="relative bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
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
      <div className="border-t border-rose-100/60 bg-white/40 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4 relative">
          
          {/* MENU DROPDOWN DE CATEGORIAS ORGANIZADO */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-rose-200/60 hover:border-red-300 rounded-xl text-xs font-black text-slate-800 transition-all cursor-pointer shadow-sm"
            >
              <Menu className="w-3.5 h-3.5 text-red-500" />
              <span>Categorias Japão</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 grid grid-cols-1 gap-0.5 text-left animate-fadeIn">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onSelectCategory(cat);
                        setIsDropdownOpen(false);
                        setActiveTab("store");
                        document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-red-50 text-red-600"
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

          {/* MENUS INSTITUCIONAIS UNIFICADOS */}
          <div className="flex gap-1.5 bg-white/90 p-1 rounded-xl border border-rose-100 shadow-sm">
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
