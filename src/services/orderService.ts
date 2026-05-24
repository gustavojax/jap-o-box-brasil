import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

// =========================================
// CRIAR PEDIDO
// =========================================
export const createOrder = async (
  userId: string,
  items: any[],
  total: number
) => {
  const docRef = await addDoc(collection(db, "orders"), {
    userId,
    items,
    total,
    status: "processing",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

// =========================================
// LISTAR PEDIDOS DO USUÁRIO
// =========================================
export const getUserOrders = async (userId: string) => {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
