import { describe, it, expect } from 'vitest';
import en from '../../locales/en-US.json';
import ptBR from '../../locales/pt-BR.json';
import esES from '../../locales/es-ES.json';
import deDE from '../../locales/de-DE.json';
import frFR from '../../locales/fr-FR.json';

/**
 * i18n quebra em silêncio, e sempre do mesmo jeito: alguém acrescenta uma
 * frase em inglês, esquece as outras quatro, e o app fica **metade traduzido**
 * para quem não fala inglês. Ninguém percebe porque ninguém da equipe usa o app
 * em alemão.
 *
 * Estes testes tornam isso um erro de build em vez de uma reclamação no beta.
 */

const TRADUCOES = {
  'pt-BR': ptBR,
  'es-ES': esES,
  'de-DE': deDE,
  'fr-FR': frFR,
};

/** Os marcadores `{0}`, `{1}` de uma frase, em ordem. */
function marcadores(texto) {
  return [...String(texto).matchAll(/\{(\d+)\}/g)].map((m) => m[1]).sort();
}

describe('en-US é o inventário canônico', () => {
  it('tem chaves', () => {
    expect(Object.keys(en).length).toBeGreaterThan(50);
  });

  it('nenhum valor vazio', () => {
    for (const [chave, valor] of Object.entries(en)) {
      expect(typeof valor, chave).toBe('string');
      expect(valor.trim().length, chave).toBeGreaterThan(0);
    }
  });

  it('nenhuma chave duplicada com texto idêntico onde o sentido difere', () => {
    // Duas telas podem repetir "Delete"; o que não pode é o mesmo *motivo* de
    // erro ter a mesma frase nos caminhos do timer e do apontamento manual.
    expect(en['timer.erro.semPermissao']).not.toBe(en['apontamento.erro.semPermissao']);
    expect(en['timer.erro.jiraFora']).not.toBe(en['apontamento.erro.jiraFora']);
    expect(en['timer.erro.rede']).not.toBe(en['apontamento.erro.rede']);
  });
});

describe.each(Object.entries(TRADUCOES))('%s', (nome, traducao) => {
  it('tem exatamente as mesmas chaves que en-US — nada faltando, nada sobrando', () => {
    const esperadas = Object.keys(en).sort();
    const tem = Object.keys(traducao).sort();

    const faltando = esperadas.filter((k) => !tem.includes(k));
    const sobrando = tem.filter((k) => !esperadas.includes(k));

    expect(faltando, `faltando em ${nome}`).toEqual([]);
    expect(sobrando, `sobrando em ${nome}`).toEqual([]);
  });

  it('nenhum valor vazio', () => {
    for (const [chave, valor] of Object.entries(traducao)) {
      expect(typeof valor, chave).toBe('string');
      expect(valor.trim().length, chave).toBeGreaterThan(0);
    }
  });

  it('**os marcadores sobrevivem à tradução** — sem eles a frase perde o número', () => {
    for (const [chave, valorEn] of Object.entries(en)) {
      expect(marcadores(traducao[chave]), chave).toEqual(marcadores(valorEn));
    }
  });

  it('não sobrou inglês copiado nas frases longas', () => {
    // Frase curta pode coincidir de verdade ("Total" em quatro idiomas). Frase
    // longa idêntica ao inglês é tradução esquecida.
    const suspeitas = Object.entries(en)
      .filter(([chave, valorEn]) => valorEn.length > 45 && traducao[chave] === valorEn)
      .map(([chave]) => chave);

    expect(suspeitas, `não traduzidas em ${nome}`).toEqual([]);
  });
});
