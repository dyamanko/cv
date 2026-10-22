<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLang } from '../../composables/useLang'

const { t } = useLang()
const view = ref<'before' | 'after'>('after')

const W = 136
const H = 48
/** each module's place inside the monolith and as a separate service */
const PLACES: { before: [number, number]; after: [number, number] }[] = [
  { before: [48, 56], after: [142, 104] }, // core
  { before: [236, 56], after: [10, 14] }, // notifications
  { before: [48, 122], after: [10, 176] }, // data sync
  { before: [236, 122], after: [274, 14] }, // bots
]

const modules = computed(() =>
  t.value.cases.services.modules.map((name, i) => {
    const [x, y] = PLACES[i][view.value]
    return { name, x, y, core: i === 0 }
  }),
)

// REST links from the core to every extracted service
const links = computed(() => {
  const [cx, cy] = PLACES[0].after
  const core = { x: cx + W / 2, y: cy + H / 2 }
  return PLACES.slice(1).map(({ after: [x, y] }) => {
    const target = { x: x + W / 2, y: y + H / 2 }
    return `M${core.x} ${core.y}L${target.x} ${target.y}`
  })
})
</script>

<template>
  <figure class="services">
    <div class="control" role="group" :aria-label="t.cases.services.viewLabel">
      <span class="control-label" aria-hidden="true">{{ t.cases.services.viewLabel }}</span>
      <div class="options">
        <button type="button" class="option" :aria-pressed="view === 'before'" @click="view = 'before'">
          {{ t.cases.services.views.before }}
        </button>
        <button type="button" class="option" :aria-pressed="view === 'after'" @click="view = 'after'">
          {{ t.cases.services.views.after }}
        </button>
      </div>
    </div>

    <div class="sheet figure">
      <svg class="dg" :class="view" viewBox="0 0 420 300" aria-hidden="true">
        <!-- the monolith's boundary, gone once the modules move out -->
        <g class="monolith">
          <rect x="30" y="26" width="360" height="164" rx="16" />
          <foreignObject x="42" y="28" width="200" height="24">
            <div class="dg-fo dg-fo-start dg-fo-note">{{ t.cases.services.monolith }}</div>
          </foreignObject>
        </g>

        <g class="links">
          <path v-for="d in links" :key="d" :d="d" class="dg-flow" />
          <foreignObject x="150" y="74" width="56" height="20">
            <div class="dg-fo dg-fo-flow dg-fo-start">REST</div>
          </foreignObject>
        </g>

        <!-- 1C talks to whatever owns data sync -->
        <path :d="view === 'after' ? 'M78 224V250' : 'M78 190V250'" class="dg-flow one-c-link" />

        <g
          v-for="m in modules"
          :key="m.name"
          class="module"
          :class="{ core: m.core }"
          :style="{ transform: `translate(${m.x}px, ${m.y}px)` }"
        >
          <rect :width="W" :height="H" rx="10" class="dg-task" :class="{ 'dg-task-done': view === 'after' && !m.core }" />
          <foreignObject :width="W" :height="H">
            <div class="dg-fo">{{ m.name }}</div>
          </foreignObject>
        </g>

        <g class="external">
          <rect x="10" y="250" width="136" height="36" rx="18" class="dg-task" />
          <foreignObject x="10" y="250" width="136" height="36">
            <div class="dg-fo dg-fo-note">{{ t.cases.services.oneC }}</div>
          </foreignObject>
        </g>

        <foreignObject x="168" y="252" width="246" height="40">
          <div class="dg-fo dg-fo-note dg-fo-start ci">{{ t.cases.services.ci }}</div>
        </foreignObject>
      </svg>
    </div>

    <figcaption>{{ t.cases.services.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.services {
  display: grid;
  gap: 14px;
}

.control {
  display: grid;
  gap: 6px;
  justify-items: start;
}

.control-label {
  font-size: 14px;
  color: var(--ink-2);
}

.options {
  display: inline-flex;
  gap: 4px;
  padding: 3px;
  border: 1px solid var(--rule);
  border-radius: 12px;
  background: var(--sheet);
}

.option {
  min-height: 40px;
  padding: 0 14px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--ink-2);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 120ms var(--ease-out);
}

.option[aria-pressed='true'] {
  background: var(--ink);
  color: var(--paper);
}

.option:active {
  transform: scale(0.97);
}

@media (pointer: coarse) {
  .option {
    min-height: 44px;
  }
}

.figure {
  padding: clamp(12px, 2vw, 20px);
}

.monolith rect {
  fill: color-mix(in srgb, var(--ink) 5%, var(--sheet));
  stroke: var(--ink);
  stroke-width: 1.6;
  stroke-dasharray: 6 4;
}

.monolith,
.links {
  transition: opacity 300ms ease;
}

.after .monolith,
.before .links {
  opacity: 0;
}

.module {
  transition: transform 520ms var(--ease-in-out);
}

.module.core rect {
  stroke-width: 2.6;
}

.one-c-link {
  stroke: var(--ink-2);
}

.ci {
  font-size: 13px;
}

@media (prefers-reduced-motion: reduce) {
  .module {
    transition: none;
  }
}

figcaption {
  font-size: 15px;
  color: var(--ink-2);
}
</style>
