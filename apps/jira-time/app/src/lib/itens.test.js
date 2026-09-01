import { describe, it, expect } from 'vitest';
import { criarItens, MAXIMO_SUGESTOES } from './itens.js';

/**
 * O seletor de item da tela da semana (D15).
 *
 * O que estes testes seguram, e é o que decide se a tela vale alguma coisa:
 * **a lista tem que vir preenchida antes de a pessoa digitar**, e **falhar aqui
 * não pode derrubar o caminho de gravar hora**. Um seletor vazio manda a pessoa
 * de volta ao item, que é exatamente o problema que a tela existe para tirar
 * do caminho.
 */

function resposta(status, corpo) {
  const texto = typeof corpo === 'string' ? corpo : JSON.stringify(corpo ?? {});
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => texto,
    json: async () => JSON.parse(texto),
  };
}

const secao = (id, issues) => ({ id, label: id, issues });
const item = (id, key, summaryText, summary) => ({ id, key, summaryText, summary });

describe('criarItens', () => {
  it('exige a função pedir', () => {
    expect(() => criarItens({})).toThrow(TypeError);
  });

  it('sem texto, pede os recentes — o seletor abre cheio', async () => {
    const chamadas = [];
    const itens = criarItens({
      pedir: async (caminho) => {
        chamadas.push(caminho);
        return resposta(200, {
          sections: [secao('hs', [item(10, 'SCRUM-1', 'O bug do login')])],
        });
      },
    });

    const r = await itens.sugerir();

    expect(r.ok).toBe(true);
    expect(r.itens).toEqual([{ issueId: '10', issueKey: 'SCRUM-1', titulo: 'O bug do login' }]);
    // Sem `query` na URL: é o que faz o Jira devolver o histórico da pessoa.
    expect(chamadas[0]).not.toContain('query=');
    expect(chamadas[0]).toContain('/rest/api/3/issue/picker');
  });

  it('com texto, manda a busca escapada', async () => {
    const chamadas = [];
    const itens = criarItens({
      pedir: async (caminho) => {
        chamadas.push(caminho);
        return resposta(200, { sections: [] });
      },
    });

    await itens.sugerir({ texto: '  bug do login  ' });

    // Espaço vira %20, e as pontas são aparadas: " bug " e "bug" são a mesma
    // busca para quem digitou.
    expect(chamadas[0]).toContain('query=bug%20do%20login');
  });

  it('inclui subtarefa — é onde muita gente aponta de verdade', async () => {
    const chamadas = [];
    const itens = criarItens({
      pedir: async (caminho) => {
        chamadas.push(caminho);
        return resposta(200, { sections: [] });
      },
    });

    await itens.sugerir({ texto: 'x' });

    expect(chamadas[0]).toContain('showSubTasks=true');
  });

  it('junta as seções e não repete o mesmo item duas vezes', async () => {
    // O picker devolve histórico e busca em seções separadas, e o mesmo item
    // pode estar nas duas. Repetido num seletor parece dois itens diferentes.
    const itens = criarItens({
      pedir: async () =>
        resposta(200, {
          sections: [
            secao('hs', [item(10, 'SCRUM-1', 'Login')]),
            secao('cs', [item(10, 'SCRUM-1', 'Login'), item(11, 'SCRUM-2', 'Logout')]),
          ],
        }),
    });

    const r = await itens.sugerir({ texto: 'log' });

    expect(r.itens.map((i) => i.issueKey)).toEqual(['SCRUM-1', 'SCRUM-2']);
  });

  it('tira a marcação de destaque do resumo quando só ela existe', async () => {
    // O `summary` do picker vem com <b> em volta do trecho que casou. Num
    // rótulo de seletor isso apareceria como tag literal.
    const itens = criarItens({
      pedir: async () =>
        resposta(200, {
          sections: [secao('cs', [{ id: 12, key: 'SCRUM-3', summary: 'O <b>bug</b> do login' }])],
        }),
    });

    const r = await itens.sugerir({ texto: 'bug' });

    expect(r.itens[0].titulo).toBe('O bug do login');
  });

  it('descarta item sem id — sem id não dá para gravar worklog', async () => {
    const itens = criarItens({
      pedir: async () =>
        resposta(200, {
          sections: [
            secao('cs', [
              { key: 'SCRUM-9', summaryText: 'Sem id' },
              item(13, 'SCRUM-4', 'Com id'),
            ]),
          ],
        }),
    });

    const r = await itens.sugerir({ texto: 'a' });

    expect(r.itens.map((i) => i.issueKey)).toEqual(['SCRUM-4']);
  });

  it('aceita id 0 sem confundir com ausência de id', async () => {
    // `if (!item.id)` deixaria o item 0 de fora — a checagem é de ausência,
    // não de valor falsy.
    const itens = criarItens({
      pedir: async () => resposta(200, { sections: [secao('cs', [item(0, 'SCRUM-0', 'Zero')])] }),
    });

    const r = await itens.sugerir({ texto: 'z' });

    expect(r.itens).toEqual([{ issueId: '0', issueKey: 'SCRUM-0', titulo: 'Zero' }]);
  });

  it('corta em MAXIMO_SUGESTOES e diz que cortou', async () => {
    const muitos = [];
    for (let i = 0; i < MAXIMO_SUGESTOES + 5; i += 1) {
      muitos.push(item(i, `SCRUM-${i}`, `Item ${i}`));
    }

    const itens = criarItens({
      pedir: async () => resposta(200, { sections: [secao('cs', muitos)] }),
    });

    const r = await itens.sugerir({ texto: 'item' });

    expect(r.itens).toHaveLength(MAXIMO_SUGESTOES);
    expect(r.cortada).toBe(true);
  });

  it('erro do Jira devolve lista vazia com motivo, e nunca lança', async () => {
    // Este é o teste que importa: o seletor é conveniência. Se ele explodir, a
    // pessoa perde o atalho — não pode perder o caminho de gravar hora.
    const itens = criarItens({ pedir: async () => resposta(403, {}) });

    const r = await itens.sugerir({ texto: 'x' });

    expect(r.ok).toBe(false);
    expect(r.motivo).toBe('sem-permissao');
    expect(r.itens).toEqual([]);
  });

  it('rede caída devolve lista vazia, não exceção', async () => {
    const itens = criarItens({
      pedir: async () => {
        throw new Error('offline');
      },
    });

    const r = await itens.sugerir({ texto: 'x' });

    expect(r.ok).toBe(false);
    expect(r.motivo).toBe('rede');
    expect(r.itens).toEqual([]);
  });

  it('resposta que não é JSON também não derruba a tela', async () => {
    const itens = criarItens({
      pedir: async () => ({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('nao e json');
        },
      }),
    });

    const r = await itens.sugerir({});

    expect(r.ok).toBe(false);
    expect(r.itens).toEqual([]);
  });

  it('500 do Jira vira jira-indisponivel', async () => {
    const itens = criarItens({ pedir: async () => resposta(503, {}) });
    expect((await itens.sugerir({})).motivo).toBe('jira-indisponivel');
  });
});
