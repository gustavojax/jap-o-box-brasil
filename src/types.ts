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
  category: string; // Corresponde exatamente às subcategorias desejadas
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedUpsells?: string[];
}
