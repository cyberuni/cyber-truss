# Q4: model-side findings (2026-11-02)

Sources: the model pages Join, Workflow (leash), and Canonical execution (rules 1–4), and the
examples software-bug-fix (variant A), marketing-campaign-headline, design-token-border,
insulin-double-check, and component-library-bug-fix.

## F1. In the worked example, a pre-approved replacement removes no criterion from the run's version

In bug-fix variant A, step 4 derives version 1 from the intent, and version 1 already holds
*round up*. The replacement at step 6 removes *round down, plus one* from the spec's
**standing** specification, the criteria it held before the run. The approval and the
pre-approval are "recorded as a decision under rule 4, and neither changes a criterion", and
"every write meets the same version 1 criteria". The non-monotone step therefore sits between
the standing specification and version 1, which is already a boundary: the start of the run.

## F2. The docs disagree about which decisions create a version

- Rule 1: a new version comes only when a person adds criteria, or when a disagreement is
  settled by a recorded decision.
- Rule 4: "A stop needs a decision to continue. The decision settles the conflict and creates
  the next version."
- Leash: "An approval is a decision, and it is recorded like one, so rule 4 applies to it."
- Bug-fix variant A: the approval is a rule-4 decision, it changes no criterion, and the run
  stays at version 1.

Read literally, the Leash page says an approval creates version 2, and the example says it
does not. This needs a ruling.

## F3. Proposed ruling: approval and refusal are not symmetric

- **An approval confirms version 1.** Version 1 was derived from the intent and already holds
  the new criterion, so no version is created and nothing is retracted.
- **A refusal contradicts version 1.** The decision keeps the old criterion, and version 1
  held the new one. It creates version 2, and anything written under version 1 that rests
  on the refused criterion must be retracted.

## F4. Where retraction is needed, the examples never test it

- Insulin: "If the approver declines at the policy, the run stops there and nothing below it
  is written."
- Marketing: the downstream jobs wait on `{messaging}`.
- Border: the refusal leaves a redraw that is consistent either way.

None shows a refusal arriving after downstream writes have already proceeded under version
1. Under the default strain policy those writes do proceed, when they are *additive*,
because the leash stops only reversals.

Concrete case: in bug-fix variant A, reconciliation at `{code, test}` adds a test that an
exact multiple produces no empty page. That test is derived from *round up*, and it is
additive, so it proceeds. If the product owner refused the replacement, the test would
contradict the kept rule, and nothing in the model retracts it. Every later run would then
meet a strained connection whose cause is a leftover from a refused version.

## Reframed Q4

Pre-approval is not the issue (F1), once F2 is ruled. The open question is:

> What retracts additive writes, made under version *v*, that rest on a criterion a later
> decision removes from version *v*?

The candidate mechanisms come from the literature survey: justification tracking (TMS) and
over-delete-and-rederive (DRed). The provenance the ledger already keeps per contribution
may be enough to support either.

## F5. Recommendation: retract through recorded references (TMS style), not by rederiving (DRed style)

Literature: `raw/q4-retraction-literature.md`, rows E21 onward.

- **The model already records most of a justification.** A Write receives "references to
  the criteria of the sets above". A Reconcile returns "any criteria it had to derive
  itself". Each ledger contribution keeps its provenance. Recording, with each write, the
  criteria references it was made against is a JTMS justification: "this write rests on
  {A, B}".
- **Withdraw outward from the refused criterion.** At a refusal (a version boundary),
  withdraw every write whose recorded references include the refused criterion, then
  continue transitively. Do not count supports, because counting breaks on cycles. The
  withdrawn writes are redone under version 2 by ordinary propagation, since a write is a
  change.
- **Why not DRed.** DRed asks "does this still have another support?" by rerunning
  derivations. With an agent doing the derivation, that is expensive and not
  deterministic. DRed's correctness theorem (Hu, Motik & Horrocks, Theorem 1: the result
  equals rematerialisation from scratch) assumes derivation is a deterministic function, so
  it does not transfer.
- **Early cutoff.** If a redone write produces the same artifact, propagation stops there.
  This idea comes from Build Systems à la Carte.
- **Open: granularity.** Retraction is only as precise as the references. If a write
  references "the criteria of `{spec}`" as a whole, a refusal withdraws everything written
  against the spec, which is DRed's over-delete at set granularity. Per-criterion references
  make it precise, at more bookkeeping cost.

## F6. CALM gives the slogan a formal home

CALM (Hellerstein & Alvaro, "Keeping CALM", CACM 2020): a computation has a consistent,
coordination-free distributed implementation if and only if it is monotone. Non-monotone
points need coordination. In this model the coordination is a person or a recorded decision
at a version boundary. That is "MCDT in the loop, human on the loop" stated as a theorem: the
monotone part runs with no person, and a person, the coordinator, comes in exactly at the
non-monotone points.

LVars' *freeze* (quasi-determinism, where a write after freeze is an error) is the nearest
match for a version that has been decided. That is inference.

## Ruling (user, 2026-11-02): criteria versions follow semver

Adopted. This supersedes the F3 wording.

| Semver | Change to criteria | Run version | Writes already made |
| --- | --- | --- | --- |
| Patch | A leaf is reworded, keeping its identity and giving the same verdicts | No bump | Untouched |
| Minor | A person adds criteria during the run | Minor bump | Untouched; the new criteria join the old |
| Major | A criterion is removed or replaced | Major bump | Writes that reference the removed leaves are withdrawn and redone (P13) |

- Criteria that agents derive within a run cause no bump. They compute the version; they do
  not change it.
- There are two version lines. The **standing specification** carries across runs, and
  approving a replacement is a major bump to it, recorded in the append-only history. The
  **run's criteria** apply within one run. An approval does not bump them, because version 1
  already holds the new criterion. A refusal is a major bump to the run.
- Breakage is computed, not declared. With per-leaf references (P9), a removal breaks
  exactly the writes that reference the removed leaves. A removal nobody references is
  still major, with nothing to withdraw.
- Rule 3 compares full versions. Re-strain after a minor bump is legitimate. Re-strain at
  the same version is oscillation.

### Doc changes this implies (for a separate session)

- **Canonical execution, rules 1 and 4.** Restate version creation as minor (a person adds
  criteria) and major (removal, replacement, refusal, a settled conflict that drops a
  criterion). "Creates the next version" in rule 4 applies only to decisions that change
  criteria.
- **Leash.** "Rule 4 applies to it" is narrowed to the record and to reversal by a person.
  An approval bumps the standing specification, not the run.
- **Join, "Within a run" and "Append-only history".** Name the two version lines.
- **Add withdrawal** (P13) wherever a refusal can arrive after additive writes. No example
  covers that case yet. Bug-fix variant A, refused, is the candidate example.
