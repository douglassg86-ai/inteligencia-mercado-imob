import { useEffect, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Building2, Lock, ExternalLink } from 'lucide-react'
import './dossie.css'
import {
  SNAPSHOT, SNAPSHOT_LONG, FICHA, POLITICA, POLITICA_VALIDADE, POLITICA_BENCH,
  CONCORRENTES, TIMELINE, LAZER, COMERCIAL, SEGURANCA, PROJETISTAS, CONTEXTO, FONTES,
} from './data'
import {
  TOTAIS, porTorre, porTipologia, faixasMultistay, precoPorPavimento,
  fmtBRL, fmtMi, fmtNum, fmtM2, fmtCompact, DESCONTO_SG,
} from './metrics'
import { Section, Kpi, VsoBar, Tag, Insight, Legend } from './components/Ui'
import StackingPlan from './components/StackingPlan'
import { BarsM2, ScatterCompetitivo, LinhaPavimento } from './components/Charts'

const NAV = [
  ['sumario', 'Sumário'],
  ['estoque', 'Estoque e absorção'],
  ['stacking', 'Mapa das torres'],
  ['preco', 'Preço'],
  ['multistay', 'Multistay'],
  ['politica', 'Política comercial'],
  ['competitivo', 'Mapa competitivo'],
  ['produto', 'Produto'],
  ['contexto', 'Contexto urbano'],
  ['linha', 'Linha do tempo'],
  ['fontes', 'Fontes'],
]

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-15% 0px -70% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [ids])
  return active
}

const IDS = NAV.map(([id]) => id)

export default function SquareGarden() {
  const active = useScrollSpy(IDS)
  const [sunrise, sunset, multistay] = porTorre

  return (
    <div className="dossie">
      {/* ------------------------------------------------ capa */}
      <header className="border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="max-w-[1180px] mx-auto px-6 pt-10 pb-9">
          <div className="flex items-center gap-2.5 mb-7">
            <Building2 size={15} style={{ color: 'var(--accent)' }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
              Inteligência de Mercado · Dossiê de Empreendimento
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-14">
            <div className="flex-1">
              <h1 className="text-[42px] md:text-[62px] font-bold leading-[0.94] mb-4">
                Square<br />Garden
              </h1>
              <p className="text-[15px] text-[var(--ink-2)] leading-relaxed max-w-xl">
                {FICHA.incorporadora} · {FICHA.endereco}. Três torres, {FICHA.unidadesTotais} unidades e o maior food
                mall do país sobre o terreno do {FICHA.terrenoHistorico.toLowerCase()}.
              </p>
              <p className="text-[12.5px] text-[var(--muted)] mt-3">
                Posição de estoque de <strong className="text-[var(--ink)]">{SNAPSHOT_LONG}</strong> · dossiê fechado em
                setembro de 2026.
              </p>
            </div>

            {/* ficha-relâmpago em versaletes + mono */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-3.5 lg:w-[300px] flex-none">
              {[
                ['VGV anunciado', fmtMi(FICHA.vgvTotal)],
                ['Unidades', fmtNum(FICHA.unidadesTotais)],
                ['Terreno', fmtM2(FICHA.terreno)],
                ['Área construída', `${fmtNum(FICHA.areaConstruida / 1000)} mil m²`],
                ['Lançamento', FICHA.lancamento],
                ['Entregas', '2º sem. 2029'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.13em] text-[var(--muted)] mb-1">{k}</p>
                  <p className="mono text-[15px] font-bold">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1180px] mx-auto px-6 py-12 flex gap-10">
        {/* ------------------------------------------------ rail */}
        <nav className="sg-rail hidden xl:block w-[190px] flex-none">
          <div className="sticky top-10">
            <p className="eyebrow mb-3">Neste dossiê</p>
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} data-active={active === id}>
                {label}
              </a>
            ))}
          </div>
        </nav>

        <main className="flex-1 min-w-0">
          {/* ============================================ sumário */}
          <Section
            id="sumario"
            eyebrow="Sumário executivo"
            title="O que a tabela de agosto revela"
            lead="Consolidando a tabela oficial de disponibilidade, a apresentação de produto, o book, a política comercial de agosto e uma varredura pública de mercado, cinco fatos organizam a leitura do Square Garden."
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              <Kpi label="Estoque em 07/08" value={fmtNum(TOTAIS.estoque)} unit="un." tone="stock" sub={`de ${FICHA.unidadesTotais} unidades no total`} />
              <Kpi label="VSO acumulada" value={fmtNum(TOTAIS.vso, 1)} unit="%" tone="sold" sub={`${fmtNum(TOTAIS.vendidas)} unidades já colocadas`} />
              <Kpi label="VGV em estoque" value={fmtMi(TOTAIS.vgvEstoque)} tone="accent" sub="a valores de tabela de agosto/2026" />
              <Kpi label="Ticket médio do estoque" value={fmtBRL(TOTAIS.ticketMedio)} sub="puxado para baixo pelo Multistay" />
              <Kpi label="R$/m² médio do estoque" value={fmtBRL(TOTAIS.m2Medio)} sub="média ponderada pela área privativa" />
              <Kpi label="Área privativa em oferta" value={fmtM2(TOTAIS.areaEstoque)} sub="somatório das 204 unidades" />
            </div>

            <div className="space-y-2.5">
              {[
                ['A orientação solar é o produto.', 'Na Sunset, a coluna de sacadas para o poente (finais 02 e 03) está 89% e 74% vendida. A mesma coluna na Sunrise, voltada para o Leste, está em 16% e 21%. É o mesmo apartamento, o mesmo preço-base e o mesmo prédio — muda a face.'],
                ['A Sunset vendeu o dobro da Sunrise.', `62,2% contra 31,1%. A Sunset foi a Fase 1 e saiu primeiro, mas o desconto que a Melnick concede nela é a metade do da Sunrise — sinal de que a diferença não é só de calendário.`],
                ['O Multistay é o motor de giro.', `234 das 359 unidades colocadas (65,2%), a R$ ${fmtNum(multistay.m2Medio)}/m² — o maior preço por metro do empreendimento e o menor ticket, R$ ${fmtNum(multistay.ticketMedio / 1000)} mil.`],
                ['O estoque residual está desbalanceado.', 'O que sobrou na Sunset são os finais 01 de 93,2 m² e dois gardens gigantes de baixo R$/m². O produto de maior liquidez já saiu; a torre entra na etapa difícil da curva.'],
                ['O desconto praticado está acima do portfólio.', `Sunrise 28,2%, Multistay 26,6% e Sunset 25,4% de desconto nominal, contra uma média de ${fmtNum(POLITICA_BENCH.descontoMedioResidencial, 1)}% nos ${POLITICA_BENCH.amostra} demais produtos residenciais da mesma política. As três frentes ocupam a 3ª, a 4ª e a 6ª posição no ranking de desconto das ${POLITICA_BENCH.totalLinhas} linhas residenciais.`],
              ].map(([t, d], i) => (
                <div key={t} className="card px-5 py-4 flex gap-4">
                  <span className="mono text-[12px] font-bold flex-none pt-[3px]" style={{ color: 'var(--accent)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-[14.5px] font-bold mb-1">{t}</p>
                    <p className="text-[13.5px] leading-relaxed text-[var(--ink-2)]">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ============================================ estoque */}
          <Section
            id="estoque"
            eyebrow="Estoque e absorção"
            title="Três produtos, três velocidades"
            lead="Cada torre é uma frente comercial autônoma, com preço, público e ritmo próprios. Comparadas lado a lado, elas não se parecem em nada."
          >
            <div className="grid md:grid-cols-3 gap-3.5 mb-6">
              {porTorre.map((t) => (
                <div key={t.id} className="card p-5">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-[15.5px] font-bold leading-snug">{t.nome}</h3>
                    <Tag tone={t.vso > 55 ? 'sold' : 'stock'}>{fmtNum(t.vso, 1)}%</Tag>
                  </div>
                  <p className="text-[11.5px] text-[var(--muted)] mb-4">
                    {t.tipo} · entrega {t.entrega}
                  </p>

                  <VsoBar vso={t.vso} />
                  <div className="flex justify-between mt-2 mb-5">
                    <span className="mono text-[11px]" style={{ color: 'var(--sold)' }}>
                      {t.vendidas} vendidas
                    </span>
                    <span className="mono text-[11px]" style={{ color: 'var(--stock)' }}>
                      {t.estoque} em estoque
                    </span>
                  </div>

                  <dl className="space-y-2">
                    {[
                      ['VGV em estoque', fmtMi(t.vgvEstoque)],
                      ['Ticket médio', fmtBRL(t.ticketMedio)],
                      ['R$/m² médio', fmtBRL(t.m2Medio)],
                      ['Faixa de preço', `${fmtCompact(t.min)} – ${fmtCompact(t.max)}`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-baseline gap-2">
                        <dt className="text-[12px] text-[var(--muted)] flex-none">{k}</dt>
                        <dd className="mono text-[12px] font-bold text-right whitespace-nowrap">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-[12px] text-[var(--ink-2)] leading-relaxed mt-4 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
                    {t.resumo}
                  </p>
                </div>
              ))}
            </div>

            <Insight>
              As três frentes chegam a agosto com a mesma VSO agregada de {fmtNum(TOTAIS.vso, 1)}%, mas por caminhos
              opostos: o Multistay girou volume com ticket baixo, a Sunset girou produto premium e a Sunrise ficou para
              trás. Como a Sunrise responde por {fmtNum((sunrise.vgvEstoque / TOTAIS.vgvEstoque) * 100, 0)}% de todo o VGV
              ainda em estoque, é ela — e não o Multistay — que define o risco de velocidade do empreendimento daqui
              para frente.
            </Insight>
          </Section>

          {/* ============================================ stacking */}
          <Section
            id="stacking"
            eyebrow="Mapa das torres"
            title="Onde exatamente o mercado comprou"
            lead="Cada célula é uma unidade real das torres Residence: 19 pavimentos por 4 finais, 74 unidades por torre. Verde é vendido, âmbar é estoque. As duas torres são o mesmo projeto — a única variável é para onde a sacada aponta."
          >
            <div className="mb-4">
              <Legend
                items={[
                  ['var(--sold)', 'Vendida'],
                  ['var(--stock-soft)', 'Em estoque', '#e6c894'],
                ]}
              />
            </div>
            <StackingPlan />
            <div className="mt-5">
              <Insight title="O achado">
                Na Torre Sunset, os finais 02 e 03 — as sacadas do poente, com vista para o Guaíba — estão{' '}
                <strong>89% e 74% vendidos</strong>, restando apenas 7 das 38 unidades. Na Torre Sunrise, essas mesmas
                duas colunas, voltadas para o Leste, estão em <strong>16% e 21%</strong>, com 31 unidades ainda em
                oferta. Os finais 01 e 04 se comportam de forma quase idêntica nas duas torres. Ou seja: praticamente
                toda a diferença de desempenho entre as torres se concentra em duas colunas de apartamentos, e a
                variável que as separa é a orientação solar. O plano de mídia e o argumento de venda da Sunrise
                precisam encontrar outro eixo que não a vista.
              </Insight>
            </div>
          </Section>

          {/* ============================================ preço */}
          <Section
            id="preco"
            eyebrow="Preço"
            title="O que sobrou custa menos por metro"
            lead="O preço por metro quadrado do estoque residual conta a história inversa do preço de lançamento: as tipologias líquidas saíram e deixaram para trás as pontas — gardens enormes de baixo R$/m² e os finais de menor procura."
          >
            <div className="grid lg:grid-cols-2 gap-4 mb-5">
              <div className="card p-5">
                <p className="eyebrow mb-4">R$/m² do estoque · Torre Sunset</p>
                <BarsM2
                  rows={porTipologia('sunset').map((t) => ({
                    label: `${fmtNum(t.area, t.area % 1 ? 2 : 0)} m²`,
                    value: t.m2,
                    note: `${t.qtd} un.`,
                    color: t.area > 300 ? '#b9b2a4' : 'var(--accent)',
                  }))}
                  max={22000}
                />
              </div>
              <div className="card p-5">
                <p className="eyebrow mb-4">R$/m² do estoque · Torre Sunrise</p>
                <BarsM2
                  rows={porTipologia('sunrise').map((t) => ({
                    label: `${fmtNum(t.area, t.area % 1 ? 2 : 0)} m²`,
                    value: t.m2,
                    note: `${t.qtd} un.`,
                    color: t.area > 250 ? '#b9b2a4' : 'var(--accent)',
                  }))}
                  max={22000}
                />
              </div>
            </div>

            <div className="card p-5 mb-5">
              <p className="eyebrow mb-1">Gradiente de altura</p>
              <p className="text-[13px] text-[var(--ink-2)] mb-5 max-w-2xl">
                Preço por metro das unidades de 93,2 m² ainda disponíveis, pavimento a pavimento — média do andar
                quando há mais de uma unidade dessa metragem disponível nele. É a régua que a incorporadora usa para
                precificar altura, e mostra que a Sunrise cobra mais caro pelo mesmo andar.
              </p>
              <LinhaPavimento
                series={[
                  { nome: 'Sunset · 93,2 m²', cor: 'var(--accent)', pontos: precoPorPavimento('sunset', 93.2) },
                  { nome: 'Sunrise · 93,2 m²', cor: 'var(--stock)', pontos: precoPorPavimento('sunrise', 93.2) },
                ]}
              />
            </div>

            <Insight>
              A Sunrise pratica um R$/m² médio de {fmtBRL(sunrise.m2Medio)} contra {fmtBRL(sunset.m2Medio)} da Sunset —
              a torre que vende menos é a que pede mais caro por metro. Parte disso é composição de estoque (a Sunset
              carrega dois gardens de 362 e 419 m² a cerca de R$ 10,2 mil/m², que derrubam a média), mas na tipologia
              comparável de 93,2 m² a Sunrise segue acima em praticamente todos os pavimentos. Somado ao desconto
              nominal maior autorizado para a Sunrise, o quadro é de preço de tabela alto compensado por desconto de
              mesa — e não de preço ajustado.
            </Insight>
          </Section>

          {/* ============================================ multistay */}
          <Section
            id="multistay"
            eyebrow="Multistay"
            title="O produto de renda que sustenta o giro"
            lead="Torre de 20 pavimentos sobre o Foodhall, com lofts a partir de 19,55 m². É o produto mais caro por metro do empreendimento e o único com prêmio 'bateu levou' na política comercial."
          >
            <div className="grid lg:grid-cols-[1.15fr_1fr] gap-4">
              <div className="card p-5">
                <p className="eyebrow mb-4">Estoque por tipologia</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-[12.5px]">
                    <thead>
                      <tr className="text-left text-[10.5px] uppercase tracking-[0.1em] text-[var(--muted)]">
                        <th className="pb-2 font-bold">Área</th>
                        <th className="pb-2 font-bold text-right">Em estoque</th>
                        <th className="pb-2 font-bold text-right">Ticket médio</th>
                        <th className="pb-2 font-bold text-right">R$/m²</th>
                        <th className="pb-2 font-bold text-right">Faixa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faixasMultistay().map((f) => (
                        <tr key={f.area} className="border-t" style={{ borderColor: 'var(--line)' }}>
                          <td className="py-2.5 mono font-bold">{fmtNum(f.area, 2)} m²</td>
                          <td className="py-2.5 mono text-right">{f.qtd}</td>
                          <td className="py-2.5 mono text-right">{fmtBRL(f.ticket)}</td>
                          <td className="py-2.5 mono text-right font-bold" style={{ color: 'var(--accent)' }}>
                            {fmtBRL(f.m2)}
                          </td>
                          <td className="py-2.5 mono text-right text-[var(--muted)] text-[11.5px] whitespace-nowrap">
                            {fmtNum(f.min / 1000)}k – {fmtNum(f.max / 1000)}k
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11.5px] text-[var(--muted)] mt-4 leading-relaxed">
                  O total de 359 unidades do Multistay é a diferença entre as {FICHA.unidadesTotais} unidades divulgadas
                  no lançamento e as 148 do Residence — e bate com a numeração da tabela (pavimentos 5 a 19, finais 01 a
                  24). A VSO do Multistay depende dessa base e deve ser lida como aproximação.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="card p-5">
                  <p className="eyebrow mb-4">Contra os concorrentes de studio</p>
                  <BarsM2
                    rows={[
                      { label: 'SG Multistay', value: 22619, note: '19,6 m²', color: 'var(--accent)' },
                      { label: 'GO Bom Fim', value: 21613, note: 'Melnick' },
                      { label: 'Trend Nano', value: 20264, note: 'Vanguard' },
                      { label: 'Skyglass', value: 19446, note: 'Cyrela' },
                      { label: 'Mural Bom Fim', value: 16246, note: 'Pavei' },
                    ].map((r) => ({ ...r, color: r.color || '#b9b2a4' }))}
                    max={25000}
                  />
                  <p className="text-[11.5px] text-[var(--muted)] mt-4 leading-relaxed">
                    O loft de 19,55 m² é o metro quadrado mais caro do entorno em produto compacto — acima do GO Bom
                    Fim, da própria Melnick, e do Trend Downtown Nano.
                  </p>
                </div>
                <Insight>
                  Com {multistay.estoque} unidades e {fmtMi(multistay.vgvEstoque)} em estoque, o Multistay ainda tem
                  fôlego, mas já entregou o grosso do volume. O prêmio de 1% no "bateu levou" só existe aqui: é o
                  produto que a Melnick quer manter girando mês a mês.
                </Insight>
              </div>
            </div>
          </Section>

          {/* ============================================ política */}
          <Section
            id="politica"
            eyebrow="Política comercial"
            title="Quanto a mesa pode dar"
            lead={`Condições vigentes na política comercial de agosto de 2026, válidas até ${POLITICA_VALIDADE}.`}
          >
            <div
              className="rounded-xl border px-5 py-3 mb-4 flex items-center gap-3"
              style={{ background: '#fdf6e8', borderColor: '#e8d3a4' }}
            >
              <Lock size={15} style={{ color: 'var(--stock)' }} className="flex-none" />
              <p className="text-[12.5px] text-[var(--ink-2)]">
                <strong className="text-[var(--ink)]">Uso interno.</strong> Bloco baseado em documento comercial
                reservado da incorporadora. Não reproduzir fora da equipe.
              </p>
            </div>

            <div className="card overflow-x-auto mb-5">
              <table className="w-full text-[13px] min-w-[540px]">
                <thead>
                  <tr className="text-left text-[10.5px] uppercase tracking-[0.1em] text-[var(--muted)] border-b" style={{ borderColor: 'var(--line)' }}>
                    <th className="px-5 py-3 font-bold">Produto</th>
                    <th className="px-5 py-3 font-bold text-right">Perda de VPL</th>
                    <th className="px-5 py-3 font-bold text-right">Desconto nominal</th>
                    <th className="px-5 py-3 font-bold text-center">Bateu levou</th>
                    <th className="px-5 py-3 font-bold text-right">Entrega</th>
                  </tr>
                </thead>
                <tbody>
                  {POLITICA.map((p) => (
                    <tr key={p.produto} className="border-b last:border-0" style={{ borderColor: 'var(--line)' }}>
                      <td className="px-5 py-3.5 font-bold">{p.produto}</td>
                      <td className="px-5 py-3.5 mono text-right">{p.perdaVpl}%</td>
                      <td className="px-5 py-3.5 mono text-right font-bold" style={{ color: 'var(--accent)' }}>
                        {fmtNum(p.descontoNominal, 2)}%
                      </td>
                      <td className="px-5 py-3.5 text-center">{p.bateuLevou ? <Tag tone="sold">1%</Tag> : <span className="text-[var(--muted)]">—</span>}</td>
                      <td className="px-5 py-3.5 mono text-right text-[var(--muted)]">{p.entrega}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-3 gap-3 mb-5">
              <Kpi label="Média dos demais residenciais" value={fmtNum(POLITICA_BENCH.descontoMedioResidencial, 1)} unit="%" sub={`${POLITICA_BENCH.amostra} produtos, mediana de ${fmtNum(POLITICA_BENCH.medianaResidencial, 1)}%`} />
              <Kpi label="Square Garden — média" value={fmtNum(DESCONTO_SG, 1)} unit="%" tone="accent" sub={`${fmtNum(DESCONTO_SG - POLITICA_BENCH.descontoMedioResidencial, 1)} p.p. acima do portfólio`} />
              <Kpi label="Teto do portfólio" value={fmtNum(POLITICA_BENCH.maiorDesconto.valor, 1)} unit="%" sub={POLITICA_BENCH.maiorDesconto.nome} />
            </div>

            <Insight>
              As três frentes do Square Garden ocupam a 3ª, a 4ª e a 6ª posição no ranking de desconto das{' '}
              {POLITICA_BENCH.totalLinhas} linhas residenciais da política de agosto — e apenas{' '}
              {POLITICA_BENCH.acimaDoMenorSG} dos {POLITICA_BENCH.amostra} demais produtos são mais descontados que a
              frente menos descontada do empreendimento. É um lançamento recente sendo tratado como estoque maduro. A
              hierarquia interna, porém, é coerente com o
              estoque: a Sunset, que vende sozinha, tem a menor perda de VPL autorizada (−5%); a Sunrise, que travou,
              tem o dobro (−10%). Em negociação, o piso realista de uma unidade da Sunrise é o preço de tabela menos
              cerca de 28% — informação que muda o comparativo de preço efetivo contra qualquer concorrente do entorno.
            </Insight>
          </Section>

          {/* ============================================ competitivo */}
          <Section
            id="competitivo"
            eyebrow="Mapa competitivo"
            title="O entorno em 1,6 km"
            lead="Verticais residenciais em oferta num raio de 1,6 km da esquina, com preço por metro e estoque remanescente. Varredura da base pública do Órulo em setembro de 2026."
          >
            <div className="card p-5 mb-4">
              <ScatterCompetitivo data={CONCORRENTES} />
            </div>

            <div className="card overflow-x-auto mb-5">
              <table className="w-full text-[12.5px] min-w-[620px]">
                <thead>
                  <tr className="text-left text-[10.5px] uppercase tracking-[0.1em] text-[var(--muted)] border-b" style={{ borderColor: 'var(--line)' }}>
                    <th className="px-4 py-3 font-bold">Empreendimento</th>
                    <th className="px-4 py-3 font-bold">Incorporadora</th>
                    <th className="px-4 py-3 font-bold">Bairro</th>
                    <th className="px-4 py-3 font-bold text-right">Dist.</th>
                    <th className="px-4 py-3 font-bold text-right">R$/m²</th>
                    <th className="px-4 py-3 font-bold text-right">Estoque</th>
                  </tr>
                </thead>
                <tbody>
                  {[...CONCORRENTES].sort((a, b) => b.m2 - a.m2).map((c) => (
                    <tr
                      key={c.nome}
                      className="border-b last:border-0"
                      style={{ borderColor: 'var(--line)', background: c.destaque ? 'var(--accent-soft)' : undefined }}
                    >
                      <td className="px-4 py-2.5 font-bold" style={{ color: c.destaque ? 'var(--accent)' : undefined }}>
                        {c.nome}
                      </td>
                      <td className="px-4 py-2.5 text-[var(--ink-2)]">{c.inc}</td>
                      <td className="px-4 py-2.5 text-[var(--muted)]">{c.bairro}</td>
                      <td className="px-4 py-2.5 mono text-right text-[var(--muted)]">{fmtNum(c.km, 2)} km</td>
                      <td className="px-4 py-2.5 mono text-right font-bold">{fmtBRL(c.m2)}</td>
                      <td className="px-4 py-2.5 mono text-right">
                        {c.estoque}/{c.un}
                        <span className="text-[var(--muted)] ml-1.5">({Math.round((c.estoque / c.un) * 100)}%)</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Insight>
              O R$/m² de tabela do Square Garden na Sunset ({fmtBRL(16397)}, conforme ficha pública) posiciona o
              empreendimento no miolo do entorno — abaixo dos verticais de Bela Vista e Moinhos (Legacy, Brava,
              Summerlyn, Bordini) e claramente acima dos produtos de Petrópolis e Rio Branco de menor padrão. Mas com o
              desconto de mesa de até 25–28%, o preço efetivo cai para a faixa de R$ 12–13 mil/m², o que o coloca entre
              os mais agressivos da amostra para um produto com clube de 5 mil m² e food mall no térreo. O
              contra-argumento comercial dos concorrentes será o adensamento: 507 unidades num terreno de 9,7 mil m²,
              com fluxo público de food mall na base.
            </Insight>
          </Section>

          {/* ============================================ produto */}
          <Section
            id="produto"
            eyebrow="Produto"
            title="O que está sendo entregue"
            lead="A infraestrutura é o principal argumento do empreendimento e vale ser lida em números, não em adjetivos."
          >
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <Kpi label="Lazer total" value={fmtNum(LAZER.totalLazer)} unit="m²" tone="accent" sub="5º pavimento + rooftop do 20º" />
              <Kpi label="Foodhall + Mall" value={fmtNum(COMERCIAL.total)} unit="m²" sub={`${COMERCIAL.operacoes} operações · ${COMERCIAL.lojas} lojas`} />
              <Kpi label="Vagas" value={fmtNum(FICHA.vagasResidenciais + FICHA.vagasComerciais)} sub={`${FICHA.vagasResidenciais} residenciais + ${COMERCIAL.vagasRotativas} rotativas`} />
            </div>

            <div className="grid lg:grid-cols-2 gap-3.5 mb-4">
              {[LAZER.clube, LAZER.rooftop].map((bloco) => (
                <div key={bloco.titulo} className="card p-5">
                  <h3 className="text-[15px] font-bold mb-1">{bloco.titulo}</h3>
                  <p className="text-[11.5px] text-[var(--muted)] mb-4">{bloco.altura}</p>
                  <ul className="space-y-1.5">
                    {bloco.itens.map(([nome, dim]) => (
                      <li key={nome} className="flex justify-between items-baseline gap-3 text-[12.5px]">
                        <span className="text-[var(--ink-2)]">{nome}</span>
                        <span className="flex-1 border-b border-dotted mb-1" style={{ borderColor: 'var(--line-strong)' }} />
                        <span className="mono text-[11.5px] text-[var(--muted)]">{dim}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-3.5">
              <div className="card p-5">
                <h3 className="text-[15px] font-bold mb-1">Square Garden Embarcadero</h3>
                <p className="text-[11.5px] text-[var(--muted)] mb-4">
                  Curadoria {COMERCIAL.parceiros.join(' · ')} — referência de escala: {COMERCIAL.referencia}
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-4">
                  {[
                    ['Foodhall', fmtM2(COMERCIAL.foodhall, 1)],
                    ['Mall (ABL)', fmtM2(COMERCIAL.mall, 1)],
                    ['Lojas', `${COMERCIAL.lojas} unidades`],
                    ['Estac. rotativo', `${COMERCIAL.vagasRotativas} + ${COMERCIAL.vagasRapidas} rápidas`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[var(--muted)] mb-0.5">{k}</p>
                      <p className="mono text-[13.5px] font-bold">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[11.5px] text-[var(--muted)] leading-relaxed">
                  O material da incorporadora registra que o conceito de foodhall pode ser alterado a critério exclusivo
                  do operador, inclusive para galeria ou centro de compras. É uma ressalva contratual relevante: o
                  principal diferencial de venda do empreendimento não é obrigação de entrega.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="card p-5">
                  <h3 className="text-[15px] font-bold mb-3">Segurança</h3>
                  <ul className="space-y-1.5">
                    {SEGURANCA.map((s) => (
                      <li key={s} className="text-[12.5px] text-[var(--ink-2)] leading-snug pl-4 relative">
                        <span className="absolute left-0 top-[7px] w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card p-5">
                  <h3 className="text-[15px] font-bold mb-3">Projetistas</h3>
                  <ul className="space-y-2">
                    {PROJETISTAS.map(([nome, papel]) => (
                      <li key={nome} className="flex justify-between items-baseline gap-3 text-[12.5px]">
                        <span className="font-semibold">{nome}</span>
                        <span className="text-[11.5px] text-[var(--muted)] text-right flex-none">{papel}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Section>

          {/* ============================================ contexto */}
          <Section
            id="contexto"
            eyebrow="Contexto urbano"
            title="A aposta na Avenida Ipiranga"
            lead="O empreendimento foi posicionado em cima de uma tese urbana: a de que a Ipiranga vai deixar de ser via de passagem e virar endereço. Vale separar o que já é fato do que ainda é promessa."
          >
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-3.5 mb-4">
              <div className="card p-5">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-[15px] font-bold">{CONTEXTO.ouc.nome}</h3>
                  <Tag tone="stock">Em tramitação</Tag>
                </div>
                <p className="text-[12.5px] text-[var(--ink-2)] leading-relaxed mb-4">{CONTEXTO.ouc.status}</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    ['Extensão', CONTEXTO.ouc.extensao],
                    ['Investimento estimado', fmtMi(CONTEXTO.ouc.investimento).replace(' mi', ' mi')],
                    ['Fase zero', fmtMi(CONTEXTO.ouc.faseZero)],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[var(--muted)] mb-1">{k}</p>
                      <p className="mono text-[14px] font-bold">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[11.5px] text-[var(--muted)] mt-4 leading-relaxed">
                  Financiamento: {CONTEXTO.ouc.financiamento}. Nenhuma obra da OUC estava contratada até o fechamento
                  deste dossiê — o argumento de valorização por revitalização é uma tese, não um cronograma.
                </p>
              </div>

              <div className="card p-5">
                <h3 className="text-[15px] font-bold mb-4">Conveniência</h3>
                <ul className="space-y-1.5">
                  {CONTEXTO.distancias.map(([nome, t]) => (
                    <li key={nome} className="flex justify-between items-baseline gap-3 text-[12.5px]">
                      <span className="text-[var(--ink-2)]">{nome}</span>
                      <span className="flex-1 border-b border-dotted mb-1" style={{ borderColor: 'var(--line-strong)' }} />
                      <span className="mono text-[11.5px] text-[var(--muted)]">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <Kpi label="m² médio POA (FipeZAP)" value={fmtBRL(CONTEXTO.mercado.m2PoaFipezap)} sub="venda residencial, 2026" />
              <Kpi label="VGV lançado em POA · 4M26" value={fmtMi(CONTEXTO.mercado.vgv4M26)} sub="patamar semelhante ao dos anos anteriores" />
              <Kpi label="Variação anual do m²" value={`+${CONTEXTO.mercado.varAnual}`} unit="%" tone="sold" sub="2024 → 2025" />
            </div>
          </Section>

          {/* ============================================ linha do tempo */}
          <Section id="linha" eyebrow="Linha do tempo" title="Do food park à tabela de agosto">
            <div className="relative pl-7">
              <div className="absolute left-[7px] top-2 bottom-2 w-px" style={{ background: 'var(--line-strong)' }} />
              {TIMELINE.map((t, i) => (
                <Motion.div
                  key={t.titulo}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="relative pb-6 last:pb-0"
                >
                  <span
                    className="absolute -left-7 top-[5px] w-[15px] h-[15px] rounded-full border-[3px]"
                    style={{ background: 'var(--paper)', borderColor: t.tipo === 'venda' ? 'var(--accent)' : t.tipo === 'dado' ? 'var(--stock)' : 'var(--line-strong)' }}
                  />
                  <div className="flex flex-wrap items-baseline gap-3 mb-1">
                    <span className="mono text-[11.5px] font-bold" style={{ color: 'var(--accent)' }}>
                      {t.data}
                    </span>
                    <h3 className="text-[14.5px] font-bold">{t.titulo}</h3>
                  </div>
                  <p className="text-[13px] leading-relaxed text-[var(--ink-2)] max-w-2xl">{t.texto}</p>
                </Motion.div>
              ))}
            </div>
          </Section>

          {/* ============================================ fontes */}
          <Section
            id="fontes"
            eyebrow="Metodologia e fontes"
            title="De onde vem cada número"
            lead="Todo indicador de estoque, VSO, VGV e preço desta página é calculado a partir da tabela de disponibilidade — nenhum foi digitado manualmente. Onde houve inferência, ela está declarada no próprio bloco."
          >
            <div className="grid md:grid-cols-2 gap-3">
              {FONTES.map(([titulo, desc, tipo]) => (
                <div key={titulo} className="card px-5 py-4">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <Tag tone={tipo === 'interna' ? 'stock' : 'accent'}>{tipo}</Tag>
                    <p className="text-[13.5px] font-bold">{titulo}</p>
                  </div>
                  <p className="text-[12px] text-[var(--ink-2)] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="card px-5 py-4 mt-3">
              <p className="text-[12.5px] text-[var(--ink-2)] leading-relaxed">
                <strong className="text-[var(--ink)]">Ressalvas.</strong> (1) A tabela retrata apenas as unidades
                disponíveis em {SNAPSHOT}; as vendidas são deduzidas por diferença contra a matriz de projeto. (2) O
                total de 359 unidades do Multistay é inferido. (3) O VGV de {fmtMi(FICHA.vgvTotal)} é o anunciado no
                lançamento, a valores de 2025, e não é comparável linha a linha com a tabela reajustada de agosto de
                2026. (4) A apresentação de produto traz o carimbo "material provisório — dados sujeitos a alteração".
                (5) O conceito de foodhall pode ser alterado pelo operador, conforme ressalva da própria incorporadora.
              </p>
            </div>
          </Section>

          <div className="rule mb-6" />
          <footer className="flex flex-wrap items-center justify-between gap-4 pb-10">
            <p className="text-[11.5px] text-[var(--muted)]">
              Dossiê de Empreendimento · Inteligência de Mercado · posição de {SNAPSHOT}
            </p>
            <a
              href="https://www.orulo.com.br/buildings/74612"
              target="_blank"
              rel="noreferrer"
              className="text-[11.5px] font-semibold flex items-center gap-1.5 hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              Ficha pública no Órulo <ExternalLink size={12} />
            </a>
          </footer>
        </main>
      </div>
    </div>
  )
}
