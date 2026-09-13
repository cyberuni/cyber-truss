# Model review handoff: 2026-09-11 to 2026-09-13

Where the lattice model stands after the session that added the what-is page, the
examples section, and the Workflow and Controller pages. Read this, then
`apps/web/src/content/docs/model/open-questions.md`, before resuming design work.

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

## Model decisions made this session (all committed)

| Decision | Home |
| --- | --- |
| Distillation produces intent; each workflow owns its Request | canonical-execution |
| Distillation reads backward along upstream candidates, writes nothing; bounded in time | canonical-execution |
| Loop has one entry: a change. Anything else is a criterion (including time) a controller tests | canonical-execution |
| Cycles terminate by four rules; criteria versioned and frozen per run (user-authored) | canonical-execution |
| Confluence claimed over criteria; join is union of criteria (user-authored) | confluence, join |
| Replay starts at the declared start; coarse nodes pass the Request through (user-authored) | workflow |
| Six workflow parameters: span, roles, shape, discharge, strain policy, leash | workflow |
| Three roles: input (read), owned (read + revise), output (emitted, supersede only) | workflow |
| Candidates by lookup: upstream (own/output a changed set), downstream (read one) | workflow |
| A workflow reads a change in its inputs, never one in sets it owns or outputs | workflow |
| Six selection steps, incl. routing strain the read found, waiting on strained inputs (settled by the backward read, so opposite roles cannot deadlock), raising unrestorable strain as obligation | workflow |
| Leash: owned writes proceed when criteria pass; output writes need approval; architect/oracle go to a person; confidence only tightens | workflow |
| Controller page: workflow owns sets and works between them; controller holds one set, carries out the join, receives the handoff | controller |
| Fourth strain kind: missing (change's criteria not held upstream; relative to a change) | connections |
| Run ledger MVP includes pruning of closed runs | docs/backlog.md C11 |
| Only workflows the run's criteria strain get intent and a Request. A workflow reached only through a changed input hands its controller a reference to that input, with no re-distillation. Strain does not carry intent; the provenance marker names the run, whose record holds the intent for non-spec inputs (user-directed) | workflow, canonical-execution, controller |

## Examples (test cases)

Five examples in `apps/web/src/content/docs/examples/`, re-graded against the three roles
and the wait rule. The status table lives in `examples/index.md`; at handoff it read:

| Example | Status |
| --- | --- |
| Bug fixed directly in code | A Holds, B Holds |
| Bug fixed in a component library | A Holds, B Holds |
| Twist written mid-draft | A Holds, B Unresolved (coarse input; coupling inside a set) |
| Trade placed before its thesis | A Holds, B Unresolved (time bound form; human hindsight), C Holds |
| Ad rewritten mid-campaign | A Holds, B Unresolved (scope; unread evidence) |

Rule for new examples: write the expected run from what the system's people want before
reading the model pages, and prefer cases the model should struggle with.

## Proposed but not yet written

- **Several intents in one change**, split by the specification each moves; within one
  specification, split where one could be declined without the other. Write an example (a
  commit mixing a fix and a refactor) before writing the model.
- **Workflows as declared linear paths**, branches as separate workflows. No example has a
  chain long enough to test it; write one first.
- **Explicit vs embedded specifications** (spec.md + suite vs PRD prose or a mockup). Name
  it on the specification page.
- **The comparison's two seats**: accepting the intent belongs to the source owner, the
  reconciliation to the controller where the change landed. Step 7 and "Reading the
  comparison" still name no owner.

## Corpus drift to fix

- `relationship-to-sdd.md:14` says peers, line 18 says "under SDD";
  `canonical-execution.md` says "SDD's next revision". The root AGENTS.md says peer.
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

- Where the backward read ends when the top specification holds nothing (intent above the
  top has no artifact).
- Missing strain against an input too coarse to hold the criterion (fiction B; waits on
  the levels question).
- How fast strain across units of change must clear (trading).
- Hindsight a person brings into distillation, which no time bound covers (trading B).
- Stability of splitting a change into several intents; stability cost of embedded
  specifications along the backward read.
- How long obligation on an output may be carried before a superseding emission (trading A
  and C). Belongs to strain policy, and nothing sets it yet.
- Evidence no workflow reads (marketing `{campaign results}`): selection step 6 only
  catches strained sets, not unread ones. Also, walks stop at the first contradicting set,
  so evidence never reaches marketing B's distillation.
- The default leash lets an agent make a large owned rewrite (a whole ending) that meets
  the criteria without approval. Whether the architect lens catches it is unstated.

## Working agreements observed

- Design is argued, not presented. Concede the specific step, defend what holds, mark what
  is costly to undo.
- User explanations in chat are context, not text to paste into pages.
- Commit each unit as soon as it builds and its anchors resolve. The anchor crawl must
  check `#fragment` targets, not only page paths.
