/**
 * Nativelog — escrita e leitura do worklog nativo do Jira.
 *
 * Este arquivo é a cunha do produto. Tudo aqui existe para que o worklog nasça
 * **com a identidade da pessoa**, dentro do Jira, sem cópia paralela nossa.
 *
 * `pedir` é injetado: em produção é `api.asUser().requestJira(...)`, nos testes
 * é uma função que devolve respostas montadas. O `asUser()` é o ponto inteiro
 * do produto, e é justamente por isso que ele fica na fiação (`resolvers/`) e
 * não aqui — aqui a gente testa o que fazemos com a resposta.
 */

import { paraDataJira } from './time.js';

const caminhoWorklog = (issueId) =>
  `/rest/api/3/issue/${encodeURIComponent(String(issueId))}/worklog`;

const caminhoDeUm = (issueId, worklogId) =>
  `${caminhoWorklog(issueId)}/${encodeURIComponent(String(worklogId))}`;

/** O Jira aceita comentário só em ADF. Texto puro é rejeitado. */
export function paraADF(texto) {
  const limpo = typeof texto === 'string' ? texto.trim() : '';
  if (!limpo) return undefined;
  return {
    type: 'doc',
    version: 1,
    content: [{ type: 'paragraph', content: [{ type: 'text', text: limpo }] }],
  };
}

/**
 * Volta do ADF para texto puro.
 *
 * O caminho de ida (`paraADF`) existe porque o Jira exige ADF; o de volta
 * existe porque **o app precisa devolver o comentário ao campo de edição**.
 * Sem ele, corrigir a duração de uma entrada apagaria a descrição dela.
 *
 * Anda pela árvore inteira em vez de assumir um parágrafo só: o comentário pode
 * ter sido escrito na tela do Jira, com listas, links e quebras de linha.
 */
export function deADF(doc) {
  if (!doc || typeof doc !== 'object') return '';

  const pedacos = [];
  const andar = (no) => {
    if (!no || typeof no !== 'object') return;
    if (typeof no.text === 'string') pedacos.push(no.text);
    if (Array.isArray(no.content)) {
      no.content.forEach(andar);
      // Parágrafo e item de lista são quebra de linha; sem isso o texto inteiro
      // vira uma frase só, colada. Um item de lista contém um parágrafo, então
      // sem esta conferência cada item ganharia duas quebras.
      const quebra = no.type === 'paragraph' || no.type === 'listItem';
      if (quebra && pedacos[pedacos.length - 1] !== '\n') pedacos.push('\n');
    }
  };
  andar(doc);

  return pedacos.join('').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Formato único de apontamento que o resto do app entende.
 *
 * `meu` é **a regra do produto num campo só**: só a própria entrada é editável
 * aqui. Quem tem permissão de mexer em worklog alheio no Jira continua tendo —
 * na tela do Jira. Neste app não, porque o app é a folha de ponto de quem está
 * olhando, e não uma ferramenta de administração de horas alheias.
 */
export function normalizar(wl, issueId, accountId) {
  return {
    id: String(wl.id),
    issueId: String(issueId),
    started: wl.started,
    segundos: wl.timeSpentSeconds,
    comentario: deADF(wl.comment),
    autorId: wl.author?.accountId || null,
    autorNome: wl.author?.displayName || null,
    meu: Boolean(accountId) && wl.author?.accountId === accountId,
  };
}

/**
 * Traduz a resposta do Jira num motivo que o painel sabe explicar.
 * Sem isso, o usuário vê "HTTP 403" — que não diz o que fazer.
 */
export function motivoDoErro(status) {
  if (status === 400) return 'worklog-invalido';
  if (status === 401 || status === 403) return 'sem-permissao';
  if (status === 404) return 'item-nao-encontrado';
  if (status === 429) return 'limite-de-taxa';
  if (status >= 500) return 'jira-indisponivel';
  return 'erro-do-jira';
}

export function criarWorklogs({ pedir }) {
  if (typeof pedir !== 'function') {
    throw new TypeError('criarWorklogs exige a função pedir');
  }

  /**
   * Grava um worklog nativo no item.
   *
   * `startedAt` é o início real do timer, não o instante do "parar" — é isso
   * que faz a folha de ponto bater com o dia em que o trabalho aconteceu.
   */
  async function gravar({ issueId, startedAt, segundos, comentario }) {
    if (!issueId) throw new TypeError('gravar exige o issueId');
    if (!Number.isFinite(segundos) || segundos <= 0) {
      return { ok: false, motivo: 'duracao-invalida' };
    }

    const inicio = new Date(startedAt);
    if (Number.isNaN(inicio.getTime())) return { ok: false, motivo: 'inicio-invalido' };

    const corpo = {
      timeSpentSeconds: Math.round(segundos),
      started: paraDataJira(inicio),
    };
    const adf = paraADF(comentario);
    if (adf) corpo.comment = adf;

    let resposta;
    try {
      resposta = await pedir(caminhoWorklog(issueId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(corpo),
      });
    } catch (erro) {
      // O Jira pode ter recebido mesmo assim. Quem chama tem que poder conferir
      // antes de tentar de novo, senão vira worklog duplicado.
      return { ok: false, motivo: 'rede', detalhe: erro?.message, podeTerGravado: true };
    }

    const texto = await resposta.text();
    if (!resposta.ok) {
      return {
        ok: false,
        motivo: motivoDoErro(resposta.status),
        status: resposta.status,
        detalhe: texto.slice(0, 300),
      };
    }

    const wl = JSON.parse(texto);
    return {
      ok: true,
      worklog: {
        id: wl.id,
        issueId: String(issueId),
        started: wl.started,
        segundos: wl.timeSpentSeconds,
        autorId: wl.author?.accountId || null,
        autorNome: wl.author?.displayName || null,
      },
    };
  }

  /**
   * Já existe um worklog igual a este no item?
   *
   * Serve para uma coisa só: quando a gravação falhou por rede, a gente não
   * sabe se o Jira recebeu. Tentar de novo às cegas duplica a hora da pessoa.
   *
   * **Lê pelo endpoint do item, não por JQL** — regra de arquitetura fixada no
   * spike: o índice de busca atrasa ~5,7 s, e aqui a gente está justamente
   * perguntando sobre algo que acabou de ser escrito.
   */
  async function jaExiste({ issueId, accountId, startedAt, segundos }) {
    const inicio = new Date(startedAt);
    if (Number.isNaN(inicio.getTime())) return { ok: false, motivo: 'inicio-invalido' };

    // `startedAfter` corta a lista no servidor. Um segundo de folga para trás
    // porque o Jira arredonda o instante que devolve.
    const desde = inicio.getTime() - 1000;
    let resposta;
    try {
      resposta = await pedir(`${caminhoWorklog(issueId)}?startedAfter=${desde}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
    } catch (erro) {
      return { ok: false, motivo: 'rede', detalhe: erro?.message };
    }

    if (!resposta.ok) {
      return { ok: false, motivo: motivoDoErro(resposta.status), status: resposta.status };
    }

    const lista = (await resposta.json())?.worklogs || [];
    const alvo = inicio.getTime();
    const igual = lista.find(
      (w) =>
        w.author?.accountId === accountId &&
        w.timeSpentSeconds === Math.round(segundos) &&
        Math.abs(new Date(w.started).getTime() - alvo) < 1000
    );

    return { ok: true, encontrado: Boolean(igual), worklog: igual || null };
  }

  /**
   * Todos os apontamentos do item, cada um marcado com quem é dono dele.
   *
   * **Endpoint do item, nunca JQL** — regra de arquitetura do spike: a pessoa
   * acaba de gravar e olha a lista no segundo seguinte, e o índice de busca do
   * Jira atrasa ~5,7 s.
   */
  async function listar({ issueId, accountId }) {
    if (!issueId) throw new TypeError('listar exige o issueId');

    let resposta;
    try {
      resposta = await pedir(`${caminhoWorklog(issueId)}?maxResults=1000`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
    } catch (erro) {
      return { ok: false, motivo: 'rede', detalhe: erro?.message };
    }

    if (!resposta.ok) {
      return { ok: false, motivo: motivoDoErro(resposta.status), status: resposta.status };
    }

    const dados = await resposta.json();
    const worklogs = (dados?.worklogs || [])
      .map((w) => normalizar(w, issueId, accountId))
      // Mais recente primeiro: é o que a pessoa acabou de lançar, e o que ela
      // mais provavelmente quer corrigir.
      .sort((a, b) => new Date(b.started).getTime() - new Date(a.started).getTime());

    return {
      ok: true,
      worklogs,
      // O Jira pagina em silêncio. Dizer que a lista veio cortada é melhor do
      // que mostrar um total errado com cara de completo.
      completo: (dados?.total ?? worklogs.length) <= worklogs.length,
    };
  }

  /**
   * Lê um apontamento pelo id.
   *
   * Existe para uma coisa: **conferir a autoria antes de editar ou apagar.** A
   * permissão do Jira não serve de guarda aqui — quem tem "editar worklog de
   * qualquer um" passaria por ela, e a regra deste app é mais estreita que a do
   * Jira de propósito.
   */
  async function lerUm({ issueId, worklogId, accountId }) {
    if (!issueId || !worklogId) throw new TypeError('lerUm exige issueId e worklogId');

    let resposta;
    try {
      resposta = await pedir(caminhoDeUm(issueId, worklogId), {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
    } catch (erro) {
      return { ok: false, motivo: 'rede', detalhe: erro?.message };
    }

    if (!resposta.ok) {
      return {
        ok: false,
        motivo:
          resposta.status === 404 ? 'apontamento-nao-encontrado' : motivoDoErro(resposta.status),
        status: resposta.status,
      };
    }

    return { ok: true, worklog: normalizar(await resposta.json(), issueId, accountId) };
  }

  /**
   * Corrige um apontamento existente.
   *
   * Manda duração, início e comentário **sempre juntos**. O `PUT` do Jira
   * substitui o corpo: mandar só o campo alterado apagaria os outros, inclusive
   * a descrição que a pessoa escreveu.
   */
  async function atualizar({ issueId, worklogId, startedAt, segundos, comentario }) {
    if (!issueId || !worklogId) throw new TypeError('atualizar exige issueId e worklogId');
    if (!Number.isFinite(segundos) || segundos <= 0) {
      return { ok: false, motivo: 'duracao-invalida' };
    }

    const inicio = new Date(startedAt);
    if (Number.isNaN(inicio.getTime())) return { ok: false, motivo: 'inicio-invalido' };

    const corpo = {
      timeSpentSeconds: Math.round(segundos),
      started: paraDataJira(inicio),
      // Comentário apagado vira `null`, não `undefined`: é assim que se remove
      // uma descrição. `undefined` sumiria do JSON e deixaria a antiga lá.
      comment: paraADF(comentario) || null,
    };

    let resposta;
    try {
      resposta = await pedir(caminhoDeUm(issueId, worklogId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(corpo),
      });
    } catch (erro) {
      return { ok: false, motivo: 'rede', detalhe: erro?.message };
    }

    const texto = await resposta.text();
    if (!resposta.ok) {
      return {
        ok: false,
        motivo: motivoDoErro(resposta.status),
        status: resposta.status,
        detalhe: texto.slice(0, 300),
      };
    }

    return { ok: true, worklog: normalizar(JSON.parse(texto), issueId, null) };
  }

  /**
   * Apaga um apontamento.
   *
   * Não existe lixeira nossa: o dado é do Jira e o Jira apaga de verdade. É por
   * isso que o painel confirma antes de chamar isto, e é por isso que a
   * conferência de autoria acontece no servidor e não na tela.
   */
  async function apagar({ issueId, worklogId }) {
    if (!issueId || !worklogId) throw new TypeError('apagar exige issueId e worklogId');

    let resposta;
    try {
      resposta = await pedir(caminhoDeUm(issueId, worklogId), {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
    } catch (erro) {
      return { ok: false, motivo: 'rede', detalhe: erro?.message };
    }

    // 404 aqui é sucesso: alguém já apagou. O objetivo era não existir mais.
    if (!resposta.ok && resposta.status !== 404) {
      return { ok: false, motivo: motivoDoErro(resposta.status), status: resposta.status };
    }

    return { ok: true, jaNaoExistia: resposta.status === 404 };
  }

  return { gravar, jaExiste, listar, lerUm, atualizar, apagar };
}
