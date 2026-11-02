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
