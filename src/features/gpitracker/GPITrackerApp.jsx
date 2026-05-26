import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Dashboard from './views/Dashboard';
import Negocios from './views/Negocios';
import Visitas from './views/Visitas';
import Treinamentos from './views/Treinamentos';
import Corretores from './views/Corretores';
import Login from './views/Login';
import { Menu, X } from 'lucide-react';

export default function GPITrackerApp() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Deferir a montagem das rotas por 150ms para garantir que os cabeçalhos de autorização
      // JWT do cliente Postgrest global do Supabase estejam 100% sincronizados.
      setTimeout(() => {
        setSession(session);
        setLoading(false);
      }, 150);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        setSession(session);
        setLoading(false);
      }, 150);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Carregando...</div>;

  // Rejeita acesso se não houver sessão, se a sessão for anônima ou se não tiver e-mail válido
  const isAuthenticated = session && session.user?.email && !session.user?.is_anonymous;

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium ${
      isActive
        ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      
      {/* MOBILE TOPBAR */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 px-5 py-4 flex items-center justify-between z-40 shrink-0">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">GPI Tracker</h1>
          <p className="text-[10px] text-slate-400">Vanguard · Comercial</p>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* SIDEBAR (Desktop permanent, Mobile overlay/drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 border-r border-slate-800 flex flex-col bg-slate-900 z-50 transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">GPI Tracker</h1>
            <p className="text-xs text-slate-400 mt-1">Vanguard · Comercial</p>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/gpitracker" className={getLinkClass('/gpitracker')} onClick={() => setMobileMenuOpen(false)}>
            📊 Dashboard
          </Link>
          <Link to="/gpitracker/visitas" className={getLinkClass('/gpitracker/visitas')} onClick={() => setMobileMenuOpen(false)}>
            📍 Registrar Visita
          </Link>
          <Link to="/gpitracker/treinamentos" className={getLinkClass('/gpitracker/treinamentos')} onClick={() => setMobileMenuOpen(false)}>
            📚 Treinamentos
          </Link>
          <Link to="/gpitracker/negocios" className={getLinkClass('/gpitracker/negocios')} onClick={() => setMobileMenuOpen(false)}>
            🏠 Negócios
          </Link>
          <Link to="/gpitracker/corretores" className={getLinkClass('/gpitracker/corretores')} onClick={() => setMobileMenuOpen(false)}>
            👥 Carteira de Corretores
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

      {/* MOBILE OVERLAY BACKGROUND */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 overflow-auto bg-slate-950 p-4 md:p-8">
        <Routes>
          <Route path="/" element={<Dashboard user={session?.user} />} />
          <Route path="/visitas" element={<Visitas user={session?.user} />} />
          <Route path="/treinamentos" element={<Treinamentos user={session?.user} />} />
          <Route path="/negocios" element={<Negocios user={session?.user} />} />
          <Route path="/corretores" element={<Corretores user={session?.user} />} />
        </Routes>
      </main>
    </div>
  );
}
