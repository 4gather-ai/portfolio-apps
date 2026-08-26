import React, { useCallback, useEffect, useState } from 'react';
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

/** O servidor manda `startedAt`; o relógio da tela conta a partir dele. */
function segundosDesde(startedAt) {
  const inicio = new Date(startedAt).getTime();
  if (Number.isNaN(inicio)) return 0;
  return Math.max(0, Math.floor((Date.now() - inicio) / 1000));
}

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

  const carregar = useCallback(async () => {
    const r = await invoke('estadoDoTimer');
    if (r?.ok) setEstado(r);
    else setAviso({ tipo: 'error', texto: mensagemDeErro(r?.motivo) });
    return r;
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

  const iniciar = async () => {
    setOcupado(true);
    setAviso(null);
    const r = await invoke('iniciarTimer');

    if (!r?.ok) {
      // Falhou ao fechar o timer anterior: ele continua de pé, no item dele.
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

    await carregar();
    setOcupado(false);
  };

  const parar = async () => {
    setOcupado(true);
    setAviso(null);
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

    await carregar();
    setOcupado(false);
  };

  const descartar = async () => {
    setOcupado(true);
    setAviso(null);
    const r = await invoke('descartarTimer');
    if (r?.ok) setAviso({ tipo: 'information', texto: 'Timer discarded. Nothing was logged.' });
    else setAviso({ tipo: 'error', texto: mensagemDeErro(r?.motivo) });
    await carregar();
    setOcupado(false);
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
