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
