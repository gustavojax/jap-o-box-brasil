import React, { useEffect, useState } from "react";
import {
  createOrder,
  listenOrders,
  updateOrderStatus,
} from "../services/orders";

export default function AdminPanel() {
  const [list, setList] = useState<any[]>([]);

  const [form, setForm] = useState({
    trackingCode: "",
    customerName: "",
    status: "Postado no Japão",
  });

  useEffect(() => {
    const unsub = listenOrders(setList);
    return () => unsub();
  }, []);

  async function addOrder() {
    if (!form.trackingCode || !form.customerName) return;

    await createOrder({
      trackingCode: form.trackingCode,
      customerName: form.customerName,
      status: form.status,
      origin:
        "2-chōme-3-15 Matsutera, Yokkaichi, Mie 510-8021",
      destination: "Brasil",
      createdAt: new Date().toLocaleString(),
    });

    setForm({
      trackingCode: "",
      customerName: "",
      status: "Postado no Japão",
    });
  }

  async function updateStatus(id: string, status: string) {
    await updateOrderStatus(id, status);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-black mb-6">
        📦 Painel Admin (FIREBASE REAL)
      </h1>

      {/* FORM */}
      <div className="grid gap-3 p-4 border rounded-xl mb-6">

        <input
          placeholder="Tracking Code"
          className="border p-2 rounded"
          value={form.trackingCode}
          onChange={(e) =>
            setForm({ ...form, trackingCode: e.target.value })
          }
        />

        <input
          placeholder="Nome do cliente"
          className="border p-2 rounded"
          value={form.customerName}
          onChange={(e) =>
            setForm({ ...form, customerName: e.target.value })
          }
        />

        <button
          onClick={addOrder}
          className="bg-black text-white p-2 rounded"
        >
          Criar Pedido
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-4">

        {list.map((order) => (
          <div
            key={order.id}
            className="border p-4 rounded-xl shadow-sm"
          >

            <div className="flex justify-between">
              <div>
                <p className="font-bold">
                  {order.customerName}
                </p>

                <p className="text-sm text-gray-500">
                  {order.trackingCode}
                </p>
              </div>

              <p className="font-bold text-red-600">
                {order.status}
              </p>
            </div>

            {/* STATUS UPDATE */}
            <div className="flex gap-2 mt-3 flex-wrap">

              {[
                "Postado no Japão",
                "Em trânsito internacional",
                "Recebido no Brasil",
                "Saiu para entrega",
                "Entregue",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    updateStatus(order.id, status)
                  }
                  className="text-xs px-2 py-1 border rounded"
                >
                  {status}
                </button>
              ))}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
