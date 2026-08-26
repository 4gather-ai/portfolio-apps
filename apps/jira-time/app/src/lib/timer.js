/**
 * Nativelog — máquina de estados do timer.
 *
 * Um timer em andamento não é um worklog ainda: é a única coisa que o Jira não
 * tem onde guardar, e por isso é a única coisa que mora no KVS do Forge
 * (`PLANO-V1.md`, seção 4). Quando o timer para, ele vira worklog nativo e o
 * registro do KVS some. Nada de hora apontada fica aqui.
 *
 * `storage` é injetado de propósito: em produção é o `storage` do `@forge/api`,
 * nos testes é um Map. Assim a regra "um timer por pessoa" é testada de
 * verdade, sem mock do Forge.
 */

import { duracaoDoTimer } from './time.js';

/** Uma chave por pessoa. É ela que garante um timer por pessoa. */
export function chaveDoTimer(accountId) {
  if (typeof accountId !== 'string' || !accountId.trim()) {
    throw new TypeError('chaveDoTimer exige um accountId');
  }
  return `timer:${accountId}`;
}

/**
 * Monta as operações do timer sobre um armazenamento chave-valor.
 *
 * @param storage objeto com get/set/delete — `storage` do @forge/api ou um Map de teste
 * @param agora   função que devolve o instante atual; injetada para os testes
 */
export function criarTimers({ storage, agora = () => new Date() }) {
  if (!storage || typeof storage.get !== 'function') {
    throw new TypeError('criarTimers exige um storage com get/set/delete');
  }

  /**
   * Lê o timer em andamento e já calcula quanto tempo passou.
   * Devolve null quando não há timer — ausência não é erro.
   */
  async function ler(accountId) {
    const registro = await storage.get(chaveDoTimer(accountId));
    if (!registro || !registro.startedAt) return null;
    return { ...registro, ...duracaoDoTimer(registro.startedAt, agora()) };
  }

  /**
   * Inicia um timer no item indicado.
   *
   * Regra dura do plano: **um timer por pessoa**. Se já existe um em andamento
   * em outro item, ele é encerrado aqui e devolvido em `anterior` — quem chama
   * grava o worklog dele. Sem isso sobrariam timers órfãos, que é justamente a
   * reclamação que catalogamos nos concorrentes.
   *
   * Iniciar de novo no mesmo item é no-op: dois cliques não viram um worklog
   * de dois segundos.
   */
  async function iniciar(accountId, { issueId, issueKey }) {
    if (!issueId) throw new TypeError('iniciar exige o issueId');

    const emAndamento = await ler(accountId);
    if (emAndamento && String(emAndamento.issueId) === String(issueId)) {
      return { timer: emAndamento, anterior: null, jaEstavaRodando: true };
    }

    // Timer com startedAt corrompido não vira worklog: seria hora inventada.
    const anterior = emAndamento && !emAndamento.invalido ? emAndamento : null;

    const timer = {
      issueId: String(issueId),
      issueKey: issueKey || null,
      startedAt: agora().toISOString(),
    };
    await storage.set(chaveDoTimer(accountId), timer);

    return {
      timer: { ...timer, ...duracaoDoTimer(timer.startedAt, agora()) },
      anterior,
      jaEstavaRodando: false,
    };
  }

  /**
   * Para o timer e devolve o que precisa virar worklog.
   * Devolve null quando não havia timer — parar duas vezes não é erro.
   *
   * O registro do KVS é apagado ANTES de qualquer gravação no Jira: melhor um
   * timer perdido do que um timer que grava duas vezes se o usuário insistir.
   */
  async function parar(accountId) {
    const timer = await ler(accountId);
    if (!timer) return null;
    await storage.delete(chaveDoTimer(accountId));
    return timer;
  }

  /** Joga o timer fora sem apontar nada — a saída para o timer esquecido. */
  async function descartar(accountId) {
    const timer = await ler(accountId);
    await storage.delete(chaveDoTimer(accountId));
    return timer;
  }

  return { ler, iniciar, parar, descartar };
}

/**
 * Armazenamento em memória com a mesma interface do `storage` do Forge.
 * Existe para os testes, e só para eles.
 */
export function storageDeMemoria(inicial = {}) {
  const mapa = new Map(Object.entries(inicial));
  return {
    async get(chave) {
      return mapa.has(chave) ? JSON.parse(JSON.stringify(mapa.get(chave))) : undefined;
    },
    async set(chave, valor) {
      mapa.set(chave, JSON.parse(JSON.stringify(valor)));
    },
    async delete(chave) {
      mapa.delete(chave);
    },
    get tamanho() {
      return mapa.size;
    },
  };
}
