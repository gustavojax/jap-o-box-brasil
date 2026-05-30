import React from "react";
import { BookOpen, Calendar, Clock, ArrowRight, ChevronRight } from "lucide-react";

// ==========================================
// GUIAS REAIS (J-BEAUTY, TECNOLOGIA E IMPORTAÇÃO)
// ==========================================
const REAL_GUIDES = [
  {
    id: 1,
    title: "Guia Definitivo: Tributos e Envio Seguro via Japan Post (EMS)",
    excerpt: "Entenda o passo a passo da nossa consolidação no armazém em Mie, como sua caixa é protegida para a longa viagem e as melhores práticas para lidar com a fiscalização aduaneira brasileira. Um manual completo e transparente para você importar sem surpresas e com total segurança.",
    category: "Logística & Envios",
    date: "28 Mai, 2026",
    readTime: "6 min de leitura",
    image: "cole o link aqui", // <-- COLE O LINK DA IMAGEM AQUI
    link: "cole o link aqui"   // <-- COLE O LINK DA PÁGINA DO BLOG AQUI
  },
  {
    id: 2,
    title: "J-Beauty: O Segredo Minimalista da Pele de Porcelana (Mochi Hada)",
    excerpt: "Diferente da rotina coreana de 10 passos, o skincare japonês foca em prevenção extrema, dupla limpeza (Double Cleansing) com óleos reparadores e camadas de hidratação aquosa. Descubra a filosofia da 'Mochi Hada' e veja como começar sua rotina com produtos essenciais.",
    category: "Skincare Japonês",
    date: "22 Mai, 2026",
    readTime: "4 min de leitura",
    image: "cole o link aqui", // <-- COLE O LINK DA IMAGEM AQUI
    link: "cole o link aqui"   // <-- COLE O LINK DA PÁGINA DO BLOG AQUI
  },
  {
    id: 3,
    title: "A Revolução Medicube: Tecnologias de Clínica na sua Casa",
    excerpt: "Aparelhos de eletroporação e microcorrentes estão substituindo procedimentos invasivos. Neste artigo, desvendamos como as tecnologias do Booster Pro abrem os poros temporariamente para injetar ativos como Exossomos e DNA de Salmão (PDRN) até 700% mais fundo na derme.",
    category: "Tecnologia & Inovação",
    date: "15 Mai, 2026",
    readTime: "5 min de leitura",
    image: "cole o link aqui", // <-- COLE O LINK DA IMAGEM AQUI
    link: "cole o link aqui"   // <-- COLE O LINK DA PÁGINA DO BLOG AQUI
  }
];

export default function BlogSection() {
  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-24 border-t border-slate-200/60 relative overflow-hidden">
      
      {/* Elementos de fundo decorativos */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* CABEÇALHO DA SEÇÃO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 rounded-lg border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
              <BookOpen className="w-3.5 h-3.5" /> Manuais & Educação
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Desmistificando a importação do Japão.
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-xl">
              Conteúdos exclusivos direto do nosso armazém em Mie. Aprenda a montar sua rotina J-Beauty, conheça novas tecnologias e saiba importar com tranquilidade.
            </p>
          </div>
          
          <a href="#" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-rose-600 transition-colors group">
            Ver todos os guias 
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* GRID DOS CARDS DE CONTEÚDO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {REAL_GUIDES.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between text-left h-full group"
            >
              {/* Imagem e Tag */}
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden block">
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                  {post.category}
                </div>
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback visual de segurança para o caso do link ainda estar quebrado
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600";
                  }}
                />
              </a>

              {/* Corpo do Card */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Meta dados */}
                  <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-300" /> {post.date}
                    </span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-300" /> {post.readTime}
                    </span>
                  </div>
                  
                  {/* Título */}
                  <a href={post.link} target="_blank" rel="noopener noreferrer">
                    <h3 className="text-lg md:text-xl font-black text-slate-900 leading-snug tracking-tight line-clamp-2 group-hover:text-rose-600 transition-colors">
                      {post.title}
                    </h3>
                  </a>
                  
                  {/* Resumo */}
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Link de Ação Fixo no Rodapé do Card */}
                <div className="pt-6 border-t border-slate-100 mt-auto">
                  <a 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-black text-rose-600 hover:text-rose-700 transition-colors uppercase tracking-widest cursor-pointer w-full group/btn"
                  >
                    Acessar Guia Completo 
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Botão Mobile */}
        <div className="mt-8 flex justify-center md:hidden">
          <a href="#" className="flex items-center justify-center gap-2 text-sm font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 px-6 py-3 rounded-xl w-full transition-colors">
            Ver todos os guias
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
