/**
 * Geometry for the static connection diagrams on the examples pages. The author places
 * each artifact-set by its centre; this module sizes the boxes, clips each connection to
 * the box edges, and fits the view box. Placement stays the author's, because where a
 * node sits carries no meaning in the model and a layout algorithm would pretend it did.
 */

export interface NodeInput {
	id: string
	label: string
	/** Centre, in view-box units. */
	x: number
	y: number
}

/** An undirected connection, named by the ids of the two sets it relates. */
export type EdgeInput = readonly [string, string]

export interface LaidOutNode extends NodeInput {
	width: number
	height: number
}

export interface LaidOutEdge {
	x1: number
	y1: number
	x2: number
	y2: number
}

export interface GraphLayout {
	nodes: LaidOutNode[]
	edges: LaidOutEdge[]
	viewBox: { x: number; y: number; width: number; height: number }
}

/** Advance of one character in the 13px monospace the labels are set in. */
const CHAR_WIDTH = 7.9
const PADDING_X = 16
const HEIGHT = 36
/** Space between a box and the end of a line, so the line does not touch the dashes. */
const GAP = 4
const MARGIN = 12

export function layoutGraph(nodeInputs: readonly NodeInput[], edgeInputs: readonly EdgeInput[]): GraphLayout {
	const nodes = nodeInputs.map((n) => ({ ...n, width: n.label.length * CHAR_WIDTH + PADDING_X * 2, height: HEIGHT }))
	const byId = new Map(nodes.map((n) => [n.id, n]))

	const edges = edgeInputs.map(([from, to]) => {
		const a = byId.get(from)
		const b = byId.get(to)
		if (!a || !b) throw new Error(`Edge ${from}–${to} names a node that does not exist: ${a ? to : from}`)
		const [x1, y1] = exitPoint(a, b.x - a.x, b.y - a.y)
		const [x2, y2] = exitPoint(b, a.x - b.x, a.y - b.y)
		return { x1, y1, x2, y2 }
	})

	const left = Math.min(...nodes.map((n) => n.x - n.width / 2)) - MARGIN
	const top = Math.min(...nodes.map((n) => n.y - n.height / 2)) - MARGIN
	const right = Math.max(...nodes.map((n) => n.x + n.width / 2)) + MARGIN
	const bottom = Math.max(...nodes.map((n) => n.y + n.height / 2)) + MARGIN

	return { nodes, edges, viewBox: { x: left, y: top, width: right - left, height: bottom - top } }
}

/** Where a ray from the node's centre along (dx, dy) leaves its box, pushed out by GAP. */
function exitPoint(node: LaidOutNode, dx: number, dy: number): [number, number] {
	const length = Math.hypot(dx, dy)
	const tx = dx === 0 ? Number.POSITIVE_INFINITY : node.width / 2 / Math.abs(dx)
	const ty = dy === 0 ? Number.POSITIVE_INFINITY : node.height / 2 / Math.abs(dy)
	const t = Math.min(tx, ty) + GAP / length
	return [node.x + dx * t, node.y + dy * t]
}
