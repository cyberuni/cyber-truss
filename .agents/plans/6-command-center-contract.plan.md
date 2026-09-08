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
  - content: Spec gate — freeze the suite
    status: pending
  - content: Build the fixture integration against the frozen suite
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

## NEXT

Draft complete at `status: draft`: 24 scenarios, six use-case groups, six control-flow
graphs; check-suite, check-spec-state and check-spec-structure green. Two spec-judge rounds
run — round 1 blocked on governance pre-flight, round 2 returned CHANGE and all six findings
are answered.

Loop is HELD, not converged. Two things need the user before another round:
the `views` contract was cut (a design change they have not seen), and finding 3 named text
the previous round introduced, which is the regression shape that calls for a re-plan rather
than a third iteration. Leash is `auto-none`, so the spec gate is theirs to ratify.
