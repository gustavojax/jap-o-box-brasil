import type { Product } from "../types";

const PRODUCTS: Product[] = [
  {
    id: "teste-1",
    name: "Produto Teste",
    jpName: "テスト製品",
    description: "Teste",
    priceBRL: 100,
    serviceFeeBRL: 0,
    shippingEstBRL: 20,
    image: "https://via.placeholder.com/200",
    rating: 5,
    reviewsCount: 1,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 10
  }
];

export default PRODUCTS;
