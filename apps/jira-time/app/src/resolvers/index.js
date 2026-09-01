/**
 * Nativelog — registro dos resolvers do painel do item.
 *
 * Arquivo de fiação, de propósito: a regra do timer está em `src/lib/timer.js`,
 * a escrita do worklog em `src/lib/worklog.js` e as operações do painel em
 * `./painel.js` — todos testados sem Forge. Aqui só se liga o que é do Forge.
 */

import api, { assumeTrustedRoute } from '@forge/api';
import Resolver from '@forge/resolver';
import { kvs } from '@forge/kvs';
import { criarTimers } from '../lib/timer.js';
import { criarWorklogs } from '../lib/worklog.js';
import { criarPermissoes } from '../lib/permissoes.js';
import { criarSemana } from '../lib/semana.js';
import { criarItens } from '../lib/itens.js';
import { criarPainel } from './painel.js';
import { criarVisaoSemana } from './semana.js';

/**
 * **`asUser()` é o produto inteiro.**
 *
 * É isto que faz o worklog nascer com a identidade da pessoa em vez da do app
 * — a diferença entre `worklogAuthor = currentUser()` achar as horas e devolver
 * vazio. Provado na instância real em 26/08/2026; ver `DECISOES.md`.
 *
 * `assumeTrustedRoute` porque o caminho é montado em `worklog.js`, com o id do
 * item vindo do contexto do Forge e escapado lá.
 */
const pedir = (caminho, opcoes) =>
  api.asUser().requestJira(assumeTrustedRoute(caminho), opcoes);

// `kvs` expõe get/set/delete — a mesma interface que `criarTimers` espera.
const painel = criarPainel({
  timers: criarTimers({ storage: kvs }),
  worklogs: criarWorklogs({ pedir }),
  // Também `asUser`: a pergunta é o que **a pessoa** pode fazer neste item.
  // Com `asApp` a resposta seria sobre o app, que não é a pergunta.
  permissoes: criarPermissoes({ pedir }),
});

// A página "Minha semana" (D6). Mesmo resolver, outra pergunta: o painel é
// sobre um item, a semana é sobre uma pessoa.
const visaoSemana = criarVisaoSemana({
  semana: criarSemana({ pedir }),
  // D15 — o seletor de item da tela da semana. Também `asUser`: os itens
  // recentes são os **desta pessoa**, e a busca enxerga o que ela enxerga.
  itens: criarItens({ pedir }),
});

const resolver = new Resolver();
for (const [nome, fn] of Object.entries({ ...painel, ...visaoSemana })) {
  resolver.define(nome, fn);
}

export const handler = resolver.getDefinitions();
