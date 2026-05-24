import React, { useState } from "react";
import { getTrackingByCode } from "../services/tracking";

export default function TrackingWidget() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!code) return;

    setLoading(true);

    try {
      const data = await getTrackingByCode(code);
      setResult(data);
    } catch (err: any) {
      alert("Pedido não encontrado");
      setResult(null);
    }

    setLoading(false);
  }

  return (
    <div className="p-6 max-w-md mx-auto">

      <h1 className="text-2xl font-bold mb-4">
        📦 Rastreio do Pedido
      </h1>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Digite seu código de rastreio"
        className="border p-2 w-full rounded mb-3"
      />

      <button
        onClick={handleSearch}
        className="bg-black text-white w-full p-2 rounded"
      >
        {loading ? "Buscando..." : "Rastrear"}
      </button>

      {/* RESULTADO */}
      {result && (
        <div className="mt-6 space-y-3 border p-4 rounded">

          <h2 className="text-red-600 font-bold text-lg">
            {result.currentStatus}
          </h2>

          <p className="text-gray-600">
            {result.currentDescription}
          </p>

          <div className="space-y-2 mt-4">

            {result.steps.map((step: any, i: number) => (
              <div key={i} className="flex items-center gap-2">

                <div
                  className={`w-3 h-3 rounded-full ${
                    step.completed ? "bg-green-500" : "bg-gray-300"
                  }`}
                />

                <span className="text-sm">
                  {step.status}
                </span>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}
