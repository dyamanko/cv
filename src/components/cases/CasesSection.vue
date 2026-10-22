<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from '../../composables/useLang'
import { useLens } from '../../composables/useLens'
import EditorCaseFigure from './EditorCaseFigure.vue'
import EventsFigure from './EventsFigure.vue'
import RecoveryFigure from './RecoveryFigure.vue'
import ServicesFigure from './ServicesFigure.vue'

const { t } = useLang()
const { lens } = useLens()

// cases for the chosen role come first; within each group the written order stays
const items = computed(() => {
  const all = t.value.cases.items
  return [...all.filter((c) => c.lenses.includes(lens.value)), ...all.filter((c) => !c.lenses.includes(lens.value))]
})
</script>

<template>
  <section id="cases" class="cases page" aria-labelledby="cases-title">
    <header class="section-head">
      <h2 id="cases-title">{{ t.cases.title }}</h2>
      <p class="lead">{{ t.cases.lead }}</p>
      <p class="order-note">
        {{ t.cases.labels.order.replace('{role}', t.stack.lenses[lens]) }}
        <a href="#stack">{{ t.cases.labels.change }}</a>
      </p>
    </header>

    <article
      v-for="item in items"
      :key="item.id"
      class="case"
      :class="[`case-${item.id}`, { 'for-role': item.lenses.includes(lens) }]"
      :aria-labelledby="`case-${item.id}`"
    >
      <header class="case-head">
        <p class="where">
          {{ item.where }}
          <span v-if="item.lenses.includes(lens)" class="role-badge">
            {{ t.cases.labels.forRole.replace('{role}', t.stack.lenses[lens]) }}
          </span>
        </p>
        <h3 :id="`case-${item.id}`">{{ item.title }}</h3>
      </header>

      <dl class="story">
        <div class="part task">
          <dt>{{ t.cases.labels.task }}</dt>
          <dd>{{ item.task }}</dd>
        </div>
        <div class="part did">
          <dt>{{ t.cases.labels.did }}</dt>
          <dd>
            <ul>
              <li v-for="step in item.did" :key="step">{{ step }}</li>
            </ul>
          </dd>
        </div>
        <div class="part result">
          <dt>{{ t.cases.labels.result }}</dt>
          <dd>{{ item.result }}</dd>
        </div>
      </dl>

      <ul class="tags" translate="no">
        <li v-for="tag in item.tags" :key="tag">{{ tag }}</li>
      </ul>

      <div class="case-figure">
        <RecoveryFigure v-if="item.id === 'recovery'" />
        <EventsFigure v-else-if="item.id === 'events'" />
        <EditorCaseFigure v-else-if="item.id === 'editor'" />
        <ServicesFigure v-else />
      </div>
    </article>

    <section class="more" aria-labelledby="more-title">
      <h3 id="more-title">{{ t.cases.more.title }}</h3>
      <ul>
        <li v-for="m in t.cases.more.items" :key="m.title" :class="{ 'with-metric': m.metric }">
          <p v-if="m.metric" class="metric">{{ m.metric }}</p>
          <p>
            <strong>{{ m.title }}.</strong>
            {{ m.text }}
          </p>
        </li>
      </ul>
    </section>
  </section>
</template>

<style scoped>
.cases {
  padding-top: clamp(56px, 9vw, 120px);
}

.section-head {
  display: grid;
  gap: 14px;
  max-width: 48em;
  margin-bottom: clamp(20px, 3vw, 32px);
}

.lead {
  font-size: clamp(16px, 1.5vw, 19px);
  color: var(--ink-2);
}

.order-note {
  font-size: 14px;
  color: var(--ink-2);
}

.order-note a {
  color: var(--ink);
}

.case {
  display: grid;
  gap: 18px;
  padding-block: clamp(28px, 4vw, 48px);
  border-top: 1px solid var(--rule);
}

.case-head {
  display: grid;
  gap: 6px;
}

.where {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 12px;
  font-size: 14px;
  color: var(--ink-2);
}

.role-badge {
  padding: 2px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--viz-2) 14%, var(--sheet));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--viz-2) 45%, transparent);
  color: var(--ink);
  font-size: 13px;
  font-weight: 600;
}

.case h3 {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.6vw, 30px);
  font-weight: 560;
  line-height: 1.15;
  letter-spacing: -0.015em;
}

.story {
  display: grid;
  gap: 14px;
}

.part {
  display: grid;
  gap: 4px;
  align-content: start;
}

.part dt {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-2);
}

.part dd {
  font-size: 16px;
  line-height: 1.5;
}

.did ul {
  display: grid;
  gap: 6px;
}

.did li {
  position: relative;
  padding-left: 18px;
}

.did li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 0.62em;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid var(--ink);
}

.result dd {
  padding: 10px 12px;
  border-left: 3px solid var(--mark-ink);
  border-radius: 0 8px 8px 0;
  background: color-mix(in srgb, var(--mark) 30%, var(--sheet));
  font-weight: 600;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tags li {
  padding: 3px 10px;
  border: 1px solid var(--rule);
  border-radius: 6px;
  background: var(--sheet);
  font-size: 13px;
  color: var(--ink-2);
}

.more {
  display: grid;
  gap: 16px;
  padding-top: clamp(28px, 4vw, 48px);
  border-top: 1px solid var(--rule);
}

.more h3 {
  font-family: var(--font-display);
  font-size: clamp(20px, 2.2vw, 26px);
  font-weight: 560;
}

.more ul {
  display: grid;
  gap: 12px;
}

.more li {
  display: grid;
  gap: 4px;
  max-width: 52em;
}

.more li.with-metric {
  padding: 12px 14px;
  border: 1.5px solid var(--ink);
  border-radius: 12px;
  background: color-mix(in srgb, var(--mark) 30%, var(--sheet));
}

.metric {
  font-size: clamp(20px, 2.4vw, 26px);
  font-weight: 700;
  letter-spacing: -0.01em;
}

@media (min-width: 900px) {
  .story {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 28px;
  }

  /* the smaller figures sit next to the story; the process animation takes the full width */
  .case-events,
  .case-editor,
  .case-services {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    column-gap: 40px;
  }

  .case-events > :not(.case-figure),
  .case-editor > :not(.case-figure),
  .case-services > :not(.case-figure) {
    grid-column: 1;
  }

  .case-events .story,
  .case-editor .story,
  .case-services .story {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .case-events .case-figure,
  .case-editor .case-figure,
  .case-services .case-figure {
    grid-column: 2;
    grid-row: 1 / span 4;
    align-self: start;
  }
}
</style>
