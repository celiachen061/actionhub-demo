<template>
  <section class="page action-center-page">
    <header class="page-header">
      <div>
        <h1 class="page-title">{{ t({ zh: '行动中心', en: 'Action Center' }) }}<span class="page-phase-tag">P2</span></h1>
        <p class="page-subtitle">
          {{ t({ zh: '让跨会议 follow-up 真正可见、可筛、可处理。', en: 'Make carry-over follow-up visible, filterable, and actionable.' }) }}
        </p>
      </div>
      <button class="primary-button" @click="bulkResolve">{{ t({ zh: '批量处理未关闭事项', en: 'Bulk Resolve Open Items' }) }}</button>
    </header>

    <section class="metric-grid">
      <article
        v-for="metric in actionCenterMetrics"
        :key="t(metric.label)"
        class="metric-card action-center-kpi"
      >
        <span class="metric-label">{{ t(metric.label) }}</span>
        <strong
          class="metric-value"
          :style="metric.tone === 'danger' ? 'color:#dc2626' : metric.tone === 'warning' ? 'color:#d97706' : ''"
        >{{ metric.value }}</strong>
        <span class="metric-hint">{{ metric.hint ? t(metric.hint) : '' }}</span>
      </article>
    </section>

    <!-- AI Insight Banner -->
    <div v-for="insight in actionCenterInsights" :key="t(insight.title)" class="ai-banner ai-sheen">
      <span class="banner-text">{{ t(insight.title) }}</span>
      <button class="banner-link" @click="bulkResolve">{{ t({ zh: '开始跨会议跟进 →', en: 'Start Cross-meeting Follow-up →' }) }}</button>
    </div>

    <section class="ac-layout" :class="{ 'ac-layout--sidebar-open': detailPanelOpen }">
      <!-- Action Items table -->
      <article class="surface table-card action-center-table-card">
        <div class="card-header action-center-table-toolbar">
          <h3 class="card-title">{{ t({ zh: '跨会议 Action Items', en: 'Cross-meeting Action Items' }) }}</h3>
          <div class="toolbar-row">
            <select
              v-model="statusFilter"
              class="select-box toolbar-select"
              style="height:32px;font-size:12.5px;"
              :aria-label="t({ zh: '按状态筛选', en: 'Filter by status' })"
            >
              <option value="all">{{ t({ zh: '所有状态', en: 'All statuses' }) }}</option>
              <option value="Overdue">{{ t({ zh: '逾期', en: 'Overdue' }) }}</option>
              <option value="Missing Fields">{{ t({ zh: '待补字段', en: 'Missing fields' }) }}</option>
              <option value="In Progress">{{ t({ zh: '进行中', en: 'In progress' }) }}</option>
              <option value="Carry-over">{{ t({ zh: '跨会议', en: 'Carry-over' }) }}</option>
            </select>
            <select
              v-model="projectFilter"
              class="select-box toolbar-select"
              style="height:32px;font-size:12.5px;"
              :aria-label="t({ zh: '按项目筛选', en: 'Filter by project' })"
            >
              <option value="all">{{ t({ zh: '所有项目', en: 'All projects' }) }}</option>
              <option v-for="p in actionCenterProjects" :key="p" :value="p">{{ p }}</option>
            </select>
            <button class="secondary-button" style="height:32px;font-size:12.5px;" @click="bulkResolve">AI {{ t({ zh: '批量处理', en: 'Bulk Process' }) }}</button>
          </div>
        </div>

        <div class="table-wrap action-center-table-body action-center-table-scroll">
          <table class="action-center-table">
            <thead>
              <tr>
                <th>{{ t({ zh: '任务标题', en: 'Task title' }) }}</th>
                <th>{{ t({ zh: '负责人', en: 'Assignee' }) }}</th>
                <th>{{ t({ zh: '来源会议', en: 'Source meeting' }) }}</th>
                <th>{{ t({ zh: '截止日期', en: 'Due date' }) }}</th>
                <th>{{ t({ zh: '状态', en: 'Status' }) }}</th>
                <th>{{ t({ zh: '去向', en: 'Routing' }) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in filteredRows"
                :key="row.id"
                class="action-table-row"
                :class="{ active: detailPanelOpen && selectedRowId === row.id }"
              >
                <td class="td-clip">
                  <button
                    type="button"
                    class="table-link-button action-title-btn cell-ellipsis"
                    :title="t(row.title)"
                    @click.stop="openDetailPanel(row.id)"
                  >
                    {{ t(row.title) }}
                  </button>
                </td>
                <td class="td-clip assignee-cell"><span class="cell-ellipsis" :title="row.owner">{{ row.owner }}</span></td>
                <td class="td-clip"><span class="cell-ellipsis" :title="t(meetingTitleById(row.meetingId))">{{ t(meetingTitleById(row.meetingId)) }}</span></td>
                <td class="td-clip td-nowrap" :class="{ 'deadline-overdue': row.status.en === 'Overdue' }">{{ row.deadline }}</td>
                <td class="td-clip td-nowrap">
                  <span
                    class="status-badge badge-ellipsis"
                    :class="row.status.en === 'Overdue' ? 'danger' : row.status.en === 'Missing Fields' ? 'warning' : row.status.en === 'Carry-over' ? 'warning' : 'success'"
                  >{{ t(row.status) }}</span>
                </td>
                <td class="td-clip td-nowrap"><span class="status-badge default badge-ellipsis">{{ t(row.routing) }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article v-if="detailPanelOpen" class="surface section-card detail-drawer">
        <div class="card-header detail-drawer-head">
          <h3 class="card-title">{{ t({ zh: '行动项详情', en: 'Item details' }) }}</h3>
          <button
            type="button"
            class="ghost-button drawer-close"
            :aria-label="t({ zh: '关闭详情', en: 'Close details' })"
            @click="closeDetailPanel"
          >
            ×
          </button>
        </div>
        <div v-if="previewRow" class="card-body detail-drawer-body">
          <div class="detail-badge-row">
            <span class="priority-pill" :class="previewRow.status.en === 'Overdue' || previewRow.status.en === 'Carry-over' ? 'priority-pill--high' : 'priority-pill--medium'">
              {{ previewRow.status.en === 'Overdue' || previewRow.status.en === 'Carry-over' ? t({ zh: '高优先级', en: 'High priority' }) : t({ zh: '普通', en: 'Normal' }) }}
            </span>
            <span class="priority-pill priority-pill--status">{{ t(previewRow.status) }}</span>
          </div>

          <h4 class="detail-main-title">{{ t(previewRow.title) }}</h4>

          <div class="detail-meta-grid">
            <div class="detail-meta-cell">
              <p class="detail-section-label">{{ t({ zh: '负责人', en: 'Owner' }) }}</p>
              <p class="detail-meta-value">{{ previewRow.owner }}</p>
            </div>
            <div class="detail-meta-cell">
              <p class="detail-section-label">{{ t({ zh: '截止日期', en: 'Deadline' }) }}</p>
              <p class="detail-meta-value detail-meta-value--inline">
                <Calendar :size="14" color="#64748b" :stroke-width="2" class="detail-meta-icon" aria-hidden="true" />
                {{ previewRow.deadline }}
              </p>
            </div>
          </div>

          <div class="detail-block">
            <p class="detail-section-label">{{ t({ zh: '来源上下文', en: 'Source context' }) }}</p>
            <div class="quote-panel">
              <MessageSquare :size="16" color="#94a3b8" :stroke-width="2" class="quote-panel-icon" aria-hidden="true" />
              <p class="quote-panel-text">「{{ t(contextQuoteByRow(previewRow)) }}」</p>
            </div>
            <RouterLink class="source-meeting-link" :to="`/meeting/${previewRow.meetingId}`">
              <span>{{ t({ zh: '来源', en: 'From' }) }}: {{ t(meetingTitleById(previewRow.meetingId)) }}</span>
              <ExternalLink :size="14" color="#2563eb" :stroke-width="2" aria-hidden="true" />
            </RouterLink>
          </div>

          <div class="detail-block">
            <p class="detail-section-label">{{ t({ zh: '同步详情', en: 'Sync details' }) }}</p>
            <div class="sync-panel">
              <div class="sync-row">
                <span class="sync-key">{{ t({ zh: '目标系统', en: 'Target system' }) }}</span>
                <span class="sync-tag">{{ t(previewRow.routing) }}</span>
              </div>
              <div class="sync-row">
                <span class="sync-key">{{ t({ zh: '工单号', en: 'Ticket ID' }) }}</span>
                <button v-if="ticketKeyByRow(previewRow)" type="button" class="sync-ticket-link" @click="openJira(previewRow)">
                  {{ ticketKeyByRow(previewRow) }}
                </button>
                <span v-else class="sync-muted">{{ t({ zh: '未创建', en: 'Not created' }) }}</span>
              </div>
              <div class="sync-row">
                <span class="sync-key">{{ t({ zh: '最近同步', en: 'Last synced' }) }}</span>
                <span class="sync-value">{{ t(lastSyncedByRow(previewRow)) }}</span>
              </div>
            </div>
          </div>

          <div class="detail-footer-actions">
            <button type="button" class="primary-button detail-footer-primary" @click="updateItemStatus(previewRow)">
              {{ t({ zh: '更新状态', en: 'Update status' }) }}
            </button>
            <button
              v-if="ticketKeyByRow(previewRow)"
              type="button"
              class="ghost-button detail-footer-secondary"
              @click="openJira(previewRow)"
            >
              {{ t({ zh: '在 Jira 中打开', en: 'Open in Jira' }) }}
            </button>
          </div>
        </div>
        <div v-else class="card-body detail-empty">
          <p>{{ t({ zh: '请点击某一行的任务标题以查看详情。', en: 'Click a task title in the table to view details.' }) }}</p>
        </div>
      </article>
    </section>

    <!-- AI Skills -->
    <article class="surface section-card action-skills-panel">
      <div class="card-header">
        <h3 class="card-title">{{ t({ zh: 'AI Skills 推荐', en: 'Recommended AI Skills' }) }}</h3>
      </div>
      <div class="card-body action-skills-body">
        <div class="skills-grid">
          <button v-for="skill in skillCards" :key="t(skill.title)" class="notice-card action-skill-card" :class="skill.tone" @click="runSkill(skill)">
            <h4>{{ t(skill.title) }}</h4>
            <p>{{ t(skill.body) }}</p>
          </button>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Calendar, ExternalLink, MessageSquare } from '../components/fakeLucide'

import {
  actionCenterInsights,
  actionCenterMetrics,
  actionCenterRows,
  localize,
  normalizeProgramGroupEn,
  skillCards,
} from '../services/mockData'
import { useAppStore } from '../stores/app'
import { useUiStore } from '../stores/ui'
import type { LocalizedText } from '../types/app'

const appStore = useAppStore()
const uiStore = useUiStore()
const route = useRoute()
const t = (text: LocalizedText) => localize(appStore.language, text)

const statusFilter = ref<string>('all')
const projectFilter = ref<string>('all')
const selectedRowId = ref<string | null>(null)

const actionCenterProjects = computed(() => {
  const set = new Set(actionCenterRows.map(r => r.project))
  return [...set]
})

const filteredRows = computed(() => {
  let rows = actionCenterRows
  if (projectFilter.value !== 'all') {
    rows = rows.filter(r => r.project === projectFilter.value)
  }
  if (statusFilter.value !== 'all') {
    rows = rows.filter(r => r.status.en === statusFilter.value)
  }
  return rows
})

const detailPanelOpen = computed(() => selectedRowId.value !== null)
const previewRow = computed(() => actionCenterRows.find((r) => r.id === selectedRowId.value) ?? null)

watchEffect(() => {
  const status = route.query.status
  const project = route.query.project
  const validStatuses = new Set(['all', 'Overdue', 'Missing Fields', 'Carry-over', 'In Progress'])
  if (typeof status === 'string' && validStatuses.has(status)) {
    statusFilter.value = status
  }
  if (typeof project === 'string') {
    const normalized = normalizeProgramGroupEn(project)
    const validProject = actionCenterRows.some((row) => row.project === normalized)
    projectFilter.value = validProject ? normalized : 'all'
  }
})

const bulkResolve = () => {
  uiStore.pushToast(
    t({ zh: 'AI 批量处理已启动', en: 'AI bulk process started' }),
    t({ zh: '系统正在整理 owner / deadline 缺失项。', en: 'The system is organizing items missing owner / deadline.' }),
    'success',
  )
}

const openDetailPanel = (id: string) => {
  selectedRowId.value = id
}

const closeDetailPanel = () => {
  selectedRowId.value = null
}

const meetingTitleById = (id: string): LocalizedText => {
  const mapping: Record<string, LocalizedText> = {
    'esp32-c6-weekly': { zh: 'ESP32-C6 项目周会', en: 'ESP32-C6 Weekly Sync' },
    'matter-review': { zh: 'Matter 网关技术评审会', en: 'Matter Gateway Design Review' },
    'risk-sync': { zh: 'X90 芯片量产风险同步会', en: 'X90 Mass Production Risk Sync' },
    'risk-sync-q3': { zh: 'Q3 量产风险复盘会', en: 'Q3 Risk Retrospective' },
    'esp32-p4-sync': { zh: 'ESP32-P4 工业场景周会', en: 'ESP32-P4 Industrial Weekly' },
  }
  return mapping[id] ?? { zh: '项目同步会', en: 'Project Sync' }
}

const contextQuoteByRow = (row: (typeof actionCenterRows)[number]): LocalizedText => ({
  zh: `${t(row.title)} 需要在本周内明确负责人与截止节点，否则会继续跨会议遗留。`,
  en: `${t(row.title)} needs explicit owner and due date this week, or it will carry over again.`,
})

const ticketKeyByRow = (row: (typeof actionCenterRows)[number]): string | null => {
  if (row.routing.en !== 'Jira' || row.owner === '-') return null
  return `${row.project.split(' ')[0].toUpperCase().slice(0, 3)}-${row.id.slice(3)}`
}

const lastSyncedByRow = (row: (typeof actionCenterRows)[number]): LocalizedText => {
  if (row.routing.en === 'Email only') return { zh: '4 小时前', en: '4 hours ago' }
  if (row.routing.en === 'Jira') return { zh: '2 小时前', en: '2 hours ago' }
  return { zh: '昨天', en: 'Yesterday' }
}

const openJira = (row: (typeof actionCenterRows)[number]) => {
  const key = ticketKeyByRow(row)
  if (!key) return
  uiStore.pushToast(
    t({ zh: '在 Jira 中打开', en: 'Open in Jira' }),
    `${key} · ${t({ zh: '演示环境未配置真实 Jira 链接。', en: 'Demo: no real Jira URL configured.' })}`,
    'default',
  )
}

const updateItemStatus = (row: (typeof actionCenterRows)[number]) => {
  uiStore.pushToast(
    t({ zh: '状态已更新', en: 'Status updated' }),
    t(row.title),
    'success',
  )
}

const runSkill = (skill: (typeof skillCards)[number]) => {
  uiStore.pushToast(
    t({ zh: '技能已触发', en: 'Skill triggered' }),
    t(skill.title),
    'success',
  )
}

watchEffect(() => {
  const rows = filteredRows.value
  if (!rows.length) {
    selectedRowId.value = null
    return
  }
  if (!selectedRowId.value) return
  if (!rows.some((r) => r.id === selectedRowId.value)) selectedRowId.value = rows[0].id
})
</script>

<style scoped>
/* 整页随 page-host 滚动；底部留白便于滚到 AI Skills */
.action-center-page {
  padding-bottom: 32px;
}

/* KPI 纯展示：不可点击、不联动筛选 */
.action-center-kpi {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  width: 100%;
  min-height: 0;
  border: 1px solid #e2e8f0;
  cursor: default;
  text-align: left;
  font: inherit;
  color: inherit;
  border-radius: 14px;
  background: #ffffff;
}

.action-center-table-card {
  overflow: visible;
}

.ac-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  --ac-toolbar-h: 60px;
  --ac-head-h: 45px;
  --ac-row-h: 48px;
  --ac-visible-rows: 10;
}

.ac-layout--sidebar-open {
  grid-template-columns: minmax(0, 1fr) 360px;
  align-items: stretch;
}

.ac-layout--sidebar-open > .action-center-table-card,
.ac-layout--sidebar-open > .detail-drawer {
  height: calc(var(--ac-toolbar-h) + var(--ac-head-h) + var(--ac-row-h) * var(--ac-visible-rows));
  max-height: calc(var(--ac-toolbar-h) + var(--ac-head-h) + var(--ac-row-h) * var(--ac-visible-rows));
}

/* 标题与筛选、按钮同一行：左标题、右工具组（与全局 card-header 一致并尽量不换行） */
.action-center-table-toolbar {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 12px;
  min-height: var(--ac-toolbar-h);
  box-sizing: border-box;
}

.action-center-table-toolbar .card-title {
  margin: 0;
  flex: 1;
  min-width: 0;
}

.action-center-table-toolbar .toolbar-row {
  flex-shrink: 0;
  flex-wrap: nowrap;
  gap: 8px;
}

.action-skill-card {
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-skill-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
}

/* 仅表格区域：表列头 + 5 行数据高度固定，多出行在本框内滚动 */
.action-center-table-body.action-center-table-scroll {
  flex-shrink: 0;
  height: calc(var(--ac-head-h) + var(--ac-visible-rows) * var(--ac-row-h));
  min-height: calc(var(--ac-head-h) + var(--ac-visible-rows) * var(--ac-row-h));
  max-height: calc(var(--ac-head-h) + var(--ac-visible-rows) * var(--ac-row-h));
  overflow: auto;
  overscroll-behavior: contain;
}

.action-center-table-body.action-center-table-scroll :deep(thead th) {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f8fafc;
  box-shadow: 0 1px 0 #e2e8f0;
}

.td-clip {
  overflow: hidden;
  vertical-align: middle;
}

.td-nowrap {
  white-space: nowrap;
}

.cell-ellipsis {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  min-width: 0;
}

.badge-ellipsis {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.assignee-cell {
  color: #475569;
  font-size: 13px;
}

.action-table-row {
  transition: background-color 0.2s ease;
}

.action-table-row.active {
  background: #f1f5f9;
}

.table-link-button {
  border: none;
  background: transparent;
  padding: 0;
  color: #0f172a;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
}

.table-link-button:hover {
  color: #2563eb;
}

.detail-drawer {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.detail-drawer-head {
  padding-bottom: 10px;
  min-height: var(--ac-toolbar-h);
  box-sizing: border-box;
  flex-shrink: 0;
}

.drawer-close {
  height: 28px;
  min-width: 28px;
  padding: 0 8px;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.detail-drawer-body {
  flex: 1 1 auto;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 16px;
  min-height: 0;
}

.detail-badge-row {
  display: flex;
  gap: 8px;
}

.priority-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
}

.priority-pill--high {
  background: #fff7ed;
  color: #d97706;
}

.priority-pill--medium {
  background: #eef2ff;
  color: #4f46e5;
}

.priority-pill--status {
  background: #eff6ff;
  color: #2563eb;
}

.detail-main-title {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  color: #0f172a;
}

.detail-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.detail-section-label {
  margin: 0 0 4px;
  font-size: 12px;
  color: #64748b;
}

.detail-meta-value {
  margin: 0;
  font-size: 15px;
  color: #0f172a;
  font-weight: 600;
}

.detail-meta-value--inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.detail-meta-icon {
  flex-shrink: 0;
}

.detail-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quote-panel {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  gap: 8px;
  background: #f8fafc;
}

.quote-panel-text {
  margin: 0;
  font-size: 13px;
  color: #334155;
  line-height: 1.55;
}

.source-meeting-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
}

.sync-panel {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  background: #ffffff;
}

.sync-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 0;
}

.sync-key {
  font-size: 12px;
  color: #64748b;
}

.sync-tag,
.sync-value,
.sync-muted,
.sync-ticket-link {
  font-size: 13px;
  color: #0f172a;
}

.sync-ticket-link {
  border: none;
  background: transparent;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.sync-muted {
  color: #94a3b8;
}

.detail-footer-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.detail-footer-primary {
  flex: 1;
}

@media (max-width: 1200px) {
  .ac-layout--sidebar-open {
    grid-template-columns: 1fr;
  }
}

</style>
