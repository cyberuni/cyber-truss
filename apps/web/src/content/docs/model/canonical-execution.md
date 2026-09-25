---
title: Canonical execution
description: How confluence is bought. Each workflow a change touches distills its intent, asks the controllers above for criteria, replays from the highest affected set, and reconciles at the source
---

:::caution[Design, not implementation]
Nothing described here is built, and this page is the least settled part of the model.
See [the model overview](/cyber-truss/model/).
:::

## Free entry, canonical execution

At **authoring** time no artifact-set is privileged. Touch the prototype, the spec, the
implementation, or the docs, whichever the work actually starts from.

At **execution** time the execution is canonical. Every entry point is normalized onto the
same set of workflows, run from the same intent.

Both statements are true, and holding them together is what makes the freedom safe rather
than merely fast.

## The loop

A change arriving in the middle of a workflow is not applied outward from where it
landed. The set it landed in is the **source**. Each workflow that spans the source works
out what the change is for, finds the highest set that must move, and replays from there
back to the source, where the change is reconciled.

1. **Lift** the raw diff from lines into artifact-set vocabulary.
2. **Look up the workflows**: every workflow that declares a role for the source. A
   lookup. See
   [Every workflow over the set picks the change up](/cyber-truss/model/workflow/#every-workflow-over-the-set-picks-the-change-up).
3. **Distill, per workflow.** Each of them reads the change
   [within its own span](#distillation-reads-within-one-workflow) and states its **intent**:
   what the change is for, separated from the particular expression of it.
4. **Ask the controllers above.** A workflow that owns or outputs the source hands the intent
   to the [controller](/cyber-truss/model/controller/) of each set above the source in its
   shape. Each controller derives the **criteria** the intent implies for its set, and
   answers whether the set holds them.
5. **Replay from the highest affected set.** Each controller on the way down writes to meet
   the criteria arriving from above.
6. **Reconcile at the source.** The source's controller joins the change that landed with
   the criteria arriving from above, and reports what it kept, changed, and added.
7. **Continue and propagate.** The workflow carries on below the source. Every write is a
   change of its own, and the workflows spanning that set pick it up under the run's intent.

The criteria are an *independent derivation*. No controller above the source sees how the
change was expressed, so the bar the change is reconciled against was not written from it.

**Status: Thesis.** Flagged by its author as needing further design and analysis. The
loop's shape is agreed; several of its parts are not.

## The loop starts only from a change

Nothing enters the loop except a change to an artifact-set. Work that must happen with
nobody changing anything is stated as a criterion, and a controller makes the change that
tests it.

A criterion can depend on time. *Market data must not be older than two days* becomes
false as the days pass, with no artifact touched. The cron job that refreshes the data is
a [controller](/cyber-truss/model/controller/), and its run is a change like
any other. If the job fails, the criterion still goes false, and the strain says so. The
[compliance audit](/cyber-truss/model/workflows/#compliance-audit-soc-2-iso-27001) in the
catalog has the same shape: *controls verified within the last twelve months*, and a
scheduled controller whose run is the change.

Whether a source is inside the system is a choice about the boundary, not a property of the
source. A vendor feed is outside until a `{market data}` set is declared, and after that its
changes start runs. A change like that can carry an intent as thin as *the data is
current*. What happens downstream is driven by the criteria the specifications already
state, which take part in the [join](/cyber-truss/model/join/#within-a-run) wherever the
intent does not replace them.

Two requirements follow.

- **Checking a criterion over time must be a lookup.** Every tick reaches every such
  criterion. Judgement at that rate keeps agents running when nothing has changed.
- **Retries across runs need their own bound.** The rules in
  [Cycles must come to rest](#cycles-must-come-to-rest) bound one run. A refresh that fails
  on every tick starts a new run on every tick, and none of those runs repeats a resolution
  within itself.

**Status: Settled** that the loop starts only from a change, and that anything else is
stated as a criterion a controller tests. **Open:** the bound on retries across runs. See
[Open questions](/cyber-truss/model/open-questions/#what-bounds-retries-across-runs).

## Criteria are derived before the replay, not after

Step 4 is ordered deliberately, and the order is the whole of its value.

A [specification](/cyber-truss/model/specification/) is intent plus criteria, and the
reconciliation in step 6 is a check against criteria. If those criteria were read off the
change, reconciliation would check the change against itself and always pass. If they were
read off the replay's output, it would check the workflow against itself and could only
ever conclude *"the incoming change is wrong."*

The criteria come from the controllers above the source, derived from the intent before
anything is written, and those controllers never see the change's expression. So the
criteria are authored by neither the change nor the reconciliation. A change that is
conforming but wrong fails criteria it did not write. This is the same move SDD makes by
freezing the `.feature` suite before the implementation exists, generalized from one gate
to every crossing.

Criteria reach a set from every workflow that writes it, and they meet in a
[join](/cyber-truss/model/join/) at that set's controller. Two workflows that read one
change differently bring criteria that do not join, and the conflict surfaces there.

Deriving criteria from the intent has a limit of its own. Criteria derived from an intent
always pass that intent, so they cannot be what accepts it. A change of direction is
accepted at the [leash](/cyber-truss/model/workflow/#leash): a write that contradicts the
set's standing specification, the use cases and criteria it held before the run, needs
approval unless the team has loosened that set's leash.

It does not close the question below: criteria derived from a misread intent are wrong in
the same direction as everything downstream of them. It replaces *hope that the comparison
is honest* with a mechanism that can be inspected.

**Status: Thesis.** The ordering is agreed; what "derive the criteria" consumes beyond the
intent is not.

## Reconciling at the source

The source's controller receives the change that landed, the criteria arriving from above
joined with the criteria its set already stands under, and the set's state. It keeps what
meets the criteria, changes what does not, and adds what the criteria require and the
change never considered. It reports all three.

An earlier design replayed the source from scratch without reading the change, and compared
afterwards. Reconciling keeps what that protected: the criteria were derived without the
change, so the check is not the change agreeing with itself. It gives up a second,
independent expression at the source, which could show a better shape than the one the
change chose. It gains that an ad-hoc change survives wherever it meets the criteria, which
is the evidence [the failure mode](#the-failure-mode-to-design-against) says must not be
normalized away.

A workflow that reads the source as an input does not reconcile it. For that workflow the
change is an input change, and it runs from the source downward.

When the source is an output, nothing in it can be changed. The arriving emission is kept
as it stands, and whatever the criteria require is a superseding emission added after it,
such as a new order that offsets a trade. Until that emission exists, the strain is held as
[obligation](/cyber-truss/model/connections/#obligation), and the emission needs approval
like any output write.

**Status: Thesis.** It is the handoff every source controller encodes, so it is expensive to
change later.

## The inversion

Step 6 changes what the incoming change *is*.

The designer's mockup is not the deliverable. It is a **prediction of the settled state**,
and the criteria derived above it are the independent check. Reconciliation is where the
prediction earns its place or is replaced. What survives is kept as it was written, so an
ad-hoc change that meets the criteria is not normalized away.

This is what makes ad-hoc entry safe. Ad-hoc output is never trusted: it is evidence.
And it explains why the three approaches currently differ in quality: today, whichever
artifact you touched first is simply *believed*.

## Reading the comparison

The comparison is the source controller's reconciliation report: what it kept of the
change, what it changed, and what it added. The report is classified through the three
backward lenses SDD already uses:

| Outcome | Lens | Question |
| --- | --- | --- |
| Stop the effort | **oracle** | Should this exist at all? |
| Change course or scale | **architect** | Is the shape right? |
| Match, holes, improvements | **builder** | Does it conform to the contract? |

The mechanism is not new either. SDD's implementation judge already re-derives each
scenario's oracle independently rather than reading the producer's. This model
generalizes independent derivation of the bar from *judging an implementation* to
*normalizing any change*. Same mechanism, wider scope. That is the concrete content of the
claim that this is SDD's next revision rather than a new system wearing its vocabulary.

**Status: Settled** that the lens set is the right vocabulary for the comparison.

## Distillation carries the weight

Confluence by canonicalization does not eliminate the confluence requirement. It
concentrates it here.

Two different mid-workflow changes expressing the same intent **must distill to the same
intent** in every workflow that reads them. If distillation is lossy or unstable,
path-independence dies at this step instead of in the connections.

That concentration is the point. A few hard places that can be evaluated beat many places
that cannot, and the evaluation writes itself: feed one workflow several different
expressions of one intent (a mockup, a prose description, a failing test) and check that
the intents it states match. On current reading this is the single highest-value thing to
evaluate in the whole system.

### Distillation reads within one workflow

A diff alone cannot say what a change is for. Whether the rule it introduces is already
stated, stated differently, or stated nowhere depends on the sets around it.

Each workflow reads the change within its own span and shape, and answers one question:
what is the change for. It does not judge whether the change is right. A workflow whose
input is authoritative would otherwise read every change to the set it writes as a
mistake, and two workflows holding opposite roles on one edge would always disagree.
Whether the change is right is settled at
[reconciliation](#reconciling-at-the-source) and by the
[leash](/cyber-truss/model/workflow/#leash).

A workflow that finds nothing the change is for within its span **abstains**. In the
[component library](/cyber-truss/examples/component-library-bug-fix/), design
implementation reads a change to how the page count is computed and finds nothing visual
in it. Abstaining is not disagreement.

This replaced an earlier design in which one distiller walked back along every workflow
that owns the source. The walk judged each workflow's sets from outside its context, and
two defects followed. A set too coarse to hold a criterion ended the walk as though it held
it, and a set below the change inside the same workflow was never checked.

What distillation reads is bounded in time. It reads the sets as they stood when the change
was made. Reading later state lets hindsight into the intent, which the
[trading example](/cyber-truss/examples/stock-trade-without-thesis/) shows backfilling a
thesis the trader never held.

**Status: Thesis.** **Open:** whether a controller far from the source abstracts the root intent well, what form the time bound takes, whether it also binds what the
controllers above read when they derive criteria, and how a wrong abstention is noticed,
since no other workflow's reading covers the abstaining workflow's vocabulary.

### Controllers answer for their own sets

A workflow that owns or outputs the source asks the controllers of the sets above it in its
shape, nearest first. Each controller derives the criteria the intent implies for its own
set and gives one of three answers.

- **Holds.** The set already states them. Nothing further up needs asking.
- **Affected.** The set lacks a criterion or contradicts one. The workflow keeps asking,
  and replays from the highest affected set.
- **Too coarse.** The set has no place for the criteria. A PRD states what a feature must
  do and has no place for a page-count rule. The question passes to the next set up, and
  on the way down the replay passes through. When nothing is above, no set above the source
  is affected, and the criteria have no home but the source, whose controller derives them
  at reconciliation. See [Expression stays with the source](#expression-stays-with-the-source).

The level judgement belongs to the controller because the controller knows its set. A
distiller outside the set has to guess whether a PRD can hold a page-count rule, and a
guess that it holds ends the search too early.

An affected set the workflow cannot write, one of its inputs, is routed to **every**
workflow that owns or outputs it. The routed job carries the root intent unchanged, the one
distilled from the change, and references to the affected set's criteria as context, labelled with where
they came from. Each owner reads both within its own span, and contributes or abstains. It
does not rewrite the intent. A routed job always asks the controllers above; only a change
carries expression a workflow could read directly. An affected set that no declared workflow writes is raised
as an [obligation](/cyber-truss/model/connections/#obligation).

Nothing chooses one owner. A choice made for everyone could skip the owner whose span holds
the evidence that matters, and each owner's own reading is where that evidence is.

**Only a change is distilled.** An intent is never distilled into a new intent, because each
re-derivation is a translation of a translation, and meaning lost at one hop cannot be
recovered at the next. Every controller derives its set's criteria directly from the root
intent, so loss is bounded to one translation per set and each set's criteria can be checked
against a single reference.

The cost is that a controller far above the source receives an intent written at the
source's level of detail, a named character or a prop name, and has to abstract it itself.
In practice the distance is short. Workflows are short chains, and an agent doing a
controller's work can read the source's intent without trouble. Whether that holds for a
long chain is untested, and the examples do not carry enough detail to say.

Asking stops at the first set that holds, so a local fix asks few questions. A refactor's
intent says behaviour is unchanged, the spec already holds that, and nothing replays.

**Status: Thesis.**

### Expression stays with the source

The controllers above the source receive the intent and never the change itself. Only a
workflow that reads the source as an input sees how the change was expressed.

Without this rule a change can write the criteria it is checked against. Suppose a
developer replaces a component's `totalPages` prop, and the docs' controller above the
code receives the new props. It documents them, and the code is then reconciled against
docs that already agree with it.

The rule also fixes direction between sets. A set that describes another at the same level
reads its expression: an API reference states the exact props, so it reads the code as an
input. A set above another is reached through intent, because a spec should not copy an
implementation. See
[Direction lives in the workflow](/cyber-truss/model/workflow/#direction-lives-in-the-workflow).

The rule has a limit. When every set above the source is too coarse to hold a criterion, the
criterion has no home above the source, and only the source's controller can derive it from
the intent. That controller has seen the change, so those criteria are not independent of
it. The [fiction example](/cyber-truss/examples/fiction-plot-twist/) meets this with no
outline: a setup beat can live only in the manuscript. The reconciliation report names such
criteria, so a person reading it can tell which parts of the bar the change could have
shaped.

**Status: Thesis**, and expensive to change. **Open:** it depends on
[how levels are identified](/cyber-truss/model/specification/#specifications-exist-at-every-level)
across artifact types, and criteria with no home above the source are checked less
independently than the rest.

### Distillation stops at intent

Distillation produces intent and nothing more. The criteria for each set come from that
set's controller. Three reasons fix the boundary here.

- **It keeps distillation testable.** A workflow's intent can be evaluated without any
  controller: the same change, expressed several ways, must yield the same intent.
- **Ownership follows knowledge.** A workflow knows its span and shape, and a controller
  knows its set. A workflow that also derived criteria would need every set's level and
  vocabulary.
- **Criteria stay neutral.** The controllers above the source never see the change, and the
  source's controller reconciles against criteria it did not derive.

The cost is that stability has to hold in two kinds of place: each workflow's distillation,
and each controller's derivation of criteria from an intent. Each is narrower than one
distiller for the whole system, and each can be evaluated in isolation. That is still
unlike per-relation confluence, where the places cannot be.

Distillation is also **irreducibly agentic**. It cannot be a script, which is what finally
settles the plugin question: the core operation of the model needs judgement and context,
not a shell command.

**Status: Settled** that distillation is load-bearing and agentic. **Thesis** that each
workflow distills within its own span and each controller derives its own set's criteria.
**Open:** whether both can be made stable enough to carry the guarantee, which is the
thesis's main risk.

## Order is not controlled

The order in which selected workflows run cannot be fixed in advance. A workflow with a
human in the loop takes as long as the human takes, and a design review can return more
than its Request asked for, up to a new design. cyber-truss exists because work arrives
this way, so the model takes the order it is given.

Workflows that finish in some order either reconcile or disagree. When they reconcile, no
further work is needed. When they disagree, the disagreement is a strained connection, and
it selects further workflows in another cycle. Disagreement costs cycles. It is not an
error.

Order may change the path: which workflows run, and how many cycles pass. It may also change
where the run settles. A settled state is any state in which every connection holds, and
criteria rarely fix only one. Two orders can reach different settled states that meet the
same criteria, and neither is wrong. That is why
[confluence](/cyber-truss/model/confluence/#the-claim) is claimed over criteria rather
than over one state. The Transformation Priority Premise in test-driven development makes
the same observation: the order of transformations can change which algorithm you end up
with.

What order must not do is choose between settled states silently. When workflows disagree
and a decision takes one side, the decision is recorded. Without the record, whichever
workflow finished last decides, and that is the old habit of believing whichever artifact
was touched first, decided by timing instead.

**Status: Settled** that order is not controlled, that disagreement runs further cycles,
and that a run may settle in any state that meets its criteria provided choices between
states are recorded. **Open:** whether work a human adds during a replay, beyond what the
criteria asked for, carries the original intent or is distilled as a new one.

### The run ledger schedules, it does not decide

A run has pending work: a workflow triggered by a change or by a routed job, the set its
replay starts from, a controller's reconciliation at a source. Some of it waits, because its
input has a pending writer. Held as a graph, the jobs whose inputs have no pending writer
are the ready frontier. SDD's mission graph has the same shape.

The ledger chooses from the frontier to reduce rework, and it **collects**. Every intent
addressed to one set, with the context each sender attached, is gathered and handed to that set's controller together, so the
controller joins them once instead of writing once per arrival. A write is ready when no
pending job can still contribute to the set. In the
[fiction example](/cyber-truss/examples/fiction-plot-twist/) three workflows own the
outline, and the outline's controller writes once, after all three have contributed or
abstained, and drafting runs once after that.

Collecting is not merging. The ledger never combines contributions into one, because combining is
a judgement, and a ledger that judged would decide outcomes. The join is the controller's.
Each collected contribution keeps its **provenance**: which workflow sent it, which change it was
distilled from, and whether the workflow read the source's expression. A workflow
that reads the source directly carries that expression into the sets it writes, and the
reconciliation report must be able to name the criteria it shaped.

Three rules keep the ledger honest.

- **The source is settled by definition.** A job that reads the source does not wait on
  the reconciliation at it. Without this, a workflow that reads the source and a workflow
  that reconciles it after reading the first one's output wait on each other. The
  reconciliation's output reaches the reader as a change of its own, under the run's intent.
- **The ledger never makes a run correct.** Confluence is claimed over criteria whatever
  the order, so the ledger can only change what a run costs. If a run reaches the right
  state only because the ledger picked a good order, the claim is false.
- **The ledger collects and never merges.** It stays a lookup, at the deterministic end of
  the [controller spectrum](/cyber-truss/model/controller/).

A job runs against the criteria version current when it starts. A job that waited picks up
any version created while it waited.

Whether a job waits for an upstream set to settle is not a rule of the ledger. It is
[strain policy](/cyber-truss/model/workflow/#what-a-workflow-declares): owned writes
proceed by default, because a superseded write costs a cycle, and output writes wait,
because an emission cannot be revised. An upstream that needs a person can take days.

**Status: Thesis.** The same append-only record holds the
[termination rules](#cycles-must-come-to-rest), so the ledger is the answer proposed for
[What vehicle holds pending Requests?](/cyber-truss/model/open-questions/#what-vehicle-holds-pending-requests)

## Cycles must come to rest

Nothing so far makes a run stop. Two workflows can amend each other's side on every cycle,
each state locally reasonable, and never settle. Every cycle costs tokens, so this is the
most expensive way the loop can fail.

Deciding whether an arbitrary loop of rewrites comes to rest is undecidable, so the model
does not try to detect it. It constrains the loop so that it terminates by construction. A
turn limit is the weak form of that constraint. It caps the cost but cannot tell progress
from circling, and when it is written in a prompt an agent can ignore it. SDD's three-turn
limit has both weaknesses.

Four rules make the constraint.

1. **Criteria are versioned and frozen for a run.** The criteria derived in step 4 are
   version 1. During a run only two events create a new version: a person adds criteria,
   or a disagreement is settled by a recorded decision. An agent cannot create a version
   by adding criteria. This is SDD's frozen `.feature` suite, extended from one gate to a
   whole run.
2. **Each resolution is recorded** as a connection paired with the criteria version it was
   brought into agreement with.
3. **A cycle may only resolve pairs not already recorded.** A connection resolved under
   version *v* and strained again under *v* means one workflow undid another's work. That
   is oscillation, and the run stops.
4. **A stop needs a decision to continue.** The decision settles the conflict and creates
   the next version. An agent may decide a given conflict once. Reversing a decision needs
   a person.

At one version there are finitely many connections to resolve. Versions grow only through
decisions and people, and each conflict takes at most one agent decision. So a run with no
person in it is bounded. A run with people in it continues as long as they keep adding
criteria, which is iteration somebody chose.

The check in rule 3 is a lookup, which puts it at the deterministic end of the
[controller spectrum](/cyber-truss/model/controller/). `truss` can refuse to
record a cycle that resolves nothing new, so the bound does not depend on an agent
following an instruction.

### A reversal renamed as a new criterion

Rule 1 depends on a judgement: whether a proposed criterion is new, or a reversal of a
decision under a new name. An agent could route a reversal through that door.

The [controller](/cyber-truss/model/controller/) of the specification set
is placed to catch it. Its job is to hold the set's intent and criteria consistent and
balanced, and a criterion that contradicts a recorded decision is an inconsistency inside
the set. It is not the workflow proposing the criterion, so it is not judging its own work.
It can only see a contradiction with decisions it can read, so a decision lands in the
specification set it affects, not in the ledger alone.

This narrows the weakness without closing it. A contradiction is caught. A criterion that
erodes a decision without contradicting it, such as an exception broad enough to hollow it
out, is caught only if the controller judges balance as well as consistency.

### Append-only history, not append-only criteria

The record the rules read is append-only. Each version, resolution, and decision is added
and never edited, the way an ADR is superseded rather than rewritten. The criteria
themselves are not append-only. Between runs a specification changes freely, and criteria
are rewritten and removed. Holding criteria to append-only would be too restrictive. They
are frozen within a run, free between runs, and the history of how each version replaced
the last is what cannot change.

**Status: Thesis.** The rules bound a run with no person in it. **Open:** whether the
specification controller catches erosion as well as contradiction, and what holds the
record. See
[What vehicle holds pending Requests?](/cyber-truss/model/open-questions/#what-vehicle-holds-pending-requests)

## Replay output must not re-trigger replay

Canonical execution produces deltas that land in the repository. Without provenance,
those deltas are themselves lifted as new changes, each starting a new run, and the loop
does not terminate.

Deltas therefore need a marker for *produced by canonical execution*. A small mechanism,
easy to miss until it bites.

The marker does not stop propagation, and must not. Replay output that strains a
connection further out is how [selection](/cyber-truss/model/workflow/#how-workflows-are-selected) discovers reach. The
distinction is what the output carries: it never starts a new run, and it is never
distilled into a new intent. A workflow that spans the written set picks it up under the
root intent, which the run's record holds. Distilling it again would start the translation
loss that [routing the root intent](#controllers-answer-for-their-own-sets) avoids.

The marker names the run that produced the output. Rules 2 and 3 pair resolutions with
that run's criteria version, and the ledger places the new job in that run.

**Status: Settled** that provenance is required, and that marked output propagates under
the root intent rather than as a new one. **Thesis** that the marker names its run and the
run records each workflow's intent with the change it was distilled from. **Open:** the marker's form.

## The failure mode to design against

Canonicalization guarantees confluence *of the executed path*. It says nothing about
whether that path is correct.

If the defined workflow is wrong, every entry point now converges reliably on the same
wrong place, and the ad-hoc changes that used to reveal the problem are being normalized
away before they can.

The reconciliation report is the only protection, and it works only if disagreement is treated
as evidence about **the workflow** as often as about the change. A comparison that can
only conclude *"this change is wrong"* will launder a defective workflow indefinitely.

Deriving criteria [ahead of the replay](#criteria-are-derived-before-the-replay-not-after)
is the mechanism proposed against this. It is not yet a full answer, because it moves the
exposure up to the intent each workflow distills rather than removing it.

**Status: Settled** as a requirement on the comparison. **Open:** whether independently
derived criteria are enough to enforce it.
