import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { TrackingData } from "../types";

// ================================
// FIREBASE - SALVAR TRACKING REAL
// ================================
export async function saveTracking(data: TrackingData) {
  await setDoc(doc(db, "tracking", data.code), data);
}

// ================================
// FIREBASE - BUSCAR TRACKING REAL
// ================================
export async function getTracking(code: string) {
  const ref = doc(db, "tracking", code);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data() as TrackingData;
}

// ================================
// MOCK (USADO PARA NÃO QUEBRAR BUILD)
// ================================
export function getMockTracking(code: string) {
  if (!code) return null;

  return {
    code,
    steps: [
      {
        status: "Pedido recebido no Japão",
        location: "Tóquio - JP",
        date: "2026-05-20",
      },
      {
        status: "Em separação no armazém",
        location: "Osaka - JP",
        date: "2026-05-21",
      },
      {
        status: "Enviado para o Brasil",
        location: "Aeroporto de Narita",
        date: "2026-05-22",
      },
      {
        status: "Em trânsito internacional",
        location: "Oceano Pacífico",
        date: "2026-05-23",
      },
    ],
  };
}
