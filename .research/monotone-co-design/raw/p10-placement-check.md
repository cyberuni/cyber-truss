# P10 placement check on cyber-agentkit PR #135 (2026-11-03 to 2026-11-04)

The question: can the placement test (A6) and the churn measure (A10) reproduce a design-spec
trim that was decided by hand?

## Source

- `cyber-uni/cyber-agentkit` PR #135, "feat!: generated, folder-scoped references". The spec
  is at `packages/cyber-agentkit/.agents/spec/reference/` (README.md and graph.md, plus the
  child folders resolve, write, skill, interfaces, and formats).
- Pre-trim state: `865e67e`. Trim: `9b0bb82`, "docs: trim the reference spec to design
  level". PR base: `e317fe8`. Four named review rounds come before the trim.
- ADR 0003 sets the line: the spec keeps "the outcomes a skill, agent, customizer, or admin
  relies on, and the statuses a skill acts on". "Code names, exit lists, flag rules, and
  field lists" moved to issue #130 as test cases.

## Method

1. Extraction. 312 cases from the pre-trim spec: 148 use-case extensions, 99 criteria, and
   65 graph edges. Each was recorded with its actor and goal. A separate table recorded what
   the trim did to each case and how many PR commits revised its text.
2. Blind classification, three parallel agents, each reading only the case text. The
   classifiers never saw the trim results.
3. Comparison by case ID. For scoring, "replaced by a property" is split by text similarity:
   a light edit is similarity 0.7 or above, and a cut is below that. 30 of the 45 removals
   were graph edges whose outcome survived in a kept criterion. Those are duplicates, which a
   classifier reading one chunk cannot see, so they are left out of the scoring.

## A10: churn

Share of cases revised in two or more commits before the trim:

| Trim result | Cases | Revised 2+ times |
| --- | --- | --- |
| kept | 98 | 10% |
| light edit | 68 | 21% |
| cut to a property | 101 | 60% |
| removed (not duplicates) | 15 | 40% |
| removed as duplicates | 30 | 30% |

Churn separates the cases the trim moved from the ones it kept. A10 holds.

## A6, first form: "does the actor reach the goal under both readings?"

| Trim result | Goal at stake | Indifferent |
| --- | --- | --- |
| kept (98) | 77 | 21 |
| light edit (68) | 54 | 14 |
| cut to a property (101) | 64 | 37 |
| removed (45, duplicates included) | 39 | 6 |

It failed, for three reasons:

- **The prompt.** It told the classifiers that a consumer program reading a field by name is
  goal-at-stake. That contradicted the test.
- **The verdicts.** Only one verdict per case was allowed, while the trim mostly split cases.
- **The question.** For a program actor, "is the goal at stake?" holds for everything the
  program reads.

## A6, revised: "hold the outcome, vary the encoding"

Verdicts: **outcome** (stays), **split** (the outcome stays and the encoding goes), and
**encoding** (goes entirely).

| Trim result | Outcome | Split | Encoding |
| --- | --- | --- | --- |
| kept (98) | 87 | 11 | 0 |
| light edit (68) | 12 | 54 | 2 |
| cut to a property (101) | 18 | 80 | 3 |
| removed (15, duplicates excluded) | 3 | 11 | 1 |

Raw agreement is 194 of 282 (69%), but that scoring counts every light edit as one that
should stay. In 5 of 7 sampled light edits, the trim removed a piece of encoding, which is
what A6 called a split:

- UC3.2: "usage error `query-missing` (exit 2)" became "a usage error".
- E49: "written with `reference customize --extends`" became "recorded".
- E18 dropped the `--trace` flag.
- UC15.4 dropped the `excluded` field.

Counting those, agreement is about 80%. A6's kept sentences often match the trim's wording.

## Caveats

- **The revised run is a fit, not a prediction.** The definition of encoding was written
  after reading ADR 0003, and its list overlaps the ADR's. Validation needs a held-out spec
  with review history.
- **Trim results for 70 of the removed cases are judgements.** Whether a removed case was
  replaced by a property or simply dropped was decided by the extracting agent.
- **One duplicate.** E62's ID was reused for a different decision after the trim.
- **The classifiers are agents.** Their verdicts are not deterministic. Rerunning would move
  the counts somewhat, which is the churn that A9 argues against for prose criteria.

## Side finding

30 of the 45 removals were decision-graph edges that restated criteria. The graph and the
criteria said the same things twice. This is evidence for P12 (keep only the most specific
nodes) and for the duplicate check P10 carries.
