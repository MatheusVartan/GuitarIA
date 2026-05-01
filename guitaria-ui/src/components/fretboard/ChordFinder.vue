<template>
  <div v-if="store.patternMode === 'identify' && store.chordMatches.length > 0" class="chord-finder">
    <span class="label">DETECTED</span>
    <div class="pills">
      <span
        v-for="match in store.chordMatches"
        :key="match.name + match.inversion"
        class="chord-pill"
      >
        {{ match.name }}
        <span v-if="match.inversion > 0" class="inversion">/ {{ match.bassNote }}</span>
      </span>
    </div>
    <button class="clear-btn" @click="store.clearSelection()">✕</button>
  </div>
</template>

<script setup lang="ts">
import { useFretboardStore } from '@/stores/fretboard'
const store = useFretboardStore()
</script>

<style scoped>
.chord-finder {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 34px;
  background: var(--bg-deep);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
}

.label {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--muted);
  text-transform: uppercase;
  flex-shrink: 0;
  opacity: 0.7;
}

.pills {
  display: flex;
  gap: 6px;
  flex-wrap: nowrap;
  overflow: hidden;
}

.chord-pill {
  padding: 2px 10px;
  border-radius: 3px;
  background: rgba(96,165,250,0.12);
  border: 1px solid rgba(96,165,250,0.2);
  color: #93c5fd;
  font-size: 12px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.inversion {
  font-weight: 400;
  opacity: 0.7;
  margin-left: 2px;
}

.clear-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
  flex-shrink: 0;
  line-height: 1;
  transition: color 0.1s, background 0.1s;
}
.clear-btn:hover { color: var(--text); background: var(--border); }
</style>
