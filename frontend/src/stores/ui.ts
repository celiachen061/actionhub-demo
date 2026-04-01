import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastTone = 'default' | 'success' | 'warning'

export interface ToastItem {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<ToastItem[]>([])
  let seed = 1

  const pushToast = (title: string, description = '', tone: ToastTone = 'default') => {
    const id = seed++
    toasts.value.push({ id, title, description, tone })
    window.setTimeout(() => removeToast(id), 2800)
  }

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(item => item.id !== id)
  }

  return {
    toasts,
    pushToast,
    removeToast,
  }
})
