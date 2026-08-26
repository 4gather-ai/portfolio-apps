/**
 * Nativelog — registro dos resolvers do painel do item.
 *
 * Arquivo de fiação, de propósito: a regra do timer está em `src/lib/timer.js`
 * e as operações do painel em `./painel.js`, ambos testados sem Forge.
 * Aqui só se liga o KVS de verdade.
 */

import Resolver from '@forge/resolver';
import { kvs } from '@forge/kvs';
import { criarTimers } from '../lib/timer.js';
import { criarPainel } from './painel.js';

// `kvs` expõe get/set/delete — a mesma interface que `criarTimers` espera.
const painel = criarPainel({ timers: criarTimers({ storage: kvs }) });

const resolver = new Resolver();
for (const [nome, fn] of Object.entries(painel)) {
  resolver.define(nome, fn);
}

export const handler = resolver.getDefinitions();
