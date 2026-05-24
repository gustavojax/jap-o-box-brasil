import React, { useState } from "react";
import { SUBSCRIPTION_BOXES } from "../data";
import { SubscriptionBox } from "../types";
import { Star, CheckCircle, Sparkles, ShoppingBag, HelpCircle, HeartHandshake } from "lucide-react";

interface SubscriptionClubProps {
  onSubscribe: (boxName: string, price: number) => void;
}

export default function SubscriptionClub({ onSubscribe }: SubscriptionClubProps) {
  const [selectedBox, setSelectedBox] = useState<SubscriptionBox | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOpenSubscribeModal = (box: SubscriptionBox) => {
    setSelectedBox(box);
    setShowSuccess(false);
  };

  const handleConfirmSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !emailInput) return;
    
    // Call props callback to trigger state updates elsewhere (e.g. alert or global notification)
    onSubscribe(selectedBox?.name || "Clube Assinatura", selectedBox?.priceMonthly || 199.90);
    setShowSuccess(true);
    
    setTimeout(() => {
      setSelectedBox(null);
      setNameInput("");
      setEmailInput("");
      setShowSuccess(false);
    }, 2500);
  };

  return (
    <section id="subscription-club-section" className="py-16 px-4 bg-radial from-slate-900 to-gray-950 text-white relative">
      {/* Visual decorative banners */}
      <div className="absolute top-20 left-12 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-12 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 font-sans">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] uppercase font-black tracking-widest mb-3 animate-pulse">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            Clube Japão Box
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Assinatura Japão Box Club 📦
          </h2>
          <p className="text-sm text-gray-300 mt-2">
            Receba mensalmente uma caixa surpresa exclusiva montada diretamente pela nossa equipe em Tóquio. Economize até 45% em taxas de importação e fretes avulsos.
          </p>
        </div>

        {/* Subscription Plan Grids */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {SUBSCRIPTION_BOXES.map((box) => (
            <div
              key={box.id}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 hover:scale-101 transition-all duration-300 flex flex-col justify-between"
            >
              
              {/* Product Card Top Stage */}
              <div className="relative">
                <img
                  src={box.image}
                  alt={box.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-48 object-cover object-center filter saturate-85 hover:saturate-100 transition-all duration-300"
                />
                
                {/* Custom Highlight Tag */}
                <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded shadow-sm">
                  {box.badge}
                </span>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent p-4">
                  <h3 className="text-xl font-extrabold tracking-tight text-white">{box.name}</h3>
                  <p className="text-xs text-rose-300 font-semibold">{box.tagline}</p>
                </div>
              </div>

              {/* Inclusions and Core Descriptions */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-6">
                
                <div className="space-y-4">
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">{box.description}</p>
                  
                  {/* Bullet Lists */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Incluso na Caixa deste Mês:</span>
                    <ul className="space-y-1.5">
                      {box.itemsIncluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                          <CheckCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pricing & Subscription Trigger */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2.5">
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase font-mono leading-none">PREÇO CLUBE MENSAL</span>
                    <div className="flex items-end gap-1 mt-0.5">
                      <span className="text-2xl font-black text-amber-300 font-mono">R$ {box.priceMonthly.toFixed(2)}</span>
                      <span className="text-[10px] text-gray-400 pb-0.5">/mês</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenSubscribeModal(box)}
                    className="px-4 py-2.5 bg-white text-slate-900 hover:bg-red-50 hover:text-red-600 font-black text-xs rounded-xl transition-all cursor-pointer shadow-md uppercase tracking-wide"
                  >
                    Fazer Parte ➔
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Club bottom support notes */}
        <div className="mt-12 p-4 bg-slate-900 border border-slate-800 rounded-xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className="text-gray-300">
              <strong>Sem Fidelidade Abusiva:</strong> Controle, pule ciclos ou cancele sua assinatura do clube a qualquer instante sem taxas de recisão direto pelo email.
            </span>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-slate-800 rounded text-[9px] text-gray-400 font-bold uppercase">CORREIOS COM SEGURO</span>
            <span className="px-2 py-0.5 bg-slate-800 rounded text-[9px] text-gray-400 font-bold uppercase">UNBOXINGS EXCLUSIVOS</span>
          </div>
        </div>

      </div>

      {/* Subscription Simulating Modal Overlay */}
      {selectedBox && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl max-w-md w-full p-6 text-white relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setSelectedBox(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white font-extrabold cursor-pointer"
            >
              ✕
            </button>

            {!showSuccess ? (
              <form onSubmit={handleConfirmSubscription} className="space-y-4">
                <div className="text-center pb-2 border-b border-white/15">
                  <span className="text-red-500 font-extrabold text-xs uppercase tracking-widest block font-mono">Assinatura Clube Japão Box</span>
                  <h3 className="text-xl font-black text-white mt-0.5">{selectedBox.name}</h3>
                  <p className="text-xs text-gray-400">Assine em 60s. O frete internacional unificado já está incluso!</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Seu Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Clara Yoshimura"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Seu Melhor Email</label>
                    <input
                      type="email"
                      required
                      placeholder="clara@gmail.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  {/* Pricing Overview Highlight */}
                  <div className="p-3 bg-red-950/20 rounded-xl border border-red-800/20 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Primeira Cobrança</span>
                      <span className="font-extrabold text-white">Hoje</span>
                    </div>
                    <span className="text-lg font-black text-amber-300 font-mono">R$ {selectedBox.priceMonthly.toFixed(2)}</span>
                  </div>

                  <p className="text-[9px] text-gray-500 leading-tight">
                    *Esta é uma transação simulada demonstrando o fluxo operacional real de cadastramento. Ao clicar abaixo, adicionaremos sua confirmação em nosso painel de controle operacional Japão Box da turma 2026.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider shadow-md select-none cursor-pointer text-center"
                >
                  Confirmar Assinatura Quinzenal / Mensal ➔
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl animate-bounce">
                  🌸
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Bem-vindo ao Japão Box Brasil!</h3>
                  <p className="text-sm text-amber-300 font-semibold mt-1">Sua caixa de {selectedBox.name} está oficializada!</p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto mt-2">
                    Enviamos um email de boas vindas para <strong>{emailInput}</strong> com os trâmites de seleção de tamanho ou preferência de snacks!
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
