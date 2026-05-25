import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { BookOpen, Users, Calendar, Plus, CheckCircle } from 'lucide-react';

export default function Treinamentos() {
  const [treinamentos, setTreinamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    hora: '09:00',
    imobiliaria: '',
    obs: '',
    corretores_participaram: 0,
    status: 'pendente'
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) fetchTreinamentos();
    });
  }, []);

  const fetchTreinamentos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('treinamentos')
      .select('*')
      .order('data', { ascending: true });

    if (error) console.error("Erro ao buscar treinamentos:", error);
    else setTreinamentos(data || []);
    setLoading(false);
  };

  const saveTreinamento = async () => {
    if (!formData.imobiliaria) {
      alert('Imobiliária é obrigatória.');
      return;
    }

    try {
      const id = crypto.randomUUID();
      const { error } = await supabase.from('treinamentos').insert({
        id,
        data: formData.data,
        hora: formData.hora,
        gpi: user?.email || 'gpi_logado',
        imobiliaria: formData.imobiliaria,
        obs: formData.obs,
        status: formData.status,
        corretores_participaram: formData.corretores_participaram,
        criado_por: user?.id || 'anon'
      });

      if (error) throw error;

      // Se for inserido já como concluído, registra contato efetivo
      if (formData.status === 'concluido') {
        await supabase.from('contatos_efetivos').insert({
          gpi_id: user?.id || 'anon',
          tipo: 'TREINAMENTO',
          ref_id: id
        });
      }

      setModalOpen(false);
      fetchTreinamentos();
    } catch (err) {
      console.error("Erro ao salvar treinamento:", err);
      alert("Erro ao salvar o treinamento.");
    }
  };

  const concluirTreinamento = async (t) => {
    const qtd = prompt("Quantos corretores participaram do treinamento?");
    if (qtd === null) return;

    try {
      await supabase.from('treinamentos').update({
        status: 'concluido',
        corretores_participaram: parseInt(qtd) || 0,
        concluido_em: new Date().toISOString()
      }).eq('id', t.id);

      // Registrar Contato Efetivo
      await supabase.from('contatos_efetivos').insert({
        gpi_id: user?.id || 'anon',
        tipo: 'TREINAMENTO',
        ref_id: t.id
      });

      fetchTreinamentos();
    } catch (err) {
      console.error("Erro ao concluir:", err);
    }
  };

  const pendentes = treinamentos.filter(t => t.status === 'pendente');
  const concluidos = treinamentos.filter(t => t.status === 'concluido');

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Treinamentos</h1>
          <p className="text-slate-400 mt-1">Gestão e agendamento de treinamentos em imobiliárias.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <Plus size={18} /> Agendar Treinamento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PENDENTES */}
        <div>
          <h2 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Calendar size={20} /> Agendados
          </h2>
          <div className="space-y-3">
            {loading ? <p className="text-slate-500">Carregando...</p> : 
             pendentes.length === 0 ? <p className="text-slate-500 p-4 border border-slate-800 rounded-lg text-center bg-slate-900">Nenhum agendamento futuro.</p> :
             pendentes.map(t => (
              <div key={t.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between group">
                <div>
                  <div className="font-bold text-slate-200">{t.imobiliaria}</div>
                  <div className="text-sm text-amber-500 mt-1">{t.data} às {t.hora}</div>
                  <div className="text-xs text-slate-400 mt-2">{t.obs}</div>
                </div>
                <button 
                  onClick={() => concluirTreinamento(t)}
                  className="bg-slate-800 hover:bg-green-600 hover:text-white text-slate-400 p-2 rounded-lg transition-colors"
                  title="Marcar como Concluído"
                >
                  <CheckCircle size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CONCLUIDOS */}
        <div>
          <h2 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
            <BookOpen size={20} /> Concluídos
          </h2>
          <div className="space-y-3">
            {concluidos.length === 0 ? <p className="text-slate-500 p-4 border border-slate-800 rounded-lg text-center bg-slate-900">Nenhum histórico de treinamento.</p> :
             concluidos.map(t => (
              <div key={t.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between opacity-80">
                <div>
                  <div className="font-bold text-slate-300">{t.imobiliaria}</div>
                  <div className="text-sm text-slate-500 mt-1">{t.data}</div>
                </div>
                <div className="flex items-center gap-1 text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-sm font-bold border border-green-500/20">
                  <Users size={16} /> {t.corretores_participaram}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
              <h3 className="text-lg font-bold text-slate-100">Agendar Treinamento</h3>
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

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Status de Inserção</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500"
                  value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="pendente">Apenas Agendar (Pendente)</option>
                  <option value="concluido">Já Realizado (Concluído)</option>
                </select>
              </div>

              {formData.status === 'concluido' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Corretores que Participaram</label>
                  <input type="number" min="1" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" 
                    value={formData.corretores_participaram} onChange={e => setFormData({...formData, corretores_participaram: Number(e.target.value)})} />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Pauta / Observação</label>
                <textarea className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 h-24" 
                  placeholder="O que será abordado..." value={formData.obs} onChange={e => setFormData({...formData, obs: e.target.value})} />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-400 font-medium hover:bg-slate-800 rounded-lg transition-colors">Cancelar</button>
              <button onClick={saveTreinamento} className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
