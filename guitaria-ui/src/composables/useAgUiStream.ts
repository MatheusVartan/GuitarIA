import { useLessonStore } from '@/stores/lesson'
import { useFretboardStore } from '@/stores/fretboard'

interface AgUiEvent {
  event: string
  data: string
}

async function* parseSSE(stream: ReadableStream<Uint8Array>): AsyncGenerator<AgUiEvent> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop() ?? ''

      for (const part of parts) {
        if (!part.trim()) continue
        let event = 'message'
        let data = ''
        for (const line of part.split('\n')) {
          if (line.startsWith('event: ')) event = line.slice(7)
          else if (line.startsWith('data: ')) data = line.slice(6)
        }
        yield { event, data }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

export function useAgUiStream() {
  const lessonStore = useLessonStore()
  const fretboardStore = useFretboardStore()

  async function sendMessage(message: string): Promise<void> {
    lessonStore.isStreaming = true
    lessonStore.addMessage({ role: 'student', content: message })
    lessonStore.addMessage({ role: 'teacher', content: '', streaming: true })

    const response = await fetch('/api/lesson/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        fretboardSnapshot: JSON.stringify(fretboardStore.snapshot),
        sessionId: lessonStore.sessionId ?? undefined,
      }),
    })

    if (!response.ok || !response.body) {
      lessonStore.isStreaming = false
      return
    }

    for await (const { event, data } of parseSSE(response.body)) {
      if (event === 'TEXT_MESSAGE_CONTENT') {
        const parsed = JSON.parse(data) as { messageId: string; delta: string }
        lessonStore.appendToLastMessage(parsed.delta)
      } else if (event === 'RUN_FINISHED') {
        const parsed = JSON.parse(data) as { sessionId?: string }
        if (parsed.sessionId) lessonStore.setSessionId(parsed.sessionId)
        lessonStore.finalizeLastMessage()
      }
    }

    lessonStore.isStreaming = false
  }

  return { sendMessage }
}
