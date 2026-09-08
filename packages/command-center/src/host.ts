/**
 * The host side of the extension contract: find providers, bind them, take snapshots.
 *
 * Providers are separate processes. The host holds copies of what they report and never
 * promotes one on its own — a snapshot goes stale when its process is gone, and only a
 * fresh report makes it live again.
 */
import { type ChildProcess, spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
	type Binding,
	type CapabilityContract,
	CONTRACT_VERSIONS,
	type ContractUnavailable,
	type Handshake,
	isCapabilityContract,
	type ProviderManifest,
	type Snapshot,
	type Unavailable,
} from './contract.ts'

/** Where a repository declares the providers it offers. */
const DISCOVERY_PATH = '.command-center/providers.json'

/** Find the providers available here. An empty result is an outcome, not an error. */
export function discoverIntegrations(root: string): ProviderManifest[] {
	const path = join(root, DISCOVERY_PATH)
	if (!existsSync(path)) return []
	const parsed = JSON.parse(readFileSync(path, 'utf8'))
	return Array.isArray(parsed.providers) ? parsed.providers : []
}

export interface LiveBinding {
	binding: Binding
	child: ChildProcess
	/** Set once the process is gone; every snapshot from it is stale from then on. */
	exited: boolean
}

export type LoadResult = { ok: true; bound: LiveBinding } | { ok: false; unavailable: Unavailable }

/**
 * Start a provider and read its handshake. Compatibility is checked per contract: a
 * provider with one incompatible contract binds without it, and only a provider with no
 * compatible contract at all is refused.
 */
export async function loadIntegration(manifest: ProviderManifest, root: string): Promise<LoadResult> {
	const child = spawn(manifest.command, manifest.args, {
		cwd: root,
		stdio: ['pipe', 'pipe', 'pipe'],
	})

	const handshake = await readMessage<Handshake>(child, 3000)
	if (handshake?.type !== 'handshake') {
		child.kill()
		return {
			ok: false,
			unavailable: { kind: 'unavailable', provider: manifest.name, reason: 'not-started' },
		}
	}

	const declared = Object.entries(handshake.contracts ?? {})
	if (declared.length === 0) {
		child.kill()
		return {
			ok: false,
			unavailable: { kind: 'unavailable', provider: manifest.name, reason: 'no-contracts' },
		}
	}

	const contracts: CapabilityContract[] = []
	const unavailable: ContractUnavailable[] = []
	for (const [name, version] of declared) {
		if (!isCapabilityContract(name)) continue
		const hostVersion = CONTRACT_VERSIONS[name]
		if (version === hostVersion) contracts.push(name)
		else
			unavailable.push({
				contract: name,
				reason: 'version-mismatch',
				providerVersion: version as number,
				hostVersion,
			})
	}

	if (contracts.length === 0) {
		child.kill()
		return {
			ok: false,
			unavailable: {
				kind: 'unavailable',
				provider: manifest.name,
				reason: 'version-mismatch',
				detail: unavailable.map((u) => `${u.contract} v${u.providerVersion}`).join(', '),
			},
		}
	}

	const bound: LiveBinding = {
		binding: { kind: 'binding', provider: handshake.provider, contracts, unavailable },
		child,
		exited: false,
	}
	child.on('exit', () => {
		bound.exited = true
	})
	return { ok: true, bound }
}

export type RefreshResult = { ok: true; snapshot: Snapshot } | { ok: false; reason: 'no-such-contract' | 'no-report' }

/** Ask a bound provider for a snapshot. A contract the binding does not carry is refused. */
export async function refreshState(
	bound: LiveBinding,
	contract: CapabilityContract,
	last?: Snapshot,
): Promise<RefreshResult> {
	if (!bound.binding.contracts.includes(contract)) return { ok: false, reason: 'no-such-contract' }
	if (bound.exited) {
		// The process is gone. Keep what it last said and mark it stale — never delete it,
		// and never let time alone make it live again.
		if (last) return { ok: true, snapshot: { ...last, freshness: 'stale' } }
		return { ok: false, reason: 'no-report' }
	}
	bound.child.stdin?.write(`${JSON.stringify({ type: 'refresh', contract })}\n`)
	const reply = await readMessage<{ type: string; payload: unknown }>(bound.child, 3000)
	if (reply?.type !== 'snapshot') {
		if (last) return { ok: true, snapshot: { ...last, freshness: 'stale' } }
		return { ok: false, reason: 'no-report' }
	}
	return {
		ok: true,
		snapshot: {
			contract,
			provenance: bound.binding.provider,
			freshness: 'live',
			payload: reply.payload,
		},
	}
}

/** Release a provider. The host retains no snapshot for it afterwards. */
export function unloadIntegration(bound: LiveBinding): void {
	bound.exited = true
	bound.child.kill()
}

/** Read one newline-delimited JSON message from a provider's stdout. */
function readMessage<T>(child: ChildProcess, timeoutMs: number): Promise<T | null> {
	return new Promise((resolve) => {
		let buffer = ''
		const done = (value: T | null) => {
			child.stdout?.off('data', onData)
			clearTimeout(timer)
			resolve(value)
		}
		const onData = (chunk: Buffer) => {
			buffer += chunk.toString()
			const newline = buffer.indexOf('\n')
			if (newline === -1) return
			const line = buffer.slice(0, newline)
			try {
				done(JSON.parse(line) as T)
			} catch {
				done(null)
			}
		}
		const timer = setTimeout(() => done(null), timeoutMs)
		child.stdout?.on('data', onData)
		child.on('exit', () => done(null))
	})
}
