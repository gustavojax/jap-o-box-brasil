import { ShieldCheck, ArrowDownCircle, HeartHandshake, PlaneTakeoff, Heart } from "lucide-react";

interface HeroProps {
  onScrollToCatalog: () => void;
  onOpenBudgetModal: () => void;
  onScrollToClub: () => void;
}

export default function Hero({ onScrollToCatalog, onOpenBudgetModal, onScrollToClub }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-radial from-slate-900 via-gray-950 to-black text-white px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
      {/* Decorative Traditional Japanese Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Texts - Left side (Span 7) */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/60 border border-red-800/40 rounded-full text-red-200 text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
            **🇯🇵 Encomendas Direto de Mie**
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white font-sans">
            Compre do Japão <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">
              Sem Pegadinhas
            </span> 
            <br />
            Sem Taxas Ocultas!
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto lg:mx-0 font-sans font-medium leading-relaxed">
            **Nós compramos em lojas físicas ou direto de sites japoneses rústicos, preparamos a caixa no nosso armazém japonês localizado em Mie e despachamos direto para seu endereço no Brasil. Você simula o preço exato com impostos estimados antes de pagar!**
          </p>

          {/* Social proof quick indicators */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs py-2">
            <div className="flex items-center gap-1 text-yellow-400">
              <span className="font-extrabold text-sm text-yellow-300">★ 5.0</span>
              <span className="text-gray-400 font-bold">(420+ avaliações reais)</span>
            </div>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <div className="text-gray-300 font-medium">📦 500+ produtos enviados com rastreabilidade total</div>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <div className="text-red-400 font-bold">⛩️ Japão Original Garantido</div>
          </div>

          {/* Core Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3">
            <button
              onClick={onScrollToCatalog}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-sm rounded-xl cursor-pointer hover:from-red-500 hover:to-rose-500 hover:scale-102 transition-all shadow-lg hover:shadow-red-900/30 font-sans tracking-wide uppercase"
            >
              Explorar Catálogo 🛍️
            </button>
            <button
              onClick={onOpenBudgetModal}
              className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm rounded-xl cursor-pointer hover:scale-102 transition-all font-sans"
            >
              Pedido Personalizado do Shopper ✈️
            </button>
            <button
              onClick={onScrollToClub}
              className="w-full sm:w-auto px-6 py-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-sm rounded-xl cursor-pointer transition-all font-sans"
            >
              Conhecer Clube de Assinatura 🌸
            </button>
          </div>

          {/* Quick core values of our platform */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5 max-w-lg mx-auto lg:mx-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/5 rounded-lg text-red-400 flex-shrink-0">
                <PlaneTakeoff className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-none">Rastreio Inteligente</p>
                <p className="text-[10px] text-gray-400">Postagem em tempo real</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/5 rounded-lg text-amber-400 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-none">100% Declarado</p>
                <p className="text-[10px] text-gray-400">Sem multas surpresa</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
              <div className="p-2 bg-white/5 rounded-lg text-rose-400 flex-shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-none">Seguro Total</p>
                <p className="text-[10px] text-gray-400">Reembolso em roubos</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right graphic presentation card (Span 5) */}
        <div className="lg:col-span-5 relative">
          
          {/* Main Visual container representing a Premium Package with icons */}
          <div className="relative bg-gradient-to-tr from-slate-900 to-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden group">
            
            {/* Background elements resembling Japanese stamps */}
            <div className="absolute top-2 right-2 border-2 border-dashed border-red-500/20 text-red-500/20 font-black font-mono text-[9px] px-2 py-1 rotate-12 select-none uppercase">
              **MIE WAREHOUSE - INT**
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-wider block w-fit">
                  EXCLUSIVIDADE
                </span>
                <h4 className="text-lg font-black text-white mt-1">Como Comprar?</h4>
              </div>
              <span className="text-xs font-mono text-gray-400">Japão ➔ Brasil</span>
            </div>

            {/* Step list layout */}
            <div className="space-y-4">
              
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Escolha ou Peça seu Item</p>
                  <p className="text-[10px] text-gray-400">Selecione os produtos disponíveis ou envie o link japonês do item que você sonha.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Calculamos Todos Custos na Hora</p>
                  <p className="text-[10px] text-gray-400">Custo do produto + taxa de serviço fixa + frete internacional + simulação transparente de impostos.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-xs font-bold text-white">**Compramos e Despachamos de Mie**</p>
                  <p className="text-[10px] text-gray-400">**Nossa equipe em Mie valida o estado do produto, tira fotos de confirmação e envia com código rastreável rápido.**</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Retire em sua Casa</p>
                  <p className="text-[10px] text-gray-400">**Acompanhe pelo app o trajeto Mie - Curitiba - Sua Cidade de forma transparente de ponta a ponta.**</p>
                </div>
              </div>

            </div>

            {/* Quick interactive alert badge inside */}
            <div className="mt-6 p-3 bg-red-950/40 border border-red-600/30 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-red-200 block">Deseja um Orçamento?</span>
                <span className="text-[10px] text-gray-400 font-sans block">Paste link do Yahoo Auctions, Mercari JP, etc.</span>
              </div>
              <button 
                onClick={onOpenBudgetModal}
                className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition-transform cursor-pointer"
              >
                Simular ✈️
              </button>
            </div>

          </div>

          {/* Floating graphic element representing real shipping label */}
          <div className="absolute -bottom-4 -right-1.5 bg-white text-gray-900 border border-gray-100 rounded-xl p-3 shadow-xl max-w-[200px] hidden md:block">
            <div className="flex items-center gap-1.5 border-b border-gray-100 pb-1.5 mb-1.5">
              <div className="w-3.5 h-3.5 bg-red-500 rounded-full"></div>
              <span className="text-[9px] font-mono font-bold text-gray-400 tracking-wider">JAPAN POST EMS</span>
            </div>
            <div className="text-left space-y-1">
              <span className="text-[11px] font-black text-gray-800 block">**MIE ➔ SÃO PAULO**</span>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold block">✓ RASTREIO ATIVO</span>
              <div className="w-full bg-gray-100 h-1 rounded overflow-hidden">
                <div className="bg-red-500 h-full w-2/3"></div>
              </div>
            </div>
          </div>

          {/* Pure Floating Sakura Leaf Icons */}
          <div className="absolute -top-6 -left-6 text-red-400/20 text-3xl font-bold select-none rotate-45">🌸</div>
          <div className="absolute bottom-10 -left-12 text-pink-400/10 text-4xl font-bold select-none -rotate-12">🌸</div>

        </div>

      </div>

      {/* Bounce indicators pointing to catalog */}
      <div className="flex justify-center mt-12">
        <button 
          onClick={onScrollToCatalog}
          className="flex flex-col items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <span>Conheça os Destaques & Catálogo</span>
          <ArrowDownCircle className="w-5 h-5 text-red-500 animate-bounce" />
        </button>
      </div>

    </div>
  );
            }
              
