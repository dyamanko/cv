<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from '../../composables/useLang'

const { t } = useLang()

const W = 146
const H = 52
const CORE = { x: 168, y: 132, w: 84, h: 56 }
const rows = [20, 134, 248]

const nodes = computed(() =>
  t.value.cases.integrations.nodes.map((node, i) => {
    const left = i < 3
    const x = left ? 0 : 420 - W
    const y = rows[i % 3]
    // connector from the core edge to the node edge
    const from: [number, number] = [left ? CORE.x : CORE.x + CORE.w, CORE.y + CORE.h / 2 + (i % 3 - 1) * 16]
    const to: [number, number] = [left ? x + W : x, y + H / 2]
    return { ...node, x, y, from, to }
  }),
)
</script>

<template>
  <svg class="dg" viewBox="0 0 420 320" aria-hidden="true">
    <g v-for="node in nodes" :key="node.name">
      <path
        :d="`M${node.from[0]} ${node.from[1]}C${(node.from[0] + node.to[0]) / 2} ${node.from[1]} ${(node.from[0] + node.to[0]) / 2} ${node.to[1]} ${node.to[0]} ${node.to[1]}`"
        class="dg-flow link"
      />
      <circle :cx="node.to[0]" :cy="node.to[1]" r="3.5" class="joint" />
      <circle :cx="node.from[0]" :cy="node.from[1]" r="3.5" class="joint" />
    </g>

    <rect v-bind="{ x: CORE.x, y: CORE.y, width: CORE.w, height: CORE.h }" rx="12" class="dg-task core" />
    <foreignObject :x="CORE.x" :y="CORE.y" :width="CORE.w" :height="CORE.h">
      <div class="dg-fo stack">
        <span class="core-name">{{ t.cases.integrations.core }}</span>
        <span class="dg-fo-note">{{ t.cases.integrations.coreNote }}</span>
      </div>
    </foreignObject>

    <g v-for="node in nodes" :key="`${node.name}-box`">
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

.core + foreignObject .dg-fo,
.core + foreignObject .dg-fo-note {
  color: var(--sheet);
}

.core-name {
  font-size: 15px;
}

.link {
  stroke: var(--ink-3);
  stroke-width: 1.4;
}

.joint {
  fill: var(--sheet);
  stroke: var(--ink);
  stroke-width: 1.5;
}
</style>
