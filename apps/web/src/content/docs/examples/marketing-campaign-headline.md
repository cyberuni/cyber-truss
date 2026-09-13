---
title: Ad rewritten mid-campaign
description: A winning headline written in the ad platform. How far up the campaign should its result reach, and does it depend on where it landed?
sidebar:
  order: 5
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

A campaign is planned top-down: a brief, then messaging, then ads and landing pages. It
changes bottom-up, because the ads are where results arrive. This example takes a
headline that wins in market and asks how far up the campaign its result should reach.

## The system

A paid campaign for Tally, a budgeting app, aimed at people aged 25 to 34.

| Artifact-set | Holds |
| --- | --- |
| `{brief}` | Objective, audience, the single-minded proposition, budget, and target cost per sign-up |
| `{messaging}` | The messaging framework: headline themes, proof points, and the substantiation on file for each claim |
| `{ads}` | Ad copy and visuals for paid social and search, with their variants |
| `{landing page}` | The page the ads send traffic to |

Connections:

- `{brief}` to `{messaging}`
- `{messaging}` to `{ads}`
- `{messaging}` to `{landing page}`
- `{ads}` to `{landing page}`

The last connection is message match: a visitor who clicks on a promise expects to find it
at the top of the page. The framework does not say which headline a page must open on for a
given ad, so the match cannot be checked through `{messaging}`. On that edge `{ads}` is the
[specification](/cyber-truss/model/specification/#specifies-is-a-relation-not-a-layer) of
`{landing page}`. It is the same kind of sibling connection as the API docs in the
[component library example](/cyber-truss/examples/component-library-bug-fix/).

The brief's proposition is *Tally shows you where your money goes.* The framework allows
headlines about clarity and control. It lists savings as a proof point, *active users save
a median of $612 in their first year*, backed by a 2025 analysis of 40,000 accounts. The
figure may appear in body copy, with its basis stated.

## Workflows

| Workflow | Span | Shape |
| --- | --- | --- |
| Campaign planning | `{brief}`, `{messaging}` | one link |
| Creative production | `{messaging}`, `{ads}` | one link |
| Page build | `{messaging}`, `{landing page}` | one link |
| Message match | `{ads}`, `{landing page}` | one link |

## The change

Three weeks in, the team learns that the savings figure sells the app better than clarity
does. The finding reaches the campaign by one of two routes, one per variant.

## Variant A: the change lands in an ad

A performance marketer writes a new paid social headline in the ad platform, *Tally users
save $612 in their first year*, and launches it. Within a week it has three times the
click-through rate of the control headline and meets the target cost per sign-up. The diff
touches `{ads}`.

### Expected run

1. **Lift.** The change touches `{ads}`.
2. **Distill.** Intent: *lead paid social with the savings figure.* The results are why the
   marketer kept the headline. They are not what the headline is for.
3. **Criteria.**
   - Paid social headlines, and the page they send traffic to, may lead with the savings
     figure.
   - Every figure states its basis where it appears.
   - A visitor from a savings ad finds the figure above the fold.
4. **Strain.** `{messaging}` to `{ads}` is strained, because the framework keeps savings
   in body copy. `{ads}` to `{landing page}` is strained, because the page opens on
   clarity and never states the figure.
5. **Select.** Creative production and message match.
6. **Replay.** Creative production translates the intent into a Request at `{messaging}`.
   The framework now permits savings-led headlines in paid social and on the page it links
   to, and ad variants are derived from it. Message match translates the intent into a
   Request at `{ads}` and derives a landing page variant for paid social traffic that
   opens on the figure.
7. **Compare.** The arriving headline meets the first criterion and has a hole: it states
   the figure with no basis. The replayed ads state the basis, and they have never run. The
   brief's target cost per sign-up is a criterion over the outcome, but that outcome exists
   only after spend. The comparison can apply it to the arriving ad and cannot apply it to
   the replay. The team keeps the marketer's headline, the only version with evidence, and
   adds a basis line. Both versions meet the run's criteria, so the choice is recorded.
8. **Propagate.** The amended framework strains `{brief}` to `{messaging}`, and campaign
   planning is selected. At `{brief}` two criteria stand together: the brief's *one
   proposition in every channel*, and the run's *paid social may lead with savings*. The
   intent is about paid social and says nothing about the other channels, so it does not
   [replace](/cyber-truss/model/join/#replacing-a-criterion-is-not-a-join) the
   proposition. The two are a [conflict](/cyber-truss/model/join/#conflict). The brand
   lead decides that paid social may lead with savings until the campaign ends, as a test,
   and that the proposition holds everywhere else. The decision is recorded and creates the
   next version of the criteria.

### Settled state

- `{brief}` keeps its proposition, with a recorded exception for paid social.
- `{messaging}` permits savings-led headlines in paid social and on its landing page
  variant, with the basis stated.
- `{ads}` runs the marketer's headline with a basis line.
- `{landing page}` has a paid social variant that opens on the figure.

### Status: Holds

The run carries the result from one ad up to the brief, where positioning is decided, and
stops there for a person. That is the behaviour the team would want. An ad test informs the
positioning and does not rewrite it.

The comparison in step 7 is weaker than the model assumes. It decides on evidence the
replay cannot produce, because a criterion that needs spend to evaluate cannot be applied
to an ad that has not run.

## Variant B: the change lands on the landing page

Instead, a web editor who has seen the same analysis changes the landing page headline to
*Save $612 in your first year*, to lift conversion. The ads are unchanged. The diff touches
`{landing page}`.

### Expected run

1. **Lift.** The change touches `{landing page}`.
2. **Distill.** The page receives traffic from paid social, search, and email, so a change
   to it names no channel. Intent: *lead with the savings figure wherever visitors land.*
3. **Criteria.**
   - The landing page, and every ad that sends traffic to it, may lead with the savings
     figure.
   - Every figure states its basis where it appears.
   - Every ad makes a promise the page keeps.
4. **Strain.** `{messaging}` to `{landing page}` is strained, because the framework keeps
   savings in body copy. `{ads}` to `{landing page}` is strained, because every ad
   promises clarity and lands on savings.
5. **Select.** Page build and message match.
6. **Replay.** Page build translates the intent into a Request at `{messaging}`, which
   permits savings-led headlines on the page for all traffic. Message match translates it
   into a Request at `{ads}` and rewrites every ad set, search and social, to lead with
   savings.
7. **Compare.** The same hole as variant A: the editor's headline gives no basis.
8. **Propagate.** Campaign planning is selected, and the conflict at `{brief}` is wider.
   The run's criterion now covers every channel, which is the proposition itself. The
   brand lead either replaces the proposition with savings or refuses the change.

### Settled state

Either savings leads in every channel under a new proposition, or the change is refused.
Neither is variant A's state.

### Status: Unresolved

Variants A and B carry one finding, that savings sells better than clarity to this
audience, and they settle in states that meet different criteria.
[Confluence](/cyber-truss/model/confluence/#the-claim) is claimed over criteria, so this is
not a harmless difference between settled states. If the two changes carry one intent,
confluence is lost.

The cause is step 2. Each distillation kept the scope of the artifact the change landed in.
An ad belongs to one channel, and the landing page belongs to all of them. Both readings
are defensible, and together they let the entry point decide how far the change reaches.
Whether the two are one intent is the question
[Can distillation be made stable?](/cyber-truss/model/open-questions/#can-distillation-be-made-stable)
leaves open. This pair gives it a case where the instability comes from the structure of the
field, not from the distiller.

The decision in step 8 can hide the divergence. A brand lead facing variant B's wider
conflict can choose variant A's narrower exception, and then the two runs agree. They agree
because a person chose, and a run with no person in it would not.

## What it tests

- A sibling connection outside software. Message match relates two implementations of
  `{messaging}` that the framework does not reach, as the component library's API docs
  relate to its code.
- [Conflict](/cyber-truss/model/join/#conflict) against
  [replacement](/cyber-truss/model/join/#replacing-a-criterion-is-not-a-join). Variant A's
  intent narrows the proposition without replacing it, so the two criteria stand together
  and conflict.
- Criteria that can only be evaluated in the world. Target cost per sign-up is a criterion
  over the outcome, and the outcome needs spend. [The inversion](/cyber-truss/model/canonical-execution/#the-inversion)
  treats the arriving change as a prediction and the replay as the check. For this
  criterion the arriving change is the only evidence, and the replay cannot check it.
- Scope inherited from the entry artifact. Variant B distils a wider intent because the
  page it landed on serves more channels.
- Where a run stops for a person. Positioning is decided in the brief, and both variants
  reach the brief as a conflict rather than as a replay. The
  [recorded decision](/cyber-truss/model/canonical-execution/#cycles-must-come-to-rest) is
  where the strategy call is made.
- Legal review is left out. Most campaigns clear claims through a review gate. This example
  folds that review into the substantiation criterion rather than modelling it as a
  workflow.
