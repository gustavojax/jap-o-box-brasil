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
    <header className="w-full bg-white border-b shadow-sm sticky top-0 z-50">

      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">

        {/* LOGO + NOME (MELHORADO) */}
        <div className="flex items-center gap-3">

          <img
            src="https://i.ibb.co/jZDQ1vd4/IMG-20260515-WA0037.jpg"
            alt="Japão Box Brasil"
            className="w-12 h-12 object-cover rounded-xl shadow-sm"
          />

          <div className="flex flex-col leading-tight">
            <span className="text-xl font-black text-slate-900">
              Japão Box Brasil
            </span>
            <span className="text-xs text-slate-500">
              Importados do Japão direto pra você 🇯🇵
            </span>
          </div>

        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Buscar produtos do Japão..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="hidden md:block border border-slate-200 rounded-xl px-4 py-2 w-96"
        />

        {/* BOTÕES DIREITA */}
        <div className="flex items-center gap-3">

          {/* LOGIN */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                Olá, {user.email}
              </span>

              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-black text-white px-5 py-2 rounded-xl text-sm"
            >
              Entrar / Cadastro
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

      {/* CATEGORIAS */}
      <div className="border-t bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-3 overflow-x-auto">

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`text-sm whitespace-nowrap px-4 py-1.5 rounded-full border ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-white"
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
