import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export async function getTrackingByCode(code: string) {
  const q = query(
    collection(db, "orders"),
    where("trackingCode", "==", code)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Pedido não encontrado");
  }

  const doc = snapshot.docs[0].data();

  return {
    currentStatus: doc.status,
    currentDescription: generateDescription(doc.status),
    steps: generateSteps(doc.status),
  };
}

// 🔥 STATUS → TEXTO HUMANO
function generateDescription(status: string) {
  switch (status) {
    case "Postado no Japão":
      return "Seu pedido foi enviado do Japão e está em processamento internacional.";

    case "Em trânsito internacional":
      return "Seu pedido está voando para o Brasil.";

    case "Recebido no Brasil":
      return "Seu pedido já chegou ao Brasil e está na alfândega.";

    case "Saiu para entrega":
      return "Seu pedido está com o entregador.";

    case "Entregue":
      return "Seu pedido foi entregue com sucesso.";

    default:
      return "Status em atualização.";
  }
}

// 🔥 TIMELINE AUTOMÁTICA
function generateSteps(status: string) {
  const flow = [
    "Postado no Japão",
    "Em trânsito internacional",
    "Recebido no Brasil",
    "Saiu para entrega",
    "Entregue",
  ];

  const index = flow.indexOf(status);

  return flow.map((step, i) => ({
    status: step,
    completed: i <= index,
  }));
}
