src/components/types.ts
 
export interface Product {
  id: string;
  name: string;
  jpName: string;
  description: string;
  priceBRL: number;
  serviceFeeBRL: number;
  shippingEstBRL: number;
  image: string;
  rating: number;
  reviewsCount: number;
  department: string;
  category: string;
  stock: number;
}
 
export interface CartItem {
  product: Product;
  quantity: number;
}
 
