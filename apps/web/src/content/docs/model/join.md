---
title: Join
description: How criteria arriving by different routes combine, where they conflict, and why the join is taken over criteria rather than states
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

## What the join combines

Criteria. Order sets of criteria by inclusion: a set that contains another constrains
everything the smaller one does, and more. In that order, the **join** of two sets is the
smallest set that contains both. That is their union.

Union has the three properties that make order irrelevant. It is the same whichever set
arrived first, the same however several sets are grouped, and a criterion that arrives
twice, by two routes, counts once. So criteria that reach an artifact-set by different
routes, in any order and any number of times, combine to one set.

This is the order-theoretic reading of [the lattice](/cyber-truss/model/lattice/), and it
is what [confluence](/cyber-truss/model/confluence/#the-claim) rests on.

**Status: Settled.**

## Not over states

The join is not taken over states. The states that meet a set of criteria are usually
several, the way a truss can have several stable equilibria, and none of them is least. Two
routes can settle in different states that meet the same criteria, and neither is wrong.

That is why confluence is claimed over criteria. A join over states would promise one
settled state, and criteria rarely determine one.

**Status: Settled.**

## Join and connection

The two answer different questions, and they belong to different frames.

| | [Connection](/cyber-truss/model/connections/) | Join |
| --- | --- | --- |
| Reading of the lattice | The graph: sets and the edges between them | The order: sets of criteria under inclusion |
| What it is | A declared relation between two artifact-sets | An operation that combines sets of criteria |
| Frame | How the system is set up | How a run proceeds |
| Failure | Strain: the relation does not currently hold | Conflict: no state can meet the combined criteria |
| Resolved by | A workflow restoring the relation | A recorded decision |

Connections say where criteria flow. The join says how criteria that reach the same place
combine. An artifact-set with one connection receives one set of criteria. An artifact-set
with several must meet the join of everything they bring.

In the [bug-fix example](/cyber-truss/examples/software-bug-fix/), `{code, test}` has two
connections. Through `{spec}` it receives *the page count rounds up* and *an empty list
shows one page*. Through `{mockups}` it receives *the page indicator looks like this*. The
code has to meet the union, and the union is the same whichever workflow finished first.

**Status: Settled.**

## Replacing a criterion is not a join

A run can change the criteria it combines. When the intent amends a criterion, the new one
replaces the old, and the old one leaves the set. That is not a join, and it is not a
conflict.

In the bug-fix example the spec states *round down, plus one*, and the fix's criteria say
*round up*. Joined, the two would contradict each other and every fix would stop for a
decision. They are not joined. Feature delivery amends the spec, the old rule is gone, and
only the new one takes part in the join at `{code, test}`.

The join combines criteria that stand together. Telling a replacement apart from a
contradiction is judgement. It is the same judgement that separates a new criterion from
a reversal under a new name, and the same controller makes it: the
[specification set's controller](/cyber-truss/model/canonical-execution/#a-reversal-renamed-as-a-new-criterion).

**Status: Settled** that replacement is distinct from join. **Open:** how a controller
tells the two apart.

## Conflict

A conflict is a join no state can meet. Two criteria stand together and contradict each
other.

Suppose design update runs with a designer in the loop, and the designer adds *hide the
page indicator when there is only one page*. The spec already says *the indicator always
shows the total page count*. Each criterion reaches `{code, test}` through its own
connection, and each could be met alone. Together they disagree about a list that fits on
one page.

The strain appears on connections, but its cause is in the join, so no workflow can
restore it. Whatever the code does, one of the two connections stays strained, and running
the workflows again only moves the strain from one to the other. A conflict needs a
[recorded decision](/cyber-truss/model/canonical-execution/#cycles-must-come-to-rest). The
decision settles which criterion stands and creates the next version of the criteria.

This is also how the join bounds a run. Oscillation between two workflows is often what
an unresolved conflict looks like from outside, and conflicts are finite: each pair of
contradicting criteria is decided once.

**Status: Settled** that a conflict is resolved by decision, not by replay.

## Within a run

The join holds within a run. There the run's criteria are frozen as a version, and a new
version comes only from a person adding criteria or from a recorded decision. Criteria the
specifications held before the run take part only where the intent does not replace them.

Between runs a specification changes freely. Criteria are rewritten and removed, and the
next run starts from whatever the specification then says. Holding criteria to
append-only across runs would be too restrictive. What is append-only is the record of how
each version replaced the last.

**Status: Settled.**
