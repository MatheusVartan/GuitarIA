<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <span class="sidebar-title">Professor</span>
      <span class="sidebar-badge">em breve</span>
    </div>

    <div class="chat-area">
      <div class="placeholder-msg">
        O professor AI estará disponível na Fase 2
      </div>
    </div>

    <div class="chat-input-area">
      <div class="chat-input-box">
        <span class="chat-placeholder">Mensagem para o professor...</span>
        <button class="send-btn" disabled>↑</button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// Sem lógica na Fase 1 — componente estático
// Na Fase 2: recebe mensagens via SignalR e expõe slot de chat
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-width: 220px;
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

.chat-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
}

.placeholder-msg {
  font-size: 11px;
  color: var(--border-lit);
  text-align: center;
  line-height: 1.6;
  border: 1px dashed var(--border);
  border-radius: 6px;
  padding: 14px 12px;
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
  opacity: 0.4;
}

.chat-placeholder {
  flex: 1;
  font-size: 11px;
  color: var(--muted);
  font-style: italic;
}

.send-btn {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  color: var(--muted);
  font-size: 11px;
  cursor: not-allowed;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
