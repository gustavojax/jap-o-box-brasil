import React, { useState } from "react";
import { PackageCheck, Truck, MapPin } from "lucide-react";
import { getTracking } from "../services/tracking";
import type { TrackingData } from "../types";

export default function TrackingWidget() {
  const [trackingCode, setTrackingCode] = useState("");
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (!trackingCode) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getTracking(trackingCode);

      if (!result) {
        setError("Código não encontrado");
        setData(null);
      } else {
        setData(result);
      }
    } catch (e) {
      setError("Erro ao buscar rastreio");
    }

    setLoading(false);
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-3">
        Rastreamento Japão Box Brasil
      </h1>

      <input
        className="border p-2 w-full"
        placeholder="Digite seu código"
        value={trackingCode}
        onChange={(e) => setTrackingCode(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="bg-black text-white w-full p-2 mt-2"
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>

      {error && (
        <p className="text-red-500 mt-2 text-sm">{error}</p>
      )}

      {data && (
        <div className="mt-4 space-y-3">
          {data.steps.map((step, i) => (
            <div key={i} className="border p-2 rounded">
              <div className="flex items-center gap-2 font-bold">
                <PackageCheck size={16} />
                {step.status}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} />
                {step.location}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Truck size={14} />
                {step.date}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
