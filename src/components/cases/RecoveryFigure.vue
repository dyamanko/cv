<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLang } from '../../composables/useLang'
import ProcessDiagram from '../process/ProcessDiagram.vue'
import { SCENARIOS, type RunState, type Scenario } from '../process/timeline'
import IncidentsFigure from './IncidentsFigure.vue'
import type { IncidentPhase } from './figures'

const { t } = useLang()

const scenario = ref<Scenario>('known')
const run = ref(0)
const running = ref(false)
const runState = ref<RunState | null>(null)

function pick(next: Scenario) {
  scenario.value = next
  run.value++
}

// the mechanism figure lights up the part of the loop the request is in
const phase = computed<IncidentPhase>(() => {
  const callout = runState.value?.callout
  if (!callout) return null
  return callout === 'incident' ? 'failed' : callout
})
</script>

<template>
  <figure class="recovery">
    <div class="scenarios" role="group" :aria-label="t.cases.recovery.scenarioLabel">
      <span class="scenarios-label" aria-hidden="true">{{ t.cases.recovery.scenarioLabel }}</span>
      <button
        v-for="id in SCENARIOS"
        :key="id"
        type="button"
        class="scenario"
        :aria-pressed="scenario === id"
        @click="pick(id)"
      >
        <span class="dot" :class="id" aria-hidden="true" />
        {{ t.cases.recovery.scenarios[id] }}
      </button>
    </div>

    <ProcessDiagram :scenario="scenario" :run="run" @state="runState = $event" @running="running = $event" />

    <div class="mechanism">
      <div class="sheet mechanism-figure">
        <IncidentsFigure :phase="running || runState?.callout ? phase : null" />
      </div>
      <figcaption>
        <p class="mechanism-title">{{ t.cases.recovery.mechanism }}</p>
        <p>{{ t.cases.recovery.caption }}</p>
      </figcaption>
    </div>
  </figure>
</template>

<style scoped>
.recovery {
  display: grid;
  gap: 16px;
}

.scenarios {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.scenarios-label {
  width: 100%;
  font-size: 14px;
  color: var(--ink-2);
}

.scenario {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 14px;
  border: 1.5px solid var(--rule);
  border-radius: 10px;
  background: var(--sheet);
  color: var(--ink);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition:
    border-color 160ms ease,
    transform 120ms var(--ease-out);
}

.scenario[aria-pressed='true'] {
  border-color: var(--ink);
  box-shadow: inset 0 0 0 1px var(--ink);
}

.scenario:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .scenario:hover {
    border-color: var(--ink);
  }
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.known {
  background: var(--mark-ink);
}

.dot.unknown,
.dot.limit {
  background: var(--critical);
}

.mechanism {
  display: grid;
  gap: 16px;
  align-items: center;
}

.mechanism-figure {
  padding: clamp(12px, 2vw, 20px);
}

figcaption {
  display: grid;
  gap: 6px;
  font-size: 15px;
  color: var(--ink-2);
}

.mechanism-title {
  font-weight: 640;
  color: var(--ink);
}

@media (min-width: 860px) {
  .mechanism {
    grid-template-columns: minmax(0, 440px) minmax(0, 1fr);
    gap: 28px;
  }
}
</style>
