# STATUS — Northstack Apps

**Última atualização:** 2026-08-25 (sessão 1 do Claude Code)
**Dia do projeto:** 1 de 365 · Início 25/08/2026
**Meta 12 meses:** US$ 15.000/mês recorrente · R$ 1M acumulado
**Orçamento:** R$ 10.000 · **gasto até agora: R$ 0,00**

---

## 🔴 PRECISA DO HUMANO — bloqueando tudo

**Criar a organização Northstack Apps e autenticar o Shopify CLI.**
Sem isso não existe app, não existe código, não existe dev store. É o único bloqueio real hoje.

1. Criar conta gratuita em https://partners.shopify.com (organização: **Northstack Apps**)
2. Criar uma **development store** dentro dela (gratuita)
3. Rodar no terminal:

```bash
"C:\Program Files\nodejs\npx.cmd" @shopify/cli@latest auth login
```

4. Fazer login no navegador que abrir e me avisar

Detalhe completo e alternativas em [apps/restock/STATUS.md](apps/restock/STATUS.md).

**Decisões pendentes** (não travam hoje, travam a submissão): hospedagem (Fly.io vs Railway, ~US$ 5/mês), domínio próprio (~R$ 66/ano) e se você já tem impressora de etiqueta / leitor de código de barras para teste. Ver [DECISOES.md](DECISOES.md).

---

## Portfólio

| # | App | Fase | Próximo marco | Meta |
|---|---|---|---|---|
| 1 | **`restock`** — PO & Barcode Labels | Listagem escrita, scaffold bloqueado | `shopify app init` | Submeter até **08/09/2026** |
| 2 | Conector contábil (QuickBooks/Xero) | Não iniciado | — | Só após App 1 submetido |
| 3 | Documentos de pedido (fatura/packing slip) | Não iniciado | — | Após App 2 |

**Receita recorrente hoje: US$ 0/mês.** Apps publicados: 0. Instalações: 0.

---

## Feito na sessão 1

- [x] Estrutura do repo criada: `apps/restock/`, `apps/restock/support/`, `packages/shared/`
- [x] `STATUS.md`, `CUSTOS.md`, `DECISOES.md` escritos
- [x] `.gitignore` cobrindo `.env`, `node_modules`, banco de dev e artefatos do Shopify CLI
- [x] **`apps/restock/LISTING.md`** — listagem completa da App Store (regra 8: escrita antes do código)
- [x] `apps/restock/.env.example` com escopos mínimos de API documentados
- [x] Ambiente verificado: Node v24.19.0, npm 11.17.0, git 2.39.1 — todos presentes
- [x] Corrigido o aviso de *dubious ownership* do git nesta pasta

## Não feito, e por quê

- [ ] **`shopify app init`** — exige `--organization-id` ou login interativo no navegador. Regra 4 do CLAUDE.md manda parar em criação de conta/credencial. É o bloqueio acima.

---

## Onde está o risco

| Risco | Situação | O que fazer |
|---|---|---|
| **Janela do Stocky fechando** | O Stocky é desligado em **31/08/2026 — daqui a 6 dias**. A busca por "stocky alternative" está no pico agora e esfria em ~6 meses | Destravar o login hoje ou amanhã |
| Fila de revisão da Shopify | Fora do nosso controle, leva de dias a semanas | A meta de 14 dias é até **submeter**, não até publicar |
| Claims não verificados na listagem | "US$ 100–300/mês", "nota média 4,12", "5 minutes" vieram da conversa de estratégia, sem fonte conferida | Verificar antes de publicar — anotado em `LISTING.md` §11 |
| Escopo inflando | O plano Pro já carrega multi-local + POS extension | Se o prazo apertar, Pro sai da v1 e vira v1.1. Free + Growth bastam para submeter |

---

## Como retomar (leia nesta ordem)

1. [CLAUDE.md](CLAUDE.md) — missão e regras de operação
2. **este arquivo** — onde o portfólio está
3. [apps/restock/STATUS.md](apps/restock/STATUS.md) — o item marcado **PRÓXIMO**
4. [DECISOES.md](DECISOES.md) e [CUSTOS.md](CUSTOS.md) quando a dúvida for de negócio ou de gasto
