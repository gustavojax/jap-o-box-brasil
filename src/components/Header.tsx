import React from "react";
import { ShoppingCart } from "lucide-react";

interface Props {
  onSearchChange: (v: string) => void;
  selectedCategory: string;
  onSelectCategory: (v: string) => void;
  categories: string[];
  cartCount: number;
  onOpenCart: () => void;
  onOpenBudgetModal: () => void;
}

export default function Header({
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  cartCount,
  onOpenCart,
}: Props) {
  return (
    <header className="w-full bg-white border-b shadow-sm sticky top-0 z-50">

      {/* TOP HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">

        {/* LOGO MAIOR E MAIS PREMIUM */}
        <div className="flex items-center gap-3">

          <div className="text-3xl font-black tracking-tight text-slate-900 leading-none">
            🇯🇵 Japão Box Brasil
          </div>

        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Buscar produtos do Japão..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="hidden md:block border border-slate-200 rounded-xl px-4 py-2 w-96 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* CART */}
        <button
          onClick={onOpenCart}
          className="relative bg-black text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition"
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

      {/* CATEGORIAS */}
      <div className="border-t bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-3 overflow-x-auto">

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`text-sm whitespace-nowrap px-4 py-1.5 rounded-full border transition ${
                selectedCategory === cat
                  ? "bg-black text-white border-black"
                  : "bg-white text-slate-700 border-slate-200 hover:border-black"
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
