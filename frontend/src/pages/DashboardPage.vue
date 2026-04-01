<template>
  <section class="page dashboard-page">
    <header class="page-header">
      <div>
        <h1 class="page-title">{{ t({ zh: '总览', en: 'Overview' }) }}<span class="page-phase-tag">MVP</span></h1>
      </div>
    </header>

    <section class="dashboard-banner ai-sheen">
      <div class="dashboard-banner-head">
        <div class="dashboard-banner-title">
          <span class="ai-dot-icon" aria-hidden="true"></span>
          <span>{{ t({ zh: 'AI 每日简报', en: 'AI Daily Brief' }) }}</span>
        </div>
        <span class="dashboard-banner-time">{{ t({ zh: '2026年3月22日', en: 'Mar 22, 2026' }) }}</span>
      </div>
      <p class="dashboard-banner-copy">{{ t(pendingInsights[0].body) }}</p>
      <div class="dashboard-banner-warning">
        <span class="dashboard-banner-warning-mark" aria-hidden="true">
          <svg class="dashboard-banner-warning-glyph" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M2 9V6M5.5 9V3M9 9V5.5" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="dashboard-banner-warning-text">{{ t(aiBriefRiskLine) }}</span>
      </div>
    </section>

    <section class="metric-grid dashboard-kpi-grid">
      <article
        v-for="metric in dashboardMetrics"
        :key="t(metric.label)"
        class="metric-card dashboard-metric action-center-kpi"
      >
        <div class="dashboard-kpi-top">
          <span class="metric-label dashboard-kpi-label">{{ t(metric.label) }}</span>
          <component :is="kpiIcon(metric.label.en)" :size="15" :color="kpiColor(metric.label.en)" :stroke-width="2" />
        </div>
        <strong
          class="metric-value dashboard-kpi-value"
          :style="metric.tone === 'danger' ? 'color:#0f172a' : metric.tone === 'warning' ? 'color:#0f172a' : 'color:#0f172a'"
        >{{ metric.value }}</strong>
      </article>
    </section>

    <section class="dashboard-layout">
      <div class="dashboard-left-column">
        <article class="surface section-card dashboard-meetings-card">
          <div class="card-header">
            <h3 class="card-title">{{ t({ zh: '待处理行动项', en: 'Pending Actions' }) }}</h3>
            <RouterLink class="dashboard-link" to="/my-action-items">{{ t({ zh: '更多', en: 'More' }) }}</RouterLink>
          </div>
          <div class="card-body">
            <button type="button" class="dashboard-action-row dashboard-action-row-clickable" @click="goMeeting('matter-review')">
              <div class="dashboard-row-main">
                <span class="dashboard-action-logo warning">
                  <FileClock :size="16" color="#7c3aed" :stroke-width="2" />
                </span>
                <div class="dashboard-copy-block dashboard-action-copy-block">
                  <p class="list-title">
                    {{ t({ zh: '检查纪要：Matter 网关技术评审会', en: 'Review Summary: Matter Gateway Design Review' }) }}
                    <span class="status-badge default dashboard-inline-status">{{ t({ zh: 'AI 纪要待确认', en: 'AI Summary Pending' }) }}</span>
                  </p>
                  <div class="dashboard-action-meta">
                    <span class="dashboard-action-meta-item">
                      <Calendar :size="12" color="#94a3b8" :stroke-width="2" />
                      {{ t({ zh: '今天 · 15:20', en: 'Today · 15:20' }) }}
                    </span>
                    <span class="dashboard-action-meta-item">
                      <ListTodo :size="12" color="#94a3b8" :stroke-width="2" />
                      {{ t({ zh: '4 个行动项', en: '4 Actions' }) }}
                    </span>
                    <span class="dashboard-action-conf">{{ t({ zh: '94% 置信度', en: '94% Confidence' }) }}</span>
                  </div>
                </div>
              </div>
              <span class="dashboard-action-arrow" aria-hidden="true">→</span>
            </button>
            <button type="button" class="dashboard-action-row dashboard-action-row-clickable" @click="goMeeting('esp32-c6-weekly')">
              <div class="dashboard-row-main">
                <span class="dashboard-action-logo info">
                  <RefreshCw :size="16" color="#2563eb" :stroke-width="2" />
                </span>
                <div class="dashboard-copy-block dashboard-action-copy-block">
                  <p class="list-title">
                    {{ t({ zh: '将 3 个行动项同步到 Jira：ESP32-C6 项目周会', en: 'Sync 3 Action Items to Jira for ESP32-C6 Weekly Sync' }) }}
                    <span class="status-badge default dashboard-inline-status">{{ t({ zh: '同步', en: 'Sync' }) }}</span>
                  </p>
                  <div class="dashboard-action-meta">
                    <span class="dashboard-action-meta-item">
                      <Calendar :size="12" color="#94a3b8" :stroke-width="2" />
                      {{ t({ zh: '昨天', en: 'Yesterday' }) }}
                    </span>
                    <span class="dashboard-action-meta-item">
                      <ListTodo :size="12" color="#94a3b8" :stroke-width="2" />
                      {{ t({ zh: '3 个行动项', en: '3 Actions' }) }}
                    </span>
                    <span class="dashboard-action-conf">{{ t({ zh: '89% 置信度', en: '89% Confidence' }) }}</span>
                  </div>
                </div>
              </div>
              <span class="dashboard-action-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </article>

        <article class="surface section-card">
          <div class="card-header">
            <h3 class="card-title">{{ t({ zh: '重点风险与升级', en: 'Top Risks & Escalations' }) }}</h3>
            <RouterLink class="dashboard-link" :to="highPriorityMoreLink">{{ t({ zh: '更多', en: 'More' }) }}</RouterLink>
          </div>
          <div class="card-body">
            <div class="dashboard-risk-summary">
              <button type="button" class="dashboard-risk-summary-item" @click="goTopRisksCenter">
                {{ t({ zh: `P0/P1：${p0p1Count} 项`, en: `P0/P1: ${p0p1Count} items` }) }}
              </button>
              <button type="button" class="dashboard-risk-summary-item" @click="goActionCenterEscalation()">
                {{ t({ zh: `连续 Blocker：${carryOverCount} 项`, en: `Carry-over blockers: ${carryOverCount}` }) }}
              </button>
            </div>
            <div
              v-for="risk in topPriorityActions"
              :key="risk.id"
              class="dashboard-priority-row"
            >
              <button type="button" class="dashboard-priority-main" @click="goMeeting(risk.meetingId)">
                <span class="dashboard-risk-icon" :class="risk.status.en === 'Overdue' ? 'critical' : 'major'">!</span>
                <div class="dashboard-copy-block">
                  <p class="list-title dashboard-priority-title">{{ t(risk.title) }}</p>
                  <div class="list-meta dashboard-priority-meta">
                    <span class="dashboard-priority-severity" :class="risk.status.en === 'Overdue' ? 'critical' : 'major'">
                      {{ riskSeverity(risk.status.en) }}
                    </span>
                    <span>{{ t({ zh: `阻塞时长 ${riskDuration(risk.status.en)}`, en: `Blocked for ${riskDuration(risk.status.en)}` }) }}</span>
                    <span>{{ risk.project }}</span>
                    <span>{{ risk.deadline }}</span>
                  </div>
                </div>
                <span class="dashboard-action-arrow" aria-hidden="true">→</span>
              </button>
            </div>
            <div v-if="topPriorityActions.length === 0" class="list-meta">
              {{ t({ zh: '当前暂无高优先风险', en: 'No high-priority risks right now' }) }}
            </div>
          </div>
        </article>
      </div>

      <div class="dashboard-right-column">
        <article class="surface section-card">
          <div class="card-header">
            <h3 class="card-title">{{ t({ zh: '今日会议', en: "Today's Meetings" }) }}</h3>
            <RouterLink class="dashboard-link" to="/meetings">{{ t({ zh: '查看全部', en: 'View All' }) }}</RouterLink>
          </div>
          <div class="card-body dashboard-meetings-body">
            <div
              v-for="meeting in meetings"
              :key="meeting.id"
              class="dashboard-meeting-row"
              :class="{ 'is-live': isMeetingLive(meeting.id) }"
            >
              <div class="dashboard-meeting-timeline" aria-hidden="true">
                <span class="dashboard-meeting-node" :class="{ live: isMeetingLive(meeting.id) }"></span>
              </div>
              <div class="dashboard-row-main">
                <div class="dashboard-copy-block">
                  <div class="dashboard-meeting-time-inline">
                    {{ t(meeting.time).split(' - ')[0] }} - {{ t(meeting.time).split(' - ')[1] }}
                  </div>
                  <button type="button" class="dashboard-meeting-title-button" @click="goMeeting(meeting.id)">
                    {{ t(meeting.title) }}
                  </button>
                  <div class="list-meta">{{ t(meeting.type) }}</div>
                </div>
              </div>
              <span
                class="status-badge dashboard-pill"
                :class="meeting.id === 'matter-review' ? 'warning' : meeting.id === 'risk-sync' ? 'success' : 'default'"
              >
                {{ meetingStatusText(meeting.id) }}
              </span>
            </div>
          </div>
        </article>

        <article class="surface section-card">
          <div class="card-header">
            <h3 class="card-title">{{ t({ zh: '系统状态', en: 'System Status' }) }}</h3>
            <RouterLink class="dashboard-manage-integration-button" to="/integrations-admin">
              {{ t({ zh: '管理集成', en: 'Manage Integration' }) }}
            </RouterLink>
          </div>
          <div class="card-body">
            <div v-for="system in dashboardSystemStatusRows" :key="system.id" class="dashboard-system-row">
              <div class="dashboard-system-main">
                <span class="dashboard-system-dot" :class="system.tone" aria-hidden="true"></span>
                <p class="list-title">{{ t(system.label) }}</p>
              </div>
              <span class="dashboard-connected" :class="system.tone">{{ t(system.status) }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { Calendar, FileClock, ListTodo, RefreshCw } from '../components/fakeLucide'
import { RouterLink, useRouter } from 'vue-router'

import {
  actionCenterRows,
  dashboardMetrics,
  dashboardSystemStatusRows,
  localize,
  meetings,
  pendingInsights,
} from '../services/mockData'
import { useAppStore } from '../stores/app'
import type { LocalizedText } from '../types/app'
import { computed } from 'vue'

const appStore = useAppStore()
const router = useRouter()
const t = (text: LocalizedText) => localize(appStore.language, text)

const goMeeting = (meetingId: string) => {
  router.push(`/meeting/${meetingId}`)
}

const kpiIcon = (label: string) => {
  if (label.includes('Week')) return Calendar
  if (label.includes('Summaries')) return FileClock
  if (label.includes('Jira')) return RefreshCw
  return ListTodo
}

const kpiColor = (label: string) => {
  if (label.includes('Week')) return '#2563eb'
  if (label.includes('Summaries') || label.includes('Jira')) return '#f59e0b'
  return '#dc2626'
}

const meetingStatusText = (meetingId: string) => {
  if (meetingId === 'matter-review') return t({ zh: '待确认', en: 'Pending' })
  if (meetingId === 'risk-sync') return t({ zh: '已发送', en: 'Sent' })
  return t({ zh: '已结束', en: 'Ended' })
}

const highPriorityWeight: Record<string, number> = {
  Overdue: 0,
  'Missing Fields': 1,
  'Carry-over': 2,
  'In Progress': 3,
}

const topPriorityActions = computed(() =>
  [...actionCenterRows]
    .sort((a, b) => (highPriorityWeight[a.status.en] ?? 99) - (highPriorityWeight[b.status.en] ?? 99))
    .slice(0, 5),
)

/** AI 简报黄条：单行、可执行的量化提示（数据与行动中心一致） */
const aiBriefRiskLine = computed((): LocalizedText => {
  const overdue = actionCenterRows.filter((r) => r.status.en === 'Overdue').length
  const carry = actionCenterRows.filter((r) => r.status.en === 'Carry-over').length
  const missing = actionCenterRows.filter((r) => r.status.en === 'Missing Fields').length
  return {
    zh: `${overdue} 项逾期 · ${carry} 项跨会议阻塞 · ${missing} 项缺 owner/截止 — 建议优先在行动中心闭环并同步 Jira。`,
    en: `${overdue} overdue · ${carry} carry-over blockers · ${missing} missing owner/deadline — close the loop in Action Center & sync Jira first.`,
  }
})

const p0p1Count = computed(
  () => actionCenterRows.filter((row) => row.status.en === 'Overdue' || row.status.en === 'Missing Fields').length,
)
const carryOverCount = computed(() => actionCenterRows.filter((row) => row.status.en === 'Carry-over').length)

const highPriorityMoreLink = '/action-center?status=Overdue'

const riskSeverity = (statusEn: string) => {
  if (statusEn === 'Overdue') return t({ zh: 'P0 影响级别', en: 'P0 Impact' })
  if (statusEn === 'Missing Fields') return t({ zh: 'P1 影响级别', en: 'P1 Impact' })
  return t({ zh: 'P1 影响级别', en: 'P1 Impact' })
}

const riskDuration = (statusEn: string) => {
  if (statusEn === 'Overdue') return '4d'
  if (statusEn === 'Missing Fields') return '2d'
  if (statusEn === 'Carry-over') return '6d'
  return '1d'
}

const goTopRisksCenter = () => {
  router.push('/action-center?status=Overdue')
}

const goActionCenterEscalation = (riskId?: string) => {
  const riskQuery = riskId ? `&risk=${riskId}` : ''
  router.push(`/action-center?status=Carry-over${riskQuery}`)
}

const isMeetingLive = (meetingId: string) => meetingId === 'esp32-c6-weekly'
</script>

<style scoped>
.dashboard-page {
  gap: 16px;
  min-width: 0;
}

.dashboard-kpi-grid {
  margin-top: 2px;
}

.dashboard-metric {
  min-height: 112px;
  justify-content: space-between;
  gap: 12px;
  padding: 24px;
  text-align: left;
  font: inherit;
}

.dashboard-kpi-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.dashboard-kpi-label {
  word-break: break-word;
  font-size: 14px;
}

.dashboard-kpi-value {
  font-size: 32px;
  line-height: 1;
  font-weight: 600;
}

/* 与行动中心统一：可点击 KPI 卡片 + 激活态 */
.action-center-kpi {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  width: 100%;
  border: 1px solid #e2e8f0;
  color: inherit;
  border-radius: 14px;
  background: #ffffff;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(280px, 1fr);
  gap: 16px;
  min-width: 0;
}

.dashboard-left-column,
.dashboard-right-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.dashboard-left-column > .section-card,
.dashboard-right-column > .section-card {
  min-width: 0;
}

.dashboard-action-row,
.dashboard-risk-row,
.dashboard-system-row,
.dashboard-meeting-row {
  display: grid;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}

.dashboard-action-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  padding: 10px 0;
  position: relative;
}

.dashboard-action-row::after {
  content: "";
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 0;
  height: 1px;
  background: #f1f5f9;
}

.dashboard-risk-row {
  grid-template-columns: 18px minmax(0, 1fr);
  align-items: start;
}

.dashboard-system-row {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 11px 0;
}

.dashboard-system-main {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.dashboard-system-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex-shrink: 0;
  background: var(--green-main);
  box-shadow: 0 0 0 3px var(--green-ring);
}

.dashboard-system-dot.warning {
  background: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18);
}

.dashboard-system-dot.danger {
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.14);
}

.dashboard-connected.warning {
  color: #b45309;
  font-weight: 600;
}

.dashboard-connected.danger {
  color: #b91c1c;
  font-weight: 600;
}

.dashboard-meeting-row {
  grid-template-columns: 14px minmax(0, 1fr) auto;
  align-items: start;
  border-bottom: none;
  padding: 12px 0;
}

.dashboard-action-row:last-child,
.dashboard-risk-row:last-child,
.dashboard-system-row:last-child,
.dashboard-meeting-row:last-child {
  border-bottom: none;
}

.dashboard-action-row:last-child::after {
  display: none;
}

.dashboard-row-main {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}

.dashboard-copy-block {
  min-width: 0;
  flex: 1;
  overflow-wrap: anywhere;
}

.dashboard-copy-block .list-title,
.dashboard-copy-block .list-meta {
  word-break: break-word;
}

.dashboard-action-logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border: none;
  box-shadow: none;
}

.dashboard-action-logo.warning {
  background: linear-gradient(145deg, #f7f5ff 0%, #f1efff 100%);
}

.dashboard-action-logo.info {
  background: linear-gradient(145deg, #f2f8ff 0%, #e8f2ff 100%);
}

.dashboard-risk-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #dc2626;
  background: #fef2f2;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.dashboard-link {
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
}

.dashboard-manage-integration-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid #dbeafe;
  background: #f8fbff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.dashboard-manage-integration-button:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1e40af;
}

.dashboard-risk-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.dashboard-risk-summary-item {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  transition: background-color 0.18s ease, border-color 0.18s ease;
  font-size: 11.5px;
  font-weight: 600;
  color: #475569;
  border-radius: 999px;
  padding: 3px 8px;
}

.dashboard-risk-summary-item:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.dashboard-chip-button {
  border: none;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.2s ease;
}

.dashboard-chip-button:hover {
  filter: brightness(0.98);
}

.dashboard-action-row-clickable {
  cursor: pointer;
  transition: background-color 0.18s ease;
  margin: 0 -20px;
  padding: 10px 20px;
  border-radius: 0;
}

.dashboard-action-row-clickable:hover {
  background: #f8fafc;
}

.dashboard-inline-status {
  margin-left: 6px;
  vertical-align: middle;
  font-size: 10.5px;
  padding: 1px 7px;
  font-weight: 600;
  opacity: 0.92;
}

.dashboard-priority-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;
  padding: 2px 0;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
}

.dashboard-priority-row:last-of-type {
  border-bottom: none;
}

.dashboard-priority-main {
  border: none;
  background: transparent;
  font: inherit;
  color: inherit;
  text-align: left;
  width: 100%;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-width: 0;
  cursor: pointer;
  border-radius: 8px;
  padding: 10px 0;
  margin: 0 -8px;
  transition: background-color 0.18s ease;
}

.dashboard-priority-main:hover,
.dashboard-priority-main:focus-visible {
  background: #f8fafc;
  outline: none;
}

.dashboard-priority-title {
  margin: 0;
  color: #0f172a;
  font-weight: 600;
  line-height: 1.4;
}

.dashboard-priority-main:hover .dashboard-priority-title {
  color: #2563eb;
}

.dashboard-priority-meta {
  margin-top: 4px;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.dashboard-priority-severity {
  border-radius: 999px;
  padding: 1px 8px;
  font-size: 10.5px;
  font-weight: 700;
}

.dashboard-priority-severity.critical {
  color: #b91c1c;
  background: #fef2f2;
}

.dashboard-priority-severity.major {
  color: #92400e;
  background: #fff7ed;
}

.dashboard-risk-icon.critical {
  color: #dc2626;
  background: #fef2f2;
}

.dashboard-risk-icon.major {
  color: #d97706;
  background: #fff7ed;
}

.dashboard-action-copy-block {
  padding-top: 0;
}

.dashboard-action-meta {
  margin-top: 5px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.dashboard-action-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: #64748b;
  line-height: 1.35;
}

.dashboard-action-conf {
  font-size: 11.5px;
  font-weight: 600;
  color: #0f766e;
  padding: 0;
  border-radius: 0;
  background: transparent;
}


.dashboard-action-arrow {
  color: #cbd5e1;
  font-size: 14px;
  font-weight: 500;
  align-self: center;
  flex-shrink: 0;
  line-height: 1;
  pointer-events: none;
}

.dashboard-action-copy-block .list-title {
  margin-bottom: 0;
  line-height: 1.42;
  font-weight: 650;
}


.dashboard-meeting-timeline {
  position: relative;
  width: 14px;
  min-height: 42px;
}

.dashboard-meeting-node {
  position: absolute;
  left: 2px;
  top: 14px;
  width: 9px;
  height: 9px;
  border-radius: 999px;
  border: 2px solid #93c5fd;
  background: #eff6ff;
  z-index: 1;
}

.dashboard-meeting-node.live {
  border-color: #2563eb;
  background: radial-gradient(circle at 35% 35%, #ffffff 0%, #dbeafe 45%, #bfdbfe 100%);
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.85),
    0 0 0 0 rgba(37, 99, 235, 0.32);
  animation: dashboard-live-pulse 2s ease-out infinite;
}

.dashboard-meeting-node.live::after {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: 999px;
  border: 1px solid rgba(37, 99, 235, 0.28);
  opacity: 0.65;
  animation: dashboard-live-orbit 2.2s ease-in-out infinite;
}

.dashboard-meetings-card .card-body {
  gap: 0;
}

.dashboard-meetings-body {
  position: relative;
}

.dashboard-meetings-body::before {
  content: "";
  position: absolute;
  left: 26px;
  top: 22px;
  bottom: 22px;
  width: 1px;
  background: linear-gradient(180deg, rgba(191, 219, 254, 0.92) 0%, rgba(148, 163, 184, 0.52) 100%);
}

.dashboard-meeting-time-inline {
  font-size: 12px;
  color: #64748b;
  line-height: 1.3;
  margin-bottom: 2px;
}

.dashboard-meeting-row.is-live .dashboard-meeting-time-inline {
  color: #2563eb;
  font-weight: 600;
}

.dashboard-meeting-title-button {
  display: inline-block;
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  color: #0f172a;
  font: inherit;
  font-weight: 700;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;
  transition: color 0.18s ease;
}

.dashboard-meeting-title-button:hover {
  color: #2563eb;
}

.dashboard-pill {
  flex-shrink: 0;
  align-self: flex-start;
  max-width: 120px;
  white-space: nowrap;
}

.dashboard-connected {
  font-size: 12px;
  color: #059669;
  font-weight: 600;
}

@media (max-width: 1360px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1200px) {
  .dashboard-page :deep(.metric-grid) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .dashboard-page {
    padding: 20px 20px;
  }

  .dashboard-page :deep(.metric-grid) {
    grid-template-columns: 1fr;
  }

  .dashboard-action-row,
  .dashboard-meeting-row,
  .dashboard-system-row {
    grid-template-columns: 1fr;
  }

  .dashboard-meeting-timeline {
    display: none;
  }

  .dashboard-meetings-body::before {
    display: none;
  }

  .dashboard-pill,
  .dashboard-connected {
    justify-self: start;
  }
}

@media (prefers-reduced-motion: no-preference) {
  @keyframes dashboard-live-pulse {
    0% {
      box-shadow:
        0 0 0 2px rgba(255, 255, 255, 0.85),
        0 0 0 0 rgba(37, 99, 235, 0.32);
    }
    70% {
      box-shadow:
        0 0 0 2px rgba(255, 255, 255, 0.85),
        0 0 0 10px rgba(37, 99, 235, 0);
    }
    100% {
      box-shadow:
        0 0 0 2px rgba(255, 255, 255, 0.85),
        0 0 0 0 rgba(37, 99, 235, 0);
    }
  }

  @keyframes dashboard-live-orbit {
    0% {
      transform: scale(0.92);
      opacity: 0.25;
    }
    45% {
      transform: scale(1.06);
      opacity: 0.55;
    }
    100% {
      transform: scale(1.18);
      opacity: 0;
    }
  }
}
</style>
