/**
 * Nativelog — a folha de ponto da semana, lida do Jira.
 *
 * **Não há tabela nossa de horas.** A semana é remontada a cada abertura a
 * partir do worklog nativo, em dois passos, que é a única forma honesta de
 * fazer isso sem manter uma cópia:
 *
 *   1. **JQL** para descobrir *quais itens* têm worklog meu na janela. Este é
 *      o uso legítimo do JQL — busca ampla — e o único que a regra de
 *      arquitetura permite.
 *   2. **Endpoint do item** (`/issue/{id}/worklog`) para pegar *as entradas*,
 *      com autor, instante e duração. O JQL não sabe devolver isso: ele
 *      seleciona itens, nunca lançamentos, e a coluna Time Spent do resultado
 *      é o total de toda a vida do item, não o da semana.
 *
 * **O atraso do índice mora no passo 1, e é assumido.** Uma hora apontada há
 * cinco segundos pode ainda não aparecer na busca (medido: ~5,7 s). Para a
 * folha da semana isso é aceitável — e é por isso que a janela do passo 1 é
 * propositalmente mais larga que a semana pedida.
 */

import { deADF } from './worklog.js';

/** Formato que o `started` do Jira usa na comparação de janela. */
function dentroDaJanela(started, desdeMs, ateMs) {
  const t = Date.parse(started);
  return !Number.isNaN(t) && t >= desdeMs && t <= ateMs;
}

/**
 * Quanto alargar a janela do JQL para os lados.
 *
 * O JQL resolve `worklogDate` no fuso da instância; a semana que a pessoa vê
 * é montada no fuso do navegador dela. Os dois podem estar a horas de
 * distância, e um item apontado na segunda de manhã em Tóquio pode cair no
 * domingo da instância. Pedir um dia a mais de cada lado custa alguns itens a
 * mais no passo 1 — e a filtragem exata acontece no passo 2, pelo instante
 * real. Alargar é barato; perder um dia de apontamento não é.
 */
export const FOLGA_DA_BUSCA_MS = 36 * 3600 * 1000;

/**
 * Teto de itens que a semana lê.
 *
 * Cada item custa uma chamada no passo 2. Uma semana de trabalho humano não
 * passa disso nem de longe; se passar, é melhor dizer que a lista veio cortada
 * do que devolver um total que parece completo e não é.
 */
export const MAXIMO_ITENS = 60;

export function criarSemana({ pedir }) {
  if (typeof pedir !== 'function') {
    throw new TypeError('criarSemana exige a função pedir');
  }

  /**
   * Passo 1: quais itens têm worklog na janela.
   *
   * `alvo` é a cláusula que diz de quem: `worklogAuthor = currentUser()` para a
   * minha semana, `project = "X"` para a semana do time.
   */
  async function itensDaJanela({ desde, ate, alvo }) {
    const desdeData = new Date(new Date(desde).getTime() - FOLGA_DA_BUSCA_MS);
    const ateData = new Date(new Date(ate).getTime() + FOLGA_DA_BUSCA_MS);
    const dia = (d) => d.toISOString().slice(0, 10);

    const jql =
      `${alvo}` +
      ` AND worklogDate >= "${dia(desdeData)}"` +
      ` AND worklogDate <= "${dia(ateData)}"` +
      ` ORDER BY updated DESC`;

    const itens = [];
    let token = null;
    let cortada = false;

    // Poucas páginas na prática; o laço existe para não mentir quando houver
    // mais de uma.
    do {
      const caminho =
        `/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}` +
        `&fields=summary,project&maxResults=100` +
        (token ? `&nextPageToken=${encodeURIComponent(token)}` : '');

      let resposta;
      try {
        resposta = await pedir(caminho, { method: 'GET', headers: { Accept: 'application/json' } });
      } catch (erro) {
        return { ok: false, motivo: 'rede', detalhe: erro?.message };
      }

      if (!resposta.ok) {
        return { ok: false, motivo: motivoDaBusca(resposta.status), status: resposta.status };
      }

      const dados = await resposta.json();
      for (const item of dados?.issues || []) {
        if (itens.length >= MAXIMO_ITENS) {
          cortada = true;
          break;
        }
        itens.push({
          issueId: String(item.id),
          issueKey: item.key,
          titulo: item.fields?.summary || '',
          // Projeto vem do campo, não do prefixo da chave: a chave do item
          // costuma bater com a do projeto, mas "costuma" não é contrato — e o
          // D8 filtra por projeto.
          projetoChave: item.fields?.project?.key || null,
          projetoNome: item.fields?.project?.name || null,
        });
      }
      token = cortada ? null : dados?.nextPageToken || null;
    } while (token);

    return { ok: true, itens, cortada };
  }

  /**
   * Passo 2: as entradas do item que caem na janela.
   *
   * `accountId` nulo significa **todo mundo** — é o que a visão de equipe pede.
   * Não é brecha: a chamada é `asUser`, então o Jira já devolve só o que a
   * pessoa que está olhando pode ver. Quem não enxerga o projeto não recebe
   * worklog nenhum dele, e worklog com visibilidade restrita continua restrito.
   * **A permissão do Jira é a permissão do app**, e isso é de propósito.
   */
  async function entradasDoItem(item, { accountId, desdeMs, ateMs }) {
    // `startedAfter` corta no servidor. Um segundo de folga porque o Jira
    // arredonda o instante que devolve.
    const caminho =
      `/rest/api/3/issue/${encodeURIComponent(item.issueId)}/worklog` +
      `?startedAfter=${desdeMs - 1000}&maxResults=1000`;

    let resposta;
    try {
      resposta = await pedir(caminho, { method: 'GET', headers: { Accept: 'application/json' } });
    } catch (erro) {
      return { ok: false, item, motivo: 'rede' };
    }

    // Item que sumiu ou virou privado entre os dois passos não derruba a
    // semana inteira — some da lista e é contado como falha parcial.
    if (!resposta.ok) {
      return { ok: false, item, motivo: motivoDaBusca(resposta.status) };
    }

    const lista = (await resposta.json())?.worklogs || [];
    const entradas = lista
      .filter((w) => !accountId || w.author?.accountId === accountId)
      .filter((w) => dentroDaJanela(w.started, desdeMs, ateMs))
      .map((w) => ({
        id: String(w.id),
        issueId: item.issueId,
        issueKey: item.issueKey,
        titulo: item.titulo,
        projetoChave: item.projetoChave,
        projetoNome: item.projetoNome,
        started: w.started,
        segundos: w.timeSpentSeconds || 0,
        // A descrição vem junto porque o D7 edita a partir daqui: sem ela, o
        // formulário abriria vazio e salvar apagaria o que a pessoa escreveu.
        comentario: deADF(w.comment),
        autorId: w.author?.accountId || null,
        autorNome: w.author?.displayName || null,
      }));

    return { ok: true, entradas };
  }

  /**
   * A semana inteira: entradas cruas, com instante absoluto.
   *
   * **Não agrupa por dia de propósito** — quem sabe o fuso de quem está olhando
   * é o navegador. Ver o contrato no topo de `resolvers/painel.js`.
   */
  async function minhaSemana({ accountId, desde, ate }) {
    if (!accountId) throw new TypeError('minhaSemana exige o accountId');

    const desdeMs = Date.parse(desde);
    const ateMs = Date.parse(ate);
    if (Number.isNaN(desdeMs) || Number.isNaN(ateMs) || ateMs <= desdeMs) {
      return { ok: false, motivo: 'janela-invalida' };
    }

    const busca = await itensDaJanela({ desde, ate, alvo: 'worklogAuthor = currentUser()' });
    if (!busca.ok) return busca;

    const resultados = await Promise.all(
      busca.itens.map((item) => entradasDoItem(item, { accountId, desdeMs, ateMs }))
    );

    const entradas = resultados.filter((r) => r.ok).flatMap((r) => r.entradas);
    const falhas = resultados.filter((r) => !r.ok).map((r) => r.item.issueKey);

    return {
      ok: true,
      // Mais recente primeiro. O agrupamento por dia é do navegador.
      entradas: entradas.sort((a, b) => Date.parse(b.started) - Date.parse(a.started)),
      // Honestidade sobre o que a lista não tem:
      itensLidos: busca.itens.length,
      cortada: busca.cortada,
      falhas,
    };
  }

  /**
   * A semana de um projeto inteiro, para quem coordena — **somente leitura**.
   *
   * Devolve as entradas de todo mundo, com autor. **Corrigir hora alheia
   * continua sendo pela tela do Jira**, de propósito: a regra do D4 não muda
   * porque apareceu uma tela nova. Este caminho nem sabe escrever.
   *
   * E o que cada pessoa vê é decidido pelo Jira, não por nós: a chamada é
   * `asUser`, então projeto que ela não enxerga simplesmente não devolve nada.
   * **Não existe modelo de permissão nosso**, e é isso que impede o app de
   * virar um vazamento de quem trabalhou em quê.
   */
  async function semanaDoTime({ projetoChave, desde, ate }) {
    if (!projetoChave) throw new TypeError('semanaDoTime exige o projetoChave');

    const desdeMs = Date.parse(desde);
    const ateMs = Date.parse(ate);
    if (Number.isNaN(desdeMs) || Number.isNaN(ateMs) || ateMs <= desdeMs) {
      return { ok: false, motivo: 'janela-invalida' };
    }

    // Aspas na chave, e aspas de dentro escapadas: chave estranha não monta
    // JQL torto nem sai do lugar onde deveria estar.
    const chave = String(projetoChave).replace(/"/g, '\\"');
    const busca = await itensDaJanela({ desde, ate, alvo: `project = "${chave}"` });
    if (!busca.ok) return busca;

    const resultados = await Promise.all(
      // accountId nulo = todo mundo que esta pessoa pode ver.
      busca.itens.map((item) => entradasDoItem(item, { accountId: null, desdeMs, ateMs }))
    );

    const entradas = resultados.filter((r) => r.ok).flatMap((r) => r.entradas);
    const falhas = resultados.filter((r) => !r.ok).map((r) => r.item.issueKey);

    return {
      ok: true,
      entradas: entradas.sort((a, b) => Date.parse(b.started) - Date.parse(a.started)),
      itensLidos: busca.itens.length,
      cortada: busca.cortada,
      falhas,
    };
  }

  /**
   * Os projetos que esta pessoa enxerga, para o seletor da visão de equipe.
   * Também `asUser`: a lista é a dela, não a do app.
   */
  async function projetosVisiveis() {
    let resposta;
    try {
      resposta = await pedir('/rest/api/3/project/search?maxResults=50&orderBy=name', {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
    } catch (erro) {
      return { ok: false, motivo: 'rede', detalhe: erro?.message };
    }

    if (!resposta.ok) {
      return { ok: false, motivo: motivoDaBusca(resposta.status), status: resposta.status };
    }

    const dados = await resposta.json();
    return {
      ok: true,
      projetos: (dados?.values || []).map((p) => ({ chave: p.key, nome: p.name })),
    };
  }

  return { minhaSemana, semanaDoTime, projetosVisiveis };
}

/** O JQL erra por motivos próprios — inclusive JQL inválido, que é 400. */
function motivoDaBusca(status) {
  if (status === 400) return 'busca-invalida';
  if (status === 401 || status === 403) return 'sem-permissao';
  if (status === 404) return 'item-nao-encontrado';
  if (status === 429) return 'limite-de-taxa';
  if (status >= 500) return 'jira-indisponivel';
  return 'erro-do-jira';
}
