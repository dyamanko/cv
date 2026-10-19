<script setup lang="ts">
import { useLang } from '../../composables/useLang'
import TimezoneChart from './TimezoneChart.vue'

const { t } = useLang()
</script>

<template>
  <section id="format" class="format page" aria-labelledby="format-title">
    <h2 id="format-title">{{ t.format.title }}</h2>

    <div class="format-body">
      <dl class="terms">
        <div v-for="term in t.format.terms" :key="term.label" class="term">
          <dt>{{ term.label }}</dt>
          <dd>{{ term.value }}</dd>
        </div>
      </dl>

      <TimezoneChart class="sheet" />
    </div>
  </section>
</template>

<style scoped>
.format {
  display: grid;
  gap: clamp(28px, 4vw, 44px);
  padding-top: clamp(80px, 12vw, 160px);
}

.format-body {
  display: grid;
  gap: 32px;
}

.terms {
  display: grid;
  align-content: start;
}

.term {
  display: grid;
  gap: 4px;
  padding-block: 16px;
  border-top: 1px solid var(--rule);
}

.term:last-child {
  border-bottom: 1px solid var(--rule);
}

.term dt {
  font-size: 14px;
  color: var(--ink-2);
}

.term dd {
  font-size: 19px;
  font-weight: 600;
  line-height: 1.35;
}

@media (min-width: 960px) {
  .format-body {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: 56px;
  }
}
</style>
