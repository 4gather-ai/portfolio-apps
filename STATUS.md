# STATUS — Northstack Apps

**Última atualização:** 2026-08-25 (sessão 4) · Dia 1 de 365 · **Gasto: R$ 0,00**
**Meta 12 meses:** US$ 15.000/mês recorrente · R$ 1M acumulado · Orçamento R$ 10.000

---

## ⏸️ ESTADO: parado, aguardando retorno

O Claude Code entregou tudo o que dependia dele e **parou**. Nada está em andamento. Tudo o que segue está registrado neste arquivo, em `PESQUISA.md`, `DECISOES.md` e `CLAUDE.md`, e commitado e pushado para `origin/main`.

**Perguntas abertas, em ordem de importância:**

| # | Pergunta | Quem responde | O que destrava |
|---|---|---|---|
| 1 | Qual o próximo app? (caminho A, B ou C — ver abaixo) | Chat estratégico / Amarildo | **Todo o trabalho** |
| 2 | Tem impressora de etiqueta (Dymo/Zebra/Brother) e leitor de código de barras? *(4ª vez que pergunto)* | Amarildo | Decide se o único candidato vivo sobrevive |
| 3 | `northstackapps.com` já foi comprado? | Amarildo | Submissão, quando houver app |

**Não há bloqueio técnico.** CLI autenticado, ambiente pronto, repositório limpo e sincronizado. O bloqueio é inteiramente de decisão de produto.

---

## 🔴 ÚNICO BLOQUEIO — escolher o próximo app

**Duas rodadas de pesquisa, sete candidatos, nenhum aprovado.** Evidência completa em [PESQUISA.md](PESQUISA.md).

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
