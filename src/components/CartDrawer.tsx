import React, { useState } from "react";
import { X, ShoppingBag, MessageCircle, AlertTriangle, CreditCard, ChevronDown } from "lucide-react";
import type { CartItem } from "../types";
import { auth } from "../firebase";

interface CartDrawerProps {
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

// ... (SHIPPING_OPTIONS e calculateInstallmentPreview mantêm-se os mesmos)

export default function CartDrawer({ onClose, cartItems, setCartItems }: CartDrawerProps) {
  const [wantsInstallments, setWantsInstallments] = useState<boolean>(false);
  const [installments, setInstallments] = useState<number>(2);

  // ... (cálculos mantidos)

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[100]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-[101] shadow-2xl flex flex-col">
        {/* Cabeçalho */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-700">Meu Carrinho</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        {/* Lista de Produtos */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item?.product?.id || Math.random()} className="flex gap-4 border-b pb-4">
                <img 
                  src={item?.product?.image || "https://placehold.co/80x80?text=Sem+foto"} 
                  className="w-20 h-20 object-cover rounded border" 
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-800">
                    {item?.product?.name || "Produto sem nome"}
                  </h4>
                  <p className="text-sm font-bold text-gray-900">
                    R$ {typeof item?.product?.priceBRL === 'number' ? item.product.priceBRL.toFixed(2) : "0,00"}
                  </p>
                  <span className="text-xs text-gray-500">Qtd: {item?.quantity || 1}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 p-4">Seu carrinho está vazio.</p>
          )}
        </div>
        

        {/* Resumo e Checkout estilo Nuvemshop */}
        <div className="p-4 border-t bg-gray-50 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold">R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
              <span>Total</span>
              <span>R$ {totalBase.toFixed(2)}</span>
            </div>
          </div>

          {/* Opção de Parcelamento */}
          <div className="bg-white p-3 rounded border shadow-sm">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
               <input type="checkbox" className="accent-blue-600" checked={wantsInstallments} onChange={(e) => setWantsInstallments(e.target.checked)} />
               <span className="text-xs font-bold text-gray-700 uppercase">Parcelar no cartão</span>
            </label>
            {wantsInstallments && (
              <select className="w-full text-sm border-gray-300 rounded p-2" value={installments} onChange={(e) => setInstallments(Number(e.target.value))}>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => <option key={n} value={n}>{n}x com juros</option>)}
              </select>
            )}
          </div>

          <button onClick={handleWhatsAppCheckout} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded uppercase text-sm tracking-wide transition-all">
            Finalizar Pedido
          </button>
          
          <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
             <CreditCard className="w-3 h-3" /> Pagamento seguro via WhatsApp
          </div>
        </div>
      </div>
    </>
  );
}
