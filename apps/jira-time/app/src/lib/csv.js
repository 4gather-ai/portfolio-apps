/**
 * Nativelog — exportação da folha em CSV.
 *
 * **Uma linha por lançamento, nunca somado.** Contador quer a linha crua, com
 * projeto, item, data, duração e descrição; gerente quer o total por dia. Somar
 * a partir do cru é uma tabela dinâmica de trinta segundos; separar um total
 * que já veio somado é impossível. Então exportamos o cru.
 *
 * Roda no navegador de propósito: as colunas de data são **o dia e a hora de
 * quem apontou**, e o fuso só existe lá. Ver o contrato no topo de
 * `resolvers/painel.js`.
 */

/** Colunas, nesta ordem. Mudar a ordem quebra planilha de gente, então não se muda à toa. */
export const COLUNAS = [
  'Date',
  'Start time',
  'Duration',
  'Hours',
  'Project',
  'Work item',
  'Summary',
  'Description',
];

/**
 * Caracteres que fazem uma planilha tratar o texto como fórmula.
 *
 * **Isto é segurança, não formatação.** Uma descrição que começa com `=` vira
 * fórmula ao abrir o arquivo no Excel, no LibreOffice ou no Sheets — e existe
 * uma família inteira de ataques que usa exatamente isso para rodar comando na
 * máquina de quem abre a planilha. Quem escreve a descrição pode ser qualquer
 * pessoa do Jira; quem abre o CSV costuma ser o financeiro.
 *
 * A defesa é prefixar com apóstrofo, que a planilha consome e mostra o texto
 * como texto. O tab e o retorno de carro entram porque também disparam a
 * interpretação em algumas versões.
 */
const PERIGOSOS = ['=', '+', '-', '@', '\t', '\r'];

/** Neutraliza fórmula e escapa aspas, vírgula e quebra de linha. */
export function celula(valor) {
  let texto = valor === null || valor === undefined ? '' : String(valor);

  if (texto.length > 0 && PERIGOSOS.includes(texto[0])) {
    texto = `'${texto}`;
  }

  if (/[",\n\r]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

const doisDigitos = (n) => String(n).padStart(2, '0');

/** AAAA-MM-DD local — a data que a pessoa reconhece como "o dia que trabalhei". */
export function dataLocal(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}`;
}

/** HH:MM local. */
export function horaLocal(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`;
}

/**
 * Horas decimais, com duas casas — a coluna que a planilha soma.
 *
 * `1h 30m` some numa célula: ninguém soma "1h 30m" no Excel. `1.50` soma. As
 * duas colunas convivem porque servem a leitores diferentes: a notação do Jira
 * para conferir contra a tela, o decimal para a conta.
 */
export function horasDecimais(segundos) {
  if (!Number.isFinite(segundos) || segundos <= 0) return '0.00';
  return (segundos / 3600).toFixed(2);
}

/**
 * A folha inteira em CSV.
 *
 * `duracao` já vem formatada na notação do Jira por quem chama, para não
 * duplicar a regra de formatação.
 */
export function paraCSV(entradas = []) {
  const linhas = [COLUNAS.join(',')];

  for (const e of entradas) {
    linhas.push(
      [
        dataLocal(e.started),
        horaLocal(e.started),
        e.duracao || '',
        horasDecimais(e.segundos),
        e.projetoNome || e.projetoChave || '',
        e.issueKey || '',
        e.titulo || '',
        e.comentario || '',
      ]
        .map(celula)
        .join(',')
    );
  }

  // Terminador de linha CRLF: é o que o RFC 4180 pede e o que o Excel do
  // Windows espera. Planilha aberta com quebra errada mostra tudo numa célula.
  return `${linhas.join('\r\n')}\r\n`;
}

/**
 * Filtra por projeto, incluindo ou excluindo.
 *
 * **Excluir existe porque é o pedido real.** Quem fatura por cliente quase
 * nunca sabe listar os projetos que quer; sabe listar os dois que *não* quer —
 * o interno e o de férias. Só oferecer "incluir" obriga a pessoa a manter uma
 * lista que cresce sozinha toda vez que nasce um projeto novo.
 *
 * Lista vazia significa "sem filtro" nos dois modos: excluir nada é exportar
 * tudo, e incluir nada seria exportar nada, que nunca é o que alguém quis
 * dizer ao abrir a tela sem marcar caixa nenhuma.
 */
export function filtrarProjetos(entradas = [], { modo = 'incluir', chaves = [] } = {}) {
  if (!chaves || chaves.length === 0) return entradas;

  const conjunto = new Set(chaves);
  return entradas.filter((e) =>
    modo === 'excluir' ? !conjunto.has(e.projetoChave) : conjunto.has(e.projetoChave)
  );
}

/** Os projetos presentes nas entradas, em ordem, para montar a lista da tela. */
export function projetosDe(entradas = []) {
  const porChave = new Map();
  for (const e of entradas) {
    if (e.projetoChave && !porChave.has(e.projetoChave)) {
      porChave.set(e.projetoChave, { chave: e.projetoChave, nome: e.projetoNome || e.projetoChave });
    }
  }
  return [...porChave.values()].sort((a, b) => a.nome.localeCompare(b.nome));
}
