export type MainDepartment =
  | "Casa e Cozinha"
  | "Alimentos e Limpeza"
  | "Tecnologia, Ferramentas e Automotivo"
  | "Beleza, Higiene e Saúde"
  | "Moda e Acessórios"
  | "Estilo de Vida, Cultura e Exclusivos";

export interface Product {
  id: string;
  name: string;
  jpName: string;
  description: string;
  priceBRL: number;
  serviceFeeBRL: number;
  shippingEstBRL: number;
  estimatedTaxBRL?: number;
  image: string;
  rating: number;
  reviewsCount?: number;
  department: MainDepartment;
  category: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedUpsells?: string[];
}

// 📝 Adicionado para dar suporte ao BlogSection sem quebras
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
}
