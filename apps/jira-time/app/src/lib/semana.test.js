import { describe, it, expect } from 'vitest';
import { criarSemana, FOLGA_DA_BUSCA_MS, MAXIMO_ITENS } from './semana.js';

/**
 * A folha da semana é remontada do Jira a cada abertura, em dois passos: JQL
 * para achar os itens, endpoint do item para achar as entradas. O que estes
 * testes seguram é que o passo 2 existe de verdade — se alguém "otimizar"
 * somando o Time Spent que o JQL devolve, a folha passa a mostrar o total da
 * vida inteira de cada item em vez do da semana, e ninguém percebe olhando.
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

const EU = 'conta-eu';
const OUTRA = 'conta-outra';

const DESDE = new Date(2026, 7, 24, 0, 0, 0).toISOString(); // segunda
const ATE = new Date(2026, 7, 30, 23, 59, 59, 999).toISOString(); // domingo

/** Instante local dentro da semana, para os testes valerem em qualquer fuso. */
const emQue = (dia, hora, minuto = 0) => new Date(2026, 7, dia, hora, minuto).toISOString();

function wl(id, started, segundos, accountId = EU) {
  return { id, started, timeSpentSeconds: segundos, author: { accountId } };
}

/**
 * Jira falso: responde a busca e o worklog de cada item, e registra tudo que
 * foi pedido para os testes conferirem o caminho.
 */
function jiraFalso({ issues = [], porItem = {}, buscaFalha, worklogFalha } = {}) {
  const chamadas = [];
  const pedir = async (caminho, opcoes) => {
    chamadas.push(caminho);

    if (caminho.includes('/search/jql')) {
      if (buscaFalha) return resposta(buscaFalha, {});
      return resposta(200, { issues, isLast: true });
    }

    const id = caminho.match(/\/issue\/([^/]+)\/worklog/)?.[1];
    if (worklogFalha?.[id]) return resposta(worklogFalha[id], {});
    return resposta(200, { worklogs: porItem[id] || [] });
  };
  return { pedir, chamadas };
}

const ITEM = (id, key, summary) => ({ id, key, fields: { summary } });

describe('minhaSemana — os dois passos', () => {
  it('usa JQL só para achar os itens e o endpoint do item para as entradas', async () => {
    const { pedir, chamadas } = jiraFalso({
      issues: [ITEM('10001', 'NL-1', 'Primeiro')],
      porItem: { 10001: [wl('w1', emQue(25, 10), 3600)] },
    });

    const r = await criarSemana({ pedir }).minhaSemana({ accountId: EU, desde: DESDE, ate: ATE });

    expect(r.ok).toBe(true);
    expect(chamadas[0]).toContain('/rest/api/3/search/jql');
    expect(chamadas[1]).toContain('/rest/api/3/issue/10001/worklog');
    expect(r.entradas).toHaveLength(1);
    expect(r.entradas[0]).toMatchObject({ issueKey: 'NL-1', titulo: 'Primeiro', segundos: 3600 });
  });

  it('a busca é por worklog meu, não por item que eu toquei', async () => {
    const { pedir, chamadas } = jiraFalso({ issues: [] });
    await criarSemana({ pedir }).minhaSemana({ accountId: EU, desde: DESDE, ate: ATE });

    const jql = decodeURIComponent(chamadas[0]);
    expect(jql).toContain('worklogAuthor = currentUser()');
    expect(jql).toContain('worklogDate >=');
    expect(jql).toContain('worklogDate <=');
  });

  it('**a janela do JQL é mais larga que a semana** — fuso da instância não é o do navegador', async () => {
    const { pedir, chamadas } = jiraFalso({ issues: [] });
    await criarSemana({ pedir }).minhaSemana({ accountId: EU, desde: DESDE, ate: ATE });

    const jql = decodeURIComponent(chamadas[0]);
    const [, deQue] = jql.match(/worklogDate >= "([\d-]+)"/);
    const [, ateQue] = jql.match(/worklogDate <= "([\d-]+)"/);

    expect(Date.parse(deQue)).toBeLessThan(Date.parse(DESDE));
    expect(Date.parse(ateQue)).toBeGreaterThan(Date.parse(ATE));
    expect(FOLGA_DA_BUSCA_MS).toBeGreaterThanOrEqual(24 * 3600 * 1000);
  });

  it('mas o corte fino é pelo instante, no passo 2', async () => {
    // O item entra na busca por causa da folga, e a entrada de fora da semana
    // é descartada aqui.
    const { pedir } = jiraFalso({
      issues: [ITEM('10001', 'NL-1', 'x')],
      porItem: {
        10001: [
          wl('dentro', emQue(25, 10), 3600),
          wl('antes', new Date(2026, 7, 23, 10).toISOString(), 7200),
          wl('depois', new Date(2026, 7, 31, 10).toISOString(), 7200),
        ],
      },
    });

    const r = await criarSemana({ pedir }).minhaSemana({ accountId: EU, desde: DESDE, ate: ATE });

    expect(r.entradas.map((e) => e.id)).toEqual(['dentro']);
  });

  it('só as minhas entradas — o item pode ter hora de meio time', async () => {
    const { pedir } = jiraFalso({
      issues: [ITEM('10001', 'NL-1', 'x')],
      porItem: {
        10001: [wl('minha', emQue(25, 10), 3600), wl('alheia', emQue(25, 11), 7200, OUTRA)],
      },
    });

    const r = await criarSemana({ pedir }).minhaSemana({ accountId: EU, desde: DESDE, ate: ATE });

    expect(r.entradas.map((e) => e.id)).toEqual(['minha']);
  });

  it('devolve instante absoluto e **não** agrupa por dia — isso é da tela', async () => {
    const { pedir } = jiraFalso({
      issues: [ITEM('10001', 'NL-1', 'x')],
      porItem: { 10001: [wl('w1', emQue(25, 23, 30), 3600)] },
    });

    const r = await criarSemana({ pedir }).minhaSemana({ accountId: EU, desde: DESDE, ate: ATE });

    expect(r.entradas[0].started).toBe(emQue(25, 23, 30));
    expect(r).not.toHaveProperty('porDia');
    expect(r).not.toHaveProperty('dias');
  });

  it('junta vários itens e ordena do mais recente para o mais antigo', async () => {
    const { pedir } = jiraFalso({
      issues: [ITEM('10001', 'NL-1', 'um'), ITEM('10002', 'NL-2', 'dois')],
      porItem: {
        10001: [wl('cedo', emQue(24, 9), 1800)],
        10002: [wl('tarde', emQue(28, 17), 3600)],
      },
    });

    const r = await criarSemana({ pedir }).minhaSemana({ accountId: EU, desde: DESDE, ate: ATE });

    expect(r.entradas.map((e) => e.id)).toEqual(['tarde', 'cedo']);
    expect(r.itensLidos).toBe(2);
  });
});

describe('minhaSemana — o que a lista não tem', () => {
  it('um item ilegível não derruba a semana inteira, e é declarado', async () => {
    const { pedir } = jiraFalso({
      issues: [ITEM('10001', 'NL-1', 'ok'), ITEM('10002', 'NL-2', 'privado')],
      porItem: { 10001: [wl('w1', emQue(25, 10), 3600)] },
      worklogFalha: { 10002: 403 },
    });

    const r = await criarSemana({ pedir }).minhaSemana({ accountId: EU, desde: DESDE, ate: ATE });

    expect(r.ok).toBe(true);
    expect(r.entradas).toHaveLength(1);
    expect(r.falhas).toEqual(['NL-2']);
  });

  it('mais itens que o teto: corta e **avisa** em vez de mentir um total', async () => {
    const issues = Array.from({ length: MAXIMO_ITENS + 5 }, (_, i) =>
      ITEM(String(20000 + i), `NL-${i}`, 'x')
    );
    const { pedir } = jiraFalso({ issues });

    const r = await criarSemana({ pedir }).minhaSemana({ accountId: EU, desde: DESDE, ate: ATE });

    expect(r.itensLidos).toBe(MAXIMO_ITENS);
    expect(r.cortada).toBe(true);
  });

  it('semana vazia é uma semana, não um erro', async () => {
    const { pedir } = jiraFalso({ issues: [] });
    const r = await criarSemana({ pedir }).minhaSemana({ accountId: EU, desde: DESDE, ate: ATE });
    expect(r).toMatchObject({ ok: true, entradas: [], cortada: false, falhas: [] });
  });

  it('busca que falha vira motivo, não exceção', async () => {
    const { pedir } = jiraFalso({ buscaFalha: 400 });
    const r = await criarSemana({ pedir }).minhaSemana({ accountId: EU, desde: DESDE, ate: ATE });
    expect(r).toMatchObject({ ok: false, motivo: 'busca-invalida' });
  });

  it('rede caindo na busca vira motivo', async () => {
    const pedir = async () => {
      throw new Error('socket hang up');
    };
    const r = await criarSemana({ pedir }).minhaSemana({ accountId: EU, desde: DESDE, ate: ATE });
    expect(r).toMatchObject({ ok: false, motivo: 'rede' });
  });

  it('janela invertida ou ilegível é recusada antes de falar com o Jira', async () => {
    const { pedir, chamadas } = jiraFalso({ issues: [] });
    const semana = criarSemana({ pedir });

    expect(await semana.minhaSemana({ accountId: EU, desde: ATE, ate: DESDE })).toMatchObject({
      ok: false,
      motivo: 'janela-invalida',
    });
    expect(await semana.minhaSemana({ accountId: EU, desde: 'ontem', ate: ATE })).toMatchObject({
      ok: false,
      motivo: 'janela-invalida',
    });
    expect(chamadas).toHaveLength(0);
  });

  it('exige identidade — a folha é de uma pessoa', async () => {
    const { pedir } = jiraFalso({ issues: [] });
    await expect(criarSemana({ pedir }).minhaSemana({ desde: DESDE, ate: ATE })).rejects.toThrow(
      TypeError
    );
  });
});
