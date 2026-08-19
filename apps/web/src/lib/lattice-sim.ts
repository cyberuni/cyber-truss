/**
 * A spring-mass simulation of the lattice: edges are Hooke springs, nodes carry
 * momentum, and motion is damped. Displacing one node loads its springs, and the
 * stored strain discharges hop by hop when released — the ripple is emergent.
 *
 * The same edges carry a second, semantic quantity: a change landing in one
 * artifact-set travels outward, attenuated by how tightly each connection couples its
 * two ends, and what arrives is added to what that set has already taken. See `reach`,
 * `land` and `absorb`.
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
	/** A change has landed here directly, rather than only reaching it along a member. */
	changed?: boolean
	/** Everything this set has taken so far. It only ever grows; nothing here recovers. */
	absorbed?: number
	/** Change on its way in but not yet taken, drained a little each tick. */
	pending?: number
	/** Ticks before this set starts taking what is pending, so a change is seen to travel. */
	delay?: number
}

/**
 * A connection between two artifact-sets: change either end and the other has to
 * change with it. Not an arrow — nothing here points from cause to effect.
 */
export type Edge = {
	from: number
	to: number
	/**
	 * The length this member is happy at. A truss wired to more than its immediate
	 * neighbours cannot satisfy every member at one length; without a per-edge value
	 * such a lattice is permanently strained.
	 */
	rest?: number
	/**
	 * How much of a change at one end has to be answered at the other, 0 to 1. A test
	 * changing rarely moves CI; a spec changing almost always moves the code. The same
	 * number stiffens the spring, so a tight coupling is also a rigid member.
	 */
	transmit?: number
}

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
	 * Without it nothing holds the lattice in place: dragging a node tows the whole
	 * structure along, so by the time it is released it sits at its own centroid,
	 * perfectly balanced, and nothing ripples. Gravity makes a drag *strain* the
	 * lattice instead of relocating it.
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

export type ChangeOptions = {
	/** Transmittance for a connection that does not state one of its own. */
	spread: number
	/** Share of what a set still has pending that it takes each tick. */
	ease: number
	/** Ticks of head start each connection the change crosses costs it. */
	hopTicks: number
}

const changeDefaults: ChangeOptions = {
	spread: 0.6,
	ease: 0.14,
	hopTicks: 6,
}

/** Total kinetic energy — zero once the graph has settled. */
export function kineticEnergy(graph: Graph): number {
	return graph.nodes.reduce((sum, node) => sum + node.vx * node.vx + node.vy * node.vy, 0) / 2
}

/**
 * Pin every edge's rest length to the length it currently has, so a graph whose
 * topology no drawing can satisfy at one uniform length still counts as unloaded.
 * Freeze a layout once it is where you want it and strain then reads as *change
 * since then* rather than as the residual the topology was born with.
 */
export function freezeRestLengths(graph: Graph): Graph {
	return {
		nodes: graph.nodes,
		edges: graph.edges.map((edge) => ({
			...edge,
			rest: Math.hypot(
				graph.nodes[edge.to].x - graph.nodes[edge.from].x,
				graph.nodes[edge.to].y - graph.nodes[edge.from].y,
			),
		})),
	}
}

/** What a change landing in one set does to another: how much arrives, and how far it came. */
export type Reach = {
	/** The share of the change that survives the trip, 0 to 1. */
	share: number
	/** Connections crossed on the route that delivers that share. */
	hops: number
}

/**
 * How far a change landing in `origin` carries, per set.
 *
 * A change crossing a connection is attenuated by that connection's transmittance, so
 * what survives a route is the product along it, and a set takes the best route it has —
 * which is the *tightest*, not the shortest. Attenuation below 1 is what makes the
 * spread terminate, and what leaves two sets the same distance out very differently
 * affected.
 */
export function reach(graph: Graph, origin: number, options: Partial<ChangeOptions> = {}): Reach[] {
	const { spread } = { ...changeDefaults, ...options }
	const reached: Reach[] = graph.nodes.map((_, i) => ({
		share: i === origin ? 1 : 0,
		hops: i === origin ? 0 : Number.POSITIVE_INFINITY,
	}))

	// Relax until nothing improves. Every product shrinks as it travels, so a route
	// can only be bettered a bounded number of times.
	for (let pass = 0; pass < graph.nodes.length; pass++) {
		let improved = false
		for (const edge of graph.edges) {
			const transmit = edge.transmit ?? spread
			for (const [from, to] of [
				[edge.from, edge.to],
				[edge.to, edge.from],
			]) {
				const share = reached[from].share * transmit
				if (share > reached[to].share) {
					reached[to] = { share, hops: reached[from].hops + 1 }
					improved = true
				}
			}
		}
		if (!improved) break
	}

	return reached
}

/**
 * Land a change in one set. Every set it reaches is owed what arrives there, after a
 * head start proportional to how far the change had to travel to get to it — so a
 * second change lands on top of the first rather than replacing it.
 */
export function land(graph: Graph, origin: number, options: Partial<ChangeOptions> = {}): Graph {
	const { hopTicks } = { ...changeDefaults, ...options }
	const reached = reach(graph, origin, options)

	return {
		nodes: graph.nodes.map((node, i) => {
			if (reached[i].share <= 0) return node
			return {
				...node,
				changed: node.changed || i === origin,
				pending: (node.pending ?? 0) + reached[i].share,
				delay: Math.max(node.delay ?? 0, reached[i].hops * hopTicks),
			}
		}),
		edges: graph.edges,
	}
}

/** Advance what every set is taking in by one tick, returning a new graph. */
export function absorb(graph: Graph, options: Partial<ChangeOptions> = {}): Graph {
	const { ease } = { ...changeDefaults, ...options }

	return {
		nodes: graph.nodes.map((node) => {
			if ((node.delay ?? 0) > 0) return { ...node, delay: (node.delay ?? 0) - 1 }
			const pending = node.pending ?? 0
			if (pending <= 0) return node
			// Take the last sliver whole rather than easing toward it forever.
			const move = pending < 0.001 ? pending : pending * ease
			return { ...node, pending: pending - move, absorbed: (node.absorbed ?? 0) + move }
		}),
		edges: graph.edges,
	}
}

/** Whether any change is still on its way in. */
export function absorbing(graph: Graph): boolean {
	return graph.nodes.some((node) => (node.pending ?? 0) > 0 || (node.delay ?? 0) > 0)
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

	for (const edge of graph.edges) {
		const from = nodes[edge.from]
		const to = nodes[edge.to]
		const dx = to.x - from.x
		const dy = to.y - from.y
		const length = Math.hypot(dx, dy) || 1e-6
		const pull = (stiffness * (edge.transmit ?? 1) * (length - (edge.rest ?? restLength))) / length
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
