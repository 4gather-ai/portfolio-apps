import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  INTERVALO_SINCRONIA_MS,
  avisoDeMudanca,
  estadoOtimista,
  intervaloDeSincronia,
  ligarSincronia,
  segundosDesde,
} from './estado.js';

/**
 * Os dois defeitos que o teste manual de 26/08/2026 achou moram aqui:
 * a tela que continuava dizendo "Running" depois de o timer ter sido encerrado
 * em outra aba, e o relógio que só começava a andar 20 s depois do clique.
 */

const ITEM = { issueId: '10001', issueKey: 'NL-1' };

/** Janela e documento de mentira: guardam os ouvintes para o teste disparar. */
function ambienteFalso(visibilityState = 'visible') {
  const criar = (extra = {}) => {
    const ouvintes = new Map();
    return {
      ...extra,
      ouvintes,
      addEventListener: (evento, fn) => {
        if (!ouvintes.has(evento)) ouvintes.set(evento, new Set());
        ouvintes.get(evento).add(fn);
      },
      removeEventListener: (evento, fn) => {
        ouvintes.get(evento)?.delete(fn);
      },
      disparar: (evento) => {
        for (const fn of ouvintes.get(evento) || []) fn();
      },
      quantos: (evento) => ouvintes.get(evento)?.size || 0,
    };
  };
  const documento = criar({ visibilityState });
  return { janela: criar(), documento };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('segundosDesde', () => {
  it('conta a partir do início', () => {
    const inicio = '2026-08-27T09:00:00.000Z';
    expect(segundosDesde(inicio, Date.parse('2026-08-27T09:02:30.000Z'))).toBe(150);
  });

  it('início ilegível não vira relógio maluco', () => {
    expect(segundosDesde('nada disso', Date.now())).toBe(0);
  });

  it('relógio da máquina para trás não vira número negativo', () => {
    const inicio = '2026-08-27T09:00:00.000Z';
    expect(segundosDesde(inicio, Date.parse('2026-08-27T08:59:00.000Z'))).toBe(0);
  });
});

describe('intervaloDeSincronia', () => {
  it('timer rodando neste item: reconsulta periódica — é o estado que mente caro', () => {
    expect(intervaloDeSincronia({ timer: { startedAt: 'x' }, emOutroItem: false })).toBe(
      INTERVALO_SINCRONIA_MS
    );
  });

  it('sem timer: não gasta invocação do Forge', () => {
    expect(intervaloDeSincronia({ timer: null, emOutroItem: false })).toBe(0);
  });

  it('timer em outro item: o aviso desatualizado é barato, o próximo clique corrige', () => {
    expect(intervaloDeSincronia({ timer: { startedAt: 'x' }, emOutroItem: true })).toBe(0);
  });

  it('estado ainda não carregado: nada a reconsultar', () => {
    expect(intervaloDeSincronia(null)).toBe(0);
  });
});

describe('estadoOtimista', () => {
  it('o relógio existe no instante do clique, sem esperar o servidor', () => {
    const iniciadoEm = '2026-08-27T09:00:00.000Z';
    const otimista = estadoOtimista({ item: ITEM, timer: null, emOutroItem: false }, iniciadoEm);

    expect(otimista.timer.startedAt).toBe(iniciadoEm);
    expect(otimista.timer.issueKey).toBe('NL-1');
    expect(otimista.emOutroItem).toBe(false);
    expect(otimista.otimista).toBe(true);
    // É isto que o painel usa para decidir mostrar o relógio.
    expect(Boolean(otimista.timer) && !otimista.emOutroItem).toBe(true);
  });

  it('trocar de item: o relógio passa a ser deste item na hora', () => {
    const antes = {
      item: ITEM,
      timer: { issueId: '10002', issueKey: 'NL-2', startedAt: '2026-08-27T08:00:00.000Z' },
      emOutroItem: true,
    };
    const otimista = estadoOtimista(antes, '2026-08-27T09:00:00.000Z');

    expect(otimista.emOutroItem).toBe(false);
    expect(otimista.timer.issueId).toBe('10001');
    expect(otimista.timer.startedAt).toBe('2026-08-27T09:00:00.000Z');
  });

  it('não herda a falha do timer anterior: o relógio novo nasce limpo', () => {
    const antes = {
      item: ITEM,
      timer: { issueId: '10002', tentativas: 3, ultimaFalha: 'rede', suspeito: true },
      emOutroItem: true,
    };
    const otimista = estadoOtimista(antes, '2026-08-27T09:00:00.000Z');

    expect(otimista.timer.tentativas).toBe(0);
    expect(otimista.timer.ultimaFalha).toBeNull();
    expect(otimista.timer.suspeito).toBe(false);
  });

  it('clique antes de o estado chegar não quebra a tela', () => {
    const otimista = estadoOtimista(null, '2026-08-27T09:00:00.000Z');
    expect(otimista.timer.startedAt).toBe('2026-08-27T09:00:00.000Z');
    expect(otimista.timer.issueKey).toBeNull();
  });
});

describe('avisoDeMudanca', () => {
  const rodando = { timer: { startedAt: 'x' }, emOutroItem: false };

  it('o timer sumiu enquanto a aba estava parada: a pessoa é avisada', () => {
    const aviso = avisoDeMudanca(rodando, { timer: null, emOutroItem: false });
    expect(aviso?.tipo).toBe('information');
    // Chave e padrão, não a frase pronta — quem traduz é a tela.
    expect(aviso.chave).toBe('painel.mudouPorFora');
    expect(aviso.padrao).toMatch(/no longer running here/);
  });

  it('o timer foi para outro item: o relógio some daqui e a tela explica', () => {
    const aviso = avisoDeMudanca(rodando, { timer: { startedAt: 'y' }, emOutroItem: true });
    expect(aviso).not.toBeNull();
  });

  it('nada mudou: nenhuma frase nova na tela', () => {
    expect(avisoDeMudanca(rodando, rodando)).toBeNull();
  });

  it('não estava rodando aqui: silêncio', () => {
    expect(avisoDeMudanca({ timer: null }, { timer: null })).toBeNull();
    expect(avisoDeMudanca(null, { timer: null })).toBeNull();
  });

  it('o timer apareceu (iniciado em outra aba): não é perda, não avisa', () => {
    expect(avisoDeMudanca({ timer: null, emOutroItem: false }, rodando)).toBeNull();
  });
});

describe('ligarSincronia', () => {
  it('voltar o foco à aba reconsulta o servidor', () => {
    const { janela, documento } = ambienteFalso();
    const aoSincronizar = vi.fn();
    ligarSincronia({ aoSincronizar, janela, documento });

    janela.disparar('focus');
    expect(aoSincronizar).toHaveBeenCalledTimes(1);

    documento.disparar('visibilitychange');
    expect(aoSincronizar).toHaveBeenCalledTimes(2);
  });

  it('esconder a aba não gasta chamada: não há tela para corrigir', () => {
    const { janela, documento } = ambienteFalso('hidden');
    const aoSincronizar = vi.fn();
    ligarSincronia({ aoSincronizar, janela, documento });

    documento.disparar('visibilitychange');
    expect(aoSincronizar).not.toHaveBeenCalled();
  });

  it('duas janelas visíveis lado a lado: só o intervalo salva', () => {
    vi.useFakeTimers();
    const aoSincronizar = vi.fn();
    ligarSincronia({ aoSincronizar, intervaloMs: 30000 });

    vi.advanceTimersByTime(90000);
    expect(aoSincronizar).toHaveBeenCalledTimes(3);
  });

  it('intervalo zero: nenhuma reconsulta periódica', () => {
    vi.useFakeTimers();
    const aoSincronizar = vi.fn();
    ligarSincronia({ aoSincronizar, intervaloMs: 0 });

    vi.advanceTimersByTime(300000);
    expect(aoSincronizar).not.toHaveBeenCalled();
  });

  it('operação em andamento bloqueia os três gatilhos', () => {
    vi.useFakeTimers();
    const { janela, documento } = ambienteFalso();
    const aoSincronizar = vi.fn();
    let ocupado = true;
    ligarSincronia({
      aoSincronizar,
      permitido: () => !ocupado,
      intervaloMs: 30000,
      janela,
      documento,
    });

    janela.disparar('focus');
    documento.disparar('visibilitychange');
    vi.advanceTimersByTime(60000);
    expect(aoSincronizar).not.toHaveBeenCalled();

    // Terminou a operação: o próximo gatilho passa.
    ocupado = false;
    janela.disparar('focus');
    expect(aoSincronizar).toHaveBeenCalledTimes(1);
  });

  it('desligar remove tudo — painel fechado não fica consultando para sempre', () => {
    vi.useFakeTimers();
    const { janela, documento } = ambienteFalso();
    const aoSincronizar = vi.fn();
    const desligar = ligarSincronia({ aoSincronizar, intervaloMs: 30000, janela, documento });

    desligar();

    expect(janela.quantos('focus')).toBe(0);
    expect(documento.quantos('visibilitychange')).toBe(0);
    janela.disparar('focus');
    vi.advanceTimersByTime(120000);
    expect(aoSincronizar).not.toHaveBeenCalled();
  });

  it('sandbox sem janela nem documento: o intervalo sozinho tem que funcionar', () => {
    vi.useFakeTimers();
    const aoSincronizar = vi.fn();
    const desligar = ligarSincronia({
      aoSincronizar,
      intervaloMs: 30000,
      janela: null,
      documento: undefined,
    });

    vi.advanceTimersByTime(30000);
    expect(aoSincronizar).toHaveBeenCalledTimes(1);
    expect(() => desligar()).not.toThrow();
  });
});
