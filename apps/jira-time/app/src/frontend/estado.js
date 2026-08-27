/**
 * Nativelog — a lógica do painel que não depende de React.
 *
 * Existe porque os dois defeitos achados no teste manual de 26/08/2026 são
 * defeitos de *estado da tela*, não de servidor, e um defeito sem teste volta:
 *
 *  1. **O painel mentia.** Uma aba aberta no item antigo continuava mostrando
 *     "Running" depois de o timer ter sido encerrado em outra aba. O painel não
 *     é dono da verdade — o mesmo timer é mexido em outra aba, no celular, ou
 *     pelo próprio Jira — então precisa reconsultar.
 *  2. **O relógio demorava a aparecer.** O cold start do resolver levou 20 s;
 *     até a resposta chegar, a tela ficava idêntica a antes do clique, e um
 *     app de cronômetro que não move ao clicar em Start parece quebrado.
 *
 * Nada aqui importa `@forge/react` nem `@forge/bridge`: é tudo função pura ou
 * função que recebe `janela`/`documento` por parâmetro, e por isso `index.jsx`
 * fica com a árvore de componentes e mais nada.
 */

/**
 * De quanto em quanto tempo reconsultar o servidor.
 *
 * 30 s é o meio-termo entre uma tela que mente por muito tempo e uma conta de
 * invocações do Forge que cresce com cada painel aberto. Só corre quando há
 * relógio na tela — ver `intervaloDeSincronia`.
 */
export const INTERVALO_SINCRONIA_MS = 30000;

/** O servidor manda `startedAt`; o relógio da tela conta a partir dele. */
export function segundosDesde(startedAt, agora = Date.now()) {
  const inicio = new Date(startedAt).getTime();
  if (Number.isNaN(inicio)) return 0;
  return Math.max(0, Math.floor((agora - inicio) / 1000));
}

/**
 * Com que frequência este estado precisa ser reconsultado.
 *
 * Só o timer rodando **neste item** paga o custo do intervalo: é o único estado
 * que mente de forma cara — a pessoa vê o relógio andando e acredita que o
 * tempo está sendo contado quando já não está. "Nenhum timer aqui" e o aviso de
 * timer em outro item também envelhecem, mas o pior que fazem é um aviso
 * desatualizado que o próximo clique corrige; para esses, a reconsulta ao voltar
 * o foco basta.
 */
export function intervaloDeSincronia(estado) {
  if (!estado?.timer || estado.emOutroItem) return 0;
  return INTERVALO_SINCRONIA_MS;
}

/**
 * Estado provisório mostrado no instante do clique em Start.
 *
 * O relógio começa a andar aqui, antes de o resolver responder. `iniciadoEm` é
 * o mesmo carimbo enviado ao servidor, que o aceita se for recente (ver
 * `inicioDoTimer` em `lib/time.js`) — é isso que faz a reconciliação não pular
 * para trás: os dois lados falam do mesmo instante.
 *
 * `otimista: true` marca que este estado ainda não foi confirmado por ninguém.
 */
export function estadoOtimista(estado, iniciadoEm) {
  const item = estado?.item || null;
  return {
    ...estado,
    ok: true,
    item,
    timer: {
      issueId: item?.issueId || null,
      issueKey: item?.issueKey || null,
      startedAt: iniciadoEm,
      segundos: 0,
      suspeito: false,
      invalido: false,
      tentativas: 0,
      ultimaFalha: null,
    },
    // O timer que porventura rodava em outro item é fechado pelo servidor nesta
    // mesma chamada; daqui em diante o item que conta é este.
    emOutroItem: false,
    otimista: true,
  };
}

/**
 * O que dizer quando a reconsulta em segundo plano encontra outra realidade.
 *
 * Sem isto, o relógio simplesmente sumiria da tela e a pessoa ficaria sem saber
 * se o tempo dela foi gravado ou perdido. A frase é deliberadamente neutra: a
 * aba antiga não tem como saber se o timer virou worklog, foi descartado ou
 * mudou de item — só sabe que não é mais dela.
 */
export function avisoDeMudanca(antes, depois) {
  const rodavaAqui = Boolean(antes?.timer) && !antes.emOutroItem;
  const rodaAqui = Boolean(depois?.timer) && !depois.emOutroItem;
  if (!rodavaAqui || rodaAqui) return null;
  // Devolve chave e padrão, não a frase pronta: quem traduz é a tela. Ver o
  // topo de `mensagens.js`.
  return {
    tipo: 'information',
    chave: 'painel.mudouPorFora',
    padrao:
      'This timer is no longer running here — it was stopped, discarded or moved somewhere else. Check the work log for the entry.',
  };
}

/**
 * Liga as reconsultas do painel e devolve como desligá-las.
 *
 * Três gatilhos, porque nenhum deles é garantido sozinho:
 *  - `focus` na janela — o retorno mais imediato, quando o iframe o recebe;
 *  - `visibilitychange` no documento — a aba do navegador voltando ao primeiro
 *    plano, que é exatamente o caso relatado;
 *  - intervalo — o único que funciona com duas janelas visíveis lado a lado, e
 *    a rede de segurança caso o sandbox do UI Kit não entregue os eventos.
 *
 * `janela` e `documento` entram por parâmetro em vez de virem de `globalThis`
 * para que os testes exercitem o registro e a remoção de verdade, e para que a
 * ausência deles no sandbox do Forge não quebre nada.
 */
export function ligarSincronia({ aoSincronizar, permitido = () => true, intervaloMs = 0, janela, documento }) {
  const desligadores = [];

  // Enquanto uma operação está no ar, reconsultar só atrapalha: a resposta dela
  // já traz o estado novo, e uma leitura no meio do caminho mostraria o estado
  // velho depois do certo.
  const disparar = () => {
    if (permitido()) aoSincronizar();
  };

  if (typeof janela?.addEventListener === 'function') {
    janela.addEventListener('focus', disparar);
    desligadores.push(() => janela.removeEventListener('focus', disparar));
  }

  if (typeof documento?.addEventListener === 'function') {
    const aoMudarVisibilidade = () => {
      // Só na volta. Ao esconder a aba não há tela para corrigir.
      if (documento.visibilityState === 'hidden') return;
      disparar();
    };
    documento.addEventListener('visibilitychange', aoMudarVisibilidade);
    desligadores.push(() => documento.removeEventListener('visibilitychange', aoMudarVisibilidade));
  }

  if (intervaloMs > 0) {
    const id = setInterval(disparar, intervaloMs);
    desligadores.push(() => clearInterval(id));
  }

  return () => {
    for (const desligar of desligadores) desligar();
    desligadores.length = 0;
  };
}
