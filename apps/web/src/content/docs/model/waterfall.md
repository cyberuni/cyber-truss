---
title: Waterfall in the model
description: A staged, gated process expressed in the model — which half of waterfall survives, and which half turns out to be unnecessary
---

:::caution[Design, not implementation]
Nothing described here is built. This page is an *exercise* run against the model rather
than a ratified part of it — the same exercise as
[Relationship to SDD](/cyber-truss/model/relationship-to-sdd/), against a process the
model did not grow from. See [the model overview](/cyber-truss/model/).
:::

## Why run this one

Waterfall is the most path-committed process in wide use. It does not merely suggest an
order — it *enforces* one, and its entire value proposition rests on the enforcement.

That makes it the sharpest available test of the model's guarantee. If a model built on
path-independence can only express processes that are indifferent to order, the guarantee
is thinner than it sounds. So: express waterfall, keep what it is actually buying, and
name whatever the model refuses to reproduce.

## Phases are not artifact-sets

The first translation error to avoid.

Waterfall names five **phases** — requirements, design, implementation, verification,
maintenance. A phase is a span of *time*, owned by people. An
[artifact-set](/cyber-truss/model/artifact-sets/) is a *type* of thing in a repository.
They appear interchangeable in waterfall's diagram only because it assumes each phase
emits exactly one kind of document.

The model has no phases. It has sets, connections, and a policy on when strain must be
zero. Translating waterfall means splitting each phase into the two things it was
conflating: **the set it produces**, and **the connection it crosses on the way in**.

**Status: Settled** as a consequence of the two axes — a unit of change is defined by
co-variation, not by schedule.

## Waterfall expressed

| Model element | Waterfall |
| --- | --- |
| Artifact-sets | `{requirements}`, `{design}`, `{code, test}`, `{verification plan, results}` |
| Governance targets | the document standard each phase's output must meet — template, review checklist, sign-off criteria |
| Connections | requirements ↔ design, design ↔ implementation, implementation ↔ verification — a chain |
| Discharge criterion | the phase gate |
| Strain policy | zero strain behind you before the next set is opened |

The first row says **artifact-sets**, not units of change, and the distinction is not
pedantry. Waterfall's own completeness standard is that a change is not done until it has
crossed the whole chain — so reading these four as units of change collapses them into
one, and a single set has no connections left to gate. They are separate sets because
they can be **strained independently**: requirements can move while design has not yet
followed. Whether that strain is tolerated is the workflow's business, and it is the next
section.

Nothing else in the table is new machinery. The chain is four sets and three connections;
the gates are what
[the SDD page](/cyber-truss/model/relationship-to-sdd/#what-running-the-exercise-revealed)
already identified as *conformance evaluated at a connection crossing*.

Which yields the first result of the exercise: **SDD is waterfall with two sets.** Both
are staged chains with gated crossings; SDD's chain has one link. The generalisation the
SDD page anticipated — "every connection needs a discharge criterion" — is the thing that
makes an N-link chain no harder to express than a one-link one.

**Status: Thesis.** The mapping holds on inspection; it has not been run against a real
waterfall project's artifacts.

## What waterfall is actually buying

The order is not the interesting part. Plenty of processes start at requirements. What
distinguishes waterfall is that it **refuses to open the next set while strain remains
behind it**, and the model's [three kinds of strain](/cyber-truss/model/connections/#three-kinds-of-strain)
make the refusal precise:

- **Completeness strain** must be zero — the phase's own artifacts are all present.
- **Conformance strain** must be zero — each conforms to the standard governing its type.
  This is the part of sign-off that is a review against criteria.
- **Obligation strain** must be zero — and this is the strict one. The model's default is
  that an obligation may be *carried*: raised now, discharged later, possibly by someone
  else. Waterfall forbids carrying one across a gate.

So waterfall is not a different mechanism. It is a **policy on the strain the model
already tracks**, and the policy is a single sentence: *no strain of any kind may cross a
gate.* Agile methods are the same chain under a permissive version of the same policy —
carry obligation strain freely, discharge it out-of-band.

This is worth stating plainly because it dissolves an argument rather than settling it.
"Waterfall versus agile" is not a disagreement about what artifacts exist or how they are
coupled. Both describe the same lattice. They disagree about one parameter.

**Status: Thesis**, and the most useful claim on this page if it holds.

## The entry restriction is not load-bearing

Here is where expressing waterfall pays for itself.

Waterfall enforces its policy by **restricting where a person may enter**. You start at
requirements because starting anywhere else is a process violation. A developer three
weeks into implementation who discovers a missing requirement is required to stop, raise a
change request, and route it back through the gate.

Under [canonical execution](/cyber-truss/model/canonical-execution/) that restriction
becomes unnecessary — while every gate it was protecting stays intact. The developer
changes what they can see. The change is lifted, distilled to a Request, and **replayed
through the waterfall workflow from its own starting point**. Requirements are amended
first, design follows, implementation follows — in order, through every gate, with every
sign-off performed.

The order is preserved. The gates are preserved. What is dropped is the demand that a
*human* traverse the order in person.

That separation is the model's substantive contribution to this process. Waterfall used a
**scheduling constraint on people** to obtain a **property of artifacts**. It is a
reasonable way to get the property when nothing else can hold it — and it is the reason
the process is disliked, because the cost lands on whoever noticed the problem. Once the
property is held by canonical execution, the constraint is a cost with nothing left to
buy.

**Status: Thesis**, and directly dependent on distillation being stable — the
[open risk](/cyber-truss/model/canonical-execution/#distillation-carries-the-weight) that
this claim inherits rather than escapes.

## What the model refuses

One half of waterfall does not survive, and it should be named rather than quietly
dropped.

Waterfall-as-practiced holds that **earlier phases do not reopen**. Implementation
conforms to design; where reality disagrees with the document, the implementation yields.

The model cannot reproduce that, and not by oversight.
[Connections are undirected](/cyber-truss/model/connections/#connections-are-undirected) —
direction is a property of where the delta landed, never of the relation. When
implementation reveals that a requirement was wrong, "restore the relation" is satisfied
by amending the requirement just as legitimately as by bending the code. The model has no
vocabulary in which the upstream document automatically wins.

This is a limit, but it is not a shortfall against waterfall's own literature. Royce's
1970 paper introduced the single-pass diagram and then argued it "is risky and invites
failure", adding feedback between adjacent phases. The model's refusal to encode direction
reproduces the corrected waterfall and declines the caricature.

**Status: Settled** as a consequence of undirected connections. **Open:** whether any
process needs a *preferred* direction at a connection — a tie-break for which end yields —
and whether that can be expressed as workflow rather than smuggled into the connection.

## Waterfall as one selectable workflow

A last consequence, from
[workflow selection](/cyber-truss/model/canonical-execution/#workflow-selection-not-injection-depth).

Expressing waterfall does not make it the workflow. It makes it *a* workflow spanning
this chain of sets — the appropriate one when a change genuinely reaches requirements, and
badly wrong for a typo in a docstring. Routing every change through the full chain is
exactly the ceremony the model exists to remove, and it is how waterfall earned its
reputation in the first place.

Distillation therefore has to select it, which is the same open problem the model already
carries. Nothing about this exercise makes that problem easier — but nothing about it
makes it worse, which is the outcome that mattered.

**Status: Open**, inherited.

The four parameters this exercise settled on — sets, shape, discharge, strain policy —
turn out to describe staged processes well outside software.
[Formal workflows](/cyber-truss/model/formal-workflows/) runs the same exercise across
eight fields.
