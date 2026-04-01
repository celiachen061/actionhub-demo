import type {
  ActionItem,
  BadcaseItem,
  InsightCard,
  Language,
  LocalizedText,
  MeetingSummary,
  MetricCard,
  MyActionListItem,
  ProjectHistoryProjectData,
  TranscriptEntry,
} from '../types/app'

export const localize = (language: Language, text: LocalizedText): string => text[language]

/** 公司架构部门（主数据） */
export const companyOrgDepartments = [
  { id: 'digital-solutions', label: { zh: '数字化解决方案', en: 'Digital Solutions' } },
  { id: 'smart-home', label: { zh: '智慧家居与连接', en: 'Smart Home & Connectivity' } },
  { id: 'edge-industrial', label: { zh: '边缘与工业', en: 'Edge & Industrial' } },
  { id: 'platform-arch', label: { zh: '平台架构', en: 'Platform Architecture' } },
  { id: 'quality-assurance', label: { zh: '质量保障', en: 'Quality Assurance' } },
  { id: 'supply-chain', label: { zh: '供应链协同', en: 'Supply Chain' } },
]

/**
 * Demo 权限映射（后续可由后端权限接口替换）：
 * - key: userId
 * - value: 可访问的部门 id
 */
export const userDepartmentAccessMap: Record<string, string[]> = {
  'demo-jd': ['digital-solutions', 'smart-home', 'edge-industrial'],
  'demo-tech-lead': ['platform-arch', 'quality-assurance'],
  'demo-ops': ['supply-chain', 'digital-solutions'],
}

const allProgramGroups = companyOrgDepartments.map((d) => ({ id: d.id, label: d.label }))

export function getAccessibleProgramGroups(userId: string): Array<{ id: string; label: LocalizedText }> {
  const allowedIds = new Set(userDepartmentAccessMap[userId] ?? [])
  const scoped = allProgramGroups.filter((d) => allowedIds.has(d.id))
  return scoped.length ? scoped : allProgramGroups
}

/** 默认保留 demo-jd 的访问范围（兼容未改造处） */
export const appProgramGroups = getAccessibleProgramGroups('demo-jd')

const defaultProgramEn = appProgramGroups[0]?.label.en ?? 'Digital Solutions'
const appProgramEnSet = new Set<string>(appProgramGroups.map((g) => g.label.en))

/** 旧版芯片/短名 → 项目组英文主键（避免顶栏 select 与路由参数无法匹配 option 而空白） */
const legacyProgramKeyToEn: Record<string, string> = {
  'ESP32-C6': 'Digital Solutions',
  Matter: 'Smart Home & Connectivity',
  'ESP32-P4': 'Edge & Industrial',
}

export function normalizeProgramGroupEn(value: string): string {
  if (value == null || typeof value !== 'string' || value.trim() === '') {
    return defaultProgramEn
  }
  if (appProgramEnSet.has(value)) return value
  return legacyProgramKeyToEn[value] ?? defaultProgramEn
}

/** 由英文主键取双语文案（用于顶栏展示当前项目名） */
export function programGroupLabelFromEn(en: string): LocalizedText {
  const key = normalizeProgramGroupEn(en)
  const hit = allProgramGroups.find((g) => g.label.en === key)
  return hit?.label ?? { zh: key, en: key }
}

export const navItems = [
  { label: { zh: '仪表盘', en: 'Dashboard' }, route: '/dashboard', icon: 'LayoutDashboard' },
  { label: { zh: '会议列表', en: 'Meetings' }, route: '/meetings', icon: 'Calendar' },
  { label: { zh: '我的行动项', en: 'My Action Items' }, route: '/my-action-items', icon: 'ListTodo' },
  { label: { zh: '行动中心', en: 'Action Center' }, route: '/action-center', icon: 'Inbox' },
  { label: { zh: '项目历史', en: 'Project History' }, route: '/project-history', icon: 'History' },
  { label: { zh: '模板与规则', en: 'Templates & Rules' }, route: '/templates-rules', icon: 'FileText' },
  { label: { zh: '集成与管理', en: 'Integrations & Admin' }, route: '/integrations-admin', icon: 'Link' },
  { label: { zh: 'AI 运营', en: 'AI Ops' }, route: '/ai-ops', icon: 'ChartColumn' },
]

export const dashboardMetrics: MetricCard[] = [
  { label: { zh: '本周会议', en: "This Week's Meetings" }, value: '18', hint: { zh: '3 个活跃项目', en: '3 active projects' } },
  { label: { zh: '待确认纪要', en: 'Pending Summaries' }, value: '5', hint: { zh: '今日需处理', en: 'needs review today' }, tone: 'warning' },
  { label: { zh: '待同步 Jira', en: 'Pending Jira Sync' }, value: '12', hint: { zh: '草稿待确认', en: 'drafts waiting' } },
  { label: { zh: '未关闭事项', en: 'Open Action Items' }, value: '27', hint: { zh: '跨会议累计', en: 'carried across meetings' }, tone: 'danger' },
]

export const meetings: MeetingSummary[] = [
  {
    id: 'esp32-c6-weekly',
    title: { zh: 'ESP32-C6 项目周会', en: 'ESP32-C6 Weekly Sync' },
    time: { zh: '09:30 - 10:15', en: '09:30 - 10:15' },
    scheduleLabel: { zh: '2025-08-05 09:30', en: '2025-08-05 09:30' },
    type: { zh: '项目周会', en: 'Project Weekly' },
    status: { zh: '已结束', en: 'Ended' },
    attendees: 8,
    source: 'Hybrid',
    summaryStatus: { zh: '已完成', en: 'Done' },
    programGroup: 'Digital Solutions',
    participantInitials: ['E', 'J', 'A', 'L'],
    participantOverflow: 2,
    meetingRowStatus: 'synced',
    aiInsight: { actionCount: 4, confidencePct: 94 },
    syncTargets: [
      { letter: 'J', active: true, label: { zh: 'Jira', en: 'Jira' } },
      { letter: 'T', active: true, label: { zh: 'Teams', en: 'Teams' } },
      { letter: 'O', active: false, label: { zh: 'Outlook', en: 'Outlook' } },
    ],
    host: {
      avatar: 'Em',
      name: { zh: 'Emily Chen', en: 'Emily Chen' },
      title: { zh: '项目经理', en: 'Project Manager' },
      group: { zh: '数字化解决方案组', en: 'Digital Solutions Group' },
    },
    participants: [
      {
        avatar: 'Ja',
        name: { zh: 'Jason Liu', en: 'Jason Liu' },
        title: { zh: '固件工程师', en: 'Firmware Engineer' },
        group: { zh: '平台架构组', en: 'Platform Architecture' },
      },
      {
        avatar: 'Al',
        name: { zh: 'Alec Zhou', en: 'Alec Zhou' },
        title: { zh: '测试负责人', en: 'QA Lead' },
        group: { zh: '质量保障组', en: 'Quality Assurance' },
      },
      {
        avatar: 'Li',
        name: { zh: 'Lily Wang', en: 'Lily Wang' },
        title: { zh: '产品运营', en: 'Product Operations' },
        group: { zh: 'AI 运营组', en: 'AI Operations' },
      },
      {
        avatar: 'To',
        name: { zh: 'Tom Lee', en: 'Tom Lee' },
        title: { zh: '硬件工程师', en: 'Hardware Engineer' },
        group: { zh: '终端硬件组', en: 'Terminal Hardware' },
      },
      {
        avatar: 'Iv',
        name: { zh: 'Ivy Xu', en: 'Ivy Xu' },
        title: { zh: '会议运营', en: 'Meeting Operations' },
        group: { zh: '协作效率组', en: 'Collaboration Enablement' },
      },
    ],
  },
  {
    id: 'matter-review',
    title: { zh: 'Matter 网关技术评审会', en: 'Matter Gateway Design Review' },
    time: { zh: '14:00 - 15:30', en: '14:00 - 15:30' },
    scheduleLabel: { zh: '2025-08-06 14:00', en: '2025-08-06 14:00' },
    type: { zh: '技术评审会', en: 'Technical Review' },
    status: { zh: '待确认纪要', en: 'Needs Summary Review' },
    attendees: 12,
    source: 'Teams',
    summaryStatus: { zh: '待确认', en: 'Pending' },
    programGroup: 'Smart Home & Connectivity',
    participantInitials: ['李', '陈', '王', '张'],
    participantOverflow: 3,
    meetingRowStatus: 'ai_draft',
    aiInsight: { actionCount: 6, confidencePct: 88 },
    syncTargets: [
      { letter: 'J', active: true, label: { zh: 'Jira', en: 'Jira' } },
      { letter: 'T', active: true, label: { zh: 'Teams', en: 'Teams' } },
      { letter: 'S', active: false, label: { zh: 'Slack', en: 'Slack' } },
    ],
    host: {
      avatar: '李',
      name: { zh: '李丹', en: 'Dan Li' },
      title: { zh: '技术主持', en: 'Technical Moderator' },
      group: { zh: '智慧家居组', en: 'Smart Home Group' },
    },
    participants: [
      {
        avatar: '陈',
        name: { zh: '陈远', en: 'Yuan Chen' },
        title: { zh: '架构师', en: 'System Architect' },
        group: { zh: '连接中间件组', en: 'Connectivity Middleware' },
      },
      {
        avatar: '王',
        name: { zh: '王靖', en: 'Jing Wang' },
        title: { zh: 'SDK 负责人', en: 'SDK Lead' },
        group: { zh: '设备接入组', en: 'Device Access Team' },
      },
      {
        avatar: '张',
        name: { zh: '张宁', en: 'Ning Zhang' },
        title: { zh: '测试经理', en: 'Test Manager' },
        group: { zh: '质量保障组', en: 'Quality Assurance' },
      },
      {
        avatar: '吴',
        name: { zh: '吴峰', en: 'Feng Wu' },
        title: { zh: '产品经理', en: 'Product Manager' },
        group: { zh: '智慧家居组', en: 'Smart Home Group' },
      },
      {
        avatar: '赵',
        name: { zh: '赵雅', en: 'Ya Zhao' },
        title: { zh: '运营分析', en: 'Ops Analyst' },
        group: { zh: 'AI 运营组', en: 'AI Operations' },
      },
      {
        avatar: '周',
        name: { zh: '周启', en: 'Qi Zhou' },
        title: { zh: '平台工程师', en: 'Platform Engineer' },
        group: { zh: '平台架构组', en: 'Platform Architecture' },
      },
    ],
  },
  {
    id: 'risk-sync',
    title: { zh: 'X90 芯片量产风险同步会', en: 'X90 Mass Production Risk Sync' },
    time: { zh: '17:00 - 17:45', en: '17:00 - 17:45' },
    scheduleLabel: { zh: '2026-03-16 10:00', en: '2026-03-16 10:00' },
    type: { zh: '风险同步会', en: 'Risk Sync' },
    status: { zh: '已发送邮件', en: 'Email Sent' },
    attendees: 6,
    source: 'Turnout',
    summaryStatus: { zh: '已发送', en: 'Sent' },
    programGroup: 'Digital Solutions',
    participantInitials: ['周', '何', '吴'],
    participantOverflow: 1,
    meetingRowStatus: 'pending_review',
    aiInsight: { actionCount: 3, confidencePct: 91 },
    syncTargets: [
      { letter: 'J', active: false, label: { zh: 'Jira', en: 'Jira' } },
      { letter: 'T', active: true, label: { zh: 'Teams', en: 'Teams' } },
      { letter: 'O', active: true, label: { zh: 'Outlook', en: 'Outlook' } },
    ],
    host: {
      avatar: '周',
      name: { zh: '周凯', en: 'Kai Zhou' },
      title: { zh: '风险负责人', en: 'Risk Owner' },
      group: { zh: '量产保障组', en: 'Mass Production Assurance' },
    },
    participants: [
      {
        avatar: '何',
        name: { zh: '何晨', en: 'Chen He' },
        title: { zh: '质量经理', en: 'Quality Manager' },
        group: { zh: '质量保障组', en: 'Quality Assurance' },
      },
      {
        avatar: '吴',
        name: { zh: '吴迪', en: 'Di Wu' },
        title: { zh: '供应链协调', en: 'Supply Chain Coordinator' },
        group: { zh: '供应链组', en: 'Supply Chain' },
      },
      {
        avatar: '刘',
        name: { zh: '刘超', en: 'Chao Liu' },
        title: { zh: '产测工程师', en: 'Production Test Engineer' },
        group: { zh: '终端硬件组', en: 'Terminal Hardware' },
      },
      {
        avatar: '唐',
        name: { zh: '唐敏', en: 'Min Tang' },
        title: { zh: '项目协调', en: 'Project Coordinator' },
        group: { zh: '数字化解决方案组', en: 'Digital Solutions Group' },
      },
    ],
  },
  {
    id: 'esp32-p4-weekly',
    title: { zh: 'ESP32-P4 工业场景周会', en: 'ESP32-P4 Industrial Weekly' },
    time: { zh: '11:00 - 11:45', en: '11:00 - 11:45' },
    scheduleLabel: { zh: '2025-08-07 11:00', en: '2025-08-07 11:00' },
    type: { zh: '项目周会', en: 'Project Weekly' },
    status: { zh: '已结束', en: 'Ended' },
    attendees: 5,
    source: 'Teams',
    summaryStatus: { zh: '已完成', en: 'Done' },
    programGroup: 'Edge & Industrial',
    participantInitials: ['Q', 'K', 'S'],
    participantOverflow: 1,
    meetingRowStatus: 'synced',
    aiInsight: { actionCount: 2, confidencePct: 90 },
    syncTargets: [
      { letter: 'J', active: true, label: { zh: 'Jira', en: 'Jira' } },
      { letter: 'T', active: true, label: { zh: 'Teams', en: 'Teams' } },
    ],
    host: {
      avatar: 'Qi',
      name: { zh: '祁航', en: 'Hang Qi' },
      title: { zh: '工业方案负责人', en: 'Industrial Solutions Lead' },
      group: { zh: '边缘与工业组', en: 'Edge & Industrial Group' },
    },
    participants: [
      {
        avatar: 'Ke',
        name: { zh: '柯明', en: 'Ming Ke' },
        title: { zh: '现场应用工程师', en: 'FAE' },
        group: { zh: '客户支持组', en: 'Customer Support' },
      },
      {
        avatar: 'Su',
        name: { zh: '苏岚', en: 'Lan Su' },
        title: { zh: '嵌入式开发', en: 'Embedded Developer' },
        group: { zh: '平台架构组', en: 'Platform Architecture' },
      },
    ],
  },
]

export const pendingInsights: InsightCard[] = [
  {
    title: { zh: 'AI 价值回顾', en: 'AI Value Snapshot' },
    body: {
      zh: 'AI 草稿已在 72% 的会议里被直接采用，说明"AI 起草 + 人工确认"路径成立。于 2025/08/05 更新。',
      en: 'AI drafts were directly adopted in 72% of meetings, validating the draft-first workflow. Updated 2025/08/05.',
    },
  },
  {
    title: { zh: '本周有 2 条 blocker 在连续会议中重复出现', en: '2 recurring blockers detected this week' },
    body: {
      zh: '建议优先进入 Action Center 处理。',
      en: 'Action Center follow-up is recommended.',
    },
    tone: 'warning',
  },
]

export const transcriptEntries: TranscriptEntry[] = [
  {
    id: 't1',
    speaker: 'Emily',
    time: '09:42',
    content: {
      zh: '功耗测试结果比预期晚了两天，今天需要明确补测安排。',
      en: 'Power test results slipped by two days, and we need a recovery plan today.',
    },
  },
  {
    id: 't2',
    speaker: 'Jason',
    time: '09:45',
    content: {
      zh: 'Wi-Fi 模块这周五前会补齐测试数据，之后再同步给核心项目组。',
      en: 'The Wi-Fi team will complete test data by Friday and sync it to the core group.',
    },
    tone: 'highlight',
  },
  {
    id: 't3',
    speaker: 'Emily & Jason',
    time: '09:51',
    content: {
      zh: '蓝牙互联异常还缺复现路径，目前 owner 还没有完全确认，需要在本次会议后跟进。',
      en: 'The Bluetooth issue still lacks a reproducible path, and the owner is not confirmed yet.',
    },
    tone: 'highlight',
  },
  {
    id: 't4',
    speaker: 'Alec',
    time: '09:58',
    content: {
      zh: '建议先在内部试用版本中验证，不要直接推广到所有设备。',
      en: 'We should validate on internal builds first rather than pushing to all devices.',
    },
  },
  {
    id: 't5',
    speaker: 'Jason',
    time: '10:02',
    content: {
      zh: '如果下周前 OTA 风险没有收敛，就先只发内部试用版本。',
      en: 'If the OTA risk is not reduced by next week, we should keep it internal only.',
    },
  },
]

export const meetingSummary = {
  title: { zh: 'ESP32-C6 项目周会', en: 'ESP32-C6 Weekly Sync' },
  meta: {
    zh: '2025-08-05 09:30 - 10:15 · 8 人参会 · Hybrid · 主 source: Teams transcript',
    en: '2025-08-05 09:30 - 10:15 · 8 attendees · Hybrid · Primary source: Teams transcript',
  },
  summary: {
    zh: '本次会议确认功耗测试恢复计划，识别到一个仍需人工确认 owner 的蓝牙问题，并决定继续跟踪 OTA 风险。',
    en: 'The meeting confirmed the power-test recovery plan, flagged one Bluetooth issue without a clear owner, and decided to keep tracking OTA risk.',
  },
  decisions: [
    { zh: 'Wi-Fi 功耗数据周五前补齐。', en: 'Wi-Fi power data will be completed by Friday.' },
    { zh: 'OTA 先维持内部试用节奏。', en: 'OTA remains on an internal-only rollout path for now.' },
  ],
  risks: [
    { zh: '蓝牙互联异常缺少明确 owner。', en: 'The Bluetooth issue still has no confirmed owner.' },
    { zh: 'OTA 稳定性仍需下周继续观察。', en: 'OTA stability still needs another week of observation.' },
  ],
  questions: [
    { zh: '蓝牙异常最终由系统组还是 QA 组接手？', en: 'Will the system team or QA own the Bluetooth issue?' },
  ],
}

export const meetingActionItems: ActionItem[] = [
  {
    id: 'a1',
    title: { zh: '更新 Wi-Fi 功耗测试结果', en: 'Update Wi-Fi power test results' },
    owner: 'Jason',
    deadline: '2025-08-08',
    routing: 'Jira',
    status: 'Confirmed',
    confidence: '94%',
  },
  {
    id: 'a2',
    title: { zh: '补充蓝牙互联异常复现路径', en: 'Add reproduction path for Bluetooth issue' },
    owner: '',
    deadline: '',
    routing: 'Jira',
    status: 'Needs Review',
    confidence: '61%',
  },
  {
    id: 'a3',
    title: { zh: '将风险项同步给核心项目组', en: 'Sync the risk item to the core project team' },
    owner: 'Emily',
    deadline: '2025-08-06',
    routing: 'Email only',
    status: 'AI Draft',
    confidence: '88%',
  },
]

export const emailDraft = {
  subject: { zh: 'ESP32-C6 项目周会纪要', en: 'ESP32-C6 Weekly Sync Summary' },
  recipients: 'pm@espressif.local, techlead@espressif.local',
  body: {
    zh: '本周功耗测试恢复计划已确认，另有 1 条蓝牙问题需要补充 owner 后再进入 Jira。',
    en: 'The power-test recovery plan is confirmed, while one Bluetooth issue needs owner confirmation before Jira sync.',
  },
}

export const jiraDrafts = [
  { key: 'WIFI-231', summary: { zh: '更新 Wi-Fi 功耗测试结果', en: 'Update Wi-Fi power test results' }, status: 'Ready' },
  { key: 'BLUETOOTH-89', summary: { zh: '补充蓝牙复现路径', en: 'Add Bluetooth repro steps' }, status: 'Needs Review' },
]

export const actionCenterMetrics: MetricCard[] = [
  {
    label: { zh: '总待办数', en: 'Total Open Items' },
    value: '50',
    hint: { zh: '所有项目', en: 'all projects' },
    actionCenterStatus: 'all',
  },
  {
    label: { zh: '已逾期', en: 'Overdue' },
    value: '12',
    hint: { zh: '需优先处理', en: 'requires follow-up' },
    tone: 'danger',
    actionCenterStatus: 'Overdue',
  },
  {
    label: { zh: '跨会议未关闭', en: 'Carry-over Items' },
    value: '8',
    hint: { zh: '已连续出现', en: 'repeated in meetings' },
    tone: 'warning',
    actionCenterStatus: 'Carry-over',
  },
  {
    label: { zh: '待补字段', en: 'Missing Owner/Deadline' },
    value: '14',
    hint: { zh: '需人工确认', en: 'needs manual review' },
    actionCenterStatus: 'Missing Fields',
  },
]

export type ActionCenterTableRow = {
  id: string
  title: { zh: string; en: string }
  project: string
  owner: string
  deadline: string
  status: { zh: string; en: 'Overdue' | 'Missing Fields' | 'In Progress' | 'Carry-over' }
  routing: { zh: string; en: string }
  meetingId: string
}

const actionCenterRowsSeed: ActionCenterTableRow[] = [
  {
    id: 'ac-01',
    title: { zh: 'Wi-Fi 功耗测试结果补齐', en: 'Complete Wi-Fi power test data' },
    project: 'Digital Solutions',
    owner: 'Jason',
    deadline: '8/8',
    status: { zh: '逾期', en: 'Overdue' },
    routing: { zh: 'Jira', en: 'Jira' },
    meetingId: 'esp32-c6-weekly',
  },
  {
    id: 'ac-02',
    title: { zh: '蓝牙异常复现路径补充', en: 'Add Bluetooth repro steps' },
    project: 'Digital Solutions',
    owner: '-',
    deadline: '-',
    status: { zh: '待补字段', en: 'Missing Fields' },
    routing: { zh: 'Jira', en: 'Jira' },
    meetingId: 'esp32-c6-weekly',
  },
  {
    id: 'ac-03',
    title: { zh: 'OTA 风险同步给核心组', en: 'Sync OTA risk to core team' },
    project: 'Digital Solutions',
    owner: 'Emily',
    deadline: '8/6',
    status: { zh: '进行中', en: 'In Progress' },
    routing: { zh: 'Email', en: 'Email' },
    meetingId: 'esp32-c6-weekly',
  },
  {
    id: 'ac-04',
    title: { zh: 'Matter 网关依赖确认', en: 'Confirm Matter gateway dependency' },
    project: 'Smart Home & Connectivity',
    owner: 'Alec',
    deadline: '8/12',
    status: { zh: '跨会议', en: 'Carry-over' },
    routing: { zh: 'Jira', en: 'Jira' },
    meetingId: 'matter-review',
  },
]

const actionCenterStatusCycle: ActionCenterTableRow['status'][] = [
  { zh: '逾期', en: 'Overdue' },
  { zh: '待补字段', en: 'Missing Fields' },
  { zh: '进行中', en: 'In Progress' },
  { zh: '跨会议', en: 'Carry-over' },
]

/** 多样化任务标题池（与项目组合生成行，避免「#1 #2」式重复感） */
const actionCenterTitlePool: { zh: string; en: string }[] = [
  { zh: '更新 SDK 例程与发布说明', en: 'Update SDK examples & release notes' },
  { zh: '补充低功耗唤醒回归用例', en: 'Add low-power wake regression cases' },
  { zh: 'RF 传导测试报告归档', en: 'Archive RF conducted test report' },
  { zh: 'Security 审计问题闭环', en: 'Close security audit findings' },
  { zh: 'CI 夜间构建失败根因分析', en: 'RCA for nightly CI failure' },
  { zh: '芯片 errata 同步至客户通告', en: 'Sync chip errata to customer notice' },
  { zh: '量产测试治具验收签字', en: 'Sign off MP test fixture acceptance' },
  { zh: 'Mesh 配网兼容性复测', en: 'Re-test Mesh provisioning compatibility' },
  { zh: '文档中英术语表对齐', en: 'Align EN/ZH terminology in docs' },
  { zh: '供应商物料替代验证', en: 'Validate alternate BOM components' },
  { zh: 'RTOS 任务栈溢出排查', en: 'Debug RTOS task stack overflow' },
  { zh: '蓝牙共存场景压测', en: 'Bluetooth coexistence stress test' },
  { zh: 'Matter 认证资料补充', en: 'Complete Matter certification materials' },
  { zh: '功耗曲线对比基线更新', en: 'Update power curve baseline' },
  { zh: '现场日志抓dump流程固化', en: 'Standardize on-site log capture' },
  { zh: 'Host SDK 接口破坏性变更公告', en: 'Announce breaking Host SDK API changes' },
  { zh: '射频校准脚本版本锁定', en: 'Pin RF calibration script version' },
  { zh: 'HR 培训报名统计导出', en: 'Export HR training signup stats' },
  { zh: '法务开源协议审查清单', en: 'Legal open-source review checklist' },
  { zh: '硬件改版丝印对比确认', en: 'Confirm silkscreen diff on HW revision' },
  { zh: '客户 issues 周报汇总', en: 'Weekly customer issues rollup' },
  { zh: '内存泄漏怀疑点插桩', en: 'Instrument suspected memory leak sites' },
  { zh: '双核通信边界用例补全', en: 'Complete dual-core IPC test cases' },
  { zh: 'ATE 测试限值放宽评审', en: 'Review ATE limit relaxation' },
]

const ownersPool = ['Jason', 'Emily', 'Alec', 'Lin', 'May', 'David', 'Sarah'] as const
const projects = ['Digital Solutions', 'Smart Home & Connectivity', 'Edge & Industrial'] as const
const meetingIds = ['esp32-c6-weekly', 'matter-review', 'esp32-p4-sync', 'risk-sync-q3'] as const

const routingPool: { zh: string; en: string }[] = [
  { zh: 'Jira', en: 'Jira' },
  { zh: 'Email', en: 'Email' },
  { zh: 'Email only', en: 'Email only' },
  { zh: 'EHR（预留）', en: 'EHR (planned)' },
]

const actionCenterRowsGenerated: ActionCenterTableRow[] = Array.from({ length: 46 }, (_, i) => {
  const rowNum = i + 5
  const st = actionCenterStatusCycle[(i + 1) % 4]
  const missing = st.en === 'Missing Fields'
  const project = projects[(i * 2) % projects.length]
  const titleBase = actionCenterTitlePool[i % actionCenterTitlePool.length]
  return {
    id: `ac-${String(rowNum).padStart(2, '0')}`,
    title: {
      zh: `${titleBase.zh} · ${project}`,
      en: `${titleBase.en} · ${project}`,
    },
    project,
    owner: missing ? '-' : ownersPool[i % ownersPool.length],
    deadline: missing ? '-' : `${8 + (i % 6)}/${((i * 5 + 3) % 28) + 1}/2025`,
    status: st,
    routing: routingPool[(i + st.en.length) % routingPool.length],
    meetingId: meetingIds[(i + project.length) % meetingIds.length],
  }
})

/** 与行动中心 KPI「总待办 50」对齐；筛选「所有状态 / 所有项目」时展示完整列表 */
export const actionCenterRows: ActionCenterTableRow[] = [
  ...actionCenterRowsSeed,
  ...actionCenterRowsGenerated,
]

export const actionCenterInsights: InsightCard[] = [
  {
    title: { zh: 'AI 发现：蓝牙问题已在 3 次会议中跟进，但尚未绑定 Jira 工单，本周上手率需提升。', en: 'AI found: Bluetooth issue tracked in 3 meetings but no Jira ticket bound yet.' },
    body: {
      zh: '蓝牙互联异常已在连续两次会议中出现，但仍没有最终 owner。建议立即指派并进入 Action Center。',
      en: 'The Bluetooth issue appeared in two consecutive meetings and still has no final owner.',
    },
    tone: 'warning',
  },
]

export const skillCards: InsightCard[] = [
  {
    title: { zh: '行动聚焦技能', en: 'Action Focus Skill' },
    body: { zh: '聚焦待推进事项、owner、deadline 与依赖。', en: 'Summarize items, owner, deadline, and blockers that need execution.' },
  },
  {
    title: { zh: '跨会议跟进', en: 'Cross-meeting Follow-up' },
    body: { zh: '识别跨会议未关闭事项并给出跟进建议。', en: 'Detect carry-over items across meetings and generate follow-up suggestions.' },
  },
  {
    title: { zh: '阻塞项扫描', en: 'Blocker Scan' },
    body: { zh: '识别持续 blocker 和需要升级的问题。', en: 'Highlight repeated blockers and issues that may need escalation.' },
    tone: 'warning',
  },
]

export const aiOpsMetrics: MetricCard[] = [
  { label: { zh: '行动项识别率', en: 'Action Item Recall' }, value: '91.3%', hint: { zh: '↑ 2.7%', en: '↑ 2.7%' }, tone: 'success' },
  { label: { zh: '协同得分', en: 'Onside Score' }, value: '86.7%', hint: { zh: '↓ 1.1%', en: '↓ 1.1%' }, tone: 'warning' },
  { label: { zh: '落地人工干预率', en: 'Human Intervention Rate' }, value: '78.4%', hint: { zh: '↑ 5.2%', en: '↑ 5.2%' }, tone: 'success' },
  { label: { zh: 'Badcase 总量', en: 'Total Badcases' }, value: '23', hint: { zh: '本周新增 +4', en: '+4 this week' }, tone: 'danger' },
]

export const skillMetrics = [
  { module: 'Action Item Extraction', version: 'v1.6', metric: '91.3%', badcases: '4', status: 'Stable' },
  { module: 'Owner / Deadline', version: 'v1.4', metric: '86.7%', badcases: '9', status: 'Watch' },
  { module: 'Blocker Scan', version: 'v0.9', metric: '78.4%', badcases: '8', status: 'Iterating' },
  { module: '会议总结生成', version: 'v0.8', metric: '94.0%', badcases: '2', status: 'Stable' },
]

export const badcases: BadcaseItem[] = [
  {
    id: 'bc-01',
    title: { zh: '技术评审会把讨论误判成 decision', en: 'Technical review discussion misclassified as decision' },
    type: { zh: 'Decision 误提', en: 'Decision false positive' },
    severity: 'P1',
    status: { zh: '处理中', en: 'In Progress' },
    summary: {
      zh: '需要在技术评审模板中增加条件性表达识别。建议继续优化 Prompt 策略。',
      en: 'Add conditional-language detection to the review template.',
    },
  },
  {
    id: 'bc-02',
    title: { zh: 'owner 识别错误', en: 'Wrong owner recognition' },
    type: { zh: 'Owner 识别', en: 'Owner recognition' },
    severity: 'P0',
    status: { zh: '待回归', en: 'Pending Regression' },
    summary: {
      zh: '当前对"需要 B 负责"这类表达仍会误识别说话人，需要修改训练数据标注规范。',
      en: 'The model still mistakes the speaker for the owner in indirect assignment phrases.',
    },
  },
  {
    id: 'bc-03',
    title: { zh: '跨会议事项误关联', en: 'Wrong cross-meeting merge' },
    type: { zh: 'Follow-up 匹配', en: 'Follow-up matching' },
    severity: 'P2',
    status: { zh: '已修复', en: 'Fixed' },
    summary: {
      zh: '已增加 project_id + owner + 关键词 的多条件约束，修复后回归测试通过。',
      en: 'Fixed with project_id + owner + keyword constraints.',
    },
  },
]

export const meetingFilters = [
  { zh: '全部项目', en: 'All Projects' },
  { zh: '项目周会', en: 'Project Weekly' },
  { zh: '待确认纪要', en: 'Needs Review' },
  { zh: 'Hybrid 来源', en: 'Hybrid Source' },
]

export const myActionMetrics: MetricCard[] = [
  { label: { zh: '待处理', en: 'Pending' }, value: '11', hint: { zh: '本周新增 4 条', en: '4 added this week' } },
  { label: { zh: '已逾期', en: 'Overdue' }, value: '3', hint: { zh: '需优先处理', en: 'needs attention' }, tone: 'danger' },
  { label: { zh: '待确认', en: 'Needs Review' }, value: '4', hint: { zh: '缺 owner / deadline', en: 'missing owner / deadline' }, tone: 'warning' },
]

export const myActionItems: MyActionListItem[] = [
  {
    id: 'mya-x90-schedule',
    title: {
      zh: '更新 Q3 晶圆产线排期并确认产能',
      en: 'Update Q3 wafer line schedule and confirm capacity',
    },
    meeting: { zh: 'X90 芯片量产风险同步会', en: 'X90 Mass Production Risk Sync' },
    meetingId: 'risk-sync',
    programGroup: 'Digital Solutions',
    assignee: '赵供应链',
    deadline: '2026-03-18',
    status: { zh: '待处理', en: 'Pending' },
    routing: { zh: 'Jira', en: 'Jira' },
    priority: 'high',
    executionBadge: { zh: '待处理', en: 'Pending' },
    quote: {
      zh: '赵总，那个 Q3 的产线排期得抓紧更新，产能不确认后面的物料都卡住了。',
      en: 'Mr. Zhao, the Q3 line schedule needs updating urgently—without capacity confirmation downstream materials will stall.',
    },
    jiraTicketKey: 'X90-1284',
    lastSynced: { zh: '2 小时前', en: '2 hours ago' },
  },
  {
    id: 'mya-c6-power',
    title: { zh: '更新 Wi-Fi 功耗测试结果', en: 'Update Wi-Fi power consumption test results' },
    meeting: { zh: 'ESP32-C6 项目周会', en: 'ESP32-C6 Weekly Sync' },
    meetingId: 'esp32-c6-weekly',
    programGroup: 'Digital Solutions',
    assignee: 'Jason Liu',
    deadline: '2025-08-08',
    status: { zh: '待处理', en: 'Pending' },
    routing: { zh: 'Jira', en: 'Jira' },
    priority: 'medium',
    executionBadge: { zh: '待处理', en: 'Pending' },
    quote: {
      zh: '功耗曲线周五前要进报告，不然认证那边没法锁结论。',
      en: 'Power curves must be in the report by Friday or cert cannot lock conclusions.',
    },
    jiraTicketKey: 'C6-8821',
    lastSynced: { zh: '昨天', en: 'Yesterday' },
  },
  {
    id: 'mya-matter-sdk',
    title: { zh: '补充 SDK 接口说明', en: 'Provide missing SDK interface documentation' },
    meeting: { zh: 'Matter 网关技术评审会', en: 'Matter Gateway Design Review' },
    meetingId: 'matter-review',
    programGroup: 'Smart Home & Connectivity',
    assignee: '王靖',
    deadline: '2025-08-09',
    status: { zh: '待确认', en: 'Needs Review' },
    routing: { zh: 'Jira', en: 'Jira' },
    priority: 'medium',
    executionBadge: { zh: '待确认', en: 'Needs Review' },
    quote: {
      zh: '认证矩阵里 Thread BR 相关接口还缺一页说明，测试组对不上用例编号。',
      en: 'Cert matrix still misses a one-pager for Thread BR APIs—QA cannot map case IDs.',
    },
    jiraTicketKey: 'MATTER-441',
    lastSynced: null,
  },
  {
    id: 'mya-risk-email',
    title: { zh: '跟进 blocker 邮件同步', en: 'Follow up blocker email sync' },
    meeting: { zh: 'X90 芯片量产风险同步会', en: 'X90 Mass Production Risk Sync' },
    meetingId: 'risk-sync',
    programGroup: 'Digital Solutions',
    assignee: '张明',
    deadline: '2025-08-06',
    status: { zh: '已逾期', en: 'Overdue' },
    routing: { zh: '仅邮件', en: 'Email only' },
    priority: 'high',
    executionBadge: { zh: '已逾期', en: 'Overdue' },
    quote: {
      zh: 'blocker 清单要先发到大群，销售那边一直在问交付口径。',
      en: 'Send the blocker list to the large group first—sales keeps asking for delivery wording.',
    },
    jiraTicketKey: null,
    lastSynced: { zh: '5 小时前', en: '5 hours ago' },
  },
  {
    id: 'mya-c6-ota',
    title: { zh: '完成 OTA 差分包签名校验与灰度开关核对', en: 'Verify OTA delta signatures and gray-release toggles' },
    meeting: { zh: 'ESP32-C6 项目周会', en: 'ESP32-C6 Weekly Sync' },
    meetingId: 'esp32-c6-weekly',
    programGroup: 'Digital Solutions',
    assignee: 'Alec Zhou',
    deadline: '2025-08-11',
    status: { zh: '进行中', en: 'In progress' },
    routing: { zh: 'Jira', en: 'Jira' },
    priority: 'high',
    executionBadge: { zh: '进行中', en: 'In progress' },
    quote: {
      zh: '灰度只开 5% 的话样本不够，至少要能覆盖两条产线各一台样机。',
      en: '5% gray is not enough—we need at least one sample per line on two lines.',
    },
    jiraTicketKey: 'C6-8890',
    lastSynced: { zh: '30 分钟前', en: '30 minutes ago' },
  },
  {
    id: 'mya-matter-csa',
    title: { zh: '补齐 CSA 认证资料包中英对照表', en: 'Complete EN/ZH mapping sheet for CSA certification pack' },
    meeting: { zh: 'Matter 网关技术评审会', en: 'Matter Gateway Design Review' },
    meetingId: 'matter-review',
    programGroup: 'Smart Home & Connectivity',
    assignee: '张宁',
    deadline: '2025-08-10',
    status: { zh: '待确认', en: 'Needs Review' },
    routing: { zh: 'Confluence', en: 'Confluence' },
    priority: 'medium',
    executionBadge: { zh: '待确认', en: 'Needs Review' },
    quote: {
      zh: '审计要能对上条款号，现在中英文术语不一致会被打回。',
      en: 'Audit needs clause IDs aligned—mixed terminology will be rejected.',
    },
    jiraTicketKey: 'MATTER-502',
    lastSynced: { zh: '3 天前', en: '3 days ago' },
  },
  {
    id: 'mya-matter-slack',
    title: { zh: '在 Slack #matter-gateway 发布 SDK 冻结窗口公告', en: 'Post SDK freeze window notice in Slack #matter-gateway' },
    meeting: { zh: 'Matter 网关技术评审会', en: 'Matter Gateway Design Review' },
    meetingId: 'matter-review',
    programGroup: 'Smart Home & Connectivity',
    assignee: 'Lily Wang',
    deadline: '2025-08-07',
    status: { zh: '待处理', en: 'Pending' },
    routing: { zh: 'Slack', en: 'Slack' },
    priority: 'low',
    executionBadge: { zh: '待处理', en: 'Pending' },
    quote: {
      zh: '运营侧要把冻结日和例外合入流程写清楚，避免各组理解不一致。',
      en: 'Ops must spell freeze dates and exception merge process so teams align.',
    },
    jiraTicketKey: null,
    lastSynced: { zh: '1 小时前', en: '1 hour ago' },
  },
  {
    id: 'mya-risk-safety',
    title: { zh: '提交封装产线安全巡检照片与整改单', en: 'Submit packaging line safety walk photos and CAPA' },
    meeting: { zh: 'X90 芯片量产风险同步会', en: 'X90 Mass Production Risk Sync' },
    meetingId: 'risk-sync',
    programGroup: 'Digital Solutions',
    assignee: '何晨',
    deadline: '2025-08-05',
    status: { zh: '已逾期', en: 'Overdue' },
    routing: { zh: 'Jira', en: 'Jira' },
    priority: 'medium',
    executionBadge: { zh: '已逾期', en: 'Overdue' },
    quote: {
      zh: '客户审核下周进场，没有闭环照片我们不敢签字放行。',
      en: 'Customer audit is next week—we cannot sign off without closed-loop photos.',
    },
    jiraTicketKey: 'X90-1301',
    lastSynced: { zh: '昨天 18:20', en: 'Yesterday 18:20' },
  },
  {
    id: 'mya-edge-trial',
    title: { zh: '边缘网关现场试跑日志上传与磁盘清理', en: 'Upload edge gateway field-trial logs and disk cleanup' },
    meeting: { zh: 'ESP32-C6 项目周会', en: 'ESP32-C6 Weekly Sync' },
    meetingId: 'esp32-c6-weekly',
    programGroup: 'Edge & Industrial',
    assignee: 'Tom Lee',
    deadline: '2025-08-12',
    status: { zh: '待处理', en: 'Pending' },
    routing: { zh: '对象存储', en: 'Object storage' },
    priority: 'low',
    executionBadge: { zh: '待处理', en: 'Pending' },
    quote: {
      zh: '现场盘快满了，先把 INFO 级日志轮转策略定下来再全量上传。',
      en: 'Disk is almost full—define INFO log rotation before full upload.',
    },
    jiraTicketKey: null,
    lastSynced: null,
  },
  {
    id: 'mya-c6-rf',
    title: { zh: '双模射频共存回归测试用例补全', en: 'Complete dual-mode RF coexistence regression cases' },
    meeting: { zh: 'ESP32-C6 项目周会', en: 'ESP32-C6 Weekly Sync' },
    meetingId: 'esp32-c6-weekly',
    programGroup: 'Digital Solutions',
    assignee: 'Ivy Xu',
    deadline: '2025-08-13',
    status: { zh: '进行中', en: 'In progress' },
    routing: { zh: 'TestRail', en: 'TestRail' },
    priority: 'medium',
    executionBadge: { zh: '进行中', en: 'In progress' },
    quote: {
      zh: 'Wi-Fi 与 15.4 同时压测的用例还缺边界条件，认证会抽查。',
      en: 'Edge cases for Wi-Fi + 15.4 stress are still missing—cert may sample them.',
    },
    jiraTicketKey: 'C6-9012',
    lastSynced: { zh: '45 分钟前', en: '45 minutes ago' },
  },
  {
    id: 'mya-matter-done',
    title: { zh: '归档网关 BOM 变更评审纪要', en: 'Archive gateway BOM change review minutes' },
    meeting: { zh: 'Matter 网关技术评审会', en: 'Matter Gateway Design Review' },
    meetingId: 'matter-review',
    programGroup: 'Smart Home & Connectivity',
    assignee: '吴峰',
    deadline: '2025-08-04',
    status: { zh: '已完成', en: 'Done' },
    routing: { zh: 'Confluence', en: 'Confluence' },
    priority: 'low',
    executionBadge: { zh: '已完成', en: 'Done' },
    quote: {
      zh: 'BOM 差异已经各方签字，纪要归档后采购才能下单备料。',
      en: 'BOM delta is signed—procurement needs archived minutes to place buys.',
    },
    jiraTicketKey: 'MATTER-398',
    lastSynced: { zh: '刚刚', en: 'Just now' },
  },
  {
    id: 'mya-risk-blocker',
    title: { zh: '协调备用载板到货窗口与产线换型时间', en: 'Align backup substrate arrival with line changeover window' },
    meeting: { zh: 'X90 芯片量产风险同步会', en: 'X90 Mass Production Risk Sync' },
    meetingId: 'risk-sync',
    programGroup: 'Digital Solutions',
    assignee: '吴迪',
    deadline: '2026-03-20',
    status: { zh: '待处理', en: 'Pending' },
    routing: { zh: 'Jira', en: 'Jira' },
    priority: 'high',
    executionBadge: { zh: '阻塞', en: 'Blocked' },
    quote: {
      zh: '载板晚一天，换型窗口就要整体后移，销售和计划必须同步改口。',
      en: 'One day late on substrate shifts the whole changeover—sales and planning must align messaging.',
    },
    jiraTicketKey: 'X90-1299',
    lastSynced: { zh: '10 分钟前', en: '10 minutes ago' },
  },
]

const projectHistoryProjectsDetailed: ProjectHistoryProjectData[] = [
  {
    id: 'digital-solutions',
    label: { zh: '数字化解决方案', en: 'Digital Solutions' },
    aiBanner: {
      zh: 'Wi-Fi 功耗测试结果已连续 2 场会议提及，本周仍未关闭，建议优先跟进。',
      en: 'Wi-Fi power test has been raised in 2 meetings and is still open this week—prioritize follow-up.',
    },
    timeline: [
      {
        meetingId: 'risk-sync',
        date: '2026-03-16',
        title: { zh: 'X90 芯片量产风险同步会', en: 'X90 Mass Production Risk Sync' },
        type: { zh: '风险同步会', en: 'Risk Sync' },
        summary: {
          zh: '载板到货窗口与产线换型需对齐，销售和计划口径同步。',
          en: 'Align substrate arrival with line changeover; keep sales and planning aligned.',
        },
        actions: '3',
        aiStatus: { zh: '待处理', en: 'In Progress' },
        highlights: [
          { zh: '决议：阻塞项升级至量产委员会周会跟进。', en: 'Decision: escalate blockers to the weekly MP committee.' },
          { zh: '风险：备用载板物流窗口仍有一周漂移。', en: 'Risk: backup substrate slot may slip by one week.' },
        ],
      },
      {
        meetingId: 'esp32-c6-weekly',
    date: '2025-08-05',
        title: { zh: 'ESP32-C6 项目周会', en: 'ESP32-C6 Weekly Sync' },
    type: { zh: '项目周会', en: 'Project Weekly' },
        summary: { zh: '功耗测试延后 2 天，需补 SDK 说明文档。', en: 'Power tests delayed by 2 days; SDK notes required.' },
    actions: '3',
    aiStatus: { zh: '待处理', en: 'In Progress' },
        highlights: [
          { zh: '关键结论：Wi-Fi 功耗复测排期至 8/7。', en: 'Key: Wi-Fi power retest scheduled for 8/7.' },
          { zh: '待办：Jira 已创建 2/3 条行动项。', en: 'Follow-up: 2/3 action items tracked in Jira.' },
        ],
  },
  {
        meetingId: 'esp32-c6-weekly',
    date: '2025-07-29',
        title: { zh: 'ESP32-C6 项目周会', en: 'ESP32-C6 Weekly Sync' },
    type: { zh: '项目周会', en: 'Project Weekly' },
        summary: { zh: 'OTA 模块风险需持续关注，未关闭项带入下周。', en: 'OTA module risk carried over; open items tracked for next week.' },
    actions: '4',
    aiStatus: { zh: '草稿待确认', en: 'Draft Pending' },
        highlights: [
          { zh: 'OTA 稳定性风险已在连续两场周会中讨论，需明确关闭标准与责任人。', en: 'OTA stability risk discussed in two weekly syncs—define exit criteria and owner.' },
          { zh: '决策草案：先补集成测试用例再扩发布。', en: 'Draft decision: extend integration tests before wider rollout.' },
        ],
  },
  {
        meetingId: 'risk-sync',
    date: '2025-07-25',
        title: { zh: 'ESP32-C6 风险同步会', en: 'ESP32-C6 Risk Sync' },
    type: { zh: '风险同步会', en: 'Risk Sync' },
        summary: { zh: 'Blocker 与射频验证计划对齐，明确责任人。', en: 'Align RF validation plan with blockers and owners.' },
    actions: '2',
    aiStatus: { zh: '已完成', en: 'Done' },
        highlights: [
          { zh: '射频：实验室排期与驱动分支冻结点已对齐。', en: 'RF: lab slot aligned with driver branch freeze.' },
        ],
      },
    ],
    crossMeetingAlerts: [
      {
        id: 'ds-1',
        tone: 'warning',
        title: { zh: '连续 blocker', en: 'Repeated blocker' },
        body: {
          zh: 'OTA 稳定性风险已连续两次会议出现，建议尽快跟进并明确关闭条件。',
          en: 'OTA stability risk appeared in two consecutive meetings—follow up and define closure criteria.',
        },
      },
      {
        id: 'ds-2',
        tone: 'neutral',
        title: { zh: '重复出现的风险', en: 'Recurring risks' },
        body: {
          zh: 'Wi-Fi 功耗与 OTA 风险在多份纪要中反复出现，建议合并跟进并避免分散认领。',
          en: 'Wi-Fi power and OTA risk recur across minutes—consolidate ownership and follow-up.',
        },
      },
    ],
  },
  {
    id: 'smart-home',
    label: { zh: '智慧家居与连接', en: 'Smart Home & Connectivity' },
    aiBanner: {
      zh: 'Thread 认证与 Matter 1.3 互操作项在多次同步中反复出现，建议指定唯一负责人。',
      en: 'Thread cert and Matter 1.3 interop items keep resurfacing—assign a single owner.',
    },
    timeline: [
      {
        meetingId: 'matter-review',
        date: '2025-08-06',
        title: { zh: 'Matter 网关技术评审会', en: 'Matter Gateway Design Review' },
        type: { zh: '技术评审会', en: 'Technical Review' },
        summary: { zh: '网关 BOM 与 BOM 变更评审收口，待采购确认备料。', en: 'Gateway BOM review closing; procurement to confirm buys.' },
        actions: '6',
        aiStatus: { zh: '草稿待确认', en: 'Draft Pending' },
        highlights: [
          { zh: '决议：BOM 差异签字后归档至 Confluence。', en: 'Decision: archive BOM delta after sign-off.' },
          { zh: '阻塞：认证样机与产线样机版本号需统一。', en: 'Blocker: align cert vs line sample version numbers.' },
        ],
      },
      {
        meetingId: 'matter-review',
        date: '2025-07-18',
        title: { zh: 'Matter 互通联调周会', en: 'Matter Interop Weekly' },
        type: { zh: '项目周会', en: 'Project Weekly' },
        summary: { zh: 'SDK 与控制器配对场景补测，覆盖边界场景。', en: 'SDK and controller pairing retests for edge cases.' },
        actions: '4',
        aiStatus: { zh: '已完成', en: 'Done' },
        highlights: [
          { zh: '重要：Thread 边界路由场景仍缺 2 条用例。', en: 'Important: 2 Thread border-router cases still missing.' },
        ],
      },
    ],
    crossMeetingAlerts: [
      {
        id: 'sh-1',
        tone: 'warning',
        title: { zh: '认证与互操作', en: 'Certification & interop' },
        body: {
          zh: 'Thread 与 Matter 互操作项在 7/18 与 8/6 多场同步中仍未闭环，建议设统一里程碑与负责人。',
          en: 'Thread/Matter interop items remain open across 7/18 and 8/6 syncs—set one milestone and owner.',
        },
      },
      {
        id: 'sh-2',
        tone: 'info',
        title: { zh: '待补测试用例', en: 'Missing test cases' },
        body: {
          zh: 'Thread 边界路由仍有 2 条用例未覆盖，可能影响认证排期评估。',
          en: 'Two Thread border-router cases still missing—may affect certification schedule.',
        },
      },
    ],
  },
  {
    id: 'edge-industrial',
    label: { zh: '边缘与工业', en: 'Edge & Industrial' },
    aiBanner: {
      zh: '现场试跑磁盘空间与日志上传已连续两周在周会中讨论，仍未关闭。',
      en: 'Field-trial disk space and log uploads were discussed in two weekly syncs—still open.',
    },
    timeline: [
      {
        meetingId: 'esp32-p4-weekly',
        date: '2025-08-07',
        title: { zh: 'ESP32-P4 工业场景周会', en: 'ESP32-P4 Industrial Weekly' },
        type: { zh: '项目周会', en: 'Project Weekly' },
        summary: { zh: '工业网关现场试跑与远程 OTA 窗口对齐。', en: 'Align field gateway trial with remote OTA window.' },
        actions: '2',
        aiStatus: { zh: '已完成', en: 'Done' },
        highlights: [
          { zh: '关键：现场磁盘清理脚本已合入 release 分支。', en: 'Key: disk cleanup script merged to release branch.' },
          { zh: '风险：客户现场网络波动导致日志上传不完整。', en: 'Risk: unstable uplink caused incomplete log uploads.' },
        ],
      },
      {
        meetingId: 'esp32-p4-weekly',
        date: '2025-07-30',
        title: { zh: 'ESP32-P4 工业场景周会', en: 'ESP32-P4 Industrial Weekly' },
        type: { zh: '项目周会', en: 'Project Weekly' },
        summary: { zh: '现场试跑日志上传与磁盘清理策略初稿。', en: 'Draft policy for field trial logs and disk cleanup.' },
        actions: '3',
        aiStatus: { zh: '草稿待确认', en: 'Draft Pending' },
        highlights: [
          { zh: '现场日志与磁盘清理已多场讨论，建议统一责任人与截止时间。', en: 'Field logs and disk cleanup discussed in multiple syncs—align owner and due date.' },
        ],
      },
    ],
    crossMeetingAlerts: [
      {
        id: 'ei-1',
        tone: 'warning',
        title: { zh: '连续未关闭事项', en: 'Carry-over open items' },
        body: {
          zh: '现场日志上传与磁盘清理已连续两周在周会中出现，仍未关闭，建议指定单一负责人推进。',
          en: 'Log upload and disk cleanup recurred over two weekly syncs—assign one owner to close them.',
        },
      },
    ],
  },
]

/** 演示「多项目组」时的占位数据；线上可由接口按 program 拉取 */
const PROJECT_HISTORY_EXTRA_LABELS: { id: string; zh: string; en: string }[] = [
  { id: 'ph-audio', zh: '音频与语音', en: 'Audio & Voice' },
  { id: 'ph-wearable', zh: '可穿戴', en: 'Wearables' },
  { id: 'ph-security', zh: '安全与加密', en: 'Security & Crypto' },
  { id: 'ph-tools', zh: '开发者工具链', en: 'Developer Toolchain' },
  { id: 'ph-cloud', zh: '云连接服务', en: 'Cloud Connectivity' },
  { id: 'ph-motor', zh: '电机与运动控制', en: 'Motor & Motion' },
  { id: 'ph-pmic', zh: '电源管理', en: 'PMIC & Power' },
  { id: 'ph-display', zh: '显示与 HMI', en: 'Display & HMI' },
  { id: 'ph-ble', zh: '低功耗蓝牙', en: 'BLE' },
  { id: 'ph-wifi6', zh: 'Wi-Fi 6', en: 'Wi-Fi 6' },
  { id: 'ph-thread', zh: 'Thread / 15.4', en: 'Thread / 15.4' },
  { id: 'ph-automotive', zh: '车载与座舱', en: 'Automotive & Cockpit' },
  { id: 'ph-retail', zh: '商业与零售 IoT', en: 'Commercial & Retail IoT' },
  { id: 'ph-energy', zh: '表计与能源', en: 'Metering & Energy' },
  { id: 'ph-robotics', zh: '机器人与 AGV', en: 'Robotics & AGV' },
]

function placeholderProjectHistory(meta: { id: string; zh: string; en: string }, index: number): ProjectHistoryProjectData {
  const safeI = index
  const meetingIds = ['esp32-c6-weekly', 'matter-review', 'risk-sync', 'esp32-p4-weekly'] as const
  const mid = meetingIds[safeI % meetingIds.length]
  return {
    id: meta.id,
    label: { zh: meta.zh, en: meta.en },
    aiBanner: {
      zh: `${meta.zh} 近期会议关联较少，可在会议列表中确认项目组归属。`,
      en: `Few meetings linked to ${meta.en} recently—confirm program tags in Meetings.`,
    },
    timeline: [
      {
        meetingId: mid,
        date: `2025-${String(6 + (safeI % 3)).padStart(2, '0')}-${String(10 + (safeI % 18)).padStart(2, '0')}`,
        title: { zh: `${meta.zh} · 阶段同步`, en: `${meta.en} · Phase sync` },
        type: { zh: '项目周会', en: 'Project Weekly' },
        summary: {
          zh: '量产前检查清单与排期对齐示例纪要。',
          en: 'Sample minutes: pre-MP checklist and schedule alignment.',
        },
        actions: String(1 + (safeI % 4)),
        aiStatus: { zh: '已完成', en: 'Done' },
        highlights: [
          {
            zh: '示例数据：接入后端后可展示真实提取要点。',
            en: 'Demo data—real key points after backend integration.',
          },
        ],
      },
    ],
    crossMeetingAlerts: [
      {
        id: `${meta.id}-stub`,
        tone: 'info',
        title: { zh: '暂无风险信号', en: 'No risk signals' },
        body: {
          zh: '该项目组暂无额外风险摘要；有数据后将在此展示。',
          en: 'No extra risk summary for this program yet.',
        },
      },
    ],
  }
}

export const projectHistoryProjects: ProjectHistoryProjectData[] = [
  ...projectHistoryProjectsDetailed,
  ...PROJECT_HISTORY_EXTRA_LABELS.map((meta, index) => placeholderProjectHistory(meta, index)),
]

export const templateModules = [
  { name: 'Summary', enabled: true },
  { name: 'Decisions', enabled: true },
  { name: 'Action Items', enabled: true },
  { name: 'Risks & Blockers', enabled: true },
  { name: 'Open Questions', enabled: false },
]

export const templates = [
  { name: { zh: '项目周会模板', en: 'Project Weekly Template' }, version: 'v1.3', meetingType: { zh: '项目周会', en: 'Project Weekly' }, desc: { zh: 'v1.3 · 周会默认模板', en: 'v1.3 · Default for Weekly Syncs' } },
  { name: { zh: '技术评审模板', en: 'Technical Review Template' }, version: 'v1.1', meetingType: { zh: '技术评审会', en: 'Technical Review' }, desc: { zh: 'v1.1 · 精简技术评审模板', en: 'v1.1 · Precise, Tech Review' } },
  { name: { zh: '风险同步模板', en: 'Risk Sync Template' }, version: 'v1.0', meetingType: { zh: '风险同步会', en: 'Risk Sync' }, desc: { zh: 'v1.0', en: 'v1.0' } },
]

// Integrations & Admin page data
export const integrationCards = [
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: { zh: '会议来源', en: 'Meeting Source' },
    status: { zh: '已连接', en: 'Connected' },
    color: '#6366F1',
    icon: 'T',
  },
  {
    id: 'outlook',
    name: 'Outlook Exchange',
    description: { zh: '邮件与日历', en: 'Email & Calendar' },
    status: { zh: '已连接', en: 'Connected' },
    color: '#0284C7',
    icon: 'O',
  },
  {
    id: 'jira',
    name: 'Jira Cloud',
    description: { zh: '任务追踪', en: 'Task Tracking' },
    status: { zh: '已连接', en: 'Connected' },
    color: '#2563EB',
    icon: 'J',
  },
  {
    id: 'workday',
    name: 'Workday EHR',
    description: { zh: '人力与绩效', en: 'HR & Performance' },
    status: { zh: '启动中', en: 'Starting' },
    color: '#0284C7',
    icon: 'W',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: { zh: '消息沟通', en: 'Messaging' },
    status: { zh: '未连接', en: 'Disconnected' },
    color: '#E11D48',
    icon: 'S',
  },
]

export const meetingRoomTerminals = [
  {
    id: 'room-a',
    name: { zh: '会议室-V6（X90项目）', en: 'Meeting Room V6 (Project X90)' },
    description: { zh: '硬件音频终端', en: 'Hardware Audio Terminal' },
    status: 'online',
    ip: '192.168.1.104',
    firmware: 'v2.4.1',
    lastPing: { zh: '2 秒前', en: '2s ago' },
  },
  {
    id: 'room-b',
    name: { zh: '会议室-V8（Y20项目）', en: 'Meeting Room V8 (Project Y20)' },
    description: { zh: '硬件音频终端', en: 'Hardware Audio Terminal' },
    status: 'offline',
    ip: '192.168.1.109',
    firmware: 'v2.3.9',
    lastPing: { zh: '2 小时前', en: '2h ago' },
  },
]

/** Dashboard「System Status」：与集成页数据源一致，展示全部集成 + 会议室终端 */
export type DashboardSystemStatusRow = {
  id: string
  label: LocalizedText
  status: LocalizedText
  tone: 'success' | 'warning' | 'danger'
}

export const dashboardSystemStatusRows: DashboardSystemStatusRow[] = [
  ...integrationCards.map((card): DashboardSystemStatusRow => ({
    id: `integration-${card.id}`,
    label: { zh: card.name, en: card.name },
    status: card.status,
    tone:
      card.status.en === 'Connected'
        ? 'success'
        : card.status.en === 'Starting'
          ? 'warning'
          : 'danger',
  })),
  ...meetingRoomTerminals.map((term): DashboardSystemStatusRow => ({
    id: `terminal-${term.id}`,
    label: term.name,
    status:
      term.status === 'online'
        ? { zh: '终端 · 在线', en: 'Terminal · Online' }
        : { zh: '终端 · 离线', en: 'Terminal · Offline' },
    tone: term.status === 'online' ? 'success' : 'danger',
  })),
]

export const syncLogs = [
  { title: { zh: 'Jira 同步：Project 787 周会', en: 'Jira Sync: Project 787 Weekly Sync' }, detail: { zh: '2 分钟前', en: '2 mins ago' }, type: 'success' },
  { title: { zh: 'Outlook 同步失败：无效 token', en: 'Outlook Sync: Failed: Invalid token' }, detail: { zh: '18 分钟前', en: '18 mins ago' }, type: 'error' },
  { title: { zh: 'Teams 同步：Tom Holiday Meeting', en: 'Teams Sync: Tom Holiday Meeting' }, detail: { zh: '1 小时前', en: '1 hour ago' }, type: 'info' },
]

export const integrationRows = [
  { system: 'Teams', status: { zh: '已连接', en: 'Connected' }, time: '2025-08-05 10:21', result: { zh: '成功', en: 'Success' } },
  { system: 'Outlook', status: { zh: '已连接', en: 'Connected' }, time: '2025-08-05 10:23', result: { zh: '成功', en: 'Success' } },
  { system: 'Jira', status: { zh: '已连接', en: 'Connected' }, time: '2025-08-05 10:24', result: { zh: '成功', en: 'Success' } },
  { system: 'EHR', status: { zh: '已连接（只读）', en: 'Connected (read-only)' }, time: '2025-08-05 09:00', result: { zh: '成功', en: 'Success' } },
]
