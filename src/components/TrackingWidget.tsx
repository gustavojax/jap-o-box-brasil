import React, { useState } from "react";
import { PackageCheck, Truck, MapPin } from "lucide-react";
import { getMockTracking, TrackingData } from "../services/tracking";

export default function TrackingWidget() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<TrackingData | null>(null);

  function handleSearch() {
    const result = getMockTracking(code);
    setData(result);
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-3">
        Japão Box Brasil - Rastreamento
      </h1>

      <input
        className="border p-2 w-full"
        placeholder="Digite seu código"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="bg-black text-white p-2 w-full mt-2"
      >
        Rastrear
      </button>

      {data && (
        <div className="mt-4 space-y-3">
          {data.steps.map((step, index) => (
            <div key={index} className="border p-2 rounded">
              <div className="flex items-center gap-2">
                <PackageCheck size={16} />
                <strong>{step.status}</strong>
              </div>
              <div className="text-sm flex items-center gap-2">
                <MapPin size={14} />
                {step.location}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
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
