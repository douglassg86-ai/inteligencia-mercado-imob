import { useMemo, useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { fmtMoney, fmtPct } from '../data'

const ACCENT = '#C1422A'
const COMP = '#2A78D6'

function median(arr) {
  const s = [...arr].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

const W = 900
const H = 460
const M = { top: 20, right: 24, bottom: 46, left: 68 }
const plotW = W - M.left - M.right
const plotH = H - M.top - M.bottom

// Posicionamento: preço/m² (eixo Y) x % vendido (eixo X). Cada ponto entra
// com um pequeno "pop" escalonado por índice; hover mostra tooltip com os
// dados do empreendimento.
export default function ScatterChart({ developments, highlightId }) {
  const [hoverId, setHoverId] = useState(null)

  const priced = useMemo(
    () => developments.filter((d) => d.precoM2 != null && d.pctVendido != null),
    [developments]
  )

  const { xScale, yScale, yTicks, xTicks, medPct, medPrice } = useMemo(() => {
    const yVals = priced.map((d) => d.precoM2)
    const yMin = Math.floor((Math.min(...yVals) - 600) / 1000) * 1000
    const yMax = Math.ceil((Math.max(...yVals) + 600) / 1000) * 1000
    const xS = (v) => M.left + (v / 100) * plotW
    const yS = (v) => M.top + (1 - (v - yMin) / (yMax - yMin)) * plotH
    const yT = []
    for (let v = yMin; v <= yMax; v += 1000) yT.push(v)
    return {
      xScale: xS,
      yScale: yS,
      yTicks: yT,
      xTicks: [0, 20, 40, 60, 80, 100],
      medPct: median(priced.map((d) => d.pctVendido)),
      medPrice: median(priced.map((d) => d.precoM2)),
    }
  }, [priced])

  const hovered = priced.find((d) => d.id === hoverId)

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none" style={{ fontFamily: 'Manrope, sans-serif' }}>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={M.left} x2={W - M.right} y1={yScale(v)} y2={yScale(v)} stroke="#EEF1F5" strokeWidth="1" />
            <text x={M.left - 10} y={yScale(v) + 4} textAnchor="end" fontSize="11" fill="#94A3B8">
              R$ {(v / 1000).toFixed(0)}k
            </text>
          </g>
        ))}
        {xTicks.map((v) => (
          <g key={v}>
            <line x1={xScale(v)} x2={xScale(v)} y1={M.top} y2={H - M.bottom} stroke="#F3F5F8" strokeWidth="1" />
            <text x={xScale(v)} y={H - M.bottom + 20} textAnchor="middle" fontSize="11" fill="#94A3B8">
              {v}%
            </text>
          </g>
        ))}

        <line x1={M.left} x2={W - M.right} y1={H - M.bottom} y2={H - M.bottom} stroke="#CBD5E1" strokeWidth="1" />
        <line x1={M.left} x2={M.left} y1={M.top} y2={H - M.bottom} stroke="#CBD5E1" strokeWidth="1" />

        <line x1={xScale(medPct)} x2={xScale(medPct)} y1={M.top} y2={H - M.bottom} stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
        <line x1={M.left} x2={W - M.right} y1={yScale(medPrice)} y2={yScale(medPrice)} stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />

        <text x={(M.left + W - M.right) / 2} y={H - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill="#64748B">
          % de unidades vendidas →
        </text>
        <text x={-(M.top + plotH / 2)} y={16} textAnchor="middle" fontSize="11" fontWeight="600" fill="#64748B" transform="rotate(-90)">
          Preço por m² (estoque atual) →
        </text>

        {priced.map((d, i) => {
          const isSynthe = d.id === highlightId
          const cx = xScale(d.pctVendido)
          const cy = yScale(d.precoM2)
          const r = isSynthe ? 10 : 7
          const isHovered = hoverId === d.id
          return (
            <g
              key={d.id}
              onMouseEnter={() => setHoverId(d.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{ cursor: 'pointer' }}
            >
              <Motion.circle
                cx={cx}
                cy={cy}
                fill={isSynthe ? ACCENT : COMP}
                stroke="#fff"
                strokeWidth={isSynthe ? 2.5 : 2}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: isHovered ? r + 3 : r, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.05, type: 'spring', stiffness: 260, damping: 18 }}
              />
              <Motion.text
                x={cx + r + 5}
                y={cy + 4}
                fontSize="11"
                fontWeight={isSynthe ? 700 : 500}
                fill={isSynthe ? ACCENT : '#1E293B'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                {d.nome}
              </Motion.text>
            </g>
          )
        })}
      </svg>

      <AnimatePresence>
        {hovered && (
          <Motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 -top-2 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none"
          >
            <div className="font-semibold">{hovered.nome}</div>
            <div className="text-slate-300">{fmtMoney(hovered.precoM2)}/m² · {fmtPct(hovered.pctVendido)} vendido</div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
