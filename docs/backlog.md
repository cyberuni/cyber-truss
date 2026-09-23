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
3. **Are inbound connections discoverable, or only outbound ones?** Blocks C10.
   A connection is undirected (settled), but *discovery* is not symmetric. A repo
   can enumerate the artifact-sets it consumes by reading its own files. It cannot
   enumerate the repos that consume **it** — that edge exists only in the consumer,
   and there is no inbound index. `cyberuni/.github`'s reusable release workflow is
   the worked case: 30 consumers, none of them nameable from inside the repo that
   ships it. Three routes, and this is the user's call:
   - **Scan and index.** A loop over the org's repos reading each one's workflows.
     Verified to work, ~90s across three orgs — and note that `gh search code`
     returned nothing for the same query, so the API path is not the cheap version.
   - **Consumer-side declaration**, published where the producer can read it.
   - **Neither** — accept that outbound blast is unknowable and gate on *"this
     artifact is consumed by parties this repo cannot name"* rather than on a list.
     Weaker signal, zero infrastructure, and it is enough to stop a merge.
4. **Does adopting axi/TOON supersede ADR 0001?** TOON on stdout is agreed; the ADR's
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
- **Central distillation along upstream candidates** (rejected 2026-09-13). One distiller
  walked back along every workflow owning the changed set and judged each set from outside
  that workflow's context. A set too coarse to hold a criterion ended the walk as though it
  held it, and a set below the change inside the same workflow was never checked. Replaced
  by distillation per workflow and criteria derived by each set's controller.
- **Replaying every workflow from its declared start** (rejected 2026-09-13). Its reason,
  that reach cannot be predicted, applies across the whole system, not within one workflow,
  where each controller answers for its own set.
- **An API contract on an edge between two revisable sets as the guard against a breaking
  change** (rejected 2026-09-13). The owner of the docs could document new props, so the
  guard never held. Contracts live at outputs.
- **Returning a lens from the ask call** (rejected 2026-09-14). Controllers above the source
  split *affected* into *lacks* and *contradicts*, and *contradicts* went to a person before
  the replay wrote. The line was a judgement of an intent against prose, erosion never read
  as a contradiction, downstream writers bypassed the ask, and the person reached was usually
  the one who made the change. Replaced by the leash comparing each write with the set's
  standing specification.
- **Clearance as a mechanism separate from the leash** (rejected 2026-09-14). Borrowed from
  SDD's freeze: additive self-clears, narrowing or rewriting escalates. The classification
  held; the separate mechanism did not. Contradicting the standing specification is a leash
  default, decided with confidence like any other write.
- **The mis-bound rule** (rejected 2026-09-14). A rewrite passed without a person when the old
  criterion failed its use case's outcome. The verdict flipped on how the outcome was worded,
  a change's own evidence could declare the old criterion mis-bound, and a narrowing could be
  relabelled as a rewrite to qualify. Every example gamed it.
- **Use-case actors, or a person declared per set, as who approves** (rejected 2026-09-14).
  Actors picked people who do not own the rule; per-set owners added a declaration the
  workflows already make. Approval comes from an approver, any approver for now.
- **Sending upstream use cases and decision graphs with the intent** (rejected 2026-09-14).
  No example needed them: the contradiction check reads the controller's own set, and other
  sets are referenced by criteria. SDD's implementation producer reads the suite, not the
  spec. Cheap to add if an example shows the need.
- **A guard inside a delegating set as the fix for erosion across sets** (superseded
  2026-09-14). The insulin policy's delegation would carry a guard against units dropping
  routine steps. The requirement comes from the accreditation standard, which has no connection
  to the unit protocol, so the guard patches a relation nobody declared. What is missing is the
  connection; a run cannot detect it, and an audit loop outside the run finds it.
- **An implementation set carrying use cases of its own** (rejected 2026-09-23,
  user-directed). Proposed so that a library's prop list would be a criterion of the code and
  the break would stop at the source. Every candidate counterexample folded: a library's
  exported API, a design decision the spec cannot see, and an aviation task card are the set
  in its *specification* role, and a regression case or behaviour consumers rely on is a
  criterion the specification above should have stated. Use cases belong to the specification
  role; where an implementation appears to hold them, it holds a lower rung written into
  implementation files, and that rung is its own set. What a downstream set reads besides the
  criteria from above is workflow governance and the existing artifacts, and the latter
  supply *how*, never *what*.
- **Backfilling every criterion that turns up in context** (rejected 2026-09-23,
  user-directed). The first form of the rule above said that a rule found in the existing
  artifacts should be written into a specification. Not practical, and not desirable: nobody
  writes a suite covering every permutation, or one for each dependency they install.
  Implicit criteria are stated only when a team decides to, and the model says so on the
  specification page.

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

**C10. Blast radius as a derived query, and the third state of a connection.** Came
in from `repobuddy/repobuddy#594`: a dependency PR bumped `changesets/action` v1 → v2
in `cyberuni/.github`'s reusable release workflow, passed every check in its own repo,
and broke the release job in 25 downstream repos. The action refuses `@changesets/cli`
v2 at runtime, and the repo that ships the workflow never runs it.

The first analysis blamed the **major version bump**. That is the wrong axis — semver
is a property of the dependency being bumped, while the risk is a property of the
artifact being changed and of who executes it. A minor that changes an input default
breaks the same consumers; a major devDependency bump in a leaf repo breaks nobody.
And the same failure reproduces with no repo boundary and no version at all: run
`turbo run test --filter=...[origin/main]`, have package B depend on A through a
runtime config load the selector's graph does not carry, and B's tests never run.
Green, and broken at publish.

What actually failed is a gap between two quantities:

- **Blast radius** — what the delta puts at risk.
- **Verification reach** — what the check that ran actually evaluated.

The merge is safe when *reach ⊇ radius*. The claim worth arguing is that neither of
these is a new mechanism, and that blast in particular is not something to *detect*.
Under the model, blast radius is the transitive closure of connections from the
artifact-sets the delta touched. If truss holds the connection graph, blast is a query
over it. A separate blast-detector would be a second registry of a relation the model
already owns — the same objection already made against duplicating the artifact-set →
controller table.

Reach is the half the model is genuinely missing, and it is load-bearing. Today a
connection is either holding or strained. That is two states where there are three: a
connection can also be **unevaluated**. The `.github` repo does not score as
unstrained, it scores as never-checked, and reporting those two the same way is
exactly the defect that let the merge through. So a connection carries an evaluation
status per run, not only a truth value — and `truss check` has to distinguish *held*
from *nothing looked*.

Adjacent to D1, but not the same. Rungs say what a connection *needs to exist* in
order to be evaluable, and are a property of the connection. Reach says what a
particular run *did* evaluate, and is a property of the run.

Two follow-ons, neither tested:

- It plausibly gives C5 its scope. `truss check` currently means *where is this repo
  strained*. With reach, a delta-scoped mode means *what did this change put at risk,
  and was any of it actually evaluated* — the question a merge gate needs.
- It may be the same question SDD's impl gate asks. The frozen `.feature` is a reach;
  a delta touching artifact-sets outside its scenarios is radius past reach. If that
  holds, the two gates are one construction. Check it before leaning on it.

Blocked on Open decision 3 for the cross-repo half. The in-repo half — an incomplete
dependency graph under selective test selection — is computable today, and is the
cheaper place to test the model.

**C11. The run ledger. The termination record is MVP; the chain of custody is later.**
Came out of the bug-fix example on 2026-09-12. Selected workflows run in an order nobody
controls, and when their results disagree further cycles run
([Order is not controlled](https://cyberuni.github.io/cyber-truss/model/canonical-execution/#order-is-not-controlled)).

- **MVP: the termination record.** Criteria versions, resolutions recorded as
  connection and version pairs, and decisions. Append-only. This is what the rules in
  [Cycles must come to rest](https://cyberuni.github.io/cyber-truss/model/canonical-execution/#cycles-must-come-to-rest)
  read, and without it a run has no bound except a turn limit. `truss` refuses to record a
  cycle that resolves no new pair.
- **MVP: the run's distilled intent.** A provenance marker names its run, and a workflow
  whose changed input is not a specification (release reading `{code, test}` to write a
  changelog entry) reads the intent from the run's record rather than distilling again.
  Added 2026-09-13.
- **MVP: pending jobs and their waits.** The ledger is also the scheduler: jobs (workflow
  and start set, reconciliations, routed jobs), what each waits on, and the ready frontier.
  Same shape as SDD's mission graph. It reduces rework and must never be what makes a run
  correct. Added 2026-09-13.
- **Later: the chain of custody.** Each cycle's Requests and deltas, the comparison
  outcomes, and which parts a person authored rather than a replay produced. From that, a
  change spanning several cycles is summarized for a person to review as one thing, not as
  a trail of separate commits.
- **MVP: pruning.** The record grows with every cycle and must not grow forever. What each
  part is read for decides when it can go.
  - Resolutions are read only by rule 3, within the run that recorded them. Once a run has
    settled, its connection and version pairs can be dropped.
  - Intermediate criteria versions are read only while their run is open. A settled run
    keeps its final version.
  - Decisions are read beyond their run: a reversal needs a person, and the specification
    controller checks new criteria against them. They stay until the decision has landed
    in the specification set it affects, which is where that controller reads it.

  Pruning compacts a *closed* run and never edits an open one, which is how it squares
  with the rule that the record is append-only: nothing still reading a record loses it.
  The later chain of custody sets its own retention, and may keep what pruning drops.

Depends on the open question of
[what vehicle holds pending Requests](https://cyberuni.github.io/cyber-truss/model/open-questions/#what-vehicle-holds-pending-requests).

## D. Parked design notes

- **Approvers per workflow** (deferred 2026-09-14, not MVP). Each workflow can have its own
  approver, which is permission management. For now any approver approves a stop in any
  workflow. Cases to design against when it is picked up: an intensive care practice committee
  that keeps a protocol while the hospital's medication safety committee owns the rule it
  implements (insulin example); a manufacturer and a regulator, neither of which may approve
  the other's documents (aviation example, variant B).

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
