import { describe, it, expect } from 'vitest';
import { CONCORRENCIA, emLotes } from './lotes.js';

/**
 * Isto existe por causa do 429. Sessenta chamadas simultâneas ao Jira voltam
 * com rate limit, e a folha da semana aparece cheia de buracos numa semana em
 * que estava tudo bem. **Numa folha de ponto, completa e devagar ganha de
 * rápida e furada.**
 */

/** Tarefa que registra quantas rodaram ao mesmo tempo. */
function tarefaQueObserva(atraso = 0) {
  let emVoo = 0;
  let pico = 0;
  const tarefa = async (item) => {
    emVoo += 1;
    pico = Math.max(pico, emVoo);
    if (atraso) await new Promise((r) => setTimeout(r, atraso));
    else await Promise.resolve();
    emVoo -= 1;
    return item * 2;
  };
  return { tarefa, pico: () => pico };
}

describe('emLotes', () => {
  it('roda tudo e preserva a ordem da entrada', async () => {
    const { tarefa } = tarefaQueObserva();
    expect(await emLotes([1, 2, 3, 4, 5], tarefa)).toEqual([2, 4, 6, 8, 10]);
  });

  it('**nunca passa do limite de concorrência**', async () => {
    const { tarefa, pico } = tarefaQueObserva(2);
    await emLotes(Array.from({ length: 30 }, (_, i) => i), tarefa, 5);
    expect(pico()).toBeLessThanOrEqual(5);
  });

  it('ordem preservada mesmo com tarefas terminando fora de ordem', async () => {
    // A primeira demora mais que as outras: sem cuidado, ela chegaria por último.
    const tarefa = async (n) => {
      await new Promise((r) => setTimeout(r, n === 0 ? 12 : 1));
      return n;
    };
    expect(await emLotes([0, 1, 2, 3], tarefa, 2)).toEqual([0, 1, 2, 3]);
  });

  it('lista vazia não chama nada e não trava', async () => {
    let chamou = false;
    expect(
      await emLotes([], async () => {
        chamou = true;
      })
    ).toEqual([]);
    expect(chamou).toBe(false);
  });

  it('lista menor que o limite não cria trabalhador à toa', async () => {
    const { tarefa, pico } = tarefaQueObserva(2);
    await emLotes([1, 2], tarefa, 10);
    expect(pico()).toBeLessThanOrEqual(2);
  });

  it('entrada que não é lista vira lista vazia em vez de explodir', async () => {
    expect(await emLotes(undefined, async (x) => x)).toEqual([]);
    expect(await emLotes(null, async (x) => x)).toEqual([]);
  });

  it('limite zero ou negativo ainda roda, com um por vez', async () => {
    const { tarefa, pico } = tarefaQueObserva(2);
    expect(await emLotes([1, 2, 3], tarefa, 0)).toEqual([2, 4, 6]);
    expect(pico()).toBe(1);
  });

  it('o padrão é conservador de propósito', () => {
    // O limite real da Atlassian varia por instância e não é publicado. Errar
    // para menos custa segundos; errar para mais custa dados.
    expect(CONCORRENCIA).toBeLessThanOrEqual(5);
    expect(CONCORRENCIA).toBeGreaterThan(0);
  });

  it('recebe o índice, para quem precisar rotular sem contar de novo', async () => {
    const vistos = [];
    await emLotes(['a', 'b', 'c'], async (item, i) => vistos.push(`${i}:${item}`), 1);
    expect(vistos).toEqual(['0:a', '1:b', '2:c']);
  });
});
