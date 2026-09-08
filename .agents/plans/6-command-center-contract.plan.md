---
cr-ref: github-6
source: https://github.com/cyberuni/cyber-truss/issues/6
status: active
todos:
  - content: Bootstrap the SDD project spec (no corpus exists in this repo)
    status: completed
  - content: Decide the Command Center package split and spec home
    status: completed
  - content: Record package/dependency boundaries and the three-model distinction
    status: completed
  - content: Draft the versioned extension contract (references, state, actions)
    status: completed
  - content: Author the .feature covering load/refresh/resolve/action/unload/version-mismatch
    status: completed
  - content: Build the walking skeleton to validate the contract before freezing
    status: completed
  - content: Partition the node so freeze follows what a slice has exercised
    status: completed
  - content: Spec gate on provider-binding — freeze the exercised half
    status: pending
  - content: Impl gate on provider-binding against the landed code
    status: pending
  - content: Impl gate, then handoff via PR closing the issue
    status: pending
---

# github-6 — Command Center application boundaries and versioned extension contract

First Foundations item of initiative [#5](https://github.com/cyberuni/cyber-truss/issues/5).
CR source: [#6](https://github.com/cyberuni/cyber-truss/issues/6).

## Scope

Establish the application-facing contract Cyberfleet and SDD integrations bind to, before
either depends on a host API. Command Center is a separate application package here;
Truss core stays independently usable.

## Constraints carried in from `docs/backlog.md`

- Plugins carry their own dependencies — no capability vocabulary, no `requires[]`, no
  `blocked` status (*Settled — do not re-derive*).
- Not an MCP server.
- The Truss controller/probe contract (C1/C7) is a **different** contract from the
  Command Center extension contract; relate them, do not merge them.
- Open decision 1 (plugin discovery: `package.json` key vs `.agents/universal-plugin.json`)
  is adjacent and unresolved; #6 must say how it relates without settling it by accident.

## Settled

- **One package**, `packages/command-center`, with the contract reached through a subpath
  export. Reversible until the first external provider ships.
- **Spec home**: colocated at `packages/command-center/.agents/spec/`, strategy
  `capability-first`, intent mode. Truss core stays unspec'd for now.
- **Leash**: `auto-none` — the user ratifies both gates.

## Adjacent: cyber-sdd#6 (ADR-0034)

Adopts colocation of the **node** spec with its subject; project spec and router index
unchanged. Runs in parallel — it migrates nothing, and relocation is a zero-content-delta
`git mv` that preserves `@frozen`. Do not couple this mission to it. Switch over once
`packages/command-center/src/` exists and we know where the subject lives; handoff's
placement pass is already the mechanism.

## Open observation (routed, not acted on)

The actors table names "one area of a domain must not take down the others" as one of the
contract's three hardest requirements, but every failure scenario in the suite is
single-provider — cross-provider fault isolation is structurally implied by per-binding
independence, never demonstrated. Strategist-owned: either add a scenario before freeze, or
soften the claim to say it is structural rather than tested. Raised by the third cold judge.

## Filed follow-ups

- #10 `truss init` — write and validate the lattice declaration
- #11 the skill that decides what a repo declares
- #12 AGENTS.md documents a docs/adr/ that does not exist

## What the skeleton proved

Runs in a herdr pane via `cyber-mux open`; all three views and refresh driven remotely.
The contract survived a real out-of-process provider unchanged — the host carries a Truss
payload it understands nothing about. Two corrections fell out of building it: the empty
case had to be a first-class outcome rather than an error, and a TUI that only renders
under a TTY cannot be tested, so `--view` and a non-TTY single render exist.

Still unexercised by the skeleton, and therefore still unvalidated: actions, references,
and the no-replay path. Those should not freeze on the strength of a spec alone either.

## The partition

One node mixing exercised and unexercised behaviour could not reach either gate: freeze is
per file, so freezing all 26 scenarios would fail the impl gate on actions and references
that have no implementation, and not freezing left the landed code ungated.

- `integration/provider-binding` — 16 scenarios. Discovery, load, per-contract
  compatibility, snapshot freshness, release. Every one has running code behind it.
- `integration/provider-exchange` — 10 scenarios. References, actions, and the no-replay
  guarantee. Unbuilt, and stays `draft` until iteration 4 exercises it.

The in-flight-action-on-unload scenario moved to exchange: its outcome is a property of the
action, not of the release, and leaving it in binding would have split one decision across
two nodes.

## NEXT

Draft complete at `status: draft`: 24 scenarios, six use-case groups, six control-flow
graphs; check-suite, check-spec-state and check-spec-structure green. Two spec-judge rounds
run — round 1 blocked on governance pre-flight, round 2 returned CHANGE and all six findings
are answered.

Three cold-judge drives run. Defect count 6 -> 4 -> 1; lenses failing 2 -> 2 -> 1; the last
drive passed Oracle and Architect with 23 of 24 scenarios clean. All blocking findings are
answered. Every drive found its defect in text the prior round had touched, so no drive has
yet returned `approve` on an unchanged artifact — a fourth verification drive on the current
files is what would establish convergence.

Leash is `auto-none`: the spec gate is the user's to ratify. Awaiting their call on whether
to run that fourth drive or gate as it stands.
