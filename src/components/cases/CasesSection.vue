<script setup lang="ts">
import { useLang } from '../../composables/useLang'
import DesignTimeChart from './DesignTimeChart.vue'
import EditorFigure from './EditorFigure.vue'
import IncidentsFigure from './IncidentsFigure.vue'
import IntegrationsFigure from './IntegrationsFigure.vue'
import PipelineSteps from './PipelineSteps.vue'

const { t } = useLang()
</script>

<template>
  <section id="portal" class="cases page" aria-labelledby="cases-title">
    <header class="section-head">
      <h2 id="cases-title">{{ t.cases.title }}</h2>
      <p class="lead">{{ t.cases.intro }}</p>
    </header>

    <article v-for="item in t.cases.items" :key="item.id" class="case" :class="`case-${item.id}`">
      <div class="case-text">
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
        <ul class="tags">
          <li v-for="tag in item.tags" :key="tag">{{ tag }}</li>
        </ul>
      </div>

      <div class="case-figure">
        <div v-if="item.id === 'pipeline'" class="sheet figure-pad pipeline-figure">
          <PipelineSteps />
          <DesignTimeChart />
        </div>
        <div v-else class="sheet figure-pad">
          <EditorFigure v-if="item.id === 'editor'" />
          <IncidentsFigure v-else-if="item.id === 'incidents'" />
          <IntegrationsFigure v-else />
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
.cases {
  padding-top: clamp(80px, 12vw, 160px);
}

.section-head {
  display: grid;
  gap: 16px;
  max-width: 44em;
  margin-bottom: clamp(32px, 5vw, 56px);
}

.lead {
  font-size: clamp(17px, 1.5vw, 19px);
  color: var(--ink-2);
}

.case {
  display: grid;
  gap: 24px;
  padding-block: clamp(32px, 5vw, 56px);
  border-top: 1px solid var(--rule);
}

.case-text {
  display: grid;
  gap: 14px;
  align-content: start;
  max-width: 34em;
}

.case-text p {
  color: var(--ink-2);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.tags li {
  padding: 3px 10px;
  border: 1px solid var(--rule);
  border-radius: 6px;
  background: var(--sheet);
  font-size: 14px;
  color: var(--ink-2);
}

.figure-pad {
  padding: clamp(14px, 2.4vw, 24px);
}

.pipeline-figure {
  display: grid;
  gap: 28px;
}

@media (min-width: 960px) {
  .case {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 56px;
    align-items: start;
  }

  .case-figure {
    max-width: 560px;
    justify-self: end;
    width: 100%;
  }
}
</style>
