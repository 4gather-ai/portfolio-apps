# Anúncio do beta — textos prontos

**Não publicar antes das 4 respostas da Community** ([`COMMUNITY.md`](COMMUNITY.md)). A ordem é a regra do canal: ajudar primeiro, pedir depois. Publicar o anúncio antes queima o canal inteiro, e a Community remove autopromoção.

**Pré-requisito:** `northstackapps.com` no ar com [`beta.html`](../../site/nativelog/beta.html), `support.html` e `privacy.html` — o post precisa de um link que exista.

**Regra de formato, aprendida na resposta 1:** o editor da Community recusa HTML de colagem e símbolos especiais. Os textos abaixo estão em **blocos de texto puro, só ASCII**. Copie o conteúdo do bloco e cole direto.

---

## Onde postar, em ordem

| # | Onde | Quando | Observação |
|---|---|---|---|
| 1 | **Atlassian Community** — fórum de apps/Marketplace, post novo | depois das 4 respostas | Público mais quente. Post próprio, **nunca** comentário em thread alheia |
| 2 | **r/jira** | 2–3 dias depois | Leia as regras do sub antes. Alguns exigem flair ou proíbem autopromoção fora de dia marcado |
| 3 | **community.developer.atlassian.com** | opcional, por último | Público de construtores, não de compradores. Vale pela medição do índice, não pelo recrutamento |

---

## 1. Atlassian Community

**Título sugerido:**

```
Private beta: a Jira time tracker whose data is the native worklog (looking for 5-10 teams)
```

**Corpo:**

```
I have been answering a few time-tracking questions here over the past week, and
the same thing kept coming up in different shapes: people log hours through an
app, and then the hours are not really in Jira. worklogAuthor = currentUser()
returns nothing, the native Time Tracking Report disagrees with the app's
report, and leaving the app means exporting a CSV and hoping.

So I built the opposite of that, and I am looking for a handful of teams to
break it before it goes to the Marketplace.

What it is

Nativelog is a Forge app for Jira Cloud. Timer in the work item panel, manual
entry for the day you forgot, and a weekly timesheet you can correct in place.

The part that actually matters: every entry it creates is a native Jira
worklog, written as you rather than as the app. Not a copy, not a sync, not a
mirror. It shows up in the item's Work log tab, in JQL, and in Jira's own
reports, and it stays there if you uninstall the app. There is nothing to
export because there is nothing of yours that we hold.

What that buys you, concretely

- worklogAuthor = currentUser() finds your hours, because you are the author
- Jira's native Time Tracking Report agrees with the app, because it is the
  same data
- Uninstalling loses nothing. That is a design constraint, not a promise
- It runs on Atlassian infrastructure and is eligible for Runs on Atlassian,
  so app data stays where your Jira data already is

What I am asking for

5 to 10 real Jira Cloud sites, real work, two to three weeks. Free during the
beta and for at least a month after it. What I want back is the unflattering
half: the number that looked wrong, the screen you had to read twice, and
above all the thing that made you go back to your old way of doing it.

If it helps to know what you are agreeing to: install takes a few seconds,
there is no configuration, and uninstalling leaves your hours in Jira.

How it works and what to try:
https://northstackapps.com/nativelog/beta.html

Reply here or email support@northstackapps.com and I will send the install
link.

Two things I would rather say up front. It is a new app from one developer,
so it will have rough edges, which is exactly why I want people to find them
now. And it does one thing: your own time. Team dashboards and approvals are
not in this version.
```

**⚠️ Antes de postar:** conferir a regra do fórum escolhido. Alguns espaços da Community têm seção própria para beta/lançamento — se houver, usar essa. Post de produto na área de perguntas técnicas é removido.

---

## 2. r/jira

O tom muda. Reddit rejeita texto de marketing e recompensa quem admite limitação.

**Título sugerido:**

```
Built a Jira time tracker that writes native worklogs under your own name - looking for beta testers
```

**Corpo:**

```
Context, because it explains the whole thing: most Jira time tracking apps keep
your hours in their own database and push a summary into Jira, or write the
worklog as the app instead of as you. Which is why worklogAuthor =
currentUser() comes back empty for a lot of people, the native report and the
app report disagree, and leaving means exporting a CSV.

I built one that does not do that. Every entry is a native Jira worklog written
as you, using Forge's asUser. It lands in the Work log tab, in JQL, and in
Jira's own reports. If you uninstall it, your hours are still there, because
they were never ours.

It has a timer in the item panel, manual entry with a past date for the day you
forgot, and a weekly timesheet you can fix in place.

Looking for 5 to 10 teams on real Jira Cloud sites for two or three weeks.
Free during the beta and for a while after. I would rather hear what annoyed
you than what you liked.

Honest limitations, since you would find them anyway:

- Jira Cloud only, no Server or Data Center
- Your own time only. No team dashboards or approvals in this version
- One timer per person at a time, on purpose
- New app, one developer. Rough edges are the point of a beta

What it does and how to install:
https://northstackapps.com/nativelog/beta.html

Happy to answer anything here. If you want the install link, comment or email
support@northstackapps.com.
```

**⚠️ Antes de postar em r/jira:**
1. Ler as regras do sub na barra lateral. Vários subs de ferramenta proíbem autopromoção fora de uma thread semanal.
2. Se exigir flair, escolher o correto.
3. **Não postar de conta sem histórico.** Se a conta for nova, comentar em outras threads por alguns dias antes.
4. Responder todos os comentários, inclusive os hostis, sem defensividade.

---

## 3. Fórum de desenvolvedores (opcional)

Público de **construtores, não de compradores** — quase ninguém ali administra a instância que queremos no beta. Só vale por três motivos indiretos: é onde a medição do atraso do índice interessa, é onde desenvolvedores de Solution Partners leem, e é onde teríamos que perguntar sobre `asUser` e revisão de qualquer forma.

**Com um cuidado registrado em `BETA-RECRUTAMENTO.md`:** é o único público que consegue **copiar a cunha a partir da descrição dela**. Lá compartilhamos **a medição, não a solução** — nada de código do `asUser`, nada do desenho do KVS.

Por isso: nada de anúncio ali. Se sair alguma coisa, é um post técnico sobre a latência do índice de busca (~5,7 s medidos), sem link para o app.

---

## Depois de postar

| O quê | Por quê |
|---|---|
| **Responder tudo em até algumas horas** | A janela de um post é curta; resposta rápida é o que converte leitor em participante |
| **Trazer as threads técnicas para cá** | Eu escrevo a réplica — é onde aparece o candidato a beta |
| **Anotar cada candidato em `BETA.md`** | Quem é, que instância, quando instalou, o que quebrou |
| **Não repetir o post** | Republicar o mesmo texto em vários espaços é o que faz moderador remover |

**Lembrete da regra 16:** o beta só termina quando **5 instâncias reais usarem de verdade**. Prazo não substitui uso, e um post bem-sucedido que rende três curiosos e nenhum instalador não é progresso.
