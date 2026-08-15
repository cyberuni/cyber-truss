---
title: Getting Started
description: Install cyber-truss and run the CLI
---

:::caution
`cyber-truss` is at scaffold stage. The CLI shell, plugin manifests, and release
pipeline are in place; no domain commands have shipped yet.
:::

## Installation

```bash
npm install -g cyber-truss
```

Or run it without installing:

```bash
npx cyber-truss --version
```

## The CLI

The binary is `truss`, bare — short enough to type many times a day, and unambiguous
on its own.

```bash
truss --help
truss --version
```

Every command accepts `--json` for structured output. See the
[CLI reference](/cyber-truss/cli/).

## The plugin

The npm package *is* the plugin root, so installing it as a plugin gives an agent the
same surfaces the CLI exposes. Manifests ship for Claude Code, Cursor, Codex, and
Copilot CLI.

```bash
# Claude Code
/plugin marketplace add cyberuni/cyber-truss
/plugin install cyber-truss
```
