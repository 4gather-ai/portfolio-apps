# Nativelog — Plano da v1

> **✅ Aprovado pelo Amarildo em 26/08/2026.** Em construção — **D1, D2 e D3 concluídos**, D4 é o próximo.
> Base: cunha provada no spike de 26/08/2026 (`STATUS.md`). Escopo fechado em `PESQUISA.md`, rodada 5.

---

## 1. Princípio de arquitetura

> **O worklog do Jira é a fonte de verdade. Não há segunda cópia.**

Tudo que puder ser derivado de worklog nativo **é derivado na hora da leitura**. Nada de espelho, nada de sincronização, nada de job de reconciliação. Foi essa decisão que virou a cunha do produto — e é ela que os concorrentes não conseguem copiar sem reescrever o núcleo.

**Corolário medido no spike:** o índice de busca do Jira **atrasa ~5,7 s** (o JQL só achou o worklog na 3ª tentativa). Portanto:

- **Leitura de dado que o usuário acabou de escrever → endpoint do item** (`/rest/api/3/issue/{key}/worklog`), que não passa pelo índice
- **JQL só para busca ampla** (achar quais itens olhar), nunca para conferir o que acabou de ser gravado
- Registrado como regra em `DECISOES.md`

---

## 2. Stack e plataforma

| Item | Escolha | Motivo |
|---|---|---|
| Framework | **Forge** | Repasse 84% (vs 80% Connect); sem infraestrutura nossa; elegível a Runs on Atlassian |
| Runtime | `nodejs24.x`, arm64, 256 MB | Padrão do template; suficiente |
| UI | **UI Kit** (`render: native`) | Renderiza no Atlassian; nada de iframe; melhor desempenho e acessibilidade de graça |
| Armazenamento | **Forge KVS, mínimo** | Ver seção 4 |
| Selo alvo | **Runs on Atlassian** | Automático e gratuito. **Cloud Fortified fica fora da v1** — exige bug bounty pago e plantão de 24 h |
| Hospedagem/banco | **Nenhum** | A Atlassian hospeda. Railway e Postgres saem do orçamento |

**Confirmado no spike:** escrever worklog via `asUser` **não** invalida a elegibilidade a Runs on Atlassian.

---

## 3. Módulos do manifest

| Módulo | Chave | O que faz |
|---|---|---|
| `jira:issuePanel` | `nativelog-issue` | Timer e apontamento manual dentro do item |
| `jira:globalPage` | `nativelog-week` | Minha semana + exportação CSV |
| `jira:globalPage` | `nativelog-team` | Visão de equipe (Pro) |
| `jira:adminPage` | `nativelog-admin` | Configuração mínima: grupos que enxergam a visão de equipe |

**Escopos** (mínimo necessário — a revisão da Atlassian reprova excesso):

```yaml
permissions:
  scopes:
    - read:jira-user     # identificar o usuário e montar a folha
    - read:jira-work     # ler worklogs, itens e projetos
    - write:jira-work    # criar, editar e apagar worklog do próprio usuário
    - storage:app        # KVS — exigido pela API de armazenamento do Forge (D2)
```

**Sem impersonação offline.** Como o timer grava só o início e o worklog nasce no "parar", em contexto de usuário, não precisamos de `asUser(accountId)` nem dos escopos e restrições que ele traz.

---

## 4. Modelo de dados — o mínimo possível

**No Jira (fonte de verdade), nada nosso:** o worklog nativo, com `author`, `started`, `timeSpentSeconds` e `comment`.

**No Forge KVS, só o que o Jira não tem onde guardar:**

| Chave | Valor | Por que precisa existir |
|---|---|---|
| `timer:{accountId}` | `{ issueId, issueKey, startedAt, podeTerGravado?, tentativas?, ultimaFalha? }` | Um timer em andamento não é um worklog ainda. Some quando o worklog é gravado. Os três últimos campos só existem quando uma gravação falhou — ver a regra de ordem abaixo |
| `prefs:{accountId}` | `{ excludedProjects[], lastExportFormat }` | Preferência de exportação, não é dado de trabalho |
| `admin:config` | `{ teamViewGroups[] }` | Configuração da instância |

**Regras duras:**
- **Um timer por pessoa.** Iniciar outro fecha o anterior — sem timers órfãos acumulando.
- **Nada de hora apontada no KVS.** Se está apontado, é worklog.
- **Grava primeiro, apaga o timer depois** *(invertido no D3)*. Se o Jira falhar no "parar", o timer sobrevive e a pessoa tenta de novo. Perder hora cronometrada é pior que uma duplicata visível — e a duplicata é evitada lendo os worklogs do item antes de reescrever, nunca por JQL.
- **API: `@forge/kvs`**, não o `storage` do `@forge/api` — este último está deprecado e o `forge lint` reprova (constatado no D2)
- **Escrita em KVS é a linha cara do Forge** (US$ 1,09/GB). Esses três registros são minúsculos e mudam pouco: fica muito dentro da franquia gratuita.
- **Desinstalar não perde nada.** O KVS some, os worklogs ficam. É argumento de venda e é verdade.

---

## 5. Marcos em dias

**Build comprimido em 14 dias corridos** (decisão do Amarildo, 26/08/2026). Dia 1 = **26/08/2026**. Commit e push **a cada marco**.

| Dia | Data | Marco | Precisa do humano |
|---|---|---|---|
| ~~**D1**~~ ✅ | 26/08 | Scaffold Forge no repo, manifest e escopos, CI (lint + Vitest), biblioteca de duração/data com testes | — |
| ~~**D2**~~ ✅ | **26/08** *(adiantado)* | `issuePanel`: timer inicia, para e é descartado; estado no KVS; um timer por pessoa. 60 testes | — |
| ~~**D3**~~ ✅ | **26/08** *(adiantado)* | Gravação do worklog no "parar", `started` retroativo, via `asUser()`. 97 testes | **Critério em aberto: apontar e conferir o nome na aba Work log** — só uma pessoa clicando fecha isso |
| **D4** ▶️ | 29/08 | Apontamento manual, editar e apagar entrada própria | — |
| **D5** | 30/08 | Erros do núcleo: permissão negada, item apagado, timer órfão, fuso | — |
| **D6** | 31/08 | `globalPage` "Minha semana": leitura via `/issue/{key}/worklog`, totais por dia | — |
| **D7** | 01/09 | Navegação de semanas, edição a partir da folha | — |
| **D8** | 02/09 | Exportação CSV com incluir/**excluir** projetos. **Critério de "pronto" da rodada 5 completo** | — |
| **D9** | 03/09 | Visão de equipe (Pro), leitura por grupo/projeto | — |
| **D10** | 04/09 | i18n: EN, pt-BR, ES, DE, FR | — |
| **D11** | 05/09 | Editions Free/Standard/Pro + checagem de licença | **Definir a tabela de faixas de preço** no Developer Console — eu preparo os números |
| **D12** | 06/09 | Instância grande: 50+ projetos, muitos worklogs, paginação, desempenho | — |
| **D13** | 07/09 | Acessibilidade, revisão de UI, textos finais | — |
| **D14** | 08/09 | Empacotar para o beta: link privado, `BETA.md`, instruções de instalação | **Privacidade e suporte no ar** em `northstackapps.com` |

> **Um dia de folga recuperado.** O D2 saiu em 26/08, no dia do D1. As datas seguintes ficam como estavam de propósito: o aviso abaixo diz que a compressão para 14 dias tirou todo o amortecedor, então o dia ganho vale mais como folga do que como antecipação.

**Dias 15–35 — beta privado (regra 16):** 5–10 instâncias reais por 2–3 semanas, correções em ciclo curto, tudo registrado em `BETA.md`.
**Precisa do humano:** **recrutar os participantes** — ver `BETA-RECRUTAMENTO.md`. **Começa no D1, não no D15.**

**Dia ~36 — submissão:** screenshots reais, ícone, listagem final, checklist da Atlassian.
**Precisa do humano:** submeter e aceitar termos. Depois, **10 a 15 dias úteis** de fila.

**Do D1 à submissão: ~36 dias. À publicação: ~50 dias.**

> ⚠️ **O que a compressão de 4 semanas para 14 dias custa.** Ela é viável porque o risco técnico já caiu no spike e porque não há espera de terceiros no build. **A folga some.** Se algo der errado — a API se comportar diferente do esperado em instância grande, ou o billing der trabalho —, os 14 dias viram 18 e não há amortecedor. O beta e a fila de revisão da Atlassian **não comprimem** e continuam sendo o caminho crítico real: 21 dias de beta e 10–15 dias úteis de fila valem mais que os 14 dias de código.

---

## 6. Testes

- **Vitest** em lógica pura: cálculo de duração, formato `started` do Jira, fuso, agregação semanal, filtro de projetos
- **Contra a API de verdade**, num item da dev instance: criar, editar, apagar worklog; conferir autoria; conferir o atraso de índice
- **CI**: GitHub Actions rodando lint + test em PR (regra do `CLAUDE.md`)
- **Não vou simular a API do Jira nos testes que importam.** O spike já mostrou que o comportamento real (latência de índice) é o que decide o desenho — mock não teria pego isso

---

## 7. O que precisa do humano, consolidado

| Quando | O quê | Bloqueia |
|---|---|---|
| ~~Agora~~ | ~~Aprovar este plano~~ | ✅ aprovado em 26/08 |
| **D2–D5** | **Publicar as 4 respostas técnicas** — prontas em `COMMUNITY.md` | O canal de recrutamento nº 1 |
| **D1 em diante** | **Recrutar 5–10 instâncias reais** — ver `BETA-RECRUTAMENTO.md`. **Canal 1 descartado em 26/08**; prioridade agora é Community → r/jira → Solution Partners | **Dia 15**. É o caminho crítico |
| D11 (05/09) | Definir a tabela de faixas de preço | Billing |
| D14 (08/09) | Privacidade e suporte no ar em `northstackapps.com` *(domínio **registrado no Cloudflare** em 26/08)* | **Beta** |
| ~D36 | Submeter e aceitar termos | Publicação |

### O recrutamento do beta é o risco real do plano

Construir isso é trabalho conhecido. **Achar 5–10 times que usem Jira e topem instalar um app novo é o que pode travar semanas.** Não adianta descobrir isso na semana 5.

Sugiro começar a procurar **na semana 1, em paralelo com o código**. Caminhos possíveis, em ordem de custo: rede pessoal e clientes de quem você conhece; Atlassian Community (fórum tem seção de beta); r/jira; grupos de Atlassian no LinkedIn; Solution Partners pequenos que atendem várias instâncias.

Se em três semanas não houver 5 candidatos, é sinal para reconsiderar o canal — não para pular o beta.

---

## 8. Riscos abertos

| Risco | Gravidade | Mitigação |
|---|---|---|
| **Recrutamento do beta** | **Alta** | Começar na semana 1, não na 5 |
| Timer perdido: usuário inicia e nunca para | Média | Aviso no painel após X horas; permitir corrigir antes de gravar |
| Worklog editado fora do app | Baixa | Somos leitores do nativo; edição externa simplesmente aparece — é vantagem, não bug |
| Custo de consumo do Forge estourar a franquia | Baixa | KVS mínimo por desenho; monitorar no painel de custos |
| Concorrente copiar a cunha | Média | Para o Tempo, trocar `asApp` por `asUser` mexe no núcleo e na base histórica. Não é uma sprint. Mas não é impossível — nossa vantagem é tempo, não fosso permanente |
| Atlassian tornar isso nativo | Baixa | Time tracking não mudou de patamar em anos e não diferencia planos (verificado na rodada 5) |

---

## 9. Fora da v1 — lista fechada

Aprovação de horas · taxas de faturamento, custo, orçamento e faturamento a cliente · planejamento de capacidade e alocação · previsão · integrações externas (Google Calendar, Slack, Outlook) · app mobile · suporte a Data Center · Cloud Fortified · rollup em hierarquias com mais de 100 filhos (limite do próprio Jira).

**Cada item aqui é um pedido que vai aparecer no beta.** A resposta padrão é "não na v1" — anotar em `BETA.md` e decidir depois, com dado de uso.
