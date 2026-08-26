import { describe, it, expect } from 'vitest';
import { criarWorklogs, paraADF, motivoDoErro } from './worklog.js';

/** Resposta no formato que o `requestJira` do Forge devolve. */
function resposta(status, corpo) {
  const texto = typeof corpo === 'string' ? corpo : JSON.stringify(corpo ?? {});
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => texto,
    json: async () => JSON.parse(texto),
  };
}

/** Registra o que foi pedido, para os testes conferirem o corpo enviado. */
function espiao(responder) {
  const chamadas = [];
  const pedir = async (caminho, opcoes) => {
    chamadas.push({ caminho, opcoes, corpo: opcoes?.body ? JSON.parse(opcoes.body) : undefined });
    return responder(caminho, opcoes, chamadas.length);
  };
  return { pedir, chamadas };
}

const WORKLOG_CRIADO = {
  id: '10501',
  started: '2026-08-27T09:00:00.000+0000',
  timeSpentSeconds: 10800,
  author: { accountId: '712020:9b4086b1', displayName: 'Amarildo Pereira' },
};

const ALVO = {
  issueId: '10001',
  startedAt: '2026-08-27T09:00:00.000Z',
  segundos: 10800,
};

describe('paraADF', () => {
  it('embrulha o texto no formato que o Jira aceita', () => {
    expect(paraADF('feito')).toEqual({
      type: 'doc',
      version: 1,
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'feito' }] }],
    });
  });

  it('some quando não há comentário — o Jira rejeita ADF vazio', () => {
    expect(paraADF('')).toBeUndefined();
    expect(paraADF('   ')).toBeUndefined();
    expect(paraADF(null)).toBeUndefined();
    expect(paraADF(undefined)).toBeUndefined();
  });
});

describe('motivoDoErro', () => {
  it('traduz o status num motivo que o painel sabe explicar', () => {
    expect(motivoDoErro(400)).toBe('worklog-invalido');
    expect(motivoDoErro(401)).toBe('sem-permissao');
    expect(motivoDoErro(403)).toBe('sem-permissao');
    expect(motivoDoErro(404)).toBe('item-nao-encontrado');
    expect(motivoDoErro(429)).toBe('limite-de-taxa');
    expect(motivoDoErro(500)).toBe('jira-indisponivel');
    expect(motivoDoErro(503)).toBe('jira-indisponivel');
    expect(motivoDoErro(418)).toBe('erro-do-jira');
  });
});

describe('gravar', () => {
  it('manda o worklog no formato do Jira, com o início retroativo', async () => {
    const { pedir, chamadas } = espiao(() => resposta(201, WORKLOG_CRIADO));
    const { gravar } = criarWorklogs({ pedir });

    const r = await gravar({ ...ALVO, comentario: 'timer' });

    expect(r.ok).toBe(true);
    expect(chamadas[0].caminho).toBe('/rest/api/3/issue/10001/worklog');
    expect(chamadas[0].opcoes.method).toBe('POST');
    expect(chamadas[0].corpo.timeSpentSeconds).toBe(10800);
    // Offset numérico, não 'Z' — o Jira rejeita o ISO puro do JavaScript.
    expect(chamadas[0].corpo.started).toBe('2026-08-27T09:00:00.000+0000');
    expect(chamadas[0].corpo.comment.type).toBe('doc');
  });

  it('não manda o campo comment quando não há comentário', async () => {
    const { pedir, chamadas } = espiao(() => resposta(201, WORKLOG_CRIADO));
    await criarWorklogs({ pedir }).gravar(ALVO);
    expect(chamadas[0].corpo).not.toHaveProperty('comment');
  });

  it('devolve o autor que o Jira registrou — é a cunha do produto', async () => {
    const { pedir } = espiao(() => resposta(201, WORKLOG_CRIADO));
    const r = await criarWorklogs({ pedir }).gravar(ALVO);
    expect(r.worklog.autorId).toBe('712020:9b4086b1');
    expect(r.worklog.autorNome).toBe('Amarildo Pereira');
    expect(r.worklog.id).toBe('10501');
  });

  it('escapa o id do item no caminho', async () => {
    const { pedir, chamadas } = espiao(() => resposta(201, WORKLOG_CRIADO));
    await criarWorklogs({ pedir }).gravar({ ...ALVO, issueId: 'a b/c' });
    expect(chamadas[0].caminho).toBe('/rest/api/3/issue/a%20b%2Fc/worklog');
  });

  it('recusa duração e início inválidos antes de incomodar o Jira', async () => {
    const { pedir, chamadas } = espiao(() => resposta(201, WORKLOG_CRIADO));
    const { gravar } = criarWorklogs({ pedir });

    expect(await gravar({ ...ALVO, segundos: 0 })).toEqual({ ok: false, motivo: 'duracao-invalida' });
    expect(await gravar({ ...ALVO, segundos: -5 })).toEqual({ ok: false, motivo: 'duracao-invalida' });
    expect(await gravar({ ...ALVO, startedAt: 'lixo' })).toEqual({ ok: false, motivo: 'inicio-invalido' });
    await expect(gravar({ ...ALVO, issueId: null })).rejects.toThrow(TypeError);

    expect(chamadas).toHaveLength(0);
  });

  it('erro do Jira vira motivo, com o corpo guardado para o log', async () => {
    const { pedir } = espiao(() => resposta(403, { errorMessages: ['no permission'] }));
    const r = await criarWorklogs({ pedir }).gravar(ALVO);
    expect(r.ok).toBe(false);
    expect(r.motivo).toBe('sem-permissao');
    expect(r.status).toBe(403);
    expect(r.detalhe).toContain('no permission');
  });

  it('falha de rede é marcada como PODE ter gravado — é o caso perigoso', async () => {
    const pedir = async () => {
      throw new Error('socket hang up');
    };
    const r = await criarWorklogs({ pedir }).gravar(ALVO);
    expect(r).toMatchObject({ ok: false, motivo: 'rede', podeTerGravado: true });
  });

  it('erro com resposta NÃO é marcado como pode ter gravado', async () => {
    const { pedir } = espiao(() => resposta(400, { errors: {} }));
    const r = await criarWorklogs({ pedir }).gravar(ALVO);
    // O Jira respondeu recusando: não gravou. Tentar de novo é seguro.
    expect(r.podeTerGravado).toBeUndefined();
  });
});

describe('jaExiste', () => {
  const meu = '712020:9b4086b1';

  it('lê pelo endpoint do item, não por JQL — o índice atrasa ~5,7s', async () => {
    const { pedir, chamadas } = espiao(() => resposta(200, { worklogs: [] }));
    await criarWorklogs({ pedir }).jaExiste({ ...ALVO, accountId: meu });

    expect(chamadas[0].caminho).toContain('/rest/api/3/issue/10001/worklog');
    expect(chamadas[0].caminho).not.toContain('search');
    // startedAfter corta a lista no servidor, com 1s de folga para trás.
    expect(chamadas[0].caminho).toContain(`startedAfter=${new Date(ALVO.startedAt).getTime() - 1000}`);
  });

  it('acha o worklog igual — evita gravar a hora da pessoa em dobro', async () => {
    const { pedir } = espiao(() => resposta(200, { worklogs: [WORKLOG_CRIADO] }));
    const r = await criarWorklogs({ pedir }).jaExiste({ ...ALVO, accountId: meu });
    expect(r).toMatchObject({ ok: true, encontrado: true });
    expect(r.worklog.id).toBe('10501');
  });

  it('não confunde com worklog de outra pessoa no mesmo instante', async () => {
    const outro = { ...WORKLOG_CRIADO, author: { accountId: 'outra-conta' } };
    const { pedir } = espiao(() => resposta(200, { worklogs: [outro] }));
    const r = await criarWorklogs({ pedir }).jaExiste({ ...ALVO, accountId: meu });
    expect(r.encontrado).toBe(false);
  });

  it('não confunde com outra duração minha no mesmo instante', async () => {
    const curto = { ...WORKLOG_CRIADO, timeSpentSeconds: 3600 };
    const { pedir } = espiao(() => resposta(200, { worklogs: [curto] }));
    const r = await criarWorklogs({ pedir }).jaExiste({ ...ALVO, accountId: meu });
    expect(r.encontrado).toBe(false);
  });

  it('tolera o arredondamento do instante que o Jira devolve', async () => {
    const quaseIgual = { ...WORKLOG_CRIADO, started: '2026-08-27T09:00:00.400+0000' };
    const { pedir } = espiao(() => resposta(200, { worklogs: [quaseIgual] }));
    expect((await criarWorklogs({ pedir }).jaExiste({ ...ALVO, accountId: meu })).encontrado).toBe(true);
  });

  it('não trata um worklog de outro horário como o mesmo', async () => {
    const outraHora = { ...WORKLOG_CRIADO, started: '2026-08-27T11:00:00.000+0000' };
    const { pedir } = espiao(() => resposta(200, { worklogs: [outraHora] }));
    expect((await criarWorklogs({ pedir }).jaExiste({ ...ALVO, accountId: meu })).encontrado).toBe(false);
  });

  it('falha de leitura devolve motivo — nunca "não encontrei"', async () => {
    // A diferença importa: "não encontrei" autorizaria gravar de novo.
    const { pedir } = espiao(() => resposta(500, {}));
    const r = await criarWorklogs({ pedir }).jaExiste({ ...ALVO, accountId: meu });
    expect(r).toMatchObject({ ok: false, motivo: 'jira-indisponivel' });
    expect(r.encontrado).toBeUndefined();

    const cai = async () => {
      throw new Error('timeout');
    };
    expect(await criarWorklogs({ pedir: cai }).jaExiste({ ...ALVO, accountId: meu })).toMatchObject({
      ok: false,
      motivo: 'rede',
    });
  });

  it('lista vazia é resposta válida, não erro', async () => {
    const { pedir } = espiao(() => resposta(200, {}));
    expect(await criarWorklogs({ pedir }).jaExiste({ ...ALVO, accountId: meu })).toMatchObject({
      ok: true,
      encontrado: false,
    });
  });
});

describe('criarWorklogs', () => {
  it('exige a função pedir — sem ela não há para onde escrever', () => {
    expect(() => criarWorklogs({})).toThrow(TypeError);
  });
});
