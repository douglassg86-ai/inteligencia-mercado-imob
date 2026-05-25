import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { MapPin, Users, Calendar, Plus } from 'lucide-react';

export default function Visitas() {
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    hora: '10:00',
    imobiliaria: '',
    corretores_impactados: 1,
    tipo: 'Relacionamento',
    obs: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) fetchVisitas();
    });
  }, []);

  const fetchVisitas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('visitas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error("Erro ao buscar visitas:", error);
    else setVisitas(data || []);
    setLoading(false);
  };

  const saveVisita = async () => {
    if (!formData.imobiliaria) {
      alert('Imobiliária é obrigatória.');
      return;
    }

    try {
      const id = crypto.randomUUID();
      const { error } = await supabase.from('visitas').insert({
        id,
        data: formData.data,
        hora: formData.hora,
        gpi: user?.email || 'gpi_logado', // será substituído pela relação Auth no Supabase
        imobiliaria: formData.imobiliaria,
        corretores_impactados: formData.corretores_impactados,
        tipo: formData.tipo,
        obs: formData.obs,
        criado_por: user?.id || 'anon'
      });

      if (error) throw error;

      // Registrar Contato Efetivo
      await supabase.from('contatos_efetivos').insert({
        gpi_id: user?.id || 'anon',
        tipo: 'VISITA',
        ref_id: id
      });

      setModalOpen(false);
      fetchVisitas();
    } catch (err) {
      console.error("Erro ao salvar visita:", err);
      alert("Erro ao salvar a visita.");
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Visitas Imobiliárias</h1>
          <p className="text-slate-400 mt-1">Registro de presença nas imobiliárias da carteira.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <Plus size={18} /> Registrar Visita
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="text-slate-500">Carregando visitas...</div>
        ) : visitas.length === 0 ? (
          <div className="text-slate-500 col-span-3 bg-slate-900 border border-slate-800 p-8 rounded-xl text-center">Nenhuma visita registrada no seu histórico recente.</div>
        ) : (
          visitas.map(v => (
            <div key={v.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <MapPin size={18} />
                  <span>{v.imobiliaria}</span>
                </div>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{v.data}</span>
              </div>
              
              <div className="flex gap-4 text-sm text-slate-300 mt-2">
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-slate-500"/> {v.hora}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} className="text-slate-500"/> {v.corretores_impactados} impactados
                </div>
              </div>
              
              <div className="text-xs text-slate-400 mt-2 bg-slate-800 p-3 rounded">
                <strong className="text-slate-300">Tipo:</strong> {v.tipo}<br/>
                <span className="italic">"{v.obs}"</span>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
              <h3 className="text-lg font-bold text-slate-100">Registrar Visita</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Data</label>
                  <input type="date" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" 
                    value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Hora</label>
                  <input type="time" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" 
                    value={formData.hora} onChange={e => setFormData({...formData, hora: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Imobiliária</label>
                <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" 
                  placeholder="Nome da Imobiliária" value={formData.imobiliaria} onChange={e => setFormData({...formData, imobiliaria: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Motivo / Tipo</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500"
                    value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                    <option>Relacionamento</option>
                    <option>Campanha / Ação</option>
                    <option>Apresentação MKT</option>
                    <option>Apresentação Eng.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Corretores Impactados</label>
                  <input type="number" min="1" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" 
                    value={formData.corretores_impactados} onChange={e => setFormData({...formData, corretores_impactados: Number(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Observações</label>
                <textarea className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 h-24" 
                  placeholder="Detalhes da visita..." value={formData.obs} onChange={e => setFormData({...formData, obs: e.target.value})} />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-400 font-medium hover:bg-slate-800 rounded-lg transition-colors">Cancelar</button>
              <button onClick={saveVisita} className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">Confirmar Registro</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
