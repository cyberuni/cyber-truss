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

**The results converge.** Workflows in the set distill the change separately and can reach
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
[distillation](/cyber-truss/model/canonical-execution/#distillation-carries-the-weight),
which each candidate workflow runs within its own span.
Two different expressions of one intent must distill to the same intent.

Distillation is irreducibly agentic, so stability here is an empirical question about
agent behaviour rather than a property that can be proven.

**What breaks if it resolves badly:** the guarantee fails at the normalization step
instead of in the connections — the same failure, relocated. The upside is that this
failure is *measurable*: feed one workflow several expressions of one intent and compare
the intents it states.

Only a change is distilled. A routed job carries the root intent unchanged, so a controller
far above the source abstracts it once, itself. Workflows are short chains, so the distance
is expected to be small, but the examples do not yet carry enough detail to test it.

Two narrower risks sit beside it. A workflow that wrongly abstains goes unnoticed, since no
other workflow's reading covers its vocabulary. And a reading wider than the change, such as
treating a new prop as part of the intent, is caught only where criteria meet a controller
convention or an output that needs approval.

## Do controllers derive the same criteria from one intent?

[Distillation stops at intent](/cyber-truss/model/canonical-execution/#distillation-stops-at-intent),
and each set's controller derives the criteria that intent implies for its set, and judges
whether the set is too coarse to hold them. That is a second agentic step, run once per set
asked.

It is narrower than distillation, one intent into one set's vocabulary, and it can be
evaluated per controller: hand one controller the same intent several times and compare the
criteria and the answer.

**What breaks if it resolves badly:** the replay starts at different sets for the same
intent, and the criteria reaching a source differ between runs even when selection is
unique. The failure is spread across controllers rather than concentrated, but each
instance is checkable in isolation.

## What vehicle holds pending Requests?

Out-of-band discharge needs somewhere to hold jobs awaiting replay and reconciliation.
Something is clearly required; its form is not settled. The proposal is the
[run ledger](/cyber-truss/model/canonical-execution/#the-run-ledger-schedules-it-does-not-decide):
a git-tracked, append-only graph of pending jobs and what each waits on, which also holds
the termination record. It survives sessions and is a team artifact rather than a session
artifact, but it is not the only option.

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

## What bounds retries across runs?

The [rules that make cycles come to rest](/cyber-truss/model/canonical-execution/#cycles-must-come-to-rest)
bound one run. They do not bound a sequence of runs.

A criterion over time, such as *market data must not be older than two days*, goes false on
schedule. If the controller that refreshes the data keeps failing, every tick starts a new
run, selects the refresh, and fails again. Each run is bounded. The sequence is not, and no
rule sees it, because each attempt belongs to a different run.

Something must notice a failure that repeats across runs and hand it to a person. The
record in [the run ledger](https://github.com/cyberuni/cyber-truss/blob/main/docs/backlog.md)
could carry it, if it is kept past the run that wrote it.

**What breaks if it resolves badly:** the most expensive failure the loop has, running
without end, returns through the gap between runs that the per-run rules closed.

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

## Which strain does an implementation that contradicts its specification leave?

Free entry makes the implementation-first change the common case. A developer fixes the
code and the specification is the side left behind. The
[bug fixed directly in code](/cyber-truss/examples/software-bug-fix/) example has two
variants of it.

Where the specification states no rule, the strain is
[missing](/cyber-truss/model/connections/#missing): the change introduced a criterion no
input holds. That variant is answered.

Where the specification states a rule and the change contradicts it, the question stands.
It reads like [incompleteness](/cyber-truss/model/connections/#incompleteness), a
specification and implementation disagreeing with both in hand, except that incompleteness
is defined within one unit of change, and a spec and its code are usually two. It may be
incompleteness with a wider boundary, or a kind of its own.

**What breaks if it resolves badly:** the kind decides how the strain blocks, so a
contradiction filed under the wrong kind is gated wrongly, either stopping a change that
should proceed or letting one through that should wait.

## Where does the controller interface sit?

Controllers span a spectrum from agent definition to deterministic code. What they have
in common — what a controller is *handed* and what it *returns* — is undefined. A first
draft is on [the Controller page](/cyber-truss/model/controller/#the-handoff): a workflow
asks a controller for criteria, asks it to write, or asks it to reconcile a change that
landed in its set, and each call returns something different.

This is the contract every controller ever written will encode, so it is expensive to
change later. It is also the thing plugin ecosystems most reliably die on, which argues
for settling it before there is more than one controller rather than after.

## What does an audit loop read?

A run settles against the declared topology and cannot see a connection nobody declared. The
model hands that to an
[audit loop](/cyber-truss/model/connections/#a-missing-connection-is-found-outside-the-run)
running outside normal operation. Its shape is not defined: which sets it reads together, how
often it runs, what counts as evidence that a connection is missing, and how a finding becomes a
declared connection rather than a report nobody acts on.

**What breaks if it resolves badly:** a rule is hollowed out one permitted step at a time, every
run reports each step as additive, and nothing ever looks across the sets where the loss shows.

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
