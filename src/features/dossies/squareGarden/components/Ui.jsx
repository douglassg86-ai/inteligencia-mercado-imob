import { motion as Motion } from 'framer-motion'

export function Section({ id, eyebrow, title, lead, children }) {
  return (
    <section id={id} className="scroll-mt-8 mb-16">
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4 }}
      >
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="text-[22px] md:text-[27px] font-bold leading-tight mb-2">{title}</h2>
        {lead && <p className="text-[14.5px] leading-relaxed text-[var(--ink-2)] max-w-3xl mb-7">{lead}</p>}
        {!lead && <div className="mb-7" />}
        {children}
      </Motion.div>
    </section>
  )
}

export function Kpi({ label, value, unit, sub, tone = 'ink' }) {
  const color = tone === 'accent' ? 'var(--accent)' : tone === 'stock' ? 'var(--stock)' : tone === 'sold' ? 'var(--sold)' : 'var(--ink)'
  return (
    <div className="card px-4 py-3.5">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--muted)] mb-1.5">{label}</p>
      <p className="mono text-[21px] font-bold leading-none" style={{ color }}>
        {value}
        {unit && <span className="text-[12px] font-medium ml-1 text-[var(--muted)]">{unit}</span>}
      </p>
      {sub && <p className="text-[11.5px] text-[var(--muted)] mt-1.5 leading-snug">{sub}</p>}
    </div>
  )
}

/** Barra de VSO: parte vendida sólida, estoque hachurado claro. */
export function VsoBar({ vso, height = 8 }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height, background: 'var(--stock-soft)' }}>
      <Motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${vso}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ height: '100%', background: 'var(--sold)' }}
      />
    </div>
  )
}

export function Tag({ children, tone = 'neutral' }) {
  const map = {
    neutral: ['#f2efe8', 'var(--ink-2)'],
    accent: ['var(--accent-soft)', 'var(--accent)'],
    stock: ['var(--stock-soft)', 'var(--stock)'],
    sold: ['var(--sold-soft)', 'var(--sold)'],
  }
  const [bg, fg] = map[tone]
  return (
    <span
      className="inline-block text-[10.5px] font-bold uppercase tracking-[0.08em] px-2 py-[3px] rounded"
      style={{ background: bg, color: fg }}
    >
      {children}
    </span>
  )
}

/** Caixa de leitura — a conclusão que o gráfico ao lado sustenta. */
export function Insight({ children, title = 'Leitura' }) {
  return (
    <div
      className="rounded-xl px-5 py-4 border"
      style={{ background: 'var(--accent-soft)', borderColor: '#dcd0ea' }}
    >
      <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: 'var(--accent)' }}>
        {title}
      </p>
      <p className="text-[13.5px] leading-relaxed text-[var(--ink)]">{children}</p>
    </div>
  )
}

export function Legend({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {items.map(([color, label, outline]) => (
        <span key={label} className="flex items-center gap-2 text-[11.5px] text-[var(--ink-2)] font-medium">
          <span
            className="w-3 h-3 rounded-[3px] flex-none"
            style={{ background: color, border: outline ? `1px solid ${outline}` : 'none' }}
          />
          {label}
        </span>
      ))}
    </div>
  )
}
