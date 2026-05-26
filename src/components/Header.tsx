import React, { useState } from "react";
import { ShoppingBag, User, LogOut, Menu, ChevronDown, Search, Box } from "lucide-react";

interface HeaderProps {
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  user: any;
  onLogout: () => void;
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
}: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCategoryClick = (category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectCategory(category);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique se espalhe e feche o menu na mesma hora
    setIsDropdownOpen(!isDropdownOpen);
  };

  // URL da ilustração de Sakura fornecida por você
  const bgSakuraUrl = "https://iili.io/CJpxUiu.md.png";

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm relative overflow-hidden">
      
      {/* 🌸 CAMADA DE FUNDO PREMIUM (OPACIDADE RECALIBRADA) */}
      <div 
        className="absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat mix-blend-multiply transition-opacity duration-300"
        style={{ 
          backgroundImage: `url(${bgSakuraUrl})`,
          opacity: 0.45 
        }}
      />

      {/* CONTEÚDO DO HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-3 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4 relative z-10">
        
        {/* LOGO E SEÇÃO DE USUÁRIO */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 flex-shrink-0 bg-white shadow-sm">
              <img 
                src="https://iili.io/CJbmWhP.md.jpg" 
                alt="Japão Box Brasil" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=100";
                }}
              />
            </div>
            <div className="text-left">
              <h1 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1">
                Japão Box <span className="text-red-600">Brasil</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Redirecionamento 🇯🇵 ➔ 🇧🇷</p>
            </div>
          </div>

          {/* ÍCONES DE AÇÃO RÁPIDA (MOBILE) */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={onOpenCart} 
              className="p-2 text-slate-700 bg-white/80 backdrop-blur-sm rounded-xl border relative cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-mono font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <button 
                onClick={onLogout} 
                className="p-2 text-red-600 bg-red-50 rounded-xl border border-red-100 cursor-pointer shadow-sm"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={onOpenAuth} 
                className="p-2 text-slate-700 bg-white/80 backdrop-blur-sm rounded-xl border cursor-pointer shadow-sm"
              >
                <User className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* BARRA DE PESQUISA INTELIGENTE */}
        <div className="relative flex-1 max-w-md mx-auto md:mx-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar produtos no Japão..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-left shadow-sm"
          />
        </div>

        {/* CONTROLES DE NAVEGAÇÃO E AUTENTICAÇÃO (DESKTOP) */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={onOpenCart} 
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-white transition-all cursor-pointer relative shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-slate-500" />
            Carrinho
            {cartCount > 0 && (
              <span className="bg-red-600 text-white font-mono font-black text-[10px] px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border shadow-sm">
                <Box className="w-3.5 h-3.5 text-slate-500" />
                <span className="max-w-[100px] truncate">{user.displayName || user.email}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-600 bg-white border rounded-xl hover:bg-red-50 hover:border-red-100 transition-all cursor-pointer shadow-sm"
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              Entrar / Registar
            </button>
          )}
        </div>

      </div>

      {/* 🛠️ DROPDOWN FIXADO E BLINDADO CONTRA ERROS DE CLIQUE */}
      <div className="w-full border-t border-slate-100 bg-white/60 backdrop-blur-xs px-4 py-2 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
          
          {/* BOTÃO DROPDOWN OPERACIONAL */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="w-full sm:w-auto flex items-center justify-between gap-4 px-4 py-2 bg-slate-950 border border-slate-900 rounded-xl text-xs font-black text-white shadow-md hover:bg-slate-900 transition-all cursor-pointer"
            >
              <Menu className="w-3.5 h-3.5 text-red-500" />
              <span>{selectedCategory === "Todos" ? "Categorias Japão" : selectedCategory}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* CONTAINER FLUTUANTE DA ÁRVORE DE CATEGORIAS */}
            {isDropdownOpen && (
              <>
                {/* Tela de fundo para fechar ao clicar fora */}
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsDropdownOpen(false)} />
                
                <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-80 overflow-y-auto z-50 p-2 animate-fadeIn text-left">
                  <button
                    onClick={(e) => handleCategoryClick("Todos", e)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === "Todos" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    Ver Todo o Catálogo
                  </button>
                  <div className="h-px bg-slate-100 my-1.5" />
                  {categories.filter(c => c !== "Todos").map((cat) => (
                    <button
                      key={cat}
                      onClick={(e) => handleCategoryClick(cat, e)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${selectedCategory === cat ? "bg-red-600 text-white font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* INDICADOR DE FILTRO VIGENTE */}
          <div className="text-[11px] text-slate-500 font-semibold text-center sm:text-right py-1 sm:py-0">
            Filtro Ativo: <span className="text-slate-900 font-black">{selectedCategory}</span>
          </div>

        </div>
      </div>
    </header>
  );
}
