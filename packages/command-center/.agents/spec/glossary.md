# Glossary

The project's ubiquitous language. Every load-bearing term is defined once, here.

- **Command Center** — the application: shell, composed views, decisions, navigation. It
  renders authoritative state it does not own.
- **Host** — Command Center in its role as the thing an integration loads into.
- **Integration** — a domain-owned provider (Cyberfleet, SDD, Truss) bound to the host
  through the extension contract. It carries its own dependencies; installing it *is*
  acquiring the capability.
- **Extension contract** — the versioned interface between host and integration: identity
  and reference mapping, state snapshots and updates, views, and domain-owned actions and
  results.
- **Decision** — a request awaiting a human answer, surfaced by the application. Distinct
  from an **architecture decision**, which is an ADR under `design/decisions/`.
- **Unavailable state** — the host's explicit rendering of an integration that is missing,
  failed, or incompatible. Never rendered as absence of data.
- **Stale state** — a snapshot the host holds from a provider that has since restarted or
  gone quiet. Never promoted to live or verified by the passage of time.
- **Provenance** — which authoritative store a rendered fact came from, preserved through
  the contract so a fleet completion, an SDD gate result, and a Truss obligation
  resolution stay distinguishable.
