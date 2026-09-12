---
"cyber-truss": patch
---

Bundle the CLI's dependencies into `dist/cli.js`.

An installed agent plugin is a copy of a source checkout, not an npm install, so its directory has
no reliable `node_modules` and a CLI with external dependencies cannot be run from it. The published
`dist/cli.js` now inlines `commander` and runs with no `node_modules` present at all.

The library entry (`.`) is unchanged. Its dependencies stay external so a consumer that also uses
`commander` shares one copy instead of getting a private inlined duplicate, and so the public
`.d.ts` keeps referring to types it can actually resolve.
