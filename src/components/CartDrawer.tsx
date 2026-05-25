import React, { useState, useMemo } from "react";
import { X, ShoppingBag, Truck, MapPin, CreditCard, ShieldAlert, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import type { CartItem } from "../types";

// 🔥 Inicialize o Stripe com sua Chave Pública (Substitua pela sua pk_live ou pk_test real)
const stripePromise = loadStripe("pk_test_SEU_PUBLIC_KEY_AQUI");

interface CartDrawerProps {
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CartDrawer({ onClose, cartItems, setCartItems }: CartDrawerProps) {
  const [step, setStep] = useState<number>(1);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Estados do formulário de entrega fornecidos pelo cliente
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"ems" | "air">("ems");

  // Função para apagar itens caso o cliente desista da compra
  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // 1. Subtotal dos Produtos (Preço base + Assessoria embutida)
  const subtotalProducts = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const singleProductPrice = item.product.priceBRL + item.product.serviceFeeBRL;
      return acc + (singleProductPrice * item.quantity);
    }, 0);
  }, [cartItems]);

  // 2. Cálculo do Frete Internacional Dinâmico baseado nos itens (Mie ➔ BR)
  const shippingCost = useMemo(() => {
    if (cartItems.length === 0) return 0;
    const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const baseRate = shippingMethod === "ems" ? 95 : 60;
    return baseRate + (totalItemsCount - 1) * 30; 
  }, [cartItems, shippingMethod]);

  // 3. Cálculo de Impostos Estimados (Regras alfandegárias vigentes do Brasil)
  const estimatedTax = useMemo(() => {
    const baseCalculo = subtotalProducts + shippingCost;
    return Math.round(baseCalculo * 0.20); 
  }, [subtotalProducts, shippingCost]);

  // 4. Custo Total Unificado Chave na Mão
  const totalOrderAmount = subtotalProducts + shippingCost + estimatedTax;

  const handleNextStep = () => {
    if (step === 2 && (!zipCode || !address || !city || !state)) {
      alert("Por favor, preencha todos os campos de entrega para calcular o frete.");
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => setStep(step - 1);

  // 🔥 INTEGRAÇÃO REAL COM O STRIPE CHECKOUT
  const handleFinalizeOrder = async () => {
    setLoadingPayment(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe falhou ao carregar.");

      // Dispara a chamada para a sua Firebase Cloud Function que cria o Checkout Session
      const response = await fetch("https://us-central1-SEU-PROJETO.cloudfunctions.net/createStripeCheckout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            name: item.product.name,
            price: item.product.priceBRL + item.product.serviceFeeBRL,
            quantity: item.quantity
          })),
          shippingCost: shippingCost,
          estimatedTax: estimatedTax
        })
      });

      const session = await response.json();

      if (session?.id) {
        // Redireciona o cliente para a página segura de pagamento do Stripe
        await stripe.redirectToCheckout({ sessionId: session.id });
      } else {
        alert("Ocorreu um erro ao gerar a sessão de pagamento. Verifique os logs.");
      }
    } catch (e) {
      console.error("Erro na integração com o Stripe Checkout:", e);
      alert("Não foi possível conectar ao Stripe. Tente novamente.");
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl relative">
        
        {/* CABEÇALHO */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-500" />
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider">Finalizar Pedido</h3>
              <p className="text-[10px] text-slate-400">Passo {step} de 3 — {step === 1 ? "Carrinho" : step === 2 ? "Entrega" : "Confirmação"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTEÚDO DINÂMICO CONFORME O PASSO */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* PASSO 1: REVISÃO DOS ITENS E REMOÇÃO */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-black text-xs uppercase text-slate-400 tracking-wider">Itens Selecionados</h4>
              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-bold">Seu carrinho está vazio.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const cleanPrice = item.product.priceBRL + item.product.serviceFeeBRL;
                    return (
                      <div key={item.product.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-xl bg-white border" />
                        <div className="flex-1 text-left min-w-0">
                          <h5 className="font-bold text-xs text-slate-950 truncate">{item.product.name}</h5>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Qtd: {item.quantity}</p>
                          <p className="text-sm font-black text-slate-900 mt-1">R$ {(cleanPrice * item.quantity).toFixed(2)}</p>
                        </div>
                        {/* 🗑️ BOTÃO DE LIXEIRA OPERACIONAL */}
                        <button 
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                          aria-label="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* PASSO 2: DADOS DE ENTREGA E MODALIDADE DE FRETE */}
          {step === 2 && (
            <div className="space-y-5 text-left">
              <h4 className="font-black text-xs uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-700" /> Endereço de Destino no Brasil
              </h4>
              
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">CEP</label>
                  <input type="text" placeholder="00000-000" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full text-xs font-bold border p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div className="col-span-8">
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Rua e Número</label>
                  <input type="text" placeholder="Av. Paulista, 1000" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full text-xs font-bold border p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div className="col-span-8">
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Cidade</label>
                  <input type="text" placeholder="São Paulo" value={city} onChange={(e) => setCity(e.target.value)} className="w-full text-xs font-bold border p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div className="col-span-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Estado</label>
                  <input type="text" placeholder="SP" value={state} onChange={(e) => setState(e.target.value)} className="w-full text-xs font-bold border p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-black text-xs uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-slate-700" /> Método de Envio Internacional
                </h4>
                <div className="space-y-2">
                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${shippingMethod === "ems" ? "border-slate-900 bg-slate-50 shadow-sm" : "border-slate-200"}`}>
                    <div className="flex items-center gap-2.5">
                      <input type="radio" name="checkout-shipping" checked={shippingMethod === "ems"} onChange={() => setShippingMethod("ems"} className="accent-slate-900" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Japan Post EMS (Expresso Aéreo)</p>
                        <p className="text-[10px] text-slate-400">7 a 15 dias úteis • Rastreamento prioritário</p>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${shippingMethod === "air" ? "border-slate-900 bg-slate-50 shadow-sm" : "border-slate-200"}`}>
                    <div className="flex items-center gap-2.5">
                      <input type="radio" name="checkout-shipping" checked={shippingMethod === "air"} onChange={() => setShippingMethod("air")} className="accent-slate-900" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Air Mail (Econômico Internacional)</p>
                        <p className="text-[10px] text-slate-400">15 a 25 dias úteis • Rastreamento padrão</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* PASSO 3: CONFIRMAÇÃO E RESUMO DOS ENCARGOS */}
          {step === 3 && (
            <div className="space-y-5 text-left">
              <h4 className="font-black text-xs uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-slate-700" /> Resumo Consolidado da Caixa
              </h4>

              <div className="p-3.5 bg-slate-50 rounded-2xl border text-xs font-medium text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block">Enviar para:</span>
                <p>{address} — {city}/{state}</p
