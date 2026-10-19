<script setup lang="ts">
import { useLang } from '../../composables/useLang'

const { t } = useLang()
</script>

<template>
  <svg class="dg" viewBox="0 0 420 320" aria-hidden="true">
    <defs>
      <marker id="arr-incidents" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
        <path d="M0 1 9 5 0 9Z" class="dg-arrow" />
      </marker>
    </defs>

    <!-- flows first, shapes on top -->
    <g marker-end="url(#arr-incidents)">
      <path d="M140 58H162" class="dg-flow" />
      <path d="M236 58H268" class="dg-flow" />
      <path d="M340 86V148" class="dg-flow" />
      <path d="M314 176H142" class="dg-flow" />
      <path d="M75 148V88" class="dg-flow loop" />
      <path d="M340 202V256" class="dg-flow" />
    </g>

    <!-- failed job with an incident badge -->
    <rect x="10" y="30" width="130" height="56" rx="10" class="dg-task dg-task-incident" />
    <g transform="translate(140 30)">
      <circle r="11" class="badge-critical" />
      <text dy="0.35em" class="badge-text">!</text>
    </g>
    <foreignObject x="18" y="30" width="114" height="56">
      <div class="dg-fo">{{ t.cases.incidents.failed }}</div>
    </foreignObject>

    <!-- failed-job queue: a data store -->
    <g class="store">
      <path d="M166 40v36c0 5 15 9 34 9s34-4 34-9V40" />
      <ellipse cx="200" cy="40" rx="34" ry="9" />
      <path d="M166 52c0 5 15 9 34 9s34-4 34-9" />
    </g>
    <foreignObject x="150" y="90" width="100" height="22">
      <div class="dg-fo dg-fo-note">{{ t.cases.incidents.queue }}</div>
    </foreignObject>

    <!-- scheduler with a timer marker -->
    <rect x="270" y="30" width="140" height="56" rx="10" class="dg-task" />
    <g class="dg-icon" transform="translate(280 38)">
      <circle cx="7" cy="7" r="6.5" />
      <path d="M7 3.5V7l2.5 1.6" />
    </g>
    <foreignObject x="290" y="30" width="114" height="56">
      <div class="dg-fo">{{ t.cases.incidents.scheduler }}</div>
    </foreignObject>

    <!-- gateway: does the error match a known pattern? -->
    <path d="M340 150l26 26-26 26-26-26Z" class="dg-task" />
    <path d="M331 167l18 18M349 167l-18 18" class="gateway-x" />
    <foreignObject x="150" y="140" width="160" height="22">
      <div class="dg-fo dg-fo-note dg-fo-end">{{ t.cases.incidents.known }}</div>
    </foreignObject>
    <foreignObject x="232" y="180" width="60" height="20">
      <div class="dg-fo dg-fo-flow">{{ t.cases.incidents.yes }}</div>
    </foreignObject>
    <foreignObject x="348" y="214" width="60" height="20">
      <div class="dg-fo dg-fo-flow dg-fo-start">{{ t.cases.incidents.no }}</div>
    </foreignObject>

    <!-- retry, looping back to the job; the loop marker sits at the bottom -->
    <rect x="10" y="148" width="130" height="56" rx="10" class="dg-task dg-task-done" />
    <foreignObject x="18" y="148" width="114" height="40">
      <div class="dg-fo">{{ t.cases.incidents.retry }}</div>
    </foreignObject>
    <g class="dg-icon" transform="translate(68 186)">
      <path d="M11 6a5 5 0 1 1-1.5-3.6" />
      <path d="M10 0.5v2.4h-2.4" />
    </g>
    <foreignObject x="84" y="113" width="140" height="22">
      <div class="dg-fo dg-fo-flow dg-fo-start">{{ t.cases.incidents.limit }}</div>
    </foreignObject>

    <!-- escalation to a person -->
    <rect x="270" y="258" width="140" height="56" rx="10" class="dg-task" />
    <g class="dg-icon" transform="translate(280 266)">
      <circle cx="7" cy="4.5" r="3" />
      <path d="M1.5 14c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6" />
    </g>
    <foreignObject x="290" y="258" width="114" height="56">
      <div class="dg-fo">{{ t.cases.incidents.admin }}</div>
    </foreignObject>
  </svg>
</template>

<style scoped>
.badge-critical {
  fill: var(--critical);
}

.badge-text {
  fill: var(--sheet);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
}

.store path,
.store ellipse {
  fill: var(--sheet);
  stroke: var(--ink);
  stroke-width: 1.6;
}

.store path:last-child {
  fill: none;
}

.gateway-x {
  stroke: var(--ink);
  stroke-width: 2.2;
  stroke-linecap: round;
}
</style>
