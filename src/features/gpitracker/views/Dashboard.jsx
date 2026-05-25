import React from 'react';

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Visão executiva — funil, vendas e atividade.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Placeholder KPIs */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold tracking-wider text-slate-400 uppercase">VGV Vendido</div>
              <div className="text-2xl font-black text-white mt-1">R$ 0,00</div>
              <div className="text-xs text-green-400 font-medium mt-1">0 vendas · Este mês</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl">💰</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold tracking-wider text-slate-400 uppercase">Visitas GPIs</div>
              <div className="text-2xl font-black text-white mt-1">0</div>
              <div className="text-xs text-indigo-400 font-medium mt-1">0 no histórico</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl">📍</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold tracking-wider text-slate-400 uppercase">Negócios em fluxo</div>
              <div className="text-2xl font-black text-white mt-1">0</div>
              <div className="text-xs text-amber-400 font-medium mt-1">0 em andamento</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl">🔥</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
        <p className="text-slate-400">
          O Dashboard está sendo migrado para React. Em breve, os gráficos de funil e rankings estarão disponíveis aqui integrados ao Supabase de forma relacional.
        </p>
      </div>
    </div>
  );
}
