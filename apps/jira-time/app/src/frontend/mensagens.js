/**
 * Nativelog — motivo técnico vira frase que a pessoa entende.
 *
 * Duas funções e não uma porque **o mesmo erro significa coisas diferentes nos
 * dois caminhos**. Um 403 no "parar" quer dizer *"seu tempo continua correndo,
 * peça permissão e tente de novo"*; o mesmo 403 num apontamento manual quer
 * dizer *"isto não foi gravado"*. Uma frase só para os dois casos mentiria
 * metade das vezes — e mentir sobre hora gravada é o pior defeito que este app
 * pode ter.
 */

/**
 * Erros do timer.
 *
 * Regra destas frases: quando a gravação falha, **o timer continua de pé**, e a
 * frase tem que dizer isso. "Deu erro" faria a pessoa achar que perdeu as horas
 * que acabou de cronometrar.
 */
export function mensagemDeErro(motivo) {
  switch (motivo) {
    case 'sem-permissao':
      return "You don't have permission to log work on this item. Your time is still running — ask a project admin, then press Stop again.";
    case 'item-nao-encontrado':
      return 'This work item no longer exists in Jira, so there is nowhere to log to. Your time is still here — use Discard if you no longer need it.';
    case 'jira-indisponivel':
      return "Jira didn't respond. Your time is safe and still running — press Stop again in a moment.";
    case 'limite-de-taxa':
      return 'Jira is rate limiting the request. Your time is safe — press Stop again in a minute.';
    case 'rede':
      return "The request didn't complete. Your time is safe — press Stop again; Nativelog checks for a duplicate before writing anything.";
    case 'worklog-invalido':
      return 'Jira rejected the entry. Your time is still running — please report this.';
    case 'timer-corrompido':
      return "That timer's stored start time could not be read, so nothing was logged.";
    case 'sem-item':
      return 'Nativelog could not tell which work item this is.';
    case 'sem-usuario':
      return 'Nativelog could not identify you. Try reloading the page.';
    default:
      return 'Something went wrong. Your time is still running — try again.';
  }
}

/**
 * Erros do apontamento manual, de edição e de exclusão.
 *
 * Aqui não há tempo cronometrado em risco: o que a frase precisa dizer é
 * **se foi gravado ou não**, e o que digitar diferente.
 */
export function mensagemDoApontamento(motivo) {
  switch (motivo) {
    case 'duracao-invalida':
      return 'Enter a duration like 1h 30m, 45m, or 2 (meaning two hours).';
    case 'curto-demais':
      return 'Jira works in minutes, so an entry has to be at least one minute long.';
    case 'longo-demais':
      return "A single entry can't be longer than 24 hours. Split it across the days the work actually happened.";
    case 'inicio-no-futuro':
      return "That start time is in the future. Nativelog logs work that happened, so pick a time that has already passed.";
    case 'inicio-invalido':
      return 'Pick a valid date and time for when the work started.';
    case 'apontamento-de-outra-pessoa':
      return "That entry belongs to someone else. Nativelog only edits and deletes your own — change it from Jira's work log tab if you have permission.";
    case 'apontamento-nao-encontrado':
      return 'That entry no longer exists in Jira. Someone may have deleted it already.';
    case 'sem-apontamento':
      return 'Nativelog lost track of which entry this was. Reload the panel and try again.';
    case 'sem-permissao':
      return "You don't have permission to log work on this item, so nothing was saved. Ask a project admin.";
    case 'item-nao-encontrado':
      return 'This work item no longer exists in Jira, so nothing was saved.';
    case 'jira-indisponivel':
      return "Jira didn't respond, so nothing was saved. Try again in a moment.";
    case 'limite-de-taxa':
      return 'Jira is rate limiting the request, so nothing was saved. Try again in a minute.';
    case 'rede':
      return "The request didn't complete, so it may or may not have been saved. Check the list below before trying again.";
    case 'worklog-invalido':
      return 'Jira rejected the entry, so nothing was saved. Please report this.';
    default:
      return 'Something went wrong and nothing was saved. Try again.';
  }
}

/** Confirmação de gravação do timer. Diz o nome do autor de propósito: é a cunha. */
export function textoDoWorklog(worklog, issueKey, jaEstavaGravado) {
  const onde = issueKey ? ` to ${issueKey}` : '';
  const quem = worklog.autorNome ? ` as ${worklog.autorNome}` : '';
  return jaEstavaGravado
    ? `Already logged: ${worklog.duracao}${onde}${quem}. Nothing was written twice.`
    : `Logged ${worklog.duracao}${onde}${quem}.`;
}
