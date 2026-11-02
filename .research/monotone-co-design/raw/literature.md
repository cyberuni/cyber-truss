# Monotone Co-Design Theory (MCDT/MCDP): literature findings

Researched 2026-11-02. "Verified" below means I fetched the source and read the quoted/paraphrased text, except where marked. Primary paper text for Censi 2015 was read via the ar5iv HTML rendering of arXiv:1512.08055 (v4 content).

Terminology note: Censi's paper uses "DPI" (design problem with implementation) and the map `h : F -> AR` (antichains of resources). Fong & Spivak use "feasibility relation" / Bool-profunctor. Same objects, two presentations.

---

## 1. Core formalism

- Censi defines a **DPI** as a tuple <F, R, I, exec, eval>: F a poset (functionality space), R a poset (resource space), I a set (implementations), `exec: I -> F` (functionality an implementation provides), `eval: I -> R` (resources it requires). (Def. 10) [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper
- The solution map is `h : F -> AR`, `f |-> Min_R { eval(i) | i in I and f <= exec(i) }`. Orientation: you ask for functionality **at least** f, and get the **minimal** resources that suffice. Infeasible f gives the empty antichain. (Def. 11) [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper
- Order on antichains: A <= B iff upper-closure(A) is a superset of upper-closure(B). Top of AR is the empty set (= infeasible); bottom is {bottom of R} if it exists. (Def. 1-4, Lemma 1-2) [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper
- `h` is monotone: f1 <= f2 implies h(f1) <= h(f2) in AR (asking for more functionality moves the resource antichain "up", possibly to the empty set). [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper
- **Definition of "monotone" (Def. 13):** a DPI is monotone iff (1) F and R are complete partial orders (CPOs: directed-complete with a bottom) and (2) `h` is Scott continuous. **MCDPs** are co-design problems (CDPIs, a multigraph of DPIs, Def. 12) whose subproblems all satisfy this. Scott continuity implies monotonicity, but does not imply topological continuity. [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper
- Fong & Spivak present the same thing as a **feasibility relation**: "a monotone map Phi : X^op x Y -> Bool"; "if Phi(x,y) = true we say x can be obtained given y". In their chassis example the left ports (load, velocity) are the functionality produced and the right ports (torque, speed, $) are the resources required. [Seven Sketches ch.4 sec 4.2, LibreTexts](https://math.libretexts.org/Bookshelves/Applied_Mathematics/Seven_Sketches_in_Compositionality%3A_An_Invitation_to_Applied_Category_Theory_(Fong_and_Spivak)/04%3A_Co-design_-_Profunctors_and_Monoidal_Categories/4.02%3A_Enriched_Profunctors) — book (online text)
- Caveat on orientation: in the Fong-Spivak page I read, resource preorders are ordered by availability ("x <= x' means x is available given x'"). The page I fetched does not itself spell out how that reconciles with Censi's "functionality >= / resources <=" phrasing; the user's "functionality >= / resources <=" statement matches Censi's `f <= exec(i)` and `Min_R` definitions, not a quoted Fong-Spivak sentence. Treat the reconciliation as my reading, not a quote. — uncertainty flag
- Fong & Spivak generalise: V-profunctors for a quantale V (Bool gives feasibility; other V give cost-enriched variants). [Seven Sketches 4.5, LibreTexts](https://math.libretexts.org/Bookshelves/Applied_Mathematics/Seven_Sketches_in_Compositionality%3A_An_Invitation_to_Applied_Category_Theory_(Fong_and_Spivak)/04%3A_Co-design_-_Profunctors_and_Monoidal_Categories/4.05%3A_Profunctors_form_a_Compact_Closed_Category) — book (online text)

## 2. Composition operators and closure

- Censi's operators on DPIs: **series** (Def. 14; requires F2 = R1; implementations are pairs with eval1(i1) <= exec2(i2)), **parallel** (Def. 15; product), **loop** (Def. 16; feedback, for F = F1 x R, constrains eval(i) <= exec2(i)), and **co-product** (Def. 17; union of implementation spaces over the same F and R). [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper
- Matching operators on the solution maps `h`: series `h1 (o) h2 = f |-> Min U_{s in h1(f)} h2(s)`; parallel `f1,f2 |-> h1(f1) x h2(f2)` (antichain product); feedback `h^dagger : f1 |-> lfp(Psi)` with `Psi : R |-> Min U_{r in R} h(f1, r) ∩ up(r)`; co-product `Min(h1(f) ∪ h2(f))` (Defs. 20-23, Table I). [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper
- **Theorem 1:** the class of MCDPs is closed under interconnection. Proof route: Proposition 1 shows any CDPI is equivalent to one built from par/series/loop over atoms plus trivial "plumbing" DPIs, and a single `loop` suffices; Propositions 2-4 check monotonicity is preserved by each operator. **Theorem 2:** `h` of the whole has an explicit recursive expression in the `h` of the parts. [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper
- Categorical structure: Fong & Spivak Theorem 4.63 says Prof_V (V a skeletal quantale) is a **compact closed** category; the dual of X is X^op; compact closure is what gives meaning to feedback wires. [Seven Sketches 4.5, LibreTexts](https://math.libretexts.org/Bookshelves/Applied_Mathematics/Seven_Sketches_in_Compositionality%3A_An_Invitation_to_Applied_Category_Theory_(Fong_and_Spivak)/04%3A_Co-design_-_Profunctors_and_Monoidal_Categories/4.05%3A_Profunctors_form_a_Compact_Closed_Category) — book (online text; page presents proof as a sketch)
- Zardini et al. call the SMC of design problems "DP" and describe it as compact closed: "the compact closed SMC of design problems (DP), which enables a compositional approach to co-design in engineering." [Furter, Huang, Zardini, arXiv:2503.17274 (ACT 2025; EPTCS 442, 2026)](https://arxiv.org/abs/2503.17274) — paper
- A 2026 paper by Huang & Zardini describes the structure as a "traced symmetric monoidal category" (via a search-result summary; I did not read the paper body, so the wording is second-hand). [arXiv:2603.14047](https://arxiv.org/abs/2603.14047) — paper (second-hand claim, medium confidence). Compact closed implies traced, so the two descriptions are consistent.
- Quantale-enriched extension: series, parallel, feedback remain valid over commutative quantales; change-of-base maps let subsystems use different evaluation semantics. [Riess et al., arXiv:2603.29921 (Mar 2026)](https://arxiv.org/abs/2603.29921) — paper (abstract read)
- "Intersection" as a separate operator: I did not find one in Censi 2015. The operator set there is series, parallel, loop, co-product. — see "Could not verify"

## 3. Solution method

- **Query:** given functionality f, compute `h(f)`: the antichain (Pareto front) of minimal resources. Infeasible gives the empty antichain. [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper
- The paper's formulation is the "minimal resources for given functionality" direction. The dual query (max functionality for given resources) is not developed in the text I read. I did not verify a statement of the dual query in a primary source; Fong-Spivak's profunctor presentation is symmetric (dual = X^op) so it is available categorically, but that is my inference. — uncertainty flag
- **Feedback = least fixed point on antichains.** The monotone map `Psi` on AR; Kleene ascent `R_{k+1} = Psi(R_k)` from bottom. Lemma 3: monotone map on a CPO has an lfp. Lemma 4 (Kleene): with Scott continuity, lfp = sup of the ascent chain bottom <= f(bottom) <= ... [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper
- **Guarantees along the way:** for any finite k, resources below R_k are infeasible, so the sequence is a certificate of infeasibility; if it converges to a non-empty antichain R_inf, everything below it is infeasible but above it there may be holes (the feasible set need not be upward complete in the sense of "all feasible"). Converging to the empty set means no solution. The method computes only minimal elements, not the whole feasible set. [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper
- **Complexity (Prop. 5), for dp = loop(dp0) with dp0 built from series/par only:** memory O(width(R0)); steps O(height(AR0)); total O(width(R0) x height(AR0) x c), c the cost of evaluating h0. The paper states these worst-case bounds are strict; its Example 9 (`x |-> x+1` on extended naturals) converges to top only after aleph_0 steps. The conclusion says complexity "depends on a measure of interdependence between design problems" (loosely coupled is easier). [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper
- **Termination:** guaranteed convergence needs the chain to stabilise, e.g. finite posets or finite height of AR. On infinite posets the ascent can be infinite (Example 9). The 2026 `codesign-mcdp` manual lists three stopping conditions (fixed point, infeasibility, loop axis saturating) and says the antichain-lattice result is stated for finite or chain-complete posets. [codesign-mcdp manual, arXiv:2607.18415](https://arxiv.org/html/2607.18415v1) — paper/manual (third party)
- **Approximation for infinite posets:** Censi 2015 states that an infinite antichain can be bounded between two finite antichains, giving inner and outer approximations under a computation budget, and defers it to the uncertainty paper. Sampling/coarsening the spaces is described as hard to keep complete and consistent. [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055); [Censi, Uncertainty in MCDPs, arXiv:1609.03103 (RA-L 2017)](https://arxiv.org/abs/1609.03103) — paper
- Soundness/completeness: the paper claims a "complete solution" (the antichain of all minimal resources is characterised as an lfp and computable by Kleene). I did not find a separate theorem named "soundness"; the claim is via Theorem 2 and Lemma 4. [Censi 2015 abstract](https://arxiv.org/abs/1512.08055) — paper
- Scalable special case: Linear Design Problems (polyhedral relations over Euclidean posets) reduce exactly to multi-objective linear programs and are closed under the three interconnections. [Cai et al., arXiv:2603.29083 (Mar 2026)](https://arxiv.org/abs/2603.29083) — paper (abstract read)

## 4. Tooling

- **PyMCDP / MCDPL:** introduced in Censi 2015 ("PyMCDP, an interpreter and solver for MCDPs... software and a manual at http://mcdp.mit.edu"). MCDPL is a declarative language "inspired by CVX" and stricter (e.g. multiplying by a negative number is a syntax error). [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper
- `mcdp.mit.edu` now returns HTTP 301 to `https://co-design.science` (checked with curl). When I fetched `https://co-design.science` the tool reported "certificate has expired"; curl failed to connect (HTTP 000). So the project site was not readable by me. [co-design.science](https://co-design.science) — official site (unreachable at check time, likely lapsed TLS cert; not independently confirmed as cause)
- The GitHub repo `AndreaCensi/mcdp` returns 404 (API and web). I found no live canonical PyMCDP repo. A 2017 fork `fgolemo/mcdp` (pushed 2017-09-01, 8 stars) has a README saying "PyMCDP is a Python interpreter and solver for Monotone Co-Design Problems" and pointing to co-design.science for the manual. [fgolemo/mcdp](https://github.com/fgolemo/mcdp) — code repo (fork)
- Related repos under org `co-design-models` (examples, `mcdp_uncertainty`, `iros2023-tutorial`, `ACT4E-exercises-spring2023`, etc.) and `idsc-frazzoli/act4e-compute-examples` (created 2025-11, last push 2025-12-07). GitHub's `pushed_at` for several co-design-models repos is 2026-07-08 with identical timestamps, which looks like a bulk migration rather than development; so do not read it as active maintenance. [co-design-models org](https://github.com/co-design-models); [act4e-compute-examples](https://github.com/idsc-frazzoli/act4e-compute-examples) — code repos
- **Maintenance verdict:** PyMCDP/MCDPL: no evidence of active maintenance that I could verify (site cert expired, main repo 404, only a 2017 fork found). Confidence medium; I could not see the site or the repo history.
- **Newer independent tooling:** `codesign-mcdp` v0.2.1 by Corentin Briat (MIT license; repo created 2026-05-18; arXiv manual 2607.18415, July 2026, 123 pages). Python objects instead of a DSL; antichain calculus, six primitive DP types, series/parallel/feedback, Kleene solver, an MCDPL-style declarative builder, set-based and stochastic uncertainty, compositional online learning (citing Alharbi/Dahleh/Zardini), temporal/online co-design, 25 examples. Briat is listed at a University of Life Sciences in Muttenz, Switzerland; he is not on the Censi/Zardini author lists I saw. The README does not mention PyMCDP and makes no LLM/agent claims. [cbriat/codesign-mcdp](https://github.com/cbriat/codesign-mcdp); [arXiv:2607.18415](https://arxiv.org/abs/2607.18415) — code repo / paper
- Related non-MCDP tooling for the same problem class: constraint-programming component selection with monotone subsystem decomposition (Wilhelm & Napp, ICRA 2025). [arXiv:2505.11624](https://arxiv.org/abs/2505.11624) — paper
- Teaching: the MIT course 1.144 "Applied Category Theory for Engineering Design" (Zardini; TA Yujun Huang) uses a work-in-progress textbook "Applied Category Theory for Engineering" (ACT4E; Censi, Lorand, Zardini per the course syllabus as reported by search; the course page itself names the book but not the authors, and mentions no software). [ACT4ED course page](https://zardini.mit.edu/act4ed) — official site
- Zardini Lab stresses "reusable model libraries and demos" as tooling goals. [Zardini Lab research](https://zardini.mit.edu/Research) — official site

## 5. Applications

- Robotics: running examples in Censi 2015 are robot platform design (battery, motor, sensing, computation, energetics) and a battery-technology case. [Censi 2015, ar5iv](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper
- Duckietown: search surfaced a Censi slide deck framing Duckietown as a minimality case study. I did not read it and did not verify an MCDP-on-Duckietown paper. [Censi slides (EPFL ACCES)](https://www.epfl.ch/labs/acces/wp-content/uploads/2018/04/Censi_slides.pdf) — talk (slides; unread, medium-low confidence)
- Embodied intelligence / self-driving stack: [Zardini et al., Co-Design of Embodied Intelligence: A Structured Approach, arXiv:2011.10756 (IROS 2021)](https://arxiv.org/abs/2011.10756) — paper
- Control co-design (LQG as monotone feasibility relations; search-and-rescue drone): [arXiv:2011.10758 (ECC 2021)](https://arxiv.org/abs/2011.10758); vehicle control: [Task-driven Modular Co-design of Vehicle Control Systems, arXiv:2203.16640 (CDC 2022)](https://arxiv.org/abs/2203.16640) — papers
- Autonomous mobility on demand (fleet + vehicle + transit): [On the Co-Design of AV-Enabled Mobility Systems, arXiv:2003.04739 (ITSC 2020)](https://arxiv.org/abs/2003.04739); [Co-Design to Enable User-Friendly Tools to Assess the Impact of Future Mobility Solutions, arXiv:2008.08975 (IEEE Trans. Network Science and Engineering)](https://arxiv.org/abs/2008.08975). The ArtMED Interreg project reportedly carried this into a web tool for transport authorities (via search summary; not opened). — papers
- Formula 1: "On the Co-Design of Components and Racing Strategies in Formula 1", IEEE IV 2024, pp. 2876-2881. I saw only the ETH repository listing via search; no arXiv version found. [ETH Research Collection](https://www.research-collection.ethz.ch/items/04565d33-dfb0-444f-aa54-51e3033e59bf) — paper
- Target tracking and UAV delivery: [Quantale-enriched co-design, arXiv:2603.29921](https://arxiv.org/abs/2603.29921); gripper and rover: [arXiv:2603.29083](https://arxiv.org/abs/2603.29083) — papers
- Systems-engineering-adjacent (not MCDP, but related category-theoretic design): operads for system design specification, Foley et al., Proc. R. Soc. A 2021. [arXiv:2101.11115](https://arxiv.org/abs/2101.11115) — paper
- **Software engineering, requirements, LLM/agent systems, human-in-the-loop design:** I found **no** application of MCDT to any of these. Censi 2015 diagrams include labels such as "human", "training", "cognitive load" (per a search summary of the paper's figures), but I found no dedicated treatment. — see "Could not verify"

## 6. Known limits and criticisms

- **Monotonicity is the entry condition.** A 2019 ICRA paper says MCDPs can handle nonlinear, nonconvex, discontinuous systems "but require all relationships between functionalities and resources to be monotone", and proposes a non-monotone alternative with discrete module choice as binary vectors. [Carlone & Pinciroli, Robot Co-design: Beyond the Monotone Case, arXiv:1902.05880](https://arxiv.org/abs/1902.05880) — paper (quote via search summary; I read the abstract only)
- Where monotonicity fails: I found no general catalogue. The theory's own premise is that more functionality never costs less, and more resources never provide less. Anything with non-monotone trade-offs (e.g. a resource whose excess harms functionality, or interference effects) must be re-modelled or relaxed. This is my inference from the definition, not a quoted limit. — uncertainty flag
- **Uncertainty:** the original framework had only intervals (worst/best case). Later work says intervals "cannot represent probabilistic risk or multi-stage adaptive decisions" and that this limits applicability where uncertainty matters. [Huang, Furter, Zardini, arXiv:2504.02766 (CDC 2025)](https://arxiv.org/abs/2504.02766); [Huang & Zardini, arXiv:2603.14047](https://arxiv.org/abs/2603.14047); [Censi 2017 interval uncertainty, arXiv:1609.03103](https://arxiv.org/abs/1609.03103) — papers
- **Scalability / Pareto size:** worst-case iteration bounds are expressed by width of R and height of AR and are stated to be tight; antichain width can blow up with many objectives. Censi 2015 states complexity depends on coupling. The `codesign-mcdp` manual lists catalog Cartesian products "that can blow up" as a modelling pitfall. I found no independent benchmark paper criticising Pareto-front scalability. [Censi 2015](https://ar5iv.labs.arxiv.org/html/1512.08055); [arXiv:2607.18415](https://arxiv.org/html/2607.18415v1) — paper
- **Expensive evaluations:** compositional online learning is proposed because evaluating blocks can be costly; open problems listed include sample-complexity bounds and noisy evaluations. [Alharbi, Dahleh, Zardini, arXiv:2604.22624 (Apr 2026)](https://arxiv.org/abs/2604.22624) — paper
- **Exactness vs generality:** the generic theory does not by itself say which problem classes are exactly and scalably computable; LDPs isolate one such class. [arXiv:2603.29083](https://arxiv.org/abs/2603.29083) — paper
- **Discrete/categorical choices:** supported natively (catalogs; the implementation space I is any set; Censi's first example is optimisation over the naturals with a discrete poset). Competing approaches say constraint programming handles large discrete catalogs better than linearisation-based methods. [Censi 2015](https://ar5iv.labs.arxiv.org/html/1512.08055); [Wilhelm & Napp, arXiv:2505.11624](https://arxiv.org/abs/2505.11624) — papers
- **Boolean-only feasibility:** the quantale-enriched paper argues a native quantitative enrichment avoids "structural and computational drawbacks of boolean-only approaches" (paraphrase of abstract). [arXiv:2603.29921](https://arxiv.org/abs/2603.29921) — paper
- **Theory-of-design position:** Censi 2015 contrasts with Suh's axiomatic design (which forbids cycles) and claims MCDPs handle recursive constraints. [Censi 2015, sec. X](https://ar5iv.labs.arxiv.org/html/1512.08055) — paper

## 7. Recent work 2023-2026 (Zardini at MIT, Censi)

I verified abstracts via the arXiv API unless noted.

- 2024: Abbott & Zardini, [Diagrammatic Negative Information, arXiv:2404.03224](https://arxiv.org/abs/2404.03224): categorical treatment of "what is not possible"; only tangentially co-design. — paper
- 2024: Co-Design of Components and Racing Strategies in Formula 1 (IEEE IV 2024), see section 5. — paper
- 2025: Furter, Huang, Zardini, [Composable Uncertainty in Symmetric Monoidal Categories for Design Problems, arXiv:2503.17274](https://arxiv.org/abs/2503.17274) (ACT 2025; EPTCS 442, 2026). — paper
- 2025: Huang, Furter, Zardini, [On Composable and Parametric Uncertainty in Systems Co-Design, arXiv:2504.02766](https://arxiv.org/abs/2504.02766) (CDC 2025). — paper
- 2026: Huang & Zardini, [Distributional Uncertainty and Adaptive Decision-Making in System Co-design, arXiv:2603.14047](https://arxiv.org/abs/2603.14047): distributions over design problems; Markov-kernel re-parameterisations; compositionality preserved. — paper
- 2026: Riess, Huang, Klawonn, Zardini, Hale, [Quantale-Enriched Co-Design, arXiv:2603.29921](https://arxiv.org/abs/2603.29921). — paper
- 2026: Cai, Huang, Alharbi, Zardini, [Scalable Co-Design via Linear Design Problems, arXiv:2603.29083](https://arxiv.org/abs/2603.29083). — paper
- 2026: Alharbi, Dahleh, Zardini, [Compositional Online Learning for Multi-Objective System Co-Design, arXiv:2604.22624](https://arxiv.org/abs/2604.22624): co-design with learning (optimistic evaluators, elimination of implementations before evaluation, certificates propagated through the multigraph). — paper
- 2026: Briat, [codesign-mcdp, arXiv:2607.18415](https://arxiv.org/abs/2607.18415). — paper/manual (third party)
- Zardini Lab news 2025-2026 (MIT News items on uncertainty in design and on coordinated-system optimisation with compositional architectures; DARPA Young Faculty Award 2025; ACT4ED course Jan 2025). [Zardini Lab research page](https://zardini.mit.edu/Research) — official site (news list read; linked articles not opened)
- Games / negotiation between designers: the lab page lists game theory among its methods and a 02/2025 MIT News item on co-opetitive network design. I did not find a Zardini co-design-plus-game-theory paper with a link I could verify. [Zardini Lab research page](https://zardini.mit.edu/Research) — official site
- **Co-design + LLMs, co-design of "processes" or "decisions", "compositional systems engineering" as an LLM topic:** nothing found. Adaptive decision-making appears only in the distributional-uncertainty paper (multi-stage decisions as Markov kernels). — see "Could not verify"
- Censi 2023-2026 output: I did not locate any 2023-2026 Censi-authored MCDT paper. I did not fetch his personal page, and I did not verify his current affiliation. — see "Could not verify"

## 8. Phrase search and human-in/on-the-loop definitions

### Phrase search

- Searched: "co-design in the loop" "human on the loop"; "MCDT in the loop"; "MCDP in the loop"; "monotone co-design" "in the loop" human; plus Censi/Zardini with human-on-the-loop. **No result contained "MCDT in the loop, Human on the loop" or a close variant.** The user may have coined it; I cannot prove a negative across the whole web (search engine only, US-only, a handful of query variants).
- Nearest hits are unrelated uses of "co-design" + "human-in-the-loop": the German DFG research training group **coHu** "Human-in-the-Loop Co-design of Interactive Systems" at FAU (about participatory/user co-design, not Censi's MCDT) [coHu](https://cohu.fau.eu/); and a design-sprint paper [Human-in-the-Loop Design Cycles, arXiv:2003.05268](https://arxiv.org/abs/2003.05268). Neither uses monotone co-design. — official site / paper
- Practitioner post contrasting "human in the loop vs on the loop where agents build": [DEV Community (BrainGrid)](https://dev.to/braingrid/human-in-the-loop-vs-on-the-loop-where-you-belong-when-agents-build-4hk2) — blog; no MCDT content.

### Standard meanings

- **Human Rights Watch, "Losing Humanity" (2012), Summary, "Definitions and Technology":**
  - human-in-the-loop: "Robots that can select targets and deliver force only with a human command"
  - human-on-the-loop: "Robots that can select targets and deliver force under the oversight of a human operator" (the operator can override)
  - human-out-of-the-loop: "Robots that are capable of selecting targets and delivering force without any human input or interaction"
  [HRW](https://www.hrw.org/report/2012/11/19/losing-humanity/case-against-killer-robots) — official report (read via fetch; first 100k chars only, definitions are in the Summary)
- HRW also treats on-the-loop with very limited supervision as effectively out-of-the-loop (per search summary of the executive summary). [HRW exec. summary PDF](https://www.hrw.org/reports/Losing%20Humanity%20Executive%20Summary.pdf) — official report (not opened directly)
- **Critiques of the framing:** Leins & Kaspersen (Carnegie Council, 2021) say in-the-loop means a human who can halt the system, argue "on the loop" distances humans further from systems, and cite speed, boredom, and information gaps. [Carnegie Council](https://carnegiecouncil.org/media/article/7-myths-of-using-the-term-human-on-the-loop) — blog/essay (read)
- DoD Directive 3000.09 does not use the loop vocabulary; it speaks of "appropriate levels of human judgment over the use of force". Via search summary and Wikipedia, not read in the primary directive. [Wikipedia](https://en.wikipedia.org/wiki/Department_of_Defense_Directive_3000.09) — secondary
- Control-literature roots (Sheridan supervisory control) were not directly sourced; one search result only mentions Sheridan indirectly. — see "Could not verify"

---

## Evidence rows

| claim-id | claim | confidence | source URL | source type |
|---|---|---|---|---|
| M1 | DPI = <F,R,I,exec,eval>; h(f) = Min{eval(i) : f <= exec(i)} | high | https://ar5iv.labs.arxiv.org/html/1512.08055 | paper |
| M2 | MCDP: F,R are CPOs and h is Scott continuous (Def. 13) | high | https://ar5iv.labs.arxiv.org/html/1512.08055 | paper |
| M3 | Operators: series, parallel, loop, co-product; one loop suffices (Prop. 1) | high | https://ar5iv.labs.arxiv.org/html/1512.08055 | paper |
| M4 | Theorem 1: MCDP class closed under interconnection | high | https://ar5iv.labs.arxiv.org/html/1512.08055 | paper |
| M5 | Feedback = lfp of Psi on antichains, computed by Kleene ascent | high | https://ar5iv.labs.arxiv.org/html/1512.08055 | paper |
| M6 | Prop. 5: memory O(width R0), steps O(height AR0), total O(width x height x c); bounds strict | high | https://ar5iv.labs.arxiv.org/html/1512.08055 | paper |
| M7 | Kleene ascent on infinite posets may take aleph_0 steps (Example 9) | high | https://ar5iv.labs.arxiv.org/html/1512.08055 | paper |
| M8 | Finite inner/outer antichain approximations exist (deferred to uncertainty paper) | medium | https://ar5iv.labs.arxiv.org/html/1512.08055 | paper |
| M9 | Interval uncertainty extension composes with series/parallel/feedback | high | https://arxiv.org/abs/1609.03103 | paper |
| M10 | Feasibility relation = monotone Phi: X^op x Y -> Bool; "x can be obtained given y" | high | https://math.libretexts.org/Bookshelves/Applied_Mathematics/Seven_Sketches_in_Compositionality%3A_An_Invitation_to_Applied_Category_Theory_(Fong_and_Spivak)/04%3A_Co-design_-_Profunctors_and_Monoidal_Categories/4.02%3A_Enriched_Profunctors | book |
| M11 | Prof_V is compact closed (Thm 4.63); gives feedback semantics | high | https://math.libretexts.org/Bookshelves/Applied_Mathematics/Seven_Sketches_in_Compositionality%3A_An_Invitation_to_Applied_Category_Theory_(Fong_and_Spivak)/04%3A_Co-design_-_Profunctors_and_Monoidal_Categories/4.05%3A_Profunctors_form_a_Compact_Closed_Category | book |
| M12 | DP is a compact closed SMC | high | https://arxiv.org/abs/2503.17274 | paper |
| M13 | Quantale-enriched co-design keeps series/parallel/feedback over commutative quantales | high | https://arxiv.org/abs/2603.29921 | paper |
| M14 | Linear design problems reduce to MOLP and are closed under interconnection | high | https://arxiv.org/abs/2603.29083 | paper |
| M15 | Distributional uncertainty extension remains compositional | high | https://arxiv.org/abs/2603.14047 | paper |
| M16 | Compositional online learning with optimistic evaluators (2026) | high | https://arxiv.org/abs/2604.22624 | paper |
| M17 | PyMCDP/MCDPL introduced in Censi 2015; site mcdp.mit.edu | high | https://ar5iv.labs.arxiv.org/html/1512.08055 | paper |
| M18 | mcdp.mit.edu 301-redirects to co-design.science; co-design.science TLS cert expired at fetch time | medium | https://co-design.science | official site |
| M19 | AndreaCensi/mcdp GitHub repo returns 404; only 2017 fork fgolemo/mcdp found | medium | https://github.com/fgolemo/mcdp | code repo |
| M20 | PyMCDP actively maintained: not supported by evidence found | low-medium | https://github.com/fgolemo/mcdp | code repo |
| M21 | codesign-mcdp v0.2.1 (Briat, 2026, MIT license) is an independent Python implementation | high | https://github.com/cbriat/codesign-mcdp | code repo |
| M22 | codesign-mcdp manual: termination conditions, finite/chain-complete posets, blow-up pitfalls | medium | https://arxiv.org/html/2607.18415v1 | paper (partial read) |
| M23 | Applications: embodied intelligence/self-driving, LQG control co-design, vehicle control | high | https://arxiv.org/abs/2011.10756 | paper |
| M24 | Applications: AMoD fleet/vehicle/transit co-design | high | https://arxiv.org/abs/2008.08975 | paper |
| M25 | Formula 1 components + racing strategy co-design (IEEE IV 2024) | medium | https://www.research-collection.ethz.ch/items/04565d33-dfb0-444f-aa54-51e3033e59bf | paper (listing only) |
| M26 | MCDPs require monotone relations; non-monotone case needs other methods | medium | https://arxiv.org/abs/1902.05880 | paper (abstract + search summary) |
| M27 | Interval-only uncertainty cannot express risk; motivates distributional extension | high | https://arxiv.org/abs/2504.02766 | paper |
| M28 | Constraint-programming alternative for discrete component catalogs | medium | https://arxiv.org/abs/2505.11624 | paper (abstract) |
| M29 | ACT4E textbook is work in progress (Censi, Lorand, Zardini) | medium | https://zardini.mit.edu/act4ed | official site (authors from syllabus per search result, unverified directly) |
| M30 | HRW definitions of in/on/out-of-the-loop (2012) | high | https://www.hrw.org/report/2012/11/19/losing-humanity/case-against-killer-robots | official report |
| M31 | Critique of "on the loop" framing (Leins & Kaspersen 2021) | high | https://carnegiecouncil.org/media/article/7-myths-of-using-the-term-human-on-the-loop | essay |
| M32 | No source found for "MCDT in the loop, Human on the loop" or close variants | medium (absence claim) | n/a (searches only) | n/a |
| M33 | coHu "Human-in-the-Loop Co-design" is a different, unrelated use of co-design | high | https://cohu.fau.eu/ | official site (via search summary) |
| M34 | No MCDT application to software engineering, requirements, LLM agents found | medium (absence claim) | n/a | n/a |

## Could not verify

- The phrase "MCDT in the loop, Human on the loop" or variants ("MCDP in the loop", "co-design in the loop" + "human on the loop"): not found; a negative from a few web searches, not exhaustive. Slide decks and talk titles are poorly indexed.
- Censi's current affiliation, his personal page, and any 2023-2026 Censi paper. Not looked up directly.
- Whether PyMCDP/MCDPL is maintained. The site certificate had expired, the main repo returned 404, and I could not read co-design.science or Censi's repo history.
- The ACT4E book's actual PDF (bit.ly link on the course page not opened) and its content on composition operators or the dual query.
- A primary-source statement of the dual query (max functionality for given resources) and of a standalone "intersection" operator. Not found in Censi 2015; Fong-Spivak page for 4.3 (composition) not read fully.
- Fong & Spivak sections 4.1/4.3 text; I used 4.2 and 4.5 only. The 4.5 fetch did not mention Censi; whether the book credits Censi in the further-reading section (a search summary says yes) is unconfirmed by me.
- Duckietown + MCDP paper: only a Censi slide deck surfaced; unread.
- Contents of Zardini's Publications page, the 2023 entries, and any games/negotiation co-design paper; the MIT News items listed on the lab page were not opened.
- The ArtMED web tool details (search summary only).
- Primary text of DoD Directive 3000.09 and Sheridan's supervisory-control literature as source for the loop terms; I cite HRW (2012) and one critique instead. A 2026 claim in one search result that a presidential memorandum orders a rewrite of 3000.09 was not verified and is excluded.
- Whether the traced/compact closed descriptions in arXiv:2603.14047 are verbatim; I saw only a search summary of that paper's body.
- Complexity classes (e.g. NP-hardness) of MCDP queries in general: Censi 2015 gives iteration bounds in width and height, but I found no general hardness result.
