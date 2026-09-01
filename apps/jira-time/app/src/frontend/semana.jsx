import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  Label,
  TextArea,
  Toggle,
  useTranslation,
} from '@forge/react';
import { invoke } from '@forge/bridge';
import { agruparPorDia, chaveDoDia, formatarDuracao, limitesDaSemana } from '../lib/time.js';
import { filtrarProjetos, paraCSV, projetosDe } from '../lib/csv.js';
import { porPessoa, totalDoTime } from './equipeUi.js';
import { FormularioApontamento } from './FormularioApontamento.jsx';
import { formularioDe, formularioNoDia, paraEnvio } from './formulario.js';
import { mensagemDaSemana, mensagemDoApontamento, preencher } from './mensagens.js';
import { aindaPendentes, diasDaSemana, semanaVisivel, tituloDaSemana } from './semanaUi.js';

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
  // D15 — lançar a partir da folha. `lancando` guarda a chave do dia em que o
  // formulário está aberto: é o que faz o painel nascer dentro da coluna certa
  // em vez de no topo, e o que garante que só existe um aberto por vez.
  const [lancando, setLancando] = useState(null);
  const [itemEscolhido, setItemEscolhido] = useState(null);
  const [sugestoes, setSugestoes] = useState([]);
  const [buscandoItens, setBuscandoItens] = useState(false);
  const [sugestoesParciais, setSugestoesParciais] = useState(false);
  /**
   * O que acabou de ser lançado e a busca ainda não enxerga.
   *
   * **Visto no navegador em 01/09, e é o defeito que só o navegador acha.** A
   * folha é remontada por JQL, e o índice de busca do Jira atrasa alguns
   * segundos (medido: ~5,7 s no spike). Então gravar dava certo, o formulário
   * fechava, e o dia continuava dizendo "nothing logged" logo abaixo de uma
   * mensagem verde de sucesso. **Numa folha de ponto isso não é um atraso, é um
   * convite a lançar de novo** — e o segundo lançamento é um worklog duplicado
   * que ninguém pediu.
   *
   * Não é cópia de dados: é a resposta da escrita que acabamos de fazer, e ela
   * sai da tela sozinha assim que a busca devolve a mesma entrada.
   */
  const [recemLancadas, setRecemLancadas] = useState([]);
  // O `setTimeout` da busca com atraso, e um selo que descarta resposta velha.
  const buscaAgendada = useRef(null);
  const buscaMaisRecente = useRef(0);
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
   * A entrada recém-lançada sai da mão assim que a busca passa a devolvê-la.
   *
   * Sem esta limpeza, ela seria mostrada para sempre a partir de um estado
   * nosso — e aí sim seria uma segunda cópia dos dados, que é exatamente o que
   * este app não tem.
   */
  useEffect(() => {
    if (!dados?.entradas?.length) return;
    setRecemLancadas((antigas) => aindaPendentes(antigas, dados.entradas));
  }, [dados]);

  /**
   * D15 — as sugestões do seletor de item.
   *
   * `selo` descarta resposta atrasada: digitar "log" dispara três buscas, e
   * elas não voltam em ordem. Sem isso, a lista de "l" chega depois da de "log"
   * e a tela mostra o resultado da letra errada — defeito clássico de
   * type-ahead, e daqueles que só aparecem com rede lenta.
   */
  const buscarItens = useCallback(async (texto) => {
    const selo = buscaMaisRecente.current + 1;
    buscaMaisRecente.current = selo;
    setBuscandoItens(true);

    try {
      const r = await invoke('sugerirItens', { texto });
      if (buscaMaisRecente.current !== selo) return;
      setSugestoes(r?.itens || []);
      setSugestoesParciais(Boolean(r?.parcial) || !r?.ok);
    } catch (e) {
      if (buscaMaisRecente.current !== selo) return;
      setSugestoes([]);
      setSugestoesParciais(true);
    }
    if (buscaMaisRecente.current === selo) setBuscandoItens(false);
  }, []);

  /** Digitar não busca a cada tecla: espera a pessoa parar. */
  const buscarComAtraso = useCallback(
    (texto) => {
      if (buscaAgendada.current) clearTimeout(buscaAgendada.current);
      buscaAgendada.current = setTimeout(() => buscarItens(texto), 300);
    },
    [buscarItens]
  );

  // Timer pendente ao sair da página é vazamento e, pior, um `setState` depois
  // do desmonte. O `estado.js` do painel aprendeu isso no D3.1.
  useEffect(() => () => {
    if (buscaAgendada.current) clearTimeout(buscaAgendada.current);
  }, []);

  /**
   * Abrir o formulário de lançamento na coluna de um dia.
   *
   * Fecha edição e confirmação de apagar antes: dois formulários abertos sobre
   * a mesma folha é a forma mais fácil de alguém gravar no lugar errado.
   */
  const abrirLancamento = (chaveDoDiaAlvo) => {
    setAviso(null);
    setEditando(null);
    setApagando(null);
    setItemEscolhido(null);
    setSugestoes([]);
    setSugestoesParciais(false);
    setLancando(chaveDoDiaAlvo);
    // Já carrega os recentes: seletor que abre vazio manda a pessoa de volta ao
    // item, que é justamente o que esta tela existe para evitar.
    buscarItens('');
  };

  const fecharLancamento = () => {
    setLancando(null);
    setItemEscolhido(null);
    setSugestoes([]);
  };

  /**
   * D15 — gravar uma entrada nova a partir da folha.
   *
   * Vai pelo **mesmo resolver do painel do item** (`apontarManual`), com o item
   * no payload porque a página global não está dentro de item nenhum. A
   * identidade continua vindo do contexto do Forge, e a escrita é `asUser`:
   * isto só alcança item em que a pessoa já poderia apontar pelo Jira.
   */
  const lancar = async (valores) => {
    if (!itemEscolhido) {
      setAviso({ tipo: 'error', texto: t('semana.escolhaItem', 'Choose a work item first.') });
      return;
    }

    const envio = paraEnvio(valores);
    if (!envio.ok) {
      setAviso({ tipo: 'error', texto: t(...mensagemDoApontamento(envio.motivo)) });
      return;
    }

    setOcupado(true);
    setAviso(null);
    try {
      const r = await invoke('apontarManual', {
        ...envio.payload,
        // Sem `worklogId`: este caminho cria, não corrige.
        worklogId: undefined,
        issueId: itemEscolhido.issueId,
        issueKey: itemEscolhido.issueKey,
      });

      if (!r?.ok) {
        // Não fecha: fechar joga fora o que a pessoa digitou justo quando ela
        // precisa corrigir e reenviar.
        setAviso({ tipo: 'error', texto: t(...mensagemDoApontamento(r?.motivo)) });
      } else {
        // A entrada fica visível já, com o id de verdade que o Jira devolveu —
        // então Edit e Delete funcionam nela antes mesmo de a busca a enxergar.
        if (r.worklog?.id) {
          setRecemLancadas((antigas) => [
            ...antigas.filter((e) => e.id !== String(r.worklog.id)),
            {
              id: String(r.worklog.id),
              issueId: itemEscolhido.issueId,
              issueKey: r.issueKey || itemEscolhido.issueKey,
              titulo: itemEscolhido.titulo,
              started: r.worklog.started,
              segundos: r.worklog.segundos,
              duracao: r.worklog.duracao,
              comentario: valores.comentario || '',
            },
          ]);
        }
        fecharLancamento();
        setAviso({
          tipo: 'success',
          texto: preencher(t('semana.lancado', '{0} logged on {1}.'), [
            r.worklog?.duracao,
            r.issueKey || itemEscolhido.issueKey,
          ]),
        });
      }
    } catch (e) {
      setAviso({ tipo: 'error', texto: t(...mensagemDoApontamento()) });
    }

    // A folha se remonta do Jira: o total do dia se move sozinho, e a entrada
    // nova aparece na coluna certa sem nós a inserirmos na lista à mão.
    await carregar(deslocamento);
    setOcupado(false);
  };

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

  // A busca mais o que acabou de ser lançado e ela ainda não enxerga. A regra
  // e o motivo estão em `semanaUi.js`, com teste — defeito de estado de tela
  // sem teste volta.
  const entradas = semanaVisivel(dados?.entradas, recemLancadas, dados);
  // Agrupamento no fuso local — ver o comentário no topo.
  const { porDia, total } = agruparPorDia(
    entradas.map((e) => ({ started: e.started, timeSpentSeconds: e.segundos }))
  );
  const dias = dados ? diasDaSemana(dados.inicio) : [];
  const diasDoTime = time ? diasDaSemana(time.inicio) : [];
  const linhasDoTime = time
    ? porPessoa(time.entradas, diasDoTime, t('semana.autorDesconhecido', 'Unknown user'))
    : [];
  /**
   * Em que dia o botão do topo abre.
   *
   * **Hoje, se hoje estiver na semana que está na tela. Senão, o primeiro dia
   * dela.** O caso que isto evita é silencioso e feio: olhando a semana
   * passada, clicar em "Add entry" com data de hoje grava numa semana que não
   * está na tela — a entrada some do olho da pessoa no instante em que grava, e
   * ela lança de novo achando que falhou.
   */
  const hoje = new Date();
  const diaPadrao =
    dias.find((d) => chaveDoDia(d.data) === chaveDoDia(hoje)) || dias[0] || null;

  const projetos = projetosDe(entradas);
  const paraExportar = filtrarProjetos(entradas, { modo: 'excluir', chaves: projetosFora });
  const csv = exportando ? paraCSV(paraExportar) : '';

  /**
   * O painel de lançamento, desenhado dentro da coluna do dia.
   *
   * **O seletor de item vem antes do formulário e fora dele, de propósito.** O
   * `useForm` do `@forge/react` registra campos não-controlados; o item, que é
   * o único valor que precisa viver em `useState` (porque a busca o alimenta de
   * fora), ficaria sendo a exceção controlada dentro de um formulário
   * não-controlado. Separar deixa cada metade com uma regra só.
   */
  const painelDeLancamento = (chaveDoDiaAlvo) => (
    <Stack space="space.100">
      <Label labelFor="nativelog-item">{t('semana.item', 'Work item')}</Label>
      <Select
        id="nativelog-item"
        inputId="nativelog-item"
        isSearchable
        isLoading={buscandoItens}
        placeholder={t('semana.buscarItem', 'Type a key or part of the summary')}
        options={sugestoes.map((i) => ({
          label: `${i.issueKey} ${i.titulo}`.trim(),
          value: i.issueKey,
        }))}
        value={
          itemEscolhido
            ? {
                label: `${itemEscolhido.issueKey} ${itemEscolhido.titulo}`.trim(),
                value: itemEscolhido.issueKey,
              }
            : null
        }
        /* Só busca; nunca devolve o texto para o campo. Passar `inputValue` de
           volta a cada tecla é o defeito que engoliu o formulário no D4 — no
           UI Kit 2 o componente é desenhado do outro lado de uma ponte
           assíncrona, e o valor do re-render chega depois da tecla seguinte. */
        onInputChange={(texto) => buscarComAtraso(texto || '')}
        onChange={(opcao) =>
          setItemEscolhido(sugestoes.find((i) => i.issueKey === opcao?.value) || null)
        }
      />

      {/* Lista vazia sem explicação faz a pessoa achar que não tem item. */}
      {sugestoesParciais && (
        <Text>
          {t(
            'semana.itensParciais',
            "Jira didn't return suggestions just now. Type the item key in full and it will still be found."
          )}
        </Text>
      )}
      {!buscandoItens && !sugestoesParciais && sugestoes.length === 0 && (
        <Text>{t('semana.semItens', 'No work items matched. Try fewer words, or the item key.')}</Text>
      )}

      {/* `key` com o dia: os campos são não-controlados, e sem ela abrir o
          formulário numa segunda coluna reaproveitaria a data da primeira. */}
      <FormularioApontamento
        key={`novo-${chaveDoDiaAlvo}`}
        inicial={formularioNoDia(chaveDoDiaAlvo)}
        titulo={t('semana.lancar', 'Log time')}
        ocupado={ocupado}
        aoSalvar={lancar}
        aoCancelar={fecharLancamento}
      />
    </Stack>
  );

  return (
    <Stack space="space.200">
      {/* Dois níveis de título: o que a tela é, e de que semana ela fala.
          Sem isso, quem navega por cabeçalho só encontra um intervalo de datas
          e não sabe em que aba está. */}
      <Heading as="h2">
        {aba === 'time' ? t('semana.time', 'Team') : t('semana.minha', 'My week')}
      </Heading>
      <Heading as="h3">
        {dados ? tituloDaSemana(dados.inicio, dados.fim) : t('semana.carregando', 'Loading your week')}
      </Heading>

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
                      {dia.rotulo}:{' '}
                      {pessoa.dias[i] > 0
                        ? formatarDuracao(pessoa.dias[i])
                        : t('semana.diaVazio', 'nothing logged')}
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
        {/* D15 — lançar sem sair da folha. É a razão de a tela existir: quem
            precisa abrir o item para apontar não ganhou nada com a semana. */}
        <Button
          appearance="primary"
          onClick={() => diaPadrao && abrirLancamento(chaveDoDia(diaPadrao.data))}
          isDisabled={ocupado || carregando || !diaPadrao}
        >
          {t('semana.novaEntrada', 'Add entry')}
        </Button>
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
              {/* Travessão sozinho não é texto: um leitor de tela lê "traço"
                  ou nada. Dia vazio diz que está vazio. */}
              <Text>
                {segundosDoDia > 0
                  ? formatarDuracao(segundosDoDia)
                  : t('semana.diaVazio', 'nothing logged')}
              </Text>
              {/* O atalho de cada coluna. O rótulo repete o dia porque um "+"
                  solto, para um leitor de tela, é sete botões chamados "mais". */}
              <Button
                appearance="subtle"
                onClick={() =>
                  lancando === chave ? fecharLancamento() : abrirLancamento(chave)
                }
                isDisabled={ocupado}
              >
                {preencher(t('semana.lancarNoDia', 'Log time on {0}'), [dia.rotulo])}
              </Button>
            </Inline>

            {lancando === chave && painelDeLancamento(chave)}

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
                      <Label labelFor={`projeto-${p.chave}`}>
                        {p.nome} ({p.chave})
                      </Label>
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
                  <Label labelFor="nativelog-csv">{t('csv.rotulo', 'CSV to copy')}</Label>
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
