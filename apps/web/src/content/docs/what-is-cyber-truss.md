---
title: What is cyber-truss
description: A change reaches everything it must and no further, and the system settles back into a consistent state.
---

cyber-truss makes a system self-converging: a change landing anywhere redistributes
through whatever is coupled to it, and settling back into a consistent state is the path
of least resistance.

## The pitch

In a truss, a load applied at one joint does not stay there. It travels the members, and
the structure comes to rest in a configuration that carries it. Nothing searched for that
configuration — it is simply where the structure is at rest.

A system built from many parts wants to behave the same way and does not. A change to one
part obliges changes in the parts coupled to it: the specification it answers to, the
tests that pin it down, the documentation that describes it, the code that calls it.
Finding those parts is manual, and reconciling them is uphill work that can always be
deferred — which is why systems drift out of agreement and stay there.

cyber-truss makes that reconciliation downhill instead. It models which parts must move
together and how tightly they are coupled, so a change reaches exactly the parts that owe
a response and dies out where the coupling goes slack. Because the model is a lattice in
the order-theoretic sense, the state it settles into is well-defined: however you get
there, you land on the same one.

## Where this goes

The three readings the design is worked out from — the crystal lattice, the graph of
connected nodes, and the order-theoretic lattice — are set out in
[The lattice](/cyber-truss/model/lattice/).
