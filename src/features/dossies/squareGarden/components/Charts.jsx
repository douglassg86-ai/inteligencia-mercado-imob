import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { fmtBRL, fmtNum } from '../metrics'

/* ---------- barras horizontais: R$/m² por tipologia ---------- */

export function BarsM2({ rows, max, accent = 'var(--accent)' }) {
  const top = max || Math.max(...rows.map((r) => r.value)) * 1.02
  return (
    <div className="space-y-2.5">
      {rows.map((r, i) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className="mono text-[11.5px] w-[86px] flex-none text-right text-[var(--ink-2)]">{r.label}</span>
          <div className="flex-1 h-[22px] rounded-[4px] overflow-hidden" style={{ background: '#f2efe8' }}>
            <Motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(r.value / top) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: 'easeOut' }}
              className="h-full rounded-[4px]"
              style={{ background: r.color || accent, opacity: r.dim ? 0.35 : 1 }}
            />
          </div>
          {/* valor fora da barra: nada de texto escuro sobre preenchimento escuro */}
          <span className="mono text-[11.5px] font-bold w-[74px] flex-none text-right">{fmtBRL(r.value)}</span>
          <span className="mono text-[11px] w-[54px] flex-none text-[var(--muted)]">{r.note}</span>
        </div>
      ))}
    </div>
  )
}

/* ---------- dispersão: R$/m² × % de estoque em oferta ---------- */

export function ScatterCompetitivo({ data, w = 720, h = 380 }) {
  const [hover, setHover] = useState(null)
  const pad = { l: 56, r: 20, t: 16, b: 44 }
  const xs = data.map((d) => (d.estoque / d.un) * 100)
  const ys = data.map((d) => d.m2)
  const x0 = 0
  const x1 = Math.ceil(Math.max(...xs) / 10) * 10
  const y0 = Math.floor(Math.min(...ys) / 2000) * 2000
  const y1 = Math.ceil(Math.max(...ys) / 2000) * 2000
  const X = (v) => pad.l + ((v - x0) / (x1 - x0)) * (w - pad.l - pad.r)
  const Y = (v) => h - pad.b - ((v - y0) / (y1 - y0)) * (h - pad.t - pad.b)

  const yTicks = []
  for (let v = y0; v <= y1; v += 4000) yTicks.push(v)
  const xTicks = []
  for (let v = x0; v <= x1; v += 20) xTicks.push(v)

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label="Preço por m² versus percentual de estoque em oferta">
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={w - pad.r} y1={Y(v)} y2={Y(v)} stroke="var(--line)" strokeWidth="1" />
            <text x={pad.l - 9} y={Y(v) + 4} textAnchor="end" className="mono" fontSize="10" fill="var(--muted)">
              {(v / 1000).toFixed(0)}k
            </text>
          </g>
        ))}
        {xTicks.map((v) => (
          <text key={v} x={X(v)} y={h - pad.b + 17} textAnchor="middle" className="mono" fontSize="10" fill="var(--muted)">
            {v}%
          </text>
        ))}
        <text x={pad.l} y={h - 8} fontSize="10.5" fill="var(--muted)" fontWeight="600">
          % do total ainda em estoque →
        </text>
        <text x={13} y={h / 2} fontSize="10.5" fill="var(--muted)" fontWeight="600" textAnchor="middle" transform={`rotate(-90 13 ${h / 2})`}>
          R$/m²
        </text>

        {data.map((d) => {
          const cx = X((d.estoque / d.un) * 100)
          const cy = Y(d.m2)
          const r = Math.max(4.5, Math.min(15, Math.sqrt(d.un) * 1.15))
          const on = hover === d.nome
          return (
            <g key={d.nome} onMouseEnter={() => setHover(d.nome)} onMouseLeave={() => setHover(null)}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={d.destaque ? 'var(--accent)' : 'var(--ink)'}
                fillOpacity={d.destaque ? 0.92 : on ? 0.5 : 0.16}
                stroke={d.destaque ? 'var(--accent)' : 'var(--ink-2)'}
                strokeWidth={d.destaque ? 2 : 1}
                strokeOpacity={d.destaque ? 1 : on ? 0.9 : 0.35}
              />
              {(d.destaque || on) && (
                <text
                  x={cx}
                  y={cy - r - 6}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="700"
                  fill={d.destaque ? 'var(--accent)' : 'var(--ink)'}
                >
                  {d.nome}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <p className="text-[11px] text-[var(--muted)] mt-1">
        Área do círculo proporcional ao total de unidades do empreendimento.
        {hover && (
          <span className="ml-2 mono text-[var(--ink)]">
            · {hover}: {fmtBRL(data.find((d) => d.nome === hover).m2)}/m², {data.find((d) => d.nome === hover).estoque} de{' '}
            {data.find((d) => d.nome === hover).un} un.
          </span>
        )}
      </p>
    </div>
  )
}

/* ---------- linha: gradiente de preço por pavimento ---------- */

export function LinhaPavimento({ series, w = 700, h = 260 }) {
  const pad = { l: 54, r: 16, t: 14, b: 34 }
  const all = series.flatMap((s) => s.pontos)
  const pavs = all.map((p) => p.pav)
  const vals = all.map((p) => p.m2)
  const x0 = Math.min(...pavs)
  const x1 = Math.max(...pavs)
  const y0 = Math.floor(Math.min(...vals) / 500) * 500
  const y1 = Math.ceil(Math.max(...vals) / 500) * 500
  const X = (v) => pad.l + ((v - x0) / (x1 - x0)) * (w - pad.l - pad.r)
  const Y = (v) => h - pad.b - ((v - y0) / (y1 - y0)) * (h - pad.t - pad.b)

  const yTicks = []
  for (let v = y0; v <= y1; v += Math.max(500, Math.round((y1 - y0) / 4 / 500) * 500)) yTicks.push(v)

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label="Preço por m² conforme o pavimento">
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={w - pad.r} y1={Y(v)} y2={Y(v)} stroke="var(--line)" />
            <text x={pad.l - 8} y={Y(v) + 4} textAnchor="end" className="mono" fontSize="10" fill="var(--muted)">
              {(v / 1000).toFixed(1)}k
            </text>
          </g>
        ))}
        {series.map((s) => {
          const d = s.pontos.map((p, i) => `${i ? 'L' : 'M'}${X(p.pav)},${Y(p.m2)}`).join(' ')
          return (
            <g key={s.nome}>
              <Motion.path
                d={d}
                fill="none"
                stroke={s.cor}
                strokeWidth="2.2"
                strokeLinejoin="round"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
              {s.pontos.map((p) => (
                <circle key={p.pav} cx={X(p.pav)} cy={Y(p.m2)} r="3.2" fill="#fff" stroke={s.cor} strokeWidth="2">
                  <title>{`Pav. ${p.pav} — un. ${p.un} — ${fmtBRL(p.m2)}/m²`}</title>
                </circle>
              ))}
            </g>
          )
        })}
        {[x0, ...pavs.filter((p) => p % 5 === 0), x1].filter((v, i, a) => a.indexOf(v) === i).map((v) => (
          <text key={v} x={X(v)} y={h - pad.b + 16} textAnchor="middle" className="mono" fontSize="10" fill="var(--muted)">
            {v}
          </text>
        ))}
        <text x={w - pad.r} y={h - 6} textAnchor="end" fontSize="10.5" fill="var(--muted)" fontWeight="600">
          pavimento →
        </text>
      </svg>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-1">
        {series.map((s) => (
          <span key={s.nome} className="flex items-center gap-2 text-[11.5px] font-medium text-[var(--ink-2)]">
            <span className="w-4 h-[2.5px] rounded" style={{ background: s.cor }} />
            {s.nome}
            <span className="mono text-[var(--muted)]">
              {s.pontos.length > 1 &&
                `+${fmtNum(((s.pontos.at(-1).m2 / s.pontos[0].m2 - 1) * 100), 1)}% do 1º ao último`}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
