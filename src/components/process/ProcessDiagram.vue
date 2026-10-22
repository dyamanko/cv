<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useLang } from '../../composables/useLang'
import { layouts, pointAt, routeLength, routePath, stopsFor, type Box, type Orientation } from './layout'
import { FADE_OUT, finalState, IDLE_STATE, stateAt, timelineFor, type RunState, type Scenario } from './timeline'

const props = defineProps<{
  scenario: Scenario
  /** bump to run the current scenario again */
  run: number
}>()

const emit = defineEmits<{
  state: [RunState]
  running: [boolean]
}>()

const { t } = useLang()

const root = ref<HTMLElement | null>(null)
const token = ref<SVGGElement | null>(null)
const tokenDot = ref<SVGCircleElement | null>(null)
const wash = ref<SVGPathElement | null>(null)

const orientation = ref<Orientation>('h')
const layout = computed(() => layouts[orientation.value])

// static HTML (no window) and reduced motion both show the finished run
const reduceMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
const animate = reduceMotion !== null && !reduceMotion.matches
const state = reactive<RunState>({ ...(animate ? IDLE_STATE : finalState(props.scenario)) })

const tasks = computed(() => [
  { id: 'approval', box: layout.value.approval, label: t.value.process.approval, icon: 'user', state: state.approval },
  { id: 'service', box: layout.value.service, label: t.value.process.service, icon: 'gear', state: state.service },
  { id: 'fulfil', box: layout.value.fulfil, label: t.value.process.fulfil, icon: 'user', state: state.fulfil },
])

const labelText = computed(() => {
  const p = t.value.process
  return { start: p.start, end: p.end, rejected: p.rejected, gateway: p.gateway, yes: p.yes, no: p.no }
})

const callout = computed(() => {
  const p = t.value.process
  switch (state.callout) {
    case 'incident':
      return { icon: '!', text: p.incident }
    case 'retry':
      return { icon: '↻', text: p.retry.replace('{n}', String(state.attempt)) }
    case 'resolved':
      return { icon: '✓', text: p.resolved }
    case 'escalated':
      return { icon: '→', text: p.escalated }
    case 'limit':
      return { icon: '■', text: p.limit }
    default:
      return null
  }
})

function gatewayPoints() {
  const { cx, cy, d } = layout.value.gateway
  return `${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`
}

function miMarker(box: Box) {
  const x = box.x + box.w / 2
  const y = box.y + box.h - 22
  return [-7, 0, 7].map((dx) => `M${x + dx} ${y}v12`)
}

/*
  The token and the highlighter are driven by WAAPI, so they keep moving
  while the page is still busy loading. A light rAF loop only reads the
  current time and flips the discrete states (approvals, incident, retry).
*/
const MOVE_EASING = 'cubic-bezier(0.77, 0, 0.175, 1)'
let animations: Animation[] = []
let frame = 0
let builtFor: Scenario = props.scenario

function setState(next: RunState) {
  let changed = false
  for (const key of Object.keys(next) as (keyof RunState)[]) {
    if (state[key] !== next[key]) {
      ;(state as Record<string, unknown>)[key] = next[key]
      changed = true
    }
  }
  if (changed) emit('state', { ...state })
}

function setRunning(value: boolean) {
  emit('running', value)
}

function cancel() {
  cancelAnimationFrame(frame)
  animations.forEach((a) => a.cancel())
  animations = []
}

function build(startAt: number) {
  if (!token.value || !tokenDot.value || !wash.value) return
  cancel()
  builtFor = props.scenario
  const { frames, duration } = timelineFor(props.scenario)
  const stops = stopsFor(layout.value)
  const length = routeLength(layout.value)

  const keyframes = frames.map(([time, stop], i) => {
    const moving = i < frames.length - 1 && frames[i + 1][1] !== stop
    const [x, y] = pointAt(layout.value, stops[stop])
    return {
      offset: time / duration,
      easing: moving ? MOVE_EASING : 'linear',
      transform: `translate(${x}px, ${y}px)`,
      strokeDashoffset: `${length - stops[stop]}`,
    }
  })

  wash.value.style.strokeDasharray = `${length}`
  const options: KeyframeAnimationOptions = { duration, fill: 'forwards' }
  animations = [
    token.value.animate(keyframes.map(({ offset, easing, transform }) => ({ offset, easing, transform })), options),
    wash.value.animate(keyframes.map(({ offset, easing, strokeDashoffset }) => ({ offset, easing, strokeDashoffset })), options),
    tokenDot.value.animate(
      [
        { opacity: 0, transform: 'scale(0.6)' },
        { opacity: 1, transform: 'scale(1)', offset: 200 / (duration + FADE_OUT) },
        { opacity: 1, transform: 'scale(1)', offset: duration / (duration + FADE_OUT) },
        { opacity: 0, transform: 'scale(0.6)' },
      ],
      { duration: duration + FADE_OUT, fill: 'forwards', easing: 'ease-out' },
    ),
  ]
  animations.forEach((a) => (a.currentTime = startAt))

  setRunning(true)
  const tick = () => {
    const time = Number(animations[0]?.currentTime ?? duration)
    setState(stateAt(time, builtFor))
    if (time < duration + FADE_OUT) frame = requestAnimationFrame(tick)
    else setRunning(false)
  }
  tick()
}

/** the finished run of the scenario, with the highlighter up to where the request stopped */
function showFinal() {
  cancel()
  setRunning(false)
  setState(finalState(props.scenario))
  if (!wash.value) return
  const { frames } = timelineFor(props.scenario)
  const length = routeLength(layout.value)
  const reached = stopsFor(layout.value)[frames[frames.length - 1][1]]
  wash.value.style.strokeDasharray = `${length}`
  wash.value.style.strokeDashoffset = `${length - reached}`
}

/** before the first run the highlighter is fully rolled up */
function hideWash() {
  if (!wash.value) return
  const length = routeLength(layout.value)
  wash.value.style.strokeDasharray = `${length}`
  wash.value.style.strokeDashoffset = `${length}`
}

function start() {
  if (!animate) return showFinal()
  build(0)
}

let resizeObserver: ResizeObserver | null = null
let visibility: IntersectionObserver | null = null

watch(
  () => [props.scenario, props.run],
  () => {
    visibility?.disconnect()
    start()
  },
)

// a layout switch mid-run rebuilds the keyframes and continues from the same moment
watch(orientation, async () => {
  await nextTick()
  if (animations.length) {
    const time = Number(animations[0].currentTime ?? 0)
    const { duration } = timelineFor(builtFor)
    if (time < duration + FADE_OUT) build(time)
    else showFinal()
  } else if (!animate) {
    showFinal()
  } else if (!state.start) {
    hideWash()
  }
})

onMounted(() => {
  if (!root.value) return
  resizeObserver = new ResizeObserver(([entry]) => {
    orientation.value = entry.contentRect.width >= 720 ? 'h' : 'v'
  })
  resizeObserver.observe(root.value)

  if (!animate) return showFinal()
  hideWash()
  emit('state', { ...state })

  // run once, when the diagram is actually on screen
  visibility = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      visibility?.disconnect()
      build(0)
    },
    { threshold: 0.5 },
  )
  visibility.observe(root.value)
})

onBeforeUnmount(() => {
  cancel()
  resizeObserver?.disconnect()
  visibility?.disconnect()
})
</script>

<template>
  <div ref="root" class="canvas">
    <svg class="diagram" :viewBox="`0 0 ${layout.width} ${layout.height}`" role="img" :aria-label="t.process.label">
      <defs>
        <marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
          <path d="M0 1 9 5 0 9Z" class="arrow-head" />
        </marker>
      </defs>

      <!-- highlighter under the executed path -->
      <path ref="wash" class="wash" :d="routePath(layout)" />

      <!-- the token slides under shapes: a task it enters lights up instead -->
      <g ref="token" class="token" aria-hidden="true">
        <circle ref="tokenDot" r="9" class="token-dot" />
      </g>

      <g class="flows">
        <path v-for="d in layout.flows" :key="d" :d="d" marker-end="url(#flow-arrow)" />
        <path :d="layout.noFlow" marker-end="url(#flow-arrow)" class="flow-muted" />
      </g>

      <!-- events -->
      <circle class="event" :class="{ done: state.start }" v-bind="layout.start" />
      <circle class="event event-end" :class="{ done: state.end }" v-bind="layout.end" />
      <circle class="event event-end event-muted" v-bind="layout.rejected" />

      <!-- gateway -->
      <g class="gateway" :class="{ done: state.gateway }">
        <polygon :points="gatewayPoints()" />
        <path
          :d="`M${layout.gateway.cx - 8} ${layout.gateway.cy - 8}l16 16M${layout.gateway.cx + 8} ${layout.gateway.cy - 8}l-16 16`"
          class="gateway-x"
        />
      </g>

      <!-- tasks -->
      <g v-for="task in tasks" :key="task.id" class="task" :class="task.state">
        <rect :x="task.box.x" :y="task.box.y" :width="task.box.w" :height="task.box.h" rx="12" />
        <g class="task-icon" :transform="`translate(${task.box.x + 10} ${task.box.y + 10})`">
          <template v-if="task.icon === 'gear'">
            <circle cx="8" cy="8" r="6" class="gear-teeth" />
            <circle cx="8" cy="8" r="3.4" />
          </template>
          <template v-else>
            <circle cx="8" cy="5" r="3" />
            <path d="M2.5 15c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6" />
          </template>
        </g>
        <foreignObject
          :x="task.box.x + 22"
          :y="task.box.y + 8"
          :width="task.box.w - 44"
          :height="task.box.h - (task.id === 'approval' ? 28 : 16)"
        >
          <div class="fo fo-task">{{ task.label }}</div>
        </foreignObject>
      </g>

      <!-- multi-instance marker: one bar per approver -->
      <g class="mi">
        <path v-for="(d, i) in miMarker(layout.approval)" :key="d" :d="d" :class="{ approved: i < state.approvals }" />
      </g>

      <!-- what happened to the failed call -->
      <g class="callout" :class="state.callout" aria-hidden="true">
        <Transition name="callout" mode="out-in">
          <g v-if="callout" :key="`${state.callout}-${state.attempt}`">
            <path :d="layout.calloutPointer" class="callout-pointer" />
            <rect :x="layout.callout.x" :y="layout.callout.y" :width="layout.callout.w" :height="layout.callout.h" rx="14" />
            <foreignObject :x="layout.callout.x" :y="layout.callout.y" :width="layout.callout.w" :height="layout.callout.h">
              <div class="fo fo-callout">
                <span class="callout-icon">{{ callout.icon }}</span>
                <span>{{ callout.text }}</span>
              </div>
            </foreignObject>
          </g>
        </Transition>
      </g>

      <!-- labels -->
      <foreignObject v-for="(box, key) in layout.labels" :key="key" :x="box.x" :y="box.y" :width="box.w" :height="box.h">
        <div class="fo fo-label" :class="[`align-${box.align}`, { 'fo-flow': key === 'yes' || key === 'no' }]">
          {{ labelText[key] }}
        </div>
      </foreignObject>
    </svg>
  </div>
</template>

<style scoped>
.canvas {
  border: 1px solid var(--rule);
  border-radius: 16px;
  background-color: var(--sheet);
  background-image: radial-gradient(var(--dot) 1px, transparent 1.2px);
  background-size: 22px 22px;
  background-position: 11px 11px;
  padding: clamp(12px, 2.4vw, 28px);
}

.diagram {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  font-family: var(--font-text);
}

.wash {
  fill: none;
  stroke: var(--mark);
  stroke-width: 18;
  stroke-linecap: round;
}

.flows path {
  fill: none;
  stroke: var(--ink);
  stroke-width: 1.6;
}

.flows .flow-muted {
  stroke: var(--ink-3);
}

.arrow-head {
  fill: var(--ink);
}

.event {
  fill: var(--sheet);
  stroke: var(--ink);
  stroke-width: 1.8;
  transition: fill 240ms ease;
}

.event-end {
  stroke-width: 4;
}

.event-muted {
  stroke: var(--ink-3);
}

.event.done,
.gateway.done polygon,
.task.done rect {
  fill: color-mix(in srgb, var(--mark) 55%, var(--sheet));
}

.gateway polygon {
  fill: var(--sheet);
  stroke: var(--ink);
  stroke-width: 1.8;
  stroke-linejoin: round;
  transition: fill 240ms ease;
}

.gateway-x {
  stroke: var(--ink);
  stroke-width: 2.4;
  stroke-linecap: round;
}

.task rect {
  fill: var(--sheet);
  stroke: var(--ink);
  stroke-width: 1.8;
  transition:
    fill 240ms ease,
    stroke 240ms ease,
    stroke-width 240ms ease;
}

.task.active rect,
.task.retry rect {
  fill: color-mix(in srgb, var(--mark) 22%, var(--sheet));
  stroke-width: 3;
}

.task.incident rect {
  fill: var(--critical-wash);
  stroke: var(--critical);
  stroke-width: 3;
}

.task-icon {
  fill: none;
  stroke: var(--ink-2);
  stroke-width: 1.5;
  stroke-linecap: round;
}

.gear-teeth {
  stroke-width: 3;
  stroke-dasharray: 2.4 2.31;
}

.mi path {
  stroke: var(--ink);
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke 200ms ease;
}

.mi path.approved {
  stroke: var(--mark-ink);
  stroke-width: 3;
}

.token-dot {
  fill: var(--mark-ink);
  stroke: var(--sheet);
  stroke-width: 3;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}

.callout rect {
  fill: var(--sheet);
  stroke: var(--ink);
  stroke-width: 1.6;
  transition: stroke 200ms ease;
}

.callout-pointer {
  stroke: var(--ink);
  stroke-width: 1.6;
}

.callout.incident rect,
.callout.incident .callout-pointer,
.callout.escalated rect,
.callout.escalated .callout-pointer,
.callout.limit rect,
.callout.limit .callout-pointer {
  stroke: var(--critical);
}

.callout.resolved rect,
.callout.resolved .callout-pointer {
  stroke: var(--mark-ink);
}

.fo-callout {
  justify-content: center;
  gap: 8px;
  padding-inline: 12px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  text-wrap: balance;
}

.callout-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--sheet);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.callout.incident .callout-icon,
.callout.escalated .callout-icon,
.callout.limit .callout-icon {
  background: var(--critical);
}

.callout.resolved .callout-icon {
  background: var(--mark-ink);
}

.callout-enter-active,
.callout-leave-active {
  transition:
    opacity 180ms ease-out,
    transform 180ms var(--ease-out);
}

.callout-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.callout-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .callout-enter-active,
  .callout-leave-active {
    transition: opacity 120ms ease;
  }

  .callout-enter-from {
    transform: none;
  }
}

.fo {
  display: flex;
  align-items: center;
  height: 100%;
  color: var(--ink);
  line-height: 1.2;
}

.fo-task {
  justify-content: center;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  text-wrap: balance;
}

.fo-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-2);
}

.fo-flow {
  font-size: 13px;
  font-style: italic;
}

.align-start {
  justify-content: flex-start;
  text-align: left;
}

.align-center {
  justify-content: center;
  text-align: center;
}

.align-end {
  justify-content: flex-end;
  text-align: right;
}
</style>
