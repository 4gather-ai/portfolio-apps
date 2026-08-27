import { describe, it, expect } from 'vitest';
import { diasDaSemana, rotuloDoDia, tituloDaSemana } from './semanaUi.js';
import { chaveDoDia, limitesDaSemana } from '../lib/time.js';

/**
 * Calendário erra em silêncio: vira uma folha de ponto com seis dias, ou com a
 * segunda-feira errada, e ninguém percebe olhando a tela. Por isso tem teste.
 */

describe('diasDaSemana', () => {
  it('são sete dias, começando no que foi pedido', () => {
    const { inicio } = limitesDaSemana(new Date(2026, 7, 26)); // quarta
    const dias = diasDaSemana(inicio);

    expect(dias).toHaveLength(7);
    expect(chaveDoDia(dias[0].data)).toBe('2026-08-24'); // segunda
    expect(chaveDoDia(dias[6].data)).toBe('2026-08-30'); // domingo
  });

  it('são sete datas distintas e consecutivas', () => {
    const dias = diasDaSemana(new Date(2026, 7, 24));
    const chaves = dias.map((d) => chaveDoDia(d.data));

    expect(new Set(chaves).size).toBe(7);
    expect(chaves).toEqual([
      '2026-08-24',
      '2026-08-25',
      '2026-08-26',
      '2026-08-27',
      '2026-08-28',
      '2026-08-29',
      '2026-08-30',
    ]);
  });

  it('a virada do mês não perde nem repete dia', () => {
    const chaves = diasDaSemana(new Date(2026, 7, 31)).map((d) => chaveDoDia(d.data));
    expect(chaves[0]).toBe('2026-08-31');
    expect(chaves[6]).toBe('2026-09-06');
    expect(new Set(chaves).size).toBe(7);
  });

  it('a virada do ano também não', () => {
    const chaves = diasDaSemana(new Date(2026, 11, 28)).map((d) => chaveDoDia(d.data));
    expect(chaves[0]).toBe('2026-12-28');
    expect(chaves[6]).toBe('2027-01-03');
  });

  /**
   * O motivo de somar dia de calendário em vez de 24 h: num domingo de virada
   * de horário de verão o dia tem 23 ou 25 horas. Somando milissegundos, a
   * folha perderia ou repetiria uma data exatamente na semana da virada.
   */
  it('cada semana do ano tem sete datas distintas — inclusive as da virada de horário', () => {
    for (let semana = 0; semana < 53; semana += 1) {
      const inicio = new Date(2026, 0, 5 + semana * 7);
      const chaves = diasDaSemana(inicio).map((d) => chaveDoDia(d.data));
      expect(new Set(chaves).size).toBe(7);
      expect(chaves[0]).toBe(chaveDoDia(inicio));
    }
  });

  it('não estoura o mês bissexto', () => {
    const chaves = diasDaSemana(new Date(2028, 1, 26)).map((d) => chaveDoDia(d.data));
    expect(chaves).toContain('2028-02-29');
    expect(new Set(chaves).size).toBe(7);
  });
});

describe('rótulos', () => {
  it('o rótulo do dia traz dia da semana e data', () => {
    const rotulo = rotuloDoDia(new Date(2026, 7, 24));
    expect(rotulo).toMatch(/24/);
    expect(rotulo.length).toBeGreaterThan(5);
  });

  it('o título mostra as duas pontas da semana', () => {
    const { inicio, fim } = limitesDaSemana(new Date(2026, 7, 26));
    const titulo = tituloDaSemana(inicio, fim);
    expect(titulo).toMatch(/24/);
    expect(titulo).toMatch(/30/);
    expect(titulo).toContain(' - ');
  });
});
