# BETA — Nativelog

**Registro exigido pela regra 16 do `CLAUDE.md`.** Nenhum app vai para a listagem pública sem passar por **5 a 10 instâncias reais durante 2 a 3 semanas**.

> **O beta não termina por prazo.** Se menos de 5 instâncias reais usarem de verdade, ele continua. Três semanas com dois curiosos não é beta — é espera.

**Status:** ⬜ não começou · **link de instalação pronto e testado em 28/08** · falta convidar gente
**App em produção:** versão 2.0.0, implantada em 27/08/2026 16:01 UTC
**Última atualização deste arquivo:** 28/08/2026

---

## ✅ Ensaio geral — 28/08/2026 · `nativelog-beta-zero.atlassian.net`

O Amarildo criou um site Jira novo e gratuito, do zero, e instalou pelo link — **exatamente o caminho que um participante vai percorrer**, sem nada de dev store por baixo.

| O que foi verificado | Resultado |
|---|---|
| Instalação pelo link privado, em site recém-criado | ✅ |
| Timer começa a contar **na hora** do clique | ✅ **o defeito do cold start do D2 está corrigido em produção** |
| Apontamento de 1 min gravado | ✅ |
| "Minha semana" correta, em **pt-BR** | ✅ o i18n do D10 funciona fora da máquina de quem o escreveu |

**Um defeito encontrado:** na tela de instalação o app aparecia como `nativelog`, minúsculo. Causa e correção em `../../DECISOES.md`, 28/08. **É o quinto defeito que só apareceu no navegador** (regra 17) — e o primeiro que só apareceu **de fora**, porque nenhuma tela nossa mostra esse nome.

> **Isto não conta como instância de beta, e a distinção importa.** É o nosso próprio site, criado para testar, sem trabalho real dentro. Serve para provar que o caminho de instalação funciona — nada além disso. Contar um ensaio como participante é exatamente como um beta mal medido chega a "cinco".

---

## Participantes

| # | Quem | Instância | Tamanho | Instalou em | Usando de verdade? | Saiu? |
|---|---|---|---|---|---|---|
| 1 | | | | | ⬜ | |
| 2 | | | | | ⬜ | |
| 3 | | | | | ⬜ | |
| 4 | | | | | ⬜ | |
| 5 | | | | | ⬜ | |

**"Usando de verdade" quer dizer:** apontou horas em pelo menos **três dias diferentes**, em trabalho real, sem alguém do nosso lado pedindo. Instalar e abrir uma vez não conta — e é justamente o que um beta mal medido conta como sucesso.

**Meta: 5 marcadas.** Abaixo disso, não listamos.

---

## O que quebrou

Uma linha por defeito, com o que mudou por causa dele. **Vazio até o beta começar.**

| Data | Quem achou | O que aconteceu | Por que os testes não pegaram | O que mudou |
|---|---|---|---|---|
| **02/09** | Amarildo, na `nativelog-beta-zero` (produção 2.1.0) | **O seletor de item só achava o que já tinha sido aberto.** Digitar a chave ou o resumo de um item nunca visitado não devolvia nada; bastava abrir o item uma vez no Jira para ele passar a aparecer | Os testes afirmavam o **formato** da resposta do picker, com as duas seções montadas à mão. **Nunca afirmaram que a chamada pedia as duas.** Um duplo devolve o que o autor do teste imaginou, e eu tinha imaginado a resposta completa | `currentJQL` passou a ir na chamada — sem ele o Jira devolve **só o histórico**. Mais um teste que falha sem o parâmetro, e a lista curta passou a ser completada com os itens atribuídos à pessoa. Ver `STATUS.md`, D15.1 |

**A coluna que mais importa é a quarta.** Um defeito que os testes não pegaram diz onde o nosso modelo do mundo está errado — e é essa a informação que dev store nenhuma dá.

> **A primeira linha desta tabela veio de uma instância que não é participante do beta, e mesmo assim prova a regra 16.** A `nativelog-beta-zero` é nossa, tem cinco itens e nenhum dado sujo — e ainda assim mostrou um defeito que a `northstack-dev` escondia, **por um motivo que ninguém teria previsto: lá eu já tinha aberto todos os itens.** O histórico do picker estava cheio, então a busca parecia funcionar.
>
> **É o argumento da regra 16 no seu formato mais barato:** não foi carga, nem fuso, nem permissão estranha. Foi *outra pessoa, noutra instância, com outro passado de navegação*. Cinco a dez delas acham o que nós dois não achamos.

---

## O que já sabemos que dev store não mostra

Escrito **antes** do beta de propósito: é a lista do que estamos indo procurar, e serve para não confundir "não apareceu" com "não existe".

| Risco | Por que só uso real mostra | Como saberemos |
|---|---|---|
| **Instância grande** | 50+ projetos e itens com milhares de worklogs. A paginação do D12 tem teste, mas nunca rodou contra dados reais | Folha da semana demorando, ou o aviso de "lista cortada" aparecendo |
| **Fuso de verdade** | O time inteiro no mesmo fuso esconde o problema. Uma pessoa em outro continente não | Hora caindo no dia errado na folha |
| **Permissão estranha** | Esquema de permissão de empresa não parece com o de dev store | Botão Start sumindo onde deveria aparecer, ou o contrário |
| **Dados sujos** | Worklog criado por automação, por importação, por outro app | Autor em branco, duração zero, `started` fora do padrão |
| **A conta do Forge** | Consumo real com gente real. A reconsulta de 30 s e a folha da semana são os dois pontos a vigiar (`CUSTOS.md`) | Painel de *Usage and charges* no Developer Console |
| **O que ninguém previu** | É o item para o qual o beta existe | Perguntas que não sabemos responder |

---

## O que perguntar, e quando

**Não perguntar "está gostando?".** A resposta é sempre sim e não serve para nada.

### Depois da primeira semana
1. O que você tentou fazer e não achou?
2. Teve algum número que pareceu errado, mesmo que você não tenha certeza?
3. Em que momento você teve de parar e pensar no que a tela queria dizer?

### Depois da segunda
4. Você voltou para o jeito antigo em algum momento? Qual foi a gota?
5. Alguém do time desistiu de usar? Por quê?
6. Se isso fosse pago amanhã, você pagaria? **Quanto, sem eu dizer o número?**

### Se alguém sair
7. Uma pergunta só, sem defesa nenhuma: **o que teria que ser diferente?**

> A pergunta 4 é a que mais importa e é a que as pessoas mais educadamente omitem. Vale insistir uma vez.

---

## Regras do beta, do nosso lado

1. **Responder em até um dia útil.** Durante o beta, no mesmo dia. É o que compra a franqueza da pergunta 4.
2. **Correção entra primeiro em `development`**, conferida no navegador, e só depois vai para `production`. Participante não é cobaia de deploy.
3. **Avisar antes de mudar comportamento.** Alguém que abre a folha na segunda e encontra outra tela para de confiar no app.
4. **Não defender o produto.** Quem está reclamando está fazendo um favor caro.
5. **Registrar tudo aqui, no mesmo dia.** Feedback que não vira linha nesta tabela vira lembrança, e lembrança vira nada.

---

## Como o participante instala

O guia está publicado em **https://northstackapps.com/nativelog/beta.html** — é o link que vai nos anúncios e nos e-mails.

O que ele precisa saber antes de aceitar:
- **Jira Cloud** apenas
- Instalar exige **admin do Jira**
- **Grátis durante todo o beta** e por pelo menos um mês depois
- **Desinstalar não perde hora nenhuma** — os apontamentos são worklogs nativos e ficam no Jira

---

## Encerramento

O beta termina quando **as duas** condições valerem:

- [ ] **5 ou mais instâncias reais** com "usando de verdade" marcado
- [ ] **Duas semanas sem defeito novo de gravidade alta**

Aí sim: ligar a licença no manifest, inserir as faixas de preço e submeter. **Nessa ordem** — ligar a licença antes derruba o link de instalação e acaba com o beta. Ver `../../DECISOES.md`, 27/08/2026.
