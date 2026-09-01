/**
 * Nativelog — a apresentação da semana, sem React.
 *
 * Os sete dias e o título da folha. Mora fora do `.jsx` pelo mesmo motivo de
 * `estado.js` e `formulario.js`: é lógica de calendário, e calendário erra em
 * silêncio — vira uma folha de ponto com seis dias, ou com a segunda-feira
 * errada, e ninguém percebe olhando a tela.
 */

/**
 * Os sete dias da semana que começa em `inicio`, com rótulo já legível.
 *
 * Percorre somando **um dia de cada vez sobre a data local** em vez de somar
 * 24 h em milissegundos. Nos dias de mudança de horário de verão, um "dia" tem
 * 23 ou 25 horas: somar 24 h pularia ou repetiria uma data, e a folha de ponto
 * ficaria com um dia a menos exatamente na semana da virada.
 */
export function diasDaSemana(inicio) {
  const dias = [];
  const base = new Date(inicio);

  for (let i = 0; i < 7; i += 1) {
    const data = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
    dias.push({ data, rotulo: rotuloDoDia(data) });
  }

  return dias;
}

/** "Mon, Aug 24" no idioma de quem está olhando. */
export function rotuloDoDia(data) {
  return data.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** "Aug 24 - Aug 30" — o intervalo que a tela está mostrando. */
export function tituloDaSemana(inicio, fim) {
  const curto = (d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${curto(inicio)} - ${curto(fim)}`;
}

/**
 * A semana que a tela mostra: o que a busca devolveu, mais o que acabou de ser
 * lançado e ela ainda não enxerga.
 *
 * **Existe por um defeito visto no navegador em 01/09.** A folha é remontada
 * por JQL, e o índice de busca do Jira atrasa alguns segundos (~5,7 s, medido
 * no spike). Então lançar dava certo, o formulário fechava, e o dia continuava
 * dizendo "nothing logged" logo abaixo da mensagem verde de sucesso. Numa folha
 * de ponto isso não é um atraso: **é um convite a lançar de novo**, e o segundo
 * lançamento é um worklog duplicado que ninguém pediu.
 *
 * **Não é uma segunda cópia dos dados.** É a resposta da escrita que acabou de
 * acontecer, segurada até a busca devolver a mesma entrada — daí ela some
 * sozinha, porque `pendentes` é filtrado pelo id contra o que veio da busca.
 *
 * A janela é filtrada porque navegar para outra semana não pode arrastar a
 * entrada de hoje para dentro dela.
 */
export function semanaVisivel(daBusca, pendentes, janela) {
  const encontradas = daBusca || [];
  if (!pendentes?.length || !janela) return encontradas;

  const inicio = janela.inicio instanceof Date ? janela.inicio.getTime() : Date.parse(janela.inicio);
  const fim = janela.fim instanceof Date ? janela.fim.getTime() : Date.parse(janela.fim);
  if (Number.isNaN(inicio) || Number.isNaN(fim)) return encontradas;

  const jaVieram = new Set(encontradas.map((e) => String(e.id)));

  return [
    ...encontradas,
    ...pendentes.filter((nova) => {
      if (jaVieram.has(String(nova.id))) return false;
      const quando = Date.parse(nova.started);
      return !Number.isNaN(quando) && quando >= inicio && quando <= fim;
    }),
  ];
}

/** As pendentes que a busca ainda não devolveu — as outras já não são nossas. */
export function aindaPendentes(pendentes, daBusca) {
  if (!pendentes?.length) return [];

  const jaVieram = new Set((daBusca || []).map((e) => String(e.id)));
  const restantes = pendentes.filter((n) => !jaVieram.has(String(n.id)));
  // Devolve o próprio array quando nada mudou: em `setState`, um array novo com
  // o mesmo conteúdo dispara render a cada carregamento da semana.
  return restantes.length === pendentes.length ? pendentes : restantes;
}
