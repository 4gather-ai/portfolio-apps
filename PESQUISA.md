# PESQUISA DE MERCADO

Verificação obrigatória antes de escrever qualquer listagem (regra 8 do `CLAUDE.md`, nova forma).
Fonte: Shopify App Store, consultada em **25/08/2026**. Notas, preços e nº de avaliações são os exibidos na loja nessa data.
Método: busca na App Store, extração dos cards de resultado, páginas de preço dos líderes e filtro de avaliações 1–3★.

**Rodadas:** [Rodada 1](#rodada-1--categorias-maduras) (4 candidatos, todos reprovados) · [Rodada 2](#rodada-2--conformidade-regulatória-com-prazo) (conformidade regulatória, todos reprovados) · [Rodada 3](#rodada-3--dificuldade-técnica--sonda-no-atlassian) (dificuldade técnica na Shopify + sonda no Atlassian)

---

# RODADA 1 — categorias maduras

---

## Resumo executivo

| # | Candidato | Concorrente mais forte | Veredito |
|---|---|---|---|
| 1 | Documentos de pedido | MS Order Printer — 5,0★ (255), **grátis**, BFS | 🔴 **Não** |
| 2 | Etiquetas de código de barras | RF Gerador — 5,0★ (326), **grátis**, BFS | 🟡 **Talvez** — o único com espaço real, e estreito |
| 3 | Sync Airtable/Notion/ClickUp | SyncBase — 4,9★ (81), US$ 24/mês | 🔴 **Não** (mercado inexistente) |
| 4 | Bundles | Kaching — 5,0★ (**5.321**), grátis p/ instalar | 🔴 **Não**, categoricamente |

**Nenhum dos quatro passa como está.** Ordem de atratividade: **2 > 1 > 3 > 4**.

### O padrão que atravessa os quatro

Os quatro candidatos partiam da mesma tese: *"o app oficial da Shopify é mal avaliado, logo há espaço"*. A nota do app oficial confirma-se em todos:

| App oficial | Nota | Avaliações |
|---|---|---|
| Shopify Order Printer | 3,6★ | 359 |
| Retail Barcode Labels | 2,3★ | 466 |
| Shopify Bundles | 2,8★ | 542 |

E nos quatro casos o mercado terceiro **já resolveu**, quase sempre de graça. A conclusão vale mais que os vereditos individuais:

> **"App oficial mal avaliado" não é sinal de oportunidade — é sinal de que a categoria é velha o bastante para já estar plenamente servida.** O app oficial ruim é o que empurrou a demanda para terceiros anos atrás. Quando chegamos, o espaço já foi ocupado por quem chegou na época da dor.

O sinal de oportunidade que interessa é o oposto: uma dor **recente ou em movimento**, onde os líderes ainda não tiveram tempo de responder.

---

## Candidato 1 — Documentos de pedido (fatura, packing slip, PDF)

### Concorrentes

| App | Nota | Avaliações | Preço | Obs. |
|---|---|---|---|---|
| **Shopify Order Printer** | 3,6★ | 359 | Grátis | **Oficial**. 5:122 4:31 3:28 2:16 **1:162** |
| **AG Order Printer** (Avada) | 4,9★ | **692** | Plano gratuito | Líder em volume |
| **Order Printer Templates** | 4,9★ | **680** | Grátis para instalar | Built for Shopify |
| **Invoice Falcon** | 4,8★ | 299 | Plano gratuito | Built for Shopify |
| **MS Order Printer ‑ PDF Invoice** | 5,0★ | 255 | **Grátis** | Built for Shopify |
| Oxilayer PDF Invoice | 5,0★ | 164 | Plano gratuito | |
| F: PDF Invoice Generator | 4,7★ | 134 | Plano gratuito | Built for Shopify |
| Shoptopus Invoice Generator | 4,9★ | 54 | **Grátis** | Built for Shopify |

### O que a Shopify já faz nativamente
O próprio Order Printer é app da Shopify, grátis. O admin imprime packing slip sem app. Ou seja: o caminho nativo existe e é gratuito — só é ruim.

### Reclamações 1–3★ do app oficial (3,6★, 162 avaliações de 1★)
- **Não imprime draft orders** — reclamação repetida por vários lojistas, alguns após anos de uso
- **Faturas não conformes com a lei do Reino Unido / UE** ("invoices are not compliant with UK or EU laws")
- Não dá para anexar a fatura automaticamente no e-mail de confirmação — "ainda faltando depois de todos esses anos"
- Sem busca de pedidos dentro do app
- Importação de template quebrada há dois anos
- Exige saber código (Liquid) para customizar
- Em iOS/iPad, caracteres acentuados saem corrompidos na impressão (aparecem certos no preview)
- Pedidos parcialmente atendidos não entram na seleção em massa

### Reclamações 1–3★ do líder (AG Order Printer, 4,9★ — só **10** avaliações abaixo de 4★ em 692)
- Atualizações não anunciadas quebram templates: preço errado, preço sem desconto ("aconteceu mais de uma dúzia de vezes em 4 anos")
- Suporte lento, fuso horário de 12h
- Não reimprime pedido editado antes do fulfillment
- Descontos por item agrupados numa linha só no rodapé
- Pouca customização; editar Liquid é complicado

### Veredito: 🔴 Não

O app oficial ser ruim é irrelevante. Existem **quatro** apps com 250–700 avaliações entre 4,7★ e 5,0★, vários **inteiramente grátis** e com selo Built for Shopify. O líder tem 10 avaliações negativas em 692 — a base está satisfeita, não há revolta para capturar.

**Única dimensão desatendida:** conformidade legal da fatura por país (UE/Reino Unido). Mas isso é um produto regulatório — exige acompanhar legislação de vários países, não é "imprimir PDF bonito", e o custo de manutenção é permanente. Fora do perfil de "v1 faz UMA coisa completa em 14 dias".

---

## Candidato 2 — Etiquetas de preço e código de barras

### Concorrentes

| App | Nota | Avaliações | Preço | Obs. |
|---|---|---|---|---|
| **Retail Barcode Labels** | **2,3★** | 466 | Grátis | **Oficial**. 5:54 4:50 3:76 2:82 **1:204** |
| **Yanet: Retail Barcode Labels** | 4,9★ | **447** | **A partir de US$ 7,99/mês** | Usa o nome do app oficial |
| **MS Barcode Labels & Generator** | 4,9★ | 374 | Plano gratuito | |
| **RF — Gerador código de barras** | 5,0★ | 326 | **Grátis** | **Built for Shopify** |
| BarcodeMan Barcode Labels | 4,8★ | 94 | Plano gratuito | |
| CTS Multi Barcode Labels | 4,9★ | 85 | Avaliação gratuita | |
| *Entrantes novos:* LabelCraft (2), MB (4), LabelFast (0), RS (0) | — | ≤4 | — | Barreira de entrada baixa |

### O que a Shopify já faz nativamente
**Nada.** Impressão de etiqueta não existe no admin — o app oficial *é* o caminho nativo, e tem 2,3★. É o único dos quatro candidatos onde a Shopify não absorveu a função.

### Reclamações 1–3★ do app oficial (2,3★, 204 avaliações de 1★)
- **Uma atualização recente removeu o SKU** das etiquetas Avery 5167. Lojista que fabrica centenas de produtos visualmente parecidos: sem SKU, o risco de etiquetar errado dispara *(jul/2026)*
- **Fonte e tamanho do código de barras mudaram sozinhos** no mesmo template Dymo, quebrando o layout de quem usava há 3 anos *(jul/2026)*
- **Templates não editáveis** — não dá para esconder o preço na Dymo 30299; o lojista se ofereceu para programar de graça se liberassem
- **Formato de moeda errado por localidade:** em francês o símbolo € aparece à esquerda (`€19,99`) quando na França deve ficar à direita (`19,99 €`)
- Sem canal de suporte: "no links or helpdesk available"

### Reclamações 1–3★ do líder pago (Yanet, 4,9★ — 15 avaliações abaixo de 4★ em 447)
- **Etiquetas Brother saem com dimensão diferente do preview e não escaneiam**, mesmo esticadas
- Escolha e ordenação de templates confusa
- App fora do ar com frequência
- **Precisa baixar o PDF antes de imprimir, senão o tamanho sai errado**
- Estrutura de preço confusa

### Veredito: 🟡 Talvez — o mais afiado dos quatro, e ainda assim estreito

**A favor:**
- É o único candidato onde a Shopify **não** tem função nativa
- O app oficial não é só mal avaliado, está **regredindo**: as duas piores reclamações são de julho/2026 e descrevem funcionalidade que *foi removida*
- A mesma dor aparece no oficial **e** no líder pago: **o que imprime não é o que o preview mostra** — dimensão errada, fonte trocada, não escaneia. É um problema técnico específico, verificável e caro de acertar, que ninguém acertou
- Formato de moeda por localidade conecta com a nossa regra de i18n desde o dia 1
- O líder pago cobra US$ 7,99 — há teto de preço, mas existe disposição a pagar

**Contra:**
- **RF é grátis, 5,0★, 326 avaliações e Built for Shopify.** Teríamos que ganhar de graça em fidelidade de impressão
- Quatro entrantes novos com ≤4 avaliações: barreira baixa, então também é fácil sermos o quinto irrelevante
- **Exige teste físico com impressora real** (Dymo, Zebra, Brother) e leitor. Sem isso não dá para atacar justamente a dimensão que é o diferencial

**Se for este, o produto é:** fidelidade de impressão, não geração de código de barras. "O que você vê é o que sai da impressora, em qualquer impressora, com o preço no formato do seu país." Precisa de hardware.

---

## Candidato 3 — Sync Shopify → Airtable / Notion / ClickUp

### Concorrentes

**Airtable** (mercado real, minúsculo):

| App | Nota | Avaliações | Preço |
|---|---|---|---|
| **SyncBase Airtable Instant Sync** | 4,9★ | 81 | **A partir de US$ 24/mês** |
| AirPower sync for Airtable | 4,8★ | 65 | Plano gratuito |
| Mixtable Spreadsheet Editor | 4,6★ | 30 | Plano gratuito |

**Notion:** nenhum app de sincronização de dados com tração. Os dois que existem — Blockparty (5,0★, **2** avaliações) e Notionfy (**0** avaliações) — usam o Notion como *construtor de páginas*, que é outro produto.

**ClickUp:** **três** apps — Opsflow, SyncUp e ClickUp Sync ‑ Orders to Tasks. **Todos os três com zero avaliações.**

### O que a Shopify já faz nativamente
Nada específico. Mas Shopify Flow (grátis, nativo) mais Zapier/Make cobrem o caso genérico de "quando acontecer X, mande para a ferramenta Y" — que é a maior parte da demanda.

### Reclamações 1–3★ dos líderes
**Não há.** SyncBase tem 78 avaliações de 5★, 3 de 4★ e **nenhuma** abaixo disso. Não existe insatisfação para capturar.

### Veredito: 🔴 Não — e o ClickUp é o achado mais claro da pesquisa

O ClickUp é o sinal negativo mais limpo que encontrei: **três desenvolvedores tiveram a mesma ideia e nenhum dos três conseguiu uma única avaliação.** Oferta existe; demanda não. Notion, igual: dois apps, duas avaliações somadas.

O Airtable é real mas minúsculo — **176 avaliações somando a categoria inteira**. Para comparar: um único app de bundles tem 5.321. E o líder já cobra US$ 24/mês com nota quase perfeita: não há brecha de preço nem de qualidade.

**Ressalva que vale guardar:** SyncBase sustenta **US$ 24/mês** — 2,5x o que a categoria de etiquetas suporta — num mercado pequeno e satisfeito. É evidência de que nichos B2B estreitos pagam mais por assento. O problema aqui não é o preço, é o volume: não há instalações suficientes para chegar a US$ 15k/mês.

---

## Candidato 4 — Bundles

### Concorrentes

Busca por "bundles": **1.805 apps**.

| App | Nota | Avaliações | Preço |
|---|---|---|---|
| **Shopify Bundles** | **2,8★** | 542 | Grátis (**oficial**) |
| **Kaching Bundles** | 5,0★ | **5.321** | Grátis para instalar |
| **Pumper Bundles** | 4,9★ | **3.304** | Plano gratuito |
| **FBP Fast Bundle** | 5,0★ | **3.031** | Grátis para instalar |
| **Bundler** | 4,9★ | **2.558** | Plano gratuito |
| AOV.ai Bundles | 5,0★ | 1.537 | Grátis |
| Rapi Bundles | 5,0★ | 1.400 | Grátis para instalar |
| Easy Bundles | 4,9★ | 1.149 | Grátis para instalar |
| Appstle Bundles | 5,0★ | 1.048 | Plano gratuito |
| Simple Bundles & Kits | 4,9★ | 752 | Plano gratuito |
| SMART Bundles | 4,9★ | 316 | **Grátis** |

### O que a Shopify já faz nativamente
Shopify Bundles é first-party e grátis. O admin também tem combined listings e descontos via Shopify Functions.

### Reclamações 1–3★ do app oficial (2,8★, 125 avaliações de 1★)
- Não traz as imagens dos produtos para o bundle — refazer todo o trabalho
- Limites rígidos: **3 opções por bundle e 100 variações**, insuficiente para qualquer catálogo com tamanho + cor
- Bundle aparece **esgotado no site** mesmo com estoque em todos os componentes
- **Não dá para criar bundle a partir de produto existente** — perde o SEO já construído
- Rótulo "(Quantity)" ambíguo: quantidade por pacote vs. quantidade de pacotes

### Veredito: 🔴 Não, categoricamente

O mais saturado dos quatro, sem competição. **Oito apps entre 1.000 e 5.300 avaliações, com notas de 4,9★ a 5,0★**, quase todos grátis para instalar e monetizados sobre o aumento de ticket médio. A nota 2,8★ do app oficial é irrelevante: a demanda migrou para terceiros anos atrás e foi muito bem atendida.

Entrar aqui é competir em marketing de conversão contra empresas com time de growth em tempo integral, num mercado onde o preço de entrada já é zero.

---

## O que eu procuraria numa próxima rodada

Os quatro falharam pelo mesmo motivo: são categorias **maduras**. Os critérios que mudariam o resultado:

1. **Dor com data recente** — mudança de API, regra nova, integração descontinuada nos últimos ~6 meses. Os líderes ainda não tiveram tempo de responder.
2. **Regulação com prazo** — obrigação fiscal ou legal por país com data de vigência. Cria demanda datada e defende contra concorrente grátis, porque manutenção contínua é barreira.
3. **Categoria sem líder grátis com selo Built for Shopify.** Se existe um, o teto de preço é zero e a v1 precisa ser melhor que grátis.
4. **Nº de avaliações somado da categoria acima de ~500 e abaixo de ~5.000.** Menos que isso não sustenta US$ 15k/mês (caso ClickUp/Notion); mais que isso é guerra de marketing (caso bundles).
5. **Reclamação técnica repetida nos 1–3★ de *vários* concorrentes ao mesmo tempo** — como a fidelidade de impressão no candidato 2. Dor que ninguém resolveu costuma ser dor cara de resolver, e isso é a barreira que nos protege depois.

---

# RODADA 2 — conformidade regulatória com prazo

Consultada em **25/08/2026**, mesmo método. Testa diretamente o critério nº 2 da rodada 1 ("regulação com prazo de vigência").

## Resumo executivo da rodada 2

| Candidato | Prazo legal | Apps existentes | Avaliações somadas | Veredito |
|---|---|---|---|---|
| **Botão de desistência da UE** | 19/06/2026 | **17** | **~3.374** | 🔴 **Não — chegamos ~8 meses tarde** |
| EmpCo / selo de garantia GARAN | 27/09/2026 | **7** | **~5** | 🔴 **Não** — 7 concorrentes já posicionados, zero tração |
| Right to Repair | não verificado | **0** de conformidade | **0** | 🔴 **Não** — sem evidência de demanda |

**Nenhum aprovado.** E a rodada produziu uma correção importante ao meu próprio critério nº 2 — ver o fim desta seção.

---

## Candidato principal — Botão de desistência da UE (Diretiva 2023/2673)

### (a) O que a Shopify faz nativamente

**Nada específico.** Não há função nativa de botão de desistência, nem em customer accounts, nem em returns, nem em self-serve returns. O nativo da Shopify cobre *devolução de mercadoria* (RMA, etiqueta de retorno, reembolso) — que é um processo comercial, não o ato jurídico unilateral de desistir do contrato. Nenhuma página de "Incluído na Shopify" cobre returns; a categoria é inteiramente de apps.

Isto é um ponto **a favor** do candidato. É o único fator favorável que encontrei.

### (b) Apps existentes — 17 apps dedicados

| App | Nota | Avaliações | Preço | Obs. |
|---|---|---|---|---|
| **EU Withdrawal Button & Form** (401layers UG) | 4,9★ | **2.203** | Plano gratuito | Líder absoluto. 5:2,1mil 4:96 3:15 2:3 1:9 |
| **Revoq ‑ EU Withdrawal Button** (BuschBytes) | 4,9★ | **508** | Plano gratuito | **Built for Shopify** |
| **EU Withdrawal Button Pro** | 5,0★ | **306** | Plano gratuito | "Law firm approved" |
| EU Withdrawal Button (wideruf-button) | 4,9★ | 91 | Plano gratuito | |
| Returns & EU Withdrawal‑Button (easyreturns) | 4,7★ | 77 | Plano gratuito | Combina returns + desistência |
| EU Widerrufsbutton Pro | 5,0★ | 47 | Plano gratuito | |
| BOO EU Withdrawal Button | 4,9★ | 44 | Plano gratuito | |
| EU Withdrawal Button Free | 4,5★ | 26 | Plano gratuito | |
| Avada EU Withdrawal Button | 5,0★ | 26 | Plano gratuito | |
| Retractly: EU Withdrawal | 4,8★ | 16 | Plano gratuito | |
| EU Withdrawal Button ‑ SEOLab | 5,0★ | 10 | **Grátis** | |
| Withdraw Order: EU Withdrawal | 5,0★ | 7 | Avaliação gratuita | |
| Revoco: EU Withdrawal | 5,0★ | 6 | Plano gratuito | |
| Rückruf: EU Widerrufsbutton | 5,0★ | 4 | Plano gratuito | |
| Widerruf Button: EU Compliance | 3,7★ | 3 | Plano gratuito | |
| Withdrax: EU Withdrawal Button | — | **0** | Plano gratuito | Comprando anúncio |
| EU Withdrawal Button by Square | — | **0** | **Grátis** | "duas etapas, sem login, confirmação" |

**Soma da categoria: ~3.374 avaliações.** Busca por `withdrawal`, `Widerrufsbutton`, `Widerruf` — todos os termos convergem para o mesmo conjunto. Idiomas já cobertos pelo líder: alemão, inglês, espanhol, holandês, francês. Um concorrente anuncia "All 24 EU languages".

**Datas:** não consegui extrair a data de lançamento oficial da página. As avaliações do líder concentram-se em **junho–agosto de 2026**, com uma data de referência de **09/01/2026** na página — ou seja, o app existia meses antes do prazo e a explosão de instalações ocorreu na virada de 19/06.

### (c) Os líderes de returns cobrem o requisito? **Não — mas isso não ajuda**

**AfterShip Returns & Exchanges** (4,7★, 1.393 avaliações): verifiquei a página inteira — **zero menções** a `withdrawal`, `Widerruf`, `rétractation`, `2023/2673`, `EU compliance`, `desistência` ou `desistimiento`.

Nenhum dos líderes de returns (Loop 4,7★/410, ReturnGO 4,8★/358, Return Prime 4,8★/725, AfterShip 4,7★/1.393) aparece em nenhuma das buscas por termos de desistência. Rich Returns não apareceu em nenhuma busca.

**Mas a lacuna já foi preenchida** — pelos 17 apps dedicados, não pelos apps de returns. E um deles (easyreturns, 4,7★/77) já faz a ponte "returns + botão de desistência" num produto só.

**Os quatro requisitos que você listou já estão cobertos**, textualmente, pelos dois maiores:
- *Duas etapas:* Revoq — "compliant **two-step** confirmation flow"
- *Cliente sem conta:* líder — "without needing to log in"; Revoq — "Guests and account holders are covered"
- *Confirmação automática:* líder — "automatically sends the legally required confirmation via email"
- *Permanentemente visível:* líder — "**Permanently visible** EU withdrawal button directly in the shop"

O líder ainda entrega dashboard de solicitações, documentação completa e **relatório de auditoria em PDF**. O Revoq entrega conferência de prazo, cruzamento com os pedidos da Shopify e hospedagem na UE.

### (d) Reclamações 1–3★ mencionando UE / Alemanha / lei

O líder tem **27 avaliações abaixo de 4★ em 2.203** (15 de 3★, 3 de 2★, 9 de 1★). As que existem:

- **Cobrança sobre obrigação legal:** *"I dont quite understand why there are paid tiers on something that is required by the law"* — para adicionar links de FAQ ao formulário é preciso pagar *(EUA, jun/2026)*
- **Risco ao tema da loja:** ao instalar, o app desabilitou uma seção existente da página principal (`disabled: true`) e a substituiu pelo próprio bloco. O lojista alerta que isso pode quebrar páginas de conteúdo e landing pages de SEO *(Taiwan, jun/2026)*
- **CSP / JavaScript inline:** *"Formular wird nach zweimaliger Einrichtung nicht angezeigt... aufgrund der Sicherheitsrichtlinien vom Browser blockiert... App somit unbrauchbar"* — nada na documentação sobre isso *(Alemanha, jun/2026)*

Não encontrei nenhuma reclamação dizendo que o app **falha o requisito legal**. As três queixas são de preço, de integração com o tema e de CSP — problemas de implementação, não de conformidade.

### Aplicação dos 5 critérios

| # | Critério | Resultado |
|---|---|---|
| 1 | Dor com data recente | ✅ **Passa** — 19/06/2026, dois meses atrás |
| 2 | Regulação com prazo de vigência | ✅ **Passa** |
| 3 | Sem líder grátis com selo Built for Shopify | ❌ **FALHA** — Revoq é 4,9★, 508 avaliações, **Built for Shopify**, com plano gratuito. E o líder de 2.203 também é gratuito |
| 4 | Categoria entre ~500 e ~5.000 avaliações | ✅ **Passa** — ~3.374 |
| 5 | Dor técnica repetida nos 1–3★ de vários concorrentes | ❌ **FALHA** — 27 negativas em 2.203; não há dor sistêmica a capturar |

**Critérios de reprovação da regra 8:** dois dos três batem — concorrente grátis cobre a v1 inteira **e** existem **três** líderes com 4,8★+ e 300+ avaliações.

### Veredito: 🔴 Não — a tese estava certa, o timing não

Este é o candidato mais bem fundamentado que apareceu até agora, e ainda assim é um "não" claro. A regulação criou demanda real e datada, exatamente como o critério nº 2 previa. **O problema é que 17 desenvolvedores previram a mesma coisa.**

Chegando hoje, seríamos o 18º app numa categoria onde o líder tem 2.203 avaliações, o segundo tem selo Built for Shopify, e o preço de entrada é **zero**. Não há dimensão de qualidade aberta: as poucas reclamações são de integração com tema e CSP, que qualquer concorrente corrige numa sprint.

### ⚠️ Ressalva jurídica que precisa de verificação antes de qualquer decisão futura

Pelo meu entendimento, a **Diretiva (UE) 2023/2673 altera a Diretiva 2011/83/UE no que diz respeito a contratos de serviços financeiros celebrados à distância**, e o botão de desistência (art. 11º-A) aplica-se a esses contratos — não à venda de bens em geral. Os apps, porém, vendem a obrigação para *todas* as lojas da UE ("Required for EU shops from June 19, 2026").

Não consigo resolver isso pela App Store, meu corte de conhecimento é anterior à entrada em vigor, e **não sou fonte jurídica**. Há duas possibilidades: transposições nacionais ampliaram o escopo (a Alemanha é a hipótese mais provável, e os dois maiores apps são alemães), ou parte do mercado está vendendo urgência acima do que a lei exige.

**Isso não muda o veredito** — o mercado está tomado de qualquer forma. Mas fica registrado: se um dia entrarmos em produto de conformidade, o escopo legal tem que ser confirmado em fonte primária ou com advogado **antes** da listagem, nunca a partir do texto de marketing dos concorrentes.

---

## Candidato secundário — EmpCo / selo de garantia GARAN (verificação leve)

Prazo citado: **27/09/2026** — daqui a ~1 mês.

| App | Nota | Avaliações | Preço |
|---|---|---|---|
| EU Warranty Label & GARAN | 5,0★ | **5** | Plano gratuito |
| Warranto ‑ EU Warranty Label | — | **0** | Plano gratuito |
| EU Warranty & GARAN Label | — | **0** | Plano gratuito |
| EU Warranty Label GARAN | — | **0** | Plano gratuito |
| EU Warranty GARAN Withdrawal | — | **0** | Plano gratuito |
| EU‑Label GARAN | — | **0** | Avaliação gratuita |

**Sete apps já posicionados, cerca de 5 avaliações somadas.** Um deles já combina selo de garantia **e** botão de desistência no mesmo produto — os desenvolvedores do primeiro ciclo estão migrando para o segundo.

**Critério nº 4 reprova:** a categoria soma ~5 avaliações, muito abaixo do piso de ~500. Critério nº 5 também: não há reclamações porque ainda não há uso.

### Veredito: 🔴 Não

Entrar hoje seria ser o **8º app** numa categoria sem tração, um mês antes do prazo, sem distribuição e sem avaliações. E o desfecho é previsível: é exatamente o filme do botão de desistência, um ciclo antes. Quando a demanda chegar em 27/09, quem tem base instalada e avaliações captura — e não seremos nós.

---

## Candidato secundário — Right to Repair (verificação leve)

**Nenhum app de conformidade existe.** A busca por `right to repair`, `spare parts`, `reparatur`, `réparation` devolve apenas apps de "disable right click" (falso positivo pela palavra "right") e um único **Repair & Service Ops by VZLAB** (4,5★, 5 avaliações), que é gestão de oficina — operação, não conformidade.

Não verifiquei prazo legal nem escopo; não há o que verificar na App Store.

### Veredito: 🔴 Não

Categoria vazia, sem prazo confirmado por mim e sem nenhum sinal de demanda. É o padrão ClickUp da rodada 1: ausência de oferta que não se distingue de ausência de procura. Se houver interesse real, o primeiro passo é confirmar a obrigação legal em fonte primária, não construir.

---

## 🔧 Correção ao critério nº 2 da rodada 1

O critério dizia: *"Regulação com prazo de vigência — cria demanda datada e defende contra concorrente grátis, porque manutenção contínua é barreira."*

**A rodada 2 mostra que a segunda metade está errada.** O botão de desistência tem prazo legal, demanda datada e manutenção contínua — e mesmo assim atraiu **17 concorrentes**, quase todos gratuitos. A barreira não se formou.

O motivo é estrutural e eu não tinha visto:

> **Um prazo legal é informação pública.** Todo desenvolvedor da App Store lê a mesma diretiva, na mesma data, e chega à mesma conclusão. Oportunidade regulatória é a **mais contestada**, não a menos — o oposto do que o critério supunha. E o preço converge a zero porque conformidade é obrigação, não benefício: ninguém consegue cobrar caro por algo que o lojista é forçado a ter e que o concorrente ao lado dá de graça.

A confirmação está no EmpCo: **7 apps posicionados antes mesmo do prazo chegar.** O ciclo se repete, e mais rápido a cada vez.

**Critério nº 2 reescrito:**

> **Regulação com prazo serve como sinal de demanda, nunca como vantagem competitiva.** Só vale entrar se houver, além do prazo, uma barreira que não seja o conhecimento da lei — dado proprietário, integração difícil, certificação, ou relação com o canal. Se a única barreira é "saber que a lei existe", já chegamos tarde: dezessete pessoas leram a mesma lei.

### Consequência para a próxima rodada

Dos 5 critérios originais, o nº 2 está corrigido e o nº 1 ("dor com data recente") herda a mesma ressalva: **dor pública com data é dor disputada**. O que sobra como fonte real de vantagem são os critérios 3 e 5 — ausência de líder grátis com selo, e dor técnica que ninguém resolveu porque é cara de resolver.

Isso aponta para **dificuldade técnica, não para calendário**, como filtro principal da rodada 3.

---

# RODADA 3 — dificuldade técnica + sonda no Atlassian

Consultada em **25/08/2026**. Parte 1: Shopify sob filtro de dificuldade técnica. Parte 2: sonda no Atlassian Marketplace (Jira e Confluence Cloud).

## Resumo executivo da rodada 3

| # | Candidato Shopify | Líder | Soma de avaliações | Veredito |
|---|---|---|---|---|
| 1 | **Impostos sobre vendas (EUA, apuração e envio)** | Numeral 4,5★ (114) | ~330 | 🟡 **Barreira real, mas errada** |
| 2 | Isenção de IVA / B2B UE | VAT/TAX Exemption 4,9★ (40) | ~63 | 🔴 Sem demanda |
| 3 | EDI / trading partners | SPS Commerce 4,9★ (7) | ~58 | 🔴 Sem demanda self-serve |
| 4 | Fiscal por país (NF-e Brasil) | — nenhum | ~18 | 🔴 Sem demanda |
| 5 | Conectores de ERP | Odoo 5,0★ (61) | ~120 | 🔴 Volume baixíssimo |
| 6 | Frete / transportadoras | ShipX 5,0★ (1.169) | ~2.600 | 🔴 Saturado |
| 7 | Multimoeda / arredondamento | BUCKS 4,9★ (1.167) | ~2.500 | 🔴 Saturado, com líder **grátis** |
| 8 | B2B wholesale / catálogo | BSS 4,9★ (1.107) | ~4.400 | 🔴 Saturado |

**Nenhum aprovado.** E a rodada revelou por que: na Shopify, dificuldade técnica e volume são **inversamente proporcionais**.

**Atlassian:** 🟢 **Sim, a densidade é menor — na dimensão que importa.** Detalhe na parte 2.

---

## Parte 1 — Shopify sob filtro de dificuldade técnica

### O achado estrutural: o quadrante que procurávamos não existe

Procurávamos "problema caro de resolver **e** disposição a pagar acima de US$ 20/mês". Os dados mostram uma correlação inversa limpa:

| Categoria | Dificuldade técnica | Disposição a pagar | Volume (avaliações somadas) |
|---|---|---|---|
| Conectores de ERP | Altíssima | **US$ 199,92/mês** (NetSuite) | ~120 |
| EDI / trading partners | Altíssima | US$ 50/mês (Dscopify) | ~58 |
| Fiscal por país (Brasil) | Altíssima | — | ~18 |
| Impostos EUA | Alta (mas ver abaixo) | US$ 100–300/mês | ~330 |
| Frete / transportadoras | Média | US$ 10–30/mês | ~2.600 |
| Multimoeda | Baixa | **grátis** | ~2.500 |
| B2B wholesale | Baixa/média | US$ 20–50/mês | ~4.400 |

**Quanto mais difícil o problema, menos lojistas da Shopify o têm.** E a razão é econômica, não técnica: o lojista que precisa de EDI, ERP ou apuração fiscal multiestado já é grande o bastante para comprar um **serviço** com vendedor, contrato e implantação — não um app self-serve de US$ 29. Quem compra app self-serve tem os problemas fáceis, e os problemas fáceis já estão resolvidos de graça.

O nosso alvo declarado no `CLAUDE.md` — lojas de **US$ 50k–5M/ano** — fica exatamente no meio desse vão: grande demais para os problemas triviais, pequena demais para ter os problemas caros.

### Candidato 1 — Impostos sobre vendas nos EUA 🟡

| App | Nota | Avaliações | Preço |
|---|---|---|---|
| **Sales Tax Automation by TaxRex** | 5,0★ | 117 | Avaliação gratuita |
| **Numeral Sales Tax** | **4,5★** | 114 | Grátis para instalar (+ taxas) |
| **TaxCloud Sales Tax Automation** | 4,8★ | 96 | Grátis para instalar |
| Refundably Sales Tax Refunds | 5,0★ | 1 | Avaliação gratuita |
| Shopify Data Exporter ‑ Tax | **1,9★** | 7 | Grátis |

**O que a Shopify faz nativamente:** calcula imposto no checkout (Shopify Tax), mas **não apura nem entrega declaração**. A lacuna é real.

**Notas mais baixas que o normal da App Store** (4,5 e 4,8, contra os 4,9–5,0 onipresentes) — sinal de insatisfação genuína. Distribuição do Numeral: 5:90 · 4:11 · 3:0 · 2:0 · **1:13**. Polarizado.

**Reclamações 1–3★ do Numeral** — e aqui está o ponto:
- *"I have tax authorities contacting me indicating I'm non-compliant"* — declarações não entregues *(jun/2026)*
- *"TWELVE MONTHS into a support case... Numeral incorrectly filed my state taxes and can not figure out how to fix it"* *(jun/2026)*
- Cobrança por registros estaduais que nunca aconteceram; caixa postal virtual não funciona *(ago/2026)*
- Não devolvem nem apagam dados de login após o cancelamento
- Sem telefone, tickets sem resposta por semanas

### Veredito: 🟡 A barreira é real — mas é a barreira errada

Este é o único candidato das três rodadas que satisfaz o critério nº 5 com folga: **dor técnica repetida, severa e não resolvida pelo líder.** Não há líder grátis dominante. Há disposição a pagar de US$ 100–300/mês. Passa nos critérios 3, 4 e 5.

**E mesmo assim é "não".** Porque as reclamações não são de software — são de **operação regulada**. "Declaração entregue errada", "registro estadual não feito", "autoridade fiscal me notificou": isso não se resolve com código melhor. Resolve-se sendo agente fiscal habilitado em dezenas de estados americanos, com procuração, endereço postal por estado e contadores humanos respondendo em prazo legal.

Isso é incompatível com duas coisas nossas ao mesmo tempo: o modelo **"IA First"** (o humano só faz o que exige CPF/CNPJ — aqui o humano faria o produto inteiro) e o orçamento de **R$ 10.000**.

**Registrado como aprendizado:** "barreira alta" não basta. A barreira precisa ser **técnica**, não operacional ou regulatória — porque barreira técnica a IA atravessa, e barreira operacional exige gente, licença e responsabilidade legal.

### Candidatos 2 a 5 — barreira alta, mercado inexistente

**IVA / isenção B2B UE:** VAT/TAX Exemption 4,9★ (40), Momsify 5,0★ (9), Taxify 4,6★ (9), VAT & Tax Switcher 5,0★ (5). Soma ~63 avaliações — muito abaixo do piso de 500. 🔴

**EDI:** só a **SPS Commerce** (gigante do setor) com 4,9★ e **7 avaliações**, grátis para instalar; ProcureSync (PunchOut/OCI/cXML) 5,0★ (4); Dscopify Dropship 5,0★ (47) a **US$ 50/mês**. Soma ~58. EDI é vendido como serviço com implantação, não como app. 🔴

**Fiscal por país — NF-e Brasil:** **não existe app de NF-e para Shopify.** Só hutko Fiscal (grátis, zero avaliações). E os dois maiores ERPs brasileiros têm apps oficiais mal avaliados: **Bling 2,1★ (7)** e **Sistema ERP da Olist/Tiny 1,6★ (11)**. Soma da categoria: ~18 avaliações. 🔴
*Observação:* a combinação "mercado brasileiro + CNPJ do Amarildo + barreira de certificado digital e webservices da SEFAZ" seria a vantagem local que o critério corrigido nº 2 pede. Mas **não há demanda mensurável**: a Shopify tem pouca penetração no Brasil frente a Nuvemshop e VTEX, e quem vende lá já emite NF-e pelo ERP. É o padrão ClickUp de novo — ausência de oferta que não se distingue de ausência de procura.
*Contraexemplo útil:* o fiscal localizado **funciona** onde há base instalada — GST da Índia tem WebPlanex 5,0★ (459) e GST Pro 5,0★ (251), somando ~710. Mas já está servido por dois líderes 5,0★.

**Conectores de ERP:** NetSuite ERP Connector 4,4★ (6) a **US$ 199,92/mês**, Odoo Integration 5,0★ (61), MRPeasy 4,7★ (35), Xorosoft 5,0★ (11), OdooSyncO 4,5★ (8), UpSeller ERP 3,0★ (6), Acumatica 5,0★ (1). Preço altíssimo, qualidade irregular, **volume irrisório**. 🔴

### Candidatos 6 a 8 — saturados

**Frete/transportadoras:** ShipX 5,0★ (1.169), PH Ship Rate for FedEx 4,9★ (622), ShipZip 5,0★ (406), SMART Shipping 5,0★ (372) — quase todos grátis para instalar. 🔴

**Multimoeda/arredondamento:** BUCKS Currency Converter 4,9★ (1.167), **Nova Multi Currency 4,9★ (749) — grátis**, MLV Multi Country Pricing 4,7★ (402), Webrex 4,8★ (125), CVC 4,5★ (124). Líder grátis com nota alta: reprovação direta pela regra 8. 🔴

**B2B wholesale / catálogo:** BSS 4,9★ (1.107), Sami B2B Lock 4,9★ (937), Sami Wholesale 4,9★ (936), Descontos B2B 4,9★ (695), SparkLayer 4,9★ (360), MultiVariants 4,9★ (341), Clay 5,0★ (261), Massy 5,0★ (215). 🔴

### Correção a um dado da rodada 1

Na rodada 1 registrei que o líder de documentos de pedido tinha 692 avaliações. **Faltou o maior:** **Order Printer Pro — 4,9★ com 2.731 avaliações**, grátis para instalar. A categoria é ainda mais saturada do que documentei. O veredito de reprovação não muda; o número, sim.

---

## Parte 2 — Sonda no Atlassian Marketplace (Jira e Confluence Cloud)

### ⚠️ Aviso metodológico antes dos números

**Contagem de avaliações não é comparável entre as duas lojas.** O Atlassian exibe instalações e avaliações separadamente, e a taxa de avaliação é baixíssima: draw.io tem **62,7 mil instalações e 1.204 avaliações** (~2%); Just Add+ tem 8,3 mil instalações e 50 avaliações (~0,6%). Na Shopify, o Judge.me tem 44.087 avaliações.

Comparar "1.204 do draw.io" com "5.321 do Kaching" levaria à conclusão errada. **O que é comparável é a nota dos líderes e a presença de líder grátis.**

### Categoria 1 — Time tracking (Jira Cloud)

| App | Nota | Avaliações | Instalações |
|---|---|---|---|
| **Timesheets by Tempo** | **4.1** | 896 | **27,2 mil** |
| Timesheet Tracking (Cappsule) | 4.4 | 251 | 13,4 mil |
| **Clockify** | **3.9** | 129 | 9,1 mil |
| Clockwork Lite (HeroCoders) | 4.6 | 112 | 7,1 mil |
| Time in Status (SaaSJet) | 4.5 | 208 | 5,4 mil |
| Worklogs (SolDevelo) | 4.5 | 101 | 5,4 mil |
| Clockwork Pro | 4.6 | 140 | 4,6 mil |
| Activity Timeline (Reliex) | 4.7 | 121 | 3,8 mil |
| Time to SLA (Appfire) | 4.8 | 236 | 3,4 mil |
| **Harvest Time Tracking (Oficial)** | **2.5** | 145 | 2,5 mil |
| Timetracker | 4.1 | 110 | 2,3 mil |

**O líder da categoria tem nota 4.1 com 27 mil instalações.** E o app oficial da Harvest sustenta 2.500 instalações com **nota 2.5**. Na Shopify isso não acontece: lá o líder de qualquer categoria examinada está entre 4,8 e 5,0.

### Categoria 2 — Test management (Jira Cloud)

| App | Nota | Avaliações | Instalações |
|---|---|---|---|
| Xray (Xblend) | **4.3** | 551 | 25,7 mil |
| Zephyr (SmartBear) | **4.1** | 492 | 15,5 mil |

Duas empresas grandes dividindo a categoria, **ambas em 4.1–4.3**. Demanda evidente (41 mil instalações somadas), satisfação medíocre.

### Categoria 3 — Diagramas e formatação (Confluence Cloud)

| App | Nota | Avaliações | Instalações |
|---|---|---|---|
| draw.io | 4.8 | 1.204 | **62,7 mil** |
| Gliffy | 4.5 | 799 | 16,3 mil |
| Table Filter, Charts & Spreadsheets | 4.9 | 442 | 15,1 mil |
| Scroll PDF Exporter (K15t) | 4.7 | 225 | 8,9 mil |
| Just Add+ (Modus Create) | **4.2** | 50 | 8,3 mil |
| Scroll Word Exporter (K15t) | 4.9 | 135 | 4,7 mil |
| Mosaic (Kolekti/Adaptavist) | **4.3** | 112 | 4,5 mil |
| AURA Content Formatting | 5.0 | 209 | 4,3 mil |

Aqui a qualidade é maior (draw.io 4.8 domina com folga), mas ainda há apps com 4.2–4.3 sustentando 4–8 mil instalações.

### Categoria 4 — Automação de workflow (Jira Cloud)

| App | Nota | Avaliações | Instalações |
|---|---|---|---|
| ScriptRunner (Adaptavist) | 4.6 | 822 | **35 mil** |
| JMWE (Appfire) | 4.8 | 534 | 16,8 mil |
| JSU Automation Suite (Appfire) | 4.6 | 298 | 12,3 mil |
| Jira Workflow Toolbox (Decadis) | 4.9 | 539 | 4,8 mil |
| Structure by Tempo | 4.6 | 408 | 13,1 mil |
| Rich Filters for Dashboards | 4.8 | 183 | 9,4 mil |

Categoria mais madura e mais bem avaliada — dominada por consolidadores (Appfire, Adaptavist, Tempo).

### Preço por usuário e presença de líder grátis

O modelo é **por usuário/mês, com piso**. O Tempo Timesheets, para uma instância de 10 usuários, custa **US$ 10,00/mês — US$ 1,00 por usuário**. Todos os apps oferecem **30 dias de teste**.

Três diferenças estruturais frente à Shopify:

1. **Não encontrei líder grátis em nenhuma das quatro categorias.** O único que se anuncia como grátis é o Clockify — e tem nota **3.9**. Na Shopify, o líder grátis é a norma nas oito categorias da rodada 3.
2. **A receita escala com o número de assentos.** Um cliente de 500 usuários paga centenas de dólares por mês pelo mesmo produto que rende US$ 10 num cliente de 10. Na Shopify, nosso plano Pro era US$ 39 fixos, com ou sem 500 pedidos.
3. **O comprador é uma empresa com orçamento de ferramentas**, não um lojista pagando do próprio bolso. Isso muda a elasticidade de preço inteira.

### Resposta direta: a densidade de concorrência é menor que na Shopify?

**Sim — mas não em número de apps. Em barra de qualidade e em preço.**

- **Número de apps:** equivalente. Ambas as buscas do Atlassian devolvem "over 1,000 matches", assim como as da Shopify. Não há menos concorrentes.
- **Barra de qualidade: muito mais baixa, e essa é a diferença que importa.** No Atlassian, líderes de categoria vivem em **4.1–4.6** com dezenas de milhares de instalações; um app oficial de 2.5 sobrevive. Na Shopify, as três rodadas mostraram líderes uniformemente em **4,8–5,0**. Ser melhor é um diferencial viável no Atlassian; na Shopify, "melhor que 4,9 e grátis" quase não é uma proposta.
- **Piso de preço: existe.** Sem líder grátis, o preço não converge a zero — o problema que reprovou 3 das 8 categorias Shopify desta rodada e a categoria inteira da rodada 2.
- **Valor por cliente: muito maior**, porque escala por assento.

**Ressalvas honestas:**
- Ciclo de venda mais longo: quem instala é o admin do Jira, e em empresa há aprovação e revisão de segurança pelo caminho.
- **Barreira de plataforma real:** "Cloud Fortified" e "Runs on Atlassian" são selos com requisitos de segurança, suporte e confiabilidade. Isso é custo de entrada — e também fosso, uma vez dentro.
- Sonda rasa: quatro categorias, sem leitura de avaliações negativas nem verificação do que a Atlassian faz nativamente. **Isto não é um veredito de entrada, é um sinal de que vale a rodada 4 completa aqui.**

---

## Aprendizados acumulados após três rodadas

1. **App oficial mal avaliado ≠ oportunidade** (rodada 1) — é sinal de categoria madura já servida.
2. **Regulação com prazo ≠ vantagem** (rodada 2) — prazo legal é informação pública, logo é a oportunidade mais disputada.
3. **Barreira alta ≠ barreira útil** (rodada 3) — a barreira precisa ser **técnica**. Barreira operacional ou regulatória (impostos EUA) exige gente, licença e responsabilidade legal, o que quebra o modelo "IA First".
4. **Na Shopify, dificuldade e volume são inversamente proporcionais** (rodada 3) — o quadrante "difícil e com muitos compradores self-serve" não existe, porque quem tem os problemas difíceis compra serviço, não app.
5. **A restrição pode não ser a categoria, e sim o marketplace.** Três rodadas, quinze categorias, e o padrão da Shopify não se moveu: líder grátis, nota 4,9–5,0, centenas ou milhares de avaliações. O Atlassian tem a barra de qualidade num patamar visivelmente mais baixo e não tem o problema do líder grátis.
   > ⚠️ **A segunda metade deste item foi corrigida na rodada 4.** A sonda rasa (4 categorias) levou à conclusão errada de que não há líder grátis no Atlassian. Há — ver rodada 4, categorias 4 e 6.

---

# RODADA 4 — Atlassian Marketplace, verificação completa

Consultada em **25/08/2026**. Jira Cloud e Confluence Cloud. Shopify em espera por decisão do Amarildo.

## ⚠️ Nota de método (diferenças frente às rodadas 1–3)

Três limitações que precisam ficar explícitas, porque tornam esta rodada **menos rigorosa** que as anteriores:

1. **Não existe filtro por estrelas.** A Shopify permite listar só as avaliações 1–3★; o Atlassian não. Tive de varrer o fluxo cronológico e selecionar as críticas por conteúdo. Cobertura menor e com viés meu na seleção.
2. **Contagem de avaliações não é comparável com a Shopify.** O Atlassian mostra instalações e avaliações separadas, e a taxa de avaliação é de ~0,5% a 4% (draw.io: 62,7 mil instalações, 1.204 avaliações). **Uso instalações como medida de tração e nota como medida de satisfação.**
3. **A cobertura nativa do Jira/Confluence está marcada por confiança.** Onde não verifiquei em fonte oficial, está marcado como *não verificado* — meu corte de conhecimento é maio/2026 e a Atlassian muda funcionalidade nativa com frequência. **Fechar essa lacuna é a primeira tarefa da rodada 5.**

## Resumo executivo da rodada 4

| # | Categoria | Líder | Nota | Instalações | Líder grátis? | Veredito |
|---|---|---|---|---|---|---|
| 1 | Time tracking | Tempo Timesheets | **4.1** | 27,2 mil | Não | 🟡 **Dor técnica confirmada** |
| 2 | Test management | Xray | **4.3** | 25,7 mil | Não | 🟡 **Incumbentes fracos** |
| 3 | Exportação PDF/Word (Confluence) | Scroll PDF (K15t) | 4.7 | 8,9 mil | Não | 🔴 K15t domina bem |
| 4 | Checklists e subtarefas | Checklists Free | 4.8 | **31,3 mil** | **SIM** | 🔴 Reprovado |
| 5 | Dependências e roadmaps | Structure by Tempo | 4.6 | 13,1 mil | Não | 🟡 Fragmentado, mas nativo avança |
| 6 | Relatórios e dashboards | eazyBI | 4.7 | 11,1 mil | **SIM** (Easy Reports Free) | 🔴 Reprovado |

**Dois candidatos com sinal real: time tracking e test management.** E uma correção importante à rodada 3 — ver "O que a rodada 4 corrigiu".

---

## Categoria 1 — Time tracking (Jira Cloud) 🟡

| App | Nota | Aval. | Instalações | Selos |
|---|---|---|---|---|
| **Timesheets by Tempo** | **4.1** | 896 | **27,2 mil** | SPOTLIGHT |
| Timesheet Tracking (Cappsule) | 4.4 | 251 | 13,4 mil | CLOUD FORTIFIED + BESTSELLER |
| **Clockify** (CAKE.com) | **3.9** | 129 | 9,1 mil | CLOUD FORTIFIED |
| Clockwork Lite (HeroCoders) | 4.6 | 112 | 7,1 mil | RUNS ON ATLASSIAN |
| Time in Status (SaaSJet) | 4.5 | 208 | 5,4 mil | CLOUD FORTIFIED + SPOTLIGHT |
| **Harvest (Oficial)** | **2.5** | 145 | 2,5 mil | CLOUD FORTIFIED |

**Preço:** Tempo — **US$ 10,00/mês para 10 usuários (US$ 1,00/usuário)**, 30 dias de teste.

**Nativo (não verificado em fonte oficial):** o Jira tem registro de tempo nativo — estimativa original, tempo gasto, worklogs e relatórios básicos. O que não tem: folha de ponto por período, aprovação de horas, taxas de faturamento e relatórios de utilização. É exatamente essa camada que os apps vendem.

**Reclamações — duas técnicas e precisas:**

- **Worklogs gravados como app, não como usuário** *(jun/2026)*: *"breaking any JQL queries on worklog authors, because on jira side each worklog gets loged asApp and not asUser… `worklogAuthor = currentUser()` returns zero results. This could be easily avoided by using asUser."* O app quebra a consulta nativa do Jira — e o próprio usuário aponta a correção.
- **Usuário comum trancado fora após atualização** *(jul/2026)*: *"Instead of accessing my time tracking, I'm greeted with 'Choose which apps you would like on your Jira instance.' As a regular user, I don't manage Jira apps, so I'm effectively locked out."* Tela de administrador exibida para quem não é administrador.

**Veredito 🟡:** líder com **4.1 e 27 mil instalações**, e as falhas são de **fidelidade de integração com o Jira** — categoria de problema técnica, verificável e corrigível por código. É o perfil que o critério nº 5 pede. Contra: categoria com 11+ concorrentes e consolidadores grandes (Tempo, HeroCoders, SaaSJet).

---

### 🔧 Correção de 01/09/2026 — a tabela desta categoria estava incompleta

A tabela acima **não mapeou o concorrente mais próximo de nós.** Ele apareceu na thread da Barbara Homer, anúnciado pelo próprio fornecedor, quatro meses depois de a rodada 4 ter sido escrita:

| App | Nota | Aval. | Instalações | Selos |
|---|---|---|---|---|
| **Worklogs** (SolDevelo) | **4,5** | 101 | 5,4 mil | **Runs on Atlassian + Cloud Fortified + Gold** |

**Por que a omissão importa mais que o número:** ele não é só mais um app de time tracking. **Ele é Runs on Atlassian, lê e grava worklog nativo por arquitetura, e é grátis até 10 usuários** — as três coisas que a rodada 5 tratou como a nossa cunha. Se a rodada 4 o tivesse mapeado, a frase *"worklog nativo com o seu nome"* nunca teria sido escrita como diferencial.

**A consequência é de discurso, não de decisão:** a cunha continua **verdadeira como propriedade do produto** e passa a ser **fraca como argumento de venda**. O que muda é a listagem — registrado em `DECISOES.md`, 01/09/2026.

> ⚠️ **A atenção de método:** este app estava na Marketplace o tempo todo. A rodada 4 leu **as seis primeiras posições por instalações** e parou aí. O concorrente que mais se parece com o produto que a gente ia construir estava fora do top 6 exatamente por ser o mais novo — **e ordenar por volume esconde justamente quem entrou depois com a mesma ideia.**

---

### Teste do Worklogs (SolDevelo) — 01/09/2026, resultado completo

Instalado em trial (edition **Advanced**) na `northstack-dev`, o mesmo site onde o Nativelog já estava. Foi um teste de convivência, não de bancada.

| O que | Resultado |
|---|---|
| **O Nativelog escreve worklog nativo com a identidade da pessoa** | ✅ **provado de fora** — aba Work log do `SCRUM-6`: *"Amarildo Pereira logged 10m"* |
| O Worklogs **lê** worklog e estimativa nativos | ✅ o relatório de 24–31/08 mostrou as **3h16m** que o Nativelog gravou; o modal leu `30m / 2h 39m` do `SCRUM-1` |
| O Worklogs conseguiu **gravar** | ❌ falhou no `SCRUM-6` e no `SCRUM-1`, com e sem *remaining estimate* — *"We were unable to save worklog at this time"*, precedido de *"Tracking field is hidden in this issue"* |
| O Jira nativo grava no mesmo item | ✅ o diálogo Time tracking abre e funciona (`11m logged / 2h 49m remaining`) |
| **Causa da falha deles** | ❓ **desconhecida** — consentimento/instalação do trial, defeito no Jira novo ("Spaces"), ou algo da instância |

**A leitura que vale:** o teste confirmou uma coisa nossa e uma coisa deles. **Nossa:** o worklog do Nativelog é tão nativo que um app de terceiro o leu e somou sem saber que existimos — essa é a prova mais forte da cunha até hoje, porque veio de fora. **Deles:** eles leem nativo também, o que confirma a correção acima.

> 🛑 **Regra adotada em 01/09/2026: não usar a falha de gravação deles como argumento enquanto a causa for desconhecida.** Nem em listagem, nem em resposta de fórum, nem em e-mail a parceiro, nem em conversa.
>
> **Motivo:** um concorrente mal instalado não prova nada. Se a causa for o trial, ou o Jira novo, ou a nossa instância, a afirmação volta contra nós **na primeira review** — e aí não é só um argumento perdido, é credibilidade. **Dizer que o concorrente está quebrado é a afirmação mais cara de errar que existe**, porque quem a desmente é o próprio fornecedor, em público, com log.
>
> Se um dia a causa for conhecida e for defeito deles: continua fora do nosso texto. **Vendemos o nosso peixe** (regra de discurso 2, `LISTING.md`).

---

## Categoria 2 — Test management (Jira Cloud) 🟡

| App | Nota | Aval. | Instalações | Selos |
|---|---|---|---|---|
| **Xray** (Xblend) | **4.3** | 551 | **25,7 mil** | CLOUD FORTIFIED + BESTSELLER |
| **Zephyr** (SmartBear) | **4.1** | 492 | 15,5 mil | CLOUD FORTIFIED + SPOTLIGHT |
| **Zephyr Essential** | **3.9** | 900 | 10,3 mil | — |
| **TestRail** (integração) | **3.8** | 110 | 10,5 mil | — |
| AIO Tests | **4.9** | 113 | 3,5 mil | CLOUD FORTIFIED + BESTSELLER |
| QMetry (QTM4J) | 4.7 | 200 | 2,2 mil | CLOUD FORTIFIED |
| Agile Test | 4.6 | 73 | 1,2 mil | CLOUD FORTIFIED |

**Nativo:** o Jira **não tem** gestão de testes nativa. Categoria inteiramente de apps.

**O padrão mais interessante das seis categorias:** os quatro maiores em instalação estão entre **3.8 e 4.3**; os desafiantes bem avaliados (AIO Tests 4.9, QMetry 4.7) têm 5 a 10 vezes menos instalações. **Qualidade e distribuição estão descorrelacionadas** — o que significa que ser melhor, sozinho, não desloca o incumbente. É um alerta, não um convite.

**Reclamação recorrente — e é de modelo de licença, não de software:**
- *"the licensing cost is based on all Jira users rather than just the QA team members who need it. For a team with only 4–5 QA engineers, the pricing was not cost-effective."* *(jun/2026)*

Essa é a dor mais citada da categoria e **não é corrigível por nós**: o licenciamento por total de usuários da instância é regra da plataforma Atlassian, não escolha do fornecedor. Vale como aprendizado geral sobre o marketplace, não como brecha de produto.

**Veredito 🟡:** demanda enorme (61 mil instalações somando os quatro maiores) e incumbentes fracos. Mas a descorrelação entre nota e distribuição sugere que a decisão de compra é institucional, não por qualidade.

---

## Categoria 3 — Exportação de PDF/Word do Confluence 🔴

| App | Nota | Aval. | Instalações | Selos |
|---|---|---|---|---|
| **Scroll PDF Exporter** (K15t) | 4.7 | 225 | 8,9 mil | CLOUD FORTIFIED + BESTSELLER |
| **Scroll Word Exporter** (K15t) | **4.9** | 135 | 4,7 mil | CLOUD FORTIFIED + BESTSELLER |
| Content Exporter | **3.5** | 28 | 1,1 mil | CLOUD FORTIFIED |
| PDF/HTML/Word Exporter | **3.1** | 8 | 192 | — |
| Easy PDF Export | **2.7** | 6 | 44 | — |
| Iota Copy (Markdown/LLM/PDF) | 5.0 | 2 | 73 | RUNS ON ATLASSIAN |

**Preço:** Scroll PDF — **US$ 5,00/mês para 10 usuários (US$ 0,50/usuário)**. O mais barato das seis categorias.

**Nativo:** o Confluence exporta para PDF e Word nativamente (página e espaço). O que os apps vendem é controle de template, capa, sumário, cabeçalho/rodapé, numeração e paginação.

**A distribuição de notas conta a história:** a K15t tem 4.7 e 4.9; **todos os desafiantes estão entre 2.7 e 3.5**. Isso confirma que exportação fiel é tecnicamente difícil — mas confirma também que **alguém já resolveu**, e há mais de uma década.

**Veredito 🔴:** dificuldade real, mas com um incumbente que a venceu e cobra pouco (US$ 0,50/usuário). Entrar aqui é competir contra a K15t em qualidade de renderização por US$ 5/mês. Sem espaço.

---

## Categoria 4 — Checklists e subtarefas (Jira Cloud) 🔴

| App | Nota | Aval. | Instalações | Selos | Preço (10 usuários) |
|---|---|---|---|---|---|
| **Checklists for Jira (Free)** | **4.8** | **1.008** | **31,3 mil** | — | **Grátis** |
| Checklists for Jira (Pro) | 4.5 | 264 | 8 mil | SPOTLIGHT | **Grátis até 10 usuários** |
| Smart Checklists | 4.7 | 130 | 4,6 mil | RUNS ON ATLASSIAN + BESTSELLER | — |
| Checklists for Jira (Enterprise) | 4.3 | 143 | 4,6 mil | BESTSELLER | — |
| Multiple Checklists | **4.9** | 29 | 1,1 mil | CLOUD FORTIFIED | — |
| Automatic Subtasks | 3.8 | 13 | 55 | — | — |

**Nativo:** o Jira tem subtarefas nativas e listas de tarefas na descrição. *(Se a Atlassian adicionou campo de checklist nativo depois de maio/2026, não verifiquei — fica para a rodada 5.)*

**Veredito 🔴 — e é a reprovação mais importante da rodada.** A HeroCoders opera uma escada Free → Pro → Enterprise em que o **degrau grátis tem 31,3 mil instalações e nota 4.8** — mais instalações que qualquer líder pago das outras cinco categorias. É exatamente o padrão que reprovou metade das categorias da Shopify.

---

## Categoria 5 — Dependências e roadmaps entre projetos 🟡

| App | Nota | Aval. | Instalações | Selos |
|---|---|---|---|---|
| **Structure by Tempo** | 4.6 | 408 | **13,1 mil** | CLOUD FORTIFIED + SPOTLIGHT |
| Deep Clone for Jira | 4.5 | 134 | 12,1 mil | CLOUD FORTIFIED + SPOTLIGHT |
| Gantt Charts for Structure | **4.2** | 61 | 6,5 mil | CLOUD FORTIFIED |
| Aha! Roadmaps for Jira | **4.9** | 357 | 1,7 mil | — |
| Portfolio Roadmaps/Timeline | 4.3 | 30 | 1,5 mil | CLOUD FORTIFIED |
| Projectrak | 4.5 | 127 | 1,4 mil | CLOUD FORTIFIED |
| **Easy Agile Roadmaps** | **3.5** | 64 | 1,3 mil | CLOUD FORTIFIED |
| Version Sync (cross-project) | 4.7 | 8 | 404 | CLOUD FORTIFIED |

**Nativo — e aqui está o risco:** o Jira tem Timeline em todos os planos e **Advanced Roadmaps (planejamento entre projetos, dependências, capacidade) incluído no plano Premium**. *(Não reverifiquei o escopo atual — corte de maio/2026.)* Ou seja: **o nativo cresce com o upgrade de plano do cliente**, e é justamente o cliente grande, que paga mais por assento, quem tem Premium.

**Veredito 🟡 com ressalva forte:** categoria fragmentada, sem líder grátis, com notas irregulares (3.5 a 4.9) — sinais bons. Mas competir contra uma função que a Atlassian entrega de graça no plano Premium é a versão Atlassian do problema "concorrente grátis". **Precisa de verificação do nativo antes de qualquer coisa.**

---

## Categoria 6 (escolha minha, a partir das negativas) — Relatórios e dashboards 🔴

Escolhi esta porque as reclamações de time tracking e test management convergem para o mesmo lugar: **os dados existem no Jira, mas extrair relatório confiável deles é o que dói** (JQL quebrada, worklogs mal atribuídos, relatórios básicos demais).

| App | Nota | Aval. | Instalações | Selos |
|---|---|---|---|---|
| **eazyBI** | 4.7 | 226 | **11,1 mil** | CLOUD FORTIFIED + BESTSELLER |
| **Easy Reports Free** | **4.8** | 91 | **11,7 mil** | RUNS ON ATLASSIAN |
| Custom Charts for Jira | 4.5 | 139 | 8,2 mil | CLOUD FORTIFIED + BESTSELLER |
| Great Gadgets | 4.4 | 49 | 3,7 mil | CLOUD FORTIFIED + BESTSELLER |
| Easy Reports (pago) | 4.8 | 91 | 3 mil | RUNS ON ATLASSIAN |
| Dashboard Hub Pro | 4.6 | 82 | 3,2 mil | CLOUD FORTIFIED |

**Preço:** eazyBI — **US$ 10,00/mês para 10 usuários (US$ 1,00/usuário)**.

**Nativo:** o Jira tem dashboards e gadgets nativos, além de relatórios ágeis (burndown, velocity, control chart). Limitação: pouca customização e nenhuma modelagem de dados.

**Veredito 🔴:** o app mais instalado da categoria é **grátis** (Easy Reports Free, 11,7 mil instalações, nota 4.8) e tem selo Runs on Atlassian. Mesmo padrão da categoria 4.

---

## Respostas às três perguntas de plataforma

### (a) Forge vs Connect — o Forge é hospedado grátis pela Atlassian?

**Não exatamente, e isso mudou recentemente.** A Atlassian hospeda a computação e o armazenamento (não há servidor nosso para manter, nem Railway, nem Postgres), **mas desde janeiro/2026 o Forge cobra por consumo**: há franquia mensal gratuita por app e o excedente é faturado no mês seguinte. As cotas rígidas antigas foram removidas em favor desse modelo.

**Franquia gratuita mensal e preço do excedente** (fonte: documentação oficial do Forge, consultada hoje):

| Capacidade | Franquia grátis/mês | Excedente (US$) |
|---|---|---|
| Funções: duração | 200.000 GB-segundos | 0,000025 / GB-s |
| Key-Value Store: leituras | 0,1 GB | 0,055 / GB |
| **Key-Value Store: escritas** | 0,1 GB | **1,090 / GB** |
| Logs: escrita | 1 GB | 1,005 / GB |
| SQL: computação | 1 hora | 0,143 / hora |
| SQL: requisições | 100.000 | 1,929 / 1M |
| SQL: armazenamento | 730 GB-hora | 0,00076850 / GB-h |
| Object Store: requisições | 5.000 | 0,001353 / 1k |
| **Containers (computação/memória)** | **0** | 0,07177 / vCPU-h · 0,00786 / GiB-h |
| **LLM** | **0 créditos** | varia por modelo |

**Limitações relevantes para nós:**
- **Escrita em KVS é a linha cara** (US$ 1,09/GB): um app que grava muito estado por usuário sai caro. Arquitetura precisa favorecer leitura.
- **Containers e LLM têm franquia zero** — qualquer uso de container ou de IA é custo desde o primeiro minuto. Isso importa muito num negócio "IA First".
- Excedente não pago pode **suspender o app**.
- Controles de egress: chamadas externas exigem permissão declarada, e alterá-las invalida o selo Runs on Atlassian.

**Vantagem financeira do Forge — e é significativa:**

| Framework | Repasse ao desenvolvedor | Atlassian retém |
|---|---|---|
| **Forge** | **84%** | 16% |
| Connect | 80% | 20% |
| Data Center | 75% | 25% |

**Selo "Runs on Atlassian":** exclusivo de apps Forge que usam **só** computação e armazenamento da Atlassian, suportam residência de dados e permitem ao cliente controlar egress. É **automático** para apps elegíveis — não exige inscrição nem custo. É o selo de confiança barato.

**Recomendação técnica: Forge**, por repasse maior, ausência de infraestrutura própria e acesso ao selo automático — com a arquitetura desenhada para evitar escrita pesada em KVS, containers e LLM na Atlassian.

### (b) Taxa do marketplace e prazo de aprovação

- **Taxa:** a Atlassian retém **16% (Forge)** ou **20% (Connect)** da receita bruta dos apps "Paid via Atlassian".
- **Prazo de aprovação:** **10 a 15 dias úteis** (documentação oficial), variando com o volume da fila. Erros na submissão atrasam. Há verificações de segurança novas para apps e versões novas.

> **Comparação honesta com a Shopify:** a Shopify cobra **0% abaixo de US$ 1M/ano acumulado**, depois 15%. **Na nossa fase, a Shopify é mais barata que o Atlassian** — 0% contra 16%. A vantagem do Atlassian não está na taxa; está no preço por cliente e na barra de qualidade da concorrência.

### (c) Requisitos do Cloud Fortified

Fonte oficial. Exige participação em três frentes:

- **Segurança:** participar do **Marketplace Security Bug Bounty Program** e completar a aba de Privacidade e Segurança da listagem.
- **Confiabilidade:** SLOs de capacidade central com testes; processo de gestão de incidentes, com **plano documentado de restauração de serviço**, **engenheiros respondendo a incidentes de alta severidade via serviço de alerta (ex.: Opsgenie)**, ticket canônico "EcoHOT" e revisões pós-incidente.
- **Suporte:** ponto de contato de suporte e **resposta a ticket crítico/alta severidade em até 1 dia (24 h), 5 dias úteis por semana**, no fuso do parceiro.

**Leitura para o nosso caso:** Cloud Fortified é **plantão humano**, não código. Bug bounty custa dinheiro; SLO e resposta em 24 h exigem alguém de sobreaviso. É a mesma armadilha de "barreira operacional" que reprovou impostos-EUA na rodada 3 — só que aqui é **opcional**. Dá para lançar sem o selo e mirar **Runs on Atlassian**, que é automático e gratuito.

---

## O que a rodada 4 corrigiu da rodada 3

**Eu havia escrito, com base em 4 categorias, que o Atlassian "não tem líder grátis". Está errado.** Com 6 categorias examinadas:

- **Checklists:** Checklists for Jira (Free) — **31,3 mil instalações, nota 4.8, grátis**
- **Relatórios:** Easy Reports Free — **11,7 mil instalações, nota 4.8, grátis**
- E o padrão **"grátis até 10 usuários"** aparece como preço de entrada de apps pagos (Checklists Pro é grátis nessa faixa)

**Formulação corrigida:** o Atlassian **não tem líder grátis em toda categoria**, mas tem em algumas — e o filtro do critério nº 3 continua valendo lá igualzinho. O que muda de verdade frente à Shopify é a **barra de qualidade** (líderes em 3.8–4.3 sustentando 10–27 mil instalações) e o **valor por cliente**.

## O que realmente diferencia o Atlassian da Shopify

| Dimensão | Shopify | Atlassian |
|---|---|---|
| Nota dos líderes | 4,8–5,0 | **3.8–4.7** |
| Líder grátis | Regra | Existe, mas **não em toda categoria** |
| Preço em times pequenos | US$ 19–39 fixos | **US$ 0–10/mês** (grátis até 10 usuários é comum) |
| Preço em clientes grandes | US$ 39 fixos | **Escala por assento** |
| Taxa do marketplace | **0%** (até US$ 1M) | 16% (Forge) / 20% (Connect) |
| Aprovação | dias a semanas | **10–15 dias úteis** |
| Infraestrutura | nossa (Railway ~US$ 5/mês) | **da Atlassian**, com franquia + consumo |
| Clientes para US$ 15k/mês | ~790 pagantes a US$ 19 | **~150 instâncias** a ~US$ 100/mês |

**A diferença decisiva é a última linha.** Precisar de 150 clientes em vez de 790 muda o problema de aquisição por um fator de cinco — e é a primeira métrica em quatro rodadas que torna a meta de US$ 15k/mês plausível para um portfólio pequeno.

**A contrapartida:** em times pequenos o Atlassian paga **menos** que a Shopify (grátis a US$ 10/mês contra US$ 19–39), a taxa é maior na nossa fase, e a receita só aparece quando entram instâncias grandes — que têm ciclo de compra institucional, revisão de segurança e, muitas vezes, exigência de Cloud Fortified.

## Candidatos que sobreviveram à rodada 4

| Candidato | A favor | Contra |
|---|---|---|
| **Time tracking** | Líder em 4.1 com 27,2 mil instalações; **duas falhas técnicas concretas e verificáveis** (worklog `asApp` quebrando JQL; tela de admin para não-admin); sem nativo equivalente; sem líder grátis | 11+ concorrentes, consolidadores grandes |
| **Test management** | Sem nativo nenhum; incumbentes em 3.8–4.3 com 61 mil instalações somadas | Qualidade e distribuição descorrelacionadas — AIO Tests tem 4.9 e 7x menos instalações que o Xray de 4.3 |

**Nenhum dos dois está aprovado.** Ambos precisam do que ficou faltando nesta rodada: **verificação da funcionalidade nativa em fonte oficial** e **leitura sistemática das negativas** — que aqui foi por varredura manual, não por filtro.

---

# RODADA 5 — time tracking para Jira Cloud, verificação profunda

Consultada em **25/08/2026**. App 1 definido: **time tracking para Jira Cloud**. Test management vira App 2 no backlog. Forge confirmado; alvo Runs on Atlassian, não Cloud Fortified.

## ✅ A lacuna de método da rodada 4 foi fechada

Encontrei a **API pública do Marketplace** (`/rest/2/addons/{key}/reviews`), que devolve `stars` e texto por avaliação. Isso restaura o rigor das rodadas 1–3: dá para filtrar por nota em vez de varrer o fluxo à mão.

**Corpus lido: 1.174 avaliações** em 6 apps — muito acima do mínimo de 30 por app.

> ⚠️ **Ressalva sobre as notas antigas:** a Atlassian migrou de escala de 4 para 5 estrelas em **25/05/2026** e converteu as notas antigas linearmente. Por isso a distribuição do Tempo mostra 301 avaliações de "4★" e só 6 de "5★" — a maioria dos "4" é nota máxima da escala antiga. **Estrelas de períodos diferentes não são comparáveis**; ponderei o conteúdo, não só o número.

---

## (a) Cobertura nativa do Jira Cloud para tempo — fonte oficial Atlassian

### O que o Jira já faz, sem app

| Recurso | Existe? | Detalhe (fonte: support.atlassian.com) |
|---|---|---|
| Registro de tempo (worklog) | **Sim** | "Log work" no work item; editar exige permissão *Edit own work logs* / *Edit all work logs* |
| Campo de estimativa | **Sim** | *Original estimate*, *Remaining estimate*; alternativas: *Work item count*, *Story points*, método customizado |
| Unidades e formato | **Sim** | Entrada em `w/d/h/m` (ex.: `3w`, `2d 4h 30m`); admin define horas por dia, dias por semana, formato e unidade padrão |
| Painel de tempo no item | **Sim** | Barras de tempo gasto × restante no painel de detalhes |
| Permissão de apontamento | **Sim** | *Work On Work Items* por esquema de permissão |
| Relatório de tempo por espaço | **Sim** | Compara estimativa original × atual dentro do espaço |
| **Folha de ponto por pessoa (timesheet)** | **Não** | — |
| **Aprovação de horas** | **Não** | — |
| **Taxas de faturamento / custo** | **Não** | — |
| **Relatório de utilização por pessoa** | **Não** | — |

**Limite nativo relevante:** itens com **mais de 100 filhos não entram no rollup** de time tracking.

**Relatórios nativos** (lista oficial): burndown, burnup, gráfico de controle, diagrama de fluxo cumulativo, epic burndown, epic report, velocity, version report, sprint report, release burndown, deployment frequency. **São todos ágeis/de sprint.** Nenhum é por pessoa, por período ou por cliente.

### O que Premium e Enterprise acrescentam para tempo: **nada**

Preços oficiais do Jira Cloud: **Free** (até 10 usuários, US$ 0) · **Standard US$ 7,91/usuário** · **Premium US$ 14,54/usuário** · **Enterprise** (anual, sob consulta).

**A página de preços do Jira não menciona "time tracking" uma única vez.** O Premium acrescenta planejamento entre times e gestão de dependências, aprovações customizáveis, limites de automação por usuário, armazenamento ilimitado, SLA de 99,9%. O Enterprise acrescenta Atlassian Analytics e Data Lake.

> **Esta é a diferença decisiva frente à categoria de roadmaps** (rodada 4, categoria 5), onde o Advanced Roadmaps nativo vem no Premium e ameaça o app. **Em time tracking, o teto do nativo não sobe com o plano do cliente.** O cliente que paga Enterprise tem exatamente o mesmo time tracking do cliente Free. A única exceção parcial é o Data Lake do Enterprise, que permite montar relatório próprio — mas isso é ferramenta de BI, não de apontamento.

**Referência de preço:** o Jira Standard custa US$ 7,91/usuário. O Tempo custa de US$ 1 a US$ 5 por usuário. Um app de tempo custa entre **8% e 65% do preço da própria plataforma** — há espaço, mas o teto é real.

---

## (b) Negativas a fundo — 1.174 avaliações lidas, 200 negativas classificadas

| App | Avaliações lidas | Negativas (≤3★ com texto) | Distribuição |
|---|---|---|---|
| **Tempo Timesheets** | **400** | **93** | 1★:37 · 2★:13 · 3★:43 |
| **Harvest (oficial)** | **145** | **66** | 1★:66 · 2★:37 · 3★:15 |
| **Cappsule Timesheet Tracking** | **251** | **26** | 1★:21 · 2★:17 · 3★:30 |
| **Clockify** | **127** | **25** | 1★:22 · 2★:13 · 3★:16 |
| **Clockwork Pro** | **139** | **16** | 1★:10 · 2★:1 · 3★:14 |
| **Clockwork Lite** | **112** | **9** | 1★:8 · 2★:2 · 3★:7 |

### Dores classificadas por tipo e frequência

| # | Tipo de dor | Ocorrências | Distribuição por app |
|---|---|---|---|
| 1 | **Relatórios e exportação** | **36** | Tempo 17 · Harvest 8 · Cappsule 7 · Clockwork Pro 3 · Clockify 1 |
| 2 | Suporte | 31 | Tempo 12 · Harvest 11 · Cappsule 4 · Clockwork 3 · Clockify 1 |
| 3 | **Integração / JQL / fidelidade do dado** | **25** | Harvest 12 · Clockify 5 · Tempo 3 · Clockwork Pro 3 · Cappsule 2 |
| 4 | Bug / instabilidade | 24 | Tempo 11 · Clockwork Pro 4 · Harvest 4 · Cappsule 3 · Clockify 2 |
| 5 | Permissão / admin | 15 | Tempo 7 · Harvest 4 · Cappsule 2 · Clockify 1 · Clockwork Lite 1 |
| 6 | Preço / licenciamento | 13 | Tempo 6 · Cappsule 2 · Harvest 2 · demais 1 cada |
| 7 | Desempenho | 11 | Tempo 5 · Clockwork Lite 3 · Clockify 2 · Clockwork Pro 1 |
| 8 | UX | 6 | Tempo 4 · Cappsule 1 · Harvest 1 |
| 9 | Mobile | 5 | Harvest 3 · Tempo 2 |
| 10 | Aprovação / fluxo | 2 | Tempo 1 · Cappsule 1 |

**Os temas 1 e 3, somados, são a maior dor da categoria — e são o mesmo problema visto de dois ângulos.**

### As citações que sustentam a tese

**O dado não fica no Jira, fica no app:**
- **Tempo, 2★, 10/06/2026** — *"breaking any JQL queries on worklog authors, because on jira side each worklog gets loged **asApp and not asUser**, so every worklog on JQL side is done by Tempo Service. This could be easily avoided by using asUser."*
- **Harvest, 1★, 01/05/2024** — *"**Does not integrate with JIRA time tracking fields and features.**"*
- **Harvest, 1★, 29/09/2023** (ES) — *"No logea horas en el ticket de JIRA al iniciar timer desde JIRA. Tampoco logea horas... Tampoco tiene sincronización de horas logeadas de Harvest a Jira."*
- **Harvest, 1★, 20/03/2025** — *"Does not even allow you to record time against a JIRA ticket on a different date."*
- **Clockwork Pro, 3★, 03/06/2025** — *"one recurring issue for me and my team is the **delay in time logs appearing in Jira** and in the timesheet. Time may be logged but not reflected in..."*

**O relatório não dá conta:**
- **Tempo, 3★, 23/01/2025** — *"I would like to see more reporting capabilities, like the ability to **exclude some projects when filtering instead of selecting one by one** (when you have 50+ projects)."*
- **Cappsule, 1★, 29/04/2026** — *"They just ruined my day by **merging ticket number with title in the issues export**... I had to extract the list of tickets from the filter html."*
- **Clockwork Pro, 3★, 01/07/2025** — *"the **REST API documentation** could use some updates, especially around listing all available endpoints."*

**Permissão e acesso:**
- **Tempo, 1★, 23/07/2026** — *"After the latest update... I'm greeted with 'Choose which apps you would like on your Jira instance.' As a regular user, I don't manage Jira apps, so I'm **effectively locked out**."*

### Leitura

O **Harvest tem 66 negativas em 145 avaliações** e o motivo é único e consistente: as horas apontadas no Harvest **nunca chegam ao worklog do Jira**. O app é uma ponte que não atravessa. É o pior app da categoria e mostra o modo de falha extremo.

O **Tempo**, líder com 27,2 mil instalações, sofre da versão elegante do mesmo problema: as horas chegam ao Jira, mas **com a identidade errada** — gravadas como o app, não como a pessoa. O efeito prático é que `worklogAuthor = currentUser()` devolve zero, e com ele quebram JQL, automações, dashboards nativos e qualquer filtro salvo que dependa de autoria.

**Nenhum concorrente resolveu isso**, e um dos reclamantes chega a apontar a correção (`asUser`). É a dor técnica repetida entre vários concorrentes que o critério nº 5 pede.

---

## (c) Preço por assento nas quatro faixas

Valores mensais, cobrança mensal, medidos no estimador oficial de cada app em 25/08/2026.

| App | 10 usuários | 50 usuários | 250 usuários | 1.000 usuários |
|---|---|---|---|---|
| **Tempo Timesheets** (4.1) | US$ 10,00 · $1,00/u | **US$ 260,50** · $5,21/u | **US$ 1.070,00** · $4,28/u | **US$ 2.427,50** · $2,43/u |
| **Clockwork Pro** (4.6) | **Grátis** | US$ 65,00 · $1,30/u | US$ 295,00 · $1,18/u | US$ 610,00 · $0,61/u |
| **Cappsule — Standard** (4.4) | **Grátis** | US$ 42,50 · $0,85/u | US$ 193,00 · $0,77/u | US$ 530,50 · $0,53/u |
| **Cappsule — Advanced** | — | — | — | US$ 1.972,50 · $1,97/u |
| **Harvest (oficial)** (2.5) | **App grátis** | grátis | grátis | grátis — cobra no Harvest |
| **Clockify** (3.9) | **App grátis** | grátis | grátis | grátis — cobra no Clockify |

### Três leituras

1. **O líder é 3 a 4 vezes mais caro que o desafiante mais bem avaliado.** A 250 usuários, o Tempo cobra US$ 1.070 e o Clockwork Pro US$ 295 — e o Clockwork tem nota **4.6** contra 4.1. O mercado está pagando prêmio por incumbência, não por qualidade.
2. **O piso de 10 usuários é quase sempre grátis.** Clockwork Pro e Cappsule são gratuitos até 10; o Tempo cobra US$ 10. Receita real começa depois disso — o cliente pequeno não paga a conta em nenhum cenário.
3. **Harvest e Clockify são apps gratuitos no Marketplace** porque monetizam no próprio SaaS. São os dois piores avaliados da categoria (2.5 e 3.9) — a ponte é um acessório para eles, não o produto. **Não são concorrentes de receita; são concorrentes de instalação.**

### O que isso significa para a meta de US$ 15.000/mês

| Cenário de preço | Clientes de 250 usuários necessários |
|---|---|
| Preço do Tempo (US$ 1.070) | **14** |
| Preço do Clockwork Pro (US$ 295) | **51** |
| Preço da Cappsule Standard (US$ 193) | 78 |

Mesmo no cenário conservador, **51 clientes** contra os ~790 lojistas que a Shopify exigiria. Descontando os 16% do Forge, o cenário Clockwork exige ~61 clientes.

---

## 🎯 A cunha do produto, em uma frase

> **Um time tracker para Jira cujo dado É o worklog nativo do Jira — gravado como a própria pessoa, na hora — para que JQL, automações, dashboards e relatórios nativos simplesmente funcionem.**

**Por que essa cunha:** todo concorrente guarda as horas na própria base e devolve ao Jira uma sombra — ou nada (Harvest), ou com atraso (Clockwork), ou com a identidade errada (Tempo). O cliente descobre tarde, quando a primeira JQL por autor volta vazia. Um app que escreve worklog nativo com a identidade do usuário devolve **todo o ecossistema Jira de graça**: filtros salvos, automação, gadgets, exportação, API — nada disso precisa ser reimplementado por nós, e nenhum concorrente entrega.

É também a resposta às duas maiores dores medidas: **relatórios (36 ocorrências)** deixa de ser problema nosso quando o dado está no lugar certo, porque o cliente usa o relatório nativo, o eazyBI ou o que quiser; e **fidelidade do dado (25 ocorrências)** é o próprio produto.

**Vantagem de framework:** o Forge tem `asUser()`, e o repasse é 84%.

### ⚠️ O risco técnico que precisa ser verificado ANTES de escrever código

**A cunha inteira depende de o Forge conseguir criar worklog no Jira com a identidade do usuário.** Três perguntas em aberto, todas verificáveis numa dev instance em algumas horas:

1. `api.asUser()` do Forge permite **criar** worklog (`POST /rest/api/3/issue/{id}/worklog`), ou só ler?
2. O que acontece com um **timer em execução** quando o usuário fecha o navegador? Escrita `asUser` normalmente exige contexto de requisição do usuário — se o timer precisar de escrita assíncrona, ela cairia para `asApp` e reintroduziria exatamente o defeito do Tempo.
3. Escrita `asUser` invalida o selo **Runs on Atlassian**? *(A princípio não — o selo trata de egress e hospedagem, não de identidade — mas precisa ser confirmado.)*

**Se a resposta à pergunta 1 for "não", a cunha morre e o App 1 precisa ser repensado.** Este é o primeiro item da próxima sessão, antes de qualquer listagem.

---

## Escopo proposto da v1

**Faz, de ponta a ponta:**
1. **Apontar tempo a partir do item** — timer e entrada manual, incluindo data retroativa *(o Harvest perde 1★ por não permitir isso)*
2. **Gravação como worklog nativo do Jira, com a identidade do usuário** — a cunha
3. **Folha de ponto semanal da própria pessoa**, construída lendo worklog nativo
4. **Visão de equipe para o gestor**, por grupo ou projeto, somente leitura
5. **Exportação CSV com filtro de incluir/excluir projetos** *(a dor exata do Tempo 3★: "exclude some projects instead of selecting one by one when you have 50+")*
6. **Preço:** grátis até 10 usuários, como manda o padrão da categoria

**Fica de fora da v1, explicitamente:**
- Aprovação de horas e fluxo de submissão *(só 2 ocorrências nas 200 negativas — não é dor)*
- Taxas de faturamento, custo, orçamento e faturamento a cliente
- Planejamento de capacidade e alocação de recursos
- Previsão e cenários
- Integrações externas (Google Calendar, Slack, Outlook)
- App mobile *(5 ocorrências — real, mas não é a cunha)*
- Suporte a Data Center
- Cloud Fortified *(exige bug bounty pago e plantão de 24 h — ver rodada 4)*
- Rollup em hierarquias com mais de 100 filhos *(limite do próprio Jira)*

**Critério de "pronto":** numa dev instance, uma pessoa aponta 3 horas pelo app; `worklogAuthor = currentUser()` no JQL nativo retorna aquele item; o painel de tempo nativo do Jira mostra as 3 horas; e o CSV exportado exclui um projeto escolhido. Se esses quatro passos funcionarem, o produto existe.

---

## Situação nos 5 critérios

| # | Critério | Time tracking Jira |
|---|---|---|
| 1 | Dor com data recente | ⚪ Neutro — dor antiga e estável, não datada |
| 2 | Regulação com prazo | ⚪ Não se aplica |
| 3 | **Sem líder grátis com selo** | ✅ **Passa** — Harvest e Clockify são grátis mas têm 2.5 e 3.9; nenhum líder grátis bem avaliado |
| 4 | Categoria entre ~500 e ~5.000 avaliações | ✅ **Passa** — ~1.700 avaliações somadas, 70+ mil instalações |
| 5 | **Dor técnica repetida em vários concorrentes** | ✅ **Passa com folga** — fidelidade do dado aparece em 4 dos 6 apps, com citação explícita da correção |

**Três critérios aplicáveis, três aprovados.** É o primeiro candidato em cinco rodadas nessa situação — e continua condicionado à verificação do `asUser` no Forge.

---

# RODADA 4b — os oito que anunciaram na thread da Barbara

**Aberta em 01/09/2026. ⚠️ Não executada** — este bloco é o escopo, não o resultado.

## Por que existe

A pergunta da Barbara Homer — *"Is there any way to log all of my work for the week in one place?"* — juntou **dez respostas, oito delas de fornecedores indicando o próprio app**. É a lista de concorrentes mais honesta que existe: não é uma busca nossa por palavra-chave, **é quem se reconheceu no problema**.

E ela já pagou uma correção antes de começar: foi daí que saiu o Worklogs (SolDevelo), que a rodada 4 tinha deixado de fora. **Se um app fora do top 6 muda a nossa frase de posicionamento, os outros sete precisam passar pelo mesmo filtro.**

## Os oito

| # | App | Fornecedor | Estado |
|---|---|---|---|
| 1 | **Worklogs** | RVS *(ver nota de atribuição abaixo)* | ✅ verificado em 01/09 — ver rodada 4, categoria 1 |
| 2 | Report Hub | Grandia | ⬜ |
| 3 | Calendar for Jira | Teamlead | ⬜ |
| 4 | WorklogPro | — | ⬜ |
| 5 | Time Assistant | SolDevelo | ⬜ |
| 6 | TimePlanner | DevSamurai | ⬜ |
| 7 | ActivityTimeline | Reliex | ⬜ |
| 8 | JetTime | JetHeads | ⬜ |

> ⚠️ **Atribuição de fornecedor a confirmar.** A nota de entrada nomeia o app testado como **"Worklogs (SolDevelo)"** e, na lista dos oito, como **"Worklogs (RVS)"** — com a **SolDevelo** aparecendo no item 5 como fornecedora do **Time Assistant**. São duas leituras incompatíveis e **eu não tenho como decidir qual está certa daqui**. Conferir na página da Marketplace do app testado, no campo do fornecedor, **antes de a rodada 4b concluir qualquer coisa** — se forem dois apps distintos, são dois itens da lista, não um.

## O que cada um precisa responder (regra 8)

Nota, número de avaliações, instalações, selos, preço até 10 e a 50 usuários, **e a pergunta que importa**: *ele tem uma tela de lançamento da semana, ou só relatório?*

**Essa é a única coluna que decide alguma coisa agora.** Depois de 01/09 o nosso posicionamento não é mais "worklog nativo", é **digitar a semana numa tela só** — então o concorrente que importa não é quem faz time tracking, é quem faz **entrada** de tempo em grade semanal. Relatório bonito e não editável deixa o problema da Barbara de pé.

## Critério de parada, definido antes de olhar

**Se qualquer um dos oito tiver grade semanal editável com nota 4,8+ e 300+ avaliações, o critério de reprovação da regra 8 bate e aí a conversa é outra** — não cancelar o app, que já está construído, mas parar de vender a tela da semana como o que nos separa e procurar o que nos separa de verdade.

Definir isso **agora**, antes de ler as páginas, é de propósito: critério escolhido depois do dado é critério escolhido para dar o resultado que a gente queria.

## Prioridade

**Baixa, e vale dizer por quê.** O caminho crítico do projeto é o beta, não a pesquisa — `0 de 5` instâncias. A rodada 4b **não pode consumir dia de recrutamento**; ela existe para a listagem não prometer exclusividade que os oito desmentem, e a listagem só vai ao ar depois do beta.
