import { describe, it, expect } from 'vitest';
import { criarWorklogs, paraADF, deADF, motivoDoErro } from './worklog.js';

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

// ── D4: ler, corrigir e apagar apontamento ───────────────────────────────────

const EU = '712020:9b4086b1';
const OUTRA_PESSOA = '712020:aaaaaaaa';

const DE_OUTRA_PESSOA = {
  id: '10502',
  started: '2026-08-26T14:00:00.000+0000',
  timeSpentSeconds: 3600,
  author: { accountId: OUTRA_PESSOA, displayName: 'Outra Pessoa' },
};

describe('deADF', () => {
  it('desfaz o que paraADF faz — ida e volta preserva o texto', () => {
    expect(deADF(paraADF('revisão do PR'))).toBe('revisão do PR');
  });

  it('lê comentário escrito na tela do Jira, com vários parágrafos', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'primeira linha' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'segunda linha' }] },
      ],
    };
    expect(deADF(doc)).toBe('primeira linha\nsegunda linha');
  });

  it('não cola a lista inteira numa frase só', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'um' }] }],
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'dois' }] }],
            },
          ],
        },
      ],
    };
    expect(deADF(doc)).toBe('um\ndois');
  });

  it('comentário ausente vira texto vazio, não "undefined" no campo de edição', () => {
    expect(deADF(undefined)).toBe('');
    expect(deADF(null)).toBe('');
    expect(deADF('texto solto')).toBe('');
  });
});

describe('listar', () => {
  it('marca o que é meu — é a regra do produto num campo só', async () => {
    const { pedir } = espiao(() =>
      resposta(200, { total: 2, worklogs: [WORKLOG_CRIADO, DE_OUTRA_PESSOA] })
    );
    const r = await criarWorklogs({ pedir }).listar({ issueId: '10001', accountId: EU });

    expect(r.ok).toBe(true);
    expect(r.worklogs[0].meu).toBe(true);
    expect(r.worklogs[1].meu).toBe(false);
  });

  it('mais recente primeiro: é o que a pessoa acabou de lançar', async () => {
    const antigo = { ...DE_OUTRA_PESSOA, id: '1', started: '2026-08-01T09:00:00.000+0000' };
    const novo = { ...WORKLOG_CRIADO, id: '2', started: '2026-08-27T09:00:00.000+0000' };
    const { pedir } = espiao(() => resposta(200, { total: 2, worklogs: [antigo, novo] }));

    const r = await criarWorklogs({ pedir }).listar({ issueId: '10001', accountId: EU });
    expect(r.worklogs.map((w) => w.id)).toEqual(['2', '1']);
  });

  it('lê pelo endpoint do item, nunca por JQL — o índice do Jira atrasa ~5,7 s', async () => {
    const { pedir, chamadas } = espiao(() => resposta(200, { total: 0, worklogs: [] }));
    await criarWorklogs({ pedir }).listar({ issueId: '10001', accountId: EU });

    expect(chamadas[0].caminho).toContain('/rest/api/3/issue/10001/worklog');
    expect(chamadas[0].caminho).not.toContain('search');
    expect(chamadas[0].opcoes.method).toBe('GET');
  });

  it('**pagina de verdade (D12)**: junta as páginas em vez de ler só a primeira', async () => {
    // Uma página cheia seguida de uma parcial. Antes do D12 a segunda página
    // era simplesmente ignorada, e o total saía errado sem aviso nenhum.
    const cheia = Array.from({ length: 1000 }, (_, i) => ({ ...WORKLOG_CRIADO, id: `a${i}` }));
    const resto = [{ ...WORKLOG_CRIADO, id: 'b0' }];
    const { pedir, chamadas } = espiao((caminho) =>
      caminho.includes('startAt=0')
        ? resposta(200, { total: 1001, worklogs: cheia })
        : resposta(200, { total: 1001, worklogs: resto })
    );

    const r = await criarWorklogs({ pedir }).listar({ issueId: '10001', accountId: EU });

    expect(r.worklogs).toHaveLength(1001);
    expect(r.completo).toBe(true);
    expect(chamadas).toHaveLength(2);
    expect(chamadas[1].caminho).toContain('startAt=1000');
  });

  it('página menor que a pedida encerra o laço — é o sinal de última página', async () => {
    // `total` mentindo alto de propósito: a página curta manda mais que ele.
    const { pedir, chamadas } = espiao(() =>
      resposta(200, { total: 999999, worklogs: [WORKLOG_CRIADO] })
    );

    const r = await criarWorklogs({ pedir }).listar({ issueId: '10001', accountId: EU });

    expect(r.worklogs).toHaveLength(1);
    expect(r.completo).toBe(true);
    expect(chamadas).toHaveLength(1);
  });

  it('**servidor que ignora startAt não vira laço infinito**', async () => {
    // Devolve sempre a mesma página cheia. Sem a saída pelo teto, o resolver
    // ficaria preso até o timeout do Forge.
    const cheia = Array.from({ length: 1000 }, (_, i) => ({ ...WORKLOG_CRIADO, id: `x${i}` }));
    const { pedir, chamadas } = espiao(() => resposta(200, { total: 999999, worklogs: cheia }));

    const r = await criarWorklogs({ pedir }).listar({ issueId: '10001', accountId: EU });

    expect(r.completo).toBe(false);
    expect(chamadas.length).toBeLessThanOrEqual(6);
  });

  it('item sem apontamento não é erro', async () => {
    const { pedir } = espiao(() => resposta(200, { total: 0, worklogs: [] }));
    const r = await criarWorklogs({ pedir }).listar({ issueId: '10001', accountId: EU });
    expect(r).toMatchObject({ ok: true, worklogs: [], completo: true });
  });

  it('erro do Jira vira motivo, não exceção', async () => {
    const { pedir } = espiao(() => resposta(403, {}));
    const r = await criarWorklogs({ pedir }).listar({ issueId: '10001', accountId: EU });
    expect(r).toMatchObject({ ok: false, motivo: 'sem-permissao' });
  });
});

describe('lerUm', () => {
  it('devolve o apontamento sabendo se é meu', async () => {
    const { pedir, chamadas } = espiao(() => resposta(200, WORKLOG_CRIADO));
    const r = await criarWorklogs({ pedir }).lerUm({
      issueId: '10001',
      worklogId: '10501',
      accountId: EU,
    });

    expect(r.ok).toBe(true);
    expect(r.worklog.meu).toBe(true);
    expect(chamadas[0].caminho).toBe('/rest/api/3/issue/10001/worklog/10501');
  });

  it('worklog de outra pessoa vem marcado como não-meu', async () => {
    const { pedir } = espiao(() => resposta(200, DE_OUTRA_PESSOA));
    const r = await criarWorklogs({ pedir }).lerUm({
      issueId: '10001',
      worklogId: '10502',
      accountId: EU,
    });
    expect(r.worklog.meu).toBe(false);
  });

  it('404 tem motivo próprio: sumiu o apontamento, não o item', async () => {
    const { pedir } = espiao(() => resposta(404, {}));
    const r = await criarWorklogs({ pedir }).lerUm({
      issueId: '10001',
      worklogId: '999',
      accountId: EU,
    });
    expect(r).toMatchObject({ ok: false, motivo: 'apontamento-nao-encontrado' });
  });
});

describe('atualizar', () => {
  it('manda duração, início e comentário juntos — o PUT do Jira substitui o corpo', async () => {
    const { pedir, chamadas } = espiao(() =>
      resposta(200, { ...WORKLOG_CRIADO, timeSpentSeconds: 7200 })
    );

    const r = await criarWorklogs({ pedir }).atualizar({
      issueId: '10001',
      worklogId: '10501',
      startedAt: '2026-08-27T09:00:00.000Z',
      segundos: 7200,
      comentario: 'corrigido',
    });

    expect(r.ok).toBe(true);
    expect(chamadas[0].opcoes.method).toBe('PUT');
    expect(chamadas[0].caminho).toBe('/rest/api/3/issue/10001/worklog/10501');
    expect(chamadas[0].corpo.timeSpentSeconds).toBe(7200);
    expect(chamadas[0].corpo.comment).toEqual(paraADF('corrigido'));
    // Offset numérico, não 'Z' — o Jira rejeita ISO puro.
    expect(chamadas[0].corpo.started).toContain('+0000');
  });

  it('apagar a descrição manda null, não omite o campo', async () => {
    const { pedir, chamadas } = espiao(() => resposta(200, WORKLOG_CRIADO));
    await criarWorklogs({ pedir }).atualizar({
      issueId: '10001',
      worklogId: '10501',
      startedAt: '2026-08-27T09:00:00.000Z',
      segundos: 3600,
      comentario: '',
    });

    // `undefined` sumiria do JSON e deixaria a descrição antiga no lugar.
    expect('comment' in chamadas[0].corpo).toBe(true);
    expect(chamadas[0].corpo.comment).toBeNull();
  });

  it('recusa duração inválida antes de falar com o Jira', async () => {
    const { pedir, chamadas } = espiao(() => resposta(200, WORKLOG_CRIADO));
    const r = await criarWorklogs({ pedir }).atualizar({
      issueId: '10001',
      worklogId: '10501',
      startedAt: '2026-08-27T09:00:00.000Z',
      segundos: 0,
    });
    expect(r).toEqual({ ok: false, motivo: 'duracao-invalida' });
    expect(chamadas).toHaveLength(0);
  });

  it('erro do Jira vira motivo', async () => {
    const { pedir } = espiao(() => resposta(403, 'sem permissao'));
    const r = await criarWorklogs({ pedir }).atualizar({
      issueId: '10001',
      worklogId: '10501',
      startedAt: '2026-08-27T09:00:00.000Z',
      segundos: 3600,
    });
    expect(r).toMatchObject({ ok: false, motivo: 'sem-permissao' });
  });

  it('rede caindo não vira exceção', async () => {
    const pedir = async () => {
      throw new Error('socket hang up');
    };
    const r = await criarWorklogs({ pedir }).atualizar({
      issueId: '10001',
      worklogId: '10501',
      startedAt: '2026-08-27T09:00:00.000Z',
      segundos: 3600,
    });
    expect(r).toMatchObject({ ok: false, motivo: 'rede' });
  });
});

describe('apagar', () => {
  it('apaga de verdade — não há lixeira nossa', async () => {
    const { pedir, chamadas } = espiao(() => resposta(204, ''));
    const r = await criarWorklogs({ pedir }).apagar({ issueId: '10001', worklogId: '10501' });

    expect(r).toMatchObject({ ok: true, jaNaoExistia: false });
    expect(chamadas[0].opcoes.method).toBe('DELETE');
    expect(chamadas[0].caminho).toBe('/rest/api/3/issue/10001/worklog/10501');
  });

  it('404 é sucesso: alguém já apagou e o objetivo era não existir', async () => {
    const { pedir } = espiao(() => resposta(404, {}));
    const r = await criarWorklogs({ pedir }).apagar({ issueId: '10001', worklogId: '999' });
    expect(r).toMatchObject({ ok: true, jaNaoExistia: true });
  });

  it('403 não é sucesso', async () => {
    const { pedir } = espiao(() => resposta(403, {}));
    const r = await criarWorklogs({ pedir }).apagar({ issueId: '10001', worklogId: '10501' });
    expect(r).toMatchObject({ ok: false, motivo: 'sem-permissao' });
  });

  it('id do apontamento é escapado no caminho', async () => {
    const { pedir, chamadas } = espiao(() => resposta(204, ''));
    await criarWorklogs({ pedir }).apagar({ issueId: '10 001', worklogId: 'a/b' });
    expect(chamadas[0].caminho).toBe('/rest/api/3/issue/10%20001/worklog/a%2Fb');
  });
});
