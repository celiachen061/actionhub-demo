# Espressif ActionHub 简历项目描述

> 指标口径统一说明：本文件默认与 `pilot-results.md`、`interview-one-pager.md`、`interview-talk-track.md` 保持同一套数字口径；核心数字统一为 `31 -> 14`、`72%`、`83%`、`61%`、`67%`、`91%`。

## 1. 标准版（推荐）

- 主导设计 Espressif 内部混合会议 AI 协同平台 `ActionHub`，完成从需求收敛、PRD、原型、AI 能力规格到试点验证的 0-1 全链路产品设计，聚焦项目周会、技术评审会、风险同步会三类高频项目型会议。
- 搭建“AI 结构化纪要 + 人工确认 + Outlook 邮件发送 + Jira draft 流转 + Project History 沉淀”的会后闭环；Meeting Detail 侧邮件与 Jira 用弹窗编辑、推送即确认；Jira 对齐 Cloud 创建 Issue API，Outlook 发送对齐 **Microsoft Graph `sendMail`**（`Mail.Send`）。会后纪要整理中位时长从 `31` 分钟降至 `14` 分钟，AI 草稿采用率提升至 `72%`。
- 设计 Action item 抽取、owner / deadline 识别、route suggestion 等关键 AI 能力边界与评测口径，推动 `owner / deadline` 采用“宁缺毋滥 + Needs Review”策略，Action item 提取采纳率达到 `83%`，Jira 草稿转正式任务率达到 `61%`。
- 规划并推进 Phase 2 的 `Action Center`、`AI Ops` 与 `AI Skills` 能力层，建立 badcase 分类、回归与版本治理机制，试点阶段实现跨会议未完成事项跟进率 `67%`、badcase 回归通过率 `91%`。

## 2. 偏 AI PM 版

- 负责企业内部 AI 协同产品 `ActionHub` 的问题定义、范围收敛与 AI 能力设计，围绕会后纪要、行动项推进、Jira 流转和跨会议追踪搭建完整 workflow。
- 将 AI 能力拆解为 `Minutes Structuring`、`Action Item Extraction`、`Owner / Deadline Recognition`、`Routing Suggestion`、`Cross-meeting Follow-up Skill` 等模块，输出 AI capability spec、评测指标、badcase 流程与发布门槛。
- 推动产品从“AI 纪要工具”演进为“模块化 AI 协同系统”，设计 `AI Draft / Needs Review / Confirmed / Confidence` 状态体系与 `AI Skills` 能力层，平衡自动化效率与企业场景可信边界。

## 3. 偏平台 / 0-1 版

- 从 0 到 1 规划并设计 Espressif 内部混合会议协同平台，串联 `Teams`、`Outlook`、会议室终端、`Jira`、`EHR`，完成产品路线图、数据契约、页面原型与 AI 架构方案。
- 基于 `11` 位用户访谈与 `7` 场会议回放完成试点收敛，建立可量化指标体系和试点复盘口径，分阶段推进 MVP、Phase 1、Phase 2 的能力演进。
- 在高影响动作上坚持“AI 生成草稿，人确认后流转”，避免自动发邮件/建 Jira 的信任风险，形成适合企业协同场景的 AI 产品边界。

## 4. 超精简版（简历篇幅紧张时）

- 主导 0-1 设计企业内部 AI 协同平台 `ActionHub`，搭建“AI 纪要 + 人工确认 + Jira 流转 + 历史沉淀”闭环，会后纪要整理中位时长从 `31` 分钟降至 `14` 分钟，AI 草稿采用率 `72%`。
- 定义 Action item、owner / deadline、route suggestion 等核心 AI 能力边界与评测机制，推动 Action item 提取采纳率 `83%`、Jira 草稿转正式任务率 `61%`。
- 规划 Phase 2 的 `Action Center`、`AI Ops`、`AI Skills`，建立 badcase 分类与回归治理机制，跨会议 follow-up 跟进率达到 `67%`。

## 5. 面试自我介绍可直接引用的一句

我最近一个比较完整的 AI PM 项目，是主导做了一个企业内部混合会议协同平台 `ActionHub`，把 AI 纪要、人工确认、Jira 流转和跨会议追踪串成了一条可量化、可复盘的工作流闭环。
