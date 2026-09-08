import { describe, expect, it } from 'vitest'
import { layout } from './lattice-layout.ts'

const box = { width: 80, height: 24 }
const ids = ['a', 'b', 'c', 'd']
const edges = [
	{ a: 'a', b: 'b' },
	{ a: 'c', b: 'd' },
]

const dist = (nodes: ReturnType<typeof layout>, x: string, y: string) => {
	const p = nodes.find((n) => n.id === x)
	const q = nodes.find((n) => n.id === y)
	if (!p || !q) throw new Error('missing node')
	return Math.hypot(p.x - q.x, p.y - q.y)
}

describe('layout', () => {
	it('is deterministic, so the same lattice always draws the same way', () => {
		expect(layout(ids, edges, box)).toEqual(layout(ids, edges, box))
	})

	it('keeps every node inside the canvas', () => {
		for (const n of layout(ids, edges, box)) {
			expect(n.x).toBeGreaterThanOrEqual(0)
			expect(n.x).toBeLessThanOrEqual(box.width - 1)
			expect(n.y).toBeGreaterThanOrEqual(0)
			expect(n.y).toBeLessThanOrEqual(box.height - 1)
		}
	})

	it('draws connected nodes closer than unconnected ones', () => {
		const nodes = layout(ids, edges, box)
		expect(dist(nodes, 'a', 'b')).toBeLessThan(dist(nodes, 'a', 'c'))
		expect(dist(nodes, 'c', 'd')).toBeLessThan(dist(nodes, 'a', 'c'))
	})

	it('separates nodes with no connections at all rather than stacking them', () => {
		const nodes = layout(['x', 'y', 'z'], [], box)
		expect(dist(nodes, 'x', 'y')).toBeGreaterThan(1)
		expect(dist(nodes, 'y', 'z')).toBeGreaterThan(1)
	})

	it('handles a single node without dividing by zero', () => {
		const [only] = layout(['solo'], [], box)
		expect(Number.isFinite(only.x)).toBe(true)
		expect(Number.isFinite(only.y)).toBe(true)
	})

	it('ignores an edge naming a node that does not exist', () => {
		expect(() => layout(['a'], [{ a: 'a', b: 'ghost' }], box)).not.toThrow()
	})
})
