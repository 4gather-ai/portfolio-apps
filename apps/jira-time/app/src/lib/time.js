/**
 * Nativelog — núcleo de tempo.
 *
 * Sem dependência do Forge de propósito: é lógica pura, testada em isolamento.
 * Foi aqui que o spike mostrou onde o Jira é exigente (formato de `started`),
 * então é aqui que os testes moram.
 */

/** Milissegundos por unidade, na notação que o Jira aceita. */
const UNIDADES = { w: 604800000, d: 86400000, h: 3600000, m: 60000 };

/**
 * Converte Date para o formato que o Jira exige em `worklog.started`:
 * yyyy-MM-dd'T'HH:mm:ss.SSSZ com offset numérico (+0000), não 'Z'.
 * O Jira rejeita o ISO puro do JavaScript.
 */
export function paraDataJira(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError('paraDataJira espera um Date válido');
  }
  return date.toISOString().replace('Z', '+0000');
}

/**
 * Lê o formato de duração do Jira ("3w 2d 4h 30m") e devolve segundos.
 * Aceita número puro como horas, que é como a maioria das pessoas digita.
 * Devolve null quando não dá para entender — nunca chuta.
 */
export function lerDuracao(texto) {
  if (typeof texto !== 'string') return null;
  const limpo = texto.trim().toLowerCase();
  if (!limpo) return null;

  // "2" ou "2,5" ou "2.5" → horas
  if (/^\d+([.,]\d+)?$/.test(limpo)) {
    const horas = parseFloat(limpo.replace(',', '.'));
    return horas > 0 ? Math.round(horas * 3600) : null;
  }

  const partes = limpo.match(/\d+([.,]\d+)?\s*[wdhm]/g);
  if (!partes) return null;

  // Rejeita sobra: "3h banana" não é 3h, é erro de digitação.
  const consumido = partes.join('').replace(/\s/g, '');
  if (limpo.replace(/\s/g, '') !== consumido) return null;

  let ms = 0;
  for (const parte of partes) {
    const valor = parseFloat(parte.replace(',', '.'));
    const unidade = parte.trim().slice(-1);
    ms += valor * UNIDADES[unidade];
  }
  const segundos = Math.round(ms / 1000);
  return segundos > 0 ? segundos : null;
}

/**
 * Formata segundos na notação do Jira. Usado na folha de ponto e no CSV.
 * formatarDuracao(10800) === '3h'
 */
export function formatarDuracao(segundos) {
  if (!Number.isFinite(segundos) || segundos <= 0) return '0m';
  let resto = Math.round(segundos);
  const saida = [];
  for (const [unidade, ms] of Object.entries(UNIDADES)) {
    const tamanho = ms / 1000;
    const quantos = Math.floor(resto / tamanho);
    if (quantos > 0) {
      saida.push(`${quantos}${unidade}`);
      resto -= quantos * tamanho;
    }
  }
  return saida.length ? saida.join(' ') : '0m';
}

/**
 * Duração de um timer, em segundos, entre início e agora.
 * Protege contra relógio para trás e contra timer esquecido.
 */
export function duracaoDoTimer(inicioISO, agora = new Date()) {
  const inicio = new Date(inicioISO);
  if (Number.isNaN(inicio.getTime())) return { segundos: 0, invalido: true };
  const segundos = Math.floor((agora.getTime() - inicio.getTime()) / 1000);
  if (segundos < 0) return { segundos: 0, invalido: true };
  return {
    segundos,
    invalido: false,
    // O usuário provavelmente esqueceu de parar. Avisar antes de gravar.
    suspeito: segundos > 12 * 3600,
  };
}

/**
 * Limites da semana (segunda 00:00 até domingo 23:59:59.999) no fuso local
 * de quem está olhando. A folha de ponto é sempre por semana.
 */
export function limitesDaSemana(referencia = new Date(), deslocamento = 0) {
  const d = new Date(referencia);
  d.setHours(0, 0, 0, 0);
  // getDay(): 0 = domingo. Queremos segunda como primeiro dia.
  const diaDaSemana = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diaDaSemana + deslocamento * 7);
  const inicio = new Date(d);
  const fim = new Date(d);
  fim.setDate(fim.getDate() + 6);
  fim.setHours(23, 59, 59, 999);
  return { inicio, fim };
}

/** Chave de dia (YYYY-MM-DD) no fuso local — agrupa worklog na folha. */
export function chaveDoDia(date) {
  const d = new Date(date);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/**
 * Agrupa worklogs por dia e soma. Entrada é o formato cru do Jira.
 * Só considera worklogs do accountId pedido — a folha é de uma pessoa.
 */
export function agruparPorDia(worklogs, accountId) {
  const porDia = {};
  let total = 0;
  for (const w of worklogs || []) {
    if (accountId && w.author?.accountId !== accountId) continue;
    const segundos = w.timeSpentSeconds || 0;
    const chave = chaveDoDia(w.started);
    porDia[chave] = (porDia[chave] || 0) + segundos;
    total += segundos;
  }
  return { porDia, total };
}

/**
 * Relógio para o timer em andamento: "1:23:45" ou "23:45".
 * `formatarDuracao` é a notação do Jira e serve para o que já foi apontado;
 * um timer correndo precisa de segundos, senão parece travado.
 */
export function formatarRelogio(segundos) {
  const total = Number.isFinite(segundos) && segundos > 0 ? Math.floor(segundos) : 0;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const dd = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${dd(m)}:${dd(s)}` : `${m}:${dd(s)}`;
}
