{activeSubTab === "afiliados" && (
  <div className="space-y-8 animate-fadeIn">
    <div>
      <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
        <Award className="w-6 h-6 text-red-600" /> Programa de Indicações
      </h3>
      <p className="text-sm text-slate-500 mt-2">
        Indique amigos e dê a eles <span className="font-bold text-red-600">10% de desconto</span> no primeiro envio internacional. 
        Quanto mais amigos indicar, mais benefícios acumula na sua suíte!
      </p>
    </div>

    {/* Bloco de destaque do Cupom */}
    <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-8 text-white shadow-xl shadow-red-200">
      <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">Seu Cupom de Desconto</p>
      <div className="flex items-center justify-between gap-4">
        <span className="text-4xl md:text-5xl font-black tracking-tighter font-mono">
          {cupomAfiliado}
        </span>
        <button 
          onClick={() => copiarParaTransferencia(cupomAfiliado, "Cupom copiado! Partilhe com seus amigos.")}
          className="bg-white text-red-600 px-6 py-3 rounded-xl font-black text-sm hover:bg-red-50 transition-all cursor-pointer shadow-lg"
        >
          COPIAR
        </button>
      </div>
      <p className="text-[11px] mt-4 opacity-80 italic">Partilhe este código com seus amigos para que eles o utilizem no checkout.</p>
    </div>

    {/* Regras de utilização */}
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
      <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">Como funciona?</h4>
      <ul className="space-y-3">
        <li className="flex gap-3 text-xs text-slate-600">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span>O seu amigo insere o código <strong>{cupomAfiliado}</strong> no checkout da Japão Box Brasil.</span>
        </li>
        <li className="flex gap-3 text-xs text-slate-600">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span>Ele ganha 10% de desconto imediato no frete internacional do primeiro pedido.</span>
        </li>
        <li className="flex gap-3 text-xs text-slate-600">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span>Você garante a sua credibilidade como importador experiente e acumula pontos na nossa plataforma.</span>
        </li>
      </ul>
    </div>
  </div>
)}
