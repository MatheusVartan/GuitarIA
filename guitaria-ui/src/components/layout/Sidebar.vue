<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useLessonStore } from '@/stores/lesson'
import { useAgUiStream } from '@/composables/useAgUiStream'

const lessonStore = useLessonStore()
const { sendMessage } = useAgUiStream()

const input = ref('')
const messagesEl = ref<HTMLElement | null>(null)

async function submit() {
  const msg = input.value.trim()
  if (!msg || lessonStore.isStreaming) return
  input.value = ''
  await sendMessage(msg)
}

watch(
  () => lessonStore.messages.length,
  async () => {
    await nextTick()
    messagesEl.value?.scrollTo({ top: messagesEl.value.scrollHeight, behavior: 'smooth' })
  }
)
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <span class="sidebar-title">Professor</span>
      <span v-if="lessonStore.isStreaming" class="sidebar-badge streaming">digitando</span>
      <span v-else class="sidebar-badge">IA</span>
    </div>

    <div class="chat-area" ref="messagesEl">
      <div v-if="lessonStore.messages.length === 0" class="placeholder-msg">
        Faça uma pergunta ao professor de guitarra.
      </div>
      <div
        v-for="(msg, i) in lessonStore.messages"
        :key="i"
        :class="['message', msg.role]"
      >
        <span class="content">{{ msg.content }}<span v-if="msg.streaming" class="cursor">▋</span></span>
      </div>
    </div>

    <form class="chat-input-area" @submit.prevent="submit">
      <div class="chat-input-box" :class="{ active: !lessonStore.isStreaming }">
        <input
          v-model="input"
          type="text"
          class="chat-input"
          placeholder="Mensagem para o professor..."
          :disabled="lessonStore.isStreaming"
          autocomplete="off"
        />
        <button type="submit" class="send-btn" :disabled="lessonStore.isStreaming || !input.trim()">↑</button>
      </div>
    </form>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  min-width: 280px;
  background: var(--bg-surface);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  height: 36px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 8px;
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.sidebar-badge {
  font-size: 9px;
  color: var(--border-lit);
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 1px 5px;
}

.sidebar-badge.streaming {
  color: var(--scale);
  border-color: var(--scale);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.placeholder-msg {
  font-size: 11px;
  color: var(--border-lit);
  text-align: center;
  line-height: 1.6;
  border: 1px dashed var(--border);
  border-radius: 6px;
  padding: 14px 12px;
  margin: auto 0;
}

.message {
  display: flex;
  max-width: 95%;
}

.message.student {
  align-self: flex-end;
}

.message.teacher {
  align-self: flex-start;
}

.content {
  font-size: 12px;
  line-height: 1.5;
  padding: 6px 10px;
  border-radius: 6px;
  white-space: pre-wrap;
  word-break: break-word;
}

.message.student .content {
  background: var(--root);
  color: var(--bg);
}

.message.teacher .content {
  background: var(--bg-raised);
  color: var(--text);
  border: 1px solid var(--border);
}

.cursor {
  color: var(--scale);
  animation: blink 0.8s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.chat-input-area {
  padding: 10px 12px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.chat-input-box {
  height: 32px;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 6px;
  transition: border-color 0.15s;
}

.chat-input-box.active:focus-within {
  border-color: var(--border-lit);
}

.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 11px;
  color: var(--text);
  font-family: inherit;
}

.chat-input::placeholder {
  color: var(--muted);
  font-style: italic;
}

.chat-input:disabled {
  opacity: 0.5;
}

.send-btn {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  color: var(--muted);
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}

.send-btn:not(:disabled) {
  background: var(--root);
  color: var(--bg);
  border-color: var(--root);
  cursor: pointer;
}

.send-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}
</style>
