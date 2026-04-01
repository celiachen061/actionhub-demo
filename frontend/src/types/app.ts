export type Language = 'zh' | 'en'

export interface LocalizedText {
  zh: string
  en: string
}

export interface NavItem {
  label: LocalizedText
  route: string
  icon?: string
}

export type ActionCenterStatusFilter =
  | 'all'
  | 'Overdue'
  | 'Missing Fields'
  | 'In Progress'
  | 'Carry-over'

export interface MetricCard {
  label: LocalizedText
  value: string
  hint?: LocalizedText
  tone?: 'default' | 'warning' | 'success' | 'danger'
  /** 行动中心：点击 KPI 时同步表格状态筛选项 */
  actionCenterStatus?: ActionCenterStatusFilter
}

/** 会议列表末尾「来源 / 同步目标」平台角标 */
export interface MeetingSyncTarget {
  letter: string
  active: boolean
  /** 可选：无障碍说明 */
  label?: LocalizedText
}

export interface MeetingParticipantProfile {
  avatar: string
  name: LocalizedText
  title: LocalizedText
  group: LocalizedText
}

export interface MeetingSummary {
  id: string
  title: LocalizedText
  time: LocalizedText
  type: LocalizedText
  status: LocalizedText
  attendees?: number
  source?: string
  summaryStatus?: LocalizedText
  /** 项目组（与 appProgramGroups.label.en 一致，用于筛选） */
  programGroup?: string
  /** 列表首列展示的日期时间（完整字符串，与时区无关展示） */
  scheduleLabel?: LocalizedText
  /** 参会人头像缩写，最多展示前若干个，其余用 participantOverflow */
  participantInitials?: string[]
  participantOverflow?: number
  /** 列表「状态」列徽章样式 */
  meetingRowStatus?: 'ai_draft' | 'synced' | 'pending_review'
  aiInsight?: { actionCount: number; confidencePct: number }
  syncTargets?: MeetingSyncTarget[]
  host?: MeetingParticipantProfile
  participants?: MeetingParticipantProfile[]
}

export interface TranscriptEntry {
  id: string
  speaker: string
  time: string
  content: LocalizedText
  tone?: 'default' | 'highlight'
}

export interface ActionItem {
  id: string
  title: LocalizedText
  owner: string
  deadline: string
  routing: 'Jira' | 'EHR' | 'Email only'
  status: 'AI Draft' | 'Needs Review' | 'Confirmed'
  confidence: string
}

/** 「我的行动项」列表行 + 右侧详情抽屉 */
export interface MyActionListItem {
  id: string
  title: LocalizedText
  meeting: LocalizedText
  meetingId: string
  programGroup: string
  assignee: string
  deadline: string
  status: LocalizedText
  routing: LocalizedText
  priority: 'high' | 'medium' | 'low'
  executionBadge: LocalizedText
  quote: LocalizedText
  jiraTicketKey: string | null
  lastSynced: LocalizedText | null
}

export interface InsightCard {
  title: LocalizedText
  body: LocalizedText
  tone?: 'default' | 'warning' | 'success'
}

export interface BadcaseItem {
  id: string
  title: LocalizedText
  type: LocalizedText
  severity: 'P0' | 'P1' | 'P2'
  status: LocalizedText
  summary: LocalizedText
}

export interface IntegrationCard {
  id: string
  name: string
  description: LocalizedText
  status: LocalizedText
  color: string
  icon: string
}

export interface MeetingRoomTerminal {
  id: string
  name: LocalizedText
  description: LocalizedText
  status: 'online' | 'offline'
  ip: string
  firmware: string
  lastPing: LocalizedText
}

export interface SyncLog {
  title: LocalizedText
  detail: LocalizedText
  type: 'success' | 'error' | 'info'
}

/** 项目历史页：单条时间轴节点（一场会议 + 要点） */
export interface ProjectHistoryTimelineEntry {
  meetingId: string
  /** ISO YYYY-MM-DD，用于排序（新→旧） */
  date: string
  title: LocalizedText
  type: LocalizedText
  summary: LocalizedText
  actions: string
  aiStatus: LocalizedText
  highlights: LocalizedText[]
}

export interface ProjectCrossMeetingAlert {
  id: string
  tone: 'warning' | 'neutral' | 'info'
  title: LocalizedText
  body: LocalizedText
}

export interface ProjectHistoryProjectData {
  id: string
  label: LocalizedText
  aiBanner: LocalizedText
  timeline: ProjectHistoryTimelineEntry[]
  crossMeetingAlerts: ProjectCrossMeetingAlert[]
}
