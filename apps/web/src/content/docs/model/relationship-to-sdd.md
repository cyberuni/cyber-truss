---
title: Relationship to SDD
description: SDD as the two-set instance of this model, and what cyber-truss adds
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

`cyber-truss` does not replace SDD. SDD is one
[formal workflow](/cyber-truss/model/workflows/) among several: a policy over two
artifact-sets, catalogued beside seven others that span different combinations. This model
is the vocabulary those workflows are written in. The two are separate projects, settled as
peers in [discussion #16](https://github.com/cyberuni/.github/discussions/16).

They also run on different clocks. SDD runs from a change request to a handoff and then
retires, while convergence is a property of repository state and has to hold continuously.
That is the second sense in which cyber-truss sits
[under SDD](/cyber-truss/#why-a-layer-under-sdd).

SDD is the two-set entry in that catalog, and this page sets out which of its constraints
are lifted.

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
| Standing specification | the frozen `.feature` suite, authored through use cases and a control-flow graph in `spec.md` |
| Approver | the Council, who ratifies what a gate escalates |

The vocabulary holds. Two units, a governance table that already exists, one connection,
and gates that turn out to be **where conformance is evaluated at a connection crossing**.
That last one generalizes: every connection needs a discharge criterion.

`cyber-truss` is the same model with the constraints lifted. Many artifact-sets rather
than two, connections traversable from either end, and discharge that happens out-of-band
rather than inline.

## Staging belongs to the workflow, not the connection

SDD's connection is a strong form: staged and gated, with the spec approved before
implementation proceeds. Most connections are nothing like it. The Starlight stylesheet →
component connection has no approval step. The obligation simply exists, and it is
discharged whenever.

A model drawn from SDD alone would write staging into the connection type, and every other
connection would wear a gate it does not need. Connections vary in whether they are staged,
and that variation is a property of the workflow.

**Status: Settled** that SDD expresses cleanly in this model. Whether
[ACED and Quill do](/cyber-truss/model/open-questions/#smaller-but-unresolved) is open.

## What is generalized

The judging mechanism carries over. SDD's implementation judge re-derives each scenario's
oracle independently rather than reading the producer's; this model applies the same
independence to any change, from any entry point, in any artifact-set. It becomes the
criteria the controllers above a change derive without seeing it, in
[canonical execution](/cyber-truss/model/canonical-execution/#reading-the-comparison), and
the `{oracle, architect, builder}` lens set becomes how the reconciliation is read.

## What is added

**Free entry.** SDD's mission loop privileges the spec. Build-to-learn and backfill are
possible but second-class, and their results differ in quality. This model treats all
entry points as equal at authoring time and normalizes them at execution time.

**Out-of-band discharge.** SDD's gates are synchronous and blocking. Obligations here are
raised without interrupting the work that created them, and discharged later, possibly in
a different session and possibly by a different agent. That is where the efficiency claim
comes from: a designer can prototype uninterrupted while changes propagate to spec,
implementation, and documentation behind them.

**Many sets.** SDD covers two. A repository has more (website content, repository
configuration, agent configuration, design records), and the connections between them are
currently owned by nobody.
