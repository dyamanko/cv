export type Orientation = 'h' | 'v'
export type StopId = 'start' | 'approval' | 'gateway' | 'service' | 'fulfil' | 'end'

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

export interface Circle {
  cx: number
  cy: number
  r: number
}

export interface Label extends Box {
  align: 'start' | 'center' | 'end'
}

export interface ProcessLayout {
  width: number
  height: number
  start: Circle
  end: Circle
  rejected: Circle
  gateway: { cx: number; cy: number; d: number }
  approval: Box
  service: Box
  fulfil: Box
  labels: Record<'start' | 'end' | 'rejected' | 'gateway' | 'yes' | 'no', Label>
  /** sequence flows on the happy path, in order */
  flows: string[]
  noFlow: string
  callout: Box
  calloutPointer: string
  /** the straight line a token travels; tasks sit on it */
  route: [number, number][]
}

const horizontal: ProcessLayout = {
  width: 1080,
  height: 300,
  start: { cx: 56, cy: 140, r: 20 },
  approval: { x: 136, y: 100, w: 156, h: 80 },
  gateway: { cx: 372, cy: 140, d: 28 },
  service: { x: 468, y: 100, w: 176, h: 80 },
  fulfil: { x: 708, y: 100, w: 156, h: 80 },
  end: { cx: 944, cy: 140, r: 20 },
  rejected: { cx: 372, cy: 262, r: 18 },
  labels: {
    start: { x: 6, y: 168, w: 100, h: 44, align: 'center' },
    end: { x: 894, y: 168, w: 100, h: 44, align: 'center' },
    rejected: { x: 398, y: 250, w: 140, h: 24, align: 'start' },
    gateway: { x: 302, y: 76, w: 140, h: 24, align: 'center' },
    yes: { x: 404, y: 112, w: 60, h: 22, align: 'center' },
    no: { x: 382, y: 186, w: 60, h: 22, align: 'start' },
  },
  flows: ['M76 140H134', 'M292 140H342', 'M400 140H466', 'M644 140H706', 'M864 140H922'],
  noFlow: 'M372 168V242',
  callout: { x: 456, y: 30, w: 200, h: 40 },
  calloutPointer: 'M556 70V98',
  route: [
    [56, 140],
    [944, 140],
  ],
}

const vertical: ProcessLayout = {
  width: 360,
  height: 650,
  start: { cx: 130, cy: 36, r: 18 },
  approval: { x: 50, y: 84, w: 160, h: 74 },
  gateway: { cx: 130, cy: 226, d: 28 },
  service: { x: 50, y: 308, w: 160, h: 74 },
  fulfil: { x: 50, y: 470, w: 160, h: 74 },
  end: { cx: 130, cy: 610, r: 20 },
  rejected: { cx: 290, cy: 280, r: 18 },
  labels: {
    start: { x: 158, y: 24, w: 190, h: 24, align: 'start' },
    end: { x: 160, y: 598, w: 190, h: 24, align: 'start' },
    rejected: { x: 230, y: 304, w: 120, h: 24, align: 'center' },
    gateway: { x: 0, y: 182, w: 116, h: 22, align: 'end' },
    yes: { x: 138, y: 264, w: 50, h: 22, align: 'start' },
    no: { x: 176, y: 200, w: 60, h: 22, align: 'center' },
  },
  flows: ['M130 54V82', 'M130 158V196', 'M130 254V306', 'M130 382V468', 'M130 544V588'],
  noFlow: 'M158 226H290V260',
  callout: { x: 146, y: 398, w: 206, h: 40 },
  calloutPointer: 'M178 398V384',
  route: [
    [130, 36],
    [130, 610],
  ],
}

export const layouts: Record<Orientation, ProcessLayout> = { h: horizontal, v: vertical }

function center(box: Box): [number, number] {
  return [box.x + box.w / 2, box.y + box.h / 2]
}

/** Distance along the route at which the token rests on each element. */
export function stopsFor(layout: ProcessLayout): Record<StopId, number> {
  const [x0, y0] = layout.route[0]
  const along = ([x, y]: [number, number]) => Math.abs(x - x0) + Math.abs(y - y0)
  return {
    start: 0,
    approval: along(center(layout.approval)),
    gateway: along([layout.gateway.cx, layout.gateway.cy]),
    service: along(center(layout.service)),
    fulfil: along(center(layout.fulfil)),
    end: along([layout.end.cx, layout.end.cy]),
  }
}

export function routeLength(layout: ProcessLayout): number {
  let total = 0
  for (let i = 1; i < layout.route.length; i++) {
    const [ax, ay] = layout.route[i - 1]
    const [bx, by] = layout.route[i]
    total += Math.hypot(bx - ax, by - ay)
  }
  return total
}

export function pointAt(layout: ProcessLayout, distance: number): [number, number] {
  let left = distance
  for (let i = 1; i < layout.route.length; i++) {
    const [ax, ay] = layout.route[i - 1]
    const [bx, by] = layout.route[i]
    const len = Math.hypot(bx - ax, by - ay)
    if (left <= len) {
      const k = len === 0 ? 0 : left / len
      return [ax + (bx - ax) * k, ay + (by - ay) * k]
    }
    left -= len
  }
  return layout.route[layout.route.length - 1]
}

export function routePath(layout: ProcessLayout): string {
  return layout.route.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ')
}
