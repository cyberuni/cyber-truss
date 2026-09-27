---
title: Three layers
description: Intent, criteria and behavior. What moves through the lattice, where each one stands, and the layer the guarantee is claimed at
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

Three kinds of thing move through the lattice, and the model treats them differently at
every step. Naming them is not decoration: one of the findings in the examples is a
statement of one kind doing the work of another, and without the distinction the run that
follows looks correct at every point.

## What moves

| Layer | Holds | Where it stands | How two of them combine |
| --- | --- | --- | --- |
| **Intent** | What a change is for | Specifications, as use cases | Nothing combines them |
| **Criteria** | What must be true of an outcome | Over artifact-sets | Union, in any order |
| **Behavior** | The artifacts as they are | Artifact-sets | Nothing combines them |

**Intent** is argued with, not evaluated. It states what something is for and which
direction it should move in.

**Criteria** are evaluated against an outcome, without reading how the outcome was
produced. That is what makes them survive a change of representation, and what makes them
the only layer with an order-independent combining rule: criteria arriving by different
routes [join by union](/cyber-truss/model/join/#what-the-join-combines).

**Behavior** is the prose, the code, the drawing, the signed record. Two runs of one change
may leave it in different states, and the model permits that outright as long as the states
meet the same criteria.

The two outer layers have no join, for opposite reasons. Behavior needs none, because
nothing requires two states to be reconciled into one. Intent has none by construction:
[nothing in the model takes two intents and reconciles them](/cyber-truss/model/canonical-execution/#distillation-reads-within-one-workflow),
and they meet only after each has become criteria.

## These are not stacked artifacts

[Specifies is a relation, not a layer](/cyber-truss/model/specification/#specifies-is-a-relation-not-a-layer)
rejects reading a repository as artifacts that say what to do stacked over artifacts that
do it, because the roles are per-edge and both attach to the same artifact on different
edges. That rejection stands, and these three layers are not a way back to it.

They classify what moves, not what an artifact is. A
[specification is intent plus criteria](/cyber-truss/model/specification/#a-specification-is-intent-plus-criteria),
so a single artifact-set carries content at two layers at once, and an implementation set
[authors no use cases of its own](/cyber-truss/model/specification/#criteria-are-authored-through-use-cases)
while still holding criteria it stands under. No layer owns a set, and no set sits in one
layer.

## The operations are the transitions

The model names four operations, argued one at a time and over several sessions. Each of
them turns out to be a move between two layers.

| Operation | From | To |
| --- | --- | --- |
| [Distillation](/cyber-truss/model/canonical-execution/#distillation-carries-the-weight) | Behavior | Intent |
| [Derivation](/cyber-truss/model/canonical-execution/#criteria-are-derived-before-the-replay-not-after) | Intent | Criteria |
| A write | Criteria | Behavior |
| [Reconciliation](/cyber-truss/model/canonical-execution/#reconciling-at-the-source) | Behavior and criteria | Behavior |

Nothing was designed to produce that table, which is the reason to read the layers as a
description of the model rather than an addition to it. It also places a question that had
no home: [lifting](/cyber-truss/model/open-questions/#smaller-but-unresolved), raising a
line diff into the vocabulary of an artifact-set, is preparation for the first transition,
which is why it keeps coming up beside distillation without belonging to it.

## Where the guarantee sits

The claim lives in the middle layer, and the two outside it are treated in opposite ways.

- **Behavior: nothing is claimed.** [Order is not controlled](/cyber-truss/model/canonical-execution/#order-is-not-controlled),
  two orders may settle in different states, and a choice between states is recorded rather
  than prevented.
- **Criteria: the claim.** [Confluence](/cyber-truss/model/confluence/#the-claim) is claimed
  here, and it is the layer where a combining rule exists that does not depend on order.
- **Intent: nothing is claimed yet.** Intents are not joined, and until
  [Two workflows read one border](/cyber-truss/examples/design-token-border/) nothing said
  what may not happen to them either.

That asymmetry is the useful part. States below the claim are free to differ. Intents above
it are not free to contradict, because criteria derived from contradicting intents are
themselves contradictory and arrive at the join as a conflict nobody can trace back to its
cause.

## Intent stands in the specification

A [use case](/cyber-truss/model/specification/#criteria-are-authored-through-use-cases)
names an actor, the goal that actor arrives with, and every path that misses the goal. That
is intent in its standing, articulated form, which gives a need a durable home and a place
to be argued with between runs.

So a distilled intent is a claim about that structure: which need, already stated
somewhere, this change serves. Stating it that way makes it answerable by something other
than the taste of whoever distilled it, and it is why the intent layer can have a
requirement at all.

**Open:** what makes such a claim admissible, and what happens to a change whose need no
specification states yet.

## A criterion promoted to intent

The failure the border example turned up is a layer violation, and it is worth stating on
its own because it will recur wherever a workflow's span is narrow.

Token governance read a hard-coded `2px` border and stated *this control sets a border
width as a value of its own*. That is true of the diff. As a criterion of
`{design tokens}` it is also ordinary and correct: every value the product draws is named,
checked against whatever the settled state turns out to draw.

What it is not is an intent. It says nothing about what the change is for, and it is
conditional on a behavior fact the run was in the middle of revising. Promoted to the top
layer it drove a run: criteria were derived from it, a write to `{design language}` followed,
that write reached a [stop](/cyber-truss/model/workflow/#leash) for the design lead, and the
token that came out of it named a value nothing drew by the time it existed.

The shape to watch: a criterion is evaluated against a state, while an intent selects which
state to seek. Promote one to the other and the run pursues a condition that another branch
may be removing. See
[What notices two intents answering one need?](/cyber-truss/model/open-questions/#what-notices-two-intents-answering-one-need)

**Status: Settled** that intent stands in the specification and that intents are never
joined. **Thesis** that the three layers describe what the model moves and that the four
operations are transitions between them. **Open:** what makes an intent admissible, and what
enforces non-contradiction between the intents one change produces.
