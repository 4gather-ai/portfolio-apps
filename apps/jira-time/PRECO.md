# Preço do Nativelog — proposta para aprovação

**Status: aguardando sua aprovação.** Nada foi inserido no Developer Console. Depois que você aprovar, eu te passo o passo a passo da tela.

Feito em 27/08/2026 (D11). Referências de concorrentes conferidas na rodada 5 do [`PESQUISA.md`](../../PESQUISA.md).

---

## 1. A decisão que eu preciso de você primeiro

**Quantas editions pagas: duas ou três?**

O `CLAUDE.md` (regra 10) pede 3 níveis. Mas na Atlassian há um detalhe que muda o desenho: **todo app Cloud já é grátis em instâncias de até 10 usuários, por regra da própria Atlassian.** Não é escolha nossa. Então "Free" não é uma edition que a gente cria — é uma consequência que existe de qualquer jeito.

Isso deixa duas formas de montar:

### Opção A — duas editions pagas *(minha recomendação)*

| | Quem paga | O que tem |
|---|---|---|
| **Até 10 usuários** | ninguém, sempre | **Tudo**, inclusive visão de equipe |
| **Standard** | 11+ usuários | O núcleo + exportação CSV |
| **Pro** | 11+ usuários | Standard + visão de equipe e relatórios |

**Por que recomendo:** a "Free" da opção B seria um concorrente nosso que nunca cobra. E o que ela daria de graça é exatamente **a cunha** — worklog nativo com a identidade da pessoa —, que é a coisa que o cliente mais valoriza. Dar isso para sempre, em qualquer tamanho, é escolher não ser pago pelo que o produto tem de melhor.

O "grátis até 10" já cobre o que importa para adoção: avaliação sem fricção, time pequeno inteiro usando, e boca a boca. **É a faixa onde nasce indicação, não receita.**

### Opção B — três editions, com uma Free ilimitada

Uma edition Free que segue grátis em qualquer tamanho, com o timer e a folha pessoal, e cobra só por CSV e equipe.

**O custo disso, dito claramente:** uma instância de 400 pessoas usaria o produto inteiro de graça, para sempre, e nós pagaríamos a conta de invocação do Forge por elas. Só viraria receita se alguém quisesse CSV. **É uma aposta de que o CSV converte** — e eu não tenho evidência de que converte.

> **Recomendo a A.** Se você preferir a B, eu refaço a tabela — mas quero registrar que ela troca receita por alcance sem dado que sustente a troca.

**O que segue abaixo assume a opção A.**

---

## 2. O que separa Standard de Pro

A regra 10 diz que **o núcleo nunca fica atrás de paywall**. O núcleo aqui é: *apontar tempo que vira worklog nativo do Jira, no seu nome, e ver a sua semana.* Isso está em todas as editions, em qualquer tamanho.

| | Até 10 usuários | Standard | Pro |
|---|---|---|---|
| Timer no item | ✓ | ✓ | ✓ |
| Apontamento manual, com data retroativa | ✓ | ✓ | ✓ |
| **Worklog nativo com a sua identidade** | ✓ | ✓ | ✓ |
| Corrigir e apagar a própria entrada | ✓ | ✓ | ✓ |
| Minha semana, com navegação | ✓ | ✓ | ✓ |
| Exportação CSV com filtro de projetos | ✓ | ✓ | ✓ |
| **Visão de equipe (somente leitura)** | ✓ | — | ✓ |
| Relatórios por período e por grupo *(pós-v1)* | — | — | ✓ |

**Duas mudanças em relação ao que a `LISTING.md` dizia, e o motivo:**

1. **A exportação CSV desceu para o Standard** (a listagem antiga a tirava do Free). Exportar as próprias horas é a saída de dados de quem apontou — cobrar por isso chega perto de segurar dado de refém, e é o tipo de coisa que rende avaliação de 2 estrelas. O que separa Standard de Pro passa a ser **de quem são as horas**: as suas, ou as do time.
2. **A visão de equipe é o Pro inteiro.** É a única função com valor de gestão, é a que justifica o preço, e é somente leitura por decisão sua de hoje.

---

## 3. A tabela de faixas — os números que proponho

A Atlassian cobra por **faixas marginais**: o cliente paga a taxa de cada faixa só pelos usuários dentro dela, como imposto de renda. Isso evita o degrau onde um usuário a mais dobra a fatura.

### Standard — US$/usuário/mês

| Faixa de usuários | Taxa marginal |
|---|---|
| 1 – 10 | **US$ 0,00** *(regra da Atlassian)* |
| 11 – 100 | US$ 1,00 |
| 101 – 250 | US$ 0,70 |
| 251 – 1.000 | US$ 0,34 |
| 1.001 – 5.000 | US$ 0,20 |
| 5.001 + | US$ 0,10 |

### Pro — US$/usuário/mês

| Faixa de usuários | Taxa marginal |
|---|---|
| 1 – 10 | **US$ 0,00** *(regra da Atlassian)* |
| 11 – 100 | US$ 1,60 |
| 101 – 250 | US$ 1,00 |
| 251 – 1.000 | US$ 0,48 |
| 1.001 – 5.000 | US$ 0,28 |
| 5.001 + | US$ 0,14 |

---

## 4. Como isso fica na fatura, contra os concorrentes

| Usuários | **Standard** | **Pro** | Clockwork Pro | Tempo Timesheets |
|---|---|---|---|---|
| 10 | Grátis | Grátis | Grátis | US$ 10,00 |
| 25 | US$ 15 | US$ 24 | ~US$ 32 | US$ 130,25 |
| 50 | US$ 40 | US$ 64 | US$ 65,00 | US$ 260,50 |
| 100 | US$ 90 | US$ 144 | ~US$ 130 | US$ 521,00 |
| 250 | US$ 195 | US$ 294 | US$ 295,00 | US$ 1.070,00 |
| 1.000 | US$ 450 | US$ 650 | US$ 610,00 | US$ 2.427,50 |
| 5.000 | US$ 1.250 | US$ 1.770 | — | — |

**O racional em três frases:**

- **O Pro empata com o Clockwork Pro**, que é o líder de qualidade da categoria (4,6★). Empatar com o bom e ganhar no produto é posição melhor do que ganhar no preço e ter de explicar por que é mais barato.
- **Fica 3,7× abaixo do Tempo** em 1.000 usuários. O Tempo é o líder de volume e tem nota 4,1 — a diferença de preço é o argumento de troca.
- **O Standard entra por baixo de todo mundo**, porque quem só quer apontar as próprias horas não deveria pagar preço de ferramenta de gestão.

---

## 5. Duas coisas que eu não recomendo, e por quê

**Não recomendo cobrar mais que o Clockwork.** Somos um app novo, de um desenvolvedor só, sem avaliações. Preço acima do líder de qualidade exige reputação que a gente ainda não tem, e o comprador de Marketplace usa preço como sinal de risco nos dois sentidos.

**Não recomendo entrar muito mais barato do que isto.** Preço muito baixo num app de apontamento sugere hobby, e o comprador que decide isso é quem vai confiar a folha de ponto do time ao app. Além disso, a conta do Forge é real e cresce com uso — a folha da semana faz uma chamada por item. Preço de banana com custo de infraestrutura variável é como se perde dinheiro por cliente.

---

## 6. Trial

**30 dias**, que é o padrão da Atlassian e não é configurável para menos sem parecer estranho. Vale para as duas editions pagas.

---

## 7. O que preciso de você

1. **Escolher a opção A ou a B** da seção 1.
2. **Aprovar ou ajustar os números** das tabelas da seção 3.

Depois disso eu te passo o passo a passo do Developer Console — a tela exige a sua conta, e as faixas são digitadas uma a uma.

**Enquanto isso não acontece, o código não trava nada:** a checagem de licença já está no app (D11), mas com a regra de **na dúvida, liberar** — instância sem informação de licença vê o produto inteiro. Ver `app/src/lib/licenca.js`.
