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
  Select,
  Text,
  I18nProvider,
  TextArea,
  Toggle,
  useTranslation,
} from '@forge/react';
import { invoke } from '@forge/bridge';
import { agruparPorDia, chaveDoDia, formatarDuracao, limitesDaSemana } from '../lib/time.js';
import { filtrarProjetos, paraCSV, projetosDe } from '../lib/csv.js';
import { porPessoa, totalDoTime } from './equipeUi.js';
import { FormularioApontamento } from './FormularioApontamento.jsx';
import { formularioDe, paraEnvio } from './formulario.js';
import { mensagemDaSemana, mensagemDoApontamento, preencher } from './mensagens.js';
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
  const { t } = useTranslation();
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
  // D8: exportação. `projetosFora` são as chaves desmarcadas — o padrão é
  // exportar tudo, e desmarcar é o gesto de excluir.
  const [exportando, setExportando] = useState(false);
  const [projetosFora, setProjetosFora] = useState([]);
  // D9: visão de equipe, **somente leitura**. A aba é estado próprio: usar o
  // projeto escolhido como sinal de aba deixava as duas folhas na tela ao mesmo
  // tempo enquanto ninguém tinha escolhido projeto — visto no navegador.
  const [aba, setAba] = useState('minha');
  const [projetoDoTime, setProjetoDoTime] = useState('');
  const [time, setTime] = useState(null);
  const [projetosDisponiveis, setProjetosDisponiveis] = useState([]);

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
      else setErro(t(...mensagemDaSemana(r?.motivo)));
    } catch (e) {
      setErro(t(...mensagemDaSemana()));
    }
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregar(deslocamento);
  }, [carregar, deslocamento]);

  /** A lista de projetos só é buscada quando a aba de equipe é aberta. */
  const carregarProjetos = useCallback(async () => {
    try {
      const r = await invoke('projetosVisiveis');
      if (r?.ok) setProjetosDisponiveis(r.projetos || []);
    } catch (e) {
      // Sem lista, o seletor fica vazio e a mensagem da tela explica.
    }
  }, []);

  const carregarTime = useCallback(async (chave, desloc) => {
    if (!chave) return;
    setCarregando(true);
    setErro(null);

    const { inicio, fim } = limitesDaSemana(new Date(), desloc);
    try {
      const r = await invoke('semanaDoTime', {
        projetoChave: chave,
        desde: inicio.toISOString(),
        ate: fim.toISOString(),
      });
      if (r?.ok) setTime({ ...r, inicio, fim });
      else setErro(mensagemDaSemana(r?.motivo));
    } catch (e) {
      setErro(mensagemDaSemana());
    }
    setCarregando(false);
  }, []);

  useEffect(() => {
    if (aba === 'time' && projetoDoTime) carregarTime(projetoDoTime, deslocamento);
  }, [carregarTime, aba, projetoDoTime, deslocamento]);

  /**
   * Salvar a correção. O `issueId` vai no payload porque esta é uma página
   * global: não há item no contexto do Forge para o resolver ler. A guarda de
   * autoria continua no servidor — ver `itemDoAlvo` em `resolvers/painel.js`.
   */
  const salvar = async (valores) => {
    const envio = paraEnvio({ ...valores, id: editando.id });
    if (!envio.ok) {
      setAviso({ tipo: 'error', texto: t(...mensagemDoApontamento(envio.motivo)) });
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
        setAviso({ tipo: 'error', texto: t(...mensagemDoApontamento(r?.motivo)) });
      } else {
        // Só fecha quando gravou: fechar antes jogaria fora o que a pessoa
        // digitou justamente quando ela precisa corrigir e reenviar.
        setEditando(null);
        setAviso({
          tipo: 'success',
          texto: preencher(t('painel.atualizado', 'Entry updated to {0}.'), [r.worklog?.duracao]),
        });
      }
    } catch (e) {
      setAviso({ tipo: 'error', texto: t(...mensagemDoApontamento()) });
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
      else setAviso({ tipo: 'information', texto: t('painel.apagado', 'Entry deleted from Jira.') });
    } catch (e) {
      setAviso({ tipo: 'error', texto: mensagemDoApontamento() });
    }
    setApagando(null);
    if (editando?.id === entrada.id) setEditando(null);
    await carregar(deslocamento);
    setOcupado(false);
  };

  if (carregando && !dados) return <Spinner label={t('semana.carregando', 'Loading your week')} />;

  const entradas = dados?.entradas || [];
  // Agrupamento no fuso local — ver o comentário no topo.
  const { porDia, total } = agruparPorDia(
    entradas.map((e) => ({ started: e.started, timeSpentSeconds: e.segundos }))
  );
  const dias = dados ? diasDaSemana(dados.inicio) : [];
  const diasDoTime = time ? diasDaSemana(time.inicio) : [];
  const linhasDoTime = time
    ? porPessoa(time.entradas, diasDoTime, t('semana.autorDesconhecido', 'Unknown user'))
    : [];
  const projetos = projetosDe(entradas);
  const paraExportar = filtrarProjetos(entradas, { modo: 'excluir', chaves: projetosFora });
  const csv = exportando ? paraCSV(paraExportar) : '';

  return (
    <Stack space="space.200">
      <Heading as="h2">{dados ? tituloDaSemana(dados.inicio, dados.fim) : 'My week'}</Heading>

      {/* D9 — duas abas. A de equipe é somente leitura, e a tela diz isso. */}
      <Inline space="space.100" alignBlock="center">
        <ButtonGroup>
          <Button
            appearance={aba === 'minha' ? 'primary' : 'default'}
            onClick={() => {
              setAba('minha');
              setErro(null);
            }}
            isDisabled={carregando}
          >
            {t('semana.minha', 'My week')}
          </Button>
          <Button
            appearance={aba === 'time' ? 'primary' : 'default'}
            onClick={() => {
              setAba('time');
              setExportando(false);
              setEditando(null);
              setApagando(null);
              setErro(null);
              carregarProjetos();
            }}
            isDisabled={carregando}
          >
            {t('semana.time', 'Team')}
          </Button>
        </ButtonGroup>
      </Inline>

      {aba === 'time' && (
        <Stack space="space.100">
          <Select
            id="nativelog-projeto-time"
            placeholder={t('semana.escolherProjeto', 'Choose a project')}
            options={projetosDisponiveis.map((p) => ({
              label: `${p.nome} (${p.chave})`,
              value: p.chave,
            }))}
            value={
              projetoDoTime
                ? {
                    label:
                      projetosDisponiveis.find((p) => p.chave === projetoDoTime)?.nome ||
                      projetoDoTime,
                    value: projetoDoTime,
                  }
                : null
            }
            onChange={(opcao) => setProjetoDoTime(opcao?.value || '')}
          />
          <Text>
            {t(
              'semana.somenteLeitura',
              "Read-only. Nativelog shows you what Jira already lets you see, and never lets you change someone else's hours — do that from the work item's Work log tab if you have permission."
            )}
          </Text>
        </Stack>
      )}

      <Inline space="space.100" alignBlock="center">
        <ButtonGroup>
          <Button onClick={() => setDeslocamento((d) => d - 1)} isDisabled={carregando}>
            {t('semana.anterior', 'Previous week')}
          </Button>
          <Button onClick={() => setDeslocamento(0)} isDisabled={carregando || deslocamento === 0}>
            {t('semana.esta', 'This week')}
          </Button>
          <Button
            onClick={() => setDeslocamento((d) => d + 1)}
            isDisabled={carregando || deslocamento >= 0}
          >
            {t('semana.proxima', 'Next week')}
          </Button>
        </ButtonGroup>
        <Button
          appearance="subtle"
          onClick={() =>
            aba === 'time' ? carregarTime(projetoDoTime, deslocamento) : carregar(deslocamento)
          }
          isDisabled={carregando}
        >
          {t('semana.atualizar', 'Refresh')}
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
        <SectionMessage
          appearance="warning"
          title={t('semana.cortada.titulo', 'This week is only partly shown')}
        >
          <Text>
            {t(
              'semana.cortada.corpo',
              'You logged time on more work items than Nativelog reads in one go, so the total below is lower than your real week.'
            )}
          </Text>
        </SectionMessage>
      )}

      {dados?.falhas?.length > 0 && (
        <SectionMessage
          appearance="warning"
          title={t('semana.falhas.titulo', 'Some items could not be read')}
        >
          <Text>
            {preencher(
              t(
                'semana.falhas.corpo',
                '{0} could not be read just now, so any time on them is missing from this total.'
              ),
              [dados.falhas.join(', ')]
            )}
          </Text>
        </SectionMessage>
      )}

      {/* Corpo da aba de equipe: uma linha por pessoa, totais por dia. */}
      {aba === 'time' && time && projetoDoTime && (
        <Stack space="space.150">
          <Inline space="space.100" alignBlock="center">
            <Strong>{t('semana.totalTime', 'Team total')}</Strong>
            <Lozenge appearance={time.totalSegundos > 0 ? 'success' : 'default'}>
              {time.totalSegundos > 0
                ? formatarDuracao(time.totalSegundos)
                : t('semana.nada', 'nothing logged')}
            </Lozenge>
            {carregando && <Spinner size="small" label={t('semana.atualizando', 'Refreshing')} />}
          </Inline>

          {linhasDoTime.length === 0 ? (
            <Text>{t('semana.timeVazio', 'Nobody logged time on this project during this week.')}</Text>
          ) : (
            linhasDoTime.map((pessoa) => (
              <Stack key={pessoa.id} space="space.050">
                <Inline space="space.100" alignBlock="center">
                  <Strong>{pessoa.nome}</Strong>
                  <Lozenge appearance="inprogress">{formatarDuracao(pessoa.total)}</Lozenge>
                </Inline>
                <Inline space="space.100">
                  {diasDoTime.map((dia, i) => (
                    <Text key={chaveDoDia(dia.data)}>
                      {dia.rotulo}: {pessoa.dias[i] > 0 ? formatarDuracao(pessoa.dias[i]) : '—'}
                    </Text>
                  ))}
                </Inline>
              </Stack>
            ))
          )}

          {time.cortada && (
            <SectionMessage
              appearance="warning"
              title={t('semana.cortada.titulo', 'This week is only partly shown')}
            >
              <Text>
                {t(
                  'semana.cortadaTime.corpo',
                  'The team logged time on more work items than Nativelog reads in one go, so the total above is lower than the real week.'
                )}
              </Text>
            </SectionMessage>
          )}
        </Stack>
      )}

      {/* Daqui para baixo é a minha semana. */}
      {aba === 'minha' && (
      <Inline space="space.100" alignBlock="center">
        <Strong>{t('semana.total', 'Total')}</Strong>
        <Lozenge appearance={total > 0 ? 'success' : 'default'}>
          {total > 0 ? formatarDuracao(total) : t('semana.nada', 'nothing logged')}
        </Lozenge>
        {carregando && <Spinner size="small" label={t('semana.atualizando', 'Refreshing')} />}
      </Inline>
      )}

      {aba === 'minha' && dias.map((dia) => {
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
                    <Text>{t('painel.apagar.pergunta', 'Delete this entry from Jira?')}</Text>
                    <Button appearance="danger" onClick={() => apagar(e)} isDisabled={ocupado}>
                      {t('painel.apagar.sim', 'Delete')}
                    </Button>
                    <Button
                      appearance="subtle"
                      onClick={() => setApagando(null)}
                      isDisabled={ocupado}
                    >
                      {t('painel.apagar.nao', 'Keep')}
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
                        {t('painel.editar', 'Edit')}
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
                        {t('painel.apagar.sim', 'Delete')}
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
                    titulo={preencher(t('form.editarItem', 'Edit {0}'), [e.issueKey])}
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

      {/* D8 — exportação. Só na minha semana: a folha do time é somente
          leitura, e exportar hora alheia é outra conversa (e outro risco). */}
      {aba === 'minha' && entradas.length > 0 && (
        <Stack space="space.100">
          <Inline space="space.100" alignBlock="center">
            <Button onClick={() => setExportando((v) => !v)} isDisabled={carregando}>
              {exportando ? t('csv.esconder', 'Hide export') : t('csv.exportar', 'Export CSV')}
            </Button>
            {exportando && (
              <Text>
                {preencher(t('csv.contagem', '{0} of {1}'), [
                  paraExportar.length,
                  entradas.length === 1
                    ? t('painel.lista.umaEntrada', '1 entry')
                    : preencher(t('painel.lista.entradas', '{0} entries'), [entradas.length]),
                ])}
              </Text>
            )}
          </Inline>

          {exportando && (
            <Stack space="space.100">
              {projetos.length > 1 && (
                <Stack space="space.050">
                  <Strong>{t('csv.projetos', 'Projects to include')}</Strong>
                  {/* Incluir e excluir são o mesmo gesto: tudo marcado por
                      padrão, e desmarcar tira o projeto. Quem fatura por
                      cliente sabe listar os dois projetos que NÃO quer muito
                      antes de saber listar os dez que quer. */}
                  {projetos.map((p) => (
                    <Inline key={p.chave} space="space.100" alignBlock="center">
                      <Toggle
                        id={`projeto-${p.chave}`}
                        isChecked={!projetosFora.includes(p.chave)}
                        onChange={() =>
                          setProjetosFora((fora) =>
                            fora.includes(p.chave)
                              ? fora.filter((c) => c !== p.chave)
                              : [...fora, p.chave]
                          )
                        }
                      />
                      <Text>
                        {p.nome} ({p.chave})
                      </Text>
                    </Inline>
                  ))}
                </Stack>
              )}

              {paraExportar.length === 0 ? (
                <SectionMessage appearance="warning">
                  <Text>
                    {t('csv.nenhumProjeto', 'Every project is unticked, so there is nothing to export.')}
                  </Text>
                </SectionMessage>
              ) : (
                <Stack space="space.050">
                  {/* Não há download de arquivo dentro de um app Forge, então
                      dizemos isso em vez de fingir um botão que não baixa. */}
                  <Text>
                    {t(
                      'csv.instrucao',
                      "Select all of the box below and copy it, then paste into a spreadsheet or save it as a .csv file. Jira apps can't hand your browser a file directly."
                    )}
                  </Text>
                  <TextArea
                    id="nativelog-csv"
                    isReadOnly
                    isMonospaced
                    resize="vertical"
                    minimumRows={12}
                    value={csv}
                    defaultValue={csv}
                  />
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      )}

      {/* O JQL do passo 1 passa pelo índice de busca do Jira, que atrasa alguns
          segundos. Dizer isso é mais barato que alguém achar que perdeu horas. */}
      <Text>
        {t(
          'semana.atrasoIndice',
          'Time logged in the last few seconds can take a moment to appear here. Use Refresh if something you just logged is missing.'
        )}
      </Text>
    </Stack>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    {/* O provider carrega o idioma de quem está olhando. Sem ele o `t` ainda
        funciona e devolve o inglês embutido — a tela nunca mostra a chave crua. */}
    <I18nProvider>
      <Semana />
    </I18nProvider>
  </React.StrictMode>
);
