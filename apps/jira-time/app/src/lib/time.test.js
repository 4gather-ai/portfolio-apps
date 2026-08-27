import { describe, it, expect } from 'vitest';
import {
  paraDataJira,
  lerDuracao,
  formatarDuracao,
  duracaoDoTimer,
  limitesDaSemana,
  chaveDoDia,
  agruparPorDia,
  formatarRelogio,
  inicioDoTimer,
  TOLERANCIA_INICIO_MS,
} from './time.js';

describe('paraDataJira', () => {
  it('usa offset numérico, não Z — o Jira rejeita ISO puro', () => {
    const d = new Date('2026-08-26T10:00:00.000Z');
    expect(paraDataJira(d)).toBe('2026-08-26T10:00:00.000+0000');
    expect(paraDataJira(d)).not.toContain('Z');
  });

  it('recusa entrada inválida em vez de gerar data errada', () => {
    expect(() => paraDataJira(new Date('nada'))).toThrow(TypeError);
    expect(() => paraDataJira('2026-08-26')).toThrow(TypeError);
  });
});

describe('lerDuracao', () => {
  it('entende a notação do Jira', () => {
    expect(lerDuracao('3h')).toBe(10800);
    expect(lerDuracao('30m')).toBe(1800);
    expect(lerDuracao('2d 4h 30m')).toBe(2 * 86400 + 4 * 3600 + 1800);
    expect(lerDuracao('1w')).toBe(604800);
  });

  it('trata número puro como horas, que é como as pessoas digitam', () => {
    expect(lerDuracao('2')).toBe(7200);
    expect(lerDuracao('1.5')).toBe(5400);
    expect(lerDuracao('1,5')).toBe(5400); // vírgula decimal, pt-BR e DE
  });

  it('é tolerante com espaço e caixa', () => {
    expect(lerDuracao('  3H  ')).toBe(10800);
    expect(lerDuracao('2d4h')).toBe(2 * 86400 + 4 * 3600);
  });

  it('devolve null em vez de chutar', () => {
    expect(lerDuracao('')).toBeNull();
    expect(lerDuracao('banana')).toBeNull();
    expect(lerDuracao('3h banana')).toBeNull();
    expect(lerDuracao('0h')).toBeNull();
    expect(lerDuracao('-2h')).toBeNull();
    expect(lerDuracao(null)).toBeNull();
    expect(lerDuracao(42)).toBeNull();
  });
});

describe('formatarDuracao', () => {
  it('volta para a notação do Jira', () => {
    expect(formatarDuracao(10800)).toBe('3h');
    expect(formatarDuracao(1800)).toBe('30m');
    expect(formatarDuracao(2 * 86400 + 4 * 3600 + 1800)).toBe('2d 4h 30m');
  });

  it('ida e volta preserva o valor', () => {
    for (const texto of ['3h', '2d 4h 30m', '1w 2d', '45m']) {
      expect(formatarDuracao(lerDuracao(texto))).toBe(texto);
    }
  });

  it('não inventa duração para valor vazio ou inválido', () => {
    expect(formatarDuracao(0)).toBe('0m');
    expect(formatarDuracao(-5)).toBe('0m');
    expect(formatarDuracao(NaN)).toBe('0m');
  });
});

describe('duracaoDoTimer', () => {
  const inicio = '2026-08-26T10:00:00.000Z';

  it('calcula o tempo decorrido', () => {
    const r = duracaoDoTimer(inicio, new Date('2026-08-26T13:00:00.000Z'));
    expect(r.segundos).toBe(10800);
    expect(r.invalido).toBe(false);
    expect(r.suspeito).toBe(false);
  });

  it('marca como suspeito o timer esquecido — não grava 14h calado', () => {
    const r = duracaoDoTimer(inicio, new Date('2026-08-27T00:00:00.000Z'));
    expect(r.suspeito).toBe(true);
  });

  it('protege contra relógio para trás', () => {
    const r = duracaoDoTimer(inicio, new Date('2026-08-26T09:00:00.000Z'));
    expect(r.invalido).toBe(true);
    expect(r.segundos).toBe(0);
  });

  it('não explode com início corrompido no KVS', () => {
    expect(duracaoDoTimer('lixo').invalido).toBe(true);
  });
});

describe('limitesDaSemana', () => {
  it('começa na segunda e termina no domingo', () => {
    // 2026-08-26 é uma quarta-feira
    const { inicio, fim } = limitesDaSemana(new Date(2026, 7, 26, 15, 30));
    expect(inicio.getDay()).toBe(1);
    expect(fim.getDay()).toBe(0);
    expect(chaveDoDia(inicio)).toBe('2026-08-24');
    expect(chaveDoDia(fim)).toBe('2026-08-30');
  });

  it('zera e satura as horas nas pontas', () => {
    const { inicio, fim } = limitesDaSemana(new Date(2026, 7, 26));
    expect(inicio.getHours()).toBe(0);
    expect(fim.getHours()).toBe(23);
    expect(fim.getMinutes()).toBe(59);
  });

  it('navega semanas para trás e para frente', () => {
    const anterior = limitesDaSemana(new Date(2026, 7, 26), -1);
    expect(chaveDoDia(anterior.inicio)).toBe('2026-08-17');
    const seguinte = limitesDaSemana(new Date(2026, 7, 26), 1);
    expect(chaveDoDia(seguinte.inicio)).toBe('2026-08-31');
  });

  it('trata o domingo como fim da semana anterior, não início da seguinte', () => {
    // 2026-08-30 é domingo
    const { inicio } = limitesDaSemana(new Date(2026, 7, 30, 12));
    expect(chaveDoDia(inicio)).toBe('2026-08-24');
  });
});

describe('agruparPorDia', () => {
  const eu = 'conta-eu';
  const worklogs = [
    { author: { accountId: eu }, started: '2026-08-26T09:00:00.000+0000', timeSpentSeconds: 3600 },
    { author: { accountId: eu }, started: '2026-08-26T14:00:00.000+0000', timeSpentSeconds: 1800 },
    { author: { accountId: 'outra-pessoa' }, started: '2026-08-26T10:00:00.000+0000', timeSpentSeconds: 7200 },
    { author: { accountId: eu }, started: '2026-08-27T09:00:00.000+0000', timeSpentSeconds: 3600 },
  ];

  it('soma por dia só o que é meu — a folha é de uma pessoa', () => {
    const { porDia, total } = agruparPorDia(worklogs, eu);
    expect(total).toBe(9000);
    expect(Object.values(porDia).reduce((a, b) => a + b, 0)).toBe(9000);
    expect(Object.keys(porDia)).toHaveLength(2);
  });

  it('sem accountId, soma todo mundo — é a visão de equipe', () => {
    const { total } = agruparPorDia(worklogs, null);
    expect(total).toBe(16200);
  });

  it('aguenta lista vazia e campos faltando', () => {
    expect(agruparPorDia([], eu).total).toBe(0);
    expect(agruparPorDia(null, eu).total).toBe(0);
    const semSegundos = [{ author: { accountId: eu }, started: '2026-08-26T09:00:00.000+0000' }];
    expect(agruparPorDia(semSegundos, eu).total).toBe(0);
  });
});

describe('formatarRelogio', () => {
  it('mostra segundos — timer sem segundos parece travado', () => {
    expect(formatarRelogio(0)).toBe('0:00');
    expect(formatarRelogio(45)).toBe('0:45');
    expect(formatarRelogio(125)).toBe('2:05');
  });

  it('só mostra hora quando existe hora', () => {
    expect(formatarRelogio(3600)).toBe('1:00:00');
    expect(formatarRelogio(5025)).toBe('1:23:45');
    expect(formatarRelogio(3599)).toBe('59:59');
  });

  it('não vira NaN com entrada estragada', () => {
    expect(formatarRelogio(-10)).toBe('0:00');
    expect(formatarRelogio(NaN)).toBe('0:00');
    expect(formatarRelogio(undefined)).toBe('0:00');
  });
});

describe('inicioDoTimer', () => {
  const AGORA = new Date('2026-08-27T09:00:20.000Z');

  it('sem proposta: o relógio do servidor manda', () => {
    expect(inicioDoTimer(undefined, AGORA).toISOString()).toBe('2026-08-27T09:00:20.000Z');
    expect(inicioDoTimer(null, AGORA).toISOString()).toBe('2026-08-27T09:00:20.000Z');
  });

  it('cold start de 20 s: os segundos do clique não somem da folha de ponto', () => {
    const clique = '2026-08-27T09:00:00.000Z';
    expect(inicioDoTimer(clique, AGORA).toISOString()).toBe(clique);
  });

  it('relógio da máquina adiantado: cai para o servidor em vez de contar tempo futuro', () => {
    const futuro = '2026-08-27T09:05:00.000Z';
    expect(inicioDoTimer(futuro, AGORA).toISOString()).toBe('2026-08-27T09:00:20.000Z');
  });

  it('proposta velha demais é recusada: relógio errado não vira hora inventada', () => {
    const muitoAntes = '2026-08-27T08:00:00.000Z';
    expect(inicioDoTimer(muitoAntes, AGORA).toISOString()).toBe('2026-08-27T09:00:20.000Z');
  });

  it('a borda da tolerância é fechada de um lado só', () => {
    const agora = new Date('2026-08-27T09:02:00.000Z');
    // Exatamente no limite: ainda aceito.
    expect(inicioDoTimer('2026-08-27T09:00:00.000Z', agora, 120000).toISOString()).toBe(
      '2026-08-27T09:00:00.000Z'
    );
    // Um milissegundo além: recusado.
    expect(inicioDoTimer('2026-08-27T08:59:59.999Z', agora, 120000).toISOString()).toBe(
      '2026-08-27T09:02:00.000Z'
    );
    // Mesmo instante que o servidor: não há o que recuar.
    expect(inicioDoTimer('2026-08-27T09:02:00.000Z', agora, 120000).toISOString()).toBe(
      '2026-08-27T09:02:00.000Z'
    );
  });

  it('lixo no lugar da data não derruba o resolver', () => {
    expect(inicioDoTimer('ontem à noite', AGORA).toISOString()).toBe('2026-08-27T09:00:20.000Z');
    expect(inicioDoTimer(12345, AGORA).toISOString()).toBe('2026-08-27T09:00:20.000Z');
    expect(inicioDoTimer({ hora: 9 }, AGORA).toISOString()).toBe('2026-08-27T09:00:20.000Z');
  });

  it('a tolerância padrão cobre o pior cold start medido', () => {
    expect(TOLERANCIA_INICIO_MS).toBeGreaterThanOrEqual(20000);
  });
});

/**
 * D5 — fuso horário.
 *
 * **A que dia pertence uma hora apontada?** Ao dia de quem apontou, sempre.
 * Um apontamento das 23h30 de terça em São Paulo é 02h30 de quarta em UTC. Se
 * a folha de ponto fosse montada no servidor do Forge, que roda em UTC, essa
 * hora apareceria na quarta — e a pessoa veria trabalho num dia em que não
 * trabalhou. Por isso o agrupamento por dia é do navegador, e o resolver só
 * devolve instantes.
 *
 * Estes testes valem em qualquer fuso de propósito: constroem a data em hora
 * local e conferem o dia local. Um teste que só passasse em UTC daria
 * exatamente a falsa segurança que este bloco existe para evitar.
 */
describe('fuso: o dia de um apontamento é o dia de quem apontou', () => {
  it('23h30 pertence ao dia que a pessoa viveu, não ao dia seguinte em UTC', () => {
    const tardeDaNoite = new Date(2026, 7, 25, 23, 30);
    expect(chaveDoDia(tardeDaNoite)).toBe('2026-08-25');
  });

  it('00h30 pertence ao dia novo, não ao anterior', () => {
    expect(chaveDoDia(new Date(2026, 7, 26, 0, 30))).toBe('2026-08-26');
  });

  it('a virada do mês e a do ano não escorregam', () => {
    expect(chaveDoDia(new Date(2026, 7, 31, 23, 59))).toBe('2026-08-31');
    expect(chaveDoDia(new Date(2026, 8, 1, 0, 1))).toBe('2026-09-01');
    expect(chaveDoDia(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31');
    expect(chaveDoDia(new Date(2027, 0, 1, 0, 1))).toBe('2027-01-01');
  });

  it('agrupa duas pontas do mesmo dia local no mesmo balde', () => {
    const worklogs = [
      { started: new Date(2026, 7, 25, 0, 15).toISOString(), timeSpentSeconds: 3600 },
      { started: new Date(2026, 7, 25, 23, 45).toISOString(), timeSpentSeconds: 1800 },
    ];
    const { porDia, total } = agruparPorDia(worklogs);
    expect(Object.keys(porDia)).toEqual(['2026-08-25']);
    expect(porDia['2026-08-25']).toBe(5400);
    expect(total).toBe(5400);
  });

  it('a semana começa na segunda e cobre o domingo inteiro, em hora local', () => {
    // Quarta-feira, 26/08/2026.
    const { inicio, fim } = limitesDaSemana(new Date(2026, 7, 26, 15, 0));

    expect(chaveDoDia(inicio)).toBe('2026-08-24'); // segunda
    expect(chaveDoDia(fim)).toBe('2026-08-30'); // domingo
    expect(inicio.getHours()).toBe(0);
    expect(inicio.getMinutes()).toBe(0);
    expect(fim.getHours()).toBe(23);
    expect(fim.getMinutes()).toBe(59);
  });

  it('domingo pertence à semana que começou na segunda anterior', () => {
    // O erro clássico: getDay() trata domingo como 0 e joga o dia para a
    // semana seguinte. Uma folha de ponto que perde o domingo perde plantão.
    const { inicio } = limitesDaSemana(new Date(2026, 7, 30, 10, 0));
    expect(chaveDoDia(inicio)).toBe('2026-08-24');
  });

  it('o instante gravado no Jira continua absoluto — o fuso é só da leitura', () => {
    // paraDataJira preserva o instante; quem interpreta o dia é a tela.
    const instante = new Date(2026, 7, 25, 23, 30);
    const jira = paraDataJira(instante);
    expect(new Date(jira).getTime()).toBe(instante.getTime());
    expect(jira).toMatch(/\+0000$/);
  });
});
