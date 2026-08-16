// PROTOTYPE — validated in a browser, not wired into anything. See docs/backlog.md (B1).
//
// Finds layout-affecting declarations inside a component that the component's own
// stylesheet does not account for: foreign rules reaching across the component
// boundary. No static tool can see this, because it needs a rendered document.
//
// Validated 2026-08-15 against apps/web's lattice demo by toggling `not-content`:
//   with it    → 1 finding  (line-height from a site-wide form reset)
//   without it → 4 findings (the Starlight margin-top bug, plus display/max-width
//                            on the icon svg and max-width on the canvas)
//
// Two filters were needed to get from noise to signal, both load-bearing:
//   - skip purely-universal selectors — a `*` reset is shared policy, not intrusion
//   - compare against a per-tag UA baseline from a blank iframe, so `margin: 0`
//     from a reset does not register (this file omits that filter; see backlog)
//
// Known gaps: shorthand expansion covers only margin/padding/inset/gap; no cascade
// resolution, so a foreign rule that loses to another foreign rule still reports.
;((root) => {
	const LONGHANDS = {
		margin: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
		padding: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
		inset: ['top', 'right', 'bottom', 'left'],
		gap: ['row-gap', 'column-gap'],
	}
	const LAYOUT = new Set([
		...Object.values(LONGHANDS).flat(),
		'position',
		'display',
		'float',
		'clear',
		'box-sizing',
		'width',
		'height',
		'min-width',
		'min-height',
		'max-width',
		'max-height',
		'flex-basis',
		'flex-grow',
		'flex-shrink',
		'align-self',
		'justify-self',
		'transform',
		'line-height',
		'vertical-align',
	])
	const expand = (p) => LONGHANDS[p] ?? (LAYOUT.has(p) ? [p] : [])

	// The component's Astro scope class; every rule the component authored carries it.
	const scope = [...root.classList].find((c) => /^astro-[a-z0-9]+$/.test(c))
	if (!scope) return { error: 'no astro scope class on root' }

	// Grouping rules (@layer, @media, @supports, @container) nest their children, so a
	// flat pass over sheet.cssRules silently misses everything inside them.
	function* rules(node) {
		for (const r of node.cssRules ?? []) {
			if (r.selectorText) yield r
			yield* rules(r)
		}
	}
	const all = []
	for (const sheet of document.styleSheets) {
		try {
			sheet.cssRules
		} catch {
			continue
		} // cross-origin
		for (const r of rules(sheet)) {
			all.push({ r, own: r.selectorText.includes(scope), href: sheet.href?.split('/').pop() ?? 'inline' })
		}
	}

	const els = [root, ...root.querySelectorAll('*')]
	const findings = []
	for (const el of els) {
		const ownProps = new Set()
		const foreign = new Map()
		for (const { r, own, href } of all) {
			let hit
			try {
				hit = el.matches(r.selectorText)
			} catch {
				continue
			} // unsupported selector
			if (!hit) continue
			for (const p of r.style) {
				for (const lh of expand(p)) {
					if (own) ownProps.add(lh)
					else foreign.set(lh, { value: r.style.getPropertyValue(p), selector: r.selectorText, href })
				}
			}
		}
		for (const [prop, info] of foreign) {
			if (ownProps.has(prop)) continue // component overrides it deliberately
			const computed = getComputedStyle(el).getPropertyValue(prop)
			findings.push({
				el: el.tagName.toLowerCase() + (el.className ? `.${String(el.className).split(' ')[0]}` : ''),
				prop,
				computed,
				from: info.href,
				selector: info.selector.length > 90 ? `${info.selector.slice(0, 90)}…` : info.selector,
			})
		}
	}
	return { scope, elementsScanned: els.length, rulesScanned: all.length, findings }
})(document.querySelector('[data-lattice]'))
