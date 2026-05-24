export interface Product {
  id: string;
  name: string;
  jpName: string;
  description: string;

  category: string;
  subcategory?: string;

  priceBRL: number;
  serviceFeeBRL: number;
  shippingEstBRL: number;
  estimatedTaxBRL: number;

  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedUpsells: any[];
}
