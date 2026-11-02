# Criteria structure: why use cases stop oscillation, and what the theory adds (2026-11-02)

User decision: references are to individual criteria (leaf nodes), not to a set's criteria
as a whole.

User observation: loose criteria led to oscillation in SDD. Use cases fixed it: a decision
graph is derived from the use cases, and each leaf node is a criterion.

## Why the graph works, in the theory's terms

The order-independence theorem (Apt, after Cousot) needs three things. Loose criteria break
all three, and the use-case graph restores them.

| The theorem needs | A loose criterion breaks it because | The leaf node restores it because |
| --- | --- | --- |
| Each step is a function: same input, same output | Its verdict on an unchanged state can flip between evaluations or controllers. Strain then flips with nothing changed, and rule 3 reads that as oscillation | A leaf is one path in the graph, specific enough to evaluate to one verdict |
| The join is idempotent: a criterion arriving twice counts once | A criterion whose text leans on context it does not carry has no decidable identity: the same text can mean two things | Identity is the criterion's self-contained text (P9, as ruled), so the join counts it once by construction. The graph's part is the first row: it makes each text specific enough to carry its own conditions |
| A finite set of criteria (for termination) | Prose is open-ended, so criteria can be restated without end | Version 1 fixes the set of leaves, and agents cannot add a version (rule 1) |

This also explains the model's Open "grain" item on the Specification page. A criterion
whose coverage turns on an undefined term breaks the first row.

## Proposals (continuing the numbering)

- **P9. A criterion's identity is its self-contained text.** *(Ruled by the user,
  2026-11-02, as restated. The first form said the leaf node, not the prose, is the
  identity.)*
  - References, the join's "counts once", and retraction (F5) all key on the text, or a hash
    of it where a reference needs to be short. No minted ID is needed.
  - Why the leaf node fell: the judge reads a criterion's text, so a rewording can change a
    verdict. Any change to a criterion is therefore breaking (see the semver ruling in
    `q4-model-findings.md`), and withdrawal only needs the set difference between the
    criteria a write was judged against and the current version. Nothing needs to know which
    new criterion replaced an old one, which was the only job an ID had that text could not do.
  - *Load-bearing condition:* the text must be self-contained. The judge reads the criterion
    and nothing else, so any context it depends on (the path, the use case) has to be written
    into it. SDD's Given/When/Then scenarios meet this. A row of a messaging table may not.
  - Sets with no graph use the same rule. No other identity scheme is needed. What they lack
    is the graph's check for two criteria on one path; that is an authoring defect, left to
    P10.
- **P10. Bracket a leaf when it is written, an import from MCDT's interval uncertainty
  (Censi 2017).** MCDT brackets an uncertain design problem between an optimistic and a
  pessimistic version and solves both.
  - Applied here: when the chain writes a leaf, the controller states its strictest and its
    most lenient reasonable reading.
  - If the two readings agree on the cases the use case names, the leaf is crisp.
  - If they disagree, the leaf has a grain defect, which is strain in its own set before any
    run uses it.
  - This makes the Open "grain" check operational at authoring time, where the
    Specification page says it belongs.
  - *Moderate cost:* it is a step in the chain, not a change to the model.
- **P11. Give rule 3 a diagnosis.** When a connection strains again under the same version,
  check whether the state changed between the two resolutions.
  - Unchanged state with a flipped verdict means the leaf is loose (P10's defect, found at
    run time), and it is routed to that set's controller as strain.
  - Changed state means two workflows are undoing each other, a conflict that needs a
    decision.
  - Today rule 3 stops both the same way. *Cheap:* it is a lookup over the record the rules
    already keep.
- **P12. Represent a criteria set by its most specific nodes: MCDT's antichain, moved from
  resources to criteria.**
  - In a graph a leaf refines its parent, so criteria are ordered by refinement as well as
    inclusion.
  - Keeping only the nodes nothing else refines gives each criteria set one canonical form.
  - That makes the Confluence page's acceptance test ("diff the resulting topology", Open:
    what a topology diff is operationally) computable: compare the sets of leaf IDs.
  - *Cheap,* but it needs testing on an example.
- **P13. Retraction scope follows the graph.** Replacing a node retracts its subtree's
  leaves, and then, transitively, every write that references them (F5 at leaf grain). The
  graph is the justification structure a TMS needs, already authored.
  - *To recheck after P9's ruling:* with self-contained texts, a changed path changes its
    leaves' texts, so the set difference may already cover the subtree. The transitive part
    (writes resting on withdrawn writes) is unaffected.

## What the theory predicts will still fail

- **Leaves that are judged rather than evaluated.** Examples: "a reveal must surprise and
  still feel earned" (fiction), and design-taste criteria. They cannot be made functions by
  structure alone. P10 flags them, and the options are to split them, to accept the stop, or
  to route them to a person as in-the-loop criteria.
- **Sets with no graph** (an outline, a messaging table). Their criteria are bound to use
  cases alone. Under P9 as ruled, identity is the text here too. What is weaker is the
  check for duplicates (two wordings of one rule), and whether each text is self-contained.
