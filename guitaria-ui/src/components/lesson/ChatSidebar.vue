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
  <div class="chat-sidebar">
    <div class="messages" ref="messagesEl">
      <div
        v-for="(msg, i) in lessonStore.messages"
        :key="i"
        :class="['message', msg.role]"
      >
        <span class="content">{{ msg.content }}</span>
        <span v-if="msg.streaming" class="cursor">▋</span>
      </div>
    </div>

    <form class="input-area" @submit.prevent="submit">
      <input
        v-model="input"
        type="text"
        placeholder="Pergunte ao professor..."
        :disabled="lessonStore.isStreaming"
        autocomplete="off"
      />
      <button type="submit" :disabled="lessonStore.isStreaming">
        Enviar
      </button>
    </form>
  </div>
</template>

<style scoped>
.chat-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface, #1a1a1a);
  border-left: 1px solid var(--color-border, #333);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 90%;
}

.message.student {
  align-self: flex-end;
}

.message.teacher {
  align-self: flex-start;
}

.content {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.message.student .content {
  background: var(--color-primary, #4a9eff);
  color: #fff;
}

.message.teacher .content {
  background: var(--color-surface-2, #2a2a2a);
  color: var(--color-text, #e0e0e0);
}

.cursor {
  animation: blink 1s step-end infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.input-area {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  border-top: 1px solid var(--color-border, #333);
}

.input-area input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border, #333);
  background: var(--color-surface-2, #2a2a2a);
  color: var(--color-text, #e0e0e0);
  font-size: 0.9rem;
}

.input-area input:disabled {
  opacity: 0.5;
}

.input-area button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background: var(--color-primary, #4a9eff);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.input-area button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
