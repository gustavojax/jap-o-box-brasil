import React from "react";
import { BLOG_POSTS } from "../data";
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";

export default function BlogSection() {
  return (
    <section className="w-full bg-slate-50 py-16 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* CABEÇALHO DA SEÇÃO */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Educação & Unboxing
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Desmistificando a Importação do Japão
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
            Dicas diretas do nosso armazém em Mie para você comprar com total tranquilidade, segurança e expandir seu conhecimento.
          </p>
        </div>

        {/* GRID DOS CARDS - CORRIGIDO PARA GRID AUTO-AJUSTÁVEL (AMAZON JP STYLE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left h-full"
            >
              {/* Imagem e Tag */}
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden group">
                <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {post.category}
                </div>
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback de segurança caso o link quebre novamente
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600";
                  }}
                />
              </div>

              {/* Corpo do Card */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Meta dados */}
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                  
                  {/* Título */}
                  <h3 className="text-sm font-black text-slate-950 leading-snug tracking-tight line-clamp-2 hover:text-red-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  {/* Resumo */}
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Link de Ação */}
                <div className="pt-2 border-t border-slate-50">
                  <button className="flex items-center gap-1.5 text-xs font-black text-red-600 hover:text-red-700 transition-colors uppercase tracking-wider cursor-pointer group">
                    Ler Guia Completo 
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
