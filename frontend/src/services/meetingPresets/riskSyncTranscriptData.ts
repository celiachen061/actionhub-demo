import type { LocalizedText } from '../../types/app'

/** X90 / risk-sync 会议全文与关键片段（供会议详情预设引用） */
export type TranscriptEntryData = {
  id: string
  speaker: string
  time: string
  key: boolean
  content: LocalizedText
  keyExcerpt?: LocalizedText
}

export const RISK_SYNC_TRANSCRIPT: TranscriptEntryData[] = [
  {
    id: 'x1',
    speaker: '张明',
    time: '10:02',
    key: false,
    content: {
      zh: '好，人差不多齐了，李华那边刚进来。能听到吗？好。今天这场是 X90 量产风险的同步会，会议室终端在录，后面 AI 会先出一版纪要草稿，我们人工再改。我先对齐一下议程：第一块是封装良率到底是不是趋势问题，别只在口头说「波动」；第二块是 Q3 产线排期要不要动正式版本，别各说各话；第三块是供应链哪些料要提前锁，避免又出现那种「实验室过了、线上放不了量」的尴尬。过程中谁要插话直接举手在聊天里打「1」，我这边控一下时间。另外销售那边昨天还在问交付窗口，我们今天内部先统一口径再对外。',
      en: 'Okay, most of us are here—Hua Li just joined. Can everyone hear me? Good. This is the X90 mass-production risk sync. The room terminal is recording; AI will draft minutes first and we will edit after. Three topics: first, whether packaging yield is a real trend, not just “noise”; second, whether we formally revise the Q3 line plan; third, which materials supply should lock early so we do not repeat “lab passes but we cannot ramp.” If you need the floor, type “1” in chat and I will queue you. Sales asked about delivery windows yesterday—we align internally first, then communicate outward.',
    },
  },
  {
    id: 'x2',
    speaker: '王工程师',
    time: '10:05',
    key: true,
    keyExcerpt: {
      zh: '封装良率 82%；主因温漂与焊点一致性。本周须把验证样本拉到 90%+，否则首批交付可能触发合同延期条款。',
      en: 'Packaging yield 82%; top drivers are thermal drift and solder consistency. Sampled validation must exceed 90% this week or first-batch delivery may hit contractual delay clauses.',
    },
    content: {
      zh: '我这边先抛数据。封装段现在锁在 82%，不是某一天抽风，是最近连续十二个班次都在 80% 到 84% 晃。我们拆 LOT 看了，温漂在高低温循环后偏移明显，焊点一致性在显微镜下也能看到虚焊倾向，这两块加起来大概解释了七成方差。上周 DOE 做了一轮，还没完全收敛，但方向是清楚的。内部对齐的目标是：本周五前同一批验证样本要拉到 90% 以上，不然和客户合同里写的首批交付节点对不上，法务那边已经提醒过延期条款了。我不是在制造焦虑，是想说现在不是讨论「有没有风险」，而是风险已经压在交付承诺上了。产线那边也抱怨，测试方案一天一变他们跟不上，所以我建议后面讨论先定「先保哪条验证路径」，别再并行扩太多口子。',
      en: 'Sharing numbers first. Packaging yield is stuck at 82%—not a one-day spike; twelve consecutive shifts sit between 80% and 84%. By LOT, thermal drift after temperature cycling is obvious, and solder consistency under the microscope shows marginal voiding; together they explain roughly 70% of variance. Last week’s DOE is not fully converged but directionally clear. Internal target: the same validation batch must clear 90% before Friday or we miss the first-batch milestone in the customer contract—legal already flagged delay clauses. This is not alarmism; risk is already on the delivery commitment. The line team also says the test plan changes daily and they cannot keep up, so I suggest we pick validation paths explicitly instead of opening too many parallel threads.',
    },
  },
  {
    id: 'x3',
    speaker: '张明',
    time: '10:08',
    key: true,
    keyExcerpt: {
      zh: '定为 blocker：暂停扩测，先打通关键路径。封装材料与测试夹具若错过窗口，良率回升也未必能立刻切量产。',
      en: 'Treat as blocker: pause scope expansion and clear the critical path. Miss the packaging material and fixture window and yield recovery may still not flip the line to MP.',
    },
    content: {
      zh: '好，王工这段我复述一下：82% 不是噪声，是结构问题，而且和合同节点绑死了。那这个在我这边就定性为 blocker，今天散会之前必须有权责和日期。我同意先别再加新的测试矩阵了，团队精力就那么多，先把关键路径跑通。我想追问赵总一句：供应链排期现在有没有已经被拖累？特别是封装基材和线上那套测试夹具，如果这周定不下来，下周就算良率突然上来，换型、校准、首件确认也要时间，产线不是开关一摁就量产。我们别自己骗自己说「再观察两天」，观察的代价是窗口直接没了。',
      en: 'Let me play back Wang: 82% is structural, not noise, and it is tied to contractual dates—so this is a blocker for me with owner and date before we leave. I agree we should not add new test matrices; bandwidth is finite—clear the critical path first. Zhao—has supply-chain schedule already slipped? Especially packaging substrate and the line test fixtures. If we do not lock this week, even a sudden yield rebound next week still needs changeover, calibration, and first-article sign-off—the line is not a light switch. Let us not pretend “two more days of watching” is free; the cost is losing the window.',
    },
  },
  {
    id: 'x4',
    speaker: '赵供应链',
    time: '10:10',
    key: true,
    keyExcerpt: {
      zh: '两种关键料交期未确认；周四前不定则 Q3 至少再挤一周。建议：无约 90% 预测则不放量，减少反复切换成本。',
      en: 'Two critical materials lack firm dates; without lock by Thursday Q3 slips at least another week. Proposal: no scale-up without ~90% forecast to cut thrash.',
    },
    content: {
      zh: '供应链视角我直说：现在最怕的是齐套率。两颗料，一颗载板一颗辅材，供应商口头说「尽量」，系统里 PO 还没闭环，物流那边也不敢占舱位。我自己的底线是本周四下班前要有书面交期或者明确的分批到货计划，否则 Q3 那条线的 slot 我只能往后让，至少一周，而且会影响旁边两个项目共线的产能。我们也可以先「保守锁量」，但财务会盯库存和现金占用，这个会上我不替财务拍板，只把利弊说清楚。业务上我建议定个门槛：没有大概九成把握的预测，就别喊放量，不然采购、计划、产线三方来回改单次数多了，组织成本比料本身还贵。谁要是觉得门槛太严，我们可以单独立会吵，但今天先把方向写进纪要里。',
      en: 'From supply chain: the scary part is kitting completeness. Two parts—substrate and a secondary material—vendors say “we will try,” but the PO is not closed in the system and logistics will not hold capacity. My line in the sand: by Thursday EOD I need written dates or a phased delivery plan; otherwise I push the Q3 slot at least one week and it hits two neighboring programs on shared capacity. We can “conservatively reserve” but finance will watch inventory and cash—I will not speak for them, just surface trade-offs. Operationally I want a gate: no scale-up call without ~90% confidence in the forecast, otherwise purchasing, planning, and the line thrash more than the parts cost. If that gate feels harsh, we can fight in another forum—but capture the direction in minutes today.',
    },
  },
  {
    id: 'x5',
    speaker: '李华',
    time: '10:16',
    key: false,
    content: {
      zh: '我补充实验室状态。封装线边实验室还有两台温箱和一台推拉力机没做完年度校准，证书流程卡在第三方实验室排队，我们内部先做内校，今天下午四点前能闭环，晚上可以补一张临时放行单给产线用。另外上周那批数据里有个别边缘点，我一开始以为是操作误差，后来对比日志发现那几个小时正好其中一台温箱门被频繁打开做中途加样，曲线不完整，这部分我会标成「待复测」，不混进本周基线。校准完我们会原 LOT 复跑一遍，如果分布收拢，再把旧数据是否纳入评审交给王工和主持人拍板。现场如果谁要原始 CSV，我丢在共享盘 X90-packaging 目录下了。',
      en: 'Lab status: two ovens and one bond-tester still need annual cal—third-party queue blocked certs, so we are doing internal cal first and should close by 4 PM today with a temporary line release tonight. Last week’s dataset has a few edge points; I first thought operator error, but logs show one oven door was opened often for mid-run loading, so curves are incomplete—I will mark those “pending retest” and exclude them from this week’s baseline. After cal we rerun the same LOT; if the distribution tightens, whether old data re-enters review is for Wang and the host to decide. Raw CSV is in the X90-packaging share if anyone needs it.',
    },
  },
  {
    id: 'x6',
    speaker: '王工程师',
    time: '10:24',
    key: true,
    keyExcerpt: {
      zh: '先锁定温漂与焊点两条验证路径；日更看板（上午数据完整度、下午良率与风险）。周五中午不达标则启动降级方案保交付。',
      en: 'Lock thermal drift and solder paths first; daily board (AM completeness, PM yield/risk). If still below target by Friday noon, trigger fallback to protect delivery.',
    },
    content: {
      zh: '那我建议把技术路线说死一点：就两条，温漂一条、焊点一条，别的「顺便看看」的先不进本周主线。每条路径拆成日更看板，上午十点半前更新数据完整度和样本量，下午五点前更新良率曲线和风险备注，颜色规则我们沿用 NPI 那套红黄绿。周五中午十二点如果还摸不到 90%，我这边会同步触发降级方案——比如先切备选封装工艺窗口、缩小首批交付范围那种——具体选项我周三前出一页纸给主持人审批，今天不展开细节。目标是别为了「一次爬坡到位」把交付节奏拖死，先保住对客户能说清楚的里程碑。',
      en: 'I want the technical path explicit: two tracks—thermal drift and solder—nothing “nice to have” enters this week’s spine. Each track gets a daily board: by 10:30 AM update completeness and sample count; by 5 PM update yield curve and risk notes using the NPI RAG scheme. If we are still short of 90% by Friday noon, I will trigger fallback—alternate packaging window, shrink first-batch scope, etc.—options on one pager for the host by Wednesday; no deep dive now. Goal is not a heroic one-shot ramp at the cost of a credible customer milestone.',
    },
  },
  {
    id: 'x7',
    speaker: '张明',
    time: '10:31',
    key: false,
    content: {
      zh: '行政事项我快说两句。所有 blocker 今天下班前登记到 Confluence 那页「X90 Risk Board」，字段就三列：风险级别、责任人、承诺完成时间，别写小作文。我六点前会在大群发一版里程碑快照，销售和管理层只看那一页，细节你们线下对齐。明天上午的站会如果还在对「什么叫暂缓」这种定义，我就直接打断了。今晚七点我给老板的邮件只收三条：最高优先级风险、对应动作、谁负责——背景故事不用贴，他们没时间看。谁有不同意见会后找我，别在纪要里藏分歧。',
      en: 'Quick admin: log every blocker on the Confluence “X90 Risk Board” before EOD—three columns: severity, owner, committed date—no essays. I will post a milestone snapshot to the large group before 6 PM; sales and execs read only that page—details offline. Tomorrow’s stand-up: if we are still debating what “hold” means, I will cut it off. The 7 PM exec email takes three bullets: top risk, action, owner—no backstory. Disagreements: find me after the call, not buried in minutes.',
    },
  },
  {
    id: 'x8',
    speaker: '赵供应链',
    time: '10:42',
    key: true,
    keyExcerpt: {
      zh: '周四前无约 90% 预测则 Q3 关键采购推迟一周；须发跨项目预警，纪要写明触发条件与责任人。',
      en: 'Without ~90% forecast by Thursday, defer key Q3 buys one week; send cross-program alert; minutes must state triggers and owners.',
    },
    content: {
      zh: '我把底线再说死一点：如果周四下班前工程侧给不出我认可的预测区间——不用精确到小数点后两位，但要约九成把握——我会把 Q3 关键物料的下单动作整体推迟一周。这不是惩罚谁，是库存风险实在扛不住。这个动作会波及两条并行项目线，我会提前发邮件预警，主题里写清楚「X90 封装风险外溢」，避免别的 PM 以为单纯缺料。最后一条，请主持人在对外纪要里把触发条件、责任人和时间写明白，以后审计问起来，我们拿得出「谁在什么时候按什么规则拍的板」，别到时候全是「会上好像说过」。',
      en: 'Stating the line again: if engineering cannot give me an acceptable forecast band by Thursday EOD—not to decimal places, but ~90% confidence—I defer key Q3 procurement one week. That is inventory risk, not punishment. It hits two parallel programs; I will email early with “X90 packaging spillover” in the subject so other PMs do not read it as generic shortage. Finally, please have the host minutes spell triggers, owners, and timing for external readers—when audit asks, we need “who decided what when under which rule,” not “we think someone said it in the meeting.”',
    },
  },
  {
    id: 'x9',
    speaker: '李华',
    time: '10:48',
    key: false,
    content: {
      zh: '有人问高低温循环的升降温斜率是不是和 NPI 阶段不一致——是的，量产线边设备为了节拍略快了一点，但还在规格书里写的允许范围内。如果我们要和实验室完全对齐，需要产线同意每轮多停十五分钟稳态，这个得计划排进去，不能口头说对齐。我这边可以出一页对比表，把 NPI、量产、客户 spec 三列并排放，周五中午前贴到 Risk Board 评论区，大家跟帖确认就行，不用再开半次会。',
      en: 'Question on ramp/soak slopes versus NPI—the line-side profile is slightly faster for takt but still inside the spec book. If we must match the lab exactly, we need fifteen extra minutes of soak per cycle scheduled into the plan—not a verbal “align.” I will post a one-pager comparing NPI, MP, and customer spec side by side by Friday noon on the Risk Board thread; confirm in comments instead of another half meeting.',
    },
  },
  {
    id: 'x10',
    speaker: '张明',
    time: '10:55',
    key: false,
    content: {
      zh: '好，时间差不多了。Action 我念一遍：赵总更新 Q3 排期与物料锁定表，王工周五前补验证方案加良率预估，李华把设备校准证明和复测计划挂上去。纪要由我先审一版，明天中午前发给大家改错别字。没有别的事我们就到这儿，线上同事可以退了，现场留下王工和赵总我们再对一下夹具窗口，两分钟。谢谢大家。',
      en: 'We are out of time. Actions: Zhao updates Q3 schedule and material lock table; Wang delivers validation plan plus yield forecast by Friday; Li posts cal certs and retest plan. I will first-pass the minutes; you get a typo pass before tomorrow noon. If nothing else, remote folks can drop; Wang and Zhao stay two minutes on fixtures window. Thanks everyone.',
    },
  },
]
