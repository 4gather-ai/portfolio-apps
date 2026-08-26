// SPIKE — código descartável. Prova (ou derruba) a cunha do App 1.
import api, { route } from '@forge/api';
import Resolver from '@forge/resolver';

const resolver = new Resolver();

const SPIKE_SECONDS = 10800; // 3h

const adf = (text) => ({
  type: 'doc',
  version: 1,
  content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
});

// Jira exige started no formato yyyy-MM-dd'T'HH:mm:ss.SSSZ com offset numérico.
const jiraDate = (d) => d.toISOString().replace('Z', '+0000');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Conta itens que o JQL nativo devolve para "eu apontei tempo aqui".
async function jqlCount(issueKey) {
  try {
    const jql = `issue = ${issueKey} AND worklogAuthor = currentUser()`;
    const r = await api.asUser().requestJira(route`/rest/api/3/search/jql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ jql, maxResults: 5, fields: ['key'] }),
    });
    const body = await r.text();
    if (!r.ok) return { erro: `HTTP ${r.status} — ${body.slice(0, 200)}` };
    const issues = JSON.parse(body).issues || [];
    return { n: issues.length, keys: issues.map((i) => i.key).join(', ') || 'vazio' };
  } catch (e) {
    return { erro: `exceção: ${e.message}` };
  }
}

async function apagar(issueKey, worklogId, step) {
  try {
    const r = await api.asUser().requestJira(
      route`/rest/api/3/issue/${issueKey}/worklog/${worklogId}`,
      { method: 'DELETE' }
    );
    step('Limpeza (DELETE worklog)', r.ok, `HTTP ${r.status}`);
  } catch (e) {
    step('Limpeza (DELETE worklog)', false, `exceção: ${e.message} — apagar à mão o worklog ${worklogId}`);
  }
}

resolver.define('runSpike', async (req) => {
  const out = [];
  const step = (name, ok, detail) => out.push({ name, ok, detail: String(detail) });

  const issueKey =
    (req && req.context && req.context.extension && req.context.extension.issue &&
      req.context.extension.issue.key) || 'SCRUM-1';
  step('contexto', true, `item = ${issueKey}`);

  // ── 0. Existe contexto de usuário?
  let me;
  try {
    const r = await api.asUser().requestJira(route`/rest/api/3/myself`);
    if (!r.ok) {
      step('0. asUser() /myself', false, `HTTP ${r.status} — sem contexto de usuário`);
      return out;
    }
    me = await r.json();
    step('0. asUser() /myself', true, `${me.displayName} · ${me.accountId}`);
  } catch (e) {
    step('0. asUser() /myself', false, `exceção: ${e.message}`);
    return out;
  }

  // ── 1. A PERGUNTA CENTRAL: asUser cria worklog, com início retroativo?
  const started = jiraDate(new Date(Date.now() - 2 * 60 * 60 * 1000));
  let worklogId = null;
  let authorAccountId = null;
  try {
    const r = await api.asUser().requestJira(route`/rest/api/3/issue/${issueKey}/worklog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        timeSpentSeconds: SPIKE_SECONDS,
        started,
        comment: adf('spike asUser — apagar'),
      }),
    });
    const body = await r.text();
    if (!r.ok) {
      step('1. POST worklog asUser', false, `HTTP ${r.status} — ${body.slice(0, 300)}`);
      return out;
    }
    const wl = JSON.parse(body);
    worklogId = wl.id;
    authorAccountId = wl.author && wl.author.accountId;
    step(
      '1. POST worklog asUser',
      true,
      `HTTP ${r.status} · id=${wl.id} · started=${wl.started} · autor=${wl.author && wl.author.displayName}`
    );
  } catch (e) {
    step('1. POST worklog asUser', false, `exceção: ${e.message}`);
    return out;
  }

  // ── 2. O autor é a PESSOA ou o app? (o defeito do Tempo)
  const autorOk = authorAccountId === me.accountId;
  step(
    '2. Autor == usuário real',
    autorOk,
    autorOk
      ? `${authorAccountId} — worklog é da pessoa`
      : `worklog=${authorAccountId} vs usuário=${me.accountId} — CUNHA MORTA`
  );

  // ── 3. O JQL nativo enxerga? Com retentativa: o JQL depende do índice de
  // busca do Jira, que é assíncrono. Uma leitura imediata pode vir vazia
  // mesmo com o dado correto — é isso que queremos distinguir.
  const t0 = Date.now();
  let jqlOk = false;
  for (let tentativa = 1; tentativa <= 5; tentativa++) {
    const r2 = await jqlCount(issueKey);
    if (r2.erro) {
      step('3. JQL worklogAuthor = currentUser()', false, `tentativa ${tentativa}: ${r2.erro}`);
      break;
    }
    if (r2.n > 0) {
      jqlOk = true;
      step(
        '3. JQL worklogAuthor = currentUser()',
        true,
        `achou na tentativa ${tentativa}, após ${Math.round((Date.now() - t0) / 100) / 10}s — ${r2.keys}`
      );
      break;
    }
    if (tentativa === 5) {
      step(
        '3. JQL worklogAuthor = currentUser()',
        false,
        `0 itens após 5 tentativas em ${Math.round((Date.now() - t0) / 100) / 10}s — índice ainda não pegou`
      );
    } else {
      await sleep(2500);
    }
  }

  // ── 4. O painel de tempo nativo reflete?
  try {
    const r = await api.asUser().requestJira(
      route`/rest/api/3/issue/${issueKey}?fields=timetracking,timespent`
    );
    const j = await r.json();
    const spent = (j.fields && j.fields.timespent) || 0;
    step(
      '4. Painel nativo (timespent)',
      spent >= SPIKE_SECONDS,
      `timespent=${spent}s · timetracking=${JSON.stringify((j.fields && j.fields.timetracking) || {})}`
    );
  } catch (e) {
    step('4. Painel nativo (timespent)', false, `exceção: ${e.message}`);
  }

  // ── 5. Limpeza. Se o JQL ainda não achou, NÃO apaga: deixa o worklog vivo
  // para a segunda fase confirmar se era só atraso de índice.
  if (worklogId && jqlOk) {
    await apagar(issueKey, worklogId, step);
  } else if (worklogId) {
    step(
      '5. Limpeza adiada',
      true,
      `worklog ${worklogId} mantido de propósito — use "Verificar de novo e limpar"`
    );
  }

  return { rows: out, worklogId, issueKey, jqlOk };
});

// Segunda fase: roda o JQL de novo (agora com o índice tendo tido tempo) e
// só então apaga o worklog.
resolver.define('recheck', async (req) => {
  const out = [];
  const step = (name, ok, detail) => out.push({ name, ok, detail: String(detail) });
  const { worklogId, issueKey } = req.payload || {};
  if (!worklogId || !issueKey) {
    step('recheck', false, 'sem worklogId/issueKey — rode o spike primeiro');
    return { rows: out };
  }

  const r = await jqlCount(issueKey);
  if (r.erro) {
    step('3b. JQL (segunda passada)', false, r.erro);
  } else {
    step(
      '3b. JQL (segunda passada)',
      r.n > 0,
      r.n > 0
        ? `${r.n} item(ns) — ${r.keys} · era atraso de índice, o dado está certo`
        : '0 itens — NÃO é atraso de índice; investigar'
    );
  }

  await apagar(issueKey, worklogId, step);
  return { rows: out };
});

export const handler = resolver.getDefinitions();
