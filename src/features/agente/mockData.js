// Gerador de dados fictícios para o MVP do Agente de Inteligência de Mercado.
// Nenhuma informação aqui é real — serve para validar layout/UX do quadro
// comparativo antes de conectar o pipeline de scraping (ZAP, VivaReal, Órulo, etc.).

export const AMENITIES = [
  'Piscina adulto',
  'Piscina infantil',
  'Espaço gourmet',
  'Salão de festas',
  'Academia / fitness',
  'Espaço pet',
  'Playground',
  'Brinquedoteca',
  'Coworking',
  'Bicicletário',
  'Lavanderia compartilhada',
  'Rooftop / deck',
  'Quadra poliesportiva',
  'Sauna',
  'Spa',
  'Cinema / home theater',
  'Espaço zen / yoga',
  'Horta comunitária',
  'Guest house',
  'Sala de jogos',
  'Portaria 24h',
  'Gerador de emergência',
  'Automação residencial',
  'Espaço mulher segura',
]

export const ENGENHARIA_DIFERENCIAIS = [
  'Estrutura em concreto armado',
  'Esquadrias de alumínio com vidro duplo',
  'Fachada em ACM / pastilha',
  'Piso porcelanato entregue nas áreas sociais',
  'Isolamento acústico entre unidades (piso flutuante)',
  'Infraestrutura para ar-condicionado split em todos os ambientes',
  'Pé-direito elevado',
  'Infraestrutura para carregador de veículo elétrico',
  'Sistema de reuso de água / captação de água de chuva',
  'Pintura lavável premium entregue',
  'Fiação estruturada (internet/TV em todos os ambientes)',
  'Pisos aquecidos nas suítes',
]

const PROMOCOES_POOL = [
  '5% de desconto à vista',
  'Parcelamento da entrada facilitado em até 60x',
  'Isenção de taxa de corretagem',
  'Brinde de decoração para as primeiras unidades',
  'Condições especiais para uso de FGTS',
  'Documentação grátis',
]

const FONTES_POOL = [
  'ZAP Imóveis',
  'VivaReal',
  'Imovelweb',
  'Órulo',
  'Chaves na Mão',
  'Site da incorporadora',
]

const COMPETITOR_IDENTITIES = [
  { nome: 'Residencial Verano Alto', incorporadora: 'Horizonte Empreendimentos' },
  { nome: 'Edifício Solar dos Ipês', incorporadora: 'Ipê Construtora' },
  { nome: 'Torres do Bosque', incorporadora: 'Bosque Realty' },
  { nome: 'Villa Cristallo', incorporadora: 'Cristallo Incorporações' },
  { nome: 'Edifício Aurora Norte', incorporadora: 'Norte Capital' },
  { nome: 'Condomínio Vivace', incorporadora: 'Vivace Empreendimentos' },
  { nome: 'Edifício Panorama Sul', incorporadora: 'Panorama Realty' },
  { nome: 'Reserva das Palmeiras', incorporadora: 'Reserva Incorporadora' },
]

const STATUS_OPTIONS = ['Lançamento', 'Em obras', 'Pronto para morar']

function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashStringToSeed(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h
}

function pickSubset(rng, pool, min, max) {
  const size = min + Math.floor(rng() * (max - min + 1))
  const shuffled = [...pool].sort(() => rng() - 0.5)
  return shuffled.slice(0, size)
}

function addMonths(dateStr, months) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setMonth(d.getMonth() + months)
  return d.toISOString().slice(0, 10)
}

function addDaysRandom(rng, dateStr, minDays, maxDays) {
  const d = new Date(dateStr + 'T00:00:00')
  const days = minDays + Math.floor(rng() * (maxDays - minDays))
  d.setDate(d.getDate() + (rng() < 0.5 ? -days : days))
  return d.toISOString().slice(0, 10)
}

export function generateMockCompetitors(lancamento) {
  const rng = mulberry32(hashStringToSeed(lancamento.id))
  const count = 4 + Math.floor(rng() * 3) // 4 a 6 concorrentes
  const baseTipologias =
    lancamento.tipologias && lancamento.tipologias.length > 0
      ? lancamento.tipologias
      : [{ dormitorios: 2, suites: 1, areaM2: 60, preco: 500000 }]

  const usedIdentities = [...COMPETITOR_IDENTITIES].sort(() => rng() - 0.5)

  return Array.from({ length: count }).map((_, i) => {
    const identity = usedIdentities[i % usedIdentities.length]
    const distanciaKm = +(rng() * Math.max(lancamento.raioKm, 0.5)).toFixed(1)
    const status = STATUS_OPTIONS[Math.floor(rng() * STATUS_OPTIONS.length)]
    const vso = Math.round(rng() * 90)
    const dataLancamento = addDaysRandom(rng, lancamento.dataLancamento || new Date().toISOString().slice(0, 10), 30, 400)
    const dataEntrega = addMonths(dataLancamento, 30 + Math.floor(rng() * 12))

    const tipologias = baseTipologias.map((base) => {
      const varArea = 0.85 + rng() * 0.3
      const areaM2 = +(base.areaM2 * varArea).toFixed(1)
      const precoM2Base = base.areaM2 ? base.preco / base.areaM2 : 8000
      const precoM2 = Math.round(precoM2Base * (0.9 + rng() * 0.25))
      const precoMedio = Math.round(precoM2 * areaM2)
      const unidadesTotal = 10 + Math.floor(rng() * 40)
      const unidadesDisponiveis = Math.max(
        0,
        Math.round(unidadesTotal * (1 - vso / 100) * (0.7 + rng() * 0.6))
      )
      return {
        label: `${base.dormitorios} dorm${base.dormitorios > 1 ? 's' : ''}${
          base.suites ? ` (${base.suites} suíte${base.suites > 1 ? 's' : ''})` : ''
        }`,
        dormitorios: base.dormitorios,
        suites: base.suites,
        areaM2,
        precoM2,
        precoMedio,
        unidadesTotal,
        unidadesDisponiveis,
        estoquePercentual: unidadesTotal ? Math.round((unidadesDisponiveis / unidadesTotal) * 100) : 0,
      }
    })

    const promocoes = pickSubset(rng, PROMOCOES_POOL, 0, 2).map((descricao) => ({
      descricao,
      validade: addDaysRandom(rng, new Date().toISOString().slice(0, 10), 10, 60),
    }))

    return {
      id: `${lancamento.id}-comp-${i}`,
      nome: identity.nome,
      incorporadora: identity.incorporadora,
      distanciaKm,
      status,
      dataLancamento,
      dataEntrega,
      vso,
      tipologias,
      areasComuns: pickSubset(rng, AMENITIES, 8, 14),
      diferenciaisEngenharia: pickSubset(rng, ENGENHARIA_DIFERENCIAIS, 4, 8),
      promocoes,
      fontesEncontradas: pickSubset(rng, FONTES_POOL, 2, 3),
    }
  })
}
