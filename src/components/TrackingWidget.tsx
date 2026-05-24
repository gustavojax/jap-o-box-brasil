import React, { useState } from "react";
import {
  Search,
  PackageCheck,
  Truck,
  MapPin,
} from "lucide-react";

interface TrackingStep {
  status: string;
  location: string;
  date: string;
}

interface TrackingResult {
  currentStatus: string;
  currentDescription: string;
  steps: TrackingStep[];
}

export default function TrackingWidget() {
  const [trackingCode, setTrackingCode] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     TRACKING ENGINE (SEM API)
     ========================= */
  function generateTracking(trackingCode: string): TrackingResult {
    const now = new Date();

    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 10);

    const daysPassed =
      Math.floor((now.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));

    const ORIGIN_ADDRESS =
      "2-chōme-3-15 Matsutera, Yokkaichi, Mie 510-8021";

    const steps: TrackingStep[] = [
      {
        status: "Postado no Japão",
        location: ORIGIN_ADDRESS,
        date: "10 dias atrás",
      },
      {
        status: "Em trânsito internacional",
        location: "Oceano Pacífico",
        date: "7 dias atrás",
      },
      {
        status: "Recebido no Brasil",
        location: "Curitiba 🇧🇷",
        date: "3 dias atrás",
      },
      {
        status: "Saiu para entrega",
        location: "Campinas/SP 🇧🇷",
        date: "Hoje",
      },
    ];

    let currentIndex = 0;

    if (daysPassed > 2) currentIndex = 1;
    if (daysPassed > 5) currentIndex = 2;
    if (daysPassed > 8) currentIndex = 3;

    return {
      currentStatus: steps[currentIndex].status,
      currentDescription:
        currentIndex === 0
          ? "Pedido registrado e aguardando envio."
          : currentIndex === 1
          ? "Seu pacote está em transporte internacional."
          : currentIndex === 2
          ? "Seu pacote chegou ao Brasil e está em processamento."
          : "Seu pacote está em rota de entrega.",

      steps,
    };
  }

  /* =========================
     HANDLE SEARCH
     ========================= */
  async function handleSearch() {
    setResult(null);
    setLoading(true);

    if (!trackingCode) {
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const data = generateTracking(trackingCode);
      setResult(data);
      setLoading(false);
    }, 800);
  }

  const currentIndex = result
    ? result.steps.findIndex(
        (s) => s.status === result.currentStatus
      )
    : -1;

  return (
    <div className="w-full max-w-xl mx-auto p-4">

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          placeholder="Digite o código de rastreio"
          className="flex-1 border rounded-xl px-4 py-3 outline-none"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-black text-white px-4 rounded-xl flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {loading ? "Buscando..." : "Rastrear"}
        </button>
      </div>

      {/* RESULTADO */}
      {result && (
        <div className="mt-8 space-y-6">

          {/* STATUS PRINCIPAL */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl p-6 text-white shadow-xl">

            <div className="flex items-center gap-3">

              <div className="bg-white/20 rounded-2xl p-3">
                <Truck className="w-7 h-7" />
              </div>

              <div>
                <p className="text-sm text-white/80 uppercase font-bold">
                  STATUS ATUAL
                </p>

                <h3 className="text-2xl font-black">
                  {result.currentStatus}
                </h3>
              </div>

            </div>

            <p className="mt-4 text-sm text-white/90">
              {result.currentDescription}
            </p>

            <div className="mt-4 bg-white/10 rounded-2xl px-4 py-3 inline-flex items-center gap-2 text-sm">
              <PackageCheck className="w-4 h-4" />
              Código:
              <span className="font-black">
                {trackingCode}
              </span>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="relative space-y-6">

            <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gray-200" />

            {result.steps.map((step, index) => {

              const isActive = index === currentIndex;
              const isDone = index < currentIndex;

              return (
                <div
                  key={index}
                  className="relative flex items-start gap-4"
                >

                  <div
                    className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      isActive
                        ? "bg-red-600 border-red-600 animate-pulse"
                        : isDone
                        ? "bg-green-500 border-green-500"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <MapPin
                      className={`w-4 h-4 ${
                        isActive || isDone
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    />
                  </div>

                  <div
                    className={`flex-1 p-4 rounded-2xl border transition-all ${
                      isActive
                        ? "border-red-500 bg-red-50 shadow-md"
                        : "border-gray-200"
                    }`}
                  >
                    <p className="font-bold">{step.status}</p>
                    <p className="text-sm text-gray-500">
                      {step.location}
                    </p>
                    <p className="text-xs text-gray-400">
                      {step.date}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
