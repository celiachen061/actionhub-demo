<template>
  <div class="app-shell">
    <aside class="sidebar">
      <!-- Logo -->
      <button class="sidebar-logo" @click="goDashboard">
        <div class="logo-mark" aria-hidden="true">
          <Zap :size="18" color="#ffffff" :stroke-width="2.5" class="logo-mark-icon" />
        </div>
        <span class="logo-text-group">
          <span class="logo-text">ActionHub</span>
          <span class="logo-subtext">{{ t({ zh: 'AI 会议运营', en: 'AI Meeting Ops' }) }}</span>
        </span>
      </button>

      <!-- Navigation -->
      <nav class="sidebar-menu">
        <RouterLink
          v-for="item in navItems"
          :key="item.route"
          :to="item.route"
          class="nav-link"
        >
          <component
            :is="iconMap[item.icon ?? '']"
            :size="16"
            :stroke-width="1.8"
            class="nav-icon"
          />
          <span class="nav-label">{{ t(item.label) }}</span>
        </RouterLink>
      </nav>
    </aside>

    <div class="shell-main">
      <!-- Top nav -->
      <header class="top-nav">
        <div class="top-nav-leading">
          <div class="project-picker">
            <span class="project-picker-badge" aria-hidden="true">
              <FolderKanban :size="14" color="#1d4ed8" :stroke-width="2" />
            </span>
            <label class="visually-hidden" for="top-context-select">{{ t({ zh: '账号与部门', en: 'Account & department' }) }}</label>
            <select
              id="top-context-select"
              v-model="combinedContextKey"
              class="project-picker-select"
              :aria-label="t({ zh: '切换账号与部门', en: 'Switch account and department' })"
            >
              <optgroup v-for="u in demoAccounts" :key="u.id" :label="t(u.name)">
                <option
                  v-for="g in departmentsForUser(u.id)"
                  :key="`${u.id}-${g.id}`"
                  :value="encodeContextKey(u.id, g.label.en)"
                >
                  {{ t(g.label) }}
                </option>
              </optgroup>
            </select>
            <ChevronDown :size="14" color="#64748b" :stroke-width="2" class="project-picker-chevron" aria-hidden="true" />
          </div>

          <div class="search-box">
            <Search :size="14" color="#94a3b8" :stroke-width="2" />
            <input
              v-model="appStore.search"
              :placeholder="t({ zh: '搜索会议、部门或参会人...', en: 'Search meetings, departments...' })"
            />
          </div>
        </div>

        <div class="top-actions">
          <div class="lang-row">
            <Globe :size="14" color="#64748b" :stroke-width="1.8" />
            <div class="lang-switch">
              <button
                type="button"
                class="lang-button"
                :aria-pressed="appStore.language === 'zh'"
                :class="{ 'is-active': appStore.language === 'zh' }"
                @click="appStore.setLanguage('zh')"
              >中</button>
              <span class="lang-divider">/</span>
              <button
                type="button"
                class="lang-button"
                :aria-pressed="appStore.language === 'en'"
                :class="{ 'is-active': appStore.language === 'en' }"
                @click="appStore.setLanguage('en')"
              >EN</button>
            </div>
          </div>

          <button class="notif-button" @click="showNotifications">
            <Bell :size="16" color="#475569" :stroke-width="1.8" />
          </button>

          <button class="icon-button" @click="showProfile">{{ profileInitials }}</button>
        </div>
      </header>

      <main class="page-host">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Bell,
  Calendar,
  ChartColumn,
  ChevronDown,
  FileText,
  FolderKanban,
  Globe,
  History,
  Inbox,
  LayoutDashboard,
  Link,
  ListTodo,
  Search,
  Zap,
} from '../components/fakeLucide'
import { RouterLink, useRouter } from 'vue-router'

import { getAccessibleProgramGroups, navItems, localize } from '../services/mockData'
import { useAppStore } from '../stores/app'
import { useUiStore } from '../stores/ui'
import type { LocalizedText } from '../types/app'

const appStore = useAppStore()
const uiStore = useUiStore()
const router = useRouter()
const t = (text: LocalizedText) => localize(appStore.language, text)

const demoAccounts = [
  { id: 'demo-jd', name: { zh: 'JD（产品）', en: 'JD (Product)' } },
  { id: 'demo-tech-lead', name: { zh: 'Tech Lead（技术）', en: 'Tech Lead' } },
  { id: 'demo-ops', name: { zh: 'Ops（运营）', en: 'Ops' } },
]

const CONTEXT_SEP = '\u0001'

function encodeContextKey(userId: string, deptEn: string) {
  return `${userId}${CONTEXT_SEP}${deptEn}`
}

function parseContextKey(s: string) {
  const i = s.indexOf(CONTEXT_SEP)
  if (i < 0) return { userId: 'demo-jd', deptEn: 'Digital Solutions' }
  return { userId: s.slice(0, i), deptEn: s.slice(i + CONTEXT_SEP.length) }
}

const departmentsForUser = (userId: string) => getAccessibleProgramGroups(userId)

const combinedContextKey = computed({
  get() {
    return encodeContextKey(appStore.currentUserId, appStore.currentProject)
  },
  set(v: string) {
    const { userId, deptEn } = parseContextKey(v)
    appStore.currentUserId = userId
    appStore.currentProject = deptEn
  },
})

const profileInitials = computed(() => {
  if (appStore.currentUserId === 'demo-tech-lead') return 'TL'
  if (appStore.currentUserId === 'demo-ops') return 'OP'
  return 'JD'
})

const iconMap: Record<string, unknown> = {
  LayoutDashboard,
  Calendar,
  ListTodo,
  History,
  FileText,
  Link,
  Inbox,
  ChartColumn,
}

const goDashboard = () => {
  router.push('/dashboard')
}

const showNotifications = () => {
  uiStore.pushToast(
    t({ zh: '暂无新的系统提醒', en: 'No new notifications' }),
    t({ zh: '最近一次 AI 发现已同步到相关页面。', en: 'The latest AI finding has already been synced to the related pages.' }),
  )
}

const showProfile = () => {
  const roleMap: Record<string, LocalizedText> = {
    'demo-jd': { zh: 'JD · 产品负责人', en: 'JD · Product Owner' },
    'demo-tech-lead': { zh: 'TL · 技术负责人', en: 'TL · Tech Lead' },
    'demo-ops': { zh: 'OP · 运营负责人', en: 'OP · Ops Lead' },
  }
  uiStore.pushToast(
    t({ zh: '当前为 Demo 账号', en: 'Current demo account' }),
    t(roleMap[appStore.currentUserId] ?? roleMap['demo-jd']),
  )
}
</script>
