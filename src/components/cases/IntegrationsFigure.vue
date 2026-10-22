<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from '../../composables/useLang'
import type { FlowId } from './figures'

type NodeId = 'kafka' | 'push' | 'courier' | 'idea' | 'redis' | 'postgres'

const props = defineProps<{
  /** the flow to light up; none shows the whole map evenly */
  flow?: FlowId | null
  /** bumps when the visitor picks a flow, which sends a message along it */
  pulse?: number
  animate?: boolean
}>()

const { t } = useLang()

const ORDER: NodeId[] = ['kafka', 'push', 'courier', 'idea', 'redis', 'postgres']
/** which nodes a flow touches and which way the messages go */
const FLOWS: Record<FlowId, { nodes: NodeId[]; both: boolean }> = {
  notify: { nodes: ['kafka', 'push'], both: false },
  courier: { nodes: ['courier'], both: true },
  search: { nodes: ['redis', 'postgres'], both: true },
  idea: { nodes: ['idea'], both: true },
}

const W = 146
const H = 52
const CORE = { x: 168, y: 132, w: 84, h: 56 }
const rows = [20, 134, 248]

const nodes = computed(() =>
  ORDER.map((id, i) => {
    const left = i < 3
    const x = left ? 0 : 420 - W
    const y = rows[i % 3]
    const from: [number, number] = [left ? CORE.x : CORE.x + CORE.w, CORE.y + CORE.h / 2 + ((i % 3) - 1) * 16]
    const to: [number, number] = [left ? x + W : x, y + H / 2]
    const mid = (from[0] + to[0]) / 2
    const d = `M${from[0]} ${from[1]}C${mid} ${from[1]} ${mid} ${to[1]} ${to[0]} ${to[1]}`
    const active = props.flow ? FLOWS[props.flow].nodes.includes(id) : false
    return { id, ...t.value.cases.events.nodes[id], x, y, from, to, d, active }
  }),
)

const both = computed(() => (props.flow ? FLOWS[props.flow].both : false))
</script>

<template>
  <svg class="dg integrations" :class="{ focused: !!flow }" viewBox="0 0 420 320" aria-hidden="true">
    <g v-for="node in nodes" :key="node.id" :class="{ active: node.active }">
      <path :d="node.d" class="link" />
      <circle :cx="node.to[0]" :cy="node.to[1]" r="3.5" class="joint" />
      <circle :cx="node.from[0]" :cy="node.from[1]" r="3.5" class="joint" />
      <!-- a message along the link; it runs a few times after a pick, then rests -->
      <template v-if="node.active && animate">
        <circle :key="`out-${pulse}`" r="5" class="message">
          <animateMotion :path="node.d" dur="1.4s" repeatCount="3" fill="freeze" />
        </circle>
        <circle v-if="both" :key="`back-${pulse}`" r="5" class="message message-back">
          <animateMotion :path="node.d" dur="1.4s" begin="0.7s" repeatCount="3" keyPoints="1;0" keyTimes="0;1" calcMode="linear" fill="freeze" />
        </circle>
      </template>
    </g>

    <rect v-bind="{ x: CORE.x, y: CORE.y, width: CORE.w, height: CORE.h }" rx="12" class="dg-task core" />
    <foreignObject :x="CORE.x" :y="CORE.y" :width="CORE.w" :height="CORE.h">
      <div class="dg-fo stack core-text">
        <span>{{ t.cases.events.core }}</span>
        <span class="dg-fo-note">Spring Boot</span>
      </div>
    </foreignObject>

    <g v-for="node in nodes" :key="`${node.id}-box`" class="node" :class="{ active: node.active }">
      <rect :x="node.x" :y="node.y" :width="W" :height="H" rx="12" class="dg-task" />
      <foreignObject :x="node.x" :y="node.y" :width="W" :height="H">
        <div class="dg-fo stack">
          <span>{{ node.name }}</span>
          <span class="dg-fo-note">{{ node.note }}</span>
        </div>
      </foreignObject>
    </g>
  </svg>
</template>

<style scoped>
.stack {
  flex-direction: column;
  gap: 1px;
  font-size: 14px;
}

.stack .dg-fo-note {
  font-size: 13px;
}

.core {
  fill: var(--ink);
  stroke: var(--ink);
}

.core-text,
.core-text .dg-fo-note {
  color: var(--sheet);
}

.link {
  fill: none;
  stroke: var(--ink-3);
  stroke-width: 1.4;
  transition:
    stroke 200ms ease,
    stroke-width 200ms ease;
}

.joint {
  fill: var(--sheet);
  stroke: var(--ink);
  stroke-width: 1.5;
}

.node rect {
  transition:
    fill 200ms ease,
    stroke-width 200ms ease;
}

.node,
.integrations g {
  transition: opacity 200ms ease;
}

/* with a flow picked, the rest of the map steps back */
.focused g:not(.active) {
  opacity: 0.4;
}

.active .link {
  stroke: var(--ink);
  stroke-width: 2.6;
}

.node.active rect {
  fill: color-mix(in srgb, var(--mark) 45%, var(--sheet));
  stroke-width: 2.6;
}

.message {
  fill: var(--viz-2);
  stroke: var(--sheet);
  stroke-width: 2;
}

.message-back {
  fill: var(--mark-ink);
}
</style>
