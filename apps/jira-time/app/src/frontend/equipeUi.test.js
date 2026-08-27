import { describe, it, expect } from 'vitest';
import { porPessoa, totalDoTime } from './equipeUi.js';
import { limitesDaSemana } from '../lib/time.js';
import { diasDaSemana } from './semanaUi.js';

/**
 * A folha do time é **somente leitura**, e o formato reforça isso: totais por
 * pessoa e por dia, nunca lançamentos editáveis. Corrigir hora alheia é pela
 * tela do Jira — ver `resolvers/semana.js`.
 */

const DIAS = diasDaSemana(limitesDaSemana(new Date(2026, 7, 26)).inicio); // 24 a 30/08

function entrada(autorId, autorNome, dia, hora, segundos) {
  return {
    id: `${autorId}-${dia}-${hora}`,
    autorId,
    autorNome,
    started: new Date(2026, 7, dia, hora).toISOString(),
    segundos,
  };
}

describe('porPessoa', () => {
  it('junta os lançamentos de cada pessoa e soma a semana', () => {
    const linhas = porPessoa(
      [
        entrada('a', 'Ana', 24, 9, 3600),
        entrada('a', 'Ana', 24, 14, 1800),
        entrada('b', 'Bruno', 25, 10, 7200),
      ],
      DIAS
    );

    expect(linhas).toHaveLength(2);
    expect(linhas.find((l) => l.id === 'a').total).toBe(5400);
    expect(linhas.find((l) => l.id === 'b').total).toBe(7200);
  });

  it('os totais por dia ficam alinhados com os sete dias da semana', () => {
    const linhas = porPessoa([entrada('a', 'Ana', 26, 9, 3600)], DIAS);

    expect(linhas[0].dias).toHaveLength(7);
    // Quarta é o terceiro dia da semana que começa na segunda.
    expect(linhas[0].dias[2]).toBe(3600);
    expect(linhas[0].dias.filter((s) => s > 0)).toHaveLength(1);
  });

  it('**o dia é o dia local de quem apontou**, não o dia UTC', () => {
    // 23h30 de quarta local ainda é quarta, mesmo já sendo quinta em UTC.
    const linhas = porPessoa([entrada('a', 'Ana', 26, 23, 3600)], DIAS);
    expect(linhas[0].dias[2]).toBe(3600);
    expect(linhas[0].dias[3]).toBe(0);
  });

  it('ordena por total decrescente — quem coordena procura o fora da curva', () => {
    const linhas = porPessoa(
      [
        entrada('a', 'Ana', 24, 9, 1800),
        entrada('b', 'Bruno', 24, 9, 7200),
        entrada('c', 'Carla', 24, 9, 3600),
      ],
      DIAS
    );

    expect(linhas.map((l) => l.nome)).toEqual(['Bruno', 'Carla', 'Ana']);
  });

  it('empate desempata por nome, para a lista não dançar entre recargas', () => {
    const linhas = porPessoa(
      [entrada('z', 'Zoe', 24, 9, 3600), entrada('a', 'Ana', 24, 9, 3600)],
      DIAS
    );
    expect(linhas.map((l) => l.nome)).toEqual(['Ana', 'Zoe']);
  });

  it('sem nome, diz que não sabe em vez de mostrar um id de conta', () => {
    const linhas = porPessoa([{ autorId: 'x', started: DIAS[0].data.toISOString(), segundos: 60 }], DIAS);
    expect(linhas[0].nome).toBe('Unknown user');
  });

  it('lançamento fora dos sete dias não entra em coluna nenhuma, mas conta no total', () => {
    // A janela do servidor já corta; isto garante que a tela não inventa coluna.
    const linhas = porPessoa([entrada('a', 'Ana', 31, 9, 3600)], DIAS);
    expect(linhas[0].dias.every((s) => s === 0)).toBe(true);
    expect(linhas[0].total).toBe(3600);
  });

  it('semana sem ninguém é uma lista vazia, não um erro', () => {
    expect(porPessoa([], DIAS)).toEqual([]);
    expect(porPessoa()).toEqual([]);
  });

  it('**não devolve lançamento editável** — só totais. A tela é de leitura', () => {
    const linhas = porPessoa([entrada('a', 'Ana', 24, 9, 3600)], DIAS);
    expect(linhas[0]).not.toHaveProperty('entradas');
    expect(linhas[0]).not.toHaveProperty('id_worklog');
    expect(Object.keys(linhas[0]).sort()).toEqual(['dias', 'id', 'nome', 'porDia', 'total']);
  });
});

describe('totalDoTime', () => {
  it('soma o que as linhas somam', () => {
    const linhas = porPessoa(
      [entrada('a', 'Ana', 24, 9, 3600), entrada('b', 'Bruno', 25, 9, 1800)],
      DIAS
    );
    expect(totalDoTime(linhas)).toBe(5400);
  });

  it('time vazio soma zero', () => {
    expect(totalDoTime([])).toBe(0);
    expect(totalDoTime()).toBe(0);
  });
});
