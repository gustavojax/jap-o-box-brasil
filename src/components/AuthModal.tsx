import React, { useState } from "react";
import { auth } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { X, Mail, Lock, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // 🔄 Estado para a tela de recuperar senha
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // 🔄 Função para tratar o envio do formulário de recuperação de senha
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor, introduza o seu e-mail.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Método nativo do Firebase Auth que dispara o fluxo de reset
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Link de recuperação enviado! Verifique a sua caixa de entrada ou spam.");
      setEmail("");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setError("Este e-mail não está registado na plataforma.");
      } else if (err.code === "auth/invalid-email") {
        setError("Formato de e-mail inválido.");
      } else {
        setError("Ocorreu um erro ao enviar o link. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError("As senhas não coincidem.");
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("E-mail ou senha incorretos.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Este e-mail já está em uso.");
      } else if (err.code === "auth/weak-password") {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setError("Ocorreu um erro na autenticação. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 relative text-left animate-fadeIn">
        
        {/* BOTÃO FECHAR */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-900 transition-colors p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. TELA: ESQUECI MINHA SENHA */}
        {isForgotPassword ? (
          <div className="space-y-4">
            <button 
              onClick={() => { setIsForgotPassword(false); setError(null); setSuccessMessage(null); }}
              className="text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao Login
            </button>

            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Recuperar Senha</h3>
              <p className="text-xs text-slate-500 mt-1">
                Introduza o e-mail da sua conta Japão Box Brasil para receber as instruções de redefinição de senha.
              </p>
            </div>

            {successMessage ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-medium text-emerald-900 flex gap-2 items-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">E-mail da Conta</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50/50 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                {error && <p className="text-xs font-bold text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-200"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar Link de Reset"}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* 2. TELA: LOGIN / REGISTO TRADICIONAL */
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {isSignUp ? "Criar Nova Conta" : "Aceder ao Painel"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isSignUp ? "Registe-se para obter a sua suíte exclusiva no Japão." : "Gerencie os seus envios diretos de Mie."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Seu E-mail</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    placeholder="nome@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Sua Senha</label>
                  
                  {/* Botão Esqueci a Senha integrado discretamente */}
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => { setIsForgotPassword(true); setError(null); }}
                      className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer bg-transparent border-none outline-none"
                    >
                      Esqueceu-se da senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Confirmar Senha</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50/50 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>
              )}

              {error && <p className="text-xs font-bold text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-200"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSignUp ? "Criar Conta" : "Entrar no Painel"}
              </button>
            </form>

            {/* ALTERNADOR ENTRE LOGIN E CADASTRO */}
            <div className="text-center pt-2 border-t border-slate-100">
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                {isSignUp ? "Já tem uma conta? Aceda aqui" : "Não tem conta? Registe-se na plataforma"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
