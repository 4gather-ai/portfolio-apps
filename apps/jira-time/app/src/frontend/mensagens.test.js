import { describe, it, expect } from 'vitest';
import { mensagemDeErro, mensagemDoApontamento, textoDoWorklog } from './mensagens.js';

/**
 * O que estes testes seguram é uma regra de produto, não redação: **nenhuma
 * frase pode mentir sobre o que aconteceu com a hora da pessoa.** Um erro no
 * timer deixa o tempo correndo; um erro no apontamento manual não grava nada.
 * Trocar as duas frases de lugar é o tipo de defeito que ninguém vê num
 * `git diff` e que destrói a confiança na folha de ponto.
 */

const MOTIVOS_DO_TIMER = [
  'sem-permissao',
  'item-nao-encontrado',
  'jira-indisponivel',
  'limite-de-taxa',
  'rede',
  'worklog-invalido',
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

describe('mensagemDeErro (timer)', () => {
  it('quando a gravação falha, a frase diz que o tempo continua de pé', () => {
    for (const motivo of ['sem-permissao', 'jira-indisponivel', 'limite-de-taxa', 'rede']) {
      expect(mensagemDeErro(motivo)).toMatch(/still running|still here|is safe/i);
    }
  });

  it('nenhuma frase do timer diz que nada foi salvo — seria mentira', () => {
    for (const motivo of MOTIVOS_DO_TIMER) {
      expect(mensagemDeErro(motivo)).not.toMatch(/nothing was saved/i);
    }
  });

  it('motivo desconhecido ainda produz frase útil, nunca o código cru', () => {
    const frase = mensagemDeErro('coisa-que-nao-existe');
    expect(frase).not.toContain('coisa-que-nao-existe');
    expect(frase.length).toBeGreaterThan(20);
  });

  it('cada motivo tem frase própria — nada cai no genérico por engano', () => {
    const generica = mensagemDeErro('inexistente');
    for (const motivo of MOTIVOS_DO_TIMER) {
      expect(mensagemDeErro(motivo)).not.toBe(generica);
    }
  });
});

describe('mensagemDoApontamento (manual)', () => {
  it('a frase diz que nada foi gravado — aqui não há tempo correndo', () => {
    for (const motivo of ['sem-permissao', 'jira-indisponivel', 'limite-de-taxa']) {
      expect(mensagemDoApontamento(motivo)).toMatch(/nothing was saved/i);
    }
  });

  it('nenhuma frase do apontamento promete que o tempo está correndo', () => {
    for (const motivo of MOTIVOS_DO_APONTAMENTO) {
      expect(mensagemDoApontamento(motivo)).not.toMatch(/still running/i);
    }
  });

  it('o mesmo motivo tem frases diferentes nos dois caminhos', () => {
    for (const motivo of ['sem-permissao', 'jira-indisponivel', 'rede', 'worklog-invalido']) {
      expect(mensagemDoApontamento(motivo)).not.toBe(mensagemDeErro(motivo));
    }
  });

  it('erro de digitação ensina o formato em vez de só recusar', () => {
    expect(mensagemDoApontamento('duracao-invalida')).toMatch(/1h 30m/);
  });

  it('entrada alheia explica a regra e diz onde dá para mexer', () => {
    const frase = mensagemDoApontamento('apontamento-de-outra-pessoa');
    expect(frase).toMatch(/someone else/i);
    expect(frase).toMatch(/Jira/);
  });

  it('a rede caindo admite a dúvida em vez de afirmar o que não sabe', () => {
    expect(mensagemDoApontamento('rede')).toMatch(/may or may not/i);
  });

  it('cada motivo tem frase própria', () => {
    const generica = mensagemDoApontamento('inexistente');
    for (const motivo of MOTIVOS_DO_APONTAMENTO) {
      expect(mensagemDoApontamento(motivo)).not.toBe(generica);
    }
  });
});

describe('textoDoWorklog', () => {
  it('diz o nome do autor de propósito: é a cunha do produto', () => {
    const texto = textoDoWorklog({ duracao: '2h', autorNome: 'Amarildo Pereira' }, 'NL-1', false);
    expect(texto).toBe('Logged 2h to NL-1 as Amarildo Pereira.');
  });

  it('na retentativa, deixa claro que não escreveu duas vezes', () => {
    const texto = textoDoWorklog({ duracao: '2h', autorNome: 'Amarildo Pereira' }, 'NL-1', true);
    expect(texto).toMatch(/Already logged/);
    expect(texto).toMatch(/Nothing was written twice/);
  });

  it('sem nome e sem item, não inventa "as undefined"', () => {
    expect(textoDoWorklog({ duracao: '2h' }, null, false)).toBe('Logged 2h.');
  });
});
