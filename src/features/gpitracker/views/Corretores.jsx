import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Search, User, Users, Phone, Mail, Building2, CheckCircle, RefreshCw } from 'lucide-react';

// Helper mapping to translate corporate email to GPI Name
export function getGPIName(email) {
  if (!email) return 'REDISTRIBUIR';
  const emailLower = email.toLowerCase();
  
  const mapping = {
    'do.goncalves@vanguard.com.br': 'Douglas Gonçalves - POA',
    'douglas.goncalves@vanguard.com.br': 'Douglas Gonçalves - POA',
    'renato.santos@vanguard.com.br': 'Renato Santos - POA',
    'roberto.nishi@vanguard.com.br': 'Roberto Nishi - POA',
    'charles@vanguard.com.br': 'Charles - POA',
    'charles.poa@vanguard.com.br': 'Charles - POA',
    'raffael.vieira@vanguard.com.br': 'Raffael Vieira - POA',
    'aline.ordovas@vanguard.com.br': 'Aline Ordovas - POA',
    'rinaldo.jardim@vanguard.com.br': 'Rinaldo Jardim - POA',
    'paulo.peano@vanguard.com.br': 'Paulo Peano - POA',
    'daniel.mossatte@vanguard.com.br': 'Daniel Mossatte - POA',
  };

  if (mapping[emailLower]) return mapping[emailLower];

  for (const [key, name] of Object.entries(mapping)) {
    if (emailLower.startsWith(key.split('@')[0])) {
      return name;
    }
  }

  // Default fallback for this workspace
  return 'Douglas Gonçalves - POA';
}

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

export default function Corretores() {
  const [corretores, setCorretores] = useState([]);
  const [imobiliarias, setImobiliarias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('minha-carteira'); // minha-carteira | sem-gpi
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGPI, setSelectedGPI] = useState('Todos');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCorretor, setNewCorretor] = useState({
    nome: '',
    telefone: '',
    email: '',
    imobiliaria: '',
    novaImobiliaria: '',
    criarNovaImob: false,
    gpi_assoc: 'Douglas Gonçalves - POA'
  });

  const [user, setUser] = useState(null);
  const [gpiName, setGpiName] = useState('Douglas Gonçalves - POA');

  const isAdmin = user?.email?.toLowerCase() === 'do.goncalves@vanguard.com.br' || 
                  user?.email?.toLowerCase() === 'douglas.goncalves@vanguard.com.br';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setGpiName(getGPIName(session.user.email));
      }
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch corretores
      const { data: corrData, error: corrErr } = await supabase
        .from('corretores')
        .select('*')
        .order('nome', { ascending: true });

      if (corrErr) throw corrErr;
      setCorretores(corrData || []);

      // Fetch imobiliarias (for select options)
      const { data: imobData, error: imobErr } = await supabase
        .from('imobiliarias')
        .select('nome')
        .order('nome', { ascending: true });

      if (imobErr) throw imobErr;
      
      // Get unique imob names
      const uniqueImobNames = Array.from(new Set(imobData?.map(i => i.nome) || []));
      setImobiliarias(uniqueImobNames);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reivindicar corretor órfão
  const handleClaimCorretor = async (id, name) => {
    try {
      const { error } = await supabase
        .from('corretores')
        .update({ gpi_assoc: gpiName })
        .eq('id', id);

      if (error) throw error;

      // Update local state to give instant feedback
      setCorretores(prev => 
        prev.map(c => c.id === id ? { ...c, gpi_assoc: gpiName } : c)
      );

      alert(`Sucesso! O corretor ${name} foi adicionado à sua carteira.`);
    } catch (err) {
      console.error("Erro ao reivindicar corretor:", err);
      alert("Erro ao reivindicar corretor.");
    }
  };

  // Salvar novo corretor
  const handleSaveCorretor = async (e) => {
    e.preventDefault();
    if (!newCorretor.nome || !newCorretor.telefone) {
      alert("Nome e Telefone são obrigatórios.");
      return;
    }

    let finalImob = newCorretor.imobiliaria;
    if (newCorretor.criarNovaImob) {
      if (!newCorretor.novaImobiliaria.trim()) {
        alert("Digite o nome da nova imobiliária.");
        return;
      }
      finalImob = newCorretor.novaImobiliaria.trim().toUpperCase();
    }

    if (!finalImob) {
      alert("Selecione ou crie uma Imobiliária.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Se for cadastrar nova imobiliária, insere no Supabase primeiro
      if (newCorretor.criarNovaImob) {
        const { error: newImobErr } = await supabase
          .from('imobiliarias')
          .insert({
            id: crypto.randomUUID(),
            nome: finalImob,
            lat: -30.0346, // Default Porto Alegre coords
            lng: -51.2177,
            endereco: 'Novo endereço cadastrado'
          });

        if (newImobErr) {
          // If it already exists (duplicate name on conflict or similar), we continue
          console.warn("Imobiliária já existe ou erro ao inserir:", newImobErr);
        }
      }

      // 2. Inserir corretor
      const { error: corrErr } = await supabase
        .from('corretores')
        .insert({
          id: `corr-${crypto.randomUUID()}`,
          nome: newCorretor.nome.trim().toUpperCase(),
          telefone: newCorretor.telefone.trim(),
          email: newCorretor.email.trim() || null,
          imobiliaria: finalImob,
          gpi_assoc: isAdmin ? (newCorretor.gpi_assoc || 'Douglas Gonçalves - POA') : gpiName
        });

      if (corrErr) throw corrErr;

      // Reset state and modal
      setNewCorretor({
        nome: '',
        telefone: '',
        email: '',
        imobiliaria: '',
        novaImobiliaria: '',
        criarNovaImob: false,
        gpi_assoc: 'Douglas Gonçalves - POA'
      });
      setModalOpen(false);

      // Reload
      await fetchData();

      alert("Corretor cadastrado com sucesso e associado à sua carteira!");
    } catch (err) {
      console.error("Erro ao cadastrar corretor:", err);
      alert("Erro ao cadastrar corretor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtragem dos corretores
  const myCorretores = isAdmin
    ? (selectedGPI === 'Todos'
        ? corretores.filter(c => c.gpi_assoc !== 'REDISTRIBUIR')
        : corretores.filter(c => c.gpi_assoc === selectedGPI))
    : corretores.filter(c => c.gpi_assoc === gpiName);
  const orphanCorretores = corretores.filter(c => c.gpi_assoc === 'REDISTRIBUIR');

  const filteredList = (activeTab === 'minha-carteira' ? myCorretores : orphanCorretores)
    .filter(c => {
      const term = searchQuery.toLowerCase();
      return (
        c.nome.toLowerCase().includes(term) ||
        (c.imobiliaria || '').toLowerCase().includes(term) ||
        (c.telefone || '').includes(term) ||
        (c.email || '').toLowerCase().includes(term)
      );
    });

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="text-indigo-400" /> Carteira de Corretores
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {isAdmin ? 'Visualização administrativa completa de corretores e carteiras' : `Gestão de corretores vinculados a você (${gpiName})`}
          </p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium self-end md:self-auto shadow-lg shadow-indigo-600/10"
        >
          <Plus size={18} /> Novo Corretor
        </button>
      </div>

      {/* Tabs and Actions bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Navigation Tabs */}
        <div className="flex p-1 bg-slate-950 rounded-lg w-full md:w-auto">
          <button
            onClick={() => setActiveTab('minha-carteira')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'minha-carteira'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User size={16} /> {isAdmin ? 'Carteiras de Corretores' : 'Minha Carteira'} ({myCorretores.length})
          </button>
          <button
            onClick={() => setActiveTab('sem-gpi')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'sem-gpi'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users size={16} /> Sem GPI (Redistribuir) ({orphanCorretores.length})
          </button>
        </div>

        {/* Search & Refresh & GPI Filter */}
        <div className="flex items-center gap-3">
          {isAdmin && activeTab === 'minha-carteira' && (
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg shadow-inner shrink-0">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">GPI:</span>
              <select
                value={selectedGPI}
                onChange={e => setSelectedGPI(e.target.value)}
                className="bg-slate-950 border-none rounded text-xs px-2 py-0.5 text-white outline-none focus:border-indigo-500 font-bold transition-all cursor-pointer"
              >
                <option value="Todos">Todos os GPIs</option>
                {GPIS.map(gpi => (
                  <option key={gpi} value={gpi}>{gpi}</option>
                ))}
              </select>
            </div>
          )}

          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome, imobiliária, contato..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none transition-colors"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchData}
            title="Atualizar dados"
            className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin text-indigo-400' : ''} />
          </button>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="animate-spin text-indigo-500" size={32} />
            <span className="text-slate-400 text-sm">Carregando corretores...</span>
          </div>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="flex-1 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <Users className="text-slate-600 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-300">Nenhum corretor encontrado</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-md">
            {searchQuery 
              ? 'Tente ajustar os filtros de busca para encontrar o que procura.' 
              : activeTab === 'minha-carteira' 
                ? 'Você ainda não possui corretores na sua carteira. Registre um corretor ou reivindique um na aba "Sem GPI".'
                : 'Não há corretores órfãos aguardando redistribuição.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map(corretor => (
            <div 
              key={corretor.id} 
              className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group bg-gradient-to-br from-slate-900 to-slate-900/60 shadow-lg"
            >
              <div>
                {/* Header card */}
                <div className="flex justify-between items-start mb-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                    {corretor.nome.substring(0, 2).toUpperCase()}
                  </div>
                  
                  {corretor.gpi_assoc === 'REDISTRIBUIR' ? (
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold px-2 py-0.5 rounded-full">
                      Sem GPI
                    </span>
                  ) : (
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold px-2 py-0.5 rounded-full truncate max-w-[120px]" title={corretor.gpi_assoc}>
                      {corretor.gpi_assoc}
                    </span>
                  )}
                </div>

                {/* Body info */}
                <h3 className="text-md font-bold text-slate-100 mb-1 group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {corretor.nome}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 truncate">
                  <Building2 size={13} className="text-slate-500 shrink-0" />
                  <span className="font-semibold text-slate-300">{corretor.imobiliaria || 'Sem Imobiliária'}</span>
                </div>

                <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-800/50">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Phone size={13} className="text-slate-500 shrink-0" />
                    <span>{corretor.telefone || 'N/A'}</span>
                  </div>
                  {corretor.email && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 truncate" title={corretor.email}>
                      <Mail size={13} className="text-slate-500 shrink-0" />
                      <span className="truncate">{corretor.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions footer */}
              {activeTab === 'sem-gpi' && (
                <div className="mt-4 pt-3 border-t border-slate-800/50">
                  <button
                    onClick={() => handleClaimCorretor(corretor.id, corretor.nome)}
                    className="w-full bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={14} /> Reivindicar Corretor
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Corretor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Plus size={20} className="text-indigo-400" /> Cadastrar Corretor
              </h3>
              <button 
                onClick={() => setModalOpen(false)} 
                className="text-slate-400 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveCorretor}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                {/* Nome */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nome do Corretor *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: JOÃO DA SILVA"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-3 py-2 text-white outline-none transition-colors" 
                    value={newCorretor.nome} 
                    onChange={e => setNewCorretor({...newCorretor, nome: e.target.value})} 
                  />
                </div>

                {/* Telefone & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Contato (Telefone) *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: (51) 99999-9999"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-3 py-2 text-white outline-none transition-colors" 
                      value={newCorretor.telefone} 
                      onChange={e => setNewCorretor({...newCorretor, telefone: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">E-mail (Opcional)</label>
                    <input 
                      type="email" 
                      placeholder="Ex: joao@imobiliaria.com"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-3 py-2 text-white outline-none transition-colors" 
                      value={newCorretor.email} 
                      onChange={e => setNewCorretor({...newCorretor, email: e.target.value})} 
                    />
                  </div>
                </div>

                <hr className="border-slate-800 my-2" />

                {/* Imobiliária Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-400">Imobiliária *</label>
                    <button
                      type="button"
                      onClick={() => setNewCorretor({
                        ...newCorretor, 
                        criarNovaImob: !newCorretor.criarNovaImob,
                        imobiliaria: '',
                        novaImobiliaria: ''
                      })}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      {newCorretor.criarNovaImob ? "Selecionar Existente" : "+ Cadastrar Nova Imobiliária"}
                    </button>
                  </div>

                  {newCorretor.criarNovaImob ? (
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-indigo-500/20 space-y-2">
                      <p className="text-[10px] text-indigo-400">A nova imobiliária será cadastrada automaticamente no sistema.</p>
                      <input 
                        type="text" 
                        required
                        placeholder="Nome da Nova Imobiliária"
                        className="w-full bg-slate-950 border border-indigo-500 focus:border-indigo-400 rounded-lg px-3 py-2 text-white outline-none transition-colors" 
                        value={newCorretor.novaImobiliaria} 
                        onChange={e => setNewCorretor({...newCorretor, novaImobiliaria: e.target.value})} 
                      />
                    </div>
                  ) : (
                    <select
                      required
                      className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-3 py-2 text-white outline-none transition-colors"
                      value={newCorretor.imobiliaria}
                      onChange={e => setNewCorretor({...newCorretor, imobiliaria: e.target.value})}
                    >
                      <option value="">Selecione uma imobiliária...</option>
                      {imobiliarias.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  )}
                </div>

                {isAdmin && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">GPI Responsável *</label>
                    <select
                      required
                      className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-3 py-2 text-white outline-none transition-colors font-semibold"
                      value={newCorretor.gpi_assoc || 'Douglas Gonçalves - POA'}
                      onChange={e => setNewCorretor({...newCorretor, gpi_assoc: e.target.value})}
                    >
                      {GPIS.map(gpi => (
                        <option key={gpi} value={gpi}>{gpi}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="bg-slate-950/50 p-3.5 rounded-lg border border-slate-800">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    💡 O novo corretor será associado a <strong>{isAdmin ? (newCorretor.gpi_assoc || 'Douglas Gonçalves - POA') : gpiName}</strong> para gerenciamento.
                  </p>
                </div>

              </div>

              <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)} 
                  className="px-4 py-2 text-slate-400 font-semibold hover:bg-slate-800 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar Corretor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
