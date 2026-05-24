import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// =========================================
// CRIAR PERFIL DE USUÁRIO
// =========================================
export const createUserProfile = async (
  uid: string,
  email: string
) => {
  await setDoc(doc(db, "users", uid), {
    email,
    createdAt: new Date(),
  });
};

// =========================================
// BUSCAR PERFIL
// =========================================
export const getUserProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, "users", uid));

  if (!snap.exists()) return null;

  return snap.data();
};
