<template>
  <AppShell>
    <RouterView />
  </AppShell>
  <AppToast />
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import AppToast from './components/AppToast.vue'
import AppShell from './layouts/AppShell.vue'
import { localize, meetings } from './services/mockData'
import { useAppStore } from './stores/app'

const route = useRoute()
const appStore = useAppStore()

watchEffect(() => {
  const suffix = 'ActionHub Demo'
  document.documentElement.lang = appStore.language === 'zh' ? 'zh-CN' : 'en'
  if (route.name === 'meeting-detail' && typeof route.params.id === 'string') {
    const m = meetings.find((x) => x.id === route.params.id)
    if (m) {
      document.title = `${localize(appStore.language, m.title)} · ${suffix}`
      return
    }
  }
  const title = route.meta.title
  document.title = title ? `${localize(appStore.language, title)} · ${suffix}` : suffix
})
</script>
