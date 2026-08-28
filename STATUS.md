# STATUS — Northstack Apps

**Última atualização:** 2026-08-28 (sessão 16) · Dia 3 de 365 · **Gasto: R$ 0,00 no projeto** (domínio pago à parte)
**Meta 12 meses:** US$ 15.000/mês recorrente · R$ 1M acumulado · Orçamento R$ 10.000

---

## ▶️ Nativelog · código pronto · **o beta pode começar** · 405 testes

| Etapa | Estado |
|---|---|
| **D1–D14** · 26–27/08 | ✅ os 14 dias de código, produção 2.0.0 no ar |
| **Link de instalação** | ✅ **gerado por você em 28/08** |
| **Ensaio geral em site novo** (`nativelog-beta-zero`) | ✅ instalou, apontou, tudo certo — [`BETA.md`](apps/jira-time/BETA.md) |
| **`support@` enviando, não só recebendo** | ✅ 28/08 — sem isso o canal de parceiros não existia |
| **Conta no Reddit + aquecimento** | ▶️ `u/amarildo_dev`, 1 comentário técnico publicado em 28/08 |
| **10 Solution Partners, com e-mail pronto para cada um** | ✅ [`BETA-PARCEIROS.md`](apps/jira-time/BETA-PARCEIROS.md) |
| **Convidar 5–10 instâncias reais** | 🔴 **é aqui que o projeto está parado, e não é problema de código** |

---

## 🔴 A notícia ruim da sessão: a Atlassian Community saiu do recrutamento

Fui ler as regras escritas do fórum antes de ajustar o texto do anúncio. **Não existe versão do anúncio que caiba nelas.** Não é redação ruim, é impossibilidade estrutural:

| O que o anúncio precisa fazer | O que a regra diz |
|---|---|
| Mandar a pessoa para `northstackapps.com` | *"Do only link to the Atlassian Marketplace or Partner Directory, not an external website"* |
| Dizer "me mande um e-mail e envio o link" | *"Don't link to lead-capture or gated assets (for example: forms, contact us pages, or downloads that require an email)."* |
| Dizer que é grátis durante o beta | *"Do not mention special pricing or discounts, including free trials."* |
| Existir como post de anúncio | *"Posts with the explicit intent to sell a product or service, or to drive people to a form or a website, will be removed at the discretion of our moderators."* |

**O único link permitido é o da Marketplace — e a nossa listagem é justamente o que o beta precede.** Não há saída: um anúncio de beta é, por definição, um post que leva a pessoa para fora da Atlassian.

**O que isso custa:** era o canal número 1 do recrutamento, o público mais qualificado que tínhamos. Com o canal 1 (sua rede pessoal) já descartado em 26/08, **sobrou público frio e parceiros**. O risco do beta subiu, e ele já era o risco do projeto. Registrado em [`DECISOES.md`](DECISOES.md).

**O que a Community ainda é:** canal de reputação. As três respostas técnicas continuam valendo e ficam melhores — quem gosta de uma resposta chega até nós pelo perfil, que é o caminho permitido.

**Vale reabrir uma conversa:** com dois dos cinco canais fora, o **canal 1 (rede pessoal)** deixou de ser "o mais caro de abrir mão" e passou a ser talvez o único jeito de conseguir as duas ou três primeiras instâncias. A decisão é sua e continua sendo sua — só mudou o preço dela.

### E uma regra que pegou mais três perguntas

**Necroposting:** *"posting on threads that are six months old or more"*. Você me pediu para trocar a pergunta 2 (fechada pela moderação) e conferir a 3 e a 4. **A 3 e a 4 aceitam resposta — e mesmo assim tiveram que sair**, com 12 e 16 meses de idade.

Troquei as três por perguntas de **junho, abril e junho de 2026**, todas conferidas no navegador: abertas, sem resposta aceita, dentro da janela. Estão em [`COMMUNITY.md`](apps/jira-time/COMMUNITY.md).

**Sobre a resposta 1, que já está publicada:** a thread do Jamil tinha 6 meses e 9 dias. Pela letra da regra, foi necropost. **Recomendo deixar publicada** — ela não cita app nenhum, ajuda quem perguntou, e apagar uma resposta útil para consertar um erro de processo nosso piora as duas coisas. O que muda é daqui para frente.

**⚠️ E um detalhe que engana:** o botão azul **Answer** continua aparecendo no topo de uma thread fechada. O que diz a verdade é o aviso acima da lista de respostas: *"Comments for this post are closed"*. Conferir pelo botão leva à conclusão contrária da correta.

---

## 🔴 O QUE VOCÊ PRECISA FAZER

### 1. Corrigir o nome do app — 2 minutos

Na tela de instalação ele aparece como `nativelog`. **Não quebra nada corrigir**, e explico por quê antes de você clicar.

**São duas strings diferentes, e só uma era nossa.** O painel dentro do item mostra o `title` do `manifest.yml`, que sempre foi `Nativelog` — por isso ninguém percebeu. A tela de instalação mostra o **nome do app no Developer Console**, que o `forge register` criou a partir do nome do diretório e nasceu minúsculo. Nunca escrevemos esse segundo nome; ele só aparece para quem instala de fora, e você foi a primeira pessoa a fazer isso.

**Onde:** developer.atlassian.com/console → **Northstack Apps** → o app → menu lateral → **Settings** → campo do **nome do app** → trocar para `Nativelog` → salvar.

**Por que não quebra o link de instalação:** a tela de distribuição lista **duas** condições que desligam o link — licença no manifest, ou submissão à Marketplace. Renomear não é nenhuma das duas; o link se resolve por app id e ambiente, não por nome.

**⚠️ Um porém conhecido:** existe um defeito da Atlassian (**FRGE-525**) em que o nome novo não se propaga para os ambientes `staging`/`production`. **Depois de salvar, abra o link de instalação numa aba anônima e confira.** Se continuar minúsculo, me avise: eu reimplanto a produção, e se nem assim mudar, o caminho é abrir ticket — foi o que a Atlassian respondeu a quem teve o mesmo sintoma.

### 2. Ajustar o perfil da Community — 10 minutos, antes de qualquer resposta

Passo a passo com os nomes de campo em [`BETA-ANUNCIO.md`](apps/jira-time/BETA-ANUNCIO.md), seção "O que mudar no perfil". Resumo:

| Onde | O quê |
|---|---|
| **id.atlassian.com** (pelo link "Edit in Atlassian account") | Nome público: `Amarildo Pereira _Northstack Apps_` |
| Community → **Edit profile** → About me | **Company** `Northstack Apps`, **Current position** `Founder`, **Short bio** (texto pronto no arquivo) |
| Community → **Edit profile** → Where to find me | **My website**: `https://northstackapps.com` |

**Por que o campo My website resolve meio problema:** a regra proíbe link externo **dentro do post**. O campo de perfil é do perfil. É o caminho legítimo para alguém que gostou de uma resposta chegar até nós — **ser encontrável não é anunciar**.

**Por que antes e não depois:** a regra é *"disclose your company affiliation in the text of your post as well as your profile name"*. Responder identificado desde a primeira resposta é honesto; acrescentar a empresa depois, na véspera de pedir o lozenge, é o que parece disfarce.

### 3. Publicar as respostas — uma por dia

Textos prontos e conferidos em [`COMMUNITY.md`](apps/jira-time/COMMUNITY.md).

| # | Pergunta | Detalhe |
|---|---|---|
| 2 | [Total Time Spent by user and by organization](https://community.atlassian.com/forums/Jira-Service-Management/Total-Time-Spent-by-user-and-by-organization/qaq-p/3243332) | O autor diz que testou vários apps e **nenhum mostrava o número certo**. Ninguém na thread explicou por quê. Nós explicamos |
| 3 | [log all of my work for the week in one place](https://community.atlassian.com/forums/Jira-questions/Is-there-any-way-to-log-all-of-my-work-for-the-week-in-one-place/qaq-p/3225964) | É literalmente a pergunta que o nosso produto responde — **e por isso a resposta não pode terminar em "instale o meu app"** |
| 4 | [client invoicing from Jira worklogs](https://community.atlassian.com/forums/App-Central-questions/How-does-your-team-handle-client-invoicing-from-Jira-worklogs/qaq-p/3253898) | **Clique em "Join group" antes** — é no App Central, que é um grupo |

**Cada uma tem um "⚠️ conferir antes de postar".** São coisas que eu não pude confirmar na nossa instância; a que mais importa é a da resposta 3 (o parágrafo do painel de detalhe). **Se não confirmar, corte o parágrafo** — a resposta se sustenta sem ele, e é melhor perder um parágrafo do que ensinar um caminho que não existe.

### 4. Me mande o link de instalação

Você gerou e testou, mas eu não tenho a URL. **Ela não está colada em texto nenhum ainda** — o post do r/jira e o e-mail para os parceiros dependem dela.

### 5. r/jira — **é comentário no megathread, não post**

Você anotou a regra 5 ("Recruitment is allowed") como possível encaixe. **Fui ler: ela é sobre vaga de emprego** — pede que se declare salário — e contém *"do not attempt to recruit unpaid work"*. **Pedir testadores não pagos por ali seria invocar a regra que nos pune.**

O caminho é a regra 1. O megathread fixado diz, no corpo escrito pela moderação, que ele é *"the only place on the sub where you should post the following: advertising, market research, **feedback requests**"*. Convite de beta é exatamente um *feedback request*.

**Onde:** https://old.reddit.com/r/jira/comments/1s0oeox/product_selfpromotion_megathread/ — comentário de primeiro nível. Texto pronto em [`BETA-ANUNCIO.md`](apps/jira-time/BETA-ANUNCIO.md), com a seção sobre como não parecer texto de IA (regra 2 do sub).

**Seu aquecimento é o que compra a tolerância.** A regra 1 diz: *"If you have a history of contribution to the sub, mistakes will be met with a warning. If you do not, they will be met with a ban."* A semana que você começou hoje não é formalidade.

**⚠️ E um alerta de expectativa:** o megathread tem 5 meses, 95 comentários, e os mais votados têm **3 pontos**. **É um depósito, não uma vitrine.** Poste, mas não conte o canal como resolvido depois de postar — o valor real do r/jira está nos comentários técnicos como o que você publicou hoje.

### 6. Escrever para os 10 Solution Partners — **prontos, um a um**

**➜ [`BETA-PARCEIROS.md`](apps/jira-time/BETA-PARCEIROS.md).** Dez parceiros brasileiros, cada um com site, nível, o motivo de ter sido escolhido e **o e-mail já escrito para ele**, na ordem de envio. Um por dia, pelo `support@`.

**Mudei o pedido, e isso importa mais que o texto.** O canal 5 pedia que o parceiro levasse o app **aos clientes dele**. Ninguém faz isso: nenhum parceiro instala app não listado, sem revisão, de um desconhecido, no Jira de produção de quem paga a conta dele.

**O pedido agora é a instância do próprio parceiro.** Consultoria fatura hora — todos eles têm um Jira interno onde os consultores apontam por cliente e alguém fecha no fim do mês. Risco zero, uma pessoa decide, e ele ganha uma ferramenta que resolve um problema dele. **E é justamente o tipo de instância que o beta precisa:** dados sujos de anos, muitos projetos, e alguém que confere os números porque eles viram fatura.

**Duas coisas que eu não fiz, de propósito:**
- **Não inventei nenhum endereço de e-mail.** Chutar `contato@` é a via rápida para o spam. O arquivo indica o botão **Contact** do perfil no Partner Directory e o caminho pelo LinkedIn.
- **Descartei a CSP Tech**, que caberia bem no perfil, porque eles publicam apps de Jira na Marketplace. É a única da lista com motivo e capacidade para construir o nosso. O arquivo explica e sugere um substituto — **e se você discordar, a decisão é sua.**

---

### ⚠️ E uma coisa que **não** se deve fazer ainda

**Não ligue a licença no manifest, e não submeta à Marketplace, antes de o beta terminar.** Da própria tela do Developer Console:

> *"once your app has a license in the app manifest, or has been submitted for listing on Marketplace, **it can't be shared via installation link**."*

Ligar a licença agora **mata o beta**: o link privado para de funcionar no instante em que a licença existe. **Ordem certa:** beta sem licença → beta termina → licença e faixas de preço → submissão.

---

## 💰 Preço aprovado — duas editions

Aprovado por você em 27/08, registrado em [`DECISOES.md`](DECISOES.md). **Não entra no Developer Console agora**, pelo motivo acima.

| Usuários | Standard | Pro | Clockwork Pro | Tempo |
|---|---|---|---|---|
| até 10 | Grátis | Grátis | Grátis | US$ 10 |
| 50 | US$ 40 | US$ 64 | US$ 65 | US$ 260 |
| 250 | US$ 195 | US$ 294 | US$ 295 | US$ 1.070 |
| 1.000 | US$ 450 | US$ 650 | US$ 610 | US$ 2.428 |

O código já está pronto para os dois mundos: `lib/licenca.js` trata ausência de licença como "libera", então **ligar a licença não muda comportamento nenhum** — só passa a haver o que conferir.

---

## 📊 Onde o projeto está

**Três dias de calendário, 14 marcos, 405 testes, zero real gasto. O código da v1 acabou** — e o ensaio geral de 28/08 provou que o caminho de instalação funciona numa instância criada do zero.

**O que sobra é o que sempre foi o risco, e ele piorou nesta sessão:** achar 5 a 10 instâncias reais, agora sem o canal mais qualificado. Isso não é trabalho de código — é convencer estranhos a instalar um app novo de um desenvolvedor desconhecido, e a regra 16 não deixa pular.

**Caminho crítico, em dias:** 21 dias de beta + 10 a 15 dias úteis de fila de revisão da Atlassian. Os 14 dias de código foram a parte fácil, e a mais rápida.

**O contador que importa não é de testes, é este:** `0 de 5` instâncias reais usando de verdade.

**O que se moveu em 28/08:** o `support@` passou a enviar, a conta do Reddit existe e já tem uma contribuição técnica no ar, e os dez e-mails para parceiros estão escritos. **Nada disso é uma instância ainda** — é a infraestrutura de conseguir a primeira. O canal com a maior chance de virar número é o de parceiros, e ele é o mais lento; por isso começa hoje.

---

## 📄 Histórico — D8 a D13 e as sessões anteriores

### D12 — instância grande

Dois defeitos silenciosos, do mesmo formato: **um número que parecia completo e não era.**

**Paginação.** O endpoint de worklog devolve no máximo 1000 por página e o de projetos 50, e o código lia a primeira página e somava. Item com anos de manutenção, ou instância com mais de 50 projetos, produzia total curto sem avisar. Agora pagina — e o laço tem **três saídas, das quais duas não confiam no servidor**: página vazia, página menor que a pedida, e só então o total informado. Servidor que ignore `startAt` devolveria a mesma página para sempre e prenderia o resolver até o timeout do Forge. Tem teste para isso.

**Lotes.** A semana lê um item por chamada, e `Promise.all` sobre sessenta itens dispara sessenta requisições simultâneas. O Jira responde 429, a folha volta cheia de buracos, e o usuário lê "alguns itens não puderam ser lidos" numa semana em que estava tudo bem. Agora são cinco por vez. **Numa folha de ponto, completa e devagar ganha de rápida e furada** — o número errado ninguém percebe, a demora todo mundo perdoa.

---

## ✅ D10 — cinco línguas

EN, pt-BR, ES, DE e FR, no i18n nativo do Forge.

**Cada chamada leva o inglês embutido como padrão.** Se uma tradução falhar ao carregar, ou faltar uma chave, a tela mostra inglês — nunca a chave crua.

**As frases com valor usam marcador `{0}`, e isso importa mais do que parece:** em alemão o verbo vai para o fim. Montar frase por concatenação produz ordem de palavras inglesa vestindo palavras alemãs. Com marcador, cada tradução decide a ordem.

**Um teste segura os cinco arquivos** no mesmo conjunto de chaves, sem valor vazio, com os mesmos marcadores, e aponta qualquer frase longa ainda idêntica ao inglês. i18n apodrece em silêncio: alguém acrescenta uma frase, esquece quatro arquivos, e o app fica metade traduzido para quem não fala inglês — e ninguém percebe, porque ninguém da equipe usa o app em alemão.

---

## ✅ D9 — visão de equipe, somente leitura

Aba "Equipe": escolhe o projeto, vê a semana por pessoa com totais por dia. **Não há caminho de escrita nesse código, e não vai haver** — corrigir hora alheia continua sendo pela tela do Jira.

**Quem vê o quê é decidido pelo Jira, não por nós.** A chamada é `asUser`, então projeto que a pessoa não enxerga não devolve nada. **Não existe modelo de permissão nosso**, e é isso que impede o app de virar um vazamento de quem trabalhou em quê.

O formato reforça a decisão: sai **totais por pessoa e por dia**, nunca lançamento editável. Um teste afirma o conjunto exato de campos de uma linha, para que acrescentar um id de worklog ali seja um ato deliberado e não um deslize.

---

## ✅ D8 — exportação CSV

Uma linha por lançamento, **nunca somado**. Somar linha crua é tabela dinâmica de trinta segundos; separar um total que já veio somado é impossível.

Duas colunas de duração, porque servem a leitores diferentes: a notação do Jira para conferir contra a tela, e **horas decimais porque ninguém soma "1h 30m" numa planilha**.

O filtro é por exclusão, apresentado como desmarcar projeto. **Quem fatura por cliente raramente sabe listar os projetos que quer; sabe listar os dois que não quer** — o interno e o de férias.

**E há uma parte que é segurança, não formatação:** todo campo que começa com `=`, `+`, `-`, `@`, tab ou retorno de carro ganha um apóstrofo na frente. Uma descrição que começa com `=` vira fórmula ao abrir no Excel, e existe uma família inteira de ataques que usa exatamente isso para rodar comando na máquina de quem abre. **Quem escreve a descrição é qualquer pessoa do Jira; quem abre o CSV costuma ser o financeiro.**

Não há download de arquivo dentro de um app Forge — o `router.open` só aceita http(s). Então a tela mostra o CSV numa caixa e **diz que não dá**, em vez de oferecer um botão que finge baixar.

---
## 📄 Histórico — D7 e as sessões anteriores

### D7 — corrigir a folha sem sair da folha

Navegação de semanas (anterior / esta / próxima) e **Edit e Delete em cada entrada da semana**. Corrigir o lançamento de sexta não devia exigir caçar o item de sexta.

**Duas coisas precisaram mudar de lugar, e uma delas valeu por si:**

O formulário virou arquivo próprio, porque a segunda tela passou a precisar dele. Duas cópias de um formulário que grava hora sairiam de sincronia na primeira mudança de regra — e a cópia atrasada gravaria errado sem ninguém notar.

E editar/apagar passaram a aceitar o id do item **pelo payload**, porque uma `globalPage` não tem item no contexto do Forge. **Isso não afrouxa nada, e o código explica por quê:** a identidade continua vindo do contexto e nunca do cliente, e as duas operações continuam passando pela conferência de autoria que lê o worklog no Jira. Um id forjado só alcança worklogs cujo autor é quem está pedindo — os próprios, que a pessoa já pode editar. Tem teste que manda `accountId` no payload e confirma que é ignorado.

### 🐞 Achado antes de ir para o ar

**As entradas da semana não carregavam a descrição.** Editar a partir da folha abriria o formulário com Description vazio, e **salvar apagaria o que a pessoa escreveu** — em silêncio, porque para o app é uma edição legítima com descrição em branco. Apareceu enquanto eu ligava o formulário na tela; corrigido no leitor, com teste que diz para que serve.

**Verificado no navegador:** Edit numa entrada de 1m abre preenchido na própria linha → 1m para 5m → o dia vai de 9m para 13m e a semana de 3h 9m para 3h 13m → Cancel descarta limpo → Previous week mostra a semana vazia anterior com os sete dias.

---

## ✅ D6 — "Minha semana"

Uma `globalPage` com a folha de ponto da semana por dia. **Não existe tabela nossa por trás dela:** a semana é remontada do worklog nativo a cada abertura.

**São dois passos, e o segundo é o ponto.** O JQL descobre *quais itens* têm worklog meu na janela — esse é o uso legítimo do JQL, busca ampla. O endpoint do item devolve *as entradas*. O JQL não sabe fazer a segunda parte: ele seleciona itens, nunca lançamentos, e a coluna Time Spent do resultado é o total da vida inteira do item, não o da semana. **Quem "otimizasse" isso numa chamada só transformaria a folha em totais vitalícios, e ninguém perceberia olhando.** Os testes seguram as duas chamadas no lugar.

**O fuso é o motivo de o D5 ter escrito um contrato para isto.** O resolver devolve instantes e nunca dias; quem decide em que dia cada hora cai é o navegador, a única parte do sistema que conhece o fuso de quem está olhando. A janela do JQL é de propósito um dia e meio mais larga de cada lado — o JQL resolve `worklogDate` no fuso da instância, e o corte fino acontece no passo 2, pelo instante real. Alargar é barato; perder um dia de apontamento não é.

**O que a lista não tem é dito, não escondido atrás de um total:** item que não pôde ser lido aparece pelo nome, e lista cortada avisa que o total está abaixo da semana real. A página também diz que hora apontada há segundos pode não ter chegado ao índice de busca ainda — mais barato que alguém achar que perdeu horas.

**Verificado no navegador:** a página abre pelo menu Apps e mostrou **3h 9m** da semana real, com as seis entradas de quarta agrupadas no dia local certo e **3h de quinta no SCRUM-3 "Teste Workratio"** — o item que você criou ontem para conferir a identidade do `workratio`, achado sozinho pela busca de dois passos.

---

## ✅ D5 — erros do núcleo

### 🐞 O beco sem saída, que era o achado de verdade

Timer rodando no item A, e A é apagado ou você perde permissão nele: gravar dá 404 para sempre, e o painel do item B oferecia **só "Start here"**, que também falha. **Não havia botão de descartar em lugar nenhum**, porque o Discard só aparecia quando o timer era do item que você estava olhando. Resultado: sem poder apontar em item nenhum, sem nada na tela para fazer a respeito. O aviso agora **sempre** traz uma saída, e diz qual foi a falha.

### Permissão perguntada na abertura, não na hora de gravar

Tratar bem um 403 depois de a pessoa cronometrar três horas **não devolve as três horas**. Sem `WORK_ON_ISSUES` o botão Start nem aparece, com uma frase dizendo por quê; Edit e Delete seguem as permissões de worklog próprio do mesmo jeito.

**E uma consulta de permissão que falha nunca tranca ninguém.** Se o Jira não responde, o app assume que sim e segue: a gravação de verdade ainda recusa com frase clara, e nesse caminho nada se perde. Trancar alguém fora da própria folha de ponto por causa de uma consulta *nossa* que falhou seria transformar um problema nosso no problema da pessoa.

### Timer esquecido não vira worklog sozinho

Parar um timer de mais de 12 horas devolve "confira antes" e a tela mostra o total por extenso, com **Log / Discard / Keep running**. Gravar 4d 6h em silêncio suja a folha de um jeito que só aparece na fatura. Trocar de item **não** pergunta de novo — o aviso já mostra o total antes do clique, e perguntar duas vezes é atrito sem ganho.

**Este é o único caminho do D5 que não deu para verificar no navegador:** reproduzir exige um timer de 12 horas. Está coberto por 5 testes, e digo isso em vez de deixar implícito.

### Fuso

O dia de um apontamento é o dia que a pessoa viveu. O resolver do Forge roda em UTC e não tem como saber que 23h30 de terça em São Paulo ainda é terça. **Agrupar por dia é do navegador** — virou contrato escrito no topo de `painel.js` porque o D6 e o D7 dependiam disso, com testes que valem em qualquer fuso em vez de só em UTC.

---

## 📣 Community — resposta 1 publicada em 27/08

**[A resposta está no ar.](https://community.atlassian.com/forums/Jira-questions/JIRA-Time-Tracking-How-to-filter-Issues-where-logged-time-gt/qaa-p/3281287#M1190210)** O texto publicado ficou melhor que o rascunho, e a diferença vale como método.

O rascunho respondia **a pergunta**. O publicado responde **a situação** — ele estava usando o Structure, e daí saíram as três adições:

| Adição | Por quê |
|---|---|
| **`workratio > 100`** | O Structure marca 100% quando o *remaining* zera, não quando passa do estimado. Quem reclama de "passou do previsto" quer os itens **acima do estimado**. **Provavelmente é esta linha que resolve o problema dele** |
| **Original Estimate editado depois de apontar** | Segunda forma de a identidade quebrar, e mais comum que a primeira |
| **Filter by Formula do Structure** | Ele **já tem** a ferramenta que faz a comparação direta que o JQL não faz. Mandá-lo ao JQL quando a resposta está no app que ele já paga seria a resposta pior |

**A lição para as próximas três:** olhar o que a pessoa mencionou de passagem — a ferramenta, a versão, o time — costuma valer mais que a técnica.

**Aprendizado de formato, já aplicado:** o editor da Community recusa `×` e HTML de colagem, e sinal de comparação em prosa sai errado. As respostas 2, 3 e 4 estão agora em **blocos de texto puro, só ASCII**, conferidos por script — é copiar e colar.

**Vale acompanhar a resposta 1 alguns dias.** É a que tem mais chance de virar resposta aceita: a thread estava sem uma, e o `workratio > 100` provavelmente é o que ele queria.

> **Corrigido em 28/08:** a última frase original desta seção dizia que uma resposta aceita faria "o anúncio do beta partir de outro patamar". **Não vai haver anúncio do beta na Community** — ver a seção no topo. Uma resposta aceita continua valendo, só que para outra coisa: para o dia da listagem, e para o pedido do Partner lozenge.

---

## 📄 Histórico — D4 e as sessões anteriores

### D4 — apontamento manual: criar, corrigir e apagar a própria entrada

Entregue e **verificado no navegador, na `northstack-dev`**, não só em teste. Deploy **2.9.0**, ainda elegível a Runs on Atlassian. **231 testes.**

### O que o painel faz agora

| Ação | Estado |
|---|---|
| **Log time manually** — duração, dia, hora e descrição | ✅ gravado como worklog nativo, no seu nome |
| **Lista "Your time on this item"** com o total | ✅ lê pelo endpoint do item, nunca por JQL |
| **Edit** — corrige duração, início e descrição | ✅ a descrição volta para o campo e não se perde |
| **Delete** — apaga do Jira, com confirmação na própria linha | ✅ |

**Roteiro do navegador, executado inteiro:** lançar `45m` com descrição → aparece na lista, total de 6m vai a 51m → **Edit** para `30m` → total cai para 36m e a descrição continua lá → **Delete** → confirmação → total volta a 6m. Nada ficou pendurado.

### Três decisões que valem ser vistas

**1. A regra "só a própria entrada" é do servidor, não da tela.** O `worklogId` vem do navegador; se a conferência morasse na interface, um pedido montado à mão editaria ou apagaria a hora de um colega. Antes de qualquer PUT ou DELETE o app **lê o apontamento e confere o autor**.

E há um detalhe que só aparece quando se olha de perto: **a permissão do Jira não serve de guarda aqui.** Quem tem "editar worklog de qualquer um" passaria direto por ela. A nossa regra é mais estreita que a do Jira **de propósito** — este app é a folha de ponto de quem está olhando, não uma ferramenta de administrar hora alheia. Quem precisa mexer na hora dos outros usa a tela do Jira, e o app diz isso na frase de recusa.

**2. Apontamento manual não encosta no timer.** Lançar a sexta esquecida numa segunda-feira **não mata o cronômetro que está rodando agora** — tem teste em cima disso. O caminho manual não toca no KVS.

**3. Um apontamento não passa de 24 h.** O Jira aceita; a gente não. Quem digita "8" querendo 8 horas e vê a interface ler "8d" acabou de lançar uma semana num dia. Recusar custa um aviso; deixar passar custa a confiança na folha de ponto, que é o produto. Quem trabalhou 30 h lança em dois dias — que é onde o trabalho aconteceu.

### 🐞 O navegador achou mais um, e esse era grave

**Na primeira versão do formulário, só a última letra do que se digitava sobrevivia.** Digitar `45m` deixava `m` no campo. Passou por 231 testes e pelo `forge lint` sem um arranhão — porque não é um defeito de lógica, é de plataforma.

**Causa:** os campos estavam *controlados* (`value` + `setState` a cada tecla). No UI Kit 2 o componente é desenhado pelo Jira, do outro lado de uma ponte assíncrona: o `value` que volta do re-render chega **depois** da tecla seguinte e sobrescreve o que a pessoa acabou de escrever.

**Correção:** `useForm`, do próprio `@forge/react`, que registra os campos como **não-controlados** — o valor mora no formulário, digitar não provoca re-render, nada é sobrescrito. É o caminho que a Atlassian expõe exatamente para isso.

**A lição é a mesma da sessão de manhã, e agora são três defeitos seguidos com a mesma assinatura:** *teste automatizado cobre a nossa lógica; só o navegador cobre a plataforma.* Passei a abrir o app no navegador ao fim de cada marco, e não apenas quando algo parece errado.

---
## 🐞 Sessão 11 — os dois defeitos do seu teste

Testar de verdade achou o que 97 testes automatizados não achavam: **os dois eram defeitos de estado da tela**, não de servidor. Nenhum dos dois aparece numa dev store com uma aba só.

### 1. O painel mentia — "Running" para um timer já encerrado

A aba deixada aberta no ticket antigo continuava com o relógio andando depois de o timer ter sido encerrado em outra aba. **É o pior tipo de mentira para este app:** relógio andando é uma afirmação de que o tempo está sendo contado, e a pessoa confia nela.

A causa é de arquitetura, não de descuido: **o painel não é dono da verdade.** O mesmo timer é mexido em outra aba, no celular, ou pelo próprio Jira — então tem que reconsultar. Agora reconsulta por três gatilhos, porque nenhum é garantido sozinho:

- **volta do foco da janela** e **a aba voltando ao primeiro plano** (`visibilitychange`) — o caso que você viveu;
- **a cada 30 s**, e só enquanto há relógio na tela — é o único que funciona com duas janelas visíveis lado a lado, e a rede de segurança caso o sandbox do UI Kit não entregue os eventos.

Quando a reconsulta descobre que o timer sumiu, a tela **diz isso** em vez de o relógio evaporar sem explicação: *"This timer is no longer running here — it was stopped, discarded or moved somewhere else."* A frase é deliberadamente neutra — a aba antiga não tem como saber se virou worklog, foi descartado ou mudou de item.

**Dois cuidados que estão no código e valem registro:** a reconsulta **não roda durante uma operação** (Stop no ar + leitura no meio do caminho = mostrar o estado velho depois do certo), e **falha de reconsulta não apaga a confirmação de gravação da tela** nem pisca erro que você não provocou.

### 2. O relógio demorava ~20 s para começar — cold start

Você clicou em Start e a tela ficou idêntica a antes do clique por 20 segundos. **Um cronômetro que não se move ao clicar em Start parece quebrado**, e é o primeiro segundo do produto que a pessoa vê.

O relógio agora começa a andar **no instante do clique**, sem esperar o resolver. E aqui estava a parte não óbvia: **mostrar otimista sozinho teria criado um defeito pior.** O servidor marcava o início na hora em que *ele* executava — 20 s depois — então a confirmação faria o relógio **pular para trás**, de 0:20 para 0:00, bem no momento em que a pessoa está olhando. E, calado, esse mesmo atraso **comia os primeiros 20 segundos do apontamento de todo mundo**.

Corrigido dos dois lados: **o navegador manda o instante do clique junto**, e o servidor o adota — mas só depois de validar. Proposta no futuro (relógio adiantado), velha demais ou ilegível cai para o relógio do servidor. A tolerância é de **2 minutos**, que cobre o pior cold start medido com folga.

> **Por que aceitar um carimbo do navegador não é brecha:** quem usa o app **já pode lançar a hora que quiser em seu próprio nome pela tela do Jira**. O `asUser()` não concede nada que a pessoa não tenha. O que a validação protege é contra **relógio de máquina errado**, não contra o usuário.

### Verificado no navegador, não só em teste

Primeira sessão em que o Chrome chegou até mim — nas anteriores não havia ferramenta de navegador, e foi por isso que o D3 ficou dependendo de você. Rodei os dois casos na `northstack-dev`, no SCRUM-1:

| Caso | Resultado |
|---|---|
| Clicar Start com o resolver frio | **`Running 0:02`** dois segundos após o clique — antes eram ~20 s |
| Deixar 10 s correndo | **`0:24`**, contando para a frente — **a confirmação do servidor não fez o relógio pular para trás** |
| Descartar o timer numa 2ª aba e olhar a 1ª | A aba antiga **se corrigiu sozinha**, com a frase de explicação — e **sem nunca receber foco**: quem pegou foi o intervalo |

### O que mudou no código

| Arquivo | O que é |
|---|---|
| `src/frontend/estado.js` | **Novo.** Toda a lógica de tela que não depende de React: relógio otimista, quando reconsultar, o que dizer quando o estado mudou por fora |
| `src/frontend/index.jsx` | Passa a ser só a árvore de componentes e a fiação |
| `src/lib/time.js` | `inicioDoTimer` — a validação do carimbo do navegador |
| `src/lib/timer.js` · `resolvers/painel.js` | O instante do clique atravessa até o KVS |
| + testes | **135 testes** (eram 97) · `forge lint` limpo · deploy **2.6.0**, ainda elegível a Runs on Atlassian |

**Por que um arquivo novo em vez de arrumar o `index.jsx`:** defeito de estado de tela sem teste volta. `estado.js` não importa `@forge/react` nem `@forge/bridge`, então os dois defeitos ficaram cobertos por teste de verdade — inclusive o registro e a remoção dos ouvintes de evento, e o caso do sandbox do Forge não oferecer `window` nem `document`.

### Uma lição de método, e ela é sobre a regra 16

**Nenhum dos dois defeitos era invisível — eram invisíveis para mim.** Os 97 testes cobriam o servidor, que estava certo; o navegador é que mentia. Bastou **uma pessoa usando duas abas** para achar os dois em minutos.

É exatamente o argumento da **regra 16** (beta com 5–10 instâncias reais), agora com evidência própria em vez de princípio: dev store com uma aba só não mostra o que uso real mostra. Reforça a prioridade de recrutar o beta desde já.

---

## 📄 Entregue na sessão 10 — D3

### D3 — o timer vira worklog nativo

| Arquivo | O que é |
|---|---|
| `src/lib/worklog.js` | Escrita e leitura do worklog nativo, com `requestJira` injetado |
| `src/resolvers/index.js` | **É aqui que mora o `asUser()`** — a linha que faz o produto existir |
| `painel.js` · `timer.js` | Orquestração do "parar": grava, confere, encerra |
| + testes | **97 testes** · `forge lint` limpo · deploy **2.5.0**, ainda elegível a Runs on Atlassian |

#### A decisão que define o D3: **grava primeiro, apaga o timer depois**

No D2 a ordem era a inversa — apagar o registro antes de gravar, para não arriscar worklog duplicado. **Inverti de propósito.** Se o Jira devolver 503 na hora do "parar", a ordem antiga jogaria fora três horas que a pessoa cronometrou. Num app de apontamento esse é o pior desfecho que existe — e *"as horas somem"* é reclamação catalogada da categoria.

Agora, se a gravação falha: **o timer continua de pé**, o painel diz o motivo em frase clara — *"Your time is safe and still running — press Stop again in a moment"* — e o botão vira **Stop and retry**.

**E a duplicata, que era o medo original?** Resolvida com leitura, não com fé:

- Antes do POST, o timer é marcado como "gravação em curso" no KVS. **Marcar antes, não depois**: se a função do Forge morrer no meio do POST, nenhum tratamento de erro roda, e a marca é a única coisa que sobrevive.
- Numa retentativa, o app **lê os worklogs do item** e procura um igual — mesmo autor, mesmo instante, mesma duração — antes de escrever. Se acha, não grava de novo e diz *"Already logged"*.
- **Essa leitura usa o endpoint do item, nunca JQL.** É exatamente a regra de arquitetura que saiu do spike: o índice de busca atrasa ~5,7 s e aqui estamos perguntando sobre algo escrito há segundos. **A decisão do dia 0 pagou a conta no dia 3.**

E se a própria conferência falhar? **Grava assim mesmo.** Uma duplicata a pessoa vê e apaga; três horas perdidas ela não recupera.

#### Duas decisões menores das quais você pode discordar

1. **Timer de menos de 1 minuto não vira worklog.** O Jira trabalha em minutos, e um timer de 8 segundos é clique errado, não trabalho. Marcado para revisitar no beta — se alguém reclamar, o número muda.
2. **Trocar de item grava o timer anterior antes de começar o novo — e se essa gravação falhar, o novo timer não começa.** Preferi travar a atrapalhar: começar timer novo por cima de hora não gravada é como a hora some sem ninguém perceber.

---

### D2 — o timer do painel do item

| Arquivo | O que é |
|---|---|
| `src/lib/timer.js` | Máquina de estados do timer, com o armazenamento **injetado** — a regra "um timer por pessoa" é testada de verdade, não simulada |
| `src/resolvers/painel.js` | As 4 operações do painel: estado, iniciar, parar, descartar |
| `src/resolvers/index.js` | Só fiação: liga o KVS de verdade nas operações acima |
| `src/frontend/index.jsx` | O painel: relógio andando, Start / Stop / Discard, e os avisos |
| + 3 arquivos de teste | **60 testes**, todos passando · `forge lint` limpo |

**Três decisões que valem ser vistas:**

1. **Clicar "Start" duas vezes no mesmo item não faz nada.** Sem isso, um clique duplo viraria um worklog de 2 segundos no Jira de alguém. É o tipo de sujeira que a gente catalogou nas avaliações dos concorrentes.
2. **Trocar de item encerra o timer anterior e o devolve fechado**, com o tempo dele, para o D3 gravar como worklog. Timer órfão acumulando é reclamação registrada da categoria.
3. **A identidade vem do contexto do Forge, nunca do frontend.** Tem teste que manda um payload pedindo o timer de outra conta e confirma que é ignorado.

**Duas correções de rota:**

**1. `storage` deprecado.** O `forge lint` avisou que o `storage` do `@forge/api` está deprecado. Migrei para `@forge/kvs` no mesmo dia. Custou 10 minutos agora; custaria uma rodada de revisão da Atlassian depois.

**2. O CI pegou uma que eu tinha deixado passar.** O primeiro push do D2 **falhou no GitHub Actions**: o template do Forge tinha trazido `@forge/react` e `@forge/bridge` em versão **prerelease `-next`**. Na minha máquina funcionavam — já estavam baixadas. Num runner limpo o `npm ci` deu 404, porque a Atlassian rotaciona esses tarballs. Trocado por versões estáveis; `npm ci` do zero agora reproduz.

Isso contraria a **regra 12** do `CLAUDE.md` ("nada de beta como dependência central") e eu deixei passar por confiar no scaffold oficial. Fica a lição registrada em `DECISOES.md`: **o que o template gera não está isento das regras do repositório.** E o CI se pagou no segundo dia de vida — sem ele, isso apareceria só na submissão.

Deploy atual: **2.3.0, ainda elegível a Runs on Atlassian**.

### Recrutamento do beta — canal 1 descartado

Registrado em [`BETA-RECRUTAMENTO.md`](apps/jira-time/BETA-RECRUTAMENTO.md). Nova ordem: **Atlassian Community → r/jira → Solution Partners**, mais o **fórum de desenvolvedores** (`community.developer.atlassian.com`) como canal novo.

**O que isso custa, e eu prefiro dizer agora:** o canal 1 era o único de público quente e o de maior conversão. Sem ele, **todos os canais restantes dependem de estranhos confiarem num app desconhecido**, e as duas ou três primeiras instâncias — as que destravam as outras — ficam mais caras. O ponto de decisão do D14 fica mais provável de bater. Se bater, a primeira coisa a reconsiderar é reabrir o canal 1.

**Sobre o fórum de desenvolvedores:** é um público de **construtores, não de compradores** — quase ninguém ali administra a instância que queremos no beta. Entra por três motivos indiretos: é onde a medição dos 5,7 s de atraso do índice interessa de verdade, é onde os desenvolvedores dos Solution Partners leem, e é onde vamos ter que perguntar sobre `asUser` e revisão da Marketplace de qualquer jeito. **Com um cuidado registrado:** é o único público que consegue copiar a cunha a partir da descrição dela. Lá a gente compartilha **a medição, não a solução** — nada de código do `asUser`, nada do desenho do KVS.

### Atlassian Community — 4 respostas prontas para publicar

[`apps/jira-time/COMMUNITY.md`](apps/jira-time/COMMUNITY.md). Quatro perguntas reais, **três delas sem resposta aceita**, com o texto pronto:

| Pergunta | Data | Por que essa |
|---|---|---|
| [logged time > remaining time](https://community.atlassian.com/forums/Jira-questions/JIRA-Time-Tracking-How-to-filter-Issues-where-logged-time-gt/qaq-p/3193664) | 18/02/2026 | 4 respostas existentes, todas "compre o app X". **Existe solução nativa** e ninguém deu |
| [worklog per month](https://community.atlassian.com/forums/Jira-questions/worklog-per-month-time-tracking/qaq-p/3173461) | 10/01/2026 | A resposta aceita resolve comprando. Ninguém explicou **por que** o JQL não devolve o número |
| [Automation sum worklogs](https://community.atlassian.com/forums/Jira-Service-Management/Help-with-Automation-and-JQL-Query-for-Author-Worklogs/qaq-p/3091426) | 18/08/2025 | Todo mundo discutiu *como* somar. **Ninguém viu que a abordagem falha justo no caso que ele quer pegar** |
| [worklog gadget](https://community.atlassian.com/forums/Jira-questions/why-am-i-not-seeing-worklog-as-a-gadget-to-include-on-my/qaq-p/3011120) | 01/05/2025 | Pergunta de iniciante, resposta curta. Serve para variar o tom |

**Regras que segui:** nenhum link para o Nativelog, nenhum concorrente pelo nome, e **uma resposta por dia** — quatro no mesmo dia, numa conta nova, parecem exatamente o que não queremos parecer.

**Três das quatro têm um "⚠️ conferir antes de postar".** A da resposta 1 é a que importa: a solução se apoia numa identidade algébrica (`workratio > 50`) que **eu deduzi e não medi**. O arquivo traz os 4 passos para conferir na `northstack-dev` em 5 minutos. **Se não bater, não postar** — errar numa resposta técnica custa mais reputação do que quatro acertos ganham.

---

## 🟢 CUNHA PROVADA — spike 2.1.0, 26/08/2026, 5/5 OK

| Passo | Resultado |
|---|---|
| **`POST` worklog `asUser`** | **HTTP 201** · `started` retroativo · **autor = Amarildo Pereira** |
| **Autor == usuário real** | **`712020:9b4086b1-…`** — o worklog é **da pessoa, não do app** |
| **JQL `worklogAuthor = currentUser()`** | **Achou na 3ª tentativa, após 5,7 s** |
| Painel nativo | `timespent=10800s` |
| Limpeza | HTTP 204 |

**A hipótese estava certa: era latência de índice, não falha de fidelidade.** O dado sempre esteve correto; só a busca demorou a enxergar. Valeu ter medido em vez de supor.

**Bônus confirmado pelo deploy:** escrever worklog via `asUser` **não** invalida a elegibilidade a **Runs on Atlassian**.

### Isso virou regra de arquitetura, antes da primeira linha do produto

> **Ler worklog pelo endpoint do item** (`/issue/{key}/worklog`). **JQL só para busca ampla**, nunca para conferir o que acabou de ser gravado.

Aqueles 5,7 s explicam a reclamação que eu tinha catalogado do Clockwork Pro — *"delay in time logs appearing in Jira and in the timesheet"*. **Um defeito da categoria virou decisão nossa.** Registrado em `DECISOES.md`.

### Spike encerrado

`forge uninstall` executado — a dev instance está limpa. O código fica em `apps/jira-time/spike/` como registro da evidência.

---

## 📄 Entregue na sessão 9 — histórico

- **[apps/jira-time/LISTING.md](apps/jira-time/LISTING.md)** — nome, tagline, highlights, descrição, 3 editions com faixas de preço e 3 screenshots descritos
- **[apps/jira-time/PLANO-V1.md](apps/jira-time/PLANO-V1.md)** — arquitetura Forge, módulos, modelo de dados, 8 semanas de marcos e o que precisa de você em cada um
- **`DECISOES.md`** — cunha provada, regra de leitura, nome, desvio consciente da regra 10

### Nome: `Nativelog`

Busca na Marketplace em 26/08/2026: **zero apps** com esse nome ou parecido. `Loggd` também livre; `Worklogic`, `Truelog` e `Nativa` colidem. O nome diz a cunha — *native* + *worklog*.

### ⚠️ Dois pontos levantados antes da aprovação — ambos aceitos

**1. Desviei da regra 10 de propósito.** Ela descreve 3 planos fixos de US$ 19–79, que é o modelo da Shopify. A Atlassian cobra **por assento com faixas** e o padrão da categoria é **grátis até 10 usuários** — preço fixo não existe lá. Mantive o espírito (3 níveis, núcleo sem paywall) na forma da plataforma. Se preferir seguir a regra à risca, me diga e eu refaço.

**2. O risco do plano não é técnico, é o beta.** Construir isso é trabalho conhecido. **Achar 5–10 times reais que topem instalar um app novo é o que pode travar semanas** — e a regra 16 não deixa pular. Por isso proponho começar o recrutamento **na semana 1, em paralelo com o código**, e não na semana 5.

---

## ✅ Spike implantado — histórico

| Etapa | Resultado |
|---|---|
| `forge deploy` | ✅ **asuser-spike 2.0.0** no ambiente `development` |
| `forge install` | ✅ Instalado em `northstack-dev.atlassian.net` (Jira) |
| Escopos | `read:jira-user`, `read:jira-work`, `write:jira-work` |
| Lint | Limpo |

### A terceira pergunta de risco caiu sozinha

O próprio deploy respondeu:

> *"The version of your app [2.0.0] that was just deployed to [development] is **eligible for the Runs on Atlassian program**."*

**Escrever worklog via `asUser` não invalida o selo Runs on Atlassian** — confirmado empiricamente, não por dedução. Das três perguntas de risco da rodada 5, **duas foram respondidas pela documentação e a terceira pelo deploy**. Resta a central: o worklog nasce com a identidade da pessoa?

### O que foi implementado

- `src/resolvers/index.js` — os 6 passos do spike, todos via `api.asUser()`; a chave do item vem do contexto do painel
- `src/frontend/index.jsx` — botão e resultado linha a linha
- `manifest.yml` — escopos adicionados, título do painel
- `@forge/api` adicionado às dependências (não vem no template)

Código em `C:\Pessoal\Projeto\PortfolioApps\spike-asuser\asuser-spike` (fora do repositório — é descartável). A versão de referência está em `apps/jira-time/spike/`.

> **Nota:** o `forge install` avisou que estamos instalando um app de desenvolvimento num site de produção. É esperado — a `northstack-dev` é um site Atlassian real no free tier, que é como toda dev instance do Forge funciona.

---

## ~~PRECISA DE VOCÊ — criar o Developer Space~~ ✅ resolvido

✅ `forge login` funcionou — **Amarildo Pereira (amrldprr@gmail.com)**, account ID `712020:9b4086b1-…`.

❌ **Bloqueio novo:** a conta ainda não é membro de nenhum **Developer Space**, e desde 2025 a Atlassian exige um para criar qualquer app Forge. O CLI se oferece para criar na hora, mas **pergunta o nome num prompt interativo** — e nenhum dos meus shells tem TTY (confirmado: `[ -t 0 ]` falso em PowerShell e Bash). A flag `--personal` não dispensa o Space.

**Rode no seu terminal** (o `forge create` cria o Space e o app na mesma passada):

```bash
mkdir C:\Pessoal\Projeto\PortfolioApps\spike-asuser
```

```bash
cd C:\Pessoal\Projeto\PortfolioApps\spike-asuser
```

```bash
forge create -t jira-issue-panel -d asuser-spike
```

Quando perguntar o nome do Developer Space, sugiro **`Northstack Apps`** — ele não é descartável como o spike: **é onde todos os nossos apps vão morar**, e o nome aparece para a Atlassian. Vale usar o nome do negócio.

**Me avise quando terminar.** Daí eu aplico os arquivos do spike, ajusto os escopos no `manifest.yml`, rodo `forge deploy` e `forge install`, e volto com os resultados.

> **Nota:** o `npm install -g @forge/cli` avisou que o script de instalação do **keytar** não rodou. O login funcionou mesmo assim, então provavelmente não é problema. Se algo reclamar de keychain: `npm install -g --allow-scripts=@forge/cli,cloudflared,keytar @forge/cli`

### ⚠️ Um ponto que vou precisar resolver depois do deploy

O spike roda num **painel de item do Jira**, ou seja, dentro do navegador logado no `northstack-dev.atlassian.net`. **Eu não tenho essa sessão** — meu navegador interno não está logado na sua conta Atlassian.

Quando chegarmos lá, as opções são: **(a)** você abre `SCRUM-1`, clica em "Rodar spike" e me manda o resultado; ou **(b)** você me autoriza a usar o seu Chrome (extensão Claude in Chrome), que já tem a sessão. Prefiro perguntar antes de tocar no seu navegador.

---

## ✅ Feito na sessão 9 — histórico

| Item | Estado |
|---|---|
| **Regra 16** — beta privado obrigatório (5–10 instâncias reais, 2–3 semanas) | Adicionada ao `CLAUDE.md` |
| **Forge CLI** | Instalado, **v13.4.0**. Prompt de analytics desativado (`forge settings set usage-analytics false`) para funcionar em terminal não interativo |
| **Spike escrito** | `apps/jira-time/spike/` — resolver, frontend e runbook |
| **Perguntas 1 e 2 do risco** | **Respondidas pela documentação oficial** — ver abaixo |
| Preço | Confirmado: grátis até 10 usuários, faixa do Clockwork Pro |

### A documentação já derrubou metade do risco

| Pergunta da rodada 5 | Resposta oficial |
|---|---|
| `api.asUser()` permite **criar**, ou só ler? | **Permite escrever.** A assinatura é `api.[asApp \| asUser]().requestJira(path[, options])`, sem restrição documentada a métodos de escrita |
| E o timer com o navegador fechado? | `api.asUser()` sem accountId *"is only available in modules that support the UI kit"* — **funciona em contexto de UI**. Para fora dele existe `api.asUser(accountId)`, que exige **escopos de impersonação offline** e tem restrições |

**A sua decisão de projeto elimina esse segundo risco.** Como o timer grava só o início e o worklog nasce no "parar", em contexto de usuário, **a v1 não precisa de impersonação offline** — nem dos escopos extras, nem das restrições.

**O que a doc não responde, e só o spike responde:** se o `POST /worklog` via `asUser()` grava de fato com a identidade da pessoa, e se o JQL nativo enxerga. É a diferença entre "a API aceita a chamada" e "o dado fica certo".

### O que o spike verifica

| Passo | Prova | Se falhar |
|---|---|---|
| 0. `asUser() /myself` | Há contexto de usuário | Problema de escopo/módulo |
| **1. `POST` worklog `asUser`** | A API aceita escrita como usuário | **Cunha morta** |
| **2. Autor == usuário real** | O worklog é da pessoa, não do app | **Cunha morta** — mesmo defeito do Tempo |
| **3. JQL `worklogAuthor = currentUser()`** | O ecossistema nativo enxerga | Cunha comprometida |
| 4. Painel nativo (`timespent`) | Tempo aparece no Jira sem app | Grave, não fatal |
| 5. `DELETE` worklog | Não deixa lixo na dev site | Apagar à mão |

**Aprovação = passos 1, 2 e 3 verdes.** O spike cria worklog de 3 h com início 2 h atrás em `SCRUM-1`, confere tudo e apaga no fim.

**Se aprovar, escrevo o `LISTING.md` direto** — conforme sua decisão.

### Ambiente da dev site

- Site: **https://northstack-dev.atlassian.net/** · projeto de teste **SCRUM**
- Escopos do spike: `read:jira-user`, `read:jira-work`, `write:jira-work`

---

## Rodada 5 — time tracking para Jira Cloud

### 🎯 A cunha, em uma frase

> **Um time tracker para Jira cujo dado É o worklog nativo do Jira — gravado como a própria pessoa, na hora — para que JQL, automações, dashboards e relatórios nativos simplesmente funcionem.**

Todo concorrente guarda as horas na própria base e devolve ao Jira uma sombra: **ou nada** (Harvest), **ou com atraso** (Clockwork), **ou com a identidade errada** (Tempo). O cliente descobre tarde, quando a primeira JQL por autor volta vazia.

### A evidência

Encontrei a **API pública do Marketplace**, que devolve nota e texto por avaliação — isso fechou a lacuna de método da rodada 4 e restaurou o rigor das rodadas 1–3. **Corpus: 1.174 avaliações lidas, 200 negativas classificadas.**

| Dor | Ocorrências | Onde aparece |
|---|---|---|
| **Relatórios e exportação** | **36** | Tempo 17 · Harvest 8 · Cappsule 7 · Clockwork 3 |
| Suporte | 31 | Tempo 12 · Harvest 11 |
| **Integração / JQL / fidelidade do dado** | **25** | Harvest 12 · Clockify 5 · Tempo 3 · Clockwork 3 |
| Bug / instabilidade | 24 | Tempo 11 |
| Permissão / admin | 15 | Tempo 7 |
| Preço / licenciamento | 13 | Tempo 6 |

**As duas maiores dores são o mesmo problema visto de dois ângulos.** As citações decisivas:

- **Tempo, 2★, jun/2026:** *"each worklog gets loged **asApp and not asUser**, so every worklog on JQL side is done by Tempo Service. This could be easily avoided by using asUser."* — o reclamante aponta a correção
- **Harvest, 1★:** *"**Does not integrate with JIRA time tracking fields and features.**"* — 66 negativas em 145 avaliações, sempre o mesmo motivo
- **Clockwork Pro, 3★:** *"**delay in time logs appearing in Jira** and in the timesheet"*
- **Tempo, 3★:** *"ability to **exclude some projects when filtering instead of selecting one by one** (when you have 50+ projects)"*

### O nativo do Jira — e por que ele não ameaça

O Jira **tem** worklog, estimativa original e restante, unidades `w/d/h/m`, painel de tempo e permissões de apontamento. **Não tem** folha de ponto por pessoa, aprovação, taxas de faturamento nem relatório de utilização. Todos os 11 relatórios nativos são ágeis/de sprint — nenhum é por pessoa ou período.

> **A página oficial de preços do Jira não menciona "time tracking" uma única vez.** Free, Standard (US$ 7,91/u), Premium (US$ 14,54/u) e Enterprise têm **exatamente o mesmo** time tracking. **O teto do nativo não sobe com o plano do cliente** — ao contrário de roadmaps, onde o Advanced Roadmaps vem no Premium. Foi isso que reprovou a categoria 5 da rodada 4 e aprova esta.

### Preço por assento — o líder é 3,6× mais caro que o mais bem avaliado

| App | 10 | 50 | 250 | 1.000 |
|---|---|---|---|---|
| **Tempo** (4.1) | US$ 10,00 | US$ 260,50 | **US$ 1.070,00** | US$ 2.427,50 |
| **Clockwork Pro** (4.6) | **Grátis** | US$ 65,00 | **US$ 295,00** | US$ 610,00 |
| **Cappsule Standard** (4.4) | **Grátis** | US$ 42,50 | US$ 193,00 | US$ 530,50 |
| Harvest (2.5) / Clockify (3.9) | grátis | grátis | grátis | grátis — cobram no próprio SaaS |

**O mercado paga prêmio por incumbência, não por qualidade.** E Harvest e Clockify não são concorrentes de receita — são concorrentes de instalação.

**Para US$ 15k/mês:** 14 clientes de 250 usuários no preço do Tempo; **51 no preço do Clockwork Pro** (61 descontando os 16% do Forge). Contra ~790 lojistas na Shopify.

### Escopo da v1

**Faz:** apontar tempo pelo item (timer e manual, com data retroativa) · **gravar como worklog nativo com a identidade do usuário** · folha de ponto semanal própria · visão de equipe somente leitura para o gestor · exportação CSV com filtro de incluir/**excluir** projetos · grátis até 10 usuários.

**Fica de fora:** aprovação de horas (só 2 ocorrências em 200 negativas — não é dor) · taxas de faturamento e custo · planejamento de capacidade · previsão · integrações externas (Calendar, Slack, Outlook) · mobile · Data Center · Cloud Fortified.

**Pronto quando:** numa dev instance, alguém aponta 3 h pelo app; `worklogAuthor = currentUser()` retorna aquele item; o painel nativo mostra as 3 h; e o CSV exclui um projeto escolhido.

### ⚠️ O risco que pode matar a cunha

**Tudo depende de o Forge conseguir criar worklog com a identidade do usuário.** Três perguntas em aberto:

1. `api.asUser()` permite **criar** worklog, ou só ler?
2. E o **timer em execução** quando o usuário fecha o navegador? Escrita `asUser` costuma exigir contexto de requisição do usuário — se cair para `asApp`, reintroduz exatamente o defeito do Tempo.
3. Escrita `asUser` invalida o selo Runs on Atlassian? *(A princípio não — o selo trata de egress e hospedagem — mas precisa confirmar.)*

**Se a resposta à primeira for "não", a cunha morre e o App 1 precisa ser repensado.** É por isso que a pergunta 1 no topo pede autorização para testar antes de escrever qualquer listagem.

### Critérios

| # | Critério | Resultado |
|---|---|---|
| 3 | Sem líder grátis com selo | ✅ Passa — os grátis têm 2.5 e 3.9 |
| 4 | Categoria entre ~500 e ~5.000 avaliações | ✅ Passa — ~1.700 avaliações, 70+ mil instalações |
| 5 | Dor técnica repetida em vários concorrentes | ✅ **Passa com folga** — 4 dos 6 apps |

Critérios 1 e 2 (dor datada, regulação) não se aplicam. **Três aplicáveis, três aprovados — o primeiro candidato nessa situação em cinco rodadas.**

---

## Rodada 4 — Atlassian Marketplace (Jira e Confluence Cloud)

| # | Categoria | Líder | Nota | Instalações | Líder grátis? | Veredito |
|---|---|---|---|---|---|---|
| 1 | **Time tracking** | Tempo Timesheets | **4.1** | 27,2 mil | Não | 🟡 **Dor técnica confirmada** |
| 2 | **Test management** | Xray | **4.3** | 25,7 mil | Não | 🟡 **Incumbentes fracos** |
| 3 | PDF/Word do Confluence | Scroll PDF (K15t) | 4.7 | 8,9 mil | Não | 🔴 K15t resolveu bem |
| 4 | Checklists e subtarefas | Checklists **Free** | 4.8 | **31,3 mil** | **SIM** | 🔴 Reprovado |
| 5 | Dependências e roadmaps | Structure by Tempo | 4.6 | 13,1 mil | Não | 🟡 Nativo Premium avança |
| 6 | Relatórios e dashboards | eazyBI | 4.7 | 11,1 mil | **SIM** | 🔴 Reprovado |

### Os dois sobreviventes

**Time tracking** — o líder tem **4.1 com 27,2 mil instalações** e o app oficial da Harvest sustenta 2,5 mil instalações com **nota 2.5**. As duas reclamações que encontrei são técnicas, concretas e corrigíveis:

- **Worklog gravado como app, não como usuário** *(jun/2026)*: *"each worklog gets loged asApp and not asUser… `worklogAuthor = currentUser()` returns zero results. This could be easily avoided by using asUser."* O app quebra a consulta nativa do Jira — e o usuário aponta a correção.
- **Usuário comum trancado fora após atualização** *(jul/2026)*: tela de administrador ("Choose which apps you would like on your Jira instance") exibida para quem não administra nada.

**Test management** — o Jira **não tem nada nativo**. Os quatro maiores em instalação estão entre **3.8 e 4.3** (Xray 4.3, Zephyr 4.1, Zephyr Essential 3.9, TestRail 3.8), somando 61 mil instalações. Mas há um alerta: **qualidade e distribuição estão descorrelacionadas** — AIO Tests tem 4.9 e sete vezes menos instalações que o Xray de 4.3. Ser melhor, sozinho, não desloca o incumbente.

### O que eu errei na rodada 3, e corrigi agora

Eu havia concluído, com 4 categorias, que **"o Atlassian não tem líder grátis"**. Com 6, está errado:
- **Checklists for Jira (Free)** — 31,3 mil instalações, nota 4.8, grátis
- **Easy Reports Free** — 11,7 mil instalações, nota 4.8, grátis
- E "**grátis até 10 usuários**" é preço de entrada comum dos apps pagos

O critério nº 3 vale no Atlassian igualzinho. **O que muda de verdade é a barra de qualidade e o valor por cliente**, não a ausência de grátis.

### Shopify × Atlassian, lado a lado

| Dimensão | Shopify | Atlassian |
|---|---|---|
| Nota dos líderes | 4,8–5,0 | **3.8–4.7** |
| Preço em times pequenos | US$ 19–39 fixos | US$ 0–10/mês |
| Preço em clientes grandes | US$ 39 fixos | **escala por assento** |
| Taxa do marketplace | **0%** até US$ 1M | 16% Forge / 20% Connect |
| Aprovação | dias a semanas | **10–15 dias úteis** |
| Infraestrutura | nossa (~US$ 5/mês) | **da Atlassian** (franquia + consumo) |
| **Clientes para US$ 15k/mês** | ~790 pagantes a US$ 19 | **~150 instâncias a ~US$ 100** |

**A última linha é a que importa.** Precisar de 150 clientes em vez de 790 muda a aquisição por um fator de cinco — é a primeira métrica em quatro rodadas que torna US$ 15k/mês plausível para um portfólio pequeno.

**Contrapartida honesta:** em time pequeno o Atlassian paga **menos** que a Shopify, **a taxa é maior na nossa fase** (16% contra 0%), e a receita só aparece com instâncias grandes — que compram institucionalmente, com revisão de segurança.

### Plataforma: as três respostas

**(a) Forge é hospedado grátis?** Quase. A Atlassian hospeda computação e armazenamento — **não precisamos de Railway nem de Postgres** — mas desde **janeiro/2026 há cobrança por consumo**, com franquia mensal grátis por app e excedente faturado no mês seguinte. Franquias: 200.000 GB-s de função, 0,1 GB de leitura e 0,1 GB de escrita em KVS, 1 GB de log, 1 h de SQL. **Atenção: escrita em KVS custa US$ 1,09/GB, e containers e LLM têm franquia zero** — relevante para um negócio "IA First". Excedente não pago pode suspender o app.

**Repasse:** **Forge 84%**, Connect 80%, Data Center 75%. **Recomendo Forge.** O selo **Runs on Atlassian** é automático e gratuito para apps Forge que usam só infraestrutura da Atlassian.

**(b) Taxa e prazo:** Atlassian retém **16% (Forge)** ou **20% (Connect)**. Aprovação em **10–15 dias úteis**. *Comparação honesta: na nossa fase a Shopify é mais barata — 0% até US$ 1M.*

**(c) Cloud Fortified exige:** participação no **Bug Bounty Program** pago + aba de Privacidade e Segurança; SLOs com testes, plano documentado de restauração e **engenheiros de plantão via serviço de alerta**; e **resposta a ticket crítico em 24 h, 5 dias por semana**. É **plantão humano, não código** — a mesma armadilha de barreira operacional que reprovou impostos-EUA. Mas aqui é **opcional**: dá para lançar sem ele.

### Lacuna que esta rodada não fechou

O Atlassian **não tem filtro por estrelas** como a Shopify. Varri o fluxo cronológico e selecionei as críticas por conteúdo — cobertura menor e com viés meu. E a **cobertura nativa do Jira/Confluence não foi verificada em fonte oficial** (meu corte é maio/2026). As duas coisas são a primeira tarefa da rodada 5.

---

## Rodada 3 — dificuldade técnica (Shopify) + sonda no Atlassian

### Shopify: 8 categorias, nenhuma aprovada

| Candidato | Líder | Soma de avaliações | Veredito |
|---|---|---|---|
| **Impostos sobre vendas EUA** | Numeral 4,5★ (114) | ~330 | 🟡 **Barreira real, mas errada** |
| Isenção de IVA / B2B UE | 4,9★ (40) | ~63 | 🔴 Sem demanda |
| EDI / trading partners | SPS Commerce 4,9★ (7) | ~58 | 🔴 Sem demanda self-serve |
| Fiscal por país (NF-e Brasil) | nenhum | ~18 | 🔴 Sem demanda |
| Conectores de ERP | Odoo 5,0★ (61) | ~120 | 🔴 Volume irrisório |
| Frete / transportadoras | ShipX 5,0★ (1.169) | ~2.600 | 🔴 Saturado |
| Multimoeda / arredondamento | BUCKS 4,9★ (1.167) | ~2.500 | 🔴 Saturado, líder **grátis** |
| B2B wholesale / catálogo | BSS 4,9★ (1.107) | ~4.400 | 🔴 Saturado |

**O melhor candidato falhou por um motivo novo e importante.** Impostos EUA passa nos critérios 3, 4 e 5: sem líder grátis, notas atipicamente baixas (4,5★ e 4,8★ contra os 4,9–5,0 onipresentes), US$ 100–300/mês de disposição a pagar e reclamações graves — *"tax authorities contacting me indicating I'm non-compliant"*, *"TWELVE MONTHS into a support case... incorrectly filed my state taxes"*.

**Mas essas falhas não são de software — são de operação regulada.** Resolver exige ser agente fiscal habilitado em dezenas de estados americanos, com procuração e contadores humanos. Isso quebra o modelo "IA First" e o orçamento de R$ 10.000.

> **Barreira alta ≠ barreira útil.** A barreira precisa ser **técnica** — barreira técnica a IA atravessa; barreira operacional exige gente, licença e responsabilidade legal.

### E o achado estrutural sobre a Shopify

| Categoria | Disposição a pagar | Volume |
|---|---|---|
| Conectores de ERP | **US$ 199,92/mês** | ~120 avaliações |
| EDI | US$ 50/mês | ~58 |
| NF-e Brasil | — | ~18 |
| Multimoeda | **grátis** | ~2.500 |
| B2B wholesale | US$ 20–50/mês | ~4.400 |

**Dificuldade e volume são inversamente proporcionais.** Quem tem problema caro já compra *serviço* com contrato e implantação, não app de US$ 29. Quem compra app self-serve tem os problemas fáceis — e esses já são grátis. Nosso alvo declarado (lojas de US$ 50k–5M/ano) cai exatamente no vão.

**O quadrante que procurávamos pode não existir na Shopify.**

### Atlassian: 🟢 a densidade é menor — na dimensão que importa

⚠️ **Aviso metodológico:** contagem de avaliações **não é comparável** entre as lojas. O draw.io tem 62,7 mil instalações e 1.204 avaliações (~2%); na Shopify o Judge.me tem 44.087 avaliações. O comparável é **nota dos líderes** e **presença de líder grátis**.

| Categoria (Jira/Confluence Cloud) | Líder | Nota | Instalações |
|---|---|---|---|
| Time tracking | Timesheets by Tempo | **4.1** | 27,2 mil |
| Test management | Xray / Zephyr | **4.3 / 4.1** | 25,7k / 15,5k |
| Diagramas (Confluence) | draw.io | 4.8 | 62,7 mil |
| Automação de workflow | ScriptRunner | 4.6 | 35 mil |

E o app oficial da **Harvest sustenta 2,5 mil instalações com nota 2.5**.

**Resposta direta:**
- **Número de apps: equivalente** — ambas as lojas devolvem "over 1,000 matches". Não há menos concorrentes.
- **Barra de qualidade: muito mais baixa, e é isso que importa.** Líderes vivem em 4.1–4.6 no Atlassian; na Shopify, em 4,8–5,0. **Ser melhor é um diferencial viável lá; aqui, "melhor que 4,9 e grátis" quase não é proposta.**
- **Sem líder grátis** em nenhuma das quatro categorias — o preço não converge a zero, que é o problema que reprovou 3 das 8 categorias Shopify desta rodada e a rodada 2 inteira.
- **Preço por usuário com piso:** Tempo cobra US$ 10,00/mês para 10 usuários. **A receita escala por assento** — um cliente de 500 usuários paga centenas de dólares pelo mesmo produto. Nosso Pro na Shopify era US$ 39 fixos.

**Ressalvas honestas:** ciclo de venda mais longo (comprador é admin de Jira, com aprovação e revisão de segurança); os selos "Cloud Fortified" e "Runs on Atlassian" são custo de entrada real — e fosso depois. E **a sonda é rasa**: 4 categorias, sem ler avaliações negativas nem verificar o que a Atlassian faz nativamente. **Não é veredito de entrada; é sinal de que a rodada 4 vale a pena ali.**

---

## ~~🔴 ÚNICO BLOQUEIO — escolher o próximo app~~ ✅ resolvido na rodada 5 (Nativelog)

**Três rodadas, quinze categorias, nenhum candidato aprovado.** Evidência completa em [PESQUISA.md](PESQUISA.md).

### Rodada 2 — conformidade regulatória com prazo

| Candidato | Prazo | Apps existentes | Avaliações somadas | Veredito |
|---|---|---|---|---|
| **Botão de desistência da UE** | 19/06/2026 | **17** | **~3.374** | 🔴 **Chegamos ~8 meses tarde** |
| EmpCo / selo GARAN | 27/09/2026 | **7** | **~5** | 🔴 7 já posicionados, zero tração |
| Right to Repair | — | **0** | **0** | 🔴 Sem evidência de demanda |

**O botão de desistência era a melhor tese até agora — e ainda assim é "não".** A Shopify não faz nada nativo, os líderes de returns não cobrem (verifiquei o AfterShip: **zero** menções a `withdrawal`, `Widerruf`, `2023/2673`), e a regulação criou demanda real e datada. O problema é que **17 desenvolvedores previram exatamente a mesma coisa**:

- Líder: **4,9★ com 2.203 avaliações**, plano gratuito
- Segundo: **4,9★ com 508**, **Built for Shopify**, plano gratuito
- Terceiro: 5,0★ com 306, "law firm approved"
- Preço de entrada da categoria: **zero**

Os quatro requisitos legais que você listou — duas etapas, cliente sem conta, confirmação automática, permanentemente visível — **já estão cobertos textualmente** pelos dois maiores. E as poucas reclamações (27 negativas em 2.203) são de preço, integração com tema e CSP — nada de conformidade, nada que não se corrija numa sprint.

### ⚠️ Ressalva jurídica registrada

Pelo meu entendimento, a Diretiva 2023/2673 altera a 2011/83/UE **quanto a contratos de serviços financeiros à distância** — e o botão de desistência aplica-se a esses contratos, não à venda de bens em geral. Os apps vendem a obrigação para todas as lojas da UE. Ou transposições nacionais ampliaram o escopo (a Alemanha é a hipótese provável — os dois maiores apps são alemães), ou parte do mercado está vendendo urgência acima do que a lei exige.

**Não sou fonte jurídica e meu corte de conhecimento é anterior à entrada em vigor.** Não muda o veredito — o mercado está tomado de qualquer forma — mas fica a regra: escopo legal se confirma em fonte primária ou com advogado, nunca no marketing do concorrente.

## 🔧 A rodada 2 corrigiu um critério meu que estava errado

Eu havia escrito que regulação com prazo "defende contra concorrente grátis, porque manutenção contínua vira barreira". **Está errado.**

> **Um prazo legal é informação pública.** Todo desenvolvedor lê a mesma diretiva, na mesma data, e chega à mesma conclusão. Oportunidade regulatória é a **mais** contestada, não a menos. E o preço converge a zero porque conformidade é obrigação, não benefício: ninguém cobra caro por algo que o lojista é forçado a ter e que o concorrente dá de graça.

A confirmação está no EmpCo: **7 apps posicionados antes do prazo sequer chegar.** O ciclo se repete, e mais rápido a cada vez.

Critério reescrito no `CLAUDE.md`. **Conclusão prática: o filtro principal da rodada 3 é dificuldade técnica, não calendário.** Os únicos critérios que apontam vantagem real são "categoria sem líder grátis com selo Built for Shopify" e "dor técnica repetida nos 1–3★ de vários concorrentes".

---

## Rodada 1 — categorias maduras

Nenhum passa a regra 8 com folga. Um único tem espaço, e é estreito.

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

---

## Onde estamos, depois de sete candidatos

**Etiquetas de código de barras (rodada 1) segue como o único candidato vivo** — e continua dependendo da sua resposta sobre hardware. Nada da rodada 2 o substitui.

Sua decisão, em ordem de preferência minha:

- **A — Decidir o candidato de etiquetas.** Se você tem impressora e leitor, é o único caminho com dimensão de vantagem aberta (fidelidade de impressão) e sem líder pago dominante. Se não tem, ele cai.
- **B — Rodada 3 com filtro de dificuldade técnica**, não de calendário: categorias onde o problema é caro de resolver (hardware, formato de arquivo, integração externa instável, precisão de cálculo), que é o que os critérios 3 e 5 apontam.
- **C — Rever a premissa do portfólio.** Duas rodadas mostraram que a App Store da Shopify, nas categorias que examinamos, está madura: líder grátis, nota alta e centenas de avaliações é o padrão, não a exceção. Se isso se repetir na rodada 3, a conversa deixa de ser "qual app" e passa a ser "Shopify é o marketplace certo para começar" — o `CLAUDE.md` já prevê WordPress, Chrome e Atlassian no backlog.

## 🟡 Pendência que virou decisiva

**Hardware — quarta vez que o campo vem como placeholder** (`[tem/não tem]`, `[sua resposta]`). Não é mais detalhe: se você **não** tem impressora de etiqueta e leitor, o candidato de etiquetas cai também — e aí **os sete candidatos das duas rodadas estão reprovados**, sem exceção.

Também: **`northstackapps.com` já foi comprado?**

---

## Resolvido até agora

| Item | Estado |
|---|---|
| **App 1 cancelado** (caminho A) | Registrado em `DECISOES.md` e marcado no `CLAUDE.md`. Zero linhas de código escritas |
| **Regra 8 na nova forma** | Aprovada e aplicada no `CLAUDE.md`, com critérios objetivos de reprovação |
| **Regra 15 (commit + push)** | Aplicada. Remoto sincronizado a cada marco |
| **Login do CLI** | ✅ Funcionando. **Northstack Apps, org ID `232549161`** |
| **Pesquisa — rodada 1** | ✅ 4 candidatos (categorias maduras) |
| **Pesquisa — rodada 2** | ✅ 3 candidatos (conformidade regulatória) + correção do critério nº 2 |

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
