# Atlassian Community — respostas técnicas para publicar antes do beta

**Canal 2 do `BETA-RECRUTAMENTO.md`.** A regra desse canal é **ajudar antes de pedir**: 4 respostas úteis primeiro, o anúncio do beta depois. A comunidade remove autopromoção, e postar o anúncio direto queima o canal inteiro.

**Quem publica:** Amarildo, com a conta dele em `community.atlassian.com`.
**Quando:** D2–D5 (27/08 a 30/08). Uma resposta por dia, não as quatro de uma vez — quatro respostas no mesmo dia numa conta nova parecem exatamente o que não queremos parecer.

---

## Três regras que valem para as quatro respostas

1. **Nenhum link para o Nativelog. Nenhuma menção ao app.** Nem "estou construindo algo assim". A resposta vale por si; o anúncio vem depois, num post separado.
2. **Nenhum concorrente pelo nome.** Onde a resposta toca no problema de worklog gravado pelo app em vez da pessoa, ela fala do **sintoma** — "confira se o app grava worklog nativo" — e deixa quem tem o problema se reconhecer. Não começamos briga pública com quem tem 27 mil instalações.
3. **Não afirmar o que não medimos.** Cada resposta abaixo tem uma seção "⚠️ conferir antes de postar" quando há algo a checar. Uma resposta errada num fórum técnico custa mais reputação do que quatro certas ganham.

---

## Resposta 1 — a mais valiosa das quatro

**Pergunta:** [JIRA Time Tracking - How to filter Issues where logged time > remaining time?](https://community.atlassian.com/forums/Jira-questions/JIRA-Time-Tracking-How-to-filter-Issues-where-logged-time-gt/qaq-p/3193664)
**Autor:** Jamil Wahbeh · **18/02/2026** · **sem resposta aceita**

**Por que esta primeiro:** é a mais recente, está sem resposta aceita, e as quatro respostas existentes são todas "compre o app X". Existe uma solução nativa que ninguém deu. É o melhor tipo de primeira aparição que se pode fazer num fórum.

> There's no way to compare two fields to each other in JQL — every operator compares a field to a literal, never to another field. So `timeSpent > remainingEstimate` has no direct equivalent.
>
> But for the specific case you're describing, `workratio` gets you there, because of how Jira derives the remaining estimate.
>
> `workratio = (timeSpent / originalEstimate) × 100`
>
> When the remaining estimate is Jira's auto-computed one (the default — someone logs work and doesn't override "Remaining"), then `remaining = originalEstimate − timeSpent`. Substitute that into what you want:
>
> ```
> timeSpent > remaining
> timeSpent > original − timeSpent
> 2 × timeSpent > original
> timeSpent / original > 0.5
> ```
>
> which is exactly `workratio > 50`. So:
>
> ```
> project = "YOUR-PROJECT" AND workratio > 50
> ```
>
> Two things to check on your instance before you trust it:
>
> - It only holds while the remaining estimate is the auto-computed one. If anyone typed a new value into "Remaining" when logging work, remaining is no longer `original − spent` and the identity breaks for that item.
> - Items with no original estimate get `workratio = -1`, so they drop out of the filter silently. Add `AND originalEstimate IS NOT EMPTY` if you want to see them separately rather than not at all.
>
> One thing that catches people out with Structure in particular: `workratio` reads Jira's **native** Time Spent field. If any part of your team logs time through a tool that keeps hours in its own store, those hours may not be in the native field, and the filter will quietly under-report rather than error. Worth opening one item's Worklog tab and comparing it against what your reports show before you roll the filter out to anyone.

**⚠️ Conferir antes de postar (5 minutos, na `northstack-dev`):**
1. Criar um item com Original Estimate = 4h.
2. Apontar 3h **sem** mexer no campo Remaining. Conferir que Remaining virou 1h.
3. Rodar `workratio > 50` e confirmar que o item aparece (3/4 = 75%, e 3h > 1h — bate).
4. Apontar mais 1h no mesmo item e conferir que continua aparecendo.

Se o passo 3 não bater, **não postar** — me avisa que eu refaço a conta.

---

## Resposta 2

**Pergunta:** [worklog per month time tracking](https://community.atlassian.com/forums/Jira-questions/worklog-per-month-time-tracking/qaq-p/3173461)
**Autora:** Laura Fallon · **10/01/2026** · **tem resposta aceita** (que aponta para um app pago)

**Por que responder mesmo com resposta aceita:** a resposta aceita resolve comprando. A pergunta da Laura contém um mal-entendido específico — ela acha que o JQL devia devolver as 7h de janeiro — e ninguém explicou por que não devolve. Explicar o *porquê* é o que faz uma resposta ser lembrada.

> Worth naming the exact reason native Jira can't do this, because it explains why the JQL people usually suggest doesn't help either.
>
> JQL selects **work items**, never worklog entries. So this:
>
> ```
> worklogDate >= "2026-01-01" AND worklogDate < "2026-02-01" AND worklogAuthor = "Tom"
> ```
>
> correctly finds the item Tom touched in January — but the Time Spent column in those results is still the item's **lifetime** total. In your example that's 11h, not the 7h you're after. There's no native column or gadget that renders the per-entry breakdown, which is why every answer here ends up at an app.
>
> If you want the number without buying anything, the REST route is two steps:
>
> 1. Run the JQL above through the issue search endpoint to get the item keys.
> 2. For each key, `GET /rest/api/3/issue/{key}/worklog` and sum the entries whose `started` falls in January.
>
> One trap if you try to shortcut step 2: adding `expand=worklog` to the search returns at most **20 worklog entries per item**, and it doesn't tell you it truncated. On a long-running item you'd get a partial sum with no error. The per-item worklog endpoint returns all of them.
>
> That's a short script, and it's exact, because it reads Jira's own worklog records. If scripting isn't an option for you then an app is the honest answer — just check that whichever one you pick reads native Jira worklogs, otherwise the report is about the app's copy of the hours rather than what's actually in Jira.

**⚠️ Conferir antes de postar:** o limite de 20 worklogs por item no `expand=worklog` está documentado e foi confirmado como resposta aceita [nesta thread](https://community.atlassian.com/forums/Jira-questions/Missing-worklogs-on-API-call/qaq-p/3001402) (17/04/2025). Não citei o número do endpoint de busca de propósito — a Atlassian trocou `/rest/api/3/search` por `/rest/api/3/search/jql` e não quero errar a versão num fórum. "the issue search endpoint" está certo em qualquer caso.

---

## Resposta 3

**Pergunta:** [Help with Automation and JQL Query for Author Worklogs](https://community.atlassian.com/forums/Jira-Service-Management/Help-with-Automation-and-JQL-Query-for-Author-Worklogs/qaq-p/3091426)
**Autor:** Colin Porter · **18/08/2025** · **sem resposta aceita**

**Por que esta:** as três respostas existentes discutem *como* somar. Nenhuma viu que a abordagem inteira falha justamente no caso que o Colin quer pegar. Achar o furo no enunciado é a resposta mais útil que existe.

> There's a structural problem here worth spotting before you build it, because it will fail on exactly the case you care about.
>
> Automation rules act on **work items** — the rule has to find items to run against. But the agent you most want to warn is the one who logged **nothing** yesterday, and that agent has no worklog, so there's no work item for the rule to find. Your JQL returns zero rows for them, which is indistinguishable from "nothing to do". A scheduled rule built on that JQL will silently skip precisely the people it's meant to catch.
>
> So the rule has to be driven by **your list of agents**, not by a list of items.
>
> **Inside Automation:** scheduled trigger with no JQL, then one branch per agent (or iterate a hardcoded list of accountIds), and inside each branch a Lookup Issues action with that agent's JQL, then sum the worklog seconds.
>
> Two things that will bite you while building that:
> - `lookupIssues` is capped (100 items by default). An agent who logged across more items than that gives you a low sum and a wrong warning.
> - The worklog list on an item contains **every** worklog on that item — not just yesterday's, and not just that agent's. So you have to filter on both `author.accountId` and the `started` date before summing. Drop either filter and you're summing somebody else's hours. Build it against one item with worklogs from two different people on two different days and watch the audit log to confirm your smart value is filtering the way you think it is — that's the step where these rules usually turn out wrong.
>
> **Outside Automation:** a scheduled script over `/rest/api/3/issue/{key}/worklog` is honestly less fiddly, and it lets you iterate the agent roster directly instead of iterating items. If you have anywhere to run a cron job, I'd go that way.
>
> Either way: build the zero-hours case first, and test it with an agent who genuinely logged nothing. That's the one that fails quietly.

**⚠️ Conferir antes de postar:** a resposta **não** dá a sintaxe exata do smart value de propósito — a forma do `.filter()` em listas mudou entre versões da Automation e eu não confirmei qual está valendo hoje. O conselho "confira no audit log" é honesto e é o que um engenheiro experiente diria. **Se alguém pedir a sintaxe exata nos comentários, me avisa antes de responder** — eu confirmo na documentação em vez de chutar.

---

## Resposta 4

**Pergunta:** [why am i not seeing worklog as a gadget to include on my dashboard](https://community.atlassian.com/forums/Jira-questions/why-am-i-not-seeing-worklog-as-a-gadget-to-include-on-my/qaq-p/3011120)
**Autor:** kenny · **01/05/2025** · **sem resposta aceita**

**Por que esta:** pergunta de iniciante, respostas existentes vagas, e a resposta boa é curta. Serve para variar o tom — nem toda contribuição precisa ser um tratado.

> Short answer: there's no worklog gadget in Jira Cloud. The reason is worth knowing, because it tells you which workaround to pick.
>
> What you do get natively:
>
> - **Company-managed projects** → project sidebar → Reports → **Time Tracking Report** (estimate vs. logged, per item) and **User Workload Report** (remaining estimate per person — note that's remaining, not logged).
> - **Team-managed projects** → the **Worklog pie chart** gadget, which does exist on dashboards, but slices totals by a field with no date range.
> - Any **filter results** gadget can show a Time Spent column.
>
> The gap is the same in all three: they show **totals per work item**, never **individual worklog entries with their dates**. "How long did each person spend last week" is a question about entries, and no native surface renders entries. So it's a data-shape limit, not a setting — if someone tells you to enable something, it isn't there to enable.
>
> Two ways out:
>
> 1. **JQL + export.** `project = X AND worklogDate >= startOfWeek()` gets you the items touched this week, then export to CSV. Caveat: the Time Spent column is still the item's lifetime total, not this week's, so you'll be reconciling by hand.
> 2. **REST**, if you can script it: `/rest/api/3/issue/{key}/worklog` returns every entry with `author`, `started` and `timeSpentSeconds` — exactly the shape you want, and it's the same data the reports are built from.
>
> If neither fits, an app is a fair answer here. Just check that it reads native Jira worklogs rather than keeping hours in its own database, or the numbers in your gadget and the numbers in the item's Worklog tab will drift apart over time.

**⚠️ Conferir antes de postar:** confirmar na `northstack-dev` que o gadget **Worklog pie chart** aparece mesmo num projeto team-managed. Se não aparecer, cortar aquele item da lista — os outros dois seguem válidos.

---

## Depois das quatro: o post do beta

Só depois que as quatro estiverem publicadas — e de preferência com pelo menos uma marcada como útil ou aceita — vai o anúncio do beta. **Post novo, não comentário numa thread alheia.** O texto está pronto em [`BETA-RECRUTAMENTO.md`](BETA-RECRUTAMENTO.md), canal 2.

## Controle

| # | Pergunta | Data | Postada? | Reação |
|---|---|---|---|---|
| 1 | logged time > remaining time | 18/02/2026 | ⬜ | |
| 2 | worklog per month | 10/01/2026 | ⬜ | |
| 3 | Automation sum worklogs | 18/08/2025 | ⬜ | |
| 4 | worklog gadget | 01/05/2025 | ⬜ | |
| — | **Post do beta** | — | ⬜ | |

**Se alguém responder com uma pergunta técnica, me traz a thread.** Eu escrevo a réplica. Uma conversa que continua vale mais que quatro respostas soltas — e é ali que aparece o candidato a beta.
