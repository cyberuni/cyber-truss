# Command Center

Observe projects, coordinate work, and answer requests without taking over the session the
Council is working in.

This is the walking skeleton for [#6](https://github.com/cyberuni/cyber-truss/issues/6): a
host that finds providers, binds them, and renders what they report. It understands none
of their domains.

## Run it

From the repository root:

```bash
pnpm --filter @cyberuni/command-center build
node packages/command-center/dist/cli.js
```

Or straight from source, no build step:

```bash
node --experimental-strip-types packages/command-center/src/cli.ts
```

In its own pane, under tmux or herdr:

```bash
npx cyber-mux open --launch "node packages/command-center/dist/cli.js" --at pane:right --label command-center
```

| Key | |
| --- | --- |
| `s` | artifact-sets and the connections between them |
| `g` | the lattice as a graph |
| `o` | open obligations |
| `r` | refresh |
| `q` | quit |

`--view sets\|graph\|obligations` picks the opening view. With no TTY the CLI renders once
and exits, so it can be piped or run in CI.

## How it is wired

```
.command-center/providers.json     which providers this repo offers
  -> host spawns each as its own process
  -> handshake: who it is, which capability contracts it carries, at which versions
  -> host binds the compatible subset, naming the rest unavailable
  -> refresh: an opaque payload plus its provenance and freshness
```

Compatibility is checked **per capability contract**, not per provider: a provider whose
`actions` contract is unsupported still binds for `state`. A provider that has gone away
keeps its last snapshot, marked `stale` — never deleted, and never made live again by
anything but a fresh report.

## The Truss provider

`providers/truss/provider.mjs` reads two real files and invents nothing:

- `.truss/lattice.toml` — the artifact-sets this repo intends to hold, and what must hold
  between them.
- `docs/backlog.md` — which the lattice model already calls a hand-maintained obligation
  ledger.

An artifact-set may legitimately be **empty**: declaring one is an act of intent, and a
later change discharges it. Emptiness is an obligation on the set, never a strain on a
connection.

One field is simulated and flagged as such: a connection's evaluation status. The
three-state `held | strained | unevaluated` is a backlog proposal rather than settled
model, so it is reported with `proposal: true` and nothing downstream should treat it as
domain.
