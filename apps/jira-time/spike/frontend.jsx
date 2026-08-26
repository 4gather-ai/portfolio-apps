// SPIKE — código descartável.
// Substitui o conteúdo de src/frontend/index.jsx do template jira-issue-panel.

import React, { useState } from 'react';
import ForgeReconciler, { Button, Text, Stack, Strong, Inline, Lozenge } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      setRows(await invoke('runSpike'));
    } catch (e) {
      setRows([{ name: 'falha na invocação', ok: false, detail: e.message }]);
    }
    setBusy(false);
  };

  return (
    <Stack space="space.150">
      <Text>
        <Strong>Spike asUser</Strong> — cria um worklog de 3h com início 2h atrás, confere autor,
        JQL nativo e painel de tempo, e apaga o worklog no fim.
      </Text>
      <Button appearance="primary" isDisabled={busy} onClick={run}>
        {busy ? 'Rodando…' : 'Rodar spike'}
      </Button>
      {rows &&
        rows.map((r, i) => (
          <Inline key={i} space="space.100" alignBlock="center">
            <Lozenge appearance={r.ok ? 'success' : 'removed'}>{r.ok ? 'OK' : 'FALHOU'}</Lozenge>
            <Text>
              <Strong>{r.name}</Strong> — {r.detail}
            </Text>
          </Inline>
        ))}
    </Stack>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
