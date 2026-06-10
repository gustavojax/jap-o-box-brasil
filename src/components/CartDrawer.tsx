import React from "react";
import { X, ShoppingBag, MessageCircle, AlertTriangle, CreditCard } from "lucide-react";
import type { CartItem } from "../types";
import { auth } from "../firebase";

interface CartDrawerProps {
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CartDrawer({ onClose, cartItems, setCartItems }: CartDrawerProps) {
  const [wantsInstallments, setWantsInstallments] = React.useState(false);
  const [installments, setInstallments] = React.useState(2);

  const subtotal = cartItems?.reduce((acc, item) => acc + (item?.product?.priceBRL || 0) * (item?.quantity || 1), 0) || 0;

  const calculatePreview = () => {
    try {
      const taxaFixa = subtotal * 0.0504;
      const valorComTaxa = subtotal + taxaFixa;
      const juros = 0.0299;
      const totalParcelado = valorComTaxa * (1 + (juros * installments));
      return (totalParcelado / installments).toFixed(2).replace('.', ',');
    } catch { return "0,00"; }
  };

  const handleWhatsApp = () => {
    const itemsList = cartItems.map(i => `${i.quantity}x ${i.product?.name}`).join("\n");
    const msg = `Olá! Gostaria de finalizar meu pedido:\n\n${itemsList}\n\nTotal: R$ ${subtotal.toFixed(2)}\nParcelamento: ${wantsInstallments ? installments + 'x' : 'Pix'}`;
    window.open(`https://wa.me/817014074971?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white h-full shadow-xl flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-700">Meu Carrinho</h2>
          <button onClick={onClose} className="p-2"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems?.map((item, idx) => (
            <div key={idx} className="flex gap-4 border-b pb-4">
              <img src={item.product?.image} className="w-16 h-16 object-cover rounded" />
              <div>
                <h4 className="text-sm font-medium">{item.product?.name}</h4>
                <p className="font-bold">R$ {item.product?.priceBRL?.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-gray-50 space-y-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" checked={wantsInstallments} onChange={(e) => setWantsInstallments(e.target.checked)} />
              Parcelar no cartão
            </label>
            {wantsInstallments && (
              <div className="space-y-2">
                <select className="w-full p-2 border rounded" value={installments} onChange={(e) => setInstallments(Number(e.target.value))}>
                  {[2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}x com juros</option>)}
                </select>
                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded text-center">
                  Prévia: {installments}x de R$ {calculatePreview()}
                </div>
              </div>
            )}
          </div>

          <button onClick={handleWhatsApp} className="w-full bg-blue-600 text-white py-3 rounded font-bold uppercase text-sm">
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
