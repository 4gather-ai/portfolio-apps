# STATUS — Northstack Apps

**Última atualização:** 2026-08-25 (sessão 2 do Claude Code)
**Dia do projeto:** 1 de 365 · Início 25/08/2026
**Meta 12 meses:** US$ 15.000/mês recorrente · R$ 1M acumulado
**Orçamento:** R$ 10.000 · **gasto até agora: R$ 0,00**

---

## 🔴 DECISÃO 1 — O App 1 não deve ser construído como está especificado

Fui verificar se o nome "Restock" estava livre. A verificação virou pesquisa de concorrência e derrubou as três premissas que justificam o App 1 no `CLAUDE.md`.

| Premissa no CLAUDE.md | Realidade na App Store hoje |
|---|---|
| Alternativas custam **US$ 100–300/mês** | **EasyScan: US$ 9,99/mês**, 5,0★ com **338 avaliações**. **Stockroom: grátis**, 5,0★ (36) |
| O Admin da Shopify absorveu **só o básico** | Página oficial "Gestão de estoque — Incluído na Shopify": *"reabasteça com **pedidos de compra** e transferências"*. Código de barras, leitor, multi-local e previsão constam como compatíveis |
| Diferencial: preço baixo + migração do Stocky | EasyScan se anuncia como **"O substituto completo do Stocky"**. Stockroom anuncia migração do Stocky **e** sync com QuickBooks — que é o nosso **App 2** |

**O que isso faz com a v1:** o **Stockroom é grátis** e já entrega POs ilimitados, e-mail ao fornecedor, recebimento parcial, **impressão de etiquetas** e importação do Stocky. Nosso plano Free (5 POs/mês) é estritamente pior que um grátis existente, e nosso Growth de US$ 19 custa o **dobro** do EasyScan, que tem mais features e 338 avaliações de prova social.

**Minha recomendação: não codar esta v1.** Escolha um caminho:

- **A — Matar o App 1** e ir para o App 3 (documentos de pedido, alternativa ao Order Printer), aplicando a verificação de mercado *antes* da listagem. Custo: 1 dia.
- **B — Reescopar** para um nicho estreito que os incumbentes não cobrem. Exige uma rodada de evidência que ainda não levantei.
- **C — Seguir como está.** Registro que a recomendação é contrária.

Detalhe com fontes em [DECISOES.md](DECISOES.md).

## 🔴 DECISÃO 2 — O login do CLI não está valendo (HTTP 401)

`shopify organization list` e `shopify app init` retornam **GraphQL Error (Code: 401)**, reproduzido duas vezes. Há um `config.json` gravado hoje às 12:23, mas o token não é aceito para o destino `APPS_CLI`. Meus shells não têm stdin, então o login interativo tem que ser seu:

```bash
"C:\Program Files\nodejs\npx.cmd" @shopify/cli@latest auth logout
```

```bash
"C:\Program Files\nodejs\npx.cmd" @shopify/cli@latest auth login
```

```bash
"C:\Program Files\nodejs\npx.cmd" @shopify/cli@latest organization list
```

Se o terceiro listar **Northstack Apps**, me avise. **Não preciso que você me passe o org ID** — descobri que o `organization list` resolve isso sozinho.

## 🟡 Pendência menor

Você deixou **`hardware: [tem/não tem]`** literal na mensagem. Tem impressora de etiqueta e/ou leitor de código de barras? Só importa se o caminho B for escolhido.

---

## Decisões registradas nesta sessão

| Decisão | Valor | Status |
|---|---|---|
| Hospedagem | **Railway** (~US$ 5/mês) — Fly.io descartado | Registrada. **Não contratar ainda** — escopo em revisão |
| Domínio | **northstackapps.com** (~R$ 66/ano) — você compra | Aprovado. Compra é segura: serve ao portfólio inteiro |
| Dev store | **northstack-dev** | Registrada |
| Nome "Restock" | **Reprovado** | Ver abaixo |

**Por que "Restock" foi reprovado:** a busca por "restock" na App Store retorna **1.612 apps** e a primeira página inteira é de alertas *back in stock* — Stoq (3.534 avaliações), Kbite (3.899), Notify! (3.583). Na App Store, "restock" significa *avisar o cliente*, não *comprar do fornecedor*: o nome nos coloca competindo na busca errada. E `Stockroom`, a alternativa nº 3 da nossa listagem, **já é um app concorrente**.

---

## Portfólio

| # | App | Fase | Próximo marco |
|---|---|---|---|
| 1 | `restock` | 🔴 Escopo em revisão | Sua escolha: caminho A, B ou C |
| 2 | Conector contábil (QuickBooks/Xero) | Premissa abalada — MyWorks já entrega junto com o Stockroom grátis | Verificar mercado antes de qualquer listagem |
| 3 | Documentos de pedido | Não iniciado, **não verificado** | Candidato natural se o caminho for A |

**Receita hoje: US$ 0/mês.** Apps publicados: 0. Instalações: 0.

---

## Feito nesta sessão

- [x] Decisões de hospedagem, domínio e dev store registradas em `DECISOES.md` e `CUSTOS.md`
- [x] Nome "Restock" verificado na App Store — reprovado, com evidência
- [x] Pesquisa de concorrência com preços, notas e contagem de avaliações reais
- [x] Tentativa de `shopify app init` — bloqueada por 401; mapeadas as flags corretas (`--template reactRouter`, `--flavor`, `--organization-id`)
- [x] Descoberto `shopify organization list`, que dispensa você me passar o org ID
- [x] Repositório mantido íntegro (os docs do app saíram e voltaram para o `init`; `git status` limpo)

---

## Mudança de processo que eu recomendo

A regra 8 do `CLAUDE.md` diz "escrever a listagem antes do código". Ela falhou aqui: escrevi uma listagem convincente para um produto que o mercado já resolveu de graça. A regra deveria ser:

> **Verificar o mercado real antes de escrever a listagem.** Preço, nota e contagem de avaliações dos 5 concorrentes mais próximos, mais o que a Shopify já faz nativamente. Se um concorrente grátis cobre a v1 inteira, o app não começa.

São 20 minutos de verificação que teriam evitado a sessão 1 inteira. Se você concordar, eu atualizo o `CLAUDE.md`.

---

## Como retomar (leia nesta ordem)

1. [CLAUDE.md](CLAUDE.md) — missão e regras
2. **este arquivo** — as duas decisões travadas
3. [DECISOES.md](DECISOES.md) — a evidência de mercado com fontes
4. [apps/restock/STATUS.md](apps/restock/STATUS.md) — detalhe técnico e do bloqueio do CLI
