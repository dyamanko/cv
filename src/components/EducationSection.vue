<script setup lang="ts">
import { useLang } from '../composables/useLang'

const { t } = useLang()
const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
</script>

<template>
  <section class="education page" aria-labelledby="education-title">
    <div class="degrees">
      <h2 id="education-title">{{ t.education.title }}</h2>
      <ul>
        <li v-for="degree in t.education.degrees" :key="degree.year" class="degree">
          <span class="degree-year">{{ degree.year }}</span>
          <div>
            <h3>{{ degree.title }}</h3>
            <p>{{ degree.place }}</p>
          </div>
        </li>
      </ul>
    </div>

    <div class="languages">
      <h2>{{ t.education.languagesTitle }}</h2>
      <ul>
        <li v-for="language in t.education.languages" :key="language.name" class="language">
          <p class="language-head">
            <span class="language-name">{{ language.name }}</span>
            <span class="language-level">{{ language.level }}</span>
          </p>
          <ol v-if="language.cefr" class="cefr" aria-hidden="true">
            <li v-for="(level, i) in CEFR" :key="level" :class="{ reached: i < language.cefr }">{{ level }}</li>
          </ol>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.education {
  display: grid;
  gap: 56px;
  padding-top: clamp(80px, 12vw, 160px);
  padding-bottom: clamp(80px, 12vw, 160px);
}

.education h2 {
  margin-bottom: 24px;
}

.degree {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 16px;
  padding-block: 18px;
  border-top: 1px solid var(--rule);
}

.degree:last-child {
  border-bottom: 1px solid var(--rule);
}

.degree-year {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 560;
  line-height: 1.35;
}

.degree h3 {
  font-size: 18px;
  font-weight: 640;
}

.degree p {
  margin-top: 4px;
  font-size: 16px;
  color: var(--ink-2);
}

.language {
  display: grid;
  gap: 10px;
  padding-block: 18px;
  border-top: 1px solid var(--rule);
}

.language:last-child {
  border-bottom: 1px solid var(--rule);
}

.language-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 16px;
}

.language-name {
  font-size: 18px;
  font-weight: 640;
}

.language-level {
  color: var(--ink-2);
}

.cefr {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 2px;
}

.cefr li {
  padding-top: 8px;
  border-top: 8px solid var(--rule);
  font-size: 12px;
  color: var(--ink-2);
  text-align: center;
}

.cefr li:first-child {
  border-top-left-radius: 4px;
}

.cefr li:last-child {
  border-top-right-radius: 4px;
}

.cefr li.reached {
  border-top-color: var(--ink);
  color: var(--ink);
  font-weight: 640;
}

@media (min-width: 960px) {
  .education {
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    gap: 80px;
  }
}
</style>
