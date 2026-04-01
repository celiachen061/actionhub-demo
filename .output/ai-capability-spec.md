# Espressif ActionHub AI 能力执行规格

> 本文档面向 AI 产品经理、算法、后端、前端、测试与运营协作，定义 ActionHub 的 AI 能力级规格、验收标准、数据标注规范、上线门槛与反馈闭环。  
> 产品层能力边界见 `PRD.md`；技术架构与模型/RAG/Memory/MCP 设计见 `AI-architecture.md`。

---

## 1. 文档定位

### 1.1 目标

把 ActionHub 的 AI 设计从“原则级方案”升级为“可研发、可测试、可验收、可复盘”的执行规格。

### 1.2 适用角色

- AI 产品经理：定义能力范围、验收口径、优先级
- 算法 / LLM 工程：实现抽取、生成、Skill 编排
- 后端工程：任务流、状态机、审计、数据回写
- 前端工程：页面触发、状态展示、纠错交互
- QA / 标注：构建评测集、回归集、badcase 集
- 运营 / 管理员：模板与 Skill 配置、灰度与复盘

### 1.3 文档输出物

- 能力清单与优先级
- 每个能力的输入输出契约
- 场景规则、边界规则、异常处理
- 评测指标、发布门槛、badcase 流程

---

## 2. 能力分层


| 层级               | 作用          | 典型能力                                                       |
| ---------------- | ----------- | ---------------------------------------------------------- |
| Base Model Layer | 通用生成 / 抽取能力 | 长上下文总结、JSON 输出                                             |
| AI Module Layer  | 单一职责模块      | `Minutes Structuring`、`Action Item Extraction`             |
| AI Skill Layer   | 面向场景的能力包    | `Management Summary Skill`、`Cross-meeting Follow-up Skill` |
| Workflow Layer   | 把结果送到页面与业务流 | `Meeting Detail`、`Action Center`、`AI Ops`                  |


### 2.1 设计原则

- 先模块化，再 Skill 化，不直接做全自治 Agent
- Skill 只负责分析、生成、建议，不直接执行高影响写操作
- 所有能力都必须能回溯到输入、输出、来源证据、用户反馈

---

## 3. Phase 2 首批 Skills 范围


| Skill                           | 主要页面                               | 用户价值                          | 优先级 |
| ------------------------------- | ---------------------------------- | ----------------------------- | --- |
| `Management Summary Skill`      | `Meeting Detail`                   | 快速生成管理层可读版本                   | P0  |
| `Action Focus Skill`            | `Meeting Detail` / `Action Center` | 聚焦行动项与依赖                      | P0  |
| `Cross-meeting Follow-up Skill` | `Action Center`                    | 识别连续未关闭事项                     | P0  |
| `Blocker Scan Skill`            | `Action Center` / `AI Ops`         | 识别连续 blocker 和升级风险            | P0  |
| `Routing Suggestion Skill`      | `Meeting Detail`                   | 建议 Jira / EHR / Email only 去向 | P1  |
| `Weekly Status Skill`           | `Project History`                  | 汇总项目周进展与风险                    | P1  |


### 3.1 不纳入 Phase 2 的能力

- 全自动发邮件
- 全自动建 Jira
- 会中实时 Agent 主持
- 多系统跨组织自动协同

---

## 4. 通用输入输出契约

### 4.1 通用输入

- `meeting_id`
- `project_id`
- `meeting_type`
- `primary_transcript`
- `structured_minutes`
- `action_items`
- `historical_context`（Phase 2 可选）
- `user_language`
- `skill_trigger_source`
- `skill_trigger_user_id`

### 4.2 通用输出

- `skill_name`
- `skill_version`
- `output_payload`
- `confidence_score`
- `source_excerpt[]`
- `risk_flags[]`
- `recommended_actions[]`
- `feedback_state`：`unreviewed / accepted / edited / rejected`

### 4.3 通用状态机

`queued -> running -> succeeded -> failed -> user_reviewed`

### 4.4 通用审计字段

- `triggered_at`
- `completed_at`
- `model_name`
- `latency_ms`
- `fallback_used`
- `error_code`
- `reviewed_by`
- `reviewed_at`

---

## 5. 能力规格模板

每个 AI 能力都必须补齐以下 10 项：

- 目标
- 触发条件
- 输入
- 输出 schema
- 成功定义
- 失败定义
- 正例 / 反例 / 边界例
- 页面展示方式
- 用户纠错方式
- 上线门槛

---

## 6. Capability Spec: Minutes Structuring

### 6.1 目标

把单次会议 transcript 转成结构化纪要，供 `Meeting Detail` 展示与后续 Skill 调用。

### 6.2 触发条件

- 主 transcript source 已确定
- transcript 可用且长度在可处理范围内
- 用户点击生成，或会议结束后自动生成草稿

### 6.3 输出 schema

- `summary`
- `decisions[]`
- `action_items[]`
- `risks_blockers[]`
- `open_questions[]`
- `global_confidence`

### 6.4 成功定义

- 五个核心区域至少返回一个非空主结果，或明确返回空原因
- 每条结构化项附 `source_excerpt`
- 输出可在前端稳定渲染，不出现 JSON 解析失败

### 6.5 失败定义

- 输出空白且无错误原因
- JSON 结构错误
- 关键字段缺失
- 摘要与 transcript 明显不一致

### 6.6 页面展示

- `Meeting Detail` 中栏展示
- 默认 `AI Draft`
- 低置信度项进入 `Needs Review`

### 6.7 上线门槛

- 离线可用率 `>= 95%`
- JSON 结构成功率 `>= 99%`
- 主持人确认后可直接发送的会议占比 `>= 70%`

---

## 7. Capability Spec: Action Item Extraction

### 7.1 目标

稳定提取会后可执行事项，支撑 `Meeting Detail`、`My Action Items`、`Action Center`。

### 7.2 必须提取字段

- `title`
- `description`
- `owner`（允许为空）
- `deadline`（允许为空）
- `source_excerpt`
- `confidence_score`
- `review_status`
- `routing_suggestion`

### 7.3 判定规则

- 必须是明确后续动作，不能只是观点、讨论、背景
- 同一句中存在“要做什么”但没有责任人时，可保留为 action item，但标 `Needs Review`
- “我们之后再看”“回头讨论一下”默认不提取为强 action item

### 7.4 正反例

正例：

- “张三周五前补齐驱动测试报告。”
- “下周二前由王五创建 Jira 并同步依赖团队。”

反例：

- “这个问题要不要再想一下。”
- “感觉这里风险不小。”

边界例：

- “这个事后面得跟进。”
  - 保留为 action item 候选，但 owner / deadline 为空，必须 `Needs Review`

### 7.5 用户纠错方式

- 可修改标题、owner、deadline、路由去向
- 删除时必须记录删除原因
- 大幅改写进入 badcase 候选池

### 7.6 上线门槛

- 精确率 `>= 0.85`
- 召回率 `>= 0.80`
- 人工补写 owner / deadline 占比达到阶段目标

---

## 8. Capability Spec: Owner / Deadline Recognition

### 8.1 核心原则

- 宁缺毋滥，不允许幻觉补全
- 多 owner 不明确时不自动指定唯一 owner
- 相对时间必须转成标准日期前，先判断是否有锚点

### 8.2 时间识别规则

- “周五前”需要以会议日期为锚点换算
- “尽快”“下周内”标为模糊时间，不自动写入正式 deadline
- 无年份日期默认按会议所在年解析，跨年风险需标记

### 8.3 Needs Review 规则

以下情况强制 `Needs Review`：

- owner 缺失
- deadline 缺失
- 多人均可能为 owner
- 相对时间无法唯一换算
- transcript 原文模糊

### 8.4 上线门槛

- owner 准确率 `>= 85%`
- deadline 准确率 `>= 80%`
- 幻觉 deadline 比例 `<= 3%`

---

## 9. Capability Spec: Routing Suggestion Skill

### 9.1 目标

对 action item 给出 `jira / ehr / email_only` 的建议，不直接写入下游系统。

### 9.2 输入

- action item 内容
- project 配置
- 会议类型
- 历史类似事项路由

### 9.3 规则

- 明确研发执行任务优先建议 `jira`
- 组织通知、HR 流程优先建议 `ehr`
- 信息同步类内容建议 `email_only`
- 当规则冲突时展示多候选建议，不自动定稿

### 9.4 页面展示

- `Meeting Detail` 右栏或 action item 行内展示建议标签
- 用户必须手动确认 `final_routing`

### 9.5 上线门槛

- Top1 建议准确率 `>= 75%`
- Top2 覆盖率 `>= 90%`

---

## 9.6 Jira 创建 Issue：接口字段与 UI 草稿对齐（落地备忘）

本节与 `.output/AI-architecture.md` 第 5.3 节一致，便于 AI PM / 研发对齐「弹窗里让用户改什么」与「真正 POST 给 Jira 什么」。

**Jira Cloud `POST /rest/api/3/issue`（参考 [Issues API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/)）**

- **必填（最小集）**：`fields.project`、`fields.issuetype`、`fields.summary`。
- **描述**：Cloud 侧为 **ADF**；产品可在 Meeting Detail 弹窗用纯文本收集，**服务端**负责转 ADF。
- **负责人**：API 侧优先 `assignee.accountId`；UI 可先用显示名或邮箱，**服务端**用 Jira User API 解析。
- **截止日期**：`duedate` 格式 `YYYY-MM-DD`。
- **标签**：`labels` 为数组；UI 可用逗号分隔字符串，服务端 `split` 去空。

**集成交付检查**

- 集成前对目标 `project + issuetype` 调 **create meta**，列出必填自定义字段，避免上线后 400。
- 推送按钮 = 用户最终确认后再调用 `jira_create_issue`（与「不在未确认时自动建单」原则一致）。

---

## 9.7 Outlook 发送：Graph sendMail 对齐（落地备忘）

本节与 `.output/AI-architecture.md` 第 **5.4** 节一致。

- **接口**：Microsoft Graph [`sendMail`](https://learn.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0)（`POST /me/sendMail` 或 `POST /users/{id}/sendMail`）。
- **权限**：`Mail.Send`。
- **载荷**：`message`（`subject`、`body`、`toRecipients`/`ccRecipients` 等）；可选 `saveToSentItems`。
- **响应**：`202 Accepted` ≠ 已送达；需节流、重试、审计与草稿保留策略（同节说明）。

---

## 10. Capability Spec: Management Summary Skill

### 10.1 目标

把原始纪要压缩为适合管理层快速浏览的版本，强调结论、风险、决策、需要支持事项。

### 10.2 触发方式

- `Meeting Detail` 手动触发
- 会议类型为项目周会/风险同步会时做弱推荐

### 10.3 输出结构

- `executive_summary`
- `top_decisions[]`
- `top_risks[]`
- `needed_support[]`
- `next_steps[]`

### 10.4 失败标准

- 只做原文压缩，没有重组信息层级
- 引入 transcript 中不存在的结论
- 对管理层无关的细节堆积过多

### 10.5 验收重点

- 摘要长度可控
- 风险与需要支持项分离清晰
- 可一键复制到邮件或周报，但不能自动外发

---

## 11. Capability Spec: Cross-meeting Follow-up Skill

### 11.1 目标

识别连续两次及以上会议中重复出现、仍未关闭的事项，并给出 follow-up 建议。

### 11.2 输入

- 当前 action items
- 历史未关闭 action items
- project 历史摘要
- 状态变更日志

### 11.3 匹配规则

- 优先按 `action_item_id` 直连
- 无直连时按 `project_id + 语义相似度 + owner + 关键词` 做弱匹配
- 低置信匹配仅提示，不自动合并

### 11.4 输出

- `matched_previous_item`
- `carry_over_reason`
- `follow_up_suggestion`
- `escalation_hint`

### 11.5 页面展示

- `Action Center` Banner
- 行内“连续未关闭”标签
- 支持跳转原始会议记录

### 11.6 上线门槛

- 连续事项命中率 `>= 75%`
- 错误合并率 `<= 5%`

---

## 12. Capability Spec: Blocker Scan Skill

### 12.1 目标

从多次会议中识别重复 blocker、依赖风险和需要升级处理的信号。

### 12.2 输出

- `blocker_pattern`
- `affected_project_scope`
- `frequency`
- `severity`
- `escalation_suggestion`

### 12.3 判定边界

- 普通吐槽、情绪表达不算 blocker
- 必须对进度、依赖、资源或交付产生明确影响
- 相同关键词但不同上下文不能直接视为同一 blocker

### 12.4 上线门槛

- blocker 命中率 `>= 75%`
- 严重程度分级可接受率 `>= 80%`

---

## 13. 页面级交互规格

### 13.1 `Meeting Detail`

- Skill 入口不超过 `3` 个主按钮，其余进入更多菜单
- 所有 Skill 输出必须可回到原始 `Summary / Actions / Risks` 视图
- Skill 结果默认不覆盖原结构化纪要

### 13.2 `Action Center`

- 只展示与 action 闭环强相关的 Skills
- 推荐顺序：`Cross-meeting Follow-up` > `Action Focus` > `Blocker Scan`
- 支持批量触发时必须限制条数，避免长时间阻塞

### 13.3 `AI Ops`

- 展示 Skill 级采用率、失败率、平均时延、badcase 数
- 支持按 `skill_name / version / meeting_type / project_id` 过滤
- 支持对某个 Skill 版本标记“暂停灰度 / 回滚 / 继续观察”

---

## 14. 异常与降级策略


| 异常类型           | 系统处理                     | 用户可见行为       |
| -------------- | ------------------------ | ------------ |
| 模型超时           | 自动重试 1 次，仍失败则降级          | 展示失败提示与稍后重试  |
| JSON 解析失败      | 进入 fallback 解析或置为 failed | 不展示脏数据       |
| transcript 过长  | 分段摘要后再聚合                 | 明示“基于分段结果生成” |
| transcript 质量差 | 降低置信度并强制 `Needs Review`  | 提示用户优先检查原文   |
| RAG 召回为空       | 按无历史上下文继续执行              | 不阻断当前流程      |
| 外部工具失败         | 保留草稿和审计日志                | 提示稍后重试       |


---

## 15. 数据集与标注规范

### 15.1 最低样本量建议


| 能力                      | 开发集 | 验证集 | 回归集 |
| ----------------------- | --- | --- | --- |
| 纪要结构化                   | 150 | 50  | 50  |
| Action Item 提取          | 200 | 80  | 80  |
| Owner / Deadline        | 150 | 60  | 60  |
| Cross-meeting Follow-up | 100 | 40  | 40  |
| Blocker Scan            | 100 | 40  | 40  |


### 15.2 标注要求

- 关键字段采用双人标注
- 争议样本进入仲裁池
- 标注规范版本化管理
- 每次规则调整后补 10-20 条新边界样本

### 15.3 Badcase 入库标准

满足任一条件即入库：

- 用户删除 AI 结果并重写
- 用户将错误归因为“误提 / 漏提 / 幻觉 / 路由错误”
- 线上监控触发结构化失败或高风险告警

---

## 16. 线上指标与发布门槛

### 16.1 运行指标

- 成功率
- P50 / P95 时延
- 单次调用成本
- fallback 触发率
- JSON 结构成功率
- 用户人工接管率

### 16.2 产品指标

- AI 草稿采用率
- Action item 采纳率
- owner / deadline 改写占比
- Skill 触发采用率
- Skill 失败率
- badcase 回归通过率

### 16.3 发布门槛

- 离线指标达线
- 线上小流量稳定 `5-7` 天
- 高严重度 badcase 清零
- 无新增阻断型异常

---

## 17. 协作分工


| 角色       | 负责内容                     |
| -------- | ------------------------ |
| AI PM    | 能力定义、优先级、验收口径、badcase 分级 |
| 算法 / LLM | Prompt、模型策略、评测、版本优化      |
| 后端       | 工作流、状态机、任务队列、日志、审计       |
| 前端       | 入口、状态、纠错、反馈采集、可解释展示      |
| QA       | 回归方案、线上抽检、稳定性验证          |
| 运营 / 管理员 | 模板配置、Skill 灰度、复盘与停开控制    |


---

## 18. 版本治理

### 18.1 必须版本化的对象

- Prompt 模板
- Skill 定义
- 标注规范
- 回归集
- 评测脚本

### 18.2 每次版本升级必须记录

- 变更原因
- 影响能力
- 影响样本范围
- 离线结果
- 线上观察窗口
- 回滚条件

### 18.3 回滚条件

- 核心指标连续 `2` 天明显回退
- 新增高严重 badcase
- Skill 失败率超过阈值
- 输出稳定性下降影响页面主流程

