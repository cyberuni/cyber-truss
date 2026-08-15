# 1. The package ships a CLI and skills, not an MCP server

Date: 2026-08-15

## Status

Accepted

## Context

`cyber-truss` is scaffolded from `cyber-asana`, which ships three surfaces: a CLI, a
local MCP server, and skills. The MCP server exists there because `cyber-asana` wraps a
**remote API** — an agent needs typed tools to reach Asana, and those tools carry
credentials, pagination, and schemas that a shell command cannot express as cheaply.

`cyber-truss` reaches nothing remote. It acts on the repository the agent is already
sitting in: files, git state, and the spec corpus. Everything it does is expressible as
a command the agent runs in the shell it already has.

## Decision

The package ships a CLI (`truss`) and skills. No MCP server.

Concretely, relative to the `cyber-asana` scaffold this drops `mcp.json`, `.mcp.json`,
the `./mcp` export, the `mcp` CLI subcommand, the `@modelcontextprotocol/sdk` and `zod`
dependencies, and the `mcpServers` block in every vendor manifest.

## Consequences

- An MCP server is not free to add later: it would reintroduce the manifest surface in
  five files plus the version-sync script. That is a deliberate, reviewable change, not
  an accident.
- Skills carry the agent-facing affordances instead of tools. The skill prefix is
  `cyber-truss:` (`cyber-truss:anneal`, `cyber-truss:settle`), and the skill body tells
  the agent which `truss` commands to run.
- The CLI is the only contract, so it must hold to the agent-CLI principles on its own —
  structured `--json`, definitive empty states, and exit codes a caller can branch on.
  There is no second, better-typed surface to fall back to.

## References

- [cyberuni/.github discussion #16](https://github.com/cyberuni/.github/discussions/16) —
  the naming decision: namespace `cyber-truss`, CLI bin `truss`, concept *the lattice*.
