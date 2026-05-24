import React, { useState } from "react";
import { Product } from "../types";
import { Star, ShieldAlert, Sparkles, HelpCircle, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onSelectProduct }: ProductCardProps) {
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddWithFeedback = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click
    setAdding(true);
    onAddToCart(product);
    setTimeout(() => {
      setAdding(false);
    }, 1000);
  };

  const totalCalculatedBRL = product.priceBRL + product.serviceFeeBRL + product.shippingEstBRL + product.estimatedTaxBRL;

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl border border-slate-100 hover:border-red-200 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      
      {/* Product Image Stage */}
      <div className="relative pt-[100%] bg-slate-50 overflow-hidden">
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-yellow-400 font-extrabold font-sans">
          <Star className="w-3 h-3 fill-yellow-400" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-gray-300 font-medium font-mono">({product.reviewsCount})</span>
        </div>

        {/* Featured Hot Tag */}
        {product.featured && (
          <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded bg-red-600 text-white font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 animate-pulse" />
            <span>EXCLUSIVO JPN</span>
          </div>
        )}

        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Tiny Label */}
        <div className="absolute bottom-3 left-3 z-10 px-2.5 py-0.5 bg-white/90 backdrop-blur-xs text-rose-700 font-bold rounded-md text-[9px] tracking-wide uppercase">
          {product.category}
        </div>

      </div>

      {/* Description Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-1">
          {/* Japanese Alternate Title */}
          <span className="text-[10px] text-slate-400 font-mono tracking-wider block font-medium">
            {product.jpName}
          </span>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug line-clamp-2 hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Transparent Cost Breakdown Display */}
        <div className="bg-rose-50/30 rounded-xl p-3 border border-rose-100/50 space-y-1.5">
          
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Preço Base do Item (JP)</span>
            <span className="font-mono font-medium text-slate-800">R$ {product.priceBRL.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Taxa Assessoria Shopper</span>
            <span className="font-mono font-medium text-slate-800">R$ {product.serviceFeeBRL.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Frete Estimado Tóquio➔BR</span>
            <span className="font-mono font-medium text-slate-800">R$ {product.shippingEstBRL.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 items-center">
            <span className="flex items-center gap-0.5">
              Imposto Federal Est.
              <span className="text-rose-500">★</span>
            </span>
            <span className="font-mono font-semibold text-rose-600">R$ {product.estimatedTaxBRL.toFixed(2)}</span>
          </div>

          {/* Pricing Highlight Divider */}
          <div className="border-t border-rose-100 my-1 pt-1.5 flex justify-between items-end">
            <span className="text-[9px] font-bold text-slate-600 uppercase">Custo Total Chave na Mão</span>
            <div className="text-right">
              <span className="text-xs text-gray-400 line-through mr-1 font-mono">
                R$ {(totalCalculatedBRL * 1.15).toFixed(0)}
              </span>
              <span className="text-sm sm:text-base font-black text-rose-600 font-mono">
                R$ {totalCalculatedBRL.toFixed(2)}
              </span>
            </div>
          </div>

        </div>

        {/* Action button triggers */}
        <div className="grid grid-cols-1 gap-2 pt-1 font-sans">
          
          <button
            onClick={handleAddWithFeedback}
            className={`w-full py-2 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
              adding
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white hover:bg-red-500 active:scale-98 shadow-xs"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{adding ? "Adicionado! ✓" : "Comprar / Simular no Carrinho"}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="w-full py-1.5 text-slate-600 hover:text-red-600 text-[11px] font-bold transition-all text-center border border-slate-200 rounded-lg bg-slate-50 hover:bg-rose-50/50"
          >
            Visualizar Detalhes do Japão ➔
          </button>

        </div>

      </div>

    </div>
  );
}
