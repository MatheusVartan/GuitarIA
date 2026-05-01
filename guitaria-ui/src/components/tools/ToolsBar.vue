<template>
  <div class="toolbar">

    <!-- Timer -->
    <div class="tool-group">
      <span class="tool-label">Timer</span>
      <span class="tool-value">{{ timerDisplay }}</span>
      <div class="tool-buttons">
        <button class="tbtn" :class="{ active: timerRunning }" @click="toggleTimer">
          {{ timerRunning ? '⏸' : '▶' }}
        </button>
        <button class="tbtn" @click="resetTimer">↺</button>
      </div>
    </div>

    <div class="tool-divider" />

    <!-- Metrônomo -->
    <div class="tool-group">
      <span class="tool-label">Metro</span>
      <span class="tool-value">{{ bpm }}</span>
      <div class="beat-dots">
        <span
          v-for="i in 4"
          :key="i"
          class="beat-dot"
          :class="{ active: metroRunning && currentBeat === i - 1 }"
        />
      </div>
      <div class="tool-buttons">
        <button class="tbtn" @click="decreaseBpm">−</button>
        <button class="tbtn" @click="increaseBpm">+</button>
        <button class="tbtn" :class="{ active: metroRunning }" @click="toggleMetronome">
          {{ metroRunning ? '⏸' : '▶' }}
        </button>
        <button class="tbtn" @click="tap">Tap</button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import * as Tone from 'tone'

// ── Timer ──────────────────────────────────────────────────────
const TIMER_DEFAULT = 300 // 5:00
const timerSeconds = ref(TIMER_DEFAULT)
const timerRunning = ref(false)
let timerInterval: ReturnType<typeof setInterval> | null = null

const timerDisplay = computed(() => {
  const m = Math.floor(timerSeconds.value / 60)
  const s = timerSeconds.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

function toggleTimer() {
  if (timerRunning.value) {
    if (timerInterval !== null) clearInterval(timerInterval)
    timerInterval = null
    timerRunning.value = false
  } else {
    timerRunning.value = true
    timerInterval = setInterval(() => {
      if (timerSeconds.value > 0) {
        timerSeconds.value--
      } else {
        if (timerInterval !== null) clearInterval(timerInterval)
        timerInterval = null
        timerRunning.value = false
      }
    }, 1000)
  }
}

function resetTimer() {
  if (timerInterval !== null) clearInterval(timerInterval)
  timerInterval = null
  timerRunning.value = false
  timerSeconds.value = TIMER_DEFAULT
}

// ── Metrônomo ──────────────────────────────────────────────────
const bpm = ref(120)
const metroRunning = ref(false)
const currentBeat = ref(-1)
const tapTimes: number[] = []

let metroSynth: Tone.Synth | null = null
let metroSeq: Tone.Sequence<number> | null = null
let weStartedTransport = false

function setupMetroSynth() {
  metroSynth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
    volume: -4,
  }).toDestination()
}

async function toggleMetronome() {
  await Tone.start()
  if (metroRunning.value) {
    metroSeq?.stop()
    Tone.getTransport().stop()
    weStartedTransport = false
    currentBeat.value = -1
    metroRunning.value = false
  } else {
    if (!metroSynth) setupMetroSynth()
    Tone.getTransport().bpm.value = bpm.value
    if (!metroSeq) {
      metroSeq = new Tone.Sequence<number>(
        (time: number, beat: number) => {
          currentBeat.value = beat
          metroSynth!.triggerAttackRelease(beat === 0 ? 'C5' : 'C4', '32n', time)
        },
        [0, 1, 2, 3],
        '4n'
      )
    }
    metroSeq.start(0)
    Tone.getTransport().start()
    weStartedTransport = true
    metroRunning.value = true
  }
}

function increaseBpm() {
  bpm.value = Math.min(240, bpm.value + 1)
  if (metroRunning.value) Tone.getTransport().bpm.value = bpm.value
}

function decreaseBpm() {
  bpm.value = Math.max(40, bpm.value - 1)
  if (metroRunning.value) Tone.getTransport().bpm.value = bpm.value
}

function tap() {
  const now = Date.now()
  tapTimes.push(now)
  if (tapTimes.length > 4) tapTimes.shift()
  if (tapTimes.length >= 2) {
    const intervals: number[] = []
    for (let i = 1; i < tapTimes.length; i++) {
      intervals.push(tapTimes[i] - tapTimes[i - 1])
    }
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length
    bpm.value = Math.max(40, Math.min(240, Math.round(60000 / avg)))
    if (metroRunning.value) Tone.getTransport().bpm.value = bpm.value
  }
}

// ── Cleanup ────────────────────────────────────────────────────
onUnmounted(() => {
  if (timerInterval !== null) clearInterval(timerInterval)
  if (metroRunning.value && weStartedTransport) {
    metroSeq?.stop()
    Tone.getTransport().stop()
  }
  metroSeq?.dispose()
  metroSynth?.dispose()
  tapTimes.length = 0
})
</script>

<style scoped>
.toolbar {
  height: 34px;
  background: var(--bg-deep);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 0;
  flex-shrink: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.toolbar::-webkit-scrollbar { height: 0; }

.tool-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.tool-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--muted);
  letter-spacing: 0.02em;
  width: 34px;
}

.tool-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  color: var(--tool-value);
  letter-spacing: 0.04em;
  min-width: 42px;
}

.tool-divider {
  width: 1px;
  height: 18px;
  background: var(--border);
  flex-shrink: 0;
  margin: 0 20px;
}

.tool-buttons {
  display: flex;
  gap: 3px;
}

.tbtn {
  height: 20px;
  padding: 0 8px;
  border-radius: 3px;
  border: 1px solid var(--border);
  background: var(--bg-raised);
  color: var(--muted);
  font-size: 11px;
  font-family: 'Barlow Condensed', sans-serif;
  cursor: pointer;
  transition: border-color 0.1s, color 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tbtn:hover {
  border-color: var(--border-lit);
  color: var(--text);
}
.tbtn.active {
  background: var(--root);
  border-color: var(--root);
  color: var(--root-text);
}

.beat-dots {
  display: flex;
  gap: 4px;
  align-items: center;
}
.beat-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  transition: background 0.05s, border-color 0.05s;
}
.beat-dot.active {
  background: var(--scale);
  border-color: var(--scale-border);
}
</style>
