---
title: Canonical execution
description: How confluence is bought — distill a change to a Request, replay it, compare
---

:::caution[Design, not implementation]
Nothing described here is built, and this page is the least settled part of the model.
See [the model overview](/cyber-truss/model/).
:::

## Free entry, canonical execution

At **authoring** time no artifact-set is privileged. Touch the prototype, the spec, the
implementation, or the docs — whichever the work actually starts from.

At **execution** time exactly one path runs. Every entry point is normalized onto it.

Both statements are true, and holding them together is what makes the freedom safe rather
than merely fast.

## The loop

A change arriving in the middle of a workflow is not applied outward from where it
landed. It is lifted, distilled, and replayed:

1. **Lift** the raw diff from lines into artifact-set vocabulary.
2. **Distill** it to a **Request** — the intent behind the change, separated from the
   particular expression of it — together with the workflow that applies.
3. **Replay** the Request through that workflow from its starting point.
4. **Compare** the replayed delta against the change that arrived.

The replay is an *independent derivation*. It does not read the incoming change as an
answer; it derives its own and then looks.

**Status: Thesis.** Flagged by its author as needing further design and analysis. The
loop's shape is agreed; several of its parts are not.

## The inversion

Step 4 changes what the incoming change *is*.

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
Request**. If distillation is lossy or unstable, path-independence dies at this step
instead of in the connections.

That concentration is the point. One hard place that can be evaluated beats many places
that cannot, and the evaluation writes itself: feed several different expressions of one
intent — a mockup, a prose description, a failing test — and check that the Requests
match. On current reading this is the single highest-value thing to evaluate in the whole
system.

Distillation is also **irreducibly agentic**. It cannot be a script, which is what finally
settles the plugin question: the core operation of the model needs judgement and context,
not a shell command.

**Status: Settled** that distillation is load-bearing and agentic. **Open:** whether it
can be made stable enough to carry the guarantee. This is the thesis's main risk.

## Workflow selection, not injection depth

There is no single global workflow with one starting point.

Several workflows can span the same pair of artifact-sets, and the right one depends on
the change. A refactor inside `{code, test, stories}` fires a signal to
`{website content}` — and it must **not** drag the whole mission loop in from the spec.
Routing every change through the longest path would reintroduce exactly the ceremony the
model removes.

So distillation emits **a Request and the workflow that applies**, and selection is part
of its job rather than a fixed constant.

This is where the guarantee is currently weakest. Uniqueness plainly does not hold per
connection-pair, since multiple workflows can span one pair. It may hold at the level of
the *set of artifact-sets*. That is not yet established — and it matters, because if no
level guarantees uniqueness then confluence needs a different construction than the one
above.

**Status: Open**, and load-bearing. See
[Open questions](/cyber-truss/model/open-questions/#at-what-level-is-the-workflow-unique).

## Replay output must not re-trigger replay

Canonical execution produces deltas that land in the repository. Without provenance,
those deltas are themselves lifted and distilled into new Requests, and the loop does not
terminate.

Deltas therefore need a marker for *produced by canonical execution*. A small mechanism,
easy to miss until it bites.

**Status: Settled** that provenance is required. **Open:** its form.

## The failure mode to design against

Canonicalization guarantees confluence *of the executed path*. It says nothing about
whether that path is correct.

If the defined workflow is wrong, every entry point now converges reliably on the same
wrong place — and the ad-hoc changes that used to reveal the problem are being normalized
away before they can.

The comparison step is the only protection, and it works only if disagreement is treated
as evidence about **the workflow** as often as about the change. A comparison that can
only conclude *"this change is wrong"* will launder a defective workflow indefinitely.

**Status: Settled** as a requirement on the comparison. **Open:** how it is enforced.
