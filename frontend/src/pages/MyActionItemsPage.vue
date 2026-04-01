<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h1 class="page-title">{{ t({ zh: '我的行动项', en: 'My Action Items' }) }}<span class="page-phase-tag">P1</span></h1>
        <p class="page-subtitle">{{ t({ zh: '以个人执行效率为中心，快速定位待办、逾期与待确认事项。', en: 'A personal execution workspace for pending, overdue, and review-required items.' }) }}</p>
      </div>
    </header>

    <section class="metric-grid" style="grid-template-columns: repeat(3, minmax(0, 1fr));">
      <article
        v-for="metric in myActionMetrics"
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

    <div class="ai-banner ai-sheen">
      <span class="banner-text">
        {{ t({ zh: 'AI 智能提醒：当前有 3 条已逾期、多条待确认或阻塞项，建议按优先级与截止日期排序处理。', en: 'AI Reminder: 3 overdue items plus several needs-review or blocked—prioritize by due date and severity.' }) }}
      </span>
      <button type="button" class="banner-link-button" @click="statusFilter = 'overdue'">{{ t({ zh: '立即查看 →', en: 'View Now →' }) }}</button>
    </div>

    <div class="toolbar-row meetings-filters">
      <div class="meetings-search">
        <Search :size="14" color="#94a3b8" :stroke-width="2" />
        <input
          v-model="searchText"
          type="search"
          :placeholder="t({ zh: '搜索标题、会议、负责人…', en: 'Search title, meeting, assignee…' })"
        />
      </div>
      <select v-model="projectFilter" class="select-box">
        <option value="all">{{ t({ zh: '项目：全部', en: 'Project: All' }) }}</option>
        <option v-for="g in appStore.accessibleProgramGroups" :key="g.id" :value="g.label.en">{{ t(g.label) }}</option>
      </select>
      <select v-model="statusFilter" class="select-box">
        <option value="all">{{ t({ zh: '状态：全部', en: 'Status: All' }) }}</option>
        <option value="pending">{{ t({ zh: '待处理', en: 'Pending' }) }}</option>
        <option value="overdue">{{ t({ zh: '已逾期', en: 'Overdue' }) }}</option>
        <option value="review">{{ t({ zh: '待确认', en: 'Needs Review' }) }}</option>
      </select>
    </div>

    <section class="actions-layout" :class="{ 'actions-layout--sidebar-open': detailPanelOpen }">
      <article class="surface table-card actions-table-card">
        <div class="table-wrap">
          <table class="actions-table" :class="{ 'actions-table--compact': detailPanelOpen }">
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
                v-for="item in filteredItems"
                :key="item.id"
                class="action-table-row"
                :class="{ active: detailPanelOpen && selectedItemId === item.id }"
              >
                <td class="td-clip">
                  <button
                    type="button"
                    class="table-link-button action-title-btn action-title-inner"
                    :title="t(item.title)"
                    @click.stop="openDetailPanel(item.id)"
                  >
                    <span
                      v-if="item.priority === 'high'"
                      class="priority-focus-icon"
                      :title="t({ zh: '高优先级 · 重点关注', en: 'High priority · Focus' })"
                      aria-hidden="true"
                    >
                      <Star :size="14" color="#d97706" :stroke-width="2" />
                    </span>
                    <span class="action-title-text cell-ellipsis">{{ t(item.title) }}</span>
                  </button>
                </td>
                <td class="assignee-cell td-clip"><span class="cell-ellipsis" :title="item.assignee">{{ item.assignee }}</span></td>
                <td class="td-clip"><span class="cell-ellipsis" :title="t(item.meeting)">{{ t(item.meeting) }}</span></td>
                <td class="td-clip td-nowrap" :class="deadlineClass(item)">{{ item.deadline }}</td>
                <td class="td-clip td-nowrap">
                  <span class="status-badge badge-ellipsis" :class="statusBadgeClass(item)">{{ t(item.status) }}</span>
                </td>
                <td class="td-clip td-nowrap">
                  <span class="status-badge default badge-ellipsis">{{ t(item.routing) }}</span>
                </td>
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
        <div v-if="previewItem" class="card-body detail-drawer-body">
          <div class="detail-badge-row">
            <span v-if="previewItem.priority === 'high'" class="priority-pill priority-pill--high">
              {{ t({ zh: '高优先级', en: 'High priority' }) }}
            </span>
            <span v-else class="priority-pill priority-pill--medium">
              {{ t({ zh: '普通', en: 'Normal' }) }}
            </span>
            <span class="priority-pill priority-pill--status">{{ t(previewItem.executionBadge) }}</span>
          </div>

          <h4 class="detail-main-title">{{ t(previewItem.title) }}</h4>

          <div class="detail-meta-grid">
            <div class="detail-meta-cell">
              <p class="detail-section-label">{{ t({ zh: '负责人', en: 'Assignee' }) }}</p>
              <p class="detail-meta-value">{{ previewItem.assignee }}</p>
            </div>
            <div class="detail-meta-cell">
              <p class="detail-section-label">{{ t({ zh: '截止日期', en: 'Due date' }) }}</p>
              <p class="detail-meta-value detail-meta-value--inline">
                <Calendar :size="14" color="#64748b" :stroke-width="2" class="detail-meta-icon" aria-hidden="true" />
                {{ previewItem.deadline }}
              </p>
            </div>
          </div>

          <div class="detail-block">
            <p class="detail-section-label">{{ t({ zh: '来源上下文', en: 'Source context' }) }}</p>
            <div class="quote-panel">
              <MessageSquare :size="16" color="#94a3b8" :stroke-width="2" class="quote-panel-icon" aria-hidden="true" />
              <p class="quote-panel-text">「{{ t(previewItem.quote) }}」</p>
            </div>
            <RouterLink
              class="source-meeting-link"
              :to="`/meeting/${previewItem.meetingId}`"
            >
              <span>{{ t({ zh: '来源', en: 'From' }) }}: {{ t(previewItem.meeting) }}</span>
              <ExternalLink :size="14" color="#2563eb" :stroke-width="2" aria-hidden="true" />
            </RouterLink>
          </div>

          <div class="detail-block">
            <p class="detail-section-label">{{ t({ zh: '同步详情', en: 'Sync details' }) }}</p>
            <div class="sync-panel">
              <div class="sync-row">
                <span class="sync-key">{{ t({ zh: '目标系统', en: 'Target system' }) }}</span>
                <span class="sync-tag">{{ t(previewItem.routing) }}</span>
              </div>
              <div v-if="previewItem.jiraTicketKey" class="sync-row">
                <span class="sync-key">{{ t({ zh: '工单号', en: 'Ticket ID' }) }}</span>
                <button type="button" class="sync-ticket-link" @click="openJira(previewItem)">
                  {{ previewItem.jiraTicketKey }}
                </button>
              </div>
              <div v-else class="sync-row">
                <span class="sync-key">{{ t({ zh: '工单号', en: 'Ticket ID' }) }}</span>
                <span class="sync-muted">{{ t({ zh: '未创建', en: 'Not created' }) }}</span>
              </div>
              <div class="sync-row">
                <span class="sync-key">{{ t({ zh: '最近同步', en: 'Last synced' }) }}</span>
                <span class="sync-value">{{ previewItem.lastSynced ? t(previewItem.lastSynced) : '—' }}</span>
              </div>
            </div>
          </div>

          <div class="detail-footer-actions">
            <button type="button" class="primary-button detail-footer-primary" @click="updateItemStatus">
              {{ t({ zh: '更新状态', en: 'Update status' }) }}
            </button>
            <button
              v-if="previewItem.jiraTicketKey"
              type="button"
              class="ghost-button detail-footer-secondary"
              @click="openJira(previewItem)"
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
  </section>
</template>

<script setup lang="ts">
import { Calendar, ExternalLink, MessageSquare, Search, Star } from '../components/fakeLucide'
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import { localize, myActionItems, myActionMetrics } from '../services/mockData'
import { useAppStore } from '../stores/app'
import { useUiStore } from '../stores/ui'
import type { LocalizedText, MyActionListItem } from '../types/app'

const appStore = useAppStore()
const uiStore = useUiStore()
const t = (text: LocalizedText) => localize(appStore.language, text)

const searchText = ref('')
const projectFilter = ref('all')
const statusFilter = ref('all')
/** 右侧详情是否展开；关闭后表格占满宽度 */
const detailPanelOpen = ref(false)
/** 仅点击标题切换；悬停其他行不改变详情 */
const selectedItemId = ref<string | null>(null)

const filteredItems = computed(() =>
  myActionItems.filter((item) => {
    const q = searchText.value.trim().toLowerCase()
    const searchMatch =
      !q
      || t(item.title).toLowerCase().includes(q)
      || t(item.meeting).toLowerCase().includes(q)
      || item.assignee.toLowerCase().includes(q)
    const projectMatch =
      projectFilter.value === 'all' || item.programGroup === projectFilter.value
    const st = t(item.status)
    const statusMatch =
      statusFilter.value === 'all'
      || (statusFilter.value === 'pending' && !st.includes('逾期') && !st.includes('Overdue') && !st.includes('确认') && !st.includes('Review'))
      || (statusFilter.value === 'overdue' && (st.includes('逾期') || st.includes('Overdue')))
      || (statusFilter.value === 'review' && (st.includes('确认') || st.includes('Review')))
    return searchMatch && projectMatch && statusMatch
  }),
)

const previewItem = computed(() =>
  filteredItems.value.find((item) => item.id === selectedItemId.value) ?? null,
)

const deadlineClass = (item: MyActionListItem) => {
  const st = t(item.status)
  if (st.includes('逾期') || st.includes('Overdue'))
    return 'deadline-overdue'
  return ''
}

const statusBadgeClass = (item: MyActionListItem) => {
  const st = t(item.status)
  if (st.includes('逾期') || st.includes('Overdue'))
    return 'danger'
  if (st.includes('完成') || st.includes('Done'))
    return 'success'
  if (st.includes('确认') || st.includes('Review'))
    return 'warning'
  return 'default'
}

const openDetailPanel = (id: string) => {
  detailPanelOpen.value = true
  selectedItemId.value = id
}

const closeDetailPanel = () => {
  detailPanelOpen.value = false
  selectedItemId.value = null
}

const openJira = (item: MyActionListItem) => {
  if (!item.jiraTicketKey)
    return
  uiStore.pushToast(
    t({ zh: '在 Jira 中打开', en: 'Open in Jira' }),
    `${item.jiraTicketKey} · ${t({ zh: '演示环境未配置真实 Jira 链接。', en: 'Demo: no real Jira URL configured.' })}`,
    'default',
  )
}

const updateItemStatus = () => {
  uiStore.pushToast(
    t({ zh: '状态已更新', en: 'Status updated' }),
    t({ zh: '演示：已记录本地状态变更。', en: 'Demo: local status change recorded.' }),
    'success',
  )
}

watch(
  [filteredItems, detailPanelOpen],
  () => {
    const list = filteredItems.value
    if (!list.length) {
      selectedItemId.value = null
      return
    }
    if (!detailPanelOpen.value || !selectedItemId.value)
      return
    if (!list.some((i) => i.id === selectedItemId.value))
      selectedItemId.value = list[0].id
  },
  { immediate: true },
)
</script>

<style scoped>
.action-center-kpi {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  width: 100%;
  border: 1px solid #e2e8f0;
  text-align: left;
  font: inherit;
  color: inherit;
  border-radius: 14px;
  background: #ffffff;
}

.banner-link-button {
  border: none;
  background: transparent;
  color: #d97706;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

.meetings-filters {
  gap: 16px;
  flex-wrap: wrap;
}

.meetings-search {
  width: 280px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
}

.meetings-search input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 13px;
}

.actions-layout {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
}

.actions-layout--sidebar-open {
  grid-template-columns: minmax(0, 1fr) 340px;
}

.actions-table {
  table-layout: auto;
  width: 100%;
}

.actions-table th,
.actions-table td {
  white-space: normal;
  vertical-align: middle;
}

.actions-table--compact {
  table-layout: fixed;
}

.actions-table--compact th:nth-child(1),
.actions-table--compact td:nth-child(1) {
  width: 30%;
}

.actions-table--compact th:nth-child(2),
.actions-table--compact td:nth-child(2) {
  width: 11%;
}

.actions-table--compact th:nth-child(3),
.actions-table--compact td:nth-child(3) {
  width: 22%;
}

.actions-table--compact th:nth-child(4),
.actions-table--compact td:nth-child(4) {
  width: 11%;
}

.actions-table--compact th:nth-child(5),
.actions-table--compact td:nth-child(5) {
  width: 13%;
}

.actions-table--compact th:nth-child(6),
.actions-table--compact td:nth-child(6) {
  width: 13%;
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

button.cell-ellipsis {
  width: 100%;
  max-width: 100%;
}

.badge-ellipsis {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.action-table-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-table-row:hover {
  background: #fafafa;
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
  transition: color 0.18s ease;
}

.table-link-button:hover {
  color: #2563eb;
}

.action-title-inner {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.priority-focus-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  line-height: 0;
}

.action-title-text.cell-ellipsis {
  flex: 1;
  min-width: 0;
}

.assignee-cell {
  color: #475569;
  font-size: 13px;
}

.deadline-overdue {
  color: #dc2626;
  font-weight: 600;
}

.detail-drawer {
  display: flex;
  flex-direction: column;
  min-height: 420px;
}

.detail-drawer-head {
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
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 16px;
}

.detail-badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.priority-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.priority-pill--high {
  background: #ffedd5;
  color: #c2410c;
}

.priority-pill--medium {
  background: #f1f5f9;
  color: #475569;
}

.priority-pill--status {
  background: #e0f2fe;
  color: #0369a1;
  text-transform: none;
  font-weight: 600;
}

.detail-main-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.35;
}

.detail-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
}

.detail-section-label {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-meta-value {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.detail-meta-value--inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.detail-block {
  margin-top: 2px;
}

.quote-panel {
  position: relative;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
}

.quote-panel-icon {
  position: absolute;
  left: 12px;
  top: 12px;
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
  margin-top: 10px;
  font-size: 12.5px;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
  cursor: pointer;
}

.source-meeting-link:hover {
  text-decoration: underline;
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
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 12.5px;
}

.sync-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.sync-key {
  color: #64748b;
  flex-shrink: 0;
}

.sync-tag {
  padding: 2px 8px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
  font-size: 11px;
}

.sync-ticket-link {
  border: none;
  background: none;
  padding: 0;
  color: #2563eb;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.sync-ticket-link:hover {
  color: #1d4ed8;
}

.sync-muted {
  color: #94a3b8;
  font-style: italic;
}

.sync-value {
  color: #334155;
  font-weight: 500;
}

.detail-footer-actions {
  margin-top: auto;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-footer-primary {
  width: 100%;
  justify-content: center;
  cursor: pointer;
}

.detail-footer-secondary {
  width: 100%;
  justify-content: center;
  border: 1px solid #e2e8f0;
  cursor: pointer;
}

.detail-empty {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 13px;
  text-align: center;
  padding: 16px;
}
</style>
