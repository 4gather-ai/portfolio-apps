import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { criarPainel } from './painel.js';
import { criarTimers, storageDeMemoria } from '../lib/timer.js';

/**
 * Estes testes cobrem o que um clique no painel faz do lado do servidor:
 * de onde vem a identidade, de onde vem o item, e o que o painel recebe de
 * volta. É a camada que o navegador exercitaria — como não há navegador aqui,
 * ela é exercitada em teste.
 */

function relogio(iso) {
  let atual = new Date(iso);
  return {
    agora: () => new Date(atual),
    avancar: (s) => {
      atual = new Date(atual.getTime() + s * 1000);
    },
  };
}

function montar() {
  const storage = storageDeMemoria();
  const tempo = relogio('2026-08-27T09:00:00.000Z');
  const timers = criarTimers({ storage, agora: tempo.agora });
  return { storage, tempo, painel: criarPainel({ timers }) };
}

/** O contexto que o Forge entrega ao resolver. */
function req(accountId, issue) {
  return { context: { accountId, extension: issue ? { issue } : undefined } };
}

const EU = req('conta-eu', { id: '10001', key: 'NL-1' });
const EU_OUTRO_ITEM = req('conta-eu', { id: '10002', key: 'NL-2' });
const OUTRA_PESSOA = req('conta-outra', { id: '10001', key: 'NL-1' });

// O painel loga o erro antes de devolver o motivo; nos testes isso é ruído.
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('estadoDoTimer', () => {
  it('painel recém-aberto: sem timer', async () => {
    const { painel } = montar();
    const r = await painel.estadoDoTimer(EU);
    expect(r).toMatchObject({ ok: true, timer: null, emOutroItem: false });
    expect(r.item).toEqual({ issueId: '10001', issueKey: 'NL-1' });
  });

  it('timer neste item vem formatado, pronto para a tela', async () => {
    const { painel, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(5025);

    const r = await painel.estadoDoTimer(EU);

    expect(r.emOutroItem).toBe(false);
    expect(r.timer.relogio).toBe('1:23:45'); // relógio para o timer correndo
    expect(r.timer.duracao).toBe('1h 23m'); // notação do Jira para o total
  });

  it('timer em OUTRO item é sinalizado — trocar é destrutivo', async () => {
    const { painel } = montar();
    await painel.iniciarTimer(EU);

    const r = await painel.estadoDoTimer(EU_OUTRO_ITEM);

    expect(r.emOutroItem).toBe(true);
    expect(r.timer.issueKey).toBe('NL-1'); // o painel diz ONDE, para poder avisar
  });

  it('o timer de outra pessoa não aparece no meu painel', async () => {
    const { painel } = montar();
    await painel.iniciarTimer(EU);
    expect((await painel.estadoDoTimer(OUTRA_PESSOA)).timer).toBeNull();
  });
});

describe('identidade e contexto', () => {
  it('a identidade vem do contexto do Forge, não do frontend', async () => {
    const { painel } = montar();
    await painel.iniciarTimer(EU);

    // Payload malicioso pedindo o timer de outra conta: ignorado, o contexto manda.
    const r = await painel.estadoDoTimer({
      ...OUTRA_PESSOA,
      payload: { accountId: 'conta-eu' },
    });

    expect(r.ok).toBe(true);
    expect(r.timer).toBeNull();
  });

  it('sem usuário no contexto devolve motivo, não exceção', async () => {
    const { painel } = montar();
    const r = await painel.estadoDoTimer({ context: {} });
    expect(r).toEqual({ ok: false, motivo: 'sem-usuario' });
  });

  it('sem item no contexto devolve motivo — o painel não pode ficar em branco', async () => {
    const { painel } = montar();
    const r = await painel.estadoDoTimer(req('conta-eu', null));
    expect(r).toEqual({ ok: false, motivo: 'sem-item' });
  });

  it('falha do KVS vira motivo, não tela quebrada', async () => {
    const storage = storageDeMemoria();
    storage.get = async () => {
      throw new Error('kvs-fora-do-ar');
    };
    const painel = criarPainel({ timers: criarTimers({ storage }) });

    const r = await painel.estadoDoTimer(EU);

    expect(r).toEqual({ ok: false, motivo: 'kvs-fora-do-ar' });
  });
});

describe('iniciarTimer', () => {
  it('começa do zero neste item', async () => {
    const { painel } = montar();
    const r = await painel.iniciarTimer(EU);
    expect(r.ok).toBe(true);
    expect(r.anterior).toBeNull();
    expect(r.timer).toMatchObject({ issueKey: 'NL-1', segundos: 0, relogio: '0:00' });
  });

  it('trocar de item devolve o anterior fechado, para o painel poder avisar', async () => {
    const { painel, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(2 * 3600);

    const r = await painel.iniciarTimer(EU_OUTRO_ITEM);

    expect(r.anterior).toMatchObject({ issueKey: 'NL-1', duracao: '2h' });
    expect(r.timer).toMatchObject({ issueKey: 'NL-2', segundos: 0 });
  });

  it('clicar duas vezes no mesmo item não reinicia nem gera worklog de 2s', async () => {
    const { painel, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(2);

    const r = await painel.iniciarTimer(EU);

    expect(r.jaEstavaRodando).toBe(true);
    expect(r.anterior).toBeNull();
    expect(r.timer.segundos).toBe(2);
  });
});

describe('pararTimer', () => {
  it('devolve o total apontado e zera o KVS', async () => {
    const { storage, painel, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(3 * 3600);

    const r = await painel.pararTimer(EU);

    expect(r.encerrado).toMatchObject({ issueKey: 'NL-1', duracao: '3h', segundos: 10800 });
    expect(storage.tamanho).toBe(0);
    expect((await painel.estadoDoTimer(EU)).timer).toBeNull();
  });

  it('parar sem timer não é erro', async () => {
    const { painel } = montar();
    expect(await painel.pararTimer(EU)).toEqual({ ok: true, encerrado: null });
  });

  it('o timer esquecido chega marcado, para a tela poder perguntar antes', async () => {
    const { painel, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(20 * 3600);
    expect((await painel.pararTimer(EU)).encerrado.suspeito).toBe(true);
  });

  it('parar não exige o item — dá para parar de qualquer painel', async () => {
    const { painel, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(3600);
    const r = await painel.pararTimer(EU_OUTRO_ITEM);
    expect(r.encerrado.issueKey).toBe('NL-1');
  });
});

describe('descartarTimer', () => {
  it('joga fora sem apontar nada', async () => {
    const { storage, painel, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(20 * 3600);

    const r = await painel.descartarTimer(EU);

    expect(r.descartado.duracao).toBe('20h');
    expect(storage.tamanho).toBe(0);
  });

  it('descartar sem timer não quebra', async () => {
    const { painel } = montar();
    expect(await painel.descartarTimer(EU)).toEqual({ ok: true, descartado: null });
  });
});
