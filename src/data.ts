import { Product, BlogPost } from "./types";

// 🪙 TAXAS DE CONVERSÃO DE MOEDA (Exigido por BudgetModal.tsx e calculadoras)
export const YEN_TO_BRL_RATE = 0.035; // Valor médio de conversão do Iene (JP¥) para Real (R$)

// 🛒 Catálogo de Produtos estruturado por Departamentos Estilo Amazon JP
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

// ⭐ Depoimentos exigidos pelo componente Testimonials.tsx
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

// 📝 Constante exigida pelo componente BlogSection.tsx
export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "Como funciona o Envio Consolidado de caixas do Japão para o Brasil?",
    excerpt: "Entenda o passo a passo de como juntar suas compras feitas em lojas diferentes no nosso armazém em Mie e economizar até 60% no frete internacional.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    date: "15 Mai, 2026",
    readTime: "5 min de leitura",
    category: "Guias de Importação"
  },
  {
    id: "post-2",
    title: "Os 5 Skincares Japoneses que são febre absoluta em 2026",
    excerpt: "Descubra os detalhes tecnológicos por trás de marcas consagradas como Bioré, Hada Labo e Shiseido Fino e saiba por que a rotina de beleza japonesa é insuperável.",
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80",
    date: "10 Mai, 2026",
    readTime: "4 min de leitura",
    category: "Tendências & Cosméticos"
  }
];
