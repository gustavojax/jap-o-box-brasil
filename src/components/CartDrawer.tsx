import React, { useState } from "react";
import { X, Trash2, ShoppingBag, CreditCard, ShieldCheck } from "lucide-react";
import type { CartItem } from "../types";
import { auth } from "../firebase";

interface CartDrawerProps {
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CartDrawer({ onClose, cartItems, setCartItems }: CartDrawerProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.priceBRL * item.quantity, 0);
  const shippingEst = cartItems.length > 0 ? 35.00 : 0;
  const total = subtotal + shippingEst;

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleCheckoutStripe = async () => {
    if (cartItems.length === 0) return;

    if (!auth.currentUser) {
      alert("Por favor, faça login ou cadastre-se na aba 'Minha Suíte & Painel' antes de fechar o pedido!");
      onClose();
      return;
    }

    setIsProcessing(true);

    try {
      // Chamada para a rota que criamos na Vercel
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cartItems,
          orderId: "PEDIDO_" + Date.now(), 
          userEmail: auth.currentUser.email
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      // Redireciona para o Stripe
      window.location.href = data.url;

    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Erro ao conectar com o banco. Tente novamente.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-900">Seu Carrinho</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex gap-4 items-start">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl p-2"><img src={item.product.image} className="w-full h-full object-contain" /></div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{item.product.name}</h3>
                <p className="text-sm font-black text-emerald-600">R$ {item.product.priceBRL.toFixed(2)}</p>
                <div className="flex items-center gap-3 pt-2">
                   <button onClick={() => handleUpdateQuantity(item.product.id, -1)}>-</button>
                   <span className="text-xs font-bold">{item.quantity}</span>
                   <button onClick={() => handleUpdateQuantity(item.product.id, 1)}>+</button>
                   <button onClick={() => handleRemoveItem(item.product.id)} className="ml-auto text-red-500"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50 border-t">
          <div className="flex justify-between font-black text-xl mb-4">
            <span>TOTAL</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCheckoutStripe}
            disabled={isProcessing}
            className="w-full bg-[#635BFF] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2"
          >
            {isProcessing ? "Processando..." : <><CreditCard /> Pagar via Stripe</>}
          </button>
        </div>
      </div>
    </>
  );
}
