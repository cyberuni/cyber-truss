/**
 * A run of the model, as a state machine over authored steps.
 *
 * The model's canonical execution is a sequence of discrete moves: a change lands, the
 * workflows that declare a role for the source pick it up, the controllers above answer,
 * a replay writes, and the source reconciles. This module turns an authored script of
 * those moves into one frame per step, each holding the state of every artifact-set,
 * connection and workflow at that point. The frames are what a renderer draws.
 *
 * Nothing here knows about the DOM or about SVG. Geometry lives in `connection-graph.ts`,
 * which lays the same sets and connections out for drawing.
 */

import type { EdgeInput, NodeInput } from './connection-graph.js'

/** The three roles a set can hold in a workflow. Direction lives here, not on a connection. */
export type Role = 'input' | 'owned' | 'output'

export interface WorkflowDecl {
	id: string
	label: string
	/** The workflow's span: every set it covers, with the role that set holds in it. */
	roles: Record<string, Role>
}

export interface Step {
	title: string
	narration: string
	events: RunEvent[]
}

/**
 * The kinds of strain the model names, plus `open` for a case the model has not yet
 * classified. See the model's Connections page.
 */
export type StrainKind = 'incompleteness' | 'obligation' | 'nonconformance' | 'missing' | 'open'

export type RunEvent =
	| { kind: 'land'; set: string }
	| { kind: 'strain'; between: EdgeInput; strain: StrainKind; note: string }
	| { kind: 'select' }
	| { kind: 'distill'; workflow: string; intent: string }
	| { kind: 'abstain'; workflow: string }
	| { kind: 'ask'; workflow: string; set: string; answer: ControllerAnswer; note: string }
	| {
			kind: 'write'
			workflow: string
			set: string
			/** Whether the leash lets the write proceed or stops it for an approver. */
			leash: Leash
			note: string
			/** The connections this write brings back into line. */
			restores?: EdgeInput[]
	  }
	| { kind: 'approve'; set: string; note: string }
	| { kind: 'job'; workflow: string; set: string; waitsOn?: string; routedFrom?: string }
	| { kind: 'settle' }
	| {
			kind: 'reconcile'
			workflow: string
			/** The lens the reconciliation report is read through. */
			outcome: Outcome
			kept: string
			changed: string
			added: string
			leash: Leash
			restores?: EdgeInput[]
	  }

export interface RunSpec {
	sets: NodeInput[]
	connections: EdgeInput[]
	workflows: WorkflowDecl[]
	steps: Step[]
}

/**
 * What a controller answers when a workflow asks whether its set holds the criteria an
 * intent implies. A set too coarse to hold them passes the question up.
 */
export type ControllerAnswer = 'holds' | 'affected' | 'too coarse'

/**
 * What the leash did with a write: let it through, stopped it for an approver, or let it
 * through on an approver's pre-approval given earlier in the run.
 */
export type Leash = 'proceeds' | 'stops' | 'pre-approved'

/** The three backward lenses a reconciliation report is classified through. */
export type Outcome = 'builder' | 'architect' | 'oracle'

/** One pending piece of work in the run ledger. */
export interface Job {
	workflow: string
	set: string
	/** What the job is waiting for, where it is not ready. */
	waitsOn?: string
	/** The workflow that routed this job, where the set was that workflow's input. */
	routedFrom?: string
}

export interface Reconciliation {
	set: string
	workflow: string
	outcome: Outcome
	kept: string
	changed: string
	added: string
}

export type SetState = 'idle' | 'source' | 'holds' | 'affected' | 'too coarse' | 'stopped' | 'written' | 'reconciled'

export interface SetFrameState {
	state: SetState
	/** What the last event to touch this set said about it, shown beside the node. */
	note?: string
	/** What the leash did with the write this set last took. */
	leash?: Leash
}

export interface Strain {
	kind: StrainKind
	note: string
}

export interface ConnectionFrameState {
	between: EdgeInput
	/** The strain the connection currently carries, if the relation does not hold. */
	strain?: Strain
}

export type WorkflowState = 'idle' | 'selected' | 'routed' | 'distilled' | 'abstained' | 'writing'

export interface WorkflowFrameState {
	state: WorkflowState
	/** What this workflow states the change is for, within its own span. */
	intent?: string
}

/** The sets, connections and workflows one step acts on. */
export interface Focus {
	sets: string[]
	connections: EdgeInput[]
	workflows: string[]
}

export interface Frame {
	index: number
	title: string
	narration: string
	source?: string
	sets: Record<string, SetFrameState>
	connections: ConnectionFrameState[]
	workflows: Record<string, WorkflowFrameState>
	/** Sets whose write the leash stopped and no approver has approved yet. */
	awaitingApproval: string[]
	/** The source controller's report, once it has reconciled. */
	reconciliation?: Reconciliation
	/** The run ledger: the jobs still pending at this point. */
	jobs: Job[]
	/** True once no connection is strained, no job is pending and no write awaits approval. */
	settled: boolean
	/** What this step touched, as against what the run has accumulated. */
	focus: Focus
}

function declared(run: RunSpec, id: string): WorkflowDecl {
	const found = run.workflows.find((w) => w.id === id)
	if (!found) throw new Error(`No workflow is declared with the id ${id}`)
	return found
}

/** Apply each step in order, emitting the state of the whole system after each one. */
export function buildFrames(run: RunSpec): Frame[] {
	const sets: Record<string, SetFrameState> = {}
	for (const set of run.sets) sets[set.id] = { state: 'idle' }
	const connections: ConnectionFrameState[] = run.connections.map((between) => ({ between }))
	const workflows: Record<string, WorkflowFrameState> = {}
	for (const workflow of run.workflows) workflows[workflow.id] = { state: 'idle' }
	let source: string | undefined
	/** A write the leash stopped, held until an approver approves it. */
	const held = new Map<string, EdgeInput[]>()
	let reconciliation: Reconciliation | undefined
	let jobs: Job[] = []
	let settled = false

	const mustWrite = (workflowId: string, set: string) => {
		const role = declared(run, workflowId).roles[set]
		if (!role) throw new Error(`Workflow ${workflowId} cannot write ${set}: the set is outside its span`)
		// A workflow never writes its inputs. Direction lives in the roles.
		if (role === 'input') throw new Error(`Workflow ${workflowId} reads ${set} as an input, so it can never write it`)
	}

	const connectionAt = (between: EdgeInput): ConnectionFrameState => {
		const found = connections.find(
			(c) =>
				(c.between[0] === between[0] && c.between[1] === between[1]) ||
				(c.between[0] === between[1] && c.between[1] === between[0]),
		)
		if (!found) throw new Error(`No connection is declared between ${between[0]} and ${between[1]}`)
		return found
	}

	return run.steps.map((step, index) => {
		const focus: Focus = { sets: [], connections: [], workflows: [] }
		const touch = (event: RunEvent) => {
			if ('set' in event && !focus.sets.includes(event.set)) focus.sets.push(event.set)
			if ('workflow' in event && !focus.workflows.includes(event.workflow)) focus.workflows.push(event.workflow)
			if ('between' in event) focus.connections.push(event.between)
			if (event.kind === 'reconcile' && source && !focus.sets.includes(source)) focus.sets.push(source)
		}

		for (const event of step.events) {
			touch(event)
			if (event.kind === 'land') {
				sets[event.set] = { state: 'source' }
				source = event.set
			}
			if (event.kind === 'strain') {
				connectionAt(event.between).strain = { kind: event.strain, note: event.note }
			}
			if (event.kind === 'distill' || event.kind === 'abstain' || event.kind === 'ask') {
				if (workflows[event.workflow]?.state === 'idle' || !workflows[event.workflow]) {
					throw new Error(`Workflow ${event.workflow} was not selected: it declares no role for the source`)
				}
			}
			if (event.kind === 'distill') {
				workflows[event.workflow] = { state: 'distilled', intent: event.intent }
			}
			if (event.kind === 'abstain') {
				workflows[event.workflow] = { state: 'abstained' }
			}
			if (event.kind === 'ask') {
				const declaration = declared(run, event.workflow)
				if (!declaration.roles[event.set]) {
					throw new Error(`Workflow ${event.workflow} cannot ask about ${event.set}: the set is outside its span`)
				}
				sets[event.set] = { state: event.answer, note: event.note }
			}
			if (event.kind === 'job') {
				mustWrite(event.workflow, event.set)
				// A routed job reaches a workflow the lookup never selected, and that
				// workflow then asks upward in its own shape.
				if (event.routedFrom && workflows[event.workflow].state === 'idle') workflows[event.workflow].state = 'routed'
				jobs = [
					...jobs,
					{
						workflow: event.workflow,
						set: event.set,
						...(event.waitsOn ? { waitsOn: event.waitsOn } : {}),
						...(event.routedFrom ? { routedFrom: event.routedFrom } : {}),
					},
				]
			}
			if (event.kind === 'settle') {
				const strained = connections.find((c) => c.strain)
				if (strained)
					throw new Error(
						`The run cannot settle: ${strained.between[0]} to ${strained.between[1]} is still under strain`,
					)
				if (held.size > 0)
					throw new Error(
						`The run cannot settle: a write to ${[...held.keys()].join(', ')} is still waiting on an approval`,
					)
				if (jobs.length > 0) throw new Error(`The run cannot settle: the ledger still holds ${jobs.length} job(s)`)
				settled = true
			}
			if (event.kind === 'write') {
				mustWrite(event.workflow, event.set)
				jobs = jobs.filter((job) => !(job.workflow === event.workflow && job.set === event.set))
				workflows[event.workflow].state = 'writing'
				if (event.leash === 'stops') {
					sets[event.set] = { state: 'stopped', note: event.note, leash: event.leash }
					held.set(event.set, [...(event.restores ?? [])])
				} else {
					sets[event.set] = { state: 'written', note: event.note, leash: event.leash }
					for (const between of event.restores ?? []) connectionAt(between).strain = undefined
				}
			}
			if (event.kind === 'approve') {
				const restores = held.get(event.set)
				if (!restores) throw new Error(`No write to ${event.set} is waiting on an approval`)
				held.delete(event.set)
				sets[event.set] = { state: 'written', note: event.note }
				for (const between of restores) connectionAt(between).strain = undefined
			}
			if (event.kind === 'reconcile') {
				if (!source) throw new Error('A reconciliation needs a source: nothing has landed yet')
				const role = declared(run, event.workflow).roles[source]
				if (role === 'input') {
					throw new Error(
						`Workflow ${event.workflow} reads ${source} as an input, so it runs forward from it rather than reconciling it`,
					)
				}
				jobs = jobs.filter((job) => !(job.workflow === event.workflow && job.set === source))
				workflows[event.workflow].state = 'writing'
				sets[source] = {
					state: 'reconciled',
					note: `kept ${event.kept}, changed ${event.changed}, added ${event.added}`,
					leash: event.leash,
				}
				reconciliation = {
					set: source,
					workflow: event.workflow,
					outcome: event.outcome,
					kept: event.kept,
					changed: event.changed,
					added: event.added,
				}
				if (event.leash === 'stops') held.set(source, [...(event.restores ?? [])])
				else for (const between of event.restores ?? []) connectionAt(between).strain = undefined
			}
			if (event.kind === 'select') {
				if (!source) throw new Error('A lookup needs a source: nothing has landed yet')
				// The lookup is over declarations, not a judgement: every workflow that
				// declares a role for the source picks the change up.
				for (const workflow of run.workflows) {
					if (workflow.roles[source]) workflows[workflow.id].state = 'selected'
				}
			}
		}
		return {
			index,
			title: step.title,
			narration: step.narration,
			source,
			sets: structuredClone(sets),
			connections: structuredClone(connections),
			workflows: structuredClone(workflows),
			awaitingApproval: [...held.keys()],
			reconciliation: reconciliation && { ...reconciliation },
			jobs: structuredClone(jobs),
			settled,
			focus,
		}
	})
}
