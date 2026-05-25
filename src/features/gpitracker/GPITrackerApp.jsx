import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Dashboard from './views/Dashboard';
import Negocios from './views/Negocios';
import Visitas from './views/Visitas';
import Treinamentos from './views/Treinamentos';
import Login from './views/Login';

export default function GPITrackerApp() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Carregando...</div>;

  // Rejeita acesso se não houver sessão ou se a sessão for anônima
  const isAuthenticated = session && !session.user?.is_anonymous;

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-900">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-tight">GPI Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">Vanguard · Comercial</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/gpitracker" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 font-medium">
            📊 Dashboard
          </Link>
          <Link to="/gpitracker/visitas" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            📍 Registrar Visita
          </Link>
          <Link to="/gpitracker/treinamentos" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            📚 Treinamentos
          </Link>
          <Link to="/gpitracker/negocios" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            🏠 Negócios
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 truncate pr-2" title={session.user.email}>
              {session.user.email}
            </div>
            <button onClick={handleLogout} className="text-xs bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 px-2 py-1 rounded transition-colors">
              Sair
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-slate-950 p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/visitas" element={<Visitas />} />
          <Route path="/treinamentos" element={<Treinamentos />} />
          <Route path="/negocios" element={<Negocios />} />
        </Routes>
      </main>
    </div>
  );
}
