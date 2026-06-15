import React from "react";
import { X, ShoppingBag, MessageCircle, AlertTriangle, CreditCard, Loader2, Trash2 } from "lucide-react";
import type { CartItem } from "../types";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface CartDrawerProps {
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CartDrawer({ onClose, cartItems, setCartItems }: CartDrawerProps) {
  const [wantsInstallments, setWantsInstallments] = React.useState(false);
  const [installments, setInstallments] = React.useState(2);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false); // Novo estado de aceite

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

  const handleRemoveItem = (indexToRemove: number) => {
    setCartItems(prevItems => prevItems.filter((_, idx) => idx !== indexToRemove));
  };

  const handleWhatsApp = async () => {
    if (cartItems.length === 0 || !acceptedTerms) return; // Validação do aceite
    
    setIsSubmitting(true);
    const itemsList = cartItems.map(i => `${i.quantity}x ${i.product?.name}`).join("\n");
    const itemsSummary = cartItems.map(i => `${i.product?.name} (x${i.quantity})`).join(", ");
    const userEmail = auth?.currentUser?.email || "Cliente Web / Sem Login";

    try {
      if (db) {
        await addDoc(collection(db, "orders"), {
          userId: userEmail,
          itemsSummary: itemsSummary,
          status: "pending",
          trackingCode: "",
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Erro ao registrar pedido no Firestore:", error);
    } finally {
      setIsSubmitting(false);
    }

    const msg = `Olá! Gostaria de finalizar meu pedido:\n\n${itemsList}\n\nTotal: R$ ${subtotal.toFixed(2)}\nParcelamento: ${wantsInstallments ? installments + 'x' : 'Pix'}`;
    window.open(`https://wa.me/817014074971?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white h-full shadow-xl flex flex-col text-left">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-700">Meu Carrinho</h2>
          <button onClick={onClose} className="p-2 cursor-pointer hover:text-gray-500"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-medium">Seu carrinho está vazio.</div>
          ) : (
            cartItems?.map((item, idx) => (
              <div key={idx} className="flex gap-4 border-b pb-4 items-center">
                <img src={item.product?.image} className="w-16 h-16 object-cover rounded bg-gray-100 shrink-0" alt={item.product?.name} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 truncate">{item.product?.name}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Quantidade: {item.quantity || 1}</p>
                  <p className="font-bold text-gray-900 mt-1">R$ {item.product?.priceBRL?.toFixed(2)}</p>
                </div>
                <button onClick={() => handleRemoveItem(idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 space-y-4">
          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Total</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          
          {/* AVISO DE TAXAS E ACEITE */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
            <div className="flex items-start gap-2 text-amber-800 text-xs font-semibold mb-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <p>A Japão Box Brasil não se responsabiliza por taxas alfandegárias. Estes valores são de responsabilidade do cliente na chegada ao Brasil.</p>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="rounded text-red-600 focus:ring-red-500" />
              Li e concordo com os termos.
            </label>
          </div>

          <button 
            onClick={handleWhatsApp} 
            disabled={isSubmitting || cartItems.length === 0 || !acceptedTerms} // Botão bloqueado se não aceitar
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded font-bold uppercase text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Registrando...</>
            ) : (
              "Finalizar Pedido"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
