import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Users, 
  MapPin, 
  Award, 
  ArrowRight, 
  Building, 
  CheckCircle2, 
  ChevronRight, 
  Activity, 
  Percent, 
  Sparkles, 
  RefreshCw,
  FolderOpen,
  Filter,
  BarChart3
} from 'lucide-react';

// Helper mapping to translate corporate email to GPI Name
function getGPIName(email) {
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

const GPI_EMAILS = {
  'Douglas Gonçalves - POA': 'do.goncalves@vanguard.com.br',
  'Renato Santos - POA': 'renato.santos@vanguard.com.br',
  'Roberto Nishi - POA': 'roberto.nishi@vanguard.com.br',
  'Charles - POA': 'charles@vanguard.com.br',
  'Raffael Vieira - POA': 'raffael.vieira@vanguard.com.br',
  'Aline Ordovas - POA': 'aline.ordovas@vanguard.com.br',
  'Rinaldo Jardim - POA': 'rinaldo.jardim@vanguard.com.br',
  'Paulo Peano - POA': 'paulo.peano@vanguard.com.br',
  'Daniel Mossatte - POA': 'daniel.mossatte@vanguard.com.br'
};

export default function Dashboard({ user }) {
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [filterOwn, setFilterOwn] = useState(false);
  const [selectedGPI, setSelectedGPI] = useState('Todos');

  // States para dados
  const [negocios, setNegocios] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [treinamentos, setTreinamentos] = useState([]);

  useEffect(() => {
    if (user) {
      fetchData();
    }

    // Inscrição em tempo real para sincronização automática
    const channel = supabase
      .channel('dashboard_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'negocios' }, () => {
        if (user) fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visitas' }, () => {
        if (user) fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'treinamentos' }, () => {
        if (user) fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: nData, error: nErr } = await supabase.from('negocios').select('*');
      if (nErr) throw nErr;

      const { data: vData, error: vErr } = await supabase.from('visitas').select('*');
      if (vErr) throw vErr;

      const { data: tData, error: tErr } = await supabase.from('treinamentos').select('*');
      if (tErr) throw tErr;

      setNegocios(nData || []);
      setVisitas(vData || []);
      setTreinamentos(tData || []);
    } catch (err) {
      console.error("Erro ao buscar dados do Supabase:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const gpiEmail = user?.email || 'gpi@vanguard.com.br';
      const gpiId = user?.id || 'anon';
      const today = new Date().toISOString().split('T')[0];
      
      const getPastDateStr = (daysAgo) => {
        return new Date(Date.now() - 86400000 * daysAgo).toISOString().split('T')[0];
      };

      // 1. Seed Visitas
      const { error: errV } = await supabase.from('visitas').insert([
        {
          id: crypto.randomUUID(),
          data: getPastDateStr(1),
          hora: '14:30',
          gpi: gpiEmail,
          imobiliaria: 'Lopes Inteligência',
          corretores_impactados: 8,
          tipo: 'Relacionamento',
          obs: 'Apresentação das novidades do decorado da Vanguard. Excelente receptividade.',
          criado_por: gpiId
        },
        {
          id: crypto.randomUUID(),
          data: getPastDateStr(5),
          hora: '10:00',
          gpi: gpiEmail,
          imobiliaria: 'Fênix Imóveis',
          corretores_impactados: 12,
          tipo: 'Apresentação MKT',
          obs: 'Alinhamento estratégico sobre as vagas e exclusividade na campanha.',
          criado_por: gpiId
        },
        {
          id: crypto.randomUUID(),
          data: getPastDateStr(10),
          hora: '16:00',
          gpi: 'gpi_sul@vanguard.com.br',
          imobiliaria: 'Imobiliária Sul',
          corretores_impactados: 5,
          tipo: 'Campanha / Ação',
          obs: 'Entrega de brindes e panfletagem técnica.',
          criado_por: 'gpi-sul-id'
        }
      ]);
      if (errV) throw errV;

      // 2. Seed Treinamentos
      const { error: errT } = await supabase.from('treinamentos').insert([
        {
          id: crypto.randomUUID(),
          data: getPastDateStr(-2), // 2 dias no futuro
          hora: '09:00',
          gpi: gpiEmail,
          imobiliaria: 'Lopes Inteligência',
          obs: 'Treinamento de produto: Lançamento Garden Vanguard.',
          status: 'pendente',
          corretores_participaram: 0,
          criado_por: gpiId
        },
        {
          id: crypto.randomUUID(),
          data: getPastDateStr(4),
          hora: '08:30',
          gpi: gpiEmail,
          imobiliaria: 'Imobiliária Parceria',
          obs: 'Conceito Plaenge e portfólio de alto padrão.',
          status: 'concluido',
          corretores_participaram: 15,
          criado_por: gpiId
        }
      ]);
      if (errT) throw errT;

      // 3. Seed Negocios
      const { error: errN } = await supabase.from('negocios').insert([
        {
          id: crypto.randomUUID(),
          status: 'VENDA',
          corretor: 'Carlos Silva',
          imobiliaria: 'Lopes Inteligência',
          contato_corretor: '(41) 99999-1111',
          empreendimento: 'Garden Vanguard',
          cliente1: 'Mariana Costa',
          contato_cliente: 'mariana@email.com',
          observacao: 'Contrato assinado! Venda concluída e repasse aprovado.',
          unidade: '1402-A',
          vgv_proposta: 850000,
          vgv_contrato: 850000,
          marca: 'Vanguard',
          origem: 'Imobiliária',
          criado_por: gpiId
        },
        {
          id: crypto.randomUUID(),
          status: 'PROPOSTA',
          corretor: 'Renata Souza',
          imobiliaria: 'Fênix Imóveis',
          contato_corretor: '(41) 98888-2222',
          empreendimento: 'Plaenge Elegance',
          cliente1: 'Roberto Junqueira',
          contato_cliente: 'roberto@email.com',
          observacao: 'Proposta na mesa da diretoria, aguardando aprovação do fluxo de pagamento.',
          unidade: '302',
          vgv_proposta: 1200000,
          marca: 'Plaenge',
          origem: 'Evento',
          criado_por: gpiId
        },
        {
          id: crypto.randomUUID(),
          status: 'ATENDIMENTO',
          corretor: 'Fernanda Lima',
          imobiliaria: 'Imobiliária Parceria',
          contato_corretor: '(41) 97777-3333',
          empreendimento: 'City Vanguard',
          cliente1: 'Bruno Oliveira',
          observacao: 'Cliente visitou o apartamento decorado. Ficou encantado com a sacada.',
          unidade: '704',
          marca: 'Vanguard',
          origem: 'Prospecção Ativa',
          criado_por: gpiId
        },
        {
          id: crypto.randomUUID(),
          status: 'INTERESSADO',
          corretor: 'Carlos Silva',
          imobiliaria: 'Lopes Inteligência',
          contato_corretor: '(41) 99999-1111',
          empreendimento: 'Garden Vanguard',
          cliente1: 'Alice Santos',
          observacao: 'Interessada na planta de 3 dormitórios. Agendando visita.',
          marca: 'Vanguard',
          origem: 'Imobiliária',
          criado_por: gpiId
        }
      ]);
      if (errN) throw errN;

      alert("Dados simulados criados com sucesso! O painel irá se atualizar.");
      fetchData();
    } catch (err) {
      console.error("Erro ao rodar seed:", err);
      alert("Erro ao simular dados: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const gpiName = getGPIName(user?.email);
  const isAdmin = user?.email?.toLowerCase() === 'do.goncalves@vanguard.com.br' || 
                  user?.email?.toLowerCase() === 'douglas.goncalves@vanguard.com.br';

  let activeGPIFilter = 'Todos';
  if (isAdmin) {
    activeGPIFilter = selectedGPI;
  } else if (filterOwn) {
    activeGPIFilter = gpiName;
  }

  // Filtragem dos dados
  const filteredNegocios = activeGPIFilter === 'Todos'
    ? negocios
    : negocios.filter(n => n.responsavel === activeGPIFilter);

  const selectedEmail = GPI_EMAILS[activeGPIFilter];
  const filteredVisitas = activeGPIFilter === 'Todos'
    ? visitas
    : visitas.filter(v => v.gpi?.toLowerCase() === selectedEmail?.toLowerCase() || v.gpi?.toLowerCase() === user?.email?.toLowerCase());

  const filteredTreinamentos = activeGPIFilter === 'Todos'
    ? treinamentos
    : treinamentos.filter(t => t.gpi?.toLowerCase() === selectedEmail?.toLowerCase() || t.gpi?.toLowerCase() === user?.email?.toLowerCase());

  // CÁLCULOS DOS INDICADORES (KPIs)
  
  // 1. VGV Vendido (soma vgv_contrato de negocios com status = 'VENDA')
  const totalVGVVendido = filteredNegocios
    .filter(n => n.status === 'VENDA')
    .reduce((sum, n) => sum + Number(n.vgv_contrato || n.vgv_proposta || 0), 0);

  // Vendas este mês
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const vendasEsteMes = filteredNegocios.filter(n => {
    if (n.status !== 'VENDA') return false;
    const d = n.updated_at ? new Date(n.updated_at) : new Date(n.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  
  const totalVendasEsteMesVal = vendasEsteMes.reduce((sum, n) => sum + Number(n.vgv_contrato || n.vgv_proposta || 0), 0);

  // 2. Visitas
  const totalVisitas = filteredVisitas.length;
  const corretoresImpactados = filteredVisitas.reduce((sum, v) => sum + Number(v.corretores_impactados || 0), 0);

  // 3. Negócios em Fluxo
  const activeNegocios = filteredNegocios.filter(n => n.status !== 'VENDA');
  const totalActiveDeals = activeNegocios.length;
  const vgvEmFluxo = activeNegocios.reduce((sum, n) => sum + Number(n.vgv_proposta || 0), 0);

  // 4. Treinamentos Realizados
  const treinamentosConcluidos = filteredTreinamentos.filter(t => t.status === 'concluido');
  const totalTreinamentos = treinamentosConcluidos.length;
  const totalCorretoresTreinados = treinamentosConcluidos.reduce((sum, t) => sum + Number(t.corretores_participaram || 0), 0);

  // FUNIL CUMULATIVO
  // Um negócio em 'VENDA' passou por todas as etapas anteriores.
  // Um negócio em 'PROPOSTA' passou por INTERESSADO, AGENDAMENTO, ATENDIMENTO, PROPOSTA.
  const STAGES = ['INTERESSADO', 'AGENDAMENTO', 'ATENDIMENTO', 'PROPOSTA', 'VENDA'];
  
  const funnelCumulative = {
    INTERESSADO: 0,
    AGENDAMENTO: 0,
    ATENDIMENTO: 0,
    PROPOSTA: 0,
    VENDA: 0
  };

  filteredNegocios.forEach(n => {
    const idx = STAGES.indexOf(n.status);
    if (idx !== -1) {
      for (let i = 0; i <= idx; i++) {
        funnelCumulative[STAGES[i]]++;
      }
    }
  });

  // FORMATADORES
  const formatBRL = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  // DISTRIBUIÇÃO POR MARCA
  const brandData = filteredNegocios.reduce((acc, n) => {
    const brand = n.marca || 'Vanguard';
    const val = Number(n.vgv_contrato || n.vgv_proposta || 0);
    acc[brand].count++;
    acc[brand].vgv += val;
    return acc;
  }, { Vanguard: { count: 0, vgv: 0 }, Plaenge: { count: 0, vgv: 0 } });

  const totalDeals = filteredNegocios.length;
  const vanguardPercent = totalDeals > 0 ? Math.round((brandData.Vanguard.count / totalDeals) * 100) : 0;
  const plaengePercent = totalDeals > 0 ? Math.round((brandData.Plaenge.count / totalDeals) * 100) : 0;

  // LEADERBOARD DE IMOBILIÁRIAS
  const imobStats = filteredNegocios.reduce((acc, n) => {
    const imob = n.imobiliaria || 'Sem Imobiliária';
    const val = Number(n.vgv_contrato || n.vgv_proposta || 0);
    if (!acc[imob]) {
      acc[imob] = { name: imob, count: 0, vgv: 0 };
    }
    acc[imob].count++;
    acc[imob].vgv += val;
    return acc;
  }, {});

  const topImobiliarias = Object.values(imobStats)
    .sort((a, b) => b.vgv - a.vgv || b.count - a.count)
    .slice(0, 4);

  // RANKING DE VENDAS DOS GPIS (Visível para todos, global/sem filtro)
  const gpiSalesRanking = negocios
    .filter(n => n.status === 'VENDA')
    .reduce((acc, n) => {
      const gpi = n.responsavel || 'Sem Responsável';
      const val = Number(n.vgv_contrato || n.vgv_proposta || 0);
      if (!acc[gpi]) {
        acc[gpi] = { name: gpi, count: 0, vgv: 0 };
      }
      acc[gpi].count++;
      acc[gpi].vgv += val;
      return acc;
    }, {});

  const sortedGpiRanking = Object.values(gpiSalesRanking)
    .sort((a, b) => b.vgv - a.vgv || b.count - a.count);

  // VGV POR EMPREENDIMENTO (Dinâmico, respeita activeGPIFilter)
  const projectSales = filteredNegocios
    .filter(n => n.status === 'VENDA')
    .reduce((acc, n) => {
      const proj = n.empreendimento || 'Sem Empreendimento';
      const val = Number(n.vgv_contrato || n.vgv_proposta || 0);
      if (!acc[proj]) {
        acc[proj] = { name: proj, count: 0, vgv: 0 };
      }
      acc[proj].count++;
      acc[proj].vgv += val;
      return acc;
    }, {});

  const sortedProjectSales = Object.values(projectSales)
    .sort((a, b) => b.vgv - a.vgv)
    .slice(0, 5);

  const totalProjectsVGV = Object.values(projectSales).reduce((sum, p) => sum + p.vgv, 0);
  const totalProjectsCount = Object.values(projectSales).reduce((sum, p) => sum + p.count, 0);

  // ATIVIDADES RECENTES
  const recentVisitas = [...filteredVisitas]
    .sort((a, b) => {
      const dateA = new Date(a.created_at || a.data);
      const dateB = new Date(b.created_at || b.data);
      const diff = dateB - dateA;
      if (diff === 0) return a.id > b.id ? 1 : -1;
      return diff;
    })
    .slice(0, 4);

  const recentNegocios = [...filteredNegocios]
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at);
      const dateB = new Date(b.updated_at || b.created_at);
      const diff = dateB - dateA;
      if (diff === 0) return a.id > b.id ? 1 : -1;
      return diff;
    })
    .slice(0, 4);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="text-indigo-500 animate-spin" size={32} />
        <p className="text-slate-400 font-medium text-sm">Carregando painel relacional...</p>
      </div>
    );
  }

  // Verifica se o banco de dados está totalmente vazio para sugerir dados simulados
  const isDatabaseEmpty = negocios.length === 0 && visitas.length === 0 && treinamentos.length === 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER & FILTROS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            📊 Dashboard Executivo
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Visão consolidada de metas de funil, vendas e atividades comerciais.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Botão de simulação de dados */}
          {isDatabaseEmpty && (
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-950/40"
            >
              <Sparkles size={16} className={seeding ? "animate-pulse" : ""} />
              {seeding ? "Simulando..." : "Simular Dados de Teste"}
            </button>
          )}

          {/* Filtro para Admin vs GPI Normal */}
          {isAdmin ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Filtrar GPI:</span>
              <select
                value={selectedGPI}
                onChange={e => setSelectedGPI(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg text-xs px-2.5 py-1 text-white outline-none focus:border-indigo-500 font-bold transition-all"
              >
                <option value="Todos">Todos os GPIs</option>
                {GPIS.map(gpi => (
                  <option key={gpi} value={gpi}>{gpi}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl flex items-center shadow-inner">
              <button
                onClick={() => setFilterOwn(false)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  !filterOwn 
                    ? 'bg-slate-800 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setFilterOwn(true)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  filterOwn 
                    ? 'bg-slate-800 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Minha Carteira
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AVISO DE DADOS VAZIOS */}
      {isDatabaseEmpty && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 text-center shadow-xl">
          <Sparkles className="text-indigo-400 mx-auto mb-3 animate-bounce" size={32} />
          <h3 className="text-lg font-bold text-white mb-1">Seu GPI Tracker está pronto!</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-4">
            No momento não há registros de visitas, treinamentos ou negócios na base. Clique no botão de simulação para popular com dados fictícios ultra-realistas e ver o dashboard ganhar vida!
          </p>
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/10"
          >
            {seeding ? "Gerando dados..." : "Simular Dados Fictícios"}
          </button>
        </div>
      )}

      {/* CARDS DE INDICADORES (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* VGV VENDIDO */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">VGV Vendido</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white leading-none">{formatBRL(totalVGVVendido)}</div>
            <div className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
              <TrendingUp size={12} />
              <span>{vendasEsteMes.length} {vendasEsteMes.length === 1 ? 'venda' : 'vendas'} · Este mês</span>
            </div>
          </div>
        </div>

        {/* NEGÓCIOS EM FLUXO */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Negócios em Fluxo</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Activity size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white leading-none">{totalActiveDeals}</div>
            <div className="text-xs text-amber-400 font-semibold mt-2 flex items-center gap-1">
              <span>{formatBRL(vgvEmFluxo)} em VGV estimado</span>
            </div>
          </div>
        </div>

        {/* VISITAS GPIS */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visitas Realizadas</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <MapPin size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white leading-none">{totalVisitas}</div>
            <div className="text-xs text-indigo-400 font-semibold mt-2 flex items-center gap-1">
              <span>{corretoresImpactados} corretores impactados</span>
            </div>
          </div>
        </div>

        {/* TREINAMENTOS */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Treinamentos</span>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Award size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white leading-none">{totalTreinamentos}</div>
            <div className="text-xs text-violet-400 font-semibold mt-2 flex items-center gap-1">
              <span>{totalCorretoresTreinados} corretores capacitados</span>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD PRINCIPAL: FUNIL & BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* FUNIL DE VENDAS (7 Colunas no LG) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 size={18} className="text-indigo-400" />
                Funil de Vendas Acumulado
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Volume de negócios que atingiram ou ultrapassaram cada etapa.</p>
            </div>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center py-2">
            {STAGES.map((stage, idx) => {
              const count = funnelCumulative[stage];
              const maxCount = Math.max(...Object.values(funnelCumulative), 1);
              const percentage = Math.round((count / maxCount) * 100);
              
              // Cores do funil
              const colors = [
                'from-blue-600/80 to-blue-500/40 text-blue-300 border-blue-500/20',     // Interessado
                'from-purple-600/80 to-purple-500/40 text-purple-300 border-purple-500/20', // Agendamento
                'from-amber-600/80 to-amber-500/40 text-amber-300 border-amber-500/20',   // Atendimento
                'from-orange-600/80 to-orange-500/40 text-orange-300 border-orange-500/20', // Proposta
                'from-emerald-600/80 to-emerald-500/40 text-emerald-300 border-emerald-500/20' // Venda
              ];

              // Taxa de conversão da etapa anterior
              let conversionRate = null;
              if (idx > 0) {
                const prevCount = funnelCumulative[STAGES[idx - 1]];
                conversionRate = prevCount > 0 ? Math.round((count / prevCount) * 100) : 0;
              }

              return (
                <div key={stage} className="relative">
                  {/* Indicador de taxa de conversão entre etapas */}
                  {conversionRate !== null && (
                    <div className="absolute -top-3 left-[40%] transform -translate-x-1/2 z-10 flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-[10px] font-bold text-indigo-400 shadow shadow-indigo-950">
                      <Percent size={10} />
                      <span>{conversionRate}% conversão</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 group">
                    <span className="w-24 text-left text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-wider">
                      {stage === 'INTERESSADO' ? 'Interesse' : 
                       stage === 'AGENDAMENTO' ? 'Agendado' :
                       stage === 'ATENDIMENTO' ? 'Atendido' : 
                       stage === 'PROPOSTA' ? 'Proposta' : 'Venda'}
                    </span>

                    <div className="flex-1 bg-slate-950 border border-slate-850 h-10 rounded-xl overflow-hidden relative">
                      <div 
                        className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${colors[idx]} border-r border-white/10 rounded-l-xl transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-extrabold text-white">
                        <span>{count} {count === 1 ? 'negócio' : 'negócios'}</span>
                        {percentage > 0 && <span className="opacity-60">{percentage}% do topo</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PARTICIPAÇÃO POR MARCA E LIDERES (5 Colunas no LG) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* PARTICIPAÇÃO POR MARCA */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FolderOpen size={18} className="text-indigo-400" />
              Negócios por Marca
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold tracking-wider text-slate-400 uppercase">
                <span>Marca</span>
                <span>Qtd Negócios (VGV Total)</span>
              </div>

              {/* VANGUARD */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-white">Vanguard</span>
                  <span className="text-slate-300 font-medium">{brandData.Vanguard.count} negócios ({formatBRL(brandData.Vanguard.vgv)})</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${vanguardPercent}%` }}></div>
                </div>
                <div className="text-[10px] text-right text-indigo-400 font-semibold">{vanguardPercent}% de participação</div>
              </div>

              {/* PLAENGE */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-white">Plaenge</span>
                  <span className="text-slate-300 font-medium">{brandData.Plaenge.count} negócios ({formatBRL(brandData.Plaenge.vgv)})</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${plaengePercent}%` }}></div>
                </div>
                <div className="text-[10px] text-right text-amber-400 font-semibold">{plaengePercent}% de participação</div>
              </div>
            </div>
          </div>

          {/* TOP IMOBILIÁRIAS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col justify-between">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Building size={18} className="text-indigo-400" />
              Top Imobiliárias (por VGV)
            </h3>
            
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {topImobiliarias.length === 0 ? (
                <p className="text-slate-500 text-xs text-center py-4">Sem dados para classificação.</p>
              ) : (
                topImobiliarias.map((imob, index) => {
                  const medals = ['🥇', '🥈', '🥉', '🏅'];
                  return (
                    <div key={imob.name} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-850 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{medals[index] || '🏅'}</span>
                        <div>
                          <div className="text-sm font-bold text-slate-200">{imob.name}</div>
                          <div className="text-xs text-slate-400">{imob.count} {imob.count === 1 ? 'negócio' : 'negócios'}</div>
                        </div>
                      </div>
                      <div className="text-sm font-black text-indigo-400">{formatBRL(imob.vgv)}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO DE GRÁFICOS: RANKING GPIS & VGV EMPREENDIMENTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* RANKING DE VENDAS DOS GPIS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <Award size={18} className="text-indigo-400" />
            🏆 Ranking de Vendas (VGV Total)
          </h3>
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {sortedGpiRanking.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-8">Nenhuma venda registrada na base.</p>
            ) : (
              sortedGpiRanking.map((gpi, index) => {
                const medals = ['🥇', '🥈', '🥉'];
                const position = index + 1;
                return (
                  <div key={gpi.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/40 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-sm font-bold text-slate-400">
                        {medals[index] || `#${position}`}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-slate-200">{gpi.name}</div>
                        <div className="text-xs text-slate-500">{gpi.count} {gpi.count === 1 ? 'venda' : 'vendas'}</div>
                      </div>
                    </div>
                    <div className="text-sm font-black text-indigo-400">{formatBRL(gpi.vgv)}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* GRÁFICO DE BARRAS DE VGV POR EMPREENDIMENTO */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-400" />
            🏢 Desempenho por Empreendimento (VGV)
          </h3>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {sortedProjectSales.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-8">Nenhuma venda registrada para a seleção atual.</p>
            ) : (
              <>
                {/* BARRA DO TOTAL GERAL */}
                {totalProjectsVGV > 0 && (
                  <div className="space-y-1.5 pb-3 border-b border-slate-800/60 mb-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        VGV Total Geral
                      </span>
                      <span className="text-emerald-400 font-black">
                        {formatBRL(totalProjectsVGV)}{" "}
                        <span className="text-[10px] text-slate-500 font-medium">({totalProjectsCount} {totalProjectsCount === 1 ? 'venda' : 'vendas'})</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-6 rounded-lg overflow-hidden relative border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.05)]">
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-600/80 to-emerald-500/40 rounded-l-lg border-r border-white/10"
                        style={{ width: "100%" }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-end px-3 text-[10px] font-black text-white">
                        100% da Carteira
                      </div>
                    </div>
                  </div>
                )}

                {/* BARRAS DOS EMPREENDIMENTOS INDIVIDUAIS */}
                {sortedProjectSales.map((proj) => {
                  const percent = totalProjectsVGV > 0 ? Math.round((proj.vgv / totalProjectsVGV) * 100) : 0;
                  
                  return (
                    <div key={proj.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-300">{proj.name}</span>
                        <span className="font-black text-indigo-400">
                          {formatBRL(proj.vgv)}{" "}
                          <span className="text-[10px] text-slate-500 font-medium">({proj.count} {proj.count === 1 ? 'venda' : 'vendas'})</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-5 rounded-lg overflow-hidden relative border border-slate-850">
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-indigo-600/80 to-indigo-500/40 rounded-l-lg border-r border-white/10 transition-all duration-1000 ease-out"
                          style={{ width: `${percent}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-end px-3 text-[10px] font-black text-white/50">
                          {percent}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

      </div>

      {/* SEÇÃO INFERIOR: ATIVIDADES E TREINAMENTOS RECENTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ÚLTIMAS VISITAS REGISTRADAS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin size={18} className="text-indigo-400" />
              Últimas Visitas
            </h3>
            <span className="text-xs text-slate-500">Histórico Recente</span>
          </div>

          <div className="space-y-3">
            {recentVisitas.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-8 bg-slate-950/50 rounded-xl border border-slate-850">Nenhuma visita registrada recentemente.</p>
            ) : (
              recentVisitas.map(v => (
                <div key={v.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-start gap-3 hover:border-slate-700 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-sm">
                    {v.imobiliaria.substring(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-slate-200 truncate pr-2">{v.imobiliaria}</h4>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{v.data}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 italic">"{v.obs || 'Sem observações escritas...'}"</p>
                    
                    <div className="flex gap-4 text-[10px] text-slate-500 mt-2 font-medium">
                      <span>👤 {v.gpi}</span>
                      <span>📍 {v.tipo}</span>
                      <span>👥 {v.corretores_impactados} corretores</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ÚLTIMOS NEGÓCIOS ATUALIZADOS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-indigo-400" />
              Negócios Recentes
            </h3>
            <span className="text-xs text-slate-500">Kanban Atividade</span>
          </div>

          <div className="space-y-3">
            {recentNegocios.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-8 bg-slate-950/50 rounded-xl border border-slate-850">Nenhum negócio cadastrado no momento.</p>
            ) : (
              recentNegocios.map(n => {
                const stageColors = {
                  INTERESSADO: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                  AGENDAMENTO: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                  ATENDIMENTO: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  PROPOSTA: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                  VENDA: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                };

                return (
                  <div key={n.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-start gap-3 hover:border-slate-700 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold">
                      🏢
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-slate-200 truncate pr-2">
                          {n.empreendimento} <span className="text-xs font-normal text-slate-400">({n.unidade || 'N/A'})</span>
                        </h4>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${stageColors[n.status] || 'bg-slate-800'}`}>
                          {n.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">Cliente: {n.cliente1 || 'Não informado'} • Corretor: {n.corretor || 'N/A'}</p>
                      
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-900">
                        <span className="text-[10px] text-slate-500 font-medium">💼 {n.marca} ({n.origem || 'Imobiliária'})</span>
                        <span className="text-xs font-black text-indigo-400">
                          {n.status === 'VENDA' ? formatBRL(n.vgv_contrato) : formatBRL(n.vgv_proposta)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
