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

## Does an intent determine one set of workflows?

[Confluence by canonicalization](/cyber-truss/model/confluence/#two-ways-to-buy-it-and-why-one-is-impractical)
requires one canonical execution per distilled intent.
[Selection](/cyber-truss/model/workflow/#how-workflows-are-selected) yields every workflow
the change bypassed and every workflow propagation reaches, so that execution is a set of
workflows working toward one state. Canonicalization holds only if two things do.

**The set is unique.** The same intent, arriving at the same strain, must select the same
workflows. This plainly fails per connection-pair, since several workflows can span the
same two artifact-sets. A refactor firing from `{code, test, stories}` to
`{website content}` uses a different workflow than the mission loop, though both connect
sets that the mission loop also connects. Whether the set is unique at the level of the
*set of artifact-sets* is a conjecture, not a result.

**The results converge.** Workflows in the set start from different Requests and can reach
overlapping artifacts. The order they run in is
[not controlled](/cyber-truss/model/canonical-execution/#order-is-not-controlled), and when
their results disagree another cycle runs. Order may change how many cycles pass and which
settled state is reached, provided every settled state meets the same criteria and each
choice between states is recorded. The cycles must also come to rest.
[Four rules](/cyber-truss/model/canonical-execution/#cycles-must-come-to-rest) bound a run
with no person in it, and they depend on the specification controller catching a reversal
renamed as a new criterion.

**What breaks if it resolves badly:** the whole confluence construction. If the set is not
unique, or its results do not converge, path-independence needs a different mechanism than
canonicalization. The likeliest fallback is per-relation confluence, with the proof burden
that implies.

**Most load-bearing open question in the model.**

## Can distillation be made stable?

Canonicalization concentrates the confluence requirement into
[distillation](/cyber-truss/model/canonical-execution/#distillation-carries-the-weight).
Two different expressions of one intent must distill to the same intent.

Distillation is irreducibly agentic, so stability here is an empirical question about
agent behaviour rather than a property that can be proven.

**What breaks if it resolves badly:** the guarantee fails at the normalization step
instead of in the connections — the same failure, relocated. The upside is that this
failure is *measurable*: feed several expressions of one intent and compare the distilled
intents.

## Is per-workflow translation stable?

[Distillation stops at intent](/cyber-truss/model/canonical-execution/#distillation-stops-at-intent),
and each selected workflow translates that intent into its own Request. Translation is a
second agentic step, and it runs once per workflow.

It is narrower than distillation, one intent into one vocabulary, and it can be evaluated
per workflow: hand one workflow the same intent several times and compare the Requests.

**What breaks if it resolves badly:** workflows given the same intent start from different
Requests, and the set's results stop composing even when selection is unique. The failure
is spread across workflows rather than concentrated, but each instance is checkable in
isolation.

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
change is wrong."*

The mechanism now proposed is
[deriving the criteria from the intent before the replay runs](/cyber-truss/model/canonical-execution/#criteria-are-derived-before-the-replay-not-after),
so that neither party to the comparison authored the bar it is judged against. That is a
real mechanism where there was previously only a requirement, but it relocates the exposure
rather than removing it: criteria derived from a misread intent are wrong in the same
direction as everything downstream of them. Whether the relocation is enough is unresolved.

## Which strain does an implementation ahead of its specification leave?

The [three kinds of strain](/cyber-truss/model/connections/#three-kinds-of-strain) are
defined from the specification's side: an implementation incomplete against its
specification, a specification obliging an implementation elsewhere, criteria unsatisfied
on a cold repository. Free entry makes the reverse the common case. A developer fixes the
code and the specification is the side left behind.

It is not clear which kind that strain is, or whether it is one of the three at all. The
[bug fixed directly in code](/cyber-truss/examples/software-bug-fix/) example hits this in
both variants: where the specification states the wrong rule, and where it states no rule.

**What breaks if it resolves badly:** selection starts from strain, so a change the kinds
cannot name selects nothing. Code-first changes are the case the model exists to make
safe.

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
  before anything can be matched. That it is required is settled; where it sits and how much
  judgement it needs is not.
- **What is a topology diff, operationally?** The model's
  [acceptance test](/cyber-truss/model/confluence/#how-the-claim-is-tested) depends on
  comparing topologies across runs. The notion is clear; the operation is not.
- **Do ACED and Quill express cleanly?** SDD does. Two more two-set instances, both
  differently shaped, should be run through the model before it is fixed.
- **What form does provenance take** on deltas produced by canonical execution, so they
  do not re-trigger it?
- **How are specification levels identified across artifact types?** Two specifications are
  comparable when they sit at
  [the same rung](/cyber-truss/model/specification/#specifications-exist-at-every-level) —
  function, module, product, system. What fixes the rung for an artifact type that has no
  obvious analogue of a function is undefined.
- **How much of the artifact topology is universal?** The catalog of artifact *roles* looks
  close to portable across repositories, and so do most
  [unit-of-change](/cyber-truss/model/artifact-sets/#axis-1--unit-of-change) edges, which
  follow from what the artifacts mean.
  [Governance targets](/cyber-truss/model/artifact-sets/#axis-2--governance-target) are
  local by construction — they are a team's opinion about which criteria apply where. If
  that split holds, the product ships a default topology that repositories extend and
  override rather than a blank page. Empirical, and untested against a second repository.
