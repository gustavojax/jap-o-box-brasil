export interface Product {
  id: string;
  name: string;
  jpName: string;
  category: string;
  priceYen: number; // Price in Japanese Yen
  priceBRL: number; // Converted base price
  serviceFeeBRL: number; // Personal Shopper service fee
  shippingEstBRL: number; // Estimated direct international shipping to Brazil
  estimatedTaxBRL: number; // 60% standard import tax estimate (or calculated based on updated rules)
  image: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  featured: boolean;
  description: string;
  specifications: { [key: string]: string };
}

export interface SubscriptionBox {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  image: string;
  itemsIncluded: string[];
  themeColor: string;
  badge: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedUpsells: string[]; // List of upsell IDs
}

export interface UpsellOption {
  id: string;
  name: string;
  description: string;
  priceBRL: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  productBought: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
  content: string;
}
