/**
 * Nativelog — operações da página "Minha semana".
 *
 * Separado de `painel.js` porque é outro módulo do Forge (`jira:globalPage`) e
 * outra pergunta: o painel é sobre **um item**, a semana é sobre **uma pessoa**.
 * Compartilham o resolver e nada mais.
 *
 * **A janela vem do navegador.** Segunda 00:00 a domingo 23:59:59.999 é uma
 * frase que só faz sentido dentro de um fuso, e o único lugar do sistema que
 * conhece o fuso de quem está olhando é a tela dela. O resolver recebe dois
 * instantes absolutos e não opina sobre que dias são esses.
 */

import { formatarDuracao } from '../lib/time.js';

function quemEstaPedindo(req) {
  const accountId = req?.context?.accountId;
  if (!accountId) throw new Error('sem-usuario');
  return accountId;
}

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

export function criarVisaoSemana({ semana }) {
  return {
    minhaSemana: seguro(async (req) => {
      const accountId = quemEstaPedindo(req);
      const { desde, ate } = req?.payload || {};

      const r = await semana.minhaSemana({ accountId, desde, ate });
      if (!r.ok) return { ok: false, motivo: r.motivo };

      return {
        // `started` continua instante absoluto: o dia é decidido na tela.
        entradas: r.entradas.map((e) => ({ ...e, duracao: formatarDuracao(e.segundos) })),
        totalSegundos: r.entradas.reduce((soma, e) => soma + e.segundos, 0),
        itensLidos: r.itensLidos,
        // O que a lista não tem — dito, nunca escondido atrás de um total.
        cortada: r.cortada,
        falhas: r.falhas,
      };
    }),

    /**
     * D9 — a semana do time, **somente leitura**.
     *
     * Devolve entradas com autor. Não há operação de escrita nesta tela e não
     * vai haver: **corrigir hora de outra pessoa continua sendo pela tela do
     * Jira**, com a permissão do Jira. A regra do D4 não muda porque apareceu
     * uma tela nova.
     */
    semanaDoTime: seguro(async (req) => {
      quemEstaPedindo(req);
      const { projetoChave, desde, ate } = req?.payload || {};

      const r = await semana.semanaDoTime({ projetoChave, desde, ate });
      if (!r.ok) return { ok: false, motivo: r.motivo };

      return {
        // `started` continua instante absoluto: o dia é decidido na tela.
        entradas: r.entradas.map((e) => ({ ...e, duracao: formatarDuracao(e.segundos) })),
        totalSegundos: r.entradas.reduce((soma, e) => soma + e.segundos, 0),
        itensLidos: r.itensLidos,
        cortada: r.cortada,
        falhas: r.falhas,
        somenteLeitura: true,
      };
    }),

    /** Os projetos que esta pessoa enxerga, para o seletor. */
    projetosVisiveis: seguro(async (req) => {
      quemEstaPedindo(req);
      const r = await semana.projetosVisiveis();
      if (!r.ok) return { ok: false, motivo: r.motivo };
      return { projetos: r.projetos };
    }),
  };
}
