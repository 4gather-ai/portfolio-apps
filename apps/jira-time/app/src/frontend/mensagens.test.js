import { describe, it, expect } from 'vitest';
import {
  mensagemDeErro,
  mensagemDoApontamento,
  mensagemDaSemana,
  preencher,
  textoDoWorklog,
} from './mensagens.js';
import en from '../../locales/en-US.json';

/**
 * O que estes testes seguram é uma regra de produto, não redação: **nenhuma
 * frase pode mentir sobre o que aconteceu com a hora da pessoa.** Um erro no
 * timer deixa o tempo correndo; um erro no apontamento manual não grava nada;
 * um erro na semana não estava gravando coisa alguma. Trocar as frases de lugar
 * é o tipo de defeito que ninguém vê num `git diff` e que destrói a confiança
 * na folha de ponto.
 *
 * Desde o D10 as funções devolvem `[chave, padrão]`. Os testes passaram a
 * conferir **a chave** (mais estável que a frase) e **o padrão em inglês**, que
 * é o que aparece se a tradução não carregar.
 */

const MOTIVOS_DO_TIMER = [
  'sem-permissao',
  'item-nao-encontrado',
  'jira-indisponivel',
  'limite-de-taxa',
  'rede',
  'worklog-invalido',
  'timer-corrompido',
  'sem-item',
  'sem-usuario',
  'precisa-confirmar',
];

const MOTIVOS_DO_APONTAMENTO = [
  'duracao-invalida',
  'curto-demais',
  'longo-demais',
  'inicio-no-futuro',
  'inicio-invalido',
  'apontamento-de-outra-pessoa',
  'apontamento-nao-encontrado',
  'sem-apontamento',
  'sem-permissao',
  'item-nao-encontrado',
  'jira-indisponivel',
  'limite-de-taxa',
  'rede',
  'worklog-invalido',
];

const MOTIVOS_DA_SEMANA = [
  'janela-invalida',
  'busca-invalida',
  'sem-permissao',
  'limite-de-taxa',
  'jira-indisponivel',
  'rede',
  'sem-usuario',
];

/** `t` de mentira: devolve o padrão, como o Forge faz quando não há tradução. */
const tPadrao = (chave, padrao) => padrao ?? chave;

describe('contrato das três funções', () => {
  it('devolvem chave e padrão, nunca a frase solta', () => {
    for (const fn of [mensagemDeErro, mensagemDoApontamento, mensagemDaSemana]) {
      const r = fn('sem-permissao');
      expect(Array.isArray(r)).toBe(true);
      expect(r).toHaveLength(2);
      expect(typeof r[0]).toBe('string');
      expect(typeof r[1]).toBe('string');
    }
  });

  it('**toda chave existe em en-US.json**', () => {
    const usadas = [
      ...MOTIVOS_DO_TIMER.map((m) => mensagemDeErro(m)[0]),
      mensagemDeErro('inexistente')[0],
      ...MOTIVOS_DO_APONTAMENTO.map((m) => mensagemDoApontamento(m)[0]),
      mensagemDoApontamento('inexistente')[0],
      ...MOTIVOS_DA_SEMANA.map((m) => mensagemDaSemana(m)[0]),
      mensagemDaSemana('inexistente')[0],
    ];

    for (const chave of usadas) expect(Object.keys(en)).toContain(chave);
  });

  it('o padrão embutido é igual ao valor em en-US.json — não podem divergir', () => {
    for (const m of MOTIVOS_DO_TIMER) {
      const [chave, padrao] = mensagemDeErro(m);
      expect(padrao).toBe(en[chave]);
    }
    for (const m of MOTIVOS_DO_APONTAMENTO) {
      const [chave, padrao] = mensagemDoApontamento(m);
      expect(padrao).toBe(en[chave]);
    }
    for (const m of MOTIVOS_DA_SEMANA) {
      const [chave, padrao] = mensagemDaSemana(m);
      expect(padrao).toBe(en[chave]);
    }
  });
});

describe('mensagemDeErro (timer)', () => {
  it('quando a gravação falha, a frase diz que o tempo continua de pé', () => {
    for (const motivo of ['sem-permissao', 'jira-indisponivel', 'limite-de-taxa', 'rede']) {
      expect(mensagemDeErro(motivo)[1]).toMatch(/still running|still here|is safe/i);
    }
  });

  it('nenhuma frase do timer diz que nada foi salvo — seria mentira', () => {
    for (const motivo of MOTIVOS_DO_TIMER) {
      expect(mensagemDeErro(motivo)[1]).not.toMatch(/nothing was saved/i);
    }
  });

  it('motivo desconhecido ainda produz frase útil, nunca o código cru', () => {
    const [chave, frase] = mensagemDeErro('coisa-que-nao-existe');
    expect(chave).toBe('timer.erro.generico');
    expect(frase).not.toContain('coisa-que-nao-existe');
    expect(frase.length).toBeGreaterThan(20);
  });

  it('cada motivo tem chave própria — nada cai no genérico por engano', () => {
    const chaves = MOTIVOS_DO_TIMER.map((m) => mensagemDeErro(m)[0]);
    expect(new Set(chaves).size).toBe(MOTIVOS_DO_TIMER.length);
    expect(chaves).not.toContain('timer.erro.generico');
  });
});

describe('mensagemDoApontamento (manual)', () => {
  it('a frase diz que nada foi gravado — aqui não há tempo correndo', () => {
    for (const motivo of ['sem-permissao', 'jira-indisponivel', 'limite-de-taxa']) {
      expect(mensagemDoApontamento(motivo)[1]).toMatch(/nothing was saved/i);
    }
  });

  it('nenhuma frase do apontamento promete que o tempo está correndo', () => {
    for (const motivo of MOTIVOS_DO_APONTAMENTO) {
      expect(mensagemDoApontamento(motivo)[1]).not.toMatch(/still running/i);
    }
  });

  it('**o mesmo motivo tem chave e frase diferentes nos dois caminhos**', () => {
    for (const motivo of ['sem-permissao', 'jira-indisponivel', 'rede', 'worklog-invalido']) {
      const timer = mensagemDeErro(motivo);
      const manual = mensagemDoApontamento(motivo);
      expect(manual[0]).not.toBe(timer[0]);
      expect(manual[1]).not.toBe(timer[1]);
    }
  });

  it('erro de digitação ensina o formato em vez de só recusar', () => {
    expect(mensagemDoApontamento('duracao-invalida')[1]).toMatch(/1h 30m/);
  });

  it('entrada alheia explica a regra e diz onde dá para mexer', () => {
    const frase = mensagemDoApontamento('apontamento-de-outra-pessoa')[1];
    expect(frase).toMatch(/someone else/i);
    expect(frase).toMatch(/Jira/);
  });

  it('a rede caindo admite a dúvida em vez de afirmar o que não sabe', () => {
    expect(mensagemDoApontamento('rede')[1]).toMatch(/may or may not/i);
  });

  it('cada motivo tem chave própria', () => {
    const chaves = MOTIVOS_DO_APONTAMENTO.map((m) => mensagemDoApontamento(m)[0]);
    expect(new Set(chaves).size).toBe(MOTIVOS_DO_APONTAMENTO.length);
  });
});

describe('mensagemDaSemana', () => {
  it('nada estava sendo gravado, então nenhuma frase fala de tempo em risco', () => {
    for (const motivo of MOTIVOS_DA_SEMANA) {
      expect(mensagemDaSemana(motivo)[1]).not.toMatch(/still running|nothing was saved/i);
    }
  });

  it('cada motivo tem chave própria', () => {
    const chaves = MOTIVOS_DA_SEMANA.map((m) => mensagemDaSemana(m)[0]);
    expect(new Set(chaves).size).toBe(MOTIVOS_DA_SEMANA.length);
  });
});

describe('preencher', () => {
  it('troca os marcadores pelos valores', () => {
    expect(preencher('Logged {0} to {1}.', ['2h', 'NL-1'])).toBe('Logged 2h to NL-1.');
  });

  it('**a ordem é da tradução, não do código** — é para isso que existe marcador', () => {
    // Em alemão o verbo vai para o fim; a mesma lista de valores serve.
    expect(preencher('{0} auf {1} erfasst.', ['2h', 'NL-1'])).toBe('2h auf NL-1 erfasst.');
  });

  it('marcador repetido é preenchido todas as vezes', () => {
    expect(preencher('{0} e {0}', ['x'])).toBe('x e x');
  });

  it('valor faltando vira vazio, nunca "undefined" na tela', () => {
    expect(preencher('Logged {0} to {1}.', ['2h'])).toBe('Logged 2h to .');
    expect(preencher('{0}', [null])).toBe('');
  });

  it('texto sem marcador passa intacto', () => {
    expect(preencher('Sem marcador', ['x'])).toBe('Sem marcador');
    expect(preencher(undefined)).toBe('');
  });
});

describe('textoDoWorklog', () => {
  it('diz o nome do autor de propósito: é a cunha do produto', () => {
    const texto = textoDoWorklog(
      tPadrao,
      { duracao: '2h', autorNome: 'Amarildo Pereira' },
      'NL-1',
      false
    );
    expect(texto).toBe('Logged 2h to NL-1 as Amarildo Pereira.');
  });

  it('na retentativa, deixa claro que não escreveu duas vezes', () => {
    const texto = textoDoWorklog(
      tPadrao,
      { duracao: '2h', autorNome: 'Amarildo Pereira' },
      'NL-1',
      true
    );
    expect(texto).toMatch(/Already logged/);
    expect(texto).toMatch(/Nothing was written twice/);
  });

  it('sem nome e sem item, não inventa "as undefined"', () => {
    expect(textoDoWorklog(tPadrao, { duracao: '2h' }, null, false)).toBe('Logged 2h.');
    expect(textoDoWorklog(tPadrao, { duracao: '2h' }, 'NL-1', false)).toBe('Logged 2h to NL-1.');
  });

  it('usa a tradução quando existe', () => {
    const tAlemao = (chave) => (chave === 'worklog.gravado' ? '{0} auf {1} als {2} erfasst.' : '');
    expect(textoDoWorklog(tAlemao, { duracao: '2h', autorNome: 'Ana' }, 'NL-1', false)).toBe(
      '2h auf NL-1 als Ana erfasst.'
    );
  });
});
