import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// =========================================
// CONFIG FIREBASE (CORRIGIDO)
// =========================================
const firebaseConfig = {
  apiKey: "AIzaSyCoPztqmG0b7lAIaWRg-iIVvQgsJLkV5_I",
  authDomain: "jap-box-core-prod.firebaseapp.com",
  projectId: "jap-box-core-prod",
  storageBucket: "jap-box-core-prod.appspot.com",
  messagingSenderId: "842214047732",
  appId: "1:842214047732:web:2ab310e943ef47f1c303a1",
};

// =========================================
// EVITA REINICIALIZAÇÃO (IMPORTANTE EM DEV/VERCEL)
// =========================================
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// =========================================
// EXPORTS
// =========================================
export const db = getFirestore(app);
export const auth = getAuth(app);
