import { describe, it, expect } from 'vitest';
import { EDICOES, edicaoDoContexto, recursosDa, recursosDoContexto } from './licenca.js';

/**
 * **A regra que estes testes seguram não é simétrica, e é de propósito.**
 *
 * Bloquear um cliente pagante porque não soubemos ler um campo de licença é o
 * pior erro possível: ele já pagou e o app está mentindo para ele. Alguém usar
 * o Pro de graça por um tempo custa pouco e se corrige. Os dois erros não têm o
 * mesmo tamanho, então a escolha não pode ser "no meio".
 */

describe('edicaoDoContexto', () => {
  it('sem bloco de licença, libera — billing não ligado ou ambiente de dev', () => {
    for (const ctx of [undefined, {}, { license: null }, { license: 'sim' }]) {
      const r = edicaoDoContexto(ctx);
      expect(r.edicao).toBe('pro');
      expect(r.conferida).toBe(false);
    }
  });

  it('licença ativa com edition legível manda', () => {
    expect(edicaoDoContexto({ license: { active: true, edition: 'standard' } })).toMatchObject({
      edicao: 'standard',
      conferida: true,
    });
    expect(edicaoDoContexto({ license: { active: true, edition: 'pro' } })).toMatchObject({
      edicao: 'pro',
      conferida: true,
    });
  });

  it('aceita maiúscula e espaço em volta — formato do campo já mudou antes', () => {
    expect(edicaoDoContexto({ license: { active: true, edition: '  PRO ' } }).edicao).toBe('pro');
  });

  it('aceita `isActive` além de `active`', () => {
    expect(edicaoDoContexto({ license: { isActive: false } }).edicao).toBe('free');
  });

  it('**licença explicitamente inativa cai para free** — é o trial vencido', () => {
    const r = edicaoDoContexto({ license: { active: false, edition: 'pro' } });
    expect(r).toMatchObject({ edicao: 'free', conferida: true, motivo: 'licenca-inativa' });
  });

  it('licença ativa com edition que não reconhecemos **libera**, marcada como não conferida', () => {
    const r = edicaoDoContexto({ license: { active: true, edition: 'enterprise-plus' } });
    expect(r).toMatchObject({ edicao: 'pro', conferida: false, motivo: 'edition-desconhecida' });
  });

  it('licença ativa sem campo de edition também libera', () => {
    expect(edicaoDoContexto({ license: { active: true } })).toMatchObject({
      edicao: 'pro',
      conferida: false,
    });
  });

  it('as edições conhecidas são só estas três', () => {
    expect(EDICOES).toEqual(['free', 'standard', 'pro']);
  });
});

describe('recursosDa', () => {
  /**
   * Regra 10 do `CLAUDE.md`: **o núcleo nunca fica atrás de paywall.** O núcleo
   * aqui é o tempo de quem está olhando — apontar, ver a semana, exportar.
   */
  it('o núcleo é igual nas três edições', () => {
    for (const edicao of EDICOES) {
      const r = recursosDa(edicao);
      expect(r.apontar, edicao).toBe(true);
      expect(r.minhaSemana, edicao).toBe(true);
      expect(r.exportarCSV, edicao).toBe(true);
    }
  });

  it('**exportar as próprias horas nunca é pago** — cobrar por isso é segurar dado de refém', () => {
    expect(recursosDa('free').exportarCSV).toBe(true);
  });

  it('só a visão de equipe é do Pro', () => {
    expect(recursosDa('free').verEquipe).toBe(false);
    expect(recursosDa('standard').verEquipe).toBe(false);
    expect(recursosDa('pro').verEquipe).toBe(true);
  });

  it('edition desconhecida não libera equipe por acidente', () => {
    expect(recursosDa('qualquer-coisa').verEquipe).toBe(false);
  });
});

describe('recursosDoContexto', () => {
  it('instância sem licença vê o produto inteiro', () => {
    const r = recursosDoContexto({});
    expect(r.verEquipe).toBe(true);
    expect(r.conferida).toBe(false);
  });

  it('trial vencido perde a equipe mas mantém o próprio tempo', () => {
    const r = recursosDoContexto({ license: { active: false } });
    expect(r.verEquipe).toBe(false);
    expect(r.apontar).toBe(true);
    expect(r.minhaSemana).toBe(true);
    expect(r.exportarCSV).toBe(true);
  });

  it('Standard pagante mantém tudo do próprio tempo', () => {
    const r = recursosDoContexto({ license: { active: true, edition: 'standard' } });
    expect(r).toMatchObject({
      edicao: 'standard',
      apontar: true,
      minhaSemana: true,
      exportarCSV: true,
      verEquipe: false,
    });
  });
});
