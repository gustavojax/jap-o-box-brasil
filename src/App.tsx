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

import { ArrowUpDown, CheckCircle2, Clock, Truck, CheckCircle, Heart, MapPin, ExternalLink, Info } from "lucide-react";

import { auth, db } from "./firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

// ==========================================
// BASE DE DADOS DE PRODUTOS COMPLETA E REVISADA
// ==========================================
const PRODUCTS: Product[] = [
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
    description: "Sabonete em espuma com Glutathione. Limpeza suave, controle de oleosidade e clareamento leve.",
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
    category: "Aparelhos Estéticos e Tecnologia",
    stock: 14
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
