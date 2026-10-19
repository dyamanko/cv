<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from '../composables/useLang'
import AppIcon from './AppIcon.vue'

const { lang, t } = useLang()
const resumeHref = computed(() => `${import.meta.env.BASE_URL}resume/dmitrii-iamanko-${lang.value}.pdf`)
</script>

<template>
  <section class="hero page" aria-labelledby="hero-name">
    <h1 id="hero-name" class="name">
      <span>{{ t.hero.name[0] }}</span>
      <span>{{ t.hero.name[1] }}</span>
    </h1>
    <p class="role">{{ t.hero.role }}</p>

    <div class="intro">
      <p class="pitch">{{ t.hero.pitch }}</p>

      <div class="aside">
        <ul class="status">
          <li class="status-open">
            <span class="token" aria-hidden="true" />
            {{ t.hero.status }}
          </li>
          <li>{{ t.hero.location }}</li>
        </ul>

        <div class="actions">
          <a class="button button-primary" href="https://t.me/dyamanko" target="_blank" rel="noopener">
            <AppIcon name="telegram" />
            {{ t.hero.telegram }}
          </a>
          <a class="button" :href="resumeHref" download>
            <AppIcon name="download" />
            {{ t.hero.resume }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-top: clamp(24px, 6vw, 72px);
}

.name {
  display: flex;
  flex-direction: column;
  font-size: clamp(46px, 10.4vw, 120px);
  line-height: 0.94;
  font-weight: 600;
  letter-spacing: -0.035em;
}

.role {
  margin-top: clamp(16px, 2.4vw, 28px);
  font-size: clamp(20px, 2.2vw, 26px);
  font-weight: 560;
  color: var(--ink-2);
  letter-spacing: -0.005em;
}

.intro {
  display: grid;
  gap: 28px;
  margin-top: 28px;
}

.pitch {
  max-width: 36em;
  font-size: clamp(18px, 1.6vw, 20px);
  line-height: 1.55;
}

.aside {
  display: grid;
  gap: 20px;
  align-content: start;
}

.status {
  display: grid;
  gap: 4px;
  font-size: 16px;
  color: var(--ink-2);
}

.status-open {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ink);
  font-weight: 560;
}

/* the same token that runs through the process diagram below */
.token {
  width: 12px;
  height: 12px;
  flex: none;
  border-radius: 50%;
  background: var(--mark-ink);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--mark) 70%, transparent);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 20px;
  border: 1.5px solid var(--ink);
  border-radius: 10px;
  background: var(--sheet);
  color: var(--ink);
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  transition:
    transform 140ms var(--ease-out),
    background-color 160ms ease;
}

.button-primary {
  background: var(--ink);
  color: var(--paper);
}

.button:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .button:not(.button-primary):hover {
    background: color-mix(in srgb, var(--mark) 45%, var(--sheet));
  }

  .button-primary:hover {
    background: color-mix(in srgb, var(--ink) 88%, var(--mark));
  }
}

@media (min-width: 960px) {
  .intro {
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    gap: 64px;
    margin-top: 36px;
  }

  .aside {
    padding-top: 4px;
  }
}
</style>
