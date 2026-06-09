import React, { useState } from "react";
import { ShoppingCart, Eye, Star, X } from "lucide-react";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!product) return null;

  const imageUrl = product.image && typeof product.image === "string" && product.image.trim() !== "" 
    ? product.image 
    : "https://placehold.co/400x400/f1f5f9/94a3b8?text=Imagem+em+Breve";

  const price = typeof product.priceBRL === "number" ? product.priceBRL : 0;

  return (
    // Adicionado h-full para garantir que cards lado a lado tenham a mesma altura
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden">
      
      {/* IMAGEM E RATING */}
      <div className="relative aspect-square w-full bg-slate-50 p-4 flex items-center justify-center">
         <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-[10px] font-black px-2.5 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm z-10">
           <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {product.rating || "5.0"} ({product.reviewsCount || 0})
         </div>
         <img 
            src={imageUrl} 
            alt={product.name || "Produto"} 
            className="w-full h-full object-contain mix-blend-multiply" 
            loading="lazy" 
         />
      </div>

      {/* CONTEÚDO */}
      <div className="p-5 flex-1 flex flex-col">
        <span className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1">{product.category || "Produto"}</span>
        <h3 className="text-sm font-black text-slate-900 leading-tight mb-2 min-h-[2.5em]">{product.name || "Sem Nome"}</h3>
        
        {/* Descrição com flex-grow para empurrar o rodapé para baixo */}
        <p className="text-xs text-slate-500 font-medium line-clamp-3 mb-4 flex-grow">
          {product.description || ""}
        </p>

        {/* RODAPÉ DO CARD */}
        <div className="mt-auto border-t border-slate-50 pt-4">
          <div className="mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Preço do produto:</p>
            <p className="text-2xl font-black text-slate-900">R$ {price.toFixed(2).replace('.', ',')}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onAddToCart(product)}
              className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
            >
              <ShoppingCart className="w-4 h-4" /> Adicionar
            </button>
            <button 
              onClick={() => setShowDetails(true)}
              className="col-span-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" /> Detalhes
            </button>
          </div>
        </div>
      </div>

      {/* OVERLAY DE DETALHES */}
      <div className={`absolute inset-0 bg-white z-20 transition-all duration-300 ease-in-out flex flex-col ${showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}>
         <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
           <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">Descrição</h4>
           <button onClick={() => setShowDetails(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
             <X className="w-4 h-4 text-slate-600" />
           </button>
         </div>
         
         <div className="p-6 overflow-y-auto flex-1">
           <h3 className="text-xl font-black text-slate-900 leading-snug mb-4">{product.name}</h3>
           <div className="text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-wrap">
             {product.description}
           </div>
         </div>
         
         <div className="p-5 border-t border-slate-100 bg-white">
           <button 
              onClick={() => { onAddToCart(product); setShowDetails(false); }}
              className="w-full bg-red-600 text-white font-black text-sm uppercase py-4 rounded-xl shadow-xl shadow-red-600/20"
           >
             Adicionar ao Carrinho
           </button>
         </div>
      </div>
    </div>
  );
}
