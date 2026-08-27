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
8. **Verificar o mercado real ANTES de escrever a listagem.** Para cada candidato, registrar em `PESQUISA.md`: os 5 concorrentes mais próximos com preço, nota e nº de avaliações; o que a Shopify já faz nativamente; as reclamações das avaliações 1–3★ dos líderes; e o veredito.
   **Critérios de reprovação — se qualquer um bater, o app não começa:**
   - um concorrente **grátis** cobre a v1 inteira;
   - existe líder com **4,8★+ e 300+ avaliações** no mesmo escopo;
   - a categoria somada tem menos de ~500 avaliações (não há demanda) ou mais de ~5.000 (guerra de marketing).

   **"App oficial da Shopify mal avaliado" NÃO é sinal de oportunidade.** É sinal de que a categoria é velha o bastante para já estar servida por terceiros — foi justamente o app oficial ruim que empurrou a demanda para eles anos atrás. Verificado em 25/08/2026 nos três casos (Order Printer 3,6★, Retail Barcode Labels 2,3★, Shopify Bundles 2,8★): nos três o mercado terceiro já resolveu, quase sempre de graça. Ver `PESQUISA.md`.

   Só depois de passar nesse filtro, escrever a listagem da App Store (`apps/<app>/LISTING.md`) — título, subtítulo, descrição, planos, 3 screenshots descritos. Se a listagem não convence, o produto não está claro.
9. Toda UI e listagem em EN como base, com i18n desde o dia 1: pt-BR, es, de, fr. (76% dos apps são só em inglês; traduzir é ganho grátis.)
10. **Preço: seguir o modelo nativo de cada marketplace.** Sempre **3 níveis**, e o **núcleo do produto nunca fica atrás de paywall** — o que separa os níveis é volume, escala ou função periférica, nunca a coisa central que o app faz. A *forma* do preço é a da plataforma, não a nossa:
    - **Shopify:** planos de valor fixo (Free / ~US$ 19–29 / ~US$ 49–79), trial de 14 dias, cobrança obrigatória via Shopify Billing API.
    - **Atlassian:** preço **por assento com faixas**, grátis até 10 usuários (padrão da categoria), 3 *editions*, trial de 30 dias, cobrança via "Paid via Atlassian".
    - **Outros marketplaces:** identificar o modelo nativo **antes** de escrever a listagem e registrar em `DECISOES.md`.

    Copiar o modelo de um marketplace para outro produz preço que ninguém entende e que a plataforma às vezes nem suporta.
11. Mirar lojas de US$ 50k–5M/ano. Não construir para enterprise/Plus.
12. Usar só APIs documentadas e estáveis da Shopify. Nada de beta como dependência central.
13. Seguir os requisitos de "Built for Shopify" desde o início (App Bridge, Polaris, performance, GDPR webhooks obrigatórios, sem checkout script tags).
14. Suporte: responder tickets/reviews com rascunho em `apps/<app>/support/`; humano só envia se a plataforma exigir login.
15. **Ao final de cada sessão e a cada marco: `git add -A`, commit com mensagem descritiva e `git push origin main`.** Sem push, o chat estratégico não enxerga o trabalho — commit local não conta como entregue. Antes do push, conferir que nenhum segredo entrou (`.env` fica no `.gitignore`; só `.env.example` é commitado).
16. **Beta privado obrigatório antes de listar.** Nenhum app vai para a listagem pública sem passar por **5 a 10 instâncias reais durante 2 a 3 semanas**. O beta serve para achar o que dev store nenhuma mostra: dados sujos, escala real, permissões estranhas, fusos, e o que o usuário faz que não previmos. Registrar em `apps/<app>/BETA.md`: quem participa, o que quebrou, o que mudou por causa disso. **Se menos de 5 instâncias reais usarem de verdade, o beta não terminou** — prazo não substitui uso.
17. **Todo marco termina com o app aberto no navegador, não só com os testes verdes.** Rodar o caminho principal na instância real e olhar a tela. **Motivo, com evidência própria:** em 26/08/2026, no primeiro dia com Chrome disponível, **três defeitos apareceram que 231 testes automatizados e o `forge lint` não pegavam** — a aba que continuava mostrando "Running" para um timer encerrado, o relógio que só andava 20 s depois do clique, e o campo de formulário que deixava só a última letra do que se digitava. Os três têm a mesma assinatura: **a nossa lógica estava certa e a plataforma se comporta diferente.** Teste automatizado cobre o que escrevemos; só o navegador cobre onde o código roda. Isso não substitui a regra 16 — reforça: se uma pessoa com duas abas acha três defeitos em uma tarde, dev store não é evidência de que o app funciona.

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
PESQUISA.md        verificação de mercado por candidato (regra 8) — vem ANTES da listagem
CUSTOS.md          todo gasto real e previsto (R$ e US$)
DECISOES.md        decisões de negócio com data e motivo
apps/<slug>/       um app por pasta
  LISTING.md       listagem da App Store (escrever ANTES do código)
  STATUS.md        feito / próximo / bloqueios / precisa do humano
  support/         rascunhos de respostas
packages/shared/   código comum
```

## Portfólio (ordem de construção)

> **Estado em 26/08/2026:** o App 1 (`restock`) foi **CANCELADO**. Depois de cinco rodadas de verificação, o app escolhido é o **`Nativelog`** (time tracking para Jira Cloud, `apps/jira-time/`) — primeiro produto fora da Shopify. Tudo abaixo é registro histórico dos candidatos reprovados; o raciocínio completo está em `PESQUISA.md`.

### ~~App 1 — `restock`~~ — CANCELADO em 25/08/2026

**Motivo do cancelamento:** as três premissas abaixo foram verificadas na App Store e nenhuma se sustenta. **Stockroom ‑ Purchase Orders** entrega POs ilimitados, e-mail ao fornecedor, recebimento parcial, etiquetas e importação do Stocky — **de graça**, 5,0★. **EasyScan** cobra US$ 9,99/mês com 5,0★ e 338 avaliações e já se anuncia como "o substituto completo do Stocky". E o admin da Shopify passou a cobrir pedidos de compra nativamente. Detalhe em `DECISOES.md`.

#### Texto original (histórico)
**Problema:** Shopify Stocky (app oficial de estoque/compras) é desligado em 31/08/2026. Lojistas perdem: pedidos de compra, recebimento com custo médio, etiquetas de preço a partir do PO, inventário por código de barras. O Admin da Shopify absorveu só o básico. Alternativas custam US$ 100–300/mês (categoria: média US$ 193/mês, nota 4,12). O app oficial de etiquetas tem nota 2,3.
**Produto v1:** Pedidos de compra (criar, enviar por e-mail ao fornecedor, receber parcial/total com leitor de código de barras, atualizar estoque e custo médio) + impressão de etiquetas de preço/código de barras dos itens recebidos (PDF, tamanhos de etiqueta comuns: Dymo, Zebra, A4).
**Não fazer na v1:** previsão de demanda, multi-armazém avançado, manufatura/BOM.
**Diferencial:** preço flat baixo, migração em 5 minutos, importação CSV do Stocky, funciona no POS (extensão de POS para receber e etiquetar).
**Planos:** Free: até 5 POs/mês + etiquetas ilimitadas. Growth US$ 19: POs ilimitados, e-mail a fornecedor, custo médio. Pro US$ 39: multi-local, POS extension, cadastro de fornecedores com lead time/MOQ.
**Nome público sugerido:** "Restock: PO & Barcode Labels" (verificar disponibilidade na loja).
**Meta:** submeter à App Store em até 14 dias.

### App 2 — conector contábil (Shopify → QuickBooks/Xero)
Conciliação de payouts (vendas, taxas, reembolsos, impostos) no formato que o contador aceita. **Premissa abalada, não verificado:** o MyWorks já entrega sync com QuickBooks junto com o Stockroom, que é grátis. Passar pela regra 8 antes de qualquer coisa.

### ~~App 3 — documentos de pedido~~ — REPROVADO na verificação de 25/08/2026
Quatro apps com 250–700 avaliações entre 4,7★ e 5,0★, vários inteiramente grátis e Built for Shopify. O líder tem 10 avaliações negativas em 692. Ver `PESQUISA.md`.

### Candidatos verificados em 25/08/2026 (ver `PESQUISA.md`)
| Candidato | Veredito |
|---|---|
| Documentos de pedido vs Order Printer | 🔴 Reprovado |
| **Etiquetas de código de barras vs Retail Barcode Labels** | 🟡 **Único com espaço** — estreito, exige teste com impressora física |
| Sync Airtable/Notion/ClickUp | 🔴 Reprovado — sem demanda (3 apps de ClickUp, zero avaliações somadas) |
| Bundles vs Shopify Bundles | 🔴 Reprovado — 8 apps com 1.000–5.300 avaliações a 4,9–5,0★ |

### Backlog para avaliar depois
Pós-compra por micro-segmento, outros marketplaces (WordPress, Chrome, Atlassian). Aplicar a regra 8 antes de escrever qualquer listagem.

### O que procurar (v2 — corrigido pela rodada 2 de pesquisa, 25/08/2026)
1. Dor com **data recente** — útil como sinal de demanda, mas **dor pública com data é dor disputada**. Ver critério 2.
2. **Regulação com prazo serve como sinal de demanda, NUNCA como vantagem competitiva.** Um prazo legal é informação pública: todo desenvolvedor lê a mesma diretiva na mesma data. Oportunidade regulatória é a **mais** contestada, não a menos, e o preço converge a zero porque conformidade é obrigação, não benefício. Só entrar se houver barreira além do conhecimento da lei — dado proprietário, integração difícil, certificação ou relação com o canal.
   *Evidência: botão de desistência da UE (prazo 19/06/2026) tinha **17 apps** e ~3.374 avaliações dois meses depois, quase todos grátis. O EmpCo (prazo 27/09/2026) já tem **7 apps** posicionados um mês ANTES do prazo.*
3. Categoria **sem líder grátis com selo Built for Shopify**.
4. Soma de avaliações da categoria entre ~500 e ~5.000.
5. **Reclamação técnica repetida nos 1–3★ de vários concorrentes ao mesmo tempo** — dor que ninguém resolveu costuma ser cara de resolver, e essa é a barreira que nos protege depois.

**Os critérios 3 e 5 são os que apontam vantagem real. O filtro principal é dificuldade técnica, não calendário.**

**Conformidade legal:** se algum dia entrarmos em produto regulatório, o escopo da lei tem que ser confirmado em **fonte primária ou com advogado antes da listagem** — nunca a partir do texto de marketing dos concorrentes.

## Definição de "pronto para submeter"
- Core funciona ponta a ponta na dev store, demo em 60s.
- Billing via Shopify funcionando com os 3 planos.
- Webhooks GDPR (customers/data_request, customers/redact, shop/redact) implementados.
- i18n nas 5 línguas.
- LISTING.md final + 3 screenshots reais + ícone.
- Política de privacidade e página de suporte publicadas.
- Checklist de revisão da Shopify conferido item a item.

## Estado atual (atualizado em 27/08/2026)

**App em construção: `Nativelog`** — apontamento de horas para Jira Cloud, em `apps/jira-time/`. Regra 8 cumprida na rodada 5 do `PESQUISA.md`, plano aprovado. **D1 a D7 de 14 concluídos; o próximo é o D8.** Deploy 2.13.0 na `northstack-dev`, 292 testes.

**A cunha está provada no produto, não só no spike:** em 26/08/2026 o Amarildo apontou tempo pelo app e o worklog nasceu com o nome dele na aba Work log do Jira.

Ler nesta ordem: `STATUS.md` → `apps/jira-time/STATUS.md` (estado do app, arquitetura e regras que não se quebra) → `apps/jira-time/PLANO-V1.md` (marcos por dia).

**O risco aberto não é técnico, é o beta (regra 16):** achar 5–10 instâncias reais. O kit está pronto desde 27/08 — páginas em `site/` (privacidade, suporte, guia de instalação) e os anúncios em `apps/jira-time/BETA-ANUNCIO.md`. **Falta o humano publicar o site no Cloudflare Pages e criar `support@northstackapps.com`.**

~~**Bloqueio: escolher o próximo app.**~~ Resolvido em 26/08/2026. O histórico dos candidatos reprovados fica em `PESQUISA.md`.

### Ambiente já resolvido (não repetir investigação)
- Node **v24.19.0** e npm **11.17.0** em `C:\Program Files\nodejs` — **fora do PATH**, usar caminho completo
- Shopify CLI autenticado. Organização **Northstack Apps**, org ID **232549161**. Dev store: **northstack-dev**
- `shopify app init` exige `--organization-id` **e** `--flavor` em terminal não interativo; `--template` aceita `reactRouter` (não mais `remix`); recusa diretório não vazio
- `shopify organization list` devolve o org ID — não é preciso pedir ao humano
- Hospedagem decidida: **Railway** — **não se aplica ao Nativelog**, que roda em Forge e é hospedado pela Atlassian
- Domínio **northstackapps.com** registrado no **Cloudflare** (26/08/2026)
- Forge: usar **`@forge/kvs`**, não o `storage` do `@forge/api` — deprecado, o `forge lint` reprova
- `forge deploy`/`forge install` funcionam sem TTY com `--non-interactive`; o `install` precisa de `--site` e `--product`
- **UI Kit 2: campo de formulário controlado engole o que a pessoa digita.** `value` + `setState` por tecla faz sobrar **só a última letra** — o componente é desenhado pelo Jira do outro lado de uma ponte assíncrona, e o `value` do re-render volta depois da tecla seguinte. Usar **`useForm` do `@forge/react`** (campos não-controlados). Não aparece em teste nem no `forge lint`; só no navegador
- **Chrome/browser chegou ao Claude Code em 26/08/2026.** Antes disso o navegador não estava disponível e marcos ficaram dependendo do humano para conferir. Ver a **regra 17**
- **Editor da Atlassian Community recusa `×` e HTML de colagem**, e sinal de comparação em prosa sai errado. Texto para lá vai em **ASCII puro**, com a comparação escrita por extenso e o sinal só dentro da linha de JQL — nunca no começo da linha
- **`/rest/api/3/search/jql`** é o endpoint de busca atual (o `/rest/api/3/search` saiu). Confirmado funcionando na `northstack-dev` em 27/08
- Site estático em `site/`, publicado pelo **Cloudflare Pages**: build vazio, output `site` — ver `site/README.md`
