import { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, GitCompareArrows } from 'lucide-react'
import KpiStrip from './components/KpiStrip'
import AllView from './components/AllView'
import CompareView from './components/CompareView'
import SourcesPanel from './components/SourcesPanel'
import { LAST_UPDATED } from './data'

const TABS = [
  { id: 'todos', label: 'Todos de uma vez', icon: LayoutGrid },
  { id: 'comparar', label: 'Comparar dois', icon: GitCompareArrows },
]

export default function PesquisaConcorrentes() {
  const [tab, setTab] = useState('todos')

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#C1422A] flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C1422A]" />
            Estudo de concorrência · Mont'Serrat &amp; Bela Vista, Porto Alegre
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Onde o <span className="text-[#C1422A]">Synthè</span> está no mapa competitivo
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl text-sm md:text-base">
            Synthè (Plaenge · TGD, Rua Pedro Ivo 550) comparado aos 11 concorrentes diretos — mesma faixa de padrão e
            tipologia de 3 suítes, nos bairros Bela Vista, Moinhos de Vento, Mont'Serrat e Auxiliadora. Dados
            atualizados em {LAST_UPDATED}.
          </p>
        </Motion.header>

        <Motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <KpiStrip />
        </Motion.div>

        <div className="inline-flex bg-white border border-slate-200 rounded-xl p-1 mb-8 shadow-sm">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  active ? 'text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {active && (
                  <Motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: '#C1422A' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon size={15} className="relative z-10" />
                <span className="relative z-10">{t.label}</span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <Motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
          >
            {tab === 'todos' ? <AllView /> : <CompareView />}
          </Motion.div>
        </AnimatePresence>

        <div className="mt-10">
          <SourcesPanel />
        </div>

        <footer className="mt-8 text-xs text-slate-400 flex flex-wrap justify-between gap-2 pb-4">
          <span>Synthè · Plaenge · TGD — Rua Pedro Ivo, 550, Mont'Serrat, Porto Alegre</span>
          <span>Pesquisa de concorrência — uso interno</span>
        </footer>
      </div>
    </div>
  )
}
