import React, { useState, useMemo } from "react";
import { X, ShoppingBag, Loader2, Trash2, Scale, CreditCard, ChevronDown, AlertCircle } from "lucide-react";
import type { CartItem } from "../types";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { trackAddToCart, trackBeginCheckout, trackPurchase } from "../utils/analytics";

const YEN_TO_BRL_RATE = 0.038; 

interface CartDrawerProps {
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

// Declaração para o TypeScript reconhecer o gtag global (vem do script no index.html)
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function CartDrawer({ onClose, cartItems, setCartItems }: CartDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedWeight, setEstimatedWeight] = useState<number>(500);
  const [installments, setInstallments] = useState<number>(1);
  const [showInstallmentDetails, setShowInstallmentDetails] = useState(false);
  const [showWarningBanner, setShowWarningBanner] = useState(true);

  const safeCartItems = cartItems || [];

  const subtotalProdutos = useMemo(() => {
    return safeCartItems.reduce((acc, item) => acc + (item?.product?.priceBRL || 0) * (item?.quantity || 1), 0);
  }, [safeCartItems]);

  const calculateShippingYen = (weightGrams: number) => {
    if (weightGrams <= 500) return 1700;
    if (weightGrams <= 1000) return 2750;
    if (weightGrams <= 1500) return 3900;
    if (weightGrams <= 2000) return 5000;
    return 5000 + (Math.ceil((weightGrams - 2000) / 100) * 250);
  };

  const calculos = useMemo(() => {
    const freteYen = calculateShippingYen(estimatedWeight);
    const valorFreteBRL = freteYen * YEN_TO_BRL_RATE;
    const totalGeral = subtotalProdutos + valorFreteBRL;
    const valorParcela = totalGeral / installments;
    return { freteYen, valorFreteBRL, totalGeral, valorParcela };
  }, [subtotalProdutos, estimatedWeight, installments]);

  const handleRemoveItem = (indexToRemove: number) => {
    setCartItems(prevItems => (prevItems || []).filter((_, idx) => idx !== indexToRemove));
  };

  // ==========================================
  // 🎯 RASTREAMENTO: CLIQUE EM "FINALIZAR VIA WHATSAPP"
  // ==========================================
  const handleWhatsApp = async () => {
    if (safeCartItems.length === 0) return;

    setIsSubmitting(true);
    const itemsList = safeCartItems.map(i => `${i.quantity}x ${i.product?.name}`).join("\n");
    const itemsSummary = safeCartItems.map(i => `${i.product?.name} (x${i.quantity})`).join(", ");
    const userEmail = auth?.currentUser?.email || "Cliente Web / Sem Login";
    const transactionId = `JAP-${Date.now()}`; // ID único do pedido

    try {
      // 📊 RASTREAR: Início do Checkout (clique em finalizar)
      trackBeginCheckout({
        items_count: safeCartItems.length,
        total_value: calculos.totalGeral,
        currency: "BRL",
        installments: installments,
      });

      // 💾 Salvar pedido no Firebase
      if (db) {
        await addDoc(collection(db, "orders"), {
          userId: userEmail,
          itemsSummary: itemsSummary,
          pesoEstimado: `${estimatedWeight}g`,
          totalPedido: calculos.totalGeral.toFixed(2),
          parcelamento: installments,
          valorParcela: calculos.valorParcela.toFixed(2),
          transactionId: transactionId, // ✨ Novo: ID único do pedido
          createdAt: serverTimestamp()
        });

        console.log("✅ Pedido salvo no Firebase com ID:", transactionId);
      }

      // 📊 RASTREAR: Compra/Conversão completa (Google Ads + Google Analytics)
      trackPurchase({
        transaction_id: transactionId,
        value: calculos.totalGeral,
        currency: "BRL",
        items_count: safeCartItems.length,
        installments: installments,
        shipping_value: calculos.valorFreteBRL,
      });

      console.log("✅ Conversão registrada no Google Ads e Google Analytics!");

    } catch (error) {
      console.error("Erro ao registrar pedido:", error);
    } finally {
      setIsSubmitting(false);
    }

    // 💬 Abrir WhatsApp com mensagem
    const parcelamentoMsg = installments > 1 
      ? `\n💳 Parcelado em ${installments}x de R$ ${calculos.valorParcela.toFixed(2)}`
      : "";

    const msg = `Olá! Gostaria de finalizar meu pedido:\n\n${itemsList}\n\n--- RESUMO ---\nProdutos: R$ ${subtotalProdutos.toFixed(2)}\nFrete Internacional Est.: R$ ${calculos.valorFreteBRL.toFixed(2)}${parcelamentoMsg}\n\n💰 TOTAL: R$ ${calculos.totalGeral.toFixed(2)}\n\n🆔 ID do Pedido: ${transactionId}`;

    window.open(`https://wa.me/817014074971?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-[200] flex justify-end">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-white h-full shadow-xl flex flex-col text-left">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h2 className="font-bold text-gray-700">Meu Carrinho</h2>
            <button onClick={onClose} className="p-2 cursor-pointer hover:text-gray-500"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {safeCartItems.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-medium">Seu carrinho está vazio.</div>
            ) : (
              <>
                {safeCartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border-b pb-4 items-center">
                    <img src={item.product?.image} className="w-16 h-16 object-cover rounded bg-gray-100 shrink-0" alt={item.product?.name} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 truncate">{item.product?.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Quantidade: {item.quantity || 1}</p>
                      <p className="font-bold text-gray-900 mt-1">R$ {item.product?.priceBRL?.toFixed(2) || "0.00"}</p>
                    </div>
                    <button onClick={() => handleRemoveItem(idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <div className="pt-2 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5" /> Estimativa de Frete
                  </label>
                  <select value={estimatedWeight} onChange={(e) => setEstimatedWeight(Number(e.target.value))} className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value={500}>Até 500g - R$ 65</option>
                    <option value={1000}>Até 1kg - R$ 105</option>
                    <option value={1500}>Até 1.5kg - R$ 148</option>
                    <option value={2000}>Até 2kg - R$ 190</option>
                  </select>
                </div>

                <div className="pt-2 space-y-2 bg-blue-50 p-3 rounded-xl border border-blue-200">
                  <label className="text-[10px] font-black text-blue-700 uppercase tracking-wider flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" /> Parcelamento no Cartão
                  </label>
                  <select 
                    value={installments} 
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full border border-blue-200 bg-white rounded-lg px-3 py-2 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        {num}x de R$ {(calculos.totalGeral / num).toFixed(2)}
                      </option>
                    ))}
                  </select>
                  
                  {installments > 1 && (
                    <div className="mt-2 pt-2 border-t border-blue-200 space-y-1">
                      <button
                        onClick={() => setShowInstallmentDetails(!showInstallmentDetails)}
                        className="w-full flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors"
                      >
                        <span>Ver detalhes das parcelas</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showInstallmentDetails ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showInstallmentDetails && (
                        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto bg-white rounded p-2">
                          {Array.from({ length: installments }, (_, i) => (
                            <div key={i} className="flex justify-between text-[10px] text-gray-600">
                              <span>Parcela {i + 1}</span>
                              <span className="font-bold">R$ {calculos.valorParcela.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="p-4 border-t bg-gray-50 space-y-3">
            <div className="space-y-1.5 text-xs border-b pb-3">
              <div className="flex justify-between text-gray-500"><span>Subtotal Produtos</span><span>R$ {subtotalProdutos.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Frete Internacional Est.</span><span>R$ {calculos.valorFreteBRL.toFixed(2)}</span></div>
              {installments > 1 && (
                <div className="flex justify-between text-blue-600 font-bold"><span>Valor por Parcela</span><span>R$ {calculos.valorParcela.toFixed(2)}</span></div>
              )}
            </div>
            <div className="flex justify-between font-black text-lg text-gray-900"><span>Total</span><span>R$ {calculos.totalGeral.toFixed(2)}</span></div>
            
            {showWarningBanner && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-[11px] text-blue-900">
                  <span className="font-bold block mb-1">⚠️ Aviso Importante</span>
                  <p>
                    As taxas de importação, tributos e eventuais cobranças alfandegárias são definidas pelos órgãos competentes e são de responsabilidade do comprador. A Japão Box Brasil não se responsabiliza por essas taxas adicionais.
                  </p>
                </div>
                <button
                  onClick={() => setShowWarningBanner(false)}
                  className="flex-shrink-0 text-blue-600 hover:text-blue-800 transition-colors"
                  aria-label="Fechar aviso"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <button 
              onClick={handleWhatsApp} 
              disabled={isSubmitting || safeCartItems.length === 0}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3.5 rounded-xl font-black uppercase text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Processando...</> : "Finalizar via WhatsApp"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
