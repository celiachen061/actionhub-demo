import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { getAccessibleProgramGroups, normalizeProgramGroupEn } from '../services/mockData'
import type { Language } from '../types/app'

export const useAppStore = defineStore('app', () => {
  const language = ref<Language>('zh')
  const currentUserId = ref('demo-jd')
  const accessibleProgramGroups = computed(() => getAccessibleProgramGroups(currentUserId.value))
  const currentProject = ref(normalizeProgramGroupEn(accessibleProgramGroups.value[0]?.label.en ?? 'Digital Solutions'))
  const search = ref('')

  watch(
    [currentProject, accessibleProgramGroups],
    ([val, groups]) => {
      const allowedEns = new Set(groups.map((g) => g.label.en))
      if (!allowedEns.has(val)) {
        currentProject.value = groups[0]?.label.en ?? normalizeProgramGroupEn(val)
      }
    },
    { immediate: true },
  )

  watch(
    currentUserId,
    () => {
      const groups = accessibleProgramGroups.value
      const allowedEns = new Set(groups.map((g) => g.label.en))
      if (!allowedEns.has(currentProject.value)) {
        currentProject.value = groups[0]?.label.en ?? normalizeProgramGroupEn(currentProject.value)
      }
    },
    { immediate: true },
  )

  const isZh = computed(() => language.value === 'zh')

  const setLanguage = (nextLanguage: Language) => {
    language.value = nextLanguage
  }

  return {
    language,
    currentUserId,
    accessibleProgramGroups,
    currentProject,
    search,
    isZh,
    setLanguage,
  }
})
