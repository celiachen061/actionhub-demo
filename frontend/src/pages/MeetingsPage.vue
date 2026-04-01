<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h1 class="page-title">{{ t({ zh: '会议列表', en: 'Meetings' }) }}<span class="page-phase-tag">MVP</span></h1>
        <p class="page-subtitle">{{ t({ zh: '按项目、会议类型、状态快速筛选会议，并查看概要预览。', en: 'Filter meetings by project, type, and status with a quick summary preview.' }) }}</p>
      </div>
    </header>

    <!-- AI hint banner -->
    <div v-if="bannerVisible" class="meetings-banner ai-banner ai-sheen">
      <div class="meetings-banner-main">
        <span class="meetings-banner-text">
          {{ t({ zh: 'AI 发现 3 场会议有未处理行动项，1 场会议的 Jira 同步中断', en: 'AI found 3 meetings with open action items and 1 interrupted Jira sync.' }) }}
        </span>
      </div>
      <div class="meetings-banner-actions">
        <button class="banner-link-button" @click="applyAiFilter">{{ t({ zh: '快速筛选', en: 'Quick Filter' }) }}</button>
        <button class="banner-link-button muted" @click="dismissBanner">{{ t({ zh: '忽略', en: 'Dismiss' }) }}</button>
      </div>
    </div>

    <!-- Filters -->
    <div class="toolbar-row meetings-filters">
      <div class="meetings-search">
        <Search :size="14" color="#94a3b8" :stroke-width="2" />
        <input
          v-model="searchText"
          type="text"
          :placeholder="t({ zh: '搜索标题、主持人...', en: 'Search title, host...' })"
        />
      </div>
      <select v-model="projectFilter" class="select-box">
        <option value="all">{{ t({ zh: '项目：全部', en: 'Project: All' }) }}</option>
        <option v-for="g in appStore.accessibleProgramGroups" :key="g.id" :value="g.label.en">{{ t(g.label) }}</option>
      </select>
      <select v-model="typeFilter" class="select-box">
        <option value="all">{{ t({ zh: '类型：全部', en: 'Type: All' }) }}</option>
        <option value="项目周会">{{ t({ zh: '项目周会', en: 'Project Weekly' }) }}</option>
        <option value="技术评审会">{{ t({ zh: '技术评审会', en: 'Technical Review' }) }}</option>
        <option value="风险同步会">{{ t({ zh: '风险同步会', en: 'Risk Sync' }) }}</option>
      </select>
      <select v-model="statusFilter" class="select-box">
        <option value="all">{{ t({ zh: '状态：全部', en: 'Status: All' }) }}</option>
        <option value="待确认">{{ t({ zh: '待确认纪要', en: 'Needs Review' }) }}</option>
        <option value="已完成">{{ t({ zh: '已完成', en: 'Done' }) }}</option>
      </select>
    </div>

    <section class="two-column" style="grid-template-columns: minmax(0,1fr) 320px;">
      <!-- Meeting table -->
      <article class="surface table-card meetings-table-card">
        <div class="table-wrap">
          <table class="meetings-table">
            <thead>
              <tr>
                <th>{{ t({ zh: '会议详情', en: 'Meeting details' }) }}</th>
                <th>{{ t({ zh: '主持人与参会', en: 'Host & participants' }) }}</th>
                <th>{{ t({ zh: '状态', en: 'Status' }) }}</th>
                <th>{{ t({ zh: 'AI 洞察', en: 'AI insights' }) }}</th>
                <th>{{ t({ zh: '来源', en: 'Source' }) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="meeting in filteredMeetings"
                :key="meeting.id"
                class="meeting-row"
                :class="{ active: previewMeeting?.id === meeting.id }"
                @mouseenter="setHoveredMeeting(meeting.id)"
              >
                <td class="meeting-details-td">
                  <div class="meeting-cell-stack">
                    <button class="table-link-button meeting-title-btn" type="button" @click.stop="openMeeting(meeting.id)">
                      {{ t(meeting.title) }}
                    </button>
                    <div class="meeting-meta-row">
                      <Calendar class="meeting-meta-icon" :size="14" color="#94a3b8" :stroke-width="2" aria-hidden="true" />
                      <span class="meeting-schedule-text">{{ scheduleDisplay(meeting) }}</span>
                      <span class="meeting-type-pill">{{ t(meeting.type) }}</span>
                    </div>
                  </div>
                </td>
                <td
                  class="participant-col"
                  @mouseenter="onParticipantEnter(meeting.id, $event)"
                  @mouseleave="onParticipantLeave"
                >
                  <div class="participant-stack">
                    <span
                      v-for="(initial, idx) in participantDisplay(meeting).shown"
                      :key="`${meeting.id}-p-${idx}`"
                      class="participant-avatar"
                      :title="initial"
                    >{{ initial }}</span>
                    <span v-if="participantDisplay(meeting).overflow > 0" class="participant-overflow">+{{ participantDisplay(meeting).overflow }}</span>
                  </div>
                </td>
                <td>
                  <span class="meeting-status-pill" :class="statusPillClass(resolveRowStatus(meeting))">
                    {{ statusPillLabel(resolveRowStatus(meeting)) }}
                  </span>
                </td>
                <td class="ai-insight-col">
                  <div class="ai-insight-cell" :title="`${aiActionsLine(meeting)} · ${aiConfLine(meeting)}`">
                    <div class="ai-insight-copy">
                      <p class="ai-insight-primary">{{ aiActionsLine(meeting) }}</p>
                      <p class="ai-insight-secondary">{{ aiConfLine(meeting) }}</p>
                    </div>
                  </div>
                </td>
                <td class="source-col">
                  <span class="source-text">{{ meetingSourceText(meeting.source) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <aside
          v-if="participantPanelMeeting"
          class="participant-floating-panel"
          :style="participantPanelStyle"
          @mouseenter="onPanelEnter"
          @mouseleave="onPanelLeave"
        >
          <div class="participant-popover-section">
            <p class="participant-popover-label">{{ t({ zh: '主持人', en: 'Host' }) }}</p>
            <div v-if="participantPanelMeeting.host" class="participant-row">
              <span class="participant-row-avatar">{{ participantPanelMeeting.host.avatar }}</span>
              <div class="participant-row-meta">
                <p class="participant-row-name">{{ t(participantPanelMeeting.host.name) }}</p>
                <p class="participant-row-sub">{{ t(participantPanelMeeting.host.title) }} · {{ t(participantPanelMeeting.host.group) }}</p>
              </div>
            </div>
          </div>
          <div class="participant-popover-section">
            <p class="participant-popover-label">{{ t({ zh: '参会者', en: 'Participants' }) }}</p>
            <div
              v-for="(person, idx) in (participantPanelMeeting.participants ?? [])"
              :key="`${participantPanelMeeting.id}-all-${idx}`"
              class="participant-row"
            >
              <span class="participant-row-avatar">{{ person.avatar }}</span>
              <div class="participant-row-meta">
                <p class="participant-row-name">{{ t(person.name) }}</p>
                <p class="participant-row-sub">{{ t(person.title) }} · {{ t(person.group) }}</p>
              </div>
            </div>
          </div>
        </aside>
      </article>

      <!-- Meeting Preview -->
      <article class="surface section-card">
        <div class="card-header">
          <h3 class="card-title">{{ t({ zh: '会议预览', en: 'Meeting Preview' }) }}</h3>
          <button class="ghost-button" style="font-size:12px;height:28px;padding:0 10px;" @click="dismissPreview">✕</button>
        </div>
        <div v-if="previewMeeting" class="card-body">
          <div>
            <p class="list-title">{{ t(previewMeeting.title) }}</p>
            <p class="list-meta" style="margin-top:4px;">{{ previewMeta }}</p>
          </div>
          <div style="margin-top:4px;">
            <p style="font-size:13px;color:#475569;line-height:1.5;">{{ previewSummary }}</p>
          </div>
          <div class="toolbar-row" style="margin-top:4px;">
            <div style="display:flex;gap:16px;">
              <div>
                <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">{{ t({ zh: '行动项', en: 'Action Items' }) }}</div>
                <div style="font-size:22px;font-weight:700;color:#0f172a;">3</div>
              </div>
              <div>
                <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">{{ t({ zh: '风险', en: 'Risks' }) }}</div>
                <div style="font-size:22px;font-weight:700;color:#dc2626;">1</div>
              </div>
            </div>
          </div>
          <button class="secondary-button" style="margin-top:4px;" @click="openMeeting(previewMeeting.id)">
            {{ t({ zh: '查看完整详情 →', en: 'View Full Detail →' }) }}
          </button>
        </div>
        <div v-else class="card-body meetings-preview-empty">
          <p>{{ t({ zh: '悬浮左侧某一行可查看会议预览', en: 'Hover a row on the left to preview meeting details' }) }}</p>
        </div>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
import { Calendar, Search } from '../components/fakeLucide'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { localize, meetings, meetingSummary } from '../services/mockData'
import { useAppStore } from '../stores/app'
import { useUiStore } from '../stores/ui'
import type { LocalizedText, MeetingSummary } from '../types/app'

const appStore = useAppStore()
const uiStore = useUiStore()
const router = useRouter()
const t = (text: LocalizedText) => localize(appStore.language, text)

const bannerVisible = ref(true)
const searchText = ref('')
const projectFilter = ref('all')
const typeFilter = ref('all')
const statusFilter = ref('all')
const hoveredMeetingId = ref<string | null>(meetings[0]?.id ?? null)
const participantPanelMeetingId = ref<string | null>(null)
const participantPanelPos = ref({ top: 52, left: 360 })
let participantPanelHideTimer: ReturnType<typeof setTimeout> | null = null

const filteredMeetings = computed(() =>
  meetings.filter((meeting) => {
    const searchMatch =
      !searchText.value ||
      t(meeting.title).toLowerCase().includes(searchText.value.toLowerCase())
    const projectMatch =
      projectFilter.value === 'all' || meeting.programGroup === projectFilter.value
    const typeMatch = typeFilter.value === 'all' || t(meeting.type) === typeFilter.value || meeting.type.zh === typeFilter.value
    const statusMatch =
      statusFilter.value === 'all' ||
      (statusFilter.value === '待确认' && (meeting.summaryStatus?.zh.includes('待') || meeting.status.zh.includes('待'))) ||
      (statusFilter.value === '已完成' && (meeting.summaryStatus?.zh.includes('已') || meeting.status.zh.includes('已')))
    return searchMatch && projectMatch && typeMatch && statusMatch
  }),
)

const previewMeeting = computed(() =>
  filteredMeetings.value.find((meeting) => meeting.id === hoveredMeetingId.value) ?? null,
)

const participantPanelMeeting = computed(() =>
  filteredMeetings.value.find((meeting) => meeting.id === participantPanelMeetingId.value) ?? null,
)

const participantPanelStyle = computed(() => ({
  top: `${participantPanelPos.value.top}px`,
  left: `${participantPanelPos.value.left}px`,
}))

const scheduleDisplay = (m: MeetingSummary) => (m.scheduleLabel ? t(m.scheduleLabel) : t(m.time))

const resolveRowStatus = (m: MeetingSummary): 'ai_draft' | 'synced' | 'pending_review' => {
  if (m.meetingRowStatus) return m.meetingRowStatus
  const s = m.summaryStatus?.en ?? ''
  if (s === 'Pending') return 'ai_draft'
  if (s === 'Done' || s === 'Sent') return 'synced'
  return 'pending_review'
}

const statusPillClass = (kind: ReturnType<typeof resolveRowStatus>) => {
  if (kind === 'ai_draft') return 'meeting-status-pill--draft'
  if (kind === 'synced') return 'meeting-status-pill--synced'
  return 'meeting-status-pill--pending'
}

const statusPillLabel = (kind: ReturnType<typeof resolveRowStatus>) => {
  if (kind === 'ai_draft') return t({ zh: 'AI 草稿', en: 'AI Draft' })
  if (kind === 'synced') return t({ zh: '已同步', en: 'Synced' })
  return t({ zh: '待确认', en: 'Pending' })
}

const participantDisplay = (m: MeetingSummary) => {
  if (m.participants?.length) {
    const shown = m.participants.slice(0, 3).map((p) => p.avatar)
    const overflow = Math.max(0, m.participants.length - shown.length)
    return { shown, overflow }
  }
  if (m.participantInitials?.length) {
    const shown = m.participantInitials.slice(0, 3)
    const overflow = Math.max(0, m.participantInitials.length - shown.length) + (m.participantOverflow ?? 0)
    return { shown, overflow }
  }
  const n = m.attendees ?? 0
  if (n <= 0) return { shown: [] as string[], overflow: 0 }
  return { shown: [String(n)], overflow: 0 }
}

const insightFor = (m: MeetingSummary) => m.aiInsight ?? { actionCount: 0, confidencePct: 0 }

const aiActionsLine = (m: MeetingSummary) => {
  const n = insightFor(m).actionCount
  return appStore.language === 'zh' ? `${n} 项行动` : `${n} Actions`
}

const aiConfLine = (m: MeetingSummary) => {
  const pct = insightFor(m).confidencePct
  return appStore.language === 'zh' ? `置信度 ${pct}%` : `Conf ${pct}%`
}

const previewMeta = computed(() => {
  const current = previewMeeting.value
  if (!current) return ''
  return `${t(current.time)} · ${current.attendees ?? 0} ${appStore.language === 'zh' ? '人参会' : 'attendees'} · ${meetingSourceText(current.source)}`
})

const previewSummary = computed(() => {
  if (!previewMeeting.value) return ''
  if (previewMeeting.value.id === 'matter-review') {
    return appStore.language === 'zh'
      ? '1 个 SDK 版本依赖需要在本周内明确，当前有 1 条行动项缺少最终 owner。'
      : 'One SDK dependency needs clarification this week, and one action item is still missing a final owner.'
  }
  if (previewMeeting.value.id === 'risk-sync') {
    return appStore.language === 'zh'
      ? '风险同步会议确认 OTA 仍需内部灰度，邮件纪要已发出。'
      : 'The risk sync confirmed OTA remains internal-only, and the summary email has been sent.'
  }
  return t(meetingSummary.summary)
})

const applyAiFilter = () => {
  statusFilter.value = '待确认'
  uiStore.pushToast(
    t({ zh: '已应用 AI 快速筛选', en: 'AI quick filter applied' }),
    t({ zh: '当前只显示需要优先跟进的会议。', en: 'Only meetings that need follow-up are shown now.' }),
    'success',
  )
}

const dismissBanner = () => {
  bannerVisible.value = false
  uiStore.pushToast(
    t({ zh: '已忽略 AI 提醒', en: 'AI reminder dismissed' }),
    t({ zh: '你仍可以在页面中继续手动筛选。', en: 'You can still continue filtering manually on this page.' }),
  )
}

const dismissPreview = () => {
  hoveredMeetingId.value = null
}

const openMeeting = (id: string) => {
  router.push(`/meeting/${id}`)
}

const setHoveredMeeting = (id: string) => {
  hoveredMeetingId.value = id
}

const clearParticipantHideTimer = () => {
  if (participantPanelHideTimer) {
    clearTimeout(participantPanelHideTimer)
    participantPanelHideTimer = null
  }
}

const onParticipantEnter = (id: string, evt: MouseEvent) => {
  clearParticipantHideTimer()
  participantPanelMeetingId.value = id

  const td = evt.currentTarget as HTMLElement | null
  const tableCard = td?.closest('.meetings-table-card') as HTMLElement | null
  if (!td || !tableCard) return

  const tdRect = td.getBoundingClientRect()
  const cardRect = tableCard.getBoundingClientRect()
  const panelWidth = 320
  const gap = 8

  const desiredLeft = tdRect.right - cardRect.left + gap
  const maxLeft = Math.max(8, cardRect.width - panelWidth - 8)
  const safeLeft = Math.min(desiredLeft, maxLeft)
  const safeTop = tdRect.top - cardRect.top - 4

  participantPanelPos.value = {
    top: Math.max(8, safeTop),
    left: Math.max(8, safeLeft),
  }
}

const onParticipantLeave = () => {
  clearParticipantHideTimer()
  participantPanelHideTimer = setTimeout(() => {
    participantPanelMeetingId.value = null
  }, 120)
}

const onPanelEnter = () => {
  clearParticipantHideTimer()
}

const onPanelLeave = () => {
  participantPanelMeetingId.value = null
}

const meetingSourceText = (source?: string) => {
  if (!source || source === 'Hybrid') return t({ zh: '混合来源', en: 'Hybrid' })
  if (source === 'Turnout') return t({ zh: '线下终端', en: 'Turnout' })
  return source
}

watch(filteredMeetings, (list) => {
  if (!list.length) {
    hoveredMeetingId.value = null
    return
  }
  if (!list.some((m) => m.id === hoveredMeetingId.value)) {
    hoveredMeetingId.value = list[0].id
  }
  if (!list.some((m) => m.id === participantPanelMeetingId.value)) {
    participantPanelMeetingId.value = null
  }
})
</script>

<style scoped>
.meetings-filters {
  gap: 16px;
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
}

.meetings-table {
  table-layout: auto;
}

.meetings-table-card {
  position: relative;
  overflow: visible;
}

.meetings-table th,
.meetings-table td {
  white-space: normal;
  vertical-align: middle;
}

.ai-insight-col,
.source-col {
  white-space: nowrap;
}

.source-text {
  font-size: 13px;
  color: #334155;
}

.meeting-details-td {
  min-width: 220px;
  max-width: 380px;
}

.meeting-cell-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}

.meeting-title-btn {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  text-align: left;
}

.meeting-meta-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  min-width: 0;
}

.meeting-meta-icon {
  flex-shrink: 0;
}

.meeting-schedule-text {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
}

.meeting-type-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #475569;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
}

.participant-stack {
  display: flex;
  align-items: center;
}

.participant-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-left: -8px;
  background: #f1f5f9;
  border: 2px solid #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  flex-shrink: 0;
}

.participant-avatar:first-child {
  margin-left: 0;
}

.participant-overflow {
  margin-left: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.participant-floating-panel {
  position: absolute;
  width: 320px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
  z-index: 20;
}

.participant-popover-section + .participant-popover-section {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
}

.participant-popover-label {
  margin: 0 0 6px;
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.participant-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.participant-row-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #eef2ff;
  color: #4338ca;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}

.participant-row-meta {
  min-width: 0;
}

.participant-row-name {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.25;
}

.participant-row-sub {
  margin: 1px 0 0;
  font-size: 11px;
  color: #64748b;
  line-height: 1.25;
}

.meeting-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.meeting-status-pill--draft {
  border: 1px solid #c4b5fd;
  color: #5b21b6;
  background: #f5f3ff;
}

.meeting-status-pill--synced {
  border: 1px solid #6ee7b7;
  color: #047857;
  background: #ecfdf5;
}

.meeting-status-pill--pending {
  border: 1px solid #fcd34d;
  color: #b45309;
  background: #fffbeb;
}

.ai-insight-cell {
  display: flex;
  align-items: flex-start;
  gap: 0;
  min-width: 0;
  white-space: nowrap;
}

.ai-insight-copy {
  min-width: 0;
}

.ai-insight-primary {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  line-height: 1.35;
}

.ai-insight-secondary {
  margin: 2px 0 0;
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.35;
}

.meeting-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.meeting-row:hover {
  background: #fafafa;
}

.meeting-row.active {
  background: #f8fafc;
}

.table-link-button {
  border: none;
  background: transparent;
  padding: 0;
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: color 0.18s ease;
}

.table-link-button:hover {
  color: #2563eb;
}

.meetings-preview-empty {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 13px;
}
</style>
