<script setup lang="ts">
import { useLang } from '../../composables/useLang'

const { t } = useLang()
</script>

<template>
  <div class="pipeline">
    <ol class="steps">
      <li
        v-for="(step, i) in t.cases.pipeline.steps"
        :key="step"
        :class="{ doc: i === 0 || i === t.cases.pipeline.steps.length - 1, llm: step.includes('LLM') }"
      >
        <span>{{ step }}</span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.pipeline {
  container-type: inline-size;
}

.steps {
  display: grid;
  gap: 22px;
}

.steps li {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 52px;
  padding: 10px 14px;
  border: 1.6px solid var(--ink);
  border-radius: 10px;
  background: var(--sheet);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.25;
}

/* data objects: a page with a folded corner */
.steps li.doc {
  border-radius: 2px 14px 2px 2px;
  border-style: solid;
  background:
    linear-gradient(225deg, var(--paper) 10px, transparent 10.5px) no-repeat,
    var(--sheet);
}

.steps li.llm {
  background: color-mix(in srgb, var(--mark) 40%, var(--sheet));
}

/* sequence flow to the next step */
.steps li:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  width: 1.6px;
  height: 22px;
  background: var(--ink);
  transform: translateX(-50%);
}

.steps li:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 50%;
  top: calc(100% + 15px);
  border: 5px solid transparent;
  border-top: 7px solid var(--ink);
  transform: translateX(-50%);
}

@container (min-width: 460px) {
  .steps {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 18px;
  }

  .steps li {
    justify-content: center;
    min-height: 72px;
    padding: 8px;
    text-align: center;
    font-size: 13px;
    text-wrap: balance;
  }

  .steps li:not(:last-child)::after {
    left: 100%;
    top: 50%;
    width: 18px;
    height: 1.6px;
    transform: translateY(-50%);
  }

  .steps li:not(:last-child)::before {
    left: calc(100% + 11px);
    top: 50%;
    border: 5px solid transparent;
    border-left: 7px solid var(--ink);
    transform: translateY(-50%);
  }
}
</style>
