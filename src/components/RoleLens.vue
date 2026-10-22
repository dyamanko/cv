<script setup lang="ts">
import { useLang } from '../composables/useLang'
import { useLens } from '../composables/useLens'
import { LENSES } from '../content/stack'

const { t } = useLang()
const { lens } = useLens()
</script>

<template>
  <div class="lens" role="group" :aria-label="t.stack.lensLabel">
    <span class="lens-label" aria-hidden="true">{{ t.stack.lensLabel }}</span>
    <div class="options">
      <button
        v-for="id in LENSES"
        :key="id"
        type="button"
        class="option"
        :aria-pressed="lens === id"
        @click="lens = id"
      >
        {{ t.stack.lenses[id] }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.lens {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
}

.lens-label {
  font-size: 14px;
  color: var(--ink-2);
}

.options {
  display: inline-flex;
  flex-wrap: wrap;
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

@media (hover: hover) and (pointer: fine) {
  .option:not([aria-pressed='true']):hover {
    color: var(--ink);
  }
}

@media (pointer: coarse) {
  .option {
    min-height: 44px;
  }
}
</style>
