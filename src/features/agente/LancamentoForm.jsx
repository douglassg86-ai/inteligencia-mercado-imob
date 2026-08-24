import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { formatBRL } from './formatters'

function emptyTipologia() {
  return { id: crypto.randomUUID(), dormitorios: 2, suites: 1, areaM2: 60, preco: 500000 }
}

export default function LancamentoForm({ initial, onCancel, onSave }) {
  const [nome, setNome] = useState(initial?.nome ?? '')
  const [localizacao, setLocalizacao] = useState(initial?.localizacao ?? '')
  const [raioKm, setRaioKm] = useState(initial?.raioKm ?? 2)
  const [dataLancamento, setDataLancamento] = useState(initial?.dataLancamento ?? '')
  const [tipologias, setTipologias] = useState(initial?.tipologias?.length ? initial.tipologias : [emptyTipologia()])

  function updateTipologia(id, field, value) {
    setTipologias((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)))
  }

  function addTipologia() {
    setTipologias((prev) => [...prev, emptyTipologia()])
  }

  function removeTipologia(id) {
    setTipologias((prev) => (prev.length > 1 ? prev.filter((t) => t.id !== id) : prev))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim() || !localizacao.trim()) return
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      nome: nome.trim(),
      localizacao: localizacao.trim(),
      raioKm: Number(raioKm) || 0,
      dataLancamento,
      tipologias: tipologias.map((t) => ({
        ...t,
        dormitorios: Number(t.dormitorios) || 0,
        suites: Number(t.suites) || 0,
        areaM2: Number(t.areaM2) || 0,
        preco: Number(t.preco) || 0,
      })),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl bg-white rounded-xl border border-slate-200 p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {initial ? 'Editar lançamento' : 'Novo lançamento'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Esses dados definem o que o agente vai buscar: localização, raio e características do produto para
          comparar com concorrentes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nome do empreendimento</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Synthè"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Data de lançamento</label>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={dataLancamento}
            onChange={(e) => setDataLancamento(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Localização do empreendimento</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            placeholder="Endereço, bairro e cidade"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Raio de busca (km)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={raioKm}
            onChange={(e) => setRaioKm(e.target.value)}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-700">Tipologias (dormitórios/suítes, m², preço)</label>
          <button
            type="button"
            onClick={addTipologia}
            className="inline-flex items-center gap-1 text-sm text-slate-700 hover:text-slate-900"
          >
            <Plus size={14} /> Adicionar tipologia
          </button>
        </div>

        <div className="space-y-3">
          {tipologias.map((t) => {
            const precoM2 = t.areaM2 > 0 ? Math.round(Number(t.preco) / Number(t.areaM2)) : null
            return (
              <div key={t.id} className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-end bg-slate-50 rounded-lg p-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Dormitórios</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    value={t.dormitorios}
                    onChange={(e) => updateTipologia(t.id, 'dormitorios', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Suítes</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    value={t.suites}
                    onChange={(e) => updateTipologia(t.id, 'suites', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Área (m²)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    value={t.areaM2}
                    onChange={(e) => updateTipologia(t.id, 'areaM2', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    value={t.preco}
                    onChange={(e) => updateTipologia(t.id, 'preco', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Preço/m²</label>
                  <div className="w-full rounded-md border border-slate-200 bg-slate-100 px-2 py-1.5 text-sm text-slate-600">
                    {precoM2 ? formatBRL(precoM2) : '—'}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeTipologia(t.id)}
                    className="text-slate-400 hover:text-red-600 p-1.5"
                    aria-label="Remover tipologia"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800"
        >
          Salvar e analisar concorrentes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-slate-600 hover:text-slate-900 px-4 py-2"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
