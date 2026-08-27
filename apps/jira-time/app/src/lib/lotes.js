/**
 * Nativelog — executa em lotes, com concorrência limitada.
 *
 * **O motivo é o 429.** A folha da semana lê um item por chamada. Numa
 * instância pequena são cinco; numa instância grande, sessenta — e
 * `Promise.all` sobre sessenta dispara sessenta requisições ao Jira no mesmo
 * instante. O Jira responde com *rate limit*, a folha volta cheia de buracos, e
 * o usuário vê "alguns itens não puderam ser lidos" numa semana em que estava
 * tudo bem.
 *
 * Sessenta requisições em lotes de cinco custam alguns segundos a mais e
 * chegam inteiras. **Numa folha de ponto, completa e devagar ganha de rápida e
 * furada** — o número errado ninguém percebe, a demora todo mundo perdoa.
 */

/**
 * Quantas chamadas ao Jira ao mesmo tempo.
 *
 * Cinco é conservador de propósito: o limite real da Atlassian varia por
 * instância e por plano, não é publicado como número fixo, e errar para menos
 * custa segundos enquanto errar para mais custa dados.
 */
export const CONCORRENCIA = 5;

/**
 * Roda `tarefa` para cada item, no máximo `limite` ao mesmo tempo.
 *
 * Preserva a ordem da entrada na saída — quem chama monta a folha a partir
 * dela, e ordem embaralhada viraria semana embaralhada.
 */
export async function emLotes(itens, tarefa, limite = CONCORRENCIA) {
  const lista = Array.isArray(itens) ? itens : [];
  const saida = new Array(lista.length);
  let proximo = 0;

  const trabalhador = async () => {
    for (;;) {
      const i = proximo;
      proximo += 1;
      if (i >= lista.length) return;
      saida[i] = await tarefa(lista[i], i);
    }
  };

  const quantos = Math.max(1, Math.min(limite, lista.length));
  await Promise.all(Array.from({ length: quantos }, trabalhador));

  return saida;
}
