/**
 * A spring-mass simulation of the lattice: edges are Hooke springs, nodes carry
 * momentum, and motion is damped. Displacing one node loads its springs, and the
 * stored strain discharges hop by hop when released — the ripple is emergent.
 *
 * Pure and DOM-free so the physics can be specified in tests; rendering lives in
 * the canvas island that drives it.
 */

export type Node = {
	x: number
	y: number
	vx: number
	vy: number
	pinned: boolean
	/** The artifact-set this node stands for, drawn beside it. */
	label?: string
	/**
	 * Where this node is at rest. Gravity pulls it here rather than to the origin, so
	 * an authored layout — not whatever the physics happens to relax into — is the
	 * shape the lattice remembers and returns to.
	 */
	home?: { x: number; y: number }
}

/**
 * A spring between two nodes, optionally stating the length it is happy at. A ring
 * wired to both its neighbours and its next-but-one cannot satisfy both hops at one
 * length; without a per-edge rest length such a lattice is permanently strained.
 */
export type Edge = [number, number] | [number, number, number]

export type Graph = {
	nodes: Node[]
	edges: Edge[]
}

export type SimOptions = {
	/** Spring constant of an edge — how hard a stretched edge pulls back. */
	stiffness: number
	/** The length an edge is happy at. */
	restLength: number
	/** Velocity retained per tick. Below 1 the system dissipates and settles. */
	damping: number
	/**
	 * Weak pull toward a node's home, or toward the origin for a node with none.
	 * Without it nothing holds the lattice in place:
	 * dragging a node tows the whole structure along, so by the time it is released
	 * it sits at its own centroid, perfectly balanced, and nothing ripples. Gravity
	 * makes a drag *strain* the lattice instead of relocating it.
	 */
	gravity: number
	/** Inverse-square push between nearby pairs, so nodes never pile up. */
	repulsion: number
	/**
	 * Range of that push. Deliberately short: with a global repulsion field every
	 * node twitches the instant any other moves, which smears the hop-by-hop
	 * ripple into a uniform reflow.
	 */
	repulsionRange: number
	/**
	 * Ceiling on per-tick travel. A long drag stores enough strain to slingshot a
	 * node clean through its neighbour on release; the cap keeps the release
	 * violent-looking but stable.
	 */
	maxSpeed: number
}

const defaults: SimOptions = {
	stiffness: 0.08,
	restLength: 90,
	damping: 0.92,
	gravity: 0.02,
	repulsion: 9000,
	repulsionRange: 130,
	maxSpeed: 12,
}

/**
 * Grow the lattice by one node, wired to its `degree` nearest neighbours, and at home
 * where it was dropped. The new springs start out of equilibrium, so the same ripple
 * fires and the whole layout re-spaces — no special case needed.
 */
export function addNode(graph: Graph, at: { x: number; y: number }, degree: number, label?: string): Graph {
	const home = { x: at.x, y: at.y }
	const index = graph.nodes.length
	const nearest = graph.nodes
		.map((node, i) => ({ i, distance: Math.hypot(node.x - at.x, node.y - at.y) }))
		.sort((a, b) => a.distance - b.distance)
		.slice(0, degree)

	return {
		nodes: [...graph.nodes, { x: at.x, y: at.y, vx: 0, vy: 0, pinned: false, home, ...(label ? { label } : {}) }],
		edges: [...graph.edges, ...nearest.map(({ i }): Edge => [index, i])],
	}
}

/** Total kinetic energy — zero once the graph has settled. */
export function kineticEnergy(graph: Graph): number {
	return graph.nodes.reduce((sum, node) => sum + node.vx * node.vx + node.vy * node.vy, 0) / 2
}

/** Advance the graph by one tick, returning a new graph. */
export function step(graph: Graph, options: Partial<SimOptions> = {}): Graph {
	const { stiffness, restLength, damping, gravity, repulsion, repulsionRange, maxSpeed } = {
		...defaults,
		...options,
	}
	const nodes = graph.nodes.map((node) => ({ ...node }))

	for (const node of nodes) {
		node.vx -= (node.x - (node.home?.x ?? 0)) * gravity
		node.vy -= (node.y - (node.home?.y ?? 0)) * gravity
	}

	for (let i = 0; i < nodes.length; i++) {
		for (let j = i + 1; j < nodes.length; j++) {
			const from = nodes[i]
			const to = nodes[j]
			const dx = to.x - from.x
			const dy = to.y - from.y
			// Nodes dropped on the exact same spot have no axis to separate along;
			// nudge them onto one rather than dividing by zero.
			const distance = Math.hypot(dx, dy) || 1e-3
			if (distance > repulsionRange) continue
			const push = repulsion / (distance * distance * distance)
			from.vx -= dx * push
			from.vy -= dy * push
			to.vx += dx * push
			to.vy += dy * push
		}
	}

	for (const [a, b, rest = restLength] of graph.edges) {
		const from = nodes[a]
		const to = nodes[b]
		const dx = to.x - from.x
		const dy = to.y - from.y
		const length = Math.hypot(dx, dy) || 1e-6
		const pull = (stiffness * (length - rest)) / length
		from.vx += dx * pull
		from.vy += dy * pull
		to.vx -= dx * pull
		to.vy -= dy * pull
	}

	for (const node of nodes) {
		if (node.pinned) {
			node.vx = 0
			node.vy = 0
			continue
		}
		node.vx *= damping
		node.vy *= damping
		const speed = Math.hypot(node.vx, node.vy)
		if (speed > maxSpeed) {
			node.vx = (node.vx / speed) * maxSpeed
			node.vy = (node.vy / speed) * maxSpeed
		}
		node.x += node.vx
		node.y += node.vy
	}

	return { nodes, edges: graph.edges }
}

/**
 * Pin every edge's rest length to the length it currently has, so a graph whose
 * topology no drawing can satisfy at one uniform length still counts as unloaded.
 * Freeze a layout once it has settled and strain then reads as *change since then*
 * rather than as the residual the topology was born with.
 */
export function freezeRestLengths(graph: Graph): Graph {
	return {
		nodes: graph.nodes,
		edges: graph.edges.map(
			([a, b]): Edge => [a, b, Math.hypot(graph.nodes[b].x - graph.nodes[a].x, graph.nodes[b].y - graph.nodes[a].y)],
		),
	}
}
