/**
 * The run of variant A of the bug-fix example, as a script the run player can step
 * through. The page owns the prose; this is the same run in the state machine's terms,
 * and it is authored rather than computed, because every answer in it is a controller's
 * judgement that no layout or inference could produce.
 *
 * The set positions match the static `ConnectionGraph` on the same page, so the reader
 * steps into a picture they have already seen.
 */

import type { RunSpec } from './run-script.js'

/** Where the model leaves a contradiction across two units of change unclassified. */
const CONTRADICTION = 'The code contradicts a rule {spec} states. Which kind of strain that leaves is an open question.'

export const paginationRun: RunSpec = {
	sets: [
		{ id: 'prd', label: '{PRD}', x: 0, y: 110 },
		{ id: 'spec', label: '{spec}', x: 220, y: 110 },
		{ id: 'docs', label: '{user docs}', x: 440, y: 20 },
		{ id: 'mockups', label: '{mockups}', x: 440, y: 200 },
		{ id: 'code', label: '{code, test}', x: 660, y: 110 },
	],
	connections: [
		['prd', 'spec'],
		['spec', 'code'],
		['spec', 'docs'],
		['spec', 'mockups'],
		['mockups', 'code'],
	],
	workflows: [
		{ id: 'delivery', label: 'Feature delivery', roles: { prd: 'owned', spec: 'owned', code: 'owned' } },
		{ id: 'docs-update', label: 'Docs update', roles: { spec: 'input', docs: 'owned' } },
		{ id: 'design-update', label: 'Design update', roles: { spec: 'input', mockups: 'owned' } },
		{ id: 'design-implementation', label: 'Design implementation', roles: { mockups: 'input', code: 'owned' } },
	],
	steps: [
		{
			title: 'The system',
			narration:
				'Five artifact-sets and the connections between them. A connection is undirected: it says a relation must hold, not which end leads. Four workflows are declared over these sets, and each one fixes the role every set holds in it.',
			events: [],
		},
		{
			title: 'A change lands',
			narration:
				'The list shows an empty last page when the item count is an exact multiple of the page size. A developer changes the page-count calculation to round up and commits. The diff touches the code only. Lifting raises it from lines into set vocabulary: the change is in {code, test}, which makes that set the source for the rest of the run.',
			events: [{ kind: 'land', set: 'code' }],
		},
		{
			title: 'The strain it leaves',
			narration:
				'Two connections no longer hold. {spec} states the page count as the item count divided by the page size, rounded down, plus one, and the code now rounds up. The mockups draw a page indicator with that empty last page in it, and the code no longer renders one. Nothing is strained toward {PRD}, which never stated a page-count rule.',
			events: [
				{
					kind: 'strain',
					between: ['spec', 'code'],
					strain: 'missing',
					note: `${CONTRADICTION} The spec also says nothing of the empty list, which is missing strain.`,
				},
				{
					kind: 'strain',
					between: ['mockups', 'code'],
					strain: 'open',
					note: 'The indicator draws the empty last page the code no longer renders.',
				},
			],
		},
		{
			title: 'Look up the workflows',
			narration:
				'Every workflow that declares a role for the source picks the change up. Feature delivery and design implementation both own {code, test}, so both derive it and both take the change. Docs update and design update declare no role for it, so neither is reached yet. The lookup is over declarations, not a judgement.',
			events: [{ kind: 'select' }],
		},
		{
			title: 'Distill, per workflow',
			narration:
				'Each workflow reads the change within its own span and states what it is for. Feature delivery reads it against {spec} and {PRD}; design implementation reads it against {mockups}, whose indicator counts pages. Here both state the same intent, and neither abstains. The intent belongs to the workflow, not to the change.',
			events: [
				{
					kind: 'distill',
					workflow: 'delivery',
					intent: 'Every page shows at least one item, and the last page shows whatever remains.',
				},
				{
					kind: 'distill',
					workflow: 'design-implementation',
					intent: 'Every page shows at least one item, and the last page shows whatever remains.',
				},
			],
		},
		{
			title: 'Feature delivery asks the controllers above',
			narration:
				'The controllers above the source derive the criteria the intent implies for their own sets, and never see the diff. The {spec} controller derives three: round up; an exact multiple produces no empty page; an empty list shows one page with an empty state. The spec contradicts the first and says nothing of the third, so it is affected. The {PRD} controller answers that the PRD is too coarse to hold a page-count rule, and nothing sits above it. The highest affected set is {spec}, and these criteria are version 1 of the run.',
			events: [
				{
					kind: 'ask',
					workflow: 'delivery',
					set: 'spec',
					answer: 'affected',
					note: 'States round down plus one, and nothing about an empty list.',
				},
				{
					kind: 'ask',
					workflow: 'delivery',
					set: 'prd',
					answer: 'too coarse',
					note: 'Too coarse to hold a page-count rule.',
				},
			],
		},
		{
			title: 'Design implementation asks, and routes what it cannot write',
			narration:
				'The {mockups} controller answers that the indicator shows the empty last page, so the mockups are affected. Design implementation reads {mockups} as an input, and a workflow never writes its input, so the affected set is routed to a workflow that owns it. Design update takes the job, asks the {spec} controller above the mockups, gets the same answer, and cannot write {spec} either, so it routes on to feature delivery, which already holds that job.',
			events: [
				{
					kind: 'ask',
					workflow: 'design-implementation',
					set: 'mockups',
					answer: 'affected',
					note: 'The indicator draws the empty last page.',
				},
				{
					kind: 'job',
					workflow: 'design-update',
					set: 'mockups',
					routedFrom: 'design-implementation',
					waitsOn: '{spec}, which feature delivery is about to write',
				},
				{
					kind: 'ask',
					workflow: 'design-update',
					set: 'spec',
					answer: 'affected',
					note: 'The same answer, to a second asker.',
				},
			],
		},
		{
			title: 'The run ledger schedules',
			narration:
				'Three jobs. Feature delivery replays from {spec} and waits on nothing. Design update reads {spec}, which feature delivery is about to write. Design implementation reconciles at the code and reads {mockups}, which design update is about to write. The ledger orders the work to save rework; it never decides the outcome.',
			events: [
				{ kind: 'job', workflow: 'delivery', set: 'spec', waitsOn: 'nothing pending' },
				{
					kind: 'job',
					workflow: 'design-implementation',
					set: 'code',
					waitsOn: '{mockups}, which design update is about to write',
				},
			],
		},
		{
			title: 'Replay from the highest affected set',
			narration:
				'Feature delivery replays from {spec}, not from its declared start at {PRD}. The spec controller writes the round-up rule and the empty-list case. The round-up rule replaces round down plus one rather than joining it, so the write reverses a criterion of the set standing specification, and the leash stops it for an approver.',
			events: [
				{
					kind: 'write',
					workflow: 'delivery',
					set: 'spec',
					leash: 'stops',
					note: 'Reverses a stated rule, so the leash stops it.',
					restores: [],
				},
			],
		},
		{
			title: 'An approver answers',
			narration:
				'The product owner who keeps the PRD and the spec accepts that the old rule was wrong, and pre-approves the rest of the run gates. Both are recorded as a decision. The ledger already holds design update job, so the approver can see that the mockups will follow. The spec now states both criteria, and two more connections fall out of line the moment it does: the help page states the old page count, and the indicator still draws the empty last page.',
			events: [
				{ kind: 'approve', set: 'spec', note: 'Approved, and the rest of the run pre-approved.' },
				{ kind: 'strain', between: ['spec', 'docs'], strain: 'open', note: 'The help page states the old page count.' },
				{
					kind: 'strain',
					between: ['spec', 'mockups'],
					strain: 'open',
					note: 'The indicator still draws the empty last page.',
				},
			],
		},
		{
			title: 'Reconcile at the source',
			narration:
				'The code controller receives the change that landed, the intent, and the criteria of {spec}, which were derived without it. It keeps the round-up, which the criteria ask for, and adds the empty-list case with its test, which the fix never considered. The report is a builder outcome, an improvement to the change. Nothing is removed from {code, test}, so the leash lets it proceed.',
			events: [
				{
					kind: 'reconcile',
					workflow: 'delivery',
					outcome: 'builder',
					kept: 'the round-up',
					changed: 'nothing',
					added: 'the empty-list case and its test',
					leash: 'proceeds',
					restores: [['spec', 'code']],
				},
			],
		},
		{
			title: 'The amended spec propagates',
			narration:
				'Every write is a change of its own. Docs update reads {spec}, so it runs forward from it without asking anything above. The help page states the old page count, and the write brings it into line. The page criterion is that it describes the rule the spec states, so the write meets it, reverses nothing, and proceeds.',
			events: [
				{
					kind: 'write',
					workflow: 'docs-update',
					set: 'docs',
					leash: 'proceeds',
					note: 'Describes the rule the spec now states.',
					restores: [['spec', 'docs']],
				},
			],
		},
		{
			title: 'Design update amends the indicator',
			narration:
				'Design update job is ready now that {spec} is written. The indicator drew an empty last page, and design implementation checks the code against that drawing, so the drawing is a criterion of {mockups}. The write reverses it, which would stop by default. The approver pre-approval covers it, and its criteria pass, so it proceeds and nobody is asked the same question again as a drawing.',
			events: [
				{
					kind: 'write',
					workflow: 'design-update',
					set: 'mockups',
					leash: 'pre-approved',
					note: 'Reverses a drawing, and the pre-approval covers it.',
					restores: [
						['spec', 'mockups'],
						['mockups', 'code'],
					],
				},
			],
		},
		{
			title: 'The second reconciliation changes nothing',
			narration:
				'Design implementation reconciles {code, test} against the mockups. Both workflows reconcile the same code against the same version 1 criteria, and their writes join at the code controller. The code already meets them, so this one keeps everything and writes nothing. Nothing is replayed for nothing.',
			events: [
				{
					kind: 'reconcile',
					workflow: 'design-implementation',
					outcome: 'builder',
					kept: 'everything',
					changed: 'nothing',
					added: 'nothing',
					leash: 'proceeds',
				},
			],
		},
		{
			title: 'Settled',
			narration:
				'No connection is strained and the ledger is empty. {PRD} is unchanged, because it never stated the rule. {spec} states the round-up rule and the empty-list case, {code, test} implements both with tests, and {user docs} and {mockups} match the spec. One decision is recorded at {spec}: the approval of a change of direction, and the pre-approval that carried it through {mockups}. Whichever set the developer had touched first, the criteria the run settles against are these.',
			events: [{ kind: 'settle' }],
		},
	],
}
