#!/usr/bin/env node
/**
 * The Truss provider.
 *
 * Reports what this repository declares it should hold, and how far it is from holding
 * it. Reads two real files -- the lattice declaration and the obligation ledger -- and
 * invents nothing. The one simulated field is a connection's evaluation status, because
 * `held | strained | unevaluated` is a proposal in the backlog rather than settled model;
 * it is reported flagged so nothing downstream mistakes it for domain.
 *
 * Speaks newline-delimited JSON on stdio. The host understands none of the vocabulary
 * below, which is the point.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const ROOT = process.cwd()

// -- a TOML subset: [[table]] arrays, string values, string arrays -------------
// Deliberately hand-rolled rather than a dependency: it reads one config whose shape this
// provider owns. A general parser is the CLI's problem, not the provider's.
function parseToml(text) {
	const out = {}
	let table = null
	let pendingKey = null
	let pendingArray = null
	for (const raw of text.split('\n')) {
		const line = raw.replace(/(^|\s)#.*$/, '').trim()
		if (!line) continue
		if (pendingArray) {
			if (line.startsWith(']')) {
				table[pendingKey] = pendingArray
				pendingArray = null
				pendingKey = null
			} else {
				for (const m of line.matchAll(/"([^"]*)"/g)) pendingArray.push(m[1])
			}
			continue
		}
		const arrayTable = line.match(/^\[\[([^\]]+)\]\]$/)
		if (arrayTable) {
			const name = arrayTable[1]
			out[name] ??= []
			table = {}
			out[name].push(table)
			continue
		}
		const kv = line.match(/^([A-Za-z0-9_-]+)\s*=\s*(.*)$/)
		if (!kv || !table) continue
		const [, key, rest] = kv
		if (rest.startsWith('[') && !rest.endsWith(']')) {
			pendingKey = key
			pendingArray = []
			for (const m of rest.matchAll(/"([^"]*)"/g)) pendingArray.push(m[1])
			continue
		}
		if (rest.startsWith('[')) {
			table[key] = [...rest.matchAll(/"([^"]*)"/g)].map((m) => m[1])
			continue
		}
		const str = rest.match(/^"(.*)"$/)
		table[key] = str ? str[1] : Number.isFinite(Number(rest)) ? Number(rest) : rest
	}
	return out
}

// -- glob: enough for the patterns a declaration uses --------------------------
const IGNORED = new Set(['node_modules', '.git', 'dist', '.turbo', '.astro'])

function walk(dir, acc = []) {
	let entries
	try {
		entries = readdirSync(dir, { withFileTypes: true })
	} catch {
		return acc
	}
	for (const e of entries) {
		if (IGNORED.has(e.name)) continue
		const full = join(dir, e.name)
		acc.push({ path: relative(ROOT, full).split(sep).join('/'), dir: e.isDirectory() })
		if (e.isDirectory()) walk(full, acc)
	}
	return acc
}

function toRegex(pattern) {
	const dirOnly = pattern.endsWith('/')
	let body = dirOnly ? pattern.slice(0, -1) : pattern
	body = body.replace(/[.+^${}()|[\]\\]/g, '\\$&')
	// A sentinel keeps `**` intact while single `*` is expanded, so the two never collide.
	// Order matters below: a trailing `/**` means "everything below", which is not the
	// same as the `**/` that spans intermediate directories.
	const GLOBSTAR = '@@globstar@@'
	body = body.split('**').join(GLOBSTAR)
	body = body.replace(/\*/g, '[^/]*')
	if (body.endsWith(`/${GLOBSTAR}`)) body = `${body.slice(0, -GLOBSTAR.length - 1)}(?:/.*)?`
	body = body.split(`${GLOBSTAR}/`).join('(?:.*/)?')
	body = body.split(GLOBSTAR).join('.*')
	return { re: new RegExp(`^${body}$`), dirOnly }
}

function resolveMembers(patterns, tree) {
	const include = patterns.filter((p) => !p.startsWith('!'))
	const exclude = patterns.filter((p) => p.startsWith('!')).map((p) => p.slice(1))
	const hit = new Set()
	for (const p of include) {
		const { re, dirOnly } = toRegex(p)
		for (const node of tree) {
			if (dirOnly !== node.dir) continue
			if (re.test(node.path)) hit.add(node.path)
		}
	}
	for (const p of exclude) {
		const { re } = toRegex(p)
		for (const path of [...hit]) if (re.test(path)) hit.delete(path)
	}
	return [...hit].sort()
}

// -- the obligation ledger -----------------------------------------------------
function readBacklogObligations() {
	const path = join(ROOT, 'docs/backlog.md')
	if (!existsSync(path)) return []
	const text = readFileSync(path, 'utf8')
	const out = []
	for (const m of text.matchAll(/^\*\*([A-D]\d+)\.\s+(.+?)\*\*/gm)) {
		out.push({
			id: m[1],
			summary: m[2].replace(/\s+/g, ' ').trim(),
			status: 'open',
			source: 'docs/backlog.md',
		})
	}
	return out
}

// -- the snapshot --------------------------------------------------------------
function buildSnapshot() {
	const declPath = join(ROOT, '.truss/lattice.toml')
	if (!existsSync(declPath)) {
		return { declared: false, artifactSets: [], connections: [], obligations: [] }
	}
	const decl = parseToml(readFileSync(declPath, 'utf8'))
	const tree = walk(ROOT)

	const artifactSets = (decl['artifact-set'] ?? []).map((s) => {
		const members = resolveMembers(s.members ?? [], tree)
		return {
			name: s.name,
			axis: s.axis,
			controller: s.controller,
			memberCount: members.length,
			empty: members.length === 0,
		}
	})
	const byName = new Map(artifactSets.map((s) => [s.name, s]))

	const connections = (decl.connection ?? []).map((c) => {
		const [a, b] = c.between
		const ea = byName.get(a)
		const eb = byName.get(b)
		const emptyEnd = ea?.empty ? a : eb?.empty ? b : null
		return {
			between: [a, b],
			degree: c.degree,
			holds: c.holds,
			evaluable: !emptyEnd,
			blockedBy: emptyEnd,
			// PROPOSAL, not settled model: evaluation status belongs to a (connection, run)
			// pair. Nothing evaluates connections yet, so every one is unevaluated -- which
			// is the honest answer, and the whole point.
			evaluation: { status: 'unevaluated', proposal: true },
		}
	})

	// An unpopulated declared set is an obligation on the SET -- an intent stated and not
	// yet discharged. It is never a strain on a connection.
	const obligations = [
		...artifactSets
			.filter((s) => s.empty)
			.map((s) => ({
				id: s.name,
				summary: `declared and unpopulated -- nothing has filled "${s.name}" yet`,
				status: 'open',
				source: '.truss/lattice.toml',
			})),
		...readBacklogObligations(),
	]

	return { declared: true, artifactSets, connections, obligations }
}

// -- the wire ------------------------------------------------------------------
const say = (msg) => process.stdout.write(`${JSON.stringify(msg)}\n`)

say({ type: 'handshake', provider: 'truss', contracts: { state: 1 } })

let buffer = ''
process.stdin.on('data', (chunk) => {
	buffer += chunk.toString()
	let newline = buffer.indexOf('\n')
	while (newline !== -1) {
		const line = buffer.slice(0, newline)
		buffer = buffer.slice(newline + 1)
		if (line.trim()) {
			let msg = null
			try {
				msg = JSON.parse(line)
			} catch {
				msg = null
			}
			if (msg && msg.type === 'refresh' && msg.contract === 'state') {
				say({ type: 'snapshot', contract: 'state', payload: buildSnapshot() })
			}
		}
		newline = buffer.indexOf('\n')
	}
})
