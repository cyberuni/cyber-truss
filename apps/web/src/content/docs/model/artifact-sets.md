---
title: Artifact-sets
description: The unit the model reasons about — two orthogonal axes, and the controllers that govern them
---

:::caution[Design, not implementation]
Nothing described here is built. See [the model overview](/cyber-truss/model/).
:::

## Artifact

An **artifact** is one type of thing in a repository. Not one file, and not one line —
a type.

TypeScript files. CSS. Website content. Repository configuration. A skill. `AGENTS.md`.

The choice of *type* rather than *instance* is load-bearing. This repository ships
`plugin.json`, `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`, and
`.codex-plugin/plugin.json` — four files, one artifact. A rule keyed to files has to be
written four times and rewritten when a fifth vendor appears. A rule keyed to the artifact
is written once.

Below this level the coupling is already owned: symbol and reference coupling is the
compiler's job, and reproducing it would produce a worse compiler.

**Status: Settled.**

## Two axes

Artifacts group into **artifact-sets**, and they do so along two axes that are
*orthogonal*. A group on one axis need not be a group on the other.

### Axis 1 — unit of change

Artifacts that must move together for a change to be complete.

`{code, test, stories}` is the canonical example: an implementation that changes code
without its tests is not a smaller change, it is an incomplete one. In this repository's
terms, a unit of change is what belongs in **one commit** to be coherent.

This axis is **delta-driven**. It is meaningless without a change, and it asks: *did this
land everywhere it had to?*

### Axis 2 — governance target

Artifacts that the same criteria apply to.

`{a skill, AGENTS.md}` is the canonical example: the same agent-instruction guidelines
govern both, though neither obliges the other to change.

This axis is **state-driven**. It needs no diff at all — a cold repository can be
evaluated against it — and it asks: *does this conform to the criteria that govern it?*

### Why they must stay separate

The axes disagree in both directions, and collapsing them loses information.

Adding a skill does not require touching `AGENTS.md`, so `{skill, AGENTS.md}` is a
governance target and *not* a unit of change. Code and tests co-vary tightly, but the
criteria governing a test differ from those governing the code it exercises.

`truss` therefore takes **both a delta and repository state** as input. They are not the
same query and neither subsumes the other.

**Status: Settled.**

## Controllers

Each artifact-set is governed by a **controller** — the thing you define or implement to
hold it consistent. Controllers sit on a spectrum:

| Controller | Character |
| --- | --- |
| Agent definition | Judgement, full context |
| Skill | Procedure an agent follows |
| Instruction | A standing rule, always in force |
| Governance | Criteria loaded on demand |
| Deterministic code | A script or check |

Two things follow.

**Existing tools are already controllers.** The compiler and type-checker control
`{TypeScript files}`. Biome controls formatting. Astro and Starlight control
`{website content}`. Each is mature and well-built. None of them reach past the boundary
of the set they own — which is the subject of [Connections](/cyber-truss/model/connections/).

**The spectrum has a direction of travel.** A controller should migrate toward
deterministic code as the coupling it enforces turns out to be encodable. That migration
is a first-class move, not an aspiration, and it is why `cyber-truss` is an agent plugin
rather than only a CLI: a shell command can host the bottom of the spectrum and nothing
above it.

The migration is not always available. Some couplings resist encoding, and the attempt
makes them worse — see the worked case in [Connections](/cyber-truss/model/connections/#a-coupling-that-resists-encoding).

**Status: Settled** that controllers are a per-set choice across this spectrum.
**Open:** whether the spectrum is a total order, and what a controller's interface is.

## Lifting

Git reports a change as lines in files. The model speaks in artifact-sets. Nothing joins
until the delta is **lifted** — raised from a line diff into the set vocabulary.

Lifting is a distinct operation and, on current reading, a distinct subsystem. It is a
prerequisite for everything downstream: an unlifted diff cannot be matched against a
connection, because the two are written in different languages.

**Status: Settled** that lifting is required. **Open:** where it lives and how much
judgement it needs.
