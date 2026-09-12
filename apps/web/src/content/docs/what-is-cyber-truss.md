---
title: What is cyber-truss
description: A change lands wherever the work starts, and comes back carrying the criteria it must now meet.
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

cyber-truss makes a system self-converging: a change lands wherever it is natural to make
it, strains the connections it crosses, and comes back carrying the criteria it must now
meet.

## What it does

Most ways of working make you pick an entry point. Fix the bug in the code and the
specification that described the old behaviour goes stale. Write the specification first
and you author the same change twice. Under time pressure the first habit wins, and the
parts of a system end up disagreeing with each other.

cyber-truss removes the choice. Make the change where the work actually starts. That
change [strains](/cyber-truss/model/connections/#three-kinds-of-strain) the
[connections](/cyber-truss/model/connections/) it crosses, because a connection states a
relation between two [artifact-sets](/cyber-truss/model/artifact-sets/) that has to hold,
and it no longer does.

Clearing the strain is a loop, and the loop does not push your change outward from where
it landed. The change is lifted out of line diffs into artifact-set vocabulary, then
distilled into the **request** behind it, meaning the intent separated from the particular
expression you happened to use. The criteria a settled state must satisfy are derived from
that request. Only then does the workflow replay the request from its own starting point,
and the replay is an independent derivation. It does not read your change as the answer.
It produces its own and compares.

So the criteria that come back to your change were authored by neither party to the
comparison. They may confirm what you wrote. They may also show what it missed, and that
is the case worth having: the round trip improved the work rather than only recording it.

The guarantee this buys is [confluence](/cyber-truss/model/confluence/). Whichever
artifact you started from, the system settles into the same state.

## Where this goes

The loop above is set out in full, with the reasoning for the order of its steps, in
[Canonical execution](/cyber-truss/model/canonical-execution/). The three readings the
design is worked out from are in [The lattice](/cyber-truss/model/lattice/).
