<script setup lang="ts">
import FretboardView from '@/components/fretboard/FretboardView.vue'
import FretboardControls from '@/components/fretboard/FretboardControls.vue'
import ChatSidebar from '@/components/lesson/ChatSidebar.vue'
</script>

<template>
  <div class="lesson-view">
    <div class="fretboard-area">
      <FretboardView />
      <FretboardControls />
    </div>
    <ChatSidebar class="sidebar" />
  </div>
</template>

<style scoped>
.lesson-view {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.fretboard-area {
  flex: 0 0 65%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar {
  flex: 0 0 35%;
  min-width: 0;
  overflow: hidden;
}
</style>
