/**
 * Nativelog — motivo técnico vira frase que a pessoa entende.
 *
 * **Desde o D10 estas funções devolvem a chave de tradução e o texto em
 * inglês**, não a frase pronta. Quem monta a frase é a tela, chamando
 * `t(chave, padrao)`: o padrão em inglês fica embutido na chamada, então uma
 * tradução que falhe ao carregar mostra inglês em vez de mostrar a chave crua
 * para o usuário.
 *
 * Três funções e não uma porque **o mesmo erro significa coisas diferentes nos
 * três caminhos**. Um 403 no "parar" quer dizer *"seu tempo continua correndo,
 * peça permissão e tente de novo"*; o mesmo 403 num apontamento manual quer
 * dizer *"isto não foi gravado"*; e na folha da semana quer dizer *"não deu
 * para ler"*. Uma frase só para os três casos mentiria duas vezes em três — e
 * mentir sobre hora gravada é o pior defeito que este app pode ter.
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
      return [
        'timer.erro.semPermissao',
        "You don't have permission to log work on this item. Your time is still running — ask a project admin, then press Stop again.",
      ];
    case 'item-nao-encontrado':
      return [
        'timer.erro.itemSumiu',
        'This work item no longer exists in Jira, so there is nowhere to log to. Your time is still here — use Discard if you no longer need it.',
      ];
    case 'jira-indisponivel':
      return [
        'timer.erro.jiraFora',
        "Jira didn't respond. Your time is safe and still running — press Stop again in a moment.",
      ];
    case 'limite-de-taxa':
      return [
        'timer.erro.limite',
        'Jira is rate limiting the request. Your time is safe — press Stop again in a minute.',
      ];
    case 'rede':
      return [
        'timer.erro.rede',
        "The request didn't complete. Your time is safe — press Stop again; Nativelog checks for a duplicate before writing anything.",
      ];
    case 'worklog-invalido':
      return [
        'timer.erro.recusado',
        'Jira rejected the entry. Your time is still running — please report this.',
      ];
    case 'timer-corrompido':
      return [
        'timer.erro.corrompido',
        "That timer's stored start time could not be read, so nothing was logged.",
      ];
    case 'sem-item':
      return ['timer.erro.semItem', 'Nativelog could not tell which work item this is.'];
    case 'sem-usuario':
      return ['timer.erro.semUsuario', 'Nativelog could not identify you. Try reloading the page.'];
    case 'precisa-confirmar':
      // Não é erro: é o app se recusando a gravar um número que ninguém olhou.
      return [
        'timer.erro.confirmar',
        'This timer has been running a long time. Check the total before logging it.',
      ];
    default:
      return ['timer.erro.generico', 'Something went wrong. Your time is still running — try again.'];
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
      return [
        'apontamento.erro.duracao',
        'Enter a duration like 1h 30m, 45m, or 2 (meaning two hours).',
      ];
    case 'curto-demais':
      return [
        'apontamento.erro.curto',
        'Jira works in minutes, so an entry has to be at least one minute long.',
      ];
    case 'longo-demais':
      return [
        'apontamento.erro.longo',
        "A single entry can't be longer than 24 hours. Split it across the days the work actually happened.",
      ];
    case 'inicio-no-futuro':
      return [
        'apontamento.erro.futuro',
        'That start time is in the future. Nativelog logs work that happened, so pick a time that has already passed.',
      ];
    case 'inicio-invalido':
      return ['apontamento.erro.inicio', 'Pick a valid date and time for when the work started.'];
    case 'apontamento-de-outra-pessoa':
      return [
        'apontamento.erro.deOutro',
        "That entry belongs to someone else. Nativelog only edits and deletes your own — change it from Jira's work log tab if you have permission.",
      ];
    case 'apontamento-nao-encontrado':
      return [
        'apontamento.erro.sumiu',
        'That entry no longer exists in Jira. Someone may have deleted it already.',
      ];
    case 'sem-apontamento':
      return [
        'apontamento.erro.semEntrada',
        'Nativelog lost track of which entry this was. Reload the panel and try again.',
      ];
    case 'sem-permissao':
      return [
        'apontamento.erro.semPermissao',
        "You don't have permission to log work on this item, so nothing was saved. Ask a project admin.",
      ];
    case 'item-nao-encontrado':
      return [
        'apontamento.erro.itemSumiu',
        'This work item no longer exists in Jira, so nothing was saved.',
      ];
    case 'jira-indisponivel':
      return [
        'apontamento.erro.jiraFora',
        "Jira didn't respond, so nothing was saved. Try again in a moment.",
      ];
    case 'limite-de-taxa':
      return [
        'apontamento.erro.limite',
        'Jira is rate limiting the request, so nothing was saved. Try again in a minute.',
      ];
    case 'rede':
      return [
        'apontamento.erro.rede',
        "The request didn't complete, so it may or may not have been saved. Check the list below before trying again.",
      ];
    case 'worklog-invalido':
      return [
        'apontamento.erro.recusado',
        'Jira rejected the entry, so nothing was saved. Please report this.',
      ];
    default:
      return ['apontamento.erro.generico', 'Something went wrong and nothing was saved. Try again.'];
  }
}

/**
 * Erros da folha da semana.
 *
 * Aqui **nada estava sendo gravado**. Ninguém tem tempo em risco, e a frase
 * certa é sobre o que a tela conseguiu ou não conseguiu ler.
 */
export function mensagemDaSemana(motivo) {
  switch (motivo) {
    case 'janela-invalida':
      return [
        'semana.erro.janela',
        'Nativelog could not work out which week to show. Reload the page.',
      ];
    case 'busca-invalida':
      return ['semana.erro.busca', 'Jira rejected the search for your week. Please report this.'];
    case 'sem-permissao':
      return [
        'semana.erro.semPermissao',
        "Your Jira permissions don't allow searching work items, so your week can't be built.",
      ];
    case 'limite-de-taxa':
      return [
        'semana.erro.limite',
        'Jira is rate limiting the request. Wait a minute and press Refresh.',
      ];
    case 'jira-indisponivel':
      return [
        'semana.erro.jiraFora',
        "Jira didn't respond. Nothing is lost — press Refresh in a moment.",
      ];
    case 'rede':
      return ['semana.erro.rede', "The request didn't complete. Press Refresh to try again."];
    case 'sem-usuario':
      return ['semana.erro.semUsuario', 'Nativelog could not identify you. Try reloading the page.'];
    case 'precisa-pro':
      // Não é erro: é a única função paga do produto dizendo que é paga.
      return [
        'semana.erro.precisaPro',
        'The team view is part of the Pro edition. Everything about your own time stays available on every edition.',
      ];
    default:
      return ['semana.erro.generico', "Your week couldn't be loaded. Press Refresh to try again."];
  }
}

/**
 * Preenche `{0}`, `{1}` numa frase traduzida.
 *
 * O `t` do Forge só aceita chave e padrão — não interpola. E interpolar
 * **importa**: em alemão o verbo vai para o fim, em francês a preposição muda
 * com a palavra seguinte. Montar frase por concatenação (`'Logged ' + x + ' to
 * ' + y`) produz inglês com palavras trocadas, não outro idioma. Com marcador,
 * cada tradução decide a ordem.
 */
export function preencher(texto, valores = []) {
  return String(texto ?? '').replace(/\{(\d+)\}/g, (_, i) => {
    const v = valores[Number(i)];
    return v === undefined || v === null ? '' : String(v);
  });
}

/**
 * Confirmação de gravação do timer. Diz o nome do autor de propósito: é a cunha.
 *
 * Recebe `t` porque a ordem das partes é decisão de cada idioma.
 */
export function textoDoWorklog(t, worklog, issueKey, jaEstavaGravado) {
  const duracao = worklog?.duracao || '';
  const quem = worklog?.autorNome || '';

  if (jaEstavaGravado) {
    return issueKey
      ? preencher(
          t('worklog.jaGravado', 'Already logged: {0} to {1} as {2}. Nothing was written twice.'),
          [duracao, issueKey, quem]
        )
      : preencher(t('worklog.jaGravadoSemItem', 'Already logged: {0}. Nothing was written twice.'), [
          duracao,
        ]);
  }

  if (issueKey && quem) {
    return preencher(t('worklog.gravado', 'Logged {0} to {1} as {2}.'), [duracao, issueKey, quem]);
  }
  if (issueKey) {
    return preencher(t('worklog.gravadoSemAutor', 'Logged {0} to {1}.'), [duracao, issueKey]);
  }
  return preencher(t('worklog.gravadoSimples', 'Logged {0}.'), [duracao]);
}
