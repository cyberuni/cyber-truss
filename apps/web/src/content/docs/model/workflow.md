---
title: Workflow
description: What a workflow declares, why direction lives in the workflow rather than the connection, and how a change finds the workflows it needs
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

## What a workflow declares

A workflow is a named policy over the lattice. It declares five things.

| Parameter | What it fixes |
| --- | --- |
| Span | The artifact-sets the workflow covers |
| Inputs and outputs | For each set in the span, whether the workflow reads it or writes it |
| Shape | The connections between those sets that the workflow traverses |
| Discharge | Where strain on a crossing must be resolved |
| Strain policy | How much strain of each kind may be carried across each crossing |

Span, shape, discharge, and strain policy came out of expressing staged processes, and the
[workflow catalog](/cyber-truss/model/workflows/) tests them against eight fields. Inputs
and outputs came from the examples, where a workflow without them could rewrite the
evidence it is judged against.

A workflow adds no mechanism of its own. It is a parameterisation of
[artifact-sets](/cyber-truss/model/artifact-sets/),
[connections](/cyber-truss/model/connections/), discharge, and
[strain](/cyber-truss/model/connections/#kinds-of-strain).

**Status: Settled** that a workflow declares these five. **Thesis**, argued on the catalog
page, that nothing further is needed.

## Direction lives in the workflow

A connection is undirected. A workflow is not. Its inputs and outputs fix which end of each
connection it reads and which end it writes.

**A workflow never writes its inputs.** A thesis review that reads `{market data}` and
writes `{theses}` restores a strained connection by revising the thesis. It cannot restore
it by rewriting the data to fit the thesis.

Inputs are not the starting point. Feature delivery starts at `{PRD}` and may write it. A
workflow can have no inputs at all, and then every set it spans is one it may write.

This settles which end of a connection is the specification, per workflow. The
[per-edge roles](/cyber-truss/model/specification/#specifies-is-a-relation-not-a-layer)
allow either reading on an edge such as `{API docs}` to `{code, test}`, and the choice
decides the settled state. A workflow that reads the API docs and writes the code treats
the published API as a contract. A workflow that reads the code and writes the docs
documents whatever shipped. Both are legitimate. A team declares the one it means.

So direction has two sources, and the connection is neither: where the change landed, and
the workflow that restores the relation.

**Status: Settled.**

## A change identifies the workflows it bypassed

A change that lands in a set some workflow outputs has skipped that workflow's derivation.
Those workflows are the change's **origin candidates**. Finding them is a lookup over
declared outputs, not a judgement.

A set can be the output of several workflows. In the
[bug-fix example](/cyber-truss/examples/software-bug-fix/), `{code, test}` is written by
feature delivery from `{spec}` and by design implementation from `{mockups}`, so a change
to the code identifies both.

A workflow that reads the changed set is not an origin candidate. It sits on the far side
of the change, and it is reached only if propagation strains its span.

Identification tells [distillation](/cyber-truss/model/canonical-execution/#distillation-reads-backward)
where to read: back along each identified workflow, from its outputs to its inputs. A set
no workflow outputs, such as a PRD with nothing above it, identifies nothing, and the
change's intent is its own.

**Status: Thesis.**

## How workflows are selected

Selection yields every workflow that applies. There is no single global workflow with one
starting point, and a change rarely needs only one.

1. **Identify origin candidates.** The workflows whose outputs include a changed set. A
   lookup.
2. **Check strain.** Compare the criteria derived from the change with each candidate's
   inputs, and check each connection on the changed sets. Judgement, because evaluating
   criteria needs evaluation.
3. **Select origin workflows.** A candidate runs only if its inputs do not already hold the
   change's criteria, because a criterion is missing from them or contradicted by them.
4. **Select propagation workflows.** The workflows whose span covers a strained connection
   and whose outputs include the end that has to change. A lookup.
5. **Break ties.** Where several workflows remain for one strained connection, the intent
   decides between them. Judgement.

Candidates are cheap to find and costly to run, which is why step 3 filters them. A
refactor inside `{code, test, stories}` identifies the mission loop, because the loop
outputs the code. The refactor's criteria say behaviour is unchanged, the spec already
holds that, and the loop does not run. Routing every change through the longest path would
reintroduce exactly the ceremony the model removes.

Selection is not decided once, up front. A replay changes artifacts, those changes can
strain connections further out, and further workflows are selected. Reach is discovered
by propagation rather than predicted, because predicting reach is the step people fail at
today.

Plural selection moves the confluence question rather than removing it. Canonicalization
now needs two things: an intent must pick out one set of workflows, and the set's results
must settle in a state that meets the same criteria whatever order they run in. The second
is a composition obligation that a single workflow never carried. Criteria combine by
[join](/cyber-truss/model/join/), which cannot depend on order, and a conflict with no
usable join is settled by a recorded decision. How runs that disagree come to rest is in
[Cycles must come to rest](/cyber-truss/model/canonical-execution/#cycles-must-come-to-rest).

**Status: Settled** that selection is plural, starts from the workflows a change bypassed,
and is extended by propagation. **Open**, and load-bearing: whether the set is unique. See
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

## Workflow and controller

A [controller](/cyber-truss/model/artifact-sets/#controllers) holds one artifact-set
consistent. A workflow spans several sets and writes some of them. The two are different
axes: a set has one controller, and that controller serves every workflow that outputs the
set.

**Status: Thesis.**
