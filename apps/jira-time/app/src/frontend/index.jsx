import React, { useCallback, useEffect, useRef, useState } from 'react';
import ForgeReconciler, {
  Button,
  ButtonGroup,
  Inline,
  Lozenge,
  SectionMessage,
  Spinner,
  Stack,
  Strong,
  Text,
} from '@forge/react';
import { invoke } from '@forge/bridge';
import { formatarRelogio } from '../lib/time.js';
import {
  avisoDeMudanca,
  estadoOtimista,
  intervaloDeSincronia,
  ligarSincronia,
  segundosDesde,
} from './estado.js';

/**
 * Motivo técnico vira frase que o usuário entende.
 *
 * Regra destas mensagens: quando a gravação falha, **o timer continua de pé**,
 * e a frase tem que dizer isso. "Deu erro" faria a pessoa achar que perdeu as
 * horas que acabou de cronometrar.
 */
function mensagemDeErro(motivo) {
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

/** Confirmação de gravação. Diz o nome do autor de propósito: é a cunha. */
function textoDoWorklog(worklog, issueKey, jaEstavaGravado) {
  const onde = issueKey ? ` to ${issueKey}` : '';
  const quem = worklog.autorNome ? ` as ${worklog.autorNome}` : '';
  return jaEstavaGravado
    ? `Already logged: ${worklog.duracao}${onde}${quem}. Nothing was written twice.`
    : `Logged ${worklog.duracao}${onde}${quem}.`;
}

const App = () => {
  const [estado, setEstado] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState(null);
  // Contado no cliente para o relógio andar sem uma chamada por segundo.
  const [decorrido, setDecorrido] = useState(0);

  /**
   * Os dois refs existem pelo mesmo motivo: os ouvintes de `ligarSincronia` são
   * registrados uma vez e enxergariam para sempre os valores do render em que
   * nasceram.
   */
  const ocupadoRef = useRef(false);
  const estadoRef = useRef(null);

  const definirOcupado = (valor) => {
    ocupadoRef.current = valor;
    setOcupado(valor);
  };

  const aplicarEstado = (novo) => {
    estadoRef.current = novo;
    setEstado(novo);
  };

  /**
   * `silencioso`: a falha de uma leitura que a pessoa não pediu não pode apagar
   * a confirmação de gravação que está na tela nem piscar um erro do nada.
   * `avisarMudanca`: só as reconsultas de fundo comparam o antes e o depois —
   * depois de Stop, a tela já está mostrando a frase certa, que é melhor.
   */
  const carregar = useCallback(async ({ silencioso = false, avisarMudanca = false } = {}) => {
    try {
      const r = await invoke('estadoDoTimer');
      if (r?.ok) {
        const mudanca = avisarMudanca ? avisoDeMudanca(estadoRef.current, r) : null;
        aplicarEstado(r);
        if (mudanca) setAviso(mudanca);
      } else if (!silencioso) {
        setAviso({ tipo: 'error', texto: mensagemDeErro(r?.motivo) });
      }
      return r;
    } catch (erro) {
      // Rede caiu no meio. O estado que já está na tela vale mais que um painel
      // em branco, então ele fica como está.
      if (!silencioso) setAviso({ tipo: 'error', texto: mensagemDeErro() });
      return null;
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const rodandoAqui = Boolean(estado?.timer) && !estado?.emOutroItem;
  const startedAt = estado?.timer?.startedAt;

  // Relógio: só existe enquanto há timer rodando neste item.
  useEffect(() => {
    if (!rodandoAqui || !startedAt) return undefined;
    setDecorrido(segundosDesde(startedAt));
    const id = setInterval(() => setDecorrido(segundosDesde(startedAt)), 1000);
    return () => clearInterval(id);
  }, [rodandoAqui, startedAt]);

  /**
   * Defeito 1: este painel não é o único lugar onde o timer é mexido.
   *
   * Sem isto, a aba deixada aberta no item antigo segue mostrando "Running"
   * para um timer encerrado em outra aba — e o relógio andando é uma afirmação
   * forte: a pessoa acredita que o tempo está sendo contado.
   */
  const intervaloMs = intervaloDeSincronia(estado);
  useEffect(
    () =>
      ligarSincronia({
        aoSincronizar: () => carregar({ silencioso: true, avisarMudanca: true }),
        permitido: () => !ocupadoRef.current,
        intervaloMs,
        janela: typeof window === 'undefined' ? null : window,
        documento: typeof document === 'undefined' ? null : document,
      }),
    [carregar, intervaloMs]
  );

  const iniciar = async () => {
    definirOcupado(true);
    setAviso(null);

    /**
     * Defeito 2: o relógio começa a andar agora, não quando o resolver
     * responder — o cold start medido foi de ~20 s. O mesmo carimbo vai para o
     * servidor, que o adota se for recente, e por isso a confirmação não faz o
     * relógio pular para trás.
     */
    const iniciadoEm = new Date().toISOString();
    const anteriorNaTela = estado;
    aplicarEstado(estadoOtimista(estado, iniciadoEm));

    try {
      const r = await invoke('iniciarTimer', { iniciadoEm });

      if (!r?.ok) {
        // Falhou ao fechar o timer anterior: ele continua de pé, no item dele.
        // O relógio otimista some junto — não há timer novo.
        aplicarEstado(anteriorNaTela);
        setAviso({ tipo: 'error', texto: mensagemDeErro(r?.motivo) });
      } else if (r.anterior?.gravado) {
        setAviso({
          tipo: 'success',
          texto: textoDoWorklog(
            r.anterior.worklog,
            r.anterior.encerrado?.issueKey,
            r.anterior.jaEstavaGravado
          ),
        });
      } else if (r.anterior?.motivo === 'curto-demais') {
        setAviso({
          tipo: 'information',
          texto: 'Your previous timer ran for under a minute, so nothing was logged.',
        });
      }
    } catch (erro) {
      aplicarEstado(anteriorNaTela);
      setAviso({ tipo: 'error', texto: mensagemDeErro() });
    }

    await carregar({ silencioso: true });
    definirOcupado(false);
  };

  const parar = async () => {
    definirOcupado(true);
    setAviso(null);
    try {
      const r = await invoke('pararTimer');

      if (!r?.ok) {
        setAviso({ tipo: 'error', texto: mensagemDeErro(r?.motivo) });
      } else if (r.gravado) {
        setAviso({
          tipo: 'success',
          texto: textoDoWorklog(r.worklog, r.encerrado?.issueKey, r.jaEstavaGravado),
        });
      } else if (r.motivo === 'curto-demais') {
        setAviso({
          tipo: 'information',
          texto: 'That timer ran for under a minute, so nothing was logged.',
        });
      }
    } catch (erro) {
      setAviso({ tipo: 'error', texto: mensagemDeErro() });
    }

    await carregar({ silencioso: true });
    definirOcupado(false);
  };

  const descartar = async () => {
    definirOcupado(true);
    setAviso(null);
    try {
      const r = await invoke('descartarTimer');
      if (r?.ok) setAviso({ tipo: 'information', texto: 'Timer discarded. Nothing was logged.' });
      else setAviso({ tipo: 'error', texto: mensagemDeErro(r?.motivo) });
    } catch (erro) {
      setAviso({ tipo: 'error', texto: mensagemDeErro() });
    }
    await carregar({ silencioso: true });
    definirOcupado(false);
  };

  if (!estado && !aviso) return <Spinner label="Loading timer" />;

  const timer = estado?.timer;
  const falhou = (timer?.tentativas || 0) > 0;

  return (
    <Stack space="space.150">
      {aviso && (
        <SectionMessage appearance={aviso.tipo}>
          <Text>{aviso.texto}</Text>
        </SectionMessage>
      )}

      {/* Timer aberto em outro item: trocar grava o anterior, então avisamos onde. */}
      {timer && estado.emOutroItem && (
        <SectionMessage appearance="warning" title="A timer is already running">
          <Text>
            You have a timer running on <Strong>{timer.issueKey || 'another work item'}</Strong> (
            {timer.duracao}). Starting here logs that time to it first.
          </Text>
        </SectionMessage>
      )}

      {/* Uma gravação já falhou neste timer: a pessoa precisa saber que pode insistir. */}
      {timer && falhou && (
        <SectionMessage appearance="warning" title="This time has not been logged yet">
          <Text>
            {timer.duracao} on {timer.issueKey || 'this work item'} is still waiting to be written to
            Jira. Press Stop to try again.
          </Text>
        </SectionMessage>
      )}

      {/* Timer esquecido: oferecer descartar antes de virar hora inventada. */}
      {timer && !estado.emOutroItem && timer.suspeito && !falhou && (
        <SectionMessage appearance="warning" title="This timer has been running a long time">
          <Text>Check the total before you log it.</Text>
        </SectionMessage>
      )}

      {rodandoAqui ? (
        <Inline space="space.100" alignBlock="center">
          <Lozenge appearance={falhou ? 'moved' : 'inprogress'}>
            {falhou ? 'Not logged' : 'Running'}
          </Lozenge>
          <Strong>{formatarRelogio(decorrido)}</Strong>
        </Inline>
      ) : (
        <Text>No timer running on this work item.</Text>
      )}

      <ButtonGroup>
        {rodandoAqui ? (
          <>
            <Button appearance="primary" onClick={parar} isDisabled={ocupado}>
              {falhou ? 'Stop and retry' : 'Stop'}
            </Button>
            <Button appearance="subtle" onClick={descartar} isDisabled={ocupado}>
              Discard
            </Button>
          </>
        ) : (
          <Button appearance="primary" onClick={iniciar} isDisabled={ocupado}>
            {timer && estado.emOutroItem ? 'Start here' : 'Start timer'}
          </Button>
        )}
      </ButtonGroup>
    </Stack>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
