import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import ScatterChart from './ScatterChart'
import SourceBadges from './SourceBadges'
import { DEVELOPMENTS, SYNTHE, DEPTH_LABEL, fmtMoney, fmtPct } from '../data'

const DEPTH_STYLE = {
  completo: 'bg-blue-50 text-blue-700',
  parcial: 'bg-slate-100 text-slate-600',
  nenhum: 'bg-slate-100 text-slate-400 italic',
}

function SortHeader({ label, active, dir, onClick, align = 'left' }) {
  return (
    <th
      onClick={onClick}
      className={`px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-slate-400 cursor-pointer select-none hover:text-slate-600 whitespace-nowrap ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {label}
      {active && <span className="ml-1">{dir === 'desc' ? '↓' : '↑'}</span>}
    </th>
  )
}

export default function AllView() {
  const [sortKey, setSortKey] = useState('precoM2')
  const [sortDir, setSortDir] = useState('desc')

  function toggleSort(key) {
    if (key === sortKey) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const rows = [...DEVELOPMENTS].sort((a, b) => {
    const av = a[sortKey] ?? -Infinity
    const bv = b[sortKey] ?? -Infinity
    return sortDir === 'desc' ? bv - av : av - bv
  })

  const amenSorted = [...DEVELOPMENTS].sort((a, b) => b.amenidadesCount - a.amenidadesCount)
  const maxAmen = 15

  return (
    <div className="space-y-8">
      {/* SCATTER */}
      <Motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-200 p-6"
      >
        <h2 className="text-lg font-bold text-slate-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Preço por m² × velocidade de venda
        </h2>
        <p className="text-sm text-slate-500 mb-4 max-w-xl">
          Cada ponto é um empreendimento. As linhas tracejadas marcam a mediana do grupo em cada eixo.
        </p>
        <ScatterChart developments={DEVELOPMENTS} highlightId={SYNTHE.id} />
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#C1422A' }} /> Synthè
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#2A78D6' }} /> Concorrentes
          </span>
        </div>
      </Motion.section>

      {/* TABLE */}
      <Motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
      >
        <div className="p-6 pb-0">
          <h2 className="text-lg font-bold text-slate-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Os 12 lado a lado
          </h2>
          <p className="text-sm text-slate-500 mb-4">Clique num cabeçalho para ordenar.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead className="bg-slate-50 border-y border-slate-200">
              <tr>
                <SortHeader label="Empreendimento" active={sortKey === 'nome'} dir={sortDir} onClick={() => toggleSort('nome')} />
                <SortHeader label="Bairro" active={sortKey === 'bairro'} dir={sortDir} onClick={() => toggleSort('bairro')} />
                <SortHeader label="Unid." align="right" active={sortKey === 'totalUnidades'} dir={sortDir} onClick={() => toggleSort('totalUnidades')} />
                <SortHeader label="% Vendido" align="right" active={sortKey === 'pctVendido'} dir={sortDir} onClick={() => toggleSort('pctVendido')} />
                <SortHeader label="Preço/m²" align="right" active={sortKey === 'precoM2'} dir={sortDir} onClick={() => toggleSort('precoM2')} />
                <SortHeader label="Pavtos." align="right" active={sortKey === 'pavimentos'} dir={sortDir} onClick={() => toggleSort('pavimentos')} />
                <th className="px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-slate-400 text-left">Fontes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className={`border-b border-slate-100 ${d.isSynthe ? 'bg-[#C1422A]/[0.06]' : 'hover:bg-slate-50'}`}>
                  <td className="px-4 py-3">
                    <div className={`font-semibold ${d.isSynthe ? 'text-[#C1422A]' : 'text-slate-800'}`}>{d.nome}</div>
                    <div className="text-xs text-slate-400">{d.incorporadora}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.isSynthe ? 'bg-[#C1422A]/10 text-[#C1422A]' : 'bg-blue-50 text-blue-700'}`}>
                      {d.bairro}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {d.totalUnidades}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <Motion.div
                          className={`h-full rounded-full ${d.isSynthe ? 'bg-[#C1422A]' : 'bg-blue-500'}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${d.pctVendido}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                      <span className="tabular-nums text-xs w-12 text-right" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {fmtPct(d.pctVendido)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {fmtMoney(d.precoM2)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {d.pavimentos}
                  </td>
                  <td className="px-4 py-3">
                    <SourceBadges fontes={d.fontes} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Motion.section>

      {/* AMENITIES */}
      <Motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        className="bg-white rounded-2xl border border-slate-200 p-6"
      >
        <h2 className="text-lg font-bold text-slate-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Amenidades, de 15 possíveis
        </h2>
        <p className="text-sm text-slate-500 mb-5 max-w-xl">
          Synthè aposta em menos itens por design — coerente com o posicionamento "a síntese do equilíbrio".
        </p>
        <div className="space-y-2">
          {amenSorted.map((d) => (
            <div key={d.id} className="flex items-center gap-3">
              <div className={`w-40 flex-shrink-0 text-sm truncate ${d.isSynthe ? 'font-bold text-[#C1422A]' : 'text-slate-700'}`}>
                {d.nome}
              </div>
              <div className="flex-1 h-5 rounded-md bg-slate-100 overflow-hidden">
                <Motion.div
                  className={`h-full rounded-md ${d.isSynthe ? 'bg-[#C1422A]' : 'bg-blue-500'}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(d.amenidadesCount / maxAmen) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="w-12 text-right text-xs text-slate-500 tabular-nums" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {d.amenidadesCount}/15
              </div>
            </div>
          ))}
        </div>
      </Motion.section>

      {/* MATERIALS */}
      <Motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
      >
        <h2 className="text-lg font-bold text-slate-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Estrutura, fachada e esquadrias
        </h2>
        <p className="text-sm text-slate-500 mb-5 max-w-xl">
          O selo indica a profundidade real de especificação publicada por cada um — não é nota de qualidade do
          produto, é quanto dado técnico duro cada incorporadora torna público.
        </p>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {DEVELOPMENTS.map((d, i) => (
            <Motion.div
              key={d.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: (i % 6) * 0.05 }}
              className={`rounded-2xl border p-5 flex flex-col gap-3 ${
                d.isSynthe ? 'border-[#C1422A]/40 bg-[#C1422A]/[0.05]' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className={`font-bold ${d.isSynthe ? 'text-[#C1422A]' : 'text-slate-900'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {d.nome}
                  </div>
                  <div className="text-xs text-slate-400">{d.incorporadora}</div>
                </div>
                <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${DEPTH_STYLE[d.profundidade]}`}>
                  {DEPTH_LABEL[d.profundidade]}
                </span>
              </div>
              <div className="text-xs">
                <div className="uppercase tracking-wide font-semibold text-slate-400 mb-0.5">Estrutura / Fachada</div>
                <div className="text-slate-600 leading-relaxed">{d.estrutura}</div>
              </div>
              <div className="text-xs">
                <div className="uppercase tracking-wide font-semibold text-slate-400 mb-0.5">Esquadrias / Vidros</div>
                <div className="text-slate-600 leading-relaxed">{d.esquadrias}</div>
              </div>
              <div className="text-xs">
                <div className="uppercase tracking-wide font-semibold text-slate-400 mb-0.5">Outros diferenciais</div>
                <div className="text-slate-600 leading-relaxed">{d.outros}</div>
              </div>
            </Motion.div>
          ))}
        </div>
      </Motion.section>
    </div>
  )
}
