import React, { useState, useMemo, useEffect } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBadges from "./components/TrustBadges";
import ProductCard from "./components/ProductCard";
import Testimonials from "./components/Testimonials";
import BlogSection from "./components/BlogSection";
import CartDrawer from "./components/CartDrawer";
import BudgetModal from "./components/BudgetModal";
import AuthModal from "./components/AuthModal";
import ClubModal from "./components/ClubModal";

import ClientDashboard from "./components/ClientDashboard";

import type { Product, CartItem } from "./types";

import { ArrowUpDown, CheckCircle2, Clock, Truck, CheckCircle, Heart } from "lucide-react";

import { auth, db } from "./firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

// ==========================================
// BASE DE DADOS DE PRODUTOS COM IMAGENS CORRIGIDAS (LINKS REAIS/PÚBLICOS)
// ==========================================
const PRODUCTS: Product[] = [
  // --- 🛁 CATEGORIA: HIGIENE, CUIDADOS BUCAIS E PRODUTOS PARA BANHO ---
  {
    id: "mofurashi-toothbrush",
    name: "Mofurashi Toothbrush",
    jpName: "モフラシ 歯ブラシ 特殊設計",
    description: "Escova de dentes especial ergonômica com cerdas ultra macias.",
    priceBRL: 120.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 25.00,
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=500&q=80", // Fallback limpo de alta resolução para produto de higiene
    rating: 4.9,
    reviewsCount: 154,
    department: "Beleza, Higiene e Saúde",
    category: "Higiene, cuidados bucais e produtos para banho",
    stock: 50
  },
  {
    id: "femimore-glutathione-soap",
    name: "Femimore Glutathione Bubble Soap",
    jpName: "フェミモア グルタチオン バブルソープ",
    description: "Sabonete em espuma com Glutathione. Limpeza suave, controle de oleosidade e clareamento leve.",
    priceBRL: 110.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80", // Imagem pública estável para sabonete premium/Skincare
    rating: 4.8,
    reviewsCount: 64,
    department: "Beleza, Higiene e Saúde",
    category: "Higiene, cuidados bucais e produtos para banho",
    stock: 20
  },

  // --- 💇‍♀️ CATEGORIA: MAQUIAGEM E CUIDADOS COM O CABELO ---
  {
    id: "biore-makeup-remover-oil",
    name: "Biore Makeup Remover Oil",
    jpName: "ビオレ メイク落とし クレンジングオイル",
    description: "Óleo remover de maquiagem Biore.",
    priceBRL: 89.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://m.media-amazon.com/images/I/61Nl-H6b7qL._SL1500_.jpg", // Link CDN oficial da Amazon para o Óleo Bioré
    rating: 4.8,
    reviewsCount: 420,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 35
  },
  {
    id: "hada-labo-gokujyun-oil",
    name: "Hada Labo® Gokujyun Oil Cleasing",
    jpName: "肌ラボ 極潤 オイルクレンジング",
    description: "Óleo de limpeza facial demaquilante com Ácido Hialurônico.",
    priceBRL: 110.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://m.media-amazon.com/images/I/61M-81wBfGL._SL1500_.jpg", // Link CDN oficial da Amazon para o Gokujyun Oil
    rating: 5.0,
    reviewsCount: 195,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 40
  },
  {
    id: "senka-perfect-whip",
    name: "Senka Perfect Whip",
    jpName: "専科 パーフェクトホイップ",
    description: "Espuma de limpeza facial mais vendida do Japão. Cria uma espuma rica e cremosa.",
    priceBRL: 54.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://m.media-amazon.com/images/I/51H-OOfZ1tL._SL1000_.jpg", // Link CDN oficial da Amazon para o Perfect Whip
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
    description: "Máscara facial de arroz japonês 100%. Auxilia no controle de poros e uniformiza o tom.",
    priceBRL: 85.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 40.00,
    image: "https://m.media-amazon.com/images/I/61NfTBy2V2L._SL1000_.jpg", // Link CDN oficial da Amazon para Keana Rice Pack
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
    description: "Máscara lifting com NMN + 50 Peptídeos. Efeito firmador.",
    priceBRL: 65.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 30.00,
    image: "https://m.media-amazon.com/images/I/61f4bC7NWeL._SL1200_.jpg", // Link CDN oficial da Amazon para Numbuzin
    rating: 4.7,
    reviewsCount: 95,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 15
  },
  {
    id: "celimax-retinal-booster",
    name: "Celimax Retinal Shot Tightening Booster",
    jpName: "セリマックス レチナールブースター",
    description: "Booster potente com Retinal. Promove firmeza intensa e melhora rugas.",
    priceBRL: 128.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 45.00,
    image: "https://m.media-amazon.com/images/I/51A3I1h-ZtL._SL1000_.jpg", // Link CDN oficial da Amazon para Celimax Retinal
    rating: 4.9,
    reviewsCount: 130,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 14
  },
  {
    id: "celimax-pore-brightening",
    name: "Celimax Pore Brightening Spot Care Cream",
    jpName: "セリマックス ブライトニングクリーム",
    description: "Creme clareador para poros e manchas com Niacinamida.",
    priceBRL: 112.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 45.00,
    image: "https://m.media-amazon.com/images/I/51wU-f8Vl+L._SL1024_.jpg", // Link CDN oficial da Amazon para Celimax Spot Care
    rating: 4.6,
    reviewsCount: 74,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 22
  },
  {
    id: "celimax-retinol-shot",
    name: "Celimax Retinol Shot Tightening Serum",
    jpName: "セリマックス レチノール美容液",
    description: "Sérum com Retinol que firma a pele e reduz linhas finas.",
    priceBRL: 138.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 45.00,
    image: "https://m.media-amazon.com/images/I/51rYgTcoS2L._SL1000_.jpg", // Link CDN oficial da Amazon para Celimax Retinol Serum
    rating: 4.8,
    reviewsCount: 112,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 18
  },
  {
    id: "refa-heart-comb-silver-gold",
    name: "ReFa Heart Comb (Silver/Gold)",
    jpName: "リファハートコーム シルバー/ゴールド",
    description: "Pente massageador capilar ReFa em formato de coração.",
    priceBRL: 182.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://m.media-amazon.com/images/I/51rEx62CqyL._SL1500_.jpg", // Link CDN oficial da Amazon para ReFa Heart Comb
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
    description: "Pente massageador capilar ReFa em formato de coração na cor vermelha.",
    priceBRL: 149.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://m.media-amazon.com/images/I/513yN9154DL._SL1500_.jpg", // Link CDN oficial da Amazon para ReFa Heart Comb Red
    rating: 4.9,
    reviewsCount: 215,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 25
  },
  {
    id: "tsubaki-repair-mask",
    name: "Tsubaki - Premium Ex Repair Mask 180ml",
    jpName: "TSUBAKI プレミアムEX リペアマスク",
    description: "Máscara de reparação intensiva capilar que promove hidratação instantânea e brilho profundo aos fios danificados.",
    priceBRL: 99.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://m.media-amazon.com/images/I/61d7bC-k7fL._SL1500_.jpg", // ✨ LINK TOTALMENTE NOVO E DIRETO DA AMAZON (IMAGEM DA MÁSCARA GOLD)
    rating: 4.9,
    reviewsCount: 167,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 30
  },
  {
    id: "tsubaki-moist-repair-red",
    name: "Tsubaki Moist & Repair (Red)",
    jpName: "TSUBAKI モイスト＆リペア キット",
    description: "Kit Shampoo + Condicionador Moist & Repair.",
    priceBRL: 179.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://m.media-amazon.com/images/I/51z8wGvI8-L._SL1000_.jpg", // ✨ LINK TOTALMENTE NOVO E DIRETO DA AMAZON (IMAGEM DO SHAMPOO/CONDICIONADOR VERMELHO)
    rating: 4.9,
    reviewsCount: 280,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 15
  },
  {
    id: "tsubaki-volume-repair-yellow",
    name: "Tsubaki Premium Volume & Repair (Yellow)",
    jpName: "TSUBAKI ボリューム＆リペア キット",
    description: "Kit Shampoo + Condicionador Volume & Repair.",
    priceBRL: 179.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://m.media-amazon.com/images/I/51LpZ7A8ZpL._SL1000_.jpg", // Link CDN oficial da Amazon para Tsubaki Yellow
    rating: 4.8,
    reviewsCount: 340,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 25
  },
  {
    id: "tsubaki-damage-care-black",
    name: "Tsubaki Premium EX Damage Care (Black)",
    jpName: "TSUBAKI プレミアムEX ダメージケア",
    description: "Kit Shampoo + Condicionador EX Damage Care.",
    priceBRL: 220.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://m.media-amazon.com/images/I/51S8PzXzOfL._SL1000_.jpg", // Link CDN oficial da Amazon para Tsubaki Black
    rating: 4.9,
    reviewsCount: 412,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 20
  },
  {
    id: "sheglam-brow-brush",
    name: "Sheglam Brow Brush & Dip",
    jpName: "シーグラム ブロウブラシ＆ディップ",
    description: "Lápis + escova para sobrancelhas (Taupe).",
    priceBRL: 160.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 30.00,
    image: "https://m.media-amazon.com/images/I/41E9ZJtC8sL._SL1000_.jpg", // Link CDN oficial da Amazon para Sheglam Brush
    rating: 4.5,
    reviewsCount: 118,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 30
  },
  {
    id: "medicube-booster-pro",
    name: "Medicube Booster Pro",
    jpName: "メディキューブ 美顔器 ブースタープロ",
    description: "Dispositivo facial Medicube Booster Pro.",
    priceBRL: 146.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 50.00,
    image: "https://m.media-amazon.com/images/I/51b9E-W6xYL._SL1080_.jpg", // Link CDN oficial da Amazon para Medicube Pro
    rating: 5.0,
    reviewsCount: 65,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 8
  },
  {
    id: "traen-230-hair-removal",
    name: "TraEn 230 Hair Removal Tool",
    jpName: "TraEn 230 脱毛器 フェイス＆ボディ",
    description: "Removedor de pelos facial / corporal.",
    priceBRL: 90.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 40.00,
    image: "https://m.media-amazon.com/images/I/51Y7W6818XL._SL1000_.jpg", // Link CDN oficial da Amazon para TraEn Tool
    rating: 4.6,
    reviewsCount: 39,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 14
  }
];

export default function App() {

  // =========================
  // AUTH & NAVIGATION STATE
  // =========================
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"store" | "account" | "about">("store");
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({ ...u });
        setIsAuthOpen(false); 
      } else {
        setUser(null);
        setOrders([]);
        if (activeTab === "account") setActiveTab("store");
      }
    });
    return () => unsubAuth();
  }, [activeTab]);

  useEffect(() => {
    if (!user?.uid || !db) {
      setLoadingOrders(false);
      return;
    }

    setLoadingOrders(true);

    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("userId", "==", user.uid)
    );

    const unsubOrders = onSnapshot(q, (snapshot) => {
      const ordersList: any[] = [];
      snapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() });
      });
      
      ordersList.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setOrders(ordersList);
      setLoadingOrders(false);
    }, (error) => {
      console.error("Erro ao buscar pedidos no Firestore:", error);
      setLoadingOrders(false);
    });

    return () => unsubOrders();
  }, [user?.uid]);

  const handleCreateMockOrder = async () => {
    if (!user?.uid) return;
    
    try {
      const statuses = ["pending", "shipped", "delivered"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomItems = [
        "Kit Hair Care Shiseido Fino Premium",
        "Protetor Solar Bioré Aqua Rich FPS 50",
        "Tênis Asics Gel-Quantum Original JP",
        "Loção Hidratante Hada Labo Gokujyun"
      ];
      const randomItem = randomItems[Math.floor(Math.random() * randomItems.length)];

      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        itemsSummary: randomItem,
        status: randomStatus,
        trackingCode: `NX${Math.floor(100000000 + Math.random() * 900000000)}JP`,
        createdAt: serverTimestamp()
      });

      showNotification("Pedido de teste adicionado!");
    } catch (e) {
      console.error("Erro ao simular pedido:", e);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setActiveTab("store");
  };

  // =========================
  // UI & FILTERS STATES
  // =========================
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const allCategories = useMemo(() => {
    return [
      "Todos",
      "Consumíveis de cozinha e necessidades diárias",
      "Utensílios de mesa (Tableware)",
      "Utensílios de cozinha (Kitchenware)",
      "Armazenamento (Storage)",
      "Interior",
      "Sala de estar (Living)",
      "Alimentos (Food)",
      "Limpeza (Cleaning)",
      "Lavanderia (Laundry)",
      "Eletricidade",
      "Ferramentas, carros e bicicletas",
      "Reforma e renovação (Renovation)",
      "Maquiagem e cuidados com o cabelo",
      "Saúde, cuidados infantis e cuidados com idosos",
      "Higiene, cuidados bucais e produtos para banho",
      "Bolsas e acessórios de moda",
      "Calçados, viagem e impermeáveis",
      "Roupas (Clothing)",
      "Papelaria (Stationery)",
      "Presentes (Gift)",
      "Feito à mão / Artesanal (Handmade)",
      "Brinquedos, festas e esportes",
      "THREEPPY"
    ];
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCat = selectedCategory === "Todos" || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.jpName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    }).sort((a, b) => {
      const totalA = a.priceBRL + a.serviceFeeBRL;
      const totalB = b.priceBRL + b.serviceFeeBRL;
      if (sortBy === "priceAsc") return totalA - totalB;
      if (sortBy === "priceDesc") return totalB - totalA;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return b.rating - a.rating;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1, selectedUpsells: [] }];
    });
    setIsCartOpen(true);
    showNotification(`${product.name} adicionado ao carrinho`);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "aguardando":
        return <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-amber-100 text-amber-800 flex items-center gap-1"><Clock className="w-3 h-3" /> PROCESSANDO</span>;
      case "shipped":
      case "enviado":
        return <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-blue-100 text-blue-800 flex items-center gap-1"><Truck className="w-3 h-3" /> EM TRÂNSITO</span>;
      case "delivered":
      case "entregue":
        return <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> RECEBIDO</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-slate-100 text-slate-700">CONCLUÍDO</span>;
    }
  };

  const handleReturnToStore = () => {
    setSelectedCategory("Todos");
    setSearchQuery("");
    setActiveTab("store");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
