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
decides the settled state. A workflow that reads the code and owns the docs documents what
the code does. A workflow that reads the docs and owns the code uses the docs to plan the
API before it is built. Both are legitimate. A team declares the one it means.

Level suggests the default. The API reference describes the code's exported props, at the
same level as the code, and a set that describes another at its level reads that set's
expression. A set above another, such as a spec above the code, is reached through intent
instead, because
[expression stays with the source](/cyber-truss/model/canonical-execution/#expression-stays-with-the-source).

A team may declare both directions on an edge between revisable sets, as fiction does with
drafting and reverse outlining. Then neither side guards the other, and that is correct: the
declaration says both may lead. **A contract lives at an output.** A published package cannot
be revised, only superseded, so that is where a breaking change is irreversible and where
approval and a breaking-change convention guard it. An edge between two sets that can both be
revised is not a contract, whichever way it is declared.

So direction has two sources, and the connection is neither: where the change landed, and
the workflow that restores the relation.

**Status: Settled** that direction lives in the workflow. **Thesis** that level suggests the
default and that contracts live at outputs.

## Every workflow over the set picks the change up

A change lands in a set. Every workflow whose declared roles include that set picks it up. It
reads the change within its own span, induces the intent, and runs under that intent. The
lookup is over declarations, and it is not a judgement.

Where the set sits in the workflow decides where the run starts. If the set is where this
workflow starts, the workflow runs forward from there. Otherwise the workflow derives the
set, and the change skipped that derivation. It asks the controllers above the set, nearest
first, and replays from the highest affected one.

When feature delivery amends `{spec}`, docs update picks the change up because `{spec}` is
where docs update starts. Nothing has to notice the docs going stale first.

Being picked up is not being used. A workflow that finds nothing in the change abstains.

A set can be derived by several workflows. In the
[bug-fix example](/cyber-truss/examples/software-bug-fix/), `{code, test}` is written by
feature delivery and by design implementation, so a change to the code is picked up by both.
A set no workflow declares is picked up by nothing, and a change there reaches no workflow at
all.

**Status: Thesis.**

## What a workflow reads

A workflow is triggered by a change or by a routed job. A change it
[distills](/cyber-truss/model/canonical-execution/#distillation-reads-within-one-workflow)
within its own span. A routed job carries the root intent and references to the affected set's criteria,
and the workflow reads them within its span without distilling a new intent, because
[only a change is distilled](/cyber-truss/model/canonical-execution/#controllers-answer-for-their-own-sets).
A routed job carries no expression, so it always asks the controllers above.

For a change, what the workflow does next depends on the role the changed set holds in it.

- **The changed set is an input.** The workflow reads the change, including the diff. It
  describes that set or depends on it, so the expression is what it needs. It runs from the
  changed set downward, and nothing above the changed set is asked.
- **The changed set is owned or an output.** The workflow hands its intent to the
  controllers above the set, and they never see the change. The change reaches a controller
  once, at [reconciliation](/cyber-truss/model/canonical-execution/#reconciling-at-the-source),
  where it is checked against criteria derived without it.

An input that is not a specification states no intent. Release reads `{code, test}` and
owns `{changelog}`, and a changelog entry has to say why the code changed. The change's
[provenance marker](/cyber-truss/model/canonical-execution/#replay-output-must-not-re-trigger-replay)
names its run, and the run records its intent, so release looks the intent up. That is a
lookup, not a second distillation.

**Status: Thesis.** It replaced a rule that a workflow never reads a change in a set it owns.
That rule protected the independence of the check, and the controllers above the source now
protect it by deriving the criteria without the change.

## How workflows are selected

Selection yields every workflow that applies. There is no single global workflow with one
starting point, and a change rarely needs only one.

1. **Look up the workflows.** Every workflow whose declared roles include a changed set. A
   lookup.
2. **Distill.** Each of them states what the change is for within its span, or abstains.
3. **Ask upward.** A workflow that derives the changed set asks the controllers above it,
   nearest first, whether their sets hold the criteria the intent implies. A set too coarse
   to hold them passes the question up. Asking stops at the first set that holds. A workflow
   for which every set asked holds, and whose changed set meets its criteria at
   reconciliation, has nothing to replay. A workflow that starts at the changed set runs
   forward from it and asks nothing.
4. **Route what the workflow cannot write.** An affected set that is the workflow's input is
   routed to every workflow that owns or outputs it, carrying the root intent unchanged and
   references to the affected set's criteria. Each reads them within its span, then asks upward in its own
   shape or abstains. Nothing picks one owner.
5. **Schedule.** Every job goes to the
   [run ledger](/cyber-truss/model/canonical-execution/#the-run-ledger-schedules-it-does-not-decide),
   which collects the intents addressed to each set and hands them to its controller together.
   A job whose input has a pending writer may wait, as the workflow's strain policy says.
   The changed set counts as settled, so a job that reads it never waits on the
   reconciliation at it.
6. **Raise what nothing can restore.** An affected set that no declared workflow owns or
   outputs cannot be cleared by any run. It is raised as an obligation against that set. It
   also means the declarations have a gap: the team needs a workflow it has not declared.

The lookup is cheap and running a workflow is costly, which is why step 3 filters. A
refactor inside `{code, test, stories}` is picked up by the mission loop, because the loop
derives the code. The refactor's intent says behaviour is unchanged, the
spec's controller answers that the spec holds it, and the loop replays nothing. Routing
every change through the longest path would reintroduce exactly the ceremony the model
removes.

Selection is not decided once, up front. A replay changes artifacts, those changes are picked
up by the workflows over the sets they land in, and further workflows are selected. Reach is
discovered by propagation rather than predicted, because predicting reach is the step people
fail at today.

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

## A replay starts at the highest affected set

A workflow replays from the highest set in its shape that the intent affects, not from its
declared start. At each set on the way down, the set's controller writes to meet the
criteria arriving from above, and a set too coarse to hold them passes through.

Feature delivery spans `{PRD}`, `{spec}`, and `{code, test}`. A pagination fix lands in the
code. The spec's controller answers that the spec lacks the round-up rule, and the PRD's
controller answers that the PRD is too coarse to hold it. The replay starts at `{spec}`.

An earlier rule started every replay at the declared start, so that no node had to be
predicted. That reasoning was about predicting reach across the whole system. Finding the
highest affected set within one workflow is a local question, and the controller of each set
answers it for its own set, which is the same judgement a pass-through visit made.

**Status: Thesis.**

## Leash

A workflow's leash says which writes an agent may make without asking a person. The roles
set the defaults.

- **Owned writes proceed when the criteria pass**, provided they do not contradict the set's
  standing specification. The criteria were frozen before the replay, and they are the
  check.
- **A write that contradicts the set's standing specification needs approval.** Criteria
  derived from an intent always pass that intent, so passing them cannot be what lets a
  change of direction through. The set's controller compares the write with the
  [standing specification](/cyber-truss/model/specification/#criteria-are-authored-through-use-cases),
  its use cases, graph, and criteria as they stood before the run, and says whether the write
  removes or reverses any of them. A write that only adds proceeds. This covers a
  [replacement](/cyber-truss/model/join/#replacing-a-criterion-is-not-a-join), and it is
  checked at every write to the set, whichever workflow contributed, so a downstream writer
  that asked nothing is checked too.
- **Output writes need approval.** An emission cannot be revised, so a mistake there is
  permanent.
- **The comparison sets a floor.** A builder outcome, a match or a filled hole, may proceed.
  An architect outcome, *change course*, and an oracle outcome, *stop*, go to a person
  whatever the role. See
  [Reading the comparison](/cyber-truss/model/canonical-execution/#reading-the-comparison).
- **Confidence only tightens.** An agent unsure of a write asks, even where the leash lets it
  proceed. An agent sure of a write never passes a leash that requires approval.
  Self-reported confidence is the signal easiest to get wrong, so it never grants autonomy.
- **An approver can pre-approve.** At the start of a run, or at any stop, an approver may
  widen the leash for the rest of the run, up to approving every workflow gate in it. Writes
  the pre-approval covers then proceed without a stop, provided their criteria pass. This is
  how one decision covers the writes that carry it out: the approver who accepts a reversed
  rule at the spec can pre-approve the docs and mockups that follow it, instead of being asked
  again at each set. A pre-approval never passes a failed criterion, and it does not override
  confidence, so an agent unsure of a write still asks. SDD sets the same thing at run start
  as its run-level leash, from none to all gates.

Approval comes from an **approver**, a person allowed to approve for the system. Any approver
may approve a stop in any workflow. Which people may approve which workflow is permission
management, and it is left out of the first version: for now an approver can approve, and
pre-approve, every workflow gate. Approvers are not declared per set, and
nothing picks one person per artifact-set. For a solo developer or a solo author the approver
is also the person who made the change, and that is accepted.

A team may also loosen a default per set for every run, for example letting an agent emit to
a staging channel. Pre-approval is the narrower tool: it widens the leash for one run, so a
set whose stop is sometimes the only check keeps it by default. An approval is a decision, and it is recorded like one, so
[rule 4](/cyber-truss/model/canonical-execution/#cycles-must-come-to-rest) applies to it.

**Status: Thesis** on the defaults, and the contradiction default is expensive to change: it
is the line between autonomy and ceremony for every set. **Settled** that confidence only
tightens. **Deferred:** a different approver per workflow. The leash sees only what the declared connections
bring to a set; a missing connection is found
[outside the run](/cyber-truss/model/connections/#a-missing-connection-is-found-outside-the-run).

## Workflow and controller

A workflow works between sets. It decides what the change is for and which sets must move,
and hands each set's controller the intent. The controller turns the intent into criteria
for its set. The set's
[controller](/cyber-truss/model/controller/) works within the set, and decides whether
the set holds those criteria and how it comes to meet them.

**Status: Thesis.** The handoff is on the Controller page.
