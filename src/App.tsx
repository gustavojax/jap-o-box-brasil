import React, { useState, useMemo, useEffect } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import RedirectBanner from "./components/RedirectBanner";
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

import { ArrowUpDown, CheckCircle2, Clock, Truck, CheckCircle, Heart, MapPin, ExternalLink, Info } from "lucide-react";

import { auth, db } from "./firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

// ==========================================
// BASE DE DADOS DE PRODUTOS COMPLETA E REVISADA
// ==========================================
const PRODUCTS: Product[] = [
  // --- SKINCARE E TRATAMENTOS FACIAIS ---
  {
    id: "anessa-perfect-uv-milk-sachet",
    name: "Anessa Perfect UV Sunscreen Skincare Milk (Sachet - 60ml)",
    jpName: "アネッサ パーフェクトUV スキンケアミルク",
    description: "Protetor solar facial/corporal em leite (milk). Fator de Proteção: SPF 50+ PA++++. Muito resistente à água e suor, textura leve, acaba seco e não deixa branco. Um dos protetores solares mais vendidos no Japão.",
    priceBRL: 189.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/QtwJjnp6/images-(3).jpg",
    rating: 4.9,
    reviewsCount: 345,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 30
  },
  {
    id: "anessa-perfect-uv-milk-normal",
    name: "Anessa Perfect UV Sunscreen Skincare Milk (60ml)",
    jpName: "アネッサ パーフェクトUV スキンケアミルク",
    description: "Protetor solar facial/corporal em leite (milk). Fator de Proteção: SPF 50+ PA++++. Mesma linha premium da Anessa, com alta proteção, skincare integrado (hidrata enquanto protege) e excelente performance em dias quentes/molhados.",
    priceBRL: 199.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/1XDwsRR9/images-(4).jpg",
    rating: 5.0,
    reviewsCount: 412,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
  },
  {
    id: "dr-althea-345-relief-cream",
    name: "Dr. Althea 345 Relief Cream",
    jpName: "Dr. Althea 345 リリーフ クリーム",
    description: "Creme calmante e hidratante para todos os tipos de pele. Contém Ceramidas, Niacinamida, Centella e Ácido Hialurônico. Excelente para pele sensível, irritada ou com barreira danificada.",
    priceBRL: 199.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/BZ75z3fb/athea.jpg",
    rating: 4.9,
    reviewsCount: 112,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "vt-rejuvenating-lifting-eye-cream",
    name: "VT Rejuvenating Lifting Eye Cream",
    jpName: "VT リジュベネイティング リフティング アイクリーム",
    description: "Creme para olhos com efeito lifting da VT Cosmetics. Ajuda a reduzir rugas, firmar a pele e melhorar olheiras.",
    priceBRL: 176.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/fRmxk0t8/vt.jpg",
    rating: 4.8,
    reviewsCount: 85,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 15
  },
  {
    id: "axis-y-vegan-collagen-eye-serum",
    name: "AXIS-Y Vegan Collagen Eye Serum",
    jpName: "AXIS-Y ヴィーガン コラーゲン アイ セラム",
    description: "Sérum vegano para olhos com colágeno vegetal, peptídeos e ácido hialurônico. Possui roller metálico para massagem refrescante.",
    priceBRL: 176.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/k41SLQZ0/axis.jpg",
    rating: 4.9,
    reviewsCount: 98,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 18
  },
  {
    id: "qoo10-anti-signal-wrinkle-hunter-eye-cream",
    name: "Qoo10 Anti-Signal Wrinkle Hunter Eye Cream",
    jpName: "アンチシグナル リンクルハンター アイクリーム",
    description: "Creme japonês anti-rugas para olhos com Retinol e Niacinamida. Focado em reduzir linhas finas e melhorar a firmeza.",
    priceBRL: 99.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/mZnMwS7m/qoo.avif",
    rating: 4.7,
    reviewsCount: 64,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
    stock: 22
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
    stock: 50
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
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
    category: "Skincare e Tratamentos Faciais",
    stock: 18
  },
  {
    id: "medicube-zero-pore-pad",
    name: "Medicube Zero Pore Pad 2.0",
    jpName: "メディキューブ ゼロポアパッド 2.0",
    description: "Discos de algodão tonificantes com AHA/BHA para limpar poros e reduzir a oleosidade visivelmente.",
    priceBRL: 185.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/YqhP4j2n/pore.avif",
    rating: 4.9,
    reviewsCount: 182,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "medicube-pdrn-pink-mask-sheet",
    name: "Medicube PDRN Pink Collagen Gel Mask",
    jpName: "メディキューブ PDRN ピンクコラーゲン ゲルマスク",
    description: "Máscara facial em gel (sheet mask) para hidratação intensiva, preenchimento e elasticidade.",
    priceBRL: 119.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/52JcGLMC/sg-11134207-7rdyf-lzzc5w8pci8yd5.jpg",
    rating: 4.8,
    reviewsCount: 95,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 15
  },
  {
    id: "medicube-collagen-jelly-cream",
    name: "Medicube Collagen Jelly Cream",
    jpName: "メディキューブ コラーゲン ゼリークリーム",
    description: "Creme rosa com textura de gelatina. Preenche e dá elasticidade imediata com colágeno hidrolisado.",
    priceBRL: 183.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/CxCsdVDh/colagem.jpg",
    rating: 4.9,
    reviewsCount: 110,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
  },
  {
    id: "skin1004-centella-travel-kit",
    name: "SKIN1004 Madagascar Centella Travel Kit",
    jpName: "SKIN1004 マダガスカル センテラ トラベルキット",
    description: "Kit de viagem (5 itens) com centelha asiática calmante, ideal para peles sensíveis.",
    priceBRL: 188.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/ZY9gnC5c/stevalana.jpg",
    rating: 4.9,
    reviewsCount: 134,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 15
  },
  {
    id: "sana-nameraka-wrinkle-eye-cream",
    name: "SANA Nameraka Honpo Wrinkle Eye Cream",
    jpName: "なめらか本舗 リンクルアイクリーム",
    description: "Creme de olhos japonês rico em isoflavonas de soja e retinol puro. Hidrata e combate linhas finas.",
    priceBRL: 79.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/G26XGxmS/sana.webp",
    rating: 4.8,
    reviewsCount: 215,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 30
  },
  {
    id: "skin1004-centella-ampoule",
    name: "SKIN1004 Madagascar Centella Ampoule",
    jpName: "SKIN1004 マダガスカル センテラ アンプル",
    description: "Ampola calmante coreana com 100% de extrato de Centelha Asiática de Madagascar.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/Qdj0Qtjj/centella.jpg",
    rating: 4.9,
    reviewsCount: 290,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "medicube-triple-collagen-toner",
    name: "Medicube Triple Collagen Toner",
    jpName: "メディキューブ トリプルコラーゲン トナー",
    description: "Tônico facial de alta absorção com complexo de triplo colágeno para pele ressecada.",
    priceBRL: 99.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/vTWt9RjB/toner.jpg",
    rating: 4.8,
    reviewsCount: 78,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
  },
  {
    id: "medicube-pdrn-capsule-cream",
    name: "Medicube PDRN Pink Collagen Capsule Cream",
    jpName: "メディキューブ PDRN ピンクコラーゲン カプセルクリーム",
    description: "Creme com cápsulas de PDRN (DNA de salmão) e colágeno para firmeza noturna.",
    priceBRL: 173.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/RhQwh76H/cream.webp",
    rating: 4.9,
    reviewsCount: 65,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 18
  },
  {
    id: "kiss-me-heroine-mascara-remover",
    name: "Kiss Me Heroine Make Speedy Mascara Remover",
    jpName: "ヒロインメイク スピーディーマスカラリムーバー",
    description: "Removedor instantâneo para máscaras de cílios à prova d'água super resistentes.",
    priceBRL: 129.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 30.00,
    image: "https://i.postimg.cc/qR23DsGL/heroine.jpg",
    rating: 5.0,
    reviewsCount: 430,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 40
  },
  {
    id: "biore-aqua-rich-stray-kids",
    name: "Bioré UV Aqua Rich (Edição Stray Kids)",
    jpName: "ビオレUV アクアリッチ ウォータリーエッセンス Stray Kids限定",
    description: "Protetor solar aquoso FPS50+ (Edição Limitada Stray Kids).",
    priceBRL: 80.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/c4xnT8th/stray.jpg",
    rating: 4.9,
    reviewsCount: 156,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "anua-heartleaf-77-toner-500",
    name: "Anua Heartleaf 77 Soothing Toner (500ml)",
    jpName: "アヌア ドクダミ 77% スージングトナー 500ml",
    description: "Tônico calmante coreano nº 1 com 77% de extrato de Houttuynia Cordata (Tamanho Gigante).",
    priceBRL: 230.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 45.00,
    image: "https://i.postimg.cc/jj7wCHB5/anua.avif",
    rating: 5.0,
    reviewsCount: 512,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
  },
  {
    id: "anua-quercetinol-pore-cleansing-foam",
    name: "Anua Heartleaf Quercetinol Pore Deep Cleansing Foam",
    jpName: "アヌア ドクダミ ポアクレンジングフォーム",
    description: "Espuma de limpeza profunda que esfolia suavemente e limpa cravos.",
    priceBRL: 140.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/KcNKKvpJ/anuas.jpg",
    rating: 4.8,
    reviewsCount: 198,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 30
  },
  {
    id: "boj-revive-eye-serum-ginseng",
    name: "Beauty of Joseon Revive Eye Serum Ginseng + Retinal",
    jpName: "朝鮮美女 ジンセン＋レチナール アイクリーム",
    description: "Sérum de olhos coreano super potente com Extrato de Ginseng e Retinal (Retinol avançado).",
    priceBRL: 118.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/KcNKKvpJ/anuas.jpg",
    rating: 4.9,
    reviewsCount: 285,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
  },
  {
    id: "numbuzin-no9-cream",
    name: "Numbuzin No.9 Cream",
    jpName: "ナンバーズイン 9番 ボトックスクリーム",
    description: "Creme 'efeito botox' anti-rugas intensivo em formato de seringa para aplicação precisa.",
    priceBRL: 130.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/xdnDbY4J/numb.jpg",
    rating: 4.8,
    reviewsCount: 140,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "numbuzin-no9-toner",
    name: "Numbuzin No.9 Toner",
    jpName: "ナンバーズイン 9番 トナー",
    description: "Tônico firmador e preenchedor de alta densidade da linha anti-idade No.9.",
    priceBRL: 120.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/zB29MhXP/toners.webp",
    rating: 4.9,
    reviewsCount: 112,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 18
  },
  {
    id: "senka-perfect-whip-premium",
    name: "Senka Perfect Whip PREMIUM",
    jpName: "専科 パーフェクトホイップ プレミアム",
    description: "Versão premium (Prata) da famosa espuma de limpeza japonesa. Microespuma ainda mais rica e hidratante.",
    priceBRL: 69.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/CxFpRStJ/images.jpg",
    rating: 4.9,
    reviewsCount: 310,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 40
  },
  {
    id: "biore-aqua-rich-normal",
    name: "Bioré UV Aqua Rich (Versão Normal)",
    jpName: "ビオレUV アクアリッチ ウォータリーエッセンス",
    description: "O protetor solar mais vendido do mundo. Textura de água, não deixa a pele branca e absorve rápido.",
    priceBRL: 69.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/vBxpJBgQ/17.avif",
    rating: 5.0,
    reviewsCount: 654,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 50
  },
  {
    id: "anua-10-niacinamide-txa4",
    name: "Anua 10+ Niacinamide TXA 4 Dark Spot Correcting Serum",
    jpName: "アヌア ナイアシンアミド 10+ TXA 4 セラム",
    description: "Sérum clareador intensivo com Niacinamida e Ácido Tranexâmico para combater manchas e marcas de acne.",
    priceBRL: 159.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/zGD4Jpb0/57.avif",
    rating: 4.9,
    reviewsCount: 185,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 22
  },
  {
    id: "anua-retinol-caffeine-eye-cream",
    name: "Anua Retinol 0.1+ Caffeine Revitalizing Eye Cream",
    jpName: "アヌア レチノール 0.1+ カフェイン アイクリーム",
    description: "Creme para área dos olhos com Retinol e Cafeína. Combate olheiras, inchaço e linhas de expressão.",
    priceBRL: 159.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/0jqHhC1x/XXL-p0222281176.webp",
    rating: 4.8,
    reviewsCount: 164,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "1988-eye-cream-retinol",
    name: "1988 Eye Cream Retinol",
    jpName: "1988 レチノール アイクリーム",
    description: "Creme de olhos coreano com Retinol puro, conhecido por suavizar a 'The Line' sob os olhos.",
    priceBRL: 167.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/HkLPGxRt/61wkxi21ot-L-AC-SY300-SX300-QL70-ML2.jpg",
    rating: 4.7,
    reviewsCount: 88,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 15
  },
  {
    id: "aqualabel-special-gel-cream-red",
    name: "Aqualabel Special Gel Cream Moist Smooth",
    jpName: "アクアレーベル スペシャルジェルクリーム モイスト",
    description: "Gel creme 5-em-1 da Shiseido. Hidratação profunda com aminoácidos que penetram nos poros.",
    priceBRL: 120.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/BbsMmQ2K/aqua.jpg",
    rating: 4.9,
    reviewsCount: 175,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
  },
  {
    id: "kobayashi-keshimin-cream-ex",
    name: "Kobayashi Keshimin Cream EX",
    jpName: "小林製薬 ケシミンクリームEX",
    description: "Pomada clareadora de manchas hiper concentrada com Vitamina C. Inibe a produção de melanina.",
    priceBRL: 90.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/bNm3RPr1/71CR-Fi-Pot-L.jpg",
    rating: 4.8,
    reviewsCount: 142,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "kracie-hadabisei-wrinkle-serum",
    name: "Kracie Hadabisei Wrinkle Care Facial Serum",
    jpName: "クラシエ 肌美精 リンクルケア 濃密潤い美容液",
    description: "Sérum facial focado no cuidado extremo de rugas com derivado de Retinol e geleia real.",
    priceBRL: 160.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/sXCkRzpy/cb8qfmt2zfefwxw2skxa8j0g792pngzj.webp",
    rating: 4.8,
    reviewsCount: 96,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 15
  },
  {
    id: "rejuran-turnover-cream",
    name: "Rejuran Turnover Cream",
    jpName: "リジュラン ターンオーバー クリーム",
    description: "Derivado de DNA de salmão (PDRN). Versão cosmética da famosa injeção de regeneração celular da Coreia.",
    priceBRL: 184.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/nVk6N6Mh/D-NQ-NP-666523-CBT92059846137-092025-O.webp",
    rating: 4.9,
    reviewsCount: 110,
    department: "Beleza, Higiene e Saúde",
    category: "Skincare e Tratamentos Faciais",
    stock: 18
  },

  // --- MAQUIAGEM ---
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
    category: "Maquiagem",
    stock: 25
  },
  {
    id: "elroel-blanc-cover-cream-stick",
    name: "Elroel Blanc Cover Cream Stick",
    jpName: "エルロエル ブランカバークリームスティック",
    description: "Base inovadora em bastão que muda de cor para se adaptar ao seu tom. Acompanha um pincel embutido de cerdas ultra macias.",
    priceBRL: 349.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/QN6hVC9N/71q0ept-Iq-JL.jpg",
    rating: 4.9,
    reviewsCount: 67,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem",
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
    category: "Maquiagem",
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
    category: "Maquiagem",
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
    category: "Maquiagem",
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
    category: "Maquiagem",
    stock: 12
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
    category: "Maquiagem",
    stock: 30
  },
  {
    id: "anessa-blush-on-powder",
    name: "Anessa Perfect UV Blush-On Powder SPF50+",
    jpName: "アネッサ パーフェクトUV さらさらパウダー",
    description: "Protetor solar em pó facial com pincel integrado, FPS 50+ PA++++. Toque seco e sedoso.",
    priceBRL: 220.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/2S2F4NkJ/images-(1).jpg",
    rating: 4.9,
    reviewsCount: 145,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem",
    stock: 25
  },
  {
    id: "club-suppin-powder-pink",
    name: "Club Suppin Powder (Rosa)",
    jpName: "クラブ すっぴんパウダー パステルローズの香り",
    description: "Pó translúcido para usar de dia ou de noite. Não precisa de demaquilante. Aroma de rosas.",
    priceBRL: 139.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/g2k3ctVR/images-(2).jpg",
    rating: 4.8,
    reviewsCount: 220,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem",
    stock: 35
  },
  {
    id: "club-suppin-powder-green",
    name: "Club Suppin Powder (Verde)",
    jpName: "クラブ すっぴんパウダー ホワイトフローラルブーケの香り",
    description: "Pó translúcido que minimiza poros sem precisar de demaquilante. Aroma de buquê floral branco.",
    priceBRL: 139.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/vHX6K7JV/71Z7Vb-FKt-OL-AC-SL1500.jpg",
    rating: 4.8,
    reviewsCount: 180,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem",
    stock: 30
  },
  {
    id: "florasis-lipstick-ruby-jam",
    name: "Florasis Lipstick (Moist L103 Ruby Jam)",
    jpName: "花西子 Florasis 彫刻リップスティック",
    description: "Batom chinês de altíssimo luxo com esculturas tridimensionais detalhadas na própria bala do batom.",
    priceBRL: 223.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/85h7mLd7/images.jpg",
    rating: 5.0,
    reviewsCount: 98,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem",
    stock: 12
  },
  {
    id: "the-saem-cover-perfection",
    name: "The Saem Cover Perfection Concealer",
    jpName: "ザセム カバーパーフェクション チップコンシーラー",
    description: "O corretivo coreano que viralizou. Alta cobertura com longa duração e acabamento perfeito.",
    priceBRL: 120.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 30.00,
    image: "https://i.postimg.cc/MT21b6BG/D-NQ-NP-749188-MLB77144179299-062024-O.webp",
    rating: 4.9,
    reviewsCount: 540,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem",
    stock: 50
  },
  {
    id: "club-suppin-powder-uv-gold",
    name: "Club Suppin Powder UV (Dourada)",
    jpName: "クラブ すっぴんパウダー UV",
    description: "Pó facial 24 horas (dia e noite) com proteção UV. Não precisa de demaquilante. Embalagem dourada.",
    priceBRL: 146.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/VNvTtR8b/54ffb338-2a50-4e32-af8d-55fd9d35cfbf.webp",
    rating: 4.8,
    reviewsCount: 165,
    department: "Beleza, Higiene e Saúde",
    category: "Maquiagem",
    stock: 25
  },

  // --- CUIDADOS CAPILARES ---
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
    category: "Cuidados Capilares",
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
    category: "Cuidados Capilares",
    stock: 40
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
    category: "Cuidados Capilares",
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
    category: "Cuidados Capilares",
    stock: 25
  },
  {
    id: "tsubaki-repair-mask",
    name: "Tsubaki - Premium Ex Repair Mask 180ml",
    jpName: "TSUBAKI プレミアムEX リペアマスク",
    description: "Máscara de reparação intensiva capilar.",
    priceBRL: 60.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/9MkMbKDt/tsuba.png",
    rating: 4.9,
    reviewsCount: 167,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 30
  },
  {
    id: "tsubaki-moist-repair-red",
    name: "Tsubaki Moist & Repair (Red)",
    jpName: "TSUBAKI モイスト＆リペア キット",
    description: "Kit Shampoo + Condicionador Moist & Repair.",
    priceBRL: 89.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.postimg.cc/ZRs9g0Mg/tsubas.png",
    rating: 4.9,
    reviewsCount: 280,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 15
  },
  {
    id: "tsubaki-volume-repair-yellow",
    name: "Tsubaki Premium Volume & Repair (Yellow)",
    jpName: "TSUBAKI ボリューム＆リペア キット",
    description: "Kit Shampoo + Condicionador Volume & Repair.",
    priceBRL: 89.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.ibb.co/q3tT4fHg/41x-M-SSU8x-L-AC-UF1000-1000-QL80-FMwebp.webp",
    rating: 4.8,
    reviewsCount: 340,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 25
  },
  {
    id: "tsubaki-damage-care-black",
    name: "Tsubaki Premium EX Damage Care (Black)",
    jpName: "TSUBAKI プレミアムEX ダメージケア",
    description: "Kit Shampoo + Condicionador EX Damage Care.",
    priceBRL: 96.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.ibb.co/gZnNpzT7/51v-XAUJ7-We-L-AC-UF1000-1000-QL80-FMwebp.webp",
    rating: 4.9,
    reviewsCount: 412,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 20
  },
  {
    id: "fino-premium-touch-mask",
    name: "Fino Premium Touch Hair Mask",
    jpName: "フィーノ プレミアムタッチ 浸透美容液ヘアマスク",
    description: "Máscara capilar de hidratação profunda nº 1 no Japão. Repara cabelos secos e danificados com geléia real e PCA.",
    priceBRL: 60.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/vThLXJ7G/D-NQ-NP-2X-791727-MLA111036030964-052026-F.webp",
    rating: 5.0,
    reviewsCount: 650,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 50
  },
  {
    id: "tsubaki-kit-verde",
    name: "Tsubaki Premium Kit (Verde)",
    jpName: "TSUBAKI プレミアム セット",
    description: "Kit completo de shampoo e condicionador Tsubaki focado em reparação e maciez.",
    priceBRL: 103.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.postimg.cc/90HC1SXH/354602.webp",
    rating: 4.8,
    reviewsCount: 154,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 25
  },
  {
    id: "tsubaki-repair-mask-s-rosa",
    name: "Tsubaki Premium Repair Mask S (Rosa - Lançamento)",
    jpName: "TSUBAKI プレミアムリペアマスク S",
    description: "Edição limitada de primavera (Sakura/Rosa). Reparação premium instantânea sem tempo de espera.",
    priceBRL: 60.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/mggRd74T/images.jpg",
    rating: 4.9,
    reviewsCount: 198,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 35
  },
  {
    id: "honey-melty-shampoo-rosa",
    name: "&Honey Melty Shampoo (Rosa - Avulso)",
    jpName: "&honey メルティ モイストリペア シャンプー 1.0",
    description: "Limpeza hidratante para cabelos ressecados e com frizz. Composto por mel premium e óleo de argan.",
    priceBRL: 110.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 45.00,
    image: "https://i.postimg.cc/fLmh3KcB/8.avif",
    rating: 4.9,
    reviewsCount: 220,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 30
  },
  {
    id: "honey-melty-kit-rosa",
    name: "Kit &Honey Melty Shampoo + Condicionador (Rosa)",
    jpName: "&honey メルティ モイストリペア 限定キット",
    description: "Kit completo de tratamento capilar com mel. Controle de frizz e umidade intensivos.",
    priceBRL: 190.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.postimg.cc/fLmh3KcB/8.avif",
    rating: 5.0,
    reviewsCount: 312,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 25
  },
  {
    id: "refa-honey-queen-kit",
    name: "Kit Refa &Honey Queen (Dourado - 3 itens)",
    jpName: "ReFa × &honey 限定コラボキット",
    description: "Kit luxuoso e exclusivo de escova ReFa Heart Brush e linha capilar de mel &Honey.",
    priceBRL: 520.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.postimg.cc/GtKVYSHz/D-NQ-NP-2X-993675-MLB110890492963-042026-F.webp",
    rating: 5.0,
    reviewsCount: 88,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 10
  },
  {
    id: "honey-moist-pixie-oil",
    name: "Óleo de Cabelo &Honey Moist Pixie (Amarelo)",
    jpName: "&honey モイスト ピクシー ヘアオイル",
    description: "Óleo capilar premium de mel. Focado em nutrição intensa e brilho sem pesar nos fios.",
    priceBRL: 130.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/Hx4hDP0z/D-NQ-NP-2X-718348-MLA110637011648-052026-F.webp",
    rating: 4.8,
    reviewsCount: 165,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 22
  },
  {
    id: "fino-hair-oil",
    name: "Fino Hair Oil - Nutrição",
    jpName: "フィーノ プレミアムタッチ 浸透美容液ヘアオイル",
    description: "Óleo capilar ultraleve que repara danos profundos, previne pontas duplas e dá brilho intenso.",
    priceBRL: 105.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/CKbvk62F/finetoday-fino-premium-touch-hair-oil-oleo-capilar-3.webp",
    rating: 4.9,
    reviewsCount: 290,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 35
  },
  {
    id: "fino-premium-touch-kit",
    name: "Kit Shampoo + Condicionador Fino Premium Touch",
    jpName: "フィーノ プレミアムタッチ シャンプー＆トリートメント",
    description: "Kit de limpeza e tratamento diário com a mesma tecnologia de reparação da famosa máscara Fino.",
    priceBRL: 179.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.postimg.cc/nV334m3v/D-NQ-NP-2X-758794-MLB81608717300-012025-F.webp",
    rating: 4.9,
    reviewsCount: 175,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 20
  },
  {
    id: "tsubaki-cool-repair-kit",
    name: "Kit Tsubaki Premium Cool & Repair (Azul)",
    jpName: "TSUBAKI プレミアムクール＆リペア ポンプペアセット",
    description: "Edição limitada refrescante (Cool) ideal para o verão. Limpa o couro cabeludo e repara danos.",
    priceBRL: 179.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.postimg.cc/XYCx6z41/D-NQ-NP-2X-938804-CBT110708060883-042026-F-conjunto-de-shampoo-e-condicionador-shiseido-tsubaki-prem.webp",
    rating: 4.8,
    reviewsCount: 145,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 18
  },
  {
    id: "tsubaki-oil-force-m",
    name: "Óleo Capilar Tsubaki Oil Force M (Vermelho)",
    jpName: "TSUBAKI オイルフォース M",
    description: "Óleo capilar reparador de alta penetração da famosa linha Tsubaki. Protege do calor e dá maciez.",
    priceBRL: 118.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/Kcp5k2Y5/oleo-capilar-tsubaki-premium-camellia-1.webp",
    rating: 4.9,
    reviewsCount: 112,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 25
  },
  {
    id: "elizavecca-cer100-treatment",
    name: "Elizavecca CER-100 Collagen Ceramide Treatment",
    jpName: "エリザヴェッカ CER-100 コラーゲン セラミド",
    description: "O famoso 'desmaia cabelos' da caixinha ruiva. Tratamento de salão com colágeno e ceramidas para fios danificados.",
    priceBRL: 89.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/3WM4X9Vd/17.avif",
    rating: 4.9,
    reviewsCount: 890,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 45
  },
  {
    id: "lilyeve-grow-turn-ampoule",
    name: "Lilyeve Grow:Turn Ampoule",
    jpName: "Lilyeve グロウターン アンプル",
    description: "Ampola coreana para o couro cabeludo. Ajuda no crescimento, força capilar e combate à queda.",
    priceBRL: 160.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/s2Z2c5Pc/lil.webp",
    rating: 4.8,
    reviewsCount: 95,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 15
  },
  {
    id: "vt-pdrn-reedle-brush-serum",
    name: "VT Cosmetics PDRN + Reedle S Brush Hair Serum (100ml)",
    jpName: "VT PDRN リードルS ブラシヘアセラム",
    description: "Sérum capilar em bisnaga com escova de silicone embutida na ponta. Estimula e trata o couro cabeludo.",
    priceBRL: 154.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 40.00,
    image: "https://i.postimg.cc/XYtjppMV/sg-11134207-82609-ml660ai1v8xsbd.jpg",
    rating: 4.8,
    reviewsCount: 110,
    department: "Beleza, Higiene e Saúde",
    category: "Cuidados Capilares",
    stock: 20
  },

  // --- HIGIENE E CUIDADOS PESSOAIS ---
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
    category: "Higiene e Cuidados Pessoais",
    stock: 50
  },
  {
    id: "femimore-glutathione-soap",
    name: "Femimore Glutathione Bubble Soap",
    jpName: "フェミモア グルタチオン バブルソープ",
    description: "Sabonete íntimo e corporal em espuma com Glutathione. Limpeza suave, controle de odor, oleosidade e clareamento leve.",
    priceBRL: 110.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.ibb.co/spChCy9L/50621-60-7f7bb7dbd3cd39bf13b37bcd7b35754b-1536x1024.jpg",
    rating: 4.8,
    reviewsCount: 64,
    department: "Beleza, Higiene e Saúde",
    category: "Higiene e Cuidados Pessoais",
    stock: 20
  },

  // --- APARELHOS ESTÉTICOS E TECNOLOGIA ---
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
    category: "Aparelhos Estéticos e Tecnologia",
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
    category: "Aparelhos Estéticos e Tecnologia",
    stock: 15
  },
  {
    id: "portable-home-led-beauty-device",
    name: "Portable Home LED Beauty Device",
    jpName: "携帯用 LED 美顔器",
    description: "Aparelho estético portátil com terapia LED e massagem para uso doméstico (Compatível com PDRN e séruns).",
    priceBRL: 980.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 45.00,
    image: "https://i.postimg.cc/3Jc7cdx6/D-NQ-NP-2X-800111-MLB111755666986-062026-F.webp",
    rating: 4.9,
    reviewsCount: 52,
    department: "Beleza, Higiene e Saúde",
    category: "Aparelhos Estéticos e Tecnologia",
    stock: 10
  }
];

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState<"store" | "redirect" | "account" | "about" | "admin">("store");
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser({ ...u });
        setIsAuthOpen(false); 

        // Verifica se o usuário é administrador
        if (u.email) {
          const adminRef = doc(db, "admins", u.email);
          const adminSnap = await getDoc(adminRef);
          setIsAdmin(adminSnap.exists());
        } else {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
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

// ... (mantenha toda a lógica de constantes PRODUCTS, estados, useEffects, etc.)

export default function App() {
  // ... (toda a sua lógica de estado e funções permanece aqui)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0 font-sans text-slate-900 antialiased">
      <div className="w-full bg-slate-900 text-white text-center py-2 px-4 text-xs font-medium tracking-wide flex items-center justify-center gap-4">
        <span>🇯🇵 PRODUTOS 100% ORIGINAIS DIRETO DE MIE, JAPÃO</span>
      </div>

      <Header
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={allCategories}
        cartCount={cartItems.reduce((a, i) => a + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => user ? setActiveTab("account") : setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
        onLogoClick={handleReturnToStore}
      />

      {/* Componentes inseridos CORRETAMENTE dentro do return */}
      <SearchBar />
      <RedirectBanner />

      {/* ... continue com o restante do seu código (abas, vitrine, etc) a partir daqui ... */}
      
      {/* ... finalize com os modais e o footer ... */}
    </div>
  );
} // <--- Apenas UM fechamento de função aqui

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
    setIsAdmin(false);
    setActiveTab("store");
  };

  // =========================
  // UI & FILTERS STATES (CATEGORIAS LIMPAS)
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
      "Skincare e Tratamentos Faciais",
      "Cuidados Capilares",
      "Maquiagem",
      "Aparelhos Estéticos e Tecnologia",
      "Higiene e Cuidados Pessoais"
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
            onClick={() => setActiveTab("redirect")}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === "redirect" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Redirecionamento ✈️
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
          
          {isAdmin && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === "admin" ? "bg-red-600 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              Painel Armazém 🏢
            </button>
          )}
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

      ) : activeTab === "redirect" ? (
        // ========================================================
        // 📦 PÁGINA DE REDIRECIONAMENTO
        // ========================================================
        <main className="flex-1 bg-slate-50 py-12 px-4">
          <section className="max-w-6xl mx-auto">
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <MapPin className="w-48 h-48" />
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Explicação e Endereço */}
                <div>
                  <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight">📦 Compre em Qualquer Loja do Japão</h2>
                  <div className="text-slate-300 space-y-4 text-sm font-medium mb-8">
                    <p>Muitas lojas online japonesas não enviam produtos para o exterior. É para isso que estamos aqui!</p>
                    <p>Com o nosso serviço de <strong className="text-white">Redirecionamento</strong>, você faz compras nos seus sites favoritos como se morasse no Japão usando o nosso endereço como destino. Nós recebemos, organizamos suas caixas e enviamos tudo direto para a sua casa no Brasil.</p>
                    
                    <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-xl flex gap-3 text-blue-200 mt-6">
                      <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed"><strong>Como fazer:</strong> Copie o endereço abaixo e cole na hora de finalizar a compra na loja japonesa. Assim que o pagamento for concluído, clique no botão abaixo para nos enviar o comprovante pelo WhatsApp e avisar que a encomenda está a caminho!</p>
                    </div>
                  </div>

                  {/* Cartão do Endereço */}
                  <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-lg border-l-4 border-blue-600 relative">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Seu Endereço no Japão</p>
                    <p className="font-black text-xl leading-snug mb-1">The Tomorrow</p>
                    <p className="text-slate-600 font-medium">2-chōme-3-15 Matsutera, Yokkaichi</p>
                    <p className="text-slate-600 font-medium">Mie 510-8021</p>
                    <p className="text-slate-800 font-black mt-2">(Japão)</p>
                  </div>

                  <button
                    onClick={() => window.open('https://wa.me/817014074971?text=Ol%C3%A1%21%20Acabei%20de%20fazer%20uma%20compra%20usando%20o%20endere%C3%A7o%20de%20redirecionamento%20da%20Jap%C3%A3o%20Box%20Brasil%20e%20gostaria%20de%20avisar%20o%20envio%21', '_blank')}
                    className="mt-8 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-wider py-4 px-8 rounded-xl transition-colors w-full sm:w-auto shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    Avisar Envio no WhatsApp <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                {/* Links das Lojas */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black mb-4">🔗 Lojas Recomendadas</h3>
                  
                  {/* Roupas */}
                  <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors">
                    <h4 className="text-sm font-bold text-rose-400 mb-3 uppercase tracking-wider">Marcas de Roupa e Calçados</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li><a href="https://www.adidas.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2 transition-colors"><ExternalLink className="w-3 h-3 text-slate-500" /> Adidas Japan</a></li>
                      <li><a href="https://www.gu-global.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2 transition-colors"><ExternalLink className="w-3 h-3 text-slate-500" /> GU</a></li>
                      <li><a href="https://www.onitsukatiger.com/jp/ja-jp/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2 transition-colors"><ExternalLink className="w-3 h-3 text-slate-500" /> Onitsuka Tiger</a></li>
                      <li><a href="https://www.uniqlo.com/jp/ja/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2 transition-colors"><ExternalLink className="w-3 h-3 text-slate-500" /> Uniqlo Japan</a></li>
                      <li><a href="https://www.nike.com/jp/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2 transition-colors"><ExternalLink className="w-3 h-3 text-slate-500" /> Nike Japan</a></li>
                    </ul>
                  </div>

                  {/* Marketplaces & Joias */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors">
                      <h4 className="text-sm font-bold text-emerald-400 mb-3 uppercase tracking-wider">Marketplaces</h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li><a href="https://www.rakuten.co.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2 transition-colors"><ExternalLink className="w-3 h-3 text-slate-500" /> Rakuten JP</a></li>
                        <li><a href="https://www.amazon.co.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2 transition-colors"><ExternalLink className="w-3 h-3 text-slate-500" /> Amazon Japan</a></li>
                        <li><a href="https://jp.mercari.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2 transition-colors"><ExternalLink className="w-3 h-3 text-slate-500" /> Mercari</a></li>
                      </ul>
                    </div>
                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors">
                      <h4 className="text-sm font-bold text-amber-400 mb-3 uppercase tracking-wider">Joias & Moda</h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li><a href="https://www.zara.com/jp/ja/woman-mkt1000.html" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2 transition-colors"><ExternalLink className="w-3 h-3 text-slate-500" /> Zara Japan</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Artigos de Pesca */}
                  <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors">
                    <h4 className="text-sm font-bold text-blue-400 mb-3 uppercase tracking-wider">Artigos de Pesca</h4>
                    <ul className="space-y-4 text-sm text-slate-300">
                      <li>
                        <a href="https://www.digitaka.com" target="_blank" rel="noopener noreferrer" className="text-white flex items-center gap-2 font-bold mb-1 hover:text-blue-400 transition-colors"><ExternalLink className="w-3 h-3 text-slate-500" /> DIGITAKA</a>
                        <p className="text-[11px] text-slate-400 leading-snug">Maior variedade. Uma das mais populares no mundo.</p>
                      </li>
                      <li>
                        <a href="https://www.plat.co.jp" target="_blank" rel="noopener noreferrer" className="text-white flex items-center gap-2 font-bold mb-1 hover:text-blue-400 transition-colors"><ExternalLink className="w-3 h-3 text-slate-500" /> PLAT</a>
                        <p className="text-[11px] text-slate-400 leading-snug">Focada em varas, molinetes (JDM) e peças originais.</p>
                      </li>
                      <li>
                        <a href="https://www.ichibantackle.com" target="_blank" rel="noopener noreferrer" className="text-white flex items-center gap-2 font-bold mb-1 hover:text-blue-400 transition-colors"><ExternalLink className="w-3 h-3 text-slate-500" /> Ichiban Tackle</a>
                        <p className="text-[11px] text-slate-400 leading-snug">Excelente para Iscas JDM (Megabass, Deps, etc).</p>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </section>
        </main>

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
          {isAdmin ? (
            <AdminDashboard />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="text-4xl mb-4">🔒</span>
              <h2 className="text-xl font-black text-slate-900">Acesso Restrito</h2>
              <p className="text-slate-500 mt-2 text-sm">Esta área é exclusiva para a administração da loja.</p>
              <button 
                onClick={handleReturnToStore}
                className="mt-6 bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold"
              >
                Voltar para a Loja
              </button>
            </div>
          )}
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
              <li><button onClick={() => setActiveTab("redirect")} className="hover:text-slate-900 transition-colors cursor-pointer">Redirecionamento</button></li>
              <li><button onClick={() => setActiveTab("about")} className="hover:text-slate-900 transition-colors cursor-pointer">Sobre Nós</button></li>
              <li><button onClick={() => { if(user) { setActiveTab("account") } else { setIsAuthOpen(true) } }} className="hover:text-slate-900 transition-colors cursor-pointer">Rastrear Pedido</button></li>
            </ul>
          </div>
        </div>

        {/* BANNER DE MEIOS DE PAGAMENTO (ATUALIZADO PAYPAL) */}
        <div className="max-w-4xl mx-auto px-4 mt-10 pt-8 border-t border-slate-100 flex flex-col items-center justify-center space-y-4">
          <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Processamento Internacional Seguro via PayPal</p>
          <div className="flex items-center justify-center px-8 py-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
              alt="Meios de Pagamento PayPal" 
              className="h-7 md:h-8 object-contain select-none pointer-events-none"
            />
          </div>
          <p className="text-[11px] font-semibold text-slate-400 text-center max-w-lg mt-2">
            Todas as transações são criptografadas de ponta a ponta. Aceitamos pagamentos à vista ou parcelado nos <strong className="text-slate-500">Cartões de Crédito</strong> e saldo via <strong className="text-slate-500">PayPal</strong>.
          </p>
        </div>

        {/* CRÉDITOS E DIREITOS AUTORAIS */}
        <div className="max-w-7xl mx-auto px-4 mt-8 text-center text-xs text-slate-400 space-y-2">
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
