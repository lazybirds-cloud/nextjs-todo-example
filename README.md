# Tarefas — exemplo Next.js + Postgres no LazyHost

Lista de tarefas (adicionar, concluir, apagar) feita com Next.js 16 (App
Router + Server Actions) e PostgreSQL via [`pg`](https://node-postgres.com).
Serve de modelo para publicar seu próprio projeto no LazyHost.

Demo: https://nextjs-99ac42.lazybirds.cloud

## Publicar no LazyHost

1. Baixe o .zip pronto no wizard do portal ("Baixe o exemplo de lista de
   tarefas"), ou compacte esta pasta **sem** `node_modules` e `.next`:

   ```bash
   zip -r tarefas.zip . -x 'node_modules/*' '.next/*' '.git/*'
   ```

2. No portal: **Catálogo → Next.js (seu projeto) → Implantar**.
3. Passo 1:
   - envie o `.zip`;
   - marque **Criar um banco Postgres para este app**;
   - em **Comando de release**, coloque `node migrate.js`.
4. **Compilar e publicar.** Acompanhe na aba **Builds**: instalação →
   `next build` → `node migrate.js` (cria a tabela) → publicado.

Novas versões: aba **Builds → Enviar nova versão** com um novo `.zip`.

## Como funciona

| Arquivo | Papel |
|---|---|
| `migrate.js` | Cria a tabela `todos` (idempotente). Roda como comando de release depois de cada build, com `DATABASE_URL`. |
| `src/lib/db.ts` | Pool do `pg` lendo `DATABASE_URL` (injetada pelo LazyHost). |
| `src/app/actions.ts` | Server Actions: adicionar, concluir/reabrir, apagar, limpar concluídas. |
| `src/app/page.tsx` | A página. A lista lê do banco a cada requisição. |

**Next.js 16 + banco:** com `cacheComponents` ligado, acesso a dados por
requisição precisa ficar dentro de `<Suspense>` e chamar `await connection()`.
Caso contrário, o `next build` tenta pré-renderizar a página sem banco e falha.
Veja `TodoList` em `page.tsx`.

## Rodar localmente

```bash
npm ci
export DATABASE_URL=postgres://usuario:senha@localhost:5432/tarefas
node migrate.js
npm run dev
```
