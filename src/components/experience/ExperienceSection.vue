<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from '../../composables/useLang'
import { CAREER_START, formatTenure } from '../../content'
import CareerTimeline from './CareerTimeline.vue'

const { lang, t } = useLang()
const lead = computed(() => t.value.experience.lead.replace('{tenure}', formatTenure(lang.value, CAREER_START)))
</script>

<template>
  <section id="experience" class="experience page" aria-labelledby="experience-title">
    <header class="section-head">
      <h2 id="experience-title">{{ t.experience.title }}</h2>
      <p class="lead">{{ lead }}</p>
    </header>

    <CareerTimeline class="sheet" />

    <article v-for="job in t.experience.jobs" :key="job.company" class="job">
      <header class="job-meta">
        <h3>{{ job.company }}</h3>
        <p class="job-role">{{ job.role }}</p>
        <p class="job-period">{{ job.period }}</p>
      </header>

      <div class="job-body">
        <p v-if="job.project" class="job-project">{{ job.project }}</p>

        <dl v-if="job.facts" class="facts">
          <div v-for="fact in job.facts" :key="fact.label">
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>

        <ul class="points">
          <li v-for="point in job.points" :key="point">{{ point }}</li>
        </ul>

        <p class="job-stack">{{ job.stack }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.experience {
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

.job {
  display: grid;
  gap: 18px;
  padding-block: clamp(28px, 4vw, 44px);
  border-bottom: 1px solid var(--rule);
}

.job:first-of-type {
  margin-top: clamp(28px, 4vw, 44px);
  border-top: 1px solid var(--rule);
}

.job-meta {
  display: grid;
  gap: 4px;
  align-content: start;
}

.job-meta h3 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 560;
  letter-spacing: -0.01em;
}

.job-role {
  font-weight: 600;
}

.job-period {
  font-size: 15px;
  color: var(--ink-2);
}

.job-body {
  display: grid;
  gap: 18px;
  max-width: 44em;
}

.job-project {
  font-weight: 600;
}

/* proportional figures on the big numbers */
.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 40px;
}

.facts div {
  display: flex;
  flex-direction: column-reverse;
}

.facts dd {
  font-size: 32px;
  font-weight: 640;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.facts dt {
  font-size: 14px;
  color: var(--ink-2);
}

.points {
  display: grid;
  gap: 10px;
}

.points li {
  position: relative;
  padding-left: 22px;
}

/* sequence-flow tick instead of a bullet */
.points li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 0.62em;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--ink);
  background: var(--sheet);
}

.job-stack {
  font-size: 15px;
  color: var(--ink-2);
}

@media (min-width: 900px) {
  .job {
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 48px;
  }
}
</style>
