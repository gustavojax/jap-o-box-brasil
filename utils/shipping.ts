export interface ImportTaxConfig {
  importDutyRate: number;        // Imposto de Importação
  icmsRate: number;              // ICMS
  fixedFee: number;              // Taxa fixa
  currency: string;
}

export const BRAZIL_IMPORT_CONFIG: ImportTaxConfig = {
  importDutyRate: 0.60,          // 60%
  icmsRate: 0.17,                // 17%
  fixedFee: 17.40,               // R$ 17,40
  currency: 'BRL'
};

/**
 * Calcula impostos completos de importação
 */
export function calculateImportTaxes(
  productValue: number,     
  shippingCost: number = 0  
) {
  // Sua lógica atual...
  return { importDutyRate: 0, icmsRate: 0, fixedFee: 0 }; 
}

/**
 * Calcula frete + impostos para o checkout
 */
export function calculateFinalShippingWithTaxes(
  productValue: number,
  internationalShipping: number
) {
  // Sua lógica atual...
  return 0;
}

/**
 * FUNÇÃO ADICIONADA PARA RESOLVER O ERRO DO CARTDRAWER
 * Calcula o custo do frete baseado nos produtos novos que possuem frete embutido
 */
export async function getShippingCost(params: {
  country: string;
  cep?: string;
  items: any[];
}): Promise<number> {
  // Se não for para o Brasil, ou não houver itens, frete é zero ou tratado de outra forma
  if (params.country !== "BR" || !params.items || params.items.length === 0) {
    return 0;
  }

  // Como seus novos produtos no data.ts já possuem "shippingEstBRL",
  // nós somamos o frete estimado de cada item multiplicado pela sua quantidade.
  const totalShipping = params.items.reduce((acc, item) => {
    const shippingEst = item.product.shippingEstBRL || 0;
    return acc + (shippingEst * item.quantity);
  }, 0);

  // Simula um pequeno delay de rede que o useEffect do CartDrawer espera (async)
  return new Promise((resolve) => setTimeout(() => resolve(totalShipping), 100));
}

