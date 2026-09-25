import { describe, expect, it } from 'vitest'
import { paginationRun } from './pagination-run.js'
import { buildFrames } from './run-script.js'

const frames = buildFrames(paginationRun)
const last = frames[frames.length - 1]

describe('the pagination run', () => {
	it('lands the change in {code, test}, which is the source for the whole run', () => {
		expect(frames[1].source).toBe('code')
		expect(last.source).toBe('code')
	})

	it('is picked up by the two workflows that derive {code, test}, and by no others', () => {
		const lookup = frames.find((f) => f.workflows.delivery.state === 'selected')
		if (!lookup) throw new Error('No frame selects the workflows')

		expect(lookup.workflows['design-implementation'].state).toBe('selected')
		expect(lookup.workflows['docs-update'].state).toBe('idle')
		expect(lookup.workflows['design-update'].state).toBe('idle')
	})

	it('replays from {spec}, the highest affected set, and leaves {PRD} too coarse and unwritten', () => {
		expect(last.sets.spec.state).toBe('written')
		expect(last.sets.prd.state).toBe('too coarse')
	})

	it('stops the write to {spec} for an approver, because it reverses a stated criterion', () => {
		const stop = frames.find((f) => f.sets.spec.state === 'stopped')
		if (!stop) throw new Error('No frame stops the write to {spec}')

		expect(stop.awaitingApproval).toEqual(['spec'])
	})

	it('reconciles at the source under the builder lens, keeping the change and adding to it', () => {
		const report = frames.find((f) => f.reconciliation?.workflow === 'delivery')?.reconciliation
		if (!report) throw new Error('Feature delivery never reconciles at the source')

		expect(report.set).toBe('code')
		expect(report.outcome).toBe('builder')
	})

	it('settles: no strain, no pending job, no write waiting on an approval', () => {
		expect(last.settled).toBe(true)
		expect(last.connections.every((c) => !c.strain)).toBe(true)
		expect(last.jobs).toEqual([])
	})

	it('carries strain on every connection at some point in the run, and clears each one', () => {
		for (const connection of paginationRun.connections) {
			const strained = frames.some(
				(f) => f.connections.find((c) => c.between[0] === connection[0] && c.between[1] === connection[1])?.strain,
			)
			const label = `${connection[0]} to ${connection[1]}`
			expect(strained, `${label} is never strained`).toBe(connection[0] !== 'prd')
		}
	})
})
