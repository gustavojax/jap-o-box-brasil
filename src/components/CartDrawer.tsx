import React, { useState } from "react";
import { X, ShoppingBag, MessageCircle, AlertTriangle, CreditCard } from "lucide-react";
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
  const [selectedShipping, setSelectedShipping] = useState<string>("epacket");
  const [wantsInstallments, setWantsInstallments] = useState<boolean>(false);
  const [installments, setInstallments] = useState<number>(2);

  const subtotal = cartItems?.reduce((acc, item) => acc + (item?.product?.priceBRL || 0) * (item?.quantity || 0), 0) || 0;
  const currentShipping = SHIPPING_OPTIONS.find(s => s.id === selectedShipping);
  const totalBase = subtotal + (currentShipping?.price || 0);

  // Lógica de cálculo conforme as taxas do seu PagBank
  const calculateInstallmentPreview = () => {
    try {
      if (totalBase <= 0) return "0,00";
      // Taxa fixa 5.04% + acréscimo de 2.99% a.m. (Juros Simples)
      const taxaFixa = totalBase * 0.0504;
      const valorComTaxaFixa = totalBase + taxaFixa;
      const jurosMensal = 0.0299;
      const valorTotalParcelado = valorComTaxaFixa * (1 + (jurosMensal * installments));
      return (valorTotalParcelado / installments).toFixed(2).replace('.', ',');
    } catch (e) {
      return "0,00";
    }
  };

  const handleWhatsAppCheckout = () => {
    if (!auth.currentUser) {
      alert("Por favor, faça login para salvar seu pedido!");
      return;
    }

    const itemsList = cartItems.map(i => `${i.quantity}x ${i.product?.name || "Produto"}`).join("\n");
    const installmentMsg = wantsInstallments 
      ? `SIM, desejo parcelar em ${installments}x (Prévia: R$ ${calculateInstallmentPreview()} por parcela).` 
      : "Não, prefiro Pix.";
    
    const message = `Olá! Gostaria de finalizar meu pedido:\n\n${itemsList}\n\nTOTAL: R$ ${totalBase.toFixed(2)}\n\n*Parcelamento:* ${installmentMsg}\n\n(Ciente de que impostos de importação são por minha conta e pagos na chegada ao Brasil).`;
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
          {cartItems?.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.product?.id} className="flex gap-4 p-3 bg-slate-50 rounded-xl">
                <img src={item.product?.image} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold">{item.product?.name}</h4>
                  <p className="text-sm font-black">R$ {item.product?.priceBRL?.toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-400">Carrinho vazio.</p>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 space-y-4">
          {cartItems?.length > 0 && (
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer">
                 <input type="checkbox" checked={wantsInstallments} onChange={(e) => setWantsInstallments(e.target.checked)} />
                 <span className="text-sm font-bold flex items-center gap-2"><CreditCard className="w-4 h-4" /> Parcelar no cartão</span>
              </label>
              
              {wantsInstallments && (
                <div className="space-y-2">
                  <select className="w-full p-2 border rounded-lg text-sm font-bold" value={installments} onChange={(e) => setInstallments(Number(e.target.value))}>
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => <option key={num} value={num}>{num}x</option>)}
                  </select>
                  <div className="bg-white p-2 rounded border border-blue-100 text-[10px] text-blue-800 text-center font-bold shadow-sm">
                    Prévia: {installments}x de R$ {calculateInstallmentPreview()}<br/>
                    <span className="font-normal opacity-80">(Valor final sujeito a confirmação)</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <div className="flex items-start gap-2 text-amber-900">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-tight">Impostos da Receita Federal são pagos na chegada ao Brasil.</p>
            </div>
          </div>

          <div className="flex justify-between font-black text-lg">
            <span>Total:</span>
            <span>R$ {totalBase.toFixed(2)}</span>
          </div>
          
          <button onClick={handleWhatsAppCheckout} className="w-full bg-[#25D366] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" /> Finalizar Pedido no WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}
