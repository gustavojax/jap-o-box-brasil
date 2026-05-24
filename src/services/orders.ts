import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

const colRef = collection(db, "orders");

// criar pedido
export async function createOrder(order: any) {
  return await addDoc(colRef, order);
}

// buscar pedidos (tempo real)
export function listenOrders(callback: (data: any[]) => void) {
  return onSnapshot(colRef, (snapshot) => {
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    callback(data);
  });
}

// atualizar status
export async function updateOrderStatus(id: string, status: string) {
  const ref = doc(db, "orders", id);
  return await updateDoc(ref, { status });
}
