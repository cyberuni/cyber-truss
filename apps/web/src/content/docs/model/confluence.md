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
construction. The [join](/cyber-truss/model/join/) is over criteria, not over states,
which is why the claim above is stated over criteria.

**Status: Settled** as the system's guarantee.

## Confluence within a criteria version

The join explains why merging criteria in any order gives one result. It does not explain
how the criteria are produced. Each controller derives criteria from what has reached it so
far, and in a different order it derives them from a different partial join. The claim needs
more than the join to cover that.

Within one [criteria version](/cyber-truss/model/canonical-execution/#cycles-must-come-to-rest),
it comes from the Chaotic Iteration Theorem, as Apt states it in
[*The Essence of Constraint Propagation*](https://arxiv.org/abs/cs/9811024), after Cousot &
Cousot. Read in this model, the theorem says that every fair order of the steps that derive
criteria reaches the same criteria: the least fixed point above the criteria the run started
from. It rests on three conditions.

- **Every criteria step is monotone.** More criteria in never means fewer criteria out. This
  gives uniqueness: every order that terminates ends at the same criteria. For a controller
  it is a contract on [the handoff](/cyber-truss/model/controller/#the-handoff).
- **Every criteria step is inflationary.** A step keeps every criterion it was given. On a
  finite set this gives termination. It matters here for a second reason: a run starts from
  the standing criteria, not from an empty set, and from a non-empty start, steps that are
  monotone but drop criteria can settle differently by order. Apt states the theorem from
  the empty start; that it carries over to a start that only grows is inferred.
- **The criteria a run can derive are finite.** Criteria are prose, and prose is
  open-ended, so this is an assumption about how controllers derive, not a property of the
  model.

The run ledger is Apt's generic worklist algorithm, and Apt proves that every schedule of
it that terminates gives the same result. That is
[the ledger schedules, it does not decide](/cyber-truss/model/canonical-execution/#the-run-ledger-schedules-it-does-not-decide)
stated as a theorem.

Between versions the theorem does not apply, because the steps that break its conditions
are the ones that start a version. A replacement, a removal, or a refusal takes a criterion
away, so it is not inflationary, and a conflict leaves no state that meets the criteria.
[Rule 1](/cyber-truss/model/canonical-execution/#cycles-must-come-to-rest) makes each of
them a major bump, settled by a person or a recorded decision. Two routes reach the same
criteria across versions because the same decisions are recorded, not because order does
not matter. Distillation is outside the theorem too: reading a change for its intent has no
order to be independent of, and canonical execution handles it by routing one root intent.

The theorem is about criteria, not states. It says two routes reach the same criteria. The
claim then treats the states that meet those criteria as equivalent, so the theorem
supplies the half of the claim the join left open, and nothing more.

**Status: Settled** that the criteria-layer claim is the theorem within a version and
recorded decisions between versions. **Thesis:** that the conditions hold. Finiteness is
assumed, the carry-over to a non-empty start is inferred, and monotone derivation is a
contract each controller must keep.

## What confluence is claimed over

Not byte-identity. A prototype-first route and a spec-first route will produce different
prose, different section order, different file organisation. None of that is a failure.

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
what the system guarantees**. Without it the guarantee is unachievable if you claim
byte-identity, and undefined if you claim nothing at all.

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
the change arrived. This is the same construction as defining a normal form instead of
proving that rewrite rules commute.

The model takes the second. It is cheaper, more robust, and it scales to many
artifact-sets where the first would need every pair independently proven. How it works is
[Canonical execution](/cyber-truss/model/canonical-execution/).

The risk does not vanish: it **concentrates**, in the step that normalizes. That
relocation is a benefit rather than a caveat: it moves the danger from many places nobody
can check into one place that is directly evaluable.

**Status: Settled** that canonicalization is the construction. **Open:** whether that
execution is unique and composes. See [Open questions](/cyber-truss/model/open-questions/#does-an-intent-determine-one-set-of-workflows).

## How the claim is tested

The guarantee yields its own acceptance test, and it is the one test that cannot be
written from inside any single artifact-set:

> Run the same change from several entry points. Diff the resulting **topology**.

If the topologies differ, the system is not delivering its central claim. Expensive to
run, trivially falsifiable: the right combination for a system-level evaluation.

**Status: Settled** as the shape of the test. **Open:** what a topology diff is
operationally.
