---
title: Workflow
description: What a workflow declares, the three roles a set can hold in it, and how a change finds the workflows it needs
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

## What a workflow declares

A workflow is a named policy over the lattice. It declares six things.

| Parameter | What it fixes |
| --- | --- |
| Span | The artifact-sets the workflow covers |
| Roles | For each set in the span, whether it is an input, owned, or an output |
| Shape | The connections between those sets that the workflow traverses |
| Discharge | Where strain on a crossing must be resolved |
| Strain policy | How much strain of each kind may be carried across each crossing |
| Leash | Which writes an agent may make without a person's approval |

Span, shape, discharge, and strain policy came out of expressing staged processes, and the
[workflow catalog](/cyber-truss/model/workflows/) tests them against eight fields. Roles
and leash came from the examples, where a workflow without them could rewrite the evidence
it is judged against, or make an irreversible write nobody approved.

A workflow adds no mechanism of its own. It is a parameterisation of
[artifact-sets](/cyber-truss/model/artifact-sets/),
[connections](/cyber-truss/model/connections/), discharge, and
[strain](/cyber-truss/model/connections/#kinds-of-strain).

**Status: Settled** that a workflow declares these six. **Thesis**, argued on the catalog
page, that nothing further is needed.

## Three roles

Each set in a workflow's span holds one role.

| Role | The workflow may | What sets it apart |
| --- | --- | --- |
| **Input** | read | Never written by this workflow |
| **Owned** | read and write | Held in a state the workflow can revise in place |
| **Output** | write | Emitted. It cannot be revised, only superseded by a later emission |

Docs update reads `{spec}` and owns `{user docs}`. Feature delivery owns `{PRD}`, `{spec}`,
and `{code, test}`, and has no output. Release reads `{code, test}`, owns `{changelog}`,
and outputs `{published package}`. A published version cannot be edited. The only way
forward is the next version.

**Strain on an output is cleared by a superseding emission, never by a rewrite.** Until
the next emission exists, the strain is held as
[obligation](/cyber-truss/model/connections/#obligation). The
[trading example](/cyber-truss/examples/stock-trade-without-thesis/) meets this with broker
orders, which cannot be undone, only offset by a new order.

**Status: Settled.**

## Direction lives in the workflow

A connection is undirected. A workflow is not. Its roles fix which end of each connection
it reads and which end it writes.

**A workflow never writes its inputs.** A thesis-first trade that reads `{market data}` and
owns `{theses}` restores a strained connection by revising the thesis. It cannot restore it
by rewriting the data to fit the thesis.

Roles are not the starting point. Feature delivery starts at `{PRD}` and owns it. A
workflow can have no inputs at all.

This settles which end of a connection is the specification, per workflow. The
[per-edge roles](/cyber-truss/model/specification/#specifies-is-a-relation-not-a-layer)
allow either reading on an edge such as `{API docs}` to `{code, test}`, and the choice
decides the settled state. A workflow that reads the API docs and owns the code treats the
published API as a contract. A workflow that reads the code and owns the docs documents
whatever shipped. Both are legitimate. A team declares the one it means.

So direction has two sources, and the connection is neither: where the change landed, and
the workflow that restores the relation.

**Status: Settled.**

## A change finds its candidates

Two lookups over declared roles find every workflow a change might need. Neither is a
judgement.

- **Upstream candidates** own or output a changed set. The change skipped their
  derivation, so they are where
  [distillation](/cyber-truss/model/canonical-execution/#distillation-reads-backward) reads
  back.
- **Downstream candidates** read a changed set as an input. The change moved something
  they depend on.

When feature delivery amends `{spec}`, docs update is a downstream candidate because it
reads `{spec}`. Nothing has to notice the docs going stale first.

A set can be owned or output by several workflows. In the
[bug-fix example](/cyber-truss/examples/software-bug-fix/), `{code, test}` is written by
feature delivery and by design implementation, so a change to the code finds both as
upstream candidates. A set no workflow declares finds nothing, and a change there reaches
no workflow at all.

**Status: Thesis.**

## What a workflow reads

A workflow always reads the distilled intent and its inputs as they now stand. Whether it
also reads the arriving change depends on where the change landed.

- **The change landed in one of its inputs.** The workflow reads it, including the diff.
  The input is authoritative for this workflow, and the diff narrows the work without
  biasing the answer.
- **The change landed in a set the workflow owns or outputs.** The workflow does not read
  it. That change is the prediction the replay exists to check, and a replay that reads it
  first agrees with it instead of checking it. Only the
  [comparison](/cyber-truss/model/canonical-execution/#reading-the-comparison) reads it,
  afterwards.

**Status: Settled**, as a consequence of the replay being an independent derivation.

## How workflows are selected

Selection yields every workflow that applies. There is no single global workflow with one
starting point, and a change rarely needs only one.

1. **Find candidates.** The upstream and downstream candidates of every changed set. A
   lookup.
2. **Read back.** Distillation walks back along each upstream candidate's shape, from the
   changed set toward the workflow's declared start. It stops at the first set that holds
   or contradicts what the change implies, or at the start.
3. **Check strain.** Judgement, because evaluating criteria needs evaluation.
   - An upstream candidate is strained if the sets the walk read do not hold the change's
     criteria, because a criterion is [missing](/cyber-truss/model/connections/#missing)
     or contradicted.
   - A downstream candidate is strained if the sets it owns or outputs no longer meet what
     its changed inputs state.
   - A set the walk read that contradicts or lacks the change's criteria is strained even
     when no candidate spans it. The workflows that own or output that set are selected.
4. **Wait on inputs.** A selected workflow whose inputs are still strained waits until the
   workflow that writes those inputs has run, then checks its strain again, because the
   wait may have cleared it. Which side counts as strained follows the backward read. The
   set the change landed in, and any set the read found holding the change's criteria, are
   settled. Only a set the read found lacking or contradicting them is strained. So where
   two workflows span one edge with opposite roles, one of them waits and the other runs,
   and they never wait on each other. This does not control order. It fixes when a
   workflow can start, so a workflow does not run against an input about to change.
5. **Break ties.** Where several workflows remain for one strained set, the intent decides.
   Judgement.
6. **Raise what nothing can restore.** Strain on a set that no declared workflow owns or
   outputs cannot be cleared by any run. It is raised as an obligation against that set.
   It also means the declarations have a gap: the team needs a workflow it has not
   declared.

Candidates are cheap to find and costly to run, which is why step 3 filters them. A
refactor inside `{code, test, stories}` finds the mission loop as an upstream candidate,
because the loop owns the code. The refactor's criteria say behaviour is unchanged, the
spec already holds that, and the loop does not run. Routing every change through the
longest path would reintroduce exactly the ceremony the model removes.

Selection is not decided once, up front. A replay changes artifacts, those changes have
their own candidates, and further workflows are selected. Reach is discovered by
propagation rather than predicted, because predicting reach is the step people fail at
today.

Plural selection moves the confluence question rather than removing it. Canonicalization
now needs two things: an intent must pick out one set of workflows, and the set's results
must settle in a state that meets the same criteria whatever order they run in. The second
is a composition obligation that a single workflow never carried. Criteria combine by
[join](/cyber-truss/model/join/), which cannot depend on order, and a conflict with no
usable join is settled by a recorded decision. How runs that disagree come to rest is in
[Cycles must come to rest](/cyber-truss/model/canonical-execution/#cycles-must-come-to-rest).

**Status: Settled** that selection is plural, found by lookups over roles, and extended by
propagation. **Thesis** on the six steps. **Open**, and load-bearing: whether the set is
unique. See
[Open questions](/cyber-truss/model/open-questions/#does-an-intent-determine-one-set-of-workflows).

## A replay starts at the workflow's start

A workflow replays from its declared starting point, wherever the change landed. At each
node the Request either changes that node's criteria or passes to the next node unchanged.

A node passes the Request on when it is too coarse to hold the criteria the intent implies.
A PRD states what a feature must do and has no place for a page-count rule, so a pagination
fix passes through it to the feature spec, which is where the rule belongs.

Starting at the highest node the intent changes would give the same result when the guess
is right. It needs that node predicted up front, and predicting reach is the step selection
already declines to make. The visit also checks something. Passing through is a judgement
that the intent does not change that node, and it is the same judgement that catches a
change that does.

**Status: Settled.**

## Leash

A workflow's leash says which writes an agent may make without asking a person. The roles
set the defaults.

- **Owned writes proceed when the criteria pass.** The criteria were frozen before the
  replay, and they are the check.
- **Output writes need approval.** An emission cannot be revised, so a mistake there is
  permanent.
- **The comparison sets a floor.** A builder outcome, a match or a filled hole, may proceed.
  An architect outcome, *change course*, and an oracle outcome, *stop*, go to a person
  whatever the role. See
  [Reading the comparison](/cyber-truss/model/canonical-execution/#reading-the-comparison).
- **Confidence only tightens.** An agent unsure of a write asks, even where the leash lets it
  proceed. An agent sure of a write never passes a leash that requires approval.
  Self-reported confidence is the signal easiest to get wrong, so it never grants autonomy.

A team may loosen a default per set, for example letting an agent emit to a staging
channel. An approval is a decision, and it is recorded like one, so
[rule 4](/cyber-truss/model/canonical-execution/#cycles-must-come-to-rest) applies to it.

**Status: Thesis** on the defaults. **Settled** that confidence only tightens.

## Workflow and controller

A workflow works between sets. It decides what must become true of each set it writes: a
Request, and the criteria that reach that set. The set's
[controller](/cyber-truss/model/controller/) works within the set, and decides how the set
meets them.

**Status: Thesis.** The handoff is on the Controller page.
