import React from "react";
import { ShoppingCart, Eye } from "lucide-react";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // O preço exibido junta o item + sua taxa assessoria em um único valor comercial limpo
  const finalProductPrice = product.priceBRL + product.serviceFeeBRL;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
      
      {/* Imagem e Badge de Origem */}
      <div className="relative bg-slate-50 aspect-square w-full overflow-hidden flex items-center justify-center">
        <img 
          src={product.image || "/placeholder.png"} 
          alt={product.name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
          🇯🇵 MIE ➔ BR
        </span>
        <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
          ⭐ {product.rating} ({product.reviewsCount || "100+"})
        </span>
      </div>

      {/* Informações Básicas e Preço Único */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1 text-left">
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block">
            {product.category || "Importado"}
          </span>
          <p className="text-[11px] font-mono font-medium text-slate-400">{product.jpName || "日本製品"}</p>
          <h3 className="font-black text-slate-900 text-base tracking-tight leading-tight">{product.name}</h3>
          <p className="text-xs text-slate-500 line-clamp-2 pt-0.5">{product.description}</p>
        </div>

        {/* 🏷️ EXIBIÇÃO DO PREÇO: Totalmente limpa e sem planilhas de taxas */}
        <div className="pt-2 text-left">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Preço do Produto:</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-slate-900">R$ {finalProductPrice.toFixed(2)}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1 font-medium">
            *Frete internacional e tributos de importação calculados no checkout.
          </span>
        </div>

        {/* Botões de Ação Diretos */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs py-3 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm active:scale-98 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            Adicionar ao Carrinho
          </button>
          
          <button
            onClick={() => alert(`Detalhes do produto vindo direto de Mie.`)}
            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            Visualizar Detalhes
          </button>
        </div>

      </div>

    </div>
  );
}
