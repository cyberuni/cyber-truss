---
title: Specification
description: What a specification is, why it is a role rather than a layer, and why connections relate specifications rather than implementations
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

## The problem this solves

[Canonical execution](/cyber-truss/model/canonical-execution/) ends in a comparison, and
the comparison has to work across artifact types. That is not merely hard, it is
meaningless: there is no diff between a TypeScript module and a Figma frame, and inventing
one would produce a number nobody can act on.

Cross-type comparison becomes tractable exactly once, when both sides are stated in the
same vocabulary. That vocabulary is specification.

> Connections relate **specifications**, not implementations.

An implementation is a blackbox. What crosses a connection is the criteria on its outcome.

**Status: Settled** that the comparison happens in specification space.

## Specifies is a relation, not a layer

It is tempting to read a repository as two stacked layers — everything that says what to
do on top, everything that does it underneath. That reading breaks on the first real
artifact.

A product requirements document is a specification of the product. It is also the thing
somebody wrote, produced against an intent that preceded it. A `spec.md` is a
specification of the code and an implementation of the PRD. Neither sits in a layer.

The model therefore treats the roles as **per-edge**:

> For an edge where *X* constrains *Y*: *X* is the **specification** of *Y*, and *Y* is
> the **implementation** of *X*.

Both roles attach to the same artifact on different edges, and asking whether an artifact
"is a spec" without naming the edge is the question that produces the confusion.

Where an edge allows either reading, the roles do not choose. The workflow that restores
the edge does, through its
[roles](/cyber-truss/model/workflow/#three-roles).

This is orthogonal to what a specification *contains*, below. One decomposition is
vertical and per-edge; the other is internal to a single specification. Conflating them is
the failure mode this section exists to prevent.

**Status: Settled.**

## A specification is intent plus criteria

Two distinct things travel under the one word, and the imprecision is load-bearing enough
to cost something.

**Intent** states what the thing is for and which direction it should move in. It is
argued with, not evaluated.

**Criteria** state what must be true of the outcome. They are evaluable against a
blackbox, without reading it.

A **specification** is the pair. Neither half substitutes for the other: intent without
criteria cannot be checked, criteria without intent cannot be
[indicted](/cyber-truss/model/canonical-execution/#the-failure-mode-to-design-against)
when they turn out to encode the wrong goal.

SDD shows the cost of leaving the pair unnamed. Its specification is `spec.md` together
with the `.feature` suite — intent and criteria in two files — and "the spec" is used for
both the pair and the first file alone. The ambiguity is why that phrase has to be
expanded to "spec + suite" wherever precision matters.

Criteria are stated over the **outcome** of the implementation rather than its internals.
That is what makes them survive a change of representation: the same criteria hold whether
the mockup is Figma or dumb HTML, whether the module is TypeScript or Rust.

An outcome includes when it was produced. A criterion such as *no older than two days* is
stated over the outcome, and it can go false with nothing changed. How the loop handles
that is in
[The loop starts only from a change](/cyber-truss/model/canonical-execution/#the-loop-starts-only-from-a-change).

**Status: Settled** that intent and criteria are distinct and that a specification is
both.

## Specifications exist at every level

The relation chains. A function has expectations, so does the module containing it, so do
the product and the system. Each rung specifies the rung beneath it and implements the
rung above.

So the earlier question — whether a specification attaches to an artifact or to an
[artifact-set](/cyber-truss/model/artifact-sets/) — is a false choice. Both, at different
levels. `{code, test, stories}` has criteria as a set; the exported function inside it has
its own, narrower ones.

Two consequences worth stating.

**Not every artifact-set has a specification.** Many are held entirely by their
[controller](/cyber-truss/model/controller/) — formatting has no intent
worth writing down, only a formatter. Requiring a specification everywhere would
manufacture ceremony in exactly the places the model exists to remove it from.

**Connections connect at a level.** Two specifications are comparable when they sit at the
same rung. What "the same rung" means across artifact types is not yet defined, and it is
the first thing this page needs that it does not have.

**Status: Settled** that specifications are multi-level. **Open:** how levels are
identified across artifact types.

## What the roles explain

Read the [kinds of strain](/cyber-truss/model/connections/#kinds-of-strain) through the
relation and they stop being observed cases.

| Strain | Shape in this vocabulary |
| --- | --- |
| Incompleteness | a specification and its implementation disagree, and both are in hand |
| Obligation | a specification whose implementation is **elsewhere** — an ADR constrains modules it does not contain |
| Nonconformance | criteria evaluated with no counterpart implementation in the delta at all |
| Missing | an implementation meets criteria a change introduced, and its specification does not state them |

Obligation strain is the interesting one. An accepted ADR is a specification with no local
implementation; the artifacts that implement it are owned by other units of change. That
is not a special case bolted onto the taxonomy — it is what the relation predicts when the
two ends of an edge land in different commits.

The first three read the relation from the specification's side. Missing reads it from the
implementation's side, which the derivation did not try until an example needed it.

**Status: Thesis.** The derivation fits the three kinds identified first. It did not
predict the fourth. The examples found it, and it fits once the relation is read from the
other side.

## The trade this makes

One impossible problem is exchanged for many tractable ones.

Comparing a Figma frame against a Rust module cannot be done. Comparing each against its
own criteria can, and comparing two sets of criteria to each other can. The cost is that
every artifact now has a second thing that can go stale — its specification can drift from
the implementation it constrains, and that drift is invisible to the controller holding
either one.

That cost is worth paying because within-type drift is the problem SDD already solves once
and every existing controller half-solves. It is not free, and a model that presented it as
free would be hiding the only real objection to this page.

**Status: Settled** as the trade being made deliberately.
