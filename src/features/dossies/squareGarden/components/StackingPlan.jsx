import { useState } from 'react'
import { stacking, absorcaoPorFinal, fmtBRL, fmtNum } from '../metrics'

const FACE = {
  sunrise: { 1: 'Leste', 2: 'Leste', 3: 'Leste', 4: 'Leste' },
  sunset: { 1: 'Oeste', 2: 'Oeste', 3: 'Oeste', 4: 'Oeste' },
}

function Torre({ id, nome, nota }) {
  const linhas = stacking(id)
  const abs = absorcaoPorFinal(id)
  const [hover, setHover] = useState(null)

  return (
    <div className="flex-1 min-w-[248px]">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-[15px] font-bold">{nome}</h3>
        <span className="mono text-[11px] text-[var(--muted)]">74 un.</span>
      </div>
      <p className="text-[11.5px] text-[var(--muted)] mb-4 leading-snug min-h-[32px]">{nota}</p>

      <div className="flex gap-2">
        {/* eixo dos pavimentos */}
        <div className="flex flex-col gap-[3px] pt-[18px]">
          {linhas.map((l) => (
            <span
              key={l.pav}
              className="mono text-[9px] text-[var(--muted)] h-[15px] leading-[15px] w-[18px] text-right"
            >
              {l.pav === 23 || l.pav === 5 || l.pav % 5 === 0 ? l.pav : ''}
            </span>
          ))}
        </div>

        <div>
          {/* cabeçalho dos finais */}
          <div className="grid grid-cols-4 gap-[3px] mb-[3px]" style={{ width: 4 * 34 + 3 * 3 }}>
            {[1, 2, 3, 4].map((f) => (
              <span key={f} className="mono text-[9.5px] text-[var(--muted)] text-center h-[15px] leading-[15px]">
                {String(f).padStart(2, '0')}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-[3px]">
            {linhas.map((l) => (
              <div key={l.pav} className="grid grid-cols-4 gap-[3px]" style={{ width: 4 * 34 + 3 * 3 }}>
                {l.celulas.map((c) => (
                  <div
                    key={c.final}
                    className="sg-cell h-[15px]"
                    data-state={!c.existe ? 'void' : c.disponivel ? 'free' : 'sold'}
                    onMouseEnter={() => c.existe && setHover({ ...c, pav: l.pav })}
                    onMouseLeave={() => setHover(null)}
                    title={c.existe ? `Unidade ${c.un}` : ''}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* absorção acumulada por coluna (final) */}
          <div className="grid grid-cols-4 gap-[3px] mt-2.5" style={{ width: 4 * 34 + 3 * 3 }}>
            {abs.map((a) => (
              <div key={a.final} className="text-center">
                <div className="h-[26px] flex items-end justify-center">
                  <div
                    className="w-full rounded-t-[2px]"
                    style={{ height: `${Math.max(2, (a.vso / 100) * 26)}px`, background: 'var(--sold)' }}
                  />
                </div>
                <span className="mono text-[9.5px] font-bold block mt-1" style={{ color: 'var(--sold)' }}>
                  {Math.round(a.vso)}%
                </span>
              </div>
            ))}
          </div>
          <p className="text-[9.5px] text-[var(--muted)] text-center mt-1" style={{ width: 4 * 34 + 3 * 3 }}>
            vendido por coluna
          </p>
        </div>
      </div>

      {/* painel do hover — altura fixa para não deslocar o layout */}
      <div className="mt-4 h-[64px]">
        {hover ? (
          <div className="card px-3 py-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="mono text-[13px] font-bold">Un. {hover.un}</span>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.08em]"
                style={{ color: hover.disponivel ? 'var(--stock)' : 'var(--sold)' }}
              >
                {hover.disponivel ? 'disponível' : 'vendida'}
              </span>
            </div>
            {hover.disponivel ? (
              <p className="mono text-[11px] text-[var(--ink-2)]">
                {fmtNum(hover.unidade.area, 2)} m² · {fmtBRL(hover.unidade.valor)} ·{' '}
                {fmtBRL(hover.unidade.m2)}/m²
              </p>
            ) : (
              <p className="text-[11px] text-[var(--muted)]">
                {hover.cobertura ? 'Cobertura' : hover.garden ? 'Garden' : 'Tipo'} · pav. {hover.pav} · sacada frente{' '}
                {FACE[id][hover.final]}
              </p>
            )}
          </div>
        ) : (
          <p className="text-[11.5px] text-[var(--muted)] italic pt-1">Passe o cursor sobre uma unidade.</p>
        )}
      </div>
    </div>
  )
}

export default function StackingPlan() {
  return (
    <div className="card p-5 md:p-7">
      <div className="flex flex-col md:flex-row gap-10">
        <Torre
          id="sunset"
          nome="Torre Sunset"
          nota="Sacadas na face Oeste — poente e vista para o Guaíba. Foi a Fase 1 do lançamento."
        />
        <div className="hidden md:block w-px" style={{ background: 'var(--line)' }} />
        <Torre
          id="sunrise"
          nome="Torre Sunrise"
          nota="Espelho exato da Sunset em produto e metragem, com as sacadas voltadas para Leste."
        />
      </div>
    </div>
  )
}
