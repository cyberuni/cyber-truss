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

There are two ways a change actually gets made.

Someone files a bug or asks for a feature, and the work starts at the top. A ticket, then
a PRD, then a design doc, then a specification, and finally the code. Writing all that is
no longer the slow part, since an agent will draft it in minutes. The problem is that you
commit to the specification before you have touched the code, and what the implementation
teaches you never travels back up. The documents exist. They stopped being true somewhere
around step three.

Or you find the problem yourself, in the code, and you fix it. What you leave behind is
the PRD that still describes the old behaviour, the spec that now contradicts the code,
the mockups nobody redrew, and the ticket that was never opened. The fix shipped and the
system around it disagrees with itself.

Both paths end in the same place, and cheap document generation makes it worse rather than
better: more artifacts, drafted faster, going stale at the same rate.

cyber-truss lets you make the change where you understand it and get the rest anyway. Make
the change where the work actually starts. That change
[strains](/cyber-truss/model/connections/#three-kinds-of-strain) the
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
comparison. Sometimes they confirm what you wrote. More often they add to it: a case the
quick fix didn't cover, or a better shape for it that only became visible once the intent
was written down and worked forward. That is the case worth having. The round trip
improves the change instead of only recording it.

The guarantee this buys is [confluence](/cyber-truss/model/confluence/). Whichever
artifact you started from, the system settles into the same state.

## Where this goes

The loop above is set out in full, with the reasoning for the order of its steps, in
[Canonical execution](/cyber-truss/model/canonical-execution/). The three readings the
design is worked out from are in [The lattice](/cyber-truss/model/lattice/).
