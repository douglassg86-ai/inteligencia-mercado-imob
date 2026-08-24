import { CheckCircle2, Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { AMENITIES, ENGENHARIA_DIFERENCIAIS } from './mockData'
import { formatBRL, formatDate, formatPercent } from './formatters'

function nossoPrecoM2Medio(lancamento) {
  const validas = lancamento.tipologias.filter((t) => t.areaM2 > 0)
  if (!validas.length) return null
  const soma = validas.reduce((acc, t) => acc + t.preco / t.areaM2, 0)
  return soma / validas.length
}

export function KpiCards({ lancamento, competitors }) {
  const todasTipologias = competitors.flatMap((c) => c.tipologias)
  const precoM2Regiao = todasTipologias.length
    ? todasTipologias.reduce((acc, t) => acc + t.precoM2, 0) / todasTipologias.length
    : null
  const vsoMedio = competitors.length
    ? competitors.reduce((acc, c) => acc + c.vso, 0) / competitors.length
    : null
  const nossoPrecoM2 = nossoPrecoM2Medio(lancamento)
  const diffPercent =
    nossoPrecoM2 != null && precoM2Regiao ? ((nossoPrecoM2 - precoM2Regiao) / precoM2Regiao) * 100 : null

  const cards = [
    { label: 'Concorrentes mapeados', value: competitors.length, sub: `Raio de ${lancamento.raioKm} km` },
    { label: 'Preço/m² médio da região', value: precoM2Regiao ? formatBRL(Math.round(precoM2Regiao)) : '—' },
    {
      label: 'Nosso preço/m² vs. região',
      value: diffPercent != null ? `${diffPercent > 0 ? '+' : ''}${diffPercent.toFixed(1)}%` : '—',
      sub: diffPercent != null ? (diffPercent > 0 ? 'Acima da média' : 'Abaixo da média') : null,
      trend: diffPercent != null ? (diffPercent > 0 ? 'up' : 'down') : null,
    },
    { label: 'VSO médio da região', value: vsoMedio != null ? formatPercent(vsoMedio) : '—', sub: 'Vendas sobre oferta' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500">{c.label}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-2xl font-semibold text-slate-900">{c.value}</span>
            {c.trend === 'up' && <TrendingUp size={18} className="text-amber-600" />}
            {c.trend === 'down' && <TrendingDown size={18} className="text-emerald-600" />}
          </div>
          {c.sub && <div className="text-xs text-slate-400 mt-1">{c.sub}</div>}
        </div>
      ))}
    </div>
  )
}

export function ResumoConcorrentesTable({ competitors }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">Resumo por concorrente</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
              <th className="px-4 py-2 font-medium">Empreendimento</th>
              <th className="px-4 py-2 font-medium">Incorporadora</th>
              <th className="px-4 py-2 font-medium">Distância</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Lançamento</th>
              <th className="px-4 py-2 font-medium">Entrega</th>
              <th className="px-4 py-2 font-medium">VSO</th>
              <th className="px-4 py-2 font-medium">Fontes</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-2.5 font-medium text-slate-900">{c.nome}</td>
                <td className="px-4 py-2.5 text-slate-600">{c.incorporadora}</td>
                <td className="px-4 py-2.5 text-slate-600">{c.distanciaKm} km</td>
                <td className="px-4 py-2.5">
                  <span className="inline-block rounded-full bg-slate-100 text-slate-700 text-xs px-2 py-0.5">
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-slate-600">{formatDate(c.dataLancamento)}</td>
                <td className="px-4 py-2.5 text-slate-600">{formatDate(c.dataEntrega)}</td>
                <td className="px-4 py-2.5 text-slate-600">{formatPercent(c.vso)}</td>
                <td className="px-4 py-2.5 text-slate-500 text-xs">{c.fontesEncontradas.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function TipologiaComparativaTable({ lancamento, competitors }) {
  const nossasLinhas = lancamento.tipologias.map((t) => ({
    empreendimento: `${lancamento.nome} (nosso)`,
    label: `${t.dormitorios} dorm${t.dormitorios > 1 ? 's' : ''}${t.suites ? ` (${t.suites} suíte${t.suites > 1 ? 's' : ''})` : ''}`,
    areaM2: t.areaM2,
    precoM2: t.areaM2 > 0 ? Math.round(t.preco / t.areaM2) : null,
    precoMedio: t.preco,
    unidadesDisponiveis: null,
    estoquePercentual: null,
    nosso: true,
  }))

  const linhasConcorrentes = competitors.flatMap((c) =>
    c.tipologias.map((t) => ({
      empreendimento: c.nome,
      label: t.label,
      areaM2: t.areaM2,
      precoM2: t.precoM2,
      precoMedio: t.precoMedio,
      unidadesDisponiveis: t.unidadesDisponiveis,
      estoquePercentual: t.estoquePercentual,
      nosso: false,
    }))
  )

  const linhas = [...nossasLinhas, ...linhasConcorrentes]

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">Comparativo por tipologia</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Valor de m², valor médio, unidades disponíveis e estoque — nosso empreendimento em destaque.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
              <th className="px-4 py-2 font-medium">Empreendimento</th>
              <th className="px-4 py-2 font-medium">Tipologia</th>
              <th className="px-4 py-2 font-medium">Área (m²)</th>
              <th className="px-4 py-2 font-medium">Preço/m²</th>
              <th className="px-4 py-2 font-medium">Preço médio</th>
              <th className="px-4 py-2 font-medium">Unid. disponíveis</th>
              <th className="px-4 py-2 font-medium">Estoque</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l, idx) => (
              <tr
                key={idx}
                className={`border-b border-slate-50 last:border-0 ${l.nosso ? 'bg-amber-50' : ''}`}
              >
                <td className={`px-4 py-2.5 ${l.nosso ? 'font-semibold text-slate-900' : 'font-medium text-slate-900'}`}>
                  {l.empreendimento}
                </td>
                <td className="px-4 py-2.5 text-slate-600">{l.label}</td>
                <td className="px-4 py-2.5 text-slate-600">{l.areaM2}</td>
                <td className="px-4 py-2.5 text-slate-600">{l.precoM2 ? formatBRL(l.precoM2) : '—'}</td>
                <td className="px-4 py-2.5 text-slate-600">{l.precoMedio ? formatBRL(l.precoMedio) : '—'}</td>
                <td className="px-4 py-2.5 text-slate-600">{l.unidadesDisponiveis ?? '—'}</td>
                <td className="px-4 py-2.5 text-slate-600">
                  {l.estoquePercentual != null ? formatPercent(l.estoquePercentual) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MatrixTable({ title, subtitle, rows, competitors, getSet }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
              <th className="px-4 py-2 font-medium sticky left-0 bg-white">Item</th>
              {competitors.map((c) => (
                <th key={c.id} className="px-3 py-2 font-medium text-center whitespace-nowrap">
                  {c.nome}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-2 text-slate-700 sticky left-0 bg-white whitespace-nowrap">{row}</td>
                {competitors.map((c) => {
                  const has = getSet(c).includes(row)
                  return (
                    <td key={c.id} className="px-3 py-2 text-center">
                      {has ? (
                        <CheckCircle2 size={16} className="inline text-emerald-600" />
                      ) : (
                        <Minus size={16} className="inline text-slate-300" />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AmenitiesMatrix({ competitors }) {
  return (
    <MatrixTable
      title="Áreas comuns"
      subtitle="Comparativo de amenidades entre os concorrentes encontrados."
      rows={AMENITIES}
      competitors={competitors}
      getSet={(c) => c.areasComuns}
    />
  )
}

export function EngenhariaMatrix({ competitors }) {
  return (
    <MatrixTable
      title="Diferenciais de engenharia"
      subtitle="Extraído de memoriais descritivos e books — estrutura, esquadrias, acabamentos entregues."
      rows={ENGENHARIA_DIFERENCIAIS}
      competitors={competitors}
      getSet={(c) => c.diferenciaisEngenharia}
    />
  )
}

export function PromocoesTable({ competitors }) {
  const linhas = competitors.flatMap((c) => c.promocoes.map((p) => ({ ...p, empreendimento: c.nome })))

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">Promoções ativas</h3>
      </div>
      {linhas.length === 0 ? (
        <div className="px-4 py-6 text-sm text-slate-400">Nenhuma promoção identificada nos concorrentes mapeados.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                <th className="px-4 py-2 font-medium">Empreendimento</th>
                <th className="px-4 py-2 font-medium">Promoção</th>
                <th className="px-4 py-2 font-medium">Válido até</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((l, idx) => (
                <tr key={idx} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-slate-900">{l.empreendimento}</td>
                  <td className="px-4 py-2.5 text-slate-600">{l.descricao}</td>
                  <td className="px-4 py-2.5 text-slate-600">{formatDate(l.validade)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
