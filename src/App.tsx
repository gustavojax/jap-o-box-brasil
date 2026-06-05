{/* RODAPÉ DO ECOSSISTEMA */}
      <footer className="w-full bg-white border-t border-slate-200 text-slate-600 pt-12 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-left">
            <h3 className="font-black text-slate-900 text-lg mb-4">Japão Box Brasil</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              Sua ponte definitiva com o mercado japonês. Facilitamos a simulação de custos, compra e o envio de caixas e produtos direto de nosso armazém em Mie para a sua casa no Brasil de forma 100% segura e transparente.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li><button onClick={handleReturnToStore} className="hover:text-slate-900 transition-colors cursor-pointer">Ver Catálogo</button></li>
              <li><button onClick={() => setActiveTab("redirect")} className="hover:text-slate-900 transition-colors cursor-pointer">Redirecionamento</button></li>
              <li><button onClick={() => setActiveTab("about")} className="hover:text-slate-900 transition-colors cursor-pointer">Sobre Nós</button></li>
              <li><button onClick={() => { if(user) { setActiveTab("account") } else { setIsAuthOpen(true) } }} className="hover:text-slate-900 transition-colors cursor-pointer">Rastrear Pedido</button></li>
            </ul>
          </div>
        </div>

        {/* BANNER DE MEIOS DE PAGAMENTO (ATUALIZADO BANDEIRAS GERAIS) */}
        <div className="max-w-4xl mx-auto px-4 mt-10 pt-8 border-t border-slate-100 flex flex-col items-center justify-center space-y-4">
          <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Aceitamos os principais meios de pagamento globais e locais</p>
          <div className="flex items-center justify-center px-8 py-2">
            <img 
              src="https://i.postimg.cc/YL0NwQVf/3.png" 
              alt="Meios de Pagamento" 
              className="h-8 md:h-10 object-contain select-none pointer-events-none"
            />
          </div>
          <p className="text-[11px] font-semibold text-slate-400 text-center max-w-lg mt-2">
            Todas as transações são criptografadas de ponta a ponta. Aceitamos pagamentos à vista via <strong className="text-slate-500">Pix e Boleto</strong>, ou parcelamento nos <strong className="text-slate-500">Cartões de Crédito</strong>.
          </p>
        </div>

        {/* CRÉDITOS E DIREITOS AUTORAIS */}
        <div className="max-w-7xl mx-auto px-4 mt-8 text-center text-xs text-slate-400 space-y-2">
          <p>© 2026 Japão Box Brasil. Todos os direitos reservados.</p>
          <p className="text-[11px] font-medium tracking-wide text-slate-500 pt-1">
            Desenvolvimento por <span className="text-slate-800 font-bold">Gustavo Jax Audiovisual</span>
          </p>
        </div>
      </footer>
