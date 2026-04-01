<template>
  <section class="page project-history">
    <header class="page-header">
      <div>
        <h1 class="page-title">{{ t({ zh: '项目历史', en: 'Project History' }) }}<span class="page-phase-tag">P1</span></h1>
        <p class="page-subtitle">
          {{
            t({
              zh: '按项目查看历史会议、摘要与待跟进事项。',
              en: 'Past meetings, summaries, and follow-ups by program.',
            })
          }}
        </p>
      </div>
    </header>

    <div class="ph-page-split">
      <aside class="surface ph-program-rail" :aria-label="t({ zh: '项目组列表', en: 'Program list' })">
        <label class="visually-hidden" for="ph-program-search">{{ t({ zh: '搜索项目组', en: 'Search programs' }) }}</label>
        <div class="ph-program-search">
          <Search class="ph-search-ic" :size="15" color="#94a3b8" :stroke-width="2" aria-hidden="true" />
          <input
            id="ph-program-search"
            v-model="programSearch"
            type="search"
            autocomplete="off"
            :placeholder="t({ zh: '搜索项目组…', en: 'Search programs…' })"
          />
        </div>
        <ul class="ph-program-list" role="listbox" :aria-label="t({ zh: '项目组', en: 'Programs' })">
          <li v-for="proj in filteredPrograms" :key="proj.id" role="presentation" class="ph-program-li">
            <button
              type="button"
              role="option"
              class="ph-program-item"
              :class="{ 'ph-program-item--active': selectedProjectId === proj.id }"
              :aria-selected="selectedProjectId === proj.id"
              @click="selectedProjectId = proj.id"
            >
              <span class="ph-program-item-label">{{ t(proj.label) }}</span>
            </button>
          </li>
        </ul>
        <p v-if="programSearch.trim() && filteredPrograms.length === 0" class="ph-program-empty" role="status">
          {{ t({ zh: '没有匹配的项目组', en: 'No matching programs' }) }}
        </p>
      </aside>

      <div class="ph-workspace">
        <div v-if="currentProject" class="ai-banner ai-sheen">
          <span class="banner-text">{{ t(currentProject.aiBanner) }}</span>
          <RouterLink class="banner-link" to="/action-center">{{ t({ zh: '行动中心', en: 'Action Center' }) }}</RouterLink>
        </div>

        <div v-if="currentProject" class="ph-layout">
          <main class="ph-main">
            <div class="ph-track" :aria-label="t({ zh: '会议时间轴', en: 'Meeting timeline' })">
              <span class="ph-rail" aria-hidden="true" />
              <ol class="ph-list">
                <li v-for="entry in sortedTimeline" :key="`${entry.meetingId}-${entry.date}`" class="ph-node">
                  <span class="ph-dot" aria-hidden="true" />
                  <article class="timeline-item ph-card hover-lift">
                    <div class="ph-card-kicker">
                      <time class="ph-date" :datetime="entry.date">{{ formatHistoryDate(entry.date) }}</time>
                      <div class="ph-kicker-badges">
                        <span class="status-badge default">{{ t(entry.type) }}</span>
                        <span
                          class="status-badge"
                          :class="
                            aiStatusTone(entry.aiStatus) === 'pending' ? 'warning' : 'success'
                          "
                        >
                          {{ t(entry.aiStatus) }}
                        </span>
                      </div>
                    </div>
                    <RouterLink class="ph-card-title" :to="`/meeting/${entry.meetingId}`">{{ t(entry.title) }}</RouterLink>
                    <p class="ph-card-summary">{{ t(entry.summary) }}</p>
                    <div v-if="entry.highlights.length" class="ph-highlights">
                      <p class="ph-highlights-label">{{ t({ zh: '要点', en: 'Key points' }) }}</p>
                      <ul>
                        <li v-for="(h, idx) in entry.highlights" :key="idx">{{ t(h) }}</li>
                      </ul>
                    </div>
                    <div class="ph-card-footer">
                      <span class="ph-foot-stat">
                        {{
                          t({
                            zh: `${entry.actions} 条行动项`,
                            en: `${entry.actions} action item(s)`,
                          })
                        }}
                      </span>
                      <RouterLink class="ph-foot-link" :to="`/meeting/${entry.meetingId}`">
                        {{ t({ zh: '查看纪要', en: 'View minutes' }) }}
                        <ChevronRight :size="14" color="currentColor" :stroke-width="2" class="ph-chevron" aria-hidden="true" />
                      </RouterLink>
                    </div>
                  </article>
                </li>
              </ol>
            </div>
          </main>

          <aside class="section-card surface ph-aside">
            <div class="card-header ph-aside-head">
              <Sparkles class="ph-aside-icon" :size="18" color="#4f46e5" :stroke-width="2" aria-hidden="true" />
              <h3 class="card-title ph-aside-title">{{ t({ zh: '风险提示', en: 'Risks' }) }}</h3>
            </div>
            <div class="card-body ph-aside-body">
              <div
                v-for="alert in currentProject.crossMeetingAlerts"
                :key="alert.id"
                class="notice-card ph-insight"
                :class="{
                  warning: alert.tone === 'warning',
                  'ph-insight--info': alert.tone === 'info',
                  'ph-insight--neutral': alert.tone === 'neutral',
                }"
              >
                <h4>{{ t(alert.title) }}</h4>
                <p>{{ t(alert.body) }}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { ChevronRight, Search, Sparkles } from '../components/fakeLucide'
import { localize, projectHistoryProjects } from '../services/mockData'
import { useAppStore } from '../stores/app'
import type { Language, LocalizedText } from '../types/app'

const appStore = useAppStore()
const t = (text: LocalizedText) => localize(appStore.language, text)

const selectedProjectId = ref(projectHistoryProjects[0]?.id ?? 'digital-solutions')
const programSearch = ref('')

const currentProject = computed(() => projectHistoryProjects.find((p) => p.id === selectedProjectId.value) ?? null)

/** 支持几十个项目：搜索缩小列表，无匹配时右侧仍保留当前选中项的时间轴 */
const filteredPrograms = computed(() => {
  const q = programSearch.value.trim().toLowerCase()
  if (!q) return projectHistoryProjects.slice()
  return projectHistoryProjects.filter((p) => {
    const zh = p.label.zh.toLowerCase()
    const en = p.label.en.toLowerCase()
    return zh.includes(q) || en.includes(q)
  })
})

const sortedTimeline = computed(() => {
  const tl = currentProject.value?.timeline ?? []
  return [...tl].sort((a, b) => b.date.localeCompare(a.date))
})

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatHistoryDate(iso: string): string {
  const lang = appStore.language as Language
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  if (lang === 'zh') return `${y} 年 ${m} 月 ${d} 日`
  return `${MONTHS_EN[m - 1]} ${d}, ${y}`
}

function aiStatusTone(status: LocalizedText): 'pending' | 'done' {
  const s = t(status)
  if (s.includes('待') || s.includes('Draft') || s.includes('Progress') || s.toLowerCase().includes('pending'))
    return 'pending'
  return 'done'
}
</script>

<style scoped>
.project-history {
  max-width: min(1320px, 100%);
}

.ph-page-split {
  display: grid;
  grid-template-columns: minmax(200px, 260px) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

@media (max-width: 900px) {
  .ph-page-split {
    grid-template-columns: 1fr;
  }
}

.ph-program-rail {
  position: sticky;
  top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  max-height: min(70vh, 520px);
}

@media (max-width: 900px) {
  .ph-program-rail {
    position: static;
    max-height: 280px;
  }
}

.ph-program-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
}

.ph-program-search:focus-within {
  border-color: #93c5fd;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.ph-search-ic {
  flex-shrink: 0;
}

.ph-program-search input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 10px 0;
  font-size: 13px;
  color: #0f172a;
}

.ph-program-search input::placeholder {
  color: #94a3b8;
}

.ph-program-search input:focus {
  outline: none;
}

.ph-program-list {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
}

.ph-program-li {
  margin: 0;
  border-bottom: 1px solid #f1f5f9;
}

.ph-program-li:last-child {
  border-bottom: none;
}

.ph-program-item {
  width: 100%;
  display: block;
  padding: 10px 12px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.ph-program-item:hover {
  background: #f8fafc;
  color: #0f172a;
}

.ph-program-item--active {
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 600;
}

.ph-program-item:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
}

.ph-program-item-label {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ph-program-empty {
  margin: 0;
  padding: 8px 4px 0;
  font-size: 12.5px;
  color: #64748b;
}

.ph-workspace {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ph-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 312px;
  gap: 20px;
  align-items: start;
}

@media (max-width: 960px) {
  .ph-layout {
    grid-template-columns: 1fr;
  }

  .ph-aside {
    position: static;
  }
}

.ph-main {
  min-width: 0;
}

.ph-track {
  position: relative;
  padding-left: 32px;
}

.ph-rail {
  position: absolute;
  left: 11px;
  top: 6px;
  bottom: 20px;
  width: 1px;
  background: linear-gradient(180deg, #cbd5e1 0%, #e2e8f0 55%, #e2e8f0 100%);
  border-radius: 1px;
}

.ph-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ph-node {
  position: relative;
  padding-bottom: 22px;
  margin: 0;
}

.ph-node:last-child {
  padding-bottom: 0;
}

.ph-dot {
  position: absolute;
  left: -26px;
  top: 20px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  z-index: 1;
}

.ph-card {
  margin: 0;
  padding: 16px 18px;
  border-radius: 12px;
  border-color: #e2e8f0;
}

@media (prefers-reduced-motion: reduce) {
  .ph-card.hover-lift:hover {
    transform: none;
  }
}

.ph-card-kicker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.ph-date {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #64748b;
  font-variant-numeric: tabular-nums;
}

.ph-kicker-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ph-card-title {
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.35;
  margin: 0 0 8px;
  text-decoration: none;
  transition: color 0.18s ease;
}

.ph-card-title:hover {
  color: #2563eb;
}

.ph-card-title:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 3px;
  border-radius: 4px;
}

.ph-card-summary {
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 1.55;
  color: #475569;
}

.ph-highlights {
  margin: 0 0 14px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
}

.ph-highlights-label {
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
}

.ph-highlights ul {
  margin: 0;
  padding-left: 18px;
  font-size: 12.5px;
  line-height: 1.5;
  color: #334155;
}

.ph-highlights li + li {
  margin-top: 6px;
}

.ph-highlights li::marker {
  color: #94a3b8;
}

.ph-card-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.ph-foot-stat {
  font-size: 12px;
  color: #64748b;
}

.ph-foot-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.18s ease;
}

.ph-foot-link:hover {
  color: #1d4ed8;
}

.ph-foot-link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 4px;
}

.ph-chevron {
  flex-shrink: 0;
  opacity: 0.85;
}

.ph-aside {
  position: sticky;
  top: 20px;
  padding-bottom: 4px;
}

.ph-aside .card-header {
  padding-bottom: 8px;
}

.ph-aside-head {
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.ph-aside-icon {
  flex-shrink: 0;
  opacity: 0.92;
}

.ph-aside-title {
  font-size: 14px;
}

.ph-aside .card-body {
  padding-top: 0;
}

.ph-aside-body {
  gap: 12px;
}

.ph-insight h4 {
  font-size: 13px;
}

.ph-insight--info {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.ph-insight--neutral {
  background: #ffffff;
}
</style>
