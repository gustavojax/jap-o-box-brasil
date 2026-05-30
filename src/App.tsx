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
import AdminDashboard from "./components/AdminDashboard"; // <-- PAINEL ADMIN IMPORTADO AQUI

import type { Product, CartItem } from "./types";

import { ArrowUpDown, CheckCircle2, Clock, Truck, CheckCircle, Heart } from "lucide-react";

import { auth, db } from "./firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

// ==========================================
// BASE DE DADOS DE PRODUTOS COMPLETA E REVISADA
// COMPILADO FINAL UNIFICADO
// ==========================================
const PRODUCTS: Product[] = [
  // --- 🛁 CATEGORIA: HIGIENE, CUIDADOS BUCAIS E PRODUTOS PARA BANHO ---
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

  // --- 💇‍♀️ CATEGORIA: MAQUIAGEM E CUIDADOS COM O CABELO ---
  
  // ⚙️ GRUPO: APARELHOS DE BELEZA MEDICUBE (Substitutos oficiais do Booster Pro antigo)
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

  // -- Skincare e Máscaras de Tratamento --
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

  // -- Maquiagem e Cosméticos --
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
    description: "Uma das máscaras de cílios mais vendidas da Coreia. À prova d'ág
