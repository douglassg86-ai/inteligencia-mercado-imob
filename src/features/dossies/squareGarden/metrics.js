// Tudo aqui é derivado de data.js. Nenhum KPI da página é digitado à mão.
import { UNIDADES, PRODUTOS, FICHA, POLITICA } from './data'

export const fmtBRL = (v, d = 0) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: d, maximumFractionDigits: d })

export const fmtMi = (v) => `R$ ${(v / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`

export const fmtNum = (v, d = 0) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })

/** R$ compacto: milhões acima de 1 mi, milhares abaixo. Para faixas e rótulos apertados. */
export const fmtCompact = (v) =>
  v >= 1e6 ? `R$ ${fmtNum(v / 1e6, 2)} mi` : `R$ ${fmtNum(v / 1e3, 0)} mil`

export const fmtM2 = (v, d = 0) => `${fmtNum(v, d)} m²`

const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0)
const median = (nums) => {
  const s = [...nums].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

/** Estoque + VGV remanescente por torre, e VSO implícita contra o total de unidades. */
export const porTorre = PRODUTOS.map((p) => {
  const us = UNIDADES.filter((u) => u.torre === p.id)
  const vgv = sum(us, (u) => u.valor)
  const area = sum(us, (u) => u.area)
  const vendidas = p.unidades - us.length
  return {
    ...p,
    estoque: us.length,
    vendidas,
    vso: (vendidas / p.unidades) * 100,
    vgvEstoque: vgv,
    areaEstoque: area,
    m2Medio: vgv / area,
    m2Mediano: median(us.map((u) => u.m2)),
    ticketMedio: vgv / us.length,
    min: Math.min(...us.map((u) => u.valor)),
    max: Math.max(...us.map((u) => u.valor)),
    unidades_: us,
  }
})

export const TOTAIS = (() => {
  const estoque = UNIDADES.length
  const vgvEstoque = sum(UNIDADES, (u) => u.valor)
  const areaEstoque = sum(UNIDADES, (u) => u.area)
  const vendidas = FICHA.unidadesTotais - estoque
  return {
    estoque,
    vendidas,
    vso: (vendidas / FICHA.unidadesTotais) * 100,
    vgvEstoque,
    areaEstoque,
    m2Medio: vgvEstoque / areaEstoque,
    ticketMedio: vgvEstoque / estoque,
    // O VGV total de R$ 450 mi é o anunciado no lançamento (valores de 2025).
    // A tabela de ago/26 já está reajustada, então isto é uma ordem de grandeza, não uma conta fechada.
    vgvVendidoAprox: FICHA.vgvTotal - vgvEstoque,
  }
})()

/** Distribuição do estoque por tipologia (área privativa), dentro de um produto. */
export function porTipologia(torreId) {
  const us = UNIDADES.filter((u) => u.torre === torreId)
  const map = new Map()
  for (const u of us) {
    const k = u.area.toFixed(2)
    if (!map.has(k)) map.set(k, { area: u.area, qtd: 0, vgv: 0 })
    const e = map.get(k)
    e.qtd += 1
    e.vgv += u.valor
  }
  return [...map.values()]
    .map((e) => ({ ...e, m2: e.vgv / (e.area * e.qtd), ticket: e.vgv / e.qtd }))
    .sort((a, b) => a.area - b.area)
}

/**
 * Stacking plan das torres Residence.
 * Matriz conhecida do projeto: pav. 5 tem só os finais 02/03 (gardens),
 * pav. 6 a 23 têm os finais 01 a 04. 2 + 4×18 = 74 unidades por torre.
 */
export const PAVIMENTOS = Array.from({ length: 19 }, (_, i) => 23 - i) // 23 → 5
export const FINAIS = [1, 2, 3, 4]

export function stacking(torreId) {
  const disp = new Map(UNIDADES.filter((u) => u.torre === torreId).map((u) => [u.un, u]))
  return PAVIMENTOS.map((pav) => ({
    pav,
    celulas: FINAIS.map((f) => {
      if (pav === 5 && (f === 1 || f === 4)) return { final: f, existe: false }
      const un = pav * 100 + f
      const u = disp.get(un)
      return {
        final: f,
        existe: true,
        un,
        disponivel: !!u,
        unidade: u || null,
        cobertura: pav === 23,
        garden: pav === 5 || (pav === 6 && (f === 1 || f === 4)),
      }
    }),
  }))
}

/** Quanto de cada tipologia da torre já saiu — a leitura de "o que o mercado escolheu". */
export function absorcaoPorFinal(torreId) {
  return FINAIS.map((f) => {
    const total = f === 1 || f === 4 ? 18 : 19 // finais 02/03 existem também no pav. 5
    const restam = UNIDADES.filter((u) => u.torre === torreId && u.final === f).length
    return { final: f, total, restam, vendidas: total - restam, vso: ((total - restam) / total) * 100 }
  })
}

/** Faixas de preço do Multistay, para leitura de produto de renda. */
export function faixasMultistay() {
  const us = UNIDADES.filter((u) => u.torre === 'multistay')
  const map = new Map()
  for (const u of us) {
    const k = u.area.toFixed(2)
    if (!map.has(k)) map.set(k, { area: u.area, qtd: 0, vgv: 0, min: Infinity, max: -Infinity })
    const e = map.get(k)
    e.qtd += 1
    e.vgv += u.valor
    e.min = Math.min(e.min, u.valor)
    e.max = Math.max(e.max, u.valor)
  }
  return [...map.values()]
    .map((e) => ({ ...e, m2: e.vgv / (e.area * e.qtd), ticket: e.vgv / e.qtd }))
    .sort((a, b) => a.area - b.area)
}

/**
 * Gradiente de preço por pavimento — quanto a tabela cobra por altura.
 * Um pavimento pode ter mais de uma unidade da mesma metragem (finais 01 e 04),
 * então cada ponto é a média do andar.
 */
export function precoPorPavimento(torreId, areaAlvo) {
  const porPav = new Map()
  for (const u of UNIDADES) {
    if (u.torre !== torreId || Math.abs(u.area - areaAlvo) > 0.01) continue
    if (!porPav.has(u.pav)) porPav.set(u.pav, { pav: u.pav, soma: 0, qtd: 0, uns: [] })
    const e = porPav.get(u.pav)
    e.soma += u.m2
    e.qtd += 1
    e.uns.push(u.un)
  }
  return [...porPav.values()]
    .map((e) => ({ pav: e.pav, m2: e.soma / e.qtd, un: e.uns.join(' / ') }))
    .sort((a, b) => a.pav - b.pav)
}

/** Desconto nominal médio das três frentes do Square Garden, derivado da política. */
export const DESCONTO_SG = POLITICA.reduce((a, p) => a + p.descontoNominal, 0) / POLITICA.length
