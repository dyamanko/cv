<script setup lang="ts">
import { ref } from 'vue'
import { useLang } from '../composables/useLang'
import type { Contact } from '../content/types'
import AppIcon from './AppIcon.vue'

const { t } = useLang()
const base = import.meta.env.BASE_URL

const copied = ref<Contact['id'] | null>(null)
let resetTimer = 0

async function copy(contact: Contact) {
  try {
    await navigator.clipboard.writeText(contact.value)
  } catch {
    return
  }
  copied.value = contact.id
  clearTimeout(resetTimer)
  resetTimer = window.setTimeout(() => (copied.value = null), 1800)
}
</script>

<template>
  <section id="contacts" class="contacts" aria-labelledby="contacts-title">
    <div class="page contacts-inner">
      <header class="contacts-head">
        <h2 id="contacts-title">{{ t.contacts.title }}</h2>
        <p class="lead">{{ t.contacts.lead }}</p>
      </header>

      <ul class="list">
        <li v-for="contact in t.contacts.items" :key="contact.id" class="item">
          <a
            class="link"
            :href="contact.href"
            :target="contact.href.startsWith('http') ? '_blank' : undefined"
            :rel="contact.href.startsWith('http') ? 'noopener' : undefined"
          >
            <AppIcon :name="contact.id" :size="20" />
            <span class="label">{{ contact.label }}</span>
            <span class="value">{{ contact.value }}</span>
          </a>
          <button
            v-if="contact.copyable"
            type="button"
            class="copy"
            :aria-label="`${t.contacts.copy}: ${contact.value}`"
            @click="copy(contact)"
          >
            <AppIcon :name="copied === contact.id ? 'check' : 'copy'" :size="18" />
          </button>
        </li>
      </ul>

      <p class="visually-hidden" aria-live="polite">{{ copied ? t.contacts.copied : '' }}</p>

      <div class="resume">
        <p class="resume-title">{{ t.contacts.resumeTitle }}</p>
        <div class="resume-links">
          <a class="resume-link" :href="`${base}resume/dmitrii-iamanko-en.pdf`" download lang="en">
            <AppIcon name="download" />
            {{ t.contacts.resumeEn }}
          </a>
          <a class="resume-link" :href="`${base}resume/dmitrii-iamanko-ru.pdf`" download lang="ru">
            <AppIcon name="download" />
            {{ t.contacts.resumeRu }}
          </a>
        </div>
      </div>

      <footer class="footer">
        <p>{{ t.footer.built }} <a href="https://github.com/dyamanko/cv">{{ t.footer.source }}</a></p>
        <p>{{ t.footer.updated }}</p>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.contacts {
  background: var(--block);
  color: var(--on-block);
}

.contacts-inner {
  display: grid;
  gap: 40px;
  padding-top: clamp(64px, 10vw, 120px);
  padding-bottom: 32px;
}

.contacts-head {
  display: grid;
  gap: 16px;
  max-width: 40em;
}

.contacts-head h2 {
  font-size: clamp(40px, 7vw, 80px);
  line-height: 1;
  letter-spacing: -0.03em;
}

.lead {
  font-size: clamp(17px, 1.6vw, 20px);
  color: var(--on-block-2);
}

.list {
  display: grid;
  border-top: 1px solid color-mix(in srgb, var(--on-block) 18%, transparent);
}

.item {
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid color-mix(in srgb, var(--on-block) 18%, transparent);
}

.link {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  grid-template-areas:
    'icon label'
    'icon value';
  align-items: center;
  gap: 2px 16px;
  flex: 1;
  min-width: 0;
  padding-block: 16px;
  color: inherit;
  text-decoration: none;
}

.link > :first-child {
  grid-area: icon;
  color: var(--on-block-2);
}

.label {
  grid-area: label;
  font-size: 14px;
  color: var(--on-block-2);
}

.value {
  grid-area: value;
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 600;
  overflow-wrap: anywhere;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
  transition: text-decoration-color 160ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .link:hover .value {
    text-decoration-color: currentColor;
  }
}

.copy {
  display: grid;
  place-items: center;
  flex: none;
  width: 44px;
  height: 44px;
  border: 1px solid color-mix(in srgb, var(--on-block) 22%, transparent);
  border-radius: 10px;
  background: transparent;
  color: var(--on-block);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition:
    transform 120ms var(--ease-out),
    border-color 160ms ease;
}

.copy:active {
  transform: scale(0.95);
}

@media (hover: hover) and (pointer: fine) {
  .copy:hover {
    border-color: var(--on-block);
  }
}

.contacts :focus-visible {
  outline-color: var(--on-block);
}

.resume {
  display: grid;
  gap: 14px;
}

.resume-title {
  font-size: 14px;
  color: var(--on-block-2);
}

.resume-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.resume-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 20px;
  border-radius: 10px;
  background: var(--on-block);
  color: var(--block);
  font-weight: 600;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  transition:
    transform 140ms var(--ease-out),
    background-color 160ms ease;
}

.resume-link:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .resume-link:hover {
    background: color-mix(in srgb, var(--on-block) 82%, var(--mark));
  }
}

.footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 24px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid color-mix(in srgb, var(--on-block) 18%, transparent);
  font-size: 14px;
  color: var(--on-block-2);
}

.footer a {
  color: var(--on-block);
}

@media (min-width: 960px) {
  .contacts-inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    column-gap: 80px;
  }

  .contacts-head {
    grid-row: span 2;
    align-content: start;
  }

  .footer {
    grid-column: 1 / -1;
  }
}
</style>
