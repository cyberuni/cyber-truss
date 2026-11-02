# Monotone Co-Design Theory and the lattice model (November 2026)

## Question

What is MCDT, how does it compare with the cyber-truss lattice model, and what does "MCDT in
the loop, human on the loop" mean?

## Scope

In scope:
- Censi's MCDT and its 2023–26 extensions.
- The lattice model as written in `apps/web/src/content/docs/model/`.
- The standard meanings of human in, on, and out of the loop.

Out of scope:
- Implementation in `truss`.
- Participatory "co-design" in the HCI sense.

## Source angles

- Primary papers: Censi 2015; Censi 2017 on uncertainty; Zardini group 2025–26.
- Textbook: Fong & Spivak ch. 4; ACT4E.
- Tooling: PyMCDP, codesign-mcdp.
- Criticism: Carlone & Pinciroli 2019.
- Fixed-point theory: Cousot & Cousot, via Apt 1998.
- Autonomy policy: HRW 2012; Carnegie Council 2021.
- Project docs: Lattice, Join, Confluence, Connections, Controller, Workflow (leash),
  Canonical execution, Layers, Specification.

## Findings

### MCDT matches the criteria layer, not the other two

The model's three layers are intent, criteria, and behavior. Only criteria carry an order
(inclusion) and a combining rule (union). MCDT needs exactly that. Intent has no order, and
behavior needs no combining. MCDT therefore lands on the one layer where the model makes
its claim. See the [Layers](../../apps/web/src/content/docs/model/layers.md) page and E1.

### Three settled decisions MCDT confirms

1. **Roles are per edge.** A poset is the resource of one design problem and the
   functionality of the next, just as an artifact-set is the implementation on one edge and
   the specification on another.
2. **Confluence over criteria, not states.** MCDT's answer is a unique antichain, and the
   implementations that reach it are many.
3. **Edges are declarative relations.** A constraint `r ≤ f` is never a handler, and a query
   can use it from either side.

### What MCDT adds

- **Closure:** monotone parts compose into a monotone whole (E2).
- **Order independence:** with chaotic iteration, the schedule does not matter if every step
  is monotone and only adds (E9). This weakens the Confluence page's case against
  per-relation confluence. The proof burden is per controller, not per pair. Distillation is
  still not monotone, so canonicalization stays.
- **A boundary for the leash:** the writes that stop are exactly the non-monotone ones.
  These are replacement, removal, conflict (infeasible), and emission (irreversible).

### What MCDT does not cover

- Intent, distillation, the independence of criteria from the change, and runs over time.
- Stops, approvers, and branches that resolve at different speeds.
- Protection against a wrong model. The model's "failure mode to design against" is
  MCDT's risk too.

### Oscillation, tested rung by rung

- At the criteria layer under a frozen version, the run only joins, so oscillation cannot
  arise. A recurrence there implies a non-monotone step.
- At the behavior layer, two controllers can flip a state when one writes against a partial
  join, before the ledger has collected every contribution. Rule 3 is still required, so P4
  holds only at the criteria layer.

### The slogan

- In the standard terms (E8), a step is *in the loop* when it acts only on a human's
  command, and *on the loop* when it acts under oversight that can override.
- The model's leash is on the loop for additive writes and in the loop at stops.
  Pre-approval converts in to on for one run.
- "MCDT in the loop" is best read as the deterministic, order-free core: the join, the
  ledger, and the rule-3 lookup.
- Agent controllers sit between that core and the person, assumed monotone but untested.

## Contradictions

- Connections page: "a connection is not an arrow (undirected)."
- Specification page: "for an edge where X constrains Y."
- MCDT reconciles the two: the relation is oriented and traversal is free. This is a
  wording question (P7).

## Open questions

- Q1. Is criteria derivation monotone in practice? Run a metamorphic test on one example
  (the P1 test). It depends on the model's open question about deterministic derivation.
  Look first for absence-conditioned defaults.
- Q2. **Answered: yes, for how a run behaves.** See "Which theory to cite" in the
  conclusion, and `raw/q2-constraint-propagation.md` (E12–E20). MCDT stays the reference for
  composition.
- Q3. Does cost-aware ledger scheduling justify quantale-enriched co-design later?
- Q4. **Reframed** (see `raw/q4-model-findings.md`). A pre-approved replacement does not
  remove a run criterion, because version 1 already holds the new rule. The docs disagree on
  whether an approval creates a version (F2). The open question is what retracts additive
  writes made under a version when a later refusal removes the criterion they rest on. The
  literature survey on TMS and DRed is in progress.

## Sources consulted

See `evidence.md` and `raw/literature.md`.
