<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from '../../composables/useLang'

/*
  A sketch of the in-portal BPMN editor. Each version adds to the process,
  the published one carries the highlighter, and the viewer role gets the
  same diagram without the palette or selection.
*/
const props = withDefaults(defineProps<{ version?: number; published?: number; role?: 'edit' | 'view' }>(), {
  version: 14,
  published: 14,
  role: 'edit',
})

const { t } = useLang()
const VERSIONS = [15, 14, 13, 12]

const has = (since: number) => props.version >= since
const edit = computed(() => props.role === 'edit')
const isDraft = (v: number) => v > props.published
</script>

<template>
  <svg class="dg editor" viewBox="0 0 420 300" aria-hidden="true">
    <defs>
      <marker id="arr-editor" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
        <path d="M0 1 9 5 0 9Z" class="dg-arrow" />
      </marker>
    </defs>

    <!-- window -->
    <rect x="0.5" y="0.5" width="419" height="299" rx="12" class="frame" />
    <path d="M0.5 44.5H419.5M44.5 44.5V299.5M296.5 44.5V299.5" class="frame-line" />

    <!-- toolbar: who is looking at the diagram -->
    <rect x="12" y="11" width="220" height="22" rx="11" :class="edit ? 'chip' : 'chip chip-view'" />
    <foreignObject x="12" y="11" width="220" height="22">
      <div class="dg-fo chip-text">{{ edit ? t.cases.editor.roles.edit : t.cases.editor.readOnly }}</div>
    </foreignObject>

    <!-- element palette, only for editors -->
    <g class="palette" :class="{ locked: !edit }">
      <circle cx="22" cy="72" r="9" />
      <rect x="12" y="98" width="20" height="16" rx="4" />
      <path d="M22 132l10 10-10 10-10-10Z" />
      <circle cx="22" cy="182" r="9" class="end" />
    </g>
    <g v-if="!edit" class="lock" transform="translate(14 214)">
      <rect x="1" y="7" width="14" height="10" rx="2" />
      <path d="M4 7V5a4 4 0 0 1 8 0v2" />
    </g>

    <!-- the published version's executed path -->
    <path v-if="version === published" d="M62 120H280" class="dg-wash" stroke-width="12" />

    <!-- flows -->
    <g marker-end="url(#arr-editor)">
      <path d="M71 120H78" class="dg-flow" />
      <path v-if="!has(13)" d="M120 120H269" class="dg-flow" />
      <template v-else>
        <path d="M120 120H130" class="dg-flow" />
        <path d="M156 120H166" class="dg-flow" />
        <path v-if="!has(15)" d="M208 120H269" class="dg-flow" />
        <template v-else>
          <path d="M208 120H218" class="dg-flow" />
          <path d="M260 120H269" class="dg-flow" />
        </template>
        <path v-if="!has(14)" d="M144 132V178" class="dg-flow-soft" />
        <template v-else>
          <path d="M144 132V188H166" class="dg-flow" />
          <path d="M208 188H280V131" class="dg-flow" />
        </template>
      </template>
    </g>

    <!-- shapes -->
    <circle cx="62" cy="120" r="9" class="dg-event dg-task-done" />
    <rect x="80" y="104" width="40" height="32" rx="7" class="dg-task dg-task-done" />
    <template v-if="has(13)">
      <path d="M144 108l12 12-12 12-12-12Z" class="dg-task dg-task-done" />
      <rect x="168" y="104" width="40" height="32" rx="7" class="dg-task dg-task-done" />
      <circle v-if="!has(14)" cx="144" cy="188" r="9" class="dg-event dg-event-end" />
    </template>
    <rect v-if="has(14)" x="168" y="172" width="40" height="32" rx="7" class="dg-task" />
    <rect v-if="has(15)" x="220" y="104" width="40" height="32" rx="7" class="dg-task draft" :class="{ 'dg-task-done': !isDraft(15) }" />
    <circle cx="280" cy="120" r="9" class="dg-event dg-event-end" />

    <!-- selection handles around the newest task, only while editing -->
    <rect v-if="edit" :x="has(15) ? 214 : has(13) ? 162 : 74" y="98" width="52" height="44" rx="9" class="selection" />

    <!-- versions panel -->
    <foreignObject x="306" y="52" width="106" height="24">
      <div class="dg-fo dg-fo-start panel-title">{{ t.cases.editor.versions }}</div>
    </foreignObject>
    <g v-for="(v, i) in VERSIONS" :key="v" :transform="`translate(304 ${84 + i * 50})`">
      <rect width="108" height="42" rx="8" :class="['version', { current: v === version }]" />
      <circle cx="12" cy="14" r="4" :class="['version-dot', isDraft(v) ? 'draft' : 'published']" />
      <text x="22" y="18" class="dg-text">v{{ v }}</text>
      <text x="12" y="34" class="dg-text-muted version-status">
        {{ isDraft(v) ? t.cases.editor.draft : t.cases.editor.published }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.frame {
  fill: var(--sheet);
  stroke: var(--rule);
}

.frame-line {
  fill: none;
  stroke: var(--rule);
}

.chip {
  fill: color-mix(in srgb, var(--mark) 45%, var(--sheet));
  transition: fill 200ms ease;
}

.chip-view {
  fill: color-mix(in srgb, var(--ink) 10%, var(--sheet));
}

.chip-text {
  font-size: 12px;
  font-weight: 600;
}

.palette circle,
.palette rect,
.palette path {
  fill: var(--sheet);
  stroke: var(--ink-2);
  stroke-width: 1.5;
  transition: opacity 200ms ease;
}

.palette .end {
  stroke-width: 3;
}

.palette.locked {
  opacity: 0.3;
}

.lock {
  fill: none;
  stroke: var(--ink-2);
  stroke-width: 1.6;
  stroke-linecap: round;
}

.draft {
  stroke-dasharray: 4 3;
}

.selection {
  fill: none;
  stroke: var(--ink-2);
  stroke-width: 1;
  stroke-dasharray: 3 3;
}

.panel-title {
  font-size: 13px;
  font-weight: 640;
  color: var(--ink-2);
}

.version {
  fill: var(--sheet);
  stroke: var(--rule);
  transition: stroke 160ms ease;
}

.version.current {
  stroke: var(--ink);
  stroke-width: 2;
}

.version-dot.published {
  fill: var(--mark-ink);
}

.version-dot.draft {
  fill: none;
  stroke: var(--ink-3);
  stroke-width: 1.5;
}

.version-status {
  font-size: 12px;
}
</style>
