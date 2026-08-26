import { motion as Motion } from 'framer-motion'
import { SOURCES, LAST_UPDATED, DEVELOPMENTS } from '../data'

const DOT = {
  tabela: 'bg-emerald-500',
  orulo: 'bg-blue-500',
  rial: 'bg-violet-500',
  memorial: 'bg-amber-500',
  web: 'bg-slate-500',
}

export default function SourcesPanel() {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      className="bg-white rounded-2xl border border-slate-200 p-6"
    >
      <h3 className="text-base font-bold text-slate-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Fontes desta pesquisa
      </h3>
      <p className="text-sm text-slate-500 mb-5">
        Última atualização: {LAST_UPDATED}. Cada dado nas páginas anteriores carrega um selo indicando de onde veio —
        aqui está o que cada selo significa e quantos dos {DEVELOPMENTS.length} empreendimentos ele cobre.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(SOURCES).map(([key, s]) => {
          const count = DEVELOPMENTS.filter((d) => d.fontes.includes(key)).length
          return (
            <div key={key} className="flex gap-3 items-start p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${DOT[key]}`} />
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  {s.label} <span className="text-slate-400 font-normal">· {count}/{DEVELOPMENTS.length}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{s.detalhe}</div>
              </div>
            </div>
          )
        })}
      </div>
    </Motion.div>
  )
}
