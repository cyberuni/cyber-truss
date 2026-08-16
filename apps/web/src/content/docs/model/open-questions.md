---
title: Open questions
description: What is unresolved in the model, and what breaks if it resolves badly
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

This page exists because the model is meant to be referenced before it is built. Anyone
adopting the vocabulary needs to know which parts may move.

Ordered by how much depends on the answer.

## At what level is the workflow unique?

[Confluence by canonicalization](/cyber-truss/model/confluence/#two-ways-to-buy-it-and-why-one-is-impractical)
requires that a distilled Request maps to **one** workflow. Otherwise there is more than
one executed path and the construction gives nothing.

Uniqueness plainly fails per connection-pair: several workflows can span the same two
artifact-sets. A refactor firing from `{code, test, stories}` to `{website content}` uses
a different workflow than the mission loop, though both connect sets that the mission
loop also connects.

It may hold at the level of the *set of artifact-sets*. That is a conjecture, not a
result.

**What breaks if it resolves badly:** the whole confluence construction. If no level
guarantees uniqueness, path-independence needs a different mechanism than canonicalization
— most likely a fallback to per-relation confluence, with the proof burden that implies.

**Most load-bearing open question in the model.**

## Can distillation be made stable?

Canonicalization concentrates the confluence requirement into
[distillation](/cyber-truss/model/canonical-execution/#distillation-carries-the-weight).
Two different expressions of one intent must produce the same Request.

Distillation is irreducibly agentic, so stability here is an empirical question about
agent behaviour rather than a property that can be proven.

**What breaks if it resolves badly:** the guarantee fails at the normalization step
instead of in the connections — the same failure, relocated. The upside is that this
failure is *measurable*: feed several expressions of one intent and compare the Requests.

## What vehicle holds pending Requests?

Out-of-band discharge needs somewhere to hold Requests awaiting replay and comparison.
Something is clearly required; its form is not settled. A git-tracked ledger is the
obvious candidate — it survives sessions and is a team artifact rather than a session
artifact — but it is not the only option.

**Related risk, and it is the documented failure mode of every system in this shape:**
deferred non-blocking obligations rot. This repository's own `docs/backlog.md` has
entries open since the day they were written. If the runtime is a pile nobody discharges,
the guarantee quietly becomes aspirational.

Gating is not the fix, because gating is the ceremony the model removes.

**Proposed, not settled:** obligations are non-blocking within a working context and
blocking at a boundary — realistically the merge to trunk. Work proceeds uninterrupted,
obligations accumulate, and the branch cannot retire while topology is strained.
Coordinates never block. Transient inconsistency becomes designed, with a stated window,
rather than accidental.

## Can the comparison indict the workflow?

Canonicalization guarantees confluence of the executed path, not its correctness. A
defective workflow converges reliably on the same wrong answer, and normalizes away the
ad-hoc changes that would have revealed it.

The comparison must be able to conclude *"the workflow is wrong"* and not only *"this
change is wrong."* How that is enforced — rather than merely hoped for — is unresolved.

## Where does the controller interface sit?

Controllers span a spectrum from agent definition to deterministic code. What they have
in common — what a controller is *handed* and what it *returns* — is undefined.

This is the contract every controller ever written will encode, so it is expensive to
change later. It is also the thing plugin ecosystems most reliably die on, which argues
for settling it before there is more than one controller rather than after.

## Smaller, but unresolved

- **Is the controller spectrum a total order?** It reads as one from judgement to
  mechanism, but that has not been tested against enough controllers to assert.
- **Where does lifting live?** A line diff must be raised into artifact-set vocabulary
  before anything joins. That it is required is settled; where it sits and how much
  judgement it needs is not.
- **What is a topology diff, operationally?** The model's
  [acceptance test](/cyber-truss/model/confluence/#how-the-claim-is-tested) depends on
  comparing topologies across runs. The notion is clear; the operation is not.
- **Do ACED and Quill express cleanly?** SDD does. Two more two-set instances, both
  differently shaped, should be run through the model before it is fixed.
- **What form does provenance take** on deltas produced by canonical execution, so they
  do not re-trigger it?
