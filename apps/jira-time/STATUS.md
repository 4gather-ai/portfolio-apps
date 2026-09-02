# STATUS — Nativelog

Apontamento de horas para Jira Cloud. **O worklog do Jira é a fonte de verdade; não há segunda cópia.**

**Última atualização:** 02/09/2026 (sessão 18) · **código da v1 pronto, mais o D15 e o D15.1** · **460 testes** · `forge lint` limpo
**Deploys:** `production` **2.2.0** (é onde o beta roda — **já com o D15.1**) · `development` **2.27.0** (é onde eu confiro)
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
| **D8** | Exportação CSV, com filtro de projetos e defesa contra injeção de fórmula | 321 |
| **D9** | **Visão de equipe, somente leitura** — o gestor vê a semana do time | 343 |
| **D10** | i18n em EN, pt-BR, ES, DE e FR, no i18n nativo do Forge | 373 |
| **D11** | Editions e checagem de licença + [`PRECO.md`](PRECO.md) para aprovação | 388 |
| **D12** | Instância grande: paginação de verdade e leitura em lotes | 405 |
| **D13** | Acessibilidade e revisão de textos | 405 |
| **D14** | **Beta empacotado:** produção no ar, `BETA.md`, guia publicado | 405 |
| **D15** | **Lançar pela tela da semana** — Add entry, atalho por dia, seletor com os recentes | 443 |
| **D15.1** | **O seletor passou a buscar de verdade** + acabamento do formulário | 460 |

**A cunha está provada no produto, não só no spike:** em 26/08 o Amarildo apontou tempo pelo app e o worklog nasceu **com o nome dele** na aba Work log do Jira. Era o único critério do D3 que o Claude Code não conseguia fechar sozinho.

---

## ✅ D15 — 01/09/2026

A semana passou a **lançar**, não só a corrigir. `Add entry` no topo e um atalho em cada coluna; o seletor de item abre **já com os itens recentes da pessoa** e busca por chave ou por resumo; a data vem da coluna clicada; o formulário é o mesmo do D7, não uma segunda cópia.

**Existe por causa da listagem, e isso está registrado:** em 01/09 o posicionamento virou *"a semana numa tela só"*, e até então a semana lia, navegava, corrigia e apagava — **não criava**. Ver `../../DECISOES.md`.

### Três decisões que valem ser vistas

**1. Um caminho só de gravação, para as duas telas.** O painel e a folha chamam o **mesmo** resolver (`apontarManual`); muda só de onde vem o item — do contexto, ou do payload. É a lição do formulário no D7 aplicada ao servidor.

**2. O item pode vir do navegador; a identidade nunca.** O comentário antigo de `itemDoAlvo` dizia que **criar** exigia o contexto porque não há autoria a conferir. Estava incompleto: quem guarda esse caminho é o `asUser()`. Um item forjado no payload só alcança o que a pessoa já alcança abrindo o item no Jira e clicando em Log work — e ainda seria hora dela, no nome dela. **Não há nada a escalar**, e há teste afirmando que um `accountId` no payload é ignorado.

**3. O seletor é conveniência e falha como conveniência.** `sugerirItens` devolve lista vazia com o motivo em vez de erro: se o picker do Jira cair, a pessoa perde o atalho — **não pode perder o caminho de gravar hora**. Tem teste em cima disso.

### 🐞 O sexto defeito que só o navegador achou

**Gravava certo e o dia continuava dizendo "nothing logged".** A folha é remontada por JQL e o índice de busca do Jira atrasa (~5,7 s, medido no spike). O formulário fechava, a mensagem verde aparecia, e logo abaixo dela o dia seguia vazio. **Numa folha de ponto isso é um convite a lançar de novo** — e o segundo lançamento é um worklog duplicado.

Corrigido: a entrada fica visível com o **id de verdade** que o Jira devolveu (Edit e Delete já funcionam nela) e **some sozinha** quando a busca a devolve. Não é uma segunda cópia — é a resposta da escrita, segurada por segundos. A regra saiu do `.jsx` para `semanaUi.js` com teste: **defeito de estado de tela sem teste volta.**

**Verificado no navegador:** `Log time on seg., 31 de ago.` abriu na coluna de segunda com a data preenchida → `workratio` no seletor manteve as nove letras e filtrou para o SCRUM-3 → 25m gravados → `Add entry` do topo abriu em terça, que é hoje → SCRUM-4, 40m → **apareceu na hora, dia 10m → 50m, semana 35m → 1h 15m, sem Refresh** → aba **Work log nativa do SCRUM-4**: *"Amarildo Pereira logged 40m"*.

~~**⚠️ Está em `development`. A produção continua em 2.0.0**~~ — **resolvido em 02/09: produção 2.2.0, com o D15 e o D15.1.** O link de instalação já entrega a tela que a listagem promete.

---

## ✅ D15.1 — 02/09/2026 · o seletor só devolvia o histórico

**Achado pelo Amarildo na `nativelog-beta-zero`, em produção, pela regra 17.** Digitar a chave ou o resumo de um item **nunca visitado** não devolvia nada. Abrir o item uma vez no Jira o fazia aparecer. Status não tinha influência — conferido com o SCRUM-2 em In Progress.

### A causa, confirmada na documentação antes de mexer

A resposta do `/rest/api/3/issue/picker` vem em duas seções, e **elas não são a mesma coisa**:

| Seção | O que é | Vem sempre? |
|---|---|---|
| `hs` — History Search | o que **esta pessoa já abriu** | sim |
| `cs` — Current Search | **a busca de verdade** | **só com `currentJQL`** |

A Atlassian é explícita: *"Current search is based on a JQL query and is only retrieved when the currentJQL parameter is specified in your request."* Nós não mandávamos o parâmetro. **Metade do seletor não existia.**

**Por que passou:** quem testa um seletor testa com o item que acabou de abrir. Na `northstack-dev` eu já tinha visitado os seis itens, então o histórico cobria tudo e a busca parecia funcionar. **O defeito era invisível exatamente para quem construiu.**

### O que os testes não pegavam, e é a lição

Os testes de `itens.js` afirmavam o **formato** da resposta — as duas seções, montadas à mão no duplo. **Nenhum afirmava que a chamada pedia as duas.** Um duplo devolve o que o autor do teste imaginou, e eu tinha imaginado a resposta completa.

> **Teste de integração com duplo só vale até onde vai a imaginação de quem o escreveu.** O que ele nunca cobre é o parâmetro que você não sabia que existia — e é por isso que a regra 17 não é opcional.

Agora há um teste que **falha sem o parâmetro e passa com ele** (conferido removendo a linha e rodando).

### `currentJQL` amplo, e não vazio

Vai `order by lastViewed DESC`. A Atlassian documenta que `currentJQL` **vazio** deixa de funcionar quando o administrador liga *"Disable empty JQL queries"* — e configuração de instância alheia não é coisa em que se apostar num app que vai para a Marketplace.

### Mais três acabamentos, do mesmo relato

**Lista curta é completada com os itens atribuídos à pessoa.** Instância nova tem histórico vazio, e instância nova é o que o beta tem. Uma sugestão só é praticamente lista vazia. **Com texto digitado, o complemento é filtrado pelo texto** — completar uma busca com item que não casa é pior que devolver vazio: a pessoa lê a lista como resultado da busca e escolhe o item errado.

**O título "Log time" passou a vir antes do campo "Work item".** O seletor mora fora do formulário, então o `FormHeader` caía no meio: o título aparecia **depois** do campo que ele apresenta.

**A data e a hora seguem o idioma do app.** E aqui o relato apontou para mais do que dizia: a folha usava **dois idiomas ao mesmo tempo** — os botões vinham do i18n do Forge e os rótulos dos dias do `toLocaleDateString` do navegador. Numa instância em inglês aberta num Chrome em português saía `My week` com colunas `qua., 2 de set.`. **Num painel com campo de data isso é ambiguidade real:** `9/2` é 2 de setembro em inglês e 9 de fevereiro em português, e quem lê "2 de set." logo acima tem todo o direito de ler o campo errado. Agora os dois saem do mesmo `useTranslation`.

### Verificado no navegador, na `nativelog-beta-zero`, em produção

Sem abrir item nenhum antes, para o histórico continuar vazio: o seletor abriu oferecendo **SCRUM-2, SCRUM-3 e SCRUM-5** (antes traria só o SCRUM-5) → digitar `Tarefa` devolveu **SCRUM-2, SCRUM-3 e SCRUM-1**, três itens nunca abertos, o que só a seção Current Search explica → 15m lançados no **SCRUM-2**, o item exato do relato → total do dia 10m → 25m → e a aba **Work log nativa do SCRUM-2** mostra *"Amarildo Pereira logged 15m"*.

E os rótulos passaram a concordar: `Aug 31 - Sep 6` com `Mon, Aug 31`, num app cuja interface está em inglês. Antes eram rótulos em português sobre botões em inglês.

> ⚠️ **O que não deu para conferir:** a data em `pt-BR`. As duas instâncias que temos rodam o app em inglês, e trocar o idioma da conta é ajuste seu, não meu. **O que dá para afirmar é que campo e rótulo saem do mesmo idioma** — antes eram fontes diferentes, e era daí que vinha `9/2/2026` embaixo de `2 de set.`

---

## ▶️ Próximo — o beta, e ele não é código

O código da v1 acabou. O link de instalação **foi gerado em 28/08** e o caminho inteiro foi testado num site Jira criado do zero (`nativelog-beta-zero`): instalou, o timer começou a contar na hora, o apontamento gravou, "Minha semana" veio em pt-BR. Registro em [`BETA.md`](BETA.md).

**O que falta é achar 5 a 10 instâncias reais** — e ficou mais difícil em 28/08, porque a Atlassian Community saiu do recrutamento. Ver `../../STATUS.md` e `BETA-ANUNCIO.md`.

**Um defeito veio do ensaio geral:** na tela de instalação o app aparecia como `nativelog`. É o **nome do app no Developer Console**, não o `title` do manifest — duas strings, e só a nossa estava certa. Correção em `../../DECISOES.md`, 28/08. **É o quinto defeito que só o navegador achou, e o primeiro que só aparece de fora** — nenhuma tela nossa mostra esse nome.

**⚠️ Uma regra de ordem que o D14 descobriu:** **não ligar a licença no manifest antes de o beta terminar.** A tela do Developer Console diz que um app com licença no manifest **não pode mais ser compartilhado por link de instalação** — ligar agora mataria o beta. Ver `../../DECISOES.md`, 27/08.

---

## 🚧 Bloqueios

Nenhum bloqueio técnico. **O risco aberto do projeto não é código, é o beta (regra 16):** encontrar 5–10 instâncias reais. Ver `BETA-RECRUTAMENTO.md`, `COMMUNITY.md` e `BETA-ANUNCIO.md`.

---

## 🔴 Precisa do humano

**Agora, e são minutos:**

| # | O quê | Tempo | Bloqueia |
|---|---|---|---|
| 1 | **Corrigir o nome do app** no Developer Console → Settings: `nativelog` para `Nativelog` | 2 min | Nada — mas é a primeira coisa que um instalador vê |
| 2 | **Ajustar o perfil da Community** (nome público com a empresa, Company, bio, My website) | 10 min | Publicar qualquer resposta |
| 3 | **Publicar a resposta 2** — pergunta nova, texto pronto em `COMMUNITY.md` | 5 min | Reputação no canal |
| 4 | **Me mandar o link de instalação** — não tenho a URL | 1 min | O post do r/jira e os e-mails aos parceiros |
| 5 | **Postar no r/jira** — agora é o canal principal de recrutamento | 15 min | **O beta inteiro** |
| 6 | **Escrever para 10 Solution Partners** — resposta lenta, começar cedo | 30 min | O beta |

~~Publicar o site~~ ✅, ~~criar `support@northstackapps.com`~~ ✅ (27/08) e ~~gerar o link de instalação~~ ✅ (28/08) — feitos por você.
~~Aprovar `PRECO.md`~~ ✅ — aprovado em 27/08: **duas editions**.
| 4 | **Aprovar [`PRECO.md`](PRECO.md)** — uma decisão (2 ou 3 editions) e os números | 15 min | **Billing** |

**Mais adiante:**

| # | O quê | Quando | Bloqueia |
|---|---|---|---|
| 3 | **Publicar o anúncio do beta** (`BETA-ANUNCIO.md`), depois das 4 respostas | — | O recrutamento |
| 4 | **Recrutar e acompanhar 5–10 instâncias reais**, registrando em [`BETA.md`](BETA.md) | dias 15–35 | **Listar. É o risco real do plano** |
| 5 | **Só depois do beta:** ligar a licença e inserir as faixas de preço | pós-beta | Submissão |

~~Decidir se a v1 tem visão de equipe~~ — **decidido em 27/08: entra, somente leitura.**

---

## Arquitetura em uma tela

```
src/
  lib/
    time.js         duração, data no formato do Jira, relógio, início aceitável
    timer.js        máquina de estados do timer (KVS injetado)
    worklog.js      escrita e leitura do worklog nativo (`pedir` injetado)
    apontamento.js  validação do apontamento manual
    csv.js          exportação, com defesa contra injeção de fórmula
    licenca.js      que edition esta instância tem — na dúvida, libera
    lotes.js        concorrência limitada: 60 chamadas simultâneas viram 429
    permissoes.js   o que esta pessoa pode fazer neste item
    semana.js       a folha da semana, em dois passos (JQL + endpoint do item)
    itens.js        sugestões para o seletor de item — recentes sem digitar nada
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
    semanaUi.js     os sete dias, os rótulos, e a entrada que a busca ainda não viu
    equipeUi.js     a folha do time agrupada por pessoa — só totais, sem edição
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
9. **A licença segue a mesma regra, e ela é assimétrica de propósito.** Bloquear um cliente pagante por um campo que não soubemos ler é pior que alguém ver o Pro de graça por um tempo. Só a visão de equipe é paga; o núcleo é igual em todas as editions.
10. **Ler do Jira sempre pagina e sempre em lotes.** Ler a primeira página e somar dá um total que parece completo e não é; 60 chamadas simultâneas viram 429 e a folha volta furada.
11. **Gravar e ver são coisas diferentes, e a busca atrasa.** Depois de escrever, nunca confiar no JQL para confirmar: a entrada recém-gravada é mostrada a partir da **resposta da escrita**, até a busca a devolver. É a regra 2 vista pelo lado da tela.
12. **Símbolo não é texto.** Travessão para dia vazio não é lido por leitor de tela. Campo tem `Label` associado, não texto ao lado.

---

## O que só o navegador pegou

Em 26/08 o Claude Code teve acesso ao Chrome pela primeira vez. **Três defeitos apareceram no mesmo dia que os testes automatizados não pegavam** — e a assinatura dos três é a mesma: *a nossa lógica estava certa; a plataforma se comporta diferente.*

| Defeito | Como aparecia | Causa |
|---|---|---|
| Painel mentindo | Aba antiga seguia com "Running" e o relógio andando depois de o timer ser encerrado em outra aba | O painel não é dono da verdade e não reconsultava |
| Relógio preso | ~20 s entre clicar Start e o relógio andar | Cold start do resolver; e o início marcado pelo servidor comia esses segundos do apontamento |
| **Campo engolindo texto** | Digitar `45m` deixava `m` | Campo controlado no UI Kit 2: o `value` do re-render volta **depois** da tecla seguinte e sobrescreve |
| **Dia vazio depois de gravar** *(01/09, D15)* | Gravava certo e o dia seguia "nothing logged" | A folha vem do JQL, e o índice do Jira atrasa. **Convite a lançar em duplicata** |
| **Seletor só achava o já visitado** *(02/09, D15.1)* | Item nunca aberto não aparecia na busca | Faltava `currentJQL`, e **o duplo do teste devolvia a resposta que eu imaginei** |

Em 27/08 o método pagou de novo: **as entradas da semana não carregavam a descrição**, e editar a partir da folha teria apagado em silêncio o que a pessoa escreveu. Apareceu ao ligar o formulário na tela, antes de ir para o ar.

**Passou a ser método:** todo marco termina com o app aberto no navegador executando o caminho principal, não só com os testes verdes. Registrado em `../../DECISOES.md` e na regra 17 do `CLAUDE.md`.

E é a evidência mais forte a favor da **regra 16**: dev store com uma aba só não mostra o que uso real mostra.

---

## Como mexer nisto

```bash
# Node está fora do PATH nesta máquina
"/c/Program Files/nodejs/npm.cmd" run check        # lint + 460 testes
"/c/Program Files/nodejs/npx.cmd" forge lint
"/c/Program Files/nodejs/npx.cmd" forge deploy --non-interactive
```

O `forge install` já foi feito na `northstack-dev`; enquanto o manifest não mudar de escopo, o deploy sozinho basta.
