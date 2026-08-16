# AGENTS.md

This file provides guidance to AI coding assistants when working with code in this repository.

## Skill Augmentations

When reading any `SKILL.md` file, always check whether a `SKILL.local.md` exists in the same directory. If it does, treat its contents as additional instructions that extend the base skill. Local augmentations take precedence over the base skill where they conflict.

## Commit Discipline

**Auto-commit rule:** When a unit of work is complete and verified, commit it immediately — do not wait for the user to ask. Batching multiple units into one commit, or finishing all work before committing, are both violations of this rule.

**Unit of work:** one coherent, independently revertable change — one domain's refactor, one feature, one bugfix, one test suite expansion for one concern, one config change. Never two unrelated concerns in the same commit. A TDD red-green-refactor cycle alone is not a commit boundary; commit when the full intended change is complete and tests pass. If the working tree has unrelated changes, leave them unstaged — commit the current unit first, then continue.

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`
- One concern per commit; never batch unrelated changes
- Stage only files for this unit: `git add <files>`, then verify with `git diff --cached`
- Never use `git add .`, `git add -A`, or `git add -p` (interactive commands agents cannot run)
- Never commit with red tests; run validation commands first

### References

- **`commit-work` skill** — staging, splitting, and message writing when committing
- `npx cyber-skills@<version> governance show skill-repo-structure` — discipline section format rules

## Development Workflow

Before writing any production code, invoke the `test-driven-development` skill. This applies whether coding starts from a user request or from your own initiative after plan approval.

## Design Discussion

Design here is worked out by argument, not by presenting a finished plan. Proposals get
challenged on specifics, and that is the process working.

- **Recommend, don't enumerate.** Open design questions get prose with a clear
  recommendation and its reasoning. A menu of options pushes the thinking back onto the
  reader; multiple-choice prompts are a poor fit for questions still being framed.
- **Concede the specific point, not the whole position.** When a step in your reasoning
  is shown to be wrong, say which step and why, and keep what still stands. Retracting
  wholesale to end a disagreement destroys the useful part of the proposal and hides
  which claim actually failed.
- **Defend what holds.** Agreement that isn't earned is worse than disagreement — if the
  objection doesn't land, say so and explain why.
- **Explain intent when asked, rather than withdrawing.** "Why did you propose that?"
  is a request for the reasoning, not a signal to drop it.
- **Say which frame you are in.** A decision about how the system is *set up* is not a
  decision about how it *runs*. Carrying momentum from one into the other produces
  designs that answer the wrong question — check the frame before generalising a
  solution into an architecture.
- **Mark what is load-bearing.** Separate decisions that are expensive to unwind from
  ones that can be revisited cheaply, and say which is which.
- **Test each rung of a ladder before proposing it.** A layered scheme is only worth
  proposing if each layer catches what you claim; verify rather than assume, since a
  layer that appears to help while laundering the defect is worse than no layer.

Rejected proposals are recorded with their reasons in `docs/backlog.md` under
*Settled — do not re-derive*. Read it before re-proposing anything in that list.

## What This Repo Is

`cyber-truss` — an npm package that ships the convergence layer as:

- A CLI (`truss`) powered by Commander
- An agent plugin — the package root *is* the plugin root, so the tarball ships `plugin.json`, `skills/`, and the per-vendor manifests

It is deliberately **not** an MCP server. The layer acts on repository state through a shell command and skills, not through a remote API.

### Naming

Settled in [cyberuni/.github discussion #16](https://github.com/cyberuni/.github/discussions/16):

| Surface | Name |
| --- | --- |
| Repo, npm package, plugin, skill prefix | `cyber-truss` (hyphenated) |
| CLI bin | `truss` (bare) |
| The concept, in prose and specs | *the lattice* — never the wordmark |

`cyber-truss` is a **peer of SDD**, not a detachment inside cyberfleet. Naming rule that fell out of the search: name the **property**, not the personnel. Any name reading as "some agents, grouped" describes what cyberfleet and cyberlegion already are.

### Status

Scaffold stage. The name is settled; the design under it is still WIP in that discussion. No domain commands and no skills have shipped yet — the CLI is a shell (global options, usage errors, exit codes) and the release pipeline is live.

### Plugin layout

Everything the plugin needs lives in `packages/cyber-truss/` and must stay listed in that package's `files`, or it will not reach consumers.

| Path | Read by |
| --- | --- |
| `plugin.json` | [Agent Plugins 1.0.0](https://github.com/agentplugins/agent-plugins-spec) clients. Manifest schema is **closed** — components come from fixed locations, never inline fields |
| `.claude-plugin/plugin.json` | Claude Code |
| `.cursor-plugin/plugin.json` | Cursor |
| `.codex-plugin/plugin.json` | Codex |
| `.plugin/plugin.json` | Canonical universal-plugin source; not published |
| `skills/<name>/SKILL.md` | All of them (fixed location) |

When the first skill lands, create `packages/cyber-truss/skills/<name>/SKILL.md` and add `"skills": "./skills/"` to `.plugin/plugin.json`, `.cursor-plugin/plugin.json`, and `.codex-plugin/plugin.json`. `skills` is already in the package's `files` list.

`.claude-plugin/marketplace.json` at the **repo root** lists the plugin with an `npm` source. Version bumps flow from `packages/cyber-truss/package.json` through `scripts/sync-plugin-version.mjs` on `pnpm version` — add any new manifest to that script's list.

## Commands

```
pnpm test                     # all package tests
pnpm ct test src/output.test.ts  # run one test file
pnpm verify                   # lint + build + typecheck + test + knip
pnpm build                    # compile to dist/
pnpm ct dev --help            # run the CLI from source (tsx)
pnpm web dev                  # run the docs site locally
```

`pnpm ct <script>` is the root shortcut for `pnpm run --filter=./packages/cyber-truss <script>`.

## Layout

```
packages/cyber-truss/   the npm package and the plugin root
apps/web/               Astro + Starlight docs site, deployed to GitHub Pages
docs/adr/               architecture decision records
scripts/                repo maintenance scripts
```

## Key Conventions

### Agent-friendly output

The CLI follows the [10 agent-CLI principles](https://github.com/kunchenguid/axi#the-10-principles). Keep new commands consistent:

- **Structured output** goes through `src/output.ts` (`output(data, readable)`); `--json` is handled there — never branch on `process.argv` for format inside a command.
- **Empty states**: use `printEmpty(entity)` so an empty result names what was empty (`0 members found`), never a blank line.
- **Errors & exit codes**: throw `TrussError` with an exit code; the top-level catch in `src/cli.ts` renders it via `renderCliError` / `exitCodeFor`. Never call `process.exit` inside a command. Commander usage errors (unknown flag or subcommand) exit `2`.
- **The program is a function**: `createProgram()` in `src/program.ts` builds a fresh command tree so tests drive it without touching `process.argv`.

### Version

`src/version.ts` reads `package.json` at runtime rather than importing it, so the bundler never inlines a version that `pnpm version` later bumps. Both `dist/cli.js` and `src/cli.ts` sit one directory below the package root, so the same relative path serves built and source.
