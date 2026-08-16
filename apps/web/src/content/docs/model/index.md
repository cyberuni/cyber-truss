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

A change to a repository rarely stays in one place. Adding a skill obliges four vendor
manifests. Accepting an ADR obliges the module it governs. Editing a global stylesheet
obliges every component rendering beneath it.

Today those obligations live in prose and memory. This repository's own `AGENTS.md`
carries one verbatim — *"when the first skill lands, add `"skills": "./skills/"` to three
manifests"* — because no tool owns it.

Worse, the *order* you work in changes the result. The same feature built spec-first,
built-to-learn, or backfilled from an implementation produces work of measurably
different quality. The path is leaking into the outcome.

## The guarantee

> **cyber-truss makes the settled state independent of which artifact you changed
> first — and lets you change it without stopping.**

Two halves, and both matter.

**Path independence.** Whichever artifact you touch first, the repository settles into the
same place. This is the order-theoretic reading of [the lattice](/cyber-truss/concepts/lattice/):
a join is a *unique* least upper bound, and merge into a join-semilattice is confluent by
construction. Confluence is the property; the rest of the model is how it is bought.

**Uninterrupted focus.** The ceremony is deferred, not skipped. A designer prototypes in
dumb HTML without stopping to write a spec. The obligations to spec, implementation, and
documentation are raised and discharged out-of-band.

## Reading order

| Page | What it establishes |
| --- | --- |
| [Artifact-sets](/cyber-truss/model/artifact-sets/) | The unit the model reasons about, on two orthogonal axes, and what controls each |
| [Connections](/cyber-truss/model/connections/) | The relation between sets, why nothing owns it today, and the three kinds of strain |
| [Confluence](/cyber-truss/model/confluence/) | What path-independence means precisely, and what it is claimed over |
| [Canonical execution](/cyber-truss/model/canonical-execution/) | How confluence is bought: distill, replay, compare |
| [Relationship to SDD](/cyber-truss/model/relationship-to-sdd/) | SDD as the two-set instance of this model |
| [Open questions](/cyber-truss/model/open-questions/) | What is unresolved, and what breaks if it resolves badly |

## What this model is not

- **Not a linter.** A linter reports *independent* violations. A truss redistributes
  *coupled* ones. The distinguishing property throughout is coupling.
- **Not a test suite.** Tests assert behaviour. This asserts consistency *between
  artifacts*.
- **Not a mission engine.** SDD runs from a change request to a handoff and retires.
  Convergence is a property of repository state, held continuously — including across
  changes no mission produced.
