import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { TrackingData } from "../types";

// ============================
// SALVAR TRACKING (ADMIN)
// ============================
export async function saveTracking(data: TrackingData) {
  await setDoc(doc(db, "tracking", data.code), data);
}

// ============================
// BUSCAR TRACKING (USUÁRIO)
// ============================
export async function getTracking(code: string) {
  const ref = doc(db, "tracking", code);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data() as TrackingData;
}
