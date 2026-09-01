# Nativelog — Atlassian Marketplace Listing (v1 draft)

> Regra 8: escrita **depois** da verificação de mercado (`PESQUISA.md`, rodadas 4 e 5) e **depois** do spike que provou a cunha em produção.
> Idioma base: EN. Traduções: pt-BR, ES, DE, FR (regra 9).
> Status: **rascunho v1** — revisar com screenshots reais antes de submeter.
> **Reposicionado em 01/09/2026** (seções 2, 3, 4 e 6). Motivo em `../../DECISOES.md`.

---

## 0. Regras de discurso — valem para tudo aqui e para todo texto público

Decididas em 01/09/2026, depois de o achado do Worklogs mostrar que a manchete antiga descrevia também o concorrente.

1. **Nunca "o único app que…"**, nem "diferente de todos os outros". Exclusividade que não se prova é o que volta contra nós na primeira review.
2. **Nenhum concorrente citado, nem por alusão.** Vendemos o nosso peixe.
3. **Worklog nativo é afirmado como propriedade nossa, não como raridade.** *"Every entry is a real Jira worklog"* é fato sobre nós e não faz afirmação sobre o mercado.
4. **Nada de prometer o que não está construído.** O texto abaixo depende do **D15** — a tela de lançamento da semana.

**A inversão que essas regras produziram:** o benefício virou manchete, **o worklog nativo virou prova**. Nada do que estava escrito era falso; mudou a ordem.

---

## 1. Nome público

**`Nativelog`** — busca na Marketplace em 26/08/2026 retorna **zero apps** com esse nome ou parecido. `Loggd` também estava livre; `Worklogic`, `Truelog` e `Nativa` colidem com apps existentes.

O nome diz a cunha: **native + worklog**. Nome de listagem completo, para a busca:

> **Nativelog — Native Time Tracking & Timesheets for Jira**

**Verificar antes de registrar:** disponibilidade do nome no Developer Console (a busca da Marketplace não é prova definitiva) e do domínio `nativelog.com` / subdomínio em `northstackapps.com`.

**Alternativas se colidir:** `Loggd`, `Nativelog Time`, `Truetime for Jira`.

---

## 2. Summary / tagline (limite ~80 caracteres — confirmar na tela de submissão)

> `Your week on one screen. Every hour is a real Jira worklog, logged as you.`

(73 caracteres)

Alternativas:
- `Log the whole week from one page. Real Jira worklogs, under your own name.` (73)
- `One screen for your week. Native Jira worklogs, logged as you.` (61)

**A ordem das duas metades é a decisão inteira.** A primeira frase é o que a pessoa ganha na segunda de manhã; a segunda é por que dá para confiar. A versão anterior tinha só a segunda metade.

---

## 3. Highlights (3 blocos, título + descrição)

**1. The week on one screen**
Seven days, your entries under each one, running totals per day. Add time against any work item, fix Tuesday's number, delete the duplicate — without opening a single item or a second tab. Step back to last week and forward again.

**2. Real worklogs, logged as you**
Every entry is a native Jira worklog created with **your** account, not the app's. `worklogAuthor = currentUser()` returns what you'd expect, and so do your saved filters, automation rules, dashboard gadgets and exports.

**3. Nothing to migrate, ever**
The sheet is rebuilt from Jira's own worklogs every time you open it. There is no second database to fall out of sync, and if you uninstall, every hour stays exactly where it is.

> **O timer saiu dos highlights de propósito.** Ele continua no produto e na descrição longa. Mas timer é o que **toda** a categoria mostra primeiro, e gastar um dos três blocos com ele é gastar o espaço mais caro da listagem com a coisa mais parecida com todo mundo.

---

## 4. Descrição longa

### Jira makes you log time one item at a time

Logging twenty minutes means opening the item. Then the next one. Then the next. A week of real work is twenty tabs and a fair chance you forget three of them on Friday afternoon — and Jira Cloud has no weekly screen to catch that, because logging work is per item, from the item.

### Nativelog gives you the week

One page. Your seven days across the top, your entries under each day, totals as you go.

- **Add an entry against any item** without leaving the page
- **Fix a number on the same screen where you noticed it was wrong** — edit or delete any of your own entries inline
- **Move between weeks** and correct last week before the invoice goes out
- Backdate freely: yesterday, or last Friday, with the time you actually started

It is still one entry per item, because that is how Jira stores hours. What changes is that you never go looking for the item.

### And every hour is a real Jira worklog

There is no shadow copy. Each entry is created through Jira's own worklog API, under your account, and it appears in the item's Work log tab with your name on it.

**Your JQL keeps working.** `worklogAuthor = currentUser()`, `worklogDate >= startOfWeek()` — the queries you already have return what they should.

**Your automation keeps working.** Rules that react to worklogs see these like any other. No webhooks to wire up.

**Your reports keep working.** Native time reports, dashboard gadgets, eazyBI, Power BI — anything that reads Jira worklogs reads yours. We do not ask you to rebuild your reporting inside our app.

**Uninstalling costs you nothing.** Remove Nativelog and every hour stays in Jira. No export, no migration, no lock-in. We would rather earn the renewal.

### The rest of it

- **Timer on the item**, if you prefer to start the clock and forget it. It records the start and writes one worklog when you stop — no phantom entries, no duplicated clocks
- **Team view for leads** — who logged what, by project or group, read-only
- **CSV export with real filters**, including *exclude these projects* instead of ticking fifty boxes
- **Five languages** — English, Portuguese, Spanish, German, French

### What Nativelog does not do

No approval workflows. No billing rates, budgets or invoicing. No capacity planning or forecasting. No mobile app. If you need a professional-services suite, buy one — there are good ones. If you need to log a week without losing the afternoon, this is it.

### Runs on Atlassian

Nativelog is a Forge app. It runs entirely on Atlassian infrastructure, stores no work data outside your Jira site, and honours your site's data residency.

---

## 5. Planos

> ⚠️ **Desvio consciente da regra 10 do `CLAUDE.md`.** A regra descreve preço fixo em 3 planos (US$ 19–79), que é o modelo da Shopify. A Atlassian cobra **por assento com faixas**, e o padrão da categoria é **grátis até 10 usuários**. Preço fixo não existe nesse marketplace. Registrado em `DECISOES.md`.

Três **editions**, alinhadas à faixa do Clockwork Pro (nota 4.6) e bem abaixo do Tempo (nota 4.1, ~3,6× mais caro):

| | **Free** | **Standard** | **Pro** |
|---|---|---|---|
| Até 10 usuários | **Grátis** | Grátis | Grátis |
| Timer e apontamento manual | ✓ | ✓ | ✓ |
| Worklog nativo com identidade do usuário | ✓ | ✓ | ✓ |
| Data e hora retroativas | ✓ | ✓ | ✓ |
| Minha folha de ponto semanal | ✓ | ✓ | ✓ |
| Exportação CSV | — | ✓ | ✓ |
| Filtros de incluir/**excluir** projetos | — | ✓ | ✓ |
| Visão de equipe (leitura) | — | — | ✓ |
| Relatórios por grupo e por período | — | — | ✓ |

**Faixa de preço alvo** (mensal, a confirmar na tabela de faixas do Developer Console):

| Usuários | Standard | Pro | *Referência: Clockwork Pro* | *Referência: Tempo* |
|---|---|---|---|---|
| 10 | Grátis | Grátis | Grátis | US$ 10,00 |
| 50 | ~US$ 45 | ~US$ 65 | US$ 65,00 | US$ 260,50 |
| 250 | ~US$ 200 | ~US$ 295 | US$ 295,00 | US$ 1.070,00 |
| 1.000 | ~US$ 450 | ~US$ 650 | US$ 610,00 | US$ 2.427,50 |

**Racional:** o Pro empata com o líder de qualidade da categoria e fica **3,6× abaixo** do líder de volume. O Standard entra por baixo para capturar quem só quer apontar e exportar. **Trial de 30 dias** é padrão da Atlassian em todos os apps pagos.

---

## 6. Screenshots (3, formato recomendado 1840×1000)

**A ordem mudou em 01/09.** A antiga abria pela prova técnica; a nova abre pelo benefício, **porque a primeira imagem é o que decide se a pessoa lê a segunda.**

**Screenshot 1 — "A semana"**
A página Minha semana com os sete dias na horizontal, entradas sob cada dia, totais por dia no rodapé e **o formulário de nova entrada aberto sobre a coluna de quarta**. Legenda: *"Your whole week, entered and corrected from one page."*

**Screenshot 2 — "É um worklog de verdade"**
Split. À esquerda, a entrada na Minha semana. À direita, **a aba nativa Work log do próprio Jira**, mostrando a mesma entrada com a foto e o nome do usuário como autor. Legenda: *"Same entry, in Jira's own Work log tab, with your name on it."*

**Screenshot 3 — "O JQL e o CSV que você já tem"**
Busca do Jira com `worklogAuthor = currentUser() AND worklogDate >= startOfWeek()` e resultados, ao lado do seletor de exportação com **Exclude projects**. Legenda: *"Nothing to rebuild. Your filters already understand these hours."*

**Ícone:** 512×512. Um marcador de tempo formado pelo contorno de um item do Jira, sugerindo que a hora está *dentro* do item, não ao lado. Sem texto, legível a 24px.

---

## 7. Categorias e busca

- **Primária:** Time tracking
- **Secundária:** Reports & analytics
- **Palavras que importam:** `time tracking`, `timesheet`, `worklog`, `jira worklog`, `time report`, `log work`, `timer`, `csv export`, `worklogAuthor`

**Posicionamento na descrição, não no nome:** os concorrentes se descrevem por funcionalidade ("timesheets, reports, planning"). Nós nos descrevemos por **fidelidade** ("real worklogs, as you"). É o único eixo em que os incumbentes de 4.1 e 3.9 não podem responder sem reescrever o produto.

---

## 8. Pendências antes de submeter

- [ ] Confirmar nome no Developer Console
- [ ] Confirmar limites de caracteres reais de summary e highlights
- [ ] 3 screenshots reais + ícone
- [ ] Política de privacidade e página de suporte publicadas (dependem do domínio)
- [ ] Traduções pt-BR, ES, DE, FR *(o mercado Atlassian é fortemente EN e DE — DE é a que mais importa aqui)*
- [ ] **Beta privado concluído (regra 16): 5–10 instâncias reais por 2–3 semanas**
- [ ] Revisar cada afirmação da descrição contra o comportamento real do app
