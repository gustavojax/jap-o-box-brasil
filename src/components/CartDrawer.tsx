import React from "react";
import { X, ShoppingBag, MessageCircle, AlertTriangle, CreditCard, Loader2 } from "lucide-react";
import type { CartItem } from "../types";
import { auth, db } from "../firebase"; // Importado o db do Firebase
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Importadas as funções do Firestore

interface CartDrawerProps {
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CartDrawer({ onClose, cartItems, setCartItems }: CartDrawerProps) {
  const [wantsInstallments, setWantsInstallments] = React.useState(false);
  const [installments, setInstallments] = React.useState(2);
  const [isSubmitting, setIsSubmitting] = React.useState(false); // Estado para o loading do botão

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

  const handleWhatsApp = async () => {
    if (cartItems.length === 0) return;
    
    setIsSubmitting(true);

    // 1. Monta a lista legível para o resumo do armazém e mensagem
    const itemsList = cartItems.map(i => `${i.quantity}x ${i.product?.name}`).join("\n");
    const itemsSummary = cartItems.map(i => `${i.product?.name} (x${i.quantity})`).join(", ");

    // 2. Tenta capturar o email do usuário logado (se houver) ou define um padrão descritivo
    const userEmail = auth?.currentUser?.email || "Cliente Web / Sem Login";

    try {
      // 3. Registra a compra na coleção "orders" do Firestore
      if (db) {
        await addDoc(collection(db, "orders"), {
          userId: userEmail,
          itemsSummary: itemsSummary,
          status: "pending", // Entra como PROCESSANDO no painel armazém
          trackingCode: "",   // Começa vazio aguardando postagem
          createdAt: serverTimestamp() // Data e hora do servidor para ordenação exata
        });
        console.log("Pedido registrado com sucesso no painel armazém!");
      }
    } catch (error) {
      // Mesmo se o banco falhar por algum motivo de rede, o cliente não perde a compra
      console.error("Erro ao registrar pedido no Firestore:", error);
    } finally {
      setIsSubmitting(false);
    }

    // 4. Dispara a mensagem e redireciona para o WhatsApp
    const msg = `Olá! Gostaria de finalizar meu pedido:\n\n${itemsList}\n\nTotal: R$ ${subtotal.toFixed(2)}\nParcelamento: ${wantsInstallments ? installments + 'x' : 'Pix'}`;
    window.open(`https://wa.me/817014074971?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white h-full shadow-xl flex flex-col text-left">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-700">Meu Carrinho</h2>
          <button onClick={onClose} className="p-2"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-medium">
              Seu carrinho está vazio.
            </div>
          ) : (
            cartItems?.map((item, idx) => (
              <div key={idx} className="flex gap-4 border-b pb-4">
                <img src={item.product?.image} className="w-16 h-16 object-cover rounded bg-gray-100" alt={item.product?.name} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 truncate">{item.product?.name}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Quantidade: {item.quantity || 1}</p>
                  <p className="font-bold text-gray-900 mt-1">R$ {item.product?.priceBRL?.toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 space-y-4">
          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Total</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
              <input type="checkbox" checked={wantsInstallments} onChange={(e) => setWantsInstallments(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
              Parcelar no cartão
            </label>
            {wantsInstallments && (
              <div className="space-y-2">
                <select className="w-full p-2 border rounded bg-white text-sm font-medium" value={installments} onChange={(e) => setInstallments(Number(e.target.value))}>
                  {[2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}x com juros</option>)}
                </select>
                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded text-center font-semibold">
                  Prévia: {installments}x de R$ {calculatePreview()}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleWhatsApp} 
            disabled={isSubmitting || cartItems.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded font-bold uppercase text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registrando Caixa...
              </>
            ) : (
              "Finalizar Pedido"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
