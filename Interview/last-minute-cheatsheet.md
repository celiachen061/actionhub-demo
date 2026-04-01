# ActionHub-last-minute-cheatsheet.md

# Espressif ActionHub｜最后 10 分钟速记卡

> 用途  
> 面试前最后 10 分钟快速复习  
>  
> 原则  
> - 只放最需要记住的内容  
> - 不放大段解释  
> - 数字统一以 `ActionHub-pilot-results-and-metrics.md` 为准

---

## 1. 一句话项目定义

`ActionHub` = 面向企业内部混合会议场景的 AI 协同平台，连接 `Teams / Outlook / 会议室终端 / Jira / EHR`，把“会后人工整理纪要、手动发邮件、手动建任务”升级成“AI 结构化纪要 + 人工确认 + 任务流转 + 历史追踪 + AI 持续优化”的闭环。

---

## 2. 我为什么做

- 真实问题不是“没人记会议”，而是“会后没人推进”
- 痛点：
  - 纪要整理慢
  - action item 易漏
  - Jira 还要再建一次
  - 历史会议难追
- 基线：纪要整理中位时长 `31` 分钟

---

## 3. 为什么从这里切

- 先做会后，不做会中
- 先做三类项目型会议：
  - 项目周会
  - 技术评审会
  - 风险同步会
- 先做 AI 起草 + 人工确认，不做自动发邮件 / 自动建 Jira
- 先做单一主 transcript source，不做多源融合

---

## 4. 我负责什么

- 需求收敛
- PRD / roadmap / AI system blueprint
- 核心页面和用户流
- AI 能力边界与状态体系
- 指标、评测、badcase 口径
- 与算法、前后端、业务方的跨团队对齐
- 关键“不做什么”的决策拍板

---

## 5. 产品演进

### 阶段 0（2025.06）
- 访谈 `11` 位用户
- 回放 / 旁听 `7` 场会议
- 明确先做会后，不做会中

### MVP（2025.06 - 2025.08）
- `Meeting Detail`
- AI 结构化纪要
- Outlook 邮件草稿与发送
- `Project History`

### Phase 1（2025.08 - 2025.10）
- Action item 路由建议
- Jira draft 生成与确认
- `My Action Items`
- `Project History` 增强

### Phase 2（2025.10 - 2025.11）
- `Action Center`
- `AI Ops`
- `AI Skills`
- badcase 分类与回归治理

---

## 6. 一条端到端链路

1. `Teams / Outlook / Terminal` 产出会议对象和 transcript
2. 用户选 `primary transcript source`
3. 系统做 `Minutes Structuring`
4. AI 输出：
   - `summary`
   - `decisions`
   - `action items`
   - `risks`
   - `open questions`
5. `owner / deadline` 没证据就进 `Needs Review`
6. 用户在 `Meeting Detail` 查看结果与 `source_excerpt`
7. 用户确认后再发 Outlook 邮件 / 建 Jira draft
8. 结果沉淀到 `Project History / My Action Items / Action Center`
9. 编辑与 badcase 回流到 `AI Ops`

一句话：
`输入 -> AI 草稿 -> 人工确认 -> 下游流转 -> 数据沉淀 -> badcase 回流`

---

## 7. 最值得讲的 6 个取舍

1. 先做会后，不做会中  
2. 只选一个主 transcript source  
3. AI 只能起草，不能自动发邮件 / 建 Jira  
4. `owner / deadline` 宁缺毋滥  
5. Jira 先做 draft，不自动建单  
6. Phase 2 做 Skills，不做全自治 Agent

---

## 8. 核心数字

- 基线纪要整理中位时长：`31`
- MVP 纪要整理中位时长：`14`
- AI 草稿采用率：`72%`
- Action item 提取采纳率：`83%`
- Jira 草稿转正式任务率：`61%`
- 跨会议 follow-up 跟进率：`67%`
- 连续 blocker 识别命中率：`73%`
- badcase 回归通过率：`91%`
- `Project History` 早期周活：`38%`
- 试点总覆盖：`107`

---

## 9. 两个最典型 badcase

### Badcase 1：讨论被误判成 decision
- 场景：技术评审会
- 根因：模板边界不清
- 处理：按会议类型拆模板 + 强化 `open question` + 增加 `source_excerpt`

### Badcase 2：强行补 owner / deadline
- 场景：模糊表达
- 根因：追求完整压过可信
- 处理：改成宁缺毋滥，缺失就 `Needs Review`

---

## 10. 三句压轴话

### 10.1 项目差异
这不是一个普通会议纪要工具，而是一条从纪要、确认、发送、建单到历史沉淀和 AI 优化的工作流。

### 10.2 AI PM 价值
我做的不是“多做几个 AI 功能”，而是把 AI 放进真实业务流程里，并明确了边界、评测、灰度和回滚。

### 10.3 最像 AI PM 的判断
`owner / deadline` 宁缺毋滥。  
因为这不是算法调优问题，而是产品风险偏好问题。

---

## 11. 一句技术追问备用

- Jira：`POST /rest/api/3/issue`，最小 `project + issuetype + summary`，`description` 用 ADF，`assignee` 用 `accountId`
- Outlook：Microsoft Graph `sendMail`，人工确认后再写下游
