# STATUS — Northstack Apps

**Última atualização:** 2026-08-25 (sessão 5) · Dia 1 de 365 · **Gasto: R$ 0,00**
**Meta 12 meses:** US$ 15.000/mês recorrente · R$ 1M acumulado · Orçamento R$ 10.000

---

## ⏸️ ESTADO: parado, aguardando retorno

Rodada 3 concluída (caminho B). **Nenhum candidato Shopify aprovado — três rodadas, quinze categorias.** A sonda no Atlassian, porém, deu sinal positivo. Tudo registrado em `PESQUISA.md`, `DECISOES.md`, `CUSTOS.md` e `CLAUDE.md`, commitado e pushado.

**A pergunta mudou de nível: não é mais "qual app", é "qual marketplace".**

| # | Pergunta | Quem responde | O que destrava |
|---|---|---|---|
| 1 | **Rodada 4 completa no Atlassian, ou insistir na Shopify?** | Chat estratégico / Amarildo | **Todo o trabalho** |
| 2 | Etiquetas segue o único candidato Shopify vivo, agora com **R$ 300** de custo de entrada (impressora). Vale comprar antes de decidir o marketplace? | Amarildo | O caminho Shopify |
| 3 | Comprar `northstackapps.com` agora ou esperar? O nome serve aos dois marketplaces | Amarildo | Submissão, quando houver app |

**Não há bloqueio técnico.** CLI autenticado, ambiente pronto, repositório limpo e sincronizado.

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
