<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from '../composables/useLang'
import { useLens } from '../composables/useLens'
import { GROUPS, PRACTICES, STACK } from '../content/stack'
import RoleLens from './RoleLens.vue'
import TechIcon from './TechIcon.vue'

const { t } = useLang()
const { lens } = useLens()

const groups = computed(() =>
  GROUPS.map((id) => {
    const items = STACK.filter((tech) => tech.group === id)
    // logos get tiles; the rest are plain chips, so nothing looks like a placeholder
    return { id, name: t.value.stack.groups[id], tiles: items.filter((i) => i.icon), chips: items.filter((i) => !i.icon) }
  }),
)
</script>

<template>
  <section id="stack" class="stack page" aria-labelledby="stack-title">
    <header class="section-head">
      <h2 id="stack-title">{{ t.stack.title }}</h2>
      <p class="lead">{{ t.stack.lead }}</p>
    </header>

    <div class="controls">
      <RoleLens />
      <ul class="legend" aria-hidden="true">
        <li><span class="swatch key" />{{ t.stack.keyLegend }}</li>
        <li><span class="swatch lens" />{{ t.stack.lensLegend.replace('{role}', t.stack.lenses[lens]) }}</li>
      </ul>
    </div>

    <div class="groups">
      <section v-for="group in groups" :key="group.id" class="group" :aria-labelledby="`group-${group.id}`">
        <h3 :id="`group-${group.id}`" class="group-name">{{ group.name }}</h3>
        <ul class="tiles" translate="no">
          <li
            v-for="tech in group.tiles"
            :key="tech.name"
            class="tile"
            :class="{ key: tech.key, 'in-lens': tech.lenses.includes(lens) }"
          >
            <TechIcon :icon="tech.icon" :name="tech.name" :size="22" />
            <span class="tile-name">{{ tech.name }}</span>
          </li>
        </ul>
        <ul v-if="group.chips.length" class="chips" translate="no">
          <li v-for="tech in group.chips" :key="tech.name" class="chip" :class="{ 'in-lens': tech.lenses.includes(lens) }">
            {{ tech.name }}
          </li>
        </ul>
      </section>
    </div>

    <p class="line">
      <span class="line-label">{{ t.stack.architecture.label }}</span>
      {{ t.stack.architecture.text }}
    </p>

    <p class="practices">
      <span class="practices-label">{{ t.stack.practices }}</span>
      <span v-for="p in PRACTICES" :key="p.name" class="practice" translate="no">
        <TechIcon :icon="p.icon" :name="p.name" :size="16" />
        {{ p.name }}
      </span>
    </p>

    <p class="line line-muted">
      <span class="line-label">{{ t.stack.learning.label }}</span>
      <span translate="no">{{ t.stack.learning.text }}</span>
    </p>
  </section>
</template>

<style scoped>
.stack {
  padding-top: clamp(56px, 9vw, 120px);
}

.section-head {
  display: grid;
  gap: 12px;
  max-width: 44em;
  margin-bottom: 24px;
}

.lead {
  font-size: clamp(16px, 1.5vw, 19px);
  color: var(--ink-2);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  margin-bottom: 20px;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  font-size: 13px;
  color: var(--ink-2);
}

.legend li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.swatch {
  width: 14px;
  height: 14px;
  border-radius: 4px;
}

.swatch.key {
  border: 1.5px solid var(--ink);
  background: color-mix(in srgb, var(--mark) 55%, var(--sheet));
}

.swatch.lens {
  border: 1.5px solid var(--ink);
  background: var(--sheet);
  box-shadow: inset 0 -3px 0 var(--viz-2);
}

.groups {
  display: grid;
  gap: 14px;
}

.group {
  display: grid;
  align-content: start;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--rule);
  border-radius: 14px;
  background: var(--sheet);
}

.group-name {
  font-size: 15px;
  font-weight: 700;
}

.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}

.tile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 46px;
  padding: 8px 10px;
  border: 1.5px solid var(--rule);
  border-radius: 10px;
  background: var(--sheet);
  color: var(--ink-2);
  font-size: 14px;
  font-weight: 560;
  line-height: 1.2;
  transition:
    border-color 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease;
}

/* relevant to the chosen role: ink border and a blue underline */
.tile.in-lens {
  border-color: var(--ink);
  color: var(--ink);
  box-shadow: inset 0 -3px 0 var(--viz-2);
}

/* the core stack carries the highlighter whatever the role */
.tile.key {
  background: color-mix(in srgb, var(--mark) 55%, var(--sheet));
  color: var(--ink);
  font-weight: 700;
}

.line {
  max-width: 60em;
  margin-top: 16px;
  font-size: 15px;
}

.line-label {
  margin-right: 6px;
  color: var(--ink-2);
}

.line-muted {
  margin-top: 10px;
  color: var(--ink-2);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 6px;
}

.chip {
  padding: 4px 10px;
  border: 1px solid var(--rule);
  border-radius: 999px;
  color: var(--ink-2);
  font-size: 13px;
  font-weight: 560;
  transition:
    border-color 180ms ease,
    color 180ms ease;
}

.chip.in-lens {
  border-color: var(--ink);
  color: var(--ink);
}

.practices {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
  margin-top: 10px;
  font-size: 14px;
}

.practices-label {
  color: var(--ink-2);
}

.practice {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 560;
}

@media (max-width: 520px) {
  .group {
    padding: 12px;
  }

  .tiles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }

  .tile {
    gap: 8px;
    min-height: 40px;
    padding: 6px 8px;
    font-size: 13px;
  }
}

@media (min-width: 720px) {
  .tiles {
    grid-template-columns: repeat(auto-fill, minmax(176px, 1fr));
  }

  .groups {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .group:first-child {
    grid-column: 1 / -1;
  }
}

@media (min-width: 1100px) {
  .groups {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .group:nth-child(1) {
    grid-column: span 6;
  }

  .group:nth-child(2) {
    grid-column: span 3;
  }

  .group:nth-child(3) {
    grid-column: span 3;
  }

  .group:nth-child(4) {
    grid-column: span 3;
  }

  .group:nth-child(5) {
    grid-column: span 3;
  }
}
</style>
