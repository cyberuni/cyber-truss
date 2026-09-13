---
title: Canonical execution
description: How confluence is bought. Identify the workflows a change bypassed, distill its intent, derive criteria, select and replay, compare
---

:::caution[Design, not implementation]
Nothing described here is built, and this page is the least settled part of the model.
See [the model overview](/cyber-truss/model/).
:::

## Free entry, canonical execution

At **authoring** time no artifact-set is privileged. Touch the prototype, the spec, the
implementation, or the docs — whichever the work actually starts from.

At **execution** time the execution is canonical. Every entry point is normalized onto the
same set of workflows, run from the same intent.

Both statements are true, and holding them together is what makes the freedom safe rather
than merely fast.

## The loop

A change arriving in the middle of a workflow is not applied outward from where it
landed. It is lifted, distilled, and replayed:

1. **Lift** the raw diff from lines into artifact-set vocabulary.
2. **Find candidates**: the workflows that own or output a changed set, and the workflows
   that read one. See
   [A change finds its candidates](/cyber-truss/model/workflow/#a-change-finds-its-candidates).
3. **Distill** the change to its **intent** by
   [reading back](#distillation-reads-backward) along the first group: what the change is
   for, separated from the particular expression of it.
4. **Derive the criteria** the settled state must satisfy, from the intent.
5. **Select** the workflows that apply. See
   [How workflows are selected](/cyber-truss/model/workflow/#how-workflows-are-selected).
6. **Replay.** Each selected workflow translates the intent into its own **Request** and
   replays it from its own starting point.
7. **Compare** the replayed deltas against the change that arrived.

The replay is an *independent derivation*. It does not read the incoming change as an
answer; it derives its own and then looks.

**Status: Thesis.** Flagged by its author as needing further design and analysis. The
loop's shape is agreed; several of its parts are not.

## The loop starts only from a change

Nothing enters the loop except a change to an artifact-set. Work that must happen with
nobody changing anything is stated as a criterion, and a controller makes the change that
tests it.

A criterion can depend on time. *Market data must not be older than two days* becomes
false as the days pass, with no artifact touched. The cron job that refreshes the data is
a [controller](/cyber-truss/model/controller/), and its run is a change like
any other. If the job fails, the criterion still goes false, and the strain says so. The
[compliance audit](/cyber-truss/model/workflows/#compliance-audit--soc-2-iso-27001) in the
catalog has the same shape: *controls verified within the last twelve months*, and a
scheduled controller whose run is the change.

Whether a source is inside the system is a choice about the boundary, not a property of the
source. A vendor feed is outside until a `{market data}` set is declared, and after that its
changes start runs. A change like that can carry an intent as thin as *the data is
current*. What happens downstream is driven by the criteria the specifications already
state, which take part in the [join](/cyber-truss/model/join/#within-a-run) wherever the
intent does not replace them.

Two requirements follow.

- **Checking a criterion over time must be a lookup.** Every tick reaches every such
  criterion. Judgement at that rate keeps agents running when nothing has changed.
- **Retries across runs need their own bound.** The rules in
  [Cycles must come to rest](#cycles-must-come-to-rest) bound one run. A refresh that fails
  on every tick starts a new run on every tick, and none of those runs repeats a resolution
  within itself.

**Status: Settled** that the loop starts only from a change, and that anything else is
stated as a criterion a controller tests. **Open:** the bound on retries across runs. See
[Open questions](/cyber-truss/model/open-questions/#what-bounds-retries-across-runs).

## Criteria are derived before the replay, not after

Step 4 is ordered deliberately, and the order is the whole of its value.

A [specification](/cyber-truss/model/specification/) is intent plus criteria, and the
comparison in step 7 is a comparison of criteria. If those criteria were read off the
replay's output, the comparison would be checking the workflow against itself and could
only ever conclude *"the incoming change is wrong."*

Derived from the intent instead, the criteria are authored by neither party to the
comparison. They are also shared: every selected workflow is judged against the same
criteria, not against criteria read off its own Request. A workflow that produces something conforming-but-wrong now fails criteria it
did not write. This is the same move SDD makes by freezing the `.feature` suite before the
implementation exists, generalized from one gate to every crossing.

It does not close the question below — criteria derived from a misread intent are wrong in
the same direction as everything downstream of them. It replaces *hope that the comparison
is honest* with a mechanism that can be inspected.

**Status: Thesis.** The ordering is agreed; what "derive the criteria" consumes beyond the
intent is not.

## The inversion

Step 7 changes what the incoming change *is*.

The designer's mockup is not the deliverable. It is a **prediction of the settled state**,
and the replay is the independent derivation that checks it. The comparison is where the
prediction earns its place or is discarded.

This is what makes ad-hoc entry safe. Ad-hoc output is never trusted — it is evidence.
And it explains why the three approaches currently differ in quality: today, whichever
artifact you touched first is simply *believed*.

## Reading the comparison

The comparison is classified through the three backward lenses SDD already uses:

| Outcome | Lens | Question |
| --- | --- | --- |
| Stop the effort | **oracle** | Should this exist at all? |
| Change course or scale | **architect** | Is the shape right? |
| Match, holes, improvements | **builder** | Does it conform to the contract? |

The mechanism is not new either. SDD's implementation judge already re-derives each
scenario's oracle independently rather than reading the producer's. This model
generalizes independent re-derivation from *judging an implementation* to *normalizing
any change*. Same mechanism, wider scope — which is the concrete content of the claim
that this is SDD's next revision rather than a new system wearing its vocabulary.

**Status: Settled** that the lens set is the right vocabulary for the comparison.

## Distillation carries the weight

Confluence by canonicalization does not eliminate the confluence requirement. It
concentrates it here.

Two different mid-workflow changes expressing the same intent **must distill to the same
intent**. If distillation is lossy or unstable, path-independence dies at this step
instead of in the connections.

That concentration is the point. One hard place that can be evaluated beats many places
that cannot, and the evaluation writes itself: feed several different expressions of one
intent — a mockup, a prose description, a failing test — and check that the distilled
intents match. On current reading this is the single highest-value thing to evaluate in
the whole system.

### Distillation reads backward

A diff alone cannot say what a change is for. Whether the rule it introduces is already
stated, stated differently, or stated nowhere depends on the specifications the change
bypassed.

So distillation walks each
[upstream candidate](/cyber-truss/model/workflow/#a-change-finds-its-candidates) in
reverse, along its shape from the changed set toward its declared start, and reads the
intent and criteria of each set it passes. Where the walk reaches a set another workflow
owns or outputs, it can continue along that one. It stops at the first set that holds or
contradicts what the change implies, or at a declared start with nothing above it.

This is the inverse of a workflow, and it is not a workflow. A workflow reads its inputs
and writes the sets it owns or outputs. Distillation follows the same path the other way
and writes nothing. Reading on the way up and writing on the way down keeps a change to one
ascent and one descent. If every step up wrote, each set reached would start its own pass
back down.

It also removes an ambiguity. Two workflows can span one connection with opposite roles.
Distillation follows only the workflows that own or output the set the change landed in, so
for one change it never reads a connection in both directions.

What distillation reads is bounded in time. It reads the specifications as they stood when
the change was made. Reading later state lets hindsight into the intent, which the
[trading example](/cyber-truss/examples/stock-trade-without-thesis/) shows backfilling a
thesis the trader never held.

**Status: Thesis.** **Open:** how far up a walk should go before it stops, and what form
the time bound takes.

### Distillation stops at intent

Distillation produces intent and nothing workflow-shaped. Each selected workflow owns the
translation of that intent into its own Request. Three reasons fix the boundary here.

- **It keeps distillation testable.** Distillation reads along the workflows a change
  identified, and identification is a lookup over declared outputs. Hold the lookup fixed
  and distillation can be evaluated alone. If distillation also produced workflow-shaped
  output, it would depend on selection, which involves judgement, and a selection mistake
  would read as a stability failure.
- **Ownership follows knowledge.** A workflow knows what a Request at its starting point
  looks like. A central distiller would need every workflow's input shape, and that
  coupling grows with each workflow added.
- **Criteria stay neutral.** Criteria derive from the shared intent, so no workflow
  authors the bar it is judged against.

The cost is that translation is a second agentic step, run once per selected workflow,
which spreads back out some of the risk canonicalization concentrated. Translation is
narrower than distillation, one intent into one vocabulary, and each workflow can be
evaluated in isolation: the same intent must yield the same Request. That is several
places that can be checked, which is still unlike per-relation confluence, where the
places cannot be.

Distillation is also **irreducibly agentic**. It cannot be a script, which is what finally
settles the plugin question: the core operation of the model needs judgement and context,
not a shell command.

**Status: Settled** that distillation is load-bearing and agentic, and that it produces
intent while each workflow owns its Request. **Open:** whether distillation can be made
stable enough to carry the guarantee, which is the thesis's main risk, and whether
per-workflow translation is stable too.

## Order is not controlled

The order in which selected workflows run cannot be fixed in advance. A workflow with a
human in the loop takes as long as the human takes, and a design review can return more
than its Request asked for, up to a new design. cyber-truss exists because work arrives
this way, so the model takes the order it is given.

Workflows that finish in some order either reconcile or disagree. When they reconcile, no
further work is needed. When they disagree, the disagreement is a strained connection, and
it selects further workflows in another cycle. Disagreement costs cycles. It is not an
error.

Order may change the path: which workflows run, and how many cycles pass. It may also change
where the run settles. A settled state is any state in which every connection holds, and
criteria rarely fix only one. Two orders can reach different settled states that meet the
same criteria, and neither is wrong. That is why
[confluence](/cyber-truss/model/confluence/#the-claim) is claimed over criteria rather
than over one state. The Transformation Priority Premise in test-driven development makes
the same observation: the order of transformations can change which algorithm you end up
with.

What order must not do is choose between settled states silently. When workflows disagree
and a decision takes one side, the decision is recorded. Without the record, whichever
workflow finished last decides, and that is the old habit of believing whichever artifact
was touched first, decided by timing instead.

**Status: Settled** that order is not controlled, that disagreement runs further cycles,
and that a run may settle in any state that meets its criteria provided choices between
states are recorded. **Open:** whether work a human adds during a replay, beyond what the
Request asked for, carries the original intent or is distilled as a new one.

## Cycles must come to rest

Nothing so far makes a run stop. Two workflows can amend each other's side on every cycle,
each state locally reasonable, and never settle. Every cycle costs tokens, so this is the
most expensive way the loop can fail.

Deciding whether an arbitrary loop of rewrites comes to rest is undecidable, so the model
does not try to detect it. It constrains the loop so that it terminates by construction. A
turn limit is the weak form of that constraint. It caps the cost but cannot tell progress
from circling, and when it is written in a prompt an agent can ignore it. SDD's three-turn
limit has both weaknesses.

Four rules make the constraint.

1. **Criteria are versioned and frozen for a run.** The criteria derived in step 4 are
   version 1. During a run only two events create a new version: a person adds criteria,
   or a disagreement is settled by a recorded decision. An agent cannot create a version
   by adding criteria. This is SDD's frozen `.feature` suite, extended from one gate to a
   whole run.
2. **Each resolution is recorded** as a connection paired with the criteria version it was
   brought into agreement with.
3. **A cycle may only resolve pairs not already recorded.** A connection resolved under
   version *v* and strained again under *v* means one workflow undid another's work. That
   is oscillation, and the run stops.
4. **A stop needs a decision to continue.** The decision settles the conflict and creates
   the next version. An agent may decide a given conflict once. Reversing a decision needs
   a person.

At one version there are finitely many connections to resolve. Versions grow only through
decisions and people, and each conflict takes at most one agent decision. So a run with no
person in it is bounded. A run with people in it continues as long as they keep adding
criteria, which is iteration somebody chose.

The check in rule 3 is a lookup, which puts it at the deterministic end of the
[controller spectrum](/cyber-truss/model/controller/). `truss` can refuse to
record a cycle that resolves nothing new, so the bound does not depend on an agent
following an instruction.

### A reversal renamed as a new criterion

Rule 1 depends on a judgement: whether a proposed criterion is new, or a reversal of a
decision under a new name. An agent could route a reversal through that door.

The [controller](/cyber-truss/model/controller/) of the specification set
is placed to catch it. Its job is to hold the set's intent and criteria consistent and
balanced, and a criterion that contradicts a recorded decision is an inconsistency inside
the set. It is not the workflow proposing the criterion, so it is not judging its own work.
It can only see a contradiction with decisions it can read, so a decision lands in the
specification set it affects, not in the ledger alone.

This narrows the weakness without closing it. A contradiction is caught. A criterion that
erodes a decision without contradicting it, such as an exception broad enough to hollow it
out, is caught only if the controller judges balance as well as consistency.

### Append-only history, not append-only criteria

The record the rules read is append-only. Each version, resolution, and decision is added
and never edited, the way an ADR is superseded rather than rewritten. The criteria
themselves are not append-only. Between runs a specification changes freely, and criteria
are rewritten and removed. Holding criteria to append-only would be too restrictive. They
are frozen within a run, free between runs, and the history of how each version replaced
the last is what cannot change.

**Status: Thesis.** The rules bound a run with no person in it. **Open:** whether the
specification controller catches erosion as well as contradiction, and what holds the
record. See
[What vehicle holds pending Requests?](/cyber-truss/model/open-questions/#what-vehicle-holds-pending-requests)

## Replay output must not re-trigger replay

Canonical execution produces deltas that land in the repository. Without provenance,
those deltas are themselves lifted and distilled into new intents, and the loop does not
terminate.

Deltas therefore need a marker for *produced by canonical execution*. A small mechanism,
easy to miss until it bites.

The marker does not stop propagation, and must not. Replay output that strains a
connection further out is how [selection](/cyber-truss/model/workflow/#how-workflows-are-selected) discovers reach. The
distinction is what the output carries: it is never distilled again into a new intent,
and the strain it produces carries the original intent onward. Without intent owned by
distillation, "do not re-trigger replay" and "discover reach by propagation" would
contradict each other.

**Status: Settled** that provenance is required, and that marked output propagates strain
under the original intent. **Open:** the marker's form.

## The failure mode to design against

Canonicalization guarantees confluence *of the executed path*. It says nothing about
whether that path is correct.

If the defined workflow is wrong, every entry point now converges reliably on the same
wrong place — and the ad-hoc changes that used to reveal the problem are being normalized
away before they can.

The comparison step is the only protection, and it works only if disagreement is treated
as evidence about **the workflow** as often as about the change. A comparison that can
only conclude *"this change is wrong"* will launder a defective workflow indefinitely.

Deriving criteria [ahead of the replay](#criteria-are-derived-before-the-replay-not-after)
is the mechanism proposed against this. It is not yet a full answer, because it moves the
exposure up to the distilled intent rather than removing it.

**Status: Settled** as a requirement on the comparison. **Open:** whether independently
derived criteria are enough to enforce it.
