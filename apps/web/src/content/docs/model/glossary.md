---
title: Glossary
description: The model's vocabulary in one place. Every term it defines, and the ones it deliberately avoids
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

The model is meant to be referenced by other repositories, which makes its vocabulary a
shared surface. Every term below is defined on exactly one page; this page collects them
and points at the definitions.

## Terms

### Approver

A person allowed to approve what the [leash](#leash) stops. Any approver may approve a
stop in any workflow, or pre-approve the gates of a run. Approvers per workflow are
deferred. SDD calls this role the Council. See
[Leash](/cyber-truss/model/workflow/#leash).

### Artifact

One *type* of thing in a repository, never one file. Four vendor plugin manifests are one
artifact. Defined in [Artifact-sets](/cyber-truss/model/artifact-sets/#artifact).

### Artifact-set

A group of artifacts, grouped along one of [two orthogonal axes](/cyber-truss/model/artifact-sets/#two-axes):
unit of change or governance target. The unit the model reasons about, and the node in
[the lattice graph](/cyber-truss/model/lattice/#a-graph-of-interconnected-nodes).

### Conflict

A [join](#join) no state can meet: two criteria that stand together and contradict each
other. Resolved by a recorded decision, not by running workflows again. See
[Join](/cyber-truss/model/join/#conflict).

### Confluence

The guarantee: whichever artifact you change first, the repository settles into a state
that meets the same criteria. Claimed over [topology](#topology), not over bytes. See
[Confluence](/cyber-truss/model/confluence/).

### Connection

An **undirected** relation between two artifact-sets that must hold. Never a handler that
fires, and never an arrow. It relates their [specifications](#specification), not their
implementations. See [Connections](/cyber-truss/model/connections/).

### Controller

Whatever holds one artifact-set consistent, on a spectrum from agent definition through
skill, instruction, and governance to deterministic code. A compiler is a controller. It
works within a set, where a [workflow](#workflow) works between sets. A controller
**holds** a set; a workflow **owns** one. See [Controller](/cyber-truss/model/controller/).

### Coordinates

The properties that are free to differ between two runs of the same change: prose, section
order, file organisation. The complement of [topology](#topology).

### Criteria

The half of a [specification](#specification) stating what must be true of the outcome.
Evaluable against the implementation as a blackbox, which is what makes criteria survive a
change of representation.

### Discharge

Where a workflow requires strain on a crossing to be resolved. SDD's implementation gate is
a discharge point. One of the parameters a [workflow](#workflow) declares.

### Distillation

Reducing an arriving change to its [intent](#intent), separated from the particular
expression of it. Only a change is distilled, never an intent. Each workflow the change
reaches distills it within its own span, and states what it is for, not whether it is
right. A workflow that finds nothing abstains. Distillation writes nothing and produces no
criteria: those come from each set's [controller](#controller).
Irreducibly agentic, and the step that carries the confluence guarantee. See
[Canonical execution](/cyber-truss/model/canonical-execution/#distillation-carries-the-weight).

### Formal workflow

See [workflow](#workflow). The catalog uses the longer name for staged processes expressed
in the model. See [the catalog](/cyber-truss/model/workflows/).

### Governance target

[Axis 2](/cyber-truss/model/artifact-sets/#axis-2-governance-target). Artifacts the same
criteria apply to. State-driven: it needs no diff.

### Implementation

The role an artifact holds on an edge where something else constrains it. A blackbox: the
model reasons about its outcome, not its internals. A role, not a kind of artifact. See
[Specification](/cyber-truss/model/specification/#specifies-is-a-relation-not-a-layer).

### Incompleteness strain

A specification and its implementation disagree while both are in hand. Intra-unit-of-change,
and it blocks. See [kinds of strain](/cyber-truss/model/connections/#kinds-of-strain).

### Input, owned, output

The three roles a set can hold in a [workflow](#workflow). An input is read and never
written. An owned set is read and written, and can be revised in place. An output is
emitted: it cannot be revised, only superseded. Roles are where direction lives, since a
connection has none. See [Three roles](/cyber-truss/model/workflow/#three-roles).

### Intent

The half of a [specification](#specification) stating what the thing is for and which
direction it should move in. Argued with, not evaluated. An arriving change carries intent
too, and [distillation](#distillation) is what separates it from the change's expression.

### Join

The operation that combines sets of [criteria](#criteria): their union, the same in any
order. Taken over criteria, not over states. Where a [connection](#connection) says where
criteria flow, the join says how criteria reaching one place combine. See
[Join](/cyber-truss/model/join/).

### Lattice

The concept the system is worked out from, in three readings: the crystal that settles
back, the graph that redistributes load, and the order-theoretic structure whose join
combines criteria. Used in prose, never as the wordmark. See
[The lattice](/cyber-truss/model/lattice/).

### Leash

Which writes an agent may make in a [workflow](#workflow) without an
[approver](#approver)'s approval. Owned writes proceed when criteria pass and nothing in
the set's [standing specification](#standing-specification) is removed or reversed. Output
writes, writes that contradict the standing specification, and architect or oracle outcomes
need
approval by default. Confidence only tightens it. See
[Leash](/cyber-truss/model/workflow/#leash).

### Lifting

Raising a raw line diff into artifact-set vocabulary. A prerequisite for everything
downstream, because an unlifted diff and a connection are written in different languages.

### Missing strain

A controller above a change's [source](#source) answers that its set lacks a criterion the
change's intent implies: the implementation meets something its specification does not
state. Relative to a change, unlike the other kinds. See
[kinds of strain](/cyber-truss/model/connections/#missing).

### Nonconformance strain

Criteria are unsatisfied with no counterpart implementation in the delta at all: evaluable
on a cold repository, with no diff. The axis-2 strain.

### Obligation strain

A specification whose implementation lives elsewhere: an accepted ADR constrains modules
it does not contain. Does not block, must be tracked, and can be **declined**.

### Reconciliation

The source's [controller](#controller) joining the change that landed with the criteria
arriving from above. It reports what it kept of the change, what it changed, and what it
added, and that report is the comparison the leash reads. See
[Reconciling at the source](/cyber-truss/model/canonical-execution/#reconciling-at-the-source).

### Request

The [intent](#intent) a workflow hands a controller when it asks for criteria or asks for a
write. A Request to a controller above the source carries no expression of the change. See
[The handoff](/cyber-truss/model/controller/#the-handoff).

### Run ledger

The append-only record of a run: pending jobs, what each waits on, criteria versions,
resolutions, and decisions. It collects the contributions addressed to each set, with
their provenance, and never merges them. Its ready frontier is the jobs whose inputs have
no pending writer. It schedules to reduce rework and never makes a run correct. See
[The run ledger schedules](/cyber-truss/model/canonical-execution/#the-run-ledger-schedules-it-does-not-decide).

### Selection

Finding the workflows a change needs: every workflow whose declared roles include a changed
set, filtered by what the controllers above the [source](#source) answer, and every owner
of an affected input, each triggered by a routed job carrying the root intent. A workflow
that starts at the changed set runs forward from it; one that derives the set asks upward
first. An affected set no declared workflow can write is raised as an obligation. Extended
as replays produce changes of their own. See
[How workflows are selected](/cyber-truss/model/workflow/#how-workflows-are-selected).

### Source

The artifact-set a change landed in. Settled by definition for the run: the controllers
above it derive criteria without seeing the change, and its own controller
[reconciles](#reconciliation) the change against them.

### Specification

[Intent](#intent) and [criteria](#criteria) together. Also the role an artifact holds on an
edge where it constrains something else: per-edge, so one artifact is a specification on
one edge and an implementation on another. See
[Specification](/cyber-truss/model/specification/).

### Standing specification

A set's use cases, decision graph where it has one, and criteria as they stood before a run.
The leash compares a write against it. See
[Criteria are authored through use cases](/cyber-truss/model/specification/#criteria-are-authored-through-use-cases).

### Staleness

What scoping identifies: which artifacts a change has left inconsistent with the rest of
the system. The observable that strain describes.

### Strain

A connection whose relation does not currently hold. Comes in
[four kinds](/cyber-truss/model/connections/#kinds-of-strain) that block
differently: incompleteness, obligation, nonconformance, and missing. A strain is exactly
one of the four, never a score on each.

### Topology

What the criteria constrain, and so what must converge across entry points. Usually
scenarios, actors, and edges. The thing [confluence](#confluence) is claimed over, and the
thing the model's acceptance test diffs.

### Unit of change

[Axis 1](/cyber-truss/model/artifact-sets/#axis-1-unit-of-change). Artifacts that must
move together for a change to be complete: what belongs in one commit to be coherent.
Delta-driven.

### Workflow

A named policy over the lattice. It declares its span, the [role](#input-owned-output) of
each set in it, its shape, where discharge happens, its strain policy, and its
[leash](#leash). It works between sets; a [controller](#controller) works within one. See
[Workflow](/cyber-truss/model/workflow/).

## Terms deliberately not used

Recorded so they are not re-proposed.

| Term | Why not |
| --- | --- |
| **Fabric** | A third near-synonym for lattice and topology makes all three fuzzy. What it reaches for (the subgraph a given change affects) needs an obviously different word, not an overlapping one. |
| **Arrow**, **direction** on a connection | Direction is a property of where the delta landed, not of the relation. Writing it into the connection [bakes in one workflow](/cyber-truss/model/connections/#connections-are-undirected). |
| **Handler**, **trigger** for a connection | A connection states a relation that must hold. Procedural framing needs one path per direction and [loses confluence immediately](/cyber-truss/model/connections/#declarative-never-procedural). |
| **Truss** in prose | The wordmark, and the mental image behind it. The concept is *the lattice*. |
