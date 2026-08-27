/**
 * Nativelog — o que esta pessoa pode fazer neste item.
 *
 * Existe por um motivo só, e é o pior desfecho que este app pode produzir:
 * **descobrir que não dá para apontar depois de já ter cronometrado três
 * horas.** O erro de permissão já era tratado na hora de gravar — mas tratar
 * bem um erro tarde demais não devolve o tempo de ninguém. Perguntar na
 * abertura do painel custa uma chamada e evita a pior conversa possível com um
 * usuário.
 *
 * `pedir` é injetado, como em `worklog.js`: em produção é
 * `api.asUser().requestJira(...)` — tem que ser `asUser`, senão a resposta
 * seria sobre o que o **app** pode fazer, que não é a pergunta.
 */

/**
 * As três que importam para este app.
 *
 * `WORK_ON_ISSUES` é a de apontar. As de worklog próprio governam corrigir e
 * apagar a própria entrada — que é o limite que o D4 fixou. As versões "ALL"
 * ficam de fora de propósito: mesmo quem as tem não edita hora alheia por aqui.
 */
export const PERMISSOES = ['WORK_ON_ISSUES', 'EDIT_OWN_WORKLOGS', 'DELETE_OWN_WORKLOGS'];

/** Um bloco de permissão do Jira vira booleano, sem achismo sobre o formato. */
function tem(bloco, chave) {
  return bloco?.[chave]?.havePermission === true;
}

export function criarPermissoes({ pedir }) {
  if (typeof pedir !== 'function') {
    throw new TypeError('criarPermissoes exige a função pedir');
  }

  /**
   * Lê as permissões do usuário **neste item**.
   *
   * **Falha de leitura não tranca ninguém.** Se o Jira não responde, o app
   * assume que dá para apontar e segue: a gravação de verdade ainda vai
   * recusar, com uma frase clara, e nesse caminho nada foi perdido. Trancar a
   * tela por causa de uma consulta que falhou seria transformar um problema
   * nosso no problema da pessoa. `conferida: false` diz que a resposta é uma
   * suposição, para quem quiser tratar diferente.
   */
  async function doItem({ issueId }) {
    if (!issueId) throw new TypeError('doItem exige o issueId');

    const caminho =
      `/rest/api/3/mypermissions?issueId=${encodeURIComponent(String(issueId))}` +
      `&permissions=${PERMISSOES.join(',')}`;

    let resposta;
    try {
      resposta = await pedir(caminho, { method: 'GET', headers: { Accept: 'application/json' } });
    } catch (erro) {
      return { ok: false, motivo: 'rede', conferida: false, ...naDuvidaPermite() };
    }

    if (!resposta.ok) {
      return {
        ok: false,
        motivo: resposta.status === 404 ? 'item-nao-encontrado' : 'permissoes-indisponiveis',
        status: resposta.status,
        conferida: false,
        ...naDuvidaPermite(),
      };
    }

    const bloco = (await resposta.json())?.permissions;
    return {
      ok: true,
      conferida: true,
      podeApontar: tem(bloco, 'WORK_ON_ISSUES'),
      podeEditar: tem(bloco, 'EDIT_OWN_WORKLOGS'),
      podeApagar: tem(bloco, 'DELETE_OWN_WORKLOGS'),
    };
  }

  return { doItem };
}

/** Na dúvida, libera — e quem chama sabe que não foi conferido. */
function naDuvidaPermite() {
  return { podeApontar: true, podeEditar: true, podeApagar: true };
}
