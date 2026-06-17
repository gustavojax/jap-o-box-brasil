import React, { useState, useMemo } from "react";
import { X, ShoppingBag, AlertTriangle, Loader2, Trash2, Scale } from "lucide-react";
import type { CartItem } from "../types";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Taxa de conversão (Ajuste conforme o valor do dia no seu arquivo data.ts)
const YEN_TO_BRL_RATE = 0.038; // Exemplo: 1 JPY = 0.038 BRL

interface CartDrawerProps {
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CartDrawer({ onClose, cartItems, setCartItems }: CartDrawerProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  
  // Peso estimado em gramas (padrão 500g)
  const [estimatedWeight, setEstimatedWeight] = useState<number>(500);

  // Subtotal dos produtos no carrinho
  const subtotalProdutos = useMemo(() => {
    return cartItems?.reduce((acc, item) => acc + (item?.product?.priceBRL || 0) * (item?.quantity || 1), 0) || 0;
  }, [cartItems]);

  // Função para calcular o frete em Ienes baseado no peso (proporcional a cada 100g)
  // Baseado na sua tabela: 500g = 1600~1700 JPY (aprox R$65), 1kg = 2700~2800 JPY (aprox R$105)
  // Simplificando a lógica de R$ para Ienes:
  const calculateShippingYen = (weightGrams: number) => {
    if (weightGrams <= 500) return 1700; // Aprox R$65
    if (weightGrams <= 1000) return 2750; // Aprox R$105
    if (weightGrams <= 1500) return 3900; // Aprox R$148
    if (weightGrams <= 2000) return 5000; // Aprox R$190
    
    // Para pesos maiores, segue a lógica de acréscimo proporcional
    return 5000 + (Math.ceil((weightGrams - 2000) / 100) * 250);
  };

  // Motor de cálculo dinâmico
  const calculos = useMemo(() => {
    const assessoria = 25.00; // Taxa fixa de assessoria
    
    const freteYen = calculateShippingYen(estimatedWeight);
    const valorFreteBRL = freteYen * YEN_TO_BRL_RATE;
    
    // Base de Cálculo (Valor Aduaneiro = Produtos + Frete + Assessoria)
    const valorAduaneiro = subtotalProdutos + assessoria + valorFreteBRL;
    
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
      freteYen,
      valorFreteBRL,
      impostoImportacao,
      icms,
      totalImpostos,
      totalGeral
    };
  }, [subtotalProdutos, estimatedWeight]);

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
          pesoEstimado: `${estimatedWeight}g`,
          totalEstimado: calculos.totalGeral.toFixed(2),
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
\n--- ESTIMATIVA DE ENVIO ---
\nPeso Estimado: ${estimatedWeight}g
\nFrete Internacional: ¥ ${calculos.freteYen} (R$ ${calculos.valorFreteBRL.toFixed(2)})
\nAssessoria: R$ ${calculos.assessoria.toFixed(2)}
\nEst. Impostos (II+ICMS): R$ ${calculos.totalImpostos.toFixed(2)}
\n---
\nTOTAL ESTIMADO: R$ ${calculos.totalGeral.toFixed(2)}
\n\n*Estou ciente que o valor exato do frete só será confirmado após o fechamento da caixa.*`;

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

              {/* SELETOR DE PESO ESTIMADO */}
              <div className="pt-2 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5" /> Peso Estimado do Pedido
                </label>
                <select 
                  value={estimatedWeight}
                  onChange={(e) => setEstimatedWeight(Number(e.target.value))}
                  className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value={500}>Até 500g (Média R$ 65)</option>
                  <option value={1000}>Até 1kg (Média R$ 105)</option>
                  <option value={1500}>Até 1.5kg (Média R$ 148)</option>
                  <option value={2000}>Até 2kg (Média R$ 190)</option>
                  <option value={3000}>Até 3kg (Consultar)</option>
                </select>
                <p className="text-[9px] text-slate-400 leading-tight">
                  * O frete é calculado a cada 100g. O valor exato depende do peso final da caixa.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 space-y-3">
          {/* RESUMO DE VALORES */}
          <div className="space-y-1.5 text-[11px] border-b pb-3">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal Produtos</span>
              <span>R$ {subtotalProdutos.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Assessoria Japão Box</span>
              <span>R$ {calculos.assessoria.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Frete Internacional (¥ {calculos.freteYen})</span>
              <span>R$ {calculos.valorFreteBRL.toFixed(2)}</span>
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
          
          {/* AVISO IMPORTANTE ATUALIZADO */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
            <h3 className="font-black text-amber-900 text-[10px] uppercase mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Frete Brasil ✈️
            </h3>
            <p className="text-amber-800 text-[10px] leading-tight mb-2">
              O frete é calculado por peso real. Só saberemos o valor exato após o fechamento da sua caixa. A cotação do iene é feita no dia.
            </p>
            <label className="flex items-center gap-2 text-[10px] font-bold text-amber-900 cursor-pointer">
              <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="rounded text-red-600 focus:ring-red-500" />
              Concordo com os termos e taxas.
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
              "Finalizar via WhatsApp"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
