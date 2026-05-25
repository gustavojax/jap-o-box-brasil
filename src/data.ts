import { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "jp-shiseido-fino",
    name: "Máscara de Tratamento Capilar Shiseido Fino Premium Touch",
    jpName: "フィーノ プレミアムタッチ 浸透美容液ヘアマスク",
    description: "Uma das máscaras de tratamento mais vendidas no Japão. Nutrição profunda para cabelos danificados.",
    priceBRL: 75.00,
    serviceFeeBRL: 25.00,
    shippingEstBRL: 45.00,
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviewsCount: 312,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 15
  },
  {
    id: "jp-threeppy-totebag",
    name: "Bolsa de Ombro THREEPPY Frills Design Exclusiva",
    jpName: "THREEPPY フリル キャンバストートバッグ",
    description: "Design elegante direto da linha premium THREEPPY do grupo Daiso Japan. Acabamento reforçado.",
    priceBRL: 45.00,
    serviceFeeBRL: 15.00,
    shippingEstBRL: 35.00,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviewsCount: 42,
    department: "Estilo de Vida, Cultura e Exclusivos",
    category: "THREEPPY",
    stock: 8
  },
  {
    id: "jp-midori-md-notebook",
    name: "Caderno Técnico Midori MD Notebook - Paper A5",
    jpName: "ミドリ MDノート A5 方眼罫",
    description: "Papel de alta qualidade que evita sangramento de tinta. O favorito dos entusiastas de papelaria no Japão.",
    priceBRL: 60.00,
    serviceFeeBRL: 20.00,
    shippingEstBRL: 30.00,
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=500&q=80",
    rating: 5.0,
    reviewsCount: 88,
    department: "Estilo de Vida, Cultura e Exclusivos",
    category: "Papelaria (Stationery)",
    stock: 20
  }
];
    
