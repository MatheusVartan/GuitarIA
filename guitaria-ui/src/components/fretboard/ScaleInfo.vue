<template>
  <div v-if="store.patternMode !== 'free' && store.patternMode !== 'identify'" class="scale-info">

    <div class="info-col">
      <div class="info-label">NOTES</div>
      <div class="info-values">
        <span
          v-for="(note, i) in patternNotes"
          :key="i"
          class="info-tag"
          :class="{ root: i === 0 }"
        >{{ note }}</span>
      </div>
    </div>

    <div class="divider" />

    <div class="info-col">
      <div class="info-label">DEGREES</div>
      <div class="info-values">
        <span
          v-for="(deg, i) in degrees"
          :key="i"
          class="info-tag"
          :class="{ root: i === 0 }"
        >{{ deg }}</span>
      </div>
    </div>

    <div class="divider" />

    <div class="info-col">
      <div class="info-label">INTERVALS</div>
      <div class="info-values">
        <span
          v-for="(iv, i) in stepFormula"
          :key="i"
          class="info-tag"
          :class="{ root: i === 0 }"
        >{{ iv }}</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFretboardStore } from '@/stores/fretboard'
import {
  SCALE_INTERVALS, CHORD_INTERVALS, ARPEGGIO_INTERVALS,
  SHARPS, noteIndex,
} from '@/core/fretboard/MusicTheory'

const store = useFretboardStore()

const DEGREE_NAMES: Record<number, string> = {
  0: 'R', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4',
  6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7',
}

const activeIntervals = computed((): number[] => {
  if (store.patternMode === 'scale')    return SCALE_INTERVALS[store.scaleType]    ?? []
  if (store.patternMode === 'chord')    return CHORD_INTERVALS[store.chordType]    ?? []
  if (store.patternMode === 'arpeggio') return ARPEGGIO_INTERVALS[store.arpeggioType] ?? []
  return []
})

const patternNotes = computed(() => {
  const rootIdx = noteIndex(store.root)
  return activeIntervals.value.map(i => SHARPS[(rootIdx + i) % 12])
})

const degrees = computed(() =>
  activeIntervals.value.map(i => DEGREE_NAMES[i % 12] ?? String(i))
)

const stepFormula = computed(() => {
  const ivs = activeIntervals.value
  if (ivs.length < 2) return ['R']
  const steps: string[] = ['R']
  for (let i = 1; i < ivs.length; i++) {
    steps.push(String(ivs[i] - ivs[i - 1]))
  }
  return steps
})
</script>

<style scoped>
.scale-info {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 16px;
  height: 28px;
  background: var(--bg-deep);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
  overflow: hidden;
  flex-shrink: 0;
}

.info-col {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px 0 0;
}

.info-col:first-child {
  padding-left: 0;
}

.info-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--muted);
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0.5;
}

.info-values {
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  letter-spacing: -0.02em;
}

.info-tag.root {
  color: var(--root);
  font-weight: 700;
}

.divider {
  width: 1px;
  height: 14px;
  background: var(--border);
  flex-shrink: 0;
  margin-right: 16px;
}
</style>
