import { describe, expect, it } from 'vitest'
import { absorb, absorbing, freezeRestLengths, type Graph, kineticEnergy, land, reach, step } from './lattice-sim.js'

/** Edges as terse `[from, to, rest?]` tuples, since most tests only care about geometry. */
function graph(nodes: [number, number][], edges: [number, number, number?][] = []): Graph {
	return {
		nodes: nodes.map(([x, y]) => ({ x, y, vx: 0, vy: 0, pinned: false })),
		edges: edges.map(([from, to, rest]) => (rest === undefined ? { from, to } : { from, to, rest })),
	}
}

/** Springs alone, so spring behaviour can be specified without repulsion in the way. */
const spring = { restLength: 100, repulsion: 0, gravity: 0 }

function distance(g: Graph, a: number, b: number) {
	return Math.hypot(g.nodes[a].x - g.nodes[b].x, g.nodes[a].y - g.nodes[b].y)
}

describe(step.name, () => {
	it('pulls a stretched edge back toward its rest length', () => {
		const stretched = graph(
			[
				[0, 0],
				[400, 0],
			],
			[[0, 1]],
		)

		const after = step(stretched, spring)

		expect(distance(after, 0, 1)).toBeLessThan(400)
	})

	it('settles a disturbed graph to rest', () => {
		let g = graph(
			[
				[0, 0],
				[400, 0],
			],
			[[0, 1]],
		)

		for (let i = 0; i < 500; i++) g = step(g, spring)

		expect(kineticEnergy(g)).toBeLessThan(1e-6)
		expect(distance(g, 0, 1)).toBeCloseTo(100, 1)
	})

	it('propagates a disturbance outward hop by hop', () => {
		// A chain 0-1-2-3 at rest, with node 0 yanked left.
		const chain = graph(
			[
				[-100, 0],
				[100, 0],
				[200, 0],
				[300, 0],
			],
			[
				[0, 1],
				[1, 2],
				[2, 3],
			],
		)

		const oneTick = step(chain, spring)
		expect(Math.abs(oneTick.nodes[1].vx)).toBeGreaterThan(0)
		expect(oneTick.nodes[3].vx).toBe(0)

		let later = oneTick
		for (let i = 0; i < 20; i++) later = step(later, spring)
		expect(Math.abs(later.nodes[3].x - 300)).toBeGreaterThan(0.1)
	})

	it('holds a pinned node still while its neighbours respond', () => {
		const held = graph(
			[
				[0, 0],
				[400, 0],
			],
			[[0, 1]],
		)
		held.nodes[0].pinned = true

		let g = held
		for (let i = 0; i < 300; i++) g = step(g, spring)

		expect(g.nodes[0]).toMatchObject({ x: 0, y: 0, vx: 0, vy: 0 })
		expect(g.nodes[1].x).toBeCloseTo(100, 1)
	})

	it('pushes coincident unconnected nodes apart', () => {
		let g = graph([
			[0, 0],
			[0.5, 0],
		])

		for (let i = 0; i < 50; i++) g = step(g, { restLength: 100, gravity: 0 })

		expect(distance(g, 0, 1)).toBeGreaterThan(10)
	})

	it('lets an edge carry its own rest length', () => {
		// A ring wired to both its neighbours and its next-but-one cannot satisfy both
		// at a single length, so an edge may state the length it is happy at.
		let g = graph(
			[
				[0, 0],
				[300, 0],
			],
			[[0, 1, 200]],
		)

		for (let i = 0; i < 500; i++) g = step(g, spring)

		expect(distance(g, 0, 1)).toBeCloseTo(200, 1)
	})

	it('leaves pairs beyond the repulsion range alone', () => {
		const far = graph([
			[0, 0],
			[500, 0],
		])

		const after = step(far, { restLength: 100, gravity: 0 })

		expect(after.nodes[1]).toMatchObject({ x: 500, vx: 0 })
	})
})

describe('holding a node away from the lattice', () => {
	/** A hub wired to a ring of four — enough structure to strain. */
	function hub() {
		return graph(
			[
				[0, 0],
				[100, 0],
				[0, 100],
				[-100, 0],
				[0, -100],
			],
			[
				[0, 1],
				[0, 2],
				[0, 3],
				[0, 4],
			],
		)
	}

	it('strains the structure rather than dragging it along', () => {
		const held = hub()
		held.nodes[0].pinned = true
		held.nodes[0].x = 400

		let g = held
		for (let i = 0; i < 400; i++) g = step(g, { restLength: 100 })

		// The ring must lag well behind, not ride along to the hub's new position.
		expect(g.nodes[3].x).toBeLessThan(250)
	})

	it('leaves the held node out of equilibrium, so releasing it snaps back', () => {
		const held = hub()
		held.nodes[0].pinned = true
		held.nodes[0].x = 400

		let g = held
		for (let i = 0; i < 400; i++) g = step(g, { restLength: 100 })

		g.nodes[0].pinned = false
		const released = step(g, { restLength: 100 })

		expect(released.nodes[0].x).toBeLessThan(400)
		expect(kineticEnergy(released)).toBeGreaterThan(SETTLED)
	})
})

const SETTLED = 0.01

describe('home', () => {
	it('pulls a displaced node back toward its home rather than the origin', () => {
		const away: Graph = {
			nodes: [{ x: 300, y: 0, vx: 0, vy: 0, pinned: false, home: { x: 200, y: 0 } }],
			edges: [],
		}

		let g = away
		for (let i = 0; i < 400; i++) g = step(g, { repulsion: 0 })

		expect(g.nodes[0].x).toBeCloseTo(200, 0)
	})
})

describe('freezeRestLengths', () => {
	it('makes every edge happy where it currently sits', () => {
		const strained = graph(
			[
				[0, 0],
				[30, 0],
				[30, 40],
			],
			[
				[0, 1],
				[1, 2],
				[2, 0],
			],
		)

		const frozen = freezeRestLengths(strained)

		expect(frozen.edges).toEqual([
			{ from: 0, to: 1, rest: 30 },
			{ from: 1, to: 2, rest: 40 },
			{ from: 2, to: 0, rest: 50 },
		])
	})
})

/** A chain of four, so a change has somewhere to travel. */
function chain(transmit: number): Graph {
	return {
		nodes: [0, 1, 2, 3].map((i) => ({ x: i * 100, y: 0, vx: 0, vy: 0, pinned: false })),
		edges: [
			{ from: 0, to: 1, transmit },
			{ from: 1, to: 2, transmit },
			{ from: 2, to: 3, transmit },
		],
	}
}

describe(reach.name, () => {
	it('leaves the set the change landed in fully affected', () => {
		expect(reach(chain(0.5), 0)[0]).toEqual({ share: 1, hops: 0 })
	})

	it('attenuates the change once per connection it crosses', () => {
		const reached = reach(chain(0.5), 0)

		expect(reached.map((r) => r.share)).toEqual([1, 0.5, 0.25, 0.125])
		expect(reached.map((r) => r.hops)).toEqual([0, 1, 2, 3])
	})

	it('lets a loose connection hold a change back where a tight one passes it on', () => {
		expect(reach(chain(0.2), 0)[1].share).toBeLessThan(reach(chain(0.9), 0)[1].share)
	})

	it('delivers by the tightest route rather than the shortest', () => {
		const detour: Graph = {
			nodes: [0, 1, 2].map((i) => ({ x: i * 100, y: 0, vx: 0, vy: 0, pinned: false })),
			edges: [
				{ from: 0, to: 1, transmit: 0.8 },
				{ from: 1, to: 2, transmit: 0.8 },
				{ from: 0, to: 2, transmit: 0.1 },
			],
		}

		expect(reach(detour, 0)[2]).toEqual({ share: 0.8 * 0.8, hops: 2 })
	})

	it('reaches nothing across a graph with no connections', () => {
		const alone = chain(0.5)
		alone.edges = []

		expect(reach(alone, 0).map((r) => r.share)).toEqual([1, 0, 0, 0])
	})
})

/** Run the change all the way in, or give up — an absorption that never ends is a bug. */
function take(graph: Graph) {
	for (let i = 0; i < 5000 && absorbing(graph); i++) graph = absorb(graph)
	if (absorbing(graph)) throw new Error('change never finished arriving')
	return graph
}

describe(land.name, () => {
	it('grows every set it reaches by the share that arrives there', () => {
		const taken = take(land(chain(0.5), 0))

		expect(taken.nodes.map((n) => n.absorbed ?? 0)).toEqual([1, 0.5, 0.25, 0.125])
	})

	it('stacks a second change on top of the first rather than replacing it', () => {
		const once = take(land(chain(0.5), 0))

		const twice = take(land(once, 3))

		expect(twice.nodes[0].absorbed).toBeCloseTo(1 + 0.125, 6)
		expect(twice.nodes[3].absorbed).toBeCloseTo(0.125 + 1, 6)
	})

	it('never gives a set back what it has taken', () => {
		let g = land(chain(0.5), 0)
		let previous = 0

		for (let i = 0; i < 200; i++) {
			g = absorb(g)
			const now = g.nodes[2].absorbed ?? 0
			expect(now).toBeGreaterThanOrEqual(previous)
			previous = now
		}
	})

	it('marks the set the change landed in, and only that one', () => {
		const landed = land(chain(0.5), 1)

		expect(landed.nodes.map((n) => n.changed ?? false)).toEqual([false, true, false, false])
	})

	it('holds a distant set back until the change has had time to get there', () => {
		let g = land(chain(0.9), 0)

		for (let i = 0; i < 5; i++) g = absorb(g)

		expect(g.nodes[0].absorbed ?? 0).toBeGreaterThan(0)
		expect(g.nodes[3].absorbed ?? 0).toBe(0)
	})
})
