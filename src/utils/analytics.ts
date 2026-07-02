/**
 * Utilitário para rastreamento de eventos com Google Analytics 4 e Google Ads
 * 
 * Documentação:
 * - Google Analytics: https://developers.google.com/analytics/devguides/collection/ga4
 * - Google Ads Conversion: https://support.google.com/google-ads/answer/9949814
 */

// Declaração para o TypeScript reconhecer o gtag global (vem do script no index.html)
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Registra um evento genérico no Google Analytics
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    console.log(`📊 Google Analytics Event: ${eventName}`, params);
  } else {
    console.warn("Google Analytics (gtag) não está disponível");
  }
};

/**
 * Rastreia quando um produto é adicionado ao carrinho
 * 
 * Exemplo:
 * trackAddToCart({
 *   product_id: "produto-123",
 *   product_name: "Skincare Premium",
 *   value: 99.90,
 *   currency: "BRL",
 *   quantity: 1
 * })
 */
export const trackAddToCart = (params: {
  product_id: string;
  product_name: string;
  value: number;
  currency?: string;
  quantity?: number;
}) => {
  const defaultParams = {
    currency: "BRL",
    quantity: 1,
    ...params,
  };

  trackEvent("add_to_cart", defaultParams);
  
  // Também registra no Google Ads (para remarketing)
  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      send_to: "AW-18292163095", // Seu ID de anúncio
    });
  }
};

/**
 * Rastreia o início do checkout (clique em finalizar pedido)
 * 
 * Exemplo:
 * trackBeginCheckout({
 *   items_count: 3,
 *   total_value: 299.90,
 *   currency: "BRL"
 * })
 */
export const trackBeginCheckout = (params: {
  items_count: number;
  total_value: number;
  currency?: string;
  installments?: number;
}) => {
  const defaultParams = {
    currency: "BRL",
    ...params,
  };

  trackEvent("begin_checkout", defaultParams);
};

/**
 * Rastreia uma compra/conversão completa
 * 
 * Exemplo:
 * trackPurchase({
 *   transaction_id: "pedido-123456",
 *   value: 299.90,
 *   currency: "BRL",
 *   items_count: 3,
 *   installments: 3,
 *   shipping_value: 50.00
 * })
 */
export const trackPurchase = (params: {
  transaction_id: string;
  value: number;
  currency?: string;
  items_count?: number;
  installments?: number;
  shipping_value?: number;
}) => {
  const defaultParams = {
    currency: "BRL",
    ...params,
  };

  // Evento do Google Analytics
  trackEvent("purchase", defaultParams);

  // Conversão do Google Ads
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: "AW-18292163095/MwNZCIrohskcEJeEsZJE", // Label de conversão do Google Ads
      value: defaultParams.value,
      currency: defaultParams.currency,
      transaction_id: defaultParams.transaction_id,
    });
    console.log("✅ Conversão registrada no Google Ads!");
  }
};

/**
 * Rastreia visualização de produto
 */
export const trackViewItem = (params: {
  product_id: string;
  product_name: string;
  value: number;
  category?: string;
}) => {
  trackEvent("view_item", params);
};

/**
 * Rastreia busca de produtos
 */
export const trackSearch = (params: {
  search_term: string;
  results_count?: number;
}) => {
  trackEvent("search", params);
};

/**
 * Verifica se o Google Analytics está disponível
 */
export const isGoogleAnalyticsReady = (): boolean => {
  return typeof window.gtag === "function" && !!window.dataLayer;
};
