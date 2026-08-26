import { describe, it, expect } from 'vitest';
import { criarTimers, chaveDoTimer, storageDeMemoria } from './timer.js';

/** Relógio controlado: os testes decidem que horas são. */
function relogio(iso) {
  let atual = new Date(iso);
  return {
    agora: () => new Date(atual),
    avancar(segundos) {
      atual = new Date(atual.getTime() + segundos * 1000);
    },
  };
}

function montar(iso = '2026-08-27T09:00:00.000Z') {
  const storage = storageDeMemoria();
  const tempo = relogio(iso);
  return { storage, tempo, timers: criarTimers({ storage, agora: tempo.agora }) };
}

const EU = 'conta-eu';
const OUTRA = 'conta-outra';

describe('chaveDoTimer', () => {
  it('é uma chave por pessoa — é ela que garante um timer por pessoa', () => {
    expect(chaveDoTimer(EU)).toBe('timer:conta-eu');
    expect(chaveDoTimer(EU)).not.toBe(chaveDoTimer(OUTRA));
  });

  it('recusa accountId ausente em vez de gravar numa chave global', () => {
    expect(() => chaveDoTimer('')).toThrow(TypeError);
    expect(() => chaveDoTimer(undefined)).toThrow(TypeError);
  });
});

describe('ler', () => {
  it('sem timer devolve null — ausência não é erro', async () => {
    const { timers } = montar();
    expect(await timers.ler(EU)).toBeNull();
  });

  it('devolve o timer com o tempo já decorrido', async () => {
    const { timers, tempo } = montar();
    await timers.iniciar(EU, { issueId: '10001', issueKey: 'NL-1' });
    tempo.avancar(3600);
    const timer = await timers.ler(EU);
    expect(timer.issueKey).toBe('NL-1');
    expect(timer.segundos).toBe(3600);
    expect(timer.suspeito).toBe(false);
  });

  it('marca como suspeito o timer esquecido — não grava 14h calado', async () => {
    const { timers, tempo } = montar();
    await timers.iniciar(EU, { issueId: '10001' });
    tempo.avancar(14 * 3600);
    expect((await timers.ler(EU)).suspeito).toBe(true);
  });

  it('não explode com registro corrompido no KVS', async () => {
    const { storage, timers } = montar();
    await storage.set(chaveDoTimer(EU), { issueId: '10001', startedAt: 'lixo' });
    expect((await timers.ler(EU)).invalido).toBe(true);
  });
});

describe('iniciar', () => {
  it('grava o timer sob a chave da pessoa', async () => {
    const { storage, timers } = montar();
    const { timer, anterior } = await timers.iniciar(EU, { issueId: '10001', issueKey: 'NL-1' });
    expect(anterior).toBeNull();
    expect(timer.startedAt).toBe('2026-08-27T09:00:00.000Z');
    expect(await storage.get(chaveDoTimer(EU))).toMatchObject({ issueId: '10001' });
  });

  it('exige o item — timer sem item não vira worklog nenhum', async () => {
    const { timers } = montar();
    await expect(timers.iniciar(EU, {})).rejects.toThrow(TypeError);
  });

  it('UM TIMER POR PESSOA: iniciar em outro item encerra o anterior e o devolve', async () => {
    const { storage, timers, tempo } = montar();
    await timers.iniciar(EU, { issueId: '10001', issueKey: 'NL-1' });
    tempo.avancar(2 * 3600);

    const { timer, anterior } = await timers.iniciar(EU, { issueId: '10002', issueKey: 'NL-2' });

    // O anterior sai fechado, com o tempo dele, para virar worklog.
    expect(anterior.issueKey).toBe('NL-1');
    expect(anterior.segundos).toBe(7200);
    // E sobra exatamente um timer em andamento, o novo.
    expect(timer.issueKey).toBe('NL-2');
    expect(timer.segundos).toBe(0);
    expect(storage.tamanho).toBe(1);
    expect(await storage.get(chaveDoTimer(EU))).toMatchObject({ issueId: '10002' });
  });

  it('iniciar de novo no mesmo item é no-op — dois cliques não viram 2 segundos', async () => {
    const { timers, tempo } = montar();
    await timers.iniciar(EU, { issueId: '10001', issueKey: 'NL-1' });
    tempo.avancar(30);

    const r = await timers.iniciar(EU, { issueId: '10001', issueKey: 'NL-1' });

    expect(r.jaEstavaRodando).toBe(true);
    expect(r.anterior).toBeNull();
    expect(r.timer.startedAt).toBe('2026-08-27T09:00:00.000Z'); // não reiniciou
    expect(r.timer.segundos).toBe(30);
  });

  it('compara item por valor: 10001 e "10001" são o mesmo item', async () => {
    const { timers } = montar();
    await timers.iniciar(EU, { issueId: 10001 });
    const r = await timers.iniciar(EU, { issueId: '10001' });
    expect(r.jaEstavaRodando).toBe(true);
  });

  it('descarta o anterior corrompido em vez de virar hora inventada', async () => {
    const { storage, timers } = montar();
    await storage.set(chaveDoTimer(EU), { issueId: '10001', startedAt: 'lixo' });
    const { anterior } = await timers.iniciar(EU, { issueId: '10002' });
    expect(anterior).toBeNull();
  });

  it('os timers de duas pessoas não se atrapalham', async () => {
    const { storage, timers } = montar();
    await timers.iniciar(EU, { issueId: '10001' });
    await timers.iniciar(OUTRA, { issueId: '10002' });
    expect(storage.tamanho).toBe(2);
    expect((await timers.ler(EU)).issueId).toBe('10001');
    expect((await timers.ler(OUTRA)).issueId).toBe('10002');
  });
});

describe('parar', () => {
  it('devolve o que precisa virar worklog e limpa o KVS', async () => {
    const { storage, timers, tempo } = montar();
    await timers.iniciar(EU, { issueId: '10001', issueKey: 'NL-1' });
    tempo.avancar(3 * 3600);

    const encerrado = await timers.parar(EU);

    expect(encerrado).toMatchObject({ issueId: '10001', issueKey: 'NL-1', segundos: 10800 });
    expect(encerrado.startedAt).toBe('2026-08-27T09:00:00.000Z');
    // Nada de hora apontada sobrando no KVS: se está apontado, é worklog.
    expect(storage.tamanho).toBe(0);
  });

  it('parar sem timer devolve null — parar duas vezes não é erro', async () => {
    const { timers } = montar();
    expect(await timers.parar(EU)).toBeNull();
    await timers.iniciar(EU, { issueId: '10001' });
    await timers.parar(EU);
    expect(await timers.parar(EU)).toBeNull();
  });

  it('para só o timer de quem pediu', async () => {
    const { timers } = montar();
    await timers.iniciar(EU, { issueId: '10001' });
    await timers.iniciar(OUTRA, { issueId: '10002' });
    await timers.parar(EU);
    expect(await timers.ler(EU)).toBeNull();
    expect(await timers.ler(OUTRA)).not.toBeNull();
  });

  it('entrega o timer suspeito marcado, em vez de escondê-lo', async () => {
    const { timers, tempo } = montar();
    await timers.iniciar(EU, { issueId: '10001' });
    tempo.avancar(20 * 3600);
    expect((await timers.parar(EU)).suspeito).toBe(true);
  });
});

describe('marcarEmCurso', () => {
  it('marca o timer antes da gravação começar', async () => {
    const { storage, timers } = montar();
    await timers.iniciar(EU, { issueId: '10001' });

    await timers.marcarEmCurso(EU);

    expect(await storage.get(chaveDoTimer(EU))).toMatchObject({ podeTerGravado: true });
  });

  it('não mexe em nada se já estava marcado — evita escrita à toa no KVS', async () => {
    const { storage, timers } = montar();
    await timers.iniciar(EU, { issueId: '10001' });
    await timers.marcarEmCurso(EU);

    let escritas = 0;
    const set = storage.set;
    storage.set = async (...args) => {
      escritas += 1;
      return set(...args);
    };
    await timers.marcarEmCurso(EU);

    expect(escritas).toBe(0);
  });

  it('sem timer não cria registro nenhum', async () => {
    const { storage, timers } = montar();
    expect(await timers.marcarEmCurso(EU)).toBeNull();
    expect(storage.tamanho).toBe(0);
  });

  it('preserva o início — a marca não pode mexer na hora', async () => {
    const { timers, tempo } = montar();
    await timers.iniciar(EU, { issueId: '10001' });
    tempo.avancar(3600);

    await timers.marcarEmCurso(EU);

    const timer = await timers.ler(EU);
    expect(timer.startedAt).toBe('2026-08-27T09:00:00.000Z');
    expect(timer.segundos).toBe(3600);
  });
});

describe('descartar', () => {
  it('limpa sem devolver nada para apontar', async () => {
    const { storage, timers, tempo } = montar();
    await timers.iniciar(EU, { issueId: '10001' });
    tempo.avancar(20 * 3600);

    const descartado = await timers.descartar(EU);

    expect(descartado.segundos).toBe(72000);
    expect(storage.tamanho).toBe(0);
    expect(await timers.ler(EU)).toBeNull();
  });

  it('descartar sem timer não quebra', async () => {
    const { timers } = montar();
    expect(await timers.descartar(EU)).toBeNull();
  });

  it('limpa registro corrompido — é a saída para o KVS sujo', async () => {
    const { storage, timers } = montar();
    await storage.set(chaveDoTimer(EU), { issueId: '10001', startedAt: 'lixo' });
    await timers.descartar(EU);
    expect(storage.tamanho).toBe(0);
  });
});

/**
 * O instante do clique vem do navegador porque o cold start do Forge chega a
 * 20 s, e sem isso esses segundos sumiriam do apontamento de todo mundo.
 * Vem do navegador, então é validado — nunca usado cru.
 */
describe('iniciar com o instante do clique', () => {
  it('adota o clique quando ele é recente — o cold start não come os segundos', async () => {
    const { timers, tempo, storage } = montar('2026-08-27T09:00:20.000Z');

    const { timer } = await timers.iniciar(EU, { issueId: '10001' }, '2026-08-27T09:00:00.000Z');

    expect(timer.startedAt).toBe('2026-08-27T09:00:00.000Z');
    // E é isso que fica no KVS: o Stop grava a duração contada do clique.
    const guardado = await storage.get(chaveDoTimer(EU));
    expect(guardado.startedAt).toBe('2026-08-27T09:00:00.000Z');

    tempo.avancar(100);
    expect((await timers.ler(EU)).segundos).toBe(120);
  });

  it('sem proposta segue como antes: relógio do servidor', async () => {
    const { timers } = montar('2026-08-27T09:00:20.000Z');
    const { timer } = await timers.iniciar(EU, { issueId: '10001' });
    expect(timer.startedAt).toBe('2026-08-27T09:00:20.000Z');
  });

  it('proposta absurda é ignorada — hora inventada não entra no Jira de ninguém', async () => {
    const { timers } = montar('2026-08-27T09:00:20.000Z');

    const antiga = await timers.iniciar(EU, { issueId: '10001' }, '2026-08-20T09:00:00.000Z');
    expect(antiga.timer.startedAt).toBe('2026-08-27T09:00:20.000Z');

    await timers.descartar(EU);
    const futura = await timers.iniciar(EU, { issueId: '10001' }, '2026-08-27T18:00:00.000Z');
    expect(futura.timer.startedAt).toBe('2026-08-27T09:00:20.000Z');
  });

  it('o timer que já rodava neste item não é remarcado pelo clique', async () => {
    const { timers, tempo } = montar('2026-08-27T09:00:00.000Z');
    await timers.iniciar(EU, { issueId: '10001' });
    tempo.avancar(600);

    const r = await timers.iniciar(EU, { issueId: '10001' }, '2026-08-27T09:09:50.000Z');

    expect(r.jaEstavaRodando).toBe(true);
    expect(r.timer.startedAt).toBe('2026-08-27T09:00:00.000Z');
    expect(r.timer.segundos).toBe(600);
  });
});
