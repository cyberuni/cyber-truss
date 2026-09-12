/**
 * The extension contract: how the host binds to an out-of-process provider.
 *
 * The contract is segregated. Every provider implements the handshake; beyond that it
 * declares which capability contracts it carries, and the host uses only those. Each
 * contract carries its own version, so refusing an incompatible `actions` never refuses a
 * provider that only ever reported state.
 */

/** The versions this host supports, one per capability contract. */
export const CONTRACT_VERSIONS = {
	references: 1,
	state: 1,
	actions: 1,
} as const

export type CapabilityContract = keyof typeof CONTRACT_VERSIONS

/** What discovery finds: how to start a provider, not the provider itself. */
export interface ProviderManifest {
	name: string
	command: string
	args: string[]
}

/** The provider's opening message: who it is and what it carries. */
export interface Handshake {
	type: 'handshake'
	provider: string
	contracts: Partial<Record<CapabilityContract, number>>
}

export type UnavailableReason = 'not-started' | 'version-mismatch' | 'no-contracts'

/** A provider the host could not use, and why. Never rendered as absence. */
export interface Unavailable {
	kind: 'unavailable'
	provider: string
	reason: UnavailableReason
	detail?: string
}

/** One contract within a binding that the host could not use. */
export interface ContractUnavailable {
	contract: string
	reason: 'version-mismatch'
	providerVersion: number
	hostVersion: number
}

/** A usable provider, naming exactly the contracts the host may ask it for. */
export interface Binding {
	kind: 'binding'
	provider: string
	contracts: CapabilityContract[]
	unavailable: ContractUnavailable[]
}

/**
 * Whether the provider that produced a snapshot is still the process the host is bound
 * to. Distinct from anything the payload says about its own domain — a live snapshot may
 * report that a domain check has never run.
 */
export type Freshness = 'live' | 'stale'

export interface Snapshot {
	contract: CapabilityContract
	provenance: string
	freshness: Freshness
	payload: unknown
}

export function isCapabilityContract(name: string): name is CapabilityContract {
	return name in CONTRACT_VERSIONS
}
