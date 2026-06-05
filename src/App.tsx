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
  // ==========================================
  // 🌟 OS PRODUTOS NOVOS DE HOJE ESTÃO AQUI NO TOPO! 🌟
  // ==========================================
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

  // --- SKINCARE E TRATAMENTOS FACIAIS ---
  {
    id: "ckd-retino-collagen-guasha-serum",
    name: "CKD Guaranteed Retino Collagen Guasha Lifting Serum (40 ml)",
    jpName: "CKD レチノコラーゲン グアシャ セラム",
    description: "Inovador sérum anti-flacidez com colágeno de baixo peso molecular (300Da) e Retinal encapsulado. Possui uma ponteira Guasha de aço integrada ao tubo, permitindo massagear e esculpir o contorno facial enquanto aplica o produto para um efeito lifting imediato.",
    priceBRL: 240.0
