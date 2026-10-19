<script setup lang="ts">
import { useLang } from '../composables/useLang'

const { t } = useLang()

// the layer I am known for gets the highlighter
const FOCUS = 2
</script>

<template>
  <section id="stack" class="stack page" aria-labelledby="stack-title">
    <header class="section-head">
      <h2 id="stack-title">{{ t.stack.title }}</h2>
      <p class="lead">{{ t.stack.lead }}</p>
    </header>

    <div class="system">
      <ol class="layers">
        <li v-for="(layer, i) in t.stack.layers" :key="layer.name" class="layer" :class="{ focus: i === FOCUS }">
          <h3 class="layer-name">{{ layer.name }}</h3>
          <ul class="items">
            <li v-for="item in layer.items" :key="item">{{ item }}</li>
          </ul>
        </li>
      </ol>

      <div class="across">
        <p class="across-title">{{ t.stack.acrossTitle }}</p>
        <section v-for="group in t.stack.across" :key="group.name" class="group">
          <h3 class="layer-name">{{ group.name }}</h3>
          <ul class="items">
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stack {
  padding-top: clamp(80px, 12vw, 160px);
}

.section-head {
  display: grid;
  gap: 16px;
  max-width: 44em;
  margin-bottom: clamp(28px, 4vw, 44px);
}

.lead {
  font-size: clamp(17px, 1.5vw, 19px);
  color: var(--ink-2);
}

.system {
  display: grid;
  gap: 28px;
}

.layers {
  display: grid;
  gap: 18px;
}

.layer {
  position: relative;
  display: grid;
  gap: 10px;
  padding: 16px 18px;
  border: 1.6px solid var(--ink);
  border-radius: 12px;
  background: var(--sheet);
}

/* a flow line between neighbouring layers: a request passes through all of them */
.layer:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 40px;
  top: 100%;
  width: 1.6px;
  height: 18px;
  background: var(--ink);
}

.layer.focus {
  border-width: 3px;
  background: color-mix(in srgb, var(--mark) 45%, var(--sheet));
}

.layer-name {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0;
}

.items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 8px;
}

.items li {
  padding: 3px 10px;
  border: 1px solid var(--rule);
  border-radius: 6px;
  background: var(--sheet);
  font-size: 15px;
}

.layer.focus .items li {
  border-color: color-mix(in srgb, var(--ink) 25%, transparent);
}

.across {
  display: grid;
  align-content: start;
  padding: 18px;
  border: 1px solid var(--rule);
  border-radius: 12px;
  background: var(--sheet);
}

.across-title {
  padding-bottom: 12px;
  font-size: 14px;
  color: var(--ink-2);
}

.group {
  display: grid;
  gap: 10px;
  padding-block: 14px;
  border-top: 1px solid var(--rule);
}

.group:last-child {
  padding-bottom: 0;
}

@media (min-width: 720px) {
  .layer {
    grid-template-columns: 170px minmax(0, 1fr);
    align-items: baseline;
    gap: 16px;
  }
}

@media (min-width: 1040px) {
  .system {
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 24px;
  }

  /* cross-cutting concerns run alongside every layer */
  .across {
    height: 100%;
  }
}
</style>
