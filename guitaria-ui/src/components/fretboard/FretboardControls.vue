<template>
  <div class="controls-bar">

    <!-- Root -->
    <div class="ctrl-group">
      <div class="ctrl-label">Root</div>
      <div class="ctrl-buttons">
        <button
          v-for="note in displayNotes"
          :key="note"
          class="cbtn cnote"
          :class="{ 'root-active': store.root === toSharp(note) }"
          @click="store.setRoot(toSharp(note))"
        >{{ note }}</button>
      </div>
    </div>

    <div class="ctrl-divider" />

    <!-- Accidental -->
    <div class="ctrl-group">
      <div class="ctrl-label">Accidental</div>
      <div class="ctrl-buttons">
        <button class="cbtn" :class="{ 'mode-active': accidental === 'sharp' }" @click="accidental = 'sharp'">#</button>
        <button class="cbtn" :class="{ 'mode-active': accidental === 'flat' }" @click="accidental = 'flat'">b</button>
      </div>
    </div>

    <div class="ctrl-divider" />

    <!-- Mode -->
    <div class="ctrl-group">
      <div class="ctrl-label">Mode</div>
      <div class="ctrl-buttons">
        <button
          v-for="m in MODES"
          :key="m.value"
          class="cbtn"
          :class="{ 'mode-active': store.patternMode === m.value }"
          @click="store.setPatternMode(m.value)"
        >{{ m.label }}</button>
      </div>
    </div>

    <div class="ctrl-divider" />

    <!-- Scale dropdown (only when mode === 'scale') -->
    <template v-if="store.patternMode === 'scale'">
      <div class="ctrl-group">
        <div class="ctrl-label">Scale</div>
        <select :value="store.scaleType" @change="e => store.setScaleType((e.target as HTMLSelectElement).value as any)">
          <optgroup v-for="g in SCALE_GROUPS" :key="g.label" :label="g.label">
            <option v-for="s in g.scales" :key="s.value" :value="s.value">{{ s.label }}</option>
          </optgroup>
        </select>
      </div>
      <div class="ctrl-divider" />
    </template>

    <!-- Chord dropdown (only when mode === 'chord') -->
    <template v-else-if="store.patternMode === 'chord'">
      <div class="ctrl-group">
        <div class="ctrl-label">Chord</div>
        <select :value="store.chordType" @change="e => store.setChordType((e.target as HTMLSelectElement).value as any)">
          <optgroup v-for="g in CHORD_GROUPS" :key="g.label" :label="g.label">
            <option v-for="c in g.chords" :key="c.value" :value="c.value">{{ c.label }}</option>
          </optgroup>
        </select>
      </div>
      <div class="ctrl-divider" />
    </template>

    <!-- Arpeggio dropdown (only when mode === 'arpeggio') -->
    <template v-else-if="store.patternMode === 'arpeggio'">
      <div class="ctrl-group">
        <div class="ctrl-label">Arpeggio</div>
        <select :value="store.arpeggioType" @change="e => store.setArpeggioType((e.target as HTMLSelectElement).value as any)">
          <option v-for="a in ARPEGGIOS" :key="a.value" :value="a.value">{{ a.label }}</option>
        </select>
      </div>
      <div class="ctrl-divider" />
    </template>

    <!-- Position (only when mode === 'scale') -->
    <template v-if="store.patternMode === 'scale'">
      <div class="ctrl-group">
        <div class="ctrl-label">Position</div>
        <div class="ctrl-buttons">
          <button
            v-for="p in POSITIONS"
            :key="p.value"
            class="cbtn"
            :class="{ 'mode-active': store.position === p.value }"
            @click="store.setPosition(p.value)"
          >{{ p.label }}</button>
        </div>
      </div>
      <div class="ctrl-divider" />
    </template>

    <!-- Show -->
    <div class="ctrl-group">
      <div class="ctrl-label">Show</div>
      <div class="ctrl-buttons">
        <button
          v-for="d in DISPLAY_MODES"
          :key="d.value"
          class="cbtn"
          :class="{ 'mode-active': store.displayMode === d.value }"
          @click="store.setDisplayMode(d.value)"
        >{{ d.label }}</button>
      </div>
    </div>

    <div class="ctrl-divider" />

    <!-- Hand -->
    <div class="ctrl-group">
      <div class="ctrl-label">Hand</div>
      <div class="ctrl-buttons">
        <button class="cbtn" :class="{ 'mode-active': store.handedness === 'right' }" @click="store.setHandedness('right')">R</button>
        <button class="cbtn" :class="{ 'mode-active': store.handedness === 'left' }" @click="store.setHandedness('left')">L</button>
      </div>
    </div>

    <div class="ctrl-divider" />

    <!-- Capo -->
    <div class="ctrl-group">
      <div class="ctrl-label">
        Capo <span class="ctrl-label-val">{{ store.capo > 0 ? store.capo : 'OFF' }}</span>
      </div>
      <input
        type="range"
        min="0" max="12"
        :value="store.capo"
        @input="e => store.setCapo(Number((e.target as HTMLInputElement).value))"
        class="slider"
      />
    </div>

    <div class="ctrl-divider" />

    <!-- Tuning -->
    <div class="ctrl-group">
      <div class="ctrl-label">Tuning</div>
      <select @change="e => store.setTuningPreset(Number((e.target as HTMLSelectElement).value))">
        <option v-for="(t, i) in store.tuningPresets" :key="i" :value="i">{{ t.name }}</option>
      </select>
    </div>

    <!-- Clear (identify mode) -->
    <template v-if="store.patternMode === 'identify'">
      <div class="ctrl-divider" />
      <button class="cbtn clear-btn" @click="store.clearSelection()">Clear</button>
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFretboardStore } from '@/stores/fretboard'
import { SHARPS, FLATS, toSharp } from '@/core/fretboard/MusicTheory'
import type { Accidental } from '@/core/fretboard/types'

const store = useFretboardStore()

const accidental = ref<Accidental>('sharp')

const displayNotes = computed(() => accidental.value === 'sharp' ? SHARPS : FLATS)

const MODES = [
  { value: 'scale',    label: 'Scale' },
  { value: 'chord',    label: 'Chord' },
  { value: 'arpeggio', label: 'Arpeggio' },
  { value: 'free',     label: 'Free' },
  { value: 'identify', label: 'Identify' },
] as const

const DISPLAY_MODES = [
  { value: 'note_names', label: 'Notes' },
  { value: 'intervals',  label: 'Intervals' },
  { value: 'degrees',    label: 'Degrees' },
  { value: 'numbers',    label: 'Numbers' },
] as const

const POSITIONS = [
  { value: 'all', label: 'All' },
  { value: 1,     label: '1' },
  { value: 2,     label: '2' },
  { value: 3,     label: '3' },
  { value: 4,     label: '4' },
  { value: 5,     label: '5' },
] as const

const SCALE_GROUPS = [
  {
    label: 'Common', scales: [
      { value: 'major',            label: 'Major' },
      { value: 'minor',            label: 'Minor (Natural)' },
      { value: 'pentatonic_major', label: 'Pentatonic Major' },
      { value: 'pentatonic_minor', label: 'Pentatonic Minor' },
      { value: 'blues',            label: 'Blues' },
    ],
  },
  {
    label: 'Modes', scales: [
      { value: 'dorian',     label: 'Dorian' },
      { value: 'phrygian',   label: 'Phrygian' },
      { value: 'lydian',     label: 'Lydian' },
      { value: 'mixolydian', label: 'Mixolydian' },
      { value: 'locrian',    label: 'Locrian' },
    ],
  },
  {
    label: 'Other', scales: [
      { value: 'harmonic_minor', label: 'Harmonic Minor' },
      { value: 'melodic_minor',  label: 'Melodic Minor' },
      { value: 'chromatic',      label: 'Chromatic' },
    ],
  },
]

const CHORD_GROUPS = [
  {
    label: 'Triads', chords: [
      { value: 'maj', label: 'Major' },
      { value: 'min', label: 'Minor' },
      { value: 'dim', label: 'Diminished' },
      { value: 'aug', label: 'Augmented' },
      { value: 'sus2', label: 'Sus2' },
      { value: 'sus4', label: 'Sus4' },
      { value: 'power', label: 'Power (5th)' },
    ],
  },
  {
    label: '7ths', chords: [
      { value: 'maj7', label: 'Major 7' },
      { value: 'min7', label: 'Minor 7' },
      { value: 'dom7', label: 'Dominant 7' },
      { value: 'dim7', label: 'Diminished 7' },
      { value: 'm7b5', label: 'Half-dim (m7b5)' },
    ],
  },
  {
    label: '9ths / Add', chords: [
      { value: 'maj9', label: 'Major 9' },
      { value: 'min9', label: 'Minor 9' },
      { value: 'dom9', label: 'Dominant 9' },
      { value: 'add9', label: 'Add9' },
    ],
  },
]

const ARPEGGIOS = [
  { value: 'maj',  label: 'Major' },
  { value: 'min',  label: 'Minor' },
  { value: 'maj7', label: 'Major 7' },
  { value: 'min7', label: 'Minor 7' },
  { value: 'dom7', label: 'Dominant 7' },
  { value: 'dim',  label: 'Diminished' },
  { value: 'aug',  label: 'Augmented' },
  { value: 'sus2', label: 'Sus2' },
  { value: 'sus4', label: 'Sus4' },
]
</script>

<style scoped>
.controls-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 58px;
  padding: 0 20px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  gap: 0;
  flex-shrink: 0;
  scrollbar-width: none;
}

.controls-bar::-webkit-scrollbar { height: 0; }

.ctrl-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-shrink: 0;
}

.ctrl-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--muted);
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 5px;
}

.ctrl-label-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-dim);
  letter-spacing: 0;
}

.ctrl-buttons {
  display: flex;
  gap: 2px;
}

.ctrl-divider {
  width: 1px;
  height: 28px;
  background: var(--border);
  flex-shrink: 0;
  margin: 0 16px;
}

.cbtn {
  height: 24px;
  padding: 0 10px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: var(--bg-raised);
  color: var(--text-dim);
  font-size: 12px;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.1s, color 0.1s, background 0.1s;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cbtn:hover {
  border-color: var(--border-lit);
  color: var(--text);
}

.cbtn.root-active:hover {
  border-color: var(--root);
  color: var(--root-text);
}

.cbtn.mode-active:hover {
  border-color: var(--scale-border);
  color: var(--scale-text);
}

.cbtn.root-active {
  background: var(--root);
  border-color: var(--root);
  color: var(--root-text);
  font-weight: 700;
}

.cbtn.mode-active {
  background: var(--scale-bg);
  border-color: var(--scale-border);
  color: var(--scale-text);
  font-weight: 600;
}

.cnote {
  width: 24px;
  padding: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}

.clear-btn {
  padding: 0 14px;
}

select {
  height: 24px;
  padding: 0 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: var(--bg-raised);
  color: var(--text);
  font-size: 12px;
  font-family: 'Barlow Condensed', sans-serif;
  cursor: pointer;
  outline: none;
  transition: border-color 0.1s;
}
select:hover { border-color: var(--border-lit); }
select:focus { border-color: var(--border-lit); }

.slider {
  width: 80px;
  height: 4px;
  accent-color: var(--root);
  cursor: pointer;
  margin-top: 2px;
}
</style>
