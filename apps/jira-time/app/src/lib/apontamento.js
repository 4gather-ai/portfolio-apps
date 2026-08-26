/**
 * Nativelog — as regras de um apontamento manual.
 *
 * O timer produz um apontamento que a máquina mediu; aqui a pessoa digita.
 * Toda a diferença está aí: o que vem digitado pode ser erro de digitação, e um
 * erro de digitação numa folha de ponto **vira número errado numa fatura**.
 *
 * Por isso a validação é um módulo próprio, puro e testado: ela é a última
 * coisa entre o teclado de alguém e o worklog nativo do Jira.
 */

import { lerDuracao } from './time.js';

/**
 * Mesmo mínimo do timer, pelo mesmo motivo: o Jira trabalha em minutos.
 * Ver `MINIMO_SEGUNDOS` em `resolvers/painel.js`.
 */
export const MINIMO_SEGUNDOS = 60;

/**
 * Um apontamento só não passa de 24 h.
 *
 * O Jira aceita — mas quem digita "8" querendo 8 horas e a interface lê "8d"
 * acabou de lançar uma semana de trabalho num dia. Recusar aqui custa um aviso;
 * deixar passar custa a confiança na folha de ponto, que é o produto inteiro.
 * Quem realmente trabalhou 30 h lança em dois dias, que é onde o trabalho
 * aconteceu de verdade.
 */
export const MAXIMO_SEGUNDOS = 24 * 3600;

/**
 * Quanto o início pode estar no futuro.
 *
 * Nada, fora a folga para relógio de máquina adiantado. Apontar trabalho que
 * ainda não aconteceu é planejamento, e planejamento não é o que este app faz.
 */
export const FOLGA_FUTURO_MS = 5 * 60 * 1000;

/**
 * Valida o que a pessoa digitou e devolve o apontamento pronto para gravar.
 *
 * Devolve **motivo**, nunca mensagem: a frase que o usuário lê é montada no
 * painel, que é onde mora o idioma. Nunca chuta um valor "próximo" do que foi
 * digitado — apontamento adivinhado é pior que apontamento recusado.
 */
export function validarApontamento(campos, agora = new Date()) {
  // `= {}` no parâmetro não cobre `null`, e um payload nulo é exatamente o que
  // chega quando o `invoke` é chamado sem argumento.
  const { duracao, iniciadoEm, comentario } = campos || {};

  const segundos = lerDuracao(duracao);
  if (segundos === null) return { ok: false, motivo: 'duracao-invalida' };
  if (segundos < MINIMO_SEGUNDOS) return { ok: false, motivo: 'curto-demais' };
  if (segundos > MAXIMO_SEGUNDOS) return { ok: false, motivo: 'longo-demais' };

  if (typeof iniciadoEm !== 'string' || !iniciadoEm.trim()) {
    return { ok: false, motivo: 'inicio-invalido' };
  }
  const inicio = Date.parse(iniciadoEm);
  if (Number.isNaN(inicio)) return { ok: false, motivo: 'inicio-invalido' };
  if (inicio - agora.getTime() > FOLGA_FUTURO_MS) {
    return { ok: false, motivo: 'inicio-no-futuro' };
  }

  return {
    ok: true,
    segundos,
    startedAt: new Date(inicio).toISOString(),
    // Comentário é opcional de propósito: exigir descrição faz a pessoa digitar
    // "trabalho" mil vezes, e aí a coluna não informa nada.
    comentario: typeof comentario === 'string' && comentario.trim() ? comentario.trim() : undefined,
  };
}
