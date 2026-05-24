import { TESTIMONIALS } from "../data";
import { Star, ShieldCheck, Heart, User } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-16 px-4 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2.5">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            Voz dos Clientes (Social Proof)
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Quem Já Importou com a Gente Recomenda!
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Entregamos mais de 500 caixas exclusivas para colecionadores e entusiastas em todo o Brasil. Veja depoimentos reais com fotos dos recebidos e avaliações.
          </p>
        </div>

        {/* Testimonials Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-red-200 transition-all hover:-translate-y-1 duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Stars and Product Badges */}
                <div className="flex justify-between items-start gap-1">
                  <div className="flex text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black tracking-wide uppercase font-sans">
                    ✓ Verificado
                  </span>
                </div>

                {/* Comment Content */}
                <p className="text-xs text-slate-600 leading-relaxed italic font-sans">
                  "{t.comment}"
                </p>
              </div>

              {/* Verified Author Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50 mt-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h4 className="text-xs font-black text-slate-900">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-none">{t.location}</p>
                  
                  {/* Bought item tag */}
                  <span className="inline-block mt-1 text-[9px] font-mono text-medium text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">
                    Adquiriu: {t.productBought}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom micro notice of safety */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-150 rounded-full px-5 py-2.5 max-w-lg mx-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Todas as avaliações são registradas após a confirmação de recebimento no código de rastreamento dos Correios do Brasil.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
