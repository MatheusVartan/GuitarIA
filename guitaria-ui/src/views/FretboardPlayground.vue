<template>
  <div class="playground">

    <header class="navbar">
      <div class="navbar-left">
        <span class="logo">Guitar<span class="logo-ia">IA</span></span>
        <span class="tagline">interactive fretboard</span>
      </div>
      <div class="navbar-right">
        <span class="status-dot" />
        <span class="status-text">Playground</span>
      </div>
    </header>

    <FretboardControls />
    <ToolsBar />
    <ScaleInfo />
    <ChordFinder />

    <div class="body">
      <div class="fretboard-scroll">
        <FretboardView />
      </div>
      <Sidebar />
    </div>

  </div>
</template>

<script setup lang="ts">
import FretboardControls from '@/components/fretboard/FretboardControls.vue'
import FretboardView from '@/components/fretboard/FretboardView.vue'
import ChordFinder from '@/components/fretboard/ChordFinder.vue'
import ScaleInfo from '@/components/fretboard/ScaleInfo.vue'
import ToolsBar from '@/components/tools/ToolsBar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
</script>

<style scoped>
.playground {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg);
  overflow: hidden;
}

/* ── Navbar ── */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 44px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.navbar-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.logo {
  font-family: 'Unbounded', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.5px;
  line-height: 1;
}

.logo-ia {
  color: var(--root);
}

.tagline {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--muted);
  text-transform: uppercase;
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--scale);
  animation: pulse 2.5s ease-in-out infinite;
}

.status-text {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--muted);
  text-transform: uppercase;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

/* ── Body (fretboard + sidebar) ── */
.body {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.fretboard-scroll {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  padding: 16px 0 12px;
  background: var(--bg);
}
</style>
