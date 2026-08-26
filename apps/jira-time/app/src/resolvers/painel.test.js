import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { criarPainel, MINIMO_SEGUNDOS } from './painel.js';
import { criarTimers, storageDeMemoria, chaveDoTimer } from '../lib/timer.js';

/**
 * Estes testes cobrem o que um clique no painel faz do lado do servidor:
 * de onde vem a identidade, de onde vem o item, o que vira worklog e — o que
 * mais importa no D3 — **o que acontece com a hora da pessoa quando a gravação
 * falha.** É a camada que o navegador exercitaria.
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

const AUTOR = { accountId: 'conta-eu', displayName: 'Amarildo Pereira' };

/** Worklogs falsos: guardam o que foi gravado e obedecem ao roteiro do teste. */
function worklogsFalsos({ aoGravar, aoBuscar } = {}) {
  const gravados = [];
  return {
    gravados,
    async gravar({ issueId, startedAt, segundos }) {
      const roteiro = aoGravar?.(gravados.length + 1);
      if (roteiro) return roteiro;
      const wl = {
        id: `w${gravados.length + 1}`,
        issueId,
        started: startedAt,
        segundos,
        autorId: AUTOR.accountId,
        autorNome: AUTOR.displayName,
      };
      gravados.push(wl);
      return { ok: true, worklog: wl };
    },
    async jaExiste() {
      return aoBuscar ? aoBuscar() : { ok: true, encontrado: false };
    },
  };
}

function montar(opcoes = {}) {
  const storage = storageDeMemoria();
  const tempo = relogio('2026-08-27T09:00:00.000Z');
  const timers = criarTimers({ storage, agora: tempo.agora });
  const worklogs = worklogsFalsos(opcoes);
  return { storage, tempo, timers, worklogs, painel: criarPainel({ timers, worklogs }) };
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
    expect(await painel.estadoDoTimer({ context: {} })).toEqual({ ok: false, motivo: 'sem-usuario' });
  });

  it('sem item no contexto devolve motivo — o painel não pode ficar em branco', async () => {
    const { painel } = montar();
    expect(await painel.estadoDoTimer(req('conta-eu', null))).toEqual({
      ok: false,
      motivo: 'sem-item',
    });
  });

  it('falha do KVS vira motivo, não tela quebrada', async () => {
    const storage = storageDeMemoria();
    storage.get = async () => {
      throw new Error('kvs-fora-do-ar');
    };
    const painel = criarPainel({
      timers: criarTimers({ storage }),
      worklogs: worklogsFalsos(),
    });

    expect(await painel.estadoDoTimer(EU)).toEqual({ ok: false, motivo: 'kvs-fora-do-ar' });
  });
});

describe('pararTimer — o worklog nativo (D3)', () => {
  it('grava o worklog com o início RETROATIVO, não com a hora do "parar"', async () => {
    const { painel, worklogs, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(3 * 3600);

    const r = await painel.pararTimer(EU);

    expect(r).toMatchObject({ ok: true, gravado: true });
    expect(worklogs.gravados).toHaveLength(1);
    // É isto que faz a folha bater com o dia em que o trabalho aconteceu.
    expect(worklogs.gravados[0].started).toBe('2026-08-27T09:00:00.000Z');
    expect(worklogs.gravados[0].segundos).toBe(10800);
    expect(worklogs.gravados[0].issueId).toBe('10001');
  });

  it('devolve o autor que o Jira registrou — a cunha, visível na tela', async () => {
    const { painel, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(3 * 3600);

    const r = await painel.pararTimer(EU);

    expect(r.worklog.autorNome).toBe('Amarildo Pereira');
    expect(r.worklog.duracao).toBe('3h');
    expect(r.worklog.id).toBe('w1');
  });

  it('só apaga o timer DEPOIS que o worklog foi gravado', async () => {
    const { storage, painel, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(3 * 3600);

    await painel.pararTimer(EU);

    expect(storage.tamanho).toBe(0);
    expect((await painel.estadoDoTimer(EU)).timer).toBeNull();
  });

  it('parar sem timer não é erro e não grava nada', async () => {
    const { painel, worklogs } = montar();
    expect(await painel.pararTimer(EU)).toEqual({ ok: true, encerrado: null, gravado: false });
    expect(worklogs.gravados).toHaveLength(0);
  });

  it('timer de menos de um minuto não vira worklog — é clique errado', async () => {
    const { storage, painel, worklogs, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(MINIMO_SEGUNDOS - 1);

    const r = await painel.pararTimer(EU);

    expect(r).toMatchObject({ ok: true, gravado: false, motivo: 'curto-demais' });
    expect(worklogs.gravados).toHaveLength(0);
    expect(storage.tamanho).toBe(0); // e o timer some, não fica pendurado
  });

  it('timer corrompido no KVS não vira hora inventada no Jira', async () => {
    const { storage, painel, worklogs } = montar();
    await storage.set(chaveDoTimer('conta-eu'), { issueId: '10001', startedAt: 'lixo' });

    const r = await painel.pararTimer(EU);

    expect(r).toMatchObject({ ok: false, motivo: 'timer-corrompido' });
    expect(worklogs.gravados).toHaveLength(0);
    expect(storage.tamanho).toBe(0);
  });
});

describe('pararTimer — quando a gravação falha', () => {
  it('O TIMER SOBREVIVE: perder hora cronometrada é o pior desfecho', async () => {
    const { storage, painel, tempo } = montar({
      aoGravar: () => ({ ok: false, motivo: 'jira-indisponivel', status: 503 }),
    });
    await painel.iniciarTimer(EU);
    tempo.avancar(3 * 3600);

    const r = await painel.pararTimer(EU);

    expect(r).toMatchObject({ ok: false, motivo: 'jira-indisponivel' });
    // As 3h continuam de pé, e o painel sabe disso para poder dizer.
    expect(storage.tamanho).toBe(1);
    expect(r.timerMantido.segundos).toBe(10800);
    expect(r.timerMantido.tentativas).toBe(1);
    expect(r.timerMantido.ultimaFalha).toBe('jira-indisponivel');
  });

  it('tentar de novo grava, e o timer some só então', async () => {
    let falhar = true;
    const { storage, painel, worklogs, tempo } = montar({
      aoGravar: () => (falhar ? { ok: false, motivo: 'jira-indisponivel' } : null),
    });
    await painel.iniciarTimer(EU);
    tempo.avancar(3 * 3600);

    await painel.pararTimer(EU);
    falhar = false;
    // O tempo continua correndo enquanto o timer está de pé — é honesto:
    // a pessoa ainda não conseguiu apontar.
    const r = await painel.pararTimer(EU);

    expect(r).toMatchObject({ ok: true, gravado: true });
    expect(worklogs.gravados).toHaveLength(1);
    expect(storage.tamanho).toBe(0);
  });

  it('INVOCAÇÃO INTERROMPIDA no meio do POST ainda deixa rastro para a retentativa', async () => {
    // Nenhum tratamento de erro roda quando a função do Forge é morta. O que
    // protege a pessoa é a marca gravada ANTES do POST.
    let tentativa = 0;
    const { storage, painel, worklogs, tempo } = montar({
      aoGravar: () => {
        tentativa += 1;
        if (tentativa === 1) throw new Error('function-timeout');
        return null;
      },
      aoBuscar: () => ({
        ok: true,
        encontrado: true,
        worklog: {
          id: 'w-do-timeout',
          started: '2026-08-27T09:00:00.000Z',
          timeSpentSeconds: 10800,
          author: AUTOR,
        },
      }),
    });
    await painel.iniciarTimer(EU);
    tempo.avancar(3 * 3600);

    const morreu = await painel.pararTimer(EU);
    expect(morreu.ok).toBe(false);
    // O timer sobreviveu — e já sabe que a gravação pode ter chegado ao Jira.
    expect(storage.tamanho).toBe(1);
    expect(await storage.get(chaveDoTimer('conta-eu'))).toMatchObject({ podeTerGravado: true });

    // A retentativa confere e encontra o worklog que a invocação morta criou.
    const r = await painel.pararTimer(EU);
    expect(r).toMatchObject({ ok: true, gravado: true, jaEstavaGravado: true });
    expect(r.worklog.id).toBe('w-do-timeout');
    expect(worklogs.gravados).toHaveLength(0);
  });

  it('permissão negada mantém o timer e diz o motivo certo', async () => {
    const { painel, tempo } = montar({
      aoGravar: () => ({ ok: false, motivo: 'sem-permissao', status: 403 }),
    });
    await painel.iniciarTimer(EU);
    tempo.avancar(3600);

    const r = await painel.pararTimer(EU);

    expect(r.motivo).toBe('sem-permissao');
    expect(r.timerMantido.segundos).toBe(3600);
  });

  it('depois de falha de rede, CONFERE antes de gravar de novo', async () => {
    let tentativa = 0;
    const { painel, worklogs, tempo } = montar({
      aoGravar: () => {
        tentativa += 1;
        return tentativa === 1 ? { ok: false, motivo: 'rede', podeTerGravado: true } : null;
      },
      // A primeira gravação tinha chegado ao Jira, apesar do erro de rede.
      aoBuscar: () => ({
        ok: true,
        encontrado: true,
        worklog: {
          id: 'w-fantasma',
          started: '2026-08-27T09:00:00.000Z',
          timeSpentSeconds: 10800,
          author: AUTOR,
        },
      }),
    });
    await painel.iniciarTimer(EU);
    tempo.avancar(3 * 3600);

    await painel.pararTimer(EU);
    const r = await painel.pararTimer(EU);

    expect(r).toMatchObject({ ok: true, gravado: true, jaEstavaGravado: true });
    expect(r.worklog.id).toBe('w-fantasma');
    expect(r.worklog.duracao).toBe('3h');
    // Não gravou de novo: a pessoa não ganhou 3h em dobro.
    expect(worklogs.gravados).toHaveLength(0);
  });

  it('se a conferência não achar nada, grava mesmo — nada some por precaução', async () => {
    let tentativa = 0;
    const { painel, worklogs, tempo } = montar({
      aoGravar: () => {
        tentativa += 1;
        return tentativa === 1 ? { ok: false, motivo: 'rede', podeTerGravado: true } : null;
      },
      aoBuscar: () => ({ ok: true, encontrado: false }),
    });
    await painel.iniciarTimer(EU);
    tempo.avancar(3 * 3600);

    await painel.pararTimer(EU);
    const r = await painel.pararTimer(EU);

    expect(r.gravado).toBe(true);
    expect(worklogs.gravados).toHaveLength(1);
  });

  it('se a conferência falhar, grava mesmo assim — hora perdida é pior que duplicata', async () => {
    let tentativa = 0;
    const { painel, worklogs, tempo } = montar({
      aoGravar: () => {
        tentativa += 1;
        return tentativa === 1 ? { ok: false, motivo: 'rede', podeTerGravado: true } : null;
      },
      aoBuscar: () => ({ ok: false, motivo: 'jira-indisponivel' }),
    });
    await painel.iniciarTimer(EU);
    tempo.avancar(3 * 3600);

    await painel.pararTimer(EU);
    const r = await painel.pararTimer(EU);

    // Uma duplicata a pessoa vê e apaga; 3h perdidas ela não recupera.
    expect(r.gravado).toBe(true);
    expect(worklogs.gravados).toHaveLength(1);
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

  it('clicar duas vezes no mesmo item não reinicia nem gera worklog de 2s', async () => {
    const { painel, worklogs, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(2);

    const r = await painel.iniciarTimer(EU);

    expect(r.jaEstavaRodando).toBe(true);
    expect(r.anterior).toBeNull();
    expect(r.timer.segundos).toBe(2);
    expect(worklogs.gravados).toHaveLength(0);
  });

  it('trocar de item GRAVA o anterior antes de começar o novo', async () => {
    const { storage, painel, worklogs, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(2 * 3600);

    const r = await painel.iniciarTimer(EU_OUTRO_ITEM);

    expect(worklogs.gravados).toHaveLength(1);
    expect(worklogs.gravados[0]).toMatchObject({ issueId: '10001', segundos: 7200 });
    expect(r.anterior).toMatchObject({ gravado: true });
    expect(r.anterior.encerrado.issueKey).toBe('NL-1');
    expect(r.timer).toMatchObject({ issueKey: 'NL-2', segundos: 0 });
    expect(storage.tamanho).toBe(1); // exatamente um timer de pé, o novo
  });

  it('se o anterior não gravar, NÃO começa o novo — a hora não é abandonada', async () => {
    const { storage, painel, tempo } = montar({
      aoGravar: () => ({ ok: false, motivo: 'jira-indisponivel' }),
    });
    await painel.iniciarTimer(EU);
    tempo.avancar(2 * 3600);

    const r = await painel.iniciarTimer(EU_OUTRO_ITEM);

    expect(r).toMatchObject({ ok: false, motivo: 'jira-indisponivel', aoFecharAnterior: true });
    expect(r.timerMantido.issueKey).toBe('NL-1');
    expect(r.timerMantido.segundos).toBe(7200);
    // O timer antigo continua sendo o único, no item antigo.
    expect(storage.tamanho).toBe(1);
    const estado = await painel.estadoDoTimer(EU_OUTRO_ITEM);
    expect(estado.timer.issueKey).toBe('NL-1');
    expect(estado.emOutroItem).toBe(true);
  });

  it('anterior curto demais não vira worklog, mas não impede o novo timer', async () => {
    const { painel, worklogs, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(5);

    const r = await painel.iniciarTimer(EU_OUTRO_ITEM);

    expect(r.ok).toBe(true);
    expect(r.anterior).toMatchObject({ gravado: false, motivo: 'curto-demais' });
    expect(worklogs.gravados).toHaveLength(0);
    expect(r.timer.issueKey).toBe('NL-2');
  });

  it('os timers de duas pessoas não se atrapalham', async () => {
    const { storage, painel } = montar();
    await painel.iniciarTimer(EU);
    await painel.iniciarTimer(OUTRA_PESSOA);
    expect(storage.tamanho).toBe(2);
    expect((await painel.estadoDoTimer(EU)).timer.issueKey).toBe('NL-1');
  });
});

describe('descartarTimer', () => {
  it('joga fora sem apontar nada', async () => {
    const { storage, painel, worklogs, tempo } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(20 * 3600);

    const r = await painel.descartarTimer(EU);

    expect(r.descartado.duracao).toBe('20h');
    expect(worklogs.gravados).toHaveLength(0);
    expect(storage.tamanho).toBe(0);
  });

  it('descartar sem timer não quebra', async () => {
    const { painel } = montar();
    expect(await painel.descartarTimer(EU)).toEqual({ ok: true, descartado: null });
  });

  it('é a saída do timer que não consegue gravar', async () => {
    const { storage, painel, tempo } = montar({
      aoGravar: () => ({ ok: false, motivo: 'item-nao-encontrado' }),
    });
    await painel.iniciarTimer(EU);
    tempo.avancar(3600);
    await painel.pararTimer(EU);

    // O item foi apagado no Jira: não há onde gravar. Descartar é a única saída.
    expect(storage.tamanho).toBe(1);
    await painel.descartarTimer(EU);
    expect(storage.tamanho).toBe(0);
  });
});
