---
title: Examples
description: Concrete systems with one change landing in each, run through the model. Documentation, and the test cases the design is checked against.
sidebar:
  label: Overview
  order: 0
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

Each example takes a concrete system, lands one change in it, and states what the model
says should happen next.

The examples serve two purposes. For a reader, they show the model working on something
recognisable. For the design, they are test cases. An example the model cannot carry to a
settled state is a finding, and it is recorded as one rather than smoothed over.

## How this differs from the workflow catalog

The [workflow catalog](/cyber-truss/model/workflows/) collects formal workflows, one row
per process, to test whether the definition of a workflow reaches distant fields. An
example sits one level down: a specific system, a specific change, and the run that
follows. Examples use a catalogued workflow where one fits and declare their own where
none does.

## What an example contains

Every example uses the same sections, so that examples can be compared and checked.

- **The system.** The field, the artifact-sets, and the connections between them.
- **Workflows.** Each declared workflow, with its span and shape.
- **The change.** Where it lands and what it does.
- **Expected run.** The intent each workflow distills, what the controllers above the
  source answer, the replay, the reconciliation, and what propagates.
- **Settled state.** What each artifact-set looks like afterwards.
- **What it tests.** The model claims the example exercises, linked to where each is
  defined.
- **Status.** One of the values below, with the reason.

| Status | Meaning |
| --- | --- |
| **Holds** | The model carries the change to a settled state with no gap. |
| **Gap** | The model cannot produce the expected run. The example names what is missing. |
| **Unresolved** | The run depends on an open question. The example links it. |

An example can have variants, and each variant gets its own status.

## The examples

| Example | Field | Status |
| --- | --- | --- |
| [Bug fixed directly in code](/cyber-truss/examples/software-bug-fix/) | software | A: Gap. B: Holds |
| [Bug fixed in a component library](/cyber-truss/examples/component-library-bug-fix/) | software | A: Holds. B: Holds |
| [Twist written mid-draft](/cyber-truss/examples/fiction-plot-twist/) | fiction | A: Holds. B: Unresolved |
| [Trade placed before its thesis](/cyber-truss/examples/stock-trade-without-thesis/) | trading | A: Holds. B: Unresolved. C: Holds |
| [Ad rewritten mid-campaign](/cyber-truss/examples/marketing-campaign-headline/) | marketing | A: Holds. B: Unresolved |

## Adding an example

Write the expected run from what the system's people would want, before checking it
against the model pages. An example written from the model only restates it.

Prefer cases you expect the model to struggle with. A confirming example is cheap to
write and teaches little.
