<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useLang } from '../../composables/useLang'
import AppIcon from '../AppIcon.vue'
import { layouts, pointAt, routeLength, routePath, stopsFor, type Box, type Orientation } from './layout'
import { DURATION, FADE_OUT, FINAL_STATE, FRAMES, IDLE_STATE, stateAt, type RunState } from './timeline'

const { t } = useLang()

const root = ref<HTMLElement | null>(null)
const canvas = ref<HTMLElement | null>(null)
const token = ref<SVGGElement | null>(null)
const tokenDot = ref<SVGCircleElement | null>(null)
const wash = ref<SVGPathElement | null>(null)

const orientation = ref<Orientation>('h')
const layout = computed(() => layouts[orientation.value])
const hovered = ref<number | null>(null)
const running = ref(false)

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const state = reactive<RunState>({ ...(reduceMotion.matches ? FINAL_STATE : IDLE_STATE) })

const tasks = computed(() => [
  { id: 'approval', step: 0, box: layout.value.approval, label: t.value.process.approval, icon: 'user', state: state.approval },
  { id: 'service', step: 2, box: layout.value.service, label: t.value.process.service, icon: 'gear', state: state.service },
  { id: 'fulfil', step: 3, box: layout.value.fulfil, label: t.value.process.fulfil, icon: 'user', state: state.fulfil },
])

const labelText = computed(() => {
  const p = t.value.process
  return { start: p.start, end: p.end, rejected: p.rejected, gateway: p.gateway, yes: p.yes, no: p.no }
})

const calloutText = computed(() => {
  const p = t.value.process
  return state.callout === 'incident' ? p.incident : state.callout === 'retry' ? p.retry : p.resolved
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

function setState(next: RunState) {
  for (const key of Object.keys(next) as (keyof RunState)[]) {
    if (state[key] !== next[key]) (state as Record<string, unknown>)[key] = next[key]
  }
}

function cancel() {
  cancelAnimationFrame(frame)
  animations.forEach((a) => a.cancel())
  animations = []
}

function build(startAt: number) {
  if (!token.value || !tokenDot.value || !wash.value) return
  cancel()
  const stops = stopsFor(layout.value)
  const length = routeLength(layout.value)

  const keyframes = FRAMES.map(([time, stop], i) => {
    const moving = i < FRAMES.length - 1 && FRAMES[i + 1][1] !== stop
    const [x, y] = pointAt(layout.value, stops[stop])
    return {
      offset: time / DURATION,
      easing: moving ? MOVE_EASING : 'linear',
      transform: `translate(${x}px, ${y}px)`,
      strokeDashoffset: `${length - stops[stop]}`,
    }
  })

  wash.value.style.strokeDasharray = `${length}`
  const options: KeyframeAnimationOptions = { duration: DURATION, fill: 'forwards' }
  animations = [
    token.value.animate(keyframes.map(({ offset, easing, transform }) => ({ offset, easing, transform })), options),
    wash.value.animate(keyframes.map(({ offset, easing, strokeDashoffset }) => ({ offset, easing, strokeDashoffset })), options),
    tokenDot.value.animate(
      [
        { opacity: 0, transform: 'scale(0.6)' },
        { opacity: 1, transform: 'scale(1)', offset: 200 / (DURATION + FADE_OUT) },
        { opacity: 1, transform: 'scale(1)', offset: DURATION / (DURATION + FADE_OUT) },
        { opacity: 0, transform: 'scale(0.6)' },
      ],
      { duration: DURATION + FADE_OUT, fill: 'forwards', easing: 'ease-out' },
    ),
  ]
  animations.forEach((a) => (a.currentTime = startAt))

  running.value = true
  const tick = () => {
    const time = Number(animations[0]?.currentTime ?? DURATION)
    setState(stateAt(time))
    if (time < DURATION + FADE_OUT) frame = requestAnimationFrame(tick)
    else running.value = false
  }
  tick()
}

function showFinal() {
  cancel()
  running.value = false
  setState(FINAL_STATE)
  if (wash.value) {
    wash.value.style.strokeDasharray = ''
    wash.value.style.strokeDashoffset = ''
  }
}

/** before the first run the highlighter is fully rolled up */
function hideWash() {
  if (!wash.value) return
  const length = routeLength(layout.value)
  wash.value.style.strokeDasharray = `${length}`
  wash.value.style.strokeDashoffset = `${length}`
}

function replay() {
  if (reduceMotion.matches) return showFinal()
  build(0)
}

let resizeObserver: ResizeObserver | null = null
let visibility: IntersectionObserver | null = null

// a layout switch mid-run rebuilds the keyframes and continues from the same moment
watch(orientation, async () => {
  await nextTick()
  if (animations.length) {
    const time = Number(animations[0].currentTime ?? 0)
    if (time < DURATION + FADE_OUT) build(time)
    else showFinal()
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

  if (reduceMotion.matches) return showFinal()
  hideWash()

  // run once, when the diagram is actually on screen
  visibility = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      visibility?.disconnect()
      build(0)
    },
    { threshold: 0.6 },
  )
  visibility.observe(canvas.value ?? root.value)
})

onBeforeUnmount(() => {
  cancel()
  resizeObserver?.disconnect()
  visibility?.disconnect()
})
</script>

<template>
  <figure ref="root" class="process">
    <div ref="canvas" class="canvas">
      <svg
        class="diagram"
        :viewBox="`0 0 ${layout.width} ${layout.height}`"
        role="img"
        :aria-label="t.process.label"
      >
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
        <g class="gateway" :class="{ done: state.gateway, hovered: hovered === 1 }" @pointerenter="hovered = 1" @pointerleave="hovered = null">
          <polygon :points="gatewayPoints()" />
          <path
            :d="`M${layout.gateway.cx - 8} ${layout.gateway.cy - 8}l16 16M${layout.gateway.cx + 8} ${layout.gateway.cy - 8}l-16 16`"
            class="gateway-x"
          />
        </g>

        <!-- tasks -->
        <g
          v-for="task in tasks"
          :key="task.id"
          class="task"
          :class="[task.state, { hovered: hovered === task.step }]"
          @pointerenter="hovered = task.step"
          @pointerleave="hovered = null"
        >
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
          <foreignObject :x="task.box.x + 22" :y="task.box.y + 8" :width="task.box.w - 44" :height="task.box.h - (task.id === 'approval' ? 28 : 16)">
            <div class="fo fo-task">{{ task.label }}</div>
          </foreignObject>
        </g>

        <!-- multi-instance marker: one bar per approver -->
        <g class="mi">
          <path v-for="(d, i) in miMarker(layout.approval)" :key="d" :d="d" :class="{ approved: i < state.approvals }" />
        </g>

        <!-- step badges, matched by the list under the diagram -->
        <g class="badges" aria-hidden="true">
          <g
            v-for="(pos, i) in [
              [layout.approval.x + layout.approval.w, layout.approval.y],
              [layout.gateway.cx + layout.gateway.d - 4, layout.gateway.cy - layout.gateway.d + 4],
              [layout.service.x + layout.service.w, layout.service.y],
              [layout.fulfil.x + layout.fulfil.w, layout.fulfil.y],
            ]"
            :key="i"
            class="badge"
            :transform="`translate(${pos[0]} ${pos[1]})`"
          >
            <circle r="11" />
            <text dy="0.35em">{{ i + 1 }}</text>
          </g>
        </g>

        <!-- incident callout over the service task -->
        <g class="callout" :class="state.callout" aria-hidden="true">
          <Transition name="callout" mode="out-in">
            <g v-if="state.callout" :key="state.callout">
              <path :d="layout.calloutPointer" class="callout-pointer" />
              <rect :x="layout.callout.x" :y="layout.callout.y" :width="layout.callout.w" :height="layout.callout.h" rx="20" />
              <foreignObject :x="layout.callout.x" :y="layout.callout.y" :width="layout.callout.w" :height="layout.callout.h">
                <div class="fo fo-callout">
                  <span class="callout-icon">{{ state.callout === 'incident' ? '!' : state.callout === 'retry' ? '↻' : '✓' }}</span>
                  {{ calloutText }}
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

    <figcaption class="caption">
      <div class="caption-row">
        <p>{{ t.process.caption }}</p>
        <button v-if="!reduceMotion.matches" type="button" class="replay" :disabled="running" @click="replay">
          <AppIcon name="replay" :size="16" />
          {{ t.process.replay }}
        </button>
      </div>
      <ol class="steps">
        <li
          v-for="(step, i) in t.process.steps"
          :key="step.title"
          :class="{ hovered: hovered === i }"
          @pointerenter="hovered = i"
          @pointerleave="hovered = null"
        >
          <span class="step-number" aria-hidden="true">{{ i + 1 }}</span>
          <span>
            <strong>{{ step.title }}.</strong>
            {{ step.text }}
          </span>
        </li>
      </ol>
    </figcaption>
  </figure>
</template>

<style scoped>
.process {
  display: grid;
  gap: 20px;
}

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

.task.hovered rect,
.gateway.hovered polygon {
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
.callout.incident .callout-pointer {
  stroke: var(--critical);
}

.callout.resolved rect,
.callout.resolved .callout-pointer {
  stroke: var(--mark-ink);
}

.fo-callout {
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.callout-icon {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--sheet);
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
}

.callout.incident .callout-icon {
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

.badge circle {
  fill: var(--ink);
}

.badge text {
  fill: var(--sheet);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
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

.caption {
  display: grid;
  gap: 20px;
  font-size: 16px;
  color: var(--ink-2);
}

.caption-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px 32px;
}

.caption-row p {
  max-width: 44em;
  color: var(--ink);
}

.replay {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid var(--rule);
  border-radius: 999px;
  background: var(--sheet);
  color: var(--ink);
  font-size: 15px;
  font-weight: 560;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition:
    transform 140ms var(--ease-out),
    opacity 200ms ease,
    border-color 160ms ease;
}

.replay:active:not(:disabled) {
  transform: scale(0.97);
}

.replay:disabled {
  opacity: 0.45;
  cursor: default;
}

@media (hover: hover) and (pointer: fine) {
  .replay:not(:disabled):hover {
    border-color: var(--ink);
  }
}

@media (pointer: coarse) {
  .replay {
    min-height: 44px;
  }
}

.steps {
  display: grid;
  gap: 14px 28px;
}

.steps li {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 12px;
  align-items: start;
  line-height: 1.45;
}

.steps strong {
  color: var(--ink);
  font-weight: 640;
}

.step-number {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--sheet);
  font-size: 13px;
  font-weight: 700;
  transition: box-shadow 160ms ease;
}

.steps li.hovered .step-number {
  box-shadow: 0 0 0 4px var(--mark);
}

@media (min-width: 720px) {
  .steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1040px) {
  .steps {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
