import { Link } from 'react-router-dom'
import { ArrowRight, Building2 } from 'lucide-react'
import './squareGarden/dossie.css'

// Índice da repartição. Cada novo empreendimento entra aqui como um item.
const DOSSIES = [
  {
    slug: 'square-garden',
    nome: 'Square Garden',
    incorporadora: 'Melnick',
    bairro: 'Santa Cecília, Porto Alegre',
    posicao: '07/08/2026',
    resumo:
      '507 unidades em três torres sobre o maior food mall do país. Estoque, absorção por coluna de sacada, política comercial e mapa competitivo em 1,6 km.',
    kpis: [
      ['204', 'un. em estoque'],
      ['59,8%', 'VSO acumulada'],
      ['R$ 222,9 mi', 'VGV em estoque'],
    ],
    pronto: true,
  },
]

export default function DossiesIndex() {
  return (
    <div className="dossie">
      <div className="max-w-[1100px] mx-auto px-6 py-16">
        <div className="flex items-center gap-2.5 mb-7">
          <Building2 size={15} style={{ color: 'var(--accent)' }} />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
            Inteligência de Mercado
          </span>
        </div>

        <h1 className="text-[40px] md:text-[54px] font-bold leading-[0.96] mb-4">
          Dossiês de<br />Empreendimento
        </h1>
        <p className="text-[15px] text-[var(--ink-2)] leading-relaxed max-w-2xl mb-12">
          Um empreendimento por dossiê: tabela de disponibilidade dissecada unidade a unidade, condições comerciais,
          produto e posição competitiva. Todo indicador é calculado a partir da fonte, nunca digitado.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {DOSSIES.map((d) => (
            <Link
              key={d.slug}
              to={`/dossies/${d.slug}`}
              className="card p-6 group transition-shadow hover:shadow-[0_6px_24px_rgba(0,0,0,0.07)]"
            >
              <div className="flex items-start justify-between gap-4 mb-1">
                <h2 className="text-[22px] font-bold leading-tight">{d.nome}</h2>
                <ArrowRight
                  size={18}
                  className="flex-none mt-1.5 transition-transform group-hover:translate-x-1"
                  style={{ color: 'var(--accent)' }}
                />
              </div>
              <p className="text-[12px] text-[var(--muted)] mb-4">
                {d.incorporadora} · {d.bairro}
              </p>
              <p className="text-[13.5px] leading-relaxed text-[var(--ink-2)] mb-5">{d.resumo}</p>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
                {d.kpis.map(([v, k]) => (
                  <div key={k}>
                    <p className="mono text-[16px] font-bold leading-none mb-1">{v}</p>
                    <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-[var(--muted)]">{k}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[var(--muted)] mt-4">Posição de {d.posicao}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
