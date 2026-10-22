<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLang } from '../../composables/useLang'
import { CAREER_START, formatTenure } from '../../content'
import CareerTimeline from './CareerTimeline.vue'

const { lang, t } = useLang()
const lead = computed(() => t.value.experience.lead.replace('{tenure}', formatTenure(lang.value, CAREER_START)))

const selected = ref('IT_One')

// picking a job on the timeline brings its description into view
function select(company: string) {
  selected.value = company
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(`job-${company}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
</script>

<template>
  <section id="experience" class="experience page" aria-labelledby="experience-title">
    <header class="section-head">
      <h2 id="experience-title">{{ t.experience.title }}</h2>
      <p class="lead">{{ lead }}</p>
    </header>

    <div class="sheet timeline-card">
      <CareerTimeline :selected="selected" @select="select" />
    </div>

    <article
      v-for="job in t.experience.jobs"
      :id="`job-${job.company}`"
      :key="job.company"
      class="job"
      :class="{ selected: job.company === selected }"
    >
      <header class="job-meta">
        <h3 translate="no">{{ job.company }}</h3>
        <p class="job-role">{{ job.role }}</p>
        <p class="job-period">{{ job.period }}</p>
        <p class="job-domain">{{ job.domain }}</p>
      </header>

      <div class="job-body">
        <ul class="points">
          <li v-for="point in job.points" :key="point">{{ point }}</li>
        </ul>
        <p class="job-stack" translate="no">{{ job.stack }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.experience {
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

.timeline-card {
  overflow: hidden;
}

.job {
  display: grid;
  gap: 14px;
  padding-block: clamp(22px, 3vw, 36px);
  border-bottom: 1px solid var(--rule);
  transition: background-color 200ms ease;
}

.job:first-of-type {
  margin-top: 20px;
  border-top: 1px solid var(--rule);
}

.job-meta {
  display: grid;
  gap: 2px;
  align-content: start;
  padding-left: 12px;
  border-left: 3px solid transparent;
  transition: border-color 200ms ease;
}

.job.selected .job-meta {
  border-left-color: var(--viz-2);
}

.job-meta h3 {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 560;
  letter-spacing: -0.01em;
}

.job-role {
  font-weight: 640;
}

.job-period,
.job-domain {
  font-size: 14px;
  color: var(--ink-2);
}

.job-body {
  display: grid;
  gap: 12px;
  max-width: 46em;
}

.points {
  display: grid;
  gap: 8px;
}

.points li {
  position: relative;
  padding-left: 20px;
}

.points li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 0.62em;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid var(--ink);
}

.job-stack {
  font-size: 14px;
  color: var(--ink-2);
}

@media (min-width: 900px) {
  .job {
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 40px;
  }
}
</style>
