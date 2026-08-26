/**
 * Nativelog — o formulário de apontamento manual, sem React.
 *
 * Aqui mora a conversão entre o que a tela mostra (um dia e uma hora, no fuso
 * de quem está olhando) e o que o Jira guarda (um instante absoluto). **É o
 * ponto do app onde erro de fuso vira hora lançada no dia errado**, então é
 * lógica pura e testada, e não três linhas escondidas dentro de um `onClick`.
 *
 * A regra: **o navegador é a única coisa que sabe o fuso da pessoa.** O
 * resolver do Forge roda em UTC e não tem como adivinhar que "14:30" era
 * 14:30 em São Paulo. Por isso a montagem do instante acontece aqui, e o
 * servidor recebe um instante absoluto já resolvido.
 */

const doisDigitos = (n) => String(n).padStart(2, '0');

/** 'YYYY-MM-DD' do dia local — é o formato que o DatePicker usa. */
export function paraDataLocal(date) {
  return `${date.getFullYear()}-${doisDigitos(date.getMonth() + 1)}-${doisDigitos(date.getDate())}`;
}

/** 'HH:mm' local — o formato do TimePicker. */
export function paraHoraLocal(date) {
  return `${doisDigitos(date.getHours())}:${doisDigitos(date.getMinutes())}`;
}

/**
 * Junta o dia e a hora escolhidos **no fuso local** e devolve o instante
 * absoluto em ISO. Devolve null quando falta ou não dá para entender algo —
 * nunca chuta uma data, porque a data chutada vira hora no dia errado.
 */
export function paraInstante(data, hora) {
  if (typeof data !== 'string') return null;

  const dia = data.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dia) return null;

  // Hora vazia vale meia-noite: alguém que lança um dia inteiro e não se
  // importa com o horário não deve ser obrigado a inventar um.
  const texto = typeof hora === 'string' && hora.trim() ? hora.trim() : '00:00';
  const relogio = texto.match(/^(\d{1,2}):(\d{2})$/);
  if (!relogio) return null;

  const [, ano, mes, diaDoMes] = dia.map(Number);
  const h = Number(relogio[1]);
  const m = Number(relogio[2]);
  if (h > 23 || m > 59) return null;

  // `new Date(ano, mes, dia, ...)` interpreta no fuso local, que é exatamente
  // o que queremos: 14:30 significa 14:30 para quem digitou.
  const instante = new Date(ano, mes - 1, diaDoMes, h, m, 0, 0);
  if (Number.isNaN(instante.getTime())) return null;

  // O construtor "conserta" 31/02 virando 03/03 em silêncio. Se o que voltou
  // não é o dia pedido, a data não existia.
  if (instante.getMonth() !== mes - 1 || instante.getDate() !== diaDoMes) return null;

  return instante.toISOString();
}

/** O caminho de volta: instante absoluto vira o dia e a hora da tela. */
export function deInstante(iso) {
  const instante = new Date(iso);
  if (Number.isNaN(instante.getTime())) return null;
  return { data: paraDataLocal(instante), hora: paraHoraLocal(instante) };
}

/**
 * Formulário em branco, já apontando para agora.
 *
 * O padrão é hoje, na hora atual, porque o lançamento manual mais comum é
 * "acabei de fazer isso e esqueci de ligar o cronômetro". Quem está lançando a
 * sexta esquecida muda a data — um campo, não quatro.
 */
export function formularioVazio(agora = new Date()) {
  return {
    id: null,
    duracao: '',
    data: paraDataLocal(agora),
    hora: paraHoraLocal(agora),
    comentario: '',
  };
}

/**
 * Formulário preenchido a partir de um apontamento existente, para corrigir.
 *
 * Traz o comentário de volta junto: editar a duração não pode apagar a
 * descrição que a pessoa escreveu.
 */
export function formularioDe(apontamento, agora = new Date()) {
  const quando = deInstante(apontamento?.started) || {
    data: paraDataLocal(agora),
    hora: paraHoraLocal(agora),
  };
  return {
    id: apontamento?.id || null,
    duracao: apontamento?.duracao || '',
    data: quando.data,
    hora: quando.hora,
    comentario: apontamento?.comentario || '',
  };
}

/**
 * O que enviar ao servidor, ou o motivo de não dar para enviar.
 *
 * Só faz a parte que **precisa** do navegador — montar o instante a partir do
 * fuso local. A validação de verdade (duração legível, mínimo, máximo, futuro)
 * é a do servidor, em `lib/apontamento.js`, e não é repetida aqui: regra
 * duplicada é regra que sai de sincronia.
 */
export function paraEnvio(formulario) {
  const iniciadoEm = paraInstante(formulario?.data, formulario?.hora);
  if (!iniciadoEm) return { ok: false, motivo: 'inicio-invalido' };

  return {
    ok: true,
    payload: {
      worklogId: formulario.id || undefined,
      duracao: formulario.duracao,
      iniciadoEm,
      comentario: formulario.comentario,
    },
  };
}
