<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLang } from '../../composables/useLang'
import type { FlowId } from './figures'
import IntegrationsFigure from './IntegrationsFigure.vue'

const { t } = useLang()

const flow = ref<FlowId>('notify')
const pulse = ref(0)
const animate = typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

function pick(id: FlowId) {
  flow.value = id
  pulse.value++
}

const caption = computed(() => t.value.cases.events.flows.find((f) => f.id === flow.value)?.caption)
</script>

<template>
  <figure class="events">
    <div class="flows" role="group" :aria-label="t.cases.events.flowLabel">
      <span class="flows-label" aria-hidden="true">{{ t.cases.events.flowLabel }}</span>
      <button
        v-for="f in t.cases.events.flows"
        :key="f.id"
        type="button"
        class="flow"
        :aria-pressed="flow === f.id"
        @click="pick(f.id)"
      >
        {{ f.label }}
      </button>
    </div>

    <div class="sheet figure">
      <IntegrationsFigure :flow="flow" :pulse="pulse" :animate="animate && pulse > 0" />
    </div>

    <figcaption aria-live="polite">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.events {
  display: grid;
  gap: 14px;
}

.flows {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.flows-label {
  width: 100%;
  font-size: 14px;
  color: var(--ink-2);
}

.flow {
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

.flow[aria-pressed='true'] {
  border-color: var(--ink);
  box-shadow: inset 0 0 0 1px var(--ink);
}

.flow:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .flow:hover {
    border-color: var(--ink);
  }
}

.figure {
  padding: clamp(14px, 2.4vw, 24px);
}

figcaption {
  min-height: 3em;
  font-size: 15px;
  color: var(--ink-2);
}
</style>
