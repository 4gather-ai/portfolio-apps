/**
 * Nativelog — que edition esta instância tem.
 *
 * **A regra que governa este arquivo é a mesma de `permissoes.js`, e vale
 * repetir: na dúvida, libera.** Se o Forge não mandar informação de licença —
 * porque o billing ainda não foi ligado, porque é ambiente de desenvolvimento,
 * porque a Atlassian mudou o formato — o app mostra o produto inteiro.
 *
 * O motivo é comercial antes de ser técnico: **bloquear um cliente pagante por
 * causa de um campo que a gente não soube ler é o pior erro possível**. O outro
 * lado do erro é alguém usar o Pro de graça por um tempo, o que custa pouco e
 * se corrige. Os dois erros não têm o mesmo tamanho, então a escolha não é
 * simétrica.
 *
 * E o núcleo nunca depende disto: apontar tempo, ver a própria semana e
 * exportar as próprias horas funcionam em qualquer edition (regra 10 do
 * `CLAUDE.md`). O que esta camada governa é **a visão de equipe**, e só.
 */

export const EDICOES = ['free', 'standard', 'pro'];

/**
 * Lê a edition do contexto do Forge.
 *
 * O Forge entrega a licença em `context.license`. O formato tem variado entre
 * versões da plataforma, então aqui se aceita mais de um caminho e **nenhum
 * deles ausente é tratado como "não pago"** — ausência é desconhecido, e
 * desconhecido libera.
 */
export function edicaoDoContexto(context) {
  const licenca = context?.license;

  // Sem bloco de licença nenhum: billing não ligado, ou dev. Libera.
  if (!licenca || typeof licenca !== 'object') {
    return { edicao: 'pro', conferida: false, motivo: 'sem-licenca-no-contexto' };
  }

  // Licença presente e explicitamente inativa: é o trial vencido, e aí sim o
  // produto cai para o que é grátis.
  const ativa = licenca.active ?? licenca.isActive;
  if (ativa === false) {
    return { edicao: 'free', conferida: true, motivo: 'licenca-inativa' };
  }

  const bruta = licenca.edition ?? licenca.type;
  const edicao = typeof bruta === 'string' ? bruta.trim().toLowerCase() : null;

  // Licença ativa mas sem edition legível: libera, marcado como não conferido.
  if (!edicao || !EDICOES.includes(edicao)) {
    return { edicao: 'pro', conferida: false, motivo: 'edition-desconhecida' };
  }

  return { edicao, conferida: true, motivo: null };
}

/**
 * O que esta edition pode fazer.
 *
 * **Só a visão de equipe é gated.** Tudo que envolve as horas de quem está
 * olhando — apontar, corrigir, ver a semana, exportar — é núcleo e não depende
 * de licença. Cobrar de alguém para exportar as próprias horas chega perto de
 * segurar dado de refém, e é o que rende avaliação de duas estrelas.
 */
export function recursosDa(edicao) {
  return {
    apontar: true,
    minhaSemana: true,
    exportarCSV: true,
    verEquipe: edicao === 'pro',
  };
}

/** Atalho: o que o contexto do Forge libera. */
export function recursosDoContexto(context) {
  const { edicao, conferida, motivo } = edicaoDoContexto(context);
  return { edicao, conferida, motivo, ...recursosDa(edicao) };
}
