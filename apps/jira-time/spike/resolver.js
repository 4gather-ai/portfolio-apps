// SPIKE — código descartável. Não é a base do produto.
// Objetivo: provar (ou derrubar) a cunha do App 1.
// Substitui o conteúdo de src/resolvers/index.js do template jira-issue-panel.

import api, { route } from '@forge/api';
import Resolver from '@forge/resolver';

const resolver = new Resolver();

// Projeto de teste da dev site northstack-dev: chave SCRUM.
const ISSUE_KEY = 'SCRUM-1';
const SPIKE_SECONDS = 10800; // 3h — o mesmo número do critério de "pronto" da v1

const adf = (text) => ({
  type: 'doc',
  version: 1,
  content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
});

// Jira exige started no formato yyyy-MM-dd'T'HH:mm:ss.SSSZ com offset numérico.
const jiraDate = (d) => d.toISOString().replace('Z', '+0000');

resolver.define('runSpike', async () => {
  const out = [];
  const step = (name, ok, detail) => out.push({ name, ok, detail: String(detail) });

  // ── 0. Contexto de usuário funciona?
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

  // ── 1. A PERGUNTA CENTRAL: asUser consegue CRIAR worklog?
  // Início retroativo (2h atrás), como no desenho do timer: grava só o início,
  // e o worklog nasce no "parar", com started no passado.
  const started = jiraDate(new Date(Date.now() - 2 * 60 * 60 * 1000));
  let worklogId = null;
  let authorAccountId = null;
  try {
    const r = await api.asUser().requestJira(
      route`/rest/api/3/issue/${ISSUE_KEY}/worklog`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          timeSpentSeconds: SPIKE_SECONDS,
          started,
          comment: adf('spike asUser — apagar'),
        }),
      }
    );
    const body = await r.text();
    if (!r.ok) {
      step('1. POST worklog asUser', false, `HTTP ${r.status} — ${body.slice(0, 300)}`);
      return out; // sem worklog não há o que verificar adiante
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

  // ── 2. O autor é a PESSOA, ou é o app? (o defeito do Tempo)
  step(
    '2. Autor == usuário real',
    authorAccountId === me.accountId,
    authorAccountId === me.accountId
      ? `${authorAccountId} — worklog é da pessoa`
      : `worklog=${authorAccountId} vs usuário=${me.accountId} — CUNHA MORTA`
  );

  // ── 3. O JQL nativo enxerga? É isso que quebra nos concorrentes.
  try {
    const jql = `issue = ${ISSUE_KEY} AND worklogAuthor = currentUser()`;
    const r = await api.asUser().requestJira(route`/rest/api/3/search/jql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ jql, maxResults: 5, fields: ['key'] }),
    });
    const body = await r.text();
    if (!r.ok) {
      step('3. JQL worklogAuthor = currentUser()', false, `HTTP ${r.status} — ${body.slice(0, 200)}`);
    } else {
      const j = JSON.parse(body);
      const n = (j.issues || []).length;
      step('3. JQL worklogAuthor = currentUser()', n > 0, `${n} item(ns) — ${(j.issues || []).map((i) => i.key).join(', ') || 'vazio'}`);
    }
  } catch (e) {
    step('3. JQL worklogAuthor = currentUser()', false, `exceção: ${e.message}`);
  }

  // ── 4. O painel de tempo nativo do Jira reflete?
  try {
    const r = await api.asUser().requestJira(
      route`/rest/api/3/issue/${ISSUE_KEY}?fields=timetracking,timespent`
    );
    const j = await r.json();
    const spent = j.fields && j.fields.timespent;
    step(
      '4. Painel nativo (timespent)',
      spent >= SPIKE_SECONDS,
      `timespent=${spent}s · timetracking=${JSON.stringify((j.fields && j.fields.timetracking) || {})}`
    );
  } catch (e) {
    step('4. Painel nativo (timespent)', false, `exceção: ${e.message}`);
  }

  // ── 5. Limpeza: o spike não deixa lixo na dev site.
  if (worklogId) {
    try {
      const r = await api.asUser().requestJira(
        route`/rest/api/3/issue/${ISSUE_KEY}/worklog/${worklogId}`,
        { method: 'DELETE' }
      );
      step('5. Limpeza (DELETE worklog)', r.ok, `HTTP ${r.status}`);
    } catch (e) {
      step('5. Limpeza (DELETE worklog)', false, `exceção: ${e.message} — apagar à mão o worklog ${worklogId}`);
    }
  }

  return out;
});

export const handler = resolver.getDefinitions();
