import React, { useCallback, useEffect, useState } from 'react';
import ForgeReconciler, {
  Button,
  ButtonGroup,
  Heading,
  Inline,
  Lozenge,
  SectionMessage,
  Spinner,
  Stack,
  Strong,
  Text,
} from '@forge/react';
import { invoke } from '@forge/bridge';
import { agruparPorDia, chaveDoDia, formatarDuracao, limitesDaSemana } from '../lib/time.js';
import { mensagemDaSemana } from './mensagens.js';
import { diasDaSemana, tituloDaSemana } from './semanaUi.js';

/**
 * Nativelog — "Minha semana".
 *
 * **É aqui que o fuso horário existe.** O resolver devolve instantes absolutos
 * e não opina sobre dias; esta tela, que roda no navegador de quem está
 * olhando, decide em que dia cada hora cai. Se o agrupamento fosse feito no
 * Forge — que roda em UTC — todo apontamento do fim da noite apareceria no dia
 * seguinte, e a pessoa veria horas num dia em que não trabalhou.
 */
const Semana = () => {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  // 0 = esta semana. Negativo = semanas anteriores (o D7 usa os botões).
  const [deslocamento, setDeslocamento] = useState(0);

  const carregar = useCallback(async (desloc) => {
    setCarregando(true);
    setErro(null);

    // Os limites saem daqui, no fuso de quem está olhando, e viajam como
    // instantes absolutos. O servidor não precisa saber que dias são esses.
    const { inicio, fim } = limitesDaSemana(new Date(), desloc);

    try {
      const r = await invoke('minhaSemana', {
        desde: inicio.toISOString(),
        ate: fim.toISOString(),
      });
      if (r?.ok) setDados({ ...r, inicio, fim });
      else setErro(mensagemDaSemana(r?.motivo));
    } catch (e) {
      setErro(mensagemDaSemana());
    }
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregar(deslocamento);
  }, [carregar, deslocamento]);

  if (carregando && !dados) return <Spinner label="Loading your week" />;

  const entradas = dados?.entradas || [];
  // Agrupamento no fuso local — ver o comentário no topo.
  const { porDia, total } = agruparPorDia(
    entradas.map((e) => ({ started: e.started, timeSpentSeconds: e.segundos }))
  );
  const dias = dados ? diasDaSemana(dados.inicio) : [];

  return (
    <Stack space="space.200">
      <Heading as="h2">{dados ? tituloDaSemana(dados.inicio, dados.fim) : 'My week'}</Heading>

      <Inline space="space.100" alignBlock="center">
        <ButtonGroup>
          <Button onClick={() => setDeslocamento((d) => d - 1)} isDisabled={carregando}>
            Previous week
          </Button>
          <Button onClick={() => setDeslocamento(0)} isDisabled={carregando || deslocamento === 0}>
            This week
          </Button>
          <Button
            onClick={() => setDeslocamento((d) => d + 1)}
            isDisabled={carregando || deslocamento >= 0}
          >
            Next week
          </Button>
        </ButtonGroup>
        <Button appearance="subtle" onClick={() => carregar(deslocamento)} isDisabled={carregando}>
          Refresh
        </Button>
      </Inline>

      {erro && (
        <SectionMessage appearance="error">
          <Text>{erro}</Text>
        </SectionMessage>
      )}

      {/* O que a lista não tem, dito em vez de escondido atrás de um total. */}
      {dados?.cortada && (
        <SectionMessage appearance="warning" title="This week is only partly shown">
          <Text>
            You logged time on more work items than Nativelog reads in one go, so the total below
            is lower than your real week.
          </Text>
        </SectionMessage>
      )}

      {dados?.falhas?.length > 0 && (
        <SectionMessage appearance="warning" title="Some items could not be read">
          <Text>
            {dados.falhas.join(', ')} could not be read just now, so any time on them is missing
            from this total.
          </Text>
        </SectionMessage>
      )}

      <Inline space="space.100" alignBlock="center">
        <Strong>Total</Strong>
        <Lozenge appearance={total > 0 ? 'success' : 'default'}>
          {total > 0 ? formatarDuracao(total) : 'nothing logged'}
        </Lozenge>
        {carregando && <Spinner size="small" label="Refreshing" />}
      </Inline>

      {dias.map((dia) => {
        const chave = chaveDoDia(dia.data);
        const segundosDoDia = porDia[chave] || 0;
        const doDia = entradas.filter((e) => chaveDoDia(e.started) === chave);

        return (
          <Stack key={chave} space="space.050">
            <Inline space="space.100" alignBlock="center">
              <Strong>{dia.rotulo}</Strong>
              <Text>{segundosDoDia > 0 ? formatarDuracao(segundosDoDia) : '—'}</Text>
            </Inline>

            {doDia.map((e) => (
              <Inline key={e.id} space="space.100" alignBlock="center">
                <Strong>{e.duracao}</Strong>
                <Text>
                  {e.issueKey} {e.titulo}
                </Text>
              </Inline>
            ))}
          </Stack>
        );
      })}

      {/* O JQL do passo 1 passa pelo índice de busca do Jira, que atrasa alguns
          segundos. Dizer isso é mais barato que alguém achar que perdeu horas. */}
      <Text>
        Time logged in the last few seconds can take a moment to appear here. Use Refresh if
        something you just logged is missing.
      </Text>
    </Stack>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <Semana />
  </React.StrictMode>
);
