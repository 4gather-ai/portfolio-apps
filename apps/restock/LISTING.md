# Restock — Shopify App Store Listing (v1 draft)

> Regra 8 do CLAUDE.md: esta listagem é escrita ANTES do código. Se ela não convence, o produto não está claro.
> Idioma base: EN. Traduções (pt-BR, es, de, fr) ficam em `locales/` quando o app existir.
> Status: **rascunho v1** — revisar com screenshots reais antes da submissão.

---

## 1. Identidade

| Campo | Valor | Limite Shopify |
|---|---|---|
| App name | `Restock: PO & Barcode Labels` | 30 chars (uso: 28) |
| Handle sugerido | `restock-po-barcode-labels` | — |
| Categoria primária | Inventory management → Purchase orders | — |
| Categoria secundária | Store management → Barcode & labels | — |
| Idiomas | EN, pt-BR, ES, DE, FR | — |

**Verificar antes de registrar:** disponibilidade do nome `Restock` na App Store e do handle. Alternativas na seção 9.

---

## 2. Tagline (subtítulo — 62 chars)

> `Purchase orders, receiving & price labels. Stocky replacement.`

(61 chars)

Alternativas:
- `Create POs, receive stock, print barcode labels in minutes.` (58)
- `The simple Stocky alternative for POs and barcode labels.` (56)

---

## 3. App introduction (100 chars)

> `Replace Stocky in 5 minutes. Purchase orders, receiving with true cost, and barcode labels.`

(90 chars)

---

## 4. App details (500 chars)

> Stocky is gone — but your purchasing workflow does not have to go with it. Restock brings back what you actually used: create purchase orders, email them to suppliers, receive full or partial shipments with a barcode scanner, and keep your average cost accurate. Then print price and barcode labels for everything you just received — Dymo, Zebra or A4 sheets, straight to PDF. Import your Stocky CSV and you are running today. No per-order fees, no enterprise pricing, no setup call.

(475 chars)

---

## 5. Feature list (até 4, ~80 chars cada)

1. `Create and email purchase orders to suppliers — PDF attached, no copy-paste.`
2. `Receive full or partial shipments by barcode scanner; stock and cost update.`
3. `Print price + barcode labels for received items: Dymo, Zebra, A4 sheet PDF.`
4. `Import your Stocky CSV: suppliers, costs and open POs move over in minutes.`

---

## 6. Descrição longa (página do app)

### Stocky shut down. Your purchase orders did not have to go with it.

On **August 31, 2026**, Shopify retired Stocky. The Shopify admin absorbed the basics of inventory, but not the part that ran your buying: purchase orders, receiving against a PO, average cost on receipt, and printing labels for what just arrived.

Every other option wants **$100–$300 a month** and a demo call. Restock does the job for a flat, low price and gets out of the way.

### What Restock does

**Purchase orders that suppliers actually receive**
Build a PO from your low-stock items or from scratch. Set unit cost, quantities, expected date and notes. Send it to your supplier as a clean PDF by email in one click — no exporting, no pasting into Gmail.

**Receiving that keeps your numbers honest**
Shipment arrives short? Receive partially and the PO stays open for the rest. Scan barcodes with any USB or Bluetooth scanner — or type quantities if you prefer. Inventory updates in Shopify and your **average cost** is recalculated from what you actually paid, including when the same SKU arrives at different prices.

**Labels for what you just received**
Straight from the receiving screen: select items, pick a label size, get a print-ready PDF. Product title, price, SKU and a scannable barcode. **Dymo 30252/30336, Zebra 2x1, and A4 sheets (Avery-compatible)** supported out of the box. Labels are unlimited on every plan, including Free.

**Migration in five minutes**
Export from Stocky, drop the CSV into Restock. Suppliers, costs and open purchase orders come across. If a row does not map, we tell you which row and why — no silent data loss.

**Works where you work**
Built with Shopify's own design system, inside your admin. Multi-location on Pro. POS extension for receiving and labeling on the shop floor on Pro.

### Who this is for

Stores doing **$50k–$5M a year** that buy stock from suppliers and need the paper trail: retail, apparel, hardware, specialty food, hobby and game shops. If you have a stockroom and a printer, this is for you.

### Who this is NOT for

No demand forecasting, no manufacturing/BOM, no 12-warehouse allocation logic. If you need that, buy the $200/month tool. If you need purchase orders and labels that work, start free.

### Support

Real answers from the people who built it, in English or Portuguese. Docs, plus a migration checklist for Stocky refugees.

---

## 7. Planos (Shopify Billing API — obrigatório)

| | **Free** | **Growth — $19/mo** | **Pro — $39/mo** |
|---|---|---|---|
| Purchase orders | 5 / month | Unlimited | Unlimited |
| Barcode & price labels | **Unlimited** | Unlimited | Unlimited |
| Receiving (full & partial) | sim | sim | sim |
| Barcode scanner receiving | sim | sim | sim |
| Stocky CSV import | sim | sim | sim |
| Email PO to supplier | — | sim | sim |
| Average cost on receipt | — | sim | sim |
| Supplier records (lead time, MOQ) | — | — | sim |
| Multi-location | — | — | sim |
| POS extension | — | — | sim |
| Trial | — | 14 dias | 14 dias |

**Texto de plano na loja:**
- Free — `Up to 5 purchase orders per month. Unlimited barcode labels. Full receiving.`
- Growth — `Unlimited POs, email to suppliers, average cost tracking. 14-day free trial.`
- Pro — `Everything in Growth plus multi-location, POS receiving and supplier records.`

**Racional (interno):** a função central — receber estoque e imprimir etiquetas — nunca fica atrás de paywall (regra 10). O limite do Free é volume de POs, não capacidade. Quem faz 6+ POs/mês tem operação de compra real e paga US$ 19 sem pensar. Média da categoria: US$ 193/mês.

---

## 8. Screenshots (3 obrigatórios, 1600x900)

**Screenshot 1 — "Purchase order, ready to send"**
Tela de PO aberta no admin. Cabeçalho com fornecedor "Nordic Supply Co.", PO #1042, expected Sep 12. Tabela com 6 linhas de produto reais (título, SKU, qty ordered, unit cost, total). Rodapé com subtotal US$ 4.180,00. Botão primário Polaris **"Email to supplier"** em destaque. Legenda sobreposta: *"Build it, send it. Supplier gets a clean PDF."*

**Screenshot 2 — "Receiving with a scanner"**
Tela de recebimento em progresso. Campo de scan no topo com foco visível e placeholder "Scan barcode…". Linhas com badge de status: 3 itens `Received` (verde), 1 `Partial 8/20` (amarelo), 2 `Pending`. Painel lateral mostrando **"Average cost updated: $12.40 → $12.86"**. Legenda: *"Partial shipments and true average cost, handled."*

**Screenshot 3 — "Labels, printed"**
Split: à esquerda o seletor de etiqueta (Dymo 30252 selecionado, opções Zebra 2x1 e A4 30-up visíveis, quantidade por item); à direita o preview do PDF com uma grade de etiquetas mostrando nome do produto, $24.90 e código de barras nítido. Legenda: *"From receiving to printed labels in two clicks."*

**Screenshot 4 (opcional) — "Stocky import"**
Tela de importação com CSV carregado, resumo verde `142 suppliers · 38 open POs · 1.204 cost records` e aviso âmbar `3 rows need attention`. Legenda: *"Bring Stocky with you."*

**Ícone:** 1200x1200. Caixa de papelão vista de cima com um código de barras formando a fita de fechamento. Fundo sólido escuro-esverdeado, sem texto. Precisa ser legível a 48px.

---

## 9. Nomes alternativos (se `Restock` estiver ocupado)

1. `Restocked: PO & Barcode Labels`
2. `POs & Labels by Northstack`
3. `Stockroom: PO & Barcode Labels`
4. `Reorder: PO & Barcode Labels`

---

## 10. Keywords / SEO

Primárias: `stocky alternative`, `purchase orders`, `barcode labels`, `price tags`, `receive inventory`
Secundárias: `stocky replacement`, `po management`, `average cost`, `dymo labels`, `zebra labels`, `inventory receiving`, `supplier orders`, `barcode scanner`

**Nota de posicionamento:** "Stocky alternative" é o termo de maior intenção de compra pelos próximos ~6 meses. Usar no tagline, na intro e no primeiro parágrafo — mas nunca no nome do app (risco de marca).

---

## 11. Pendências antes de publicar

- [ ] Confirmar disponibilidade do nome e do handle na App Store
- [ ] Screenshots reais na dev store (substituem as descrições da seção 8)
- [ ] Ícone 1200x1200
- [ ] URL da política de privacidade
- [ ] URL da página de suporte + e-mail de suporte
- [ ] Traduções: pt-BR, ES, DE, FR
- [ ] Conferir limites de caracteres na tela real de submissão (podem mudar)
- [ ] Revisar claims antes de publicar: "5 minutes" e "$100–$300/month" só ficam se forem verificáveis. O intervalo de preço precisa de fonte; hoje é estimativa da conversa de estratégia, não dado conferido.
