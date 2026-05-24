export interface Order {
  id: string;
  trackingCode: string;
  customerName: string;
  status: string;
  origin: string;
  destination: string;
  createdAt: string;
}

export let orders: Order[] = [
  {
    id: "1",
    trackingCode: "JP123456",
    customerName: "Cliente Teste",
    status: "Postado no Japão",
    origin: "2-chōme-3-15 Matsutera, Yokkaichi, Mie 510-8021",
    destination: "Campinas/SP 🇧🇷",
    createdAt: "Hoje",
  },
];
