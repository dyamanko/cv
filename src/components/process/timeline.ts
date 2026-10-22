import type { StopId } from './layout'

export type TaskState = 'idle' | 'active' | 'incident' | 'retry' | 'done'
export type Callout = 'incident' | 'retry' | 'resolved' | 'escalated' | 'limit' | null

/**
 * What happens when the external call fails:
 * - known: the error matches a pattern, the retry succeeds, the request goes on;
 * - unknown: no pattern matches, so the job goes straight to an admin;
 * - limit: the retries keep failing, loop protection stops them and hands over to an admin.
 */
export type Scenario = 'known' | 'unknown' | 'limit'
export const SCENARIOS: Scenario[] = ['known', 'unknown', 'limit']

export interface RunState {
  start: boolean
  approvals: number
  approval: TaskState
  gateway: boolean
  service: TaskState
  fulfil: TaskState
  end: boolean
  callout: Callout
  /** retry attempt shown in the callout */
  attempt: number
}

interface Timeline {
  /** where the token is at a given moment (ms); between two different stops it travels */
  frames: [number, StopId][]
  duration: number
  service: (time: number) => { state: TaskState; callout: Callout; attempt: number }
  /** the request reaches the end event */
  completes: boolean
}

// the part every scenario shares: approval, gateway, the call that fails
const UP_TO_SERVICE: [number, StopId][] = [
  [0, 'start'],
  [700, 'approval'],
  [2100, 'approval'],
  [2550, 'gateway'],
  [2850, 'gateway'],
  [3350, 'service'],
]
const FAILS_AT = 3650

const TIMELINES: Record<Scenario, Timeline> = {
  known: {
    frames: [...UP_TO_SERVICE, [5600, 'service'], [6100, 'fulfil'], [6900, 'fulfil'], [7400, 'end']],
    duration: 7400,
    completes: true,
    service: (t) =>
      t < 3350
        ? { state: 'idle', callout: null, attempt: 1 }
        : t < FAILS_AT
          ? { state: 'active', callout: null, attempt: 1 }
          : t < 4500
            ? { state: 'incident', callout: 'incident', attempt: 1 }
            : t < 5300
              ? { state: 'retry', callout: 'retry', attempt: 2 }
              : t < 5600
                ? { state: 'active', callout: 'resolved', attempt: 2 }
                : { state: 'done', callout: 'resolved', attempt: 2 },
  },
  unknown: {
    frames: [...UP_TO_SERVICE, [5000, 'service']],
    duration: 5000,
    completes: false,
    service: (t) =>
      t < 3350
        ? { state: 'idle', callout: null, attempt: 1 }
        : t < FAILS_AT
          ? { state: 'active', callout: null, attempt: 1 }
          : t < 4500
            ? { state: 'incident', callout: 'incident', attempt: 1 }
            : { state: 'incident', callout: 'escalated', attempt: 1 },
  },
  limit: {
    frames: [...UP_TO_SERVICE, [7200, 'service']],
    duration: 7200,
    completes: false,
    service: (t) => {
      if (t < 3350) return { state: 'idle', callout: null, attempt: 1 }
      if (t < FAILS_AT) return { state: 'active', callout: null, attempt: 1 }
      // fail, retry, fail, retry, fail: then the limit stops it
      const steps: [number, TaskState, Callout, number][] = [
        [4300, 'incident', 'incident', 1],
        [4900, 'retry', 'retry', 2],
        [5500, 'incident', 'incident', 2],
        [6100, 'retry', 'retry', 3],
        [6700, 'incident', 'incident', 3],
      ]
      for (const [until, state, callout, attempt] of steps) if (t < until) return { state, callout, attempt }
      return { state: 'incident', callout: 'limit', attempt: 3 }
    },
  },
}

export function timelineFor(scenario: Scenario) {
  return TIMELINES[scenario]
}

/** the token fades into the last element it reached */
export const FADE_OUT = 300

export function stateAt(time: number, scenario: Scenario = 'known'): RunState {
  const tl = TIMELINES[scenario]
  const service = tl.service(time)
  const fulfil: TaskState = !tl.completes || time < 6100 ? 'idle' : time < 6900 ? 'active' : 'done'

  return {
    start: time >= 200,
    approvals: time < 1000 ? 0 : time < 1400 ? 1 : time < 1800 ? 2 : 3,
    approval: time < 700 ? 'idle' : time < 2100 ? 'active' : 'done',
    gateway: time >= 2850,
    service: service.state,
    fulfil,
    end: tl.completes && time >= tl.duration,
    callout: service.callout,
    attempt: service.attempt,
  }
}

export const finalState = (scenario: Scenario): RunState => stateAt(Number.POSITIVE_INFINITY, scenario)
export const IDLE_STATE: RunState = { ...stateAt(-1), start: false }
