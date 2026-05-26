import { Product, BlogPost } from "./types";

// 🪙 TAXAS DE CONVERSÃO DE MOEDA (Exigido por BudgetModal.tsx e calculadoras)
export const YEN_TO_BRL_RATE = 0.035; // Valor médio de conversão do Iene (JP¥) para Real (R$)

// 🛒 Catálogo de Produtos estruturado por Departamentos Estilo Amazon JP
export const PRODUCTS: Product[] = [
  // 🧴 SEÇÃO: SKIN CARE
  {
    id: "senka-perfect-whip",
    name: "Senka Perfect Whip",
    jpName: "専科 パーフェクトホイップ",
    description: "Espuma de limpeza facial mais vendida do Japão. Cria uma espuma rica e cremosa que limpa profundamente sem ressecar a pele.",
    priceBRL: 54.90,
    serviceFeeBRL: 20.00,
    shippingEstBRL: 35.00,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 245,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 30
  },
  {
    id: "keana-rice-pack",
    name: "Keana Rice Pack",
    jpName: "毛穴撫子 お米のパック",
    description: "Máscara facial de arroz japonês 100%. Auxilia no controle de poros, uniformiza o tom e deixa a pele mais lisa e iluminada.",
    priceBRL: 85.90,
    serviceFeeBRL: 25.00,
    shippingEstBRL: 40.00,
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviewsCount: 188,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 20
  },
  {
    id: "numbuzin-no9-mask",
    name: "Numbuzin No.9 Mask",
    jpName: "ナンバーズイン 9番 シートマスク",
    description: "Máscara lifting com NMN + 50 Peptídeos. Efeito firmador, melhora elasticidade e combate sinais de envelhecimento.",
    priceBRL: 65.90,
    serviceFeeBRL: 20.00,
    shippingEstBRL: 30.00,
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviewsCount: 95,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 15
  },
  {
    id: "celimax-retinol-shot",
    name: "Celimax Retinol Shot Tightening Serum",
    jpName: "セリマックス レチノール美容液",
    description: "Sérum com Retinol que firma a pele, reduz linhas finas e melhora a textura.",
    priceBRL: 138.90,
    serviceFeeBRL: 35.00,
    shippingEstBRL: 45.00,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 112,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 18
  },
  {
    id: "celimax-pore-brightening",
    name: "Celimax Pore Brightening Spot Care Cream",
    jpName: "セリマックス ブライトニングクリーム",
    description: "Creme clareador para poros e manchas com Niacinamida + Ácido Tranexâmico.",
    priceBRL: 112.90,
    serviceFeeBRL: 30.00,
    shippingEstBRL: 45.00,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewsCount: 74,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 22
  },
  {
    id: "celimax-retinal-booster",
    name: "Celimax Retinal Shot Tightening Booster",
    jpName: "セリマックス レチナールブースター",
    description: "Booster potente com Retinal. Promove firmeza intensa e melhora rugas.",
    priceBRL: 128.90,
    serviceFeeBRL: 35.00,
    shippingEstBRL: 45.00,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 130,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 14
  },

  // 🛍️ SEÇÃO: ACESSÓRIOS
  {
    id: "refa-heart-comb-silver-gold",
    name: "ReFa Heart Comb (Silver/Gold)",
    jpName: "リファハートコーム シルバー/ゴールド",
    description: "Pente massajador capilar ReFa em formato de coração. Estimula o couro cabeludo, melhora a circulação e promove brilho e vitalidade aos fios.",
    priceBRL: 182.00,
    serviceFeeBRL: 45.00,
    shippingEstBRL: 35.00,
    image: "https://images.unsplash.com/photo-1590156546746-c58a897bb75b?w=500&auto=format&fit=crop&q=80",
    rating: 5.0,
    reviewsCount: 320,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 40
  },
  {
    id: "refa-heart-comb-red",
    name: "ReFa Heart Comb (Red)",
    jpName: "リファハートコーム レッド",
    description: "Pente massajador capilar ReFa em formato de coração na cor vermelha. Estimula o couro cabeludo, melhora a circulação e promove brilho e vitalidade aos fios.",
    priceBRL: 149.90,
    serviceFeeBRL: 40.00,
    shippingEstBRL: 35.00,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 215,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 25
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
