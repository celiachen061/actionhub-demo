# Espressif ActionHub Demo 演示脚本

> 目标：用最少页面和最短时间，把这个项目的核心价值讲清楚。  
> 推荐演示时长：`5-8` 分钟。  
> 推荐方式：边演示边讲，不要逐页介绍功能。

## 1. Demo 目标

这次 Demo 不是证明“页面都画完了”，而是证明 3 件事：

1. 这个项目解决了真实的会后协同问题
2. AI 是如何嵌进 workflow 的，而不是独立悬空的
3. 为什么它能从 MVP 演进到 `Action Center`、`AI Ops` 和 `AI Skills`

## 2. 最小演示范围

如果只演示最少页面，建议只串这 `5` 个：

1. `Dashboard`
2. `Meeting Detail`
3. `My Action Items` 或 `Project History`
4. `Action Center`
5. `AI Ops`

如果时间更紧，可以压缩成 `4` 个：

1. `Dashboard`
2. `Meeting Detail`
3. `Action Center`
4. `AI Ops`

## 3. 推荐演示顺序

### Step 1：从 `Dashboard` 起手

#### 你要讲什么

- 这是一个“会后协同总览”而不是普通会议列表页
- 用户一进来就能看到今天要处理什么：待确认纪要、待发送邮件、待同步 Jira、未完成 action items、blocker 提醒
- 顶部有 `中 / EN` 切换，说明这是按企业工作台标准设计的

#### 你要点哪里

- 今日 / 本周会议
- 待确认纪要
- 待同步 Jira
- blocker / 风险提醒

#### 推荐话术

> 我会先从 Dashboard 起手，因为这个项目不是一个单点 AI 工具，而是一个工作台。用户关心的不是“AI 生成了什么”，而是“今天有哪些会后事项需要处理”。所以首页优先展示待确认纪要、待同步 Jira、未完成事项和风险提醒。

### Step 2：进入 `Meeting Detail`

#### 这是整个 Demo 的核心页

一定要讲清楚三栏：

- 左栏：会议信息 + transcript（会议时间、参会人常驻；**Outlook / Teams / 转写来源**可折叠展开）
- 中栏：AI 结构化结果
- 右栏：邮件和 Jira 预览

#### 必讲点

- AI 输出不是大段文本，而是结构化成 `Summary / Decisions / Action Items / Risks / Open Questions`
- 有 `AI Draft / Needs Review / Confirmed / Confidence`
- 每条结果都能定位回 transcript 证据
- `owner / deadline` 允许留空，但必须人工确认

#### 推荐话术

> 这是我认为最关键的设计。AI 不是直接吐一段看起来很聪明的总结，而是把会议结果结构化成可操作的模块，并且明确哪些可以直接用，哪些必须 review。比如 owner 和 deadline，如果没有足够依据，我宁愿让它留空进入 Needs Review，也不接受它胡写。

#### 在这里要演示的动作

1. 看 AI 纪要草稿
2. 展示一条 `Needs Review`
3. 修改一个 owner 或 deadline
4. 查看 Outlook 邮件草稿；说明正式发送走 **Microsoft Graph `sendMail`**（`Mail.Send`，`202 Accepted`，见 `AI-architecture.md` 5.4）
5. 打开「查看 / 修改」弹窗，展示与 Jira REST 对齐的可编辑字段（项目 Key、类型、摘要、描述、标签、负责人、截止日期），保存后回到卡片，再演示「推送 Jira」作为最终确认
6. （可选）强调右栏「分发与同步」**无「AI 提取」胶囊**，避免与单卡 AI 状态重复

### Step 3：跳到 `My Action Items` 或 `Project History`

#### 如果想强调个人执行

讲 `My Action Items`

#### 如果想强调会议资产沉淀

讲 `Project History`

#### 推荐话术

> 很多会议工具的问题在于，纪要发完就结束了。但这个项目想解决的是“推进”，所以我会把会议结果继续带到个人任务或项目历史里，让它不只是一次性邮件。

### Step 4：进入 `Action Center`

#### 这一步体现 Phase 2 价值

必讲点：

- 这不是简单任务列表，而是跨会议闭环中心
- 能看到逾期项、待补 owner / deadline、跨会议未关闭事项
- 有 `AI Skills` 推荐，比如：
  - `Action Focus`
  - `Cross-meeting Follow-up`
  - `Blocker Scan`

#### 推荐话术

> 这是产品从“单场会议纪要工具”升级到“跨会议协同系统”的关键一步。用户在这里看到的不是某一场会说了什么，而是哪些事项跨会议还没关、哪些 blocker 在连续出现、哪些 action item 需要补字段。

### Step 5：进入 `AI Ops`

#### 这是最能体现 AI PM 思维的一页

必讲点：

- badcase 分类
- 模块级指标
- Skill 版本和回归状态
- 为什么这里是独立页面，而不是配置页的一部分

#### 推荐话术

> 我把 AI Ops 单独做成一页，是因为企业 AI 产品不能只停留在“调 prompt”。它需要有一个地方去看模块效果、badcase 类型、回归状态和版本治理。这个页面说明我们不是只做了一个 demo，而是在往可持续优化的平台方向设计。

## 4. 5 分钟 Demo 讲稿骨架

### 开场（30 秒）

> 我想演示的是一个企业内部混合会议协同平台 `ActionHub`。它解决的不是“会议没人记录”，而是“会后整理、发送、建任务、追历史”这条链路效率低且割裂的问题。

### 第一段：MVP（2 分钟）

- Dashboard 看待办
- Meeting Detail 看 AI 纪要、review、邮件、Jira
- 讲“AI 起草，人确认再流转”

### 第二段：Phase 1（1 分钟）

- 跳到 `My Action Items` 或 `Project History`
- 讲会议结果如何继续推进

### 第三段：Phase 2（1.5 分钟）

- Action Center 讲跨会议闭环
- AI Ops 讲 badcase、回归、Skills

### 结尾（30 秒）

> 所以这个项目的重点不是做一个 AI 总结器，而是把 AI 放进企业会后工作流里，并且把可信边界、人工确认和后续优化机制一起设计出来。

## 5. Demo 时必须强调的 5 个点

1. 这不是普通纪要工具，而是会后协同工作台
2. AI 是 workflow 的一部分，不是独立悬空功能
3. 所有高风险输出都要求人工确认
4. `owner / deadline` 宁缺毋滥
5. Phase 2 的核心不是“更多 AI”，而是“模块化、可复用、可运营”

## 6. Demo 里最好不要做的事

1. 不要从导航开始逐页念功能
2. 不要一上来先讲技术架构
3. 不要把所有页面都演示一遍
4. 不要把重点放在 UI 漂不漂亮，而忽略 workflow
5. 不要把项目讲成“完全自动化 Agent”

## 7. 如果暂时没有真前端 Demo，怎么替代

可以用这三种方式：

### 方案 A：直接用原型演示

- 用 `.pen` 原型按上面的脚本走一遍

### 方案 B：录屏视频

- 录一个 `3-5` 分钟的操作视频
- 讲稿按本文件走

### 方案 C：Keynote / Figma 式假 Demo

- 每页只保留关键状态变化
- 用点击切换模拟流程

## 8. 最推荐的最终交付组合

如果你真要做一个最小可展示版本，我建议最终准备：

- 一个能点击的高保真原型或前端 demo
- 本文档里的 `5-8` 分钟演示脚本
- `interview-one-pager.md`
- `resume-project-bullets.md`

这样你在面试里就同时具备：

- 可讲
- 可演示
- 可追问
- 可落简历
