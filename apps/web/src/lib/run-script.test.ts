import { describe, expect, it } from 'vitest'
import { buildFrames, type RunSpec } from './run-script.js'

/** A two-set system, enough to exercise the machine without carrying an example's weight. */
function minimalRun(steps: RunSpec['steps']): RunSpec {
	return {
		sets: [
			{ id: 'spec', label: '{spec}', x: 0, y: 0 },
			{ id: 'code', label: '{code, test}', x: 200, y: 0 },
		],
		connections: [['spec', 'code']],
		workflows: [
			{ id: 'delivery', label: 'Feature delivery', roles: { spec: 'owned', code: 'owned' } },
			{ id: 'docs', label: 'Docs update', roles: { spec: 'input' } },
		],
		steps,
	}
}

describe(buildFrames.name, () => {
	it('opens on a frame where nothing has happened yet', () => {
		const frames = buildFrames(minimalRun([{ title: 'The system', narration: 'Two sets.', events: [] }]))

		expect(frames).toHaveLength(1)
		expect(frames[0].sets.spec.state).toBe('idle')
		expect(frames[0].connections[0].strain).toBeUndefined()
	})

	it('marks the set a change lands in as the source, and keeps it so', () => {
		const frames = buildFrames(
			minimalRun([
				{ title: 'The system', narration: '', events: [] },
				{ title: 'The change', narration: '', events: [{ kind: 'land', set: 'code' }] },
				{ title: 'Later', narration: '', events: [] },
			]),
		)

		expect(frames[1].sets.code.state).toBe('source')
		expect(frames[2].sets.code.state).toBe('source')
		expect(frames[2].source).toBe('code')
	})
})

describe('strain', () => {
	it('carries the strain a step puts on a connection, in either order of its ends', () => {
		const frames = buildFrames(
			minimalRun([
				{
					title: 'Strain',
					narration: '',
					events: [{ kind: 'strain', between: ['code', 'spec'], strain: 'missing', note: 'The spec never stated it.' }],
				},
			]),
		)

		expect(frames[0].connections[0].strain).toEqual({ kind: 'missing', note: 'The spec never stated it.' })
	})

	it('refuses a strain on a connection the system does not declare', () => {
		expect(() =>
			buildFrames({
				...minimalRun([
					{
						title: 'Strain',
						narration: '',
						events: [{ kind: 'strain', between: ['spec', 'docs'], strain: 'missing', note: '' }],
					},
				]),
			}),
		).toThrow(/spec.*docs/)
	})
})

describe('selection', () => {
	it('selects every workflow that declares a role for the source', () => {
		const frames = buildFrames(
			minimalRun([
				{ title: 'Lift', narration: '', events: [{ kind: 'land', set: 'spec' }] },
				{ title: 'Look up the workflows', narration: '', events: [{ kind: 'select' }] },
			]),
		)

		expect(frames[1].workflows.delivery.state).toBe('selected')
		expect(frames[1].workflows.docs.state).toBe('selected')
	})

	it('leaves a workflow that declares no role for the source out of the lookup', () => {
		const run = minimalRun([
			{ title: 'Lift', narration: '', events: [{ kind: 'land', set: 'code' }] },
			{ title: 'Look up the workflows', narration: '', events: [{ kind: 'select' }] },
		])

		const frames = buildFrames(run)

		expect(frames[1].workflows.delivery.state).toBe('selected')
		expect(frames[1].workflows.docs.state).toBe('idle')
	})

	it('refuses a lookup before a change has landed, since the lookup is over the source', () => {
		expect(() => buildFrames(minimalRun([{ title: 'Look up', narration: '', events: [{ kind: 'select' }] }]))).toThrow(
			/source/,
		)
	})
})

describe('distillation', () => {
	it('records the intent each workflow states for itself', () => {
		const frames = buildFrames(
			minimalRun([
				{ title: 'Lift', narration: '', events: [{ kind: 'land', set: 'spec' }] },
				{ title: 'Look up', narration: '', events: [{ kind: 'select' }] },
				{
					title: 'Distill',
					narration: '',
					events: [
						{ kind: 'distill', workflow: 'delivery', intent: 'Every page shows at least one item.' },
						{ kind: 'abstain', workflow: 'docs' },
					],
				},
			]),
		)

		expect(frames[2].workflows.delivery).toEqual({ state: 'distilled', intent: 'Every page shows at least one item.' })
		expect(frames[2].workflows.docs.state).toBe('abstained')
	})

	it('refuses to distill in a workflow the lookup did not select', () => {
		expect(() =>
			buildFrames(
				minimalRun([
					{ title: 'Lift', narration: '', events: [{ kind: 'land', set: 'code' }] },
					{ title: 'Look up', narration: '', events: [{ kind: 'select' }] },
					{ title: 'Distill', narration: '', events: [{ kind: 'distill', workflow: 'docs', intent: 'x' }] },
				]),
			),
		).toThrow(/docs/)
	})
})

describe('asking the controllers above', () => {
	it('records each controller answer, and the highest affected set is where a replay starts', () => {
		const frames = buildFrames(
			minimalRun([
				{ title: 'Lift', narration: '', events: [{ kind: 'land', set: 'code' }] },
				{ title: 'Look up', narration: '', events: [{ kind: 'select' }] },
				{
					title: 'Ask upward',
					narration: '',
					events: [
						{ kind: 'ask', workflow: 'delivery', set: 'spec', answer: 'affected', note: 'It states the wrong rule.' },
					],
				},
			]),
		)

		expect(frames[2].sets.spec.state).toBe('affected')
		expect(frames[2].sets.spec.note).toBe('It states the wrong rule.')
	})

	it('refuses to ask a controller for a set outside the workflow span', () => {
		expect(() =>
			buildFrames(
				minimalRun([
					{ title: 'Lift', narration: '', events: [{ kind: 'land', set: 'spec' }] },
					{ title: 'Look up', narration: '', events: [{ kind: 'select' }] },
					{
						title: 'Ask',
						narration: '',
						events: [{ kind: 'ask', workflow: 'docs', set: 'code', answer: 'holds', note: '' }],
					},
				]),
			),
		).toThrow(/span/)
	})
})

/** The opening two steps every write test needs: a change in the code, and the lookup. */
const opening: RunSpec['steps'] = [
	{ title: 'Lift', narration: '', events: [{ kind: 'land', set: 'code' }] },
	{ title: 'Look up', narration: '', events: [{ kind: 'select' }] },
]

describe('replay', () => {
	it('writes an owned set and restores the connections the write brings back into line', () => {
		const frames = buildFrames(
			minimalRun([
				...opening,
				{
					title: 'Strain',
					narration: '',
					events: [{ kind: 'strain', between: ['spec', 'code'], strain: 'missing', note: '' }],
				},
				{
					title: 'Replay',
					narration: '',
					events: [
						{
							kind: 'write',
							workflow: 'delivery',
							set: 'spec',
							leash: 'proceeds',
							note: 'Adds the round-up rule.',
							restores: [['spec', 'code']],
						},
					],
				},
			]),
		)

		expect(frames[3].sets.spec.state).toBe('written')
		expect(frames[3].connections[0].strain).toBeUndefined()
	})

	it('holds a write that the leash stops, and the strain with it, until an approver approves', () => {
		const steps: RunSpec['steps'] = [
			...opening,
			{
				title: 'Strain',
				narration: '',
				events: [{ kind: 'strain', between: ['spec', 'code'], strain: 'open', note: '' }],
			},
			{
				title: 'Replay',
				narration: '',
				events: [
					{
						kind: 'write',
						workflow: 'delivery',
						set: 'spec',
						leash: 'stops',
						note: 'Reverses a stated rule.',
						restores: [['spec', 'code']],
					},
				],
			},
			{
				title: 'Approve',
				narration: '',
				events: [{ kind: 'approve', set: 'spec', note: 'The product owner approves.' }],
			},
		]

		const frames = buildFrames(minimalRun(steps))

		expect(frames[3].sets.spec.state).toBe('stopped')
		expect(frames[3].connections[0].strain).toBeDefined()
		expect(frames[3].awaitingApproval).toEqual(['spec'])
		expect(frames[4].sets.spec.state).toBe('written')
		expect(frames[4].connections[0].strain).toBeUndefined()
		expect(frames[4].awaitingApproval).toEqual([])
	})

	it('refuses a write to a set the workflow only reads', () => {
		expect(() =>
			buildFrames(
				minimalRun([
					{ title: 'Lift', narration: '', events: [{ kind: 'land', set: 'spec' }] },
					{ title: 'Look up', narration: '', events: [{ kind: 'select' }] },
					{
						title: 'Replay',
						narration: '',
						events: [{ kind: 'write', workflow: 'docs', set: 'spec', leash: 'proceeds', note: '' }],
					},
				]),
			),
		).toThrow(/input/)
	})

	it('refuses an approval where no write is waiting on one', () => {
		expect(() =>
			buildFrames(
				minimalRun([
					...opening,
					{ title: 'Approve', narration: '', events: [{ kind: 'approve', set: 'spec', note: '' }] },
				]),
			),
		).toThrow(/waiting/)
	})
})

describe('reconciliation at the source', () => {
	it('reports what the source controller kept, changed and added, under one of the three lenses', () => {
		const frames = buildFrames(
			minimalRun([
				...opening,
				{
					title: 'Reconcile',
					narration: '',
					events: [
						{
							kind: 'reconcile',
							workflow: 'delivery',
							outcome: 'builder',
							kept: 'the round-up',
							changed: 'nothing',
							added: 'the empty-list case',
							leash: 'proceeds',
						},
					],
				},
			]),
		)

		expect(frames[2].sets.code.state).toBe('reconciled')
		expect(frames[2].reconciliation).toEqual({
			set: 'code',
			workflow: 'delivery',
			outcome: 'builder',
			kept: 'the round-up',
			changed: 'nothing',
			added: 'the empty-list case',
		})
	})

	it('refuses to reconcile in a workflow that reads the source rather than deriving it', () => {
		expect(() =>
			buildFrames(
				minimalRun([
					{ title: 'Lift', narration: '', events: [{ kind: 'land', set: 'spec' }] },
					{ title: 'Look up', narration: '', events: [{ kind: 'select' }] },
					{
						title: 'Reconcile',
						narration: '',
						events: [
							{
								kind: 'reconcile',
								workflow: 'docs',
								outcome: 'builder',
								kept: '',
								changed: '',
								added: '',
								leash: 'proceeds',
							},
						],
					},
				]),
			),
		).toThrow(/input/)
	})
})

describe('the run ledger', () => {
	it('holds a job until the workflow writes the set, and says what the job waits on', () => {
		const frames = buildFrames(
			minimalRun([
				...opening,
				{
					title: 'Schedule',
					narration: '',
					events: [{ kind: 'job', workflow: 'delivery', set: 'spec', waitsOn: 'nothing pending' }],
				},
				{
					title: 'Replay',
					narration: '',
					events: [{ kind: 'write', workflow: 'delivery', set: 'spec', leash: 'proceeds', note: '' }],
				},
			]),
		)

		expect(frames[2].jobs).toEqual([{ workflow: 'delivery', set: 'spec', waitsOn: 'nothing pending' }])
		expect(frames[3].jobs).toEqual([])
	})

	it('records which workflow routed a job it could not write itself', () => {
		const frames = buildFrames(
			minimalRun([
				...opening,
				{
					title: 'Route',
					narration: '',
					events: [{ kind: 'job', workflow: 'delivery', set: 'spec', routedFrom: 'docs' }],
				},
			]),
		)

		expect(frames[2].jobs[0].routedFrom).toBe('docs')
	})

	it('refuses a job on a set the workflow cannot write', () => {
		expect(() =>
			buildFrames(
				minimalRun([
					...opening,
					{ title: 'Route', narration: '', events: [{ kind: 'job', workflow: 'docs', set: 'spec' }] },
				]),
			),
		).toThrow(/input/)
	})
})

describe('settling', () => {
	it('refuses to call a run settled while a connection is still strained', () => {
		expect(() =>
			buildFrames(
				minimalRun([
					...opening,
					{
						title: 'Strain',
						narration: '',
						events: [{ kind: 'strain', between: ['spec', 'code'], strain: 'missing', note: '' }],
					},
					{ title: 'Settled', narration: '', events: [{ kind: 'settle' }] },
				]),
			),
		).toThrow(/strain/)
	})

	it('refuses to call a run settled while a write is waiting on an approval', () => {
		expect(() =>
			buildFrames(
				minimalRun([
					...opening,
					{
						title: 'Replay',
						narration: '',
						events: [{ kind: 'write', workflow: 'delivery', set: 'spec', leash: 'stops', note: '' }],
					},
					{ title: 'Settled', narration: '', events: [{ kind: 'settle' }] },
				]),
			),
		).toThrow(/approval/)
	})

	it('marks the frame settled once no strain and no pending job is left', () => {
		const frames = buildFrames(
			minimalRun([...opening, { title: 'Settled', narration: '', events: [{ kind: 'settle' }] }]),
		)

		expect(frames[2].settled).toBe(true)
		expect(frames[1].settled).toBe(false)
	})
})

describe('focus', () => {
	it('names what the step itself touched, so the renderer can pick it out of the settled state', () => {
		const frames = buildFrames(
			minimalRun([
				...opening,
				{
					title: 'Ask upward',
					narration: '',
					events: [
						{ kind: 'ask', workflow: 'delivery', set: 'spec', answer: 'affected', note: '' },
						{ kind: 'strain', between: ['spec', 'code'], strain: 'missing', note: '' },
					],
				},
				{ title: 'Nothing moves', narration: '', events: [] },
			]),
		)

		expect(frames[2].focus).toEqual({ sets: ['spec'], workflows: ['delivery'], connections: [['spec', 'code']] })
		expect(frames[3].focus).toEqual({ sets: [], workflows: [], connections: [] })
	})
})
