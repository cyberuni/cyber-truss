# Model review handoff: 2026-09-11 to 2026-09-13

Where the lattice model stands after the session that added the what-is page, the
examples section, and the Workflow and Controller pages, and then rebuilt canonical
execution around per-workflow distillation. Read this, then
`apps/web/src/content/docs/model/open-questions.md`, before resuming design work.

Last commits of the session: `c806598` (the rewrite), `72ca998` (routing to every owner under
the root intent).

## Update 2026-09-14: accepting the intent

The gap: criteria derived from an intent always pass it, so nothing in the run accepted a
change of direction. Resolved at the leash (`2755596`, `28fa2d9`):

- A set's criteria are authored through use cases (and a decision graph where the set
  describes behaviour). As they stood before the run they are the **standing specification**.
- A write that removes or reverses part of it needs the **Council**'s approval by default,
  checked at every write to the set. Confidence only tightens; a team may loosen per set.
  Replacement falls under the same default.
- Workflows send intent and references to upstream criteria, never criteria or use cases.

Rejected on the way, recorded in `docs/backlog.md`: lens returned on ask, a separate
Clearance, the mis-bound rule, per-set owners, sending upstream use cases.

Examples re-graded (`b98cbc0`); two added: insulin double check (erosion across sets) and
aviation blade limit (long chain, three organisations). Statuses live in `examples/index.md`.

**Next question:** can one approval cover the writes that carry it out? Four examples
(software A, component library, marketing A, trading C) meet the same person asked twice for
one decision and work around it by loosening a whole set's leash. See the section of that
name on `open-questions.md`.

Also open from this round: erosion across sets; how a Council is seated, including across
organisations; whether an implementation set has use cases of its own (component library).

## Positioning (settled)

- cyber-truss **makes a system self-converging**. Not a "layer", not scoped to
  repositories. Software is only the example.
- Hero tagline: *Land a change anywhere — the system settles around it.*
- What-is lead: *a change lands wherever it is natural to make it, strains the connections
  it crosses, and comes back carrying the criteria it must now meet.*
- The pitch is the two ways a change gets made (top-down, direct fix). Both leave upstream
  artifacts stale. Time cost is not the argument.
- Rejected framings: downhill/uphill and "path of least resistance" (describe a cost
  landscape, not the mechanism); "enlightened/elevated state" (a join is the *least* upper
  bound; a bad change converges consistently); totality ("the whole system answers").

## The run as it now stands

For workflow X spanning A, B, C, D, with the change landing in C (the **source**):

1. **Lift and look up.** Every workflow whose span includes the source. Upstream candidates
   own or output it; downstream candidates read it.
2. **Distill, per workflow.** Each candidate reads the change within its own span and states
   what it is for, not whether it is right. A workflow that finds nothing abstains. **Only a
   change is distilled, never an intent** (translation loss compounds otherwise).
3. **Ask the controllers above**, nearest first (B, then A). Each controller derives the
   criteria the root intent implies for its own set and answers holds, affected, or too
   coarse. Controllers above the source never see the change.
4. **Route what X cannot write.** An affected input is routed to **every** workflow that owns
   or outputs it, carrying the root intent unchanged and the affected set's criteria. Each
   reads them within its span, then asks upward or abstains.
5. **Replay from the highest affected set.** Each controller on the way down writes to meet
   the criteria arriving from above.
6. **Reconcile at the source.** C's controller joins the change with the criteria arriving
   from above (and the intent), and reports kept, changed, added, and any criteria it had to
   derive itself. The report is the comparison; the leash floor applies. At an output source,
   the emission stays and a superseding emission is added.
7. **Continue and propagate.** X continues to D. Every write is a change picked up within
   the same run under the root intent; it never starts a new run.
8. **Run ledger.** Pending jobs and their waits form a graph with a ready frontier (SDD
   mission-graph shape). The ledger **collects** contributions per set, each with provenance,
   and hands them to the controller together; it never merges. A write is ready when no
   pending job can still contribute. The source is settled by definition. A job runs against
   the criteria version current when it starts. Waiting on upstream is strain policy (owned
   writes proceed, output writes wait). The ledger never makes a run correct.

Downstream candidates read the change itself and run from the source downward; they do not
reconcile it.

## Decisions (all committed)

| Decision | Home | Cost to undo |
| --- | --- | --- |
| Loop has one entry: a change. Anything else is a criterion (including time) a controller tests | canonical-execution | |
| Cycles terminate by four rules; criteria versioned and frozen per run (user-authored) | canonical-execution | |
| Confluence claimed over criteria; join is union of criteria (user-authored) | confluence, join | |
| Six workflow parameters: span, roles, shape, discharge, strain policy, leash | workflow | |
| Three roles: input (read), owned (read + revise), output (emitted, supersede only) | workflow | |
| Candidates by lookup: upstream (own/output the source), downstream (read it) | workflow | |
| Leash: owned writes proceed when criteria pass; output writes need approval; architect/oracle go to a person; confidence only tightens | workflow | |
| Controller holds one set and does the join; workflow owns sets and works between them | controller | |
| Handoff is three calls: ask, write, reconcile | controller | High |
| Fourth strain kind: missing, found when a controller above the source derives a criterion its set lacks | connections | |
| Distillation per workflow, within its span; what the change is for, not whether it is right; abstention allowed | canonical-execution | High |
| Only a change is distilled; routed jobs carry the root intent unchanged (user-directed) | canonical-execution | High |
| Controllers judge level for their own set (holds / affected / too coarse) | canonical-execution | |
| Expression stays with the source: controllers above it get intent only | canonical-execution | High |
| Replay from the highest affected set | workflow | Low |
| Reconciliation at the source replaces independent replay plus comparison | canonical-execution | High |
| Affected inputs routed to every owner; no tie-break | workflow | Low |
| Run ledger collects, never merges; provenance on each contribution; source settled by definition; never decides correctness | canonical-execution | High |
| Waiting on upstream is strain policy, not a selection rule | canonical-execution, workflow | Low |
| Direction between revisable sets follows level (same level reads expression; higher is reached through intent) | workflow | High; rests on the levels question |
| Contracts live at outputs, not on edges between revisable sets | workflow | High |
| Run ledger MVP: termination record, pruning of closed runs, each run's intents, pending jobs and waits | docs/backlog.md C11 | |

Superseded this session, and recorded in `docs/backlog.md` under *Settled — do not
re-derive*: central distillation reading backward along upstream candidates; replay from the
declared start; per-workflow translation of intent into a Request; "a workflow never reads a
change in a set it owns"; an API contract on a revisable edge as the break guard; the
tie-break that sent a routed job to one owner. "Request" survives only as the name for what a
workflow hands a controller.

How the session got there, in order: downstream workflows should not re-distill a settled
input (user); selection's step 3 missed coarse sets and sets below the change (user); each
workflow finds intent in its own context (user); controllers answer per set and the workflow
replays from the highest affected set, with an orchestrator (user); the two rules from
running the examples; flip the component library to API reference (user); route to every
owner (user); only a change is distilled (user).

## Examples (test cases)

Five examples in `apps/web/src/content/docs/examples/`, re-graded under the run above. The
status table lives in `examples/index.md`; statuses did not change:

| Example | Status | Notes from the re-grade |
| --- | --- | --- |
| Bug fixed directly in code | A Holds, B Holds | Replay starts at `{spec}`; reconciliation keeps round-up and adds the empty-list case |
| Bug fixed in a component library | A Holds, B Holds | Now API reference plus a release output; the break reaches the maintainer at release; rejecting it converges with B |
| Twist written mid-draft | A Holds, B Unresolved | A: no second chapter 14, outline written once. B: criteria with no home above the source; coupling inside a set |
| Trade placed before its thesis | A Holds, B Unresolved, C Holds | B: time bound form; bound does not cover controllers; human hindsight |
| Ad rewritten mid-campaign | A Holds, B Unresolved | B: scope; `{campaign results}` unread unless a workflow spans it |

Rule for new examples: write the expected run from what the system's people want before
reading the model pages, and prefer cases the model should struggle with.

## Proposed but not yet written

- **Several intents in one change**, split by the specification each moves; within one
  specification, split where one could be declined without the other. Write an example (a
  commit mixing a fix and a refactor) before writing the model.
- **Workflows as declared linear paths**, branches as separate workflows. No example has a
  chain long enough to test it, and a long chain is also what would test root-intent
  abstraction at distance; write one first.
- **Explicit vs embedded specifications** (spec.md + suite vs PRD prose or a mockup). Name
  it on the specification page.
- **Accepting the intent**: reconciliation now belongs to the source's controller, but who
  accepts the intent itself (the source owner, via the leash) is still unnamed.

## Corpus drift to fix

- `relationship-to-sdd.md:14` says peers, line 18 says "under SDD";
  `canonical-execution.md` ("Reading the comparison") says "SDD's next revision". The root
  AGENTS.md says peer.
- `lattice.mdx`: truss image and "whole repository settling" (lines 8-10), bold
  downhill/uphill line (25), totality (29).
- Splash page `index.mdx`: "Why a layer under SDD" section is wrong; the user has not yet
  said how.
- "Repository" in the glossary's Artifact and Confluence entries, the confluence claim, and
  the model overview contradicts "not limited to software".
- Precision: "confluent by construction" covers only the criteria merge; the acceptance
  test still says "diff the topology"; rule 3 needs "resolved" to mean the whole join at
  that connection holds.
- Pre-existing broken anchor: `waterfall.md:60` links
  `relationship-to-sdd/#what-running-the-exercise-revealed`, which does not exist.

## Open questions not yet on open-questions.md

Some of these appear in page status lines but have no section of their own.

- Criteria with no home above the source (fiction B): the source's controller derives them
  and has seen the change. The report names them; nothing makes them independent.
- Whether the time bound binds what the controllers above read, not only distillation
  (trading B).
- Hindsight a person brings into distillation, which no time bound covers (trading B).
- How fast strain across units of change must clear, and how long obligation on an output
  may be carried before a superseding emission (trading A and C). Belongs to strain policy.
- Evidence no workflow spans (marketing `{campaign results}`): routing to every owner helps
  only if some declared workflow reads it.
- Stability of splitting a change into several intents; stability cost of embedded
  specifications.
- The default leash lets an agent make a large owned rewrite (a whole ending) that meets
  the criteria without approval. Whether the architect lens catches it is unstated.
- A wide reading of intent (the component owns the page count) is caught only by a
  controller convention or an output.
- Provenance marker form, and whether a contribution's "read the source's expression" flag
  is enough for the report to name shaped criteria.

## Working agreements observed

- Design is argued, not presented. Concede the specific step, defend what holds, mark what
  is costly to undo.
- User explanations in chat are context, not text to paste into pages.
- Test a proposal against examples before rewriting pages; record the rules the run forced.
- When examples are re-graded in parallel, their reports surface model-page gaps; fix the
  model page, then re-read the example text written against the older wording.
- Commit each unit as soon as it builds and its anchors resolve. The anchor crawl must
  check `#fragment` targets, not only page paths.
