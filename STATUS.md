# STATUS — Northstack Apps

**Última atualização:** 2026-08-25 (sessão 3) · Dia 1 de 365 · **Gasto: R$ 0,00**
**Meta 12 meses:** US$ 15.000/mês recorrente · R$ 1M acumulado · Orçamento R$ 10.000

---

## 🔴 ÚNICO BLOQUEIO — escolher o próximo app

Verifiquei os quatro candidatos na App Store. **Nenhum passa a nova regra 8 com folga.** Um único tem espaço, e é estreito. Evidência completa em [PESQUISA.md](PESQUISA.md).

| # | Candidato | Concorrente mais forte | Veredito |
|---|---|---|---|
| 1 | Documentos de pedido | MS Order Printer — 5,0★ (255), **grátis**, BFS | 🔴 **Não** |
| 2 | **Etiquetas de código de barras** | RF Gerador — 5,0★ (326), **grátis**, BFS | 🟡 **Talvez — o único** |
| 3 | Sync Airtable/Notion/ClickUp | SyncBase — 4,9★ (81), US$ 24/mês | 🔴 **Não** — sem demanda |
| 4 | Bundles | Kaching — 5,0★ (**5.321**) | 🔴 **Não**, categoricamente |

### Por que o candidato 2 é o único vivo

- **É o único onde a Shopify não tem função nativa.** Nos outros três, o caminho nativo existe e é grátis.
- **O app oficial não é só ruim, está regredindo.** Duas reclamações de julho/2026: uma atualização **removeu o SKU** das etiquetas Avery 5167 (risco de etiquetar produto errado) e trocou fonte e tamanho do código de barras, quebrando layouts de quem usava há 3 anos. 2,3★ com **204 avaliações de 1★**.
- **A mesma dor técnica aparece no oficial e no líder pago:** o que imprime não é o que o preview mostra — dimensão errada, não escaneia, precisa baixar o PDF antes de imprimir senão sai torto. Ninguém resolveu.
- **Formato de moeda por localidade está errado** no oficial (`€19,99` em vez de `19,99 €` na França) — casa com a nossa regra de i18n desde o dia 1.
- Há disposição a pagar: o líder pago cobra **US$ 7,99/mês** com 447 avaliações.

**O que trava o candidato 2:** **RF é grátis, 5,0★, 326 avaliações e Built for Shopify.** Teríamos que ganhar de graça, e a única dimensão onde dá para ganhar — fidelidade de impressão — **exige testar com impressora física** (Dymo, Zebra, Brother) e leitor real. Sem hardware, não dá para atacar justamente o que seria o diferencial.

**Preciso da sua decisão:** candidato 2 com esse escopo estreito, nova rodada de candidatos com outros critérios, ou outra direção?

## 🟡 Pendência que virou decisiva

**Hardware — terceira vez que o campo vem como placeholder** (`[tem/não tem]`, `[sua resposta]`). Agora não é mais detalhe: se você **não** tem impressora de etiqueta e leitor, o candidato 2 cai também, e aí os quatro estão reprovados.

Também: **`northstackapps.com` já foi comprado?**

---

## Resolvido nesta sessão

| Item | Estado |
|---|---|
| **App 1 cancelado** (caminho A) | Registrado em `DECISOES.md` e marcado no `CLAUDE.md`. Zero linhas de código escritas |
| **Regra 8 na nova forma** | Aprovada e aplicada no `CLAUDE.md`, com critérios objetivos de reprovação |
| **Login do CLI** | ✅ Funcionando. **Northstack Apps, org ID `232549161`** |
| **Pesquisa dos 4 candidatos** | ✅ `PESQUISA.md` — concorrentes, preços, notas, nº de avaliações, reclamações 1–3★ e vereditos |

---

## O achado que vale mais que os quatro vereditos

Os quatro candidatos partiam da mesma tese: *"o app oficial da Shopify é mal avaliado, logo há espaço"*. A nota ruim confirma-se nos três casos verificáveis — Order Printer **3,6★**, Retail Barcode Labels **2,3★**, Shopify Bundles **2,8★**. E nos três o mercado terceiro **já resolveu**, quase sempre de graça.

> **"App oficial mal avaliado" não é sinal de oportunidade — é sinal de categoria madura, já servida.** Foi o app oficial ruim que empurrou a demanda para terceiros anos atrás. Quando chegamos, o espaço já está ocupado por quem chegou na época da dor.

Isso está gravado no `CLAUDE.md` e invalida boa parte do backlog original, que foi montado sobre essa tese.

### O que eu procuraria na próxima rodada
1. **Dor com data recente** — mudança de API ou integração descontinuada nos últimos ~6 meses, antes de os líderes responderem.
2. **Regulação com prazo de vigência** — demanda datada, e a manutenção contínua vira barreira contra concorrente grátis.
3. Categoria **sem líder grátis com selo Built for Shopify**.
4. Soma de avaliações da categoria entre **~500 e ~5.000**.
5. **Reclamação técnica repetida nos 1–3★ de vários concorrentes ao mesmo tempo.**

---

## Portfólio

| # | App | Estado |
|---|---|---|
| 1 | ~~`restock`~~ | 🔴 **Cancelado** em 25/08/2026 |
| 2 | Conector contábil (QuickBooks/Xero) | Premissa abalada, **não verificado** — MyWorks já entrega junto com o Stockroom grátis |
| 3 | ~~Documentos de pedido~~ | 🔴 **Reprovado** na verificação |
| — | Etiquetas de código de barras | 🟡 Aguardando sua decisão |

**Receita hoje: US$ 0/mês.** Apps publicados: 0. Instalações: 0. **Gasto: R$ 0,00.**

---

## Ambiente (não repetir investigação)

- Node **v24.19.0**, npm **11.17.0** em `C:\Program Files\nodejs` — **fora do PATH**, usar caminho completo
- Shopify CLI autenticado · org **Northstack Apps** `232549161` · dev store **northstack-dev**
- `app init` exige `--organization-id` e `--flavor`; `--template reactRouter`; recusa diretório não vazio
- `shopify organization list` devolve o org ID sozinho
- Hospedagem: **Railway** (não contratar antes de haver app) · Domínio: **northstackapps.com**

## Como retomar (leia nesta ordem)

1. [CLAUDE.md](CLAUDE.md) — missão e regras (regra 8 mudou)
2. **este arquivo** — o bloqueio de decisão
3. [PESQUISA.md](PESQUISA.md) — a evidência por trás dos vereditos
4. [DECISOES.md](DECISOES.md) — histórico com datas e motivos
