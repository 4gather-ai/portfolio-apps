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

  return { gravar, jaExiste };
}
