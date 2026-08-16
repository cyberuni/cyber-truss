---
title: Formal workflows
description: A catalog of staged processes expressed in the model — four parameters, eight instances, and what each one tests
---

:::caution[Design, not implementation]
Nothing described here is built, and this page is an *exercise* run against the model
rather than a ratified part of it. See [the model overview](/cyber-truss/model/).
:::

## What a formal workflow is

Expressing [waterfall](/cyber-truss/model/waterfall/) produced a reusable shape. Every
staged process examined since has fit it, which makes it worth stating as a definition:

> A **formal workflow** is a named policy over a lattice. It fixes four things: which
> artifact-sets it spans, the shape of the connections between them, where discharge
> happens, and how much strain may be carried across each crossing.

Nothing else. A formal workflow introduces no mechanism the model does not already
have — it is a *parameterisation* of artifact-sets, connections, discharge criteria, and
[the three kinds of strain](/cyber-truss/model/connections/#three-kinds-of-strain).

That is a falsifiable claim, and this page is the attempt to falsify it. The instances are
drawn from deliberately distant fields, because a vocabulary that only fits the processes
it was derived from has not been tested.

## The catalog

| Workflow | Field | Sets it spans | Shape | Strain policy |
| --- | --- | --- | --- | --- |
| [Waterfall](/cyber-truss/model/waterfall/) | software | requirements, design, code, verification | chain | zero at every gate |
| [SDD](/cyber-truss/model/relationship-to-sdd/) | software | spec unit, implementation unit | one link | zero at the impl gate |
| Trunk-based development | software | code, test, docs | star on `{code, test}` | completeness zero at merge; obligation carried |
| Safety certification | avionics, medical devices | requirements, design, code, tests, review evidence | chain, traced both ways | zero, and the *edge set itself* is an artifact |
| Compliance audit | security, legal | policy, control, evidence | star on policy | conformance zero on a cold repository |
| Engineering change order | manufacturing | CAD, BOM, routing, supplier docs | star on the part | zero before release; obligations explicit and declinable |
| Preregistered study | research | protocol, data, analysis, paper | chain, gated once | zero at the protocol gate; free thereafter |
| Double-entry bookkeeping | accounting | ledger, subledger, statements | pair, continuously held | zero **always** |

Read down the last column. The sets and the shape vary with the field, as you would
expect. The strain policy varies *independently of both*, and it is the column that
actually distinguishes these processes from one another.

**Status: Thesis.** Eight instances fit; the definition is not proven, only unrefuted.

## What each one tests

### Trunk-based development

The control case against waterfall — same field, same artifacts, opposite policy. Merge to
trunk requires zero **completeness** strain (the change is whole) but tolerates carried
**obligation** strain indefinitely: the follow-up ticket is the obligation, and the
backlog is its ledger.

*What it tests:* whether the strain kinds are genuinely independent. They are — two
workflows over one lattice differing only in which kinds they will carry.

### Safety certification — DO-178C, IEC 62304

Avionics and medical-device software require **bidirectional traceability**: every
requirement traced to design, code, and the tests exercising it, and every line of code
traced back. Certification is largely an audit of that trace.

*What it tests:* the claim that connections are real objects rather than a modelling
convenience. Here the regulator agrees — the edge set is a **deliverable**, maintained as
a traceability matrix, and maintained by hand at enormous cost. This is the model's
"nobody owns the connections" thesis confirmed by an industry that priced the alternative
and paid it.

### Compliance audit — SOC 2, ISO 27001

A policy asserts a control exists; the control must be implemented; evidence must show it
operating. An auditor arrives with no diff at all and evaluates the current state.

*What it tests:* [axis 2](/cyber-truss/model/artifact-sets/#axis-2--governance-target),
the state-driven axis, in its purest form. Nothing here is delta-driven — this is
conformance strain evaluated cold, on a repository nobody has just changed. A model with
only a unit-of-change axis could not express an audit at all.

### Engineering change order

A change to a manufactured part obliges the CAD model, the bill of materials, the process
routing, supplier drawings, and often existing inventory. PLM systems formalise this as an
ECO: raised against a part, enumerating every downstream artifact, tracked to closure —
and **rejectable**.

*What it tests:* [obligation strain](/cyber-truss/model/connections/#obligation), the kind
identified last and the one with the least software precedent. Manufacturing has run
obligation ledgers with formal declining for decades. That the model needed the same
construct — and that `docs/backlog.md` is a hand-rolled version of it — is convergent
evidence rather than borrowed vocabulary.

### Preregistered study

A protocol is registered before data collection; analysis and paper follow. Registered
reports go further, granting in-principle acceptance on the protocol alone, before results
exist.

*What it tests:* the cost of path-dependence, measured in public. Deriving a hypothesis
after seeing the data produces a different paper than deriving it before — same
artifacts, same authors, different order, and the field named the resulting quality gap
the replication crisis. Preregistration's fix is a gate that forbids the reverse
traversal. It is the same problem this model exists to solve, at a scale where the damage
was large enough to measure.

### Double-entry bookkeeping

Every transaction lands in two accounts; assets equal liabilities plus equity, always. A
discrepancy is restored by correcting whichever side is wrong — the equation names no
preferred direction, and a trial balance says only *that* the relation is broken.

*What it tests:*
[declarative, never procedural](/cyber-truss/model/connections/#declarative-never-procedural),
the model's most expensive commitment to reverse. Five centuries of practice on a
connection stated as a relation that must hold, never as a handler that fires. It is also
the smallest instance in the catalog — one relation, two sets, zero tolerance,
continuously held — which makes it the cleanest thing to test an implementation against.

## What the catalog shows

Three results, none of which survives a single instance alone.

**The distinguishing parameter is strain tolerance.** Sets and shape are dictated by the
field; a bookkeeper and an avionics engineer share nothing in either column. What they
choose independently is which strains may be carried and for how long. Process
disagreements — waterfall against agile, most loudly — are disagreements about one
parameter, over a lattice both sides agree on.

**Every instance ships a hand-maintained connection registry.** Traceability matrices,
ECO forms, evidence binders, backlog files. Different fields, no shared tooling, same
artifact — invented independently each time because no system owns the relation. The
[Connections](/cyber-truss/model/connections/) page argues this from four cases inside one
repository; the catalog shows it is not a property of this repository.

**Gates buy a property, and they are not the only way to buy it.** Every instance uses a
gate, and every gate imposes the same cost: whoever discovers a problem downstream pays
for it. That is the trade the waterfall page examines — a scheduling constraint on people
purchasing a property of artifacts. The catalog shows how universal the trade is, and
therefore how much rests on
[canonical execution](/cyber-truss/model/canonical-execution/) being able to hold the
property without the constraint.

**Status: Thesis** on all three, and load-bearing on none of them — the model does not
depend on this catalog. It is evidence about whether the vocabulary generalises, which
was the one thing running eight instances could establish.

## What has not been tested

The instances here are all **staged** — they exist because someone wanted a gate. That is
a biased sample, and it selects for exactly the processes the model handles well.

Unstaged coupling is the harder case and the one this repository actually hit: the
Starlight stylesheet reaching into every component beneath it, with no gate, no ceremony,
and [no mechanical way to check it](/cyber-truss/model/connections/#a-coupling-that-resists-encoding).
No entry in this catalog resembles that, and a formal workflow may not be the right
vocabulary for it.

**Status: Open.** Whether the four parameters describe unstaged couplings, or only the
processes built to police them.
