import React, { useState, useEffect, useMemo } from "react";
import { Trash2, Plus, Minus } from "lucide-react";

import type { CartItem } from "../types";
import { UPSELL_OPTIONS } from "../data";

interface CartDrawerProps {
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (
    productId: string,
    quantity: number
  ) => void;
  onRemoveItem: (productId: string) => void;
}

async function getShippingCost(params: {
  country: string;
  cep?: string;
  items: any[];
}): Promise<number> {
  if (
    params.country !== "BR" ||
    !params.items ||
    params.items.length === 0
  ) {
    return 0;
  }

  return params.items.reduce(
    (acc, item) =>
      acc +
      ((item.product.shippingEstBRL || 0) *
        item.quantity),
    0
  );
}

const USD_BRL_RATE = 5.0;
const ISENCAO_USD = 50;

const LIMITE_ISENCAO_BRL =
  ISENCAO_USD * USD_BRL_RATE;

const TAXA_II_ACIMA_50 = 0.6;
const TAXA_ICMS = 0.17;

export default function CartDrawer({
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {

  if (!cartItems) return null;

  const [cep, setCep] = useState("");

  const [country, setCountry] =
    useState("BR");

  const [shippingValue, setShippingValue] =
    useState(0);

  const [shippingLoading, setShippingLoading] =
    useState(false);

  const [isCheckout, setIsCheckout] =
    useState(false);

  const [customer, setCustomer] =
    useState({
      name: "",
      address: "",
    });

  // =========================
  // TAXES
  // =========================

  const calculateTaxes = (
    priceBRL: number
  ) => {

    let impostoImportacao = 0;

    if (priceBRL > LIMITE_ISENCAO_BRL) {
      impostoImportacao =
        priceBRL * TAXA_II_ACIMA_50;
    }

    const baseCalculoICMS =
      (priceBRL + impostoImportacao) /
      (1 - TAXA_ICMS);

    const valorICMS =
      baseCalculoICMS -
      (priceBRL + impostoImportacao);

    return {
      impostoImportacao,
      valorICMS,
      totalTaxes:
        impostoImportacao + valorICMS,
    };
  };

  // =========================
  // BASE TOTAL
  // =========================

  const baseItemsTotal = useMemo(() => {

    return cartItems.reduce((acc, item) => {

      const taxes = calculateTaxes(
        item.product.priceBRL
      );

      const base =
        item.product.priceBRL +
        item.product.serviceFeeBRL +
        taxes.totalTaxes;

      return (
        acc + base * item.quantity
      );

    }, 0);

  }, [cartItems]);

  // =========================
  // SHIPPING
  // =========================

  useEffect(() => {

    const cleanCep =
      cep.replace(/\D/g, "");

    if (
      country === "BR" &&
      cleanCep.length !== 8
    ) {
      setShippingValue(0);
      return;
    }

    const fetchShipping =
      async () => {

        setShippingLoading(true);

        try {

          const result =
            await getShippingCost({
              country,
              cep:
                country === "BR"
                  ? cleanCep
                  : undefined,
              items: cartItems,
            });

          setShippingValue(result);

        } catch (error) {

          console.error(error);

          setShippingValue(0);

        } finally {

          setShippingLoading(false);

        }
      };

    const timer = setTimeout(() => {
      fetchShipping();
    }, 300);

    return () =>
      clearTimeout(timer);

  }, [cep, country, cartItems]);

  // =========================
  // UPSELLS
  // =========================

  const upsellsTotal = useMemo(() => {

    return cartItems.reduce((acc, item) => {

      let sum = 0;

      item.selectedUpsells.forEach(
        (id) => {

          const opt =
            UPSELL_OPTIONS.find(
              (o) => o.id === id
            );

          if (opt) {
            sum += opt.priceBRL;
          }
        }
      );

      return (
        acc + sum * item.quantity
      );

    }, 0);

  }, [cartItems]);

  // =========================
  // DISCOUNT
  // =========================

  const discount =
    cartItems.length >= 2
      ? baseItemsTotal * 0.05
      : 0;

  // =========================
  // TOTAL
  // =========================

  const grandTotal =
    baseItemsTotal +
    upsellsTotal +
    shippingValue -
    discount;

  // =========================
  // WHATSAPP
  // =========================

  const handleSendWhatsApp =
    () => {

      if (
        !customer.name ||
        !customer.address
      ) {
        alert(
          "Preencha nome e endereço."
        );

        return;
      }

      let text =
        `*NOVO PEDIDO - JAPÃO BOX BRASIL* 📦\n\n`;

      text +=
        `Nome: ${customer.name}\n`;

      text +=
        `Endereço: ${customer.address}\n`;

      text +=
        `CEP: ${cep}\n\n`;

      cartItems.forEach((item) => {

        text +=
          `${item.quantity}x ${item.product.name}\n`;

      });

      text +=
        `\nTOTAL: R$ ${grandTotal.toFixed(2)}`;

      const encoded =
        encodeURIComponent(text);

      window.open(
        `https://wa.me/817014074971?text=${encoded}`,
        "_blank"
      );
    };

  const canCheckout =
    cartItems.length > 0;

  return (
    <div className="fixed inset-0 z-50">

      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 w-full max-w-md h-full bg-white flex flex-col">

        {/* HEADER */}

        <div className="p-4 border-b flex justify-between items-center">

          <span className="font-bold">
            {isCheckout
              ? "Finalizar Compra"
              : `Carrinho (${cartItems.length})`}
          </span>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>

        </div>

        {/* BODY */}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {!isCheckout ? (
            <>
              {/* FRETE */}

              <div className="p-3 bg-slate-50 rounded space-y-2">

                <p className="text-xs font-bold">
                  Calcular Frete
                </p>

                <input
                  value={cep}
                  onChange={(e) =>
                    setCep(e.target.value)
                  }
                  placeholder="Digite seu CEP"
                  className="w-full border p-2 rounded text-xs"
                />

                <select
                  value={country}
                  onChange={(e) =>
                    setCountry(
                      e.target.value
                    )
                  }
                  className="w-full border p-2 rounded text-xs"
                >
                  <option value="BR">
                    Brasil
                  </option>

                  <option value="JP">
                    Japão
                  </option>

                  <option value="US">
                    EUA
                  </option>
                </select>

                <p className="text-xs">
                  Frete:{" "}
                  {shippingLoading ? (
                    <b>Calculando...</b>
                  ) : (
                    <b>
                      R${" "}
                      {shippingValue.toFixed(
                        2
                      )}
                    </b>
                  )}
                </p>

              </div>

              {/* ITEMS */}

              {cartItems.map((item) => {

                const taxes =
                  calculateTaxes(
                    item.product.priceBRL
                  );

                const base =
                  item.product.priceBRL +
                  item.product.serviceFeeBRL +
                  taxes.totalTaxes;

                return (
                  <div
                    key={item.product.id}
                    className="border rounded p-3"
                  >

                    <div className="flex justify-between items-start">

                      <p className="text-xs font-bold">
                        {item.product.name}
                      </p>

                      <button
                        onClick={() =>
                          onRemoveItem(
                            item.product.id
                          )
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                    <div className="flex items-center gap-3 mt-3">

                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.product.id,
                            Math.max(
                              1,
                              item.quantity - 1
                            )
                          )
                        }
                      >
                        <Minus size={16} />
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                      >
                        <Plus size={16} />
                      </button>

                    </div>

                    <p className="text-xs mt-3 font-semibold">

                      R${" "}

                      {(
                        base *
                        item.quantity
                      ).toFixed(2)}

                    </p>

                  </div>
                );
              })}
            </>
          ) : (
            <div className="space-y-3">

              <input
                type="text"
                placeholder="Seu nome"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    name:
                      e.target.value,
                  })
                }
                className="w-full border p-3 rounded"
              />

              <textarea
                placeholder="Seu endereço"
                value={customer.address}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    address:
                      e.target.value,
                  })
                }
                className="w-full border p-3 rounded min-h-[120px]"
              />

            </div>
          )}

        </div>

        {/* FOOTER */}

        <div className="p-4 border-t bg-slate-50">

          <p className="text-lg font-black text-rose-600">

            Total: R$ {grandTotal.toFixed(2)}

          </p>

          {!isCheckout ? (
            <button
              onClick={() =>
                setIsCheckout(true)
              }
              disabled={!canCheckout}
              className="w-full mt-3 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded font-bold"
            >
              Finalizar Compra
            </button>
          ) : (
            <div className="flex gap-2 mt-3">

              <button
                onClick={() =>
                  setIsCheckout(false)
                }
                className="w-1/3 border rounded py-3 font-bold"
              >
                Voltar
              </button>

              <button
                onClick={
                  handleSendWhatsApp
                }
                className="w-2/3 bg-green-600 hover:bg-green-700 text-white rounded py-3 font-bold"
              >
                WhatsApp
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

