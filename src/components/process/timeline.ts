import type { StopId } from './layout'

export type TaskState = 'idle' | 'active' | 'incident' | 'retry' | 'done'
export type Callout = 'incident' | 'retry' | 'resolved' | null

export interface RunState {
  start: boolean
  approvals: number
  approval: TaskState
  gateway: boolean
  service: TaskState
  fulfil: TaskState
  end: boolean
  callout: Callout
}

/** Where the token is at a given moment (ms). Between two different stops it travels. */
export const FRAMES: [number, StopId][] = [
  [0, 'start'],
  [700, 'approval'],
  [2100, 'approval'],
  [2550, 'gateway'],
  [2850, 'gateway'],
  [3350, 'service'],
  [5600, 'service'],
  [6100, 'fulfil'],
  [6900, 'fulfil'],
  [7400, 'end'],
]

export const DURATION = 7400
/** the token fades into the end event */
export const FADE_OUT = 300

export function stateAt(time: number): RunState {
  const service: TaskState =
    time < 3350 ? 'idle' : time < 3650 ? 'active' : time < 4500 ? 'incident' : time < 5300 ? 'retry' : time < 5600 ? 'active' : 'done'

  return {
    start: time >= 200,
    approvals: time < 1000 ? 0 : time < 1400 ? 1 : time < 1800 ? 2 : 3,
    approval: time < 700 ? 'idle' : time < 2100 ? 'active' : 'done',
    gateway: time >= 2850,
    service,
    fulfil: time < 6100 ? 'idle' : time < 6900 ? 'active' : 'done',
    end: time >= DURATION,
    callout: time < 3650 ? null : time < 4500 ? 'incident' : time < 5300 ? 'retry' : 'resolved',
  }
}

export const FINAL_STATE = stateAt(Number.POSITIVE_INFINITY)
export const IDLE_STATE: RunState = { ...stateAt(-1), start: false }
