import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 text-slate-600 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* MÉTODOS DE PAGAMENTO */}
        <div className="mb-12 text-center">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6">
            ✅ Formas de Pagamento
          </h3>
          <div className="flex justify-center mb-8">
            <img
              src="https://i.ibb.co/ycZcdQ8Q/6.png"
              alt="Métodos de Pagamento"
              className="max-w-2xl h-auto object-contain"
            />
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-slate-200 pt-8 mb-8"></div>

        {/* LOGO E COPYRIGHT */}
        <div className="text-center">
          <div className="mb-6">
            <img
              src="https://raw.githubusercontent.com/gustavojax/jap-o-box-brasil/main/src/assets/images/3.png"
              alt="PagBank"
              className="mx-auto h-20 w-auto object-contain"
            />
          </div>
          <p className="text-sm font-bold text-slate-600">
            © 2026 Japão Box Brasil. Todos os direitos reservados.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Desenvolvido com ❤️ para trazer o Japão até você
          </p>
        </div>
      </div>
    </footer>
  );
}
