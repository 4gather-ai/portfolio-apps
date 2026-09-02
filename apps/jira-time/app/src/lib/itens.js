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
 * ## D15.1 — o parâmetro que faltava, e sem ele metade do seletor não existia
 *
 * **Achado no beta em 02/09/2026, na `nativelog-beta-zero`:** digitar a chave
 * ou o resumo de um item **nunca visitado** não devolvia nada; bastava abrir o
 * item uma vez no Jira para ele passar a aparecer. Status do item não tinha
 * influência — conferido com o SCRUM-2 em In Progress.
 *
 * **A causa é o `currentJQL`.** A resposta do picker vem em duas seções, e
 * elas não são a mesma coisa:
 *
 *   - **`hs` — History Search:** o que **esta pessoa já abriu**. Vem sempre.
 *   - **`cs` — Current Search:** **a busca de verdade**, sobre os itens que o
 *     `currentJQL` seleciona. A documentação da Atlassian é explícita:
 *     *"Current search is based on a JQL query and is only retrieved when the
 *     currentJQL parameter is specified in your request."*
 *
 * Sem `currentJQL` o endpoint devolve **só o histórico**. O seletor enxergava
 * apenas o que a pessoa já tinha aberto — e a tela da semana existe justamente
 * para lançar hora **no item que ela não abriu**. O recurso parecia funcionar
 * porque quem testa sempre testa com item que acabou de visitar.
 *
 * **Por que um JQL amplo e não vazio.** A própria Atlassian documenta que
 * `currentJQL` vazio deixa de funcionar quando o administrador liga
 * *"Disable empty JQL queries"* nas configurações gerais. Mandar
 * `order by lastViewed DESC` é uma consulta escrita, não uma vazia, e ainda
 * ordena pelo que faz sentido num seletor: o que a pessoa viu por último
 * primeiro.
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

/**
 * O `currentJQL` que abre a busca para a instância inteira.
 *
 * **É o parâmetro sem o qual a seção "Current Search" não vem** — ver o
 * cabeçalho deste arquivo. Amplo de propósito: quem limita o resultado é o
 * `query` (o que a pessoa digitou) e a permissão dela, que o `asUser` já
 * aplica. Não é vazio de propósito também: `currentJQL` vazio para de
 * funcionar em instância com *"Disable empty JQL queries"* ligado.
 */
export const JQL_DA_BUSCA = 'order by lastViewed DESC';

/**
 * Abaixo de quantas sugestões vale completar com os itens atribuídos à pessoa.
 *
 * Uma sugestão só é praticamente uma lista vazia: não dá para escolher, e a
 * pessoa vai embora abrir o Jira — que é o gesto que esta tela existe para
 * evitar. Instância nova é justamente onde isso acontece, e instância nova é o
 * que o beta tem.
 */
export const MINIMO_ANTES_DE_COMPLETAR = 2;

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
    //
    // **`currentJQL` não é opcional**: sem ele a seção "Current Search" não
    // vem, e o seletor passa a mostrar só o que a pessoa já abriu. Ver o
    // cabeçalho do arquivo — foi assim que o D15 foi para o beta.
    const caminho =
      '/rest/api/3/issue/picker?showSubTasks=true&showSubTaskParent=true' +
      `&currentJQL=${encodeURIComponent(JQL_DA_BUSCA)}` +
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

    // Instância nova tem histórico vazio e pouca coisa a buscar. Completar com
    // o que está **atribuído** à pessoa é a única pergunta que ainda faz
    // sentido nesse caso — e é onde ela ia apontar de qualquer forma.
    if (itens.length < MINIMO_ANTES_DE_COMPLETAR) {
      const extras = await meusItens(busca);
      for (const item of extras) {
        if (vistos.has(item.issueKey)) continue;
        if (itens.length >= MAXIMO_SUGESTOES) break;
        vistos.add(item.issueKey);
        itens.push(item);
      }
    }

    return { ok: true, itens, cortada: false };
  }

  /**
   * Os itens atribuídos a esta pessoa, para completar uma lista curta.
   *
   * **Filtra pelo texto digitado quando há texto.** Completar uma busca com
   * itens que não casam com o que a pessoa escreveu é pior que devolver lista
   * vazia: ela lê a lista como resultado da busca e escolhe o item errado.
   *
   * **Nunca lança e nunca vira erro de tela.** Isto é o complemento de uma
   * conveniência; se falhar, o seletor volta ao que já tinha.
   */
  async function meusItens(busca) {
    const jql = 'assignee = currentUser() ORDER BY updated DESC';
    const caminho =
      `/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}` +
      `&fields=summary&maxResults=${MAXIMO_SUGESTOES}`;

    try {
      const resposta = await pedir(caminho, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!resposta.ok) return [];

      const dados = await resposta.json();
      return (dados?.issues || [])
        .filter((item) => item?.key && item?.id !== undefined && item?.id !== null)
        .map((item) => ({
          issueId: String(item.id),
          issueKey: item.key,
          titulo: item.fields?.summary || '',
        }))
        .filter((item) => casaCom(item, busca));
    } catch (erro) {
      return [];
    }
  }

  return { sugerir };
}

/** O item casa com o que foi digitado? Sem texto, tudo casa. */
function casaCom(item, busca) {
  if (!busca) return true;
  const alvo = `${item.issueKey} ${item.titulo}`.toLowerCase();
  return alvo.includes(busca.toLowerCase());
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
