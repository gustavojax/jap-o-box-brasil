import React from "react";
import { ShoppingCart } from "lucide-react";

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
}: Props) {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">

      {/* TOP BAR PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">

        {/* LOGO MAIOR (SHOPEE STYLE) */}
        <div className="flex items-center gap-4 min-w-[240px]">

          <img
            src="https://i.ibb.co/jZDQ1vd4/IMG-20260515-WA0037.jpg"
            alt="Japão Box Brasil"
            className="w-16 h-16 rounded-xl object-cover shadow-md"
          />

          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 leading-tight">
              Japão Box Brasil
            </span>
            <span className="text-xs text-slate-500">
              Importados do Japão 🇯🇵
            </span>
          </div>

        </div>

        {/* SEARCH CENTRAL (SHOPEE FEEL) */}
        <div className="flex-1 hidden md:flex justify-center">
          <input
            type="text"
            placeholder="Buscar produtos, marcas e categorias..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full max-w-xl border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* AÇÕES (LOGIN + CARRINHO) */}
        <div className="flex items-center gap-3">

          {/* LOGIN */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold hidden sm:block">
                {user.email}
              </span>

              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-semibold"
            >
              Entrar
            </button>
          )}

          {/* CARRINHO */}
          <button
            onClick={onOpenCart}
            className="relative bg-black text-white px-5 py-2 rounded-xl flex items-center gap-2"
          >
            <ShoppingCart size={18} />
            Carrinho

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

        </div>

      </div>

      {/* CATEGORIAS (SHOPEE STYLE BAR) */}
      <div className="border-t bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-3 overflow-x-auto">

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`text-sm whitespace-nowrap px-4 py-1.5 rounded-full border transition ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white hover:border-orange-400"
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
