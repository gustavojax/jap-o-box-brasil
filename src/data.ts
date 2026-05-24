import {
  Product,
  SubscriptionBox,
  Testimonial,
  BlogPost,
  UpsellOption,
} from "./types";

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
// PRODUTOS (COM SUBCATEGORIA ADICIONADA)
// =========================================

export const PRODUCTS: Product[] = [
  // ================= HAIR CARE =================

  {
    id: "hair-1",
    name: "Mise en Scène Perfect Serum",
    jpName: "미쟝센 퍼펙트 세럼",
    category: "Hair Care",
    priceBRL: 115.2,
    serviceFeeBRL: 120,
    shippingEstBRL: 85,
    estimatedTaxBRL: 45,
    image:
      "https://i.ibb.co/fzWnDKHw/035703bd-cb2d-4a86-ad5c-6256bfb772d2-mise-en-scene-perfect-serum-original-serum-capilar-30ml.avif",
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
    priceBRL: 122.4,
    serviceFeeBRL: 120,
    shippingEstBRL: 85,
    estimatedTaxBRL: 45,
    image:
      "https://i.ibb.co/dJcmTv3t/9e2ce447-46b6-478e-a2e7-4b5b06f0b555-20076358-a.avif",
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

  // ================= SKINCARE =================

  {
    id: "skin-1",
    name: "Medicube Zero Pore Pad",
    jpName: "Medicube",
    category: "Skincare",
    priceBRL: 219.6,
    serviceFeeBRL: 120,
    shippingEstBRL: 90,
    estimatedTaxBRL: 60,
    image:
      "https://i.ibb.co/zWTrLtsP/71-Mcspt-6-AL-AC-UF1000-1000-QL80-FMwebp.webp",
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

  // ================= ACESSÓRIOS =================

  {
    id: "tool-1",
    name: "ReFa Heart Brush",
    jpName: "ReFa",
    category: "Acessórios",
    priceBRL: 198,
    serviceFeeBRL: 120,
    shippingEstBRL: 90,
    estimatedTaxBRL: 60,
    image:
      "https://i.ibb.co/0jrfhx80/71ho-ORXt-ZIL-AC-UF1000-1000-QL80.jpg",
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

  // ================= NOVAS CATEGORIAS =================

  {
    id: "sport-1",
    name: "Nike Air Zoom",
    jpName: "ナイキ エアズーム",
    category: "Tênis",
    subcategory: "Nike",
    priceBRL: 520,
    serviceFeeBRL: 120,
    shippingEstBRL: 90,
    estimatedTaxBRL: 60,
    image: "",
    rating: 4.9,
    reviewsCount: 312,
    inStock: true,
    featured: true,
    description: "Tênis Nike importado do Japão.",
    specifications: {
      Marca: "Nike",
      Tipo: "Running",
    },
  },

  {
    id: "sport-2",
    name: "New Balance Runner",
    jpName: "ニューバランス",
    category: "Tênis",
    subcategory: "New Balance",
    priceBRL: 480,
    serviceFeeBRL: 120,
    shippingEstBRL: 90,
    estimatedTaxBRL: 60,
    image: "",
    rating: 4.8,
    reviewsCount: 210,
    inStock: true,
    featured: true,
    description: "Tênis New Balance premium.",
    specifications: {
      Marca: "New Balance",
      Tipo: "Running",
    },
  },

  {
    id: "fishing-1",
    name: "Kit Pesca Pro Japan",
    jpName: "釣りセット",
    category: "Pesca",
    priceBRL: 350,
    serviceFeeBRL: 100,
    shippingEstBRL: 90,
    estimatedTaxBRL: 50,
    image: "",
    rating: 4.7,
    reviewsCount: 98,
    inStock: true,
    featured: true,
    description: "Kit completo de pesca japonês.",
    specifications: {
      Tipo: "Pesca Profissional",
      Origem: "Japão",
    },
  },
];

export const SUBSCRIPTION_BOXES: SubscriptionBox[] = [];
export const TESTIMONIALS: Testimonial[] = [];
export const BLOG_POSTS: BlogPost[] = [];
