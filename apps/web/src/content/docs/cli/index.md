---
title: CLI
description: The truss command
---

The binary is `truss`. It follows the
[10 agent-CLI principles](https://github.com/kunchenguid/axi#the-10-principles):
structured output on demand, definitive empty states, and exit codes a caller can
branch on.

## Global options

| Option | Effect |
| --- | --- |
| `--json` | Emit JSON instead of human-readable text |
| `-v, --version` | Print the version and exit `0` |
| `-h, --help` | Print usage and exit `0` |

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Success — including `--help` and `--version` |
| `1` | The command ran and failed |
| `2` | Usage error — unknown flag or subcommand |

## Commands

No domain commands have shipped yet. They land here as the lattice design settles.
