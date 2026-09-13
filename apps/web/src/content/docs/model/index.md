---
title: The lattice model
description: The vocabulary and the guarantee — what cyber-truss claims, and what it does not
---

:::caution[Nothing here is built]
This section describes a **design**, not a shipped system. `cyber-truss` is at scaffold
stage: the CLI is a shell and no domain commands exist. The model is recorded here so
other repositories can reference and argue with it before it is implemented. Individual
claims are marked **Settled** or **Open** — see [Open questions](/cyber-truss/model/open-questions/)
for what is still moving.
:::

## The problem

A change to a repository rarely stays in one place. Add a configuration flag, and the
parser, the default config file, the documentation, and the tests each owe you an edit.
Add a user-facing string, and every translation file owes you one. Agree on a team
convention, and every module it governs owes you one — eventually.

Today those obligations live in prose and memory: a line in `CONTRIBUTING.md`, a
`// keep in sync with …` comment, an item on the pull-request checklist, or nothing at
all. Every one of them is a note asking a person to remember, written because no tool
owns the relation the note is describing.

Worse, the *order* you work in changes the result. Decide what a feature should do and
then build it; or build it and write down what it does afterwards; or work both ends at
once. All three are legitimate, all three are used, and they do not produce work of the
same quality.

The mechanism is context. Whoever writes the spec first has to reason the problem out:
which cases exist, which inputs are legal, what should happen at the edges. Whoever
backfills it from working code has one solution already in front of them, and writes the
spec that fits that solution. Cases the code never handled are the cases nobody writes
down. Afterwards nothing looks wrong, because the two artifacts agree, and the spec has
quietly become a transcript of the implementation rather than a statement of intent.
Research hit the same effect hard enough to name it, which is what
[preregistration](/cyber-truss/model/workflows/#preregistered-study) exists to prevent.

The path is leaking into the outcome.

Which leaves a remedy nobody keeps. Work spec-first every time, and every small change
buys the full ceremony: the component looks wrong, so amend the design record before you
touch the padding; you spot an off-by-one, so open a change request before you fix it. The
changes people most want to make on sight are the ones the ceremony taxes hardest. So the
discipline holds on work big enough to deserve it and lapses everywhere else, and the spec
ends up covering the features while missing everything smaller.

Nobody should have to go back to the drawing board to move a button.

## The guarantee

> **cyber-truss makes the settled state independent of which artifact you changed
> first — and lets you change it without stopping.**

Two halves, and both matter.

**Path independence.** Whichever artifact you touch first, the repository settles into a
state that meets the same criteria. This is the order-theoretic reading of
[the lattice](/cyber-truss/model/lattice/), taken over criteria: criteria arriving by
different routes join to the same set whichever arrives first, even though several states
can meet that set. Confluence is the property; the rest of the model is how it is bought.

**Uninterrupted focus.** The ceremony is deferred, not skipped. A designer prototypes in
dumb HTML without stopping to write a spec. The obligations to spec, implementation, and
documentation are raised and discharged out-of-band.

## Reading order

| Page | What it establishes |
| --- | --- |
| [The lattice](/cyber-truss/model/lattice/) | The concept the design is worked out from — three readings, and the one this page leans on |
| [Artifact-sets](/cyber-truss/model/artifact-sets/) | The unit the model reasons about, on two orthogonal axes, and what controls each |
| [Specification](/cyber-truss/model/specification/) | What a specification is, why it is a role rather than a layer, and what connections actually relate |
| [Connections](/cyber-truss/model/connections/) | The relation between sets, why nothing owns it today, and the kinds of strain |
| [Join](/cyber-truss/model/join/) | How criteria arriving by different routes combine, and where they conflict |
| [Workflow](/cyber-truss/model/workflow/) | What a workflow declares, the three roles a set can hold in it, and how a change finds the workflows it needs |
| [Controller](/cyber-truss/model/controller/) | What holds one set consistent, how it differs from a workflow, and what a workflow hands it |
| [Confluence](/cyber-truss/model/confluence/) | What path-independence means precisely, and what it is claimed over |
| [Canonical execution](/cyber-truss/model/canonical-execution/) | How confluence is bought: distill, replay, compare |
| [Relationship to SDD](/cyber-truss/model/relationship-to-sdd/) | SDD as the two-set instance of this model |
| [Formal workflows](/cyber-truss/model/workflows/) | Staged processes across eight fields, and the four parameters they all reduce to |
| [Waterfall in the model](/cyber-truss/model/workflows/waterfall/) | One of them worked in full — and the half of it that turns out to be unnecessary |
| [Open questions](/cyber-truss/model/open-questions/) | What is unresolved, and what breaks if it resolves badly |
| [Glossary](/cyber-truss/model/glossary/) | Every term the model defines, and the ones it deliberately avoids |

## What this model is not

- **Not a linter.** A linter reports *independent* violations. A truss redistributes
  *coupled* ones. The distinguishing property throughout is coupling.
- **Not a test suite.** Tests assert behaviour. This asserts consistency *between
  artifacts*.
- **Not a mission engine.** SDD runs from a change request to a handoff and retires.
  Convergence is a property of repository state, held continuously — including across
  changes no mission produced.
