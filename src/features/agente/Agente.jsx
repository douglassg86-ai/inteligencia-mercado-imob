import { useEffect, useMemo, useState } from 'react'
import { Building2, MapPin, Pencil, Plus, Ruler, Trash2 } from 'lucide-react'
import LancamentoForm from './LancamentoForm'
import {
  AmenitiesMatrix,
  EngenhariaMatrix,
  KpiCards,
  PromocoesTable,
  ResumoConcorrentesTable,
  TipologiaComparativaTable,
} from './ComparativeTables'
import { generateMockCompetitors } from './mockData'

const STORAGE_KEY = 'agente-lancamentos'

function loadLancamentos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function Agente() {
  const [lancamentos, setLancamentos] = useState(loadLancamentos)
  const [selectedId, setSelectedId] = useState(null)
  const [mode, setMode] = useState('detail') // 'detail' | 'form'
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lancamentos))
  }, [lancamentos])

  useEffect(() => {
    if (!selectedId && lancamentos.length > 0) {
      setSelectedId(lancamentos[0].id)
    }
  }, [lancamentos, selectedId])

  const selected = useMemo(
    () => lancamentos.find((l) => l.id === selectedId) ?? null,
    [lancamentos, selectedId]
  )

  const competitors = useMemo(() => (selected ? generateMockCompetitors(selected) : []), [selected])

  function handleSave(lancamento) {
    setLancamentos((prev) => {
      const exists = prev.some((l) => l.id === lancamento.id)
      return exists ? prev.map((l) => (l.id === lancamento.id ? lancamento : l)) : [...prev, lancamento]
    })
    setSelectedId(lancamento.id)
    setMode('detail')
    setEditing(null)
  }

  function handleDelete(id) {
    setLancamentos((prev) => prev.filter((l) => l.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Agente de Inteligência de Mercado</h1>
          <p className="text-sm text-slate-500 mt-1">
            Mapeamento de concorrentes por lançamento — localização, raio de busca e características do produto.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-900">Meus lançamentos</h2>
                <button
                  onClick={() => {
                    setEditing(null)
                    setMode('form')
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium bg-slate-900 text-white rounded-lg px-2.5 py-1.5 hover:bg-slate-800"
                >
                  <Plus size={14} /> Novo
                </button>
              </div>

              {lancamentos.length === 0 ? (
                <p className="text-xs text-slate-400">Nenhum lançamento cadastrado ainda.</p>
              ) : (
                <ul className="space-y-1">
                  {lancamentos.map((l) => (
                    <li key={l.id}>
                      <button
                        onClick={() => {
                          setSelectedId(l.id)
                          setMode('detail')
                        }}
                        className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                          selectedId === l.id && mode === 'detail'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-medium flex items-center gap-1.5">
                          <Building2 size={14} className="flex-shrink-0" />
                          <span className="truncate">{l.nome}</span>
                        </div>
                        <div
                          className={`text-xs mt-0.5 truncate ${
                            selectedId === l.id && mode === 'detail' ? 'text-slate-300' : 'text-slate-400'
                          }`}
                        >
                          {l.localizacao}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {mode === 'form' && (
              <LancamentoForm
                initial={editing}
                onCancel={() => setMode(lancamentos.length ? 'detail' : 'form')}
                onSave={handleSave}
              />
            )}

            {mode === 'detail' && !selected && (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
                <Building2 size={28} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 text-sm mb-4">
                  Cadastre um lançamento para gerar o mapa de concorrentes.
                </p>
                <button
                  onClick={() => setMode('form')}
                  className="inline-flex items-center gap-1.5 bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800"
                >
                  <Plus size={16} /> Novo lançamento
                </button>
              </div>
            )}

            {mode === 'detail' && selected && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{selected.nome}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={14} /> {selected.localizacao}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Ruler size={14} /> Raio de {selected.raioKm} km
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditing(selected)
                        setMode('form')
                      }}
                      className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5"
                    >
                      <Pencil size={14} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 border border-slate-200 rounded-lg px-3 py-1.5"
                    >
                      <Trash2 size={14} /> Excluir
                    </button>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg px-3 py-2">
                  Dados de exemplo (mock) para validar o modelo — a próxima etapa conecta o pipeline real de
                  scraping (portais + Órulo) no lugar desses valores fictícios.
                </div>

                <KpiCards lancamento={selected} competitors={competitors} />
                <ResumoConcorrentesTable competitors={competitors} />
                <TipologiaComparativaTable lancamento={selected} competitors={competitors} />
                <AmenitiesMatrix competitors={competitors} />
                <EngenhariaMatrix competitors={competitors} />
                <PromocoesTable competitors={competitors} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
