# Evidence

The full literature sweep, with rows M1 to M34, is in `raw/literature.md`. This file keeps the
rows the conclusion rests on.

## Claim E1 — A design problem's solution is an antichain of minimal resources

Date: 2026-11-02
Status: supports
Confidence: high

Source:
- Label: Censi, A Mathematical Theory of Co-Design (Defs. 10–13)
- URL: https://arxiv.org/abs/1512.08055
- Type: paper

Notes:
- h(f) = Min{eval(i) : f ≤ exec(i)}. Infeasible gives the empty antichain. Monotone means
  F and R are CPOs and h is Scott-continuous.
- This supports the correspondence "unique set of criteria, many states" (join over
  criteria, not states).

## Claim E2 — MCDPs are closed under series, parallel, feedback, and co-product, and one loop suffices

Date: 2026-11-02
Status: supports
Confidence: high

Source:
- Label: Censi 2015, Theorem 1 and Proposition 1
- URL: https://ar5iv.labs.arxiv.org/html/1512.08055
- Type: paper

Notes:
- Composition preserves monotonicity, which underpins P2: the obligation is per node, not
  per pair.
- Feedback is a least fixed point by Kleene ascent. It terminates on finite-height posets
  and may take ℵ0 steps otherwise (Example 9).

## Claim E3 — Design problems are Bool-profunctors, a compact closed category

Date: 2026-11-02
Status: supports
Confidence: high

Source:
- Label: Fong & Spivak, Seven Sketches, ch. 4 (4.2, 4.5)
- URL: https://math.libretexts.org/Bookshelves/Applied_Mathematics/Seven_Sketches_in_Compositionality%3A_An_Invitation_to_Applied_Category_Theory_(Fong_and_Spivak)/04%3A_Co-design_-_Profunctors_and_Monoidal_Categories
- Type: book

Notes:
- A feasibility relation X^op × Y → Bool is symmetric in presentation. That is the basis for
  the claim that the dual query exists, which is my inference.

## Claim E4 — PyMCDP shows no sign of maintenance

Date: 2026-11-02
Status: supports (P6)
Confidence: medium

Source:
- Label: fgolemo/mcdp fork; co-design.science
- URL: https://github.com/fgolemo/mcdp
- Type: code repo

Notes:
- mcdp.mit.edu redirects to co-design.science, whose certificate had expired.
  AndreaCensi/mcdp returns 404. An independent library, codesign-mcdp (Briat, 2026), exists.

## Claim E5 — No published application of MCDT to software, requirements, or agents

Date: 2026-11-02
Status: supports (novelty)
Confidence: medium (absence claim)

Source:
- Label: literature sweep, M34
- URL: n/a
- Type: search

Notes:
- Applications found: robotics, embodied intelligence, LQG control, AMoD fleets, Formula 1,
  UAVs.

## Claim E6 — Real design spaces leave the monotone case

Date: 2026-11-02
Status: contradicts (limits P1 and P2)
Confidence: medium

Source:
- Label: Carlone & Pinciroli, Robot Co-design: Beyond the Monotone Case (ICRA 2019)
- URL: https://arxiv.org/abs/1902.05880
- Type: paper (abstract)

Notes:
- MCDPs "require all relationships between functionalities and resources to be monotone."

## Claim E7 — The phrase "MCDT in the loop, human on the loop" is unpublished

Date: 2026-11-02
Status: supports
Confidence: medium (absence claim)

Source:
- Label: phrase searches, M32
- URL: n/a
- Type: search

Notes:
- The nearest hit is FAU's coHu project, "Human-in-the-Loop Co-design of Interactive
  Systems", which is participatory design and unrelated to MCDT.

## Claim E8 — Standard meanings of human in, on, and out of the loop

Date: 2026-11-02
Status: supports
Confidence: high

Source:
- Label: Human Rights Watch, Losing Humanity (2012)
- URL: https://www.hrw.org/report/2012/11/19/losing-humanity/case-against-killer-robots
- Type: official report

Notes:
- In the loop: acts only on a human command. On the loop: acts under a human's oversight,
  and the human can override. Out of the loop: no human input.
- Critique: Leins & Kaspersen (Carnegie Council, 2021) say that oversight from on the loop
  degrades with speed, boredom, and gaps in information. This is why the model keeps
  blocking stops for non-monotone writes.
  https://carnegiecouncil.org/media/article/7-myths-of-using-the-term-human-on-the-loop

## Claim E9 — Chaotic iteration of inflationary monotone functions is order-independent

Date: 2026-11-02
Status: supports (P2)
Confidence: medium (original Cousot statement not read)

Source:
- Label: Apt, The Essence of Constraint Propagation (1998), after Cousot & Cousot
- URL: https://arxiv.org/pdf/cs/9811024
- Type: paper

Notes:
- If every function is inflationary and monotone, every fair chaotic iteration has the same
  limit, the least common fixed point.
- Constraint propagation may be a closer analogue to the model than co-design. It is worth a
  follow-up.

## Claim E10 — Join-based merges preserve information, and overwriting does not

Date: 2026-11-02
Status: supports (P3)
Confidence: medium

Source:
- Label: arXiv 2602.10486 (contrast with Cousot-style chaotic iteration)
- URL: https://arxiv.org/abs/2602.10486v1
- Type: paper (search summary)

Notes:
- This is the same line as the model's "replacing a criterion is not a join."

## Claim E11 — Whether controllers derive criteria deterministically is open in the model

Date: 2026-11-02
Status: contradicts (conditions P1 and P2)
Confidence: high

Source:
- Label: cyber-truss Open questions, "Do controllers derive the same criteria from one intent?"
- URL: apps/web/src/content/docs/model/open-questions.md
- Type: project doc

Notes:
- MCDT's guarantees assume the map is a function and is monotone. An agent's derivation is
  neither, until shown otherwise.

## Claims E12–E20 — constraint propagation (Q2)

Recorded in full in `raw/q2-constraint-propagation.md`.
- Apt's Chaotic Iteration Theorem and its hypotheses.
- Theorem GI: monotone gives uniqueness, inflationary gives termination.
- The generic iteration algorithm is schedule-independent.
- Local consistency is not global consistency.
- Cousot's 1977 proof erratum.

Three counterexamples were verified by brute force on 2026-11-02. In each, f and g are the
two steps and the run repeats them until neither changes anything.

- **A.** f adds c and g removes c. Both are monotone, and g is not inflationary. The run
  oscillates under every order.
- **B.** f adds a. g adds b only when a is absent. Both are inflationary, and g is not
  monotone. Order decides: f first settles at {a}, and g first settles at {a, b}.
- **C.** Start from {a}. f removes a, and g adds b when a is present. f is monotone but not
  inflationary. Order decides: f first settles at {}, and g first settles at {b}.
