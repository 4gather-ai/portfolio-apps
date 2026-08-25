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

## Decisões em aberto (precisam do humano)

| Tema | Pergunta | Bloqueia |
|---|---|---|
| Hospedagem | Fly.io ou Railway? Ambos ~US$ 5/mês | Deploy, não o desenvolvimento |
| Domínio | Comprar domínio próprio (~R$ 66/ano) ou usar GitHub Pages grátis? | Submissão |
| Nome | `Restock` está disponível na App Store? | Registro do app |
| Hardware | Já tem impressora de etiqueta / leitor de código de barras para teste real? | Validação física da v1 |
