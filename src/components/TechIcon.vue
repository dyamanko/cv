<script setup lang="ts">
import { computed } from 'vue'

// local SVGs, inlined at build time so they inherit currentColor
const icons = import.meta.glob<string>('../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true })

const props = defineProps<{ icon?: string; name: string; size?: number }>()

const svg = computed(() => (props.icon ? icons[`../assets/icons/${props.icon}.svg`] : undefined))
// no logo: the first letters of the name, like a monogram tile
const monogram = computed(() =>
  props.name
    .replace(/[^\p{L}\p{N} ]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase(),
)
</script>

<template>
  <span class="tech-icon" :style="{ '--size': `${size ?? 24}px` }" aria-hidden="true">
    <!-- eslint-disable-next-line vue/no-v-html -- trusted files from src/assets/icons -->
    <span v-if="svg" class="glyph" v-html="svg" />
    <span v-else class="monogram">{{ monogram }}</span>
  </span>
</template>

<style scoped>
.tech-icon {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: var(--size);
  height: var(--size);
}

.glyph,
.glyph :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.monogram {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border: 1.5px solid currentColor;
  border-radius: 6px;
  font-size: calc(var(--size) * 0.4);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
}
</style>
