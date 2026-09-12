/**
 * Rendering. The host knows nothing about what it draws beyond the contract's own
 * vocabulary -- provenance, freshness, and an opaque payload. Everything domain-shaped
 * below is read out of that payload, never assumed.
 */
import { layout } from './lattice-layout.ts'

const ESC = '\u001b['
const clear = `${ESC}2J${ESC}H`
export const hideCursor = `${ESC}?25l`
export const showCursor = `${ESC}?25h`

const dim = (s: string) => `${ESC}2m${s}${ESC}0m`
const bold = (s: string) => `${ESC}1m${s}${ESC}0m`
const red = (s: string) => `${ESC}31m${s}${ESC}0m`
const yellow = (s: string) => `${ESC}33m${s}${ESC}0m`
const green = (s: string) => `${ESC}32m${s}${ESC}0m`
const cyan = (s: string) => `${ESC}36m${s}${ESC}0m`

interface ArtifactSet {
	name: string
	axis: string
	controller: string
	memberCount: number
	empty: boolean
}
interface Connection {
	between: [string, string]
	degree: string
	holds: string
	evaluable: boolean
	blockedBy: string | null
	evaluation: { status: string; proposal: boolean }
}
interface Obligation {
	id: string
	summary: string
	status: string
	source: string
}
export interface TrussPayload {
	declared: boolean
	artifactSets: ArtifactSet[]
	connections: Connection[]
	obligations: Obligation[]
}

export interface Frame {
	provider: string
	freshness: string
	payload: TrussPayload
	view: 'sets' | 'graph' | 'obligations'
	width: number
	height: number
}

export function render(frame: Frame): string {
	const { payload, view } = frame
	const lines: string[] = []
	lines.push(header(frame))
	lines.push('')
	if (!payload.declared) {
		lines.push(`  ${yellow('This repository declares no lattice.')}`)
		lines.push(dim('  Nothing is wrong -- there is simply nothing to hold it to yet.'))
	} else if (view === 'sets') {
		lines.push(...renderSets(payload))
	} else if (view === 'graph') {
		lines.push(...renderGraph(payload, frame.width, frame.height - 8))
	} else {
		lines.push(...renderObligations(payload))
	}
	lines.push('')
	lines.push(footer(view))
	return clear + lines.join('\n')
}

function header(frame: Frame): string {
	const fresh = frame.freshness === 'live' ? green('live') : `${red('stale')} ${dim('(provider is gone)')}`
	return ` ${bold('Command Center')}  ${dim('|')}  ${cyan(frame.provider)}  ${dim('|')}  ${fresh}`
}

function footer(view: string): string {
	const tab = (key: string, name: string, active: boolean) =>
		active ? bold(`[${key}] ${name}`) : dim(`[${key}] ${name}`)
	return ` ${tab('s', 'sets', view === 'sets')}  ${tab('g', 'graph', view === 'graph')}  ${tab('o', 'obligations', view === 'obligations')}  ${dim('[r] refresh  [q] quit')}`
}

function renderSets(p: TrussPayload): string[] {
	const out: string[] = [`  ${bold('ARTIFACT-SETS')}  ${dim('what this repo intends to hold')}`, '']
	const width = Math.max(...p.artifactSets.map((s) => s.name.length))
	for (const s of p.artifactSets) {
		const count = s.empty ? red('     0') : String(s.memberCount).padStart(6)
		const controller = s.controller === 'none' ? yellow('no controller') : dim(`by ${s.controller}`)
		const note = s.empty ? red('  declared, not yet filled') : ''
		out.push(`   ${s.name.padEnd(width)}  ${count}  ${controller}${note}`)
	}
	out.push('')
	out.push(`  ${bold('CONNECTIONS')}  ${dim('what must hold between them')}`)
	out.push('')
	for (const c of p.connections) {
		const state = c.evaluable ? yellow('unevaluated') : dim(`not evaluable -- ${c.blockedBy} is empty`)
		out.push(`   ${c.between[0]} ${dim('--')} ${c.between[1]}   ${state}`)
		out.push(dim(`      ${c.holds}`))
	}
	out.push('')
	out.push(dim('   unevaluated is not a clean bill of health. Nothing has looked at these yet,'))
	out.push(dim('   and "never checked" is a different thing from "holding".'))
	return out
}

function renderObligations(p: TrussPayload): string[] {
	const out: string[] = [`  ${bold('OBLIGATIONS')}  ${dim(`${p.obligations.length} open`)}`, '']
	for (const o of p.obligations) {
		const src = o.source.endsWith('.toml') ? yellow('declaration') : dim('backlog')
		out.push(`   ${bold(o.id.padEnd(22))} ${o.summary.slice(0, 60).padEnd(62)} ${src}`)
	}
	return out
}

function renderGraph(p: TrussPayload, width: number, height: number): string[] {
	const w = Math.max(40, Math.min(width - 4, 160))
	const h = Math.max(12, Math.min(height, 28))
	const ids = p.artifactSets.map((s) => s.name)
	const edges = p.connections.map((c) => ({ a: c.between[0], b: c.between[1] }))

	// Lay out inside a margin wide enough for the longest label, so a node near the right
	// edge still has room to be named. Without this the labels are silently clipped, which
	// reads as a rendering bug rather than as a crowded graph.
	const labelRoom = Math.max(...ids.map((id) => abbreviate(id).length)) + 2
	const inner = Math.max(20, w - labelRoom)
	const nodes = layout(ids, edges, { width: inner, height: h })
	const pos = new Map(nodes.map((n) => [n.id, { x: Math.round(n.x), y: Math.round(n.y) }]))

	const grid: string[][] = Array.from({ length: h }, () => Array(w).fill(' '))

	// Edges first, so labels draw over them.
	for (const e of edges) {
		const a = pos.get(e.a)
		const b = pos.get(e.b)
		if (!a || !b) continue
		plotLine(grid, a.x, a.y, b.x, b.y)
	}

	// Then the nodes: a marker plus a short label, clipped to the grid.
	const setByName = new Map(p.artifactSets.map((s) => [s.name, s]))
	const labels: Array<{ x: number; y: number; text: string; empty: boolean }> = []
	for (const [id, point] of pos) {
		const set = setByName.get(id)
		const marker = set?.empty ? 'o' : '*'
		put(grid, point.x, point.y, marker)
		labels.push({ x: point.x, y: point.y, text: ` ${abbreviate(id)}`, empty: !!set?.empty })
	}
	// Place each label on the first row that can hold it without overwriting another
	// label or a node marker. A label that will not fit anywhere is dropped rather than
	// half-drawn -- a truncated name is worse than an unlabelled node you can still count.
	for (const l of labels) {
		for (const dy of [0, -1, 1, -2, 2]) {
			if (fits(grid, l.x + 1, l.y + dy, l.text.length)) {
				for (let i = 0; i < l.text.length; i++) put(grid, l.x + 1 + i, l.y + dy, l.text[i])
				break
			}
		}
	}

	const out = [`  ${bold('THE LATTICE')}  ${dim('undirected -- no edge carries a direction')}`, '']
	for (const row of grid) out.push(`  ${colorRow(row.join(''))}`)
	out.push('')
	out.push(dim(`   * populated    o declared but empty    ${p.connections.length} connections`))
	return out
}

function abbreviate(name: string): string {
	return name.replace('repository ', '').replace('cyber-truss ', 'ct-').replace('command-center ', 'cc-')
}

function colorRow(row: string): string {
	return row.replace(/[*]/g, green('*')).replace(/o/g, yellow('o'))
}

/** Can `len` cells starting at (x,y) take a label without disturbing anything drawn? */
function fits(grid: string[][], x: number, y: number, len: number): boolean {
	if (y < 0 || y >= grid.length) return false
	if (x < 0 || x + len > grid[y].length) return false
	for (let i = 0; i < len; i++) {
		const cell = grid[y][x + i]
		// Edge glyphs may be written over; markers and other labels may not.
		if (cell !== ' ' && cell !== '-' && cell !== '|' && cell !== '/' && cell !== '\\') return false
	}
	return true
}

function put(grid: string[][], x: number, y: number, ch: string): void {
	if (y < 0 || y >= grid.length) return
	if (x < 0 || x >= grid[y].length) return
	grid[y][x] = ch
}

/** Bresenham, with the glyph chosen by the segment's slope so lines read as lines. */
function plotLine(grid: string[][], x0: number, y0: number, x1: number, y1: number): void {
	const dx = Math.abs(x1 - x0)
	const dy = Math.abs(y1 - y0)
	const glyph = dy * 2 < dx ? '-' : dx * 2 < dy ? '|' : (x1 - x0) * (y1 - y0) > 0 ? '\\' : '/'
	const sx = x0 < x1 ? 1 : -1
	const sy = y0 < y1 ? 1 : -1
	let err = dx - dy
	let x = x0
	let y = y0
	for (;;) {
		if (!(x === x0 && y === y0) && !(x === x1 && y === y1)) {
			if (grid[y]?.[x] === ' ') put(grid, x, y, glyph)
		}
		if (x === x1 && y === y1) break
		const e2 = 2 * err
		if (e2 > -dy) {
			err -= dy
			x += sx
		}
		if (e2 < dx) {
			err += dx
			y += sy
		}
	}
}
