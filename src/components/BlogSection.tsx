import { useState } from "react";
import { BLOG_POSTS } from "../data";
import { BlogPost } from "../types";
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";

export default function BlogSection() {
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  return (
    <section id="guides-section" className="py-16 px-4 bg-slate-50/50 border-b border-rose-100">
      <div className="max-w-7xl mx-auto font-sans">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            Guia de Importação & Dicas
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Educação & Unboxing Japão Box Brasil
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Desmistificamos o processo de importação e damos as melhores dicas diretamente de Tóquio para você comprar com tranquilidade e expandir sua cultura.
          </p>
        </div>

        {/* Blog Posts Grids */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => setReadingPost(post)}
              className="bg-white rounded-2xl border border-slate-100 hover:border-red-200 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between group"
            >
              
              <div>
                {/* Thumbnail Stage */}
                <div className="relative pt-[56.25%] overflow-hidden bg-slate-100">
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 roundedbg-black/75 backdrop-blur-md text-[9px] text-yellow-300 font-extrabold uppercase font-mono bg-slate-900 bg-opacity-70 p-2">
                    {post.category}
                  </div>
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                </div>

                {/* Content Text fields */}
                <div className="p-5 space-y-3">
                  
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-300" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight line-clamp-2 group-hover:text-red-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom footer tag */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  className="text-xs font-bold text-red-600 flex items-center gap-1 hover:text-red-500 transition-colors"
                >
                  <span>Ler Guia Completo</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Dynamic Article Reader Modal Overlay */}
        {readingPost && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 relative scrollbar-thin text-slate-800 animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
              
              <button
                onClick={() => setReadingPost(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-extrabold text-sm cursor-pointer z-10 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center border border-slate-200"
              >
                ✕
              </button>

              <div className="space-y-5">
                
                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] uppercase font-black tracking-widest font-mono">
                    {readingPost.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                    {readingPost.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Publicado em {readingPost.date}</span>
                    <span>•</span>
                    <span>{readingPost.readTime}</span>
                  </div>
                </div>

                <img
                  src={readingPost.image}
                  alt={readingPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-64 object-cover rounded-xl"
                />

                <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100/50 text-xs italic text-red-950 font-medium">
                  {readingPost.excerpt}
                </div>

                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans space-y-4 whitespace-pre-wrap pt-2">
                  {readingPost.content}
                </div>

                {/* Internal custom service redirect prompt */}
                <div className="mt-8 p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-rose-300 block uppercase">DÚVIDAS SOBRE IMPOSTO?</span>
                    <span className="text-xs font-bold text-gray-200 block">Deixe nossa assessoria especializada preparar sua importação.</span>
                  </div>
                  <button
                    onClick={() => {
                      setReadingPost(null);
                      const calcEl = document.getElementById("tax-calculator-section");
                      if (calcEl) calcEl.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-[10px] text-white font-extrabold uppercase transition-transform cursor-pointer"
                  >
                    Simular Custo Na Hora
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
