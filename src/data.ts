import { Product } from "./types";

// 🛒 Banco de dados de produtos estruturado por Macro-Departamentos e Subcategorias Premium
export const PRODUCTS: Product[] = [
  {
    id: "jp-shiseido-fino",
    name: "Máscara de Tratamento Capilar Shiseido Fino Premium Touch",
    jpName: "フィーノ プレミアムタッチ 浸透美容液ヘアマスク",
    description: "Nutrição profunda com geleia real para cabelos danificados. O Skincare capilar mais famoso do Japão.",
    priceBRL: 85.00,
    serviceFeeBRL: 30.00,
    shippingEstBRL: 45.00,
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviewsCount: 312,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 25
  },
  {
    id: "jp-biore-aqua-rich",
    name: "Protetor Solar Bioré UV Aqua Rich Watery Essence FPS 50",
    jpName: "ビオレUV アクアリッチ ウォータリーエッセンス",
    description: "Alta proteção UVA/UVB com textura ultra leve à base de água. Tecnologia de absorção invisível.",
    priceBRL: 65.00,
    serviceFeeBRL: 25.00,
    shippingEstBRL: 35.00,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviewsCount: 540,
    department: "Beleza, Higiene e Saúde",
    category: "Higiene, cuidados bucais e produtos para banho",
    stock: 40
  },
  {
    id: "jp-iwatani-kitchenware",
    name: "Fogareiro Portátil Iwatani Cassette Feu Eco Premium",
    jpName: "イワタニ カセットフー エコプレミアム",
    description: "Design de alta eficiência energética. Perfeito para culinária de mesa japonesa (Nabe/Yakiniku).",
    priceBRL: 280.00,
    serviceFeeBRL: 70.00,
    shippingEstBRL: 120.00,
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviewsCount: 76,
    department: "Casa e Cozinha",
    category: "Utensílios de cozinha (Kitchenware)",
    stock: 12
  },
  {
    id: "jp-midori-brass-pen",
    name: "Caneta de Latão Midori Brass Ballpoint Pen - Limited Edition",
    jpName: "ミドリ ブラス ボールペン ブラスプロダクト",
    description: "Papelaria técnica japonesa de luxo. Corpo em latão maciço que desenvolve pátina exclusiva com o tempo.",
    priceBRL: 190.00,
    serviceFeeBRL: 45.00,
    shippingEstBRL: 25.00,
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=500&q=80",
    rating: 5.0,
    reviewsCount: 94,
    department: "Estilo de Vida, Cultura e Exclusivos",
    category: "Papelaria (Stationery)",
    stock: 15
  }
];

// ⭐ CORREÇÃO DO ERRO DO VITE: Exportando a constante exigida pelo componente Testimonials.tsx
export const TESTIMONIALS = [
  {
    id: "1",
    name: "Gustavo Barboza",
    role: "Cliente Suíte #1292",
    comment: "Excelente serviço de redirecionamento! Minha caixa chegou de Mie até o interior de SP em 11 dias via EMS. Caixa muito bem embalada e protegida.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "2",
    name: "Mariana Silva",
    role: "Compradora Skincare",
    comment: "Estava com medo das taxas de importação atuais, mas o checkout calculou tudo certinho e chegou direto na minha porta sem nenhuma cobrança extra.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
  }
];
    
