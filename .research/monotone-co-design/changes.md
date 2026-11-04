# Changes

## 2026-11-02

- What changed: initial research, in draft mode.
- Why: the user asked for a comparison of MCDT with the lattice model, and for a reading of
  "MCDT in the loop, human on the loop."
- Conclusion changed materially: n/a (first version).
- Triggering evidence: Censi 2015, Fong & Spivak ch. 4, Apt 1998, HRW 2012, and the
  project's model docs.

## 2026-11-02 (revision)

- What changed: P2 is restated. The theorem gives the criteria-layer claim a proof structure:
  confluence within a version, plus recorded decisions between versions. It does not weaken
  the case against per-relation confluence, because that option is about states. The verdict
  now also says the condition is sufficient, not necessary.
- Why: the user asked what happens when the assumption breaks. Checking that showed P2 had
  mixed up the criteria layer with relations between states.
- Conclusion changed materially: yes, P2 only.
- Triggering evidence: Confluence page "Two ways to buy it"; Join page "Within a run";
  Workflow page leash (pre-approval).

## 2026-11-02 (Q2)

- What changed:
  - Q2 answered: constraint propagation (Apt) is the citation for order independence, and
    MCDT for composition.
  - Added P8: local consistency is not global consistency.
  - P7 supported, and Q4 sharpened toward retracting derived criteria.
  - Corrected example A: it oscillates under every order, rather than settling in two
    places.
  - Recorded that the duality is one-way, and that the theorem is stated from ⊥.
- Why: the user asked to check Q2 against the primary source.
- Conclusion changed materially: yes. There is a new citation and a new proposal, P8.
- Triggering evidence: Apt, Essence (cs/9811024); Apt, Rough Guide (cs/9909009);
  brute-force check.

## 2026-11-02 (user decisions)

- What changed:
  - P1 is scoped to within a criteria version.
  - P3, P4, P6, and P7 are accepted.
  - Ranking the settled states (from P5) is filed as a research issue.
- Why: the user's review.
- Conclusion changed materially: no. The proposal status was recorded.

## 2026-11-02 (Q4)

- What changed:
  - P2 and P8 are accepted.
  - Q4 is reframed with model findings F1–F4, including a docs inconsistency on which
    decisions create a version.
  - Proposed: approval confirms the version, and refusal creates a new one.
  - F5 recommends retracting through recorded criteria references (TMS), not DRed.
  - F6 maps CALM onto the slogan.
- Why: the user asked to dig deeper into Q4.
- Conclusion changed materially: yes. Q4 is reframed, with a new recommendation that awaits
  the user's ruling on F3.
- Triggering evidence: the bug-fix variant A example; rule 4 and the leash text; Hu, Motik &
  Horrocks (arXiv 1711.03987); Hellerstein & Alvaro (CALM).

## 2026-11-02 (criteria structure)

- What changed:
  - User decision: references are to individual criteria.
  - Added `raw/criteria-structure.md`: why the use-case graph stops oscillation, framed as the
    theorem's three preconditions.
  - Added proposals P9–P13.
- Why: the user asked how MCDT could improve criteria structure, given SDD's experience
  with loose criteria.
- Conclusion changed materially: yes. New proposals P9–P13.
- Triggering evidence: the Specification page ("Criteria are authored through use cases",
  Open: grain); Censi 2017 on interval uncertainty; Apt.

## 2026-11-02 (semver ruling)

- What changed: the user adopted the rule that criteria versions follow semver. Patch is a
  rewording, minor is a person adding criteria, and major is a removal, replacement, or
  refusal, which triggers withdrawal. Approval bumps the standing specification, not the
  run.
- Why: it resolves Q4 and the inconsistency between rule 4 and the leash's version wording.
- Conclusion changed materially: yes. Q4 is closed.
- Triggering evidence: F1–F5 in `raw/q4-model-findings.md`.

## 2026-11-02 (P9 ruling)

- What changed:
  - The semver ruling is narrowed to its breaking-change signal, and the patch tier is
    dropped. A rewording is a replacement, so it is major. Only adding criteria is minor.
  - A breaking bump re-judges affected writes against the current criteria before redoing
    any, so a harmless rewording stays cheap.
  - P9 is accepted as restated: identity is the criterion's self-contained text, not a leaf
    node or a minted ID. The criteria-structure table's identity row is corrected, and P13
    is flagged for a recheck.
- Why: the user pointed out that the judge reads a criterion's text, so a rewording can
  change a verdict. With no patch tier, withdrawal is a set difference over texts, and an
  ID has no remaining job.
- Conclusion changed materially: yes. P9 is restated and the semver ruling is narrowed.
- Triggering evidence: the user's review; P3 (rewording is not inflationary).

## 2026-11-04 (P10 ruling)

- What changed:
  - P10 is accepted with amendments A6–A10 and Q5, folding in the split between a design
    spec, a functional spec, and code and test (engineering names used as examples).
  - A6 is a placement test: hold the outcome, vary the encoding.
  - A8 relaxes the Specification page's rule on lower rungs: writes from the implementation
    may add, never change.
  - A9: prose decides only what building cannot settle.
  - A10: churn measures misplacement.
  - Added `raw/p10-placement-check.md`.
- Why: the user observed that use cases written at design time drift into implementation
  detail, and pointed to cyber-agentkit PR #135, whose design spec was trimmed after four
  review rounds.
- Conclusion changed materially: yes. New proposals were ruled, and one Thesis on the
  Specification page is to be relaxed.
- Triggering evidence:
  - PR #135 and its ADR 0003.
  - A blind classification of the 312 pre-trim cases: the first A6 failed, the revised A6
    fit about 80%.
  - The churn counts.
  - The component-library `totalPages` example.

## 2026-11-04 (P11 ruling)

- What changed:
  - P11 is accepted with B1 and B2.
  - B1: a flip on an unchanged state has two causes, a loose criterion or judge variance, so
    the pair is judged once more before routing to the controller.
  - B2: rule 2 must also record the state hash and the verdict, so the diagnosis is a lookup
    over new fields, not over the existing record.
- Why: P9 and P10 as ruled narrow the cause of a flip to an agent-judged prose criterion, and
  rule 3 in `canonical-execution.md` records only a connection and a version.
- Conclusion changed materially: yes. Rule 2 is to gain two recorded fields.
- Triggering evidence: the user's ruling; rules 2 and 3 of "Cycles must come to rest".

## 2026-11-04 (P11 rejudged, P12 ruling)

- What changed:
  - P11 rejudged: B1 withdrawn; B3 (an unchanged-state flip means the criterion is not a
    function under its judge, whatever the cause) and B4 (routing follows the criterion's
    origin) added; B2 narrowed to one field, a hash of everything the judge read.
  - P12 rejected. A mutual-entailment note for the topology diff is recorded in its place.
- Why: the user asked for a rejudge. One extra sample cannot separate a loose criterion from
  judge noise; fixing a criterion in the version is a major bump that rule 1 reserves for a
  person or a decision; the verdict field was implied by the record. P12's antichain is
  trivial over graph leaves, and leaf IDs no longer exist after P9.
- Conclusion changed materially: yes. P11's routing now goes through a decision for criteria
  in the version.
- Triggering evidence: rules 1–4 of "Cycles must come to rest"; the semver ruling in
  `raw/q4-model-findings.md`; Q5.
