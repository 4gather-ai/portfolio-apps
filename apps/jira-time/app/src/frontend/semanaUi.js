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
