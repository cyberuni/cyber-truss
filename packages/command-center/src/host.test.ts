import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { discoverIntegrations, loadIntegration, refreshState, unloadIntegration } from './host.ts'

/** A repo with a providers.json and, optionally, a provider script to go with it. */
function repoWith(provider?: string): string {
	const root = mkdtempSync(join(tmpdir(), 'cc-'))
	if (provider) {
		writeFileSync(join(root, 'provider.mjs'), provider)
		mkdirSync(join(root, '.command-center'))
		writeFileSync(
			join(root, '.command-center/providers.json'),
			JSON.stringify({ providers: [{ name: 'p', command: 'node', args: ['provider.mjs'] }] }),
		)
	}
	return root
}

const speaks = (handshake: string, extra = '') => `
process.stdout.write(JSON.stringify(${handshake}) + '\\n')
${extra}
process.stdin.resume()
`

describe('discoverIntegrations', () => {
	it('reports an empty set in a directory with no provider', () => {
		expect(discoverIntegrations(repoWith())).toEqual([])
	})

	it('reports the provider manifests it finds', () => {
		const root = repoWith(speaks(`{ type: 'handshake', provider: 'p', contracts: { state: 1 } }`))
		expect(discoverIntegrations(root)).toHaveLength(1)
	})
})

describe('loadIntegration', () => {
	it('binds a provider whose contracts are all compatible', async () => {
		const root = repoWith(speaks(`{ type: 'handshake', provider: 'p', contracts: { state: 1, actions: 1 } }`))
		const result = await loadIntegration(discoverIntegrations(root)[0], root)
		expect(result.ok).toBe(true)
		if (!result.ok) return
		expect(result.bound.binding.contracts).toEqual(['state', 'actions'])
		unloadIntegration(result.bound)
	})

	it('binds without a contract whose version it does not support', async () => {
		const root = repoWith(speaks(`{ type: 'handshake', provider: 'p', contracts: { state: 1, actions: 99 } }`))
		const result = await loadIntegration(discoverIntegrations(root)[0], root)
		expect(result.ok).toBe(true)
		if (!result.ok) return
		expect(result.bound.binding.contracts).toEqual(['state'])
		expect(result.bound.binding.unavailable).toEqual([
			{ contract: 'actions', reason: 'version-mismatch', providerVersion: 99, hostVersion: 1 },
		])
		unloadIntegration(result.bound)
	})

	it('refuses a provider with no compatible contract', async () => {
		const root = repoWith(speaks(`{ type: 'handshake', provider: 'p', contracts: { state: 99 } }`))
		const result = await loadIntegration(discoverIntegrations(root)[0], root)
		expect(result.ok).toBe(false)
		if (result.ok) return
		expect(result.unavailable.reason).toBe('version-mismatch')
	})

	it('refuses a provider that declares no capability contract', async () => {
		const root = repoWith(speaks(`{ type: 'handshake', provider: 'p', contracts: {} }`))
		const result = await loadIntegration(discoverIntegrations(root)[0], root)
		expect(result.ok).toBe(false)
		if (result.ok) return
		expect(result.unavailable.reason).toBe('no-contracts')
	})

	it('reports a provider that never completes the handshake as unavailable, not absent', async () => {
		const root = repoWith('process.exit(1)')
		const result = await loadIntegration(discoverIntegrations(root)[0], root)
		expect(result.ok).toBe(false)
		if (result.ok) return
		expect(result.unavailable.reason).toBe('not-started')
	})
})

describe('refreshState', () => {
	it('refuses a contract the binding does not carry, and sends nothing', async () => {
		const root = repoWith(speaks(`{ type: 'handshake', provider: 'p', contracts: { state: 1 } }`))
		const result = await loadIntegration(discoverIntegrations(root)[0], root)
		expect(result.ok).toBe(true)
		if (!result.ok) return
		const refreshed = await refreshState(result.bound, 'actions')
		expect(refreshed).toEqual({ ok: false, reason: 'no-such-contract' })
		unloadIntegration(result.bound)
	})

	it('keeps the last snapshot and marks it stale once the provider is gone', async () => {
		const root = repoWith(
			speaks(
				`{ type: 'handshake', provider: 'p', contracts: { state: 1 } }`,
				`process.stdin.on('data', () => process.stdout.write(JSON.stringify({ type: 'snapshot', payload: { n: 1 } }) + '\\n'))`,
			),
		)
		const result = await loadIntegration(discoverIntegrations(root)[0], root)
		expect(result.ok).toBe(true)
		if (!result.ok) return

		const live = await refreshState(result.bound, 'state')
		expect(live.ok && live.snapshot.freshness).toBe('live')
		expect(live.ok && live.snapshot.provenance).toBe('p')

		unloadIntegration(result.bound)
		const after = await refreshState(result.bound, 'state', live.ok ? live.snapshot : undefined)
		// The payload survives; only its freshness changes. A gone provider never deletes
		// what it last said, and never makes it live again on its own.
		expect(after.ok && after.snapshot.freshness).toBe('stale')
		expect(after.ok && after.snapshot.payload).toEqual({ n: 1 })
	})
})
