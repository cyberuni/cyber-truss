---
title: Glossary
description: The model's vocabulary in one place — every term it defines, and the ones it deliberately avoids
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

The model is meant to be referenced by other repositories, which makes its vocabulary a
shared surface. Every term below is defined on exactly one page; this page collects them
and points at the definitions.

## Terms

### Artifact

One *type* of thing in a repository, never one file. Four vendor plugin manifests are one
artifact. Defined in [Artifact-sets](/cyber-truss/model/artifact-sets/#artifact).

### Artifact-set

A group of artifacts, grouped along one of [two orthogonal axes](/cyber-truss/model/artifact-sets/#two-axes)
— unit of change or governance target. The unit the model reasons about, and the node in
[the lattice graph](/cyber-truss/model/lattice/#a-graph-of-interconnected-nodes).

### Confluence

The guarantee: whichever artifact you change first, the repository settles into the same
state. Claimed over [topology](#topology), not over bytes. See
[Confluence](/cyber-truss/model/confluence/).

### Connection

An **undirected** relation between two artifact-sets that must hold. Never a handler that
fires, and never an arrow. It relates their [specifications](#specification), not their
implementations. See [Connections](/cyber-truss/model/connections/).

### Controller

Whatever holds one artifact-set consistent, on a spectrum from agent definition through
skill, instruction, and governance to deterministic code. A compiler is a controller. See
[Controllers](/cyber-truss/model/artifact-sets/#controllers).

### Coordinates

The properties that are free to differ between two runs of the same change — prose,
section order, file organisation. The complement of [topology](#topology).

### Criteria

The half of a [specification](#specification) stating what must be true of the outcome.
Evaluable against the implementation as a blackbox, which is what makes criteria survive a
change of representation.

### Discharge

Where a workflow requires strain on a crossing to be resolved. SDD's implementation gate is
a discharge point. One of the four parameters of a [formal workflow](#formal-workflow).

### Distillation

Reducing an arriving change to a [Request](#request) plus every workflow that applies —
separating intent from the particular expression of it. Irreducibly agentic, and the step
that carries the confluence guarantee. See
[Canonical execution](/cyber-truss/model/canonical-execution/#distillation-carries-the-weight).

### Formal workflow

A named policy over the lattice, fixing four things: which artifact-sets it spans, the
shape of the connections between them, where discharge happens, and how much strain may
cross. See [the catalog](/cyber-truss/model/workflows/).

### Governance target

[Axis 2](/cyber-truss/model/artifact-sets/#axis-2--governance-target). Artifacts the same
criteria apply to. State-driven — it needs no diff.

### Implementation

The role an artifact holds on an edge where something else constrains it. A blackbox: the
model reasons about its outcome, not its internals. A role, not a kind of artifact — see
[Specification](/cyber-truss/model/specification/#specifies-is-a-relation-not-a-layer).

### Incompleteness strain

A specification and its implementation disagree while both are in hand. Intra-unit-of-change,
and it blocks. See [three kinds of strain](/cyber-truss/model/connections/#three-kinds-of-strain).

### Intent

The half of a [specification](#specification) stating what the thing is for and which
direction it should move in. Argued with, not evaluated.

### Lattice

The concept the system is worked out from, in three readings: the crystal that settles
back, the graph that redistributes load, and the order-theoretic structure with a join.
Used in prose, never as the wordmark. See [The lattice](/cyber-truss/model/lattice/).

### Lifting

Raising a raw line diff into artifact-set vocabulary. A prerequisite for everything
downstream, because an unlifted diff and a connection are written in different languages.

### Nonconformance strain

Criteria are unsatisfied with no counterpart implementation in the delta at all —
evaluable on a cold repository, with no diff. The axis-2 strain.

### Obligation strain

A specification whose implementation lives elsewhere — an accepted ADR constrains modules
it does not contain. Does not block, must be tracked, and can be **declined**.

### Request

The distilled intent behind an arriving change, separated from its particular expression.
Two different expressions of one intent must distil to the same Request.

### Specification

[Intent](#intent) and [criteria](#criteria) together. Also the role an artifact holds on an
edge where it constrains something else — per-edge, so one artifact is a specification on
one edge and an implementation on another. See
[Specification](/cyber-truss/model/specification/).

### Staleness

What scoping identifies: which artifacts a change has left inconsistent with the rest of
the system. The observable that strain describes.

### Strain

A connection whose relation does not currently hold. Comes in
[three kinds](/cyber-truss/model/connections/#three-kinds-of-strain) that block
differently: incompleteness, obligation, and nonconformance. A strain is exactly one of
the three, never a score on each.

### Topology

The properties that must converge across entry points — scenarios, actors, and edges. The
thing [confluence](#confluence) is claimed over, and the thing the model's acceptance test
diffs.

### Unit of change

[Axis 1](/cyber-truss/model/artifact-sets/#axis-1--unit-of-change). Artifacts that must
move together for a change to be complete — what belongs in one commit to be coherent.
Delta-driven.

## Terms deliberately not used

Recorded so they are not re-proposed.

| Term | Why not |
| --- | --- |
| **Fabric** | A third near-synonym for lattice and topology makes all three fuzzy. What it reaches for — the subgraph a given change affects — needs an obviously different word, not an overlapping one. |
| **Arrow**, **direction** on a connection | Direction is a property of where the delta landed, not of the relation. Writing it into the connection [bakes in one workflow](/cyber-truss/model/connections/#connections-are-undirected). |
| **Handler**, **trigger** for a connection | A connection states a relation that must hold. Procedural framing needs one path per direction and [loses confluence immediately](/cyber-truss/model/connections/#declarative-never-procedural). |
| **Truss** in prose | The wordmark, and the mental image behind it. The concept is *the lattice*. |
