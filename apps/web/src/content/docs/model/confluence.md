---
title: Confluence
description: What path-independence means precisely, and what it is claimed over
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

## The observation that motivates everything

The same change can enter a repository by several routes, and today the route shows up in
the result.

| Approach | Order |
| --- | --- |
| Mission loop (strong form) | spec, then implementation |
| Build-to-learn | both at once; the implementation producer is touch-up and the impl gate is the real sequencing cause |
| Backfill | implementation first, spec after |

All three are legitimate. All three are used. **They do not produce work of the same
quality**, and that difference is the reason `cyber-truss` exists.

## The claim

> Whichever artifact you change first, the repository settles into a state that satisfies
> the same criteria.

This is confluence in the rewriting sense, Church-Rosser, taken modulo an equivalence.
Strict confluence requires every route to reach the same normal form. That cannot hold
here, because criteria rarely determine one state. A set of criteria can be met by several
states, the way a truss can have several stable equilibria. Two states that satisfy the
same criteria are treated as equivalent, and confluence is claimed up to that equivalence.
The entry point is a choice about *how you work*, and it should have no bearing on *which
criteria the result meets*.

Criteria a person adds during a run are new input, not a different route. The claim
compares runs given the same criteria. When a difference between two settled states turns
out to matter, that difference is a criterion nobody had stated, and adding it starts the
next iteration.

It is also the third reading of [the lattice](/cyber-truss/model/lattice/), and the
central one rather than an aside. An order-theoretic lattice has a **join**: a unique
least upper bound for any two elements. Merge into a join-semilattice is confluent by
construction.

**Status: Settled** as the system's guarantee.

## What confluence is claimed over

Not byte-identity. A prototype-first route and a spec-first route will produce different
prose, different section order, different file organisation — and none of that is a
failure.

The claim is over **topology**:

> Scenarios, actors, and edges are topology and must converge. Prose, section order, and
> file organisation are coordinates and are free.

Topology is what the criteria constrain. Scenarios, actors, and edges are its usual
members because criteria are usually stated over them. Coordinates are free because no
criterion constrains them. When one does, as a style guide constrains prose, that part
becomes topology.

Two runs producing different *layouts* of the same graph is not a failure. Two runs
producing a different **edge set** is. Two runs that settle in different states, both
meeting the criteria, are not a failure either, provided the choice between the states was
recorded rather than left to timing. See
[Order is not controlled](/cyber-truss/model/canonical-execution/#order-is-not-controlled).

This distinction is not a detail of how results are reported. It is **the statement of
what the system guarantees**. Without it the guarantee is either unachievable — if you
claim byte-identity — or undefined, if you claim nothing at all.

**Status: Settled.**

## Two ways to buy it, and why one is impractical

Confluence can be constructed two ways, and the choice determines where all the risk in
the system ends up.

**Per-relation confluence.** Require every connection to be confluent from any direction:
restore relation *R* whether you are standing on *A* or on *B*. This is local confluence
plus termination, and it is a property that must be **proven for each connection**. Every
connection author gets a chance to get it wrong, there is no cheap way to check that they
did not, and the burden grows with the number of connections.

**Confluence by canonicalization.** Do not require the property at all. Normalize every
entry point onto one canonical execution, so the route in play does not depend on where
the change arrived. This is
the same construction as defining a normal form instead of proving that rewrite rules
commute.

The model takes the second. It is cheaper, more robust, and it scales to many
artifact-sets where the first would need every pair independently proven. How it works is
[Canonical execution](/cyber-truss/model/canonical-execution/).

The risk does not vanish — it **concentrates**, in the step that normalizes. That
relocation is a benefit rather than a caveat: it moves the danger from many places nobody
can check into one place that is directly evaluable.

**Status: Settled** that canonicalization is the construction. **Open:** whether that
execution is unique and composes. See [Open questions](/cyber-truss/model/open-questions/#does-an-intent-determine-one-set-of-workflows).

## How the claim is tested

The guarantee yields its own acceptance test, and it is the one test that cannot be
written from inside any single artifact-set:

> Run the same change from several entry points. Diff the resulting **topology**.

If the topologies differ, the system is not delivering its central claim. Expensive to
run, trivially falsifiable — the right combination for a system-level evaluation.

**Status: Settled** as the shape of the test. **Open:** what a topology diff is
operationally.
