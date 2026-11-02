# Monotone Co-Design Theory and the lattice model

## Last updated

November 2026

## Question

What is Monotone Co-Design Theory (MCDT), how does it compare with the cyber-truss lattice
model, and what does "MCDT in the loop, human on the loop" mean once it is made precise?

## Verdict

**MCDT is the closest existing mathematics to the lattice model's criteria layer. Take its
theory, not its tooling.** It confirms three decisions already settled in the model. It
also supplies a theorem the model does not yet use: when every step is monotone and only
adds, the order of the steps cannot change the result. That theorem gives the Confluence
page's criteria-layer claim the proof it currently only asserts, and gives the leash a
principled boundary. It is a sufficient condition, not a necessary one: breaking it removes
the guarantee without showing that order matters.

MCDT does not reach the intent or behavior layers. Its guarantees hold only when each node
really is a monotone map, and nothing yet shows that an agent controller deriving criteria
behaves like one. Its tooling is not worth adopting. PyMCDP looks unmaintained. More to the
point, the model's lattice is a powerset of criteria, where the join is set union and no
solver is needed.

**The phrase "MCDT in the loop, human on the loop" has no published source.** Treat it as
coined here. Made precise, it says this: the order-free work (the join, the ledger, the
oscillation lookup) runs inside the loop with no person, and a person supervises from
outside and steps in at the non-monotone steps. The model already has that shape, and the
leash is where it lives. The slogan is wrong in one respect: at a stop the person is
*in* the loop for that branch, because the write cannot proceed without them. The accurate
form is: **a person on the loop by default, and in it at every non-monotone step.**
Pre-approval is the move from in to on.

## Reference material

### What MCDT is (one paragraph)

A *design problem* relates a functionality poset F (what it provides) to a resource poset R
(what it needs). Its solution map h(f) returns the **antichain of minimal resources** that
deliver at least f, which is a Pareto front; an empty antichain means infeasible. A design
problem is monotone when F and R are complete partial orders and h is Scott-continuous.
Design problems compose in **series, parallel, feedback, and co-product**, and the class is
**closed under interconnection** (Censi 2015, Theorem 1). Feedback is solved as a **least
fixed point by Kleene ascent** over antichains, which terminates when the posets have finite
height. Categorically, design problems are Bool-enriched profunctors, a compact closed
category (Fong & Spivak ch. 4). Active research (Zardini, MIT, 2025–26) is on uncertainty,
quantale enrichment, linear special cases, and online learning. Applications are robotics,
control, vehicles, and mobility fleets. No published work applies MCDT to software,
requirements, or agent systems.

### Correspondence table

| MCDT | Lattice model | Fit |
| --- | --- | --- |
| Design problem (node) | Artifact-set with its controller | Good at the criteria layer |
| Co-design constraint `r ≤ f` (edge) | Connection: a relation that must hold | Good. Both are declarative, never handlers |
| The same poset is R of one DP and F of the next | Specification and implementation are roles per edge | Exact |
| The constraint has an orientation; a query can run either way | "Connections are undirected"; direction lives in the workflow | Close. MCDT orients the relation and frees the traversal. The model's per-edge "X constrains Y" does the same, so the word *undirected* overstates it |
| Antichain of minimal resources is unique; the implementations that reach it are many | The join is over criteria, not states; several states meet one set of criteria | Exact. MCDT independently arrives at "confluence over criteria, not states" |
| Empty antichain = infeasible | Conflict: a join no state can meet | Good. MCDT reports infeasibility; the model needs a recorded decision to resolve it |
| Feedback as least fixed point (Kleene ascent) | Cycles must come to rest (rules 1–4) | Partial. See P4 |
| Interconnection closure (Thm 1) | Open: "whether that execution is unique and composes" | MCDT answers composition for monotone parts only |
| Choosing a point from the Pareto front | A choice between settled states is recorded | Good |
| — | Intent, distillation, independent derivation, leash | MCDT has nothing here |
| Wrong model ⇒ the solver converges confidently on a wrong design | The failure mode to design against: a wrong workflow normalizes every entry point onto one wrong place | Same risk; MCDT offers no protection |

### Where the person stands (the slogan, made precise)

| Step | Monotone and join-only? | Who acts | Loop position |
| --- | --- | --- | --- |
| Join of criteria at a controller | Yes (union) | Deterministic | Machine in the loop |
| Ledger scheduling, oscillation lookup (rule 3) | Yes; changes cost, never the result | Deterministic | Machine in the loop |
| Controller derives criteria from intent (Ask) | Assumed, untested | Agent | Machine in the loop. The unproven part |
| Distillation (behavior → intent) | No order exists on intents | Agent | Outside MCDT entirely |
| Additive owned write that passes its criteria | Yes | Agent | Person on the loop |
| Replacement or removal of a standing criterion | No: removes a criterion | Approver | Person in the loop (stop) unless pre-approved |
| Conflict (no state meets the join) | Infeasible | Approver | Person in the loop (decision) |
| Output emission | Irreversible | Approver | Person in the loop |
| Pre-approval | — | Approver | Moves a person from in to on for one run |

### Proposals

User decisions, 2026-11-02:

- P1 is accepted, scoped to within a version.
- P3, P4, P6, and P7 are accepted.
- For P5, ranking the settled states goes to a research issue: [#61](https://github.com/cyberuni/cyber-truss/issues/61)
- P2 and P8 are accepted.
- Q4 is ruled: criteria versions follow semver within a run, used only for its
  breaking-change signal. Adding criteria is minor and non-breaking. Any change to an
  existing criterion, a rewording included, is major and breaking. There is no patch tier
  (see `raw/q4-model-findings.md`).
- References are to individual criteria.
- P9 is accepted as restated: a criterion's identity is its self-contained text, with no
  minted ID (see `raw/criteria-structure.md`).
- P10–P13 are proposed in `raw/criteria-structure.md` and not yet ruled.

- **P1. A monotone-derivation contract on the controller's Ask call.** If the criteria
  referred to a controller grow, the criteria it derives must not shrink. **Within one
  criteria version only** (user, 2026-11-02): a person adding or removing criteria, or a
  recorded decision, starts a new version, and the contract does not span versions. This is the
  *monotone* half of the theorem's condition. The *inflationary* half is not the
  controller's job; the version rule covers it (P2).
  - Test it metamorphically: add a criterion upstream, and check that the derived set is a
    superset.
  - The likely violation is a default conditioned on absence: "if the spec says nothing
    about X, assume Y."
  - It presupposes determinism, because a derivation that varies between runs is not a
    function at all.
  - *Load-bearing:* it is a clause in the controller interface, which the model marks Open
    and expensive to change, so settle it before that interface is fixed.
- **P2. Give the Confluence page's criteria-layer claim a proof structure.** *(Revised
  2026-11-02. The first version said the theorem weakens the case against per-relation
  confluence. It does not: that option restores relations between states, and the theorem
  is about criteria.)*
  - **The gap.** The page rests the claim on the join being order-independent. That covers
    merging contributions once they exist. It does not cover how they are produced: each
    controller derives criteria from what has reached it so far, and in a different order
    it derives from a different partial join.
  - **What closes it.** If every criteria step within a version is monotone and inflationary,
    and the set of possible criteria is finite, every fair order reaches the same least fixed
    point above the starting criteria (Cousot & Cousot; Apt 1998).
  - **The steps that break the condition.** Replacement and removal are not inflationary.
    Distillation has no order at all. A conflict is infeasible. Each is handled by a recorded
    decision or by canonicalization.
  - **The restatement.** Confluence is the theorem within a criteria version, plus recorded
    decisions between versions. Rule 1 already cuts a run at exactly these points, but the
    page never says why.
  - **A gap to check.** A replacement that pre-approval lets through without a stop may
    remove a criterion inside a version. The Workflow page does not say whether it creates
    a new version.
  - *Cheap to revise:* this is prose, and the decision to canonicalize stands.
- **P3. Ground the leash's criteria-layer stops in the theorem.** *(Revised. The first
  version also listed emission.)*
  - Replacement and removal stop because they are not inflationary. A conflict stops
    because no state can meet the criteria (infeasible).
  - Output emission stops for a different reason: it cannot be undone, which is a
    behavior-layer concern. The architect and oracle floor has its own grounds too.
  - The theorem explains part of the leash, not all of it.
  - A non-monotone derivation never shrinks the criteria, so no leash stop catches it. Only
    P1's test does.
  - *Cheap.*
- **P4. A deterministic shrink check within a version.** *(Revised.)*
  - Under the condition, criteria within a version only grow. "The criteria set shrank
    within a version" is therefore a lookup that `truss` can enforce at the deterministic end.
  - It catches non-inflationary steps, such as a replacement that slipped past the leash. It
    cannot catch a non-monotone derivation, which only adds, in the wrong amount.
  - At the behavior layer, two controllers can flip a state if one writes before the ledger
    has collected every contribution. Rule 3 is still needed there.
  - *Cheap.*
- **P5. Borrow "infeasible" for conflict.** *(User: ranking settled states is worth a separate research issue.)* *(Revised.)* Drop "antichain" and "Pareto
  front" for the several settled states. Those words assume an order on the states, and
  the model gives behavior none. *Cheap, optional.*
- **P8. Say on the Join page that propagating criteria cannot prove a conflict is absent.**
  In constraint propagation, local consistency neither implies nor is implied by global
  consistency (Apt).
  - Criteria can settle with every controller holding a non-empty set while no state meets
    them all.
  - A conflict that runs around a cycle of connections shows up only when the controllers
    write.
  - *Cheap.* It bounds what "conflict surfaces at the controller" can promise.
- **P6. Do not adopt MCDP tooling or numeric resource modelling.** Feasibility over a
  powerset of criteria needs union and a lookup, not a solver. Revisit only if the ledger
  starts optimizing cost (tokens, wall time). Quantale-enriched co-design is the matching
  theory for that.
- **P7. Check the word "undirected" on the Connections page.** Constraint propagation
  supports the model's reading: a binary constraint comes with two narrowing functions,
  one per side, so the relation is one and the traversal is either. The specification page's
  per-edge "X constrains Y" orients the relation, which is MCDT's arrangement: the relation
  is oriented and traversal is free. Some edges allow either reading, so this is a wording
  check, not a proposed change.

### Which theory to cite (Q2 result)

- **Order independence: Apt.** Cite *The Essence of Constraint Propagation*, Chaotic
  Iteration Theorem, crediting Cousot & Cousot as the origin. Do not cite the 1977 Cousot
  proof directly: Cousot's own page notes that its Theorem 2.2 proof is erroneous.
- **The mapping:**
  - An artifact-set is a variable, and the states it may still take are its domain.
  - A connection is a binary constraint.
  - A controller is a function that narrows its own set's domain.
  - The run ledger is Apt's generic worklist algorithm. Apt proves every schedule that
    terminates gives the same result. That is "the ledger never makes a run correct" as a
    theorem.
  - A conflict is an empty domain.
- **The two conditions do different jobs (Rough Guide, Theorem GI).** Monotone gives
  uniqueness: every run that terminates reaches the same least fixed point. Inflationary
  gives termination on a finite domain. Both are needed here because a run starts from the
  standing criteria, not from ⊥.
  - From such a start, monotone but non-inflationary steps can settle differently by order.
    This was verified by brute force.
  - Apt states the theorem from ⊥. That it carries over to an inflationary start is
    inferred.
- **Finiteness is an assumption.** The theorem needs the criteria a run can derive to be
  finite, and criteria are open-ended prose.
- **The duality is one-way, not exact.** Mapping criteria to admissible states preserves
  order and union, but redundant criteria cut out the same states. It isn't needed, because
  the theorem applies to criteria sets directly.
- **MCDT stays the reference** for composition closure, per-edge roles, and "criteria, not
  states". Constraint propagation is the reference for how a run behaves.

## Confidence

- **High** on the MCDT formalism, the operators, closure, and the Kleene solution. These
  come from the primary paper.
- **High** that the three structural correspondences hold: per-edge roles, criteria rather
  than states, and declarative edges.
- **Medium** on P2. The chaotic-iteration theorem itself is standard, but I read Cousot's
  original hypotheses only through secondary statements, and it applies only if controllers
  are monotone.
- **Medium** that the phrase is unpublished. That rests on a negative web search.

## Strongest supporting evidence

- Censi 2015 defines h(f) as an antichain, the minimal resources, and proves closure under
  series, parallel, and feedback (E1, E2).
- Fong & Spivak present design problems as Bool-profunctors in a compact closed category
  (E3).
- Apt 1998, after Cousot & Cousot: chaotic iteration of inflationary monotone functions
  reaches the same limit under every fair order (E9).
- Join-based merges preserve information, while overwriting does not (E10). This is the
  join-versus-replacement line the model already draws.

## Strongest weakening or contradictory evidence

- MCDT assumes each node is a known monotone map. Controllers in this model make judgements,
  and the model lists "Do controllers derive the same criteria from one intent?" as open.
  Until that is answered, every MCDT guarantee here is conditional (E11).
- Carlone & Pinciroli (2019) show that real design spaces leave the monotone case, and they
  need other methods there (E6).
- MCDT solves a design once. The model runs continuously over persistent state, with time,
  people, and branches that resolve at different speeds. Nothing in MCDT covers runs, stops,
  or approval.

## What is not supported

- That MCDT, or any co-design framework, has been applied to software, requirements, or
  agent systems. No such work was found.
- That "MCDT in the loop, human on the loop" comes from a talk or paper.
- That PyMCDP is maintained. Its site certificate had expired, the main repository returns
  404, and the only copy found is a 2017 fork.

## Where evidence is thin

- The dual query, maximum functionality for given resources, is categorically available
  (profunctors are symmetric), but I did not find it named in a primary source.
- Cousot's original theorem statement was not read.
- No independent study of how large Pareto fronts grow was found.

## What should be checked again later

- Any Zardini-group paper that applies co-design to software or agent workflows. Check the
  lab publication list.
- The answer to the open question on deterministic criteria derivation. P1 and P2 depend
  on it.
- `codesign-mcdp` (Briat, 2026), if cost-aware scheduling becomes a goal.
