# BETA — Nativelog

**Registro exigido pela regra 16 do `CLAUDE.md`.** Nenhum app vai para a listagem pública sem passar por **5 a 10 instâncias reais durante 2 a 3 semanas**.

> **O beta não termina por prazo.** Se menos de 5 instâncias reais usarem de verdade, ele continua. Três semanas com dois curiosos não é beta — é espera.

**Status:** ⬜ não começou · aguardando o link de instalação (ver `../../STATUS.md`)
**App em produção:** versão 2.0.0, implantada em 27/08/2026 16:01 UTC
**Última atualização deste arquivo:** 27/08/2026

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
| | | | | |

**A coluna que mais importa é a quarta.** Um defeito que os testes não pegaram diz onde o nosso modelo do mundo está errado — e é essa a informação que dev store nenhuma dá.

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
