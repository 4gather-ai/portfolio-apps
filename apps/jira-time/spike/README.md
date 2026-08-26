# Spike `asUser` — código descartável

**Não é a base do produto.** Existe para responder uma pergunta e depois ser apagado.

## A pergunta

A cunha do App 1 é: *o dado É o worklog nativo do Jira, gravado como a própria pessoa*. Se o Forge não conseguir criar worklog com a identidade do usuário, **a cunha morre** e o App 1 precisa ser repensado. Ver `PESQUISA.md`, rodada 5.

## O que a documentação já respondeu (25/08/2026)

| Pergunta | Resposta na doc oficial |
|---|---|
| `api.asUser()` existe para escrita? | **Sim.** `api.[asApp \| asUser]().requestJira(path[, options])` — sem restrição documentada a métodos de escrita |
| Funciona fora da sessão do usuário? | **Sim, com ressalva.** `api.asUser(accountId)` faz chamadas como qualquer usuário, mas **exige escopos de impersonação offline** e está sujeito a restrições |
| E `api.asUser()` sem accountId? | *"This context method is only available in modules that support the UI kit"* — **funciona em contexto de UI**, que é exatamente o desenho aprovado |

**Consequência de projeto (decisão do Amarildo, 25/08/2026):** o timer grava **só o início**; o worklog nasce no **"parar"**, com `started` retroativo, **sempre em contexto de usuário**. Com isso **não precisamos de impersonação offline na v1** — nem dos escopos extras, nem das restrições que vêm com eles.

**O que a doc não responde e só o spike responde:** se o `POST /worklog` via `asUser()` de fato grava com a identidade da pessoa e se o JQL nativo enxerga. É a diferença entre "a API aceita" e "o dado fica certo".

## Como rodar

Pré-requisitos: Forge CLI **13.4.0** (já instalado), Node **v24.19.0** em `C:\Program Files\nodejs`, dev site `https://northstack-dev.atlassian.net/` com o projeto **SCRUM**.

**1. Login — você faz, no seu terminal** (eu não manipulo tokens):

```bash
forge login
```

**2. Criar o app a partir do template oficial:**

```bash
forge create -t jira-issue-panel -d asuser-spike
```

**3. Aplicar os arquivos deste diretório:**
- `resolver.js` → substitui `src/resolvers/index.js`
- `frontend.jsx` → substitui `src/frontend/index.jsx`
- no `manifest.yml`, garantir os escopos:

```yaml
permissions:
  scopes:
    - read:jira-user
    - read:jira-work
    - write:jira-work
```

**4. Instalar e abrir:**

```bash
forge deploy && forge install --site northstack-dev.atlassian.net --product jira
```

Abrir `SCRUM-1`, achar o painel **asUser Spike**, clicar em **Rodar spike**.

> Se `SCRUM-1` não existir, criar qualquer item no projeto SCRUM e ajustar `ISSUE_KEY` no `resolver.js`.

## O que cada passo prova

| Passo | Prova | Se falhar |
|---|---|---|
| 0. `asUser() /myself` | Há contexto de usuário no painel | Nada mais roda — problema de escopo ou de módulo |
| **1. `POST` worklog `asUser`** | **A API aceita escrita como usuário** | **Cunha morta.** Repensar o App 1 |
| **2. Autor == usuário real** | O worklog é da pessoa, não do app | **Cunha morta** — seria o mesmo defeito do Tempo |
| **3. JQL `worklogAuthor = currentUser()`** | O ecossistema nativo enxerga o dado | Cunha comprometida: é o sintoma que o cliente sente |
| 4. Painel nativo (`timespent`) | O tempo aparece no Jira sem app | Grave, mas não fatal |
| 5. `DELETE` worklog | Limpeza, não deixa lixo na dev site | Apagar à mão o id informado |

**Critério de aprovação: passos 1, 2 e 3 verdes.** Os passos 0 e 4 são contexto; o 5 é higiene.

## Depois

Aprovado → escrever `apps/jira-time/LISTING.md` e apagar este diretório.
Reprovado → registrar o resultado exato em `STATUS.md` e `DECISOES.md`, e reabrir a escolha do App 1 (test management é o App 2 no backlog).
