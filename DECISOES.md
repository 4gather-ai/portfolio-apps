# DECISÕES

Decisões de negócio, com data e motivo. Só entra aqui o que muda o produto, o preço, o escopo ou a prioridade.
Decisão técnica pura (lib, arquitetura, nome de variável) **não** entra aqui — é autonomia do Claude Code (regra 3).

Formato: `## [data] — título` · **Decisão** · **Motivo** · **Reversível?**

---

## 2026-08-25 — App 1 é `restock` (PO + etiquetas de código de barras)

**Decisão:** o primeiro app do portfólio ataca o vácuo deixado pelo desligamento do Shopify Stocky.
**Motivo:** o Stocky é desligado em **31/08/2026** — seis dias a partir de hoje. É demanda com data marcada, dor conhecida e busca ativa ("stocky alternative"). As alternativas cobram US$ 100–300/mês com nota média 4,12; o app oficial de etiquetas tem 2,3. Há espaço para preço baixo e execução simples.
**Reversível?** Sim até o código começar. Depois da submissão, caro reverter.
**Risco assumido:** a janela de busca por "stocky alternative" é mais quente agora e esfria em ~6 meses. Chegar tarde custa caro. Daí a meta de 14 dias.

---

## 2026-08-25 — Escopo da v1: comprar e etiquetar, nada mais

**Decisão:** v1 = criar PO → enviar ao fornecedor por e-mail → receber (parcial/total, com leitor de código de barras) → atualizar estoque e custo médio → imprimir etiquetas em PDF. Fora da v1: previsão de demanda, multi-armazém avançado, manufatura/BOM.
**Motivo:** regra 7 (escopo mínimo primeiro). Esse é o fluxo que o lojista fazia no Stocky de ponta a ponta. Um pedaço dele sozinho não substitui nada.
**Reversível?** Sim — os itens cortados viram v1.1+.

---

## 2026-08-25 — Preço: Free / US$ 19 / US$ 39

**Decisão:** três planos conforme o CLAUDE.md. Free limita **volume** (5 POs/mês), nunca capacidade. Etiquetas ilimitadas em todos os planos, inclusive no Free.
**Motivo:** a média da categoria é US$ 193/mês. Preço baixo é o diferencial declarado, então o teto do Pro fica em US$ 39, abaixo da faixa Growth sugerida no CLAUDE.md para outros apps (US$ 49–79). Deixar as etiquetas grátis é aquisição: é a tarefa mais frequente e mais barata de servir, e traz o usuário para dentro antes da decisão de compra.
**Reversível?** Subir preço depois é possível; descer é fácil. Trocar o *eixo* do limite do Free (volume → capacidade) depois da publicação queima confiança. Essa parte é praticamente irreversível.

---

## 2026-08-25 — Nome público: "Restock: PO & Barcode Labels"

**Decisão:** nome de trabalho e nome de listagem propostos; alternativas registradas em `apps/restock/LISTING.md` seção 9.
**Motivo:** 28 de 30 caracteres permitidos, diz as duas funções na própria busca. "Stocky" fica fora do nome por risco de marca — aparece só no texto descritivo.
**Reversível?** Sim, até registrar o app no Partner Dashboard. **Pendente de verificação de disponibilidade.**

---

## 2026-08-25 — Ordem do portfólio mantida

**Decisão:** App 2 (conector contábil Shopify → QuickBooks/Xero) só começa depois do App 1 **submetido**. App 3 (documentos de pedido) depois.
**Motivo:** regra de foco. Dois apps meio-prontos valem zero; um publicado começa a gerar dado real de conversão, que é o que decide o App 2.
**Reversível?** Sim.

---

## 2026-08-25 — Hospedagem: Railway

**Decisão:** Railway (Hobby, ~US$ 5/mês). Fly.io descartado.
**Motivo:** decisão do Amarildo. Railway não hiberna a instância no plano pago, o que é requisito para receber webhooks da Shopify de forma confiável.
**Reversível?** Sim — o app é um Node/React Router padrão, portável para qualquer PaaS.

---

## 2026-08-25 — Domínio: northstackapps.com

**Decisão:** aprovado. O Amarildo compra e avisa.
**Motivo:** necessário para política de privacidade, página de suporte e domínio do remetente dos e-mails de PO (entregabilidade). ~R$ 66/ano, dentro do orçamento.
**Reversível?** Sim, mas o domínio vira parte da identidade do portfólio inteiro, não só do App 1.
**Status:** aguardando confirmação da compra.

---

## 2026-08-25 — Nome "Restock" verificado: REPROVADO

**Decisão:** não usar `Restock` nem `Stockroom` como nome público.
**Motivo (verificado na App Store hoje):**
- A busca por "restock" retorna **1.612 apps** e a primeira página inteira é de **alertas de "back in stock"** — Notify Me, Stoq (3.534 avaliações), Kbite (3.899), Notify! (3.583). Na App Store, "restock" significa *avisar o cliente quando o produto voltar*, não *comprar do fornecedor*. O nome nos coloca na busca errada, competindo com apps de 3.000+ avaliações por uma intenção que não é a nossa.
- `Stockroom` (alternativa nº 3 da LISTING) **já é um app existente e concorrente direto**: "Stockroom ‑ Purchase Orders", 5,0 (36), grátis.
**Reversível?** Sim — nada foi registrado.
**Pendente:** escolher novo nome depois de resolver a decisão de escopo abaixo. Nomear antes de saber o que o produto é seria trabalho jogado fora.

---

## 2026-08-25 — 🔴 PREMISSAS DO APP 1 CONTRARIADAS PELO MERCADO REAL

**Não é uma decisão — é um achado que exige decisão do Amarildo.**

O `CLAUDE.md` justifica o App 1 com três premissas. As três foram verificadas hoje na Shopify App Store e **não se sustentam**:

| Premissa no CLAUDE.md | O que a App Store mostra hoje (25/08/2026) |
|---|---|
| "Alternativas custam US$ 100–300/mês (média US$ 193/mês)" | **EasyScan Inventory & Barcode: US$ 9,99/mês**, 5,0★ com **338 avaliações**. **Stockroom ‑ Purchase Orders: grátis**, 5,0★ (36). Mimoran, Auto Purchase Orders, Stockie, FlowPO, Alfred — todos com plano grátis ou avaliação gratuita |
| "O Admin da Shopify absorveu só o básico" | A página oficial "Gestão de estoque — **Incluído na Shopify**" diz textualmente: "reabasteça com **pedidos de compra** e transferências". Códigos de barras, leitores, previsão, multi-local e reposição estão marcados como **Compatível** no nativo |
| "Diferencial: preço flat baixo, migração em 5 min, importação CSV do Stocky" | O EasyScan se descreve como **"O substituto completo do Stocky"**. O Stockroom anuncia **"Faça a migração do Stocky"** e ainda inclui **sincronização com QuickBooks** — que é o nosso App 2 |

**Consequência direta sobre a v1 desenhada:**

| Nosso plano | Concorrente | Veredito |
|---|---|---|
| Free: 5 POs/mês | Stockroom: POs e fornecedores **ilimitados**, e-mail ao fornecedor, recebimento parcial, **impressão de etiquetas**, migração do Stocky — **grátis** | Nosso Free é estritamente pior |
| Growth US$ 19 | EasyScan US$ 9,99 com 5,0★/338, superset das nossas features | Cobramos ~2x por menos, sem prova social |
| Pro US$ 39 (multi-local, POS) | Stockie, PML, EasyScan já fazem | Sem diferencial |
| App 2 (conector QuickBooks) | MyWorks já entrega junto com o Stockroom grátis | Premissa do App 2 também abalada |

**Recomendação:** **não escrever código para a v1 como está especificada.** O escopo "PO + etiquetas" não tem espaço: existe um app grátis que faz tudo isso e um app de US$ 9,99 com 338 avaliações que já ocupou o posicionamento "substituto do Stocky". Entrar agora significa ser a quarta melhor opção mais cara.

**Caminhos possíveis** (precisa da sua escolha — ver `STATUS.md`):
- **A. Matar o App 1** e ir para o App 3 (documentos de pedido / alternativa ao Order Printer), que ainda não foi checado contra o mercado real. Custo: 1 dia perdido.
- **B. Reescopar** para um nicho estreito que os incumbentes não cobrem — a evidência ainda precisa ser levantada (ex.: só etiquetas, com qualidade de impressão e suporte a impressora que o app oficial de 2,3★ não tem).
- **C. Seguir como está.** Não recomendo, e registro aqui que a recomendação foi contrária.

**Antes de qualquer caminho:** rodar a mesma verificação de mercado para os Apps 2 e 3 **antes** de escrever a listagem, e não depois. A regra 8 do CLAUDE.md ("escrever a listagem antes do código") deve virar "**verificar o mercado antes de escrever a listagem**".

---

## 2026-08-25 — Caminho A: App 1 cancelado

**Decisão:** o App 1 (`restock`) está **cancelado**. Nenhuma linha de código foi escrita.
**Motivo:** decisão do Amarildo, sobre a evidência acima.
**Reversível?** Sim, mas exigiria refutar a pesquisa.
**Feito:** `CLAUDE.md` marcado, `apps/restock/LISTING.md` mantido como registro histórico do que uma listagem convincente para um produto inviável se parece.

---

## 2026-08-25 — Regra 8 substituída: mercado antes da listagem

**Decisão:** aprovada e aplicada no `CLAUDE.md`. Verificação de mercado obrigatória em `PESQUISA.md` antes de qualquer listagem, com critérios objetivos de reprovação (concorrente grátis cobrindo a v1; líder com 4,8★+ e 300+ avaliações; categoria somando menos de ~500 ou mais de ~5.000 avaliações).
**Motivo:** a regra antiga produziu uma listagem convincente para um produto que o mercado já resolvia de graça. O custo do erro foi uma sessão inteira; teria sido semanas se tivéssemos codado.
**Reversível?** Sim, mas não vejo por quê.

---

## 2026-08-25 — Sessão do CLI resolvida

**Fato registrado:** login refeito e funcionando. **Organização Northstack Apps, org ID `232549161`.** Dev store `northstack-dev`. `shopify organization list` confirma.
**Consequência:** o bloqueio técnico acabou. O bloqueio agora é só de produto.

---

## 2026-08-25 — Quatro candidatos verificados, nenhum aprovado

**Decisão:** nenhum dos quatro candidatos entra em produção sem uma decisão explícita adicional.
**Resultado** (detalhe e fontes em `PESQUISA.md`):

| Candidato | Veredito | Razão principal |
|---|---|---|
| Documentos de pedido | 🔴 Reprovado | 4 apps com 250–700 avaliações a 4,7–5,0★, vários grátis e Built for Shopify |
| **Etiquetas de código de barras** | 🟡 **Único com espaço** | Shopify não tem função nativa; app oficial 2,3★ e **regredindo**; mesma dor técnica no oficial e no líder pago |
| Sync Airtable/Notion/ClickUp | 🔴 Reprovado | 3 apps de ClickUp com **zero** avaliações somadas; Airtable inteiro tem 176 |
| Bundles | 🔴 Reprovado | 8 apps com 1.000–5.300 avaliações a 4,9–5,0★, quase todos grátis |

**Achado transversal registrado no `CLAUDE.md`:** "app oficial mal avaliado" não é sinal de oportunidade — é sinal de categoria madura já servida por terceiros.

---

## 2026-08-25 — Regra 15: commit e push ao fim de cada sessão

**Decisão:** aprovada e aplicada no `CLAUDE.md`. `git add -A`, commit descritivo e `git push origin main` ao final de cada sessão e a cada marco, com checagem de segredos antes do push.
**Motivo:** commit local não é visível para o chat estratégico. Sem push, o trabalho não conta como entregue.
**Reversível?** Sim, mas não faz sentido.

---

## 2026-08-25 — Rodada 2 de pesquisa: três candidatos regulatórios, todos reprovados

**Decisão:** nenhum candidato de conformidade regulatória entra em produção. Detalhe e fontes em `PESQUISA.md`, seção "Rodada 2".

| Candidato | Prazo legal | Apps existentes | Avaliações somadas | Veredito |
|---|---|---|---|---|
| Botão de desistência da UE (2023/2673) | 19/06/2026 | **17** | ~3.374 | 🔴 Chegamos ~8 meses tarde |
| EmpCo / selo de garantia GARAN | 27/09/2026 | **7** | ~5 | 🔴 Já disputado antes do prazo |
| Right to Repair | não verificado | 0 | 0 | 🔴 Sem sinal de demanda |

**Motivo do "não" no candidato principal:** era a melhor tese até hoje — a Shopify não faz nada nativo e os líderes de returns não cobrem (AfterShip: zero menções a `withdrawal`/`Widerruf`/`2023/2673`). Mas a lacuna já foi preenchida por 17 apps dedicados: líder com **4,9★ e 2.203 avaliações**, segundo com **4,9★, 508 avaliações e selo Built for Shopify**, ambos gratuitos, e os quatro requisitos legais (duas etapas, sem login, confirmação automática, visível) já cobertos textualmente. Só 27 avaliações negativas em 2.203, nenhuma sobre conformidade.

**Reversível?** Sim, mas exigiria refutar a evidência.

---

## 2026-08-25 — Critério nº 2 corrigido: regulação não é vantagem competitiva

**Decisão:** o critério "regulação com prazo defende contra concorrente grátis" foi **reescrito no `CLAUDE.md`**, porque estava errado.

**Motivo:** um prazo legal é **informação pública** — todo desenvolvedor lê a mesma diretiva na mesma data. Oportunidade regulatória é a **mais** contestada, não a menos, e o preço converge a zero porque conformidade é obrigação, não benefício. Evidência: 17 apps no botão de desistência dois meses após o prazo, e **7 apps no EmpCo um mês antes** do prazo sequer chegar.

**Nova forma:** regulação com prazo serve como sinal de demanda, nunca como vantagem. Só entrar se houver barreira além do conhecimento da lei — dado proprietário, integração difícil, certificação ou relação com o canal.

**Consequência:** o filtro principal da rodada 3 passa a ser **dificuldade técnica, não calendário**. Os critérios que apontam vantagem real são o nº 3 (sem líder grátis com selo Built for Shopify) e o nº 5 (dor técnica repetida nos 1–3★ de vários concorrentes).

---

## 2026-08-25 — Regra de conformidade legal registrada

**Decisão:** se algum dia entrarmos em produto regulatório, o escopo da lei tem que ser confirmado em **fonte primária ou com advogado antes da listagem** — nunca a partir do texto de marketing dos concorrentes. Gravado no `CLAUDE.md`.

**Motivo:** pelo entendimento do Claude Code, a Diretiva 2023/2673 altera a 2011/83/UE **quanto a contratos de serviços financeiros à distância**, enquanto os 17 apps vendem a obrigação para todas as lojas da UE. Ou transposições nacionais ampliaram o escopo (Alemanha é a hipótese provável — os dois maiores apps são alemães), ou parte do mercado vende urgência acima do que a lei exige. **O Claude Code não é fonte jurídica e seu corte de conhecimento é anterior à entrada em vigor.** Não muda o veredito acima, mas é risco reputacional real num produto futuro.

---

## 2026-08-25 — Hardware e domínio respondidos

**Hardware:** tem **leitor de código de barras**; **não tem impressora de etiqueta**; pode comprar (~R$ 300) se o app de etiquetas for escolhido.
**Consequência:** o candidato de etiquetas (rodada 1) continua tecnicamente viável, mas passa a ter **custo de entrada de R$ 300** e depende de uma compra antes da primeira validação real. Registrado em `CUSTOS.md`.
**Domínio:** `northstackapps.com` **ainda não comprado**. Aprovado, não executado.

---

## 2026-08-25 — Caminho B escolhido: rodada 3 com filtro de dificuldade técnica

**Decisão:** rodada 3 executada — 8 categorias Shopify sob filtro de dificuldade técnica, mais uma sonda no Atlassian Marketplace.
**Resultado: nenhum candidato Shopify aprovado.** Detalhe e fontes em `PESQUISA.md`, seção "Rodada 3".

---

## 2026-08-25 — Aprendizado: barreira alta não é o mesmo que barreira útil

**Fato:** o melhor candidato da rodada 3 — apuração de imposto sobre vendas nos EUA — passa nos critérios 3, 4 e 5: sem líder grátis, notas mais baixas que o normal da App Store (Numeral 4,5★, TaxCloud 4,8★), disposição a pagar de US$ 100–300/mês e reclamações graves e não resolvidas.

**E mesmo assim é "não".** As reclamações não são de software: *"tax authorities contacting me indicating I'm non-compliant"*, *"TWELVE MONTHS into a support case... incorrectly filed my state taxes"*, cobrança por registros estaduais nunca feitos. Isso é falha de **operação regulada**, não de código.

**Regra derivada:** a barreira que nos serve precisa ser **técnica**. Barreira operacional ou regulatória exige pessoas, licença e responsabilidade legal — incompatível com o modelo "IA First" e com o orçamento de R$ 10.000.

---

## 2026-08-25 — Aprendizado: na Shopify, dificuldade e volume são inversamente proporcionais

**Fato medido na rodada 3:**

| Categoria | Disposição a pagar | Volume (avaliações somadas) |
|---|---|---|
| Conectores de ERP | US$ 199,92/mês | ~120 |
| EDI | US$ 50/mês | ~58 |
| NF-e Brasil | — | ~18 |
| Multimoeda | **grátis** | ~2.500 |
| B2B wholesale | US$ 20–50/mês | ~4.400 |

**Interpretação:** quem tem os problemas caros já é grande o bastante para comprar **serviço** com contrato e implantação, não app self-serve. Quem compra app self-serve tem os problemas fáceis, e esses já estão resolvidos de graça. O alvo declarado no `CLAUDE.md` — lojas de US$ 50k–5M/ano — cai no vão entre os dois.

**Consequência:** o quadrante "tecnicamente difícil **e** com muitos compradores self-serve" pode simplesmente não existir na Shopify.

---

## 2026-08-25 — Sonda no Atlassian: densidade menor em qualidade e preço

**Fato:** quatro categorias sondadas (time tracking, test management, diagramas/formatação, automação de workflow) em Jira e Confluence Cloud.

- **Barra de qualidade muito mais baixa:** o líder de time tracking (Tempo Timesheets) tem **nota 4.1 com 27,2 mil instalações**; o app oficial da Harvest sustenta 2,5 mil instalações com **nota 2.5**; Xray 4.3 e Zephyr 4.1 dividem test management. Na Shopify, todo líder examinado nas três rodadas está entre 4,8★ e 5,0★.
- **Sem líder grátis** em nenhuma das quatro categorias. O único que se anuncia grátis (Clockify) tem nota 3.9.
- **Preço por usuário com piso:** Tempo cobra US$ 10,00/mês para 10 usuários (US$ 1,00/usuário). Receita escala por assento — um cliente de 500 usuários paga centenas de dólares pelo mesmo produto.
- **Número de apps é equivalente** ("over 1,000 matches" nas duas lojas). A diferença não é quantidade de concorrentes.

**Ressalvas:** ciclo de venda mais longo (comprador é admin de Jira em empresa, com aprovação e revisão de segurança); selos "Cloud Fortified"/"Runs on Atlassian" são custo de entrada real — e fosso depois. **Sonda rasa: 4 categorias, sem leitura de avaliações negativas nem verificação do nativo da Atlassian.**

**Isto não é decisão de entrada.** É evidência de que vale uma rodada 4 completa no Atlassian antes de insistir na Shopify.

---

## 2026-08-25 — Rodada 4 no Atlassian: dois candidatos sobreviveram

**Decisão:** Shopify em espera; impressora e domínio **não comprados**. Rodada 4 executada em 6 categorias de Jira e Confluence Cloud. Detalhe e fontes em `PESQUISA.md`, seção "Rodada 4".

**Sobreviveram:** **time tracking** (líder Tempo em 4.1 com 27,2 mil instalações; app oficial da Harvest em 2.5) e **test management** (sem nativo; incumbentes entre 3.8 e 4.3, somando 61 mil instalações).
**Reprovados:** checklists e relatórios (líder **grátis** com 31,3 mil e 11,7 mil instalações), exportação PDF/Word do Confluence (K15t com 4.7 e 4.9, a US$ 0,50/usuário). Roadmaps ficou 🟡 com ressalva: o Jira Premium entrega Advanced Roadmaps nativamente.

**Dor técnica concreta encontrada (critério nº 5):** o Tempo grava worklogs como app e não como usuário, quebrando `worklogAuthor = currentUser()` no JQL nativo; e exibe tela de administrador para usuários comuns após atualização.

**Nenhum aprovado.** Falta verificar a funcionalidade nativa do Jira em fonte oficial e ler as negativas sistematicamente.

---

## 2026-08-25 — Correção: o Atlassian TEM líder grátis em algumas categorias

**Decisão:** corrigida a conclusão da rodada 3.
**Motivo:** a sonda rasa (4 categorias) me levou a afirmar que "o Atlassian não tem líder grátis". Com 6 categorias, está errado: **Checklists for Jira (Free)** tem 31,3 mil instalações e nota 4.8; **Easy Reports Free** tem 11,7 mil e 4.8. Além disso, "**grátis até 10 usuários**" é preço de entrada comum de apps pagos.
**Formulação correta:** o critério nº 3 (sem líder grátis) vale no Atlassian igualzinho. O que diferencia o Atlassian é a **barra de qualidade** dos líderes (3.8–4.7 contra 4,8–5,0 da Shopify) e o **valor por cliente**, não a ausência de grátis.

---

## 2026-08-25 — Plataforma Atlassian: fatos apurados em fonte oficial

**Forge vs Connect:** repasse ao desenvolvedor de **84% (Forge)** contra **80% (Connect)**; Atlassian retém 16% / 20%. **Recomendação técnica: Forge** — sem infraestrutura própria (dispensa Railway e Postgres) e com acesso ao selo **Runs on Atlassian**, que é automático e gratuito.

**Forge não é mais hospedagem grátis incondicional.** Desde janeiro/2026 vale modelo de **consumo com franquia mensal grátis por app** e excedente faturado. Franquias: 200.000 GB-s de função, 0,1 GB de leitura e 0,1 GB de escrita em KVS, 1 GB de log, 1 h de SQL. **Escrita em KVS custa US$ 1,09/GB; containers e LLM têm franquia zero** — relevante num negócio "IA First". Excedente não pago pode suspender o app.

**Prazo de aprovação: 10 a 15 dias úteis.**

**Comparação de taxa, honesta:** a Shopify cobra **0% até US$ 1M acumulado**. **Na nossa fase a Shopify é mais barata que o Atlassian.** A vantagem do Atlassian não está na taxa.

**Cloud Fortified exige** Bug Bounty pago, aba de Privacidade e Segurança, SLOs com testes, plano documentado de restauração, **plantão via serviço de alerta** e **resposta a ticket crítico em 24 h, 5 dias/semana**. É **plantão humano, não código** — mesma armadilha operacional que reprovou impostos-EUA. **É opcional**: recomendo lançar sem ele e mirar Runs on Atlassian.

---

## 2026-08-25 — A métrica que mudou o quadro

**Fato:** para chegar a US$ 15.000/mês seriam necessários **~790 lojistas pagantes a US$ 19** na Shopify, contra **~150 instâncias a ~US$ 100/mês** no Atlassian, porque lá o preço escala por assento.

**Interpretação:** é a primeira métrica em quatro rodadas que torna a meta de 12 meses plausível para um portfólio pequeno — fator de cinco na dificuldade de aquisição.

**Contrapartida registrada:** em times pequenos o Atlassian paga **menos** (grátis a US$ 10/mês contra US$ 19–39), a taxa é maior agora, e a receita só aparece com instâncias grandes — que compram institucionalmente, com revisão de segurança e ciclo longo.

---

## 2026-08-25 — App 1 definido: time tracking para Jira Cloud

**Decisão do Amarildo:** Forge confirmado; mirar **Runs on Atlassian**, não Cloud Fortified na v1. **App 1 = time tracking para Jira Cloud.** Test management vira App 2 no backlog. Shopify em espera.
**Reversível?** Sim, até o código começar — e há um risco técnico que pode forçar a revisão (abaixo).

---

## 2026-08-25 — A cunha do produto

> **Um time tracker para Jira cujo dado É o worklog nativo do Jira — gravado como a própria pessoa, na hora — para que JQL, automações, dashboards e relatórios nativos simplesmente funcionem.**

**Motivo, com evidência de 1.174 avaliações lidas e 200 negativas classificadas:** as duas maiores dores da categoria são **relatórios/exportação (36 ocorrências)** e **integração/fidelidade do dado (25)** — e são o mesmo problema. Todo concorrente guarda as horas na própria base e devolve ao Jira uma sombra: nada (Harvest, 66 negativas em 145), com atraso (Clockwork) ou com identidade errada (Tempo — worklog gravado `asApp`, quebrando `worklogAuthor = currentUser()`). Um reclamante do Tempo chega a apontar a correção: `asUser`.

**Consequência estratégica:** com o dado no lugar certo, relatório deixa de ser problema nosso — o cliente usa o nativo, o eazyBI ou o que quiser. Não reimplementamos ecossistema; devolvemos o que já existe.

---

## 2026-08-25 — Por que o nativo do Jira não ameaça esta categoria

**Fato apurado em fonte oficial:** o Jira tem worklog, estimativas, unidades e painel de tempo; **não tem** folha de ponto por pessoa, aprovação, taxas de faturamento nem relatório de utilização. Os 11 relatórios nativos são todos ágeis/de sprint.

**E a página oficial de preços do Jira não menciona "time tracking" uma única vez.** Free, Standard (US$ 7,91/u), Premium (US$ 14,54/u) e Enterprise têm o mesmo time tracking.

**Interpretação:** o teto do nativo **não sobe com o plano do cliente** — ao contrário de roadmaps, onde o Advanced Roadmaps vem no Premium. Foi exatamente isso que reprovou a categoria de roadmaps na rodada 4 e aprova esta.

---

## 2026-08-25 — Posicionamento de preço

**Fato medido:** a 250 usuários, o Tempo (nota 4.1) cobra **US$ 1.070/mês** e o Clockwork Pro (nota **4.6**) cobra **US$ 295/mês**. Clockwork Pro e Cappsule são **grátis até 10 usuários**; o Tempo cobra US$ 10.
**Interpretação:** o mercado paga prêmio por incumbência, não por qualidade. Harvest e Clockify são apps gratuitos no Marketplace porque monetizam no próprio SaaS — são concorrentes de instalação, não de receita.
**Proposta (pendente de confirmação):** grátis até 10 usuários e mirar a faixa do Clockwork Pro. **Para US$ 15k/mês seriam ~51 clientes de 250 usuários** (61 descontando os 16% do Forge), contra ~790 lojistas na Shopify.

---

## 2026-08-25 — ⚠️ Risco técnico que pode matar a cunha

**A cunha inteira depende de o Forge conseguir criar worklog no Jira com a identidade do usuário.** Três perguntas abertas, verificáveis numa dev instance em algumas horas:

1. `api.asUser()` do Forge permite **criar** worklog (`POST /rest/api/3/issue/{id}/worklog`), ou só ler?
2. E o **timer em execução** quando o usuário fecha o navegador? Escrita `asUser` normalmente exige contexto de requisição do usuário — se a escrita assíncrona cair para `asApp`, reintroduz exatamente o defeito do Tempo.
3. Escrita `asUser` invalida o selo **Runs on Atlassian**? *(A princípio não — o selo trata de egress e hospedagem, não de identidade — mas precisa ser confirmado.)*

**Se a resposta à pergunta 1 for "não", a cunha morre e o App 1 precisa ser repensado.** Por isso o pedido de autorização para testar **antes** de escrever a listagem.

---

## 2026-08-25 — Método: API pública do Marketplace

**Fato:** encontrei `/rest/2/addons/{key}/reviews`, que devolve nota e texto por avaliação. Isso **fecha a lacuna de método da rodada 4** (o Atlassian não tem filtro por estrelas na interface) e restaura o rigor das rodadas 1–3.
**Ressalva registrada:** a Atlassian migrou de escala de 4 para 5 estrelas em **25/05/2026**, convertendo notas antigas linearmente. Por isso o Tempo mostra 301 avaliações de "4★" e só 6 de "5★". **Estrelas de períodos diferentes não são comparáveis** — ponderei conteúdo, não só número.

---

## 2026-08-26 — ✅ Cunha provada em produção pelo spike

**Fato:** spike `asuser-spike` 2.1.0 rodado no `SCRUM-1` da `northstack-dev`, **5/5 passos OK**.

| Passo | Resultado |
|---|---|
| `POST` worklog via `api.asUser()` | **HTTP 201**, `started` retroativo, autor **Amarildo Pereira** |
| Autor == usuário real | **Sim** — `712020:9b4086b1-…`, não o app |
| JQL `worklogAuthor = currentUser()` | Achou na **3ª tentativa, após 5,7 s** |
| Painel nativo | `timespent=10800s` |
| Limpeza | HTTP 204 |

**Decisão:** cunha aprovada. O App 1 sai do papel.
**Bônus confirmado no deploy:** escrever worklog via `asUser` **não** invalida a elegibilidade a **Runs on Atlassian**.

---

## 2026-08-26 — Regra de leitura: endpoint do item, JQL só para busca ampla

**Decisão:** **sempre ler worklog pelo endpoint do item** (`/rest/api/3/issue/{key}/worklog`). **JQL serve apenas para busca ampla** — descobrir *quais* itens olhar — **nunca** para conferir o que acabou de ser gravado.

**Motivo, medido e não suposto:** no spike, o JQL levou **5,7 segundos** para enxergar um worklog que já existia. O endpoint do item o devolveu na hora, porque não passa pelo índice de busca assíncrono do Jira.

**Consequência:** qualquer folha de ponto construída sobre JQL mostra dado velho logo após o apontamento. **É exatamente a reclamação do Clockwork Pro** — *"delay in time logs appearing in Jira and in the timesheet"* — e agora sabemos a causa. Esta regra transforma um defeito da categoria em decisão de arquitetura nossa, antes da primeira linha do produto.

---

## 2026-08-26 — Nome público: Nativelog

**Decisão:** **`Nativelog`**, listado como *"Nativelog — Native Time Tracking & Timesheets for Jira"*.
**Motivo:** busca na Marketplace em 26/08/2026 retorna **zero** apps com esse nome. `Loggd` também estava livre; `Worklogic`, `Truelog` e `Nativa` colidem. O nome diz a cunha — *native* + *worklog*.
**Reversível?** Sim, até registrar no Developer Console. **Pendente:** confirmar lá, e o domínio.

---

## 2026-08-26 — Desvio consciente da regra 10 (preço)

**Decisão:** a v1 do Nativelog **não** segue "3 planos fixos de US$ 19–79" da regra 10.
**Motivo:** a regra 10 descreve o modelo da Shopify. A Atlassian cobra **por assento com faixas**, e o padrão da categoria é **grátis até 10 usuários** — preço fixo não existe nesse marketplace. Mantemos o espírito da regra (3 níveis, função central sem paywall) na forma da plataforma: **editions Free / Standard / Pro**, com o núcleo — apontar e gravar worklog nativo — disponível em todas.
**Faixa alvo:** a do Clockwork Pro (nota 4.6), ~3,6× abaixo do Tempo (nota 4.1). Detalhe em `apps/jira-time/LISTING.md`.

---

## 2026-08-26 — Spike encerrado e removido

**Decisão:** `forge uninstall` executado na `northstack-dev`. O app do spike não polui mais a dev instance.
**O código fica** em `apps/jira-time/spike/` como registro de como a cunha foi provada — é a evidência por trás da decisão mais importante do projeto até agora.

---

## 2026-08-26 — Plano da v1 aprovado; construção começou

Amarildo aprovou o `PLANO-V1.md`, confirmou o nome **Nativelog**, aceitou o recrutamento do beta na semana 1 e **registrou `northstackapps.com` no Cloudflare**. As quatro decisões que travavam o código caíram no mesmo dia.

**Consequência imediata:** o domínio deixa de bloquear o beta do D14. Falta só publicar as páginas de privacidade e suporte nele.

---

## 2026-08-26 — Canal 1 do beta (rede pessoal) descartado

**Decisão do Amarildo.** Nova ordem de prioridade do recrutamento: **Atlassian Community → r/jira → Solution Partners**, com o **fórum de desenvolvedores** (`community.developer.atlassian.com`) somado como canal novo.

**O que isso custa, registrado para não ser esquecido em D14:** o canal 1 era o de maior conversão e **o único de público quente**. Todos os canais restantes dependem de estranhos confiarem num app desconhecido de um desenvolvedor sem histórico na plataforma. As duas ou três primeiras instâncias — as que destravam as demais — ficam mais caras e mais lentas de conseguir.

**Isso não muda a regra 16.** O ponto de decisão do D14 continua sendo "menos de 5 confirmados ⇒ trocar de canal", nunca "encurtar o beta". Se bater, a primeira coisa a reconsiderar é justamente reabrir o canal 1.

**Sobre o fórum de desenvolvedores, com uma ressalva.** É público de construtores, não de compradores: quase ninguém ali administra a instância que queremos. Entra por motivos indiretos — é onde a medição dos 5,7 s interessa, é onde os desenvolvedores dos Solution Partners leem, e é onde teremos que perguntar sobre `asUser` e revisão da Marketplace de qualquer forma. **Ressalva:** é o único público capaz de copiar a cunha a partir da descrição dela. Regra fixada: **compartilhar a medição, não a solução** — nada de código do `asUser`, nada do desenho do KVS, nada da regra de leitura.

---

## 2026-08-26 — Estratégia da Atlassian Community: responder antes de anunciar

Quatro respostas técnicas escritas em `apps/jira-time/COMMUNITY.md`, para perguntas reais de 2025–2026, **três delas sem resposta aceita**. Uma por dia, D2–D5; o anúncio do beta só depois.

**Três regras fixadas para essas respostas:**
1. **Nenhum link ou menção ao Nativelog.** A comunidade remove autopromoção, e postar o anúncio direto queima o canal de prioridade nº 1.
2. **Nenhum concorrente pelo nome.** Onde a resposta toca no worklog gravado pelo app em vez da pessoa, fala do **sintoma** — "confira se o app grava worklog nativo". Quem tem o problema se reconhece.
3. **Nenhuma afirmação não verificada.** Três das quatro respostas trazem um "⚠️ conferir antes de postar" com os passos exatos. A da resposta 1 se apoia numa identidade algébrica (`timeSpent > remaining` ⟺ `workratio > 50`) que foi **deduzida, não medida** — e por isso está marcada como "não postar se não bater".

**Motivo da regra 3:** numa lista de e-mail comercial, um erro custa uma resposta. Num fórum técnico onde a gente está construindo reputação do zero, **um erro custa mais do que quatro acertos ganham**.

---

## 2026-08-26 — Forge: `@forge/kvs`, não o `storage` do `@forge/api`

O `forge lint` marcou o `storage` do `@forge/api` como **deprecado** no D2. Migrado no mesmo dia, antes de qualquer código depender dele.

**Por que agora e não depois:** dez minutos hoje; uma rodada de revisão da Atlassian se ficasse para a submissão. O `forge deploy` confirmou que a mudança **não afeta a elegibilidade a Runs on Atlassian** (versão 2.2.0). Escopo `storage:app` acrescentado ao manifest.

---

## 2026-08-26 — Fora das prereleases `-next` do Forge (regra 12)

**O CI quebrou e o motivo importa.** O template do `shopify`… não: o template do **Forge** trouxe `@forge/react@12.1.2-next.4` e `@forge/bridge@6.3.0-next.5` — **prereleases**. Elas funcionavam na minha máquina porque já estavam no `node_modules`. Num runner limpo, o `npm ci` deu **404**: a Atlassian rotaciona os tarballs `-next` e aquele já não existia.

Trocado por `^12.1.2` e `^6.3.0`, ambos estáveis. `npm ci` do zero reproduz, `forge lint` limpo, deploy 2.3.0 ainda elegível a Runs on Atlassian.

**A regra 12 do `CLAUDE.md` já dizia isso** — "nada de beta como dependência central" — e eu deixei passar por vir do scaffold oficial. **Vale generalizar: o que o template gera não está isento das regras do repositório.** Conferir as dependências do scaffold é parte do D1, não uma descoberta do D2.

**E o CI provou o próprio valor no segundo dia.** Sem ele, isso só apareceria quando outra máquina — ou o pipeline de submissão da Atlassian — tentasse instalar do zero.

---

## 2026-08-26 — D3: gravar antes de apagar o timer (ordem invertida)

No D2 o timer era apagado do KVS **antes** da gravação, para eliminar o risco de worklog duplicado. **O D3 inverteu.**

**Por quê.** Com a ordem antiga, um 503 do Jira no momento do "parar" descartava horas que a pessoa cronometrou, sem recurso. Num app de apontamento de horas, esse é o pior desfecho possível — e *"as horas somem"* / *"delay in time logs appearing"* é reclamação já catalogada da categoria (`PESQUISA.md`, rodada 5). Trocamos um risco silencioso e irreversível por um risco visível e corrigível.

**Como a duplicata fica controlada, sem depender de sorte:**
1. O timer é marcado como "gravação em curso" no KVS **antes** do POST. Isso cobre o caso que um `try/catch` não cobre: a função do Forge morrer no meio da chamada, quando nenhum tratamento de erro chega a rodar.
2. Toda retentativa **lê os worklogs do item** e procura um equivalente (mesmo autor, mesmo instante ±1 s, mesma duração) antes de escrever.
3. **Essa leitura é pelo endpoint do item, nunca por JQL** — aplicação direta da regra fixada em 26/08 a partir dos 5,7 s de atraso do índice medidos no spike. É a primeira vez que aquela decisão se paga.
4. Se a leitura de conferência falhar, **grava mesmo assim**. Duplicata a pessoa vê e apaga; hora perdida não volta.

**Consequência de produto:** quando a gravação falha, o painel não diz "erro" — diz que **o tempo continua correndo e seguro**, e o botão vira *Stop and retry*. A mensagem é parte da decisão, não enfeite.

---

## 2026-08-26 — Timer abaixo de 1 minuto não vira worklog

O Jira trabalha em minutos e um timer de 8 segundos é clique errado, não trabalho. Gravar assim sujaria a folha de ponto de quem confia nela.

**Marcado para revisitar no beta.** É o tipo de regra que parece óbvia para quem escreveu e irrita quem usa. Se aparecer reclamação em `BETA.md`, o número muda ou vira configuração.

---

## 2026-08-26 — Trocar de item trava quando o anterior não grava

Iniciar um timer em outro item grava o worklog do anterior primeiro. **Se essa gravação falhar, o timer novo não começa** e o painel explica por quê.

**Alternativa recusada:** começar o novo e deixar o anterior pendente. Seria mais macio no momento e é exatamente assim que hora apontada some sem ninguém perceber — a pessoa segue trabalhando e só descobre o buraco na sexta-feira. Preferimos travar a atrapalhar.

---

## Decisões em aberto (precisam do humano / do chat estratégico)

**Estado: em construção.** D1 e D2 entregues. Nenhuma decisão em aberto bloqueia o código.

| # | Tema | Pergunta | Bloqueia |
|---|---|---|---|
| ~~1–4~~ | ~~Plano, nome, beta, domínio~~ | ✅ **Todas resolvidas em 26/08/2026** | — |
| 5 | Shopify | Espera indefinida ou abandono? Muda o que fica no repositório | Organização do repo |
| 7 | **Critério do D3** | Apontar na `northstack-dev` e conferir se a aba Work log mostra **o seu nome**. Só uma pessoa clicando fecha isso — o `asUser()` não existe fora do navegador | Confiança no D4 |
| 6 | **Preço** | Tabela de faixas por assento no Developer Console — eu preparo os números | Billing (D11, 05/09) |
