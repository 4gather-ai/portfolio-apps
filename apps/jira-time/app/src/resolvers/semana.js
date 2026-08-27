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
  };
}
