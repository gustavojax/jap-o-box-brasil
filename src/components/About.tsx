import React from "react";
import { Instagram, Music } from "lucide-react";

export default function About() {
  return (
    <main className="flex-1 bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-16">
        
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 text-center">
          ✨ Bem-vindos à Japão Box Brasil ✨
        </h1>

        <div className="space-y-6 text-slate-700 font-medium text-lg leading-relaxed">
          <p>
            Olá, pessoal! Meu nome é <span className="font-bold">Paula Takashiro</span> e, como muitos de vocês já sabem, hoje moro no Japão. 🇯🇵
          </p>

          <p>
            Criei a <span className="font-bold text-red-600">Japão Box Brasil</span> porque sempre tive um sonho: facilitar o acesso dos brasileiros aos melhores produtos que o Japão tem a oferecer. Seja por um serviço de redirecionamento de compras em lojas japonesas, ou pela nossa própria loja com produtos originais, queria trazer um pedacinho do Japão até você aqui no Brasil.
          </p>

          <p>
            Cada produto é escolhido com cuidado, cada entrega é acompanhada com atenção, e cada cliente é tratado como parte da nossa família. Porque para nós, não é só um negócio — é um sonho compartilhado.
          </p>

          <p>
            Espero poder servir você e trazer um pouco da magia do Japão para sua vida.
          </p>
        </div>

        {/* ASSINATURA */}
        <div className="mt-10 pt-8 border-t-2 border-slate-200 text-center">
          <p className="text-xl font-black text-slate-900 mb-2">
            Com carinho,
          </p>
          <p className="text-2xl font-black text-red-600 mb-4">
            Paula Takashiro
          </p>
          <p className="text-sm text-slate-600 font-bold mb-6">
            Japão Box Brasil 🇯🇵❤️🇧🇷
          </p>

          {/* REDES SOCIAIS */}
          <div className="flex justify-center gap-4 pt-4">
            <a
              href="https://instagram.com/japaoboxbrasil"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all cursor-pointer"
            >
              <Instagram className="w-5 h-5 text-red-600" />
              <span className="font-bold text-slate-900">Instagram</span>
            </a>

            <a
              href="https://tiktok.com/@japaoboxbrasil"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all cursor-pointer"
            >
              <Music className="w-5 h-5 text-red-600" />
              <span className="font-bold text-slate-900">TikTok</span>
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
