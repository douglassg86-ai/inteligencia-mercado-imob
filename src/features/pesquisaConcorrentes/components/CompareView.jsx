import { useState, useEffect } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Check, X, Minus, ArrowRightLeft, ZoomIn } from 'lucide-react'
import SourceBadges from './SourceBadges'
import { DEVELOPMENTS, SYNTHE, AMENITY_KEYS, DEPTH_LABEL, fmtMoney, fmtPct, fmtDate } from '../data'

const DEPTH_STYLE = {
  completo: 'bg-blue-50 text-blue-700',
  parcial: 'bg-slate-100 text-slate-600',
  nenhum: 'bg-slate-100 text-slate-400 italic',
}

function Picker({ value, onChange, exclude, label }) {
  return (
    <div className="flex-1 min-w-0">
      <label className="block text-[11px] uppercase tracking-wide font-semibold text-slate-400 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C1422A]/30 focus:border-[#C1422A]"
      >
        {DEVELOPMENTS.filter((d) => d.id !== exclude).map((d) => (
          <option key={d.id} value={d.id}>
            {d.nome}
          </option>
        ))}
      </select>
    </div>
  )
}

function NumberBar({ label, a, b, format = (v) => v }) {
  const av = a ?? 0
  const bv = b ?? 0
  const max = Math.max(av, bv, 1)
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2.5">
      <div className="flex items-center justify-end gap-2">
        <span className="text-sm font-semibold tabular-nums text-slate-800" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {a == null ? '—' : format(a)}
        </span>
        <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
          <Motion.div
            className="h-full rounded-full bg-[#C1422A] ml-auto"
            initial={{ width: 0 }}
            animate={{ width: `${(av / max) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
      <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 text-center w-32">{label}</div>
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
          <Motion.div
            className="h-full rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${(bv / max) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <span className="text-sm font-semibold tabular-nums text-slate-800" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {b == null ? '—' : format(b)}
        </span>
      </div>
    </div>
  )
}

function TextRow({ label, a, b }) {
  return (
    <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-100 last:border-0">
      <div>
        <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 mb-1">{label}</div>
        <div className="text-sm text-slate-700 leading-relaxed">{a || <span className="text-slate-300">não informado</span>}</div>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 mb-1">&nbsp;</div>
        <div className="text-sm text-slate-700 leading-relaxed">{b || <span className="text-slate-300">não informado</span>}</div>
      </div>
    </div>
  )
}

function PlantaImg({ id, kind, label, nome, onOpen }) {
  const [failed, setFailed] = useState(false)
  const src = `/pesquisa-concorrentes/plantas/${id}-${kind}.jpg`
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 mb-1.5">{label}</div>
      {failed ? (
        <div className="aspect-[4/3] rounded-lg bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-300 text-center px-4">
          Não disponível no material consultado
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onOpen({ src, title: `${nome} — ${label}` })}
          className="group relative w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-50 cursor-zoom-in"
        >
          <img
            src={src}
            alt={`${label} — ${id}`}
            loading="lazy"
            onError={() => setFailed(true)}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2 shadow-sm">
              <ZoomIn size={18} className="text-slate-700" />
            </span>
          </span>
        </button>
      )}
    </div>
  )
}

function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
          onClick={onClose}
        >
          <Motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between mb-2 px-1">
              <span className="text-sm font-semibold text-white/90">{item.title}</span>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Fechar"
              >
                <X size={18} />
              </button>
            </div>
            <img src={item.src} alt={item.title} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl cursor-default" onClick={(e) => e.stopPropagation()} />
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}

function AmenCell({ v }) {
  if (v === true) return <Check size={16} className="text-emerald-600 mx-auto" />
  if (v === false) return <X size={16} className="text-slate-300 mx-auto" />
  if (v === 'parcial') return <span className="block text-center text-amber-600 text-xs font-semibold">parcial</span>
  return <Minus size={14} className="text-slate-200 mx-auto" />
}

export default function CompareView() {
  const [idA, setIdA] = useState(SYNTHE.id)
  const [idB, setIdB] = useState('anita-green')
  const [lightbox, setLightbox] = useState(null)

  const a = DEVELOPMENTS.find((d) => d.id === idA)
  const b = DEVELOPMENTS.find((d) => d.id === idB)

  function swap() {
    setIdA(idB)
    setIdB(idA)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-end gap-3">
          <Picker label="Empreendimento A" value={idA} onChange={setIdA} exclude={idB} />
          <button
            onClick={swap}
            className="mb-1.5 p-2.5 rounded-full border border-slate-200 text-slate-400 hover:text-[#C1422A] hover:border-[#C1422A]/40 transition-colors"
            title="Trocar lados"
          >
            <ArrowRightLeft size={16} />
          </button>
          <Picker label="Empreendimento B" value={idB} onChange={setIdB} exclude={idA} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <Motion.div
          key={`${idA}-${idB}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Header cards */}
          <div className="grid grid-cols-2 gap-4">
            {[a, b].map((d) => (
              <div
                key={d.id}
                className={`rounded-2xl border p-5 ${d.isSynthe ? 'border-[#C1422A]/40 bg-[#C1422A]/[0.05]' : 'border-blue-200 bg-blue-50/40'}`}
              >
                <div className={`text-xl font-bold ${d.isSynthe ? 'text-[#C1422A]' : 'text-slate-900'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {d.nome}
                </div>
                <div className="text-sm text-slate-500 mt-0.5">{d.incorporadora} · {d.bairro}</div>
                <div className="text-xs text-slate-400 mt-1">{d.endereco}</div>
                <div className="mt-3">
                  <SourceBadges fontes={d.fontes} />
                </div>
                {d.observacao && (
                  <div className="mt-3 text-xs text-slate-600 bg-white/70 rounded-lg p-2.5 border border-slate-100">
                    {d.observacao}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Numeric comparison */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Números
            </h3>
            <NumberBar label="Preço/m²" a={a.precoM2} b={b.precoM2} format={fmtMoney} />
            <p className="text-[11px] text-slate-400 -mt-1 mb-1.5 text-center">
              VGV disponível ÷ área privativa disponível (só unidades em estoque)
            </p>
            <NumberBar label="% vendido" a={a.pctVendido} b={b.pctVendido} format={fmtPct} />
            <NumberBar label="Total de unidades" a={a.totalUnidades} b={b.totalUnidades} />
            <NumberBar label="Em estoque" a={a.unidadesEstoque} b={b.unidadesEstoque} />
            <NumberBar label="Pavimentos" a={a.pavimentos} b={b.pavimentos} />
            <NumberBar label="Amenidades (/15)" a={a.amenidadesCount} b={b.amenidadesCount} />
            <div className="grid grid-cols-2 gap-4 pt-3 mt-2 border-t border-slate-100 text-sm">
              <div className="text-slate-600">
                <span className="text-slate-400">Lançamento:</span> {fmtDate(a.dataLancamento)}
                <br />
                <span className="text-slate-400">Entrega:</span> {fmtDate(a.dataEntrega)}
              </div>
              <div className="text-slate-600">
                <span className="text-slate-400">Lançamento:</span> {fmtDate(b.dataLancamento)}
                <br />
                <span className="text-slate-400">Entrega:</span> {fmtDate(b.dataEntrega)}
              </div>
            </div>
          </div>

          {/* Plantas & Implantação */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Plantas &amp; implantação
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Extraído dos books/apresentações oficiais de cada incorporadora (via Órulo, quando disponível). Metragens e layout podem variar por tipologia — a planta exibida é a do apartamento tipo mais representativo. Clique numa imagem para ampliar.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[a, b].map((d) => (
                <div key={d.id} className="space-y-4">
                  <div className={`text-sm font-semibold truncate ${d.isSynthe ? 'text-[#C1422A]' : 'text-blue-700'}`}>{d.nome}</div>
                  <PlantaImg id={d.id} kind="planta" label="Planta" nome={d.nome} onOpen={setLightbox} />
                  <PlantaImg id={d.id} kind="implantacao" label="Implantação / localização" nome={d.nome} onOpen={setLightbox} />
                </div>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Construção &amp; materiais
              </h3>
              <div className="flex gap-2">
                <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${DEPTH_STYLE[a.profundidade]}`}>{DEPTH_LABEL[a.profundidade]}</span>
                <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${DEPTH_STYLE[b.profundidade]}`}>{DEPTH_LABEL[b.profundidade]}</span>
              </div>
            </div>
            <TextRow label="Estrutura / Fachada" a={a.estrutura} b={b.estrutura} />
            <TextRow label="Esquadrias / Vidros" a={a.esquadrias} b={b.esquadrias} />
            <TextRow label="Outros diferenciais" a={a.outros} b={b.outros} />
          </div>

          {/* Amenities checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Lazer, item a item
            </h3>
            <div className="grid grid-cols-[1fr_60px_60px] gap-2 text-xs">
              <div />
              <div className={`text-center font-semibold truncate ${a.isSynthe ? 'text-[#C1422A]' : 'text-blue-700'}`}>{a.nome}</div>
              <div className={`text-center font-semibold truncate ${b.isSynthe ? 'text-[#C1422A]' : 'text-blue-700'}`}>{b.nome}</div>
              {AMENITY_KEYS.map(([key, label]) => (
                <div key={key} className="contents">
                  <div className="py-1.5 text-slate-600 border-t border-slate-50">{label}</div>
                  <div className="py-1.5 border-t border-slate-50">
                    <AmenCell v={a.amenidades[key]} />
                  </div>
                  <div className="py-1.5 border-t border-slate-50">
                    <AmenCell v={b.amenidades[key]} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Motion.div>
      </AnimatePresence>

      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
    </div>
  )
}
