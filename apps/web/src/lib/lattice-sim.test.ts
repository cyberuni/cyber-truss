import { describe, expect, it } from 'vitest'
import { addNode, type Graph, kineticEnergy, step } from './lattice-sim.js'

function graph(nodes: [number, number][], edges: [number, number][] = []): Graph {
	return {
		nodes: nodes.map(([x, y]) => ({ x, y, vx: 0, vy: 0, pinned: false })),
		edges,
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

describe(addNode.name, () => {
	const spread = graph([
		[0, 0],
		[10, 0],
		[20, 0],
		[500, 0],
	])

	it('links the new node to its nearest neighbours', () => {
		const grown = addNode(spread, { x: 5, y: 0 }, 2)

		expect(grown.nodes).toHaveLength(5)
		expect(grown.edges).toEqual([
			[4, 0],
			[4, 1],
		])
	})

	it('adds the node at rest', () => {
		const grown = addNode(spread, { x: 5, y: 0 }, 2)

		expect(grown.nodes[4]).toEqual({ x: 5, y: 0, vx: 0, vy: 0, pinned: false })
	})

	it('leaves the graph it was given untouched', () => {
		addNode(spread, { x: 5, y: 0 }, 2)

		expect(spread.nodes).toHaveLength(4)
		expect(spread.edges).toEqual([])
	})

	it('links to every node when the graph is smaller than the degree asked for', () => {
		const pair = graph([[0, 0]])

		const grown = addNode(pair, { x: 5, y: 0 }, 3)

		expect(grown.edges).toEqual([[1, 0]])
	})
})
