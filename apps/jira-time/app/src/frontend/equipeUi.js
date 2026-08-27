/**
 * Nativelog — a folha do time, agrupada para leitura.
 *
 * Mora fora do `.jsx` pelo mesmo motivo dos outros módulos de tela: **é aqui
 * que o fuso existe**. Agrupar por pessoa e por dia é aritmética de calendário,
 * e calendário erra em silêncio.
 *
 * **Somente leitura, e o formato reforça isso:** o que sai daqui são totais por
 * pessoa e por dia, não lançamentos editáveis. Corrigir hora alheia é pela tela
 * do Jira — ver `resolvers/semana.js`.
 */

import { chaveDoDia } from '../lib/time.js';

/**
 * Uma linha por pessoa, com o total de cada dia e o da semana.
 *
 * Ordena por total decrescente: quem coordena abre esta tela para achar quem
 * está fora do esperado, nos dois sentidos, e o alfabético esconde isso.
 */
export function porPessoa(entradas = [], dias = [], nomeDesconhecido = 'Unknown user') {
  const chavesDosDias = dias.map((d) => chaveDoDia(d.data));
  const pessoas = new Map();

  for (const e of entradas) {
    const id = e.autorId || 'desconhecido';
    if (!pessoas.has(id)) {
      pessoas.set(id, {
        id,
        // Sem nome, mostrar o id seria pior que dizer que não se sabe.
        nome: e.autorNome || nomeDesconhecido,
        porDia: {},
        total: 0,
      });
    }
    const pessoa = pessoas.get(id);
    const chave = chaveDoDia(e.started);
    pessoa.porDia[chave] = (pessoa.porDia[chave] || 0) + (e.segundos || 0);
    pessoa.total += e.segundos || 0;
  }

  return [...pessoas.values()]
    .map((p) => ({ ...p, dias: chavesDosDias.map((c) => p.porDia[c] || 0) }))
    .sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome));
}

/** O total do time na semana. */
export function totalDoTime(linhas = []) {
  return linhas.reduce((soma, l) => soma + l.total, 0);
}
