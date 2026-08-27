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
| — | *(nenhum até 27/08/2026)* | 0,00 | 0,00 | — | — |

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
| **Domínio `northstackapps.com` — ✅ REGISTRADO 26/08/2026** | Registro anual no **Cloudflare** (a preço de custo, sem markup) | ~1 (12/ano) | ~66/ano *(valor pago a confirmar)* | Privacidade, suporte e remetente de e-mail. **Deixou de bloquear a submissão e passou a destravar o beta do D14** |

**Estimativa de recorrente na submissão: US$ 5/mês (~R$ 28/mês) + ~R$ 66/ano de domínio.**

> **Revisão de 26/08/2026 — o custo caiu, não subiu.** O app em construção é o **Nativelog**, em **Forge**, que a **Atlassian hospeda**. Some da conta: Railway (US$ 5/mês) e Postgres. Sobra o domínio.
>
> **Recorrente real do Nativelog até a submissão: ~R$ 66/ano.** Só isso.
>
> **Amarildo: me diga o valor exato pago no domínio** para eu fechar a linha acima. É o primeiro gasto real do projeto e a regra 5 pede o número, não a estimativa.

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

---

## 6. Cenário Atlassian (rodada 4, 25/08/2026)

Se o caminho for o Atlassian Marketplace, **a estrutura de custo muda para melhor**: some a hospedagem e o banco.

| Item | Custo | Observação |
|---|---|---|
| Conta de Marketplace Partner | R$ 0 | Gratuita |
| Instância de desenvolvimento (Jira/Confluence Cloud) | R$ 0 | Free tier da Atlassian |
| **Hospedagem** | **R$ 0** | **A Atlassian hospeda.** Railway deixa de ser necessário |
| **Banco de dados** | **R$ 0** | Forge KVS / Forge SQL, dentro da franquia |
| Forge — consumo além da franquia | variável | Ver franquias abaixo |
| Domínio | ~R$ 66/ano | Ainda necessário para suporte e política de privacidade |
| **Cloudflare Pages + Email Routing** | **R$ 0** | Free tier cobre site estático e redirecionamento de e-mail |
| Selo Runs on Atlassian | R$ 0 | Automático para apps Forge elegíveis |
| Selo Cloud Fortified | **não orçado** | Exige Bug Bounty pago + plantão 24 h. **Fora da v1** |

### Franquia mensal gratuita do Forge (por app) e preço do excedente

| Capacidade | Franquia grátis | Excedente (US$) |
|---|---|---|
| Funções: duração | 200.000 GB-segundos | 0,000025 / GB-s |
| KVS: leituras | 0,1 GB | 0,055 / GB |
| **KVS: escritas** | 0,1 GB | **1,090 / GB** ← linha cara |
| Logs | 1 GB | 1,005 / GB |
| SQL: computação | 1 hora | 0,143 / hora |
| SQL: requisições | 100.000 | 1,929 / 1M |
| Object Store | 5.000 requisições | 0,001353 / 1k |
| **Containers** | **0** | 0,07177 / vCPU-h |
| **LLM** | **0 créditos** | varia por modelo |

**Dois alertas de arquitetura:** escrita em KVS é a operação cara, então o desenho deve favorecer leitura; e **containers e LLM não têm franquia** — num negócio "IA First", qualquer inferência dentro do Forge é custo desde o primeiro minuto. Excedente não pago pode suspender o app.

**O que o Nativelog consome hoje (26/08/2026):**

| Origem | Quando | Nota |
|---|---|---|
| Invocação por clique (start/stop/descartar/apontar/editar/apagar) | Só na ação | Poucas por pessoa por dia |
| **Reconsulta do painel a cada 30 s** | **Só enquanto há relógio correndo na tela** | Decisão do D3.1 — sem ela a tela mente "Running" para timer já encerrado. Ver `DECISOES.md` |
| Consulta de permissão | Uma por abertura de painel | Decisão do D5 — evita a pessoa cronometrar onde não pode apontar |
| **Folha da semana** | Uma busca JQL + **uma chamada por item da semana** | Decisão do D6. Teto de 60 itens. É a operação mais cara do app, e só roda quando alguém abre a página |
| Leitura da lista de apontamentos | Ao abrir o painel e depois de cada gravação | Endpoint do item, não JQL |
| Escrita em KVS | Só o timer em andamento | **Nenhuma hora apontada mora no KVS** — vira worklog nativo e o registro some |

**Dois pontos a vigiar no beta:** a **reconsulta de 30 s**, único consumo que cresce com o tempo que o painel fica aberto e não com cliques; e a **folha da semana**, que gasta uma chamada por item — barata para uma pessoa, multiplicada por um time inteiro abrindo a folha na segunda de manhã. Se a franquia apertar, **o número sobe antes de qualquer outra coisa ser cortada** — a alternativa (voltar a não reconsultar) traz de volta um defeito que custa confiança.

### Taxa do marketplace — comparação honesta

| Marketplace | Retido | Na nossa fase |
|---|---|---|
| Shopify | 0% até US$ 1M acumulado, depois 15% | **0%** |
| Atlassian Forge | 16% | 16% |
| Atlassian Connect | 20% | 20% |

**A Shopify é mais barata em taxa hoje.** A vantagem do Atlassian está no preço por cliente (escala por assento), não na comissão.

---

## 7. Regra de aprovação

Qualquer linha da seção 3 vira gasto real **só depois** de:
1. Estar registrada aqui com valor,
2. Aparecer em "Precisa do humano" no `STATUS.md`,
3. Ter aprovação explícita do Amarildo.
