# AGENTS.md

Guidance for the docs site. The repo-wide rules in the root `AGENTS.md` still apply.

## What This Is

`@cyberuni/web` — the Astro + Starlight documentation site, deployed to GitHub Pages.
`base` is `/cyber-truss`, so the dev server serves pages under that prefix too
(`http://localhost:4321/cyber-truss/...`), not at the root.

## Commands

```
pnpm web dev      # run the site locally
pnpm web build    # production build; catches MDX and content-collection errors
pnpm web test     # vitest over src/**/*.test.ts
```

## Interactive Components

Client-side logic lives in `src/lib/<name>.ts` as a pure, DOM-free module with its own
vitest suite; the `.astro` component is a thin renderer that wires events to it. See
`src/lib/lattice-sim.ts` (the spring-mass simulation) and `src/components/LatticeGraph.astro`
(canvas, pointer handling, animation loop).

The split exists because behaviour is specifiable in tests and rendering is not. Put
anything you would want to assert about — state transitions, geometry, physics — behind
that seam. Reach for a browser only to check that the wiring and the pixels are right.

For canvas islands: stop the `requestAnimationFrame` loop once the state stops changing
rather than redrawing a still image, and give `prefers-reduced-motion` a path that reaches
the same end state without animating.

A page that embeds a component must be `.mdx`. Renaming a `.md` page is enough — the
frontmatter and sidebar config carry over unchanged.

### Verifying animation in a browser

Chrome suspends `requestAnimationFrame` entirely while a tab is hidden, and throttles
timers in background tabs. If the window is not in the foreground, a canvas island appears
frozen and any measurement of it is meaningless. Check `document.hidden` before concluding
that an animation is broken.

## Starlight Reaches Inside Your Components

`@astrojs/starlight/style/markdown.css` carries this rule:

```css
@layer starlight.content {
  .sl-markdown-content
    :not(a, strong, em, del, span, input, code, br)
    + :not(a, strong, em, del, span, input, code, br, :where(.not-content *)) {
    margin-top: var(--sl-content-gap-y);   /* 1rem */
  }
}
```

It is a **descendant** selector, so it does not stop at the boundary of a component
embedded in MDX. Every element inside your component that follows a sibling silently
picks up a 1rem top margin.

This is easy to misdiagnose, because on an absolutely positioned element `top` offsets the
*margin* edge rather than the border box — so `top: 0` renders 1rem down and looks like a
deliberate inset.

Add Starlight's own escape hatch to the component's root element:

```html
<figure class="lattice not-content">
```

The selector excludes `:where(.not-content *)`, so this clears the whole subtree. Do it for
any component with more than one child, then state spacing outright in the component's own
styles.

Two related traps: these rules live inside `@layer`, so a `document.styleSheets` walk that
only reads top-level `cssRules` will not find them (they are wrapped in a
`CSSLayerBlockRule`); and `--sl-content-gap-y` is themeable, so the margin is not always
1rem.
