import { ShieldAlert, Award, Star, Compass, CheckCircle2, CreditCard } from "lucide-react";

export default function TrustBadges() {
  return (
    <section className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Core Stats / Seals Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-12">
          
          <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-100 flex flex-col justify-center items-center">
            <div className="flex items-center gap-1 text-amber-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <p className="text-xl font-extrabold text-slate-900">Score 5.0</p>
            <p className="text-xs text-slate-500 font-medium">Recomendação máxima</p>
          </div>

          <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-100 flex flex-col justify-center items-center">
            <p className="text-2xl font-black text-red-600">500+</p>
            <p className="text-sm font-bold text-slate-900 mt-1">Produtos Importados</p>
            <p className="text-xs text-slate-500">Enviados com sucesso</p>
          </div>

          <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-100 flex flex-col justify-center items-center">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-1">
              <span className="font-extrabold text-xs">JP</span>
            </div>
            <p className="text-base font-extrabold text-slate-900">Original Japão</p>
            <p className="text-xs text-slate-500">Selo holográfico garantido</p>
          </div>

          <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-100 flex flex-col justify-center items-center">
            <div className="p-1 px-2.5 bg-green-100 text-green-700 rounded-full text-[10px] uppercase font-black mb-1.5 tracking-wider">
              SEGURO EXTRA
            </div>
            <p className="text-base font-extrabold text-slate-900">Taxa Estimada</p>
            <p className="text-xs text-slate-500">Simulação transparente total</p>
          </div>

        </div>

        {/* Detailed "Why buy from us" layout */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 sm:p-10">
          <div className="text-center sm:text-left mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ⛩️ Por que comprar pelo Japão Box Brasil?
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Nossa operação de Redirecionamento e Personal Shopper foi criada para resolver os gargalos comuns que frustram os compradores brasileiros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center p-2.5 bg-red-50 text-red-600 rounded-lg">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Endereço Próprio em Tóquio</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Temos depósito próprio localizado nas proximidades de Shinjuku. Nós recebemos seus produtos, re-embalamos com material reforçado e enviamos como pessoa física se desejável para reduzir taxas.
              </p>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center justify-center p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Transparência Fiscal de Verdade</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Chega de ser surpreendido por multas de retextualização ou taxação surpresa de R$ 300 nos Correios. Nossa calculadora estima as taxas aduaneiras brasileiras no checkout, orientando como declarar de forma inteligente.
              </p>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center justify-center p-2.5 bg-rose-50 text-rose-600 rounded-lg">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Selo Antipirataria e Verificação</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                O mercado brasileiro está lotado de cópias falsificadas (bootlegs) de figuras e cosméticos com fórmulas adulteradas. Nós compramos apenas de distribuidores oficiais licenciados dentro do território japonês.
              </p>
            </div>

          </div>

          {/* Secure Payment Seals */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-slate-600 font-medium font-sans">
                Seus pagamentos são processados em gateway seguro criptografado com Pix e Cartões em até 12x.
              </span>
            </div>
            <div className="flex gap-2.5 items-center flex-wrap">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wide mr-1">Selos de Segurança:</span>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded">PIX SEGURO</span>
                <span className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded">VISA / MASTER</span>
                <span className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded">COMPRA PROTEGIDA</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
