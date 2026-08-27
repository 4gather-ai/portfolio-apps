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
  I18nProvider,
  Text,
  useTranslation,
} from '@forge/react';
import { invoke } from '@forge/bridge';
import { formatarDuracao, formatarRelogio } from '../lib/time.js';
import {
  avisoDeMudanca,
  estadoOtimista,
  intervaloDeSincronia,
  ligarSincronia,
  segundosDesde,
} from './estado.js';
import { FormularioApontamento } from './FormularioApontamento.jsx';
import { formularioDe, formularioVazio, paraEnvio } from './formulario.js';
import { mensagemDeErro, mensagemDoApontamento, preencher, textoDoWorklog } from './mensagens.js';

/** Data legível no fuso de quem está olhando: "Aug 26, 14:30". */
function quandoLegivel(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const App = () => {
  // `t` do i18n do Forge. Cada chamada leva o inglês embutido como padrão: se a
  // tradução não carregar, aparece inglês, nunca a chave crua.
  const { t } = useTranslation();
  const [estado, setEstado] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState(null);
  // Contado no cliente para o relógio andar sem uma chamada por segundo.
  const [decorrido, setDecorrido] = useState(0);

  // D4: os apontamentos já gravados, o formulário aberto e a confirmação de
  // exclusão. `formulario === null` significa formulário fechado.
  const [apontamentos, setApontamentos] = useState(null);
  const [formulario, setFormulario] = useState(null);
  const [apagando, setApagando] = useState(null);
  // D5: o timer esquecido esperando o segundo clique, e a confirmação de jogar
  // fora um timer preso em outro item.
  const [confirmandoParada, setConfirmandoParada] = useState(null);
  const [confirmandoDescarte, setConfirmandoDescarte] = useState(false);

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

  /** A lista de apontamentos do item. Falha dela nunca apaga a tela do timer. */
  const carregarApontamentos = useCallback(async () => {
    try {
      const r = await invoke('meusApontamentos');
      if (r?.ok) setApontamentos(r);
      return r;
    } catch (erro) {
      return null;
    }
  }, []);

  /**
   * `silencioso`: a falha de uma leitura que a pessoa não pediu não pode apagar
   * a confirmação de gravação que está na tela nem piscar um erro do nada.
   * `avisarMudanca`: só as reconsultas de fundo comparam o antes e o depois —
   * depois de Stop, a tela já está mostrando a frase certa, que é melhor.
   */
  const carregar = useCallback(
    async ({ silencioso = false, avisarMudanca = false } = {}) => {
      try {
        const r = await invoke('estadoDoTimer');
        if (r?.ok) {
          const mudanca = avisarMudanca ? avisoDeMudanca(estadoRef.current, r) : null;
          aplicarEstado(r);
          if (mudanca) setAviso({ tipo: mudanca.tipo, texto: t(mudanca.chave, mudanca.padrao) });
        } else if (!silencioso) {
          setAviso({ tipo: 'error', texto: t(...mensagemDeErro(r?.motivo)) });
        }
        return r;
      } catch (erro) {
        // Rede caiu no meio. O estado que já está na tela vale mais que um painel
        // em branco, então ele fica como está.
        if (!silencioso) setAviso({ tipo: 'error', texto: t(...mensagemDeErro()) });
        return null;
      }
    },
    []
  );

  useEffect(() => {
    carregar();
    carregarApontamentos();
  }, [carregar, carregarApontamentos]);

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
        // Formulário aberto também bloqueia: reconsultar no meio da digitação
        // não muda o formulário, mas gasta invocação à toa.
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
        setAviso({ tipo: 'error', texto: t(...mensagemDeErro(r?.motivo)) });
      } else if (r.anterior?.gravado) {
        setAviso({
          tipo: 'success',
          texto: textoDoWorklog(
            t,
            r.anterior.worklog,
            r.anterior.encerrado?.issueKey,
            r.anterior.jaEstavaGravado
          ),
        });
      } else if (r.anterior?.motivo === 'curto-demais') {
        setAviso({
          tipo: 'information',
          texto: t(
            'painel.curtoAnterior',
            'Your previous timer ran for under a minute, so nothing was logged.'
          ),
        });
      }
    } catch (erro) {
      aplicarEstado(anteriorNaTela);
      setAviso({ tipo: 'error', texto: t(...mensagemDeErro()) });
    }

    await carregar({ silencioso: true });
    definirOcupado(false);
  };

  const parar = async ({ confirmado = false } = {}) => {
    definirOcupado(true);
    setAviso(null);
    try {
      const r = await invoke('pararTimer', { confirmado });

      if (!r?.ok) {
        setAviso({ tipo: 'error', texto: t(...mensagemDeErro(r?.motivo)) });
      } else if (r.motivo === 'precisa-confirmar') {
        // O servidor se recusou a gravar sem alguém olhar o número. A tela
        // mostra o total e pede o segundo clique.
        setConfirmandoParada(r.encerrado);
      } else if (r.gravado) {
        setAviso({
          tipo: 'success',
          texto: textoDoWorklog(t, r.worklog, r.encerrado?.issueKey, r.jaEstavaGravado),
        });
      } else if (r.motivo === 'curto-demais') {
        setAviso({
          tipo: 'information',
          texto: t('painel.curto', 'That timer ran for under a minute, so nothing was logged.'),
        });
      }
    } catch (erro) {
      setAviso({ tipo: 'error', texto: t(...mensagemDeErro()) });
    }

    setConfirmandoParada(null);
    await carregar({ silencioso: true });
    // O timer virou worklog: a lista logo abaixo estaria mentindo sem isto.
    await carregarApontamentos();
    definirOcupado(false);
  };

  const descartar = async () => {
    definirOcupado(true);
    setAviso(null);
    try {
      const r = await invoke('descartarTimer');
      if (r?.ok) {
        setAviso({
          tipo: 'information',
          texto: t('painel.descartado', 'Timer discarded. Nothing was logged.'),
        });
      }
      else setAviso({ tipo: 'error', texto: t(...mensagemDeErro(r?.motivo)) });
    } catch (erro) {
      setAviso({ tipo: 'error', texto: t(...mensagemDeErro()) });
    }
    setConfirmandoParada(null);
    setConfirmandoDescarte(false);
    await carregar({ silencioso: true });
    definirOcupado(false);
  };

  // ── D4: apontamento manual ────────────────────────────────────────────────

  const abrirNovo = () => {
    setAviso(null);
    setApagando(null);
    setFormulario(formularioVazio());
  };

  const abrirEdicao = (apontamento) => {
    setAviso(null);
    setApagando(null);
    setFormulario(formularioDe(apontamento));
  };

  /**
   * Salvar serve para criar e para corrigir: é o `id` no formulário que decide.
   * Um caminho só porque as regras são as mesmas — duas cópias sairiam de
   * sincronia na primeira mudança de validação.
   */
  const salvar = async (valores) => {
    const envio = paraEnvio({ ...valores, id: formulario?.id || null });
    if (!envio.ok) {
      setAviso({ tipo: 'error', texto: t(...mensagemDoApontamento(envio.motivo)) });
      return;
    }

    definirOcupado(true);
    setAviso(null);
    const editando = Boolean(formulario?.id);

    try {
      const r = await invoke(editando ? 'editarApontamento' : 'apontarManual', envio.payload);

      if (!r?.ok) {
        setAviso({ tipo: 'error', texto: t(...mensagemDoApontamento(r?.motivo)) });
      } else {
        // O formulário só fecha quando gravou. Fechar antes jogaria fora o que
        // a pessoa digitou justamente quando ela precisa corrigir e reenviar.
        setFormulario(null);
        setAviso({
          tipo: 'success',
          texto: editando
            ? preencher(t('painel.atualizado', 'Entry updated to {0}.'), [r.worklog?.duracao])
            : textoDoWorklog(t, { duracao: r.worklog?.duracao }, r.issueKey, false),
        });
      }
    } catch (erro) {
      setAviso({ tipo: 'error', texto: t(...mensagemDoApontamento()) });
    }

    await carregarApontamentos();
    definirOcupado(false);
  };

  /**
   * Apagar é irreversível e o dado é do Jira — não há lixeira nossa. Por isso
   * o botão pede confirmação na própria linha, e não abre caixa de diálogo do
   * navegador: dentro de um painel do Forge, diálogo trava tudo.
   */
  const apagar = async (id) => {
    definirOcupado(true);
    setAviso(null);
    try {
      const r = await invoke('apagarApontamento', { worklogId: id });
      if (!r?.ok) {
        setAviso({ tipo: 'error', texto: t(...mensagemDoApontamento(r?.motivo)) });
      } else {
        setAviso({
          tipo: 'information',
          texto: r.jaNaoExistia
            ? t('painel.jaApagado', 'That entry had already been deleted in Jira.')
            : t('painel.apagado', 'Entry deleted from Jira.'),
        });
        if (formulario?.id === id) setFormulario(null);
      }
    } catch (erro) {
      setAviso({ tipo: 'error', texto: t(...mensagemDoApontamento()) });
    }
    setApagando(null);
    await carregarApontamentos();
    definirOcupado(false);
  };

  if (!estado && !aviso) return <Spinner label={t('painel.carregando', 'Loading timer')} />;

  const timer = estado?.timer;
  const falhou = (timer?.tentativas || 0) > 0;
  const linhas = apontamentos?.apontamentos || [];
  // Timer noutro item que já falhou ao gravar: item apagado, permissão perdida,
  // projeto arquivado. É o caso que precisa de saída, não só de aviso.
  const presoEmOutroItem = Boolean(timer) && estado?.emOutroItem && falhou;
  const naoPodeApontar = estado?.permissoes?.podeApontar === false;

  return (
    <Stack space="space.150">
      {aviso && (
        <SectionMessage appearance={aviso.tipo}>
          <Text>{aviso.texto}</Text>
        </SectionMessage>
      )}

      {/* Timer aberto em outro item: trocar grava o anterior, então avisamos onde.
          **E sempre oferece uma saída.** Até o D5 este caso era um beco sem
          saída: se o outro item tivesse sido apagado, ou se a permissão de
          apontar nele tivesse sumido, "Start here" falhava para sempre e não
          havia botão nenhum para descartar o timer preso — a pessoa ficava sem
          poder apontar em lugar nenhum, sem nada a fazer na tela. */}
      {timer && estado.emOutroItem && (
        <SectionMessage
          appearance={presoEmOutroItem ? 'error' : 'warning'}
          title={
            presoEmOutroItem
              ? t('painel.preso.titulo', 'That timer cannot be logged')
              : t('painel.outroItem.titulo', 'A timer is already running')
          }
        >
          <Stack space="space.100">
            <Text>
              {preencher(
                presoEmOutroItem
                  ? t(
                      timer.ultimaFalha === 'item-nao-encontrado'
                        ? 'painel.preso.corpoItemSumiu'
                        : 'painel.preso.corpo',
                      timer.ultimaFalha === 'item-nao-encontrado'
                        ? 'Your timer on {0} ({1}) could not be written to Jira because that work item no longer exists. Until it is dealt with, no new timer can start.'
                        : 'Your timer on {0} ({1}) could not be written to Jira. Until it is dealt with, no new timer can start.'
                    )
                  : t(
                      'painel.outroItem.corpo',
                      'You have a timer running on {0} ({1}). Starting here logs that time to it first.'
                    ),
                [
                  timer.issueKey || t('painel.outroItemGenerico', 'another work item'),
                  timer.duracao,
                ]
              )}
            </Text>

            {confirmandoDescarte ? (
              <Inline space="space.100" alignBlock="center">
                <Text>
                    {preencher(t('painel.preso.confirmar', 'Throw away {0} without logging it?'), [
                      timer.duracao,
                    ])}
                  </Text>
                <Button appearance="danger" onClick={descartar} isDisabled={ocupado}>
                  {t('painel.preso.sim', 'Discard it')}
                </Button>
                <Button
                  appearance="subtle"
                  onClick={() => setConfirmandoDescarte(false)}
                  isDisabled={ocupado}
                >
                  {t('painel.preso.nao', 'Keep it')}
                </Button>
              </Inline>
            ) : (
              <Button
                appearance="subtle"
                onClick={() => setConfirmandoDescarte(true)}
                isDisabled={ocupado}
              >
                {t('painel.preso.descartar', 'Discard that timer')}
              </Button>
            )}
          </Stack>
        </SectionMessage>
      )}

      {/* Permissão conferida na abertura: dizer agora, não depois de a pessoa
          cronometrar três horas que não terá onde gravar. */}
      {naoPodeApontar && (
        <SectionMessage
          appearance="warning"
          title={t('painel.semPermissao.titulo', "You can't log work on this item")}
        >
          <Text>
            {t(
              'painel.semPermissao.corpo',
              "Your Jira permissions on this project don't include logging work, so a timer here would have nowhere to go. Ask a project admin for the Work on issues permission."
            )}
          </Text>
        </SectionMessage>
      )}

      {/* Uma gravação já falhou neste timer: a pessoa precisa saber que pode insistir. */}
      {timer && falhou && (
        <SectionMessage
          appearance="warning"
          title={t('painel.naoGravadoAinda.titulo', 'This time has not been logged yet')}
        >
          <Text>
            {preencher(
              t(
                'painel.naoGravadoAinda.corpo',
                '{0} on {1} is still waiting to be written to Jira. Press Stop to try again.'
              ),
              [timer.duracao, timer.issueKey || t('painel.esteItem', 'this work item')]
            )}
          </Text>
        </SectionMessage>
      )}

      {/* Timer esquecido: oferecer descartar antes de virar hora inventada. */}
      {timer && !estado.emOutroItem && timer.suspeito && !falhou && (
        <SectionMessage
          appearance="warning"
          title={t('painel.esquecido.titulo', 'This timer has been running a long time')}
        >
          <Text>{t('painel.esquecido.corpo', 'Check the total before you log it.')}</Text>
        </SectionMessage>
      )}

      {rodandoAqui ? (
        <Inline space="space.100" alignBlock="center">
          <Lozenge appearance={falhou ? 'moved' : 'inprogress'}>
            {falhou ? t('painel.naoGravado', 'Not logged') : t('painel.rodando', 'Running')}
          </Lozenge>
          <Strong>{formatarRelogio(decorrido)}</Strong>
        </Inline>
      ) : (
        <Text>{t('painel.semTimer', 'No timer running on this work item.')}</Text>
      )}

      {/* Timer esquecido: o total por extenso e um segundo clique. Gravar 4d 6h
          em silêncio suja a folha de ponto de um jeito que só aparece na fatura. */}
      {confirmandoParada && (
        <SectionMessage
          appearance="warning"
          title={t('painel.confirmarParada.titulo', 'Check this total before logging it')}
        >
          <Stack space="space.100">
            <Text>
              {preencher(
                t(
                  'painel.confirmarParada.corpo',
                  'This timer has been running since {0}, which is {1}. Log that to {2}?'
                ),
                [
                  quandoLegivel(confirmandoParada.startedAt),
                  confirmandoParada.duracao,
                  confirmandoParada.issueKey || t('painel.esteItem', 'this work item'),
                ]
              )}
            </Text>
            <Inline space="space.100" alignBlock="center">
              <Button
                appearance="primary"
                onClick={() => parar({ confirmado: true })}
                isDisabled={ocupado}
              >
                {preencher(t('painel.confirmarParada.sim', 'Log {0}'), [
                  confirmandoParada.duracao,
                ])}
              </Button>
              <Button appearance="subtle" onClick={descartar} isDisabled={ocupado}>
                {t('painel.confirmarParada.descartar', 'Discard it instead')}
              </Button>
              <Button
                appearance="subtle"
                onClick={() => setConfirmandoParada(null)}
                isDisabled={ocupado}
              >
                {t('painel.confirmarParada.continuar', 'Keep running')}
              </Button>
            </Inline>
          </Stack>
        </SectionMessage>
      )}

      <ButtonGroup>
        {rodandoAqui ? (
          <>
            <Button appearance="primary" onClick={() => parar()} isDisabled={ocupado}>
              {falhou
                ? t('painel.stopTentarDeNovo', 'Stop and retry')
                : t('painel.stop', 'Stop')}
            </Button>
            <Button appearance="subtle" onClick={descartar} isDisabled={ocupado}>
              {t('painel.descartar', 'Discard')}
            </Button>
          </>
        ) : (
          // Sem permissão de apontar, o botão não aparece: convidar para um
          // cronômetro que não tem onde gravar é a pior coisa que a tela faz.
          !naoPodeApontar && (
            <Button appearance="primary" onClick={iniciar} isDisabled={ocupado}>
              {timer && estado.emOutroItem
                ? t('painel.startAqui', 'Start here')
                : t('painel.start', 'Start timer')}
            </Button>
          )
        )}
        {/* Sempre disponível, inclusive com o timer correndo: lançar a sexta
            esquecida não pode exigir parar o cronômetro de hoje. */}
        {!formulario && !naoPodeApontar && (
          <Button appearance="default" onClick={abrirNovo} isDisabled={ocupado}>
            {t('painel.apontarManual', 'Log time manually')}
          </Button>
        )}
      </ButtonGroup>

      {formulario && (
        // `key` força um formulário novo ao trocar de entrada: os campos são
        // não-controlados, e sem isso o "Edit" da segunda linha reaproveitaria
        // os valores da primeira.
        <FormularioApontamento
          key={formulario.id || 'novo'}
          inicial={formulario}
          ocupado={ocupado}
          aoSalvar={salvar}
          aoCancelar={() => setFormulario(null)}
        />
      )}

      {linhas.length > 0 && (
        <Stack space="space.100">
          <Strong>
            {preencher(t('painel.lista.titulo', 'Your time on this item: {0} in {1}'), [
              formatarDuracao(apontamentos.totalSegundos),
              linhas.length === 1
                ? t('painel.lista.umaEntrada', '1 entry')
                : preencher(t('painel.lista.entradas', '{0} entries'), [linhas.length]),
            ])}
          </Strong>

          {!apontamentos.completo && (
            <Text>
              {t(
                'painel.lista.cortada',
                'Showing the most recent entries only — this item has more than Nativelog lists here.'
              )}
            </Text>
          )}

          {linhas.map((linha) => (
            <Stack key={linha.id} space="space.050">
              <Inline space="space.100" alignBlock="center">
                <Strong>{linha.duracao}</Strong>
                <Text>{quandoLegivel(linha.started)}</Text>
              </Inline>
              {linha.comentario && <Text>{linha.comentario}</Text>}

              {apagando === linha.id ? (
                <Inline space="space.100" alignBlock="center">
                  {/* O dado é do Jira: apagar aqui apaga lá, sem lixeira. */}
                  <Text>{t('painel.apagar.pergunta', 'Delete this entry from Jira?')}</Text>
                  <Button appearance="danger" onClick={() => apagar(linha.id)} isDisabled={ocupado}>
                    {t('painel.apagar.sim', 'Delete')}
                  </Button>
                  <Button appearance="subtle" onClick={() => setApagando(null)} isDisabled={ocupado}>
                    {t('painel.apagar.nao', 'Keep')}
                  </Button>
                </Inline>
              ) : (
                // `Inline` e não `ButtonGroup`: dentro da lista, o grupo se
                // esticava na largura toda e os dois botões ficavam longe da
                // linha a que pertencem.
                <Inline space="space.050">
                  {/* Permissão de worklog próprio pode ter sido removida depois
                      de a entrada existir. Mostrar o botão seria prometer o que
                      o Jira vai recusar. */}
                  {estado?.permissoes?.podeEditar !== false && (
                    <Button appearance="subtle" onClick={() => abrirEdicao(linha)} isDisabled={ocupado}>
                      {t('painel.editar', 'Edit')}
                    </Button>
                  )}
                  {estado?.permissoes?.podeApagar !== false && (
                    <Button appearance="subtle" onClick={() => setApagando(linha.id)} isDisabled={ocupado}>
                      {t('painel.apagar.sim', 'Delete')}
                    </Button>
                  )}
                </Inline>
              )}
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    {/* O provider carrega o idioma de quem está olhando. Sem ele o `t` ainda
        funciona e devolve o inglês embutido — a tela nunca mostra a chave crua. */}
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
