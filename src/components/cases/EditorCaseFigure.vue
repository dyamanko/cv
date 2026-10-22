<script setup lang="ts">
import { ref } from 'vue'
import { useLang } from '../../composables/useLang'
import EditorFigure from './EditorFigure.vue'

const { t } = useLang()

const versions = [12, 13, 14, 15]
const version = ref(14)
const published = ref(14)
const role = ref<'edit' | 'view'>('edit')

function publish() {
  published.value = 15
  version.value = 15
}
</script>

<template>
  <figure class="editor-case">
    <div class="controls">
      <div class="control" role="group" :aria-label="t.cases.editor.versionLabel">
        <span class="control-label" aria-hidden="true">{{ t.cases.editor.versionLabel }}</span>
        <div class="options">
          <button
            v-for="v in versions"
            :key="v"
            type="button"
            class="option"
            :aria-pressed="version === v"
            @click="version = v"
          >
            v{{ v }}
          </button>
        </div>
      </div>

      <div class="control" role="group" :aria-label="t.cases.editor.roleLabel">
        <span class="control-label" aria-hidden="true">{{ t.cases.editor.roleLabel }}</span>
        <div class="options">
          <button type="button" class="option" :aria-pressed="role === 'edit'" @click="role = 'edit'">
            {{ t.cases.editor.roles.edit }}
          </button>
          <button type="button" class="option" :aria-pressed="role === 'view'" @click="role = 'view'">
            {{ t.cases.editor.roles.view }}
          </button>
        </div>
      </div>

      <button
        type="button"
        class="publish"
        :disabled="role !== 'edit' || published === 15"
        @click="publish"
      >
        {{ t.cases.editor.publish }}
      </button>
    </div>

    <div class="sheet figure">
      <EditorFigure :version="version" :published="published" :role="role" />
    </div>

    <figcaption>{{ t.cases.editor.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.editor-case {
  display: grid;
  gap: 14px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px 20px;
}

.control {
  display: grid;
  gap: 6px;
}

.control-label {
  font-size: 14px;
  color: var(--ink-2);
}

.options {
  display: inline-flex;
  gap: 4px;
  padding: 3px;
  border: 1px solid var(--rule);
  border-radius: 12px;
  background: var(--sheet);
}

.option {
  min-width: 44px;
  min-height: 40px;
  padding: 0 12px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--ink-2);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 120ms var(--ease-out);
}

.option[aria-pressed='true'] {
  background: var(--ink);
  color: var(--paper);
}

.option:active,
.publish:active:not(:disabled) {
  transform: scale(0.97);
}

.publish {
  min-height: 44px;
  padding: 0 16px;
  border: 1.5px solid var(--ink);
  border-radius: 10px;
  background: var(--sheet);
  color: var(--ink);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    opacity 160ms ease,
    transform 120ms var(--ease-out);
}

.publish:disabled {
  opacity: 0.4;
  cursor: default;
}

@media (pointer: coarse) {
  .option {
    min-height: 44px;
  }
}

.figure {
  padding: clamp(12px, 2vw, 20px);
}

figcaption {
  font-size: 15px;
  color: var(--ink-2);
}
</style>
