# cyber-truss

The convergence layer — holds a repository in its settled state across every change.

> **Scaffold stage.** The name is settled; the design under it is still being argued in
> [cyberuni/.github discussion #16](https://github.com/cyberuni/.github/discussions/16).
> The CLI is a shell today: global options, usage errors, and exit codes. No domain
> commands have shipped yet.

## Why

SDD is a **mission engine**: it runs from a change request to a handoff, then retires.
Confluence is a property of the **repository state** — held continuously, across every
change, including changes no mission produced. A per-mission engine cannot structurally
hold a per-repo invariant.

SDD keeps what it is good at: the normaliser behind one door — lenses, gates,
frozen-suite discipline, modes, classification, DoD. `cyber-truss` holds the state that
outlives every mission.

**The system is `cyber-truss`. The concept is [the lattice](https://cyberuni.github.io/cyber-truss/model/lattice/).**

## Installation

```sh
npm install -g cyber-truss
```

Or without installing:

```sh
npx cyber-truss --version
```

## CLI

The binary is `truss`, bare — typed many times a day, and unambiguous on its own. The
long name is for the places that need disambiguating (package, plugin, skill prefix);
the short one is for the shell prompt.

```sh
truss --help
truss --version
truss --json <command>   # structured output
```

| Exit code | Meaning |
| --- | --- |
| `0` | Success — including `--help` and `--version` |
| `1` | The command ran and failed |
| `2` | Usage error — unknown flag or subcommand |

## Plugin

The npm package *is* the plugin root. Manifests ship for Claude Code, Cursor, Codex, and
Copilot CLI.

```sh
# Claude Code
/plugin marketplace add cyberuni/cyber-truss
/plugin install cyber-truss
```

## Documentation

<https://cyberuni.github.io/cyber-truss>

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). AI coding assistants should read
[AGENTS.md](AGENTS.md).

## License

[MIT](license)
