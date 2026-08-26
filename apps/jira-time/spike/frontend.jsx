// SPIKE — código descartável.
import React, { useState } from 'react';
import ForgeReconciler, { Text, Button, Strong } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [rows, setRows] = useState(null);
  const [pendente, setPendente] = useState(null); // { worklogId, issueKey }
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const r = await invoke('runSpike');
      setRows(r.rows);
      setPendente(r.jqlOk ? null : { worklogId: r.worklogId, issueKey: r.issueKey });
    } catch (e) {
      setRows([{ name: 'falha na invocação', ok: false, detail: e.message }]);
    }
    setBusy(false);
  };

  const recheck = async () => {
    setBusy(true);
    try {
      const r = await invoke('recheck', pendente);
      setRows((prev) => [...(prev || []), ...r.rows]);
      setPendente(null);
    } catch (e) {
      setRows((prev) => [...(prev || []), { name: 'falha no recheck', ok: false, detail: e.message }]);
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
      {pendente && (
        <>
          <Text>
            O JQL ainda não achou. Espere <Strong>30 a 60 segundos</Strong> e clique abaixo: se
            achar agora, era só atraso do índice de busca do Jira.
          </Text>
          <Button isDisabled={busy} onClick={recheck}>
            {busy ? 'Verificando...' : 'Verificar de novo e limpar'}
          </Button>
        </>
      )}
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
