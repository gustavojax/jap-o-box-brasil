import React, { useState } from "react";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
}: AuthModalProps) {

  const [isLogin, setIsLogin] =
    useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="absolute inset-0 flex items-center justify-center p-4">

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="flex items-center justify-between p-5 border-b">

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {isLogin
                  ? "Entrar"
                  : "Criar Conta"}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Japão Box Brasil
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

          {/* CONTENT */}
          <div className="p-6 space-y-4">

            {!isLogin && (
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Nome
                </label>

                <input
                  type="text"
                  placeholder="Seu nome"
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="seuemail@gmail.com"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">
                Senha
              </label>

              <input
                type="password"
                placeholder="********"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3"
              />
            </div>

            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all"
            >
              {isLogin
                ? "Entrar"
                : "Criar Conta"}
            </button>

            <button
              onClick={() =>
                setIsLogin(!isLogin)
              }
              className="w-full text-sm text-red-600 font-bold hover:underline"
            >
              {isLogin
                ? "Não possui conta? Criar agora"
                : "Já possui conta? Entrar"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
                }
