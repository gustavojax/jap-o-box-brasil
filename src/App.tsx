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
import WhatsAppFloat from "./components/WhatsAppFloat";

import ClientDashboard from "./components/ClientDashboard";
import AdminDashboard from "./components/AdminDashboard";

import type { Product, CartItem } from "./types";

import { ArrowUpDown, CheckCircle2, Clock, Truck, CheckCircle, Heart } from "lucide-react";

import { auth, db } from "./firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

// ==========================================
// BASE DE DADOS DE PRODUTOS COMPLETA E REVISADA
// ==========================================
const PRODUCTS: Product[] = [
  {
    id: "mofurashi-toothbrush",
    name: "Mofurashi Toothbrush",
    jpName: "モフラシ 歯ブラシ 特殊設計",
    description: "Escova de dentes especial ergonômica.",
    priceBRL: 120.00,
    serviceFeeBRL: 0,
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
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.ibb.co/spChCy9L/50621-60-7f7bb7dbd3cd39bf13b37bcd7b35754b-1536x1024.jpg",
    rating: 4.8,
    reviewsCount: 64,
    department: "Beleza, Higiene e Saúde",
    category: "Higiene, cuidados bucais e produtos para banho",
    stock: 20
  },
  {
    id: "medicube-age-r-booster-pro",
    name: "Medicube Age-R Booster Pro",
    jpName: "メディキューブ 本格美顔器",
    description: "O dispositivo eletrônico facial inteligente que é um verdadeiro fenômeno na Coreia. Ele combina 4 tecnologias de clínica em um único aparelho (eletroporação, microcorrentes, EMS e LED) para abrir os caminhos da pele, fazendo com que seus sérums e cremes penetrem até 700% mais profundamente.",
    priceBRL: 1430.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 50.00,
    image: "https://i.postimg.cc/s2DtFdyK/medicube-age-r-booster-pro-device-pink.jpg",
    rating: 5.0,
    reviewsCount: 142,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 10
  },
  {
    id: "medicube-age-r-booster-pro-mini",
    name: "Medicube Age-R Booster Pro Mini",
    jpName: "メディキューブ 美顔器 ミニ",
    description: "A versão compacta, leve e ideal para viagens do famoso aparelho de eletroporação da Medicube. Focado em maximizar o brilho (glow) e a absorção dos seus produtos de skincare diários através de impulsos elétricos suaves e seguros.",
    priceBRL: 494.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/qq0sY0Hn/d-nq-np-2x-881547-mlb83207883971-032025-f-medicube-age-r-booster-pro-mini-rosa-yloktw1oig.webp",
    rating: 4.9,
    reviewsCount: 86,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 15
  },
  {
    id: "ckd-retino-collagen-guasha-serum",
    name: "CKD Guaranteed Retino Collagen Guasha Lifting Serum (40 ml)",
    jpName: "CKD レチノコラーゲン グアシャ セラム",
    description: "Inovador sérum anti-flacidez com colágeno de baixo peso molecular (300Da) e Retinal encapsulado. Possui uma ponteira Guasha de aço integrada ao tubo, permitindo massagear e esculpir o contorno facial enquanto aplica o produto para um efeito lifting imediato.",
    priceBRL: 240.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/T1W7FPXd/44c88aaa91c275254a2890625d122bf7.jpg",
    rating: 4.9,
    reviewsCount: 45,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 20
  },
  {
    id: "medicube-placenta-capsule-serum",
    name: "Medicube Placenta Capsule Serum (25 ml)",
    jpName: "メディキューブ プラセンタ カプセル セラム",
    description: "Tratamento inovador de alta performance em gel repleto de microcápsulas activas. Combina os benefícios regenerativos da placenta com a ação iluminadora e protetora de um complexo de vitaminas.",
    priceBRL: 220.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/YSHCQS69/71x-Xh-HGE5t-L-AC-UF894-1000-QL80.jpg",
    rating: 4.9,
    reviewsCount: 42,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 15
  },
  {
    id: "medicube-hyaluronic-multi-peptide-serum",
    name: "Medicube Hyaluronic Multi Peptide Serum (30 ml)",
    jpName: "メディキューブ ヒアルロン マルチ ペプチド",
    description: "Um super booster de hidratação e sustentação cutânea. Fórmula une alta concentração de ácido hialurônico a um complexo robusto de peptídeos.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/kXSCwmXq/XXL-p0217815188.webp",
    rating: 4.8,
    reviewsCount: 65,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 20
  },
  {
    id: "medicube-pdrn-pink-collagen-exosome-shot",
    name: "Medicube PDRN Pink Collagen Exosome Shot 7500 (30 ml)",
    jpName: "メディキューブ PDRN ピンクコラーゲン エクソソーム",
    description: "Sérum intensivo combinando PDRN (DNA de Salmão), exossomos e colágeno para regeneração profunda.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/pXKTr8jf/medicube-serum-pink-pdrn-colag-exosso-shot-7500-30ml-28791.jpg",
    rating: 4.9,
    reviewsCount: 54,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 10
  },
  {
    id: "medicube-exosome-cica-ampoule",
    name: "Medicube Exosome Cica Ampoule (30 ml)",
    jpName: "メディキューブ エクソソーム シカ アンプル",
    description: "Ampola calmante e reparadora de barreira com tecnologia de exossomos e Centelha Asiática (Cica).",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/wBrH0TJQ/61coyn-Yo-MHL-AC-UF1000-1000-QL80.jpg",
    rating: 4.8,
    reviewsCount: 73,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 18
  },
  {
    id: "medicube-azelaic-acid-16-bb",
    name: "Medicube Azelaic Acid 16 BB Calming Serum (30 ml)",
    jpName: "メディキューブ アゼライン酸 16 BB",
    description: "Sérum calmante com 16% de Ácido Azelaico para controle de oleosidade e redução de imperfeições.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/wBn8D48W/D-Q-NP-948219-MLA108207884961-032026-O.webp",
    rating: 4.7,
    reviewsCount: 39,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 14
  },
  {
    id: "medicube-pdrn-pink-peptide-serum",
    name: "Medicube PDRN Pink Peptide Serum (30 ml)",
    jpName: "メディキューブ PDRN ピンク ペプチド セラム",
    description: "Sérum anti-idade global com DNA de salmão (PDRN) e complexo de peptídeos rosados para densidade e viço.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/hGk6XJTC/219175-800-800.jpg",
    rating: 4.9,
    reviewsCount: 48,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 22
  },
  {
    id: "aztk-mousse-cream-cheek",
    name: "AZTK Mousse Cream Cheek (jc06)",
    jpName: "AZTK ムースクリームチーク",
    description: "Um blush em mousse de alta pigmentação vindo da nova tendência de maquiagem asiática. Possui textura leve que se espalha como nuvem.",
    priceBRL: 87.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/6QD4kzKz/61WMSNC5Xb-L.jpg",
    rating: 4.7,
    reviewsCount: 45,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 25
  },
  {
    id: "elroel-blanc-cover-cream-stick",
    name: "Elroel Blanc Cover Cream Stick",
    jpName: "エルロエル ブランカバークリームスティック",
    description: "Base inovadora em bastão que muda de col para se adaptar ao seu tom. Acompanha um pincel embutido de cerdas ultra macias.",
    priceBRL: 349.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/QN6hVC9N/71q0ept-Iq-JL.jpg",
    rating: 4.9,
    reviewsCount: 67,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 15
  },
  {
    id: "clio-kill-lash-mascara-sleek",
    name: "Clio Kill Lash Superproof Mascara (Sleek Volume)",
    jpName: "クリオ キルラッシュ マスカラ (スリーク)",
    description: "Uma das máscaras de cílios mais vendidas da Coreia. À prova d'água, encorpa e destaca sem empelotar.",
    priceBRL: 130.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/8PJQ5Hgc/XXL-p0223316886.jpg",
    rating: 5.0,
    reviewsCount: 112,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 30
  },
  {
    id: "laneige-neo-finishing-powder",
    name: "Laneige Neo Essential Finishing Powder",
    jpName: "ラネージュ ネオフィニッシングパウダー",
    description: "Pó facial finalizador compacto de textura ultra fina. Controla o brilho e sela a maquiagem com efeito blur óptico.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/TYWFG3nJ/616s-VXYBJ1L-AC-UF1000-1000-QL80.jpg",
    rating: 4.8,
    reviewsCount: 54,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 20
  },
  {
    id: "sheglam-liquid-highlighter-silver",
    name: "Sheglam Liquid Highlighter / Color Bloom (Prata)",
    jpName: "シーグラム リキッドハイライター",
    description: "O iluminador/blush líquido queridinho das redes sociais. Textura leve, acabamento radiante e alta fixação.",
    priceBRL: 60.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/qRNV3X6b/171694935886e475e54439c155a0a934e94433ea3c.jpg",
    rating: 4.9,
    reviewsCount: 230,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 40
  },
  {
    id: "decorte-loose-powder-20g",
    name: "Decorté Loose Powder (20g)",
    jpName: "コスメデコルテ フェイスパウダー",
    description: "Pó facial solto de luxo japonês. Sela a maquiagem com texturas de seda ultra finas, disfarça poros e hidrata.",
    priceBRL: 214.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/SNp3SpVx/06-1.jpg",
    rating: 5.0,
    reviewsCount: 89,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 12
  },
  {
    id: "medicube-collagen-milk-wrapping-mask",
    name: "Medicube Collagen Milk Toning Wrapping Mask (75 ml)",
    jpName: "メディキューブ コラーゲンミルク マスク",
    description: "Máscara coreana do tipo peel-off. Promove efeito imediato de clareamento de tom, hidratação profunda e firmeza.",
    priceBRL: 125.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/PJpX71xN/shopping.webp",
    rating: 4.9,
    reviewsCount: 77,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 18
  },
  {
    id: "medicube-kojic-turmeric-night-mask",
    name: "Medicube Kojic Acid Turmeric Night Wrapping Mask (75 ml)",
    jpName: "メディキューブ コウジ酸 ナイトマスク",
    description: "Tratamento noturno intensivo. Combate a opacidade, renova a textura e suaviza manchas persistentes.",
    priceBRL: 125.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/cCWhSdWh/71GJ5l-S77ML.jpg",
    rating: 4.8,
    reviewsCount: 61,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 15
  },
  {
    id: "anua-heartleaf-cleansing-oil",
    name: "Anua Heartleaf Pore Control Cleansing Oil (200 ml)",
    jpName: "アヌア ドクダミクレンジングオイル",
    description: "O famoso óleo de limpeza coreano. Remove maquiagem pesada, dissolve sebo e combate cravos.",
    priceBRL: 205.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/qRwhNrnX/353468.jpg",
    rating: 5.0,
    reviewsCount: 198,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 22
  },
  {
    id: "lululun-hydra-v-vitamin-yellow",
    name: "LuLuLun Hydra-V-Mask Vitamin (Amarelo - 7 un)",
    jpName: "ルルルン ハイドラ V マスク",
    description: "Máscara diária viral no Japão. Coquetel de 7 vitaminas para elasticidade e uniformização do tom.",
    priceBRL: 60.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/FRTz9ZXQ/D-NQ-NP-832020-MLU77634677709-072024-O.webp",
    rating: 4.9,
    reviewsCount: 165,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 35
  },
  {
    id: "lululun-hydra-ex-exosome-purple",
    name: "LuLuLun Hydra-Ex-Mask Exosome (Roxo - 7 un)",
    jpName: "ルルルン ハイドラ EX マスク",
    description: "Tratamento diário avançado anti-idade. Utiliza exossomos para regeneração celular e rejuvenescimento.",
    priceBRL: 60.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/WzQ23Y98/Hydra-EX-01.jpg",
    rating: 4.9,
    reviewsCount: 143,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 30
  },
  {
    id: "naturie-hatomugi-conditioner-500ml",
    name: "Naturie Hatomugi Skin Conditioner (500ml)",
    jpName: "ナチュリエ ハトムギ化粧水",
    description: "A loção hidratante nº 1 do Japão. Tamanho mega econômico, acalma, equilibra e hidrata sem pesar.",
    priceBRL: 40.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 50.00,
    image: "https://i.postimg.cc/SjFhq2sg/sg-11134207-7qvdb-lhr9tm8ltk8o14.jpg",
    rating: 5.0,
    reviewsCount: 412,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 50
  },
  {
    id: "ululis-water-conch-black-serum",
    name: "Ululis Premium Water Conch Black Serum Hair Oil",
    jpName: "ウルリス プレミアムヘアオイル",
    description: "Óleo capilar japonês de altíssimo padrão. Hidratação profunda à base de água, repara danos e elimina frizz.",
    priceBRL: 110.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/cHvCL3x0/images-(1).jpg",
    rating: 4.9,
    reviewsCount: 88,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 20
  },
  {
    id: "utena-matomage-stick-regular-pink",
    name: "Utena Matomage Hair Styling Stick (Regular - Rosa)",
    jpName: "ウテナ マトメージュ まとめ髪スティック",
    description: "O segredo japonês para penteados alinhados. Cera em bastão para assentar baby hairs e frizz.",
    priceBRL: 56.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 25.00,
    image: "https://i.postimg.cc/90GWDtvy/a34a1057-169d-4422-809e-0f3af474797e-psdues0kyd.jpg",
    rating: 4.8,
    reviewsCount: 121,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 40
  },
  {
    id: "im-from-rice-toner",
    name: "I'm From Rice Toner (150 ml)",
    jpName: "アイムフロム ライストナー (米糠)",
    description: "Suaviza a pele com extratos de arroz e farelo de arroz.",
    priceBRL: 139.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/pTdNrdXw/rice.png",
    rating: 4.9,
    reviewsCount: 312,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 25
  },
  {
    id: "medicube-zero-pore-one-day-serum",
    name: "Medicube Zero Pore One Day Serum",
    jpName: "メディキューブ ゼロポア セラム",
    description: "Solução para controle de oleosidade e redução de poros.",
    priceBRL: 180.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/jdhr7jkn/51m-Us3LO2n-L-AC-UF1000-1000-QL80.jpg",
    rating: 4.8,
    reviewsCount: 150,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 20
  },
  {
    id: "medicube-one-day-exosome-shot",
    name: "Medicube One Day Exosome Shot 2000",
    jpName: "メディキューブ エクソソームショット",
    description: "Sérum com tecnologia de micro-spicules para renovação celular.",
    priceBRL: 165.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/NfBtNX34/37.jpg",
    rating: 4.9,
    reviewsCount: 120,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 20
  },
  {
    id: "medicube-kojic-acid-turmeric-niacinamide",
    name: "Medicube Kojic Acid Turmeric Niacinamide Serum",
    jpName: "メディキューブ コウジ酸セラム",
    description: "Tratamento para clareamento de manchas e marcas de acne.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/RhmkDrDN/19601185.webp",
    rating: 4.8,
    reviewsCount: 88,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 15
  },
  {
    id: "medicube-glutathione-glow-serum",
    name: "Medicube Glutathione Glow Serum (30 g)",
    jpName: "メディキューブ グルタチオンセラム",
    description: "Ação antioxidante potente e efeito glow.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/B6TyDYQM/17007295.webp",
    rating: 4.9,
    reviewsCount: 145,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 18
  },
  {
    id: "medicube-retinol-nmn-boosting-serum",
    name: "Medicube Retinol NMN Boosting Serum",
    jpName: "メディキューブ レチノールセラム",
    description: "Sérum antienvelhecimento com retinol e NMN.",
    priceBRL: 188.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/MHZsBzLx/XXL-p0218988822.jpg",
    rating: 4.9,
    reviewsCount: 92,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 10
  },
  {
    id: "medicube-pdrn-one-day-ampoule",
    name: "Medicube PDRN One Day Ampoule",
    jpName: "メディキューブ PDRNアンプル",
    description: "DNA de salmão purificado para regeneração e colágeno.",
    priceBRL: 155.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/CLz7prph/17074662.jpg",
    rating: 5.0,
    reviewsCount: 115,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 12
  },
  {
    id: "biore-makeup-remover-oil",
    name: "Biore Makeup Remover Oil",
    jpName: "ビオレ メイク落とし クレンジングオイル",
    description: "Óleo remover de maquiagem Biore.",
    priceBRL: 89.90,
    serviceFeeBRL: 0,
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
    description: "Óleo de limpeza facial demaquilante.",
    priceBRL: 110.00,
    serviceFeeBRL: 0,
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
    description: "Espuma de limpeza facial mais vendida do Japão.",
    priceBRL: 54.90,
    serviceFeeBRL: 0,
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
    jpName: "毛穴撫子 お米 de パック",
    description: "Máscara facial de arroz japonês 100%.",
    priceBRL: 85.90,
    serviceFeeBRL: 0,
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
    description: "Máscara lifting com NMN + 50 Peptídeos.",
    priceBRL: 65.90,
    serviceFeeBRL: 0,
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
    description: "Booster potente com Retinal.",
    priceBRL: 128.90,
    serviceFeeBRL: 0,
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
    description: "Creme clareador para poros e manchas.",
    priceBRL: 112.90,
    serviceFeeBRL: 0,
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
    description: "Sérum com Retinol que firma a pele.",
    priceBRL: 138.90,
    serviceFeeBRL: 0,
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
    description: "Pente massageador capilar ReFa.",
    priceBRL: 182.90,
    serviceFeeBRL: 0,
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
    description: "Pente massageador capilar ReFa vermelho.",
    priceBRL: 149.90,
    serviceFeeBRL: 0,
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
    description: "Máscara de reparação intensiva capilar.",
    priceBRL: 99.00,
    serviceFeeBRL: 0,
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
    serviceFeeBRL: 0,
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
    serviceFeeBRL: 0,
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
    serviceFeeBRL: 0,
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
    description: "Lápis + escova para sobrancelhas.",
    priceBRL: 75.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 30.00,
    image: "https://i.postimg.cc/HW5c3WtJ/Captura-de-tela-2026-05-28-023259.png",
    rating: 4.5,
    reviewsCount: 118,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem e cuidados com o cabelo",
    stock: 30
  },
  {
    id: "traen-230-hair-removal",
    name: "TraEn 230 Hair Removal Tool",
    jpName: "TraEn 230 脱毛器",
    description: "Removedor de pelos facial / corporal.",
    priceBRL: 90.00,
    serviceFeeBRL: 0,
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
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"store" | "account" | "about" | "admin">("store");
  
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
        if (activeTab === "account" || activeTab === "admin") setActiveTab("store");
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
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex gap-1 flex-wrap justify-end">
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
          
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === "admin" ? "bg-red-600 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            Painel Armazém 🏢
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
                <p>Iniciamos nossa empresa com um sonho: levar até o Brasil os melhores produtos nacionais e importados, trazendo qualidade, beleza, tecnologia e novidades que conquistam o mundo inteiro. 🇯🇵🇰🇷</p>
                <p>Selecionamos cada produto com carinho para oferecer itens originais, tendências de skincare, cosméticos, cuidados pessoais e muito mais, diretamente do Japão e da Coreia para você.</p>
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
      ) : activeTab === "admin" ? (
        <main className="flex-1 bg-slate-50 py-8 px-4 min-h-[85vh]">
          <AdminDashboard />
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

      <WhatsAppFloat />

    </div>
  );
}
