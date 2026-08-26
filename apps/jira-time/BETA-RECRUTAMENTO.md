# Beta privado — recrutamento

**Meta: 5 a 10 instâncias reais usando de verdade** por 2–3 semanas (regra 16).
**Começa no D1 (26/08/2026), em paralelo com o código** — não no D15. É o caminho crítico do projeto.

> **Atualizado em 26/08/2026 (D1).** O Amarildo **descartou o canal 1 (rede pessoal)**. A ordem de prioridade passa a ser **2 → 3 → 5**, com o **canal 6 (fórum de desenvolvedores)** somado. A numeração dos canais foi mantida para não quebrar as referências no `COMMUNITY.md`.
>
> **O que isso custa, dito claramente:** o canal 1 era o de maior conversão e o único que não dependia de estranhos confiarem num app desconhecido. Sem ele, as primeiras duas ou três instâncias — as que destravam a confiança para as outras — ficam mais caras e mais lentas. Os canais restantes são todos de público frio. **O ponto de decisão do D14 fica mais provável de bater**, e a resposta continua sendo trocar de canal, não encurtar o beta.

---

## ⚠️ Uma coisa que eu não vou fazer, e por quê

O pedido incluía *"autores de avaliações negativas de Tempo/Clockwork sobre asApp e delay"* como lista de alvos. **Não vou montar uma lista de pessoas nomeadas a partir das avaliações e caçar o contato delas.**

As avaliações da Marketplace mostram nome e, às vezes, empresa. Transformar isso numa lista de alvos exigiria cruzar esses nomes com LinkedIn ou e-mail corporativo para chegar na pessoa — ou seja, **compilar dado pessoal de várias fontes para abordagem não solicitada**. Não faço isso, e além do desconforto ético é um mau começo comercial: a primeira impressão do produto viraria "me acharam pelo que eu reclamei".

**O que eu faço, e que serve ao mesmo objetivo:** uso as avaliações como **inteligência de linguagem e de dor** — as palavras exatas que essas pessoas usaram, os sintomas que descreveram — e levo essa mensagem aos **lugares públicos onde elas estão**. Quem se reconhece, aparece. É mais lento no primeiro contato e muito melhor na conversão, porque quem responde já se identificou com o problema.

Se você quiser abordar reviewers individualmente, é uma decisão sua e você tem todo o direito de fazê-la — só não vou montar a lista.

---

## O que as avaliações nos ensinaram (a matéria-prima da mensagem)

Do corpus de 1.174 avaliações lidas na rodada 5, as palavras que os insatisfeitos usam:

| O que dizem | Onde apareceu |
|---|---|
| *"worklog gets loged asApp and not asUser"* · *"worklogAuthor = currentUser() returns zero results"* | Tempo, 2★ |
| *"Does not integrate with JIRA time tracking fields and features"* | Harvest, 1★ |
| *"delay in time logs appearing in Jira and in the timesheet"* | Clockwork Pro, 3★ |
| *"exclude some projects when filtering instead of selecting one by one"* | Tempo, 3★ |
| *"licensing cost is based on all Jira users rather than just the QA team"* | Zephyr, 3★ |

**Regra de mensagem:** falar do **sintoma**, nunca do concorrente pelo nome. Quem tem o problema reconhece na hora; quem não tem, ignora. E não começamos uma briga pública com quem tem 27 mil instalações.

---

## Canais, em ordem de custo e eficácia

### ~~1. Rede pessoal e clientes~~ — **DESCARTADO pelo Amarildo em 26/08/2026**
Decisão dele, e é dele para tomar. Fica registrado o que se perde: era o canal de maior conversão e o único de público quente. Se em D14 faltarem candidatos, este é o primeiro lugar para reabrir a conversa.

### 2. Atlassian Community (D2–D5) — **PRIORIDADE 1** · o mais qualificado dos públicos
**Onde:** `community.atlassian.com`, tags `jira-cloud`, `time-tracking`, `worklogs`, `forge`.
**Como:** responder perguntas reais sobre worklog e JQL **primeiro**, sem vender. Depois de 3–4 respostas úteis, um post no espaço de apps anunciando o beta.
**O humano faz:** criar a conta e postar. **As 4 respostas técnicas estão escritas e prontas em [`COMMUNITY.md`](COMMUNITY.md)** — uma por dia, D2 a D5, com o que conferir antes de cada uma.
**Cuidado:** a comunidade tem regras contra autopromoção. Postar direto vira remoção e queima o canal — daí a ordem "ajudar antes de pedir".

### 3. r/jira (D3–D7) — **PRIORIDADE 2**
**Onde:** `reddit.com/r/jira`, ~40 mil membros, tolerante a "estou construindo isto, querem testar?" quando é honesto.
**Como:** post único, primeira pessoa, sem link de vendas — só o convite e um e-mail de contato.
**O humano faz:** postar de uma conta com algum histórico. **Conta nova postando link é removida por spam.** Se não tiver conta antiga, pular este canal.

### 4. LinkedIn (D5–D10) — prioridade menor
**Onde:** post do Amarildo + grupos de Atlassian.
**Como:** post curto contando o achado técnico (o worklog `asApp` que quebra JQL). Conteúdo técnico honesto circula; anúncio não.
**O humano faz:** publicar. É o canal mais dependente de você — é a sua rede.

### 5. Solution Partners pequenos (D7–D14) — **PRIORIDADE 3** · o de maior alavancagem
**Onde:** `partnerdirectory.atlassian.com`, filtrando por parceiros pequenos e regionais.
**Por quê:** um parceiro atende várias instâncias. Um "sim" pode virar 3–5 betas de uma vez, e vira canal de venda depois.
**O humano faz:** escrever para 10 parceiros. Resposta é lenta (dias), por isso começar cedo.

### 6. Atlassian Developer Community (D4–D10) — **NOVO em 26/08/2026** · canal de credibilidade, não de volume
**Onde:** `community.developer.atlassian.com`, categorias `Jira Cloud` e `Forge`.
**Quem está lá:** desenvolvedores de app, vendors da Marketplace e o time de plataforma da própria Atlassian. **Quase ninguém ali administra a instância que a gente quer no beta** — é um público de construtores, não de compradores.

**Então por que entrar:**
- **É onde o achado do spike interessa de verdade.** "Medi ~5,7 s de atraso do índice de busca entre gravar um worklog e o JQL enxergá-lo" é um dado que aquele público usa no mesmo dia. Contribuição real, não conteúdo de marketing.
- **Os desenvolvedores dos Solution Partners leem esse fórum.** É o caminho mais barato até o canal 5, que é o de maior alavancagem.
- **Os engenheiros da Atlassian respondem lá.** É onde se pergunta sobre `asUser`, limites do KVS e revisão da Marketplace — coisas que vamos precisar perguntar de qualquer forma entre o D11 e a submissão.

**⚠️ O risco deste canal, dito antes de usá-lo.** É o único público que consegue **copiar a cunha a partir da descrição dela**. Um admin que lê "grava worklog nativo com a identidade da pessoa" fica interessado; um vendor concorrente que lê a mesma frase com detalhe de implementação ganha uma tarde de trabalho. A tese já é pública (está na listagem e nas mensagens dos outros canais) — o que **não** publicamos aqui é o *como*: nada de trecho de código do `asUser`, nada do desenho do KVS, nada da regra de ler pelo endpoint do item em vez de JQL. **Compartilhar a medição, não a solução.**

**O humano faz:** criar a conta (é separada da `community.atlassian.com`) e postar. Eu escrevo os textos quando chegar a hora — **não no D1**: este canal vem depois das respostas do canal 2, porque a mesma regra vale, ajudar antes de pedir.

---

## Mensagens

### Canal 5 — e-mail direto a Solution Partners (EN)

> **Subject:** Beta testers wanted — Jira time tracking that writes real worklogs
>
> Hi [nome],
>
> I'm building a Jira Cloud time tracking app and I'm looking for 5–10 teams to try it before it goes public.
>
> The problem it fixes: most Jira time trackers keep hours in their own database and write them back to Jira as the app, not as the person. So `worklogAuthor = currentUser()` returns nothing, dashboards show zeros, and the timesheet lags behind what people actually logged.
>
> Nativelog writes native Jira worklogs with the user's own account. No shadow copy, nothing to sync, and nothing to migrate if you uninstall.
>
> The beta is free, runs 2–3 weeks, and all I need back is what breaks and what annoys you. If it's not useful you uninstall it and we're still good.
>
> Interested?
>
> Amarildo — Northstack Apps

### Canal 5 — e-mail direto a Solution Partners (pt-BR)

> **Assunto:** Procuro times para testar um app de apontamento de horas no Jira
>
> Oi [nome],
>
> Estou construindo um app de apontamento de horas para Jira Cloud e procuro 5 a 10 times para usar antes de publicar.
>
> O problema que ele resolve: a maioria dos apps guarda as horas no banco deles e devolve para o Jira em nome do app, não da pessoa. Aí `worklogAuthor = currentUser()` não retorna nada, os gadgets do painel mostram zero, e a folha de ponto fica atrasada em relação ao que foi apontado.
>
> O Nativelog grava worklog nativo do Jira com a conta do próprio usuário. Sem cópia paralela, sem sincronização, e sem migração se você desinstalar.
>
> O beta é gratuito, dura 2–3 semanas, e tudo que preciso de volta é o que quebrar e o que incomodar. Se não servir, é só desinstalar.
>
> Topa?
>
> Amarildo — Northstack Apps

### Canal 2 — Atlassian Community (EN, post curto)

> **Title:** Looking for beta testers: time tracking that writes native Jira worklogs
>
> I've been building a Forge app for Jira Cloud time tracking, and the design decision behind it came from reading a lot of reviews of existing tools.
>
> The recurring complaint isn't features — it's that hours don't end up in Jira properly. Worklogs written by the app instead of the user, so JQL on `worklogAuthor` comes back empty. Or entries that take a while to show up because the tool reads them back through the search index.
>
> So the app writes real worklogs as the user, and reads them from the issue endpoint rather than JQL — the search index lags by a few seconds after a write, which I measured at around 5–6s on a test instance.
>
> Looking for 5–10 instances to run it for a couple of weeks before it goes on the Marketplace. Free, and I'm after bug reports more than praise. Reply here or DM me.

### Canal 3 — r/jira (EN)

> **Title:** Built a Jira time tracker because the worklogs kept getting written by the app instead of the user — looking for testers
>
> Short version: if you've ever written a JQL filter on `worklogAuthor = currentUser()` and got nothing back even though your team logged hours all week, you've hit the thing I got annoyed enough to fix.
>
> Most time tracking apps store hours in their own DB and push them into Jira under the app's account. Mine writes native worklogs as you. That's basically the whole pitch — everything else (timesheet, CSV export, team view) is built on top of Jira's own data.
>
> Free Forge app, not on the Marketplace yet. I want 5–10 teams to break it for a couple of weeks. No sales call, no credit card. Comment or DM.

### Canal 4 — LinkedIn (pt-BR)

> Passei uma semana lendo 1.174 avaliações de apps de apontamento de horas do Jira antes de escrever uma linha de código.
>
> A reclamação mais comum não é falta de funcionalidade. É que as horas não chegam direito no Jira. Um usuário escreveu: *"cada worklog é gravado como app e não como usuário, então `worklogAuthor = currentUser()` retorna zero"*. Ele até apontou a correção na própria avaliação.
>
> Testei numa instância real: dá para gravar worklog nativo com a identidade da pessoa. E medi outra coisa — o índice de busca do Jira leva ~5,7 s para enxergar um worklog recém-criado, o que explica as reclamações de "a folha de ponto está atrasada" em vários apps.
>
> Estou montando um beta privado com 5 a 10 times antes de publicar na Marketplace. Se seu time usa Jira e aponta horas, me chama.

---

## Controle

| Prio | Canal | Responsável | Início | Meta | Status |
|---|---|---|---|---|---|
| — | ~~Rede pessoal~~ | — | — | — | 🚫 descartado em 26/08 |
| **1** | Atlassian Community | Amarildo (textos prontos em `COMMUNITY.md`) | D2 | 4 respostas + 1 post | ⬜ |
| **2** | r/jira | Amarildo | D3 | 1 post | ⬜ |
| **3** | Solution Partners | Amarildo (textos meus) | D7 | 10 contatos → 2 sins | ⬜ |
| 4 | Developer Community | Amarildo (textos meus) | D4 | 1 contribuição técnica | ⬜ |
| 5 | LinkedIn | Amarildo | D5 | 1 post + 5 DMs | ⬜ |

**Ponto de decisão no D14:** se houver menos de 5 confirmados, **o problema é o canal, não o prazo**. Reavaliar a abordagem — não encurtar o beta nem publicar sem ele. Com o canal 1 fora, a primeira coisa a reconsiderar nesse ponto é justamente reabri-lo.

## O que eu faço sem você

Escrevo e reviso todo o texto, adapto por canal e idioma, redijo as respostas técnicas da Community, preparo o material de onboarding do beta (instruções de instalação, o que testar, como reportar) e mantenho este arquivo atualizado.

## O que só você pode fazer

Ter a rede, criar as contas, apertar publicar e **conversar com gente**. Nenhum dos cinco canais funciona sem uma pessoa real com nome e histórico — e é justamente por isso que este é o item mais arriscado do plano.
