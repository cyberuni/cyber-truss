#!/usr/bin/env node
/**
 * Command Center.
 *
 * Finds the providers this repository offers, binds them, and renders what they report.
 * It understands none of their domains -- a snapshot is an opaque payload carrying its
 * provenance and its freshness, and that is all the host is entitled to know.
 */
import process from 'node:process'
import type { CapabilityContract, Snapshot } from './contract.ts'
import { discoverIntegrations, type LiveBinding, loadIntegration, refreshState, unloadIntegration } from './host.ts'
import { hideCursor, render, showCursor, type TrussPayload } from './tui.ts'

const root = process.cwd()

type View = 'sets' | 'graph' | 'obligations'

/** `--view <name>` picks the opening view, and is the only way to choose one without a TTY. */
function openingView(argv: string[]): View {
	const at = argv.indexOf('--view')
	const name = at === -1 ? '' : argv[at + 1]
	return name === 'graph' || name === 'obligations' ? name : 'sets'
}

async function main(): Promise<number> {
	const manifests = discoverIntegrations(root)
	if (manifests.length === 0) {
		process.stdout.write('0 integrations found\n')
		process.stdout.write(`  nothing declared a provider in ${root}\n`)
		return 0
	}

	const bound: LiveBinding[] = []
	const unavailable: string[] = []
	for (const manifest of manifests) {
		const result = await loadIntegration(manifest, root)
		if (result.ok) bound.push(result.bound)
		else
			unavailable.push(
				`${result.unavailable.provider}: ${result.unavailable.reason}${
					result.unavailable.detail ? ` (${result.unavailable.detail})` : ''
				}`,
			)
	}

	if (bound.length === 0) {
		process.stdout.write('0 integrations available\n')
		for (const u of unavailable) process.stdout.write(`  ${u}\n`)
		return 1
	}

	const target = bound[0]
	const contract: CapabilityContract = 'state'
	let snapshot: Snapshot | undefined
	let view: View = openingView(process.argv.slice(2))

	const refresh = async () => {
		const result = await refreshState(target, contract, snapshot)
		if (result.ok) snapshot = result.snapshot
	}

	const draw = () => {
		if (!snapshot) return
		process.stdout.write(
			render({
				provider: snapshot.provenance,
				freshness: snapshot.freshness,
				payload: snapshot.payload as TrussPayload,
				view,
				width: process.stdout.columns ?? 100,
				height: process.stdout.rows ?? 30,
			}),
		)
	}

	await refresh()

	// A single render and exit when there is no terminal to drive -- piping the output or
	// running in CI should still show the state rather than hanging on a keypress.
	if (!process.stdin.isTTY) {
		draw()
		process.stdout.write('\n')
		for (const b of bound) unloadIntegration(b)
		return 0
	}

	process.stdout.write(hideCursor)
	process.stdin.setRawMode(true)
	process.stdin.resume()
	draw()

	return await new Promise<number>((resolve) => {
		const quit = (code: number) => {
			process.stdin.setRawMode(false)
			process.stdout.write(showCursor)
			for (const b of bound) unloadIntegration(b)
			resolve(code)
		}
		process.stdin.on('data', (key) => {
			const ch = key.toString()
			if (ch === 'q' || ch === '\u0003') return quit(0)
			if (ch === 's') view = 'sets'
			if (ch === 'g') view = 'graph'
			if (ch === 'o') view = 'obligations'
			if (ch === 'r') {
				void refresh().then(draw)
				return
			}
			draw()
		})
		process.stdout.on('resize', draw)
	})
}

main().then(
	(code) => {
		process.exitCode = code
	},
	(error: unknown) => {
		process.stdout.write(showCursor)
		process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
		process.exitCode = 1
	},
)
