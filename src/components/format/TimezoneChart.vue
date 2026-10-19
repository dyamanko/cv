<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLang } from '../../composables/useLang'

const HOME = 'Asia/Tbilisi'
const DAY = { start: 9, end: 18 }
const AXIS = { from: 6, to: 24 }
const ticks = [6, 9, 12, 15, 18, 21, 24]

const { lang, t } = useLang()
const now = ref(new Date())
let timer = 0

/** UTC offset of a zone in hours at a given moment; Intl knows about daylight saving. */
function offsetHours(timeZone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'))
  return Math.round((asUtc - date.getTime()) / 60000) / 60
}

const pct = (h: number) => `${((h - AXIS.from) / (AXIS.to - AXIS.from)) * 100}%`
const fmt = (h: number) => new Intl.NumberFormat(lang.value, { maximumFractionDigits: 1 }).format(h)

const rows = computed(() => {
  const home = offsetHours(HOME, now.value)
  const z = t.value.format.zones
  return z.cities.map((city) => {
    const shift = home - offsetHours(city.tz, now.value)
    const start = DAY.start + shift
    const end = DAY.end + shift
    const sharedFrom = Math.max(start, DAY.start)
    const sharedTo = Math.min(end, DAY.end)
    const shared = Math.max(0, sharedTo - sharedFrom)
    return { ...city, start, end, sharedFrom, sharedTo, label: z.overlap.replace('{h}', fmt(shared)) }
  })
})

const homeHour = computed(() => {
  const d = now.value
  return (d.getUTCHours() + d.getUTCMinutes() / 60 + offsetHours(HOME, d) + 24) % 24
})

const nowLabel = computed(() => {
  const time = new Intl.DateTimeFormat(lang.value, { timeZone: HOME, hour: '2-digit', minute: '2-digit' }).format(now.value)
  return t.value.format.zones.nowIn.replace('{time}', time)
})

onMounted(() => {
  timer = window.setInterval(() => (now.value = new Date()), 60_000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <figure class="zones">
    <figcaption class="zones-head">
      <span class="zones-title">{{ t.format.zones.title }}</span>
      <span class="zones-note">{{ t.format.zones.note }}</span>
    </figcaption>

    <ul class="legend" aria-hidden="true">
      <li><span class="key own" />{{ t.format.zones.self }}</li>
      <li><span class="key shared" />{{ t.format.zones.shared }}</li>
    </ul>

    <div class="plot">
      <div v-if="homeHour >= AXIS.from && homeHour <= AXIS.to" class="track-area" aria-hidden="true">
        <span class="now" :style="{ left: pct(homeHour) }" />
      </div>

      <ul class="rows">
        <li class="row">
          <span class="row-name">{{ t.format.zones.self }}</span>
          <span class="track" aria-hidden="true">
            <span class="bar own" :style="{ left: pct(DAY.start), width: `calc(${pct(DAY.end)} - ${pct(DAY.start)})` }" />
          </span>
          <span class="row-value">9:00–18:00</span>
        </li>
        <li v-for="row in rows" :key="row.tz" class="row">
          <span class="row-name">{{ row.name }}</span>
          <span class="track" aria-hidden="true">
            <span class="bar day" :style="{ left: pct(row.start), width: `calc(${pct(row.end)} - ${pct(row.start)})` }" />
            <span
              class="bar shared"
              :style="{ left: pct(row.sharedFrom), width: `calc(${pct(row.sharedTo)} - ${pct(row.sharedFrom)})` }"
            />
          </span>
          <span class="row-value">{{ row.label }}</span>
        </li>
      </ul>

      <div class="axis" aria-hidden="true">
        <span v-for="tick in ticks" :key="tick" :style="{ left: pct(tick) }">{{ tick }}:00</span>
      </div>
    </div>

    <p class="now-label">
      <span class="now-dot" aria-hidden="true" />
      {{ nowLabel }}
    </p>
  </figure>
</template>

<style scoped>
.zones {
  display: grid;
  gap: 16px;
  padding: clamp(16px, 2.4vw, 24px);
  container-type: inline-size;
}

.zones-head {
  display: grid;
  gap: 4px;
}

.zones-title {
  font-size: 16px;
  font-weight: 640;
}

.zones-note {
  font-size: 14px;
  color: var(--ink-2);
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

.key.own {
  border: 2px solid var(--ink);
}

.key.shared {
  background: var(--viz-1);
}

.plot {
  position: relative;
  --name-w: 0px;
  --value-w: 0px;
}

.rows {
  display: grid;
  gap: 14px;
}

.row {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'name value'
    'track track';
  gap: 4px 12px;
  align-items: center;
}

.row-name {
  grid-area: name;
  font-size: 14px;
  font-weight: 600;
}

.row-value {
  grid-area: value;
  font-size: 14px;
  color: var(--ink-2);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.track {
  grid-area: track;
  position: relative;
  height: 18px;
  background: linear-gradient(var(--rule), var(--rule)) 0 50% / 100% 1px no-repeat;
}

.bar {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 4px;
}

.bar.own {
  border: 2px solid var(--ink);
  background: var(--sheet);
}

.bar.day {
  background: var(--viz-base-soft);
}

.bar.shared {
  background: var(--viz-1);
}

.axis {
  position: relative;
  height: 20px;
  margin-top: 10px;
  margin-left: var(--name-w);
  margin-right: var(--value-w);
  font-size: 12px;
  color: var(--ink-2);
  font-variant-numeric: tabular-nums;
}

.axis span {
  position: absolute;
  transform: translateX(-50%);
}

.axis span:first-child {
  transform: none;
}

.axis span:last-child {
  transform: translateX(-100%);
}

.track-area {
  display: none;
  position: absolute;
  top: -6px;
  bottom: 24px;
  left: var(--name-w);
  right: var(--value-w);
  z-index: 1;
  pointer-events: none;
}

.now {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background: var(--ink);
}

.now-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--ink-2);
}

.now-dot {
  width: 10px;
  height: 2px;
  background: var(--ink);
}

@container (min-width: 520px) {
  .plot {
    --name-w: 118px;
    --value-w: 112px;
  }

  .row {
    grid-template-columns: var(--name-w) minmax(0, 1fr) var(--value-w);
    grid-template-areas: 'name track value';
    gap: 0;
  }

  .row-value {
    padding-left: 12px;
  }

  .track-area {
    display: block;
  }
}
</style>
