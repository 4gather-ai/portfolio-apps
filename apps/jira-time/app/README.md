# Nativelog

Time tracking for Jira Cloud, built on Forge.

**The Jira worklog is the source of truth. There is no second copy.**

Every hour Nativelog records is a native Jira worklog, written **as the person**, not as the app. That is the whole product: `worklogAuthor = currentUser()` finds the time, the native Work log tab shows it, and if the app is uninstalled tomorrow the data stays exactly where it was. Nothing is mirrored, synchronised or reconciled.

The only thing that lives in Forge storage is the **timer in progress** — the one piece of state Jira has nowhere to put. When the timer stops, it becomes a worklog and the stored record disappears.

## What it does today

- **Timer** in the work item panel: start, stop, discard — one timer per person, across every item
- **Manual entry**: duration in Jira notation (`1h 30m`, `45m`, `2`), the day and time you choose, an optional description
- **Correct and delete your own entries**, from the same panel

## Layout

```
src/
  lib/
    time.js         durations, Jira's date format, the running clock
    timer.js        timer state machine (storage injected)
    worklog.js      reading and writing the native worklog (`pedir` injected)
    apontamento.js  validation for manual entries
  resolvers/
    painel.js       what a click does on the server — everything that can go wrong
    index.js        wiring ONLY: this is where the real KVS and asUser() are bound
  frontend/
    index.jsx       the component tree and its wiring
    estado.js       optimistic clock, when to re-read, what changed elsewhere
    formulario.js   local day + time ⇄ absolute instant
    mensagens.js    a technical reason becomes a sentence a person understands
```

`src/resolvers/index.js` is the only file that imports Forge. Everything else runs under Vitest with no platform mocking — which is what makes it possible to genuinely test "Jira returned 503 halfway through stopping the timer".

## Rules that don't get broken without a discussion

1. **`asUser()`, always.** It is what makes the worklog carry the person's identity.
2. **Read worklogs through the issue endpoint** (`/issue/{id}/worklog`). **JQL is for broad search only**, never for confirming something just written — Jira's search index lags by ~5.7s, measured.
3. **Write first, delete the timer after.** If the write fails the timer stays up. Losing time somebody measured is the worst possible outcome for a time tracker.
4. **Only your own entry** can be edited or deleted, and the check runs on the **server**. Jira's own permission does not cover this rule.
5. **No controlled form fields.** In UI Kit 2 that swallows what the user types — use `useForm` from `@forge/react`.
6. **`@forge/kvs`**, not `storage` from `@forge/api` (deprecated; `forge lint` fails it).

Longer rationale for each in `../STATUS.md` and `../../../DECISOES.md`.

## Working on it

Node is not on PATH on the build machine, so use full paths:

```bash
"/c/Program Files/nodejs/npm.cmd" run check                  # lint + tests
"/c/Program Files/nodejs/npm.cmd" run test:watch
"/c/Program Files/nodejs/npx.cmd" forge lint
"/c/Program Files/nodejs/npx.cmd" forge deploy --non-interactive
```

The app is already installed on `northstack-dev.atlassian.net`; while the manifest's scopes don't change, deploying is enough — no reinstall.

**Finish every milestone with the app open in the browser**, running the main path on the real instance. Three defects in one day got through green tests and a clean lint because they were platform behaviour, not logic. See rule 17 in the root `CLAUDE.md`.

## Documentation

| File | What's in it |
|---|---|
| `../STATUS.md` | app state: done, next, blockers, what needs a human |
| `../PLANO-V1.md` | the 14 milestones and the architecture behind them |
| `../LISTING.md` | the Marketplace listing — written before the code, on purpose |
| `../../../DECISOES.md` | decisions, with the date and the reason |
| `AGENTS.md` | Forge guidance for agents, plus this project's own rules |
