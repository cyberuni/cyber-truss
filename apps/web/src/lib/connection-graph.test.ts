import { describe, expect, it } from 'vitest'
import { layoutGraph } from './connection-graph.js'

describe(layoutGraph.name, () => {
	it('sizes each node to its label', () => {
		const { nodes } = layoutGraph(
			[
				{ id: 'a', label: '{spec}', x: 0, y: 0 },
				{ id: 'b', label: '{story bible}', x: 300, y: 0 },
			],
			[],
		)

		expect(nodes[1].width).toBeGreaterThan(nodes[0].width)
		expect(nodes[0].height).toBe(nodes[1].height)
	})

	it('starts and ends each edge on the boundary of its nodes, not at their centres', () => {
		const { nodes, edges } = layoutGraph(
			[
				{ id: 'a', label: '{a}', x: 0, y: 0 },
				{ id: 'b', label: '{b}', x: 400, y: 0 },
			],
			[['a', 'b']],
		)

		expect(edges[0].x1).toBeGreaterThanOrEqual(nodes[0].width / 2)
		expect(edges[0].x2).toBeLessThanOrEqual(400 - nodes[1].width / 2)
		expect(edges[0].y1).toBe(0)
		expect(edges[0].y2).toBe(0)
	})

	it('leaves a diagonal edge through the top or bottom when the node is wide', () => {
		const { nodes, edges } = layoutGraph(
			[
				{ id: 'a', label: '{a long label}', x: 0, y: 0 },
				{ id: 'b', label: '{b}', x: 100, y: 200 },
			],
			[['a', 'b']],
		)

		expect(edges[0].y1).toBeGreaterThanOrEqual(nodes[0].height / 2)
		expect(edges[0].x1).toBeLessThan(nodes[0].width / 2)
	})

	it('fits every node inside the view box with a margin', () => {
		const { nodes, viewBox } = layoutGraph(
			[
				{ id: 'a', label: '{a}', x: -50, y: 10 },
				{ id: 'b', label: '{b}', x: 300, y: 200 },
			],
			[],
		)

		for (const n of nodes) {
			expect(n.x - n.width / 2).toBeGreaterThan(viewBox.x)
			expect(n.y - n.height / 2).toBeGreaterThan(viewBox.y)
			expect(n.x + n.width / 2).toBeLessThan(viewBox.x + viewBox.width)
			expect(n.y + n.height / 2).toBeLessThan(viewBox.y + viewBox.height)
		}
	})

	it('rejects an edge naming a node that does not exist', () => {
		expect(() => layoutGraph([{ id: 'a', label: '{a}', x: 0, y: 0 }], [['a', 'missing']])).toThrow(/missing/)
	})
})
