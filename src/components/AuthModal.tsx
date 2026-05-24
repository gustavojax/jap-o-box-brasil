import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase";

export default function AuthModal({ isOpen, onClose }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      onClose(); // fecha modal após sucesso
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md">

        <h2 className="text-xl font-bold mb-4">
          {mode === "login" ? "Entrar" : "Criar conta"}
        </h2>

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-xl"
        >
          {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Cadastrar"}
        </button>

        <button
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
          className="text-sm mt-3 text-blue-600 w-full"
        >
          {mode === "login"
            ? "Criar nova conta"
            : "Já tenho conta"}
        </button>

      </div>

    </div>
  );
}
