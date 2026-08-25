# CUSTOS

Todo gasto real e previsto do portfólio. Regra 5 do CLAUDE.md: **nunca gastar sem aprovação**; preferir free tier.

- **Orçamento total:** R$ 10.000
- **Gasto real até hoje:** R$ 0,00
- **Comprometido/recorrente hoje:** R$ 0,00/mês
- **Câmbio usado nas estimativas:** R$ 5,50 / US$ 1 *(premissa — ajustar quando houver gasto real)*

---

## 1. Gastos reais

| Data | Item | US$ | R$ | Pago por | Nota |
|---|---|---|---|---|---|
| — | *(nenhum até 25/08/2026)* | 0,00 | 0,00 | — | — |

**Total real: R$ 0,00**

---

## 2. Custo zero confirmado (free tier)

| Item | Custo | Observação |
|---|---|---|
| Shopify Partner account | R$ 0 | Gratuito. Necessário para criar o app. |
| Development store | R$ 0 | Ilimitadas, gratuitas, dentro do Partner. |
| Submissão na App Store | R$ 0 | Shopify não cobra taxa de listagem. |
| GitHub (repo privado + Actions) | R$ 0 | Free tier cobre lint+test deste volume. |
| Shopify CLI / template Remix | R$ 0 | Open source. |

**Atenção — receita:** a Shopify retém **15%** da receita do app acima de US$ 1M/ano acumulado, e **0%** abaixo disso. Na fase atual: 0%. Isso não é custo de caixa, mas entra no modelo de receita.

---

## 3. Custo previsto — App 1 (`restock`)

Estimativas **não confirmadas**. Nenhuma contratação antes de aprovação explícita.

| Item | Opção | US$/mês | R$/mês | Quando vira necessário |
|---|---|---|---|---|
| **Hospedagem — DECIDIDO: Railway Hobby** | Railway | 5 | ~28 | Ao sair do túnel do CLI, antes de submeter |
| ~~Hospedagem (alt.)~~ | ~~Fly.io~~ | — | — | Descartado em 25/08/2026 |
| Banco Postgres | Neon free tier (0,5 GB) | 0 | 0 | Já na v1 |
| Banco (alt.) | Supabase free tier | 0 | 0 | idem |
| Envio de e-mail (PO ao fornecedor) | Resend free (3.000 e-mails/mês) | 0 | 0 | Feature do plano Growth |
| Monitoramento de erro | Sentry free tier | 0 | 0 | Antes de submeter |
| **Domínio `northstackapps.com` — APROVADO** | Registro anual (Amarildo compra) | ~1 (12/ano) | ~66/ano | **Bloqueante para submeter** — privacidade, suporte e domínio do remetente de e-mail |

**Estimativa de recorrente na submissão: US$ 5/mês (~R$ 28/mês) + ~R$ 66/ano de domínio.**
**Estimativa de gasto até a submissão do App 1: menos de R$ 100.**

### Por que free tier não cobre tudo
- **Hospedagem:** um plano gratuito de verdade (Render free) hiberna a instância, o que quebra webhooks da Shopify — inaceitável para app publicado. Railway Hobby resolve por US$ 5/mês.
- **Domínio:** aprovado (`northstackapps.com`). GitHub Pages seria grátis mas passa mal na revisão da Shopify e prejudica a entrega dos e-mails ao fornecedor.

### ⚠️ Nenhum destes custos deve ser contratado ainda
O escopo do App 1 está **em revisão** — ver `DECISOES.md`, seção "premissas contrariadas pelo mercado real". Contratar Railway agora é pagar por um app cujo escopo pode mudar ou ser cancelado. **A compra do domínio é segura** (serve ao portfólio inteiro, não a um app específico).

---

## 4. Custos que ainda NÃO estão modelados

Entram aqui quando o app 1 estiver publicado:
- Tráfego/anúncios da App Store (opcional; começar com 0)
- Ferramenta de suporte/help desk (começar com e-mail simples: R$ 0)
- ~~Impressora de etiqueta e leitor de código de barras~~ — **respondido em 25/08/2026:** tem leitor; **não tem impressora**. Compraria por **~R$ 300** se o app de etiquetas for escolhido. Vira custo de entrada obrigatório desse candidato, porque o diferencial dele é justamente fidelidade de impressão — não dá para validar sem imprimir
- Contabilidade/abertura de PJ para receber pagamento internacional da Shopify

---

## 5. Regra de aprovação

Qualquer linha da seção 3 vira gasto real **só depois** de:
1. Estar registrada aqui com valor,
2. Aparecer em "Precisa do humano" no `STATUS.md`,
3. Ter aprovação explícita do Amarildo.
