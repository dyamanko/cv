<script setup lang="ts">
import { useLang } from '../composables/useLang'
import type { Lang } from '../content'

const { lang, t, setLang } = useLang()
const langs: Lang[] = ['en', 'ru']
</script>

<template>
  <header class="site-header page">
    <nav :aria-label="t.nav.label" class="nav">
      <a href="#stack">{{ t.nav.stack }}</a>
      <a href="#cases">{{ t.nav.cases }}</a>
      <a href="#experience">{{ t.nav.experience }}</a>
      <a href="#contacts">{{ t.nav.contacts }}</a>
    </nav>

    <div class="lang" role="group" :aria-label="t.langSwitch">
      <button
        v-for="item in langs"
        :key="item"
        type="button"
        class="lang-option"
        :aria-pressed="lang === item"
        :lang="item"
        @click="setLang(item)"
      >
        {{ item.toUpperCase() }}
      </button>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-block: 12px;
}

@media (min-width: 760px) {
  .site-header {
    padding-block: 20px;
  }
}

.nav {
  display: none;
  gap: 28px;
  font-size: 15px;
}

.nav a {
  color: var(--ink-2);
  text-decoration: none;
  padding-block: 6px;
  transition: color 160ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .nav a:hover {
    color: var(--ink);
  }
}

@media (min-width: 760px) {
  .nav {
    display: flex;
  }
}

.lang {
  display: inline-flex;
  margin-left: auto;
  padding: 3px;
  border: 1px solid var(--rule);
  border-radius: 999px;
  background: var(--sheet);
}

.lang-option {
  min-width: 44px;
  min-height: 36px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--ink-2);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  user-select: none;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 120ms var(--ease-out);
}

.lang-option[aria-pressed='true'] {
  background: var(--ink);
  color: var(--paper);
}

.lang-option:active {
  transform: scale(0.97);
}

@media (pointer: coarse) {
  .lang-option {
    min-height: 44px;
  }
}
</style>
