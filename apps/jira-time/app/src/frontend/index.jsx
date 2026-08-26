import React, { useCallback, useEffect, useRef, useState } from 'react';
import ForgeReconciler, {
  Button,
  ButtonGroup,
  DatePicker,
  Form,
  FormFooter,
  FormHeader,
  FormSection,
  Inline,
  Label,
  Lozenge,
  SectionMessage,
  Spinner,
  Stack,
  Strong,
  Text,
  TextArea,
  Textfield,
  TimePicker,
  useForm,
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
import { formularioDe, formularioVazio, paraEnvio } from './formulario.js';
import { mensagemDeErro, mensagemDoApontamento, textoDoWorklog } from './mensagens.js';

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

/**
 * O formulário de apontamento.
 *
 * **Usa `useForm`, e isso não é preferência de estilo — é correção de um
 * defeito visto no navegador.** Na primeira versão os campos eram controlados
 * (`value` + `setState` a cada tecla) e **só a última letra do que se digitava
 * sobrevivia**: no UI Kit 2 o componente é desenhado pelo Jira, do outro lado
 * de uma ponte assíncrona, e o `value` que volta do re-render chega depois da
 * tecla seguinte e sobrescreve o que a pessoa acabou de escrever.
 *
 * `useForm` registra os campos como **não-controlados**: o valor mora no
 * formulário, digitar não provoca re-render, e nada é sobrescrito. É o caminho
 * que a própria Atlassian expõe para isso.
 */
const FormularioApontamento = ({ inicial, ocupado, aoSalvar, aoCancelar }) => {
  const { handleSubmit, register, getFieldId } = useForm({ defaultValues: inicial });

  return (
    <Form onSubmit={handleSubmit(aoSalvar)}>
      {/* `FormHeader` e não um `Strong` solto: dentro do `FormSection`, o texto
          solto encostava no primeiro rótulo e saía "Log timeTime spent". */}
      <FormHeader title={inicial.id ? 'Edit entry' : 'Log time'} />
      <FormSection>
        <Label labelFor={getFieldId('duracao')}>Time spent</Label>
        <Textfield placeholder="1h 30m" {...register('duracao', { required: true })} />

        <Label labelFor={getFieldId('data')}>Date started</Label>
        <DatePicker {...register('data', { required: true })} />

        <Label labelFor={getFieldId('hora')}>Time started</Label>
        {/* `timeIsEditable` porque a lista pronta só oferece de 30 em 30
            minutos, e trabalho não começa em número redondo. */}
        <TimePicker timeIsEditable {...register('hora')} />

        <Label labelFor={getFieldId('comentario')}>Description</Label>
        <TextArea placeholder="Optional" {...register('comentario')} />
      </FormSection>

      <FormFooter>
        <ButtonGroup>
          <Button type="submit" appearance="primary" isDisabled={ocupado}>
            {inicial.id ? 'Save changes' : 'Log time'}
          </Button>
          <Button appearance="subtle" onClick={aoCancelar} isDisabled={ocupado}>
            Cancel
          </Button>
        </ButtonGroup>
      </FormFooter>
    </Form>
  );
};

const App = () => {
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
    // O timer virou worklog: a lista logo abaixo estaria mentindo sem isto.
    await carregarApontamentos();
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
      setAviso({ tipo: 'error', texto: mensagemDoApontamento(envio.motivo) });
      return;
    }

    definirOcupado(true);
    setAviso(null);
    const editando = Boolean(formulario?.id);

    try {
      const r = await invoke(editando ? 'editarApontamento' : 'apontarManual', envio.payload);

      if (!r?.ok) {
        setAviso({ tipo: 'error', texto: mensagemDoApontamento(r?.motivo) });
      } else {
        // O formulário só fecha quando gravou. Fechar antes jogaria fora o que
        // a pessoa digitou justamente quando ela precisa corrigir e reenviar.
        setFormulario(null);
        setAviso({
          tipo: 'success',
          texto: editando
            ? `Entry updated to ${r.worklog?.duracao || ''}.`.replace('  ', ' ')
            : `Logged ${r.worklog?.duracao || ''}${r.issueKey ? ` to ${r.issueKey}` : ''}.`,
        });
      }
    } catch (erro) {
      setAviso({ tipo: 'error', texto: mensagemDoApontamento() });
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
        setAviso({ tipo: 'error', texto: mensagemDoApontamento(r?.motivo) });
      } else {
        setAviso({
          tipo: 'information',
          texto: r.jaNaoExistia
            ? 'That entry had already been deleted in Jira.'
            : 'Entry deleted from Jira.',
        });
        if (formulario?.id === id) setFormulario(null);
      }
    } catch (erro) {
      setAviso({ tipo: 'error', texto: mensagemDoApontamento() });
    }
    setApagando(null);
    await carregarApontamentos();
    definirOcupado(false);
  };

  if (!estado && !aviso) return <Spinner label="Loading timer" />;

  const timer = estado?.timer;
  const falhou = (timer?.tentativas || 0) > 0;
  const linhas = apontamentos?.apontamentos || [];

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
        {/* Sempre disponível, inclusive com o timer correndo: lançar a sexta
            esquecida não pode exigir parar o cronômetro de hoje. */}
        {!formulario && (
          <Button appearance="default" onClick={abrirNovo} isDisabled={ocupado}>
            Log time manually
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
            Your time on this item: {formatarDuracao(apontamentos.totalSegundos)} in{' '}
            {linhas.length} {linhas.length === 1 ? 'entry' : 'entries'}
          </Strong>

          {!apontamentos.completo && (
            <Text>Showing the most recent entries only — this item has more than Nativelog lists here.</Text>
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
                  <Text>Delete this entry from Jira?</Text>
                  <Button appearance="danger" onClick={() => apagar(linha.id)} isDisabled={ocupado}>
                    Delete
                  </Button>
                  <Button appearance="subtle" onClick={() => setApagando(null)} isDisabled={ocupado}>
                    Keep
                  </Button>
                </Inline>
              ) : (
                // `Inline` e não `ButtonGroup`: dentro da lista, o grupo se
                // esticava na largura toda e os dois botões ficavam longe da
                // linha a que pertencem.
                <Inline space="space.050">
                  <Button appearance="subtle" onClick={() => abrirEdicao(linha)} isDisabled={ocupado}>
                    Edit
                  </Button>
                  <Button appearance="subtle" onClick={() => setApagando(linha.id)} isDisabled={ocupado}>
                    Delete
                  </Button>
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
    <App />
  </React.StrictMode>
);
