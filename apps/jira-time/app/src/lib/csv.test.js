import { describe, it, expect } from 'vitest';
import {
  COLUNAS,
  celula,
  dataLocal,
  filtrarProjetos,
  horaLocal,
  horasDecimais,
  paraCSV,
  projetosDe,
} from './csv.js';

/** Entrada no formato que a folha da semana entrega. */
function entrada(extra = {}) {
  return {
    id: 'w1',
    issueKey: 'NL-1',
    titulo: 'Primeiro item',
    projetoChave: 'NL',
    projetoNome: 'Nativelog',
    started: new Date(2026, 7, 26, 14, 30).toISOString(),
    segundos: 5400,
    duracao: '1h 30m',
    comentario: 'revisão do PR',
    ...extra,
  };
}

describe('celula — segurança antes de formatação', () => {
  /**
   * **Injeção de fórmula em CSV é execução de código na máquina de quem abre.**
   * Quem escreve a descrição é qualquer pessoa do Jira; quem abre o CSV é
   * quase sempre o financeiro. O apóstrofo faz a planilha mostrar texto.
   */
  it('neutraliza fórmula que começa com sinal', () => {
    expect(celula('=1+1')).toBe("'=1+1");
    expect(celula('@SUM(A1)')).toBe("'@SUM(A1)");
    // Com aspas dentro, as duas defesas convivem: apóstrofo na frente, aspas
    // dobradas, e o campo inteiro entre aspas.
    expect(celula('+HYPERLINK("http://x")')).toBe('"\'+HYPERLINK(""http://x"")"');
  });

  it('o caso clássico: comando disfarçado de descrição', () => {
    const ataque = '=cmd|\' /C calc\'!A0';
    const saida = celula(ataque);
    expect(saida.startsWith("'=")).toBe(true);
  });

  it('hífen no começo também é fórmula para a planilha', () => {
    expect(celula('-5')).toBe("'-5");
    // Mas hífen no meio é só texto.
    expect(celula('bug-123')).toBe('bug-123');
  });

  it('tab e retorno de carro no início são neutralizados', () => {
    // Tab não exige aspas, então sai só com o apóstrofo.
    expect(celula('\tx')).toBe("'\tx");
    // Retorno de carro exige aspas: o apóstrofo fica dentro delas.
    expect(celula('\rx')).toBe('"\'\rx"');
  });

  it('escapa aspas dobrando, como o RFC pede', () => {
    expect(celula('disse "pronto"')).toBe('"disse ""pronto"""');
  });

  it('cita campo com vírgula ou quebra de linha', () => {
    expect(celula('a,b')).toBe('"a,b"');
    expect(celula('linha1\nlinha2')).toBe('"linha1\nlinha2"');
  });

  it('texto comum passa sem enfeite', () => {
    expect(celula('revisão do PR')).toBe('revisão do PR');
  });

  it('vazio e nulo viram campo vazio, nunca "undefined"', () => {
    expect(celula(undefined)).toBe('');
    expect(celula(null)).toBe('');
    expect(celula('')).toBe('');
  });
});

describe('colunas de tempo', () => {
  it('a data é o dia local de quem apontou', () => {
    // 23h30 local continua sendo o mesmo dia, mesmo já sendo o dia seguinte em UTC.
    const tarde = new Date(2026, 7, 26, 23, 30).toISOString();
    expect(dataLocal(tarde)).toBe('2026-08-26');
    expect(horaLocal(tarde)).toBe('23:30');
  });

  it('preenche com dois dígitos', () => {
    const cedo = new Date(2026, 0, 5, 9, 7).toISOString();
    expect(dataLocal(cedo)).toBe('2026-01-05');
    expect(horaLocal(cedo)).toBe('09:07');
  });

  it('data ilegível vira campo vazio em vez de "Invalid Date"', () => {
    expect(dataLocal('lixo')).toBe('');
    expect(horaLocal(undefined)).toBe('');
  });

  it('**horas decimais existem porque planilha não soma "1h 30m"**', () => {
    expect(horasDecimais(5400)).toBe('1.50');
    expect(horasDecimais(3600)).toBe('1.00');
    expect(horasDecimais(60)).toBe('0.02');
    expect(horasDecimais(0)).toBe('0.00');
    expect(horasDecimais(undefined)).toBe('0.00');
  });
});

describe('paraCSV', () => {
  it('cabeçalho seguido de uma linha por lançamento', () => {
    const csv = paraCSV([entrada(), entrada({ id: 'w2', issueKey: 'NL-2' })]);
    const linhas = csv.trimEnd().split('\r\n');

    expect(linhas[0]).toBe(COLUNAS.join(','));
    expect(linhas).toHaveLength(3);
  });

  it('**uma linha por lançamento, nunca somado** — somar depois é trivial, separar é impossível', () => {
    const mesmoDia = [
      entrada({ id: 'a', segundos: 3600, duracao: '1h' }),
      entrada({ id: 'b', segundos: 1800, duracao: '30m' }),
    ];
    const linhas = paraCSV(mesmoDia).trimEnd().split('\r\n');

    expect(linhas).toHaveLength(3);
    expect(linhas[1]).toContain('1.00');
    expect(linhas[2]).toContain('0.50');
  });

  it('traz projeto, item, título e descrição', () => {
    const csv = paraCSV([entrada()]);
    expect(csv).toContain('Nativelog');
    expect(csv).toContain('NL-1');
    expect(csv).toContain('Primeiro item');
    expect(csv).toContain('revisão do PR');
  });

  it('termina linha com CRLF, como o RFC 4180 e o Excel esperam', () => {
    const csv = paraCSV([entrada()]);
    expect(csv.endsWith('\r\n')).toBe(true);
    expect(csv.split('\r\n')).toHaveLength(3); // cabeçalho, linha, vazio final
  });

  it('descrição com vírgula não desloca as colunas', () => {
    const csv = paraCSV([entrada({ comentario: 'revisão, testes e deploy' })]);
    const linha = csv.trimEnd().split('\r\n')[1];
    expect(linha).toContain('"revisão, testes e deploy"');
  });

  it('descrição com quebra de linha continua num campo só', () => {
    const csv = paraCSV([entrada({ comentario: 'primeira\nsegunda' })]);
    expect(csv).toContain('"primeira\nsegunda"');
  });

  it('**descrição com fórmula sai neutralizada** mesmo dentro de aspas', () => {
    const csv = paraCSV([entrada({ comentario: '=WEBSERVICE("http://mau")' })]);
    expect(csv).toContain("'=WEBSERVICE");
  });

  it('sem entradas devolve só o cabeçalho — não é erro', () => {
    expect(paraCSV([]).trimEnd()).toBe(COLUNAS.join(','));
    expect(paraCSV().trimEnd()).toBe(COLUNAS.join(','));
  });

  it('entrada sem descrição ou sem projeto não quebra a linha', () => {
    const csv = paraCSV([entrada({ comentario: '', projetoNome: null, projetoChave: null })]);
    const linha = csv.trimEnd().split('\r\n')[1];
    expect(linha.split(',')).toHaveLength(COLUNAS.length);
  });
});

describe('filtrarProjetos', () => {
  const entradas = [
    entrada({ id: 'a', projetoChave: 'NL' }),
    entrada({ id: 'b', projetoChave: 'INT' }),
    entrada({ id: 'c', projetoChave: 'FER' }),
  ];

  it('excluir tira só os listados — é o modo que a tela usa', () => {
    const r = filtrarProjetos(entradas, { modo: 'excluir', chaves: ['INT', 'FER'] });
    expect(r.map((e) => e.id)).toEqual(['a']);
  });

  it('incluir mantém só os listados', () => {
    const r = filtrarProjetos(entradas, { modo: 'incluir', chaves: ['NL', 'INT'] });
    expect(r.map((e) => e.id)).toEqual(['a', 'b']);
  });

  it('lista vazia é "sem filtro" nos dois modos', () => {
    expect(filtrarProjetos(entradas, { modo: 'excluir', chaves: [] })).toHaveLength(3);
    // Incluir nada nunca é o que alguém quis dizer ao não marcar caixa nenhuma.
    expect(filtrarProjetos(entradas, { modo: 'incluir', chaves: [] })).toHaveLength(3);
  });

  it('sem opções, devolve tudo', () => {
    expect(filtrarProjetos(entradas)).toHaveLength(3);
    expect(filtrarProjetos()).toEqual([]);
  });

  it('não modifica a lista original', () => {
    filtrarProjetos(entradas, { modo: 'excluir', chaves: ['NL'] });
    expect(entradas).toHaveLength(3);
  });
});

describe('projetosDe', () => {
  it('lista cada projeto uma vez, em ordem de nome', () => {
    const r = projetosDe([
      entrada({ projetoChave: 'NL', projetoNome: 'Nativelog' }),
      entrada({ projetoChave: 'INT', projetoNome: 'Interno' }),
      entrada({ projetoChave: 'NL', projetoNome: 'Nativelog' }),
    ]);

    expect(r.map((p) => p.chave)).toEqual(['INT', 'NL']);
  });

  it('projeto sem nome cai para a chave em vez de aparecer em branco', () => {
    const r = projetosDe([entrada({ projetoChave: 'X', projetoNome: null })]);
    expect(r[0].nome).toBe('X');
  });

  it('entrada sem projeto não vira item fantasma na lista', () => {
    expect(projetosDe([entrada({ projetoChave: null })])).toEqual([]);
  });
});
