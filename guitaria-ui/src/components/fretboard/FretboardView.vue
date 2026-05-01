<template>
  <div class="fretboard-wrapper" :class="{ 'left-handed': store.handedness === 'left' }">

    <!-- Fret numbers -->
    <div class="fret-numbers">
      <div class="string-label-spacer" />
      <div
        v-for="f in visibleFrets"
        :key="f"
        class="fret-num"
        :class="{ marker: MARKER_FRETS.has(f) }"
      >{{ f > 0 ? f : '' }}</div>
    </div>

    <!-- Strings -->
    <div
      v-for="(row, s) in orderedGrid"
      :key="s"
      class="string-row"
      :style="{ '--sw': STRING_WEIGHTS[s] + 'px', '--sc': STRING_COLORS[s] }"
    >
      <div class="string-label">{{ store.tuning[store.handedness === 'left' ? s : 5 - s] }}</div>

      <div
        v-for="cell in row"
        :key="cell.fret"
        class="fret-cell"
        :class="[`cat-${cell.category}`, { 'open-string': cell.fret === 0 }]"
        @click="store.tapCell(cell)"
      >
        <span v-if="cell.category !== 'none'" class="note-dot" :class="`dot-${cell.category}`">
          {{ cell.displayLabel }}
        </span>
      </div>
    </div>

    <!-- Fret markers -->
    <div class="fret-markers-row">
      <div class="string-label-spacer" />
      <div v-for="f in visibleFrets" :key="f" class="marker-cell">
        <span v-if="DOUBLE_MARKERS.has(f)" class="marker-dot double" />
        <span v-else-if="MARKER_FRETS.has(f)" class="marker-dot" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFretboardStore } from '@/stores/fretboard'

const store = useFretboardStore()

const TOTAL_FRETS = 22
const MARKER_FRETS  = new Set([3, 5, 7, 9, 12, 15, 17, 19, 21])
const DOUBLE_MARKERS = new Set([12])

// DOM order: index 0 = high e (thinnest), index 5 = low E (thickest)
const STRING_WEIGHTS = [0.8, 1.1, 1.5, 2.0, 2.6, 3.2]
const STRING_COLORS  = [
  'rgba(210,200,180,0.55)',
  'rgba(210,200,180,0.60)',
  'rgba(200,185,155,0.65)',
  'rgba(190,175,140,0.70)',
  'rgba(175,160,120,0.75)',
  'rgba(160,140,100,0.80)',
]

const visibleFrets = computed(() =>
  Array.from({ length: TOTAL_FRETS + 1 }, (_, i) => i)
)

const orderedGrid = computed(() => [...store.noteGrid].reverse())
</script>

<style scoped>
/* ── Wrapper ────────────────────────────────────────────────────────────────── */
.fretboard-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 700px;
  padding: 10px 0 4px;
  user-select: none;
}

.fret-numbers,
.string-row,
.fret-markers-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

/* ── Labels ──────────────────────────────────────────────────────────────────── */
.string-label-spacer,
.string-label {
  width: 36px;
  min-width: 36px;
  flex-shrink: 0;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  color: #5a5550;
  letter-spacing: 0.04em;
}

.fret-num {
  flex: 1;
  min-width: 44px;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #4a4540;
  padding-bottom: 4px;
}
.fret-num.marker {
  color: #7a7060;
  font-weight: 700;
  font-size: 13px;
}

/* ── String row & wire ───────────────────────────────────────────────────────── */
.string-row {
  position: relative;
}

/* The string itself */
.string-row::before {
  content: '';
  position: absolute;
  left: 36px;
  right: 0;
  top: 50%;
  height: var(--sw);
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0.15) 0%,
    var(--sc) 40%,
    rgba(0,0,0,0.3) 100%
  );
  transform: translateY(-50%);
  pointer-events: none;
  border-radius: 1px;
}

/* ── Fret cell ───────────────────────────────────────────────────────────────── */
.fret-cell {
  flex: 1;
  min-width: 44px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
}

/* Fret wire — full height so it doesn't look cut */
.fret-cell:not(.open-string)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    to right,
    #2a2520,
    #7a7060 30%,
    #a09080 50%,
    #7a7060 70%,
    #2a2520
  );
  border-radius: 1px;
}

/* Nut */
.fret-cell.open-string::after { display: none; }
.fret-cell:not(.open-string):nth-child(2)::after {
  width: 5px;
  top: 0;
  bottom: 0;
  background: linear-gradient(
    to right,
    #5a5040,
    #c8b890 30%,
    #e8d8b0 50%,
    #c8b890 70%,
    #5a5040
  );
}

/* Hover highlight */
.fret-cell:hover::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.025);
  pointer-events: none;
  z-index: 0;
}

/* ── Note dot ────────────────────────────────────────────────────────────────── */
.note-dot {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  z-index: 2;
  position: relative;
  transition: transform 0.12s cubic-bezier(0.34,1.56,0.64,1);
  letter-spacing: -0.02em;
  flex-shrink: 0;
}

.fret-cell:hover .note-dot {
  transform: scale(1.18);
}

/* Root */
.dot-root {
  background: var(--root);
  color: var(--root-text);
}

/* Scale note */
.dot-in_pattern {
  background: var(--scale);
  color: var(--scale-text);
}

/* User selected (identify mode) */
.dot-user_selected {
  background: var(--sel);
  color: var(--sel-text);
}

.cat-none .note-dot { display: none; }

/* ── Fret markers ────────────────────────────────────────────────────────────── */
.fret-markers-row {
  height: 22px;
  margin-top: 4px;
}
.marker-cell {
  flex: 1;
  min-width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.marker-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, #5a5040, #2a2520);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04);
}

.marker-dot.double {
  background: transparent;
  box-shadow:
    -7px 0 0 1px #2a2520,
    -7px 0 0 0 #3a3530,
    7px 0 0 1px #2a2520,
    7px 0 0 0 #3a3530;
  width: 7px;
  height: 7px;
}

/* ── Left-handed ─────────────────────────────────────────────────────────────── */
.left-handed .string-row,
.left-handed .fret-numbers,
.left-handed .fret-markers-row {
  flex-direction: row-reverse;
}
</style>
