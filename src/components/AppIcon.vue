<script setup lang="ts">
export type IconName = 'telegram' | 'whatsapp' | 'phone' | 'email' | 'linkedin' | 'download' | 'copy' | 'check' | 'replay' | 'card'

defineProps<{ name: IconName; size?: number }>()
</script>

<template>
  <svg
    :width="size ?? 18"
    :height="size ?? 18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <template v-if="name === 'telegram'">
      <path d="M21.5 4.5 2.8 11.7c-.9.4-.9 1.6.1 1.9l4.6 1.4 1.8 5.6c.3.8 1.3 1 1.8.4l2.6-2.6 4.8 3.5c.7.5 1.6.1 1.8-.7L22.9 5.8c.2-1-.6-1.7-1.4-1.3Z" />
      <path d="m7.5 15 10-7.2-7.6 8.6" />
    </template>
    <template v-else-if="name === 'whatsapp'">
      <path d="M3.5 20.5 4.8 16A8.5 8.5 0 1 1 8 19.2Z" />
      <path d="M9 8.6c0 3.3 3 6.4 6.4 6.4l1.2-1.5-1.9-1-1 .9c-1.1-.4-2.5-1.8-2.9-2.9l.9-1-1-1.9Z" />
    </template>
    <template v-else-if="name === 'phone'">
      <path d="M5 3.5h3.2l1.6 4.2-2.1 1.3a11 11 0 0 0 5.3 5.3l1.3-2.1 4.2 1.6V17a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3 5.7a2 2 0 0 1 2-2.2Z" />
    </template>
    <template v-else-if="name === 'email'">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </template>
    <template v-else-if="name === 'download'">
      <path d="M12 4v11" />
      <path d="m7 10.5 5 5 5-5" />
      <path d="M5 20h14" />
    </template>
    <template v-else-if="name === 'copy'">
      <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
      <path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
    </template>
    <template v-else-if="name === 'check'">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </template>
    <template v-else-if="name === 'replay'">
      <path d="M4 12a8 8 0 1 0 2.4-5.7" />
      <path d="M4 4.5v4h4" />
    </template>
    <template v-else-if="name === 'linkedin'">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V17M8 7.5v.01M12 17v-6.5M12 13.2c0-1.6 1-2.7 2.4-2.7S16.5 11.4 16.5 13v4" />
    </template>
    <template v-else-if="name === 'card'">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="9" cy="11" r="2.2" />
      <path d="M5.8 16c.5-1.6 1.7-2.4 3.2-2.4s2.7.8 3.2 2.4M14.5 10h3.5M14.5 13.5h3.5" />
    </template>
  </svg>
</template>
