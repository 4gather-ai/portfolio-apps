# STATUS — Nativelog

Apontamento de horas para Jira Cloud. **O worklog do Jira é a fonte de verdade; não há segunda cópia.**

**Última atualização:** 27/08/2026 (sessão 12) · **D7 de 14 concluído** · deploy **2.13.0** no ambiente `development` · **292 testes** · `forge lint` limpo
**Onde:** `northstack-dev.atlassian.net` · app id `22d863f1-cb08-4d77-a7b9-bd4098ede2b2` · elegível a **Runs on Atlassian**

> Este arquivo é o estado do **app**. O estado do portfólio fica em `../../STATUS.md`; os marcos por dia em `PLANO-V1.md`; as decisões em `../../DECISOES.md`.

---

## ✅ Feito

| Dia | Marco | Testes |
|---|---|---|
| **D1** | Scaffold Forge, manifest e escopos, CI (lint + Vitest), núcleo de duração/data | — |
| **D2** | Painel do item: iniciar, parar, descartar · **um timer por pessoa** | 60 |
| **D3** | O timer vira **worklog nativo**, via `asUser()`, com `started` retroativo | 97 |
| **D3.1** | Painel que mentia "Running" + relógio preso no cold start | 135 |
| **D4** | Apontamento manual: criar, corrigir e apagar a própria entrada | 231 |
| **D5** | Erros do núcleo: permissão na abertura, timer preso com saída, timer esquecido, fuso | 262 |
| **D6** | **"Minha semana"** (`globalPage`): busca em dois passos, totais por dia no fuso local | 284 |
| **D7** | Navegação de semanas + **corrigir e apagar a partir da folha** | 292 |

**A cunha está provada no produto, não só no spike:** em 26/08 o Amarildo apontou tempo pelo app e o worklog nasceu **com o nome dele** na aba Work log do Jira. Era o único critério do D3 que o Claude Code não conseguia fechar sozinho.

---

## ▶️ Próximo — D8 (02/09)

**Exportação CSV**, com incluir/excluir projetos. Fecha o critério de "pronto" da rodada 5 do `PESQUISA.md`.

A leitura já existe: o D6 montou a semana a partir do worklog nativo. O D8 é dar saída a ela — e a decisão que importa é **de quem é o CSV**: contador quer uma linha por lançamento com projeto, item, data, duração e descrição; gerente quer somado por dia. A v1 exporta o cru, porque somar a partir do cru é trivial e o inverso é impossível.

---

## 🚧 Bloqueios

Nenhum bloqueio técnico. **O risco aberto do projeto não é código, é o beta (regra 16):** encontrar 5–10 instâncias reais. Ver `BETA-RECRUTAMENTO.md`, `COMMUNITY.md` e `BETA-ANUNCIO.md`.

---

## 🔴 Precisa do humano

**Agora, e são minutos:**

| # | O quê | Tempo | Bloqueia |
|---|---|---|---|
| 1 | **Publicar `site/` no Cloudflare Pages** — build vazio, output `site`. Ver `../../site/README.md` | 10 min | **D14 / beta** |
| 2 | **Criar `support@northstackapps.com`** no Email Routing do Cloudflare | 5 min | **As 3 páginas já prometem esse endereço** |
| 3 | **Publicar a resposta 2 da Community** — texto pronto para colar em `COMMUNITY.md` | 5 min | O beta |

**Mais adiante:**

| # | O quê | Quando | Bloqueia |
|---|---|---|---|
| 4 | **Decidir se a v1 tem visão de equipe** — é o que separa Standard de Pro | D9 · 03/09 | O preço do Pro |
| 5 | **Definir a tabela de faixas de preço no Developer Console** | D11 · 05/09 | **Billing. Único item que trava a submissão** |
| 6 | **Publicar o anúncio do beta** (`BETA-ANUNCIO.md`) e **gerar o link de instalação** | D14 · 08/09 | **O beta não começa** |
| 7 | **Recrutar e acompanhar 5–10 instâncias reais** | dias 15–35 | **Listar. É o risco real do plano** |

---

## Arquitetura em uma tela

```
src/
  lib/
    time.js         duração, data no formato do Jira, relógio, início aceitável
    timer.js        máquina de estados do timer (KVS injetado)
    worklog.js      escrita e leitura do worklog nativo (`pedir` injetado)
    apontamento.js  validação do apontamento manual
    permissoes.js   o que esta pessoa pode fazer neste item
    semana.js       a folha da semana, em dois passos (JQL + endpoint do item)
  resolvers/
    painel.js       as operações do painel — tudo que pode dar errado mora aqui
    semana.js       as operações da página "Minha semana"
    index.js        SÓ fiação: liga o KVS e o `asUser()` de verdade
  frontend/
    index.jsx       painel do item: árvore de componentes e fiação
    semana.jsx      "Minha semana" — **é aqui que o fuso existe**
    FormularioApontamento.jsx  o formulário, usado pelas duas telas
    estado.js       relógio otimista, quando reconsultar, o que mudou por fora
    formulario.js   dia+hora local ⇄ instante absoluto
    semanaUi.js     os sete dias e os rótulos da folha
    mensagens.js    motivo técnico → frase que a pessoa entende
```

**Por que tanta injeção de dependência:** `index.js` é o único arquivo que importa Forge. Todo o resto roda no Vitest sem mock de plataforma — é isso que permite testar "o Jira devolveu 503 no meio do parar" de verdade.

### Regras que não se quebra sem discutir

1. **`asUser()`, sempre.** É o produto inteiro: faz o worklog nascer com a identidade da pessoa, e é o que faz `worklogAuthor = currentUser()` achar as horas.
2. **Ler worklog pelo endpoint do item** (`/issue/{id}/worklog`). **JQL só para busca ampla**, nunca para conferir o que acabou de ser gravado — o índice do Jira atrasa ~5,7 s (medido no spike).
3. **Grava primeiro, apaga o timer depois.** Se a gravação falha, o timer continua de pé. Perder hora cronometrada é o pior desfecho possível.
4. **Só a própria entrada é editável e apagável**, e a conferência é do **servidor**. A permissão do Jira não cobre essa regra — quem tem "editar worklog de qualquer um" passaria por ela.
5. **Nada de campo de formulário controlado.** No UI Kit 2 isso engole o que a pessoa digita — ver abaixo. Use `useForm` do `@forge/react`.
6. **`@forge/kvs`**, não o `storage` do `@forge/api` (deprecado, o `forge lint` reprova).
7. **Agrupar worklog por dia é do navegador, nunca do resolver.** O Forge roda em UTC e não sabe que 23h30 de terça em São Paulo ainda é terça. O servidor devolve instantes; a tela decide o dia.
8. **Uma consulta de permissão que falha nunca tranca ninguém.** Na dúvida, libera — a gravação de verdade ainda recusa com frase clara, e nesse caminho nada se perde.

---

## O que só o navegador pegou

Em 26/08 o Claude Code teve acesso ao Chrome pela primeira vez. **Três defeitos apareceram no mesmo dia que os testes automatizados não pegavam** — e a assinatura dos três é a mesma: *a nossa lógica estava certa; a plataforma se comporta diferente.*

| Defeito | Como aparecia | Causa |
|---|---|---|
| Painel mentindo | Aba antiga seguia com "Running" e o relógio andando depois de o timer ser encerrado em outra aba | O painel não é dono da verdade e não reconsultava |
| Relógio preso | ~20 s entre clicar Start e o relógio andar | Cold start do resolver; e o início marcado pelo servidor comia esses segundos do apontamento |
| **Campo engolindo texto** | Digitar `45m` deixava `m` | Campo controlado no UI Kit 2: o `value` do re-render volta **depois** da tecla seguinte e sobrescreve |

Em 27/08 o método pagou de novo: **as entradas da semana não carregavam a descrição**, e editar a partir da folha teria apagado em silêncio o que a pessoa escreveu. Apareceu ao ligar o formulário na tela, antes de ir para o ar.

**Passou a ser método:** todo marco termina com o app aberto no navegador executando o caminho principal, não só com os testes verdes. Registrado em `../../DECISOES.md` e na regra 17 do `CLAUDE.md`.

E é a evidência mais forte a favor da **regra 16**: dev store com uma aba só não mostra o que uso real mostra.

---

## Como mexer nisto

```bash
# Node está fora do PATH nesta máquina
"/c/Program Files/nodejs/npm.cmd" run check        # lint + 292 testes
"/c/Program Files/nodejs/npx.cmd" forge lint
"/c/Program Files/nodejs/npx.cmd" forge deploy --non-interactive
```

O `forge install` já foi feito na `northstack-dev`; enquanto o manifest não mudar de escopo, o deploy sozinho basta.
