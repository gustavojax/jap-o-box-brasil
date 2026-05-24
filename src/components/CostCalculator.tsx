import React, { useState, useEffect } from "react";
import { YEN_TO_BRL_RATE } from "../data";
import {
  Calculator,
  HelpCircle,
  Sparkles,
  Send,
} from "lucide-react";

interface CostCalculatorProps {
  onOpenBudgetModalWithData: (data: {
    link: string;
    jpPriceYen: number;
    category: string;
    description: string;
  }) => void;
}

export default function CostCalculator({
  onOpenBudgetModalWithData,
}: CostCalculatorProps) {

  const [jpLink, setJpLink] = useState("");
  const [jpPriceYen, setJpPriceYen] = useState<number>(3500);
  const [weightClass, setWeightClass] = useState<number>(300);
  const [shippingMethod, setShippingMethod] =
    useState<string>("ePacket");

  const [baseBRL, setBaseBRL] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [shippingEst, setShippingEst] = useState(0);
  const [taxEst, setTaxEst] = useState(0);
  const [grandTotalBRL, setGrandTotalBRL] = useState(0);

  const presetOptions = [
    {
      name: "Chaveiro Raro",
      yen: 1500,
      link: "https://jp.mercari.com/",
      weight: 100,
    },
    {
      name: "Cosmético",
      yen: 2200,
      link: "https://shiseido.co.jp/",
      weight: 250,
    },
    {
      name: "Figure Anime",
      yen: 12000,
      link: "https://amiami.com/",
      weight: 1200,
    },
    {
      name: "Tênis",
      yen: 21000,
      link: "https://amazon.co.jp/",
      weight: 1500,
    },
  ];

  useEffect(() => {

    // BASE
    const base =
      jpPriceYen * YEN_TO_BRL_RATE;

    setBaseBRL(base);

    // TAXA SERVIÇO
    const fee =
      base < 150
        ? 25
        : Math.max(
            30,
            Number((base * 0.10).toFixed(2))
          );

    setServiceFee(fee);

    // FRETE
    let shipCost = 0;

    if (shippingMethod === "EMS") {

      shipCost =
        Math.max(
          90,
          80 + (weightClass * 0.07)
        );

    } else if (
      shippingMethod === "ePacket"
    ) {

      shipCost =
        Math.max(
          45,
          35 + (weightClass * 0.05)
        );

    } else {

      shipCost =
        Math.max(
          35,
          25 + (weightClass * 0.04)
        );
    }

    setShippingEst(
      Number(shipCost.toFixed(2))
    );

    // REGRAS BRASIL
    const USD_BRL = 5.5;

    const totalProductAndShipping =
      base + shipCost;

    const totalUSD =
      totalProductAndShipping / USD_BRL;

    let importTax = 0;

    if (totalUSD <= 50) {

      importTax =
        totalProductAndShipping * 0.20;

    } else {

      importTax =
        totalProductAndShipping * 0.60;
    }

    // ICMS
    const subtotalWithImportTax =
      totalProductAndShipping + importTax;

    const icms =
      (
        subtotalWithImportTax /
        (1 - 0.17)
      ) - subtotalWithImportTax;

    const finalTaxes =
      importTax + icms;

    setTaxEst(
      Number(finalTaxes.toFixed(2))
    );

    // TOTAL
    const total =
      base +
      fee +
      shipCost +
      finalTaxes;

    setGrandTotalBRL(
      Number(total.toFixed(2))
    );

  }, [
    jpPriceYen,
    weightClass,
    shippingMethod,
  ]);

  const applyPreset = (
    preset: typeof presetOptions[0]
  ) => {

    setJpPriceYen(preset.yen);
    setJpLink(preset.link);
    setWeightClass(preset.weight);
  };

  const handleSubmitRequest = () => {

    onOpenBudgetModalWithData({
      link:
        jpLink || "Nenhum link",
      jpPriceYen,
      category:
        "Personal Shopper",
      description:
        `Pedido calculado de ¥${jpPriceYen}`,
    });
  };

  return (

    <section
      id="tax-calculator-section"
      className="py-16 px-4 bg-gradient-to-b from-white to-rose-50/40"
    >

      <div className="max-w-6xl mx-auto">

        <div className="text-center max-w-3xl mx-auto mb-12">

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider mb-3">

            <Calculator className="w-4 h-4" />

            Transparência Máxima

          </div>

          <h2 className="text-3xl font-black text-gray-900">

            Calculadora de Importação 🇯🇵 ➔ 🇧🇷

          </h2>

          <p className="text-sm text-gray-500 mt-2">

            Simule os custos com impostos brasileiros atualizados.

          </p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">

            <div className="space-y-6">

              {/* PRESETS */}
              <div>

                <span className="text-xs font-bold text-gray-400 uppercase">

                  Presets rápidos

                </span>

                <div className="flex flex-wrap gap-2 mt-2">

                  {presetOptions.map((opt, idx) => (

                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        applyPreset(opt)
                      }
                      className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-red-50"
                    >

                      {opt.name}

                    </button>
                  ))}

                </div>

              </div>

              {/* LINK */}
              <div>

                <label className="block text-xs font-bold mb-2 uppercase">

                  Link do Produto

                </label>

                <input
                  type="url"
                  value={jpLink}
                  onChange={(e) =>
                    setJpLink(
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                />

              </div>

              {/* VALOR + PESO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-bold mb-2 uppercase">

                    Valor em Yen

                  </label>

                  <input
                    type="number"
                    min="1"
                    value={jpPriceYen}
                    onChange={(e) =>
                      setJpPriceYen(
                        parseInt(
                          e.target.value
                        ) || 0
                      )
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold mb-2 uppercase">

                    Peso (g)

                  </label>

                  <input
                    type="number"
                    min="10"
                    value={weightClass}
                    onChange={(e) =>
                      setWeightClass(
                        parseInt(
                          e.target.value
                        ) || 0
                      )
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                  />

                </div>

              </div>

              {/* SHIPPING */}
              <div>

                <label className="block text-xs font-bold mb-2 uppercase">

                  Método de Envio

                </label>

                <div className="grid grid-cols-3 gap-3">

                  {[
                    "ePacket",
                    "EMS",
                    "SmallPacket",
                  ].map((method) => (

                    <button
                      key={method}
                      type="button"
                      onClick={() =>
                        setShippingMethod(
                          method
                        )
                      }
                      className={`px-3 py-3 rounded-xl border text-xs ${
                        shippingMethod === method
                          ? "border-red-600 bg-red-50 text-red-700 font-bold"
                          : "border-slate-200"
                      }`}
                    >

                      {method}

                    </button>
                  ))}

                </div>

              </div>

            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 text-xs text-slate-500">

              <Sparkles className="w-4 h-4 text-amber-500 mt-0.5" />

              <span>

                Cálculo baseado nas regras atuais da Remessa Conforme.

              </span>

            </div>

          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 shadow-lg">

            <div className="border-b border-white/10 pb-4 mb-4">

              <span className="text-xs text-rose-300 uppercase font-bold">

                Simulação

              </span>

              <h4 className="text-xl font-black mt-2">

                Custo Final

              </h4>

            </div>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span>Produto</span>
                <span>
                  R$ {baseBRL.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Taxa Japão Box</span>
                <span>
                  R$ {serviceFee.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Frete</span>
                <span>
                  R$ {shippingEst.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-rose-300">

                <span className="flex items-center gap-1">

                  Impostos Brasileiros

                  <HelpCircle className="w-4 h-4" />

                </span>

                <span>
                  R$ {taxEst.toFixed(2)}
                </span>

              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-white/10">

              <span className="text-xs text-gray-400 uppercase font-bold">

                Total

              </span>

              <div className="text-4xl font-black text-amber-300 mt-2">

                R$ {grandTotalBRL.toFixed(2)}

              </div>

            </div>

            <button
              onClick={handleSubmitRequest}
              className="w-full mt-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >

              Solicitar Compra

              <Send className="w-4 h-4" />

            </button>

          </div>

        </div>

      </div>

    </section>
  );
}
