<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from '../../composables/useLang'

const { t } = useLang()

const FROM = 2020
const TO = 2027
const years = Array.from({ length: TO - FROM }, (_, i) => FROM + i)

/** month is 0-based, like Date */
const at = (year: number, month = 0) => ((year + month / 12 - FROM) / (TO - FROM)) * 100

const now = new Date()
const nowAt = Math.min(at(now.getFullYear(), now.getMonth() + now.getDate() / 31), 100)

const jobs = [
  { name: 'Astelit', from: at(2020, 7), to: at(2023, 9), current: false },
  { name: 'IT_One', from: at(2023, 10), to: nowAt, current: true },
]

// the graduation month is unknown, so both degrees sit mid-year
const degrees = computed(() => t.value.experience.degrees.map((d) => ({ ...d, pos: at(d.year, 6) })))
</script>

<template>
  <div class="timeline" aria-hidden="true">
    <div class="plot">
      <div class="lane">
        <span class="lane-name">{{ t.experience.work }}</span>
        <div class="track">
          <span
            v-for="job in jobs"
            :key="job.name"
            class="job"
            :class="{ current: job.current }"
            :style="{ left: `${job.from}%`, width: `${job.to - job.from}%` }"
          >
            {{ job.name }}
          </span>
        </div>
      </div>

      <div class="lane">
        <span class="lane-name">{{ t.experience.study }}</span>
        <div class="track track-study">
          <span v-for="d in degrees" :key="d.year" class="degree" :style="{ left: `${d.pos}%` }">
            <span class="degree-dot" />
            <span class="degree-label">{{ d.label }}</span>
          </span>
        </div>
      </div>

      <span class="now" :style="{ left: `${nowAt}%` }">
        <span class="now-label">{{ t.experience.now }}</span>
      </span>
    </div>

    <div class="axis">
      <span v-for="y in years" :key="y" class="year" :style="{ left: `${at(y)}%` }">{{ y }}</span>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  padding: 34px clamp(16px, 2.4vw, 28px) 14px;
  container-type: inline-size;
}

.plot {
  position: relative;
  display: grid;
  gap: 16px;
  padding-bottom: 12px;
}

.lane {
  display: grid;
  gap: 6px;
}

.lane-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-2);
}

.track {
  position: relative;
  height: 44px;
  background: linear-gradient(var(--rule), var(--rule)) 0 50% / 100% 1px no-repeat;
}

/* jobs are drawn as BPMN tasks: the finished one filled, the current one active */
.job {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding-inline: 12px;
  border: 1.6px solid var(--ink);
  border-radius: 10px;
  background: color-mix(in srgb, var(--mark) 55%, var(--sheet));
  font-size: 14px;
  font-weight: 640;
  white-space: nowrap;
  overflow: hidden;
}

/* still running: thick border, open right end */
.job.current {
  border-width: 3px;
  border-right: 0;
  border-radius: 10px 0 0 10px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--mark) 30%, var(--sheet)) 60%, transparent);
}

.track-study {
  height: 50px;
  background-position: 0 9px;
}

.degree {
  position: absolute;
  top: 0;
  display: grid;
  justify-items: center;
  gap: 6px;
  transform: translateX(-50%);
}

.degree-dot {
  width: 18px;
  height: 18px;
  border: 3.5px solid var(--ink);
  border-radius: 50%;
  background: color-mix(in srgb, var(--mark) 55%, var(--sheet));
}

.degree-label {
  font-size: 13px;
  font-weight: 560;
  white-space: nowrap;
}

.now {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background: var(--ink);
}

/* "now" is always near the right edge, so the label hangs to the left of the line */
.now-label {
  position: absolute;
  bottom: calc(100% + 6px);
  right: -1px;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--ink);
  color: var(--sheet);
  font-size: 12px;
  font-weight: 640;
  white-space: nowrap;
}

.axis {
  position: relative;
  height: 24px;
  border-top: 1px solid var(--rule);
  font-size: 13px;
  color: var(--ink-2);
  font-variant-numeric: tabular-nums;
}

.year {
  position: absolute;
  top: 6px;
  padding-left: 6px;
  border-left: 1px solid var(--rule);
  line-height: 1;
}

@container (max-width: 520px) {
  .year:nth-child(even) {
    visibility: hidden;
  }

  .degree-label {
    font-size: 12px;
  }
}
</style>
