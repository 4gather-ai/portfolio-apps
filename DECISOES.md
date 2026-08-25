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

## Decisões em aberto (precisam do humano)

| Tema | Pergunta | Bloqueia |
|---|---|---|
| **Próximo app** | Candidato 2 (etiquetas) com escopo estreito, nova rodada de candidatos, ou outra direção? | **Todo o trabalho** |
| Hardware | Terceira vez que o campo vem como placeholder (`[sua resposta]`). Tem impressora de etiqueta (Dymo/Zebra/Brother) e leitor de código de barras? | Só o candidato 2 — mas é decisivo lá |
| Domínio | `northstackapps.com` já foi comprado? | Submissão, quando houver app |
