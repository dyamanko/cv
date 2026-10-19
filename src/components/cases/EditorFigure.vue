<script setup lang="ts">
import { useLang } from '../../composables/useLang'

const { t } = useLang()

const versions = [
  { name: 'v15', status: 'draft' },
  { name: 'v14', status: 'published', current: true },
  { name: 'v13', status: 'published' },
  { name: 'v12', status: 'published' },
] as const
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

    <!-- role chip in the toolbar -->
    <rect x="12" y="11" width="236" height="22" rx="11" class="chip" />
    <foreignObject x="12" y="11" width="236" height="22">
      <div class="dg-fo chip-text">{{ t.cases.editor.role }}</div>
    </foreignObject>

    <!-- element palette -->
    <g class="palette">
      <circle cx="22" cy="72" r="9" />
      <rect x="12" y="98" width="20" height="16" rx="4" />
      <path d="M22 132l10 10-10 10-10-10Z" />
      <circle cx="22" cy="182" r="9" class="end" />
    </g>

    <!-- canvas: a small process with the executed path highlighted -->
    <path d="M68 140H266" class="dg-wash" stroke-width="12" />
    <path v-for="d in ['M78 140H110', 'M176 140H196', 'M226 140H244']" :key="d" :d="d" class="dg-flow" marker-end="url(#arr-editor)" />
    <circle cx="68" cy="140" r="10" class="dg-event dg-task-done" />
    <rect x="112" y="118" width="64" height="44" rx="8" class="dg-task dg-task-done" />
    <path d="M212 126l14 14-14 14-14-14Z" class="dg-task dg-task-done" />
    <rect x="246" y="118" width="40" height="44" rx="8" class="dg-task dg-task-active" />
    <path d="M212 154V214H244" class="dg-flow-soft" marker-end="url(#arr-editor)" />
    <rect x="246" y="194" width="40" height="40" rx="8" class="dg-task" />

    <!-- selection handles around the active task -->
    <rect x="240" y="112" width="52" height="56" rx="10" class="selection" />

    <!-- versions panel -->
    <foreignObject x="306" y="52" width="106" height="24">
      <div class="dg-fo dg-fo-start panel-title">{{ t.cases.editor.versions }}</div>
    </foreignObject>
    <g v-for="(v, i) in versions" :key="v.name" :transform="`translate(304 ${84 + i * 50})`">
      <rect width="108" height="42" rx="8" :class="['version', { current: 'current' in v && v.current }]" />
      <circle cx="12" cy="14" r="4" :class="['version-dot', v.status]" />
      <text x="22" y="18" class="dg-text">{{ v.name }}</text>
      <text x="12" y="34" class="dg-text-muted version-status">
        {{ v.status === 'draft' ? t.cases.editor.draft : t.cases.editor.published }}
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
}

.palette .end {
  stroke-width: 3;
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
}

.version.current {
  stroke: var(--ink);
  stroke-width: 1.5;
}

.version-dot {
  fill: var(--ink-3);
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
