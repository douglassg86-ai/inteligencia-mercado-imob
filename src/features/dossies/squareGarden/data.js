// Square Garden — dossiê de empreendimento
// Fonte primária das unidades: tabela oficial Melnick/Órulo "Unidades disponíveis em 07/08/2026 às 09h28".
// Cada linha é uma unidade AINDA DISPONÍVEL naquela data. O que não está aqui, estava vendido.

export const SNAPSHOT = '07/08/2026'
export const SNAPSHOT_LONG = '7 de agosto de 2026, 09h28 (Brasília)'

/* ---------------------------------------------------------------------------
   Ficha do empreendimento
--------------------------------------------------------------------------- */

export const FICHA = {
  nome: 'Square Garden',
  incorporadora: 'Melnick',
  endereco: 'Rua Felipe de Oliveira, 15 — Santa Cecília, Porto Alegre/RS',
  esquina: 'Confluência Av. Ipiranga × Av. Silva Só × R. Felipe de Oliveira',
  terreno: 9673,
  areaConstruida: 50000,
  lancamento: '26/09/2025',
  registroIncorporacao: 'R.6 – 160.497, em 04/09/2025, 2ª Zona do RI de Porto Alegre',
  vgvTotal: 450_000_000,
  unidadesTotais: 507,
  torres: 3,
  vagasResidenciais: 300,
  vagasComerciais: 244,
  lazerTotal: 5023,
  terrenoHistorico: 'Antigo Ginásio da Brigada Militar',
}

/* ---------------------------------------------------------------------------
   Produtos (as três frentes de venda)
--------------------------------------------------------------------------- */

export const PRODUTOS = [
  {
    id: 'sunrise',
    nome: 'Residence · Torre Sunrise',
    tipo: 'Residencial 3 dorm.',
    unidades: 74,
    entrega: 'set/2029',
    areaPrivativaTorre: 8002.2,
    face: 'Sacadas frente Leste',
    resumo: '74 unidades — 18 de 119,5 m² com sacada, 20 de 111,6 m², 36 de 93,2 m², mais gardens e coberturas.',
  },
  {
    id: 'sunset',
    nome: 'Residence · Torre Sunset',
    tipo: 'Residencial 3 dorm.',
    unidades: 74,
    entrega: 'dez/2029',
    areaPrivativaTorre: 8002.2,
    face: 'Sacadas frente Oeste — vista Guaíba',
    resumo: 'Mesma matriz de 74 unidades da Sunrise, porém com a face poente e vista para o Guaíba.',
  },
  {
    id: 'multistay',
    nome: 'Multistay',
    tipo: 'Studios e 1 dorm.',
    unidades: 359,
    entrega: 'nov/2029',
    areaPrivativaTorre: null,
    face: 'Torre de 20 pav. sobre o Foodhall',
    resumo: 'Lofts de 19,55 e 21,20 m², 1 dormitório de 27,67 / 40,60 / 57,70 m². Produto de renda (short, mid e long stay).',
  },
]

/* ---------------------------------------------------------------------------
   Unidades disponíveis em 07/08/2026
   [unidade, área privativa m², valor de tabela R$]
--------------------------------------------------------------------------- */

const SUNRISE = [
  [502, 283.16, 3341970.72], [503, 293.16, 3340330.35], [601, 143.80, 2033252.34],
  [602, 111.60, 1915324.30], [603, 111.60, 1836031.07], [604, 179.45, 2145583.10],
  [702, 119.50, 2061959.21], [703, 119.50, 1977052.94], [802, 111.60, 1954970.92],
  [901, 93.20, 1647531.64], [902, 119.50, 2104412.35], [903, 119.50, 2019506.07],
  [1001, 93.20, 1706008.73], [1002, 111.60, 1994617.53], [1003, 111.60, 1915324.30],
  [1101, 93.20, 1680641.54], [1102, 119.50, 2146865.49], [1103, 119.50, 2061959.21],
  [1201, 93.20, 1697196.49], [1202, 111.60, 2034264.14], [1203, 111.60, 1954970.92],
  [1303, 119.50, 2104412.35], [1401, 93.20, 1730306.38], [1402, 111.60, 2073910.76],
  [1403, 111.60, 1994617.53], [1501, 93.20, 1746861.33], [1502, 119.50, 2231771.77],
  [1503, 119.50, 2146865.49], [1601, 93.20, 1763416.28], [1602, 111.60, 2113557.37],
  [1603, 111.60, 2034264.14], [1604, 93.20, 1614421.75], [1701, 93.20, 1784109.96],
  [1702, 119.50, 2279531.55], [1703, 119.50, 2194625.27], [1704, 93.20, 1635115.43],
  [1801, 93.20, 1804803.65], [1802, 111.60, 2163115.64], [1901, 93.20, 1825497.33],
  [1902, 119.50, 2332597.98], [1903, 119.50, 2247691.70], [1904, 93.20, 1676502.80],
  [2002, 111.60, 2212673.90], [2003, 111.60, 2133380.68], [2004, 93.20, 1697196.49],
  [2101, 93.20, 1908806.84], [2104, 93.20, 1759812.31], [2201, 93.20, 1929500.52],
  [2203, 111.60, 2182938.94], [2204, 93.20, 1780505.99], [2302, 219.46, 4322099.67],
]

const SUNSET = [
  [502, 418.84, 4276828.07], [503, 362.47, 3725797.86], [601, 143.68, 1923658.93],
  [701, 93.20, 1528189.72], [801, 93.20, 1543854.55], [1001, 93.20, 1575184.20],
  [1101, 93.20, 1590849.02], [1201, 93.20, 1606513.85], [1202, 111.60, 1925595.82],
  [1301, 93.20, 1622178.67], [1501, 93.20, 1693224.03], [1601, 93.20, 1669173.15],
  [1603, 111.60, 1925595.82], [1604, 93.20, 1528189.72], [1701, 93.20, 1688754.18],
  [1704, 93.20, 1547770.75], [1801, 93.20, 1708335.21], [1901, 93.20, 1727916.24],
  [1904, 93.20, 1586932.82], [2003, 111.60, 2019383.08], [2004, 93.20, 1606513.85],
  [2101, 93.20, 1767078.31], [2104, 93.20, 1665810.59], [2201, 93.20, 1826375.05],
  [2203, 111.60, 2066276.71], [2204, 93.20, 1685391.62], [2303, 219.46, 3960230.48],
  [2304, 196.10, 3436446.78],
]

const MULTISTAY = [
  [507, 57.70, 817120.25], [510, 27.67, 482410.56], [511, 27.67, 482410.56],
  [514, 27.67, 482410.56], [515, 27.67, 482410.56], [516, 27.67, 482410.56],
  [517, 27.67, 482410.56], [518, 57.70, 817120.25], [607, 40.60, 712099.85],
  [814, 19.55, 422762.31], [922, 19.55, 413178.27], [1106, 21.20, 454978.71],
  [1107, 40.60, 745272.21], [1118, 40.60, 745272.21], [1201, 19.55, 422762.31],
  [1202, 19.55, 422762.31], [1205, 19.55, 422762.31], [1206, 21.20, 458443.01],
  [1207, 40.60, 751906.68], [1208, 19.55, 435541.02], [1209, 19.55, 435541.02],
  [1215, 19.55, 435541.02], [1216, 19.55, 435541.02], [1217, 19.55, 435541.02],
  [1218, 40.60, 751906.68], [1223, 19.55, 422762.31], [1306, 21.20, 461907.32],
  [1307, 40.60, 758541.15], [1308, 19.55, 438735.69], [1309, 19.55, 438735.69],
  [1310, 19.55, 438735.69], [1311, 19.55, 438735.69], [1316, 19.55, 438735.69],
  [1318, 40.60, 758541.15], [1401, 19.55, 429151.66], [1403, 19.55, 429151.66],
  [1404, 19.55, 429151.66], [1407, 40.60, 765175.62], [1408, 19.55, 441930.37],
  [1409, 19.55, 441930.37], [1410, 19.55, 441930.37], [1415, 19.55, 441930.37],
  [1416, 19.55, 441930.37], [1417, 19.55, 441930.37], [1418, 40.60, 765175.62],
  [1501, 19.55, 432346.34], [1503, 19.55, 432346.34], [1504, 19.55, 432346.34],
  [1505, 19.55, 432346.34], [1507, 40.60, 771810.09], [1508, 19.55, 445125.05],
  [1509, 19.55, 445125.05], [1510, 19.55, 445125.05], [1511, 19.55, 445125.05],
  [1514, 19.55, 445125.05], [1515, 19.55, 445125.05], [1516, 19.55, 445125.05],
  [1517, 19.55, 445125.05], [1518, 40.60, 771810.09], [1524, 19.55, 432346.34],
  [1601, 19.55, 435541.02], [1602, 19.55, 435541.02], [1603, 19.55, 435541.02],
  [1604, 19.55, 435541.02], [1607, 40.60, 778444.56], [1608, 19.55, 448319.73],
  [1609, 19.55, 448319.73], [1610, 19.55, 448319.73], [1611, 19.55, 448319.73],
  [1614, 19.55, 448319.73], [1615, 19.55, 448319.73], [1616, 19.55, 448319.73],
  [1617, 19.55, 448319.73], [1618, 40.60, 778444.56], [1621, 19.55, 435541.02],
  [1622, 19.55, 435541.02], [1623, 19.55, 435541.02], [1624, 19.55, 435541.02],
  [1702, 19.55, 438735.69], [1703, 19.55, 438735.69], [1704, 19.55, 438735.69],
  [1705, 19.55, 438735.69], [1706, 21.20, 475764.54], [1708, 19.55, 451514.40],
  [1711, 19.55, 451514.40], [1714, 19.55, 451514.40], [1715, 19.55, 451514.40],
  [1716, 19.55, 451514.40], [1717, 19.55, 451514.40], [1718, 40.60, 785079.03],
  [1721, 19.55, 438735.69], [1722, 19.55, 438735.69], [1724, 19.55, 438735.69],
  [1802, 19.55, 441930.37], [1803, 19.55, 441930.37], [1804, 19.55, 441930.37],
  [1805, 19.55, 441930.37], [1808, 19.55, 454709.08], [1809, 19.55, 454709.08],
  [1810, 19.55, 454709.08], [1811, 19.55, 454709.08], [1814, 19.55, 454709.08],
  [1815, 19.55, 454709.08], [1816, 19.55, 454709.08], [1820, 19.55, 441930.37],
  [1821, 19.55, 441930.37], [1822, 19.55, 441930.37], [1823, 19.55, 441930.37],
  [1824, 19.55, 441930.37], [1902, 19.55, 445125.05], [1903, 19.55, 445125.05],
  [1904, 19.55, 445125.05], [1905, 19.55, 445125.05], [1907, 40.60, 798347.97],
  [1908, 19.55, 457903.76], [1909, 19.55, 457903.76], [1910, 19.55, 457903.76],
  [1911, 19.55, 457903.76], [1914, 19.55, 457903.76], [1915, 19.55, 457903.76],
  [1916, 19.55, 457903.76], [1918, 40.60, 798347.97], [1922, 19.55, 445125.05],
  [1923, 19.55, 445125.05], [1924, 19.55, 445125.05],
]

const toUnit = (torre) => ([un, area, valor]) => ({
  id: `${torre}-${un}`,
  torre,
  un,
  pav: Math.floor(un / 100),
  final: un % 100,
  area,
  valor,
  m2: valor / area,
})

export const UNIDADES = [
  ...SUNRISE.map(toUnit('sunrise')),
  ...SUNSET.map(toUnit('sunset')),
  ...MULTISTAY.map(toUnit('multistay')),
]

/* ---------------------------------------------------------------------------
   Política comercial Melnick — agosto/2026. USO INTERNO.
   Fonte: tabela "Política Comercial Agosto 2026" (válida até 31/08/2026).
--------------------------------------------------------------------------- */

export const POLITICA = [
  { produto: 'Torre Sunrise', perdaVpl: -10, descontoNominal: 28.22, bateuLevou: false, entrega: 'set/29' },
  { produto: 'Torre Sunset', perdaVpl: -5, descontoNominal: 25.44, bateuLevou: false, entrega: 'dez/29' },
  { produto: 'Multistay', perdaVpl: -11, descontoNominal: 26.57, bateuLevou: true, entrega: 'nov/29' },
]

export const POLITICA_VALIDADE = '31/08/2026'

// Média do portfólio residencial Melnick na mesma política, para calibrar o desvio.
export const POLITICA_BENCH = {
  descontoMedioResidencial: 15.9,
  amostra: 33,
  maiorDesconto: { nome: 'Supreme Altos do Central Parque', valor: 34.0 },
}

/* ---------------------------------------------------------------------------
   Concorrência — raio de 1,6 km, verticais residenciais em oferta.
   Fonte: API pública Órulo, varredura de 01/09/2026.
--------------------------------------------------------------------------- */

export const CONCORRENTES = [
  { nome: 'Square Garden (Sunset)', inc: 'Melnick', bairro: 'Santa Cecília', km: 0, m2: 16397, un: 74, estoque: 28, estagio: 'Em construção', destaque: true },
  { nome: 'Vicco', inc: 'Compor', bairro: 'Rio Branco', km: 0.67, m2: 16414, un: 16, estoque: 2, estagio: 'Pronto novo' },
  { nome: 'High Garden Rio Branco', inc: 'Melnick', bairro: 'Rio Branco', km: 0.76, m2: 12739, un: 130, estoque: 36, estagio: 'Em construção' },
  { nome: 'Miradero', inc: 'Zuckhan', bairro: 'Rio Branco', km: 0.78, m2: 16625, un: 18, estoque: 8, estagio: 'Em construção' },
  { nome: 'Prisma', inc: 'Krystal', bairro: 'Rio Branco', km: 0.83, m2: 15091, un: 24, estoque: 15, estagio: 'Em construção' },
  { nome: 'Van Gogh Residentie', inc: 'Bold', bairro: 'Petrópolis', km: 0.96, m2: 15991, un: 20, estoque: 7, estagio: 'Em construção' },
  { nome: 'Miro Smart Life', inc: 'Pavei', bairro: 'Bom Fim', km: 1.06, m2: 14404, un: 63, estoque: 15, estagio: 'Em construção' },
  { nome: 'Verdant', inc: 'Plaenge', bairro: 'Petrópolis', km: 1.06, m2: 18289, un: 50, estoque: 16, estagio: 'Em construção' },
  { nome: 'Évora', inc: 'Aquila & Volcon', bairro: 'Petrópolis', km: 1.06, m2: 14500, un: 22, estoque: 17, estagio: 'Em construção' },
  { nome: 'Season', inc: 'TGD', bairro: 'Rio Branco', km: 1.13, m2: 15958, un: 60, estoque: 30, estagio: 'Em construção' },
  { nome: 'Trend Downtown Nano', inc: 'Vanguard', bairro: 'Azenha', km: 1.15, m2: 20264, un: 259, estoque: 54, estagio: 'Em construção' },
  { nome: 'Skyglass Parque Moinhos', inc: 'Cyrela Goldsztein', bairro: 'Rio Branco', km: 1.19, m2: 19446, un: 312, estoque: 33, estagio: 'Pronto novo' },
  { nome: 'Trend Downtown Home F1', inc: 'Vanguard', bairro: 'Azenha', km: 1.21, m2: 14378, un: 100, estoque: 74, estagio: 'Em construção' },
  { nome: 'Summerlyn Bela Vista', inc: 'Durafa', bairro: 'Bela Vista', km: 1.23, m2: 19279, un: 32, estoque: 15, estagio: 'Em construção' },
  { nome: 'Malmo', inc: 'Latitude', bairro: 'Petrópolis', km: 1.25, m2: 18267, un: 24, estoque: 7, estagio: 'Em construção' },
  { nome: 'Legacy by Porsche Consulting', inc: 'Cyrela Goldsztein', bairro: 'Moinhos de Vento', km: 1.33, m2: 21062, un: 48, estoque: 18, estagio: 'Em construção' },
  { nome: 'Bordini 1595', inc: 'Tomasetto', bairro: 'Bela Vista', km: 1.35, m2: 18543, un: 23, estoque: 3, estagio: 'Em construção' },
  { nome: 'Ubá', inc: 'Zuckhan', bairro: 'Bela Vista', km: 1.38, m2: 18011, un: 32, estoque: 17, estagio: 'Em construção' },
  { nome: 'Brava', inc: 'Colla', bairro: 'Rio Branco', km: 1.37, m2: 22242, un: 29, estoque: 21, estagio: 'Em construção' },
  { nome: 'Yofi', inc: 'Melnick', bairro: 'Bom Fim', km: 1.53, m2: 18170, un: 50, estoque: 11, estagio: 'Em construção' },
  { nome: 'Mural Bom Fim', inc: 'Pavei', bairro: 'Bom Fim', km: 1.58, m2: 16246, un: 156, estoque: 16, estagio: 'Em construção' },
  { nome: 'GO Bom Fim', inc: 'Melnick', bairro: 'Bom Fim', km: 1.59, m2: 21613, un: 238, estoque: 35, estagio: 'Pronto novo' },
]

/* ---------------------------------------------------------------------------
   Linha do tempo
--------------------------------------------------------------------------- */

export const TIMELINE = [
  { data: 'dez/2022', titulo: 'Food park itinerante', texto: 'Melnick ativa o terreno do antigo Ginásio da Brigada Militar com um food park temporário em parceria com o Grupo Amiche — teste de vocação gastronômica da esquina antes do produto imobiliário.', tipo: 'marca' },
  { data: '04/09/2025', titulo: 'Registro de incorporação', texto: 'R.6 – 160.497 averbado no Cartório da 2ª Zona do Registro de Imóveis de Porto Alegre.', tipo: 'legal' },
  { data: '26/09/2025', titulo: 'Lançamento', texto: 'Square Garden é lançado: 3 torres, 507 unidades, R$ 450 milhões de VGV, 50 mil m² construídos sobre 9.673 m² de terreno.', tipo: 'venda' },
  { data: 'out/2025', titulo: 'Square Embarcadero anunciado', texto: 'Melnick, Embarcadero Tornak, DC Set e Zaffari anunciam o food mall de ~5.000 m² e 30 operações — maior do país, acima dos 4.645 m² do Eataly de Nova York.', tipo: 'marca' },
  { data: 'jan/2026', titulo: 'Drink in the Sky', texto: 'Ação de vendas com bar suspenso por guindaste a 36 m de altura, 14/01 a 28/01, no estande da R. Felipe de Oliveira, 35.', tipo: 'marca' },
  { data: '2T/2026', titulo: 'Fase 2 lançada', texto: 'Melnick reporta R$ 121,9 mi de VGV bruto (R$ 114,6 mi % Melnick) — único lançamento da companhia no trimestre.', tipo: 'venda' },
  { data: '07/08/2026', titulo: 'Foto do estoque', texto: '204 unidades ainda disponíveis nas três frentes. É a base deste dossiê.', tipo: 'dado' },
  { data: '2º sem/2029', titulo: 'Entregas', texto: 'Sunrise set/29, Multistay nov/29, Sunset dez/29. Embarcadero entrega junto com as torres.', tipo: 'obra' },
]

/* ---------------------------------------------------------------------------
   Lazer e infraestrutura
--------------------------------------------------------------------------- */

export const LAZER = {
  clube: {
    titulo: 'Clube · 5º pavimento',
    altura: '14 m acima da Rua Felipe de Oliveira',
    itens: [
      ['Quadra recreativa de tênis', '36 × 15,6 m'],
      ['Quadra de beach tennis', '11 × 19 m'],
      ['Quadra esportiva', '19,6 × 10,8 m'],
      ['Piscina externa', '18,6 × 6,3 m'],
      ['Piscina coberta', '9,1 × 4,3 m'],
      ['Playground', '217 m²'],
      ['Praça de convívio gramada', '167 m²'],
      ['Pet place', '94 m²'],
      ['Salão de festas Sunrise', '152 m²'],
      ['Salão de festas Sunset', '87 m²'],
      ['Brinquedoteca', '74 m²'],
      ['Espaço teen', '23 m²'],
      ['Gourmet externo e fireplace lounge', '—'],
      ['Acqua play e deck molhado', '—'],
    ],
  },
  rooftop: {
    titulo: 'Rooftop · 20º pavimento',
    altura: 'Topo da Torre Multistay, uso compartilhado',
    itens: [
      ['Espaço de convívio', '224 m²'],
      ['Fitness com consultoria', '170 m²'],
      ['Espaço multiuso', '50 m²'],
      ['Espaço gourmet', '30 m²'],
      ['Espera para cozinha', '24 m²'],
      ['Piscina de borda de vidro', '3,5 × 2,5 m'],
      ['Lounge rooftop', '—'],
    ],
  },
  areas: [
    { label: 'Lazer interno (5º + 20º)', valor: 1343.6 },
    { label: 'Lazer externo (5º + 20º)', valor: 3679.4 },
  ],
  totalLazer: 5023.07,
}

export const COMERCIAL = {
  foodhall: 3457.9,
  mall: 1576.0,
  lojas: 7,
  total: 5033.9,
  operacoes: 30,
  vagasRotativas: 227,
  vagasRapidas: 17,
  referencia: 'Eataly NY — 4.645 m²',
  parceiros: ['Embarcadero Tornak', 'DC Set', 'Zaffari'],
  lojasDetalhe: [
    ['Loja 1', 189.17], ['Loja 2', 171.83], ['Loja 3', 177.52], ['Loja 4', 225.51],
    ['Loja 5', 280.60], ['Loja 6', 254.45], ['Loja 7', 276.97],
  ],
}

export const SEGURANCA = [
  'Guarita blindada nível III-A (vidros e porta blindados, blocos grauteados, laje de concreto)',
  'Acesso ao empreendimento por reconhecimento facial',
  'Eclusas separadas para moradores/visitantes e para prestadores de serviço',
  'Sala de segurança afastada da guarita, com backup dos sistemas',
  'Sistemas atendidos por gerador condominial próprio',
  'Câmeras em todo o perímetro e nos acessos internos',
  'Projeto por consultoria com certificação internacional',
]

export const PROJETISTAS = [
  ['Roseli Melnick Arquitetura & Interiores', 'Projeto arquitetônico e áreas comuns'],
  ['Hype Studio', 'Conceituação de fachadas'],
  ['Tellini Vontobel', 'Paisagismo'],
  ['Foco Luz & Desenho', 'Luminotecnia'],
  ['Maena', 'Comunicação visual'],
]

/* ---------------------------------------------------------------------------
   Contexto urbano
--------------------------------------------------------------------------- */

export const CONTEXTO = {
  ouc: {
    nome: 'OUC Regenera Dilúvio / Nova Ipiranga',
    extensao: '9,4 km da Av. Ipiranga',
    investimento: 1_700_000_000,
    faseZero: 202_000_000,
    financiamento: 'Fundo Clima via BNDES + venda de potencial construtivo',
    status: 'Audiências públicas em jan/2026; projeto de lei previsto para a Câmara em 2026.',
  },
  mercado: {
    m2PoaFipezap: 7579,
    vgv4M26: 1_490_000_000,
    varAnual: 11,
  },
  distancias: [
    ['UFRGS Campus Saúde', '5 min a pé'],
    ['Colégio Santa Cecília', '2 min'],
    ['Futuro Shopping', '3 min'],
    ['Colégio Israelita', '4 min'],
    ['Zaffari Ipiranga', '5 min'],
    ['Redenção', '7 min'],
    ['Parcão', '7 min'],
    ['Shopping Moinhos', '11 min'],
    ['Shopping Praia de Belas', '12 min'],
    ['Nova Orla', '15 min'],
  ],
}

/* ---------------------------------------------------------------------------
   Fontes
--------------------------------------------------------------------------- */

export const FONTES = [
  ['Tabela de disponibilidade', 'Melnick / Órulo — "Unidades disponíveis em 07/08/2026 às 09h28", 15 páginas', 'interna'],
  ['Apresentação de produto', 'Melnick — apresentação interna, 82 slides, set/2025 (material provisório)', 'interna'],
  ['Book digital', 'Melnick — "Square Garden Book Digital", 83 páginas', 'interna'],
  ['Política comercial', 'Melnick — "Política Comercial Agosto 2026", válida até 31/08/2026', 'interna'],
  ['Órulo — API pública', 'Ficha e tipologias do building 74612 + varredura de 423 empreendimentos no raio', 'externa'],
  ['Melnick RI / prévia 2T26', 'VGV lançado de R$ 121,9 mi referente à Fase 2', 'externa'],
  ['Imprensa', 'Terra, Jornal da Capital, Coletiva, Porto Imagem, Valores do RS', 'externa'],
  ['Sinduscon-RS / Secovi-RS', 'Panorama do mercado de Porto Alegre, 4M26', 'externa'],
  ['Prefeitura de POA / Regenera Dilúvio', 'OUC da Av. Ipiranga', 'externa'],
]
