import { SOURCES } from '../data'

const DOT = {
  tabela: 'bg-emerald-500',
  orulo: 'bg-blue-500',
  rial: 'bg-violet-500',
  memorial: 'bg-amber-500',
  web: 'bg-slate-500',
}

export default function SourceBadges({ fontes, size = 'sm' }) {
  if (!fontes || fontes.length === 0) return null
  const px = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
  return (
    <div className="flex flex-wrap gap-1">
      {fontes.map((f) => (
        <span
          key={f}
          title={SOURCES[f]?.detalhe}
          className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 font-medium ${px}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${DOT[f]}`} />
          {SOURCES[f]?.label ?? f}
        </span>
      ))}
    </div>
  )
}
