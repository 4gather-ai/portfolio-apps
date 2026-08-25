# STATUS — Restock (nome reprovado — ver abaixo)

**Última atualização:** 2026-08-25 (sessão 2)
**Meta original:** submeter até 2026-09-08
**Fase:** 🔴 **escopo em revisão** — a pesquisa de mercado contradiz as premissas do app

---

## 🔴 Parar antes de codar

A verificação do nome levou a uma verificação de concorrência, e ela derrubou as premissas do App 1. Detalhe completo em [DECISOES.md](../../DECISOES.md). Resumo:

- **Stockroom ‑ Purchase Orders** (MyWorks) — **grátis**, 5,0★ (36): POs e fornecedores ilimitados, e-mail ao fornecedor, recebimento parcial, impressão de etiquetas, migração do Stocky e sync com QuickBooks. **É a nossa v1 inteira, de graça, mais o nosso App 2.**
- **EasyScan Inventory & Barcode** — **US$ 9,99/mês**, 5,0★ (**338 avaliações**), descrito como **"O substituto completo do Stocky"**: PO + recebimento + leitor + gerador de etiquetas + previsão + balanço.
- **Shopify nativo** — a página "Gestão de estoque / Incluído na Shopify" já anuncia "reabasteça com **pedidos de compra** e transferências"; códigos de barras, leitores e multi-local constam como compatíveis.
- Mais 6+ apps de PO com plano grátis ou trial (Mimoran, Auto Purchase Orders, Stockie, FlowPO, Alfred, PML).

**Conclusão:** o Free proposto (5 POs/mês) é pior que um grátis existente e o Growth de US$ 19 custa o dobro de um concorrente melhor estabelecido. Não recomendo escrever código para esta v1.

**Precisa da sua escolha:** caminho A (matar o App 1), B (reescopar para nicho estreito) ou C (seguir como está). Ver `STATUS.md` na raiz.

---

## Feito nesta sessão

- [x] Registradas as decisões: Railway, domínio `northstackapps.com`, dev store `northstack-dev`
- [x] **Nome verificado — reprovado.** "Restock" na App Store retorna 1.612 apps, todos de alerta *back in stock* (Stoq 3.534 avaliações, Kbite 3.899). Nome nos joga na busca errada. `Stockroom`, a alternativa nº 3, já é um app concorrente
- [x] Pesquisa de concorrência com preços e notas reais (acima)
- [x] Tentativa de `shopify app init` — falhou, ver bloqueio abaixo
- [x] Verificado que `shopify organization list` existe e resolve o `--organization-id` automaticamente quando a sessão for válida

## Não feito

- [ ] `shopify app init` — bloqueado por 401 **e** pelo escopo em revisão

---

## Bloqueios

| # | Bloqueio | Impacto | Quem resolve |
|---|---|---|---|
| 1 | **Escopo do app em revisão** | Codar agora é provável desperdício | Amarildo (caminho A/B/C) |
| 2 | **Sessão do CLI retorna HTTP 401** | Bloqueia `app init`, `dev`, `deploy` | Amarildo (refazer login) |
| 3 | Nome público indefinido | Bloqueia o registro do app | Depende do caminho escolhido |
| 4 | Hardware de teste não informado | Só importa no caminho B | Amarildo |

### Detalhe do bloqueio 2 — o login não está valendo

`shopify organization list` e `shopify app init` retornam:

```
GraphQL Error (Code: 401)
query ListOrganizations { currentUserAccount { organizationsWithAccessToDestination(destination: APPS_CLI) ... } }
```

Reproduzido duas vezes. Existe um `config.json` em `%APPDATA%\shopify-cli-kit-nodejs\Config` gravado hoje às 12:23, então algo foi salvo — mas o token não é aceito para o destino `APPS_CLI`. Causas prováveis: login concluído em outra conta, token expirado, ou a conta não tem acesso de CLI à organização.

**Como resolver** (no seu terminal, interativo — eu não consigo, meus shells não têm stdin):

```bash
"C:\Program Files\nodejs\npx.cmd" @shopify/cli@latest auth logout
```

```bash
"C:\Program Files\nodejs\npx.cmd" @shopify/cli@latest auth login
```

Depois confirme que voltou a listar a organização:

```bash
"C:\Program Files\nodejs\npx.cmd" @shopify/cli@latest organization list
```

Se essa última listar **Northstack Apps**, me avise — daí eu rodo o `init` sozinho, sem precisar do ID:

```bash
npx @shopify/cli@latest app init --name restock --template reactRouter --flavor typescript -d npm --path apps
```

---

## Aprendido sobre o CLI (para não repetir)

- `app init` exige `--organization-id` (ou `--client-id`) **e** `--flavor` em terminal não interativo. `--template` aceita `reactRouter` ou `none` — não mais `remix`.
- `organization list` fornece o `--organization-id`, então não preciso pedir o ID a você — preciso só da sessão válida.
- `app init` recusa diretório não vazio; os docs do app precisam sair e voltar (fiz isso, repo está íntegro).
