<template>
  <Teleport to="body">
    <div class="toast-stack">
      <TransitionGroup name="toast">
        <div
          v-for="toast in uiStore.toasts"
          :key="toast.id"
          class="toast-card ai-sheen"
          :class="`toast-${toast.tone}`"
        >
          <div class="toast-main">
            <p class="toast-title">{{ toast.title }}</p>
            <p v-if="toast.description" class="toast-desc">{{ toast.description }}</p>
          </div>
          <button class="toast-close" @click="uiStore.removeToast(toast.id)">×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useUiStore } from '../stores/ui'

const uiStore = useUiStore()
</script>

<style scoped>
.toast-stack {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast-card {
  min-width: 280px;
  max-width: 360px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 14px 14px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(10px);
  pointer-events: auto;
}

.toast-default {
  border-color: rgba(99, 102, 241, 0.45);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(237, 233, 254, 0.9) 48%,
    rgba(255, 255, 255, 0.97) 100%
  );
  box-shadow:
    0 0 0 1px rgba(99, 102, 241, 0.14),
    0 14px 36px rgba(79, 70, 229, 0.12),
    0 12px 28px rgba(15, 23, 42, 0.1);
}

.toast-success {
  border-color: #a7f3d0;
}

.toast-warning {
  border-color: #fde68a;
}

.toast-main {
  min-width: 0;
}

.toast-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.toast-desc {
  margin: 4px 0 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.45;
}

.toast-close {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 6px;
}

.toast-close:hover {
  background: #f1f5f9;
  color: #475569;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.24s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) translateX(10px);
}
</style>
