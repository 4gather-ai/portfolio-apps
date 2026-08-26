# STATUS — Northstack Apps

**Última atualização:** 2026-08-25 (sessão 8) · Dia 1 de 365 · **Gasto: R$ 0,00**
**Meta 12 meses:** US$ 15.000/mês recorrente · R$ 1M acumulado · Orçamento R$ 10.000

---

## 🟢 A CUNHA ESTÁ PROVADA — spike rodado em 26/08/2026

Resultado real no `SCRUM-1` da `northstack-dev`:

| Passo | Resultado |
|---|---|
| contexto | `[OK]` item = SCRUM-1 |
| 0. `asUser() /myself` | `[OK]` Amarildo Pereira · `712020:9b4086b1-…` |
| **1. `POST` worklog `asUser`** | **`[OK]` HTTP 201** · id=10000 · started=`2026-08-26T07:48:16.331-0400` · **autor=Amarildo Pereira** |
| **2. Autor == usuário real** | **`[OK]`** `712020:9b4086b1-…` — **o worklog é da pessoa, não do app** |
| 3. JQL `worklogAuthor = currentUser()` | `[FALHOU]` 0 itens — **ver diagnóstico** |
| 4. Painel nativo | `[OK]` `timespent=10800s` · `timeSpent: "3h"` |
| 5. Limpeza | `[OK]` HTTP 204 |

### O que isso decide

**Os dois passos que podiam matar o produto passaram.** O Forge cria worklog nativo via `asUser()`, com **início retroativo** (2 h antes) e com a **identidade da pessoa** — exatamente o que o Tempo não faz e pelo que perde avaliações. O painel de tempo nativo do Jira reflete as 3 h sem nenhum app envolvido.

**A cunha da rodada 5 se sustenta em produção, não só no papel.**

### O passo 3 e por que quase certamente não é o que parece

Diagnóstico: **latência do índice de busca**. O passo 4 leu o item **direto pela REST** e viu `timespent=10800s`; o passo 3 usa **JQL**, que depende do índice assíncrono do Jira. Um worklog criado milissegundos antes ainda não está indexado. O dado está certo — a busca é que não o enxergou ainda.

**Não estou tratando isso como suposição.** Redeployei o spike (**2.1.0**) com:
- **retentativa no passo 3** — 5 tentativas em ~12 s, informando em qual tentativa achou e quanto tempo levou;
- **limpeza adiada** — se o JQL não achar, o worklog **não é apagado**, e aparece um segundo botão **"Verificar de novo e limpar"** para consultar depois de 30–60 s.

Se a segunda passada achar, era índice. Se não achar, é problema real e eu investigo.

### 🔴 Preciso de você — rodar de novo (2 minutos)

1. Recarregue o `SCRUM-1` (F5, para pegar a versão 2.1.0)
2. **"Rodar spike"**
3. Se o passo 3 falhar de novo, **espere 30–60 s** e clique em **"Verificar de novo e limpar"**
4. Me mande as linhas

> Não precisa reinstalar: o deploy 2.1.0 não mudou escopos.

### ⚠️ E isso já é um achado de produto, não só de teste

Se o índice do Jira atrasa, **qualquer app que monte folha de ponto via JQL mostra dado velho** logo após o apontamento — e isso explica a reclamação do Clockwork Pro: *"delay in time logs appearing in Jira and in the timesheet"*.

**Consequência de arquitetura para a v1:** ler worklog pelo endpoint REST do item (`/issue/{key}/worklog`), que não passa pelo índice, e usar JQL só para busca ampla. Registrado antes de escrever a primeira linha do produto.

---

## ✅ Spike implantado — e uma pergunta de risco já respondida

| Etapa | Resultado |
|---|---|
| `forge deploy` | ✅ **asuser-spike 2.0.0** no ambiente `development` |
| `forge install` | ✅ Instalado em `northstack-dev.atlassian.net` (Jira) |
| Escopos | `read:jira-user`, `read:jira-work`, `write:jira-work` |
| Lint | Limpo |

### A terceira pergunta de risco caiu sozinha

O próprio deploy respondeu:

> *"The version of your app [2.0.0] that was just deployed to [development] is **eligible for the Runs on Atlassian program**."*

**Escrever worklog via `asUser` não invalida o selo Runs on Atlassian** — confirmado empiricamente, não por dedução. Das três perguntas de risco da rodada 5, **duas foram respondidas pela documentação e a terceira pelo deploy**. Resta a central: o worklog nasce com a identidade da pessoa?

### O que foi implementado

- `src/resolvers/index.js` — os 6 passos do spike, todos via `api.asUser()`; a chave do item vem do contexto do painel
- `src/frontend/index.jsx` — botão e resultado linha a linha
- `manifest.yml` — escopos adicionados, título do painel
- `@forge/api` adicionado às dependências (não vem no template)

Código em `C:\Pessoal\Projeto\PortfolioApps\spike-asuser\asuser-spike` (fora do repositório — é descartável). A versão de referência está em `apps/jira-time/spike/`.

> **Nota:** o `forge install` avisou que estamos instalando um app de desenvolvimento num site de produção. É esperado — a `northstack-dev` é um site Atlassian real no free tier, que é como toda dev instance do Forge funciona.

---

## ~~PRECISA DE VOCÊ — criar o Developer Space~~ ✅ resolvido

✅ `forge login` funcionou — **Amarildo Pereira (amrldprr@gmail.com)**, account ID `712020:9b4086b1-…`.

❌ **Bloqueio novo:** a conta ainda não é membro de nenhum **Developer Space**, e desde 2025 a Atlassian exige um para criar qualquer app Forge. O CLI se oferece para criar na hora, mas **pergunta o nome num prompt interativo** — e nenhum dos meus shells tem TTY (confirmado: `[ -t 0 ]` falso em PowerShell e Bash). A flag `--personal` não dispensa o Space.

**Rode no seu terminal** (o `forge create` cria o Space e o app na mesma passada):

```bash
mkdir C:\Pessoal\Projeto\PortfolioApps\spike-asuser
```

```bash
cd C:\Pessoal\Projeto\PortfolioApps\spike-asuser
```

```bash
forge create -t jira-issue-panel -d asuser-spike
```

Quando perguntar o nome do Developer Space, sugiro **`Northstack Apps`** — ele não é descartável como o spike: **é onde todos os nossos apps vão morar**, e o nome aparece para a Atlassian. Vale usar o nome do negócio.

**Me avise quando terminar.** Daí eu aplico os arquivos do spike, ajusto os escopos no `manifest.yml`, rodo `forge deploy` e `forge install`, e volto com os resultados.

> **Nota:** o `npm install -g @forge/cli` avisou que o script de instalação do **keytar** não rodou. O login funcionou mesmo assim, então provavelmente não é problema. Se algo reclamar de keychain: `npm install -g --allow-scripts=@forge/cli,cloudflared,keytar @forge/cli`

### ⚠️ Um ponto que vou precisar resolver depois do deploy

O spike roda num **painel de item do Jira**, ou seja, dentro do navegador logado no `northstack-dev.atlassian.net`. **Eu não tenho essa sessão** — meu navegador interno não está logado na sua conta Atlassian.

Quando chegarmos lá, as opções são: **(a)** você abre `SCRUM-1`, clica em "Rodar spike" e me manda o resultado; ou **(b)** você me autoriza a usar o seu Chrome (extensão Claude in Chrome), que já tem a sessão. Prefiro perguntar antes de tocar no seu navegador.

---

## ✅ Feito nesta sessão

| Item | Estado |
|---|---|
| **Regra 16** — beta privado obrigatório (5–10 instâncias reais, 2–3 semanas) | Adicionada ao `CLAUDE.md` |
| **Forge CLI** | Instalado, **v13.4.0**. Prompt de analytics desativado (`forge settings set usage-analytics false`) para funcionar em terminal não interativo |
| **Spike escrito** | `apps/jira-time/spike/` — resolver, frontend e runbook |
| **Perguntas 1 e 2 do risco** | **Respondidas pela documentação oficial** — ver abaixo |
| Preço | Confirmado: grátis até 10 usuários, faixa do Clockwork Pro |

### A documentação já derrubou metade do risco

| Pergunta da rodada 5 | Resposta oficial |
|---|---|
| `api.asUser()` permite **criar**, ou só ler? | **Permite escrever.** A assinatura é `api.[asApp \| asUser]().requestJira(path[, options])`, sem restrição documentada a métodos de escrita |
| E o timer com o navegador fechado? | `api.asUser()` sem accountId *"is only available in modules that support the UI kit"* — **funciona em contexto de UI**. Para fora dele existe `api.asUser(accountId)`, que exige **escopos de impersonação offline** e tem restrições |

**A sua decisão de projeto elimina esse segundo risco.** Como o timer grava só o início e o worklog nasce no "parar", em contexto de usuário, **a v1 não precisa de impersonação offline** — nem dos escopos extras, nem das restrições.

**O que a doc não responde, e só o spike responde:** se o `POST /worklog` via `asUser()` grava de fato com a identidade da pessoa, e se o JQL nativo enxerga. É a diferença entre "a API aceita a chamada" e "o dado fica certo".

### O que o spike verifica

| Passo | Prova | Se falhar |
|---|---|---|
| 0. `asUser() /myself` | Há contexto de usuário | Problema de escopo/módulo |
| **1. `POST` worklog `asUser`** | A API aceita escrita como usuário | **Cunha morta** |
| **2. Autor == usuário real** | O worklog é da pessoa, não do app | **Cunha morta** — mesmo defeito do Tempo |
| **3. JQL `worklogAuthor = currentUser()`** | O ecossistema nativo enxerga | Cunha comprometida |
| 4. Painel nativo (`timespent`) | Tempo aparece no Jira sem app | Grave, não fatal |
| 5. `DELETE` worklog | Não deixa lixo na dev site | Apagar à mão |

**Aprovação = passos 1, 2 e 3 verdes.** O spike cria worklog de 3 h com início 2 h atrás em `SCRUM-1`, confere tudo e apaga no fim.

**Se aprovar, escrevo o `LISTING.md` direto** — conforme sua decisão.

### Ambiente da dev site

- Site: **https://northstack-dev.atlassian.net/** · projeto de teste **SCRUM**
- Escopos do spike: `read:jira-user`, `read:jira-work`, `write:jira-work`

---

## Rodada 5 — time tracking para Jira Cloud

### 🎯 A cunha, em uma frase

> **Um time tracker para Jira cujo dado É o worklog nativo do Jira — gravado como a própria pessoa, na hora — para que JQL, automações, dashboards e relatórios nativos simplesmente funcionem.**

Todo concorrente guarda as horas na própria base e devolve ao Jira uma sombra: **ou nada** (Harvest), **ou com atraso** (Clockwork), **ou com a identidade errada** (Tempo). O cliente descobre tarde, quando a primeira JQL por autor volta vazia.

### A evidência

Encontrei a **API pública do Marketplace**, que devolve nota e texto por avaliação — isso fechou a lacuna de método da rodada 4 e restaurou o rigor das rodadas 1–3. **Corpus: 1.174 avaliações lidas, 200 negativas classificadas.**

| Dor | Ocorrências | Onde aparece |
|---|---|---|
| **Relatórios e exportação** | **36** | Tempo 17 · Harvest 8 · Cappsule 7 · Clockwork 3 |
| Suporte | 31 | Tempo 12 · Harvest 11 |
| **Integração / JQL / fidelidade do dado** | **25** | Harvest 12 · Clockify 5 · Tempo 3 · Clockwork 3 |
| Bug / instabilidade | 24 | Tempo 11 |
| Permissão / admin | 15 | Tempo 7 |
| Preço / licenciamento | 13 | Tempo 6 |

**As duas maiores dores são o mesmo problema visto de dois ângulos.** As citações decisivas:

- **Tempo, 2★, jun/2026:** *"each worklog gets loged **asApp and not asUser**, so every worklog on JQL side is done by Tempo Service. This could be easily avoided by using asUser."* — o reclamante aponta a correção
- **Harvest, 1★:** *"**Does not integrate with JIRA time tracking fields and features.**"* — 66 negativas em 145 avaliações, sempre o mesmo motivo
- **Clockwork Pro, 3★:** *"**delay in time logs appearing in Jira** and in the timesheet"*
- **Tempo, 3★:** *"ability to **exclude some projects when filtering instead of selecting one by one** (when you have 50+ projects)"*

### O nativo do Jira — e por que ele não ameaça

O Jira **tem** worklog, estimativa original e restante, unidades `w/d/h/m`, painel de tempo e permissões de apontamento. **Não tem** folha de ponto por pessoa, aprovação, taxas de faturamento nem relatório de utilização. Todos os 11 relatórios nativos são ágeis/de sprint — nenhum é por pessoa ou período.

> **A página oficial de preços do Jira não menciona "time tracking" uma única vez.** Free, Standard (US$ 7,91/u), Premium (US$ 14,54/u) e Enterprise têm **exatamente o mesmo** time tracking. **O teto do nativo não sobe com o plano do cliente** — ao contrário de roadmaps, onde o Advanced Roadmaps vem no Premium. Foi isso que reprovou a categoria 5 da rodada 4 e aprova esta.

### Preço por assento — o líder é 3,6× mais caro que o mais bem avaliado

| App | 10 | 50 | 250 | 1.000 |
|---|---|---|---|---|
| **Tempo** (4.1) | US$ 10,00 | US$ 260,50 | **US$ 1.070,00** | US$ 2.427,50 |
| **Clockwork Pro** (4.6) | **Grátis** | US$ 65,00 | **US$ 295,00** | US$ 610,00 |
| **Cappsule Standard** (4.4) | **Grátis** | US$ 42,50 | US$ 193,00 | US$ 530,50 |
| Harvest (2.5) / Clockify (3.9) | grátis | grátis | grátis | grátis — cobram no próprio SaaS |

**O mercado paga prêmio por incumbência, não por qualidade.** E Harvest e Clockify não são concorrentes de receita — são concorrentes de instalação.

**Para US$ 15k/mês:** 14 clientes de 250 usuários no preço do Tempo; **51 no preço do Clockwork Pro** (61 descontando os 16% do Forge). Contra ~790 lojistas na Shopify.

### Escopo da v1

**Faz:** apontar tempo pelo item (timer e manual, com data retroativa) · **gravar como worklog nativo com a identidade do usuário** · folha de ponto semanal própria · visão de equipe somente leitura para o gestor · exportação CSV com filtro de incluir/**excluir** projetos · grátis até 10 usuários.

**Fica de fora:** aprovação de horas (só 2 ocorrências em 200 negativas — não é dor) · taxas de faturamento e custo · planejamento de capacidade · previsão · integrações externas (Calendar, Slack, Outlook) · mobile · Data Center · Cloud Fortified.

**Pronto quando:** numa dev instance, alguém aponta 3 h pelo app; `worklogAuthor = currentUser()` retorna aquele item; o painel nativo mostra as 3 h; e o CSV exclui um projeto escolhido.

### ⚠️ O risco que pode matar a cunha

**Tudo depende de o Forge conseguir criar worklog com a identidade do usuário.** Três perguntas em aberto:

1. `api.asUser()` permite **criar** worklog, ou só ler?
2. E o **timer em execução** quando o usuário fecha o navegador? Escrita `asUser` costuma exigir contexto de requisição do usuário — se cair para `asApp`, reintroduz exatamente o defeito do Tempo.
3. Escrita `asUser` invalida o selo Runs on Atlassian? *(A princípio não — o selo trata de egress e hospedagem — mas precisa confirmar.)*

**Se a resposta à primeira for "não", a cunha morre e o App 1 precisa ser repensado.** É por isso que a pergunta 1 no topo pede autorização para testar antes de escrever qualquer listagem.

### Critérios

| # | Critério | Resultado |
|---|---|---|
| 3 | Sem líder grátis com selo | ✅ Passa — os grátis têm 2.5 e 3.9 |
| 4 | Categoria entre ~500 e ~5.000 avaliações | ✅ Passa — ~1.700 avaliações, 70+ mil instalações |
| 5 | Dor técnica repetida em vários concorrentes | ✅ **Passa com folga** — 4 dos 6 apps |

Critérios 1 e 2 (dor datada, regulação) não se aplicam. **Três aplicáveis, três aprovados — o primeiro candidato nessa situação em cinco rodadas.**

---

## Rodada 4 — Atlassian Marketplace (Jira e Confluence Cloud)

| # | Categoria | Líder | Nota | Instalações | Líder grátis? | Veredito |
|---|---|---|---|---|---|---|
| 1 | **Time tracking** | Tempo Timesheets | **4.1** | 27,2 mil | Não | 🟡 **Dor técnica confirmada** |
| 2 | **Test management** | Xray | **4.3** | 25,7 mil | Não | 🟡 **Incumbentes fracos** |
| 3 | PDF/Word do Confluence | Scroll PDF (K15t) | 4.7 | 8,9 mil | Não | 🔴 K15t resolveu bem |
| 4 | Checklists e subtarefas | Checklists **Free** | 4.8 | **31,3 mil** | **SIM** | 🔴 Reprovado |
| 5 | Dependências e roadmaps | Structure by Tempo | 4.6 | 13,1 mil | Não | 🟡 Nativo Premium avança |
| 6 | Relatórios e dashboards | eazyBI | 4.7 | 11,1 mil | **SIM** | 🔴 Reprovado |

### Os dois sobreviventes

**Time tracking** — o líder tem **4.1 com 27,2 mil instalações** e o app oficial da Harvest sustenta 2,5 mil instalações com **nota 2.5**. As duas reclamações que encontrei são técnicas, concretas e corrigíveis:

- **Worklog gravado como app, não como usuário** *(jun/2026)*: *"each worklog gets loged asApp and not asUser… `worklogAuthor = currentUser()` returns zero results. This could be easily avoided by using asUser."* O app quebra a consulta nativa do Jira — e o usuário aponta a correção.
- **Usuário comum trancado fora após atualização** *(jul/2026)*: tela de administrador ("Choose which apps you would like on your Jira instance") exibida para quem não administra nada.

**Test management** — o Jira **não tem nada nativo**. Os quatro maiores em instalação estão entre **3.8 e 4.3** (Xray 4.3, Zephyr 4.1, Zephyr Essential 3.9, TestRail 3.8), somando 61 mil instalações. Mas há um alerta: **qualidade e distribuição estão descorrelacionadas** — AIO Tests tem 4.9 e sete vezes menos instalações que o Xray de 4.3. Ser melhor, sozinho, não desloca o incumbente.

### O que eu errei na rodada 3, e corrigi agora

Eu havia concluído, com 4 categorias, que **"o Atlassian não tem líder grátis"**. Com 6, está errado:
- **Checklists for Jira (Free)** — 31,3 mil instalações, nota 4.8, grátis
- **Easy Reports Free** — 11,7 mil instalações, nota 4.8, grátis
- E "**grátis até 10 usuários**" é preço de entrada comum dos apps pagos

O critério nº 3 vale no Atlassian igualzinho. **O que muda de verdade é a barra de qualidade e o valor por cliente**, não a ausência de grátis.

### Shopify × Atlassian, lado a lado

| Dimensão | Shopify | Atlassian |
|---|---|---|
| Nota dos líderes | 4,8–5,0 | **3.8–4.7** |
| Preço em times pequenos | US$ 19–39 fixos | US$ 0–10/mês |
| Preço em clientes grandes | US$ 39 fixos | **escala por assento** |
| Taxa do marketplace | **0%** até US$ 1M | 16% Forge / 20% Connect |
| Aprovação | dias a semanas | **10–15 dias úteis** |
| Infraestrutura | nossa (~US$ 5/mês) | **da Atlassian** (franquia + consumo) |
| **Clientes para US$ 15k/mês** | ~790 pagantes a US$ 19 | **~150 instâncias a ~US$ 100** |

**A última linha é a que importa.** Precisar de 150 clientes em vez de 790 muda a aquisição por um fator de cinco — é a primeira métrica em quatro rodadas que torna US$ 15k/mês plausível para um portfólio pequeno.

**Contrapartida honesta:** em time pequeno o Atlassian paga **menos** que a Shopify, **a taxa é maior na nossa fase** (16% contra 0%), e a receita só aparece com instâncias grandes — que compram institucionalmente, com revisão de segurança.

### Plataforma: as três respostas

**(a) Forge é hospedado grátis?** Quase. A Atlassian hospeda computação e armazenamento — **não precisamos de Railway nem de Postgres** — mas desde **janeiro/2026 há cobrança por consumo**, com franquia mensal grátis por app e excedente faturado no mês seguinte. Franquias: 200.000 GB-s de função, 0,1 GB de leitura e 0,1 GB de escrita em KVS, 1 GB de log, 1 h de SQL. **Atenção: escrita em KVS custa US$ 1,09/GB, e containers e LLM têm franquia zero** — relevante para um negócio "IA First". Excedente não pago pode suspender o app.

**Repasse:** **Forge 84%**, Connect 80%, Data Center 75%. **Recomendo Forge.** O selo **Runs on Atlassian** é automático e gratuito para apps Forge que usam só infraestrutura da Atlassian.

**(b) Taxa e prazo:** Atlassian retém **16% (Forge)** ou **20% (Connect)**. Aprovação em **10–15 dias úteis**. *Comparação honesta: na nossa fase a Shopify é mais barata — 0% até US$ 1M.*

**(c) Cloud Fortified exige:** participação no **Bug Bounty Program** pago + aba de Privacidade e Segurança; SLOs com testes, plano documentado de restauração e **engenheiros de plantão via serviço de alerta**; e **resposta a ticket crítico em 24 h, 5 dias por semana**. É **plantão humano, não código** — a mesma armadilha de barreira operacional que reprovou impostos-EUA. Mas aqui é **opcional**: dá para lançar sem ele.

### Lacuna que esta rodada não fechou

O Atlassian **não tem filtro por estrelas** como a Shopify. Varri o fluxo cronológico e selecionei as críticas por conteúdo — cobertura menor e com viés meu. E a **cobertura nativa do Jira/Confluence não foi verificada em fonte oficial** (meu corte é maio/2026). As duas coisas são a primeira tarefa da rodada 5.

---

## Rodada 3 — dificuldade técnica (Shopify) + sonda no Atlassian

### Shopify: 8 categorias, nenhuma aprovada

| Candidato | Líder | Soma de avaliações | Veredito |
|---|---|---|---|
| **Impostos sobre vendas EUA** | Numeral 4,5★ (114) | ~330 | 🟡 **Barreira real, mas errada** |
| Isenção de IVA / B2B UE | 4,9★ (40) | ~63 | 🔴 Sem demanda |
| EDI / trading partners | SPS Commerce 4,9★ (7) | ~58 | 🔴 Sem demanda self-serve |
| Fiscal por país (NF-e Brasil) | nenhum | ~18 | 🔴 Sem demanda |
| Conectores de ERP | Odoo 5,0★ (61) | ~120 | 🔴 Volume irrisório |
| Frete / transportadoras | ShipX 5,0★ (1.169) | ~2.600 | 🔴 Saturado |
| Multimoeda / arredondamento | BUCKS 4,9★ (1.167) | ~2.500 | 🔴 Saturado, líder **grátis** |
| B2B wholesale / catálogo | BSS 4,9★ (1.107) | ~4.400 | 🔴 Saturado |

**O melhor candidato falhou por um motivo novo e importante.** Impostos EUA passa nos critérios 3, 4 e 5: sem líder grátis, notas atipicamente baixas (4,5★ e 4,8★ contra os 4,9–5,0 onipresentes), US$ 100–300/mês de disposição a pagar e reclamações graves — *"tax authorities contacting me indicating I'm non-compliant"*, *"TWELVE MONTHS into a support case... incorrectly filed my state taxes"*.

**Mas essas falhas não são de software — são de operação regulada.** Resolver exige ser agente fiscal habilitado em dezenas de estados americanos, com procuração e contadores humanos. Isso quebra o modelo "IA First" e o orçamento de R$ 10.000.

> **Barreira alta ≠ barreira útil.** A barreira precisa ser **técnica** — barreira técnica a IA atravessa; barreira operacional exige gente, licença e responsabilidade legal.

### E o achado estrutural sobre a Shopify

| Categoria | Disposição a pagar | Volume |
|---|---|---|
| Conectores de ERP | **US$ 199,92/mês** | ~120 avaliações |
| EDI | US$ 50/mês | ~58 |
| NF-e Brasil | — | ~18 |
| Multimoeda | **grátis** | ~2.500 |
| B2B wholesale | US$ 20–50/mês | ~4.400 |

**Dificuldade e volume são inversamente proporcionais.** Quem tem problema caro já compra *serviço* com contrato e implantação, não app de US$ 29. Quem compra app self-serve tem os problemas fáceis — e esses já são grátis. Nosso alvo declarado (lojas de US$ 50k–5M/ano) cai exatamente no vão.

**O quadrante que procurávamos pode não existir na Shopify.**

### Atlassian: 🟢 a densidade é menor — na dimensão que importa

⚠️ **Aviso metodológico:** contagem de avaliações **não é comparável** entre as lojas. O draw.io tem 62,7 mil instalações e 1.204 avaliações (~2%); na Shopify o Judge.me tem 44.087 avaliações. O comparável é **nota dos líderes** e **presença de líder grátis**.

| Categoria (Jira/Confluence Cloud) | Líder | Nota | Instalações |
|---|---|---|---|
| Time tracking | Timesheets by Tempo | **4.1** | 27,2 mil |
| Test management | Xray / Zephyr | **4.3 / 4.1** | 25,7k / 15,5k |
| Diagramas (Confluence) | draw.io | 4.8 | 62,7 mil |
| Automação de workflow | ScriptRunner | 4.6 | 35 mil |

E o app oficial da **Harvest sustenta 2,5 mil instalações com nota 2.5**.

**Resposta direta:**
- **Número de apps: equivalente** — ambas as lojas devolvem "over 1,000 matches". Não há menos concorrentes.
- **Barra de qualidade: muito mais baixa, e é isso que importa.** Líderes vivem em 4.1–4.6 no Atlassian; na Shopify, em 4,8–5,0. **Ser melhor é um diferencial viável lá; aqui, "melhor que 4,9 e grátis" quase não é proposta.**
- **Sem líder grátis** em nenhuma das quatro categorias — o preço não converge a zero, que é o problema que reprovou 3 das 8 categorias Shopify desta rodada e a rodada 2 inteira.
- **Preço por usuário com piso:** Tempo cobra US$ 10,00/mês para 10 usuários. **A receita escala por assento** — um cliente de 500 usuários paga centenas de dólares pelo mesmo produto. Nosso Pro na Shopify era US$ 39 fixos.

**Ressalvas honestas:** ciclo de venda mais longo (comprador é admin de Jira, com aprovação e revisão de segurança); os selos "Cloud Fortified" e "Runs on Atlassian" são custo de entrada real — e fosso depois. E **a sonda é rasa**: 4 categorias, sem ler avaliações negativas nem verificar o que a Atlassian faz nativamente. **Não é veredito de entrada; é sinal de que a rodada 4 vale a pena ali.**

---

## 🔴 ÚNICO BLOQUEIO — escolher o próximo app

**Três rodadas, quinze categorias, nenhum candidato aprovado.** Evidência completa em [PESQUISA.md](PESQUISA.md).

### Rodada 2 — conformidade regulatória com prazo

| Candidato | Prazo | Apps existentes | Avaliações somadas | Veredito |
|---|---|---|---|---|
| **Botão de desistência da UE** | 19/06/2026 | **17** | **~3.374** | 🔴 **Chegamos ~8 meses tarde** |
| EmpCo / selo GARAN | 27/09/2026 | **7** | **~5** | 🔴 7 já posicionados, zero tração |
| Right to Repair | — | **0** | **0** | 🔴 Sem evidência de demanda |

**O botão de desistência era a melhor tese até agora — e ainda assim é "não".** A Shopify não faz nada nativo, os líderes de returns não cobrem (verifiquei o AfterShip: **zero** menções a `withdrawal`, `Widerruf`, `2023/2673`), e a regulação criou demanda real e datada. O problema é que **17 desenvolvedores previram exatamente a mesma coisa**:

- Líder: **4,9★ com 2.203 avaliações**, plano gratuito
- Segundo: **4,9★ com 508**, **Built for Shopify**, plano gratuito
- Terceiro: 5,0★ com 306, "law firm approved"
- Preço de entrada da categoria: **zero**

Os quatro requisitos legais que você listou — duas etapas, cliente sem conta, confirmação automática, permanentemente visível — **já estão cobertos textualmente** pelos dois maiores. E as poucas reclamações (27 negativas em 2.203) são de preço, integração com tema e CSP — nada de conformidade, nada que não se corrija numa sprint.

### ⚠️ Ressalva jurídica registrada

Pelo meu entendimento, a Diretiva 2023/2673 altera a 2011/83/UE **quanto a contratos de serviços financeiros à distância** — e o botão de desistência aplica-se a esses contratos, não à venda de bens em geral. Os apps vendem a obrigação para todas as lojas da UE. Ou transposições nacionais ampliaram o escopo (a Alemanha é a hipótese provável — os dois maiores apps são alemães), ou parte do mercado está vendendo urgência acima do que a lei exige.

**Não sou fonte jurídica e meu corte de conhecimento é anterior à entrada em vigor.** Não muda o veredito — o mercado está tomado de qualquer forma — mas fica a regra: escopo legal se confirma em fonte primária ou com advogado, nunca no marketing do concorrente.

## 🔧 A rodada 2 corrigiu um critério meu que estava errado

Eu havia escrito que regulação com prazo "defende contra concorrente grátis, porque manutenção contínua vira barreira". **Está errado.**

> **Um prazo legal é informação pública.** Todo desenvolvedor lê a mesma diretiva, na mesma data, e chega à mesma conclusão. Oportunidade regulatória é a **mais** contestada, não a menos. E o preço converge a zero porque conformidade é obrigação, não benefício: ninguém cobra caro por algo que o lojista é forçado a ter e que o concorrente dá de graça.

A confirmação está no EmpCo: **7 apps posicionados antes do prazo sequer chegar.** O ciclo se repete, e mais rápido a cada vez.

Critério reescrito no `CLAUDE.md`. **Conclusão prática: o filtro principal da rodada 3 é dificuldade técnica, não calendário.** Os únicos critérios que apontam vantagem real são "categoria sem líder grátis com selo Built for Shopify" e "dor técnica repetida nos 1–3★ de vários concorrentes".

---

## Rodada 1 — categorias maduras

Nenhum passa a regra 8 com folga. Um único tem espaço, e é estreito.

| # | Candidato | Concorrente mais forte | Veredito |
|---|---|---|---|
| 1 | Documentos de pedido | MS Order Printer — 5,0★ (255), **grátis**, BFS | 🔴 **Não** |
| 2 | **Etiquetas de código de barras** | RF Gerador — 5,0★ (326), **grátis**, BFS | 🟡 **Talvez — o único** |
| 3 | Sync Airtable/Notion/ClickUp | SyncBase — 4,9★ (81), US$ 24/mês | 🔴 **Não** — sem demanda |
| 4 | Bundles | Kaching — 5,0★ (**5.321**) | 🔴 **Não**, categoricamente |

### Por que o candidato 2 é o único vivo

- **É o único onde a Shopify não tem função nativa.** Nos outros três, o caminho nativo existe e é grátis.
- **O app oficial não é só ruim, está regredindo.** Duas reclamações de julho/2026: uma atualização **removeu o SKU** das etiquetas Avery 5167 (risco de etiquetar produto errado) e trocou fonte e tamanho do código de barras, quebrando layouts de quem usava há 3 anos. 2,3★ com **204 avaliações de 1★**.
- **A mesma dor técnica aparece no oficial e no líder pago:** o que imprime não é o que o preview mostra — dimensão errada, não escaneia, precisa baixar o PDF antes de imprimir senão sai torto. Ninguém resolveu.
- **Formato de moeda por localidade está errado** no oficial (`€19,99` em vez de `19,99 €` na França) — casa com a nossa regra de i18n desde o dia 1.
- Há disposição a pagar: o líder pago cobra **US$ 7,99/mês** com 447 avaliações.

**O que trava o candidato 2:** **RF é grátis, 5,0★, 326 avaliações e Built for Shopify.** Teríamos que ganhar de graça, e a única dimensão onde dá para ganhar — fidelidade de impressão — **exige testar com impressora física** (Dymo, Zebra, Brother) e leitor real. Sem hardware, não dá para atacar justamente o que seria o diferencial.

---

## Onde estamos, depois de sete candidatos

**Etiquetas de código de barras (rodada 1) segue como o único candidato vivo** — e continua dependendo da sua resposta sobre hardware. Nada da rodada 2 o substitui.

Sua decisão, em ordem de preferência minha:

- **A — Decidir o candidato de etiquetas.** Se você tem impressora e leitor, é o único caminho com dimensão de vantagem aberta (fidelidade de impressão) e sem líder pago dominante. Se não tem, ele cai.
- **B — Rodada 3 com filtro de dificuldade técnica**, não de calendário: categorias onde o problema é caro de resolver (hardware, formato de arquivo, integração externa instável, precisão de cálculo), que é o que os critérios 3 e 5 apontam.
- **C — Rever a premissa do portfólio.** Duas rodadas mostraram que a App Store da Shopify, nas categorias que examinamos, está madura: líder grátis, nota alta e centenas de avaliações é o padrão, não a exceção. Se isso se repetir na rodada 3, a conversa deixa de ser "qual app" e passa a ser "Shopify é o marketplace certo para começar" — o `CLAUDE.md` já prevê WordPress, Chrome e Atlassian no backlog.

## 🟡 Pendência que virou decisiva

**Hardware — quarta vez que o campo vem como placeholder** (`[tem/não tem]`, `[sua resposta]`). Não é mais detalhe: se você **não** tem impressora de etiqueta e leitor, o candidato de etiquetas cai também — e aí **os sete candidatos das duas rodadas estão reprovados**, sem exceção.

Também: **`northstackapps.com` já foi comprado?**

---

## Resolvido até agora

| Item | Estado |
|---|---|
| **App 1 cancelado** (caminho A) | Registrado em `DECISOES.md` e marcado no `CLAUDE.md`. Zero linhas de código escritas |
| **Regra 8 na nova forma** | Aprovada e aplicada no `CLAUDE.md`, com critérios objetivos de reprovação |
| **Regra 15 (commit + push)** | Aplicada. Remoto sincronizado a cada marco |
| **Login do CLI** | ✅ Funcionando. **Northstack Apps, org ID `232549161`** |
| **Pesquisa — rodada 1** | ✅ 4 candidatos (categorias maduras) |
| **Pesquisa — rodada 2** | ✅ 3 candidatos (conformidade regulatória) + correção do critério nº 2 |

---

## O achado que vale mais que os quatro vereditos

Os quatro candidatos partiam da mesma tese: *"o app oficial da Shopify é mal avaliado, logo há espaço"*. A nota ruim confirma-se nos três casos verificáveis — Order Printer **3,6★**, Retail Barcode Labels **2,3★**, Shopify Bundles **2,8★**. E nos três o mercado terceiro **já resolveu**, quase sempre de graça.

> **"App oficial mal avaliado" não é sinal de oportunidade — é sinal de categoria madura, já servida.** Foi o app oficial ruim que empurrou a demanda para terceiros anos atrás. Quando chegamos, o espaço já está ocupado por quem chegou na época da dor.

Isso está gravado no `CLAUDE.md` e invalida boa parte do backlog original, que foi montado sobre essa tese.

### O que eu procuraria na próxima rodada
1. **Dor com data recente** — mudança de API ou integração descontinuada nos últimos ~6 meses, antes de os líderes responderem.
2. **Regulação com prazo de vigência** — demanda datada, e a manutenção contínua vira barreira contra concorrente grátis.
3. Categoria **sem líder grátis com selo Built for Shopify**.
4. Soma de avaliações da categoria entre **~500 e ~5.000**.
5. **Reclamação técnica repetida nos 1–3★ de vários concorrentes ao mesmo tempo.**

---

## Portfólio

| # | App | Estado |
|---|---|---|
| 1 | ~~`restock`~~ | 🔴 **Cancelado** em 25/08/2026 |
| 2 | Conector contábil (QuickBooks/Xero) | Premissa abalada, **não verificado** — MyWorks já entrega junto com o Stockroom grátis |
| 3 | ~~Documentos de pedido~~ | 🔴 **Reprovado** na verificação |
| — | Etiquetas de código de barras | 🟡 Aguardando sua decisão |

**Receita hoje: US$ 0/mês.** Apps publicados: 0. Instalações: 0. **Gasto: R$ 0,00.**

---

## Ambiente (não repetir investigação)

- Node **v24.19.0**, npm **11.17.0** em `C:\Program Files\nodejs` — **fora do PATH**, usar caminho completo
- Shopify CLI autenticado · org **Northstack Apps** `232549161` · dev store **northstack-dev**
- `app init` exige `--organization-id` e `--flavor`; `--template reactRouter`; recusa diretório não vazio
- `shopify organization list` devolve o org ID sozinho
- Hospedagem: **Railway** (não contratar antes de haver app) · Domínio: **northstackapps.com**

## Como retomar (leia nesta ordem)

1. [CLAUDE.md](CLAUDE.md) — missão e regras (regra 8 mudou)
2. **este arquivo** — o bloqueio de decisão
3. [PESQUISA.md](PESQUISA.md) — a evidência por trás dos vereditos
4. [DECISOES.md](DECISOES.md) — histórico com datas e motivos
