# PRD-draft

# 1. 产品概述

## 1.1 项目背景
Espressif 当前内部混合会议流程主要依赖 Teams / Outlook 订会，会议过程中常由参会人人工记录，或使用录屏方式保留内容，但录屏通常不会被回看。会议结束后，主持人或 PM 需要手动整理纪要，通过 Outlook 发给参会人，并将会议中的 action items 手动录入 Jira。EHR 主要承担 HR 流程待办与内部通知能力，但尚未与会议结果形成稳定衔接。

在该模式下，线下会议室 + Teams 线上参会的混合会议场景存在明显效率损耗：
- 会后纪要整理耗时高
- action items 纯手动创建且容易遗漏
- 历史会议内容未形成项目级连续资产
- 会议录音 / 录屏与实际 follow-up 之间存在断层

## 1.2 Mission
打造一个面向 Espressif 内部混合会议场景的会议决议与行动项推进平台，连接 Teams / Outlook / 会议室终端 / Jira / EHR，把“录了但没人看、会后人工整理、任务手动创建、历史会议割裂”的流程，升级为“结构化纪要 + 任务路由 + 历史追踪”的闭环协同系统。

## 1.3 用户画像 Persona

### Persona A：项目经理 / PM（核心用户）
- 目标：快速完成纪要确认、行动项明确、邮件发送、Jira 建单
- 痛点：会后整理耗时，任务创建手动且易漏，历史会议无法追踪
- 高频动作：确认纪要、修改 owner / deadline、发送邮件、同步 Jira

### Persona B：研发负责人 / Tech Lead（核心用户）
- 目标：快速看到决议、风险、blocker、重点 action items
- 痛点：讨论多但结论分散，后续推进责任不清
- 高频动作：查看会议结果、确认 blocker、补充技术任务信息

### Persona C：参会成员（辅助用户）
- 目标：会后快速收到纪要和分配给自己的 action items
- 痛点：经常只收到长邮件，不知道自己下一步做什么
- 高频动作：查看邮件、查看与自己相关的 action items、回顾历史会议

### Persona D：管理员（后台用户）
- 目标：维护会议模板、轻量规则、系统集成状态
- 痛点：不同会议类型输出结构不一致，系统接入缺少统一配置入口
- 高频动作：配置模板、查看连接状态、维护轻量规则

## 1.4 当前流程与问题
当前真实流程：
1. 通过 Teams / Outlook 创建会议
2. 会议中人工记录，或录音 / 录屏
3. 会后人工整理纪要
4. 通过 Outlook 发送会议邮件
5. 在 Jira 手动创建 action items
6. EHR 未与会议通知和待办形成联动

核心问题：
1. 纪要邮件整理耗时
2. action items 任务创建纯手动且容易漏
3. 历史会议整个链路内容没有打通

## 1.5 产品定位
Espressif ActionHub 是一个以 Web 工作台为核心、以会议室终端为采集入口、并与 Teams / Outlook / Jira / EHR 集成的企业会议决议与行动项推进系统。

它不替代 Teams，而是在 Teams / Outlook 会议基础设施之上，增加一层会后结构化处理、人工确认、邮件同步和任务流转能力。

---

# 2. 版本规划

## 2.1 阶段 0：需求收敛与试点定义（2025.06）
目标：收敛试点范围，明确 MVP 只聚焦最核心、最可验证的会后场景。

核心工作：
- 明确试点用户：
  - 项目经理 / PM
  - 研发负责人 / Tech Lead
  - 项目核心成员
- 明确试点会议类型：
  - 项目周会
  - 技术评审会
  - 风险同步会
- 梳理现有真实流程：
  - Teams / Outlook 订会
  - 会中人工记录或录屏
  - 会后人工整理纪要
  - Outlook 发邮件
  - Jira 手动建任务
  - EHR 承担 HR 流程待办与内部通知
- 明确 MVP 核心目标：
  - 节省会后纪要整理时间
  - 降低 action item 手动创建与遗漏问题
- 明确系统边界：
  - 硬件终端由硬件团队负责
  - 平台侧只依赖“可用 transcript source”
  - MVP 不做多 transcript 自动融合

阶段输出：
- 试点用户和试点会议类型确定
- MVP 范围确定
- 关键业务链路与数据契约初版确定

## 2.2 MVP（2025.06 - 2025.08）
目标：优先解决“会后纪要邮件整理耗时”，建立从会议内容到纪要邮件的最小闭环。

核心能力：
- 接入 Teams / Outlook 会议对象
- 支持会议室终端 transcript 或 Teams transcript 作为输入来源
- 主持人 / PM 手动指定主 transcript source
- 自动生成：
  - Summary
  - Decisions
  - Action Items
  - Risks / Blockers
  - Open Questions
- 主持人 / PM 对 AI 草稿进行确认与编辑
- Outlook 邮件草稿预览与发送
- 历史会议按项目沉淀可查
- 轻量模板配置
- 基础集成状态查看

MVP 覆盖会议类型：
- 项目周会
- 技术评审会
- 风险同步会

MVP 不包含：
- 多 transcript source 自动融合
- 自动带出历史未完成事项
- EHR 自动通知 / 待办路由
- Action Center
- AI Ops 后台

MVP 验证重点：
- 纪要整理时间是否下降
- Outlook 邮件发送前的确认链路是否顺畅
- 主持人 / PM 是否愿意使用 AI 草稿，而不是从零手写纪要

## 2.3 Phase 1：任务流转与项目沉淀（2025.08 - 2025.10）
目标：把“会后有纪要”推进为“会后有后续动作”，完成从会议结果到 Jira 的最小协同闭环。

核心能力：
- action item 路由建议
- Jira 任务草稿生成
- Jira 字段映射与确认创建
- 轻量“我的 action items”入口
- Project History 页面完善
- 会议结果与 Jira 任务建立关联

这一阶段的核心变化：
- 产品从“会议纪要工具”升级为“会议结果推进系统”
- action item 不再停留在纪要邮件中，而是进入项目协同链路

Phase 1 不包含：
- 跨会议自动召回历史 action items
- EHR 路由正式落地
- AI 能力模块化平台化
- 组织级效率分析

Phase 1 验证重点：
- action item → Jira draft 的采用率
- 用户是否减少了手工从邮件抄任务到 Jira 的操作
- 项目历史会议沉淀是否开始被实际查看和使用

## 2.4 Phase 2：AI 能力模块化探索（2025.10 - 2025.11）
目标：在不推翻主 workflow 的前提下，识别并抽象高频、稳定、可复用的 AI 能力模块，为后续技能化（skills-like）演进奠定基础。

核心方向：
- 将 workflow 中重复出现的 AI 节点进行能力识别与模块化抽象
- 统一高频能力的输入输出定义
- 开始形成模板 / prompt / badcase 的模块级优化视角

优先抽象的能力模块：
- Meeting Type Classification
- Minutes Structuring
- Action Item Extraction
- Risk / Blocker Extraction
- Email Draft Generation
- Jira Draft Generation

说明：
- 本阶段强调“能力模块化探索与局部落地”
- 不表述为“完整 Skills 平台化重构”
- 从现在视角复盘，这一层已接近 skills-like modules 的设计思路，但当时更多是架构演进和能力解耦，而非完整平台建设

Phase 2 可同步准备但不强落地的能力：
- 历史会议上下文召回设计
- EHR 路由方案设计
- Action Center 方案设计

Phase 2 验证重点：
- 能力模块边界是否清晰
- 模块复用是否比单点 prompt 更稳定
- badcase 是否可以按能力模块归类与优化

## 2.5 优化与复盘（2025.11 - 2025.12 初）
目标：在离职前完成已上线 / 已验证部分的稳定化、效果分析与下一阶段规划。

核心工作：
- badcase 分类与修正
- 模板与 prompt 调优
- owner / deadline 抽取策略优化
- Jira 草稿采用情况复盘
- 纪要修改率分析
- 梳理后续 backlog：
  - 历史会议上下文召回
  - 未完成 action item 自动带出
  - EHR 通知 / 待办路由
  - Action Center
  - AI Ops

阶段输出：
- 形成阶段性复盘结论
- 明确下一阶段产品路线
- 明确哪些 AI 能力值得继续投入

## 2.6 Future
可选扩展方向：
- 多 transcript source 融合
- 会中轻交互修正
- Azure DevOps 兼容
- 会议类型自动识别与模板推荐
- 管理层摘要版输出
- 组织级会议效率分析
- action item 完成率与会议 ROI 看板

---

# 3. 页面结构与跳转逻辑

## 3.1 页面总览

### MVP 页面
1. Dashboard
2. Meetings
3. Meeting Detail
4. My Action Items（轻量）
5. Project History
6. Templates & Rules（轻量）
7. Integrations & Admin

### Phase 2 页面
8. Action Center
9. AI Ops

## 3.2 每个页面功能

### 3.2.1 Dashboard
定位：会议协同总览页

功能：
- 今日 / 本周会议
- 待确认纪要
- 待发送邮件
- 待同步 Jira 任务
- 项目维度未完成 action items 快览
- blocker / 风险提醒
- AI 处理效果概览
- Teams / Outlook / Jira / EHR 连接状态
- 会议终端在线状态

### 3.2.2 Meetings
定位：会议列表页

功能：
- 查看会议记录列表
- 按项目 / 时间 / 会议类型 / 主持人 / 状态筛选
- 搜索会议标题、项目名称、参会人
- 查看会议来源（Teams / Terminal / Hybrid）
- 查看纪要状态、邮件状态、Jira 状态
- 进入单场会议详情

### 3.2.3 Meeting Detail
定位：单场会议详情与确认工作台（核心页面）

三栏布局：

#### 左栏
- 会议基础信息
- 主 transcript source 状态
- transcript 时间线
- 原始转写片段

#### 中栏
- Summary
- Decisions
- Action Items
- Risks / Blockers
- Open Questions

#### 右栏
- Outlook 邮件预览
- Jira 任务预览
- EHR 通知预览（MVP 先预留）
- AI Draft / Needs Review / Confidence 状态
- 确认与发送操作

### 3.2.4 My Action Items（轻量）
定位：个人待办入口

功能：
- 查看与当前用户相关的 action items
- 按项目 / 状态 / 截止时间筛选
- 查看来源会议
- 跳转回 Meeting Detail

### 3.2.5 Project History
定位：按项目沉淀历史会议页

功能：
- 按项目查看历史会议
- 查看每次会议纪要
- 查看每次会议 action items 摘要
- 搜索会议标题 / 日期

MVP 范围：
- 同一项目下历史会议列表可查
- 不做自动未完成项带出

### 3.2.6 Templates & Rules（轻量）
定位：模板配置页

功能：
- 会议类型模板配置：
  - 项目周会
  - 技术评审会
  - 风险同步会
- 邮件模板
- action item 路由建议规则（轻量）
- 风险 / blocker 展示规则（轻量）

### 3.2.7 Integrations & Admin
定位：系统集成与后台页

功能：
- Teams 连接状态
- Outlook 连接状态
- Jira 连接状态
- EHR 连接状态
- 会议终端状态
- 最近同步日志
- 重新授权 / 测试连接

### 3.2.8 Action Center（Phase 2）
定位：跨会议 action items 闭环中心

功能：
- 所有项目 action items 聚合
- 连续两次会议未关闭事项
- overdue 项
- 待补 owner / deadline 项
- 项目级 follow-up

### 3.2.9 AI Ops（Phase 2）
定位：AI 持续优化后台

功能：
- action item 漏提反馈
- owner / deadline 识别错误反馈
- badcase 管理
- 模板效果分析
- 会议类型识别效果

## 3.3 页面间跳转关系

### Dashboard
- 点击某场会议 → `Meeting Detail`
- 点击待确认纪要 → `Meeting Detail`
- 点击待同步 Jira → `Meeting Detail`
- 点击某项目 → `Project History`

### Meetings
- 点击某场会议 → `Meeting Detail`

### Meeting Detail
- 点击某 action item → 详情抽屉
- 点击“查看我的任务” → `My Action Items`
- 点击“查看项目历史会议” → `Project History`
- 点击“配置模板” → `Templates & Rules`

### My Action Items
- 点击某任务来源会议 → `Meeting Detail`

### Project History
- 点击某次会议 → `Meeting Detail`

### Integrations & Admin
- 点击某系统连接 → 连接详情 / 日志抽屉

### Phase 2
- `Action Center` → 可跳回 `Meeting Detail`
- `AI Ops` → 可跳到具体 badcase 对应会议

---

# 4. 关键业务逻辑与业务规则

## 4.1 会议对象唯一性规则
- 每场会议以 `meeting_id` 作为平台内部唯一对象
- 同一场会议即使有会议室终端采集和 Teams 线上上下文，也必须归属到同一个 meeting object
- MVP 不做多 transcript 自动融合

## 4.2 主 transcript source 规则
- 主持人 / PM 必须指定本次会议的主 transcript source
- 可选值：
  - Teams transcript
  - 会议室终端 transcript
- 系统后续 AI 处理只基于主 transcript source 执行
- 非主源仅作为来源记录，不参与 MVP 自动结构化

## 4.3 AI Draft / Needs Review 规则
- Summary / Decisions / Action Items / Risks / Open Questions 默认均为 AI Draft
- 所有 action items 默认进入 Needs Review
- owner / deadline 抽不到时允许留空
- 主持人 / PM 必须完成确认后，才允许发 Outlook 邮件或创建 Jira 任务

## 4.4 邮件发送规则
- 默认收件人为全体参会人
- 支持主持人 / PM 删减和补充收件人
- 邮件正文必须基于确认后的纪要结构生成
- 未确认纪要不能直接发送

## 4.5 Jira 路由规则
- 系统先给出去向建议：
  - Jira：研发 / 项目类任务
  - EHR：HR 流程待办 / 通知类（MVP 先预留）
  - Outlook only：仅同步，不建任务
- MVP 先真正落地 Jira
- 所有自动建议都必须经过主持人 / PM 确认

## 4.6 历史会议沉淀规则
- MVP 只按项目沉淀历史会议
- 每场会议保存：
  - 基本信息
  - 主 transcript metadata
  - AI 结构化结果
  - 邮件发送记录
  - Jira 创建记录
- Phase 2 再支持跨会议 action item 延续追踪

---

# 5. 复杂功能链路

## 5.1 会议接入链路
### 目标
把 Teams / Outlook 中的会议事件转化为平台内部统一 meeting object。

### 实现思路
1. 从 Teams / Outlook 获取会议基础信息：
   - 标题
   - 时间
   - 组织者
   - 参会人
   - calendar / meeting id
2. 在平台创建内部 meeting object
3. 写入会议来源类型：
   - Teams
   - Terminal
   - Hybrid
4. 会后允许绑定 transcript source

## 5.2 transcript 处理链路
### 目标
为会后 AI 结构化提供单一可信输入源。

### 实现思路
1. 会议结束后，平台检查可用 transcript source
2. 主持人 / PM 选择主 source
3. 记录：
   - source_type
   - source_id
   - transcript_version
4. transcript 分段存储，保留时间戳和内容片段
5. 触发纪要结构化任务

## 5.3 纪要结构化链路
### 目标
输出标准化会议结果，而不是一段长总结。

### 输出结构
- Summary
- Decisions
- Action Items
- Risks / Blockers
- Open Questions

### 实现思路
1. 根据会议类型匹配对应模板
2. 使用模板化 prompt / 结构化抽取策略
3. 生成 AI Draft
4. 为每条 action item 标注：
   - 来源片段
   - 建议 owner
   - 建议 deadline
   - 建议系统去向
   - confidence
5. 低置信度项标记 Needs Review

## 5.4 Outlook 邮件生成链路
### 目标
把确认后的会议结果快速转成标准纪要邮件。

### 实现思路
1. 用户点击“生成邮件”
2. 系统读取确认后的纪要结构
3. 生成邮件草稿：
   - 标题
   - 收件人
   - 抄送
   - 摘要
   - decisions
   - action items
4. 用户确认后发送
5. 记录发送日志

## 5.5 Jira 任务创建链路
### 目标
减少会后人工把 action items 再手工抄一遍到 Jira。

### 实现思路
1. 对每条 action item 进行系统去向建议
2. 用户确认需要进入 Jira 的事项
3. 映射 Jira 必填字段
4. 生成 Jira draft
5. 用户确认后创建 issue
6. 回写 Jira issue key / status 到平台

## 5.6 历史会议沉淀链路
### 目标
让会议不再是“一封发完就消失的邮件”。

### MVP 实现思路
1. 每次会议归属到 `project_id`
2. 在 `Project History` 页面按项目聚合展示会议记录
3. 支持查看：
   - 会议标题
   - 时间
   - 会议类型
   - 纪要摘要
   - action item 数量
4. Phase 2 再增加“未完成事项带出”

---

# 6. 数据契约

## 6.1 用户角色
- 主持人 / PM：选择主 transcript source、确认纪要、确认 action item 去向、发送邮件、创建 Jira 任务
- 研发负责人 / Tech Lead：查看并补充决议、风险、任务信息
- 参会成员：接收纪要邮件、查看与自己相关的 action items、查看历史会议
- 管理员：配置会议模板、查看集成状态、维护轻量规则

## 6.2 会议类型体系
### MVP
- 项目周会
- 技术评审会
- 风险同步会

### Phase 2
- 跨部门推进会
- 管理例会
- HR 流程协同会

## 6.3 会议对象（meeting object）
- `meeting_id`（string，平台内部唯一 ID）
- `calendar_event_id`（string，Teams / Outlook 会议事件 ID）
- `title`（string）
- `meeting_type`（enum：项目周会 / 技术评审会 / 风险同步会 / 其他）
- `project_id`（string，可为空）
- `organizer_id`（string）
- `participants`（array）
- `start_time`（datetime）
- `end_time`（datetime）
- `meeting_source`（enum：Teams / Terminal / Hybrid）
- `status`（enum：scheduled / in_progress / ended / ai_draft_generated / reviewed / emailed / jira_synced）

## 6.4 主 transcript source
- `source_type`（enum：teams_transcript / terminal_transcript）
- `source_id`（string）
- `selected_by`（user_id）
- `selected_at`（datetime）
- `transcript_version`（string）
- `transcript_segments`（array，包含时间戳、内容、说话片段）

## 6.5 AI 结构化输出
- `summary`（string）
- `decisions`（array<string>）
- `action_items`（array<object>）
- `risks_blockers`（array<string>）
- `open_questions`（array<string>）
- `ai_status`（enum：draft / reviewed）
- `confidence_score`（float，整体或分字段）

## 6.6 Action Item 数据结构
- `action_item_id`（string）
- `title`（string）
- `description`（string，可为空）
- `owner_name`（string，可为空）
- `owner_id`（string，可为空）
- `deadline`（date，可为空）
- `source_excerpt`（string）
- `confidence_score`（float）
- `review_status`（enum：needs_review / confirmed / discarded）
- `routing_suggestion`（enum：jira / ehr / email_only）
- `final_routing`（enum：jira / ehr / email_only）
- `jira_issue_key`（string，可为空）
- `created_from_meeting_id`（string）

## 6.7 Outlook 邮件数据结构
- `email_draft_id`（string）
- `subject`（string）
- `to_recipients`（array）
- `cc_recipients`（array）
- `body_html`（string）
- `generated_from_meeting_id`（string）
- `send_status`（enum：draft / sent / failed）
- `sent_at`（datetime，可为空）

## 6.8 Jira 同步数据结构
- `jira_project_key`（string）
- `issue_type`（string，默认 Task）
- `summary`（string）
- `description`（string）
- `assignee`（string，可为空）
- `due_date`（date，可为空）
- `sync_status`（enum：draft / created / failed）
- `issue_key`（string，可为空）

## 6.9 Project History 数据结构
- `project_id`（string）
- `project_name`（string）
- `meeting_ids`（array）
- `history_search_scope`（默认按项目维度）
- `history_view_fields`：会议标题、时间、类型、纪要摘要、action item 数量、邮件状态、Jira 状态

## 6.10 页面与权限
- Dashboard：主持人 / PM、研发负责人可见；管理员可见
- Meetings：主持人 / PM、研发负责人可见
- Meeting Detail：主持人 / PM 可编辑，参会成员只读
- My Action Items：登录用户可查看自己的项
- Project History：项目相关角色可查看
- Templates & Rules：管理员可编辑
- Integrations & Admin：管理员可编辑

---

# 7. AI 设计章节

## 7.1 Workflow 设计
本系统是 workflow-driven system。

核心 workflow：
1. Teams / Outlook 创建会议
2. 平台接入 meeting object
3. 会议结束后指定主 transcript source
4. 触发 AI 生成结构化纪要草稿
5. 主持人 / PM 确认与编辑
6. Outlook 生成并发送纪要邮件
7. Jira 创建任务
8. Project History 沉淀

原则：
- workflow 是主干
- AI 只在关键节点做结构化判断与建议
- 所有高影响动作必须保留人工确认

## 7.2 Agent 设计
本系统中的 Agent 不是全链路自治 Agent，而是关键节点的受控编排者。

职责：
- 根据会议类型选择模板和处理策略
- 将 transcript 组织成结构化结果
- 判断哪些内容更像 decision、action item、risk、open question
- 给出 action item 的路由建议
- Phase 2 做跨会议上下文串联和 follow-up 建议

不负责：
- 自动替人拍板
- 自动发送高风险邮件
- 自动强制分派任务
- 自动创建未经确认的 Jira 事项

## 7.3 Memory 设计
### MVP
只做数据沉淀，不强调强 memory：
- 历史会议记录
- 纪要结果
- action item 结果
- 项目维度会议列表

### Phase 2
升级为真正的 memory：
- 上次会议纪要召回
- 未完成 action item 自动带出
- 同一项目连续 blocker 识别
- 不同会议模板偏好记忆
- 常见 owner / 项目角色映射

## 7.4 RAG 设计
### MVP
- 不做重 RAG
- 只基于单次会议主 transcript 生成结果
- 历史会议只做可查，不做自动召回

### Phase 2
- 引入轻量 RAG
- 用于召回上次会议纪要、历史 action item、项目背景

## 7.5 Tools / 外部系统接入层设计
### 当前工具层
- Teams / Outlook：读取 meeting object、发送邮件
- Jira：创建任务、回写 issue key / status
- EHR：通知 / 待办路由（Phase 2）
- 会议室终端：提供 transcript source

### 设计原则
- 明确读写边界
- 高影响写操作必须人工确认
- 后续可抽象为 MCP 风格资源与工具层

## 7.6 意图识别与任务路由设计
### MVP 意图分类

#### 会议类型意图
- 项目周会
- 技术评审会
- 风险同步会

#### 输出目标意图
- 生成完整纪要
- 生成 Outlook 邮件草稿
- 生成 Jira 任务草稿
- 查看项目历史会议

#### 路由意图
- Jira
- EHR（预留）
- Email only

### 路由逻辑
- 项目周会 → 周会模板
- 技术评审会 → 评审模板
- 风险同步会 → 风险模板
- 勾选 Jira → action items 进入 Jira draft 流程

### Phase 2
补充更细意图：
- 全员纪要版
- 管理层摘要版
- 行动项版
- blocker 聚焦版
- HR 通知版

## 7.7 结构化抽取与识别设计

### Decision 抽取
定义：提取明确达成一致的结论。

原则：
- 必须有明确结论性表达
- 不把普通讨论、建议、待确认项误判为 decision
- 未决内容进入 open question

输出字段：
- decision_text
- source_excerpt
- confidence_score

### Action Item 抽取
定义：提取明确后续动作。

原则：
- 必须是可执行事项
- 尽量抽取 owner 和 deadline
- 抽不到允许留空
- 模糊任务进入 needs_review

输出字段：
- title
- description
- owner
- deadline
- source_excerpt
- routing_suggestion
- confidence_score
- review_status

### Risk / Blocker 抽取
定义：提取明确风险、阻塞项、依赖问题。

原则：
- 只提取影响后续推进的问题
- 不把一般讨论、抱怨、闲聊误判成 blocker

输出字段：
- risk_text
- source_excerpt
- confidence_score

### Open Question 抽取
定义：提取未决、待确认、待补充的问题。

原则：
- 没有形成结论
- 仍需其他人补信息 / 决定
- 不误归入 decision

输出字段：
- question_text
- related_owner（可为空）
- source_excerpt
- confidence_score

### Owner / Deadline 识别
原则：
- 只在 transcript 有足够依据时抽取
- 不强行补全
- deadline 无法确定时允许留空
- 低置信度必须展示为 needs_review

回退机制：
- owner 为空 → 人工补充
- deadline 为空 → 人工补充
- 多 owner 模糊 → 不自动指定唯一 owner

## 7.8 Prompt 策略与输出约束

### Prompt 分层
- 系统级 Prompt：定义产品边界、输出原则、禁止事项
- 会议类型模板 Prompt：项目周会 / 技术评审会 / 风险同步会
- 任务型 Prompt：纪要生成、action item 抽取、risk 提取、email draft 生成
- 路由型 Prompt：判断 action item 更适合 Jira / EHR / email only

### 输出约束
- 必须输出固定 schema
- owner / deadline 抽不到时允许留空
- 讨论内容不能强行写成决议
- 低置信度 action item 必须标记 `needs_review`
- 不允许自动生成 transcript 中没有依据的强结论

### 版本管理
- 不同会议类型使用不同模板版本
- prompt 升级需要记录版本号
- badcase 优化后做回归测试

## 7.9 模型选型原则
- ASR：优先使用成熟转写能力，不自研底层声学能力
- 纪要生成：使用长上下文生成模型
- 结构化抽取：采用 schema constrained output 或模板化抽取
- 路由建议：优先使用轻量 prompt / 规则组合

原则：
- 优先稳定可用
- 优先可控和可审计
- 避免在 MVP 引入过重模型复杂度

## 7.10 测试数据集构建
数据来源：
- 历史会议 transcript
- 人工纪要
- Outlook 纪要邮件
- Jira 任务记录

样本类型：
- 项目周会
- 技术评审会
- 风险同步会

标注维度：
- Summary 可用性
- Decision 提取
- Action Item 提取
- Owner / Deadline 抽取
- Risk / Blocker 识别

数据划分：
- 开发集
- 验证集
- Badcase 回归集

## 7.11 评测维度与验收标准

### 离线评测
- decision 提取可用率
- action item 提取准确率
- owner 抽取准确率
- deadline 抽取准确率
- blocker 识别准确率
- open question 识别召回率

### 在线业务指标
- 纪要确认耗时
- Jira 同步采用率
- action item 漏提反馈率
- 人工修改率

## 7.12 Badcase 收集与优化流程

### Badcase 类型
- ASR 错误导致纪要偏差
- 决议误提取
- action item 漏提
- owner 识别错误
- deadline 幻觉
- 闲聊内容误入纪要
- 风险项漏识别

### 收集入口
- 主持人 / PM 手动反馈
- 编辑操作反推
- 发送前修改记录
- Jira 创建前删除 / 改写记录

### 优化闭环
1. badcase 分类打标
2. 每周回顾高频 badcase
3. 优化模板 / 规则 / prompt
4. 做回归测试
5. 再上线验证

---

# 8. 成功指标与评估方式

## 8.1 MVP 成功指标
- 会后纪要整理时间下降
- 纪要发送时延下降
- action item 提取采纳率提升
- Jira 草稿转正式任务率
- 主持人修改率可控
- 历史会议查看率提升

## 8.2 Phase 2 关注指标
- 跨会议未完成项跟进率
- blocker 连续追踪使用率
- EHR 通知路由使用率
- AI Ops 反馈闭环效率

---

# 9. 权限、审计与安全边界

## 9.1 权限边界
- 只有主持人 / PM 可以选择主 transcript source
- 只有主持人 / PM 可以确认纪要并发送邮件
- 只有主持人 / PM 可以确认 Jira 创建
- 参会成员默认只读
- 管理员可维护模板、规则和集成状态

## 9.2 审计留痕
以下操作必须留痕：
- 主 transcript source 选择
- AI Draft 编辑
- 邮件发送
- Jira 创建
- 模板修改
- action item 删除或丢弃

## 9.3 安全边界
- 未确认纪要不得发送
- 未确认 action item 不得自动建 Jira
- 低置信度信息必须显式标记
- EHR 路由在 MVP 仅预留，不自动触发

---

# 10. 异常处理与回退机制

## 10.1 transcript 缺失
- 无法生成 AI 草稿
- 提示用户选择可用 source 或稍后重试

## 10.2 AI 生成失败
- 保留 transcript 可查看
- 支持手动重试生成
- 记录错误日志

## 10.3 Outlook 发送失败
- 邮件状态标记 failed
- 支持重新发送
- 保留 draft 不丢失

## 10.4 Jira 创建失败
- 任务状态标记 failed
- 保留 Jira draft
- 支持手动重试

## 10.5 主 transcript source 未选择
- 不允许进入结构化生成流程

## 10.6 低置信度信息
- 仍展示，但标记 needs_review
- 不自动流转到下游系统

---

# 11. 里程碑与外部依赖

## 11.1 MVP 外部依赖
- Teams / Outlook 接口接通
- Jira 接口接通
- 会议终端提供可用 transcript
- project_id / 会议类型基础配置

## 11.2 Phase 1 外部依赖
- Jira draft → issue 创建链路稳定
- 项目归属信息在会议对象中可用
- Project History 数据结构稳定

## 11.3 Phase 2 外部依赖
- 历史会议结构化沉淀稳定
- EHR 通知 / 待办写入能力开放
- 跨会议任务状态追踪逻辑稳定

---

# 12. MVP / Phase 2 对照表

| 模块        | MVP                                | Phase 1               | Phase 2                                       |
| ----------- | ---------------------------------- | --------------------- | --------------------------------------------- |
| 会议类型    | 项目周会 / 技术评审会 / 风险同步会 | 同 MVP                | 扩展到跨部门推进会 / 管理例会 / HR 流程协同会 |
| transcript  | 单主 source，手动选择              | 同 MVP                | 多源融合设计探索                              |
| 纪要生成    | 结构化纪要 + 人工确认              | 同 MVP                | 更细的输出版本                                |
| action item | 提取 + needs review                | Jira draft 与关联落地 | Action Center 闭环追踪                        |
| EHR         | 仅预留                             | 仅预留                | 通知 / 待办路由                               |
| 历史会议    | 按项目可查                         | Project History 完善  | 自动召回、未完成项带出                        |
| AI 模块     | 单点嵌入 workflow                  | 单点嵌入 workflow     | 开始模块化抽象与优化                          |

---

# 13. 待确认项

- 功能是否理解完善
- 数据契约是否符合预期
- 版本规划是否有误
- 是否进入原型设计阶段