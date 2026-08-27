import { describe, it, expect } from 'vitest';
import { criarPermissoes, PERMISSOES } from './permissoes.js';

/**
 * A regra que estes testes seguram é contraintuitiva e proposital:
 * **uma consulta de permissão que falha não tranca ninguém.** É melhor deixar a
 * pessoa cronometrar e recusar na gravação, com frase clara, do que travar a
 * tela por causa de um problema nosso.
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

function espiao(responder) {
  const chamadas = [];
  const pedir = async (caminho, opcoes) => {
    chamadas.push({ caminho, opcoes });
    return responder(caminho, opcoes);
  };
  return { pedir, chamadas };
}

const bloco = (mapa) => ({
  permissions: Object.fromEntries(
    Object.entries(mapa).map(([k, v]) => [k, { havePermission: v }])
  ),
});

const TUDO = bloco({ WORK_ON_ISSUES: true, EDIT_OWN_WORKLOGS: true, DELETE_OWN_WORKLOGS: true });

describe('criarPermissoes', () => {
  it('exige a função pedir', () => {
    expect(() => criarPermissoes({})).toThrow(TypeError);
  });

  it('pergunta pelas três permissões que este app usa, no item certo', async () => {
    const { pedir, chamadas } = espiao(() => resposta(200, TUDO));
    await criarPermissoes({ pedir }).doItem({ issueId: '10001' });

    expect(chamadas[0].caminho).toContain('/rest/api/3/mypermissions');
    expect(chamadas[0].caminho).toContain('issueId=10001');
    for (const p of PERMISSOES) expect(chamadas[0].caminho).toContain(p);
    expect(chamadas[0].opcoes.method).toBe('GET');
  });

  it('não pergunta pelas permissões "ALL" — hora alheia não se edita por aqui', () => {
    expect(PERMISSOES).not.toContain('EDIT_ALL_WORKLOGS');
    expect(PERMISSOES).not.toContain('DELETE_ALL_WORKLOGS');
  });

  it('lê as três respostas', async () => {
    const { pedir } = espiao(() => resposta(200, TUDO));
    const r = await criarPermissoes({ pedir }).doItem({ issueId: '10001' });
    expect(r).toMatchObject({
      ok: true,
      conferida: true,
      podeApontar: true,
      podeEditar: true,
      podeApagar: true,
    });
  });

  it('sem permissão de apontar, diz que não — é o caso que o D5 existe para pegar', async () => {
    const { pedir } = espiao(() =>
      resposta(200, bloco({ WORK_ON_ISSUES: false, EDIT_OWN_WORKLOGS: false, DELETE_OWN_WORKLOGS: false }))
    );
    const r = await criarPermissoes({ pedir }).doItem({ issueId: '10001' });
    expect(r).toMatchObject({ ok: true, conferida: true, podeApontar: false, podeEditar: false });
  });

  it('permissão ausente na resposta conta como negada, não como concedida', async () => {
    const { pedir } = espiao(() => resposta(200, { permissions: {} }));
    const r = await criarPermissoes({ pedir }).doItem({ issueId: '10001' });
    expect(r.podeApontar).toBe(false);
  });

  it('formato estranho não vira permissão concedida por acidente', async () => {
    const { pedir } = espiao(() =>
      resposta(200, { permissions: { WORK_ON_ISSUES: { havePermission: 'true' } } })
    );
    const r = await criarPermissoes({ pedir }).doItem({ issueId: '10001' });
    expect(r.podeApontar).toBe(false);
  });

  it('**Jira fora do ar não tranca a pessoa fora da própria folha de ponto**', async () => {
    const pedir = async () => {
      throw new Error('socket hang up');
    };
    const r = await criarPermissoes({ pedir }).doItem({ issueId: '10001' });

    expect(r.ok).toBe(false);
    expect(r.motivo).toBe('rede');
    // Na dúvida, libera — e avisa que não conferiu.
    expect(r.podeApontar).toBe(true);
    expect(r.conferida).toBe(false);
  });

  it('500 também libera, marcado como não conferido', async () => {
    const { pedir } = espiao(() => resposta(500, {}));
    const r = await criarPermissoes({ pedir }).doItem({ issueId: '10001' });
    expect(r).toMatchObject({ ok: false, conferida: false, podeApontar: true });
  });

  it('404 tem motivo próprio: o item sumiu', async () => {
    const { pedir } = espiao(() => resposta(404, {}));
    const r = await criarPermissoes({ pedir }).doItem({ issueId: '10001' });
    expect(r).toMatchObject({ ok: false, motivo: 'item-nao-encontrado', conferida: false });
  });

  it('exige o issueId em vez de perguntar sobre o projeto inteiro', async () => {
    const { pedir } = espiao(() => resposta(200, TUDO));
    await expect(criarPermissoes({ pedir }).doItem({})).rejects.toThrow(TypeError);
  });
});
