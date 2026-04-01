import type { LocalizedText } from '../types/app'
import { RISK_SYNC_TRANSCRIPT, type TranscriptEntryData } from './meetingPresets/riskSyncTranscriptData'

export type { TranscriptEntryData }

export type MeetingProvenanceSnapshot = {
  durationLine: LocalizedText
  outlook: {
    headline: LocalizedText
    syncDetail: LocalizedText
    graphSyncLine: LocalizedText
    eventIdMasked: LocalizedText
    eventIdFullTitle: LocalizedText
  }
  teams: {
    headline: LocalizedText
    detail: LocalizedText
  }
  transcript: {
    headline: LocalizedText
    sourcesLine: LocalizedText
    readyLine: LocalizedText
    mergeLine: LocalizedText
    provenanceBlurb: LocalizedText
  }
}

export type DecisionSnapshot = {
  id: string
  text: LocalizedText
  confidencePct: number
  confidenceReason: LocalizedText
}

export type RiskSnapshot = {
  id: string
  text: LocalizedText
  confidencePct: number
  confidenceReason: LocalizedText
}

export type MeetingActionSnapshot = {
  id: string
  owner: string
  deadline: string
  blocker: boolean
  evidenceId: string
  confidencePct: number
  confidenceReason: LocalizedText
  title: LocalizedText
  quote: LocalizedText
  jira: {
    projectKey: string
    issueType: string
    summary: LocalizedText
    description: LocalizedText
    labels: string
  }
}

export interface MeetingDetailSnapshot {
  meetingHeader: { title: LocalizedText; time: string }
  headerStatusBadge: LocalizedText
  participantFact: { heading: LocalizedText; names: LocalizedText }
  meetingProvenance: MeetingProvenanceSnapshot
  transcriptChips: { secondary: LocalizedText; primary: LocalizedText }
  outlookDraft: { to: LocalizedText; cc: LocalizedText; subject: LocalizedText }
  outlookBodyFull: LocalizedText
  executiveSummary: LocalizedText
  aiDraftConfidencePct: number
  transcriptEntries: TranscriptEntryData[]
  keyDecisions: DecisionSnapshot[]
  actionItems: MeetingActionSnapshot[]
  openRisks: RiskSnapshot[]
  crossMeetingMemory: { title: LocalizedText; quote: LocalizedText }
}

/** 将仅含 LocalizedText 叶子对象的快照合并进现有 reactive 树 */
export function patchLocalizedTree<T extends Record<string, unknown>>(target: T, src: T): void {
  for (const k of Object.keys(src) as (keyof T)[]) {
    const sv = src[k] as unknown
    const tv = target[k] as unknown
    if (sv && typeof sv === 'object' && 'zh' in (sv as object) && 'en' in (sv as object)) {
      ;(tv as LocalizedText).zh = (sv as LocalizedText).zh
      ;(tv as LocalizedText).en = (sv as LocalizedText).en
    }
    else if (sv && typeof sv === 'object' && tv && typeof tv === 'object') {
      patchLocalizedTree(tv as Record<string, unknown>, sv as Record<string, unknown>)
    }
  }
}

const RISK_SYNC_SNAPSHOT: MeetingDetailSnapshot = {
  meetingHeader: {
    title: { zh: 'X90 芯片量产风险同步会', en: 'X90 Mass Production Risk Sync' },
    time: '2026-03-16 10:00',
  },
  headerStatusBadge: { zh: '待确认', en: 'Needs Review' },
  participantFact: {
    heading: { zh: '参会人 (4)', en: 'Participants (4)' },
    names: {
      zh: '张明, 李华, 王工程师, 赵供应链',
      en: 'Ming Zhang, Hua Li, Engineer Wang, Supply Zhao',
    },
  },
  meetingProvenance: {
    durationLine: {
      zh: '时长 1h 30m（以 Outlook 预约起止为准）',
      en: 'Duration 1h 30m (from Outlook appointment)',
    },
    outlook: {
      headline: { zh: 'Outlook 日历（Graph event）', en: 'Outlook calendar (Graph event)' },
      syncDetail: {
        zh: '已与 Exchange 会议预约同步 · 组织者 张明',
        en: 'Synced with Exchange appointment · Organizer Ming Zhang',
      },
      graphSyncLine: {
        zh: 'Microsoft Graph 日历增量同步 · 2026-03-16 09:58',
        en: 'Microsoft Graph calendar delta sync · 2026-03-16 09:58',
      },
      eventIdMasked: {
        zh: '事件 ID AQMkAGI2…9P88（脱敏展示）',
        en: 'Event ID AQMkAGI2…9P88 (masked)',
      },
      eventIdFullTitle: {
        zh: '完整 ID 仅管理员与集成服务可见，对应 Microsoft Graph GET /me/events/{id}',
        en: 'Full ID visible to admins and integration only; maps to Graph GET /me/events/{id}',
      },
    },
    teams: {
      headline: { zh: 'Teams 联机会议', en: 'Teams online meeting' },
      detail: {
        zh: '已关联 onlineMeeting · 会后可通过 Graph 拉取 callTranscript',
        en: 'Linked onlineMeeting · callTranscript available via Graph after meeting',
      },
    },
    transcript: {
      headline: { zh: '音频转写', en: 'Audio transcript' },
      sourcesLine: {
        zh: 'Teams 会议转写（主）+ 会议室 Terminal V6 线路（备）',
        en: 'Teams meeting transcript (primary) + room Terminal V6 track (secondary)',
      },
      readyLine: {
        zh: 'Teams 转写就绪 11:47 · 终端 ASR 上传完成 11:52',
        en: 'Teams transcript ready 11:47 · Terminal ASR upload done 11:52',
      },
      mergeLine: {
        zh: '时间轴已按 UTC+8 对齐、去重并合并发言人',
        en: 'Timeline aligned to UTC+8, deduped, speakers merged',
      },
      provenanceBlurb: {
        zh: '下文时间线合并 Teams 与会议室终端两路来源；关键发言由 AI 从全文截取要点。',
        en: 'Timeline merges Teams and room-terminal feeds; key moments are AI excerpts from full text.',
      },
    },
  },
  transcriptChips: {
    secondary: { zh: 'Terminal V6', en: 'Terminal V6' },
    primary: { zh: '主：Teams 转写', en: 'Primary: Teams' },
  },
  outlookDraft: {
    to: { zh: '张明; 李华; 王工程师; 赵供应链', en: 'Ming Zhang; Hua Li; Engineer Wang; Supply Zhao' },
    cc: { zh: 'Project-X90-All', en: 'Project-X90-All' },
    subject: { zh: 'Minutes: X90 芯片量产风险同步会', en: 'Minutes: X90 Mass Production Risk Sync' },
  },
  outlookBodyFull: {
    zh:
      '各位好，\n\n以下是今日 X90 量产风险同步会的纪要草稿（AI 生成）。\n\n摘要：会议聚焦封装良率 82% 与 Q3 排期、关键料交期不确定性；已确认暂缓产线爬坡直至良率过线，并要求供应链周四前锁定交期或分批计划。\n\n关键决议与行动项见正文附件区块；推送前请主持人核对责任人及日期。\n\n谢谢，\n张明',
    en:
      "Hi team,\n\nHere are AI-generated minutes from today's X90 mass-production risk sync.\n\nSummary: We focused on 82% packaging yield, Q3 schedule, and uncertain critical-material dates. We agreed to hold line ramp until yield clears the gate, and supply chain must lock dates or phased plans by Thursday EOD.\n\nKey decisions and action items are in the structured blocks below—please verify owners and dates before send.\n\nThanks,\nMing Zhang",
  },
  executiveSummary: {
    zh: '本次会议主要讨论了 X90 芯片量产阶段在封装环节的验证风险及产能排期问题。目前良率停留在 82%，未达标引发了第一批交付延期风险。会议决定将封装问题列为最高优先级 blocker 进行攻关，并要求供应链同步调整 Q3 产能排期以减少物料风险。',
    en: 'The meeting focused on packaging-stage validation risks and production scheduling for X90 mass production. Yield remains at 82%, creating a delay risk for the first delivery batch. The team marked packaging issues as top-priority blockers and asked supply chain to adjust the Q3 production schedule to reduce material risk.',
  },
  aiDraftConfidencePct: 91,
  transcriptEntries: RISK_SYNC_TRANSCRIPT,
  keyDecisions: [
    {
      id: 'kd-1',
      text: {
        zh: '确认 Q3 产线排期计划暂缓推进，直到封装良率突破 90%。',
        en: 'Hold Q3 production ramp plan until packaging yield exceeds 90%.',
      },
      confidencePct: 93,
      confidenceReason: {
        zh: '发言人明确表态「暂缓推进」与良率门槛，与摘要中 blocker 讨论一致。',
        en: 'Speakers explicitly tied the ramp hold to the yield gate, aligned with blocker discussion in summary.',
      },
    },
    {
      id: 'kd-2',
      text: {
        zh: '封装验证方案需在周五前提交完整数据和预估报告。',
        en: 'Packaging validation plan must submit complete data and forecast by Friday.',
      },
      confidencePct: 90,
      confidenceReason: {
        zh: '王工程师承诺周五前交付，主持人复述了截止时间。',
        en: 'Engineer committed to Friday deadline; host repeated the due date in meeting.',
      },
    },
  ],
  actionItems: [
    {
      id: 'xa-1',
      owner: '赵供应链',
      deadline: '2026-03-18',
      blocker: true,
      evidenceId: 'x3',
      confidencePct: 84,
      confidenceReason: {
        zh: '会议记录 x3/x4 中直接讨论排期与物料卡住，与负责人角色一致。',
        en: 'Transcript x3/x4 discusses schedule and material block; assignee role matches.',
      },
      title: { zh: '更新 Q3 量产线排期并确认产能', en: 'Update Q3 production line schedule and confirm capacity' },
      quote: {
        zh: '“赵总，那个 Q3 的产线排期得抓紧更新，产能不确认后面的物料都卡住了。”',
        en: '"We need the Q3 line schedule update now; without capacity confirmation, materials will stall."',
      },
      jira: {
        projectKey: 'X90',
        issueType: 'Task',
        summary: { zh: '更新 Q3 量产线排期并确认产能', en: 'Update Q3 production line schedule and confirm capacity' },
        description: {
          zh: '背景：量产风险同步会确认封装与排期风险。\n验收：更新后的排期表经 PM 确认，并同步至供应链与项目组。',
          en: 'Context: risk sync on packaging and line schedule.\nDone when: updated schedule approved by PM and shared with supply chain.',
        },
        labels: 'mp-risk,capacity',
      },
    },
    {
      id: 'xa-2',
      owner: '王工程师',
      deadline: '2026-03-20',
      blocker: false,
      evidenceId: 'x2',
      confidencePct: 92,
      confidenceReason: {
        zh: '王工在 x2 陈述良率风险，主持人后续要求周五前补齐方案与预估。',
        en: 'Engineer stated yield risk in x2; host asked for plan and forecast by Friday.',
      },
      title: { zh: '补充封装验证方案与良率预估报告', en: 'Add packaging validation plan and yield forecast report' },
      quote: {
        zh: '“封装验证的方案还缺点数据，王工你周五前把验证方案和良率预估补一下。”',
        en: '"Packaging validation still lacks data; please deliver the plan and yield forecast by Friday."',
      },
      jira: {
        projectKey: 'X90',
        issueType: 'Task',
        summary: { zh: '补充封装验证方案与良率预估报告', en: 'Add packaging validation plan and yield forecast report' },
        description: {
          zh: '背景：当前良率 82%，需补齐验证数据与预估。\n验收：附件含验证计划、良率曲线与风险评估一页纸。',
          en: 'Context: yield at 82%; need validation data and forecast.\nDone when: plan, yield curve, and one-pager risk note attached.',
        },
        labels: 'packaging,yield',
      },
    },
  ],
  openRisks: [
    {
      id: 'risk-1',
      text: {
        zh: '良率不达标导致交付延期：目前供应链仍无法确认备用物料供应，若封装数据未通过，第一批交付将确定延迟至少 2 周。',
        en: 'Yield below target may delay delivery: fallback material supply is still unconfirmed; if packaging data fails, first batch delivery will slip by at least 2 weeks.',
      },
      confidencePct: 76,
      confidenceReason: {
        zh: 'x2 给出 82% 良率与延期可能，x4 提到物料与 Q3 排期挤压，属未关闭风险。',
        en: 'x2 cites 82% yield and delay risk; x4 notes materials and Q3 squeeze—risk remains open.',
      },
    },
  ],
  crossMeetingMemory: {
    title: { zh: 'X90 架构评审会 (3月10日)', en: 'X90 Architecture Review (Mar 10)' },
    quote: {
      zh: '“如果良率低于 85%，架构组需要提前两周启动降级方案。”',
      en: '"If yield stays below 85%, architecture team should start fallback planning two weeks earlier."',
    },
  },
}

const MATTER_REVIEW_SNAPSHOT: MeetingDetailSnapshot = {
  meetingHeader: {
    title: { zh: 'Matter 网关技术评审会', en: 'Matter Gateway Design Review' },
    time: '2025-08-06 14:00',
  },
  headerStatusBadge: { zh: '待确认', en: 'Needs Review' },
  participantFact: {
    heading: { zh: '参会人 (8)', en: 'Participants (8)' },
    names: {
      zh: '李丹, 陈远, 王靖, 张宁, 吴峰, 赵雅, 周启 等',
      en: 'Dan Li, Yuan Chen, Jing Wang, Ning Zhang, Feng Wu, Ya Zhao, Qi Zhou, …',
    },
  },
  meetingProvenance: {
    durationLine: {
      zh: '时长 1h 30m（以 Outlook 预约起止为准）',
      en: 'Duration 1h 30m (from Outlook appointment)',
    },
    outlook: {
      headline: { zh: 'Outlook 日历（Graph event）', en: 'Outlook calendar (Graph event)' },
      syncDetail: {
        zh: '已与 Exchange 会议预约同步 · 组织者 李丹',
        en: 'Synced with Exchange appointment · Organizer Dan Li',
      },
      graphSyncLine: {
        zh: 'Microsoft Graph 日历增量同步 · 2025-08-06 13:55',
        en: 'Microsoft Graph calendar delta sync · 2025-08-06 13:55',
      },
      eventIdMasked: {
        zh: '事件 ID AQMkADY3…k2F1（脱敏展示）',
        en: 'Event ID AQMkADY3…k2F1 (masked)',
      },
      eventIdFullTitle: {
        zh: '完整 ID 仅管理员与集成服务可见',
        en: 'Full ID visible to admins and integration only',
      },
    },
    teams: {
      headline: { zh: 'Teams 联机会议', en: 'Teams online meeting' },
      detail: {
        zh: '已启用实时字幕与会议录制 · 转写语言 zh-CN',
        en: 'Live captions and recording enabled · transcript locale zh-CN',
      },
    },
    transcript: {
      headline: { zh: '音频转写', en: 'Audio transcript' },
      sourcesLine: {
        zh: 'Teams 会议转写（唯一来源）',
        en: 'Teams meeting transcript (single source)',
      },
      readyLine: {
        zh: '转写就绪 14:12 · 说话人分离置信度 89%',
        en: 'Transcript ready 14:12 · diarization confidence 89%',
      },
      mergeLine: {
        zh: '已剔除静音段与重复口头禅；术语表已套用 Matter / Thread 词库',
        en: 'Silence and repeated fillers removed; Matter / Thread glossary applied',
      },
      provenanceBlurb: {
        zh: '下文为 Teams 单路转写；关键发言由 AI 按议题聚类截取。',
        en: 'Single-source Teams transcript below; key moments are AI-clustered by topic.',
      },
    },
  },
  transcriptChips: {
    secondary: { zh: '无会议室终端', en: 'No room terminal' },
    primary: { zh: '主：Teams 转写', en: 'Primary: Teams' },
  },
  outlookDraft: {
    to: { zh: '陈远; 王靖; 张宁', en: 'Yuan Chen; Jing Wang; Ning Zhang' },
    cc: { zh: 'Matter-Gateway-Core; 李丹', en: 'Matter-Gateway-Core; Dan Li' },
    subject: { zh: 'Minutes: Matter 网关技术评审会', en: 'Minutes: Matter Gateway Design Review' },
  },
  outlookBodyFull: {
    zh:
      '各位好，\n\n以下是 Matter 网关技术评审会的纪要草稿（AI 生成）。\n\n摘要：评审了 Thread Border Router 与 Wi‑Fi 共存策略、OTA 回滚窗口及 CSA 认证资料包缺口；同意先冻结网关 SDK 1.4.x 分支，仅合入 P0 缺陷修复，认证测试用例由测试组周五前补齐清单。\n\n详细决议与 Jira 草稿见系统内嵌卡片，请核对负责人字段。\n\n李丹',
    en:
      'Hi all,\n\nAI-generated minutes from the Matter gateway design review.\n\nSummary: We reviewed Thread border-router behavior, Wi-Fi coexistence, OTA rollback window, and gaps in the CSA certification bundle. We agreed to freeze gateway SDK 1.4.x for P0 fixes only, and QA will publish the certification test checklist by Friday.\n\nDecisions and Jira drafts are in the in-app cards—please verify assignees.\n\nDan Li',
  },
  executiveSummary: {
    zh: '会议围绕 Matter 网关参考设计的架构边界与认证路径展开。主要争议在 Thread BR 与 2.4G Wi‑Fi 共存的射频隔离策略，以及 OTA 失败回滚是否保留用户配网数据。结论是先按 CSA 测试计划锁定 P0 行为，SDK 在 1.4.x 分支冻结两周，仅接受缺陷修复；认证资料包由测试牵头在周五前输出缺口表。',
    en: 'The review focused on architecture boundaries and certification path for the Matter gateway reference design. Key debate covered RF isolation between the Thread BR and 2.4 GHz Wi-Fi coexistence, and whether OTA rollback preserves user commissioning data. We agreed to align with the CSA test plan for P0 behavior, freeze the SDK on 1.4.x for two weeks for bugfix-only merges, and have QA publish a certification gap list by Friday.',
  },
  aiDraftConfidencePct: 88,
  transcriptEntries: [
    {
      id: 'm1',
      speaker: '李丹',
      time: '14:02',
      key: false,
      content: {
        zh: '今天目标是把网关侧 Thread BR 的行为边界讲清楚，别让固件和射频各说各话。后面还有 OTA 和认证资料两块，如果时间不够认证我们单开子线程跟进。',
        en: 'Goal today is to clarify Thread BR behavior on the gateway side so firmware and RF are not talking past each other. We also have OTA and certification packs—if we run short, we spin a sub-thread for cert.',
      },
    },
    {
      id: 'm2',
      speaker: '陈远',
      time: '14:06',
      key: true,
      keyExcerpt: {
        zh: 'BR 不得在未完成分区擦除前广播「已就绪」；与 CSA P0 用例 3.2 冲突的固件行为必须本周内改掉。',
        en: 'BR must not advertise “ready” before partition erase completes; firmware behaviors conflicting with CSA P0 case 3.2 must be fixed this week.',
      },
      content: {
        zh: '架构上我坚持一点：Border Router 在工厂分区没擦除完之前，不能对外发「ready」类 mDNS 广播，否则认证测试会判失败，而且和用户文档写的冷启动流程也不一致。现在日志里能看到两次竞态，都是 Wi‑Fi 先起来 Thread 后起来导致的。建议固件把 BR 就绪门闩和 Wi‑Fi STA 解耦，具体补丁我可以和 Jason 对一下接口表。',
        en: 'Architecturally I insist: the BR must not emit “ready”-style mDNS before factory partitions finish erase—cert tests fail and it mismatches the cold-boot doc. Logs show two races when Wi-Fi comes up before Thread. I suggest decoupling the BR ready latch from Wi-Fi STA; I will align the API table with Jason.',
      },
    },
    {
      id: 'm3',
      speaker: '王靖',
      time: '14:14',
      key: true,
      keyExcerpt: {
        zh: 'SDK 1.4.x 冻结两周：仅 P0；1.5 特性分支暂停合入网关仓库。',
        en: 'Freeze SDK 1.4.x for two weeks: P0 only; pause merging 1.5 feature branch into the gateway repo.',
      },
      content: {
        zh: '从 SDK 角度我同意冻结。1.4.x 上还有三个 P0 是配网超时和订阅表损坏，我今晚发版候选。1.5 的 multi-admin 预览先别进网关主线，否则认证矩阵要重跑。冻结窗口我写到 release note 里，Jira 用标签 sdk-freeze-aug。',
        en: 'SDK agrees to the freeze. Three P0s remain on 1.4.x—commissioning timeout and sub table corruption—I will ship an RC tonight. Keep 1.5 multi-admin preview off the gateway mainline or the cert matrix reruns. I will document the freeze window in release notes and tag Jira sdk-freeze-aug.',
      },
    },
    {
      id: 'm4',
      speaker: '张宁',
      time: '14:22',
      key: false,
      content: {
        zh: '测试这边已经和 CSA 文档对了两轮，缺口主要在 OTA 断电恢复和 Thread 掉网后的重连时序。周五前我出一页「用例 ↔ 版本」矩阵，标红的是现在测不过的。',
        en: 'QA aligned twice with the CSA doc; gaps are mainly OTA power-cut recovery and Thread reconnect timing after drop. I will publish a case-to-build matrix by Friday with reds for failing cases.',
      },
    },
    {
      id: 'm5',
      speaker: '吴峰',
      time: '14:28',
      key: true,
      keyExcerpt: {
        zh: 'OTA 回滚失败时保留网络凭证：产品同意，但须在隐私说明中披露可能残留状态。',
        en: 'On OTA rollback failure, keep network credentials: PM agrees, but privacy note must disclose possible residual state.',
      },
      content: {
        zh: '产品上我希望回滚失败时不要清空用户 Wi‑Fi 凭证，否则客服电话会爆。法律和合规如果担心残留状态，我们在隐私更新里写清楚「失败回滚可能保留部分网络上下文」，不比静默清数据更差。',
        en: 'Product-wise I want rollback failures not to wipe Wi-Fi credentials or support will explode. If legal worries about residual state, we disclose in the privacy update that “failed rollback may retain partial network context”—better than silent wipe.',
      },
    },
    {
      id: 'm6',
      speaker: '李丹',
      time: '14:40',
      key: false,
      content: {
        zh: '好，那纪要里写三条：BR 就绪门闩、SDK 冻结窗口、OTA 凭证策略。认证矩阵周五作为附件跟进，不进今天这封邮件正文太长。',
        en: 'Minutes will capture three items: BR ready latch, SDK freeze window, OTA credential policy. Cert matrix Friday as an attachment—keep this email short.',
      },
    },
  ],
  keyDecisions: [
    {
      id: 'mk-1',
      text: {
        zh: 'Thread Border Router 就绪信号与 Wi‑Fi STA 解耦，禁止分区未就绪时对外宣告可用。',
        en: 'Decouple Thread BR readiness signaling from Wi-Fi STA; do not advertise availability before partitions are ready.',
      },
      confidencePct: 91,
      confidenceReason: {
        zh: '陈远在 m2 明确架构约束，主持人未提出反对。',
        en: 'Chen stated the architectural constraint in m2; host did not object.',
      },
    },
    {
      id: 'mk-2',
      text: {
        zh: '网关 SDK 1.4.x 进入两周缺陷修复冻结，1.5 特性暂停合入主线直至认证矩阵更新。',
        en: 'Gateway SDK 1.4.x enters a two-week bugfix-only freeze; 1.5 features pause merge until the cert matrix updates.',
      },
      confidencePct: 89,
      confidenceReason: {
        zh: '王靖在 m3 承诺发 RC 并说明标签策略。',
        en: 'Wang committed to RC and tagging strategy in m3.',
      },
    },
  ],
  actionItems: [
    {
      id: 'ma-1',
      owner: '王靖',
      deadline: '2025-08-08',
      blocker: true,
      evidenceId: 'm3',
      confidencePct: 87,
      confidenceReason: {
        zh: 'SDK 冻结与 RC 交付在 m3 由王靖认领。',
        en: 'SDK freeze and RC delivery owned by Wang in m3.',
      },
      title: { zh: '发布 SDK 1.4.x RC 并打上冻结标签', en: 'Ship SDK 1.4.x RC with freeze tags' },
      quote: {
        zh: '“今晚发版候选，Jira 用标签 sdk-freeze-aug。”',
        en: '"RC tonight; tag Jira sdk-freeze-aug."',
      },
      jira: {
        projectKey: 'MATTER',
        issueType: 'Task',
        summary: { zh: 'SDK 1.4.x RC + 冻结窗口', en: 'SDK 1.4.x RC + freeze window' },
        description: {
          zh: '背景：网关技术评审会。\n验收：RC 构建号、release note、Jira 标签 sdk-freeze-aug。',
          en: 'Context: gateway design review.\nDone when: RC build, release notes, Jira tag sdk-freeze-aug.',
        },
        labels: 'sdk-freeze,cert-blocker',
      },
    },
    {
      id: 'ma-2',
      owner: '张宁',
      deadline: '2025-08-08',
      blocker: false,
      evidenceId: 'm4',
      confidencePct: 85,
      confidenceReason: {
        zh: '张宁在 m4 承诺周五前矩阵，此处提前为评审闭环。',
        en: 'Zhang promised the matrix by Friday in m4; due pulled earlier for review closure.',
      },
      title: { zh: '输出 CSA 认证用例与版本对照矩阵', en: 'Publish CSA certification case-to-build matrix' },
      quote: {
        zh: '“周五前我出一页用例和版本矩阵，标红测不过的。”',
        en: '"I will publish the case-to-build matrix by Friday with reds for failing cases."',
      },
      jira: {
        projectKey: 'MATTER',
        issueType: 'Task',
        summary: { zh: 'CSA 用例矩阵', en: 'CSA case matrix' },
        description: {
          zh: '背景：认证资料缺口。\n验收：共享链接 + 标红项对应 Jira 子任务。',
          en: 'Context: certification gaps.\nDone when: shared link + red items filed as Jira subtasks.',
        },
        labels: 'cert,qa',
      },
    },
  ],
  openRisks: [
    {
      id: 'mr-1',
      text: {
        zh: '射频共存实机环境与实验室传导结果仍存在偏差，可能导致 CSA 复测追加一轮。',
        en: 'RF coexistence in the field still diverges from conducted lab results, risking an extra CSA retest cycle.',
      },
      confidencePct: 71,
      confidenceReason: {
        zh: 'm2 提到竞态与 Wi‑Fi/Thread 时序，尚未有封闭实验报告。',
        en: 'm2 notes race and Wi-Fi/Thread timing; no closed-loop lab report yet.',
      },
    },
  ],
  crossMeetingMemory: {
    title: { zh: 'Matter 1.2 迁移评审 (7月22日)', en: 'Matter 1.2 migration review (Jul 22)' },
    quote: {
      zh: '“多管理员场景下订阅表损坏被列为 P0，必须在任何认证构建前修复。”',
      en: '"Sub table corruption under multi-admin was flagged P0 and must be fixed before any cert build."',
    },
  },
}

const ESP32_C6_SNAPSHOT: MeetingDetailSnapshot = {
  meetingHeader: {
    title: { zh: 'ESP32-C6 项目周会', en: 'ESP32-C6 Weekly Sync' },
    time: '2025-08-05 09:30',
  },
  headerStatusBadge: { zh: '待确认', en: 'Needs Review' },
  participantFact: {
    heading: { zh: '参会人 (8)', en: 'Participants (8)' },
    names: {
      zh: 'Emily Chen, Jason Liu, Alec Zhou, Lily Wang, Tom Lee, Ivy Xu 等',
      en: 'Emily Chen, Jason Liu, Alec Zhou, Lily Wang, Tom Lee, Ivy Xu, …',
    },
  },
  meetingProvenance: {
    durationLine: {
      zh: '时长 45m（以 Outlook 预约起止为准）',
      en: 'Duration 45m (from Outlook appointment)',
    },
    outlook: {
      headline: { zh: 'Outlook 日历（Graph event）', en: 'Outlook calendar (Graph event)' },
      syncDetail: {
        zh: '混合会议：现场会议室 B12 + Teams · 组织者 Emily Chen',
        en: 'Hybrid: room B12 + Teams · Organizer Emily Chen',
      },
      graphSyncLine: {
        zh: 'Microsoft Graph 日历增量同步 · 2025-08-05 09:22',
        en: 'Microsoft Graph calendar delta sync · 2025-08-05 09:22',
      },
      eventIdMasked: {
        zh: '事件 ID AQMkAGE5…m7Q2（脱敏展示）',
        en: 'Event ID AQMkAGE5…m7Q2 (masked)',
      },
      eventIdFullTitle: {
        zh: '完整 ID 仅管理员与集成服务可见',
        en: 'Full ID visible to admins and integration only',
      },
    },
    teams: {
      headline: { zh: 'Teams 联机会议', en: 'Teams online meeting' },
      detail: {
        zh: '会议室拾音已桥接至 Teams · 本地录音用于 ASR 纠错',
        en: 'Room audio bridged to Teams · local recording used for ASR correction',
      },
    },
    transcript: {
      headline: { zh: '音频转写', en: 'Audio transcript' },
      sourcesLine: {
        zh: 'Teams 转写（主）+ 会议室 Logger B 线路（备）',
        en: 'Teams transcript (primary) + room Logger B track (secondary)',
      },
      readyLine: {
        zh: 'Teams 转写就绪 09:35 · Logger B 上传完成 09:41',
        en: 'Teams transcript ready 09:35 · Logger B upload done 09:41',
      },
      mergeLine: {
        zh: '已对齐会议号与发言人显示名；重复句已合并',
        en: 'Aligned conference ID and display names; duplicated phrases merged',
      },
      provenanceBlurb: {
        zh: '下文合并 Teams 与会议室 Logger 两路；关键发言与行动项提取置信度略低于纯线上会。',
        en: 'Merged Teams and room logger feeds; extraction confidence slightly lower than online-only meetings.',
      },
    },
  },
  transcriptChips: {
    secondary: { zh: 'Logger B', en: 'Logger B' },
    primary: { zh: '主：Teams 转写', en: 'Primary: Teams' },
  },
  outlookDraft: {
    to: { zh: 'Jason Liu; Alec Zhou; Lily Wang', en: 'Jason Liu; Alec Zhou; Lily Wang' },
    cc: { zh: 'ESP32-C6-Core; Digital-Solutions-PMO', en: 'ESP32-C6-Core; Digital-Solutions-PMO' },
    subject: { zh: 'Minutes: ESP32-C6 项目周会', en: 'Minutes: ESP32-C6 Weekly Sync' },
  },
  outlookBodyFull: {
    zh:
      'Hi team,\n\n以下是 ESP32-C6 项目周会的纪要草稿（AI 生成）。\n\n摘要：Wi‑Fi 6 认证测试还剩 2 项环境依赖；RC2 分支计划 8/12 冻结；三个高优缺陷（蓝牙共存、低功耗唤醒、CI  flaky）已分配负责人与目标日期。\n\n行动项与 Jira 草稿如下文结构化区块。\n\nEmily',
    en:
      'Hi team,\n\nAI-generated minutes for the ESP32-C6 weekly sync.\n\nSummary: Two Wi-Fi 6 cert tests remain blocked on lab environment; RC2 branch freeze targeted Aug 12; three high-priority bugs (BT coexistence, LP wake, CI flaky) now have owners and target dates.\n\nAction items and Jira drafts are in the structured blocks below.\n\nEmily',
  },
  executiveSummary: {
    zh: '周会回顾了 C6 Wi‑Fi 6 认证进度、即将冻结的 RC2 分支与未关闭缺陷。认证实验室环境还差两台干扰源设备到位，预计影响 3 个工作日。固件侧优先处理蓝牙共存回归与低功耗唤醒误触发；CI 上 flaky 测试已定位到时序竞态，Alec 负责周三前合入稳定化补丁。产品运营确认对外里程碑文案与内部冻结日一致。',
    en: 'The weekly sync covered C6 Wi-Fi 6 certification progress, the upcoming RC2 freeze, and open defects. The cert lab is still waiting on two interference sources, likely impacting three business days. Firmware prioritizes BT coexistence regression and false LP wake triggers; Alec owns a timing-race fix for flaky CI by Wednesday. Product ops confirmed external milestone copy matches the internal freeze date.',
  },
  aiDraftConfidencePct: 94,
  transcriptEntries: [
    {
      id: 'c1',
      speaker: 'Emily Chen',
      time: '09:32',
      key: false,
      content: {
        zh: '我们按议程走：认证、RC2、缺陷 triage。今天控制在四十五分钟内，超时的议题记到 parking lot。',
        en: 'Agenda: certification, RC2, bug triage. Keep it under forty-five minutes; park overflow topics.',
      },
    },
    {
      id: 'c2',
      speaker: 'Jason Liu',
      time: '09:34',
      key: true,
      keyExcerpt: {
        zh: 'Wi‑Fi 6 认证剩余 2 项依赖实验室干扰源；预计阻塞至下周三除非设备提前到货。',
        en: 'Two Wi-Fi 6 cert cases blocked on lab interference gear; likely blocked until next Wednesday unless gear arrives early.',
      },
      content: {
        zh: '认证那边回邮件了：还有两项是干扰源配置，不是固件逻辑问题。设备采购单在流程里，乐观周五到，保守下周三。我们不能在 RC2 里为了等实验室去拖无上限，所以建议把这两项标成「环境依赖」在对外状态里写清楚，别让销售以为我们在改代码。',
        en: 'Cert team replied: two cases are interference setup, not firmware logic. PO is in flight—optimistic Friday, conservative next Wednesday. We should not let RC2 slip indefinitely for the lab, so mark these as “environment dependency” externally so sales does not think we are still coding.',
      },
    },
    {
      id: 'c3',
      speaker: 'Alec Zhou',
      time: '09:40',
      key: true,
      keyExcerpt: {
        zh: 'RC2 冻结日维持 8/12；仅接受 P0/P1 与 CI 稳定化 PR。',
        en: 'RC2 freeze stays Aug 12; only P0/P1 and CI stabilization PRs.',
      },
      content: {
        zh: '我同意 Jason 的切分。RC2 freeze 还是 8/12，晚上我会锁分支权限，只放行标了 p0/p1 或 ci-stability 的 PR。那个 nightly flaky 我复现了，是初始化顺序问题，patch 已经在我分支上跑绿两轮了，周三前合入。',
        en: 'I agree with Jason’s split. RC2 freeze remains Aug 12; I will lock branch permissions tonight and only allow PRs tagged p0/p1 or ci-stability. I reproduced the nightly flaky—init ordering—and the patch is green twice on my branch; merge before Wednesday.',
      },
    },
    {
      id: 'c4',
      speaker: 'Tom Lee',
      time: '09:46',
      key: false,
      content: {
        zh: '硬件实验室可以借一台频谱仪给认证用，但要走资产借用单，我下午把单号发到频道里。',
        en: 'HW lab can loan a spectrum analyzer for cert, but needs an asset checkout form—I will post the ticket ID this afternoon.',
      },
    },
    {
      id: 'c5',
      speaker: 'Lily Wang',
      time: '09:50',
      key: true,
      keyExcerpt: {
        zh: '对外里程碑页更新为「RC2 8/12 冻结；认证完成待实验室设备」避免与内部口径冲突。',
        en: 'Public milestone page updated: RC2 freeze Aug 12; cert completion pending lab gear—avoid conflicting internal wording.',
      },
      content: {
        zh: '我对销售同步了一版：RC2 冻结日期写死 8/12，认证完成写成依赖实验室设备到货，不承诺具体证书日期。官网上那句「夏季发布」我改成「RC2 夏季交付，认证随后」，避免法务挑刺。',
        en: 'I aligned sales: RC2 freeze fixed at Aug 12; cert completion tied to lab gear arrival without promising certificate date. I changed the site line from “summer launch” to “RC2 summer delivery, certification follows” to reduce legal nitpicks.',
      },
    },
    {
      id: 'c6',
      speaker: 'Emily Chen',
      time: '09:55',
      key: false,
      content: {
        zh: '行动项我总结：Jason 更新认证状态页，Alec 合 CI patch，Tom 借仪器单号，Lily 发对外公告草稿给我过目。散会。',
        en: 'Actions: Jason updates cert status page, Alec merges CI patch, Tom posts loan ticket, Lily sends external comms draft for my review. Done.',
      },
    },
  ],
  keyDecisions: [
    {
      id: 'ck-1',
      text: {
        zh: 'RC2 分支于 8/12 冻结；仅合并 P0/P1 与 CI 稳定化相关提交。',
        en: 'Freeze RC2 branch on Aug 12; merge only P0/P1 and CI stabilization changes.',
      },
      confidencePct: 92,
      confidenceReason: {
        zh: 'Alec 在 c3 明确冻结策略与权限计划。',
        en: 'Alec stated freeze policy and permission plan in c3.',
      },
    },
    {
      id: 'ck-2',
      text: {
        zh: 'Wi‑Fi 6 认证未完成项按「环境依赖」对外披露，不与固件缺陷混报。',
        en: 'Report remaining Wi-Fi 6 cert items as environment-dependent, not bundled as firmware defects.',
      },
      confidencePct: 88,
      confidenceReason: {
        zh: 'Jason c2 与 Lily c5 对外口径一致。',
        en: 'Jason in c2 and Lily in c5 align external messaging.',
      },
    },
  ],
  actionItems: [
    {
      id: 'ca-1',
      owner: 'Jason Liu',
      deadline: '2025-08-06',
      blocker: false,
      evidenceId: 'c2',
      confidencePct: 90,
      confidenceReason: {
        zh: 'Emily 在 c6 指派 Jason 更新认证状态页。',
        en: 'Emily assigned Jason to update cert status in c6.',
      },
      title: { zh: '更新 Wi‑Fi 6 认证状态页（环境依赖标注）', en: 'Update Wi-Fi 6 cert status page (env dependency tags)' },
      quote: {
        zh: '“把这两项标成环境依赖，别让销售以为我们在改代码。”',
        en: '"Mark these as environment dependency so sales does not think we are still coding."',
      },
      jira: {
        projectKey: 'C6',
        issueType: 'Task',
        summary: { zh: '认证状态页更新', en: 'Cert status page update' },
        description: {
          zh: '背景：周会。\n验收：Confluence 页更新 + 销售群公告链接。',
          en: 'Context: weekly sync.\nDone when: Confluence updated + link posted to sales channel.',
        },
        labels: 'cert,comms',
      },
    },
    {
      id: 'ca-2',
      owner: 'Alec Zhou',
      deadline: '2025-08-07',
      blocker: true,
      evidenceId: 'c3',
      confidencePct: 93,
      confidenceReason: {
        zh: 'Alec 在 c3 承诺周三前合入 CI 稳定化补丁。',
        en: 'Alec committed to merge CI stabilization before Wednesday in c3.',
      },
      title: { zh: '合入 nightly flaky 修复（初始化顺序）', en: 'Merge nightly flaky fix (init ordering)' },
      quote: {
        zh: '“patch 已经在我分支上跑绿两轮了，周三前合入。”',
        en: '"Patch is green twice on my branch; merge before Wednesday."',
      },
      jira: {
        projectKey: 'C6',
        issueType: 'Bug',
        summary: { zh: '修复 CI nightly 时序竞态', en: 'Fix CI nightly timing race' },
        description: {
          zh: '背景：初始化顺序导致 flaky。\n验收：main 上连续 5 次 nightly 绿。',
          en: 'Context: init ordering race.\nDone when: five consecutive green nightlies on main.',
        },
        labels: 'ci,flaky',
      },
    },
  ],
  openRisks: [
    {
      id: 'cr-1',
      text: {
        zh: '认证实验室干扰源设备到货延迟可能导致证书签发整体后移一周，影响部分渠道上架承诺。',
        en: 'Delayed arrival of cert lab interference gear may push certificate issuance ~1 week, impacting some channel commitments.',
      },
      confidencePct: 68,
      confidenceReason: {
        zh: 'Jason 在 c2 给出周五/下周三两种到货预期。',
        en: 'Jason gave Friday vs next-Wednesday arrival bands in c2.',
      },
    },
  ],
  crossMeetingMemory: {
    title: { zh: 'ESP32-C6 Alpha 评审 (7月30日)', en: 'ESP32-C6 Alpha review (Jul 30)' },
    quote: {
      zh: '“低功耗唤醒误触发若带入 RC，渠道返修成本按模型估算会超阈值。”',
      en: '"If LP false wake ships in RC, modeled channel return cost exceeds threshold."',
    },
  },
}

const PRESETS: Record<string, MeetingDetailSnapshot> = {
  'risk-sync': RISK_SYNC_SNAPSHOT,
  'matter-review': MATTER_REVIEW_SNAPSHOT,
  'esp32-c6-weekly': ESP32_C6_SNAPSHOT,
}

export function getMeetingDetailSnapshot(meetingId: string): MeetingDetailSnapshot {
  return PRESETS[meetingId] ?? RISK_SYNC_SNAPSHOT
}

export function cloneSnapshotArrays(snapshot: MeetingDetailSnapshot) {
  return {
    transcriptEntries: JSON.parse(JSON.stringify(snapshot.transcriptEntries)) as TranscriptEntryData[],
    keyDecisions: JSON.parse(JSON.stringify(snapshot.keyDecisions)) as DecisionSnapshot[],
    actionItems: JSON.parse(JSON.stringify(snapshot.actionItems)) as MeetingActionSnapshot[],
    openRisks: JSON.parse(JSON.stringify(snapshot.openRisks)) as RiskSnapshot[],
  }
}
