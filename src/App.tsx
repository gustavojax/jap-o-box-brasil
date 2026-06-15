import React, { useState, useMemo, useEffect } from "react";
// ... (mantenha todos os seus imports originais)

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"store" | "redirect" | "account" | "about" | "admin">("store");
  
  // ESTADO PARA O POPUP DE TAXAS
  const [showTaxNotice, setShowTaxNotice] = useState(false);

  // ... (mantenha toda a sua lógica de Firebase, estados e funções original)

  // Dispara o aviso automaticamente quando entrar na aba de redirecionamento
  useEffect(() => {
    if (activeTab === "redirect") {
      setShowTaxNotice(true);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0 font-sans text-slate-900 antialiased">
      
      {/* POPUP DE AVISO DE TAXAS (Integração) */}
      {showTaxNotice && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl border-2 border-red-600 relative">
            <h3 className="font-black text-red-600 text-lg mb-3 flex items-center gap-2">
              📦 Aviso Importante
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed mb-6">
              Compras internacionais podem estar sujeitas à cobrança de 60% de imposto de importação, além do ICMS, que varia conforme o estado de destino.
              <br/><br/>
              Essas taxas são de responsabilidade exclusiva do comprador. A Japão Box Brasil não possui qualquer responsabilidade sobre cobranças realizadas pela alfândega ou órgãos fiscais brasileiros. Ao comprar, o cliente declara estar ciente dessas condições. 🇯🇵✨📦
            </p>
            <button 
              onClick={() => setShowTaxNotice(false)}
              className="w-full bg-red-600 text-white font-black py-3 rounded-xl hover:bg-red-700 transition-all"
            >
              ESTOU CIENTE
            </button>
          </div>
        </div>
      )}

      {/* ... (resto do seu layout: Header, Nav, Renderização das abas) */}
      
      {/* Exemplo de onde adicionar o aviso no CartDrawer se precisar também: */}
      {/* Você já fez isso no CartDrawer.tsx, então agora ele está protegido em ambos os lugares! */}
      
      {/* ... continue com o restante do seu arquivo App.tsx original ... */}
    </div>
  );
}
