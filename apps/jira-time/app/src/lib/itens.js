/**
 * Nativelog — sugerir itens de trabalho para a tela da semana (D15).
 *
 * Existe por uma razão só: **um seletor que abre vazio manda a pessoa de volta
 * ao item, que é exatamente o problema que a tela da semana resolve.** Quem
 * lança a sexta-feira esquecida não lembra a chave; lembra que era "aquele bug
 * do login". Se o único jeito de achar for digitar `ABC-1234`, a pessoa abre o
 * Jira, procura, copia a chave e volta — e a tela da semana deixou de valer.
 *
 * Por isso a lista **já vem preenchida** antes de qualquer letra: com nada
 * digitado, o Jira devolve os itens que a pessoa viu por último, que é a melhor
 * aproximação barata de "o que ela andou fazendo".
 *
 * ## Por que o endpoint do picker, e não uma busca JQL nossa
 *
 * `/rest/api/3/issue/picker` é o mesmo endpoint que alimenta o seletor de item
 * do próprio Jira. Ele responde as duas perguntas com uma chamada:
 *
 *   - **sem texto:** a seção de histórico — os itens recentes *desta pessoa*
 *   - **com texto:** casa por chave e por resumo, com as regras de busca do
 *     Jira, incluindo a chave parcial
 *
 * Montar isso em JQL daria uma busca pior (o `~` não casa chave, e "recente"
 * viraria `ORDER BY updated`, que é o que o *item* mudou, não o que a *pessoa*
 * olhou) e duas chamadas em vez de uma.
 *
 * **É `asUser`, como todo o resto.** A lista é a que esta pessoa enxerga; o
 * Jira já não devolve item de projeto que ela não pode ver. Não existe modelo
 * de permissão nosso, aqui também não.
 */

/**
 * Teto de sugestões mostradas.
 *
 * Lista de seletor não é resultado de busca: passando de umas vinte linhas,
 * ninguém lê — refina o texto. O corte é para a tela ficar navegável, e o que
 * ficou de fora não muda nada (a pessoa digita mais uma letra).
 */
export const MAXIMO_SUGESTOES = 20;

export function criarItens({ pedir }) {
  if (typeof pedir !== 'function') {
    throw new TypeError('criarItens exige a função pedir');
  }

  /**
   * Itens para o seletor. Sem `texto`, os recentes da pessoa.
   *
   * **Nunca derruba a tela.** Falha de sugestão devolve lista vazia com o
   * motivo, e a tela continua funcionando com a chave digitada à mão. Uma
   * conveniência que quebra não pode levar junto o caminho de gravar hora.
   */
  async function sugerir({ texto } = {}) {
    const busca = typeof texto === 'string' ? texto.trim() : '';

    // `showSubTasks` porque subtarefa é onde muita gente aponta de verdade —
    // esconder o lugar em que a hora foi trabalhada seria esconder o item.
    const caminho =
      '/rest/api/3/issue/picker?showSubTasks=true&showSubTaskParent=true' +
      (busca ? `&query=${encodeURIComponent(busca)}` : '');

    let resposta;
    try {
      resposta = await pedir(caminho, { method: 'GET', headers: { Accept: 'application/json' } });
    } catch (erro) {
      return { ok: false, motivo: 'rede', itens: [] };
    }

    if (!resposta.ok) {
      return { ok: false, motivo: motivoDaSugestao(resposta.status), itens: [], status: resposta.status };
    }

    let dados;
    try {
      dados = await resposta.json();
    } catch (erro) {
      return { ok: false, motivo: 'resposta-ilegivel', itens: [] };
    }

    const itens = [];
    const vistos = new Set();

    // As seções vêm separadas ("History Search" e "Current Search") e podem
    // repetir o mesmo item. Deduplicar pela chave: a mesma linha duas vezes num
    // seletor faz a pessoa achar que são dois itens diferentes.
    for (const secao of dados?.sections || []) {
      for (const item of secao?.issues || []) {
        const chave = item?.key;
        // Sem id não dá para gravar worklog, e sem chave não dá para mostrar.
        if (!chave || item?.id === undefined || item?.id === null) continue;
        if (vistos.has(chave)) continue;
        if (itens.length >= MAXIMO_SUGESTOES) {
          return { ok: true, itens, cortada: true };
        }

        vistos.add(chave);
        itens.push({
          issueId: String(item.id),
          issueKey: chave,
          // `summaryText` é o resumo limpo. O `summary` do picker vem com
          // `<b>` marcando o trecho que casou — texto com HTML dentro,
          // que num rótulo de seletor apareceria como tag literal.
          titulo: item.summaryText || semMarcacao(item.summary) || '',
        });
      }
    }

    return { ok: true, itens, cortada: false };
  }

  return { sugerir };
}

/** Tira a marcação de destaque que o picker devolve dentro do resumo. */
function semMarcacao(texto) {
  if (typeof texto !== 'string') return '';
  return texto.replace(/<[^>]*>/g, '');
}

function motivoDaSugestao(status) {
  if (status === 401 || status === 403) return 'sem-permissao';
  if (status === 429) return 'limite-de-taxa';
  if (status >= 500) return 'jira-indisponivel';
  return 'erro-do-jira';
}
