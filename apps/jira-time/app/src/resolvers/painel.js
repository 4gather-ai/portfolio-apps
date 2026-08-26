/**
 * Nativelog — as operações do painel do item.
 *
 * Separado de `index.js` para poder ser testado sem Forge: `index.js` só liga
 * o KVS e o `asUser()` de verdade. Aqui está tudo que pode dar errado —
 * contexto faltando, Jira fora do ar, permissão negada, gravação que talvez
 * tenha chegado — e é por isso que mora num arquivo que os testes alcançam.
 */

import { formatarDuracao, formatarRelogio } from '../lib/time.js';

/**
 * Abaixo disso não vira worklog.
 *
 * O Jira trabalha em minutos e um timer de 8 segundos é clique errado, não
 * trabalho. Gravar mesmo assim sujaria a folha de ponto de quem confia nela.
 * Anotado para revisitar no beta: se alguém reclamar, o número muda.
 */
export const MINIMO_SEGUNDOS = 60;

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
    // Uma gravação já falhou neste timer: o painel mostra e oferece tentar de novo.
    tentativas: timer.tentativas || 0,
    ultimaFalha: timer.ultimaFalha || null,
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

export function criarPainel({ timers, worklogs }) {
  /**
   * O coração do D3: transformar o timer parado em worklog nativo do Jira.
   *
   * Ordem: **grava primeiro, apaga o timer depois.** Se a gravação falhar, o
   * timer continua de pé e a pessoa pode tentar de novo — perder hora
   * cronometrada é o pior desfecho possível para um app de apontamento.
   */
  async function gravarEEncerrar(accountId, timer) {
    // Registro corrompido no KVS não vira hora inventada no Jira de ninguém.
    if (timer.invalido) {
      await timers.descartar(accountId);
      return { ok: false, motivo: 'timer-corrompido', encerrado: paraPainel(timer) };
    }

    if (timer.segundos < MINIMO_SEGUNDOS) {
      await timers.descartar(accountId);
      return { ok: true, gravado: false, motivo: 'curto-demais', encerrado: paraPainel(timer) };
    }

    const alvo = {
      issueId: timer.issueId,
      startedAt: timer.startedAt,
      segundos: timer.segundos,
    };

    // Uma tentativa anterior caiu na rede: o Jira pode ter recebido. Conferir
    // antes de escrever de novo, senão a pessoa ganha a hora em dobro.
    if (timer.podeTerGravado) {
      const busca = await worklogs.jaExiste({ ...alvo, accountId });
      if (busca.ok && busca.encontrado) {
        await timers.parar(accountId);
        return {
          ok: true,
          gravado: true,
          jaEstavaGravado: true,
          encerrado: paraPainel(timer),
          worklog: {
            id: busca.worklog.id,
            started: busca.worklog.started,
            segundos: busca.worklog.timeSpentSeconds,
            autorNome: busca.worklog.author?.displayName || null,
            duracao: formatarDuracao(busca.worklog.timeSpentSeconds),
          },
        };
      }
    }

    // Marcado ANTES do POST: se esta invocação morrer no meio, a próxima
    // tentativa ainda sabe que precisa conferir antes de escrever.
    await timers.marcarEmCurso(accountId);
    const escrita = await worklogs.gravar(alvo);

    if (!escrita.ok) {
      const mantido = await timers.marcarFalha(accountId, escrita.motivo, escrita.podeTerGravado);
      return {
        ok: false,
        motivo: escrita.motivo,
        // O timer segue vivo — o painel precisa dizer isso, não só "deu erro".
        timerMantido: paraPainel(mantido || timer),
      };
    }

    await timers.parar(accountId);
    return {
      ok: true,
      gravado: true,
      encerrado: paraPainel(timer),
      worklog: { ...escrita.worklog, duracao: formatarDuracao(escrita.worklog.segundos) },
    };
  }

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
      // Instante do clique, medido no navegador. O cold start do Forge chega a
      // 20 s: sem isso, esses segundos sumiriam do apontamento e o relógio da
      // tela pularia para trás quando a resposta chegasse. `timers.iniciar`
      // valida antes de confiar — ver `inicioDoTimer` em `lib/time.js`.
      const iniciadoEm = req?.payload?.iniciadoEm;
      const atual = await timers.ler(accountId);

      // Clicar de novo no mesmo item não reinicia nada.
      if (atual && String(atual.issueId) === item.issueId) {
        return { timer: paraPainel(atual), anterior: null, jaEstavaRodando: true };
      }

      let anterior = null;
      if (atual) {
        // Um timer por pessoa: o anterior vira worklog ANTES do novo começar.
        const fechamento = await gravarEEncerrar(accountId, atual);
        if (!fechamento.ok) {
          // Não se começa um timer novo por cima de hora que não foi gravada.
          return {
            ok: false,
            motivo: fechamento.motivo,
            aoFecharAnterior: true,
            timerMantido: fechamento.timerMantido || paraPainel(atual),
          };
        }
        anterior = fechamento;
      }

      const { timer } = await timers.iniciar(accountId, item, iniciadoEm);
      return { timer: paraPainel(timer), anterior, jaEstavaRodando: false };
    }),

    pararTimer: seguro(async (req) => {
      const accountId = quemEstaPedindo(req);
      const timer = await timers.ler(accountId);
      if (!timer) return { encerrado: null, gravado: false };
      return gravarEEncerrar(accountId, timer);
    }),

    descartarTimer: seguro(async (req) => {
      const accountId = quemEstaPedindo(req);
      const descartado = await timers.descartar(accountId);
      return { descartado: paraPainel(descartado) };
    }),
  };
}
