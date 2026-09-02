import { describe, it, expect } from 'vitest';
import {
  aindaPendentes,
  diasDaSemana,
  rotuloDoDia,
  semanaVisivel,
  tituloDaSemana,
} from './semanaUi.js';
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

/**
 * D15 — a entrada recém-lançada que a busca ainda não enxerga.
 *
 * Estes testes existem por um defeito visto no navegador: gravar dava certo e o
 * dia continuava dizendo "nothing logged", porque a folha é remontada por JQL e
 * o índice do Jira atrasa. **Numa folha de ponto isso vira lançamento em
 * duplicata**, então a regra não pode morar dentro de um `.jsx` sem teste.
 */
describe('semanaVisivel', () => {
  const janela = {
    inicio: new Date(2026, 7, 31, 0, 0, 0),
    fim: new Date(2026, 8, 6, 23, 59, 59, 999),
  };
  const naSemana = new Date(2026, 7, 31, 11, 25).toISOString();
  const foraDaSemana = new Date(2026, 7, 20, 11, 25).toISOString();

  const daBusca = [{ id: '1', started: naSemana }];

  it('sem pendente, devolve o que a busca devolveu', () => {
    expect(semanaVisivel(daBusca, [], janela)).toEqual(daBusca);
  });

  it('mostra a entrada recém-lançada que a busca ainda não trouxe', () => {
    const nova = { id: '2', started: naSemana };
    expect(semanaVisivel(daBusca, [nova], janela)).toEqual([daBusca[0], nova]);
  });

  it('não duplica quando a busca já a devolveu', () => {
    // O caso que faz a entrada aparecer duas vezes na folha, que é pior que não
    // aparecer: a pessoa apagaria uma delas achando que lançou duas vezes.
    const nova = { id: '1', started: naSemana };
    expect(semanaVisivel(daBusca, [nova], janela)).toEqual(daBusca);
  });

  it('compara id como texto — o Jira devolve número num lado e string no outro', () => {
    expect(semanaVisivel([{ id: 1, started: naSemana }], [{ id: '1', started: naSemana }], janela))
      .toHaveLength(1);
  });

  it('não arrasta a entrada de hoje para a semana que a pessoa está olhando', () => {
    // Lançar hoje e navegar para a semana passada não pode mostrar a entrada
    // lá — seria hora aparecendo num dia em que ninguém trabalhou.
    const nova = { id: '2', started: foraDaSemana };
    expect(semanaVisivel(daBusca, [nova], janela)).toEqual(daBusca);
  });

  it('janela ausente ou ilegível não inventa entrada nenhuma', () => {
    const nova = { id: '2', started: naSemana };
    expect(semanaVisivel(daBusca, [nova], null)).toEqual(daBusca);
    expect(semanaVisivel(daBusca, [nova], { inicio: 'ontem', fim: 'hoje' })).toEqual(daBusca);
  });

  it('data ilegível na pendente é descartada, não mostrada por engano', () => {
    expect(semanaVisivel(daBusca, [{ id: '2', started: 'qualquer coisa' }], janela)).toEqual(daBusca);
  });
});

describe('aindaPendentes', () => {
  it('tira as que a busca já devolveu', () => {
    expect(aindaPendentes([{ id: '1' }, { id: '2' }], [{ id: '1' }])).toEqual([{ id: '2' }]);
  });

  it('devolve o mesmo array quando nada mudou — array novo a cada carga re-renderiza à toa', () => {
    const pendentes = [{ id: '9' }];
    expect(aindaPendentes(pendentes, [{ id: '1' }])).toBe(pendentes);
  });

  it('aguenta lista vazia dos dois lados', () => {
    expect(aindaPendentes(undefined, undefined)).toEqual([]);
  });
});

/**
 * D15.1 — o idioma dos rótulos.
 *
 * A folha mostrava botões no idioma do Jira e colunas no idioma do navegador.
 * **Num painel com campo de data isso é ambiguidade real:** `9/2` é 2 de
 * setembro em inglês e 9 de fevereiro em português.
 */
describe('idioma dos rótulos', () => {
  const quarta = new Date(2026, 8, 2);

  it('o rótulo do dia segue o idioma pedido', () => {
    expect(rotuloDoDia(quarta, 'en-US')).toContain('Sep');
    expect(rotuloDoDia(quarta, 'pt-BR')).toContain('set');
  });

  it('o título da semana também', () => {
    expect(tituloDaSemana(quarta, new Date(2026, 8, 6), 'en-US')).toContain('Sep');
    expect(tituloDaSemana(quarta, new Date(2026, 8, 6), 'pt-BR')).toContain('set');
  });

  it('os sete dias saem todos no mesmo idioma', () => {
    const rotulos = diasDaSemana(new Date(2026, 7, 31), 'pt-BR').map((d) => d.rotulo);
    expect(rotulos).toHaveLength(7);
    for (const rotulo of rotulos) expect(rotulo).not.toMatch(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/);
  });

  it('sem idioma continua valendo — é o que vale enquanto o i18n não carregou', () => {
    // Não afirma o resultado, que depende da máquina: afirma que não quebra e
    // que devolve rótulo de verdade.
    expect(rotuloDoDia(quarta)).toBeTruthy();
    expect(diasDaSemana(new Date(2026, 7, 31))).toHaveLength(7);
  });
});
