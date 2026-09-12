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

The example below is software development. Nothing in the model is specific to it.

Traditionally, there are two ways a change actually gets made.

Someone files a bug or asks for a feature, and the work starts at the top. A ticket, then
a PRD, then a design doc, then a specification, and finally the code. You commit to the
specification before you have touched the code, and what the implementation teaches you
never travels back up.

Or you find the problem yourself in the code and fix it. What you leave behind is
the PRD that still describes the old behaviour, the mockups nobody redrew, and the ticket that was never opened. The fix shipped and the
system around it disagrees with itself.

Both paths end in the same place.

cyber-truss lets you make the change where you understand it and get the rest anyway. It
can do that because those artifacts are parts of the system too, with the connections
between them declared rather than remembered. That change
[strains](/cyber-truss/model/connections/#three-kinds-of-strain) the
[connections](/cyber-truss/model/connections/) it crosses, because a connection states a
relation between two [artifact-sets](/cyber-truss/model/artifact-sets/) that has to hold,
and it no longer does.

Clearing the strain does not push your change outward from where it landed. The change is
lifted out of line diffs into artifact-set vocabulary, then distilled into the **request**
behind it: the intent, separated from the particular expression you used. The criteria a
settled state must satisfy are derived from that request. Only then does the workflow
replay the request from its own starting point. The replay does not read your change as
the answer. It derives its own and compares.

So the criteria that come back to your change were authored by neither party to the
comparison. Sometimes they confirm what you wrote. More often they add to it: a case the
quick fix didn't cover, or a better shape that only became visible once the intent was
written down and worked forward. The round trip improves the change instead of only
recording it.

The guarantee this buys is [confluence](/cyber-truss/model/confluence/). Whichever
artifact you started from, the system settles into the same state.

## Where this goes

The loop above is set out in full, with the reasoning for the order of its steps, in
[Canonical execution](/cyber-truss/model/canonical-execution/). The three readings the
design is worked out from are in [The lattice](/cyber-truss/model/lattice/).
