import React, { useState } from "react";
import { ShoppingCart, Eye, Star, X } from "lucide-react";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Sistema inteligente: se o produto não tiver imagem, exibe um placeholder elegante
  const imageUrl = product.image && product.image.trim() !== "" 
    ? product.image 
    : "https://placehold.co/400x400/f1f5f9/94a3b8?text=Imagem+em+Breve";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between text-left relative overflow-hidden h-full">
      
      {/* FRENTE DO CARD (Oculta quando os detalhes são abertos) */}
      <div className="relative aspect-square w-full bg-slate-50 p-4 flex items-center justify-center">
         {/* Tag de Avaliação */}
         <div className="absolute top-4 left-4 bg-slate-900/80 text-white text-[10px] font-black px-2.5 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm z-10">
           <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {product.rating} ({product.reviewsCount})
         </div>
         <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply" 
            loading="lazy" 
         />
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <p className="text-[9px] font-black text-[#e60012] uppercase tracking-widest mb-1">{product.category}</p>
        <p className="text-[10px] text-slate-400 font-medium mb-2">{product.jpName}</p>
        <h3 className="text-base font-black text-slate-900 leading-snug mb-2">{product.name}</h3>
        
        {/* Aqui é onde o texto é cortado visualmente na frente do card */}
        <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-6 flex-1">
          {product.description}
        </p>

        <div className="mt-auto space-y-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Preço do Produto:</p>
            <p className="text-3xl font-black text-slate-900">R$ {product.priceBRL.toFixed(2).replace('.', ',')}</p>
            <p className="text-[9px] text-slate-400 mt-1 font-medium">*Frete internacional e tributos de importação calculados no checkout.</p>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-[#e60012] hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-600/10"
            >
              <ShoppingCart className="w-4 h-4" /> Adicionar ao Carrinho
            </button>
            <button 
              onClick={() => setShowDetails(true)}
              className="w-full bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" /> Visualizar Detalhes
            </button>
          </div>
        </div>
      </div>

      {/* OVERLAY DE DETALHES (Caixa branca dinâmica que desliza por cima) */}
      <div 
        className={`absolute inset-0 bg-white z-20 transition-transform duration-300 ease-in-out flex flex-col ${showDetails ? 'translate-y-0' : 'translate-y-full'}`}
      >
         <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 shadow-sm z-10">
           <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">Descrição Completa</h4>
           <button 
             onClick={() => setShowDetails(false)} 
             className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors cursor-pointer"
           >
             <X className="w-5 h-5" />
           </button>
         </div>
         
         <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
           <p className="text-[10px] font-black text-[#e60012] mb-1 tracking-widest uppercase">{product.jpName}</p>
           <h3 className="text-lg font-black text-slate-900 leading-snug mb-4">{product.name}</h3>
           <div className="text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-wrap">
             {product.description}
           </div>
         </div>
         
         <div className="p-5 border-t border-slate-100 bg-white sticky bottom-0">
           <button 
              onClick={() => {
                onAddToCart(product);
                setShowDetails(false);
              }}
              className="w-full bg-[#e60012] hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" /> Adicionar ao Carrinho
            </button>
         </div>
      </div>

    </div>
  );
}
