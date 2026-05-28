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
// BASE DE DADOS DE PRODUTOS COM TAXAS ZERADAS para EXIBIR PREÇO EXATO
// ==========================================
const PRODUCTS: Product[] = [
  // --- 🛁 CATEGORIA: HIGIENE, CUIDADOS BUCAIS E PRODUTOS PARA BANHO ---
  {
    id: "mofurashi-toothbrush",
    name: "Mofurashi Toothbrush",
    jpName: "モフラシ 歯ブラシ 特殊設計",
    description: "Escova de dentes especial ergonômica.",
    priceBRL: 120.00,
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 25.00,
    image: "https://iili.io/C2KS5Cb.png",
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
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 35.00,
    image: "https://i.ibb.co/spChCy9L/50621-60-7f7bb7dbd3cd39bf13b37bcd7b35754b-1536x1024.jpg",
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
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 35.00,
    image: "https://i.ibb.co/4R4D5mJm/D-Q-NP-955266-MLA92278985694-092025-F.webp",
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
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 35.00,
    image: "https://iili.io/C2KC1bp.md.png",
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
    description: "Espuma de limpeza facial mais vendida do Japão. Cria uma espuma rica e cremosa que limpa profundamente sem ressecar a pele.",
    priceBRL: 54.90,
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 35.00,
    image: "https://i.ibb.co/zTdKBgPN/51j8-UE-scr-L-AC-UF1000-1000-QL80-FMwebp.webp",
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
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 40.00,
    image: "https://i.ibb.co/RTRdCfFq/new-collection-31-2.png",
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
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 30.00,
    image: "https://i.ibb.co/35xTPT5B/61-Yvzp-Im-BGL.jpg",
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
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 45.00,
    image: "https://i.ibb.co/99gRf3rD/D-NQ-NP-643899-MLA107452017338-032026-OO.jpg",
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
    description: "Creme clareador para poros e manchas com Niacinamida + Acido Tranexâmico.",
    priceBRL: 112.90,
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 45.00,
    image: "https://i.ibb.co/S4BY3fL4/L-g0212699726-001.jpg",
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
    description: "Sérum com Retinol que firma a pele, reduz linhas finas e melhora a textura.",
    priceBRL: 138.90,
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 45.00,
    image: "https://i.ibb.co/1Jbvy4fQ/D-Q-NP-711608-MLA104228285762-012026-F.webp",
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
    description: "Pente massajador capilar ReFa em formato de coração. Estimula o couro cabeludo, melhora a circulação e promove brilho e vitalidade aos fios.",
    priceBRL: 182.90,
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 35.00,
    image: "https://i.ibb.co/KxZ54zJw/61-FK4n-NNLj-L-AC-SL1500.jpg",
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
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 35.00,
    image: "https://i.ibb.co/CK50750k/pct-refa-heart-comb-aira-shinered-01.jpg",
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
    serviceFeeBRL: 0, // ZERADO - MOSTRARÁ R$ 99,00 EXATOS
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/9MkMbKDt/tsuba.png",
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
    serviceFeeBRL: 0, // ZERADO - MOSTRARÁ R$ 179,90 EXATOS
    shippingEstBRL: 65.00,
    image: "https://i.postimg.cc/ZRs9g0Mg/tsubas.png",
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
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 65.00,
    image: "https://i.ibb.co/q3tT4fHg/41x-M-SSU8x-L-AC-UF1000-1000-QL80-FMwebp.webp",
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
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 65.00,
    image: "https://i.ibb.co/gZnNpzT7/51v-XAUJ7-We-L-AC-UF1000-1000-QL80-FMwebp.webp",
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
    priceBRL: 75.00,
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 30.00,
    image: "https://i.postimg.cc/HW5c3WtJ/Captura-de-tela-2026-05-28-023259.png",
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
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 50.00,
    image: "https://i.ibb.co/ksMxWzbF/1-bbd45f2b-c684-4b30-ab4d-1e7c3384e254.png",
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
    serviceFeeBRL: 0, // ZERADO
    shippingEstBRL: 40.00,
    image: "https://i.postimg.cc/gJ3hwGSK/trae.png",
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0 font-sans text-slate-900 antialiased">

      <div className="w-full bg-slate-900 text-white text-center py-2 px-4 text-xs font-medium tracking-wide flex items-center justify-center gap-4">
        <span>🇯🇵 PRODUTOS 100% ORIGINAIS DIRETO DE MIE, JAPÃO</span>
        <span className="hidden md:inline text-slate-400">|</span>
        <span className="hidden md:flex items-center gap-1">📦 RASTREAMENTO COMPLETO EM TODAS AS ENCOMENDAS</span>
      </div>

      {notification && (
        <div className="fixed bottom-20 right-4 md:bottom-4 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl flex items-center gap-2 shadow-2xl">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          {notification}
        </div>
      )}

      {/* HEADER COMPACTO */}
      <Header
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={allCategories}
        cartCount={cartItems.reduce((a, i) => a + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => {
          if (user) {
            setActiveTab("account");
          } else {
            setIsAuthOpen(true);
          }
        }}
        user={user}
        onLogout={handleLogout}
        onLogoClick={handleReturnToStore}
      />

      {/* MENU DE ABAS SUPERIORES */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-4 flex justify-end">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex gap-1">
          <button
            onClick={handleReturnToStore}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === "store" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Loja
          </button>
          
          <button
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === "about" ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Sobre Nós
          </button>

          <button
            onClick={() => {
              if (user) {
                setActiveTab("account");
              } else {
                setIsAuthOpen(true);
              }
            }}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === "account" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Minha Suíte & Painel 📦
          </button>
        </div>
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL DAS TELAS */}
      {activeTab === "store" ? (
        <>
          <Hero 
            onScrollToCatalog={() => {
              setSelectedCategory("Todos");
              document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
            }}
            onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            onOpenClubModal={() => setIsClubModalOpen(true)}
          />
          <main className="flex-1">
            <TrustBadges />
            
            {/* VITRINE DE PRODUTOS */}
            <section id="catalogo" className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="text-left">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">🛒 Vitrine de Importação</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Filtro ativo no cabeçalho: <span className="text-red-600 font-bold">{selectedCategory}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 bg-white text-xs font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="popular">Popularidade</option>
                    <option value="priceAsc">Menor preço</option>
                    <option value="priceDesc">Maior preço</option>
                    <option value="name">Nome A-Z</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60 p-6">
                  <p className="text-sm font-bold text-slate-400">Nenhum produto encontrado nesta categoria no momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(p => (
                    <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              )}
            </section>

            <Testimonials />
            <BlogSection />
          </main>
        </>
      ) : activeTab === "about" ? (
        <main className="flex-1 bg-slate-50 py-12 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 grid grid-cols-1 md:grid-cols-12">
            
            {/* FOTO PAULA TAKASHIRO */}
            <div className="md:col-span-5 bg-slate-950 relative min-h-[350px] md:min-h-full flex items-center justify-center">
              <img 
                src="https://iili.io/CJpV5fj.md.jpg" 
                alt="Paula Takashiro" 
                className="w-full h-full object-cover absolute inset-0 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            {/* CONTEÚDO DA HISTÓRIA */}
            <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center space-y-6">
              <div>
                <span className="text-xs font-black text-rose-600 uppercase tracking-widest block mb-2">Nossa História</span>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">✨ Bem-vindos à Japão Box Brasil ✨</h1>
              </div>
              <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed font-medium text-left">
                <p>Iniciamos nossa empresa com um sonho: levar até o Brasil os melhores produtos nacionais e importados, trazendo qualidade, beleza, tecnologia e novidades que conquistam o world inteiro. 🇯🇵🇰🇷</p>
                <p>Selecionamos cada produto com carinho para oferecer itens originais, tendências de skincare, cosméticos, cuidados pessoais e muito mais, directly do Japão e da Coreia para você.</p>
                <p>A Japão Box Brasil nasceu para aproximar culturas e entregar experiências únicas, com confiança, dedicação e amor em cada envio.</p>
                <p className="font-semibold text-slate-800">Obrigada por fazer parte do começo dessa história com a gente!</p>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 shadow-sm">
                    <img 
                      src="https://iili.io/CJbmWhP.md.jpg" 
                      alt="Japão Box Brasil Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Atenciosamente,</p>
                    <p className="text-sm font-black text-slate-900 tracking-wide mt-0.5">Paula Takashiro</p>
                  </div>
                </div>
                <Heart className="w-6 h-6 text-rose-500 fill-rose-100 stroke-1" />
              </div>
            </div>

          </div>
        </main>
      ) : (
        <main className="flex-1 bg-slate-50 py-8 px-4 min-h-[85vh]">
          {user ? (
            <ClientDashboard 
              user={user}
              orders={orders}
              loadingOrders={loadingOrders}
              onCreateMockOrder={handleCreateMockOrder}
              onLogout={handleLogout}
              getStatusBadge={getStatusBadge}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-slate-500">Por favor, realize o login para acessar sua suíte.</p>
            </div>
          )}
        </main>
      )}

      {/* RODAPÉ DO ECOSSISTEMA */}
      <footer className="w-full bg-white border-t border-slate-200 text-slate-600 pt-12 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-left">
            <h3 className="font-black text-slate-900 text-lg mb-4">Japão Box Brasil</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              Sua ponte definitiva com o mercado japonês. Facilitamos a simulação de custos, compra e o envio de caixas e produtos direto de nosso armazém em Mie para a sua casa no Brasil de forma 100% segura e transparente.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li><button onClick={handleReturnToStore} className="hover:text-slate-900 transition-colors cursor-pointer">Ver Catálogo</button></li>
              <li><button onClick={() => setActiveTab("about")} className="hover:text-slate-900 transition-colors cursor-pointer">Sobre Nós</button></li>
              <li><button onClick={() => { if(user) { setActiveTab("account") } else { setIsAuthOpen(true) } }} className="hover:text-slate-900 transition-colors cursor-pointer">Rastrear Pedido</button></li>
            </ul>
          </div>
        </div>

        {/* BANNER DE MEIOS DE PAGAMENTO */}
        <div className="max-w-4xl mx-auto px-4 mt-10 pt-6 border-t border-slate-100 flex flex-col items-center justify-center space-y-3">
          <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Aceitamos os principais meios de pagamento globais e locais</p>
          <div className="w-full max-w-2xl">
            <img 
              src="https://iili.io/CdLPwBa.md.jpg" 
              alt="Meios de Pagamento" 
              className="w-full h-auto object-contain select-none pointer-events-none"
            />
          </div>
          <p className="text-[11px] font-semibold text-slate-400">Visa, Mastercard, American Express, Discover, Diners Club, JCB e Pix.</p>
        </div>

        {/* CRÉDITOS E DIREITOS AUTORAIS */}
        <div className="max-w-7xl mx-auto px-4 mt-6 text-center text-xs text-slate-400 space-y-2">
          <p>© 2026 Japão Box Brasil. Todos os direitos reservados.</p>
          <p className="text-[11px] font-medium tracking-wide text-slate-500 pt-1">
            Desenvolvimento por <span className="text-slate-800 font-bold">Gustavo Jax Audiovisual</span>
          </p>
        </div>
      </footer>

      {isCartOpen && (
        <CartDrawer 
          onClose={() => setIsCartOpen(false)} 
          cartItems={cartItems} 
          setCartItems={setCartItems} 
        />
      )}
      
      <BudgetModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} onSubmit={() => {}} />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <ClubModal isOpen={isClubModalOpen} onClose={() => setIsClubModalOpen(false)} />

    </div>
  );
}
