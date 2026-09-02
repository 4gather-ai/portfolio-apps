import { describe, it, expect } from 'vitest';
import { criarItens, JQL_DA_BUSCA, MAXIMO_SUGESTOES } from './itens.js';

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

/** O item como o `/search/jql` devolve — outro formato do mesmo dado. */
const atribuido = (id, key, summary) => ({ id, key, fields: { summary } });

/**
 * Um `pedir` que sabe responder aos dois endpoints.
 *
 * O seletor faz **duas** perguntas diferentes desde o D15.1: o picker, e — só
 * quando a lista veio curta — os itens atribuídos à pessoa. Um duplo que
 * responde a mesma coisa para os dois esconderia justamente o que estes testes
 * querem ver.
 */
function pedirDuplo({ picker, meus, aoChamar } = {}) {
  // Cada lado recebe uma resposta pronta (de `resposta()`) ou uma função que a
  // devolve. Nada de aceitar corpo cru aqui: na primeira versão deste duplo o
  // corpo era embrulhado uma segunda vez, e quatro testes falharam mostrando
  // lista vazia — que é exatamente o sintoma do defeito que eles investigam.
  const responder = (r, caminho) => (typeof r === 'function' ? r(caminho) : r);
  return async (caminho) => {
    aoChamar?.(caminho);
    if (caminho.includes('/search/jql')) {
      return responder(meus ?? resposta(200, { issues: [] }), caminho);
    }
    return responder(picker ?? resposta(200, { sections: [] }), caminho);
  };
}

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

/**
 * D15.1 — o parâmetro `currentJQL`.
 *
 * **Este bloco existe por um defeito que foi para o beta.** Sem `currentJQL` o
 * picker devolve só a seção de histórico, então o seletor só encontrava item
 * que a pessoa já tinha aberto — e a tela da semana existe justamente para
 * lançar hora no item que ela **não** abriu. Passou despercebido porque quem
 * testa testa com o item que acabou de visitar.
 */
describe('sugerir manda currentJQL', () => {
  it('sempre inclui currentJQL, com texto ou sem texto', async () => {
    // **É o teste que falha sem o parâmetro.** Não é uma preferência de
    // formato de URL: é a diferença entre a busca existir e não existir.
    const chamadas = [];
    const itens = criarItens({
      pedir: pedirDuplo({
        picker: resposta(200, { sections: [] }),
        aoChamar: (c) => chamadas.push(c),
      }),
    });

    await itens.sugerir();
    await itens.sugerir({ texto: 'login' });

    const doPicker = chamadas.filter((c) => c.includes('/issue/picker'));
    expect(doPicker).toHaveLength(2);
    for (const caminho of doPicker) {
      expect(caminho).toContain(`currentJQL=${encodeURIComponent(JQL_DA_BUSCA)}`);
    }
  });

  it('o currentJQL não é vazio — instância pode ter "Disable empty JQL queries" ligado', () => {
    // A Atlassian documenta que currentJQL vazio para de funcionar quando o
    // administrador liga essa opção. Mandar consulta escrita evita depender de
    // uma configuração que não é nossa.
    expect(JQL_DA_BUSCA.trim().length).toBeGreaterThan(0);
  });

  it('acha um item que só veio na seção de busca, nunca visitado', async () => {
    // O caso do beta: histórico vazio, item existente. Antes, lista vazia.
    const itens = criarItens({
      pedir: pedirDuplo({
        picker: resposta(200, {
          sections: [
            secao('hs', []),
            secao('cs', [item(21, 'SCRUM-2', 'Segundo Teste, timer')]),
          ],
        }),
      }),
    });

    const r = await itens.sugerir({ texto: 'SCRUM-2' });

    expect(r.itens).toEqual([
      { issueId: '21', issueKey: 'SCRUM-2', titulo: 'Segundo Teste, timer' },
    ]);
  });
});

/**
 * D15.1 — completar a lista curta com o que está atribuído à pessoa.
 *
 * Instância nova tem histórico vazio, e instância nova é o que o beta tem. Uma
 * sugestão só é praticamente uma lista vazia: não dá para escolher, e a pessoa
 * vai abrir o Jira — o gesto que esta tela existe para evitar.
 */
describe('sugerir completa a lista curta', () => {
  it('lista vazia é completada com os itens atribuídos', async () => {
    const itens = criarItens({
      pedir: pedirDuplo({
        picker: resposta(200, { sections: [] }),
        meus: resposta(200, { issues: [atribuido(31, 'NL-9', 'Corrigir o seletor')] }),
      }),
    });

    const r = await itens.sugerir();

    expect(r.itens).toEqual([{ issueId: '31', issueKey: 'NL-9', titulo: 'Corrigir o seletor' }]);
  });

  it('lista com um item só também é completada', async () => {
    const itens = criarItens({
      pedir: pedirDuplo({
        picker: resposta(200, { sections: [secao('hs', [item(10, 'NL-1', 'Um')])] }),
        meus: resposta(200, { issues: [atribuido(31, 'NL-9', 'Nove')] }),
      }),
    });

    expect((await itens.sugerir()).itens.map((i) => i.issueKey)).toEqual(['NL-1', 'NL-9']);
  });

  it('lista com dois já basta — não pergunta de novo ao Jira', async () => {
    // Completar sempre seria uma segunda chamada em toda tecla digitada.
    const chamadas = [];
    const itens = criarItens({
      pedir: pedirDuplo({
        picker: resposta(200, {
          sections: [secao('hs', [item(10, 'NL-1', 'Um'), item(11, 'NL-2', 'Dois')])],
        }),
        aoChamar: (c) => chamadas.push(c),
      }),
    });

    await itens.sugerir();

    expect(chamadas.filter((c) => c.includes('/search/jql'))).toHaveLength(0);
  });

  it('não repete um item que o picker já tinha trazido', async () => {
    const itens = criarItens({
      pedir: pedirDuplo({
        picker: resposta(200, { sections: [secao('hs', [item(31, 'NL-9', 'Nove')])] }),
        meus: resposta(200, { issues: [atribuido(31, 'NL-9', 'Nove')] }),
      }),
    });

    expect((await itens.sugerir()).itens).toHaveLength(1);
  });

  it('com texto digitado, só completa com o que casa com o texto', async () => {
    // **Completar uma busca com item que não casa é pior que devolver vazio:**
    // a pessoa lê a lista como resultado da busca e escolhe o item errado.
    const itens = criarItens({
      pedir: pedirDuplo({
        picker: resposta(200, { sections: [] }),
        meus: resposta(200, {
          issues: [atribuido(31, 'NL-9', 'Corrigir o seletor'), atribuido(32, 'NL-8', 'Outra coisa')],
        }),
      }),
    });

    const r = await itens.sugerir({ texto: 'seletor' });

    expect(r.itens.map((i) => i.issueKey)).toEqual(['NL-9']);
  });

  it('o texto também casa pela chave, e sem diferenciar maiúscula', async () => {
    const itens = criarItens({
      pedir: pedirDuplo({
        picker: resposta(200, { sections: [] }),
        meus: resposta(200, { issues: [atribuido(31, 'NL-9', 'Nove'), atribuido(32, 'XX-1', 'Outro')] }),
      }),
    });

    expect((await itens.sugerir({ texto: 'nl-9' })).itens.map((i) => i.issueKey)).toEqual(['NL-9']);
  });

  it('a busca por atribuídos pede como usuário, não como app', async () => {
    const chamadas = [];
    const itens = criarItens({
      pedir: pedirDuplo({
        picker: resposta(200, { sections: [] }),
        aoChamar: (c) => chamadas.push(c),
      }),
    });

    await itens.sugerir();

    const jql = chamadas.find((c) => c.includes('/search/jql'));
    expect(decodeURIComponent(jql)).toContain('assignee = currentUser()');
  });

  it('falha ao completar não derruba o que o picker já trouxe', async () => {
    const itens = criarItens({
      pedir: pedirDuplo({
        picker: resposta(200, { sections: [secao('hs', [item(10, 'NL-1', 'Um')])] }),
        meus: () => resposta(500, {}),
      }),
    });

    const r = await itens.sugerir();

    expect(r.ok).toBe(true);
    expect(r.itens.map((i) => i.issueKey)).toEqual(['NL-1']);
  });

  it('exceção ao completar também não derruba nada', async () => {
    const itens = criarItens({
      pedir: pedirDuplo({
        picker: resposta(200, { sections: [] }),
        meus: () => {
          throw new Error('offline');
        },
      }),
    });

    expect(await itens.sugerir()).toMatchObject({ ok: true, itens: [] });
  });

  it('respeita o teto de sugestões ao completar', async () => {
    const muitos = [];
    for (let i = 0; i < MAXIMO_SUGESTOES + 5; i += 1) muitos.push(atribuido(i, `NL-${i}`, `Item ${i}`));

    const itens = criarItens({
      pedir: pedirDuplo({
        picker: resposta(200, { sections: [] }),
        meus: resposta(200, { issues: muitos }),
      }),
    });

    expect((await itens.sugerir()).itens).toHaveLength(MAXIMO_SUGESTOES);
  });
});
