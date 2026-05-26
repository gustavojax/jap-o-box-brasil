// Motor de cálculo dinâmico baseado na cotação operacional do data.ts
  const calculos = useMemo(() => {
    // 🔄 CORRIGIDO: Alterado 'quantity' para 'quantidade' para bater com o useState
    const produtoConvertido = precoYen * YEN_TO_BRL_RATE * quantidade;
    const assessoria = 25.00;
    const freteToquio = 50.00;
    const taxaCorreios = (produtoConvertido + assessoria + freteToquio) * 0.15; 
    const totalGeral = produtoConvertido + assessoria + freteToquio + taxaCorreios;

    return {
      produtoConvertido,
      assessoria,
      freteToquio,
      taxaCorreios,
      totalGeral
    };
  }, [precoYen, quantidade]);
