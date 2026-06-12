import React from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

// ==========================================
// GUIA OFICIAL JAPAN POST
// ==========================================
const REAL_GUIDES = [
  {
    id: 1,
    title: "Japan Post: Envio Internacional Seguro do Japão para o Brasil",
    excerpt:
      "A Japan Post é uma das principais operadoras postais do Japão e oferece serviços internacionais confiáveis para envio de encomendas ao Brasil. Com opções como EMS, Air Mail e Surface Mail, é possível escolher a modalidade ideal de acordo com prazo e custo. Entenda como funciona o processo de envio, rastreamento, embalagem e entrega internacional.",
    category: "Logística Internacional",
    date: "12 Jun, 2026",
    readTime: "5 min de leitura",
    image: "https://i.postimg.cc/cCgVnbFM/japan-post.jpg",
    link: "https://www.post.japanpost.jp/service/send/oversea/use/howto/index_pt.html",
  },
];

export default function BlogSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full mb-4">
            <BookOpen className="w-4 h-4" />
            <span className="font-medium">Guia Oficial</span>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Japan Post
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Informações sobre os serviços de envio internacional da Japan Post,
            uma das formas mais utilizadas para transportar encomendas do Japão
            para diversos países, incluindo o Brasil.
          </p>
        </div>

        {/* Card */}
        <div className="max-w-5xl mx-auto">
          {REAL_GUIDES.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="grid md:grid-cols-2">
                {/* Imagem */}
                <div className="relative h-72 md:h-auto">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Conteúdo */}
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex w-fit items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-4">
                    {guide.category}
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {guide.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {guide.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {guide.date}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {guide.readTime}
                    </div>
                  </div>

                  <a
                    href={guide.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors w-fit"
                  >
                    Saiba Mais
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé */}
        <div className="text-center mt-10">
          <a
            href="https://www.post.japanpost.jp/english/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700"
          >
            Site Oficial da Japan Post
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
