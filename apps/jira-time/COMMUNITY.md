# Atlassian Community — respostas técnicas para publicar antes do beta

**Canal 2 do `BETA-RECRUTAMENTO.md`.** A regra desse canal é **ajudar antes de pedir**: 4 respostas úteis primeiro, o anúncio do beta depois. A comunidade remove autopromoção, e postar o anúncio direto queima o canal inteiro.

**Quem publica:** Amarildo, com a conta dele em `community.atlassian.com`.
**Ritmo:** uma resposta por dia. Quatro no mesmo dia, numa conta nova, parecem exatamente o que não queremos parecer.

**Estado:** 1 de 4 publicada (27/08/2026).

---

## ⚙️ Como colar no editor da Community

Descoberto na publicação da resposta 1, em 27/08/2026:

1. **O editor rejeita `×` e outros símbolos especiais.** Use palavra ou `*`.
2. **Colar de um documento formatado leva HTML junto e o editor recusa.** Cole **texto puro**.
3. **Em prosa, escreva a comparação por extenso** — "greater than", não o sinal. O sinal só dentro da linha de JQL, e **nunca no começo da linha** (vira citação).

Por isso as respostas 2, 3 e 4 abaixo estão em **blocos de texto puro, só ASCII**: copie o conteúdo do bloco e cole direto. Sem negrito, sem marcador, sem acento em símbolo, sem traço longo.

---

## Três regras que valem para as quatro respostas

1. **Nenhum link para o Nativelog. Nenhuma menção ao app.** Nem "estou construindo algo assim". A resposta vale por si; o anúncio vem depois, num post separado.
2. **Nenhum concorrente pelo nome.** Onde a resposta toca no problema de worklog gravado pelo app em vez da pessoa, ela fala do **sintoma** — "confira se o app grava worklog nativo" — e deixa quem tem o problema se reconhecer.
3. **Não afirmar o que não medimos.** Cada resposta tem "⚠️ conferir antes de postar" quando há algo a checar.

---

## ✅ Resposta 1 — PUBLICADA em 27/08/2026

**Pergunta:** [JIRA Time Tracking - How to filter Issues where logged time > remaining time?](https://community.atlassian.com/forums/Jira-questions/JIRA-Time-Tracking-How-to-filter-Issues-where-logged-time-gt/qaq-p/3193664)
**Autor:** Jamil Wahbeh · **18/02/2026** · sem resposta aceita quando respondemos
**➜ Nossa resposta publicada:** https://community.atlassian.com/forums/Jira-questions/JIRA-Time-Tracking-How-to-filter-Issues-where-logged-time-gt/qaa-p/3281287#M1190210

**A identidade `workratio > 50` foi conferida na `northstack-dev` antes de postar. Bateu.**

### Texto publicado (verbatim)

> There's no way to compare two fields directly in native JQL: a clause compares a field to a value or a supported function, never to another field. So "timeSpent greater than remainingEstimate" has no direct equivalent.
>
> But it's worth separating two things, because I suspect the second is what you actually need.
>
> 1\. The literal question: Time Spent greater than Remaining Estimate.
>
> workratio = (timeSpent / originalEstimate) × 100. While the remaining estimate is Jira's auto-computed one (remaining = original - spent, which is what you get when nobody overrides "Remaining" while logging), "spent greater than remaining" reduces to "spent / original greater than 0.5", i.e.:
>
> project = "YOUR-PROJECT" AND workratio > 50
>
> This breaks in two situations: when someone types a value into "Remaining" while logging, and when the Original Estimate is edited after work has already been logged (from that point Jira keeps Remaining independent of Original). In either case remaining is no longer original - spent, and the filter can return items where spent is not greater than remaining. Items with no original estimate can't be evaluated by workratio at all and won't match; query "originalEstimate IS EMPTY" separately if you want to see those.
>
> 2\. What Structure is actually showing you.
>
> For an unresolved item without sub-items, Structure's time-tracking progress is spent / (spent + remaining), so it reaches 100% when remaining reaches 0, which, with auto-computed estimates, is exactly when logged work reaches the original estimate. Everything logged after that keeps it at 100% (resolution settings and aggregation over sub-items can change this, but that's the base case).
>
> So the items you're describing are probably the ones where logged time has exceeded the original estimate:
>
> project = "YOUR-PROJECT" AND workratio > 100
>
> Add "AND remainingEstimate = 0" if you want only the ones with nothing left on the estimate.
>
> 3\. The direct comparison, inside Structure.
>
> Since you're already in Structure, you don't need JQL for this: add a Filter by Formula generator (or a Formula column) with:
>
> timeSpent > remainingEstimate
>
> That's evaluated per item against the real field values, so it keeps working even when someone has edited "Remaining" by hand, which is the case where the workratio shortcut breaks.
>
> One last thing: workratio reads Jira's native Time Spent field. If any part of the team logs hours through a tool that keeps them in its own store, those hours may not be in the native field and the filter will quietly under-report. Worth opening one item's Worklog tab and comparing against your report before rolling this out.

### O que o texto publicado ganhou em relação ao rascunho — e por que importa

O rascunho respondia a pergunta literal. O publicado responde **a pergunta que a pessoa tinha de verdade**, e as três adições vieram de olhar o contexto (ele estava no Structure):

| Adição | Por que |
|---|---|
| **`workratio > 100`** | O Structure marca 100% quando o *remaining* zera, não quando o trabalho passa do estimado. Quem reclama de "passou do previsto" quase sempre quer os itens **acima do estimado** — que é `> 100`, não `> 50`. **Provavelmente é esta a linha que resolve o problema dele.** |
| **Original Estimate editado depois de apontar** | Segunda forma de a identidade quebrar, e mais comum que a primeira: a partir daí o Jira mantém Remaining independente de Original. Omitir isso deixaria a fórmula parecendo mais confiável do que é. |
| **Filter by Formula do Structure com `timeSpent > remainingEstimate`** | Ele **já tem** a ferramenta que faz a comparação direta que o JQL não faz. Mandar ele para o JQL quando a resposta certa está no app que ele já paga seria uma resposta pior — e é o tipo de coisa que faz alguém lembrar de quem respondeu. |

**A lição para as próximas três:** a resposta boa não é a que responde o enunciado, é a que responde **a situação**. Olhar o que a pessoa mencionou de passagem — a ferramenta, a versão, o time — costuma valer mais que a técnica.

---

## Resposta 2 — próxima a publicar

**Pergunta:** [worklog per month time tracking](https://community.atlassian.com/forums/Jira-questions/worklog-per-month-time-tracking/qaq-p/3173461)
**Autora:** Laura Fallon · **10/01/2026** · **tem resposta aceita** (que aponta para um app pago)

**Por que responder mesmo com resposta aceita:** a resposta aceita resolve comprando. A pergunta da Laura contém um mal-entendido específico — ela acha que o JQL devia devolver as 7h de janeiro — e ninguém explicou por que não devolve. Explicar o *porquê* é o que faz uma resposta ser lembrada.

**Antes de colar, aplique a lição da resposta 1:** veja se ela menciona a ferramenta que usa ou o tamanho do time. Se mencionar, vale uma frase específica para o caso dela.

```
Worth naming the exact reason native Jira cannot do this, because it also explains
why the JQL people usually suggest does not help either.

JQL selects work items, never worklog entries. So a query like this one:

    worklogDate >= "2026-01-01" AND worklogDate < "2026-02-01" AND worklogAuthor = "Tom"

correctly finds the items Tom touched in January, but the Time Spent column in those
results is still each item's lifetime total. In your example that is 11h, not the 7h
you are after. There is no native column or gadget that renders the per-entry
breakdown, which is why every answer here ends up at an app.

If you want the number without buying anything, the REST route is two steps:

1. Run the JQL above through the issue search endpoint to get the item keys.
2. For each key, call /rest/api/3/issue/{key}/worklog and sum the entries whose
   started date falls in January.

One trap if you try to shortcut step 2: adding expand=worklog to the search returns
at most 20 worklog entries per item, and it does not tell you that it truncated. On
a long-running item you would get a partial sum with no error at all. The per-item
worklog endpoint returns all of them.

That is a short script, and it is exact, because it reads Jira's own worklog records.
If scripting is not an option for you then an app is the honest answer. Just check
that whichever one you pick reads native Jira worklogs, otherwise the report is about
the app's copy of the hours rather than what is actually in Jira.
```

**⚠️ Conferido:** o limite de 20 worklogs por item no `expand=worklog` está documentado e foi confirmado como resposta aceita [nesta thread](https://community.atlassian.com/forums/Jira-questions/Missing-worklogs-on-API-call/qaq-p/3001402) (17/04/2025). O número do endpoint de busca fica de fora de propósito — a Atlassian trocou `/rest/api/3/search` por `/rest/api/3/search/jql` e "the issue search endpoint" está certo em qualquer versão.

---

## Resposta 3

**Pergunta:** [Help with Automation and JQL Query for Author Worklogs](https://community.atlassian.com/forums/Jira-Service-Management/Help-with-Automation-and-JQL-Query-for-Author-Worklogs/qaq-p/3091426)
**Autor:** Colin Porter · **18/08/2025** · sem resposta aceita

**Por que esta:** as três respostas existentes discutem *como* somar. Nenhuma viu que a abordagem inteira falha justamente no caso que o Colin quer pegar. Achar o furo no enunciado é a resposta mais útil que existe.

```
There is a structural problem here worth spotting before you build it, because it
will fail on exactly the case you care about.

Automation rules act on work items: the rule has to find items to run against. But
the agent you most want to warn is the one who logged nothing yesterday, and that
agent has no worklog, so there is no work item for the rule to find. Your JQL
returns zero rows for them, which is indistinguishable from "nothing to do". A
scheduled rule built on that JQL will silently skip precisely the people it is
meant to catch.

So the rule has to be driven by your list of agents, not by a list of items.

Inside Automation: scheduled trigger with no JQL, then one branch per agent (or
iterate a hardcoded list of account ids), and inside each branch a Lookup Issues
action with that agent's JQL, then sum the worklog seconds.

Two things that will bite you while building that:

- Lookup Issues is capped, 100 items by default. An agent who logged across more
  items than that gives you a low sum and a wrong warning.
- The worklog list on an item contains every worklog on that item, not just
  yesterday's and not just that agent's. So you have to filter on both the author
  account id and the started date before summing. Drop either filter and you are
  summing somebody else's hours. Build it against one item that has worklogs from
  two different people on two different days, and watch the audit log to confirm
  your smart value is filtering the way you think it is. That is the step where
  these rules usually turn out wrong.

Outside Automation: a scheduled script over /rest/api/3/issue/{key}/worklog is
honestly less fiddly, and it lets you iterate the agent roster directly instead of
iterating items. If you have anywhere to run a cron job, I would go that way.

Either way: build the zero-hours case first, and test it with an agent who genuinely
logged nothing. That is the one that fails quietly.
```

**⚠️ Conferir antes de postar:** a resposta **não** dá a sintaxe exata do smart value de propósito — a forma do `.filter()` em listas mudou entre versões da Automation e não confirmei qual está valendo hoje. **Se alguém pedir a sintaxe exata nos comentários, me traz a thread** — eu confirmo na documentação em vez de chutar.

---

## Resposta 4

**Pergunta:** [why am i not seeing worklog as a gadget to include on my dashboard](https://community.atlassian.com/forums/Jira-questions/why-am-i-not-seeing-worklog-as-a-gadget-to-include-on-my/qaq-p/3011120)
**Autor:** kenny · **01/05/2025** · sem resposta aceita

**Por que esta:** pergunta de iniciante, respostas existentes vagas, e a resposta boa é curta. Serve para variar o tom — nem toda contribuição precisa ser um tratado.

```
Short answer: there is no worklog gadget in Jira Cloud. The reason is worth knowing,
because it tells you which workaround to pick.

What you do get natively:

- Company-managed projects: project sidebar, then Reports, then Time Tracking Report
  (estimate against logged, per item) and User Workload Report (remaining estimate
  per person, and note that is remaining, not logged).
- Team-managed projects: the Worklog pie chart gadget, which does exist on
  dashboards, but slices totals by a field with no date range.
- Any filter results gadget can show a Time Spent column.

The gap is the same in all three: they show totals per work item, never individual
worklog entries with their dates. "How long did each person spend last week" is a
question about entries, and no native surface renders entries. So it is a data-shape
limit, not a setting. If someone tells you to enable something, it is not there to
enable.

Two ways out:

1. JQL plus export. A filter like this one:

       project = X AND worklogDate >= startOfWeek()

   gets you the items touched this week, and you export the result to CSV. Caveat:
   the Time Spent column is still each item's lifetime total, not this week's, so
   you will be reconciling by hand.

2. REST, if you can script it: /rest/api/3/issue/{key}/worklog returns every entry
   with author, started and timeSpentSeconds, which is exactly the shape you want,
   and it is the same data the reports are built from.

If neither fits, an app is a fair answer here. Just check that it reads native Jira
worklogs rather than keeping hours in its own database, or the numbers in your gadget
and the numbers in the item's Worklog tab will drift apart over time.
```

**⚠️ Conferir antes de postar:** confirmar que o gadget **Worklog pie chart** aparece mesmo num projeto team-managed. Se não aparecer, **corte esse item da lista** — os outros dois seguem válidos.

---

## Depois das quatro: o post do beta

Só depois que as quatro estiverem publicadas — e de preferência com pelo menos uma marcada como útil ou aceita — vai o anúncio do beta. **Post novo, não comentário numa thread alheia.** O texto está em [`BETA-ANUNCIO.md`](BETA-ANUNCIO.md).

---

## Controle

| # | Pergunta | Data | Publicada | Reação |
|---|---|---|---|---|
| 1 | [logged time > remaining time](https://community.atlassian.com/forums/Jira-questions/JIRA-Time-Tracking-How-to-filter-Issues-where-logged-time-gt/qaa-p/3281287#M1190210) | 18/02/2026 | ✅ **27/08/2026** | — |
| 2 | worklog per month | 10/01/2026 | ⬜ | |
| 3 | Automation sum worklogs | 18/08/2025 | ⬜ | |
| 4 | worklog gadget | 01/05/2025 | ⬜ | |
| — | **Post do beta** | — | ⬜ | |

**Se alguém responder com uma pergunta técnica, me traz a thread.** Eu escrevo a réplica. Uma conversa que continua vale mais que quatro respostas soltas — e é ali que aparece o candidato a beta.

**Vale acompanhar a resposta 1 por alguns dias.** Ela tem a maior chance de virar resposta aceita das quatro: a thread estava sem resposta aceita, e o `workratio > 100` provavelmente é o que o autor queria. Se for aceita, o post do beta parte de outro patamar.
