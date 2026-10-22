<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from '../composables/useLang'
import { KEY_STACK } from '../content/stack'
import AppIcon from './AppIcon.vue'
import TechIcon from './TechIcon.vue'

const { lang, t } = useLang()

const contact = (id: string) => computed(() => t.value.contacts.items.find((c) => c.id === id))
const telegram = contact('telegram')
const email = contact('email')
const linkedin = contact('linkedin')

const cvHref = (l: 'ru' | 'en') => `${import.meta.env.BASE_URL}Dmitrii-Iamanko-CV-${l.toUpperCase()}.pdf`
const cvOther = computed(() => (lang.value === 'en' ? 'ru' : 'en'))
</script>

<template>
  <section class="hero page" aria-labelledby="hero-name">
    <div class="who">
      <h1 id="hero-name" class="name" translate="no">
        <span>{{ t.hero.name[0] }}</span>
        <span>{{ t.hero.name[1] }}</span>
      </h1>
      <p class="role">{{ t.hero.role }}</p>
      <p class="summary">{{ t.hero.summary }}</p>
    </div>

    <dl class="facts">
      <div v-for="fact in t.hero.facts" :key="fact.label" class="fact">
        <dt>{{ fact.label }}</dt>
        <dd>{{ fact.value }}</dd>
      </div>
    </dl>

    <div class="key-stack">
      <p class="label">{{ t.hero.keyStack }}</p>
      <ul translate="no">
        <li v-for="tech in KEY_STACK" :key="tech.name">
          <TechIcon :icon="tech.icon" :name="tech.name" :size="18" />
          {{ tech.name }}
        </li>
      </ul>
    </div>

    <div class="actions">
      <a v-if="telegram" class="button button-primary" :href="telegram.href" target="_blank" rel="noopener">
        <AppIcon name="telegram" />
        <span>Telegram <span class="handle" translate="no">{{ telegram.value }}</span></span>
      </a>
      <a v-if="email" class="button compact" :href="email.href">
        <AppIcon name="email" />
        <span class="button-text" translate="no">{{ email.value }}</span>
      </a>
      <a v-if="linkedin" class="button compact" :href="linkedin.href" target="_blank" rel="noopener">
        <AppIcon name="linkedin" />
        <span class="button-text">LinkedIn</span>
      </a>
      <a class="button" :href="cvHref(lang)" target="_blank" rel="noopener" :aria-label="t.hero.cv">
        <AppIcon name="download" />
        <span class="cv-long" aria-hidden="true">{{ t.hero.cv }}</span>
        <span class="cv-short" aria-hidden="true">PDF</span>
      </a>
      <a class="text-link" :href="cvHref(cvOther)" target="_blank" rel="noopener" :lang="cvOther">
        {{ cvOther === 'ru' ? t.hero.cvRu : t.hero.cvEn }}
      </a>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  gap: 22px;
  padding-top: clamp(8px, 3vw, 40px);
  padding-bottom: clamp(48px, 7vw, 88px);
}

.name {
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.28em;
  font-size: clamp(27px, 6.4vw, 76px);
  line-height: 0.98;
  font-weight: 600;
  letter-spacing: -0.035em;
}

.role {
  margin-top: 12px;
  font-size: clamp(20px, 2.3vw, 28px);
  font-weight: 640;
  letter-spacing: -0.01em;
}

.summary {
  max-width: 40em;
  margin-top: 10px;
  font-size: clamp(16px, 1.5vw, 19px);
  color: var(--ink-2);
}

.facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid var(--rule);
}

.fact {
  display: grid;
  gap: 2px;
  padding: 10px 12px 10px 0;
  border-bottom: 1px solid var(--rule);
}

.fact dt {
  font-size: 13px;
  color: var(--ink-2);
}

.fact dd {
  font-size: 15px;
  font-weight: 640;
  line-height: 1.3;
}

.key-stack {
  display: grid;
  gap: 8px;
}

.label {
  font-size: 13px;
  color: var(--ink-2);
}

.key-stack ul {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.key-stack li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 10px 5px 8px;
  border: 1.5px solid var(--ink);
  border-radius: 8px;
  background: color-mix(in srgb, var(--mark) 45%, var(--sheet));
  font-size: 14px;
  font-weight: 600;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 10px;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 14px;
  border: 1.5px solid var(--ink);
  border-radius: 10px;
  background: var(--sheet);
  color: var(--ink);
  font-size: 15px;
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

.handle {
  font-weight: 500;
  opacity: 0.85;
}

.button:active {
  transform: scale(0.97);
}

.cv-short {
  display: none;
}

.text-link {
  padding: 10px 4px;
  font-size: 15px;
  color: var(--ink-2);
}

@media (hover: hover) and (pointer: fine) {
  .button:not(.button-primary):hover {
    background: color-mix(in srgb, var(--mark) 45%, var(--sheet));
  }

  .button-primary:hover {
    background: color-mix(in srgb, var(--ink) 88%, var(--mark));
  }

  .text-link:hover {
    color: var(--ink);
  }
}

/* a phone gets the whole summary, contacts and the PDF on the first screen */
@media (max-width: 520px) {
  .hero {
    gap: 14px;
  }

  .role {
    margin-top: 6px;
  }

  .summary {
    font-size: 15px;
    line-height: 1.45;
  }

  .facts {
    grid-template-columns: 1fr;
  }

  .fact {
    grid-template-columns: 104px minmax(0, 1fr);
    align-items: baseline;
    gap: 8px;
    padding: 6px 0;
  }

  .fact dd {
    font-size: 14px;
  }

  .key-stack li {
    padding: 3px 8px 3px 6px;
    font-size: 13px;
  }

  .actions {
    gap: 8px;
  }

  .button {
    padding: 0 12px;
    font-size: 14px;
  }

  .button .handle,
  .cv-long {
    display: none;
  }

  .cv-short {
    display: inline;
  }

  /* email and LinkedIn shrink to icons; the text stays for screen readers */
  .button.compact {
    min-width: 44px;
    padding: 0;
    justify-content: center;
  }

  .button.compact .button-text {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
}

@media (min-width: 960px) {
  .hero {
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
    column-gap: 56px;
    row-gap: 24px;
    align-items: end;
  }

  .who {
    grid-column: 1 / -1;
  }

  .facts {
    grid-column: 1;
  }

  .key-stack {
    grid-column: 2;
    align-self: start;
  }

  .actions {
    grid-column: 1 / -1;
  }
}
</style>
