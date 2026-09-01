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

/**
 * O painel manda o instante do clique junto porque o relógio da tela começa a
 * andar ali, antes de o resolver responder. Se o servidor ignorasse esse
 * carimbo, a confirmação faria o relógio pular para trás — foi o defeito 2 do
 * teste manual de 26/08/2026.
 */
describe('iniciarTimer com o instante do clique', () => {
  /** O mesmo contexto do painel, agora com payload — é assim que `invoke` chega. */
  function comClique(base, iniciadoEm) {
    return { ...base, payload: { iniciadoEm } };
  }

  it('o servidor grava o instante do clique, não o da resposta', async () => {
    const { painel, tempo } = montar();
    // 20 s de cold start entre o clique e esta execução.
    tempo.avancar(20);

    const r = await painel.iniciarTimer(comClique(EU, '2026-08-27T09:00:00.000Z'));

    expect(r.ok).toBe(true);
    // Igual ao que a tela já está mostrando: nada pula para trás.
    expect(r.timer.startedAt).toBe('2026-08-27T09:00:00.000Z');
    expect(r.timer.segundos).toBe(20);
  });

  it('sem payload continua funcionando — nenhuma tela antiga quebra', async () => {
    const { painel } = montar();
    const r = await painel.iniciarTimer(EU);
    expect(r.ok).toBe(true);
    expect(r.timer.startedAt).toBe('2026-08-27T09:00:00.000Z');
  });

  it('carimbo fora da tolerância não vira hora apontada', async () => {
    const { painel } = montar();
    const r = await painel.iniciarTimer(comClique(EU, '2026-08-27T06:00:00.000Z'));
    expect(r.timer.startedAt).toBe('2026-08-27T09:00:00.000Z');
    expect(r.timer.segundos).toBe(0);
  });

  it('trocar de item: o anterior é gravado e o novo começa no clique', async () => {
    const { painel, tempo, worklogs } = montar();
    await painel.iniciarTimer(EU);
    tempo.avancar(120);

    const r = await painel.iniciarTimer(comClique(EU_OUTRO_ITEM, '2026-08-27T09:02:00.000Z'));

    expect(r.ok).toBe(true);
    expect(r.anterior.gravado).toBe(true);
    expect(worklogs.gravados[0].segundos).toBe(120);
    expect(r.timer.issueId).toBe('10002');
    expect(r.timer.startedAt).toBe('2026-08-27T09:02:00.000Z');
  });
});

// ── D4: apontamento manual, edição e exclusão ────────────────────────────────

/**
 * O que estes testes protegem, em uma frase: **a hora de outra pessoa.**
 *
 * O `worklogId` vem do navegador. Se a conferência de autoria morasse na tela,
 * um pedido montado à mão editaria ou apagaria o apontamento de um colega — e a
 * permissão do Jira não pegaria, porque quem tem "editar worklog de qualquer
 * um" passa por ela. A guarda é do servidor, e é isto que a cobre.
 */

const MEU_WORKLOG = {
  id: '10501',
  issueId: '10001',
  started: '2026-08-26T09:00:00.000Z',
  segundos: 3600,
  comentario: 'revisão do PR',
  autorId: 'conta-eu',
  autorNome: 'Amarildo Pereira',
  meu: true,
};

const WORKLOG_ALHEIO = {
  ...MEU_WORKLOG,
  id: '10502',
  autorId: 'conta-outra',
  autorNome: 'Outra Pessoa',
  meu: false,
};

/** Worklogs falsos com as operações do D4, guardando o que foi pedido. */
function worklogsD4({ lista, umPorId, aoAtualizar, aoApagar, aoGravar } = {}) {
  const gravados = [];
  const chamadas = [];
  return {
    gravados,
    chamadas,
    async gravar(alvo) {
      chamadas.push({ op: 'gravar', alvo });
      const roteiro = aoGravar?.();
      if (roteiro) return roteiro;
      const wl = { id: 'novo-1', issueId: alvo.issueId, started: alvo.startedAt, segundos: alvo.segundos, autorNome: 'Amarildo Pereira' };
      gravados.push({ ...wl, comentario: alvo.comentario });
      return { ok: true, worklog: wl };
    },
    async jaExiste() {
      return { ok: true, encontrado: false };
    },
    async listar() {
      chamadas.push({ op: 'listar' });
      return lista || { ok: true, worklogs: [], completo: true };
    },
    async lerUm({ worklogId }) {
      chamadas.push({ op: 'lerUm', worklogId });
      if (umPorId) return umPorId(worklogId);
      return { ok: true, worklog: MEU_WORKLOG };
    },
    async atualizar(alvo) {
      chamadas.push({ op: 'atualizar', alvo });
      return aoAtualizar?.() || { ok: true, worklog: { ...MEU_WORKLOG, segundos: alvo.segundos } };
    },
    async apagar(alvo) {
      chamadas.push({ op: 'apagar', alvo });
      return aoApagar?.() || { ok: true, jaNaoExistia: false };
    },
  };
}

function montarD4(opcoes = {}) {
  const storage = storageDeMemoria();
  const tempo = relogio('2026-08-27T09:00:00.000Z');
  const timers = criarTimers({ storage, agora: tempo.agora });
  const worklogs = worklogsD4(opcoes);
  return {
    storage,
    tempo,
    timers,
    worklogs,
    painel: criarPainel({ timers, worklogs, agora: tempo.agora }),
  };
}

/** O contexto do painel com payload — é assim que `invoke(nome, payload)` chega. */
function comPayload(base, payload) {
  return { ...base, payload };
}

describe('meusApontamentos', () => {
  it('mostra só os meus, mesmo com o item cheio de horas de outras pessoas', async () => {
    const { painel } = montarD4({
      lista: { ok: true, worklogs: [MEU_WORKLOG, WORKLOG_ALHEIO], completo: true },
    });

    const r = await painel.meusApontamentos(EU);

    expect(r.ok).toBe(true);
    expect(r.apontamentos).toHaveLength(1);
    expect(r.apontamentos[0].id).toBe('10501');
  });

  it('o total é só do que é meu — a tela se chama "seu tempo neste item"', async () => {
    const outroMeu = { ...MEU_WORKLOG, id: '10503', segundos: 1800 };
    const { painel } = montarD4({
      lista: { ok: true, worklogs: [MEU_WORKLOG, WORKLOG_ALHEIO, outroMeu], completo: true },
    });

    const r = await painel.meusApontamentos(EU);
    expect(r.totalSegundos).toBe(5400);
  });

  it('traz a duração já formatada e a descrição, para a lista e para a edição', async () => {
    const { painel } = montarD4({ lista: { ok: true, worklogs: [MEU_WORKLOG], completo: true } });
    const r = await painel.meusApontamentos(EU);

    expect(r.apontamentos[0]).toMatchObject({
      duracao: '1h',
      comentario: 'revisão do PR',
      started: '2026-08-26T09:00:00.000Z',
    });
  });

  it('item sem nada meu devolve lista vazia, não erro', async () => {
    const { painel } = montarD4({ lista: { ok: true, worklogs: [WORKLOG_ALHEIO], completo: true } });
    const r = await painel.meusApontamentos(EU);
    expect(r).toMatchObject({ ok: true, apontamentos: [], totalSegundos: 0 });
  });

  it('repassa o aviso de lista cortada — soma parcial não pode parecer completa', async () => {
    const { painel } = montarD4({ lista: { ok: true, worklogs: [MEU_WORKLOG], completo: false } });
    expect((await painel.meusApontamentos(EU)).completo).toBe(false);
  });

  it('erro do Jira vira motivo, não painel em branco', async () => {
    const { painel } = montarD4({ lista: { ok: false, motivo: 'sem-permissao' } });
    expect(await painel.meusApontamentos(EU)).toMatchObject({ ok: false, motivo: 'sem-permissao' });
  });
});

describe('apontarManual', () => {
  it('grava o que a pessoa digitou, com o início que ela escolheu', async () => {
    const { painel, worklogs } = montarD4();

    const r = await painel.apontarManual(
      comPayload(EU, {
        duracao: '1h 30m',
        iniciadoEm: '2026-08-26T14:00:00.000Z',
        comentario: 'revisão do PR',
      })
    );

    expect(r).toMatchObject({ ok: true, gravado: true, issueKey: 'NL-1' });
    expect(r.worklog.duracao).toBe('1h 30m');
    expect(worklogs.gravados[0]).toMatchObject({
      issueId: '10001',
      segundos: 5400,
      started: '2026-08-26T14:00:00.000Z',
      comentario: 'revisão do PR',
    });
  });

  it('**não toca no timer** — lançar a sexta esquecida não mata o cronômetro de hoje', async () => {
    const { painel, storage, timers } = montarD4();
    await painel.iniciarTimer(EU);
    expect(await timers.ler('conta-eu')).not.toBeNull();

    await painel.apontarManual(
      comPayload(EU, { duracao: '2h', iniciadoEm: '2026-08-21T14:00:00.000Z' })
    );

    const aindaRodando = await timers.ler('conta-eu');
    expect(aindaRodando).not.toBeNull();
    expect(aindaRodando.issueId).toBe('10001');
    expect(storage.tamanho).toBe(1);
  });

  it('o que não passa na validação não chega ao Jira', async () => {
    const { painel, worklogs } = montarD4();

    const r = await painel.apontarManual(comPayload(EU, { duracao: 'umas horas' }));

    expect(r).toMatchObject({ ok: false, motivo: 'duracao-invalida' });
    expect(worklogs.gravados).toHaveLength(0);
  });

  it('recusa apontar trabalho que ainda não aconteceu', async () => {
    const { painel } = montarD4();
    const r = await painel.apontarManual(
      comPayload(EU, { duracao: '2h', iniciadoEm: '2026-08-28T09:00:00.000Z' })
    );
    expect(r).toMatchObject({ ok: false, motivo: 'inicio-no-futuro' });
  });

  it('erro do Jira vira motivo que o painel sabe explicar', async () => {
    const { painel } = montarD4({ aoGravar: () => ({ ok: false, motivo: 'sem-permissao' }) });
    const r = await painel.apontarManual(
      comPayload(EU, { duracao: '2h', iniciadoEm: '2026-08-26T09:00:00.000Z' })
    );
    expect(r).toMatchObject({ ok: false, motivo: 'sem-permissao' });
  });

  it('sem identidade, não grava nada', async () => {
    const { painel, worklogs } = montarD4();
    const semUsuario = { context: { extension: { issue: { id: '10001', key: 'NL-1' } } } };
    const r = await painel.apontarManual(
      comPayload(semUsuario, { duracao: '2h', iniciadoEm: '2026-08-26T09:00:00.000Z' })
    );
    expect(r).toMatchObject({ ok: false, motivo: 'sem-usuario' });
    expect(worklogs.gravados).toHaveLength(0);
  });
});

describe('editarApontamento', () => {
  it('corrige duração, início e descrição de uma vez', async () => {
    const { painel, worklogs } = montarD4();

    const r = await painel.editarApontamento(
      comPayload(EU, {
        worklogId: '10501',
        duracao: '45m',
        iniciadoEm: '2026-08-26T10:00:00.000Z',
        comentario: 'corrigido',
      })
    );

    expect(r).toMatchObject({ ok: true, editado: true });
    const atualizacao = worklogs.chamadas.find((c) => c.op === 'atualizar');
    expect(atualizacao.alvo).toMatchObject({
      worklogId: '10501',
      segundos: 2700,
      startedAt: '2026-08-26T10:00:00.000Z',
      comentario: 'corrigido',
    });
  });

  it('**apontamento de outra pessoa não é editável, nem com o id certo na mão**', async () => {
    const { painel, worklogs } = montarD4({
      umPorId: () => ({ ok: true, worklog: WORKLOG_ALHEIO }),
    });

    const r = await painel.editarApontamento(
      comPayload(EU, { worklogId: '10502', duracao: '99h', iniciadoEm: '2026-08-26T10:00:00.000Z' })
    );

    expect(r).toMatchObject({ ok: false, motivo: 'apontamento-de-outra-pessoa' });
    expect(worklogs.chamadas.find((c) => c.op === 'atualizar')).toBeUndefined();
  });

  it('confere a autoria ANTES de validar — nada sobre a entrada alheia é revelado', async () => {
    const { painel, worklogs } = montarD4({
      umPorId: () => ({ ok: true, worklog: WORKLOG_ALHEIO }),
    });

    // Payload inválido de propósito: mesmo assim o motivo é a autoria.
    const r = await painel.editarApontamento(comPayload(EU, { worklogId: '10502', duracao: 'xx' }));
    expect(r.motivo).toBe('apontamento-de-outra-pessoa');
    expect(worklogs.chamadas.filter((c) => c.op === 'lerUm')).toHaveLength(1);
  });

  it('apontamento que sumiu não vira erro genérico', async () => {
    const { painel } = montarD4({
      umPorId: () => ({ ok: false, motivo: 'apontamento-nao-encontrado' }),
    });
    const r = await painel.editarApontamento(
      comPayload(EU, { worklogId: '999', duracao: '1h', iniciadoEm: '2026-08-26T10:00:00.000Z' })
    );
    expect(r).toMatchObject({ ok: false, motivo: 'apontamento-nao-encontrado' });
  });

  it('sem worklogId não tenta adivinhar qual entrada era', async () => {
    const { painel, worklogs } = montarD4();
    const r = await painel.editarApontamento(comPayload(EU, { duracao: '1h' }));
    expect(r).toMatchObject({ ok: false, motivo: 'sem-apontamento' });
    expect(worklogs.chamadas).toHaveLength(0);
  });

  it('edição inválida não chega ao Jira', async () => {
    const { painel, worklogs } = montarD4();
    const r = await painel.editarApontamento(
      comPayload(EU, { worklogId: '10501', duracao: '30d', iniciadoEm: '2026-08-26T10:00:00.000Z' })
    );
    expect(r).toMatchObject({ ok: false, motivo: 'longo-demais' });
    expect(worklogs.chamadas.find((c) => c.op === 'atualizar')).toBeUndefined();
  });
});

describe('apagarApontamento', () => {
  it('apaga a própria entrada', async () => {
    const { painel, worklogs } = montarD4();

    const r = await painel.apagarApontamento(comPayload(EU, { worklogId: '10501' }));

    expect(r).toMatchObject({ ok: true, apagado: true, jaNaoExistia: false });
    expect(worklogs.chamadas.find((c) => c.op === 'apagar').alvo).toMatchObject({
      issueId: '10001',
      worklogId: '10501',
    });
  });

  it('**não apaga a entrada de outra pessoa**', async () => {
    const { painel, worklogs } = montarD4({
      umPorId: () => ({ ok: true, worklog: WORKLOG_ALHEIO }),
    });

    const r = await painel.apagarApontamento(comPayload(EU, { worklogId: '10502' }));

    expect(r).toMatchObject({ ok: false, motivo: 'apontamento-de-outra-pessoa' });
    expect(worklogs.chamadas.find((c) => c.op === 'apagar')).toBeUndefined();
  });

  it('entrada já apagada em outro lugar é sucesso — o objetivo era não existir', async () => {
    const { painel } = montarD4({ aoApagar: () => ({ ok: true, jaNaoExistia: true }) });
    const r = await painel.apagarApontamento(comPayload(EU, { worklogId: '10501' }));
    expect(r).toMatchObject({ ok: true, apagado: true, jaNaoExistia: true });
  });

  it('sem worklogId não apaga nada', async () => {
    const { painel, worklogs } = montarD4();
    const r = await painel.apagarApontamento(comPayload(EU, {}));
    expect(r).toMatchObject({ ok: false, motivo: 'sem-apontamento' });
    expect(worklogs.chamadas).toHaveLength(0);
  });

  it('falha do Jira vira motivo, e a entrada continua lá', async () => {
    const { painel } = montarD4({ aoApagar: () => ({ ok: false, motivo: 'jira-indisponivel' }) });
    const r = await painel.apagarApontamento(comPayload(EU, { worklogId: '10501' }));
    expect(r).toMatchObject({ ok: false, motivo: 'jira-indisponivel' });
  });
});

// ── D5: erros do núcleo ──────────────────────────────────────────────────────

/** Permissões falsas, com o roteiro que o teste quiser. */
function permissoesFalsas(resposta) {
  const chamadas = [];
  return {
    chamadas,
    async doItem({ issueId }) {
      chamadas.push(issueId);
      return (
        resposta || { ok: true, conferida: true, podeApontar: true, podeEditar: true, podeApagar: true }
      );
    },
  };
}

function montarD5(opcoes = {}) {
  const storage = storageDeMemoria();
  const tempo = relogio('2026-08-27T09:00:00.000Z');
  const timers = criarTimers({ storage, agora: tempo.agora });
  const worklogs = worklogsFalsos(opcoes);
  const permissoes = permissoesFalsas(opcoes.permissao);
  return {
    storage,
    tempo,
    timers,
    worklogs,
    permissoes,
    painel: criarPainel({ timers, worklogs, permissoes, agora: tempo.agora }),
  };
}

describe('estadoDoTimer com permissões', () => {
  it('pergunta as permissões do item na abertura, não na hora de gravar', async () => {
    const { painel, permissoes } = montarD5();
    const r = await painel.estadoDoTimer(EU);

    expect(permissoes.chamadas).toEqual(['10001']);
    expect(r.permissoes).toMatchObject({ conferida: true, podeApontar: true });
  });

  it('sem permissão de apontar, o painel sabe antes de a pessoa cronometrar', async () => {
    const { painel } = montarD5({
      permissao: { ok: true, conferida: true, podeApontar: false, podeEditar: false, podeApagar: false },
    });
    const r = await painel.estadoDoTimer(EU);
    expect(r.permissoes).toMatchObject({ podeApontar: false, podeEditar: false, podeApagar: false });
  });

  it('consulta de permissão que falhou libera e marca como não conferida', async () => {
    const { painel } = montarD5({
      permissao: { ok: false, motivo: 'rede', conferida: false, podeApontar: true, podeEditar: true, podeApagar: true },
    });
    const r = await painel.estadoDoTimer(EU);

    // Nunca trancar alguém fora da própria folha por causa de um problema nosso.
    expect(r.ok).toBe(true);
    expect(r.permissoes).toMatchObject({ conferida: false, podeApontar: true });
  });

  it('funciona sem a camada de permissões — o painel não depende dela', async () => {
    const storage = storageDeMemoria();
    const tempo = relogio('2026-08-27T09:00:00.000Z');
    const painel = criarPainel({
      timers: criarTimers({ storage, agora: tempo.agora }),
      worklogs: worklogsFalsos(),
      agora: tempo.agora,
    });
    const r = await painel.estadoDoTimer(EU);
    expect(r.ok).toBe(true);
    expect(r.permissoes).toBeNull();
  });
});

describe('timer esquecido não vira worklog sem alguém olhar o número', () => {
  /** Um timer de dias, que é o que a regra existe para pegar. */
  async function timerLongo() {
    const ctx = montarD5();
    await ctx.painel.iniciarTimer(EU);
    ctx.tempo.avancar(30 * 3600); // 30 h
    return ctx;
  }

  it('parar um timer suspeito pede confirmação em vez de gravar', async () => {
    const { painel, worklogs } = await timerLongo();

    const r = await painel.pararTimer(EU);

    expect(r).toMatchObject({ ok: true, gravado: false, motivo: 'precisa-confirmar' });
    expect(r.encerrado.duracao).toBe('1d 6h');
    expect(worklogs.gravados).toHaveLength(0);
  });

  it('o timer continua de pé enquanto não confirmam — nada se perde', async () => {
    const { painel, timers } = await timerLongo();
    await painel.pararTimer(EU);
    expect(await timers.ler('conta-eu')).not.toBeNull();
  });

  it('confirmado, grava normalmente', async () => {
    const { painel, worklogs, timers } = await timerLongo();

    const r = await painel.pararTimer({ ...EU, payload: { confirmado: true } });

    expect(r).toMatchObject({ ok: true, gravado: true });
    expect(worklogs.gravados[0].segundos).toBe(30 * 3600);
    expect(await timers.ler('conta-eu')).toBeNull();
  });

  it('timer normal não pede confirmação nenhuma', async () => {
    const { painel, tempo, worklogs } = montarD5();
    await painel.iniciarTimer(EU);
    tempo.avancar(2 * 3600);

    const r = await painel.pararTimer(EU);

    expect(r).toMatchObject({ ok: true, gravado: true });
    expect(worklogs.gravados).toHaveLength(1);
  });

  it('trocar de item **não** pede confirmação: o painel já mostrou o total antes do clique', async () => {
    const { painel, worklogs } = await timerLongo();

    const r = await painel.iniciarTimer(EU_OUTRO_ITEM);

    expect(r.ok).toBe(true);
    expect(r.anterior.gravado).toBe(true);
    expect(worklogs.gravados[0].segundos).toBe(30 * 3600);
  });

  it('timer corrompido não cai na confirmação — tem caminho próprio', async () => {
    const { painel, storage } = montarD5();
    await storage.set(chaveDoTimer('conta-eu'), { issueId: '10001', startedAt: 'lixo' });

    const r = await painel.pararTimer(EU);

    expect(r).toMatchObject({ ok: false, motivo: 'timer-corrompido' });
  });
});

describe('saída para o timer preso em outro item', () => {
  /**
   * O beco sem saída que o D5 fechou: timer rodando no item A, A apagado do
   * Jira. Gravar dá 404 para sempre, e até aqui o painel do item B só oferecia
   * "Start here" — que falha. A pessoa ficava sem poder apontar em lugar nenhum.
   */
  it('descartar funciona mesmo com o timer em outro item', async () => {
    const { painel, timers, storage } = montarD5();
    await painel.iniciarTimer(EU);

    // A pessoa está olhando o item B e descarta o timer que está no item A.
    const r = await painel.descartarTimer(EU_OUTRO_ITEM);

    expect(r.ok).toBe(true);
    expect(r.descartado.issueId).toBe('10001');
    expect(await timers.ler('conta-eu')).toBeNull();
    expect(storage.tamanho).toBe(0);
  });

  it('depois de descartar, dá para começar um timer novo', async () => {
    const { painel, tempo } = montarD5({
      aoGravar: () => ({ ok: false, motivo: 'item-nao-encontrado' }),
    });
    await painel.iniciarTimer(EU);
    // Passa do mínimo: abaixo de 1 minuto o timer é descartado sem tentar
    // gravar, e aí não há falha nenhuma para prender.
    tempo.avancar(600);

    // Item A sumiu: trocar falha e o timer fica preso.
    const travado = await painel.iniciarTimer(EU_OUTRO_ITEM);
    expect(travado).toMatchObject({ ok: false, motivo: 'item-nao-encontrado' });

    // A saída:
    await painel.descartarTimer(EU_OUTRO_ITEM);
    const novo = await painel.iniciarTimer(EU_OUTRO_ITEM);
    expect(novo.ok).toBe(true);
    expect(novo.timer.issueId).toBe('10002');
  });

  it('o timer preso guarda o motivo da falha, para a tela poder explicar', async () => {
    const { painel, tempo } = montarD5({
      aoGravar: () => ({ ok: false, motivo: 'item-nao-encontrado' }),
    });
    await painel.iniciarTimer(EU);
    tempo.avancar(600);
    await painel.iniciarTimer(EU_OUTRO_ITEM);

    const estado = await painel.estadoDoTimer(EU_OUTRO_ITEM);

    expect(estado.emOutroItem).toBe(true);
    expect(estado.timer.tentativas).toBe(1);
    expect(estado.timer.ultimaFalha).toBe('item-nao-encontrado');
  });
});

describe('D7: corrigir e apagar a partir da folha da semana', () => {
  /**
   * A folha é uma `globalPage`: não há item no contexto do Forge. O id do item
   * vem no payload — e isso **não afrouxa nada**, porque a identidade continua
   * vindo do contexto e a autoria é conferida no Jira antes de qualquer
   * escrita. Um id forjado só alcança worklogs de quem está pedindo.
   */
  function daSemana(accountId, payload) {
    return { context: { accountId }, payload };
  }

  it('edita uma entrada sem item no contexto', async () => {
    const { painel, worklogs } = montarD4();

    const r = await painel.editarApontamento(
      daSemana('conta-eu', {
        worklogId: '10501',
        issueId: '10001',
        issueKey: 'NL-1',
        duracao: '45m',
        iniciadoEm: '2026-08-26T10:00:00.000Z',
      })
    );

    expect(r).toMatchObject({ ok: true, editado: true });
    expect(worklogs.chamadas.find((c) => c.op === 'atualizar').alvo.segundos).toBe(2700);
  });

  it('apaga uma entrada sem item no contexto', async () => {
    const { painel, worklogs } = montarD4();

    const r = await painel.apagarApontamento(
      daSemana('conta-eu', { worklogId: '10501', issueId: '10001' })
    );

    expect(r).toMatchObject({ ok: true, apagado: true });
    expect(worklogs.chamadas.find((c) => c.op === 'apagar').alvo.issueId).toBe('10001');
  });

  it('**a guarda de autoria continua valendo** — id de item no payload não é passe livre', async () => {
    const { painel, worklogs } = montarD4({
      umPorId: () => ({ ok: true, worklog: WORKLOG_ALHEIO }),
    });

    const r = await painel.editarApontamento(
      daSemana('conta-eu', {
        worklogId: '10502',
        issueId: '10001',
        duracao: '99h',
        iniciadoEm: '2026-08-26T10:00:00.000Z',
      })
    );

    expect(r).toMatchObject({ ok: false, motivo: 'apontamento-de-outra-pessoa' });
    expect(worklogs.chamadas.find((c) => c.op === 'atualizar')).toBeUndefined();
  });

  it('sem item no contexto e sem item no payload, recusa', async () => {
    const { painel, worklogs } = montarD4();
    const r = await painel.apagarApontamento(daSemana('conta-eu', { worklogId: '10501' }));

    expect(r).toMatchObject({ ok: false, motivo: 'sem-item' });
    expect(worklogs.chamadas).toHaveLength(0);
  });

  it('o contexto ainda ganha do payload — o painel do item não muda de comportamento', async () => {
    const { painel, worklogs } = montarD4();

    // Payload tentando apontar para outro item, com o painel dentro do 10001.
    await painel.apagarApontamento({
      ...EU,
      payload: { worklogId: '10501', issueId: '99999' },
    });

    expect(worklogs.chamadas.find((c) => c.op === 'lerUm')).toBeDefined();
    expect(worklogs.chamadas.find((c) => c.op === 'apagar').alvo.issueId).toBe('10001');
  });

  it('a identidade nunca vem do payload, nem na folha', async () => {
    const { painel, worklogs } = montarD4();
    const r = await painel.editarApontamento({
      context: {},
      payload: { accountId: 'conta-eu', worklogId: '10501', issueId: '10001', duracao: '1h' },
    });

    expect(r).toMatchObject({ ok: false, motivo: 'sem-usuario' });
    expect(worklogs.chamadas).toHaveLength(0);
  });
});

/**
 * D15 — lançar a partir da tela da semana.
 *
 * A folha é uma `globalPage`: **não há item no contexto do Forge**, então o
 * item vem no payload. Estes testes seguram as duas metades da regra: o item
 * pode vir de fora, a **identidade nunca**.
 */
describe('apontarManual a partir da folha da semana', () => {
  /** O contexto de uma globalPage: pessoa identificada, nenhum item. */
  const NA_SEMANA = req('conta-eu', null);

  it('grava no item que veio no payload quando não há item no contexto', async () => {
    const { painel, worklogs } = montarD4();

    const r = await painel.apontarManual(
      comPayload(NA_SEMANA, {
        duracao: '45m',
        iniciadoEm: '2026-08-26T14:00:00.000Z',
        issueId: '10007',
        issueKey: 'NL-7',
      })
    );

    expect(r).toMatchObject({ ok: true, gravado: true, issueKey: 'NL-7' });
    expect(worklogs.gravados[0]).toMatchObject({ issueId: '10007', segundos: 2700 });
  });

  it('o item do contexto ganha do payload — no painel, o item é onde a pessoa está', async () => {
    // Um payload com outro item, aberto dentro de NL-1, grava em NL-1. Sem
    // isso, um payload malformado moveria silenciosamente a hora de item.
    const { painel, worklogs } = montarD4();

    await painel.apontarManual(
      comPayload(EU, {
        duracao: '10m',
        iniciadoEm: '2026-08-26T14:00:00.000Z',
        issueId: '99999',
      })
    );

    expect(worklogs.gravados[0].issueId).toBe('10001');
  });

  it('sem item em lugar nenhum, recusa em vez de inventar um', async () => {
    const { painel, worklogs } = montarD4();

    const r = await painel.apontarManual(
      comPayload(NA_SEMANA, { duracao: '1h', iniciadoEm: '2026-08-26T14:00:00.000Z' })
    );

    expect(r).toMatchObject({ ok: false, motivo: 'sem-item' });
    expect(worklogs.gravados).toHaveLength(0);
  });

  it('a identidade continua vindo do contexto, nunca do payload', async () => {
    // **É esta a linha que o `asUser()` protege.** Um payload que se diz outra
    // pessoa não grava hora no nome dela.
    const { painel, worklogs } = montarD4();

    const r = await painel.apontarManual({
      context: {},
      payload: {
        accountId: 'conta-eu',
        duracao: '1h',
        iniciadoEm: '2026-08-26T14:00:00.000Z',
        issueId: '10007',
      },
    });

    expect(r).toMatchObject({ ok: false, motivo: 'sem-usuario' });
    expect(worklogs.gravados).toHaveLength(0);
  });

  it('a validação do apontamento vale igual, venha o item de onde vier', async () => {
    const { painel, worklogs } = montarD4();

    const r = await painel.apontarManual(
      comPayload(NA_SEMANA, {
        duracao: '30h',
        iniciadoEm: '2026-08-26T14:00:00.000Z',
        issueId: '10007',
      })
    );

    expect(r.ok).toBe(false);
    expect(worklogs.gravados).toHaveLength(0);
  });

  it('lançar pela folha não toca no timer que está rodando', async () => {
    // Mesma regra do D4, agora pela segunda tela: lançar a sexta esquecida numa
    // segunda-feira não pode matar o cronômetro que está contando agora.
    const { painel, storage } = montarD4();
    await painel.iniciarTimer(EU);
    const antes = await storage.get(chaveDoTimer('conta-eu'));

    await painel.apontarManual(
      comPayload(NA_SEMANA, {
        duracao: '1h',
        iniciadoEm: '2026-08-26T14:00:00.000Z',
        issueId: '10007',
      })
    );

    expect(await storage.get(chaveDoTimer('conta-eu'))).toEqual(antes);
  });
});
