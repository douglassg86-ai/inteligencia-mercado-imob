import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, MousePointerSquareDashed, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from './lib/supabase';

const INITIAL_COLUMNS = [
  { "id": "c1", "title": "24/03 a 31/03", "endDate": "2026-03-31", "startDate": "2026-03-24", "highlighted": false },
  { "id": "c2", "title": "01/04 a 08/04", "endDate": "2026-04-08", "startDate": "2026-04-01", "highlighted": false },
  { "id": "c3", "title": "09/04 a 16/04", "endDate": "2026-04-16", "startDate": "2026-04-09", "highlighted": false },
  { "id": "c4", "title": "17/04 a 24/04", "endDate": "2026-04-24", "startDate": "2026-04-17", "highlighted": false },
  { "id": "c5", "title": "25/04 a 02/05", "endDate": "2026-05-02", "startDate": "2026-04-25", "highlighted": false },
  { "id": "c6", "title": "03/05 a 10/05", "endDate": "2026-05-10", "startDate": "2026-05-03", "highlighted": false },
  { "id": "c7", "title": "11/05 a 18/05", "endDate": "2026-05-18", "startDate": "2026-05-11", "highlighted": false },
  { "id": "c8", "title": "19/05 a 26/05", "endDate": "2026-05-26", "startDate": "2026-05-19", "highlighted": false },
  { "id": "c9", "title": "27/05 a 03/06", "endDate": "2026-06-03", "startDate": "2026-05-27", "highlighted": false },
  { "id": "c10", "title": "04/06 a 11/06", "endDate": "2026-06-11", "startDate": "2026-06-04", "highlighted": false },
  { "id": "c11", "title": "12/06 a 19/06 (DIA D)", "endDate": "2026-06-19", "startDate": "2026-06-12", "highlighted": false }
];

const ROWS = [
  { id: 'f-00', type: 'funnel', title: '00 - Prospecção' },
  { id: 'f-01', type: 'funnel', title: '01 - Interação 0 (Interessados)' },
  { id: 'f-02', type: 'funnel', title: '02 - Interação 1 (Impactados)' },
  { id: 'f-03', type: 'funnel', title: '03 - Interessados Logística' },
  { id: 'f-04', type: 'funnel', title: '04 - Interação 2 (Agendamentos)' },
  { id: 'f-05', type: 'funnel', title: '05 - Interação 3 (Pré-atends)' },
  { id: 'f-06', type: 'funnel', title: '06 - Interação 4 (Venda)' },
  { id: 'mkt-1', type: 'text', title: 'MKT (Ações de Marketing)' },
  { id: 'int-1', type: 'text', title: 'INT (Comercial)' },
];

const INITIAL_CARDS = {
  "f-00": {
    "c1": [{ id: "data-1", type: "numeric", value: 4000, color: "yellow" }],
    "c2": [{ id: "data-2", type: "numeric", value: 15000, color: "yellow" }],
    "c3": [{ id: "data-3", type: "numeric", value: 4000, color: "yellow" }],
    "c4": [{ id: "data-4", type: "numeric", value: 15000, color: "yellow" }],
    "c5": [{ id: "data-5", type: "numeric", value: 4000, color: "yellow" }]
  },
  "f-01": {
    "c1": [{ id: "data-6", type: "numeric", value: 27, color: "yellow" }],
    "c2": [{ id: "data-7", type: "numeric", value: 27, color: "yellow" }],
    "c3": [{ id: "data-8", type: "numeric", value: 27, color: "yellow" }],
    "c4": [{ id: "data-9", type: "numeric", value: 27, color: "yellow" }],
    "c5": [{ id: "data-10", type: "numeric", value: 27, color: "yellow" }],
    "c6": [{ id: "data-11", type: "numeric", value: 27, color: "yellow" }],
    "c7": [{ id: "data-12", type: "numeric", value: 27, color: "yellow" }],
    "c8": [{ id: "data-13", type: "numeric", value: 27, color: "yellow" }]
  },
  "f-02": {
    "c1": [{ id: "data-14", type: "numeric", value: 1000, color: "cyan" }],
    "c2": [{ id: "data-15", type: "numeric", value: 1000, color: "cyan" }],
    "c3": [{ id: "data-16", type: "numeric", value: 1000, color: "cyan" }],
    "c4": [{ id: "data-17", type: "numeric", value: 1000, color: "cyan" }],
    "c5": [{ id: "data-18", type: "numeric", value: 1000, color: "cyan" }],
    "c6": [{ id: "data-19", type: "numeric", value: 1000, color: "cyan" }]
  },
  "f-03": {
    "c1": [{ id: "data-20", type: "numeric", value: 63, color: "yellow" }],
    "c2": [{ id: "data-21", type: "numeric", value: 63, color: "yellow" }],
    "c3": [{ id: "data-22", type: "numeric", value: 20, color: "yellow" }],
    "c4": [{ id: "data-23", type: "numeric", value: 20, color: "yellow" }],
    "c5": [{ id: "data-24", type: "numeric", value: 20, color: "yellow" }],
    "c6": [{ id: "data-25", type: "numeric", value: 20, color: "yellow" }]
  },
  "f-04": {
    "c1": [{ id: "data-26", type: "numeric", value: 4, color: "pink" }, { id: "data-27", type: "numeric", value: 23, color: "cyan" }],
    "c2": [{ id: "data-28", type: "numeric", value: 4, color: "pink" }, { id: "data-29", type: "numeric", value: 22, color: "cyan" }],
    "c3": [{ id: "data-30", type: "numeric", value: 4, color: "pink" }, { id: "data-31", type: "numeric", value: 23, color: "cyan" }],
    "c4": [{ id: "data-32", type: "numeric", value: 4, color: "pink" }, { id: "data-33", type: "numeric", value: 22, color: "cyan" }],
    "c5": [{ id: "data-34", type: "numeric", value: 4, color: "pink" }, { id: "data-35", type: "numeric", value: 23, color: "cyan" }],
    "c6": [{ id: "data-36", type: "numeric", value: 4, color: "pink" }, { id: "data-37", type: "numeric", value: 22, color: "cyan" }],
    "c7": [{ id: "data-38", type: "numeric", value: 4, color: "pink" }, { id: "data-39", type: "numeric", value: 23, color: "cyan" }],
    "c8": [{ id: "data-40", type: "numeric", value: 4, color: "pink" }, { id: "data-41", type: "numeric", value: 22, color: "cyan" }]
  },
  "f-05": {
    "c1": [{ id: "data-42", type: "numeric", value: 2, color: "pink" }, { id: "data-43", type: "numeric", value: 13, color: "cyan" }],
    "c2": [{ id: "data-44", type: "numeric", value: 2, color: "pink" }, { id: "data-45", type: "numeric", value: 14, color: "cyan" }],
    "c3": [{ id: "data-46", type: "numeric", value: 2, color: "pink" }, { id: "data-47", type: "numeric", value: 13, color: "cyan" }],
    "c4": [{ id: "data-48", type: "numeric", value: 2, color: "pink" }, { id: "data-49", type: "numeric", value: 14, color: "cyan" }],
    "c5": [{ id: "data-50", type: "numeric", value: 2, color: "pink" }, { id: "data-51", type: "numeric", value: 13, color: "cyan" }],
    "c6": [{ id: "data-52", type: "numeric", value: 2, color: "pink" }, { id: "data-53", type: "numeric", value: 14, color: "cyan" }],
    "c7": [{ id: "data-54", type: "numeric", value: 2, color: "pink" }, { id: "data-55", type: "numeric", value: 13, color: "cyan" }],
    "c8": [{ id: "data-56", type: "numeric", value: 2, color: "pink" }, { id: "data-57", type: "numeric", value: 14, color: "cyan" }]
  },
  "f-06": {
    "c1": [{ id: "data-58", type: "numeric", value: 1, color: "cyan" }],
    "c2": [{ id: "data-59", type: "numeric", value: 1, color: "pink" }, { id: "data-60", type: "numeric", value: 2, color: "cyan" }],
    "c3": [{ id: "data-61", type: "numeric", value: 1, color: "cyan" }],
    "c4": [{ id: "data-62", type: "numeric", value: 1, color: "pink" }, { id: "data-63", type: "numeric", value: 2, color: "cyan" }],
    "c5": [{ id: "data-64", type: "numeric", value: 1, color: "cyan" }],
    "c6": [{ id: "data-65", type: "numeric", value: 1, color: "pink" }, { id: "data-66", type: "numeric", value: 2, color: "cyan" }],
    "c7": [{ id: "data-67", type: "numeric", value: 1, color: "cyan" }],
    "c8": [{ id: "data-68", type: "numeric", value: 2, color: "pink" }, { id: "data-69", type: "numeric", value: 2, color: "cyan" }]
  },
  "mkt-1": {
    "c1": [{ id: "data-70", type: "text", value: "Folder tipologia e localização, Carta Leônidas, Reunião GP" }],
    "c2": [{ id: "data-71", type: "text", value: "Disparo Localiza GP, Validação GP e Estrutura" }],
    "c3": [{ id: "data-72", type: "text", value: "Disparo Técnico GP, Plantão Flex 04-07/05" }],
    "c4": [{ id: "data-73", type: "text", value: "Evento W3GN, LP Projeto, Brindes, Disparo Treinamento" }],
    "c5": [{ id: "data-74", type: "text", value: "Sacada" }],
    "c7": [{ id: "data-75", type: "text", value: "Áreas Condominiais" }],
    "c8": [{ id: "data-76", type: "text", value: "Teaser Decorado, Infraestrutura" }],
    "c9": [{ id: "data-77", type: "text", value: "Conheça apartam. decorado, Evento Dia D" }]
  },
  "int-1": {
    "c1": [{ id: "data-78", type: "text", value: "Início atendimento prospectores, Falar imobiliárias" }],
    "c2": [{ id: "data-79", type: "text", value: "Abordar frente terreno, Distribuição vagas" }],
    "c3": [{ id: "data-80", type: "text", value: "Treinamento imobiliárias" }],
    "c4": [{ id: "data-81", type: "text", value: "Treinamento imobiliárias, Convidar evento" }],
    "c5": [{ id: "data-82", type: "text", value: "Treinamento imobiliárias" }],
    "c6": [{ id: "data-83", type: "text", value: "Treinamento imobiliárias" }],
    "c7": [{ id: "data-84", type: "text", value: "Treinamento imobiliárias" }]
  }
};

const COLOR_MAP = {
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300', label: 'Executivos (Azul)' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300', label: 'Prospectores (Rosa)' },
  pink_reimpact: { bg: 'bg-pink-50', text: 'text-pink-800', border: 'border-pink-400 border-dashed', label: 'Reimpactar lead (Rosa)' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', label: 'Plataforma (Amarelo)' },
  green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Realizado (Verde)' },
};

export default function App() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [cards, setCards] = useState({});
  const [highlightMode, setHighlightMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverCell, setDragOverCell] = useState(null);

  const [colModalOpen, setColModalOpen] = useState(false);
  const [colModalData, setColModalData] = useState({ id: null, startDate: '', endDate: '', title: '' });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ rowId: null, colId: null, type: null });
  const [inputValue, setInputValue] = useState('');
  const [selectedColor, setSelectedColor] = useState('cyan');

  // Autenticação Anônima (só se não houver sessão autenticada existente)
  useEffect(() => {
    const signIn = async () => {
      // Verifica se já existe uma sessão autenticada (ex: GPI Tracker login)
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (existingSession && !existingSession.user?.is_anonymous && existingSession.user?.email) {
        // Já existe sessão autenticada real — não sobrescrever com anônima
        setUser(existingSession.user);
        return;
      }

      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error("Erro no Auth (Supabase):", error);
        setUser({ uid: 'demo-user' }); // Fallback
      } else {
        setUser(data.user);
      }
    };
    
    signIn();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Sincronização de Dados com a base na nuvem
  useEffect(() => {
    if (!user) return;
    
    // Funcao auxiliar para carregar a data da tabela schedule_data
    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from('schedule_data')
          .select('columns, cards')
          .eq('id', 'main')
          .single();

        if (error && error.code === 'PGRST116') {
          // Registro nao encontrado, tentaremos inserir
          await supabase
            .from('schedule_data')
            .insert([{ id: 'main', columns: INITIAL_COLUMNS, cards: INITIAL_CARDS }]);
          
          setColumns(INITIAL_COLUMNS);
          setCards(INITIAL_CARDS);
        } else if (data) {
          setColumns(data.columns || INITIAL_COLUMNS);
          setCards(data.cards || {});
        }
      } catch (err) {
        console.error("Erro ao puxar dados do Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Inscricao para Realtime
    const channel = supabase
      .channel('schedule_data_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedule_data', filter: "id=eq.main" },
        (payload) => {
           if (payload.new) {
             setColumns(payload.new.columns || INITIAL_COLUMNS);
             setCards(payload.new.cards || {});
           }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const syncData = async (newColumns, newCards) => {
    if (!user) return;
    try {
      await supabase
        .from('schedule_data')
        .update({ columns: newColumns, cards: newCards })
        .eq('id', 'main');
    } catch (err) {
      console.error("Erro ao sincronizar syncData (Supabase):", err);
    }
  };

  const openColModal = (mode, colId = null) => {
    if (mode === 'add') {
      setColModalData({ id: null, startDate: '', endDate: '', title: '' });
    } else if (mode === 'edit' && colId) {
      const col = columns.find(c => c.id === colId);
      if (col) {
        // Remove known auto-prefix to get the custom suffix if any
        let customName = '';
        if (col.title && col.title.includes(' (')) {
          customName = col.title.split(' (')[1].replace(')', '');
        }
        setColModalData({ id: col.id, startDate: col.startDate || '', endDate: col.endDate || '', title: customName });
      }
    }
    setColModalOpen(true);
  };

  const saveColumn = () => {
    if (!colModalData.startDate || !colModalData.endDate) {
      alert("Por favor, selecione as datas de início e fim no calendário.");
      return;
    }
    
    const start = new Date(colModalData.startDate + 'T12:00:00Z');
    const end = new Date(colModalData.endDate + 'T12:00:00Z');
    const fmt = (d) => `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    
    let baseTitle = `${fmt(start)} a ${fmt(end)}`;
    const newTitle = colModalData.title.trim() ? `${baseTitle} (${colModalData.title.trim()})` : baseTitle;

    const newCol = {
      id: colModalData.id || `c${Date.now()}`,
      title: newTitle,
      startDate: colModalData.startDate,
      endDate: colModalData.endDate,
      highlighted: false
    };

    let newCols;
    if (colModalData.id) {
       newCols = columns.map(c => c.id === colModalData.id ? { ...c, ...newCol } : c);
    } else {
       newCols = [...columns, newCol];
       newCols.sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0));
    }
    
    setColumns(newCols);
    syncData(newCols, cards);
    setColModalOpen(false);
  };

  const deleteColumn = (colId) => {
    if (window.confirm('Tem certeza que deseja eliminar esta semana?')) {
      const newCols = columns.filter(c => c.id !== colId);
      setColumns(newCols);
      syncData(newCols, cards);
    }
  };

  const toggleHighlight = (colId) => {
    if (!highlightMode) return;
    const newCols = columns.map(c => c.id === colId ? { ...c, highlighted: !c.highlighted } : c);
    setColumns(newCols);
    syncData(newCols, cards);
  };

  const openCardModal = (rowId, colId, type) => {
    if (highlightMode) {
      toggleHighlight(colId);
      return;
    }
    setModalData({ rowId, colId, type });
    setInputValue('');
    setSelectedColor('cyan');
    setModalOpen(true);
  };

  const handleDragStart = (e, rowId, colId, card) => {
    setDraggedItem({ rowId, colId, card });
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', card.id);
      e.dataTransfer.effectAllowed = 'copyMove';
    }
  };

  const handleDragOver = (e, targetRowType) => {
    e.preventDefault(); 
    if (!draggedItem) return;
    
    if (draggedItem.card.type === 'numeric' && targetRowType !== 'funnel') return;
    if (draggedItem.card.type === 'text' && targetRowType !== 'text') return;
    
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = e.altKey ? 'copy' : 'move';
    }
  };

  const handleDragEnter = (rowId, colId, targetRowType) => {
    if (!draggedItem) return;
    if (draggedItem.card.type === 'numeric' && targetRowType !== 'funnel') return;
    if (draggedItem.card.type === 'text' && targetRowType !== 'text') return;
    setDragOverCell(`${rowId}-${colId}`);
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e, targetRowId, targetColId, targetRowType) => {
    e.preventDefault();
    setDragOverCell(null);
    if (!draggedItem) return;

    if (draggedItem.card.type === 'numeric' && targetRowType !== 'funnel') return;
    if (draggedItem.card.type === 'text' && targetRowType !== 'text') return;

    const isCopy = e.altKey;
    const { rowId: sourceRowId, colId: sourceColId, card } = draggedItem;

    if (!isCopy && sourceRowId === targetRowId && sourceColId === targetColId) {
       setDraggedItem(null);
       return; 
    }

    const newCards = { ...cards };
    
    const targetRowData = newCards[targetRowId] || {};
    const targetColCards = targetRowData[targetColId] || [];
    const newCard = isCopy ? { ...card, id: `card-${Date.now()}` } : card;
    
    newCards[targetRowId] = {
      ...targetRowData,
      [targetColId]: [...targetColCards, newCard]
    };

    if (!isCopy) {
      const sourceRowData = newCards[sourceRowId];
      if (sourceRowData && sourceRowData[sourceColId]) {
        newCards[sourceRowId] = {
          ...sourceRowData,
          [sourceColId]: sourceRowData[sourceColId].filter(c => c.id !== card.id)
        };
      }
    }

    setCards(newCards);
    syncData(columns, newCards);
    setDraggedItem(null);
  };

  const saveCard = () => {
    if (!inputValue.trim()) return;

    const { rowId, colId, type } = modalData;
    const newCard = {
      id: `card-${Date.now()}`,
      type: type === 'funnel' ? 'numeric' : 'text',
      value: type === 'funnel' ? Number(inputValue) : inputValue,
      color: type === 'funnel' ? selectedColor : null,
    };

    const newCards = { ...cards };
    const rowData = newCards[rowId] || {};
    const colCards = rowData[colId] || [];
    
    newCards[rowId] = {
      ...rowData,
      [colId]: [...colCards, newCard]
    };

    setCards(newCards);
    syncData(columns, newCards);
    setModalOpen(false);
  };

  const deleteCard = (e, rowId, colId, cardId) => {
    e.stopPropagation();
    
    const newCards = { ...cards };
    const rowData = newCards[rowId];
    if (!rowData) return;
    
    newCards[rowId] = {
      ...rowData,
      [colId]: rowData[colId].filter(c => c.id !== cardId)
    };

    setCards(newCards);
    syncData(columns, newCards);
  };

  const toggleCardCompletion = (e, rowId, colId, cardId) => {
    e.stopPropagation();
    
    const newCards = { ...cards };
    const rowData = newCards[rowId];
    if (!rowData) return;
    
    newCards[rowId] = {
      ...rowData,
      [colId]: rowData[colId].map(c => c.id === cardId ? { ...c, completed: !c.completed } : c)
    };

    setCards(newCards);
    syncData(columns, newCards);
  };

  const getRowTotals = (rowId) => {
    const rowData = cards[rowId] || {};
    const totals = { cyan: 0, pink: 0, yellow: 0, green: 0 };
    
    Object.values(rowData).forEach(colCards => {
      colCards.forEach(card => {
        if (card.type === 'numeric' && card.color && card.color !== 'pink_reimpact') {
          if (totals[card.color] !== undefined) {
             totals[card.color] += card.value;
          }
        }
      });
    });
    
    return totals;
  };

  const getHighlightClasses = (colIndex, isHeader = false, isLastRow = false) => {
    const col = columns[colIndex];
    let classes = '';

    const todayStr = new Date().toISOString().split('T')[0];
    const isPast = col.endDate && col.endDate < todayStr;
    const isCurrent = col.startDate && col.endDate && col.startDate <= todayStr && col.endDate >= todayStr;

    if (isPast) {
       classes += '!bg-red-100/50 '; 
    } else if (isCurrent) {
       classes += '!bg-red-50 relative after:absolute after:top-0 after:left-0 after:w-full after:h-1 after:-mt-[1px] after:bg-red-500 '; 
       if (isHeader) classes += '!border-t-4 !border-red-500 ';
    }

    if (!col.highlighted) return classes;

    const prevHighlighted = colIndex > 0 && columns[colIndex - 1].highlighted;
    const nextHighlighted = colIndex < columns.length - 1 && columns[colIndex + 1].highlighted;

    classes += 'bg-red-50/50 transition-colors ';
    
    if (isHeader) classes += 'border-t-2 border-red-500 border-dashed ';
    if (isLastRow) classes += 'border-b-2 border-red-500 border-dashed ';
    if (!prevHighlighted) classes += 'border-l-2 border-red-500 border-dashed ';
    if (!nextHighlighted) classes += 'border-r-2 border-red-500 border-dashed ';

    return classes;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">A carregar os dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Cronograma de Lançamento</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">Gestão de metas do funil, marketing e ações internas.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
          <button 
            onClick={() => setHighlightMode(!highlightMode)}
            className={`flex-1 md:flex-none justify-center flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              highlightMode 
                ? 'bg-red-100 text-red-700 border border-red-300 shadow-inner' 
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <MousePointerSquareDashed size={16} className="shrink-0" />
            <span className="whitespace-nowrap">{highlightMode ? 'Modo Represamento' : 'Destacar Período'}</span>
          </button>
          
          <button 
            onClick={() => openColModal('add')}
            className="flex-1 md:flex-none justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
          >
            <Plus size={16} className="shrink-0" />
            <span className="whitespace-nowrap">Nova Semana</span>
          </button>
        </div>
      </div>

      {highlightMode && (
        <div className="max-w-7xl mx-auto mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm"><strong>Modo Represamento:</strong> Clique no cabeçalho ou nas células de uma semana para ativar/desativar a borda de destaque.</p>
        </div>
      )}

      <div className="max-w-[95vw] mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex relative">
        <div className="overflow-x-auto w-full custom-scrollbar pb-4">
          <table className="w-full min-w-max border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 bg-slate-100 border-b border-r border-slate-200 p-3 md:p-4 text-left font-semibold text-slate-700 w-32 md:w-72 min-w-[128px] md:min-w-[288px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] text-xs md:text-base">
                  Categorias
                </th>
                
                {columns.map((col, idx) => (
                  <th 
                    key={col.id} 
                    className={`border-b border-r border-slate-200 p-2 md:p-3 min-w-[160px] max-w-[160px] md:min-w-[200px] md:max-w-[200px] break-words whitespace-normal align-top transition-colors ${
                      highlightMode ? 'cursor-pointer hover:bg-red-50' : ''
                    } ${getHighlightClasses(idx, true, false)}`}
                    onClick={() => highlightMode && toggleHighlight(col.id)}
                  >
                    <div className="flex items-center justify-between group">
                      <span className="font-medium text-slate-700 text-sm md:text-base">{col.title}</span>
                      {!highlightMode && (
                        <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); openColModal('edit', col.id); }} className="p-1 text-slate-400 hover:text-indigo-600 rounded">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); deleteColumn(col.id); }} className="p-1 text-slate-400 hover:text-red-600 rounded">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                
                <th className="static md:sticky right-0 z-20 bg-slate-800 text-white border-b border-l border-slate-700 p-2 md:p-4 text-center font-semibold w-24 md:w-32 shadow-[-4px_0_10px_-2px_rgba(0,0,0,0.1)] text-xs md:text-base">
                  TOTAL
                </th>
              </tr>
            </thead>

            <tbody>
              {ROWS.map((row, rowIdx) => {
                const isLastRow = rowIdx === ROWS.length - 1;
                const rowTotals = getRowTotals(row.id);

                return (
                  <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className={`sticky left-0 z-10 bg-white group-hover:bg-slate-50 border-r border-b border-slate-200 p-3 md:p-4 text-xs md:text-sm font-medium ${row.type === 'funnel' ? 'text-slate-800' : 'text-indigo-700 font-bold'} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]`}>
                      {row.title}
                    </td>

                    {columns.map((col, colIdx) => {
                      const cellCards = cards[row.id]?.[col.id] || [];
                      return (
                        <td 
                          key={`${row.id}-${col.id}`}
                          onClick={() => openCardModal(row.id, col.id, row.type)}
                          onDragOver={(e) => handleDragOver(e, row.type)}
                          onDragEnter={() => handleDragEnter(row.id, col.id, row.type)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, row.id, col.id, row.type)}
                          className={`border-r border-b border-slate-200 p-2 align-top min-h-[80px] max-w-[160px] md:max-w-[200px] cursor-pointer transition-colors hover:bg-slate-50 ${dragOverCell === `${row.id}-${col.id}` ? 'bg-indigo-50 border-2 border-indigo-400 border-dashed' : ''} ${getHighlightClasses(colIdx, false, isLastRow)}`}
                        >
                          <div className="flex flex-wrap gap-2">
                            {cellCards.map(card => (
                              <div 
                                key={card.id} 
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, row.id, col.id, card)}
                                className={`relative group/card flex items-center justify-center text-center break-words whitespace-normal px-3 py-1.5 rounded-md border text-xs md:text-sm font-medium shadow-sm w-full cursor-grab active:cursor-grabbing ${
                                  card.type === 'numeric' 
                                    ? `${COLOR_MAP[card.color].bg} ${COLOR_MAP[card.color].text} ${COLOR_MAP[card.color].border}`
                                    : card.completed 
                                      ? 'bg-green-100 text-green-800 border-green-300' 
                                      : 'bg-white text-slate-700 border-slate-300'
                                } ${draggedItem?.card?.id === card.id ? 'opacity-50 border-dashed' : ''}`}
                              >
                                {card.type === 'text' ? (
                                  <div className="flex items-start w-full gap-2 text-left">
                                    <input 
                                      type="checkbox" 
                                      checked={card.completed || false}
                                      onChange={(e) => toggleCardCompletion(e, row.id, col.id, card.id)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="shrink-0 cursor-pointer w-4 h-4 accent-green-600 rounded mt-0.5"
                                    />
                                    <span className="flex-1 break-words">{card.value}</span>
                                  </div>
                                ) : (
                                  card.value
                                )}
                                <button 
                                  onClick={(e) => deleteCard(e, row.id, col.id, card.id)}
                                  className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 border border-slate-200 rounded-full p-0.5 opacity-100 md:opacity-0 group-hover/card:opacity-100 transition-opacity shadow-sm"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                            {cellCards.length === 0 && !highlightMode && (
                              <div className="w-full h-10 border-2 border-dashed border-slate-200 md:border-transparent group-hover:border-slate-300 rounded-md flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-all text-slate-400 bg-slate-50 md:bg-transparent">
                                <Plus size={16} />
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}

                    <td className={`static md:sticky right-0 z-10 bg-slate-50 border-l border-b border-slate-200 p-2 md:p-3 align-middle shadow-[-4px_0_10px_-2px_rgba(0,0,0,0.05)]`}>
                      {row.type === 'funnel' ? (
                        <div className="flex flex-col gap-1.5">
                          {rowTotals.cyan > 0 && (
                            <div className="w-full text-center px-2 py-1 rounded bg-cyan-100 text-cyan-800 border border-cyan-300 text-sm font-bold shadow-sm">{rowTotals.cyan}</div>
                          )}
                          {rowTotals.pink > 0 && (
                            <div className="w-full text-center px-2 py-1 rounded bg-pink-100 text-pink-800 border border-pink-300 text-sm font-bold shadow-sm">{rowTotals.pink}</div>
                          )}
                          {rowTotals.yellow > 0 && (
                            <div className="w-full text-center px-2 py-1 rounded bg-yellow-100 text-yellow-800 border border-yellow-300 text-sm font-bold shadow-sm">{rowTotals.yellow}</div>
                          )}
                          {rowTotals.green > 0 && (
                            <div className="w-full text-center px-2 py-1 rounded bg-green-100 text-green-800 border border-green-300 text-sm font-bold shadow-sm">{rowTotals.green}</div>
                          )}
                          {(rowTotals.cyan === 0 && rowTotals.pink === 0 && rowTotals.yellow === 0 && rowTotals.green === 0) && (
                            <span className="text-slate-400 text-sm text-center block">-</span>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-slate-400 text-sm">-</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {colModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                {colModalData.id ? 'Editar Semana' : 'Nova Semana'}
              </h3>
              <button onClick={() => setColModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data Início</label>
                  <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" value={colModalData.startDate} onChange={(e) => setColModalData({...colModalData, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data Fim</label>
                  <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" value={colModalData.endDate} onChange={(e) => setColModalData({...colModalData, endDate: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tag Adicional (Opcional)</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Ex: DIA D" value={colModalData.title} onChange={(e) => setColModalData({...colModalData, title: e.target.value})} />
                <p className="text-xs text-slate-500 mt-1">Isso será adicionado ao lado das datas geradas (Ex: 10/06 a 16/06 (DIA D)).</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setColModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
              <button onClick={saveColumn} className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                {modalData.type === 'funnel' ? 'Adicionar Meta (Número)' : 'Adicionar Ação (Texto)'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {modalData.type === 'funnel' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Responsável / Cor</label>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(COLOR_MAP).map(([key, data]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedColor(key)}
                          className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${selectedColor === key ? `${data.border} bg-slate-50` : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${data.bg} border ${data.border}`}></div>
                            <span className="text-slate-700">{data.label}</span>
                          </div>
                          {selectedColor === key && <CheckCircle2 size={18} className="text-indigo-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Valor Numérico da Meta</label>
                    <input type="number" autoFocus className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Ex: 150" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveCard()} />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Descrição da Ação</label>
                  <textarea autoFocus className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none h-24" placeholder="Ex: Disparo de Email Teaser..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveCard(); } }} />
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
              <button onClick={saveCard} className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">Adicionar</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}
