# Nativelog — Atlassian Marketplace Listing (v1 draft)

> Regra 8: escrita **depois** da verificação de mercado (`PESQUISA.md`, rodadas 4 e 5) e **depois** do spike que provou a cunha em produção.
> Idioma base: EN. Traduções: pt-BR, ES, DE, FR (regra 9).
> Status: **rascunho v1** — revisar com screenshots reais antes de submeter.

---

## 1. Nome público

**`Nativelog`** — busca na Marketplace em 26/08/2026 retorna **zero apps** com esse nome ou parecido. `Loggd` também estava livre; `Worklogic`, `Truelog` e `Nativa` colidem com apps existentes.

O nome diz a cunha: **native + worklog**. Nome de listagem completo, para a busca:

> **Nativelog — Native Time Tracking & Timesheets for Jira**

**Verificar antes de registrar:** disponibilidade do nome no Developer Console (a busca da Marketplace não é prova definitiva) e do domínio `nativelog.com` / subdomínio em `northstackapps.com`.

**Alternativas se colidir:** `Loggd`, `Nativelog Time`, `Truetime for Jira`.

---

## 2. Summary / tagline (limite ~80 caracteres — confirmar na tela de submissão)

> `Time tracking that writes real Jira worklogs, as you. JQL and reports just work.`

(79 caracteres)

Alternativas:
- `Your hours live in Jira, not in our database. Native worklogs, as the user.` (74)
- `Native Jira worklogs, logged as you. Timesheets without breaking your JQL.` (73)

---

## 3. Highlights (3 blocos, título + descrição)

**1. Real worklogs, logged as you**
Every entry is a native Jira worklog created with **your** account — not the app's. `worklogAuthor = currentUser()` returns what you'd expect, and so do your saved filters, automation rules, dashboards and exports.

**2. Start the timer, stop it whenever**
The timer records only the start. When you stop it, Nativelog writes a single worklog with the correct retroactive time. Forgot to stop it? Fix the entry before it's written. No duplicated clocks, no phantom entries.

**3. Timesheets that read from Jira, not from a copy**
Your weekly sheet and the team view are built by reading Jira's own worklogs. There's no second database to fall out of sync, and nothing to migrate if you ever uninstall.

---

## 4. Descrição longa

### Your hours belong in Jira. Not in our database.

Most Jira time trackers keep hours in their own store and push a shadow back into Jira — or nothing at all. You find out weeks later, when a JQL filter on `worklogAuthor` comes back empty, when a dashboard gadget shows zero, or when the finance export doesn't match what the team actually logged.

**Nativelog has no shadow copy.** Every entry is a native Jira worklog, created through the Jira API with your own account. There is no sync, because there is nothing to sync.

### What that buys you

**Your JQL keeps working.** `worklogAuthor = currentUser()`, `worklogDate >= startOfWeek()` — the queries you already have keep returning what they should, because the worklogs are real.

**Your automation keeps working.** Jira automation rules that react to worklogs see Nativelog entries like any other. No webhooks to wire up.

**Your reports keep working.** Native time reports, dashboard gadgets, eazyBI, Power BI — anything that reads Jira worklogs reads yours. We don't ask you to rebuild your reporting inside our app.

**Uninstalling costs you nothing.** Remove Nativelog and every hour stays exactly where it is: in Jira. No export, no migration, no lock-in. We'd rather earn the renewal.

### The everyday parts

- **Timer or manual entry**, from the work item, with the date and time you choose — including yesterday, or last Friday
- **Your week at a glance**, with per-day totals and a jump back to any item
- **Team view for leads** — who logged what, by project or group, read-only
- **CSV export with real filters**, including *exclude these projects* instead of ticking 50 boxes one at a time

### What Nativelog does not do

No approval workflows. No billing rates, budgets or invoicing. No capacity planning or forecasting. No mobile app. If you need a professional-services suite, buy one — there are good ones. If you need time tracking that doesn't lie to Jira, this is it.

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

**Screenshot 1 — "É um worklog de verdade"**
Split. À esquerda, o painel do Nativelog num item `SCRUM-142` com uma entrada de 3h e o botão de timer. À direita, **a aba nativa de worklog do próprio Jira**, mostrando a mesma entrada com a foto e o nome do usuário como autor — não "Nativelog app". Legenda: *"Same entry. Jira's own worklog tab. Your name on it."*

**Screenshot 2 — "O JQL que você já tem"**
Tela de busca do Jira com a query `worklogAuthor = currentUser() AND worklogDate >= startOfWeek()` digitada e 7 resultados. Ao lado, um gadget nativo de dashboard mostrando as horas da semana. Legenda: *"Nothing to rebuild. Your filters and gadgets already understand these hours."*

**Screenshot 3 — "A semana, e o CSV"**
Folha de ponto semanal com dias na horizontal, totais por dia no rodapé e 5 itens listados. Aberto por cima, o seletor de exportação com **"Exclude projects"** e três projetos marcados para sair. Legenda: *"Export what you need — excluding projects, not ticking fifty boxes."*

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
