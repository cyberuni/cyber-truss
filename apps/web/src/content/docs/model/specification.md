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

## Criteria are authored through use cases

Criteria written straight from prose match the prose one for one, so they cannot show what
the prose left out. A set's criteria are authored through a chain instead, the one SDD uses
to write its suites: intent, then use cases, then a decision graph, then criteria.

- **Use cases.** Each names an actor and the goal the actor arrives with, and lists its
  **extensions**: every path from the trigger that does not reach the goal. The actors
  include people affected by the outcome who never act on the set, such as a reviewer or an
  auditor. Listing actors rather than entry points is what finds the use case nobody built.
- **Decision graph.** Where the set describes behaviour, its decisions form a graph. Every
  extension is a path in it, and every forbidden combination is a guard.
- **Criteria.** Each criterion is bound to a use case, and to a path in the graph where the
  set has one.

A set that does not describe behaviour has no graph. An outline is one path through a story,
a story bible is facts under a few guards, and a messaging framework is a table of what may
appear where. Their criteria are bound to use cases alone. Anything such a set states that a
workflow reading it is checked against is a criterion, whether or not a graph holds it. The
name of the betrayer in an outline is one.

The use cases, graph, and criteria as they stood before a run are the set's **standing
specification**. A chain built during the run is not standing, because it is built from the
intent it would be used to check. The standing specification is what the
[leash](/cyber-truss/model/workflow/#leash) compares a write against when it asks whether
the write contradicts the set.

Use cases and the graph stay inside the set. What another set references is criteria. SDD
works the same way: its implementation producer reads the suite, not the use cases and
graph in `spec.md` that the suite was derived from. A controller handed another set's use
cases would be invited to re-derive that set's reasoning instead of reading the intent.

Use cases belong to a set's **specification role**. A set that is downstream in every
workflow spanning it authors none of its own, and its standing specification is the criteria
it stands under from above. `{code, test}` is the ordinary case: the tests are criteria, and
the use cases they were derived from live in the specification.

A set specifies something beyond the system's boundary as readily as inside it. A library's
reference page is written from the code and read by consumers whose own code is judged
against it, so it authors use cases of its own — a consumer arriving to learn what to pass —
even though no declared workflow reads it. Downstream in the topology and upstream of
somebody are not exclusive. The test is whether anything is checked against the set, not
whether a declared set reads it.

That is what separates it from a set that is merely read. A maintainer reads the code before
changing it, and follows what is there, but nothing is judged against it, so the existing
code is context rather than criteria.

A set can look like an exception and not be one. The consumer who arrives to learn what to
pass a component is a real actor with a real goal, and the prop list they read sits in the
code as well as on the page. What the code holds there is a specification at a lower rung,
written into implementation files. Name the rung, and the use cases move to it.

**Status: Thesis**, including that use cases belong to the specification role.
**Open:** grain. Whether a criterion covers a case can turn on one
undefined term, such as whether *administration* includes a rate change. The chain is meant
to catch that when the criterion is written, and a controller that meets it at run time has
found strain in its own set.

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

## A lower rung is its own artifact-set

A team may keep a specification below the one its process names. SDD keeps project and
feature specs in `.agents/spec/`, and a component still earns a `button.spec.md` beside it,
holding the component's design decisions and the checklist the implementation is written
against. The implementation producer reads that file and never writes it.

It is a set of its own, and the [two axes](/cyber-truss/model/artifact-sets/#two-axes) say
so. It is not one unit of change with the feature spec, since either can be amended without
the other, and one component is read by many features, so no feature's set can own it. It is
not one unit of change with `{code, test}` either, because the producer that writes the code
only reads it. What it does share with the feature spec is a governance target: the same
rules govern both as prose.

**Who writes it is the team's declaration.** A [workflow](/cyber-truss/model/workflow/)
between the feature spec and the component spec may be the same producer that writes the
feature spec, or a separate one. A producer that writes two sets does not merge them, because
a [controller](/cyber-truss/model/controller/) holds one set and a workflow works between
sets.

Two things are not free choices.

**It must sit in the span of every workflow that owns the implementation.** A workflow asks
the controllers above its source, nearest first, and a set with no place for the criteria
answers [too coarse](/cyber-truss/model/canonical-execution/#controllers-answer-for-their-own-sets).
A feature spec is too coarse for a prop name or a component-grain rule. If the component spec
is outside the implementation workflow's span, a code change never asks it, and those criteria
fall back to being derived at the source by the controller that has already seen the change.
Holding that rung is the whole reason the set exists.

**No declared workflow may write it from the implementation.** The moment one does — a
workflow that reads the code and regenerates the component spec — the set is revisable from
the side it constrains, and a change can bring it along instead of stopping against it. This
is why the
[component library example](/cyber-truss/examples/component-library-bug-fix/#status-holds)
rejected an API contract on an edge between two revisable sets. A component spec escapes that
only while it is authored from above.

Membership follows the role, not the directory. `button.spec.md` sits next to `button.tsx`
and is not in `{code, test}`. The same reading applies in the other direction: where a
specification is embedded in implementation files, such as an exported type signature,
[lifting](/cyber-truss/model/artifact-sets/#lifting) has to raise it into the set it belongs
to before anything can be asked of it.

Keeping the rung is a choice, and declining it has a cost the model can name. The
[plot twist example](/cyber-truss/examples/fiction-plot-twist/) has the same shape: with an
outline, chapter-grain criteria have a home above the draft, and without one they land on the
manuscript, where the controller that reconciles the change also derives what the change is
checked against.

**Status: Thesis.**

## Some criteria are never stated

A specification states a fraction of what is true of its implementation, and it is meant to.
Mutation testing shows how many permutations a suite leaves untouched, and nobody writes a
suite for the dependencies they install either. Some criteria go unstated by accident and
some by decision, and demanding that every one be written would manufacture the ceremony this
model exists to remove.

Call them **implicit criteria**: rules something depends on that no set states. Behaviour
consumers rely on and nobody wrote down is the familiar case; so is a rule that follows from
a design decision the specification above it cannot see, such as a queue somebody must drain.
They have three properties.

- **Preserved by default, not enforced.** A controller writes in the set as it stands and
  keeps what it has no reason to touch. A refactor keeps all of them, because preserving
  behaviour is its intent. That is convention, not a guarantee, and it is what the existing
  artifacts contribute to a write: how, never what.
- **Found by a break.** When a write breaks one, it returns as a change — a bug report, a
  consumer's complaint — carrying a criterion no set states. That is
  [missing strain](/cyber-truss/model/connections/#missing), already in the model. Nothing
  new is needed to pick it up.
- **Stated only if the team decides to.** Once surfaced, writing it into a specification is
  one option and leaving it implicit is another. Leaving it implicit is a decision, recorded
  like any other, not an open defect.

The limit this sets on the guarantee is worth saying plainly.
[Confluence is claimed over criteria](/cyber-truss/model/confluence/), so it covers stated
ones. A run converges on a settled state that meets what the sets state, and an implicit
criterion broken on the way is not seen. That is a different limit from a
[missing connection](/cyber-truss/model/connections/#a-missing-connection-is-found-outside-the-run),
where the relation is undeclared. Here the relation is declared and the rule inside it was
never written.

**Status: Thesis.**

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
