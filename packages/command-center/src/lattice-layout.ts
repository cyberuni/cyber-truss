/**
 * A force-directed layout for the lattice, sized for a terminal grid.
 *
 * The docs site renders the same idea as a spring-mass simulation; this is the same shape
 * of algorithm with the output quantised to character cells. Connections are undirected,
 * so every edge pulls symmetrically and nothing here carries a direction.
 */

export interface LayoutNode {
	id: string
	x: number
	y: number
	vx: number
	vy: number
}

export interface LayoutEdge {
	a: string
	b: string
}

export interface LayoutOptions {
	width: number
	height: number
	iterations?: number
	seed?: number
}

/** Deterministic PRNG, so the same lattice always lays out the same way. */
function rng(seed: number): () => number {
	let s = seed >>> 0
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0
		return s / 0x100000000
	}
}

export function layout(ids: string[], edges: LayoutEdge[], opts: LayoutOptions): LayoutNode[] {
	const { width, height, iterations = 300, seed = 7 } = opts
	const random = rng(seed)
	const area = width * height
	const k = Math.sqrt(area / Math.max(ids.length, 1)) * 0.8

	// Start on a ring rather than at random: a ring has no initial clustering to escape,
	// so the layout converges in fewer iterations and never starts degenerate.
	const nodes: LayoutNode[] = ids.map((id, i) => {
		const angle = (i / ids.length) * Math.PI * 2
		return {
			id,
			x: width / 2 + Math.cos(angle) * width * 0.3 + (random() - 0.5),
			y: height / 2 + Math.sin(angle) * height * 0.3 + (random() - 0.5),
			vx: 0,
			vy: 0,
		}
	})
	const byId = new Map(nodes.map((n) => [n.id, n]))

	for (let step = 0; step < iterations; step++) {
		const temperature = (1 - step / iterations) * (width / 10)

		for (const n of nodes) {
			n.vx = 0
			n.vy = 0
		}

		// Repulsion: every pair pushes apart.
		for (let i = 0; i < nodes.length; i++) {
			for (let j = i + 1; j < nodes.length; j++) {
				const a = nodes[i]
				const b = nodes[j]
				let dx = a.x - b.x
				let dy = a.y - b.y
				let dist = Math.hypot(dx, dy)
				if (dist < 0.01) {
					dx = random() - 0.5
					dy = random() - 0.5
					dist = 0.01
				}
				const force = (k * k) / dist
				const fx = (dx / dist) * force
				const fy = (dy / dist) * force
				a.vx += fx
				a.vy += fy
				b.vx -= fx
				b.vy -= fy
			}
		}

		// Attraction along edges. Undirected: the pull is equal and opposite.
		for (const e of edges) {
			const a = byId.get(e.a)
			const b = byId.get(e.b)
			if (!a || !b) continue
			const dx = a.x - b.x
			const dy = a.y - b.y
			const dist = Math.max(Math.hypot(dx, dy), 0.01)
			const force = (dist * dist) / k
			const fx = (dx / dist) * force
			const fy = (dy / dist) * force
			a.vx -= fx
			a.vy -= fy
			b.vx += fx
			b.vy += fy
		}

		// A weak pull toward the centre, so a disconnected node cannot drift away and the
		// whole graph stays anchored rather than translating freely.
		for (const n of nodes) {
			n.vx += (width / 2 - n.x) * 0.01
			n.vy += (height / 2 - n.y) * 0.01
		}

		for (const n of nodes) {
			const speed = Math.hypot(n.vx, n.vy)
			if (speed > 0) {
				const capped = Math.min(speed, temperature)
				n.x += (n.vx / speed) * capped
				n.y += (n.vy / speed) * capped
			}
			n.x = Math.min(width - 1, Math.max(0, n.x))
			n.y = Math.min(height - 1, Math.max(0, n.y))
		}
	}

	return nodes
}
