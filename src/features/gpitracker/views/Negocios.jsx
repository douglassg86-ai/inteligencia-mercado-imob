import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Search, Edit2, Lock, ChevronRight, User } from 'lucide-react';
import { getGPIName } from './Corretores';

const GPIS = [
  'Douglas Gonçalves - POA',
  'Renato Santos - POA',
  'Roberto Nishi - POA',
  'Charles - POA',
  'Raffael Vieira - POA',
  'Aline Ordovas - POA',
  'Rinaldo Jardim - POA',
  'Paulo Peano - POA',
  'Daniel Mossatte - POA'
];

const COLUMNS = [
  { id: 'INTERESSADO', title: 'Interessados', color: 'border-blue-500 bg-blue-500/10 text-blue-400' },
  { id: 'AGENDAMENTO', title: 'Agendamentos', color: 'border-purple-500 bg-purple-500/10 text-purple-400' },
  { id: 'ATENDIMENTO', title: 'Atendimentos', color: 'border-amber-500 bg-amber-500/10 text-amber-400' },
  { id: 'PROPOSTA', title: 'Proposta', color: 'border-orange-500 bg-orange-500/10 text-orange-400' },
  { id: 'VENDA', title: 'Vendas', color: 'border-green-500 bg-green-500/10 text-green-400' }
];

export default function Negocios() {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentNegocio, setCurrentNegocio] = useState(null);
  
  // Session para validar GPI logado
  const [user, setUser] = useState(null);

  // States para autocomplete de corretores
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCorretor, setSelectedCorretor] = useState(null);

  const gpiName = getGPIName(user?.email);
  const isAdmin = user?.email?.toLowerCase() === 'do.goncalves@vanguard.com.br' || 
                  user?.email?.toLowerCase() === 'douglas.goncalves@vanguard.com.br';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) fetchNegocios();
    });
  }, []);

  const handleCorretorChange = async (value) => {
    setCurrentNegocio(prev => ({ ...prev, corretor: value }));
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      let query = supabase
        .from('corretores')
        .select('id, nome, telefone, email, imobiliaria, gpi_assoc')
        .ilike('nome', `%${value}%`);

      if (!isAdmin) {
        query = query.or(`gpi_assoc.eq."${gpiName}",gpi_assoc.eq.REDISTRIBUIR`);
      }

      const { data, error } = await query.limit(10);

      if (!error) {
        setSuggestions(data || []);
      }
    } catch (err) {
      console.error("Erro ao buscar corretores:", err);
    }
  };

  const handleSelectCorretor = (corretorObj) => {
    setCurrentNegocio(prev => ({
      ...prev,
      corretor: corretorObj.nome,
      contato_corretor: corretorObj.telefone,
      imobiliaria: corretorObj.imobiliaria
    }));
    setSelectedCorretor(corretorObj);
    setShowSuggestions(false);
  };

  const fetchNegocios = async () => {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUser = sessionData?.session?.user;
    const currentGpiName = getGPIName(currentUser?.email);
    const currentIsAdmin = currentUser?.email?.toLowerCase() === 'do.goncalves@vanguard.com.br' || 
                          currentUser?.email?.toLowerCase() === 'douglas.goncalves@vanguard.com.br';

    let query = supabase.from('negocios').select('*');
    if (!currentIsAdmin) {
      query = query.eq('responsavel', currentGpiName);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) console.error("Erro ao buscar negócios:", error);
    else setNegocios(data || []);
    setLoading(false);
  };

  const handleOpenModal = (negocio = null) => {
    if (negocio && negocio.contato_cliente) {
      alert("Este negócio está bloqueado pois já possui contato do cliente e foi migrado para o CRM Externo.");
      return;
    }
    
    setSuggestions([]);
    setShowSuggestions(false);

    if (negocio) {
      setCurrentNegocio({ ...negocio });
      findOriginalCorretor(negocio.corretor);
    } else {
      setSelectedCorretor(null);
      setCurrentNegocio({
        id: crypto.randomUUID(),
        status: 'INTERESSADO',
        corretor: '',
        imobiliaria: '',
        contato_corretor: '',
        empreendimento: '',
        cliente1: '',
        contato_cliente: '',
        observacao: '',
        unidade: '',
        vgv_proposta: '',
        vgv_contrato: '',
        marca: 'Vanguard',
        origem: 'Imobiliária',
        responsavel: isAdmin ? 'Douglas Gonçalves - POA' : gpiName
      });
    }
    setModalOpen(true);
  };

  const findOriginalCorretor = async (name) => {
    if (!name) return;
    try {
      const { data } = await supabase
        .from('corretores')
        .select('*')
        .eq('nome', name.trim().toUpperCase())
        .limit(1);
      
      if (data && data.length > 0) {
        setSelectedCorretor(data[0]);
      } else {
        setSelectedCorretor(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveNegocio = async () => {
    if (!currentNegocio) return;
    
    // Validações obrigatórias por etapa
    if (!currentNegocio.corretor || !currentNegocio.imobiliaria || !currentNegocio.contato_corretor || !currentNegocio.empreendimento) {
      alert("Para um novo interessado, é obrigatório: Corretor, Imobiliária, Contato do Corretor e Empreendimento.");
      return;
    }

    if (currentNegocio.status === 'AGENDAMENTO' && !currentNegocio.cliente1) {
      alert("Para Agendamento, o Nome do Cliente é obrigatório.");
      return;
    }

    if (currentNegocio.status === 'ATENDIMENTO' && (!currentNegocio.observacao || !currentNegocio.unidade)) {
      alert("Para Atendimento, a Observação e a Unidade são obrigatórias.");
      return;
    }

    try {
      // Sincronizar corretor na base public.corretores
      if (selectedCorretor) {
        const nameChanged = currentNegocio.corretor.trim().toUpperCase() !== selectedCorretor.nome.toUpperCase();
        const phoneChanged = currentNegocio.contato_corretor.trim() !== selectedCorretor.telefone;
        
        if (nameChanged || phoneChanged) {
          const { error: updateCorrErr } = await supabase
            .from('corretores')
            .update({
              nome: currentNegocio.corretor.trim().toUpperCase(),
              telefone: currentNegocio.contato_corretor.trim()
            })
            .eq('id', selectedCorretor.id);
            
          if (updateCorrErr) {
            console.error("Erro ao atualizar corretor na base:", updateCorrErr);
          }
        }
      } else {
        // Fallback: busca corretor idêntico e atualiza
        const { data: foundCorretores } = await supabase
          .from('corretores')
          .select('id, nome, telefone')
          .eq('nome', currentNegocio.corretor.trim().toUpperCase())
          .limit(1);

        if (foundCorretores && foundCorretores.length > 0) {
          const found = foundCorretores[0];
          if (currentNegocio.contato_corretor.trim() !== found.telefone) {
            await supabase
              .from('corretores')
              .update({ telefone: currentNegocio.contato_corretor.trim() })
              .eq('id', found.id);
          }
        }
      }
      // Registrar logica de Funil (Etapas intermediarias)
      const STAGES = ['INTERESSADO', 'AGENDAMENTO', 'ATENDIMENTO', 'PROPOSTA', 'VENDA'];
      const original = negocios.find(n => n.id === currentNegocio.id);
      const oldStatusIdx = original ? STAGES.indexOf(original.status) : -1;
      const newStatusIdx = STAGES.indexOf(currentNegocio.status);
      
      const funnelInserts = [];
      if (newStatusIdx > oldStatusIdx) {
        // Insere as etapas puladas e a etapa atual
        for (let i = oldStatusIdx + 1; i <= newStatusIdx; i++) {
          funnelInserts.push({
            id: crypto.randomUUID(),
            data: new Date().toISOString().split('T')[0],
            papel: 'GPI',
            pessoa: user?.email || 'anon',
            etapa: STAGES[i],
            qtd: 1,
            obs: `Avanço automático CRM (ID: ${currentNegocio.id})`,
            ref: currentNegocio.id
          });
        }
      }

      const { data, error } = await supabase
        .from('negocios')
        .upsert({
          id: currentNegocio.id,
          status: currentNegocio.status,
          corretor: currentNegocio.corretor,
          imobiliaria: currentNegocio.imobiliaria,
          contato_corretor: currentNegocio.contato_corretor,
          empreendimento: currentNegocio.empreendimento,
          cliente1: currentNegocio.cliente1,
          contato_cliente: currentNegocio.contato_cliente,
          observacao: currentNegocio.observacao,
          unidade: currentNegocio.unidade,
          vgv_proposta: currentNegocio.vgv_proposta || null,
          vgv_contrato: currentNegocio.vgv_contrato || null,
          marca: currentNegocio.marca,
          origem: currentNegocio.origem,
          responsavel: currentNegocio.responsavel || (isAdmin ? 'Douglas Gonçalves - POA' : gpiName),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      // Inserir logs de funil em batch
      if (funnelInserts.length > 0) {
        await supabase.from('funil').insert(funnelInserts);
      }
      
      // Registrar Contato Efetivo na edição
      await supabase.from('contatos_efetivos').insert({
        gpi_id: user?.id || 'anon',
        tipo: 'EDICAO_NEGOCIO',
        ref_id: currentNegocio.id
      });

      setModalOpen(false);
      fetchNegocios();
    } catch (err) {
      console.error("Erro ao salvar negócio:", err);
      alert("Erro ao salvar.");
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Negócios</h1>
          <p className="text-slate-400 mt-1">Gestão de Funil do Corretor</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <Plus size={18} /> Novo Negócio
        </button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
          {COLUMNS.map(col => (
            <div key={col.id} className="w-80 flex flex-col bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
              <div className={`p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900`}>
                <h3 className="font-bold text-slate-200">{col.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-bold border ${col.color}`}>
                  {negocios.filter(n => n.status === col.id).length}
                </span>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                {loading ? (
                   <p className="text-slate-500 text-sm text-center py-4">Carregando...</p>
                ) : negocios.filter(n => n.status === col.id).map(negocio => {
                  const isLocked = !!negocio.contato_cliente;
                  return (
                    <div 
                      key={negocio.id}
                      onClick={() => handleOpenModal(negocio)}
                      className={`bg-slate-800 border ${isLocked ? 'border-slate-700 opacity-70' : 'border-slate-700 hover:border-slate-500'} p-4 rounded-lg cursor-pointer transition-colors group relative`}
                    >
                      {isLocked && (
                        <div className="absolute top-3 right-3 text-slate-500" title="Gerido no CRM Externo">
                          <Lock size={14} />
                        </div>
                      )}
                      <div className="text-sm font-bold text-slate-200 mb-1 pr-6 truncate">
                        {negocio.empreendimento || 'Sem Empreendimento'}
                      </div>
                      <div className="text-xs text-indigo-400 font-medium mb-3 flex items-center gap-1 truncate">
                        <User size={12} /> {negocio.corretor || 'Corretor N/A'} • {negocio.imobiliaria || 'Imob N/A'}
                      </div>
                      
                      {negocio.cliente1 && (
                        <div className="text-xs text-slate-400 mb-2 truncate">
                          <span className="text-slate-500">Cliente:</span> {negocio.cliente1}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
                        <span className="text-xs font-medium text-slate-500 bg-slate-900 px-2 py-1 rounded">
                          {negocio.marca}
                        </span>
                        {!isLocked && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                            <Edit2 size={14} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && currentNegocio && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
              <h3 className="text-lg font-bold text-slate-100">
                {currentNegocio.id ? 'Editar Negócio' : 'Novo Negócio'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
              
              {/* STATUS & ORIGEM */}
              <div className={`grid ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Etapa no Funil</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 font-semibold"
                    value={currentNegocio.status}
                    onChange={e => setCurrentNegocio({...currentNegocio, status: e.target.value})}
                  >
                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Origem</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 font-semibold"
                    value={currentNegocio.origem || 'Imobiliária'}
                    onChange={e => setCurrentNegocio({...currentNegocio, origem: e.target.value})}
                  >
                    <option>Site</option>
                    <option>Prospecção Ativa</option>
                    <option>Evento</option>
                    <option>Central</option>
                    <option>Plantão Externo</option>
                    <option>Ativação</option>
                    <option>Imobiliária</option>
                  </select>
                </div>
                {isAdmin && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">GPI Responsável *</label>
                    <select 
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 font-semibold"
                      value={currentNegocio.responsavel || 'Douglas Gonçalves - POA'}
                      onChange={e => setCurrentNegocio({...currentNegocio, responsavel: e.target.value})}
                    >
                      {GPIS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <hr className="border-slate-800" />

              {/* DADOS DO CORRETOR */}
              <div>
                <h4 className="text-sm font-bold text-indigo-400 mb-3">Dados do Corretor (Obrigatórios)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Nome do Corretor</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" 
                      value={currentNegocio.corretor} 
                      onChange={e => handleCorretorChange(e.target.value)} 
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="Digite para buscar..."
                    />
                    
                    {showSuggestions && suggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-slate-950 border border-slate-800 rounded-lg shadow-xl z-50 divide-y divide-slate-800/50 custom-scrollbar">
                        {suggestions.map(s => (
                          <li
                            key={s.id}
                            onClick={() => handleSelectCorretor(s)}
                            className="px-3 py-2 hover:bg-indigo-600/20 cursor-pointer text-xs transition-colors flex justify-between items-center"
                          >
                            <div className="text-left">
                              <span className="font-bold text-slate-200">{s.nome}</span>
                              <span className="text-slate-400 block text-[10px]">{s.imobiliaria}</span>
                            </div>
                            <div className="text-right text-[10px] text-slate-500 shrink-0 pl-2">
                              <span>{s.telefone}</span>
                              <span className="block text-indigo-400 font-medium">{s.gpi_assoc === 'REDISTRIBUIR' ? 'Sem GPI' : s.gpi_assoc}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Contato (Telefone)</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" 
                      value={currentNegocio.contato_corretor} onChange={e => setCurrentNegocio({...currentNegocio, contato_corretor: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Imobiliária</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" 
                      value={currentNegocio.imobiliaria} onChange={e => setCurrentNegocio({...currentNegocio, imobiliaria: e.target.value})} />
                  </div>
                </div>
              </div>

              <hr className="border-slate-800" />

              {/* DADOS DO EMPREENDIMENTO */}
              <div>
                <h4 className="text-sm font-bold text-indigo-400 mb-3">Interesse</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Marca</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500"
                      value={currentNegocio.marca || 'Vanguard'} onChange={e => setCurrentNegocio({...currentNegocio, marca: e.target.value})}>
                      <option>Vanguard</option>
                      <option>Plaenge</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Empreendimento (Obrigatório)</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" 
                      value={currentNegocio.empreendimento} onChange={e => setCurrentNegocio({...currentNegocio, empreendimento: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Unidade (Obrigatório no Atendimento)</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" 
                      value={currentNegocio.unidade || ''} onChange={e => setCurrentNegocio({...currentNegocio, unidade: e.target.value})} />
                  </div>
                </div>
              </div>

              <hr className="border-slate-800" />

              {/* DADOS DO CLIENTE E VGV */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-indigo-400">Dados do Cliente & VGV</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Nome do Cliente (Obrigatório Agendamento)</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" 
                      value={currentNegocio.cliente1} onChange={e => setCurrentNegocio({...currentNegocio, cliente1: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-500 mb-1">Contato do Cliente (BLOQUEIA EDIÇÃO)</label>
                    <input type="text" className="w-full bg-slate-800 border border-amber-500/50 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500" 
                      placeholder="Telefone ou Email"
                      value={currentNegocio.contato_cliente || ''} onChange={e => setCurrentNegocio({...currentNegocio, contato_cliente: e.target.value})} />
                    <p className="text-[10px] text-amber-500/80 mt-1">Ao preencher, o negócio será migrado ao CRM.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">VGV Proposta</label>
                    <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" 
                      value={currentNegocio.vgv_proposta || ''} onChange={e => setCurrentNegocio({...currentNegocio, vgv_proposta: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">VGV Contrato</label>
                    <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" 
                      value={currentNegocio.vgv_contrato || ''} onChange={e => setCurrentNegocio({...currentNegocio, vgv_contrato: e.target.value})} />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Observações (Obrigatório Atendimento)</label>
                <textarea className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 min-h-[80px]" 
                  value={currentNegocio.observacao || ''} onChange={e => setCurrentNegocio({...currentNegocio, observacao: e.target.value})} />
              </div>

            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-400 font-medium hover:bg-slate-800 rounded-lg transition-colors">
                Cancelar
              </button>
              <button onClick={saveNegocio} className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                Salvar Negócio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
