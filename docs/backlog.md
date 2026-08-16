# Backlog

Work discovered but not done. Grouped by area; nothing here is scheduled, and the
grouping is not a priority order.

Most of this came out of one session on 2026-08-15 that started as "add an animated
graph to the lattice page" and turned up two adjacent bodies of work: a way to catch
CSS defects that no static tool can see, and a plugin architecture for `truss` itself.
Each item carries enough of its discovery context to be picked up cold.

**The design these items sit under is written up on the docs site under
[The lattice model](https://cyberuni.github.io/cyber-truss/model/)** (source:
`apps/web/src/content/docs/model/`). That is the single source for the vocabulary —
artifact-sets, connections, confluence, canonical execution — and for what is settled
versus open. This file records *work*; it does not restate the model.

## Shipped in that session, for context

`0818501`..`6849048` — the lattice demo: a pure spring-mass simulation in
`apps/web/src/lib/lattice-sim.ts` (13 tests) rendered by
`apps/web/src/components/LatticeGraph.astro`, plus `apps/web/AGENTS.md`.

Two defects found there are worth remembering because they were both invisible to the
test suite that existed at the time:

- Nothing anchored the lattice in space, so dragging a node **towed the whole graph**;
  by release it sat at its own centroid, perfectly balanced, and no ripple fired. The
  unit tests all passed. Fixed by a weak pull toward the origin (`82108c5`).
- A ring wired to ±1 and ±2 cannot satisfy both hops at one rest length, so every chord
  rendered permanently strained. Fixed by per-edge rest length (`fb86ad3`).

## Open decisions

Not scheduled work — questions that block the items below and are the user's call.

1. **Plugin discovery mechanism.** A `truss` key in a dependency's `package.json`, an
   `.agents/universal-plugin.json` entry for consistency with SDD/ACED/Quill, or both.
   An argument against the `.agents` route was made on cardinality grounds — probes are
   additive where SDD roles are exclusive — and then **withdrawn as too weak**:
   cardinality tells you the shape of an entry, not which file holds it. Genuinely open.
   Blocks C1.

   A newer argument *for* the `.agents` route, not yet tested: under the model,
   `.agents/universal-plugin.json` already maps domain types to production-chain roles,
   which is structurally an **artifact-set → controller table** — the same relation truss
   needs. A `truss` key in `package.json` would be a second registry for one relation.
   The counter to check first: SDD's role-map is *mission-scoped* (roles resolved when a
   change request runs) while a truss controller is *standing* (governs continuously).
   Same relation, different lifetime. That may be one file with two keys, or it may be
   what keeps them apart.
2. **Packaging.** Probe packages inside this monorepo, or separate repos. Blocks C1, C7.
3. **Does adopting axi/TOON supersede ADR 0001?** TOON on stdout is agreed; the ADR's
   "structured `--json`" consequence has not been formally superseded or amended.
   Blocks C2, C3.

Also outstanding: a system plan redone against the narrowed scope — *setup and update of
truss in a repo*, with capability negotiation removed. The earlier plan was drafted
before that narrowing and over-reaches.

## Settled — do not re-derive

Each of these was proposed, argued, and rejected. Recorded with the reason so the ground
is not re-litigated.

- **A cheap static layer beneath the browser check.** Stylelint's `length-zero-no-unit`
  would have autofixed `0rem` → `0`, leaving the defect intact and destroying the only
  forensic tell. Biome flags neither `0rem` nor `0px` under this repo's config
  (verified). There is no mechanical rung below "render it and measure".
- **Capability detection, and a join between probe requirements and repo capabilities.**
  A plugin is a package carrying its own dependencies, so installing it *is* acquiring
  the capability. No capability vocabulary, no `requires[]`, no `blocked` status.
- **`doctor` as a reporter of repository content.** It diagnoses whether *the tool* is
  correctly set up here, matching `brew` / `npm` / `flutter doctor`. Repository strain is
  `truss check`. Both read-only by default, both with `--fix`.
- **Rungs and topology-vs-coordinates as drivers of the plugin architecture.** Both are
  `truss check` semantics, not setup concerns. Kept in §D for later, deliberately out of
  the setup design.

## A. Docs site

**A1. The lattice graph fills about a third of its canvas.** `REST = 90` in
`LatticeGraph.astro` sets the ring radius; everything scales from it. The margin doubles
as the click target for adding nodes, so this is a judgement call, not a bug.

**A2. Unresolved finding: `line-height: 28px` on the reset button.** Surfaced by the
attribution prototype (B1) and never decided. It comes from a site-wide
`input, button, textarea, select` reset reaching into the component. Benign today.
Decide whether to accept it or opt out — and note that "accept" needs somewhere to be
recorded, or the check will report it forever. That recording mechanism is the same
problem as `declined` in C4.

## B. CSS correctness tooling

The thread that produced this: `top: 0rem` rendered 16px down, because Starlight gives
every element inside `.sl-markdown-content` that follows a sibling a 1rem top margin,
and an absolutely positioned element offsets its **margin edge**. Fixed in `5650705`;
written up in `apps/web/AGENTS.md`.

The general lesson is sharper than the fix: **a value can be wrong while every static
check passes and `getComputedStyle` agrees with the declaration.** Here `top` computed
to exactly `0px` — matching the source — and the box was still nowhere near it.

**B1. The attribution check has no home.** `docs/prototypes/css-attribution.js` is
validated but wired into nothing, and the version there is missing the UA-baseline
filter that made its output readable. It needs a host that can load a page headlessly.
Until then it only runs by hand-pasting into a browser console.

**B2. A headless harness.** Playwright is the obvious host: it brings baseline
management and diffing for B3, and B1 needs a headless browser regardless. Cost is real
— first heavyweight test dependency in the repo, browser downloads in CI.

**B3. Visual regression.** Blocked on B2. One trap already identified: the lattice demo
is animated, so naive screenshots diff mid-ripple frames forever. Playwright can emulate
`reducedMotion: 'reduce'`, which takes the component's synchronous settle path and yields
a deterministic frame — stable baselines *and* coverage of the reduced-motion path.

**B4. Criteria for the judgement half.** The mechanical layer does not exist: stylelint's
`length-zero-no-unit` would have **autofixed `0rem` → `0` and laundered the bug**, and
biome (verified against this repo's config) flags neither. So the bar has to be written
down rather than encoded. The unifying test found so far: *can you state the derivation
in one sentence?* `-6px` passes — it is (44−32)/2. `1.9rem` failed — it came from
nothing.

**B5. A CSS/design reviewer agent.** Deferred, and only worth building on top of B1 —
a reviewer that only reads source is a worse linter, and one scoped to design taste
produces unfalsifiable findings that reviewers learn to ignore. Its one defensible claim
is measuring a rendered page and diffing intent against reality.

## C. The `truss` system

Design conversation only; no code. `truss` currently ships no domain commands.

**C1. ADR: plugin architecture.** A plugin is a package that carries its own
dependencies, so installing it *is* acquiring the capability — which deletes capability
negotiation entirely (no capability vocabulary, no `requires[]`, no `blocked` status).
Discovery by a `truss` key in a dependency's `package.json`; the Agent Plugins manifest
is closed, so probes cannot be a plugin component type. Open: whether an
`.agents/universal-plugin.json` entry is wanted for consistency with SDD/ACED/Quill.

**C2. ADR: adopt axi/TOON — supersedes part of ADR 0001.** `docs/adr/0001` commits to
"structured `--json`"; axi puts TOON on stdout and keeps JSON internal, so there is no
flag to negotiate and the machine interface *is* the default output. Needs an amending
or superseding ADR, not a quiet change.

**C3. Rewrite `src/output.ts`.** Consequence of C2: TOON becomes the readable rendering,
so the `readable` thunk loses its reason to exist and `output(data)` serializes once.
This is a change to a shipped, tested module.

**C4. `truss doctor`.** Diagnoses whether cyber-truss is set up correctly *here* — which
plugins are installed and wired, version compatibility, config validity. Read-only;
`--fix` repairs. Deliberately not about repository content. Needs a `declined` state
that is git-tracked, since declining is a team decision and without it the report nags
forever (see A2).

**C5. `truss check`.** The repository-facing counterpart: read-only raw data on where the
repo is strained. `--fix` converges.

**C6. Config.** Location, schema, git-tracked, schema-versioned.

**C7. Core↔plugin contract versioning.** The thing plugin ecosystems die on. Decide
before there is more than one plugin, not after.

**C8. Session hook registration.** axi §7: inject compact state at session start, default
targets Claude Code / Codex / OpenCode. Includes executable **path repair** after a
reinstall — which is `doctor --fix` work.

**C9. A curated catalog (optional).** With self-sufficient plugins, truss cannot
recommend what is not installed. If "you could adopt this" matters, it is a static list
truss ships, not detection.

## D. Parked design notes

**D1. Rungs.** A check is bounded by what it needs to exist: *declared* (source text),
*derived* (a build), *observed* (a running instance), *compared* (a stored baseline).
Not a quality ladder — each rung is blind to specific things, and cheaper is not
directionally-right-but-weaker. The `0rem` case is the proof: the declared rung would
have laundered it.

Still parked, and still a `truss check` concern rather than a setup one. It has not been
folded into the model, though it plausibly bears on how a connection declares what it
needs in order to be evaluated.

**D2. Topology vs coordinates.** *No longer parked.* This was filed as a note about how
findings are reported. It turned out to be **the statement of what the system
guarantees**: confluence is claimed over topology, not over byte-identity. Without it the
guarantee is unachievable or undefined.

Now written up at
[The lattice model → Confluence](https://cyberuni.github.io/cyber-truss/model/confluence/). Do not
re-derive it here.
