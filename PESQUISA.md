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
