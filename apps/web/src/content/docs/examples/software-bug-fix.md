---
title: Bug fixed directly in code
description: A developer fixes a pagination bug in the code alone. Does the fix reach the spec, the docs and the mockups?
sidebar:
  order: 1
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

This is the second story on [What is cyber-truss](/cyber-truss/what-is-cyber-truss/): a
problem found in the code and fixed there, with everything around it left behind.

## The system

A web application with a paginated list.

| Artifact-set | Holds |
| --- | --- |
| `{PRD}` | The product requirements for the list feature |
| `{spec}` | The feature specification: intent and criteria for pagination |
| `{code, test}` | The pagination implementation and its tests, one unit of change |
| `{user docs}` | The help page describing how the list pages |
| `{mockups}` | The design mockups, including the page indicator |

Connections:

- `{PRD}` to `{spec}`
- `{spec}` to `{code, test}`
- `{spec}` to `{user docs}`
- `{spec}` to `{mockups}`

## Workflows

| Workflow | Span | Shape |
| --- | --- | --- |
| Feature delivery | `{PRD}`, `{spec}`, `{code, test}` | chain |
| Docs update | `{spec}`, `{user docs}` | one link |
| Design update | `{spec}`, `{mockups}` | one link |

## The change

When the item count is an exact multiple of the page size, the list shows an extra empty
last page. A developer notices, changes the page-count calculation to round up, and
commits. The diff touches the code only.

## Variant A: the spec states the wrong rule

The spec's criteria say the page count is the item count divided by the page size, rounded
down, plus one. That rule is the bug.

### Expected run

1. **Lift.** The change touches `{code, test}`.
2. **Distill.** Intent: *every page shows at least one item, and the last page shows
   whatever remains.*
3. **Criteria.** Derived from the intent: the page count is the item count divided by the
   page size, rounded up. An exact multiple produces no empty page. An empty list shows one
   page with an empty state, not zero pages.
4. **Strain.** The code no longer satisfies the spec's stated rule, so the connection from
   `{spec}` to `{code, test}` is strained.
5. **Select.** Feature delivery spans that connection. The other two workflows do not.
6. **Replay.** Feature delivery translates the intent into a Request at its starting point,
   amends the spec's criteria, and derives code and tests.
7. **Compare.** The developer's fix matches on exact multiples. It does not handle the
   empty list, which the criteria name and the fix never considered. The comparison
   reports an improvement to the change.
8. **Propagate.** The amended spec now disagrees with `{user docs}`, which states the old
   page count, and with `{mockups}`, whose page indicator shows the empty last page. Both
   connections are strained. Docs update and design update are selected and replay under
   the original intent.

### Settled state

- `{PRD}` is unchanged. It never stated a page-count rule.
- `{spec}` states the round-up rule and the empty-list case.
- `{code, test}` implements both, with tests for an exact multiple and an empty list.
- `{user docs}` and `{mockups}` match the spec.

### Status: Unresolved

The run reaches the right state, but step 6 depends on a question the model has not
answered. Feature delivery starts at `{PRD}`, and the PRD has nothing to amend. Whether
replay starts at the workflow's declared start, or at the highest node the intent
actually changes, depends on what a workflow's shape is allowed to be.

## Variant B: the spec says nothing about the boundary

The spec's criteria never mention how the page count is calculated.

### Expected run

1. **Lift.** The change touches `{code, test}`.
2. **Distill.** The same intent as variant A.
3. **Strain.** None. The code satisfied the spec before the fix and still satisfies it
   after, because the spec states no rule it could break. No connection is strained.
4. **Select.** Nothing, because selection starts from strain.

Nothing propagates. The spec never learns the rule, the empty-list case is never found,
and the docs and mockups keep showing the empty page.

### Status: Gap

This is the case the what-is page promises to handle, and the model as written does not.
The intent is real but no specification holds it, and none of the
[three kinds of strain](/cyber-truss/model/connections/#three-kinds-of-strain) describes
an intent with no home. The model needs a way for that to count as strain, whether as a
fourth kind or as a condition distillation reports.

## What it tests

- [Selection](/cyber-truss/model/canonical-execution/#how-workflows-are-selected) starting
  from strain. Variant B shows that strain-only selection misses changes whose intent no
  specification states.
- [Distillation stops at intent](/cyber-truss/model/canonical-execution/#distillation-stops-at-intent).
  Both variants distill the same intent. Only the strain differs.
- [Criteria derived before the replay](/cyber-truss/model/canonical-execution/#criteria-are-derived-before-the-replay-not-after).
  The empty-list case comes from the criteria, not from the fix.
- The [strain kinds](/cyber-truss/model/connections/#three-kinds-of-strain) in the
  direction they were not written for. In variant A the implementation moved ahead of its
  specification. The kinds are defined from the specification's side, and it is not clear
  which kind this strain is.
- Obligations and tickets. The what-is story mentions a ticket that was never opened. In
  the [workflow catalog](/cyber-truss/model/workflows/) a follow-up ticket is how a team
  records an obligation, not an artifact-set, so this example leaves it out.
