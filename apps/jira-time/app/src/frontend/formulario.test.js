import { describe, it, expect } from 'vitest';
import {
  deInstante,
  formularioDe,
  formularioVazio,
  formularioNoDia,
  paraDataLocal,
  paraEnvio,
  paraHoraLocal,
  paraInstante,
} from './formulario.js';

/**
 * **O ponto do app onde erro de fuso vira hora lançada no dia errado.**
 *
 * Os testes são escritos para valer em qualquer fuso — asseveram o horário
 * *local* que volta, nunca uma string UTC fixa. Um teste que só passa em UTC
 * daria exatamente a falsa segurança que este arquivo existe para evitar.
 */

describe('paraInstante', () => {
  it('14:30 significa 14:30 para quem digitou, não 14:30 UTC', () => {
    const iso = paraInstante('2026-08-26', '14:30');
    const d = new Date(iso);
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(7); // agosto
    expect(d.getDate()).toBe(26);
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(30);
  });

  it('hora vazia vale meia-noite — quem lança um dia inteiro não inventa horário', () => {
    const d = new Date(paraInstante('2026-08-26', ''));
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    expect(d.getDate()).toBe(26);
    expect(paraInstante('2026-08-26', null)).toBe(paraInstante('2026-08-26', '00:00'));
  });

  it('aceita hora com um dígito', () => {
    expect(new Date(paraInstante('2026-08-26', '9:05')).getHours()).toBe(9);
  });

  it('recusa data ausente ou fora do formato em vez de inventar um dia', () => {
    for (const data of ['', '26/08/2026', '2026-8-26', 'hoje', null, undefined, 20260826]) {
      expect(paraInstante(data, '10:00')).toBeNull();
    }
  });

  it('recusa hora impossível', () => {
    expect(paraInstante('2026-08-26', '25:00')).toBeNull();
    expect(paraInstante('2026-08-26', '10:75')).toBeNull();
    expect(paraInstante('2026-08-26', '10h')).toBeNull();
  });

  it('recusa dia que não existe — o construtor de Date "conserta" em silêncio', () => {
    // Sem a conferência, 31/02 viraria 03/03 e a hora iria para o dia errado.
    expect(paraInstante('2026-02-31', '10:00')).toBeNull();
    expect(paraInstante('2026-04-31', '10:00')).toBeNull();
  });

  it('29 de fevereiro existe em ano bissexto e não em ano comum', () => {
    expect(paraInstante('2028-02-29', '10:00')).not.toBeNull();
    expect(paraInstante('2026-02-29', '10:00')).toBeNull();
  });
});

describe('deInstante', () => {
  it('é o caminho de volta de paraInstante — ida e volta não perde o horário', () => {
    const iso = paraInstante('2026-08-26', '14:30');
    expect(deInstante(iso)).toEqual({ data: '2026-08-26', hora: '14:30' });
  });

  it('preenche com dois dígitos, que é o que os campos esperam', () => {
    const iso = paraInstante('2026-01-05', '09:07');
    expect(deInstante(iso)).toEqual({ data: '2026-01-05', hora: '09:07' });
  });

  it('data ilegível devolve null em vez de um formulário com lixo', () => {
    expect(deInstante('nada disso')).toBeNull();
    expect(deInstante(undefined)).toBeNull();
  });
});

describe('formularioVazio', () => {
  it('já vem apontando para agora: o caso comum é "esqueci de ligar o cronômetro"', () => {
    const agora = new Date(2026, 7, 26, 16, 45);
    expect(formularioVazio(agora)).toEqual({
      id: null,
      duracao: '',
      data: '2026-08-26',
      hora: '16:45',
      comentario: '',
    });
  });

  it('sem id: é criação, não edição', () => {
    expect(formularioVazio().id).toBeNull();
  });
});

describe('formularioDe', () => {
  const apontamento = {
    id: '10100',
    started: paraInstante('2026-08-20', '08:15'),
    duracao: '2h 30m',
    comentario: 'revisão do PR',
  };

  it('traz tudo de volta, inclusive a descrição', () => {
    expect(formularioDe(apontamento)).toEqual({
      id: '10100',
      duracao: '2h 30m',
      data: '2026-08-20',
      hora: '08:15',
      comentario: 'revisão do PR',
    });
  });

  it('editar a duração não pode apagar a descrição', () => {
    const f = formularioDe(apontamento);
    expect(f.comentario).toBe('revisão do PR');
  });

  it('apontamento sem descrição vira campo vazio, não "undefined" na tela', () => {
    const f = formularioDe({ ...apontamento, comentario: undefined });
    expect(f.comentario).toBe('');
  });

  it('data estragada cai para agora em vez de deixar o campo inválido', () => {
    const agora = new Date(2026, 7, 26, 16, 45);
    const f = formularioDe({ id: '1', started: 'lixo', duracao: '1h' }, agora);
    expect(f.data).toBe('2026-08-26');
    expect(f.hora).toBe('16:45');
  });
});

describe('paraEnvio', () => {
  it('monta o payload da criação', () => {
    const envio = paraEnvio({
      id: null,
      duracao: '1h',
      data: '2026-08-26',
      hora: '10:00',
      comentario: 'x',
    });
    expect(envio.ok).toBe(true);
    expect(envio.payload.worklogId).toBeUndefined();
    expect(envio.payload.duracao).toBe('1h');
    expect(new Date(envio.payload.iniciadoEm).getHours()).toBe(10);
  });

  it('com id, é edição: o worklogId vai junto', () => {
    const envio = paraEnvio({ id: '10100', duracao: '1h', data: '2026-08-26', hora: '10:00' });
    expect(envio.payload.worklogId).toBe('10100');
  });

  it('data inválida não chega ao servidor', () => {
    expect(paraEnvio({ duracao: '1h', data: '', hora: '10:00' })).toEqual({
      ok: false,
      motivo: 'inicio-invalido',
    });
  });

  it('não valida a duração — essa regra é do servidor, e não é duplicada aqui', () => {
    // Regra duplicada é regra que sai de sincronia. O servidor recusa.
    const envio = paraEnvio({ duracao: 'banana', data: '2026-08-26', hora: '10:00' });
    expect(envio.ok).toBe(true);
    expect(envio.payload.duracao).toBe('banana');
  });
});

describe('paraDataLocal e paraHoraLocal', () => {
  it('sempre com dois dígitos', () => {
    const d = new Date(2026, 0, 3, 7, 4);
    expect(paraDataLocal(d)).toBe('2026-01-03');
    expect(paraHoraLocal(d)).toBe('07:04');
  });
});

/**
 * D15 — o formulário que abre na coluna de um dia.
 *
 * O que estes testes seguram é o que faz o clique na coluna valer alguma coisa:
 * **a data é a do dia clicado, a hora é a de agora.** Se a data também viesse
 * de "agora", clicar na quarta e clicar no botão do topo dariam o mesmo
 * formulário — e a coluna seria enfeite.
 */
describe('formularioNoDia', () => {
  const agora = new Date(2026, 7, 28, 15, 30);

  it('usa o dia pedido e mantém a hora de agora', () => {
    expect(formularioNoDia('2026-08-26', agora)).toEqual({
      id: null,
      duracao: '',
      data: '2026-08-26',
      hora: '15:30',
      comentario: '',
    });
  });

  it('ignora espaço em volta da data', () => {
    expect(formularioNoDia(' 2026-08-26 ', agora).data).toBe('2026-08-26');
  });

  it('data ilegível cai para hoje em vez de montar um formulário quebrado', () => {
    // O campo é editável e a pessoa vê o que vai gravar antes de gravar; um
    // DatePicker com lixo dentro é pior que um com a data de hoje.
    expect(formularioNoDia('ontem', agora).data).toBe('2026-08-28');
    expect(formularioNoDia(undefined, agora).data).toBe('2026-08-28');
    expect(formularioNoDia('2026-8-6', agora).data).toBe('2026-08-28');
  });
});
