# Q2: Is constraint propagation (Apt) a closer formal home than co-design?

Checked 2026-11-02. Primary sources were read from the arXiv LaTeX sources rather than from
summaries:
- Apt, *The Essence of Constraint Propagation* (TCS 1999; arXiv cs/9811024), cited below as
  **Essence**.
- Apt, *The Rough Guide to Constraint Propagation* (CP 1999; arXiv cs/9909009), cited below
  as **Rough Guide**.

The 1977 Cousot & Cousot paper was not obtainable as a PDF. Only its summary and editorial
notes on Cousot's own page were read.

Marks: **[read]** means I read the passage. **[inferred]** means my own reasoning from read
definitions.

---

## 1. The exact theorem, its hypotheses, and an arbitrary start

**Verdict: partly holds.** The hypotheses are as claimed. The theorem is stated from ⊥, and
the two conditions do different jobs.

- **The order: a ⊔-po.** It has a least element ⊥, a least upper bound for every
  increasing sequence, and a binary least upper bound a ⊔ b. It need not be a complete
  lattice. A finite partial order with binary lubs qualifies.
  [read] Essence §2.1, definition of ⊔-po. https://arxiv.org/abs/cs/9811024
- **Iterations and fairness.** A run is an infinite sequence of function indices. A run is
  fair if every index occurs infinitely often. An iteration "starting with d" sets
  d₀ := d. When d is ⊥, the reference to d is dropped. A chaotic iteration is one with a
  fair run. [read] Essence §2.1, first definition.
- **The Chaotic Iteration Theorem.** Over a ⊔-po, if every fᵢ is inflationary and
  monotonic, then every chaotic iteration has a limit, and the limit is ⊔ⱼ f↑j, where
  f(x) := ⊔ᵢ fᵢ(x) and f↑j := fʲ(⊥). [read] Essence, Theorem "Chaotic Iteration".
  - Apt says it "can be easily distilled from a more general result due to Cousot and
    Cousot [CC77a]" and gives a self-contained proof.
  - **The proof starts at ⊥.** Claim 1's base case is f↑0 = ⊥ = d₀.
- **The Stabilization Corollary.** If some chaotic iteration stabilizes, every chaotic
  iteration stabilizes, at the least fixed point of f. The finite chain property
  guarantees stabilization. [read] Essence, Corollary "Stabilization".
- **The two conditions have separate roles.** The Rough Guide states this more cleanly
  through its Generic Iteration algorithm (GI). [read] Rough Guide §2, Theorem GI and
  Lemma "Stabilization". https://arxiv.org/abs/cs/9909009
  - (i) Every terminating run computes *a* common fixpoint, with no condition on the
    functions.
  - (ii) If every function is **monotonic**, every terminating run computes the **least**
    common fixpoint.
  - (iii) If every function is **inflationary** and D is finite, every run **terminates**.
  - The Stabilization Lemma needs only monotonicity and a start at ⊥.
  - So, starting from ⊥: **monotone buys uniqueness, and inflationary buys termination.**
- **An arbitrary start (our runs start from the standing criteria).** Apt does not state
  this case. [inferred]
  - With inflationary functions, every iterate stays in ↑d = {x | d ⊑ x}. That set is
    itself a ⊔-po, with least element d: lubs of elements above d are above d. So the
    theorem applies with ⊥ := d, and the limit is the least common fixpoint above d.
  - Without inflationarity, a non-bottom start loses uniqueness even when every function is
    monotone. Counterexample: start at {c}. Let g(x) = x∖{c}, which is monotone. Let
    h(x) = x∪{b} if c∈x, else x, which is monotone. Running h then g ends at {b}. Running
    g then h ends at {}. Both are stable.
  - **So for our model both conditions are needed. From a standing start, inflationary also
    protects uniqueness, not just termination.**
- **Cousot's original theorem.** Cousot's page summarises it as: "Under continuity
  hypothesis we show that any chaotic iterative method converges to the optimal solution."
  Its editorial note says: **"The proof of theorem 2.2 is erroneous"**. A generalization to
  asynchronous iterations with a correct proof appeared later in IMAG R.R. 88.
  [read] https://cs.nyu.edu/~pmc309/COUSOTpapers/AIPL77.shtml
  - Cite Apt for the statement, not CC77a.

## 2. The duality: domain reduction under reverse inclusion, and criteria growth under inclusion

**Verdict: partly holds.** It is a Galois-style correspondence, not an exact duality, and it
is not needed.

- **Apt's lattice.** The order is a family of subsets based on D, ordered by
  X ⊑ Y iff X ⊇ Y. Then ⊥ = D and X ⊔ Y = X ∩ Y. The domain ⊔-po of a CSP is the Cartesian
  product of one such family per variable. [read] Essence §2.1, "based on D"; §3.2.
- **The map from criteria to states.** Write Adm(K) for the states that meet every
  criterion in K. [inferred]
  - K₁ ⊆ K₂ implies Adm(K₁) ⊇ Adm(K₂), and Adm(K₁ ∪ K₂) = Adm(K₁) ∩ Adm(K₂).
  - So Adm maps (criteria, ⊆, ∪) into (state sets, ⊇, ∩) and preserves order and join.
  - It is **not injective**: redundant criteria give the same Adm. It is **not onto**:
    not every set of states is cut out by some set of criteria.
  - It is the standard theory/models Galois connection, not an isomorphism.
- **Consequence.** Uniqueness over criteria implies uniqueness over admissible states, but
  not the reverse. The Confluence page claims uniqueness over criteria, which is the
  stronger claim.
- **It is not needed.** Apt's §2 theorem is generic over any ⊔-po. (P(Criteria), ⊆) with
  ⊥ = ∅ and ⊔ = ∪ is a ⊔-po, and it has the finite chain property if the derivable
  criteria in a run are finite. So the theorem applies directly to criteria, with no
  dualizing. [inferred]
  - The finiteness of the criteria a run can derive is an assumption. Criteria are
    open-ended prose.

## 3. Reduction functions as controllers, and the CI worklist as the run ledger

**Verdict: holds, more closely than MCDT does, with two gaps.** [mostly inferred from read
definitions]

- **Apt's structure.** [read] Essence §2.2, algorithm CI and CIQ; §3.2, Def. "domain
  reduction function"; Example "arc" (π₁, π₂).
  - The domain is a product of per-variable components.
  - Each function has a *scheme*: the components it reads and writes. It is extended to the
    whole product as f⁺, which leaves other components unchanged.
  - Algorithm CI keeps a set G of pending functions. After applying g, it re-adds every
    function that **depends on a component g changed**. CIQ is the same with a queue.
- **The mapping.** [inferred]
  - A **variable** is an artifact-set. Its **domain** is the states still admissible for
    that set.
  - A **binary constraint** is a connection, a relation that must hold between two sets.
  - A **domain reduction function** for a connection is a controller narrowing its own
    set, deriving criteria, from what the other set holds.
  - **CI's re-add rule** is the run ledger: the workflows spanning a written set pick the
    write up.
- **The analogue of a connection.** A binary constraint C ⊆ D₁×D₂ has **two** projection
  functions, π₁ (narrows X given Y) and π₂ (narrows Y given X). One relation, two
  directions of traversal. That is the Connections page's "a relation, not an arrow;
  direction lives in the workflow", stated in the formalism. It bears on P7. [read] Essence
  Example "arc". [inferred] the mapping.
- **The analogue of the join at a controller.** Implicit. Several constraints narrow the
  same variable, and the variable's domain ends as the meet (∩) of all of them. Combined,
  f = ⊔ᵢ fᵢ⁺ componentwise. Nothing in Apt "collects then writes once". CI applies the
  functions one at a time, and the theorem says the order does not matter. That is the
  ledger's "collects to save rework, never to make the run correct". [inferred]
- **Gap: equivalence-preservation.** A domain reduction function must lose no solution of
  its constraint: C ∩ D = C ∩ f(D). [read] Def. "domain reduction function"
  - Our controllers derive criteria from an *intent*. In CP terms the intent is part of the
    problem. A controller then computes the local consequence of the intent for its set,
    which is a projection, so it fits.
  - But a controller that adds a criterion the intent does not imply, such as taste or a
    default, is not an equivalence-preserving reduction. CP would call that a *new
    constraint*, not propagation. [inferred]
- **Gap: Apt's functions are deterministic.** As with MCDT, an agent's derivation is not a
  function until shown otherwise. Model Open question: "Do controllers derive the same
  criteria from one intent?"

## 4. Example B: inflationary but not monotone

**Verdict: Apt implies it but gives no example.**

- Essence never discusses non-monotonic functions. A grep for "non-monoton" and "not
  monoton" finds nothing. [read]
- Rough Guide Theorem GI(i) says a terminating run without monotonicity still reaches *a*
  common fixpoint. GI(ii) needs monotonicity for *the least* one. Apt gives no
  counterexample. [read] Rough Guide Theorem GI.
- Example B is correct [inferred, checked by hand].
  - f(x) = x∪{a}. g(x) = x∪{b} if a∉x, else x. g is inflationary but not monotone:
    {} ⊆ {a}, yet g({}) = {b} ⊄ g({a}) = {a}.
  - The common fixpoints are {a} and {a,b}, and the order picks between them.
- **Correction to example A.** f(x) = x∪{c} and g(x) = x∖{c} are both **monotone**; g is
  not inflationary.
  - They have **no common fixpoint**, so a fair iteration never stabilizes. It oscillates.
  - The draft said "f then g ends without c, g then f ends with c". That describes one
    pass, not a run. Under fair iteration there is no end.
  - Example A therefore shows **non-termination (oscillation)**, not two different settled
    results. That matches the Join page: "Joined, the two would contradict each other, and
    every fix would become a conflict no replay can restore." [inferred]
- **Cost of non-monotone propagation.** Apt does not discuss it. In CP practice it is
  handled outside propagation, by search or by restart. Not sourced; [inferred].

## 5. What CP gives that MCDT does not, and the reverse

**CP gives, for this model:**

- **A1. A theorem about scheduling as such.** [read] Essence Theorems CI, Termination,
  Non-termination.
  - CI Theorem: every terminating execution computes the lfp. If every component has the
    finite chain property, every execution terminates.
  - Termination Theorem for CIQ: if one execution terminates, all do.
  - This is the ledger's claim, "the ledger never makes a run correct", as a theorem.
  - MCDT's feedback solution is itself Kleene iteration. It adds no scheduling theorem of
    its own. [inferred from literature.md §3]
- **A2. Failure detection as conflict.** Apt notes the optimization of stopping "as soon
  as one of the variable domains becomes empty", modelled as reaching ⊤. That is a
  conflict: no state of a set can meet its criteria. MCDT has the analogue, the empty
  antichain. [read] Essence §4.1, end of Related Work.
- **A3. Local consistency is not global consistency.** "most of the notions of local
  consistency are neither implied by nor imply global consistency." [read] Essence §1.1
  - Implication for the model [inferred]: criteria propagation can reach a fixpoint with
    no set empty, so no conflict is detected, and yet no settled state exists. The conflict
    lies across a cycle of connections, and it surfaces only when controllers write.
  - The join at one controller detects only *local* conflicts. This limit is not stated
    anywhere in the model. It is a new finding, a candidate for the Join page.
- **A4. Two projections per binary constraint.** This is the formal statement of
  "undirected connection, direction lives in the workflow" (§3).
- **A5. The Comparison Corollary.** If each function of F is bounded by compositions of
  functions of G, then lim(F) ⊑ lim(G). This could compare two controller configurations
  or two workflow sets on how much they derive. [read] Essence, Corollary "Comparison".
- **A6. Idempotence is not needed** for correctness. A controller need not be stable under
  re-asking. [read] Essence §4.2.

**MCDT gives, and CP (in Apt) does not:**

- **B1. Closure under composition.** A subnetwork of design problems is itself a design
  problem, so a sub-lattice can be abstracted as one node. The structure is a category.
  Apt has join and projection of constraints but no composition theorem in this sense.
  [read] literature.md §2; [inferred] for Apt.
- **B2. Per-edge orientation.** Functionality versus resource matches the model's
  specification and implementation roles per edge. CP constraints have no orientation.
- **B3. Cost and Pareto optimization,** with quantale enrichment, if the ledger ever
  optimizes cost.

## 6. Which theory the Confluence page should cite

**Recommendation.** [inferred from the above]

- **Order independence:** cite the chaotic-iteration theorem as Apt states it: the Rough
  Guide GI Theorem, or the Chaotic Iteration Theorem in Essence, both of which split the
  two roles. Credit Cousot & Cousot as the origin. Do not cite CC77a's theorem 2.2 as the
  proof; Cousot's own page flags it as erroneous.
- **The run's shape:** cite **constraint propagation** as the closer model.
  - Connections are constraints. Controllers are reduction functions.
  - The ledger is the CI/CIQ worklist. Conflict is an empty domain.
  - Also state the local-versus-global limit (A3).
- **Composition and roles:** keep **MCDT** for closure under interconnection and for the
  orientation vocabulary.

---

## Evidence rows

## Claim E12 — The Chaotic Iteration Theorem's hypotheses and conclusion

Date: 2026-11-02
Status: supports (P2), with the start-at-⊥ caveat
Confidence: high

Source:
- Label: Apt, The Essence of Constraint Propagation, §2.1, Theorem "Chaotic Iteration" and
  Corollary "Stabilization"
- URL: https://arxiv.org/abs/cs/9811024
- Type: paper (LaTeX source read)

Notes:
- The order is a ⊔-po: ⊥, lubs of increasing chains, binary lubs. The functions are
  inflationary and monotonic. Runs are fair. The limit is ⊔ f↑j, which is the lfp of
  f = ⊔fᵢ when some iteration stabilizes.
- The proof starts at ⊥. An arbitrary start is my inference: it holds via ↑d when the
  functions are inflationary.

## Claim E13 — Monotone buys uniqueness; inflationary buys termination

Date: 2026-11-02
Status: refines (P1, P2, example A)
Confidence: high

Source:
- Label: Apt, The Rough Guide to Constraint Propagation, Theorem GI and Lemma
  "Stabilization"
- URL: https://arxiv.org/abs/cs/9909009
- Type: paper (LaTeX source read)

Notes:
- GI(i): a terminating run gives a common fixpoint, unconditionally.
- GI(ii): with monotone functions, it gives the least one.
- GI(iii): with inflationary functions on a finite D, every run terminates.
- From a non-bottom start, monotone but non-inflationary functions can reach different
  fixpoints. My counterexample is in §1. So both conditions matter for runs that start
  from standing criteria.

## Claim E14 — Cousot & Cousot 1977's convergence proof is flagged as erroneous by its author

Date: 2026-11-02
Status: weakens (citing CC77a directly)
Confidence: high

Source:
- Label: Cousot publication page, AIPL77, editorial notes
- URL: https://cs.nyu.edu/~pmc309/COUSOTpapers/AIPL77.shtml
- Type: author's site

Notes:
- "Under continuity hypothesis we show that any chaotic iterative method converges to the
  optimal solution." "The proof of theorem 2.2 is erroneous."
- A corrected asynchronous version appeared in IMAG R.R. 88, which was not read.

## Claim E15 — A binary constraint has two projection functions, one per direction

Date: 2026-11-02
Status: supports (P7, the Connections page's "undirected")
Confidence: high (the definition); medium (the mapping)

Source:
- Label: Essence §3.2, Example "arc" (π₁, π₂)
- URL: https://arxiv.org/abs/cs/9811024
- Type: paper

Notes:
- One relation, two reduction directions. This is the formal counterpart of "direction
  lives in the workflow".

## Claim E16 — The CI/CIQ worklist computes the same lfp under every schedule

Date: 2026-11-02
Status: supports (the ledger's "never makes a run correct")
Confidence: high

Source:
- Label: Essence §2.2, Theorems CI, Termination, Non-termination
- URL: https://arxiv.org/abs/cs/9811024
- Type: paper

Notes:
- The worklist re-adds every function that depends on a changed component, which is the
  ledger picking up writes.
- If one CIQ execution terminates, all do.

## Claim E17 — Local consistency neither implies nor is implied by global consistency

Date: 2026-11-02
Status: new limit (Join page)
Confidence: high (the CP claim); medium (its application to the model)

Source:
- Label: Essence §1.1
- URL: https://arxiv.org/abs/cs/9811024
- Type: paper

Notes:
- Criteria propagation can reach a fixpoint with no empty set, while no settled state
  exists.
- A conflict across a cycle of connections is not detected by the join at any one
  controller. It surfaces only at write time.

## Claim E18 — An empty domain as early failure detection

Date: 2026-11-02
Status: supports (conflict = infeasible)
Confidence: high

Source:
- Label: Essence §4.1, end of Related Work
- URL: https://arxiv.org/abs/cs/9811024
- Type: paper

Notes:
- Stop "as soon as one of the variable domains becomes empty", modelled by adding ⊤.

## Claim E19 — The duality between criteria and admissible states is a Galois connection, not an isomorphism

Date: 2026-11-02
Status: corrects (the draft's "exact duality")
Confidence: medium (inferred)

Source:
- Label: Essence §2.1, "family of subsets based on D" (X ⊑ Y iff X ⊇ Y, ⊔ = ∩), plus my
  own reasoning
- URL: https://arxiv.org/abs/cs/9811024
- Type: paper + inference

Notes:
- Adm is order- and join-preserving but neither injective nor onto.
- Not needed: the §2 theorem applies directly to (P(Criteria), ⊆, ∪).

## Claim E20 — Example A oscillates; it does not settle in two different states

Date: 2026-11-02
Status: corrects (the draft's example A)
Confidence: high (checked by hand against the definitions in E12 and E13)

Source:
- Label: inference from Essence definitions (monotonic, inflationary, fair run)
- URL: https://arxiv.org/abs/cs/9811024
- Type: inference

Notes:
- f(x) = x∪{c} and g(x) = x∖{c} are both monotone and have no common fixpoint, so a fair
  iteration never stabilizes.
- A derived criterion can also survive or vanish depending on whether it was derived
  before its source was removed (the §1 counterexample). So a replacement must retract
  what was derived from the replaced criterion. That supports making a replacement a
  version boundary (Q4).

## Could not verify

- The text of Cousot & Cousot 1977 and of IMAG R.R. 88. I read only the author page's
  summary and editorial note.
- Any statement by Apt of chaotic iteration from an arbitrary starting element. My ↑d
  argument is inference.
- Apt's 2003 book chapter on chaotic iteration.
- *The Role of Commutativity in Constraint Propagation Algorithms* (TOPLAS 2000; arXiv
  cs/0012010) was downloaded but not read beyond confirming its scope.
