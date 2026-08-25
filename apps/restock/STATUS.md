# STATUS — Restock: PO & Barcode Labels

**Última atualização:** 2026-08-25 (sessão 1)
**Meta:** submeter à Shopify App Store até **2026-09-08** (14 dias)
**Fase:** pré-código — listagem escrita, scaffold bloqueado por login

---

## Feito

- [x] `LISTING.md` escrita: nome, tagline, intro, descrição, 4 features, 3 planos, 3+1 screenshots descritos, ícone, keywords, nomes alternativos
- [x] Escopo da v1 fechado e registrado em `DECISOES.md`
- [x] Preço fechado: Free (5 POs/mês, etiquetas ilimitadas) / Growth US$ 19 / Pro US$ 39
- [x] `.env.example` com as variáveis previstas e escopos mínimos de API
- [x] Estrutura de pastas (`support/`)
- [x] Toolchain verificado: Node **v24.19.0** e npm **11.17.0** instalados em `C:\Program Files\nodejs`

---

## PRÓXIMO

**Rodar `shopify app init` e conectar à organização Northstack Apps.**
Bloqueado — ver "Precisa do humano" item 1. Assim que houver login, o comando é:

```bash
cd "C:\Pessoal\Projeto\PortfolioApps\portfolio-apps\apps" && "C:\Program Files\nodejs\npx.cmd" @shopify/cli@latest app init --name restock --template reactRouter --package-manager npm --path .
```

O CLI abre o navegador para login na primeira execução e pergunta a organização.

### Fila depois do scaffold (ordem de execução)

1. Modelo de dados no Prisma: `Supplier`, `PurchaseOrder`, `PurchaseOrderLine`, `Receipt`, `ReceiptLine`, `CostHistory`
2. Tela de PO: criar, editar linhas, salvar rascunho
3. Recebimento: parcial/total, campo de scan, atualização de `inventoryLevel` via GraphQL Admin API
4. Cálculo de custo médio ponderado no recebimento
5. Geração de etiquetas em PDF: Dymo 30252/30336, Zebra 2x1, A4 30-up
6. Envio do PO por e-mail (Resend) com PDF anexo
7. Importador de CSV do Stocky
8. Shopify Billing API: 3 planos + trial de 14 dias
9. Webhooks GDPR (3 obrigatórios)
10. i18n: EN, pt-BR, ES, DE, FR
11. Screenshots reais + ícone
12. Checklist de revisão da Shopify, item a item

---

## Bloqueios

| # | Bloqueio | Impacto | Quem resolve |
|---|---|---|---|
| 1 | Sem sessão autenticada do Shopify CLI e sem organização no Dev Dashboard | **Bloqueia todo o código.** `shopify app init` exige `--organization-id` ou login interativo | Humano |
| 2 | Node existe mas não está no `PATH` do sistema | Contornável (uso o caminho completo), mas atrapalha | Humano (opcional) |
| 3 | Nome `Restock` não verificado na App Store | Só bloqueia o registro do app, não o código | Humano ou Claude com acesso |

---

## Precisa do humano

### 1. Criar/confirmar a organização e fazer login no Shopify CLI — **BLOQUEANTE, hoje**

Passos:
1. Criar conta em https://partners.shopify.com (ou https://dev.shopify.com/dashboard) com a organização **Northstack Apps**. Gratuito.
2. Criar uma **development store** dentro da organização (gratuita) — é onde o app roda em teste.
3. Abrir um terminal nesta pasta e rodar:

```bash
"C:\Program Files\nodejs\npx.cmd" @shopify/cli@latest auth login
```

4. Fazer o login no navegador que abrir.
5. Me avisar. Daí eu rodo o `app init` e sigo sozinho.

**Alternativa mais rápida:** me passar o `organization-id` (está na URL do dashboard: `https://dev.shopify.com/dashboard/<organization-id>`) **depois** de ter feito o login acima. Com a sessão ativa + o ID, eu rodo tudo sem você.

### 2. Decisões pendentes (não bloqueiam hoje, bloqueiam a submissão)

| Decisão | Opções | Quando trava |
|---|---|---|
| Hospedagem | Fly.io ~US$ 5/mês ou Railway ~US$ 5/mês | Antes do deploy |
| Domínio próprio | Comprar (~R$ 66/ano) ou GitHub Pages grátis | Antes da submissão — privacidade + suporte + remetente de e-mail |
| Hardware de teste | Você tem impressora de etiqueta e/ou leitor de código de barras? | Validação física da v1 |

### 3. Colocar Node no PATH (opcional, 1 minuto)

Sem isso eu funciono, só com caminho completo. Se quiser resolver: Painel de Controle → Variáveis de ambiente → `Path` → adicionar `C:\Program Files\nodejs`.

---

## Riscos anotados

- **Janela de mercado:** o Stocky morre em **31/08/2026**, daqui a 6 dias. A busca por "stocky alternative" está no pico agora. Cada dia parado no bloqueio #1 é aquisição orgânica perdida.
- **Prazo de revisão da Shopify:** a fila de revisão costuma levar de dias a semanas e não está sob nosso controle. A meta de 14 dias é até a **submissão**, não até a publicação.
- **Claims da listagem:** "US$ 100–300/mês" e "5 minutes" ainda são estimativas da conversa de estratégia. Precisam de verificação antes de ir ao ar (registrado em `LISTING.md` seção 11).
