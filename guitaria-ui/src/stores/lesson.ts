import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface LessonMessage {
  role: 'student' | 'teacher'
  content: string
  streaming?: boolean
}

export const useLessonStore = defineStore('lesson', () => {
  const messages = ref<LessonMessage[]>([])
  const sessionId = ref<string | null>(null)
  const isStreaming = ref(false)

  function addMessage(msg: LessonMessage) {
    messages.value.push(msg)
  }

  function appendToLastMessage(delta: string) {
    const last = messages.value.at(-1)
    if (last) last.content += delta
  }

  function finalizeLastMessage() {
    const last = messages.value.at(-1)
    if (last) last.streaming = false
  }

  function setSessionId(id: string) {
    sessionId.value = id
  }

  return { messages, sessionId, isStreaming, addMessage, appendToLastMessage, finalizeLastMessage, setSessionId }
})
