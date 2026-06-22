import React, { useState, useMemo, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
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
    id: "medicube-forever-cherry-ager-booster",
    name: "Medicube x Forever Cherry Age-R Booster (EdiÃ§Ã£o Especial)",
    jpName: "",
    description: "Dispositivo facial multifuncional com escova vibratÃ³ria rosa em ediÃ§Ã£o especial com laÃ§o. Ideal para limpeza profunda, esfoliaÃ§Ã£o e melhor absorÃ§Ã£o de sÃ©runs.",
    priceBRL: 189.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/Hx8b2BgB/IMG-0671.jpg",
    rating: 5.0,
    reviewsCount: 12,
    department: "Beleza, Higiene e SaÃºde",
    category: "AcessÃ³rios e Dispositivos EstÃ©ticos",
    stock: 5
  },
  {
    id: "femimore-glutathione-bubble-soap",
    name: "Femimore Glutathione Bubble Soap",
    jpName: "",
    description: "Sabonete em espuma com Glutathione. Proporciona limpeza suave, ajuda no controle de oleosidade, odor e promove clareamento leve da pele.",
    priceBRL: 110.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/sf9MRtwB/femimore.jpg",
    rating: 4.7,
    reviewsCount: 45,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "mise-en-scene-perfect-serum-original",
    name: "Mise en ScÃ¨ne Perfect Serum Original",
    jpName: "",
    description: "SÃ©rum capilar coreano queridinho. Proporciona brilho intenso, hidrataÃ§Ã£o, controle de frizz e proteÃ§Ã£o tÃ©rmica aos fios.",
    priceBRL: 75.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/XYhJ8378/serun.webp",
    rating: 4.9,
    reviewsCount: 182,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados com o Cabelo",
    stock: 15
  },

  {
    id: "anessa-perfect-uv-milk-sachet",
    name: "Anessa Perfect UV Sunscreen Skincare Milk (Sachet - 60ml)",
    jpName: "ã‚¢ãƒãƒƒã‚µ ãƒ‘ãƒ¼ãƒ•ã‚§ã‚¯ãƒˆUV ã‚¹ã‚­ãƒ³ã‚±ã‚¢ãƒŸãƒ«ã‚¯",
    description: "Protetor solar facial/corporal em leite (milk). Fator de ProteÃ§Ã£o: SPF 50+ PA++++. Muito resistente Ã  Ã¡gua e suor, textura leve, acaba seco e nÃ£o deixa branco. Um dos protetores solares mais vendidos no JapÃ£o.",
    priceBRL: 189.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/QtwJjnp6/images-(3).jpg",
    rating: 4.9,
    reviewsCount: 345,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 30
  },
  {
    id: "anessa-perfect-uv-milk-normal",
    name: "Anessa Perfect UV Sunscreen Skincare Milk (60ml)",
    jpName: "ã‚¢ãƒãƒƒã‚µ ãƒ‘ãƒ¼ãƒ•ã‚§ã‚¯ãƒˆUV ã‚¹ã‚­ãƒ³ã‚±ã‚¢ãƒŸãƒ«ã‚¯",
    description: "Protetor solar facial/corporal em leite (milk). Fator de ProteÃ§Ã£o: SPF 50+ PA++++. Mesma linha premium da Anessa, com alta proteÃ§Ã£o, skincare integrado (hidrata enquanto protege) e excelente performance em dias quentes/molhados.",
    priceBRL: 199.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/1XDwsRR9/images-(4).jpg",
    rating: 5.0,
    reviewsCount: 412,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
  },
  {
    id: "dr-althea-345-relief-cream",
    name: "Dr. Althea 345 Relief Cream",
    jpName: "Dr. Althea 345 ãƒªãƒªãƒ¼ãƒ• ã‚¯ãƒªãƒ¼ãƒ ",
    description: "Creme calmante e hidratante para todos os tipos de pele. ContÃ©m Ceramidas, Niacinamida, Centella e Ãcido HialurÃ´nico. Excelente para pele sensÃ­vel, irritada ou com barreira danificada.",
    priceBRL: 199.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/BZ75z3fb/athea.jpg",
    rating: 4.9,
    reviewsCount: 112,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "vt-rejuvenating-lifting-eye-cream",
    name: "VT Rejuvenating Lifting Eye Cream",
    jpName: "VT ãƒªã‚¸ãƒ¥ãƒ™ãƒã‚¤ãƒ†ã‚£ãƒ³ã‚° ãƒªãƒ•ãƒ†ã‚£ãƒ³ã‚° ã‚¢ã‚¤ã‚¯ãƒªãƒ¼ãƒ ",
    description: "Creme para olhos com efeito lifting da VT Cosmetics. Ajuda a reduzir rugas, firmar a pele e melhorar olheiras.",
    priceBRL: 176.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/fRmxk0t8/vt.jpg",
    rating: 4.8,
    reviewsCount: 85,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 15
  },
  {
    id: "axis-y-vegan-collagen-eye-serum",
    name: "AXIS-Y Vegan Collagen Eye Serum",
    jpName: "AXIS-Y ãƒ´ã‚£ãƒ¼ã‚¬ãƒ³ ã‚³ãƒ©ãƒ¼ã‚²ãƒ³ ã‚¢ã‚¤ ã‚»ãƒ©ãƒ ",
    description: "SÃ©rum vegano para olhos com colÃ¡geno vegetal, peptÃ­deos e Ã¡cido hialurÃ´nico. Possui roller metÃ¡lico para massagem refrescante.",
    priceBRL: 176.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/k41SLQZ0/axis.jpg",
    rating: 4.9,
    reviewsCount: 98,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 18
  },
  {
    id: "anti-signal-wrinkle-hunter-eye-cream",
    name: "Anti-Signal Wrinkle Hunter Eye Cream",
    jpName: "ã‚¢ãƒ³ãƒã‚·ã‚°ãƒŠãƒ« ãƒªãƒ³ã‚¯ãƒ«ãƒãƒ³ã‚¿ãƒ¼ ã‚¢ã‚¤ã‚¯ãƒªãƒ¼ãƒ ",
    description: "Creme japonÃªs anti-rugas para olhos com Retinol e Niacinamida. Focado em reduzir linhas finas e melhorar a firmeza.",
    priceBRL: 99.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/mZnMwS7m/qoo.avif",
    rating: 4.7,
    reviewsCount: 64,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
  },
  {
    id: "ckd-retino-collagen-guasha-serum",
    name: "CKD Guaranteed Retino Collagen Guasha Lifting Serum (40 ml)",
    jpName: "CKD ãƒ¬ãƒãƒŽã‚³ãƒ©ãƒ¼ã‚²ãƒ³ ã‚°ã‚¢ã‚·ãƒ£ ã‚»ãƒ©ãƒ ",
    description: "Inovador sÃ©rum anti-flacidez com colÃ¡geno de baixo peso molecular (300Da) e Retinal encapsulado. Possui uma ponteira Guasha de aÃ§o integrada ao tubo, permitindo massagear e esculpir o contorno facial enquanto aplica o produto para um efeito lifting imediato.",
    priceBRL: 240.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/T1W7FPXd/44c88aaa91c275254a2890625d122bf7.jpg",
    rating: 4.9,
    reviewsCount: 45,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "medicube-placenta-capsule-serum",
    name: "Medicube Placenta Capsule Serum (25 ml)",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ãƒ—ãƒ©ã‚»ãƒ³ã‚¿ ã‚«ãƒ—ã‚»ãƒ« ã‚»ãƒ©ãƒ ",
    description: "Tratamento inovador de alta performance em gel repleto de microcÃ¡psulas activas. Combina os benefÃ­cios regenerativos da placenta com a aÃ§Ã£o iluminadora e protetora de um complexo de vitaminas.",
    priceBRL: 220.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/YSHCQS69/71x-Xh-HGE5t-L-AC-UF894-1000-QL80.jpg",
    rating: 4.9,
    reviewsCount: 42,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 15
  },
  {
    id: "medicube-hyaluronic-multi-peptide-serum",
    name: "Medicube Hyaluronic Multi Peptide Serum (30 ml)",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ãƒ’ã‚¢ãƒ«ãƒ­ãƒ³ ãƒžãƒ«ãƒ ãƒšãƒ—ãƒãƒ‰",
    description: "Um super booster de hidrataÃ§Ã£o e sustentaÃ§Ã£o cutÃ¢nea. FÃ³rmula une alta concentraÃ§Ã£o de Ã¡cido hialurÃ´nico a um complexo robusto de peptÃ­deos.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/kXSCwmXq/XXL-p0217815188.webp",
    rating: 4.8,
    reviewsCount: 65,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "medicube-pdrn-pink-collagen-exosome-shot",
    name: "Medicube PDRN Pink Collagen Exosome Shot 7500 (30 ml)",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– PDRN ãƒ”ãƒ³ã‚¯ã‚³ãƒ©ãƒ¼ã‚²ãƒ³ ã‚¨ã‚¯ã‚½ã‚½ãƒ¼ãƒ ",
    description: "SÃ©rum intensivo combinando PDRN (DNA de SalmÃ£o), exossomos e colÃ¡geno para regeneraÃ§Ã£o profunda.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/pXKTr8jf/medicube-serum-pink-pdrn-colag-exosso-shot-7500-30ml-28791.jpg",
    rating: 4.9,
    reviewsCount: 54,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 10
  },
  {
    id: "medicube-exosome-cica-ampoule",
    name: "Medicube Exosome Cica Ampoule (30 ml)",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ã‚¨ã‚¯ã‚½ã‚½ãƒ¼ãƒ  ã‚·ã‚« ã‚¢ãƒ³ãƒ—ãƒ«",
    description: "Ampola calmante e reparadora de barreira com tecnologia de exossomos e Centelha AsiÃ¡tica (Cica).",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/wBrH0TJQ/61coyn-Yo-MHL-AC-UF1000-1000-QL80.jpg",
    rating: 4.8,
    reviewsCount: 73,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 18
  },
  {
    id: "medicube-azelaic-acid-16-bb",
    name: "Medicube Azelaic Acid 16 BB Calming Serum (30 ml)",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ã‚¢ã‚¼ãƒ©ã‚¤ãƒ³é…¸ 16 BB",
    description: "SÃ©rum calmante com 16% de Ãcido Azelaico para controle de oleosidade e reduÃ§Ã£o de imperfeiÃ§Ãµes.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/wBn8D48W/D-Q-NP-948219-MLA108207884961-032026-O.webp",
    rating: 4.7,
    reviewsCount: 39,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 14
  },
  {
    id: "medicube-pdrn-pink-peptide-serum",
    name: "Medicube PDRN Pink Peptide Serum (30 ml)",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– PDRN ãƒ”ãƒ³ã‚¯ ãƒšãƒ—ãƒãƒ‰ ã‚»ãƒ©ãƒ ",
    description: "SÃ©rum anti-idade global com DNA de salmÃ£o (PDRN) e complexo de peptÃ­deos rosados para densidade e viÃ§o.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/hGk6XJTC/219175-800-800.jpg",
    rating: 4.9,
    reviewsCount: 48,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 22
  },
  {
    id: "medicube-collagen-milk-wrapping-mask",
    name: "Medicube Collagen Milk Toning Wrapping Mask (75 ml)",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ã‚³ãƒ©ãƒ¼ã‚²ãƒ³ãƒŸãƒ«ã‚¯ ãƒžã‚¹ã‚¯",
    description: "MÃ¡scara coreana do tipo peel-off. Promove efeito imediato de clareamento de tom, hidrataÃ§Ã£o profunda e firmeza.",
    priceBRL: 125.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/PJpX71xN/shopping.webp",
    rating: 4.9,
    reviewsCount: 77,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 18
  },
  {
    id: "medicube-kojic-turmeric-night-mask",
    name: "Medicube Kojic Acid Turmeric Night Wrapping Mask (75 ml)",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ã‚³ã‚¦ã‚¸é…¸ ãƒŠã‚¤ãƒˆãƒžã‚¹ã‚¯",
    description: "Tratamento noturno intensivo. Combate a opacidade, renova a textura e suaviza manchas persistentes.",
    priceBRL: 125.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/cCWhSdWh/71GJ5l-S77ML.jpg",
    rating: 4.8,
    reviewsCount: 61,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 15
  },
  {
    id: "anua-heartleaf-cleansing-oil",
    name: "Anua Heartleaf Pore Control Cleansing Oil (200 ml)",
    jpName: "ã‚¢ãƒŒã‚¢ ãƒ‰ã‚¯ãƒ€ãƒŸã‚¯ãƒ¬ãƒ³ã‚¸ãƒ³ã‚°ã‚ªã‚¤ãƒ«",
    description: "O famoso Ã³leo de limpeza coreano. Remove maquiagem pesada, dissolve sebo e combate cravos.",
    priceBRL: 205.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/qRwhNrnX/353468.jpg",
    rating: 5.0,
    reviewsCount: 198,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 22
  },
  {
    id: "lululun-hydra-v-vitamin-yellow",
    name: "LuLuLun Hydra-V-Mask Vitamin (Amarelo - 7 un)",
    jpName: "ãƒ«ãƒ«ãƒ«ãƒ³ ãƒã‚¤ãƒ‰ãƒ© V ãƒžã‚¹ã‚¯",
    description: "MÃ¡scara diÃ¡ria viral no JapÃ£o. Coquetel de 7 vitaminas para elasticidade e uniformizaÃ§Ã£o do tom.",
    priceBRL: 60.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/FRTz9ZXQ/D-NQ-NP-832020-MLU77634677709-072024-O.webp",
    rating: 4.9,
    reviewsCount: 165,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 35
  },
  {
    id: "lululun-hydra-ex-exosome-purple",
    name: "LuLuLun Hydra-Ex-Mask Exosome (Roxo - 7 un)",
    jpName: "ãƒ«ãƒ«ãƒ«ãƒ³ ãƒã‚¤ãƒ‰ãƒ© EX ãƒžã‚¹ã‚¯",
    description: "Tratamento diÃ¡rio avanÃ§ado anti-idade. Utiliza exossomos para regeneraÃ§Ã£o celular e rejuvenescimento.",
    priceBRL: 60.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/WzQ23Y98/Hydra-EX-01.jpg",
    rating: 4.9,
    reviewsCount: 143,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 30
  },
  {
    id: "naturie-hatomugi-conditioner-500ml",
    name: "Naturie Hatomugi Skin Conditioner (500ml)",
    jpName: "ãƒŠãƒãƒ¥ãƒªã‚¨ ãƒãƒˆãƒ ã‚®åŒ–ç²§æ°´",
    description: "A loÃ§Ã£o hidratante nÂº 1 do JapÃ£o. Tamanho mega econÃ´mico, acalma, equilibra e hidrata sem pesar.",
    priceBRL: 40.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 50.00,
    image: "https://i.postimg.cc/SjFhq2sg/sg-11134207-7qvdb-lhr9tm8ltk8o14.jpg",
    rating: 5.0,
    reviewsCount: 412,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 50
  },
  {
    id: "im-from-rice-toner",
    name: "I'm From Rice Toner (150 ml)",
    jpName: "ã‚¢ã‚¤ãƒ ãƒ•ãƒ­ãƒ  ãƒ©ã‚¤ã‚¹ãƒˆãƒŠãƒ¼ (ç±³ç³ )",
    description: "Suaviza a pele com extratos de arroz e farelo de arroz.",
    priceBRL: 139.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/pTdNrdXw/rice.png",
    rating: 4.9,
    reviewsCount: 312,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
  },
  {
    id: "medicube-zero-pore-one-day-serum",
    name: "Medicube Zero Pore One Day Serum",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ã‚¼ãƒ­ãƒã‚¢ ã‚»ãƒ©ãƒ ",
    description: "SoluÃ§Ã£o para controle de oleosidade e reduÃ§Ã£o de poros.",
    priceBRL: 180.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/jdhr7jkn/51m-Us3LO2n-L-AC-UF1000-1000-QL80.jpg",
    rating: 4.8,
    reviewsCount: 150,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "medicube-one-day-exosome-shot",
    name: "Medicube One Day Exosome Shot 2000",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ã‚¨ã‚¯ã‚½ã‚½ãƒ¼ãƒ ã‚·ãƒ§ãƒƒãƒˆ",
    description: "SÃ©rum com tecnologia de micro-spicules para renovaÃ§Ã£o celular.",
    priceBRL: 165.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/NfBtNX34/37.jpg",
    rating: 4.9,
    reviewsCount: 120,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "medicube-kojic-acid-turmeric-niacinamide",
    name: "Medicube Kojic Acid Turmeric Niacinamide Serum",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ã‚³ã‚¦ã‚¸é…¸ã‚»ãƒ©ãƒ ",
    description: "Tratamento para clareamento de manchas e marcas de acne.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/RhmkDrDN/19601185.webp",
    rating: 4.8,
    reviewsCount: 88,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 15
  },
  {
    id: "medicube-glutathione-glow-serum",
    name: "Medicube Glutathione Glow Serum (30 g)",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ã‚°ãƒ«ã‚¿ãƒã‚ªãƒ³ã‚»ãƒ©ãƒ ",
    description: "AÃ§Ã£o antioxidante potente e efeito glow.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/B6TyDYQM/17007295.webp",
    rating: 4.9,
    reviewsCount: 145,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 18
  },
  {
    id: "medicube-retinol-nmn-boosting-serum",
    name: "Medicube Retinol NMN Boosting Serum",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ãƒ¬ãƒãƒŽãƒ¼ãƒ«ã‚»ãƒ©ãƒ ",
    description: "SÃ©rum antienvelhecimento com retinol e NMN.",
    priceBRL: 188.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/MHZsBzLx/XXL-p0218988822.jpg",
    rating: 4.9,
    reviewsCount: 92,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 10
  },
  {
    id: "medicube-pdrn-one-day-ampoule",
    name: "Medicube PDRN One Day Ampoule",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– PDRNã‚¢ãƒ³ãƒ—ãƒ«",
    description: "DNA de salmÃ£o purificado para regeneraÃ§Ã£o e colÃ¡geno.",
    priceBRL: 155.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/CLz7prph/17074662.jpg",
    rating: 5.0,
    reviewsCount: 115,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 12
  },
  {
    id: "biore-makeup-remover-oil",
    name: "Biore Makeup Remover Oil",
    jpName: "ãƒ“ã‚ªãƒ¬ ãƒ¡ã‚¤ã‚¯è½ã¨ã— ã‚¯ãƒ¬ãƒ³ã‚¸ãƒ³ã‚°ã‚ªã‚¤ãƒ«",
    description: "Ã“leo remover de maquiagem Biore.",
    priceBRL: 89.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.ibb.co/4R4D5mJm/D-Q-NP-955266-MLA92278985694-092025-F.webp",
    rating: 4.8,
    reviewsCount: 420,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 35
  },
  {
    id: "hada-labo-gokujyun-oil",
    name: "Hada LaboÂ® Gokujyun Oil Cleasing",
    jpName: "è‚Œãƒ©ãƒœ æ¥µæ½¤ ã‚ªã‚¤ãƒ«ã‚¯ãƒ¬ãƒ³ã‚¸ãƒ³ã‚°",
    description: "Ã“leo de limpeza facial demaquilante.",
    priceBRL: 110.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://iili.io/C2KC1bp.md.png",
    rating: 5.0,
    reviewsCount: 195,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 40
  },
  {
    id: "senka-perfect-whip",
    name: "Senka Perfect Whip",
    jpName: "å°‚ç§‘ ãƒ‘ãƒ¼ãƒ•ã‚§ã‚¯ãƒˆãƒ›ã‚¤ãƒƒãƒ—",
    description: "Espuma de limpeza facial mais vendida do JapÃ£o.",
    priceBRL: 54.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.ibb.co/zTdKBgPN/51j8-UE-scr-L-AC-UF1000-1000-QL80-FMwebp.webp",
    rating: 4.9,
    reviewsCount: 245,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 30
  },
  {
    id: "keana-rice-pack",
    name: "Keana Rice Pack",
    jpName: "æ¯›ç©´æ’«å­ ãŠç±³ de ãƒ‘ãƒƒã‚¯",
    description: "MÃ¡scara facial de arroz japonÃªs 100%.",
    priceBRL: 85.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 40.00,
    image: "https://i.ibb.co/RTRdCfFq/new-collection-31-2.png",
    rating: 4.8,
    reviewsCount: 188,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "numbuzin-no9-mask",
    name: "Numbuzin No.9 Mask",
    jpName: "ãƒŠãƒ³ãƒãƒ¼ã‚ºã‚¤ãƒ³ 9ç•ª ã‚·ãƒ¼ãƒˆãƒžã‚¹ã‚¯",
    description: "MÃ¡scara lifting com NMN + 50 PeptÃ­deos.",
    priceBRL: 65.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 30.00,
    image: "https://i.ibb.co/35xTPT5B/61-Yvzp-Im-BGL.jpg",
    rating: 4.7,
    reviewsCount: 95,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 15
  },

  {
    id: "celimax-pore-brightening",
    name: "Celimax Pore Brightening Spot Care Cream",
    jpName: "ã‚»ãƒªãƒžãƒƒã‚¯ã‚¹ ãƒ–ãƒ©ã‚¤ãƒˆãƒ‹ãƒ³ã‚°ã‚¯ãƒªãƒ¼ãƒ ",
    description: "Creme clareador para poros e manchas.",
    priceBRL: 112.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 45.00,
    image: "https://i.ibb.co/S4BY3fL4/L-g0212699726-001.jpg",
    rating: 4.6,
    reviewsCount: 74,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 22
  },
  {
    id: "celimax-retinol-shot",
    name: "Celimax Retinol Shot Tightening Serum",
    jpName: "ã‚»ãƒªãƒžãƒƒã‚¯ã‚¹ ãƒ¬ãƒãƒŽãƒ¼ãƒ«ç¾Žå®¹æ¶²",
    description: "SÃ©rum com Retinol que firma a pele.",
    priceBRL: 138.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 45.00,
    image: "https://i.ibb.co/1Jbvy4fQ/D-Q-NP-711608-MLA104228285762-012026-F.webp",
    rating: 4.8,
    reviewsCount: 112,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 18
  },
  {
    id: "medicube-zero-pore-pad",
    name: "Medicube Zero Pore Pad 2.0",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ã‚¼ãƒ­ãƒã‚¢ãƒ‘ãƒƒãƒ‰ 2.0",
    description: "Discos de algodÃ£o tonificantes com AHA/BHA para limpar poros e reduzir a oleosidade visivelmente.",
    priceBRL: 185.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/YqhP4j2n/pore.avif",
    rating: 4.9,
    reviewsCount: 182,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "medicube-pdrn-pink-mask-sheet",
    name: "Medicube PDRN Pink Collagen Gel Mask",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– PDRN ãƒ”ãƒ³ã‚¯ã‚³ãƒ©ãƒ¼ã‚²ãƒ³ ã‚²ãƒ«ãƒžã‚¹ã‚¯",
    description: "MÃ¡scara facial em gel (sheet mask) para hidrataÃ§Ã£o intensiva, preenchimento e elasticidade.",
    priceBRL: 119.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/52JcGLMC/sg-11134207-7rdyf-lzzc5w8pci8yd5.jpg",
    rating: 4.8,
    reviewsCount: 95,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 15
  },
  {
    id: "medicube-collagen-jelly-cream",
    name: "Medicube Collagen Jelly Cream",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ã‚³ãƒ©ãƒ¼ã‚²ãƒ³ ã‚¼ãƒªãƒ¼ã‚¯ãƒªãƒ¼ãƒ ",
    description: "Creme rosa com textura de gelatina. Preenche e dÃ¡ elasticidade imediata com colÃ¡geno hidrolisado.",
    priceBRL: 183.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/CxCsdVDh/colagem.jpg",
    rating: 4.9,
    reviewsCount: 110,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
  },
  {
    id: "skin1004-centella-travel-kit",
    name: "SKIN1004 Madagascar Centella Travel Kit",
    jpName: "SKIN1004 ãƒžãƒ€ã‚¬ã‚¹ã‚«ãƒ« ã‚»ãƒ³ãƒ†ãƒ© ãƒˆãƒ©ãƒ™ãƒ«ã‚­ãƒƒãƒˆ",
    description: "Kit de viagem (5 itens) com centelha asiÃ¡tica calmante, ideal para peles sensÃ­veis.",
    priceBRL: 188.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/ZY9gnC5c/stevalana.jpg",
    rating: 4.9,
    reviewsCount: 134,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 15
  },
  {
    id: "sana-nameraka-wrinkle-eye-cream",
    name: "SANA Nameraka Honpo Wrinkle Eye Cream",
    jpName: "ãªã‚ã‚‰ã‹æœ¬èˆ— ãƒªãƒ³ã‚¯ãƒ«ã‚¢ã‚¤ã‚¯ãƒªãƒ¼ãƒ ",
    description: "Creme de olhos japonÃªs rico em isoflavonas de soja e retinol puro. Hidrata e combate linhas finas.",
    priceBRL: 79.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/G26XGxmS/sana.webp",
    rating: 4.8,
    reviewsCount: 215,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 30
  },
  {
    id: "skin1004-centella-ampoule",
    name: "SKIN1004 Madagascar Centella Ampoule",
    jpName: "SKIN1004 ãƒžãƒ€ã‚¬ã‚¹ã‚«ãƒ« ã‚»ãƒ³ãƒ†ãƒ© ã‚¢ãƒ³ãƒ—ãƒ«",
    description: "Ampola calmante coreana com 100% de extrato de Centelha AsiÃ¡tica de Madagascar.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/Qdj0Qtjj/centella.jpg",
    rating: 4.9,
    reviewsCount: 290,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "medicube-triple-collagen-toner",
    name: "Medicube Triple Collagen Toner",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ãƒˆãƒªãƒ—ãƒ«ã‚³ãƒ©ãƒ¼ã‚²ãƒ³ ãƒˆãƒŠãƒ¼",
    description: "TÃ´nico facial de alta absorÃ§Ã£o com complexo de triplo colÃ¡geno para pele ressecada.",
    priceBRL: 99.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/vTWt9RjB/toner.jpg",
    rating: 4.8,
    reviewsCount: 78,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
  },
  {
    id: "medicube-pdrn-capsule-cream",
    name: "Medicube PDRN Pink Collagen Capsule Cream",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– PDRN ãƒ”ãƒ³ã‚¯ã‚³ãƒ©ãƒ¼ã‚²ãƒ³ ã‚«ãƒ—ã‚»ãƒ«ã‚¯ãƒªãƒ¼ãƒ ",
    description: "Creme com cÃ¡psulas de PDRN (DNA de salmÃ£o) e colÃ¡geno para firmeza noturna.",
    priceBRL: 173.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/RhQwh76H/cream.webp",
    rating: 4.9,
    reviewsCount: 65,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 18
  },
  {
    id: "kiss-me-heroine-mascara-remover",
    name: "Kiss Me Heroine Make Speedy Mascara Remover",
    jpName: "ãƒ’ãƒ­ã‚¤ãƒ³ãƒ¡ã‚¤ã‚¯ ã‚¹ãƒ”ãƒ¼ãƒ‡ã‚£ãƒ¼ãƒžã‚¹ã‚«ãƒ©ãƒªãƒ ãƒ¼ãƒãƒ¼",
    description: "Removedor instantÃ¢neo para mÃ¡scaras de cÃ­lios Ã  prova d'Ã¡gua super resistentes.",
    priceBRL: 129.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 30.00,
    image: "https://i.postimg.cc/qR23DsGL/heroine.jpg",
    rating: 5.0,
    reviewsCount: 430,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 40
  },
  {
    id: "biore-aqua-rich-stray-kids",
    name: "BiorÃ© UV Aqua Rich (EdiÃ§Ã£o Stray Kids)",
    jpName: "ãƒ“ã‚ªãƒ¬UV ã‚¢ã‚¯ã‚¢ãƒªãƒƒãƒ ã‚¦ã‚©ãƒ¼ã‚¿ãƒªãƒ¼ã‚¨ãƒƒã‚»ãƒ³ã‚¹ Stray Kidsé™å®š",
    description: "Protetor solar aquoso FPS50+ (EdiÃ§Ã£o Limitada Stray Kids).",
    priceBRL: 80.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/c4xnT8th/stray.jpg",
    rating: 4.9,
    reviewsCount: 156,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "anua-heartleaf-77-toner-500",
    name: "Anua Heartleaf 77 Soothing Toner (500ml)",
    jpName: "ã‚¢ãƒŒã‚¢ ãƒ‰ã‚¯ãƒ€ãƒŸ 77% ã‚¹ãƒ¼ã‚¸ãƒ³ã‚°ãƒˆãƒŠãƒ¼ 500ml",
    description: "TÃ´nico calmante coreano nÂº 1 com 77% de extrato de Houttuynia Cordata (Tamanho Gigante).",
    priceBRL: 230.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 45.00,
    image: "https://i.postimg.cc/jj7wCHB5/anua.avif",
    rating: 5.0,
    reviewsCount: 512,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
  },
  {
    id: "anua-quercetinol-pore-cleansing-foam",
    name: "Anua Heartleaf Quercetinol Pore Deep Cleansing Foam",
    jpName: "ã‚¢ãƒŒã‚¢ ãƒ‰ã‚¯ãƒ€ãƒŸ ãƒã‚¢ã‚¯ãƒ¬ãƒ³ã‚¸ãƒ³ã‚°ãƒ•ã‚©ãƒ¼ãƒ ",
    description: "Espuma de limpeza profunda que esfolia suavemente e limpa cravos.",
    priceBRL: 140.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/KcNKKvpJ/anuas.jpg",
    rating: 4.8,
    reviewsCount: 198,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 30
  },
  {
    id: "boj-revive-eye-serum-ginseng",
    name: "Beauty of Joseon Revive Eye Serum Ginseng + Retinal",
    jpName: "æœé®®ç¾Žå¥³ ã‚¸ãƒ³ã‚»ãƒ³ï¼‹ãƒ¬ãƒãƒŠãƒ¼ãƒ« ã‚¢ã‚¤ã‚¯ãƒªãƒ¼ãƒ ",
    description: "SÃ©rum de olhos coreano super potente com Extrato de Ginseng e Retinal (Retinol avanÃ§ado).",
    priceBRL: 118.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/KcNKKvpJ/anuas.jpg",
    rating: 4.9,
    reviewsCount: 285,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
  },
  {
    id: "numbuzin-no9-cream",
    name: "Numbuzin No.9 Cream",
    jpName: "ãƒŠãƒ³ãƒãƒ¼ã‚ºã‚¤ãƒ³ 9ç•ª ãƒœãƒˆãƒƒã‚¯ã‚¹ã‚¯ãƒªãƒ¼ãƒ ",
    description: "Creme 'efeito botox' anti-rugas intensivo em formato de seringa para aplicaÃ§Ã£o precisa.",
    priceBRL: 130.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/xdnDbY4J/numb.jpg",
    rating: 4.8,
    reviewsCount: 140,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "numbuzin-no9-toner",
    name: "Numbuzin No.9 Toner",
    jpName: "ãƒŠãƒ³ãƒãƒ¼ã‚ºã‚¤ãƒ³ 9ç•ª ãƒˆãƒŠãƒ¼",
    description: "TÃ´nico firmador e preenchedor de alta densidade da linha anti-idade No.9.",
    priceBRL: 120.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/zB29MhXP/toners.webp",
    rating: 4.9,
    reviewsCount: 112,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 18
  },
  {
    id: "senka-perfect-whip-premium",
    name: "Senka Perfect Whip PREMIUM",
    jpName: "å°‚ç§‘ ãƒ‘ãƒ¼ãƒ•ã‚§ã‚¯ãƒˆãƒ›ã‚¤ãƒƒãƒ— ãƒ—ãƒ¬ãƒŸã‚¢ãƒ ",
    description: "VersÃ£o premium (Prata) da famosa espuma de limpeza japonesa. Microespuma ainda mais rica e hidratante.",
    priceBRL: 69.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/CxFpRStJ/images.jpg",
    rating: 4.9,
    reviewsCount: 310,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 40
  },
  {
    id: "biore-aqua-rich-normal",
    name: "BiorÃ© UV Aqua Rich (VersÃ£o Normal)",
    jpName: "ãƒ“ã‚ªãƒ¬UV ã‚¢ã‚¯ã‚¢ãƒªãƒƒãƒ ã‚¦ã‚©ãƒ¼ã‚¿ãƒªãƒ¼ã‚¨ãƒƒã‚»ãƒ³ã‚¹",
    description: "O protetor solar mais vendido do mundo. Textura de Ã¡gua, nÃ£o deixa a pele branca e absorve rÃ¡pido.",
    priceBRL: 69.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/vBxpJBgQ/17.avif",
    rating: 5.0,
    reviewsCount: 654,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 50
  },
  {
    id: "anua-10-niacinamide-txa4",
    name: "Anua 10+ Niacinamide TXA 4 Dark Spot Correcting Serum",
    jpName: "ã‚¢ãƒŒã‚¢ ãƒŠã‚¤ã‚¢ã‚·ãƒ³ã‚¢ãƒŸãƒ‰ 10+ TXA 4 ã‚»ãƒ©ãƒ ",
    description: "SÃ©rum clareador intensivo com Niacinamida e Ãcido TranexÃ¢mico para combater manchas e marcas de acne.",
    priceBRL: 159.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/zGD4Jpb0/57.avif",
    rating: 4.9,
    reviewsCount: 185,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 22
  },
  {
    id: "anua-retinol-caffeine-eye-cream",
    name: "Anua Retinol 0.1+ Caffeine Revitalizing Eye Cream",
    jpName: "ã‚¢ãƒŒã‚¢ ãƒ¬ãƒãƒŽãƒ¼ãƒ« 0.1+ ã‚«ãƒ•ã‚§ã‚¤ãƒ³ ã‚¢ã‚¤ã‚¯ãƒªãƒ¼ãƒ ",
    description: "Creme para Ã¡rea dos olhos com Retinol e CafeÃ­na. Combate olheiras, inchaÃ§o e linhas de expressÃ£o.",
    priceBRL: 159.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/0jqHhC1x/XXL-p0222281176.webp",
    rating: 4.8,
    reviewsCount: 164,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "1988-eye-cream-retinol",
    name: "1988 Eye Cream Retinol",
    jpName: "1988 ãƒ¬ãƒãƒŽãƒ¼ãƒ« ã‚¢ã‚¤ã‚¯ãƒªãƒ¼ãƒ ",
    description: "Creme de olhos coreano com Retinol puro, conhecido por suavizar a 'The Line' sob os olhos.",
    priceBRL: 167.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/HkLPGxRt/61wkxi21ot-L-AC-SY300-SX300-QL70-ML2.jpg",
    rating: 4.7,
    reviewsCount: 88,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 15
  },
  {
    id: "aqualabel-special-gel-cream-red",
    name: "Aqualabel Special Gel Cream Moist Smooth",
    jpName: "ã‚¢ã‚¯ã‚¢ãƒ¬ãƒ¼ãƒ™ãƒ« ã‚¹ãƒšã‚·ãƒ£ãƒ«ã‚¸ã‚§ãƒ«ã‚¯ãƒªãƒ¼ãƒ  ãƒ¢ã‚¤ã‚¹ãƒˆ",
    description: "Gel creme 5-em-1 da Shiseido. HidrataÃ§Ã£o profunda com aminoÃ¡cidos que penetram nos poros.",
    priceBRL: 120.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/BbsMmQ2K/aqua.jpg",
    rating: 4.9,
    reviewsCount: 175,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 25
  },
  {
    id: "kobayashi-keshimin-cream-ex",
    name: "Kobayashi Keshimin Cream EX",
    jpName: "å°æž—è£½è–¬ ã‚±ã‚·ãƒŸãƒ³ã‚¯ãƒªãƒ¼ãƒ EX",
    description: "Pomada clareadora de manchas hiper concentrada com Vitamina C. Inibe a produÃ§Ã£o de melanina.",
    priceBRL: 90.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/bNm3RPr1/71CR-Fi-Pot-L.jpg",
    rating: 4.8,
    reviewsCount: 142,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 20
  },
  {
    id: "kracie-hadabisei-wrinkle-serum",
    name: "Kracie Hadabisei Wrinkle Care Facial Serum",
    jpName: "ã‚¯ãƒ©ã‚·ã‚¨ è‚Œç¾Žç²¾ ãƒªãƒ³ã‚¯ãƒ«ã‚±ã‚¢ æ¿ƒå¯†æ½¤ã„ç¾Žå®¹æ¶²",
    description: "SÃ©rum facial focado no cuidado extremo de rugas com derivado de Retinol e geleia real.",
    priceBRL: 160.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/sXCkRzpy/cb8qfmt2zfefwxw2skxa8j0g792pngzj.webp",
    rating: 4.8,
    reviewsCount: 96,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 15
  },
  {
    id: "rejuran-turnover-cream",
    name: "Rejuran Turnover Cream",
    jpName: "ãƒªã‚¸ãƒ¥ãƒ©ãƒ³ ã‚¿ãƒ¼ãƒ³ã‚ªãƒ¼ãƒãƒ¼ ã‚¯ãƒªãƒ¼ãƒ ",
    description: "Derivado de DNA de salmÃ£o (PDRN). VersÃ£o cosmÃ©tica da famosa injeÃ§Ã£o de regeneraÃ§Ã£o celular da Coreia.",
    priceBRL: 184.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/nVk6N6Mh/D-NQ-NP-666523-CBT92059846137-092025-O.webp",
    rating: 4.9,
    reviewsCount: 110,
    department: "Beleza, Higiene e SaÃºde",
    category: "Skincare e Tratamentos Faciais",
    stock: 18
  },

  // --- MAQUIAGEM ---
  {
    id: "aztk-mousse-cream-cheek",
    name: "AZTK Mousse Cream Cheek (jc06)",
    jpName: "AZTK ãƒ ãƒ¼ã‚¹ã‚¯ãƒªãƒ¼ãƒ ãƒãƒ¼ã‚¯",
    description: "Um blush em mousse de alta pigmentaÃ§Ã£o vindo da nova tendÃªncia de maquiagem asiÃ¡tica. Possui textura leve que se espalha como nuvem.",
    priceBRL: 87.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/6QD4kzKz/61WMSNC5Xb-L.jpg",
    rating: 4.7,
    reviewsCount: 45,
    department: "Beleza, Higiene e SaÃºde",
    category: "Maquiagem",
    stock: 25
  },
  {
    id: "elroel-blanc-cover-cream-stick",
    name: "Elroel Blanc Cover Cream Stick",
    jpName: "ã‚¨ãƒ«ãƒ­ã‚¨ãƒ« ãƒ–ãƒ©ãƒ³ã‚«ãƒãƒ¼ã‚¯ãƒªãƒ¼ãƒ ã‚¹ãƒ†ã‚£ãƒƒã‚¯",
    description: "Base inovadora em bastÃ£o que muda de cor para se adaptar ao seu tom. Acompanha um pincel embutido de cerdas ultra macias.",
    priceBRL: 349.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/QN6hVC9N/71q0ept-Iq-JL.jpg",
    rating: 4.9,
    reviewsCount: 67,
    department: "Beleza, Higiene e SaÃºde",
    category: "Maquiagem",
    stock: 15
  },
  {
    id: "clio-kill-lash-mascara-sleek",
    name: "Clio Kill Lash Superproof Mascara (Sleek Volume)",
    jpName: "ã‚¯ãƒªã‚ª ã‚­ãƒ«ãƒ©ãƒƒã‚·ãƒ¥ ãƒžã‚¹ã‚«ãƒ© (ã‚¹ãƒªãƒ¼ã‚¯)",
    description: "Uma das mÃ¡scaras de cÃ­lios mais vendidas da Coreia. Ã€ prova d'Ã¡gua, encorpa e destaca sem empelotar.",
    priceBRL: 130.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/8PJQ5Hgc/XXL-p0223316886.jpg",
    rating: 5.0,
    reviewsCount: 112,
    department: "Beleza, Higiene e SaÃºde",
    category: "Maquiagem",
    stock: 30
  },
  {
    id: "laneige-neo-finishing-powder",
    name: "Laneige Neo Essential Finishing Powder",
    jpName: "ãƒ©ãƒãƒ¼ã‚¸ãƒ¥ ãƒã‚ªãƒ•ã‚£ãƒ‹ãƒƒã‚·ãƒ³ã‚°ãƒ‘ã‚¦ãƒ€ãƒ¼",
    description: "PÃ³ facial finalizador compacto de textura ultra fina. Controla o brilho e sela a maquiagem com efeito blur Ã³ptico.",
    priceBRL: 175.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/TYWFG3nJ/616s-VXYBJ1L-AC-UF1000-1000-QL80.jpg",
    rating: 4.8,
    reviewsCount: 54,
    department: "Beleza, Higiene e SaÃºde",
    category: "Maquiagem",
    stock: 20
  },
  {
    id: "sheglam-liquid-highlighter-silver",
    name: "Sheglam Liquid Highlighter / Color Bloom (Prata)",
    jpName: "ã‚·ãƒ¼ã‚°ãƒ©ãƒ  ãƒªã‚­ãƒƒãƒ‰ãƒã‚¤ãƒ©ã‚¤ã‚¿ãƒ¼",
    description: "O iluminador/blush lÃ­quido queridinho das redes sociais. Textura leve, acabamento radiante e alta fixaÃ§Ã£o.",
    priceBRL: 60.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/qRNV3X6b/171694935886e475e54439c155a0a934e94433ea3c.jpg",
    rating: 4.9,
    reviewsCount: 230,
    department: "Beleza, Higiene e SaÃºde",
    category: "Maquiagem",
    stock: 40
  },
  {
    id: "decorte-loose-powder-20g",
    name: "DecortÃ© Loose Powder (20g)",
    jpName: "ã‚³ã‚¹ãƒ¡ãƒ‡ã‚³ãƒ«ãƒ† ãƒ•ã‚§ã‚¤ã‚¹ãƒ‘ã‚¦ãƒ€ãƒ¼",
    description: "PÃ³ facial solto de luxo japonÃªs. Sela a maquiagem com texturas de seda ultra finas, disfarÃ§a poros e hidrata.",
    priceBRL: 214.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/SNp3SpVx/06-1.jpg",
    rating: 5.0,
    reviewsCount: 89,
    department: "Beleza, Higiene e SaÃºde",
    category: "Maquiagem",
    stock: 12
  },
  {
    id: "sheglam-brow-brush",
    name: "Sheglam Brow Brush & Dip",
    jpName: "ã‚·ãƒ¼ã‚°ãƒ©ãƒ  ãƒ–ãƒ­ã‚¦ãƒ–ãƒ©ã‚·ï¼†ãƒ‡ã‚£ãƒƒãƒ—",
    description: "LÃ¡pis + escova para sobrancelhas.",
    priceBRL: 75.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 30.00,
    image: "https://i.postimg.cc/HW5c3WtJ/Captura-de-tela-2026-05-28-023259.png",
    rating: 4.5,
    reviewsCount: 118,
    department: "Beleza, Higiene e SaÃºde",
    category: "Maquiagem",
    stock: 30
  },
  {
    id: "anessa-blush-on-powder",
    name: "Anessa Perfect UV Blush-On Powder SPF50+",
    jpName: "ã‚¢ãƒãƒƒã‚µ ãƒ‘ãƒ¼ãƒ•ã‚§ã‚¯ãƒˆUV ã•ã‚‰ã•ã‚‰ãƒ‘ã‚¦ãƒ€ãƒ¼",
    description: "Protetor solar em pÃ³ facial com pincel integrado, FPS 50+ PA++++. Toque seco e sedoso.",
    priceBRL: 220.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/2S2F4NkJ/images-(1).jpg",
    rating: 4.9,
    reviewsCount: 145,
    department: "Beleza, Higiene e SaÃºde",
    category: "Maquiagem",
    stock: 25
  },
  {
    id: "club-suppin-powder-pink",
    name: "Club Suppin Powder (Rosa)",
    jpName: "ã‚¯ãƒ©ãƒ– ã™ã£ã´ã‚“ãƒ‘ã‚¦ãƒ€ãƒ¼ ãƒ‘ã‚¹ãƒ†ãƒ«ãƒ­ãƒ¼ã‚ºã®é¦™ã‚Š",
    description: "PÃ³ translÃºcido para usar de dia ou de noite. NÃ£o precisa de demaquilante. Aroma de rosas.",
    priceBRL: 139.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/g2k3ctVR/images-(2).jpg",
    rating: 4.8,
    reviewsCount: 220,
    department: "Beleza, Higiene e SaÃºde",
    category: "Maquiagem",
    stock: 35
  },
  {
    id: "club-suppin-powder-green",
    name: "Club Suppin Powder (Verde)",
    jpName: "ã‚¯ãƒ©ãƒ– ã™ã£ã´ã‚“ãƒ‘ã‚¦ãƒ€ãƒ¼ ãƒ›ãƒ¯ã‚¤ãƒˆãƒ•ãƒ­ãƒ¼ãƒ©ãƒ«ãƒ–ãƒ¼ã‚±ã®é¦™ã‚Š",
    description: "PÃ³ translÃºcido que minimiza poros sem precisar de demaquilante. Aroma de buquÃª floral branco.",
    priceBRL: 139.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/vHX6K7JV/71Z7Vb-FKt-OL-AC-SL1500.jpg",
    rating: 4.8,
    reviewsCount: 180,
    department: "Beleza, Higiene e SaÃºde",
    category: "Maquiagem",
    stock: 30
  },
  {
    id: "florasis-lipstick-ruby-jam",
    name: "Florasis Lipstick (Moist L103 Ruby Jam)",
    jpName: "èŠ±è¥¿å­ Florasis å½«åˆ»ãƒªãƒƒãƒ—ã‚¹ãƒ†ã‚£ãƒƒã‚¯",
    description: "Batom chinÃªs de altÃ­ssimo luxo com esculturas tridimensionais detalhadas na prÃ³pria bala do batom.",
    priceBRL: 223.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/85h7mLd7/images.jpg",
    rating: 5.0,
    reviewsCount: 98,
    department: "Beleza, Higiene e SaÃºde",
    category: "Maquiagem",
    stock: 12
  },
  {
    id: "the-saem-cover-perfection",
    name: "The Saem Cover Perfection Concealer",
    jpName: "ã‚¶ã‚»ãƒ  ã‚«ãƒãƒ¼ãƒ‘ãƒ¼ãƒ•ã‚§ã‚¯ã‚·ãƒ§ãƒ³ ãƒãƒƒãƒ—ã‚³ãƒ³ã‚·ãƒ¼ãƒ©ãƒ¼",
    description: "O corretivo coreano que viralizou. Alta cobertura com longa duraÃ§Ã£o e acabamento perfeito.",
    priceBRL: 120.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 30.00,
    image: "https://i.postimg.cc/MT21b6BG/D-NQ-NP-749188-MLB77144179299-062024-O.webp",
    rating: 4.9,
    reviewsCount: 540,
    department: "Beleza, Higiene e SaÃºde",
    category: "Maquiagem",
    stock: 50
  },
  {
    id: "club-suppin-powder-uv-gold",
    name: "Club Suppin Powder UV (Dourada)",
    jpName: "ã‚¯ãƒ©ãƒ– ã™ã£ã´ã‚“ãƒ‘ã‚¦ãƒ€ãƒ¼ UV",
    description: "PÃ³ facial 24 horas (dia e noite) com proteÃ§Ã£o UV. NÃ£o precisa de demaquilante. Embalagem dourada.",
    priceBRL: 146.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/VNvTtR8b/54ffb338-2a50-4e32-af8d-55fd9d35cfbf.webp",
    rating: 4.8,
    reviewsCount: 165,
    department: "Beleza, Higiene e SaÃºde",
    category: "Maquiagem",
    stock: 25
  },

  // --- CUIDADOS CAPILARES ---
  {
    id: "ululis-water-conch-black-serum",
    name: "Ululis Premium Water Conch Black Serum Hair Oil",
    jpName: "ã‚¦ãƒ«ãƒªã‚¹ ãƒ—ãƒ¬ãƒŸã‚¢ãƒ ãƒ˜ã‚¢ã‚ªã‚¤ãƒ«",
    description: "Ã“leo capilar japonÃªs de altÃ­ssimo padrÃ£o. HidrataÃ§Ã£o profunda Ã  base de Ã¡gua, repara danos e elimina frizz.",
    priceBRL: 110.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/cHvCL3x0/images-(1).jpg",
    rating: 4.9,
    reviewsCount: 88,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 20
  },
  {
    id: "utena-matomage-stick-regular-pink",
    name: "Utena Matomage Hair Styling Stick (Regular - Rosa)",
    jpName: "ã‚¦ãƒ†ãƒŠ ãƒžãƒˆãƒ¡ãƒ¼ã‚¸ãƒ¥ ã¾ã¨ã‚é«ªã‚¹ãƒ†ã‚£ãƒƒã‚¯",
    description: "O segredo japonÃªs para penteados alinhados. Cera em bastÃ£o para assentar baby hairs e frizz.",
    priceBRL: 56.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 25.00,
    image: "https://i.postimg.cc/90GWDtvy/a34a1057-169d-4422-809e-0f3af474797e-psdues0kyd.jpg",
    rating: 4.8,
    reviewsCount: 121,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 40
  },
  {
    id: "refa-heart-comb-silver-gold",
    name: "ReFa Heart Comb (Silver/Gold)",
    jpName: "ãƒªãƒ•ã‚¡ãƒãƒ¼ãƒˆã‚³ãƒ¼ãƒ  ã‚·ãƒ«ãƒãƒ¼/ã‚´ãƒ¼ãƒ«ãƒ‰",
    description: "Pente massageador capilar ReFa.",
    priceBRL: 182.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.ibb.co/KxZ54zJw/61-FK4n-NNLj-L-AC-SL1500.jpg",
    rating: 5.0,
    reviewsCount: 320,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 40
  },
  {
    id: "refa-heart-comb-red",
    name: "ReFa Heart Comb (Red)",
    jpName: "ãƒªãƒ•ã‚¡ãƒãƒ¼ãƒˆã‚³ãƒ¼ãƒ  ãƒ¬ãƒƒãƒ‰",
    description: "Pente massageador capilar ReFa vermelho.",
    priceBRL: 149.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.ibb.co/CK50750k/pct-refa-heart-comb-aira-shinered-01.jpg",
    rating: 4.9,
    reviewsCount: 215,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 25
  },
  {
    id: "tsubaki-repair-mask",
    name: "Tsubaki - Premium Ex Repair Mask 180ml",
    jpName: "TSUBAKI ãƒ—ãƒ¬ãƒŸã‚¢ãƒ EX ãƒªãƒšã‚¢ãƒžã‚¹ã‚¯",
    description: "MÃ¡scara de reparaÃ§Ã£o intensiva capilar.",
    priceBRL: 60.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/9MkMbKDt/tsuba.png",
    rating: 4.9,
    reviewsCount: 167,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 30
  },
  {
    id: "tsubaki-moist-repair-red",
    name: "Tsubaki Moist & Repair (Red)",
    jpName: "TSUBAKI ãƒ¢ã‚¤ã‚¹ãƒˆï¼†ãƒªãƒšã‚¢ ã‚­ãƒƒãƒˆ",
    description: "Kit Shampoo + Condicionador Moist & Repair.",
    priceBRL: 89.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.postimg.cc/ZRs9g0Mg/tsubas.png",
    rating: 4.9,
    reviewsCount: 280,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 15
  },
  {
    id: "tsubaki-volume-repair-yellow",
    name: "Tsubaki Premium Volume & Repair (Yellow)",
    jpName: "TSUBAKI ãƒœãƒªãƒ¥ãƒ¼ãƒ ï¼†ãƒªãƒšã‚¢ ã‚­ãƒƒãƒˆ",
    description: "Kit Shampoo + Condicionador Volume & Repair.",
    priceBRL: 89.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.ibb.co/q3tT4fHg/41x-M-SSU8x-L-AC-UF1000-1000-QL80-FMwebp.webp",
    rating: 4.8,
    reviewsCount: 340,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 25
  },
  {
    id: "tsubaki-damage-care-black",
    name: "Tsubaki Premium EX Damage Care (Black)",
    jpName: "TSUBAKI ãƒ—ãƒ¬ãƒŸã‚¢ãƒ EX ãƒ€ãƒ¡ãƒ¼ã‚¸ã‚±ã‚¢",
    description: "Kit Shampoo + Condicionador EX Damage Care.",
    priceBRL: 96.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.ibb.co/gZnNpzT7/51v-XAUJ7-We-L-AC-UF1000-1000-QL80-FMwebp.webp",
    rating: 4.9,
    reviewsCount: 412,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 20
  },
  {
    id: "fino-premium-touch-mask",
    name: "Fino Premium Touch Hair Mask",
    jpName: "ãƒ•ã‚£ãƒ¼ãƒŽ ãƒ—ãƒ¬ãƒŸã‚¢ãƒ ã‚¿ãƒƒãƒ æµ¸é€ç¾Žå®¹æ¶²ãƒ˜ã‚¢ãƒžã‚¹ã‚¯",
    description: "MÃ¡scara capilar de hidrataÃ§Ã£o profunda nÂº 1 no JapÃ£o. Repara cabelos secos e danificados com gelÃ©ia real e PCA.",
    priceBRL: 60.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/vThLXJ7G/D-NQ-NP-2X-791727-MLA111036030964-052026-F.webp",
    rating: 5.0,
    reviewsCount: 650,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 50
  },
  {
    id: "tsubaki-kit-verde",
    name: "Tsubaki Premium Kit (Verde)",
    jpName: "TSUBAKI ãƒ—ãƒ¬ãƒŸã‚¢ãƒ  ã‚»ãƒƒãƒˆ",
    description: "Kit completo de shampoo e condicionador Tsubaki focado em reparaÃ§Ã£o e maciez.",
    priceBRL: 103.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.postimg.cc/90HC1SXH/354602.webp",
    rating: 4.8,
    reviewsCount: 154,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 25
  },
  {
    id: "tsubaki-repair-mask-s-rosa",
    name: "Tsubaki Premium Repair Mask S (Rosa - LanÃ§amento)",
    jpName: "TSUBAKI ãƒ—ãƒ¬ãƒŸã‚¢ãƒ ãƒªãƒšã‚¢ãƒžã‚¹ã‚¯ S",
    description: "EdiÃ§Ã£o limitada de primavera (Sakura/Rosa). ReparaÃ§Ã£o premium instantÃ¢nea sem tempo de espera.",
    priceBRL: 60.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/mggRd74T/images.jpg",
    rating: 4.9,
    reviewsCount: 198,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 35
  },
  {
    id: "honey-melty-shampoo-rosa",
    name: "&Honey Melty Shampoo (Rosa - Avulso)",
    jpName: "&honey ãƒ¡ãƒ«ãƒ†ã‚£ ãƒ¢ã‚¤ã‚¹ãƒˆãƒªãƒšã‚¢ ã‚·ãƒ£ãƒ³ãƒ—ãƒ¼ 1.0",
    description: "Limpeza hidratante para cabelos ressecados e com frizz. Composto por mel premium e Ã³leo de argan.",
    priceBRL: 110.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 45.00,
    image: "https://i.postimg.cc/fLmh3KcB/8.avif",
    rating: 4.9,
    reviewsCount: 220,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 30
  },
  {
    id: "honey-melty-kit-rosa",
    name: "Kit &Honey Melty Shampoo + Condicionador (Rosa)",
    jpName: "&honey ãƒ¡ãƒ«ãƒ†ã‚£ ãƒ¢ã‚¤ã‚¹ãƒˆãƒªãƒšã‚¢ é™å®šã‚­ãƒƒãƒˆ",
    description: "Kit completo de tratamento capilar com mel. Controle de frizz e umidade intensivos.",
    priceBRL: 190.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.postimg.cc/fLmh3KcB/8.avif",
    rating: 5.0,
    reviewsCount: 312,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 25
  },
  {
    id: "refa-honey-queen-kit",
    name: "Kit Refa &Honey Queen (Dourado - 3 itens)",
    jpName: "ReFa Ã— &honey é™å®šã‚³ãƒ©ãƒœã‚­ãƒƒãƒˆ",
    description: "Kit luxuoso e exclusivo de escova ReFa Heart Brush e linha capilar de mel &Honey.",
    priceBRL: 520.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.postimg.cc/GtKVYSHz/D-NQ-NP-2X-993675-MLB110890492963-042026-F.webp",
    rating: 5.0,
    reviewsCount: 88,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 10
  },
  {
    id: "honey-moist-pixie-oil",
    name: "Ã“leo de Cabelo &Honey Moist Pixie (Amarelo)",
    jpName: "&honey ãƒ¢ã‚¤ã‚¹ãƒˆ ãƒ”ã‚¯ã‚·ãƒ¼ ãƒ˜ã‚¢ã‚ªã‚¤ãƒ«",
    description: "Ã“leo capilar premium de mel. Focado em nutriÃ§Ã£o intensa e brilho sem pesar nos fios.",
    priceBRL: 130.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/Hx4hDP0z/D-NQ-NP-2X-718348-MLA110637011648-052026-F.webp",
    rating: 4.8,
    reviewsCount: 165,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 22
  },
  {
    id: "fino-hair-oil",
    name: "Fino Hair Oil - NutriÃ§Ã£o",
    jpName: "ãƒ•ã‚£ãƒ¼ãƒŽ ãƒ—ãƒ¬ãƒŸã‚¢ãƒ ã‚¿ãƒƒãƒ æµ¸é€ç¾Žå®¹æ¶²ãƒ˜ã‚¢ã‚ªã‚¤ãƒ«",
    description: "Ã“leo capilar ultraleve que repara danos profundos, previne pontas duplas e dÃ¡ brilho intenso.",
    priceBRL: 105.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/CKbvk62F/finetoday-fino-premium-touch-hair-oil-oleo-capilar-3.webp",
    rating: 4.9,
    reviewsCount: 290,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 35
  },
  {
    id: "fino-premium-touch-kit",
    name: "Kit Shampoo + Condicionador Fino Premium Touch",
    jpName: "ãƒ•ã‚£ãƒ¼ãƒŽ ãƒ—ãƒ¬ãƒŸã‚¢ãƒ ã‚¿ãƒƒãƒ ã‚·ãƒ£ãƒ³ãƒ—ãƒ¼ï¼†ãƒˆãƒªãƒ¼ãƒˆãƒ¡ãƒ³ãƒˆ",
    description: "Kit de limpeza e tratamento diÃ¡rio com a mesma tecnologia de reparaÃ§Ã£o da famosa mÃ¡scara Fino.",
    priceBRL: 179.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.postimg.cc/nV334m3v/D-NQ-NP-2X-758794-MLB81608717300-012025-F.webp",
    rating: 4.9,
    reviewsCount: 175,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 20
  },
  {
    id: "tsubaki-cool-repair-kit",
    name: "Kit Tsubaki Premium Cool & Repair (Azul)",
    jpName: "TSUBAKI ãƒ—ãƒ¬ãƒŸã‚¢ãƒ ã‚¯ãƒ¼ãƒ«ï¼†ãƒªãƒšã‚¢ ãƒãƒ³ãƒ—ãƒšã‚¢ã‚»ãƒƒãƒˆ",
    description: "EdiÃ§Ã£o limitada refrescante (Cool) ideal para o verÃ£o. Limpa o couro cabeludo e repara danos.",
    priceBRL: 89.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 65.00,
    image: "https://i.postimg.cc/XYCx6z41/D-NQ-NP-2X-938804-CBT110708060883-042026-F-conjunto-de-shampoo-e-condicionador-shiseido-tsubaki-prem.webp",
    rating: 4.8,
    reviewsCount: 145,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 18
  },
  {
    id: "tsubaki-oil-force-m",
    name: "Ã“leo Capilar Tsubaki Oil Force M (Vermelho)",
    jpName: "TSUBAKI ã‚ªã‚¤ãƒ«ãƒ•ã‚©ãƒ¼ã‚¹ M",
    description: "Ã“leo capilar reparador de alta penetraÃ§Ã£o da famosa linha Tsubaki. Protege do calor e dÃ¡ maciez.",
    priceBRL: 118.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/Kcp5k2Y5/oleo-capilar-tsubaki-premium-camellia-1.webp",
    rating: 4.9,
    reviewsCount: 112,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 25
  },
  {
    id: "elizavecca-cer100-treatment",
    name: "Elizavecca CER-100 Collagen Ceramide Treatment",
    jpName: "ã‚¨ãƒªã‚¶ãƒ´ã‚§ãƒƒã‚« CER-100 ã‚³ãƒ©ãƒ¼ã‚²ãƒ³ ã‚»ãƒ©ãƒŸãƒ‰",
    description: "O famoso 'desmaia cabelos' da caixinha ruiva. Tratamento de salÃ£o com colÃ¡geno e ceramidas para fios danificados.",
    priceBRL: 89.90,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/3WM4X9Vd/17.avif",
    rating: 4.9,
    reviewsCount: 890,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 45
  },
  {
    id: "lilyeve-grow-turn-ampoule",
    name: "Lilyeve Grow:Turn Ampoule",
    jpName: "Lilyeve ã‚°ãƒ­ã‚¦ã‚¿ãƒ¼ãƒ³ ã‚¢ãƒ³ãƒ—ãƒ«",
    description: "Ampola coreana para o couro cabeludo. Ajuda no crescimento, forÃ§a capilar e combate Ã  queda.",
    priceBRL: 160.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/s2Z2c5Pc/lil.webp",
    rating: 4.8,
    reviewsCount: 95,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 15
  },
  {
    id: "vt-pdrn-reedle-brush-serum",
    name: "VT Cosmetics PDRN + Reedle S Brush Hair Serum (100ml)",
    jpName: "VT PDRN ãƒªãƒ¼ãƒ‰ãƒ«S ãƒ–ãƒ©ã‚·ãƒ˜ã‚¢ã‚»ãƒ©ãƒ ",
    description: "SÃ©rum capilar em bisnaga com escova de silicone embutida na ponta. Estimula e trata o couro cabeludo.",
    priceBRL: 154.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 40.00,
    image: "https://i.postimg.cc/XYtjppMV/sg-11134207-82609-ml660ai1v8xsbd.jpg",
    rating: 4.8,
    reviewsCount: 110,
    department: "Beleza, Higiene e SaÃºde",
    category: "Cuidados Capilares",
    stock: 20
  },

  // --- HIGIENE E CUIDADOS PESSOAIS ---
  {
    id: "mofurashi-toothbrush",
    name: "Mofurashi Toothbrush",
    jpName: "ãƒ¢ãƒ•ãƒ©ã‚· æ­¯ãƒ–ãƒ©ã‚· ç‰¹æ®Šè¨­è¨ˆ",
    description: "Escova de dentes especial ergonÃ´mica.",
    priceBRL: 120.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 25.00,
    image: "https://iili.io/C2KS5Cb.png",
    rating: 4.9,
    reviewsCount: 154,
    department: "Beleza, Higiene e SaÃºde",
    category: "Higiene e Cuidados Pessoais",
    stock: 50
  },
  {
    id: "femimore-glutathione-soap",
    name: "Femimore Glutathione Bubble Soap",
    jpName: "ãƒ•ã‚§ãƒŸãƒ¢ã‚¢ ã‚°ãƒ«ã‚¿ãƒã‚ªãƒ³ ãƒãƒ–ãƒ«ã‚½ãƒ¼ãƒ—",
    description: "Sabonete Ã­ntimo e corporal em espuma com Glutathione. Limpeza suave, controle de odor, oleosidade e clareamento leve.",
    priceBRL: 110.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.ibb.co/spChCy9L/50621-60-7f7bb7dbd3cd39bf13b37bcd7b35754b-1536x1024.jpg",
    rating: 4.8,
    reviewsCount: 64,
    department: "Beleza, Higiene e SaÃºde",
    category: "Higiene e Cuidados Pessoais",
    stock: 20
  },

  // --- APARELHOS ESTÃ‰TICOS E TECNOLOGIA ---
  {
    id: "medicube-age-r-booster-pro",
    name: "Medicube Age-R Booster Pro",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– æœ¬æ ¼ç¾Žé¡”å™¨",
    description: "O dispositivo eletrÃ´nico facial inteligente que Ã© um verdadeiro fenÃ´meno na Coreia. Ele combina 4 tecnologias de clÃ­nica em um Ãºnico aparelho (eletroporaÃ§Ã£o, microcorrentes, EMS e LED) para abrir os caminhos da pele, fazendo com que seus sÃ©rums e cremes penetrem atÃ© 700% mais profundamente.",
    priceBRL: 1430.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 50.00,
    image: "https://i.postimg.cc/s2DtFdyK/medicube-age-r-booster-pro-device-pink.jpg",
    rating: 5.0,
    reviewsCount: 142,
    department: "Beleza, Higiene e SaÃºde",
    category: "Aparelhos EstÃ©ticos e Tecnologia",
    stock: 10
  },
  {
    id: "medicube-age-r-booster-pro-mini",
    name: "Medicube Age-R Booster Pro Mini",
    jpName: "ãƒ¡ãƒ‡ã‚£ã‚­ãƒ¥ãƒ¼ãƒ– ç¾Žé¡”å™¨ ãƒŸãƒ‹",
    description: "A versÃ£o compacta, leve e ideal para viagens do famoso aparelho de eletroporaÃ§Ã£o da Medicube. Focado em maximizar o brilho (glow) e a absorÃ§Ã£o dos seus produtos de skincare diÃ¡rios atravÃ©s de impulsos elÃ©tricos suaves e seguros.",
    priceBRL: 494.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 35.00,
    image: "https://i.postimg.cc/qq0sY0Hn/d-nq-np-2x-881547-mlb83207883971-032025-f-medicube-age-r-booster-pro-mini-rosa-yloktw1oig.webp",
    rating: 4.9,
    reviewsCount: 86,
    department: "Beleza, Higiene e SaÃºde",
    category: "Aparelhos EstÃ©ticos e Tecnologia",
    stock: 15
  },
  {
    id: "portable-home-led-beauty-device",
    name: "Portable Home LED Beauty Device",
    jpName: "æºå¸¯ç”¨ LED ç¾Žé¡”å™¨",
    description: "Aparelho estÃ©tico portÃ¡til com terapia LED e massagem para uso domÃ©stico (CompatÃ­vel com PDRN e sÃ©runs).",
    priceBRL: 980.00,
    serviceFeeBRL: 0,
    shippingEstBRL: 45.00,
    image: "https://i.postimg.cc/3Jc7cdx6/D-NQ-NP-2X-800111-MLB111755666986-062026-F.webp",
    rating: 4.9,
    reviewsCount: 52,
    department: "Beleza, Higiene e SaÃºde",
    category: "Aparelhos EstÃ©ticos e Tecnologia",
    stock: 10
  }
];

import { useState, useEffect } from "react";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showTaxNotice, setShowTaxNotice] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [activeTab, setActiveTab] = useState<"store" | "redirect" | "account" | "about" | "admin">("store");
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser({ ...u });
        setIsAuthOpen(false); 

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
        setActiveTab((prevTab) => (prevTab === "account" || prevTab === "admin" ? "store" : prevTab));
      }
    });
    return () => unsubAuth();
  }, []);

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

  return (
    <>
    </>
  );
}

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
      {showTaxNotice && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl border-2 border-red-600">
            <h3 className="font-black text-red-600 mb-2">📦 Aviso Importante</h3>
            <p className="text-slate-700 text-sm mb-4">
              Compras internacionais podem estar sujeitas à cobrança de 60% de imposto de importação, além do ICMS. Essas taxas são de responsabilidade do comprador.
            </p>
            <label className="flex items-center gap-2 text-xs font-bold mb-4 cursor-pointer">
              <input type="checkbox" onChange={(e) => setAcceptedTerms(e.target.checked)} />
              Li e concordo.
            </label>
            <button 
              onClick={() => { if(acceptedTerms) setShowTaxNotice(false); }}
              className={`w-full text-white font-bold py-2 rounded-lg transition-opacity ${acceptedTerms ? 'bg-red-600' : 'bg-red-400 cursor-not-allowed'}`}
              disabled={!acceptedTerms}
            >
              ESTOU CIENTE
            </button>
          </div>
        </div>
      )}
      
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

      <RedirectBanner onRedirectClick={() => { 
        setActiveTab("redirect"); 
        setShowTaxNotice(true); 
      }} />

      <div className="max-w-7xl mx-auto w-full px-4 pt-4 flex justify-end">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex gap-1 flex-wrap justify-end">
          <button onClick={handleReturnToStore} className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${activeTab === "store" ? "bg-red-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>Loja</button>
          <button onClick={() => { setActiveTab("redirect"); setShowTaxNotice(true); }} className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${activeTab === "redirect" ? "bg-red-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>Redirecionamento ✈️</button>
          <button onClick={() => setActiveTab("about")} className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${activeTab === "about" ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>Sobre Nós</button>
          <button onClick={() => { if (user) { setActiveTab("account"); } else { setIsAuthOpen(true); } }} className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${activeTab === "account" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>Minha Suíte & Painel 📦</button>
          {isAdmin && (
            <button onClick={() => setActiveTab("admin")} className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${activeTab === "admin" ? "bg-red-600 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50"}`}>Painel Armazém 🏢</button>
          )}
        </div>
      </div>

      {activeTab === "store" ? (
        <>
          <Hero onScrollToCatalog={() => { setSelectedCategory("Todos"); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }} onOpenBudgetModal={() => setIsBudgetModalOpen(true)} onOpenClubModal={() => setIsClubModalOpen(true)} />
          <main className="flex-1">
            <TrustBadges />
            <section id="catalogo" className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="text-left">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">🛒 Vitrine de Importação</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Filtro ativo no cabeçalho: <span className="text-red-600 font-bold">{selectedCategory}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-slate-400" />
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 bg-white text-xs font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
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
        <main className="flex-1 bg-white py-12 px-4">
          <section className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-red-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MapPin className="w-48 h-48 text-red-600" />
              </div>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight text-red-600">📦 Compre em Qualquer Loja do Japão</h2>
                  <div className="text-black space-y-4 text-sm font-bold mb-8">
                    <p>Muitas lojas online japonesas não enviam produtos para o exterior. É para isso que estamos aqui!</p>
                    <p>Com o nosso serviço de <strong className="text-red-600">Redirecionamento</strong>, você faz compras nos seus sites favoritos como se morasse no Japão usando o nosso endereço como destino. Nós recebemos, organizamos suas caixas e enviamos tudo direto para a sua casa no Brasil.</p>
                    <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl flex gap-3 text-red-700 mt-6">
                      <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed font-bold"><strong>Como fazer:</strong> Copie o endereço abaixo e cole na hora de finalizar a compra na loja japonesa. Assim que o pagamento for concluído, clique no botão abaixo para nos enviar o comprovante pelo WhatsApp e avisar que a encomenda está a caminho.</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-600 border border-red-100 relative">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Seu Endereço no Japão</p>
                    <p className="font-black text-xl leading-snug mb-1 text-black">The Tomorrow</p>
                    <p className="text-gray-700 font-bold">2-chōme-3-15 Matsutera, Yokkaichi</p>
                    <p className="text-gray-700 font-bold">Mie 510-8021</p>
                    <p className="text-black font-black mt-2">(Japão)</p>
                  </div>
                  <button onClick={() => window.open("https://wa.me/817014074971?text=Ol%C3%A1%21%20Acabei%20de%20fazer%20uma%20compra%20usando%20o%20endere%C3%A7o%20de%20redirecionamento%20da%20Jap%C3%A3o%20Box%20Brasil%20e%20gostaria%20de%20avisar%20o%20envio%21", "_blank")} className="mt-8 bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider py-4 px-8 rounded-xl transition-all w-full sm:w-auto shadow-lg">Avisar Envio no WhatsApp</button>
                </div>

<div className="space-y-6">
                <h3 className="text-xl font-black mb-4 text-red-600">🔗 Lojas Recomendadas</h3>
                
                <div className="bg-white p-5 rounded-2xl border-2 border-red-200 shadow-md hover:border-red-500 transition-all">
                  <h4 className="text-sm font-black text-red-600 mb-3 uppercase tracking-wider">Marcas de Roupa e Calçados</h4>
                  <ul className="space-y-4 text-sm font-bold text-black">
                    <li>
                      <a href="https://www.adidas.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group">
                        <ExternalLink className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <img src="https://i.postimg.cc/NjHFWKqs/Captura-de-tela-2026-06-19-053415.png" alt="Adidas Logo" className="h-5 w-auto object-contain select-none transition-transform group-hover:scale-105" />
                        <span>Adidas Japan</span>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.gu-global.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group">
                        <ExternalLink className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <img src="https://i.postimg.cc/FKXzmhN5/Captura-de-tela-2026-06-19-053510.png" alt="GU Logo" className="h-5 w-auto object-contain select-none transition-transform group-hover:scale-105" />
                        <span>GU</span>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.onitsukatiger.com/jp/ja-jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group">
                        <ExternalLink className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <img src="https://i.postimg.cc/43RyZXsT/Captura-de-tela-2026-06-19-053638.png" alt="Onitsuka Tiger Logo" className="h-5 w-auto object-contain select-none transition-transform group-hover:scale-105" />
                        <span>Onitsuka Tiger</span>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.uniqlo.com/jp/ja/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group">
                        <ExternalLink className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <img src="https://i.postimg.cc/Xv6q3n46/Captura-de-tela-2026-06-19-053708.png" alt="Uniqlo Logo" className="h-5 w-auto object-contain select-none transition-transform group-hover:scale-105" />
                        <span>Uniqlo Japan</span>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.nike.com/jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group">
                        <ExternalLink className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <img src="https://i.postimg.cc/LsF5Rm2p/Captura-de-tela-2026-06-19-053831.png" alt="Nike Logo" className="h-5 w-auto object-contain select-none transition-transform group-hover:scale-105" />
                        <span>Nike Japan</span>
                      </a>
                    </li>
                  </ul>
                </div>
</div>

              <div className="bg-white p-5 rounded-2xl border-2 border-red-200 shadow-md hover:border-red-500 transition-all">
                  <h4 className="text-sm font-black text-red-600 mb-3 uppercase tracking-wider">Marketplaces</h4>
                  <ul className="space-y-4 text-sm font-bold text-black">
                    <li>
                      <a href="https://www.rakuten.co.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group">
                        <ExternalLink className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="w-5 text-center select-none">🛍️</span>
                        <span>Rakuten JP</span>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.amazon.co.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group">
                        <ExternalLink className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="w-5 text-center select-none">📦</span>
                        <span>Amazon Japan</span>
                      </a>
                    </li>
                    <li>
                      <a href="https://jp.mercari.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group">
                        <ExternalLink className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="w-5 text-center select-none">🔄</span>
                        <span>Mercari</span>
                      </a>
                    </li>
                  </ul>
                </div>
<div className="bg-white p-5 rounded-2xl border-2 border-red-200 shadow-md hover:border-red-500 transition-all">
                      <h4 className="text-sm font-black text-red-600 mb-3 uppercase tracking-wider">Joias & Moda</h4>
                      <ul className="space-y-4 text-sm font-bold text-black">
                        <li>
                          <a href="https://www.zara.com/jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-3 group">
                            <ExternalLink className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span className="w-5 text-center select-none">✨</span>
                            <span>Zara Japan</span>
                          </a>
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
              <div className="md:col-span-12 p-8 md:p-12 flex flex-col justify-center space-y-6 bg-white">
                <div>
                  <span className="text-xs font-black text-red-600 uppercase tracking-widest block mb-2">Nossa História</span>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">✨ Bem-vindos à Japão Box Brasil ✨</h1>
                </div>
                <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed font-medium text-left">
                  <p>Iniciamos nossa empresa com um sonho: levar até o Brasil os melhores produtos nacionais e importados, trazendo qualidade, beleza, tecnologia e novidades que conquistam o mundo inteiro. 🇯🇵🇧🇷</p>
                  <p>Selecionamos cada produto com carinho para oferecer itens originais, tendências de skincare, cosméticos, cuidados pessoais e muito mais, diretamente do Japão e da Coreia para você.</p>
                  <p>A Japão Box Brasil nasceu para aproximar culturas e entregar experiências únicas, com confiança, dedicação e amor em cada envio.</p>
                  <p className="font-semibold text-slate-800">Obrigada por fazer parte do começo dessa história com a gente!</p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 shadow-sm">
                      <img src="https://iili.io/CJbmWhP.md.jpg" alt="Japão Box Brasil Logo" className="w-full h-full object-cover" />
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
                <button onClick={handleReturnToStore} className="mt-6 bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold">Voltar para a Loja</button>
              </div>
            )}
          </main>
        ) : (
          <main className="flex-1 bg-slate-50 py-8 px-4 min-h-[85vh]">
            {user ? (
              <ClientDashboard user={user} orders={orders} loadingOrders={loadingOrders} onCreateMockOrder={handleCreateMockOrder} onLogout={handleLogout} getStatusBadge={getStatusBadge} />
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-slate-500">Por favor, realize o login para acessar sua suíte.</p>
              </div>
            )}
          </main>
        )}

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
                <li><button onClick={() => { setActiveTab("redirect"); setShowTaxNotice(true); }} className="hover:text-slate-900 transition-colors cursor-pointer">Redirecionamento ✈️</button></li>
                <li><button onClick={() => setActiveTab("about")} className="hover:text-slate-900 transition-colors cursor-pointer">Sobre Nós</button></li>
                <li><button onClick={() => { if(user) { setActiveTab("account") } else { setIsAuthOpen(true) } }} className="hover:text-slate-900 transition-colors cursor-pointer">Rastrear Pedido</button></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 mt-8 text-center text-xs text-slate-400 space-y-2 pb-6">
            <p>© 2026 Japão Box Brasil. Todos os direitos reservados.</p>
            <p className="text-[11px] font-medium tracking-wide text-slate-500 pt-1">
              Desenvolvimento por <span className="text-slate-800 font-bold">Gustavo Jax Audiovisual</span>
            </p>
          </div>
        </footer>

        {isCartOpen && <CartDrawer onClose={() => setIsCartOpen(false)} cartItems={cartItems} setCartItems={setCartItems} />}
        <BudgetModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} onSubmit={() => {}} />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        <ClubModal isOpen={isClubModalOpen} onClose={() => setIsClubModalOpen(false)} />
        <WhatsAppFloat />
      </div>
    );
}

export default App;
