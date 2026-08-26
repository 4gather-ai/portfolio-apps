// SPIKE — código descartável.
import React, { useState } from 'react';
import ForgeReconciler, { Text, Button, Strong } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const r = await invoke('runSpike');
      setRows(r);
    } catch (e) {
      setRows([{ name: 'falha na invocação', ok: false, detail: e.message }]);
    }
    setBusy(false);
  };

  return (
    <>
      <Text>
        <Strong>Spike asUser</Strong> — cria worklog de 3h com início 2h atrás, confere autor, JQL
        nativo e painel de tempo, e apaga no fim.
      </Text>
      <Button appearance="primary" isDisabled={busy} onClick={run}>
        {busy ? 'Rodando...' : 'Rodar spike'}
      </Button>
      {rows &&
        rows.map((r, i) => (
          <Text key={i}>
            {r.ok ? '[OK]' : '[FALHOU]'} <Strong>{r.name}</Strong> — {r.detail}
          </Text>
        ))}
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
