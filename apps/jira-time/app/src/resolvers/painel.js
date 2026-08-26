/**
 * Nativelog — as quatro operações do painel do item.
 *
 * Separado de `index.js` para poder ser testado sem Forge: `index.js` só liga
 * o KVS de verdade e registra estas funções no Resolver. Aqui está tudo que
 * pode dar errado — contexto faltando, timer em outro item, erro de rede — e é
 * exatamente por isso que mora num arquivo que os testes alcançam.
 */

import { formatarDuracao, formatarRelogio } from '../lib/time.js';

/**
 * O accountId vem do contexto do Forge, nunca do frontend.
 * Se viesse do cliente, uma pessoa poderia mexer no timer de outra.
 */
function quemEstaPedindo(req) {
  const accountId = req?.context?.accountId;
  if (!accountId) throw new Error('sem-usuario');
  return accountId;
}

/** O item vem do contexto da extensão — o painel sabe onde está. */
function itemDoPainel(req) {
  const issue = req?.context?.extension?.issue;
  if (!issue?.id) throw new Error('sem-item');
  return { issueId: String(issue.id), issueKey: issue.key || null };
}

/** Formato único que o painel entende, para não espalhar formatação na UI. */
export function paraPainel(timer) {
  if (!timer) return null;
  return {
    issueId: timer.issueId,
    issueKey: timer.issueKey,
    startedAt: timer.startedAt,
    segundos: timer.segundos,
    relogio: formatarRelogio(timer.segundos),
    duracao: formatarDuracao(timer.segundos),
    suspeito: Boolean(timer.suspeito),
    invalido: Boolean(timer.invalido),
  };
}

/**
 * Envelopa a operação: erro vira resposta com motivo, nunca uma exceção crua
 * subindo para o painel. O painel do item não pode ficar em branco.
 */
function seguro(fn) {
  return async (req) => {
    try {
      return { ok: true, ...(await fn(req)) };
    } catch (erro) {
      console.error('nativelog:', erro?.message, erro);
      return { ok: false, motivo: erro?.message || 'erro-desconhecido' };
    }
  };
}

export function criarPainel({ timers }) {
  return {
    /** Estado inicial: existe timer meu? é neste item ou em outro? */
    estadoDoTimer: seguro(async (req) => {
      const accountId = quemEstaPedindo(req);
      const { issueId, issueKey } = itemDoPainel(req);
      const timer = await timers.ler(accountId);
      return {
        item: { issueId, issueKey },
        timer: paraPainel(timer),
        // Timer rodando em OUTRO item: o painel precisa avisar antes de trocar.
        emOutroItem: Boolean(timer) && timer.issueId !== issueId,
      };
    }),

    iniciarTimer: seguro(async (req) => {
      const accountId = quemEstaPedindo(req);
      const item = itemDoPainel(req);
      const { timer, anterior, jaEstavaRodando } = await timers.iniciar(accountId, item);
      return {
        timer: paraPainel(timer),
        // D3 grava o worklog do anterior. Até lá o painel só relata o que houve.
        anterior: paraPainel(anterior),
        jaEstavaRodando,
      };
    }),

    pararTimer: seguro(async (req) => {
      const accountId = quemEstaPedindo(req);
      const encerrado = await timers.parar(accountId);
      // D3: aqui entra a gravação do worklog nativo via api.asUser().
      return { encerrado: paraPainel(encerrado) };
    }),

    descartarTimer: seguro(async (req) => {
      const accountId = quemEstaPedindo(req);
      const descartado = await timers.descartar(accountId);
      return { descartado: paraPainel(descartado) };
    }),
  };
}
