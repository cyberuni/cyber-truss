---
title: Connections
description: The relation between artifact-sets, why nothing owns it today, and the three kinds of strain
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

## The hole is at the connections

Every artifact-set has a controller, and most of them are good. The compiler owns
`{TypeScript files}`. Biome owns formatting. Astro and Starlight own `{website content}`.

None of them reach past the set they own. And the couplings that matter most run
*between* sets:

| Connection | Owner today |
| --- | --- |
| Starlight stylesheet → components rendered beneath it | nobody |
| a skill → four vendor manifests + the `files` list | prose in `AGENTS.md` |
| version field → four manifests | `scripts/sync-plugin-version.mjs`, hand-built |
| an accepted ADR → the module it governs | nobody |

The gap is not at a level of granularity. It is at the connections, uniformly, at every
level. That single observation is what unifies the CSS-correctness thread and the plugin
thread in this repository's backlog: they are not adjacent bodies of work, they are the
same one.

**Status: Settled.**

## Connections are undirected

A connection is a relation between two artifact-sets. It is **not** an arrow.

SDD's `{spec, suite}` and `{code, test, stories}` are connected. The mission loop
traverses that connection spec-first; backfill traverses it implementation-first;
build-to-learn works both ends at once. Three traversals, one relation.

Direction is a property of *where the delta landed*, not of the connection. Writing
direction into the connection bakes in one workflow and makes the others second-class —
which is precisely the situation the model exists to fix.

**Status: Settled.**

## Declarative, never procedural

A connection states a relation **that must hold**. It is never a handler that fires.

This is the most expensive commitment in the model to reverse, because every connection
ever written encodes it.

The reason is confluence. If a connection is *"when the spec changes, run this to update
the implementation,"* then backfill needs a second script for the reverse direction, and
nothing makes the two agree. Two entry points, two code paths, two results, and the
guarantee is gone before the first connection ships.

Stated as a relation, propagation means *restore the relation* in whichever direction is
strained. Same relation, same fixed point, any entry point.

**Status: Settled.**

## Three kinds of strain

Strain is a connection whose relation does not currently hold. Working the two axes
against real cases produces three distinct kinds, and they behave differently.

### Completeness

Intra-unit-of-change. *Add a skill, also wire four manifests and the `files` list.*

That is one commit; the strain is that the change is **incomplete right now**. It gates,
and it blocks.

### Obligation

Between units of change. *An accepted ADR obliges the module it governs.*

These are deliberately separate changes — decide now, implement later. The strain is not
"you forgot," it is **"this change created a debt."** It does not block, but it must be
tracked and discharged traceably.

This kind was the last to be identified, and it explains an artifact already sitting in
the repository: `docs/backlog.md` is a **hand-maintained obligation ledger**. Not all of
it — some entries are genuinely new ideas — but the ADR-obliges-module chain and several
others are debts created by earlier changes, recorded by hand because nothing generates
them.

It also gives *declining* a home. Declining is how an obligation is discharged without
being done, and without it any report nags forever.

### Conformance

Axis 2. *This skill violates the agent-instruction guidelines.*

State-driven, evaluable on a cold repository, and requires no delta.

**Status: Settled** that the three are distinct and block differently. **Open:** the
precise boundary conditions on each.

## A coupling that resists encoding

The clearest evidence that controllers cannot all migrate to deterministic code comes
from a defect in this repository's own docs site.

An element declared `top: 0rem` rendered 16px lower than intended. Starlight's markdown
stylesheet gives every element following a sibling a 1rem top margin, and an absolutely
positioned element offsets its **margin edge** — so the box sat 1rem down while
`getComputedStyle` reported `top` as exactly `0px`, in perfect agreement with the source.

Every static check passed. The value was wrong anyway.

The attempt to push this coupling down to deterministic code makes it *worse*: stylelint's
`length-zero-no-unit` would have autofixed `0rem` → `0`, leaving the defect intact and
destroying the only forensic tell. There is no mechanical rung beneath *render it and
measure*.

This is why the controller spectrum has an agentic end, and why the plugin is not an
optional convenience.

**Status: Settled** — the case is verified against this repository's configuration.
