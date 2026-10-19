<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useLang } from '../composables/useLang'

/*
  A plain one-column resume built from the same content as the site.
  It is what the PDFs are printed from, so it avoids tables, columns
  and graphics that applicant tracking systems read badly.
*/
const { lang, t } = useLang()

const SITE = 'dyamanko.github.io/cv'
const name = computed(() => t.value.hero.name.join(' '))

watchEffect(() => {
  document.title = t.value.resume.title
})
</script>

<template>
  <article class="resume">
    <header class="head">
      <h1>{{ name }}</h1>
      <p class="role">{{ t.hero.role }}</p>
      <p class="line">{{ t.hero.location }}. {{ t.format.terms[0].value }}. {{ t.format.terms[1].value }}</p>
      <p class="line contacts">
        <span v-for="c in t.contacts.items" :key="c.id">{{ c.label }}: {{ c.value }}</span>
        <span>{{ t.resume.website }}: {{ SITE }}{{ lang === 'en' ? '/?lang=en' : '' }}</span>
      </p>
    </header>

    <section>
      <h2>{{ t.resume.summary }}</h2>
      <p>{{ t.hero.pitch }}</p>
    </section>

    <section>
      <h2>{{ t.resume.skills }}</h2>
      <ul class="skills">
        <li v-for="layer in [...t.stack.layers, ...t.stack.across]" :key="layer.name">
          <strong>{{ layer.name }}:</strong> {{ layer.items.join(', ') }}
        </li>
      </ul>
    </section>

    <section>
      <h2>{{ t.resume.experience }}</h2>
      <div v-for="(job, i) in t.experience.jobs" :key="job.company" class="job">
        <h3>
          {{ job.role }}, {{ job.company }}
          <span class="period">{{ job.period }}</span>
        </h3>
        <p v-if="job.project">
          {{ t.cases.intro }}
          <template v-if="job.facts">{{ job.facts.map((f) => `${f.value} ${f.label}`).join(', ') }}.</template>
        </p>
        <ul>
          <!-- for the current job the case studies replace the short summary points -->
          <li v-for="point in i === 0 ? job.points.slice(0, 1) : job.points" :key="point">{{ point }}</li>
          <template v-if="i === 0">
            <li v-for="item in t.cases.items" :key="item.id">
              <strong>{{ item.title }}.</strong> {{ item.text }}
            </li>
          </template>
        </ul>
        <p class="stack">{{ job.stack }}</p>
      </div>
    </section>

    <section>
      <h2>{{ t.resume.education }}</h2>
      <p v-for="degree in t.education.degrees" :key="degree.year">
        <strong>{{ degree.title }}, {{ degree.year }}.</strong> {{ degree.place.replace(/\.?$/, '.') }}
      </p>
    </section>

    <section>
      <h2>{{ t.resume.languages }}</h2>
      <p>{{ t.education.languages.map((l) => `${l.name}: ${l.level}`).join('. ') }}.</p>
    </section>

    <section>
      <h2>{{ t.resume.additional }}</h2>
      <p v-for="term in t.format.terms" :key="term.label">
        <strong>{{ term.label }}:</strong> {{ term.value }}
      </p>
    </section>
  </article>
</template>

<style>
@page {
  size: A4;
  margin: 14mm 16mm;
}

body {
  background: var(--sheet);
}

.resume {
  max-width: 780px;
  margin: 0 auto;
  padding: 40px 24px;
  font-size: 14px;
  line-height: 1.45;
  color: var(--ink);
}

.resume h1 {
  font-size: 30px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.resume .role {
  margin-top: 4px;
  font-size: 17px;
  font-weight: 640;
}

.resume .line {
  margin-top: 6px;
  color: var(--ink-2);
}

.resume .contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 16px;
}

.resume section {
  margin-top: 18px;
}

.resume h2 {
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1.5px solid var(--ink);
  font-size: 15px;
  letter-spacing: 0;
}

.resume h3 {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0 16px;
  font-size: 15px;
  font-weight: 700;
}

.resume .period {
  font-weight: 500;
  color: var(--ink-2);
}

.resume .job + .job {
  margin-top: 12px;
}

.resume .job > p {
  margin-top: 2px;
}

/* native markers: positioned pseudo-elements change the text order PDF readers see */
.resume ul {
  margin-top: 4px;
  padding-left: 18px;
  list-style: disc;
}

.resume li {
  break-inside: avoid;
}

.resume li + li {
  margin-top: 3px;
}

.resume li::marker {
  color: var(--ink);
}

.resume .skills {
  padding-left: 0;
  list-style: none;
}

.resume .stack {
  margin-top: 4px;
  font-size: 13px;
  color: var(--ink-2);
}

.resume section > p + p {
  margin-top: 4px;
}

@media print {
  .resume {
    max-width: none;
    padding: 0;
    font-size: 10.5pt;
  }

  .resume h1 {
    font-size: 24pt;
  }
}
</style>
