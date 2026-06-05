import React, { useState } from "react";
import { X, Trash2, ShoppingBag, CreditCard, ShieldCheck, Truck, Clock, AlertTriangle } from "lucide-react";
import type { CartItem } from "../types";
import { auth } from "../firebase";

interface CartDrawerProps {
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

// ==========================================
// CONFIGURAÇÃO DOS MÉTODOS DE ENVIO (JP POST)
// ==========================================
const SHIPPING_OPTIONS = [
  { 
    id: "epacket", 
    name: "E-Packet Light (Até 2kg)", 
    price: 64.00, 
    time: "40 dias úteis", 
    tag: "Mais Popular" 
  },
  { 
    id: "ems", 
    name: "EMS Express (Até 30kg)", 
    price: 141.00, 
    time: "15 dias úteis", 
    tag: "Rápido" 
  },
  { 
    id: "parcel", 
    name: "Post Parcel (Até 30kg)", 
    price: 178.00, 
    time: "30 dias úteis", 
    tag: "Econômico" 
  }
];

export default function CartDrawer({ onClose, cartItems, setCartItems }: CartDrawerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<string>("epacket");

  // ==========================================
  // LÓGICA FINANCEIRA E TRIBUTÁRIA
  // ==========================================
  
  // 1. Valores pagos AGORA (Loja + Frete)
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.priceBRL * item.quantity, 0);
  const currentShippingOption = SHIPPING_OPTIONS.find(s => s.id === selectedShipping);
  const shippingEst = cartItems.length > 0 ? (currentShippingOption?.price || 0) : 0;
  const total = subtotal + shippingEst; // Valor enviado para o PagBank

  // 2. Estimativa de Impostos (Pagos no BRASIL)
  const valorAduaneiro = subtotal + shippingEst; 
  const impostoImportacao = valorAduaneiro * 0.60; // 60% II
  const aliquotaICMS = 0.17; // 17% ICMS
  
  // Fórmula ICMS "por dentro"
  const baseCalculoICMS = (valorAduaneiro + impostoImportacao) / (1 - aliquotaICMS);
  const icms = baseCalculoICMS * aliquotaICMS;
  const totalImpostosEstimativa = impostoImportacao + icms;

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  // MUDANÇA AQUI: Nova função focada no PagBank
  const handleCheckoutPagBank = async () => {
    if (cartItems.length === 0) return;

    if (!auth.currentUser) {
      alert("Por favor, faça login ou cadastre-se na aba 'Minha Suíte & Painel' antes de fechar o pedido!");
      onClose();
      return;
    }

    setIsProcessing(true);

    try {
      // Vamos usar a mesma rota, mas o backend será atualizado para o PagBank
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cartItems,
          orderId: "PEDIDO_" + Date.now(), 
          userEmail: auth.currentUser.email,
          shippingMethod: currentShippingOption?.name,
          shippingCost: currentShippingOption?.price
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);
      
      // Redireciona para o link de pagamento do PagBank gerado pelo backend
      window.location.href = data.url;

    } catch (error) {
      console.error("Erro no checkout do PagBank:", error);
      alert("Erro ao gerar pagamento. Tente novamente.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col">
        
        {/* CABEÇALHO DO CARRINHO */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Seu Carrinho
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* LISTA DE PRODUTOS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {cartItems.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-medium">
              Seu carrinho está vazio.
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product.id} className="flex gap-4 items-start bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-xl p-2 flex-shrink-0">
                  <img src={item.product.image} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1">{item.product.name}</h3>
                  <p className="text-sm font-black text-slate-900">R$ {item.product.priceBRL.toFixed(2).replace('.', ',')}</p>
                  <div className="flex items-center gap-3 pt-3">
                     <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden">
                       <button onClick={() => handleUpdateQuantity(item.product.id, -1)} className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-black">-</button>
                       <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                       <button onClick={() => handleUpdateQuantity(item.product.id, 1)} className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-black">+</button>
                     </div>
                     <button onClick={() => handleRemoveItem(item.product.id)} className="ml-auto text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-colors">
                       <Trash2 className="w-4 h-4"/>
                     </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* OPÇÕES DE FRETE */}
          {cartItems.length > 0 && (
            <div className="pt-4 border-t border-slate-200 mt-6">
              <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Truck className="w-4 h-4 text-emerald-600" /> Método de Envio
              </h3>
              
              <div className="space-y-3">
                {SHIPPING_OPTIONS.map(option => (
                  <label 
                    key={option.id} 
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedShipping === option.id 
                        ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-500/10' 
                        : 'border-slate-100 hover:border-slate-200 bg-white shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-1">
                        <input 
                          type="radio" 
                          name="shipping" 
                          value={option.id} 
                          checked={selectedShipping === option.id} 
                          onChange={() => setSelectedShipping(option.id)} 
                          className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500" 
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          {option.name} 
                          {option.tag && (
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                              selectedShipping === option.id ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
                            }`}>
                              {option.tag}
                            </span>
                          )}
                        </p>
                        <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {option.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black text-slate-900">R$ {option.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RESUMO E BOTÃO DE PAGAMENTO */}
        <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] overflow-y-auto">
          {cartItems.length > 0 && (
            <>
              {/* QUADRO DE COBRANÇA IMEDIATA */}
              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between font-medium text-slate-500">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between font-medium text-slate-500">
                  <span>Frete ({currentShippingOption?.name})</span>
                  <span>R$ {shippingEst.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between font-black text-xl text-slate-900">
                  <span>TOTAL A PAGAR AGORA</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* QUADRO DE ESTIMATIVA DE IMPOSTOS NO BRASIL */}
              <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-xl mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-800 mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Impostos no Brasil (Estimativa)
                </p>
                <div className="space-y-2 text-[11px] text-amber-900/80 font-medium">
                  <div className="flex justify-between">
                    <span>Imposto de Importação (60%)</span>
                    <span>R$ {impostoImportacao.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ICMS (17% Estadual)</span>
                    <span>R$ {icms.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-amber-200/50 text-amber-900">
                    <span>Total estimado nos Correios</span>
                    <span>R$ {totalImpostosEstimativa.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                <p className="text-[9px] text-amber-700/70 mt-3 leading-relaxed">
                  *Os impostos não são cobrados agora. Esta é apenas uma simulação conforme as regras da Receita Federal. O valor oficial será cobrado pelos Correios quando a caixa chegar ao Brasil.
                </p>
              </div>
            </>
          )}

          {/* MUDANÇA AQUI: Botão com estilo focado no PagBank */}
          <button 
            onClick={handleCheckoutPagBank}
            disabled={isProcessing || cartItems.length === 0}
            className="w-full bg-[#1db76e] hover:bg-[#159a5a] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-xl shadow-[#1db76e]/20"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2"><Clock className="w-5 h-5 animate-spin" /> GERANDO PAGAMENTO...</span>
            ) : (
              <><ShieldCheck className="w-5 h-5" /> IR PARA PAGAMENTO SEGURo</>
            )}
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Aceita Pix, Boleto e Cartão de Crédito
          </div>
        </div>

      </div>
    </>
  );
}
