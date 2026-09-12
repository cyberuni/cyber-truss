---
title: Canonical execution
description: How confluence is bought. Distill a change to its intent, derive criteria, select and replay workflows, compare
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
2. **Distill** it to its **intent**: what the change is for, separated from the particular
   expression of it.
3. **Derive the criteria** the settled state must satisfy, from the intent.
4. **Select** the workflows whose span covers a connection the change has strained.
5. **Replay.** Each selected workflow translates the intent into its own **Request** and
   replays it from its own starting point.
6. **Compare** the replayed deltas against the change that arrived.

The replay is an *independent derivation*. It does not read the incoming change as an
answer; it derives its own and then looks.

**Status: Thesis.** Flagged by its author as needing further design and analysis. The
loop's shape is agreed; several of its parts are not.

## Criteria are derived before the replay, not after

Step 3 is ordered deliberately, and the order is the whole of its value.

A [specification](/cyber-truss/model/specification/) is intent plus criteria, and the
comparison in step 6 is a comparison of criteria. If those criteria were read off the
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

Step 6 changes what the incoming change *is*.

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

### Distillation stops at intent

Distillation produces intent and nothing workflow-shaped. Each selected workflow owns the
translation of that intent into its own Request. Three reasons fix the boundary here.

- **It keeps distillation testable.** If distillation also produced workflow-shaped
  output, that output would depend on which workflows were selected. A selection mistake
  would then read as a stability failure, and the step that most needs evaluating could
  no longer be evaluated alone.
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

## Workflow selection, not injection depth

There is no single global workflow with one starting point.

Several workflows can span the same pair of artifact-sets, and the right ones depend on
the change. A refactor inside `{code, test, stories}` fires a signal to
`{website content}` — and it must **not** drag the whole mission loop in from the spec.
Routing every change through the longest path would reintroduce exactly the ceremony the
model removes.

A change also rarely needs only one. The strain it leaves can cross several connections,
and each crossing may call for a different workflow. So selection yields **every workflow
that applies**. Each translates the intent into its own Request at its own starting
point, and together they work toward one settled state. None of them is the route on its
own.

### How workflows are selected

Selection has a mechanical skeleton with two points of judgement.

1. **Lifting** names the artifact-sets the change touched.
2. **Strain detection** checks each connection on those sets for whether its relation
   still holds. This is judgement, because evaluating criteria needs evaluation.
3. **Candidate lookup** is mechanical. A formal workflow declares the artifact-sets it
   spans and the shape of their connections, so the candidates are the workflows whose
   span covers a strained connection.
4. **Tie-breaking** is judgement. Where several candidates span the same strained
   connection, the intent decides between them.

Intent does less of the selecting than it appears to. In the refactor above, a
behaviour-preserving change does not strain the connection to the spec at all, because
that relation still holds. The mission loop drops out at step 2, before intent is
consulted.

Selection is also not decided once, up front. A replay changes artifacts, those changes
can strain connections further out, and further workflows are selected. Reach is
discovered by propagation rather than predicted from intent, because predicting reach is
the step people fail at today.

This is where the guarantee is currently weakest, and plural selection moves the question
rather than removing it. Canonicalization now needs two things: an intent must pick out
one set of workflows, and the set's results must combine into one state whatever order
they run in. The second is a composition obligation that a single workflow never carried.
The order-theoretic reading of the lattice suggests where it could be met: results that
combine by join cannot depend on order. That is a direction, not a construction.

**Status: Settled** that selection is plural, and discovered by propagation from strain.
**Open**, and load-bearing: whether the set is unique, and how its results combine. See
[Open questions](/cyber-truss/model/open-questions/#does-an-intent-determine-one-set-of-workflows).

## Replay output must not re-trigger replay

Canonical execution produces deltas that land in the repository. Without provenance,
those deltas are themselves lifted and distilled into new intents, and the loop does not
terminate.

Deltas therefore need a marker for *produced by canonical execution*. A small mechanism,
easy to miss until it bites.

The marker does not stop propagation, and must not. Replay output that strains a
connection further out is how [selection](#how-workflows-are-selected) discovers reach. The
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
