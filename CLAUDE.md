# Northstack Apps — portfolio-apps

## Missão
Negócio "IA First": a IA (Claude) conduz o negócio; o humano (Amarildo) só faz o que exige CPF/CNPJ, contas ou mão física.
Objetivo: portfólio de apps Shopify (e depois outros marketplaces) que gere US$ 15k/mês de receita recorrente em 12 meses (meta R$ 1M acumulado). Início: 25/08/2026. Orçamento total: R$ 10.000.

## Divisão de papéis
- **Chat (claude.ai):** estratégia, escolha de apps, preço, decisões de negócio, acompanhamento de métricas. Tem memória entre sessões.
- **Claude Code (este repo):** construir, testar, deployar, submeter à App Store, corrigir bugs, redigir listagem e docs. Não tem memória: TUDO que importa vive em arquivos deste repo.
- **Humano:** criar contas, colocar credenciais em `.env` (nunca commitadas), pagar, apertar "publicar" quando a loja exigir login, gravar/assinar o que for pedido.

## Regras de operação para o Claude Code
1. Ao iniciar qualquer sessão: ler este arquivo, depois `STATUS.md`, depois `apps/<app>/STATUS.md` do app em andamento. Trabalhar no item marcado "PRÓXIMO".
2. Ao terminar a sessão (ou a cada marco): atualizar o `STATUS.md` do app (feito / próximo / bloqueios / o que precisa do humano). Commitar com mensagem clara.
3. Pode decidir sozinho: tudo técnico (arquitetura, libs, nomes internos, UX, textos de listagem, respostas de suporte técnico).
4. Deve registrar em `STATUS.md` na seção "Precisa do humano" e parar quando: exigir gasto, criar conta, credencial, publicar, aceitar termos, ou decisão de preço/escopo que mude o produto.
5. Nunca gastar sem aprovação. Preferir free tier. Listar todo custo previsto em `CUSTOS.md`.
6. Sem segredos em commits. Usar `.env.example` documentando cada variável.
7. Escopo mínimo primeiro: a versão 1 de cada app faz UMA coisa completa. Nada de dashboard, settings ou onboarding elaborado antes do core funcionar de ponta a ponta numa dev store.
8. Antes de codar um app: escrever a listagem da App Store (`apps/<app>/LISTING.md`) — título, subtítulo, descrição, planos, 3 screenshots descritos. Se a listagem não convence, o produto não está claro.
9. Toda UI e listagem em EN como base, com i18n desde o dia 1: pt-BR, es, de, fr. (76% dos apps são só em inglês; traduzir é ganho grátis.)
10. Preço padrão: 3 planos — Free (1 caso de uso completo, sem paywall na função central), Growth ~US$ 19–29, Pro ~US$ 49–79. Trial 14 dias nos pagos. Cobrar via Shopify Billing API (obrigatório).
11. Mirar lojas de US$ 50k–5M/ano. Não construir para enterprise/Plus.
12. Usar só APIs documentadas e estáveis da Shopify. Nada de beta como dependência central.
13. Seguir os requisitos de "Built for Shopify" desde o início (App Bridge, Polaris, performance, GDPR webhooks obrigatórios, sem checkout script tags).
14. Suporte: responder tickets/reviews com rascunho em `apps/<app>/support/`; humano só envia se a plataforma exigir login.

## Stack padrão
- Template oficial: `shopify app init` (Remix/React Router + Node), Polaris, App Bridge, Prisma.
- Banco: Postgres (Neon ou Supabase, free tier) — SQLite só em dev.
- Hospedagem: Fly.io ou Railway (menor custo; anotar em `CUSTOS.md`).
- Monorepo: `apps/<slug>/` por app; `packages/shared/` para código comum (auth, billing, i18n, webhooks GDPR).
- Testes: Vitest. CI: GitHub Actions rodando lint + test em PR.
- Linguagem de commits/código/comentários: inglês. Documentação de status/decisões: português.

## Estrutura do repo
```
CLAUDE.md          este arquivo
STATUS.md          visão geral do portfólio + o que precisa do humano
CUSTOS.md          todo gasto real e previsto (R$ e US$)
DECISOES.md        decisões de negócio com data e motivo
apps/<slug>/       um app por pasta
  LISTING.md       listagem da App Store (escrever ANTES do código)
  STATUS.md        feito / próximo / bloqueios / precisa do humano
  support/         rascunhos de respostas
packages/shared/   código comum
```

## Portfólio (ordem de construção)

### App 1 — `restock` (PRIORIDADE: começar já)
**Problema:** Shopify Stocky (app oficial de estoque/compras) é desligado em 31/08/2026. Lojistas perdem: pedidos de compra, recebimento com custo médio, etiquetas de preço a partir do PO, inventário por código de barras. O Admin da Shopify absorveu só o básico. Alternativas custam US$ 100–300/mês (categoria: média US$ 193/mês, nota 4,12). O app oficial de etiquetas tem nota 2,3.
**Produto v1:** Pedidos de compra (criar, enviar por e-mail ao fornecedor, receber parcial/total com leitor de código de barras, atualizar estoque e custo médio) + impressão de etiquetas de preço/código de barras dos itens recebidos (PDF, tamanhos de etiqueta comuns: Dymo, Zebra, A4).
**Não fazer na v1:** previsão de demanda, multi-armazém avançado, manufatura/BOM.
**Diferencial:** preço flat baixo, migração em 5 minutos, importação CSV do Stocky, funciona no POS (extensão de POS para receber e etiquetar).
**Planos:** Free: até 5 POs/mês + etiquetas ilimitadas. Growth US$ 19: POs ilimitados, e-mail a fornecedor, custo médio. Pro US$ 39: multi-local, POS extension, cadastro de fornecedores com lead time/MOQ.
**Nome público sugerido:** "Restock: PO & Barcode Labels" (verificar disponibilidade na loja).
**Meta:** submeter à App Store em até 14 dias.

### App 2 — conector contábil (Shopify → QuickBooks/Xero), foco em conciliação de payouts (vendas, taxas, reembolsos, impostos) no formato que o contador aceita. Só iniciar após App 1 submetido.

### App 3 — documentos de pedido (fatura/packing slip/PDF) como alternativa ao Shopify Order Printer (mal avaliado). Rápido de construir; candidato a "app de volume".

### Backlog para avaliar depois
Shopify Bundles (2,7★ oficial), integrações Airtable/Monday/ClickUp, pós-compra por micro-segmento, outros marketplaces (WordPress, Chrome, Atlassian).

## Definição de "pronto para submeter"
- Core funciona ponta a ponta na dev store, demo em 60s.
- Billing via Shopify funcionando com os 3 planos.
- Webhooks GDPR (customers/data_request, customers/redact, shop/redact) implementados.
- i18n nas 5 línguas.
- LISTING.md final + 3 screenshots reais + ícone.
- Política de privacidade e página de suporte publicadas.
- Checklist de revisão da Shopify conferido item a item.

## Primeira tarefa (sessão 1 do Claude Code)
1. Criar `STATUS.md`, `CUSTOS.md`, `DECISOES.md` e a estrutura de pastas.
2. Escrever `apps/restock/LISTING.md`.
3. Rodar `shopify app init` em `apps/restock` e conectar à organização Northstack Apps (pedir login ao humano quando o CLI exigir).
4. Registrar em `STATUS.md` o que precisa do humano e parar.
