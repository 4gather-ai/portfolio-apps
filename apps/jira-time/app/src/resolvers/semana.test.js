import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { criarVisaoSemana } from './semana.js';

/**
 * As operações da página "Minha semana", vistas do lado do servidor.
 *
 * O foco aqui é o **D15**: o seletor de item. A regra que estes testes seguram
 * é uma só e é de desenho, não de formatação — **o seletor é conveniência, e
 * conveniência que falha não pode levar junto o caminho de gravar hora.** Se
 * `sugerirItens` passar a devolver `ok: false` num dia ruim do Jira, a tela da
 * semana começa a mostrar erro vermelho para quem só queria lançar uma hora.
 */

const EU = { context: { accountId: 'conta-eu' } };

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});

/** A semana falsa: o D15 não a usa, mas `criarVisaoSemana` a exige. */
const semanaFalsa = {
  minhaSemana: async () => ({ ok: true, entradas: [], itensLidos: 0, cortada: false, falhas: [] }),
  semanaDoTime: async () => ({ ok: true, entradas: [], itensLidos: 0, cortada: false, falhas: [] }),
  projetosVisiveis: async () => ({ ok: true, projetos: [] }),
};

function montar(sugerir) {
  return criarVisaoSemana({ semana: semanaFalsa, itens: { sugerir } });
}

describe('sugerirItens', () => {
  it('devolve os itens que o Jira sugeriu', async () => {
    const visao = montar(async () => ({
      ok: true,
      itens: [{ issueId: '10', issueKey: 'NL-1', titulo: 'Login' }],
      cortada: false,
    }));

    const r = await visao.sugerirItens({ ...EU, payload: {} });

    expect(r).toMatchObject({ ok: true, parcial: false, motivo: null });
    expect(r.itens).toHaveLength(1);
  });

  it('repassa o texto digitado', async () => {
    const vistos = [];
    const visao = montar(async ({ texto }) => {
      vistos.push(texto);
      return { ok: true, itens: [] };
    });

    await visao.sugerirItens({ ...EU, payload: { texto: 'login' } });

    expect(vistos).toEqual(['login']);
  });

  it('falha do Jira vira lista vazia com aviso, e NÃO erro de tela', async () => {
    // A linha que importa: `ok: true` mesmo quando a sugestão falhou. A tela
    // continua de pé e a pessoa ainda lança digitando a chave inteira.
    const visao = montar(async () => ({ ok: false, motivo: 'sem-permissao', itens: [] }));

    const r = await visao.sugerirItens({ ...EU, payload: { texto: 'x' } });

    expect(r.ok).toBe(true);
    expect(r.parcial).toBe(true);
    expect(r.motivo).toBe('sem-permissao');
    expect(r.itens).toEqual([]);
  });

  it('exceção inesperada ainda vira resposta, não estouro', async () => {
    const visao = montar(async () => {
      throw new Error('surpresa');
    });

    expect(await visao.sugerirItens({ ...EU, payload: {} })).toMatchObject({
      ok: false,
      motivo: 'surpresa',
    });
  });

  it('sem usuário no contexto, nem chega a perguntar ao Jira', async () => {
    let chamou = false;
    const visao = montar(async () => {
      chamou = true;
      return { ok: true, itens: [] };
    });

    const r = await visao.sugerirItens({ context: {}, payload: {} });

    expect(r).toMatchObject({ ok: false, motivo: 'sem-usuario' });
    expect(chamou).toBe(false);
  });

  it('repassa o aviso de lista cortada', async () => {
    const visao = montar(async () => ({ ok: true, itens: [], cortada: true }));
    expect((await visao.sugerirItens({ ...EU, payload: {} })).cortada).toBe(true);
  });
});
