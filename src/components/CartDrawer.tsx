import React from "react";
import { X, ShoppingBag, Truck, Clock, MessageCircle, AlertTriangle } from "lucide-react";
import type { CartItem } from "../types";
import { auth } from "../firebase";

interface CartDrawerProps {
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const SHIPPING_OPTIONS = [
  { id: "epacket", name: "E-Packet Light", price: 64.00, time: "40 dias úteis" },
  { id: "ems", name: "EMS Express", price: 141.00, time: "15 dias úteis" },
  { id: "parcel", name: "Post Parcel", price: 178.00, time: "30 dias úteis" }
];

export default function CartDrawer({ onClose, cartItems, setCartItems }: CartDrawerProps) {
  const [selectedShipping, setSelectedShipping] = React.useState<string>("epacket");

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.priceBRL * item.quantity, 0);
  const currentShipping = SHIPPING_OPTIONS.find(s => s.id === selectedShipping);
  const total = subtotal + (currentShipping?.price || 0);

  const handleWhatsAppCheckout = () => {
    if (!auth.currentUser) {
      alert("Por favor, faça login para salvar seu pedido!");
      return;
    }

    const itemsList = cartItems.map(i => `${i.quantity}x ${i.product.name}`).join("\n");
    const message = `Olá! Gostaria de finalizar meu pedido:\n\n${itemsList}\n\nEnvio: ${currentShipping?.name}\nSubtotal: R$ ${subtotal.toFixed(2)}\nFrete: R$ ${currentShipping?.price.toFixed(2)}\nTOTAL: R$ ${total.toFixed(2)}\n\n(Ciente de que impostos de importação são por minha conta e pagos na chegada ao Brasil).`;
    
    const url = `https://wa.me/817014074971?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-black text-lg flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Carrinho</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex gap-4 p-3 bg-slate-50 rounded-xl">
              <img src={item.product.image} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <h4 className="text-xs font-bold">{item.product.name}</h4>
                <p className="text-sm font-black">R$ {item.product.priceBRL.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-100 space-y-4">
          {/* Box de Alerta de Impostos */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <div className="flex items-start gap-2 text-amber-900">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight">
                <p className="font-black uppercase mb-1">Atenção: Importação</p>
                <p>O valor total aqui pago refere-se apenas ao produto e frete. Impostos de importação (Receita Federal) são de responsabilidade do comprador e pagos na chegada ao Brasil.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between font-black text-lg">
            <span>Total (Prod + Frete):</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleWhatsAppCheckout}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <MessageCircle className="w-5 h-5" /> Finalizar Pedido no WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}
