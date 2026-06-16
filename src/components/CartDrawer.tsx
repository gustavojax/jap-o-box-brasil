import React, { useState, useMemo } from "react";
import { X, ShoppingBag, AlertTriangle, Loader2, Trash2, Truck } from "lucide-react";
import type { CartItem } from "../types";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Opções de frete (mesmas do BudgetModal)
const SHIPPING_OPTIONS = [
  { id: "epacket", name: "E-Packet Light (Até 2kg)", price: 64.00, time: "40 dias úteis" },
  { id: "ems", name: "EMS Express (Até 30kg)", price: 141.00, time: "15 dias úteis" },
  { id: "parcel", name: "Post Parcel (Até 30kg)", price: 178.00, time: "30 dias úteis" }
];

interface CartDrawerProps {
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CartDrawer({ onClose, cartItems, setCartItems }: CartDrawerProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [shippingMethod, setShippingMethod] = useState<string>("epacket");

  // Subtotal dos produtos no carrinho
  const subtotalProdutos = useMemo(() => {
    return cartItems?.reduce((acc, item) => acc + (item?.product?.priceBRL || 0) * (item?.quantity || 1), 0) || 0;
  }, [cartItems]);

  // Motor de cálculo dinâmico (Mesma lógica do BudgetModal)
  const calculos = useMemo(() => {
    const assessoria = 25.00; // Taxa fixa de assessoria
    const freteSelecionado = SHIPPING_OPTIONS.find(s => s.id === shippingMethod);
    const valorFrete = freteSelecionado ? freteSelecionado.price : 64.00;
    
    // Base de Cálculo (Valor Aduaneiro = Produtos + Frete + Assessoria)
    const valorAduaneiro = subtotalProdutos + assessoria + valorFrete;
    
    // Imposto de Importação (60%)
    const impostoImportacao = valorAduaneiro * 0.60;
    
    // ICMS (17% calculado "por dentro")
    const aliquotaICMS = 0.17;
    const baseCalculoICMS = (valorAduaneiro + impostoImportacao) / (1 - aliquotaICMS);
    const icms = baseCalculoICMS * aliquotaICMS;
    
    const totalImpostos = impostoImportacao + icms;
    const totalGeral = valorAduaneiro + totalImpostos;

    return {
      assessoria,
      valorFrete,
      impostoImportacao,
      icms,
      totalImpostos,
      totalGeral,
      nomeFrete: freteSelecionado?.name || "Frete Padrão"
    };
  }, [subtotalProdutos, shippingMethod]);

  const handleRemoveItem = (indexToRemove: number) => {
    setCartItems(prevItems => prevItems.filter((_, idx) => idx !== indexToRemove));
  };

  const handleWhatsApp = async () => {
    if (cartItems.length === 0 || !acceptedTerms) return;
    
    setIsSubmitting(true);
    const itemsList = cartItems.map(i => `${i.quantity}x ${i.product?.name}`).join("\n");
    const itemsSummary = cartItems.map(i => `${i.product?.name} (x${i.quantity})`).join(", ");
    const userEmail = auth?.currentUser?.email || "Cliente Web / Sem Login";

    try {
      if (db) {
        await addDoc(collection(db, "orders"), {
          userId: userEmail,
          itemsSummary: itemsSummary,
          totalEstimado: calculos.totalGeral.toFixed(2),
          freteEscolhido: calculos.nomeFrete,
          status: "pending",
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Erro ao registrar pedido:", error);
    } finally {
      setIsSubmitting(false);
    }

    const msg = `Olá! Gostaria de finalizar meu pedido:
\n${itemsList}
\n--- RESUMO DA ESTIMATIVA ---
\nProdutos: R$ ${subtotalProdutos.toFixed(2)}
\nAssessoria: R$ ${calculos.assessoria.toFixed(2)}
\nFrete (${calculos.nomeFrete}): R$ ${calculos.valorFrete.toFixed(2)}
\nEst. Impostos (II+ICMS): R$ ${calculos.totalImpostos.toFixed(2)}
\n---
\nTOTAL ESTIMADO: R$ ${calculos.totalGeral.toFixed(2)}
\n(Sujeito a conferência de peso)`;

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
            <>
              {cartItems?.map((item, idx) => (
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
              ))}

              {/* SELEÇÃO DE FRETE NO CARRINHO */}
              <div className="pt-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Escolha o Frete (JP Post)
                </label>
                <select 
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {SHIPPING_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} - R$ {opt.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 space-y-3">
          {/* RESUMO DE VALORES */}
          <div className="space-y-1.5 text-xs border-b pb-3">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal Produtos</span>
              <span>R$ {subtotalProdutos.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Assessoria Japão Box</span>
              <span>R$ {calculos.assessoria.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Frete Internacional</span>
              <span>R$ {calculos.valorFrete.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-blue-600 font-medium">
              <span>Est. Impostos (II + ICMS)</span>
              <span>R$ {calculos.totalImpostos.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between font-black text-lg text-gray-900">
            <span>Total Estimado</span>
            <span>R$ {calculos.totalGeral.toFixed(2)}</span>
          </div>
          
          {/* AVISO IMPORTANTE */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
            <h3 className="font-black text-amber-900 text-[10px] uppercase mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Atenção
            </h3>
            <p className="text-amber-800 text-[10px] leading-tight mb-2">
              Valores de frete e impostos são estimativas baseadas no peso padrão. O valor final pode variar após a pesagem real.
            </p>
            <label className="flex items-center gap-2 text-[10px] font-bold text-amber-900 cursor-pointer">
              <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="rounded text-red-600 focus:ring-red-500" />
              Estou ciente das taxas e prazos.
            </label>
          </div>

          <button 
            onClick={handleWhatsApp} 
            disabled={isSubmitting || cartItems.length === 0 || !acceptedTerms}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3.5 rounded-xl font-black uppercase text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-200"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processando...</>
            ) : (
              "Finalizar Pedido via WhatsApp"
            )}
          </button>
        </div>
      </div>
    </div>
  );
    }
