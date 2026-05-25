import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Se for signup
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });
        if (signUpError) throw signUpError;
        alert("Conta criada com sucesso! Você já pode entrar.");
        setIsSignUp(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 text-center border-b border-slate-800 bg-slate-900/50">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">GPI Tracker</h1>
          <p className="text-slate-400 mt-2 text-sm">Acesso restrito a Gestores de Parceria</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleAuth} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">E-mail corporativo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg py-2.5 pl-10 pr-4 text-white outline-none transition-colors"
                  placeholder="nome@vanguard.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Senha de acesso</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg py-2.5 pl-10 pr-4 text-white outline-none transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {loading ? 'Aguarde...' : isSignUp ? 'Criar Conta' : 'Acessar Plataforma'}
            </button>

            <div className="text-center mt-4 pt-2 border-t border-slate-800">
              <button 
                type="button" 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-slate-500 text-xs hover:text-indigo-400 transition-colors"
              >
                {isSignUp ? 'Já possuo uma conta. Fazer Login.' : 'Não tem login? Criar conta.'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
