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

const App = () => {
  const [estado, setEstado] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState(null);
  // Contado no cliente para o relógio andar sem uma chamada por segundo.
  const [decorrido, setDecorrido] = useState(0);

  const aplicar = useCallback((resposta) => {
    if (!resposta?.ok) {
      setAviso({ tipo: 'error', texto: mensagemDeErro(resposta?.motivo) });
      return resposta;
    }
    return resposta;
  }, []);

  const carregar = useCallback(async () => {
    const r = aplicar(await invoke('estadoDoTimer'));
    if (r?.ok) setEstado(r);
    return r;
  }, [aplicar]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Relógio: só existe enquanto há timer rodando neste item.
  const rodandoAqui = Boolean(estado?.timer) && !estado?.emOutroItem;
  const startedAt = estado?.timer?.startedAt;

  useEffect(() => {
    if (!rodandoAqui || !startedAt) return undefined;
    setDecorrido(segundosDesde(startedAt));
    const id = setInterval(() => setDecorrido(segundosDesde(startedAt)), 1000);
    return () => clearInterval(id);
  }, [rodandoAqui, startedAt]);

  const iniciar = async () => {
    setOcupado(true);
    setAviso(null);
    const r = aplicar(await invoke('iniciarTimer'));
    if (r?.ok) {
      if (r.anterior) {
        // Um timer por pessoa: o anterior foi encerrado aqui.
        setAviso({
          tipo: 'warning',
          texto: `Stopped your timer on ${r.anterior.issueKey || 'another work item'} at ${r.anterior.duracao}. Not written to the worklog yet.`,
        });
      }
      await carregar();
    }
    setOcupado(false);
  };

  const parar = async () => {
    setOcupado(true);
    setAviso(null);
    const r = aplicar(await invoke('pararTimer'));
    if (r?.ok && r.encerrado) {
      setAviso({
        tipo: 'information',
        texto: `Timer stopped at ${r.encerrado.duracao}. Not written to the worklog yet.`,
      });
    }
    if (r?.ok) await carregar();
    setOcupado(false);
  };

  const descartar = async () => {
    setOcupado(true);
    setAviso(null);
    const r = aplicar(await invoke('descartarTimer'));
    if (r?.ok) {
      setAviso({ tipo: 'information', texto: 'Timer discarded. Nothing was logged.' });
      await carregar();
    }
    setOcupado(false);
  };

  if (!estado && !aviso) return <Spinner label="Loading timer" />;

  const timer = estado?.timer;

  return (
    <Stack space="space.150">
      {aviso && (
        <SectionMessage appearance={aviso.tipo}>
          <Text>{aviso.texto}</Text>
        </SectionMessage>
      )}

      {/* Timer aberto em outro item: trocar é destrutivo, então avisamos onde. */}
      {timer && estado.emOutroItem && (
        <SectionMessage appearance="warning" title="A timer is already running">
          <Text>
            You have a timer running on <Strong>{timer.issueKey || 'another work item'}</Strong> (
            {timer.duracao}). Starting here stops it.
          </Text>
        </SectionMessage>
      )}

      {/* Timer esquecido: oferecer descartar antes de virar hora inventada. */}
      {timer && !estado.emOutroItem && timer.suspeito && (
        <SectionMessage appearance="warning" title="This timer has been running a long time">
          <Text>Check the total before you log it.</Text>
        </SectionMessage>
      )}

      {rodandoAqui ? (
        <Inline space="space.100" alignBlock="center">
          <Lozenge appearance="inprogress">Running</Lozenge>
          <Strong>{formatarRelogio(decorrido)}</Strong>
        </Inline>
      ) : (
        <Text>No timer running on this work item.</Text>
      )}

      <ButtonGroup>
        {rodandoAqui ? (
          <>
            <Button appearance="primary" onClick={parar} isDisabled={ocupado}>
              Stop
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

/** Motivo técnico vira frase que o usuário entende. */
function mensagemDeErro(motivo) {
  if (motivo === 'sem-item') return 'Nativelog could not tell which work item this is.';
  if (motivo === 'sem-usuario') return 'Nativelog could not identify you. Try reloading the page.';
  return 'Something went wrong. Try again.';
}

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
