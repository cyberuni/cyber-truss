import { describe, expect, it } from 'vitest'
import { EXIT_FAILURE, EXIT_USAGE, exitCodeFor, renderCliError, TrussError } from './cli-error.js'

describe(exitCodeFor.name, () => {
	it('returns the code a TrussError carries', () => {
		expect(exitCodeFor(new TrussError('bad flag', { exitCode: EXIT_USAGE }))).toBe(EXIT_USAGE)
	})

	it('defaults a TrussError without a code to a plain failure', () => {
		expect(exitCodeFor(new TrussError('boom'))).toBe(EXIT_FAILURE)
	})

	it('treats an unknown throw as a plain failure, not a usage error', () => {
		expect(exitCodeFor(new Error('boom'))).toBe(EXIT_FAILURE)
		expect(exitCodeFor('boom')).toBe(EXIT_FAILURE)
	})
})

describe(renderCliError.name, () => {
	it('renders the message alone', () => {
		expect(renderCliError(new Error('no lattice found'))).toBe('no lattice found')
	})

	it('appends a cause that adds information', () => {
		const error = new TrussError('cannot read the graph', { cause: new Error('ENOENT') })
		expect(renderCliError(error)).toBe('cannot read the graph: ENOENT')
	})

	it('does not repeat a cause identical to the message', () => {
		const error = new TrussError('ENOENT', { cause: 'ENOENT' })
		expect(renderCliError(error)).toBe('ENOENT')
	})

	it('stringifies a non-Error throw', () => {
		expect(renderCliError({ toString: () => 'weird' })).toBe('weird')
	})
})
