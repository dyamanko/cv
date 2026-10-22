<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLang } from '../composables/useLang'
import AppIcon from './AppIcon.vue'

/*
  Once the first screen scrolls away, the contacts and the PDF stay one tap away.
  It slides down with transform only and is not rendered in the static HTML.
*/
const { lang, t } = useLang()
const visible = ref(false)
let observer: IntersectionObserver | null = null

const telegram = computed(() => t.value.contacts.items.find((c) => c.id === 'telegram'))
const email = computed(() => t.value.contacts.items.find((c) => c.id === 'email'))
const cvHref = computed(() => `${import.meta.env.BASE_URL}Dmitrii-Iamanko-CV-${lang.value.toUpperCase()}.pdf`)

onMounted(() => {
  const hero = document.querySelector('.hero')
  if (!hero) return
  // shows up once the first screen, with its contacts, has scrolled out of view
  observer = new IntersectionObserver(([entry]) => (visible.value = !entry.isIntersecting && entry.boundingClientRect.top < 0))
  observer.observe(hero)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="sticky" :class="{ visible }" :aria-hidden="!visible" :inert="!visible || undefined">
    <div class="page bar">
      <p class="who">
        <span class="name" translate="no">{{ t.hero.name.join(' ') }}</span>
        <span class="role">{{ t.hero.role }}</span>
      </p>
      <div class="actions">
        <a v-if="telegram" class="action action-primary" :href="telegram.href" target="_blank" rel="noopener">
          <AppIcon name="telegram" />
          <span class="action-text">Telegram</span>
        </a>
        <a v-if="email" class="action" :href="email.href" :aria-label="email.value">
          <AppIcon name="email" />
        </a>
        <a class="action" :href="cvHref" target="_blank" rel="noopener">
          <AppIcon name="download" />
          <span class="action-text">PDF</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  border-bottom: 1px solid var(--rule);
  background: var(--paper);
  box-shadow: 0 8px 24px -16px rgb(16 24 40 / 0.35);
  transform: translateY(-100%);
  transition: transform 240ms var(--ease-out);
  padding-top: env(safe-area-inset-top, 0px);
}

.sticky.visible {
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .sticky {
    transition: none;
  }
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 56px;
}

.who {
  display: grid;
  min-width: 0;
  line-height: 1.2;
}

.name {
  font-weight: 700;
  font-size: 15px;
}

.role {
  overflow: hidden;
  font-size: 13px;
  color: var(--ink-2);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.actions {
  display: flex;
  flex: none;
  gap: 6px;
}

.action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 44px;
  min-height: 40px;
  padding: 0 12px;
  border: 1.5px solid var(--ink);
  border-radius: 10px;
  background: var(--sheet);
  color: var(--ink);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 120ms var(--ease-out);
}

.action-primary {
  background: var(--ink);
  color: var(--paper);
}

.action:active {
  transform: scale(0.97);
}

@media (pointer: coarse) {
  .action {
    min-height: 44px;
  }
}

@media (max-width: 420px) {
  .role,
  .action-text {
    display: none;
  }

  .action {
    padding: 0;
  }
}
</style>
