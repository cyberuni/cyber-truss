---
title: Relationship to SDD
description: SDD as the two-set instance of this model, and what cyber-truss adds
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

## SDD is the two-set instance

Spec-Driven Development has exactly two units of change and one connection between them.
Expressed in this model:

| Model element | SDD |
| --- | --- |
| Unit of change | `{spec.md, .feature}` |
| Unit of change | `{code, test, stories}` |
| Governance targets | oracle / builder / architect bars at each gate; format governances across artifact types |
| Connection | the spec unit ↔ the implementation unit |
| Discharge | the implementation gate |

The vocabulary holds. Two units, a governance table that already exists, one connection,
and the gates turn out to be **where conformance is evaluated at a connection crossing** —
which generalizes cleanly: every connection needs a discharge criterion.

`cyber-truss` is the same model with the constraints lifted: many artifact-sets rather
than two, connections traversable from either end, and discharge that happens
out-of-band rather than inline.

## What running the exercise revealed

Expressing SDD in the model surfaced something that would otherwise have been baked in
wrongly.

**SDD's connection is a strong form** — staged and gated, with the spec approved before
implementation proceeds. Most connections are nothing like that. The Starlight
stylesheet → component connection has no approval step; the obligation simply exists and
is discharged whenever.

Modelling only from SDD would have written staging into the connection type and made
every other connection wear a gate it does not need. Connections vary in whether they are
staged, and that is a property of the workflow rather than of the connection.

This argues for running the same exercise against other two-set instances — ACED for
agent configuration, Quill for documentation — before the model is fixed. Both are cheap
to check and differently shaped.

**Status: Settled** that SDD expresses cleanly. **Open:** whether ACED and Quill do.

## What is generalized

SDD's implementation judge re-derives each scenario's oracle independently rather than
reading the producer's. That is independent re-derivation used to *judge an
implementation*.

This model uses the same mechanism to *normalize any change*, from any entry point, in
any artifact-set. The judge's re-derivation becomes the replay in
[canonical execution](/cyber-truss/model/canonical-execution/), and the
`{oracle, architect, builder}` lens set becomes how the comparison is read.

That continuity is what makes "next revision of SDD" a concrete claim rather than a
positioning statement.

## What is added

**Free entry.** SDD's mission loop privileges the spec. Build-to-learn and backfill are
possible but second-class, and their results differ in quality. This model treats all
entry points as equal at authoring time and normalizes them at execution time.

**Out-of-band discharge.** SDD's gates are synchronous and blocking. Obligations here are
raised without interrupting the work that created them, and discharged later — possibly
in a different session, possibly by a different agent. That is where the efficiency claim
comes from: a designer can prototype uninterrupted while changes propagate to spec,
implementation, and documentation behind them.

**Many sets.** SDD covers two. A repository has more — website content, repository
configuration, agent configuration, design records — and the connections between them are
currently owned by nobody.

## A note on framing

This repository records `cyber-truss` as a **peer** of SDD, settled in
[discussion #16](https://github.com/cyberuni/.github/discussions/16). That is a decision
about naming and organisational placement.

Architecturally the relationship described here is different: SDD is an instance of this
model, and `cyber-truss` is the layer beneath it. The two claims are not in conflict —
they answer different questions — but the second should not be read back into the first.
