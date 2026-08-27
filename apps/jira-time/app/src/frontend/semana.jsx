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
import { FormularioApontamento } from './FormularioApontamento.jsx';
import { formularioDe, paraEnvio } from './formulario.js';
import { mensagemDaSemana, mensagemDoApontamento } from './mensagens.js';
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
  // 0 = esta semana. Negativo = semanas anteriores.
  const [deslocamento, setDeslocamento] = useState(0);
  // D7: corrigir e apagar sem sair da folha. `editando` guarda a entrada
  // inteira porque o item dela precisa viajar junto — a página global não está
  // "dentro" de item nenhum.
  const [editando, setEditando] = useState(null);
  const [apagando, setApagando] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState(null);

  const carregar = useCallback(async (desloc) => {
    setCarregando(true);
    setErro(null);
    // Confirmação da semana passada não vale na semana nova: "Entry updated to
    // 5m" sobre uma folha vazia é confuso.
    setAviso(null);

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

  /**
   * Salvar a correção. O `issueId` vai no payload porque esta é uma página
   * global: não há item no contexto do Forge para o resolver ler. A guarda de
   * autoria continua no servidor — ver `itemDoAlvo` em `resolvers/painel.js`.
   */
  const salvar = async (valores) => {
    const envio = paraEnvio({ ...valores, id: editando.id });
    if (!envio.ok) {
      setAviso({ tipo: 'error', texto: mensagemDoApontamento(envio.motivo) });
      return;
    }

    setOcupado(true);
    setAviso(null);
    try {
      const r = await invoke('editarApontamento', {
        ...envio.payload,
        issueId: editando.issueId,
        issueKey: editando.issueKey,
      });

      if (!r?.ok) {
        setAviso({ tipo: 'error', texto: mensagemDoApontamento(r?.motivo) });
      } else {
        // Só fecha quando gravou: fechar antes jogaria fora o que a pessoa
        // digitou justamente quando ela precisa corrigir e reenviar.
        setEditando(null);
        setAviso({ tipo: 'success', texto: `Entry updated to ${r.worklog?.duracao || ''}.` });
      }
    } catch (e) {
      setAviso({ tipo: 'error', texto: mensagemDoApontamento() });
    }

    await carregar(deslocamento);
    setOcupado(false);
  };

  const apagar = async (entrada) => {
    setOcupado(true);
    setAviso(null);
    try {
      const r = await invoke('apagarApontamento', {
        worklogId: entrada.id,
        issueId: entrada.issueId,
        issueKey: entrada.issueKey,
      });
      if (!r?.ok) setAviso({ tipo: 'error', texto: mensagemDoApontamento(r?.motivo) });
      else setAviso({ tipo: 'information', texto: 'Entry deleted from Jira.' });
    } catch (e) {
      setAviso({ tipo: 'error', texto: mensagemDoApontamento() });
    }
    setApagando(null);
    if (editando?.id === entrada.id) setEditando(null);
    await carregar(deslocamento);
    setOcupado(false);
  };

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

      {aviso && (
        <SectionMessage appearance={aviso.tipo}>
          <Text>{aviso.texto}</Text>
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
              <Stack key={e.id} space="space.050">
                <Inline space="space.100" alignBlock="center">
                  <Strong>{e.duracao}</Strong>
                  <Text>
                    {e.issueKey} {e.titulo}
                  </Text>
                </Inline>

                {apagando === e.id ? (
                  <Inline space="space.100" alignBlock="center">
                    {/* O dado é do Jira: apagar aqui apaga lá, sem lixeira. */}
                    <Text>Delete this entry from Jira?</Text>
                    <Button appearance="danger" onClick={() => apagar(e)} isDisabled={ocupado}>
                      Delete
                    </Button>
                    <Button
                      appearance="subtle"
                      onClick={() => setApagando(null)}
                      isDisabled={ocupado}
                    >
                      Keep
                    </Button>
                  </Inline>
                ) : (
                  editando?.id !== e.id && (
                    <Inline space="space.050">
                      <Button
                        appearance="subtle"
                        onClick={() => {
                          setAviso(null);
                          setApagando(null);
                          setEditando(e);
                        }}
                        isDisabled={ocupado}
                      >
                        Edit
                      </Button>
                      <Button
                        appearance="subtle"
                        onClick={() => {
                          setAviso(null);
                          setEditando(null);
                          setApagando(e.id);
                        }}
                        isDisabled={ocupado}
                      >
                        Delete
                      </Button>
                    </Inline>
                  )
                )}

                {/* O formulário abre na própria linha: corrigir a folha sem sair
                    dela é o que o D7 existe para dar. `key` porque os campos são
                    não-controlados — sem ela a segunda edição reaproveitaria os
                    valores da primeira. */}
                {editando?.id === e.id && (
                  <FormularioApontamento
                    key={e.id}
                    inicial={formularioDe(e)}
                    titulo={`Edit ${e.issueKey}`}
                    ocupado={ocupado}
                    aoSalvar={salvar}
                    aoCancelar={() => setEditando(null)}
                  />
                )}
              </Stack>
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
