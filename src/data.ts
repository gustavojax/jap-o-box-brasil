import { Product, SubscriptionBox, Testimonial, BlogPost, UpsellOption } from "./types";

// =========================================
// TAXA (mantida só como referência histórica)
// =========================================

export const YEN_TO_BRL_RATE = 0.036;

// =========================================
// UPSSELLS
// =========================================

export const UPSELL_OPTIONS: UpsellOption[] = [
  {
    id: "photos",
    name: "Fotos Profissionais no Depósito (Japão)",
    description: "Enviaremos fotos reais do produto no Japão antes do envio.",
    priceBRL: 19.9,
  },
  {
    id: "reinforced",
    name: "Embalagem Premium Ultra-Reforçada",
    description: "Proteção extra contra impactos internacionais.",
    priceBRL: 29,
  },
  {
    id: "gift",
    name: "Embalagem Especial para Presente Japonesa",
    description: "Embalagem japonesa premium estilo presente.",
    priceBRL: 35,
  },
  {
    id: "inspection",
    name: "Teste & Inspeção Premium",
    description: "Inspeção manual antes do envio.",
    priceBRL: 25,
  },
];

// =========================================
// PRODUTOS (CORRIGIDOS PARA VALORES REAIS EM BRL)
// =========================================

export const PRODUCTS: Product[] = [

  // ================= HAIR CARE =================

  {
    id: "hair-1",
    name: "Mise en Scène Perfect Serum",
    jpName: "미쟝센 퍼펙트 세럼",
    category: "Hair Care",
    priceBRL: 115.20,
    serviceFeeBRL: 120,
    shippingEstBRL: 85,
    estimatedTaxBRL: 45,
    image: "https://i.ibb.co/fzWnDKHw/035703bd-cb2d-4a86-ad5c-6256bfb772d2-mise-en-scene-perfect-serum-original-serum-capilar-30ml.avif",
    rating: 5,
    reviewsCount: 182,
    inStock: true,
    featured: true,
    description: "Serum capilar original importado do Japão.",
    specifications: {
      Marca: "Mise en Scène",
      Conteúdo: "80ml",
      Origem: "Japão",
    },
  },

  {
    id: "hair-2",
    name: "Fino Hair Oil – Nutrição",
    jpName: "Fino Premium Oil",
    category: "Hair Care",
    priceBRL: 122.40,
    serviceFeeBRL: 120,
    shippingEstBRL: 85,
    estimatedTaxBRL: 45,
    image: "https://i.ibb.co/dJcmTv3t/9e2ce447-46b6-478e-a2e7-4b5b06f0b555-20076358-a.avif",
    rating: 5,
    reviewsCount: 141,
    inStock: true,
    featured: true,
    description: "Óleo capilar premium japonês.",
    specifications: {
      Marca: "Fino",
      Tipo: "Hair Oil",
      Origem: "Japão",
    },
  },

  {
    id: "hair-3",
    name: "Orbis Hair Care Special Set",
    jpName: "Orbis Hair Set",
    category: "Hair Care",
    priceBRL: 198.00,
    serviceFeeBRL: 120,
    shippingEstBRL: 90,
    estimatedTaxBRL: 60,
    image: "https://i.ibb.co/mFVfr8z8/images.jpg",
    rating: 5,
    reviewsCount: 88,
    inStock: true,
    featured: true,
    description: "Kit completo de tratamento capilar.",
    specifications: {
      Marca: "Orbis",
      Tipo: "Kit Completo",
      Origem: "Japão",
    },
  },

  {
    id: "hair-4",
    name: "&Honey Melty Shampoo & Treatment",
    jpName: "&Honey Melty",
    category: "Hair Care",
    priceBRL: 223.20,
    serviceFeeBRL: 120,
    shippingEstBRL: 90,
    estimatedTaxBRL: 60,
    image: "https://i.ibb.co/nMmH97GP/D-Q-NP-780625-MLM109694022756-042026-O.webp",
    rating: 5,
    reviewsCount: 221,
    inStock: true,
    featured: true,
    description: "Shampoo e tratamento premium japonês.",
    specifications: {
      Marca: "&Honey",
      Tipo: "Shampoo + Treatment",
      Origem: "Japão",
    },
  },

  {
    id: "hair-5",
    name: "Fino Shampoo + Conditioner",
    jpName: "フィーノ",
    category: "Hair Care",
    priceBRL: 212.40,
    serviceFeeBRL: 120,
    shippingEstBRL: 90,
    estimatedTaxBRL: 60,
    image: "https://i.ibb.co/1GfFc9jd/D-Q-NP-992914-MLB76551059023-052024-F.webp",
    rating: 5,
    reviewsCount: 177,
    inStock: true,
    featured: true,
    description: "Kit shampoo e condicionador.",
    specifications: {
      Marca: "Fino",
      Tipo: "Hair Care Set",
      Origem: "Japão",
    },
  },

  {
    id: "hair-6",
    name: "Fino Hair Mask",
    jpName: "フィーノ ヘアマスク",
    category: "Hair Care",
    priceBRL: 108.00,
    serviceFeeBRL: 100,
    shippingEstBRL: 80,
    estimatedTaxBRL: 40,
    image: "https://i.ibb.co/bjhxNrcf/D-Q-NP-791727-MLA111036030964-052026-F.webp",
    rating: 5,
    reviewsCount: 390,
    inStock: true,
    featured: true,
    description: "Máscara capilar intensiva.",
    specifications: {
      Marca: "Shiseido",
      Tipo: "Hair Mask",
      Origem: "Japão",
    },
  },

  // ================= SKINCARE =================

  {
    id: "skin-1",
    name: "Medicube Zero Pore Pad",
    jpName: "Medicube",
    category: "Skincare",
    priceBRL: 219.60,
    serviceFeeBRL: 120,
    shippingEstBRL: 90,
    estimatedTaxBRL: 60,
    image: "https://i.ibb.co/zWTrLtsP/71-Mcspt-6-AL-AC-UF1000-1000-QL80-FMwebp.webp",
    rating: 5,
    reviewsCount: 205,
    inStock: true,
    featured: true,
    description: "Pads para limpeza de poros.",
    specifications: {
      Marca: "Medicube",
      Tipo: "Pore Care",
      Origem: "Coreia/Japão",
    },
  },

  {
    id: "skin-2",
    name: "Medicube Pink Collagen Mask",
    jpName: "Medicube Mask",
    category: "Skincare",
    priceBRL: 140.40,
    serviceFeeBRL: 100,
    shippingEstBRL: 80,
    estimatedTaxBRL: 45,
    image: "https://i.ibb.co/mVy2YzL6/2-f6312d6c-1d03-4b9c-a04f-663c20b4d35b.png",
    rating: 5,
    reviewsCount: 144,
    inStock: true,
    featured: true,
    description: "Máscara de colágeno rosa.",
    specifications: {
      Marca: "Medicube",
      Tipo: "Gel Mask",
      Origem: "Coreia/Japão",
    },
  },

  {
    id: "skin-3",
    name: "Medicube Jelly Cream",
    jpName: "Medicube Cream",
    category: "Skincare",
    priceBRL: 216.00,
    serviceFeeBRL: 120,
    shippingEstBRL: 90,
    estimatedTaxBRL: 60,
    image: "https://i.ibb.co/kV126chF/new-collagen-jelly-cream-40409430130944.jpg",
    rating: 5,
    reviewsCount: 174,
    inStock: true,
    featured: true,
    description: "Creme de colágeno premium.",
    specifications: {
      Marca: "Medicube",
      Tipo: "Collagen Cream",
      Origem: "Coreia/Japão",
    },
  },

  // ================= ACESSÓRIOS =================

  {
    id: "tool-1",
    name: "ReFa Heart Brush",
    jpName: "ReFa",
    category: "Acessórios",
    priceBRL: 198.00,
    serviceFeeBRL: 120,
    shippingEstBRL: 90,
    estimatedTaxBRL: 60,
    image: "https://i.ibb.co/0jrfhx80/71ho-ORXt-ZIL-AC-UF1000-1000-QL80.jpg",
    rating: 5,
    reviewsCount: 133,
    inStock: true,
    featured: true,
    description: "Escova premium japonesa.",
    specifications: {
      Marca: "ReFa",
      Tipo: "Hair Brush",
      Origem: "Japão",
    },
  },

  {
    id: "tool-2",
    name: "Scalp Brush",
    jpName: "Medicube Scalp",
    category: "Acessórios",
    priceBRL: 198.00,
    serviceFeeBRL: 120,
    shippingEstBRL: 90,
    estimatedTaxBRL: 60,
    image: "https://i.ibb.co/0jrfhx80/71ho-ORXt-ZIL-AC-UF1000-1000-QL80.jpg",
    rating: 5,
    reviewsCount: 99,
    inStock: true,
    featured: true,
    description: "Escova massageadora couro cabeludo.",
    specifications: {
      Marca: "Medicube",
      Tipo: "Scalp Massager",
      Origem: "Coreia/Japão",
    },
  },
];

export const SUBSCRIPTION_BOXES: SubscriptionBox[] = [];
export const TESTIMONIALS: Testimonial[] = [];
export const BLOG_POSTS: BlogPost[] = [];
