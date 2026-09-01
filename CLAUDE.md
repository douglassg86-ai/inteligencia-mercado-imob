# inteligencia-mercado-imob

Painel de acompanhamento do lançamento imobiliário **PLVAPOA** (Grupo Plaenge / Vanguard), Porto Alegre/RS. Cronograma visual de metas de funil, ações de marketing e comercial, semana a semana, até o "Dia D" do lançamento.

## Stack

- **React 19 + Vite** (build/dev)
- **TailwindCSS** (UI)
- **Supabase** (PostgreSQL + Auth) — estado do quadro sincronizado em tempo real entre quem estiver com a página aberta
- **Deploy**: Vercel — auto-deploy a cada push em `main`
- **Produção**: https://inteligencia-mercado-imob.vercel.app/

## Estrutura

```
src/
  App.jsx       # única página: o quadro/cronograma (colunas = semanas, linhas = funil/marketing/comercial)
  lib/
    supabase.js # client do Supabase
  main.jsx      # entrypoint (sem router — só uma rota)
```

Scripts Python soltos na raiz (`fix_footer.py`, `fix_scripts.py`, `modify_sites.py`, `rename_assets.py`, `update_wa_links.py`) são utilitários de uso único rodados manualmente durante o desenvolvimento — não fazem parte do build.

## Modelo de dados

Tabela `schedule_data` no Supabase, um único registro (`id = 'main'`) com duas colunas jsonb:
- `columns`: array de semanas (`{id, title, startDate, endDate, highlighted}`)
- `cards`: mapa `{ rowId: { colId: [ {id, type, value, color?, completed?} ] } }`

Linhas (`ROWS`, hard-coded em `App.jsx`): funil de vendas (00-06), MKT (ações de marketing) e INT (comercial). Cards são numéricos (funil, coloridos por responsável) ou texto (marketing/comercial, com checkbox de concluído).

## Autenticação

Login anônimo automático (`supabase.auth.signInAnonymously()`) ao carregar a página — não há tela de login; qualquer pessoa com o link pode ler e editar o quadro (colaborativo, sem controle de usuário). Isso é intencional pelo uso atual (equipe interna compartilhando um link), não é uma falha.

## Variáveis de ambiente

`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` — **configuradas no dashboard da Vercel** (Project Settings → Environment Variables), não commitadas no repo. Projeto Supabase: `inteligenciamercado` (ref `zgdhydvxqikpcnygjbwg`).

## Histórico relevante / decisões de segurança

- O projeto tinha um "GPI Tracker" (CRM de corretores) embutido em `src/features/gpitracker/`, na rota `/gpitracker`. Foi **removido** — a versão real e ativa hoje é o repositório separado [`gpi-tracker-app`](https://github.com/douglassg86-ai/gpi-tracker-app), com seu próprio projeto Supabase (`gpi-tracker`).
- Um `.env` com credenciais do Supabase estava commitado no repo — removido, chave rotacionada.
- 12 das 14 tabelas do projeto Supabase `inteligenciamercado` estavam com **RLS desabilitado** (dados abertos para leitura/escrita com a chave anon). RLS foi habilitado em todas; `schedule_data` tem policy liberando leitura/escrita para `anon`/`authenticated` (mantendo o comportamento colaborativo atual); as demais 11 tabelas (órfãs, do GPI Tracker antigo) ficaram sem policy (bloqueio total), já que nada no código atual as usa.

## Scripts

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção (dist/)
npm run preview  # preview do build
npm run lint     # eslint
```

---

## `/apptest` — piloto visual da Jornada 360° (Adicionado em 20-21/08/2026)

Protótipo navegável, **HTML/CSS/JS puro** (sem framework, sem build), do app de jornada do cliente descrito em `jornada-cliente-360/PLANO_BANCO_DE_DADOS.md` (pasta separada, fora deste repo — só documentação/planejamento). Não tem relação técnica com o quadro PLVAPOA acima (páginas independentes, cada uma sua própria árvore de estado).

- **Arquivo**: `public/apptest/index.html` — um único arquivo autocontido.
- **Por que em `public/` e não na raiz do repo**: este projeto é uma SPA Vite com rewrite catch-all no `vercel.json` (`"/(.*)" → "/index.html"`). Só o que está em `public/` é copiado ao pé da letra pro build; um arquivo na raiz do repo seria ignorado pelo `vite build` e a rota cairia no app principal. Mesmo padrão já usado por `public/painel-marketing.html`. Vercel serve arquivo estático existente **antes** de aplicar o rewrite, então `/apptest/` funciona normalmente.
- **Produção**: `https://inteligencia-mercado-imob.vercel.app/apptest/`
- **Dados**: 100% fictícios e **somente em memória** (sem Supabase, sem persistência) — fechar/recarregar a aba reseta tudo pro estado inicial. Aviso "Piloto visual · dados fictícios" fixo no header.

### Design
Fraunces (serifada, títulos) + Work Sans (UI/dados) via Google Fonts; paleta reaproveitada do painel de marketing (`--dept-*`, `--status-*`, `--ord-*`) para manter as duas páginas com a mesma identidade visual. Claro/escuro via `data-theme` + `prefers-color-scheme`, responsivo (breakpoint em 860px pro sidebar, tabelas com `overflow-x:auto` contido no card).

### Estrutura (7 telas, navegação client-side sem reload)
- **Visão Geral**: KPIs (SLA, CSAT, chamados abertos, custo médio/chamado, VGV, vendas do mês — os 2 últimos ainda estáticos, não computados), funil comercial (estático), chamados por área, aging de chamados por faixa, aderência a orçamento por regional, "onde travou".
- **Cliente 360**: busca (nome/telefone/CPF-CNPJ), timeline unificada com tick colorido por departamento, filtro por período e "ocultar" departamento (chips, sessão apenas), **cadastro de cliente novo** (`+ Novo cliente`), card **Documentos** por cliente (checklist RG/CPF/comprovante de renda etc., **criar/editar**).
- **Oportunidades**: Kanban do funil — ainda estático (dados de exemplo, sem criar/editar).
- **Chamados**: lista por departamento + filtro de equipe (Pós-Venda/Pós-Ocupação, só DAC), **criar/editar chamado** (`+ Novo chamado` ou clicar numa linha).
- **Empreendimentos**: disponibilidade por unidade (barra empilhada) + orçamento de obra.
- **Fornecedores** (grupo "Cadastros" na sidebar): cards por fornecedor (razão social, nome fantasia, CNPJ, categoria, departamento vinculado, contato), **criar/editar** (`+ Novo fornecedor` ou clicar num card).
- **Campanhas** (grupo "Cadastros"): cards por campanha de marketing (nome, tipo, empreendimento vinculado, canal, período, investimento, leads gerados, custo/lead calculado), **criar/editar** (`+ Nova campanha` ou clicar num card).

### Modelo de dados (só em memória, dentro da IIFE do `<script>`)
- `CHAMADOS` — array único; **todo KPI/gráfico/tabela do dashboard é derivado dele + `EMPREENDIMENTOS`, nunca hardcoded** (`renderDashboard()` recalcula tudo a cada criação/edição). Espelha os campos de `chamados` no plano de banco: departamento, tipo (lista por departamento em `TIPOS_POR_DEPARTAMENTO`), status, prioridade, canal de origem, equipe (só DAC), ambiente/componente (só DAC), SLA snapshot (`SLA_CONFIG` por prioridade), CSAT (liberado só ao marcar resolvido), custo.
- `CLIENTS` — array de clientes; `+ Novo cliente` só exige nome+telefone (resto opcional, mesma regra do schema "completa na compra"). Salvar um chamado ou cliente novo empurra um evento pra `cliente.eventos`, provando a ponte chamado↔timeline.
- `DOCUMENTOS` — checklist por cliente (tipo, status pendente/enviado/aprovado/rejeitado, observação); espelha `documentos_cliente` do plano (Revisão 5). Renderizado dentro do card "Documentos" em Cliente 360, filtrado por `activeClientId`.
- `EMPREENDIMENTOS` — 5 itens fixos (EDITION, ORBITALE, TREND NANO, WAVE, MOOD) com `orcamentoObra` — campo que só existe no plano por causa deste piloto (ver `PLANO_BANCO_DE_DADOS.md` Revisão 4: a métrica de aderência a orçamento não tinha denominador até essa auditoria).
- `FORNECEDORES` — array de fornecedores (razão social/CNPJ obrigatórios, resto opcional); espelha a tabela `fornecedores` do plano. Ainda não tem vínculo funcional com `chamado_custos` (custo do chamado é só um número, não referencia fornecedor) — ver limitações abaixo.
- `CAMPANHAS` — array de campanhas de marketing; espelha `campanhas` do plano (Revisão 5). `custo/lead` é sempre calculado (`investimento / leadsGerados`), nunca digitado — mesmo princípio de "nada hardcoded" do dashboard. Ainda sem vínculo funcional com `oportunidades.campanha_id` (o Kanban de Oportunidades é estático, não referencia campanha real).
- Guard de double-submit (`saving`/`savingClienteModal`/`savingFornecedorModal`/`savingDocumentoModal`/`savingCampanhaModal`) em todos os cinco modais — lição documentada no próprio plano (seção 1, débitos do GPI Tracker) aplicada desde o primeiro commit deste piloto, não como retrofit.

### Limitações conhecidas (não são bugs, são escopo do piloto)
- Oportunidades (Kanban) e os KPIs de VGV/Vendas do mês não têm criar/editar — só Chamados, Clientes, Fornecedores, Documentos e Campanhas ganharam esse tratamento até agora.
- Sem "editar cliente" (só criar); os demais cadastros já têm criar+editar.
- Sem exclusão em nenhum cadastro.
- `chamado_custos` do plano é 1:N (vários lançamentos por chamado, cada um podendo referenciar um fornecedor); o piloto simplifica pra um único campo `custo` numérico por chamado, sem FK pra `FORNECEDORES`.
- **Contratos/Parcelas e Comissão de corretor não existem neste piloto nem no plano de banco** — adiados por decisão explícita do usuário na Revisão 5 do `PLANO_BANCO_DE_DADOS.md` (seção 6, itens 10 e 11), não é lacuna esquecida.

---

## `/pesquisa_concorrentes` — comparativo competitivo do Synthè (Adicionado em 25-26/08/2026)

Apresentação visual e animada comparando o **Synthè** (Plaenge · TGD, Rua Pedro Ivo 550, Mont'Serrat) aos **11 concorrentes diretos de maior afinidade** em Porto Alegre (mesma faixa de padrão, tipologia de 3 suítes, bairros Bela Vista/Moinhos de Vento/Mont'Serrat/Auxiliadora). Dados 100% reais, sem nada fictício — vem de tabelas de vendas oficiais, Órulo, memoriais descritivos/books, Rial Imóveis e imprensa especializada.

- **Escopo fixo: só os 11 concorrentes já selecionados por maior afinidade** (destacados com link do Órulo na planilha `Base Estudo Pedro Ivo - Completa.xlsx`, pasta `concorrentes synthe/` fora deste repo). **Não adicionar outros concorrentes sem pedido explícito** — já aconteceu de expandir a base por engano (10 concorrentes extras) e precisar reverter; o critério de seleção é do usuário, não nosso.
- **Produção**: `https://inteligencia-mercado-imob.vercel.app/pesquisa_concorrentes`
- **Dados**: `src/features/pesquisaConcorrentes/data.js` — array `raw` com um objeto por empreendimento (Synthè + 11), `SOURCES` (legenda das chaves usadas em `fontes`), helpers de formatação. `DEVELOPMENTS`/`SYNTHE`/`COMPETITORS` são derivados (não editar diretamente, editar `raw`).
- **Componentes** (`src/features/pesquisaConcorrentes/components/`): `KpiStrip`, `ScatterChart` (preço/m² × % vendido), `AllView` (tabela + amenidades + materiais, todos de uma vez), `CompareView` (comparação 1×1, com lightbox nas plantas), `SourceBadges`/`SourcesPanel` (selos de fonte por dado), `AnimatedNumber`. Animações via `framer-motion` (importado como `Motion` — não `motion` — por causa de um gap no `no-unused-vars` do eslint compartilhado que não detecta uso em JSX; ver commit inicial da feature).
- **Plantas & implantação**: imagens em `public/pesquisa-concorrentes/plantas/{id}-planta.jpg` e `{id}-implantacao.jpg` (24 arquivos, 1 par por empreendimento) — extraídas dos books/apresentações oficiais de cada incorporadora (via Órulo ou pasta de pesquisa manual) e redimensionadas para web. Casa Gardel só tinha material completo numa pasta de pesquisa manual fora do Órulo — se for necessário adicionar imagens de um novo empreendimento, procurar em ambos os lugares antes de marcar como indisponível.
- **Tom do texto — importante**: o campo `observacao` de cada empreendimento (e as descrições em `SOURCES`) são lidos pela diretoria. **Nunca narrar o processo de pesquisa** (correções feitas, "antes achávamos X", tabela recalculada, divergência resolvida, fonte trocada) — escrever sempre como leitura direta e conclusiva do mercado, com o dado já correto, sem explicar como chegamos nele. Esse cuidado já foi aplicado uma vez retroativamente (26/08/2026) depois que o texto começou a soar como changelog de analista em vez de inteligência de mercado.
- **Artifact irmão**: existe uma versão em Claude Artifact ("Synthè no Mapa Competitivo") com o mesmo conteúdo em HTML autocontido, mantida manualmente em sincronia com `data.js` (não é gerada a partir dele) — ao atualizar dados/tom aqui, replicar lá também se o pedido for sobre a apresentação como um todo.
