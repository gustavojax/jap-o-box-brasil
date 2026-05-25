import React, { useState } from "react";
import { 
  Package, 
  Truck, 
  ShoppingBag, 
  Wallet, 
  Users, 
  LifeBuoy, 
  Copy, 
  Plus, 
  ExternalLink 
} from "lucide-react";

// Tipagem para controlar qual aba está ativa
type TabOpcoes = "estoque" | "envios" | "compras" | "creditos" | "afiliados" | "suporte";

export const DashboardCliente: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabOpcoes>("estoque");
  const [suiteId] = useState("1292"); // ID de exemplo da suíte do cliente

  // Função auxiliar para copiar o endereço do galpão
  const copiarTexto = (texto: string) => {
    navigator.clipboard.writeText(texto);
    alert("Copiado para a área de transferência!");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* MENU LATERAL (Baseado estritamente na sua imagem) */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 bg-slate-950">
          <h2 className="text-xl font-bold text-white tracking-wide">Jap-o-Box</h2>
          <p className="text-xs text-red-400 font-mono mt-1">Sua Suíte: #{suiteId}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("estoque")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "estoque" ? "bg-red-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Package className="w-5 h-5" />
            Estoque
          </button>

          <button
            onClick={() => setActiveTab("envios")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "envios" ? "bg-red-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Truck className="w-5 h-5" />
            Envios
          </button>

          <button
            onClick={() => setActiveTab("compras")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "compras" ? "bg-red-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Compras
          </button>

          <button
            onClick={() => setActiveTab("creditos")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "creditos" ? "bg-red-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Wallet className="w-5 h-5" />
            Créditos
          </button>

          <button
            onClick={() => setActiveTab("afiliados")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "afiliados" ? "bg-red-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-5 h-5" />
            Afiliados
          </button>

          <button
            onClick={() => setActiveTab("suporte")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "suporte" ? "bg-red-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <LifeBuoy className="w-5 h-5" />
            Suporte
          </button>
        </nav>
      </aside>

      {/* ÁREA CENTRAL DE CONTEÚDO DINÂMICO */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl p-6 shadow-sm border border-slate-200 min-h-[500px]">
          
          {/* 1. ABA ESTOQUE */}
          {activeTab === "estoque" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Seu Estoque no Japão</h3>
                  <p className="text-sm text-slate-500">Produtos recebidos e guardados no armazém de Mie.</p>
                </div>
                <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Notificar Nova Compra
                </button>
              </div>
              <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-60 text-slate-400" />
                <p className="text-sm">Nenhum produto físico no depósito de momento.</p>
                <p className="text-xs text-slate-400 mt-1">Use o seu endereço de suíte para enviar caixas para o nosso galpão.</p>
              </div>
            </div>
          )}

          {/* 2. ABA ENVIOS */}
          {activeTab === "envios" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800 border-b pb-4">Ordens de Envio Internacional</h3>
              <p className="text-sm text-slate-600">Acompanhe o status das caixas montadas, pesadas e despachadas para o Brasil.</p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md font-semibold font-mono">CÓD: JPB-9921</span>
                  <p className="text-sm font-medium text-slate-800 mt-2">Caixa Consolidada - 2.4kg</p>
                  <p className="text-xs text-slate-400">Aguardando pagamento do frete internacional (EMS/Packet)</p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2 px-4 rounded-lg">
                  Pagar Frete
                </button>
              </div>
            </div>
          )}

          {/* 3. ABA COMPRAS (Compra Assistida) */}
          {activeTab === "compras" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800 border-b pb-4">Compra Assistida</h3>
              <p className="text-sm text-slate-500">Não consegue comprar em sites japoneses que não aceitam cartões estrangeiros? Nós compramos por si.</p>
              <div className="space-y-3 max-w-xl">
                <label className="block text-sm font-medium text-slate-700">Link do Produto no Japão (Mercari, Amazon JP, Yahoo)</label>
                <input type="text" placeholder="https://www.amazon.co.jp/..." className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-slate-50" />
                <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2.5 px-5 rounded-lg">
                  Solicitar Orçamento
                </button>
              </div>
            </div>
          )}

          {/* 4. ABA CRÉDITOS */}
          {activeTab === "creditos" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800 border-b pb-4">Sua Carteira Digital</h3>
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl max-w-sm">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Saldo Disponível</p>
                <p className="text-3xl font-bold mt-1">R$ 0,00</p>
              </div>
              <p className="text-sm text-slate-600">Adicione saldo via PIX para pagar de forma imediata o frete de caixas prontas ou serviços de recondicionamento.</p>
              <button className="bg-slate-900 text-white text-xs font-semibold py-2.5 px-4 rounded-lg hover:bg-slate-800 transition-colors">
                Adicionar Fundos
              </button>
            </div>
          )}

          {/* 5. ABA AFILIADOS */}
          {activeTab === "afiliados" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800 border-b pb-4">Programa de Afiliados Jap-o-Box</h3>
              <p className="text-sm text-slate-500">Indique amigos para importar do Japão e ganhe comissões sobre os fretes despachados por eles.</p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-md flex justify-between items-center">
                <span className="text-xs font-mono text-slate-600">https://japobox.com.br/r/suite{suiteId}</span>
                <button 
                  onClick={() => copiarTexto(`https://japobox.com.br/r/suite${suiteId}`)}
                  className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-600"
                  title="Copiar Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 6. ABA SUPORTE */}
          {activeTab === "suporte" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800 border-b pb-4">Centro de Atendimento ao Cliente</h3>
              <p className="text-sm text-slate-600">Dúvidas sobre consolidação, declaração aduaneira ou envio? A nossa equipa em Mie responde rapidamente.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 border rounded-xl hover:shadow-md transition-all">
                  <h4 className="font-semibold text-slate-800 text-sm">Abrir Ticket Interno</h4>
                  <p className="text-xs text-slate-400 mt-1">Tempo médio de resposta: 2 horas.</p>
                </div>
                <a href="https://wa.me/seu-numero" target="_blank" rel="noreferrer" className="p-4 border rounded-xl hover:shadow-md transition-all block text-left bg-green-50/50 border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm flex items-center gap-2">
                    Suporte via WhatsApp <ExternalLink className="w-3 h-3" />
                  </h4>
                  <p className="text-xs text-green-600 mt-1">Atendimento em tempo real no fuso do Brasil.</p>
                </a>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
};
