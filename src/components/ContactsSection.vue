<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLang } from '../composables/useLang'
import type { Contact } from '../content/types'
import AppIcon from './AppIcon.vue'

const { lang, t } = useLang()
const base = import.meta.env.BASE_URL
const SITE = 'https://dyamanko.github.io/cv/'

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

const cvHref = (l: 'ru' | 'en') => `${base}Dmitrii-Iamanko-CV-${l.toUpperCase()}.pdf`

/** a contact card the recruiter can save to the phone in one tap */
const vcard = computed(() => {
  const items = t.value.contacts.items
  const find = (id: Contact['id']) => items.find((c) => c.id === id)
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${t.value.hero.name.join(' ')}`,
    `N:${t.value.hero.name[1]};${t.value.hero.name[0]};;;`,
    `TITLE:${t.value.hero.role}`,
    find('email') && `EMAIL;TYPE=INTERNET:${find('email')!.value}`,
    find('whatsapp') && `TEL;TYPE=CELL:${find('whatsapp')!.value.replace(/[^\d+]/g, '')}`,
    find('phone') && `TEL;TYPE=CELL:${find('phone')!.value.replace(/[^\d+]/g, '')}`,
    find('telegram') && `X-SOCIALPROFILE;TYPE=telegram:${find('telegram')!.href}`,
    find('linkedin') && `X-SOCIALPROFILE;TYPE=linkedin:${find('linkedin')!.href}`,
    `URL:${SITE}${lang.value === 'ru' ? 'ru/' : ''}`,
    'END:VCARD',
  ].filter(Boolean)
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`
})
</script>

<template>
  <section id="contacts" class="contacts" aria-labelledby="contacts-title">
    <div class="page contacts-inner">
      <header class="contacts-head">
        <h2 id="contacts-title">{{ t.contacts.title }}</h2>
        <p class="lead">{{ t.contacts.lead }}</p>
        <dl class="terms">
          <div v-for="term in t.contacts.terms" :key="term.label">
            <dt>{{ term.label }}</dt>
            <dd>{{ term.value }}</dd>
          </div>
        </dl>
      </header>

      <div class="channels">
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
              <span class="value" translate="no">
                <template v-if="contact.value.includes('@') && !contact.value.startsWith('@')">
                  {{ contact.value.split('@')[0] }}@<wbr />{{ contact.value.split('@')[1] }}
                </template>
                <template v-else>{{ contact.value }}</template>
              </span>
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

        <div class="files">
          <p class="files-title">{{ t.contacts.cvTitle }}</p>
          <div class="file-links">
            <a class="file-link" :href="cvHref('en')" target="_blank" rel="noopener" lang="en">
              <AppIcon name="download" />
              {{ t.hero.cvEn }}
            </a>
            <a class="file-link" :href="cvHref('ru')" target="_blank" rel="noopener" lang="ru">
              <AppIcon name="download" />
              {{ t.hero.cvRu }}
            </a>
            <a class="file-link file-link-quiet" :href="vcard" download="Dmitrii-Iamanko.vcf">
              <AppIcon name="card" />
              {{ t.contacts.vcard }}
            </a>
          </div>
        </div>
      </div>

      <footer class="footer">
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
  gap: 36px;
  padding-top: clamp(56px, 9vw, 112px);
  padding-bottom: 28px;
}

.contacts-head {
  display: grid;
  gap: 14px;
  align-content: start;
  max-width: 40em;
}

.contacts-head h2 {
  font-size: clamp(36px, 6vw, 68px);
  line-height: 1;
  letter-spacing: -0.03em;
}

.lead {
  font-size: clamp(16px, 1.6vw, 19px);
  color: var(--on-block-2);
}

.terms {
  display: grid;
  margin-top: 8px;
  border-top: 1px solid color-mix(in srgb, var(--on-block) 18%, transparent);
}

.terms div {
  display: grid;
  gap: 2px;
  padding-block: 10px;
  border-bottom: 1px solid color-mix(in srgb, var(--on-block) 18%, transparent);
}

.terms dt {
  font-size: 13px;
  color: var(--on-block-2);
}

.terms dd {
  font-weight: 600;
}

.channels {
  display: grid;
  gap: 28px;
  align-content: start;
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
  padding-block: 14px;
  color: inherit;
  text-decoration: none;
}

.link > :first-child {
  grid-area: icon;
  color: var(--on-block-2);
}

.label {
  grid-area: label;
  font-size: 13px;
  color: var(--on-block-2);
}

/* break long addresses after the @, never inside the domain */
.value {
  grid-area: value;
  font-size: clamp(17px, 2vw, 21px);
  font-weight: 600;
  overflow-wrap: break-word;
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

.files {
  display: grid;
  gap: 12px;
}

.files-title {
  font-size: 13px;
  color: var(--on-block-2);
}

.file-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.file-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 46px;
  padding: 0 18px;
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

.file-link-quiet {
  border: 1px solid color-mix(in srgb, var(--on-block) 40%, transparent);
  background: transparent;
  color: var(--on-block);
}

.file-link:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .file-link:not(.file-link-quiet):hover {
    background: color-mix(in srgb, var(--on-block) 82%, var(--mark));
  }

  .file-link-quiet:hover {
    border-color: var(--on-block);
  }
}

.footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 24px;
  margin-top: 16px;
  padding-top: 20px;
  border-top: 1px solid color-mix(in srgb, var(--on-block) 18%, transparent);
  font-size: 13px;
  color: var(--on-block-2);
}

@media (min-width: 960px) {
  .contacts-inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    column-gap: 72px;
  }

  .footer {
    grid-column: 1 / -1;
  }
}
</style>
