import React from "react";
import { X, ShoppingBag, Truck, Clock, MessageCircle, AlertTriangle, CreditCard } from "lucide-react";
import type { CartItem } from "../types";
import { auth } from "../firebase";

// ... (SHIPPING_OPTIONS igual ao anterior)

export default function CartDrawer({ onClose, cartItems, setCartItems }: CartDrawerProps) {
  const [selectedShipping, setSelectedShipping] = React.useState<string>("epacket");
  const [wantsInstallments, setWantsInstallments] = React.useState<boolean>(false);
  const [installments, setInstallments] = React.useState<number>(2);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.priceBRL * item.quantity, 0);
  const currentShipping = SHIPPING_OPTIONS.find(s => s.id === selectedShipping);
  const totalBase = subtotal + (currentShipping?.price || 0);

  // Lógica de cálculo conforme a imagem 189883.jpg
  // Taxa fixa 5.04% + 2.99% a.m. (Juros Simples)
  const calculateInstallmentPreview = () => {
    const taxaFixa = totalBase * 0.0504;
    const valorComTaxaFixa = totalBase + taxaFixa;
    const jurosMensal = 0.0299;
    
    // Cálculo de juros simples proporcional às parcelas
    const valorTotalParcelado = valorComTaxaFixa * (1 + (jurosMensal * installments));
    return (valorTotalParcelado / installments).toFixed(2);
  };

  const previewValue = calculateInstallmentPreview();

  const handleWhatsAppCheckout = () => {
    const itemsList = cartItems.map(i => `${i.quantity}x ${i.product.name}`).join("\n");
    const installmentMsg = wantsInstallments 
      ? `SIM, desejo parcelar em ${installments}x (Previsão: R$ ${previewValue}/parcela).` 
      : "Não, prefiro Pix.";
    
    const message = `Olá! Gostaria de finalizar meu pedido:\n\n${itemsList}\n\nTOTAL: R$ ${totalBase.toFixed(2)}\n\n*Parcelamento:* ${installmentMsg}\n\n(Ciente de que este é um valor prévio e o total será confirmado no link).`;
    const url = `https://wa.me/817014074971?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    // ... (Estrutura anterior)
    
    <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <label className="flex items-center gap-3 cursor-pointer">
         <input type="checkbox" checked={wantsInstallments} onChange={(e) => setWantsInstallments(e.target.checked)} />
         <span className="text-sm font-bold flex items-center gap-2"><CreditCard className="w-4 h-4" /> Parcelar no cartão</span>
      </label>
      
      {wantsInstallments && (
        <div className="space-y-2">
          <select 
            className="w-full p-2 border rounded-lg text-sm font-bold"
            value={installments}
            onChange={(e) => setInstallments(Number(e.target.value))}
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
              <option key={num} value={num}>{num}x</option>
            ))}
          </select>
          <div className="bg-white p-2 rounded border border-blue-100 text-[10px] text-blue-800 text-center font-bold">
            Prévia: {installments}x de R$ {previewValue.replace('.', ',')}<br/>
            <span className="font-normal opacity-80">(Valor final sujeito a confirmação)</span>
          </div>
        </div>
      )}
    </div>
    
    // ... (restante do código)
  );
}
