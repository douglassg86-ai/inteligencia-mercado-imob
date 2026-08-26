import { motion as Motion } from 'framer-motion'
import AnimatedNumber from './AnimatedNumber'
import { SYNTHE, COMPETITORS } from '../data'

function rank(list, key, desc = true) {
  const sorted = [...list].sort((a, b) => (desc ? b[key] - a[key] : a[key] - b[key]))
  return sorted.findIndex((d) => d.isSynthe) + 1
}

export default function KpiStrip() {
  const priced = COMPETITORS.filter((d) => d.precoM2 != null)
  const avgPreco = priced.reduce((s, d) => s + d.precoM2, 0) / priced.length
  const diffPct = ((SYNTHE.precoM2 - avgPreco) / avgPreco) * 100

  const allPriced = [SYNTHE, ...priced]
  const precoRank = rank(allPriced, 'precoM2', false)
  const vendidoRank = rank([SYNTHE, ...COMPETITORS], 'pctVendido', true)

  const avgAmen = COMPETITORS.reduce((s, d) => s + d.amenidadesCount, 0) / COMPETITORS.length

  const tiles = [
    {
      label: 'Preço/m² Synthè',
      value: SYNTHE.precoM2,
      format: (v) => 'R$ ' + Math.round(v).toLocaleString('pt-BR'),
      sub: `${precoRank}º mais barato de ${allPriced.length}`,
      accent: true,
    },
    {
      label: 'Média da concorrência',
      value: avgPreco,
      format: (v) => 'R$ ' + Math.round(v).toLocaleString('pt-BR'),
      sub: `Synthè está ${Math.abs(diffPct).toFixed(1)}% ${diffPct < 0 ? 'abaixo' : 'acima'}`,
    },
    {
      label: '% vendido Synthè',
      value: SYNTHE.pctVendido,
      format: (v) => v.toFixed(1).replace('.', ',') + '%',
      sub: `${vendidoRank}º de ${COMPETITORS.length + 1} em velocidade`,
    },
    {
      label: 'Amenidades confirmadas',
      value: SYNTHE.amenidadesCount,
      format: (v) => Math.round(v) + '/15',
      sub: `Média da concorrência: ${avgAmen.toFixed(1)}`,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      {tiles.map((t, i) => (
        <Motion.div
          key={t.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={t.accent ? 'p-5' : 'p-5 bg-white'}
          style={t.accent ? { background: '#C1422A', color: '#fff' } : undefined}
        >
          <div className={`text-[11px] uppercase tracking-wide font-semibold mb-2 ${t.accent ? 'text-white/70' : 'text-slate-400'}`}>
            {t.label}
          </div>
          <div className={`text-2xl font-bold tabular-nums ${t.accent ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <AnimatedNumber value={t.value} format={t.format} />
          </div>
          <div className={`text-xs mt-1.5 ${t.accent ? 'text-white/80' : 'text-slate-500'}`}>{t.sub}</div>
        </Motion.div>
      ))}
    </div>
  )
}
