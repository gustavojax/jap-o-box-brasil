import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface CustomsWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  type: 'checkout' | 'redirect';
}

export default function CustomsWarningModal({ isOpen, onClose, onAccept, type }: CustomsWarningModalProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-red-600 p-6 flex items-center justify-between border-b-4 border-amber-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                ⚠️ AVISO IMPORTANTE
              </h2>
              <p className="text-xs text-amber-100 font-bold">Leia atentamente antes de prosseguir</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          
          {/* Seção 1: Responsabilidade */}
          <div className="space-y-3">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Responsabilidade Legal
            </h3>
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg">
              <p className="text-sm font-bold text-red-900 leading-relaxed">
                A <strong>Japão Box Brasil</strong> não se responsabiliza por qualquer taxa alfandegária, impostos de importação, contribuições federais ou outras despesas cobradas pela <strong>Receita Federal Brasileira</strong> sobre os produtos importados.
              </p>
            </div>
          </div>

          {/* Seção 2: Despesas Adicionais */}
          <div className="space-y-3">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Despesas Não Cobertas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: '📋', text: 'Documentação ou desembaraço aduaneiro' },
                { icon: '⏱️', text: 'Atrasos causados por inspeção alfandegária' },
                { icon: '💰', text: 'II, ICMS e PIS/COFINS federais' },
                { icon: '🔍', text: 'Despesas com liberação de encomenda' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <span className="text-xl">{item.icon}</span>
                  <p className="text-xs font-bold text-slate-700 pt-0.5">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Seção 3: Lei */}
          <div className="space-y-3">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              Legislação Aplicável
            </h3>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-xs font-bold text-blue-900 leading-relaxed">
                Conforme a <strong>Legislação Brasileira</strong> (Lei nº 6.734/1979 e Regulamentação da Receita Federal), o cliente final/importador é <strong>responsável integral</strong> pelo pagamento de todas as taxas, tributos e despesas cobradas pelas autoridades aduaneiras brasileiras.
              </p>
            </div>
          </div>

          {/* Seção 4: Confirmação */}
          <div className="space-y-3 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <h3 className="font-black text-green-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Você confirma que:
            </h3>
            <ul className="space-y-2">
              {[
                'Compreende e aceita todos os termos acima',
                'Está ciente dos riscos de tributação alfandegária',
                'Autoriza a Japão Box Brasil a prosseguir com seu pedido',
                'Assume total responsabilidade por taxas aduaneiras'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs font-bold text-green-900">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors">
            <input 
              type="checkbox" 
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-5 h-5 rounded text-red-600 cursor-pointer mt-0.5 flex-shrink-0"
            />
            <span className="text-xs font-black text-amber-900">
              Declaro que li, compreendo e <strong>ACEITO</strong> todas as condições acima descritas. Estou ciente de que qualquer taxa alfandegária ou tributária será de minha responsabilidade.
            </span>
          </label>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-900 font-black uppercase text-xs hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onAccept}
              disabled={!acceptedTerms}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black uppercase text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
            >
              ✓ Prosseguir
            </button>
          </div>

          {/* Rodapé */}
          <div className="text-center pt-4 border-t border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              © 2026 Japão Box Brasil - Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
