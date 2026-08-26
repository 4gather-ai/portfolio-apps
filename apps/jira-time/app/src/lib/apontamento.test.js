import { describe, it, expect } from 'vitest';
import {
  validarApontamento,
  MINIMO_SEGUNDOS,
  MAXIMO_SEGUNDOS,
  FOLGA_FUTURO_MS,
} from './apontamento.js';

/**
 * Esta é a última coisa entre o teclado de alguém e o worklog nativo do Jira.
 * O que passar daqui vira número na folha de ponto de um cliente.
 */

const AGORA = new Date('2026-08-27T15:00:00.000Z');
const ONTEM = '2026-08-26T09:00:00.000Z';

describe('validarApontamento — duração', () => {
  it('aceita a notação do Jira', () => {
    const r = validarApontamento({ duracao: '1h 30m', iniciadoEm: ONTEM }, AGORA);
    expect(r).toMatchObject({ ok: true, segundos: 5400 });
  });

  it('aceita número puro como horas — é como a maioria digita', () => {
    expect(validarApontamento({ duracao: '2', iniciadoEm: ONTEM }, AGORA).segundos).toBe(7200);
    expect(validarApontamento({ duracao: '2,5', iniciadoEm: ONTEM }, AGORA).segundos).toBe(9000);
  });

  it('recusa o que não dá para entender em vez de chutar', () => {
    for (const duracao of ['', '   ', 'umas duas horas', '3h banana', null, undefined, 42]) {
      expect(validarApontamento({ duracao, iniciadoEm: ONTEM }, AGORA)).toEqual({
        ok: false,
        motivo: 'duracao-invalida',
      });
    }
  });

  it('recusa menos de um minuto — o Jira trabalha em minutos', () => {
    const r = validarApontamento({ duracao: '30s', iniciadoEm: ONTEM }, AGORA);
    expect(r.motivo).toBe('duracao-invalida'); // 's' não é unidade do Jira
    expect(MINIMO_SEGUNDOS).toBe(60);
  });

  it('recusa mais de 24 h num apontamento só — quase sempre é erro de digitação', () => {
    // "8d" quando a pessoa queria "8h": uma semana de trabalho num dia.
    const r = validarApontamento({ duracao: '8d', iniciadoEm: ONTEM }, AGORA);
    expect(r).toEqual({ ok: false, motivo: 'longo-demais' });
    expect(MAXIMO_SEGUNDOS).toBe(86400);
  });

  it('24 h exatas ainda passa — é o limite, não o proibido', () => {
    expect(validarApontamento({ duracao: '24h', iniciadoEm: ONTEM }, AGORA).ok).toBe(true);
  });
});

describe('validarApontamento — início', () => {
  it('lança trabalho de ontem sem reclamar: é o caso mais comum do apontamento manual', () => {
    const r = validarApontamento({ duracao: '3h', iniciadoEm: ONTEM }, AGORA);
    expect(r.ok).toBe(true);
    expect(r.startedAt).toBe('2026-08-26T09:00:00.000Z');
  });

  it('lança trabalho de meses atrás — corrigir folha antiga é legítimo', () => {
    const r = validarApontamento({ duracao: '3h', iniciadoEm: '2026-02-02T09:00:00.000Z' }, AGORA);
    expect(r.ok).toBe(true);
  });

  it('recusa início no futuro — este app aponta o que aconteceu', () => {
    const r = validarApontamento({ duracao: '3h', iniciadoEm: '2026-08-28T09:00:00.000Z' }, AGORA);
    expect(r).toEqual({ ok: false, motivo: 'inicio-no-futuro' });
  });

  it('a folga do futuro cobre relógio de máquina adiantado, não planejamento', () => {
    const poucoAdiantado = new Date(AGORA.getTime() + FOLGA_FUTURO_MS - 1000).toISOString();
    expect(validarApontamento({ duracao: '3h', iniciadoEm: poucoAdiantado }, AGORA).ok).toBe(true);

    const meiaHoraAdiantado = new Date(AGORA.getTime() + 30 * 60000).toISOString();
    expect(validarApontamento({ duracao: '3h', iniciadoEm: meiaHoraAdiantado }, AGORA).motivo).toBe(
      'inicio-no-futuro'
    );
  });

  it('recusa data ilegível ou ausente', () => {
    for (const iniciadoEm of ['', 'ontem', null, undefined, 12345]) {
      expect(validarApontamento({ duracao: '1h', iniciadoEm }, AGORA)).toEqual({
        ok: false,
        motivo: 'inicio-invalido',
      });
    }
  });

  it('a duração é conferida antes do início — o erro mais provável vem primeiro', () => {
    const r = validarApontamento({ duracao: 'xxx', iniciadoEm: 'yyy' }, AGORA);
    expect(r.motivo).toBe('duracao-invalida');
  });
});

describe('validarApontamento — comentário', () => {
  it('é opcional: exigir descrição faz a pessoa digitar "trabalho" mil vezes', () => {
    const r = validarApontamento({ duracao: '1h', iniciadoEm: ONTEM }, AGORA);
    expect(r.ok).toBe(true);
    expect(r.comentario).toBeUndefined();
  });

  it('espaço em branco não vira descrição', () => {
    const r = validarApontamento({ duracao: '1h', iniciadoEm: ONTEM, comentario: '   ' }, AGORA);
    expect(r.comentario).toBeUndefined();
  });

  it('descrição é aparada, não alterada', () => {
    const r = validarApontamento(
      { duracao: '1h', iniciadoEm: ONTEM, comentario: '  revisão do PR  ' },
      AGORA
    );
    expect(r.comentario).toBe('revisão do PR');
  });
});

describe('validarApontamento — chamada vazia', () => {
  it('não quebra quando o payload não vem', () => {
    expect(validarApontamento()).toEqual({ ok: false, motivo: 'duracao-invalida' });
    expect(validarApontamento(null)).toEqual({ ok: false, motivo: 'duracao-invalida' });
  });
});
