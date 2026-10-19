<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLang } from '../../composables/useLang'

type Kind = 'base' | 'range' | 'generation' | 'refinement'

interface Segment {
  id: string
  kind: Kind
  from: number
  to: number
  value: string
  label: string
}

const { t } = useLang()
const MAX = 16
const ticks = [0, 4, 8, 12, 16]

const rows = computed(() => {
  const c = t.value.cases.chart
  const generation = 10 / 60
  return [
    {
      id: 'manual',
      label: c.manual,
      value: c.manualValue,
      segments: [
        { id: 'manual-min', kind: 'base', from: 0, to: 8, value: c.manualValue, label: `${c.manual}, ${c.manualHint}` },
        { id: 'manual-max', kind: 'range', from: 8, to: 16, value: c.manualValue, label: `${c.manual}, ${c.manualHint}` },
      ] as Segment[],
    },
    {
      id: 'automated',
      label: c.automated,
      value: c.automatedValue,
      segments: [
        { id: 'gen', kind: 'generation', from: 0, to: generation, value: c.generationValue, label: c.generation },
        { id: 'ref', kind: 'refinement', from: generation, to: generation + 2, value: c.refinementValue, label: c.refinement },
      ] as Segment[],
    },
  ]
})

const active = ref<Segment | null>(null)
const pct = (h: number) => `${(h / MAX) * 100}%`
</script>

<template>
  <figure class="chart">
    <figcaption class="chart-title">{{ t.cases.chart.title }}</figcaption>

    <ul class="legend" aria-hidden="true">
      <li><span class="key generation" />{{ t.cases.chart.generation }}</li>
      <li><span class="key refinement" />{{ t.cases.chart.refinement }}</li>
    </ul>

    <div class="plot" aria-hidden="true">
      <div v-for="row in rows" :key="row.id" class="row">
        <span class="row-label">{{ row.label }}</span>
        <div class="track">
          <span v-for="tick in ticks" :key="tick" class="gridline" :style="{ left: pct(tick) }" />
          <span
            v-for="(seg, i) in row.segments"
            :key="seg.id"
            class="bar"
            :class="[seg.kind, { active: active?.id === seg.id, end: i === row.segments.length - 1 }]"
            :style="{ left: pct(seg.from), width: pct(seg.to - seg.from) }"
            @pointerenter="active = seg"
            @pointerleave="active = null"
          />
          <span class="row-value" :style="{ left: pct(row.segments[row.segments.length - 1].to) }">{{ row.value }}</span>

          <span
            v-if="active && row.segments.some((s) => s.id === active?.id)"
            class="tooltip"
            :style="{ left: pct((active.from + active.to) / 2) }"
          >
            <strong>{{ active.value }}</strong>
            {{ active.label }}
          </span>
        </div>
      </div>

      <div class="axis">
        <span v-for="tick in ticks" :key="tick" :style="{ left: pct(tick) }">{{ tick }}</span>
      </div>
    </div>

    <p class="note">{{ t.cases.chart.note }}</p>

    <table class="visually-hidden">
      <caption>{{ t.cases.chart.tableCaption }}</caption>
      <thead>
        <tr>
          <th scope="col">{{ t.cases.chart.colStage }}</th>
          <th scope="col">{{ t.cases.chart.colTime }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ t.cases.chart.manual }}</td>
          <td>{{ t.cases.chart.manualHint }}, {{ t.cases.chart.manualValue }}</td>
        </tr>
        <tr>
          <td>{{ t.cases.chart.automated }}</td>
          <td>{{ t.cases.chart.automatedValue }}: {{ t.cases.chart.generation }}, {{ t.cases.chart.refinement }}</td>
        </tr>
      </tbody>
    </table>
  </figure>
</template>

<style scoped>
.chart {
  display: grid;
  gap: 14px;
  container-type: inline-size;
}

.chart-title {
  font-size: 16px;
  font-weight: 640;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
  font-size: 14px;
  color: var(--ink-2);
}

.legend li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.key {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.key.generation {
  background: var(--viz-1);
}

.key.refinement {
  background: var(--viz-2);
}

.plot {
  position: relative;
  display: grid;
  gap: 18px;
  /* the track starts after the label column; the grid and axis follow it */
  --label-w: 0px;
  padding-left: var(--label-w);
  padding-right: 96px;
}

.gridline {
  position: absolute;
  top: -9px;
  bottom: -9px;
  width: 1px;
  background: var(--rule);
}

.row {
  position: relative;
  display: grid;
  gap: 6px;
}

.row-label {
  font-size: 14px;
  font-weight: 560;
  color: var(--ink);
}

.track {
  position: relative;
  height: 22px;
}

.bar {
  position: absolute;
  top: 0;
  bottom: 0;
  min-width: 3px;
  transition: filter 160ms ease;
}

/* 2px surface gap between touching segments, rounded data end only */
.bar + .bar {
  border-left: 2px solid var(--sheet);
}

.bar.end {
  border-radius: 0 4px 4px 0;
}

.bar.base {
  background: var(--viz-base);
}

.bar.range {
  background: var(--viz-base-soft);
}

.bar.generation {
  background: var(--viz-1);
}

.bar.refinement {
  background: var(--viz-2);
}

.bar.active {
  filter: brightness(1.12);
}

.row-value {
  position: absolute;
  top: 50%;
  margin-left: 10px;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: 640;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.axis {
  position: relative;
  height: 18px;
  font-size: 13px;
  color: var(--ink-2);
  font-variant-numeric: tabular-nums;
}

.axis span {
  position: absolute;
  transform: translateX(-50%);
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  z-index: 1;
  display: grid;
  min-width: max-content;
  padding: 6px 10px;
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: var(--sheet);
  box-shadow: 0 6px 20px -8px rgb(16 24 40 / 0.25);
  font-size: 13px;
  color: var(--ink-2);
  transform: translateX(-50%);
  pointer-events: none;
}

.tooltip strong {
  font-size: 15px;
  color: var(--ink);
}

.note {
  font-size: 13px;
  color: var(--ink-2);
}

@container (min-width: 460px) {
  .plot {
    --label-w: 132px;
  }

  .row {
    display: block;
  }

  .row-label {
    position: absolute;
    left: calc(-1 * var(--label-w));
    top: 50%;
    width: calc(var(--label-w) - 12px);
    transform: translateY(-50%);
    line-height: 1.2;
  }
}
</style>
