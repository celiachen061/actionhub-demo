# Espressif ActionHub｜项目案例主文档

> 用途  
> - AI 产品经理面试主项目讲解  
> - 个人网站项目详情页  
> - 面试前统一项目叙事底稿  
>  
> 这份文档已经吸收主文件中会被面试追问的关键内容：  
> - 来自 `PRD.md` 的产品边界、页面与状态体系  
> - 来自 `roadmap-final.md` 的版本演进逻辑  
> - 来自 `ActionHub-AI-System-Blueprint.md` 的系统架构、Workflow、Skills、评测与治理思路  
>  
> 面试准备时，优先看这份，不要求再记主文件原文。

---

## 1. 项目一句话

`ActionHub` 是一个面向 Espressif 内部混合会议场景的 AI 协同平台，连接 `Teams`、`Outlook`、会议室终端、`Jira` 与 `EHR`，把“会后人工整理纪要、手动发邮件、手动建任务”的流程，升级成“AI 结构化纪要 + 人工确认 + 任务流转 + 历史追踪 + AI 持续优化”的闭环。

---

## 2. 为什么做这个项目

我在内部调研里发现，项目型会议最痛的并不是“没人记录”，而是“记录之后没人推进”。

具体有四个问题：

1. 会后纪要整理耗时高。  
   PM 或研发负责人往往还要花约半小时整理纪要。基线采样显示，中位时长是 `31` 分钟。

2. action item 容易散落。  
   会议结论、邮件同步、聊天消息、Jira 建单之间没有统一承接。

3. 历史会议割裂。  
   同一个 blocker 会在连续几次会议里被反复提到，但没有项目级连续视图。

4. 混合会议场景更复杂。  
   线下会议室终端、线上 `Teams` transcript、Outlook 邮件、Jira 任务彼此割裂。

所以我判断，这不是一个“做个会议总结按钮”的问题，而是一个 **会议结果如何进入组织协同链路** 的问题。

---

## 3. 为什么从这个切口进入

### 3.1 为什么先做会后，不做会中
我没有先做“会中 AI 助手”，而是先做“会后协同闭环”，原因有三个：

- 用户痛感最强的是会后整理，不是会中记录
- 会后流程更容易量化，可以直接看整理时长、发送时延、采纳率、转单率
- 企业场景里高影响动作必须有人确认，会后更适合先建立可信边界

### 3.2 为什么只做三类项目型会议
我把试点收敛到三类会议：

- 项目周会
- 技术评审会
- 风险同步会

原因是这三类会议最容易形成 `纪要 -> action item -> Jira` 的闭环，会议目标清晰、结构清晰、后续动作明确，也更适合做模板化和效果评测。

### 3.3 为什么不直接用 Teams 自带 recap
因为 Teams/Copilot 可以做 recap，但不能解决这些问题：

- 会议结果如何被结构化确认
- 哪些内容该进入 Jira
- 哪些内容只应邮件同步
- 历史会议如何按项目沉淀
- badcase 如何被持续收集和优化

所以 `ActionHub` 的价值不是重复做总结，而是把 recap 后面的协同链路补齐。

---

## 4. 我的角色与职责

我的角色是 **AI 产品经理 / 0-1 方案 owner**。

我主要负责五类事情：

### 4.1 问题定义
- 决定先做会后，不做会中
- 决定 MVP 先聚焦项目型会议，不做全场景办公会议
- 决定 Phase 2 做 Skills，不做全自治 Agent

### 4.2 产品方案
- 主导 PRD、roadmap、AI system blueprint 的梳理
- 设计页面范围、用户流、异常流
- 定义 AI 结果状态体系与人工确认边界

### 4.3 AI 能力边界
- 定义 `AI Draft / Needs Review / Confirmed / Confidence`
- 决定 `owner / deadline` 宁缺毋滥
- 决定高影响动作不能自动写下游

### 4.4 跨团队对齐
- 和算法对齐抽取边界、Skills 范围、badcase 分类
- 和后端对齐状态机、数据契约、审计事件
- 和前端对齐页面触发、可解释展示和纠错方式
- 和业务方对齐 Jira / EHR 路由边界

### 4.5 试点与复盘
- 设计试点口径
- 定义指标
- 组织 badcase 复盘
- 决定哪些能力灰度，哪些能力先不放量

---

## 5. 版本演进

## 5.1 阶段 0：需求收敛与试点定义（2025.06）
这一阶段我没有先写功能清单，而是先做范围收敛：

- 访谈 `11` 位内部用户
- 旁听 / 回放 `7` 场会议
- 梳理 Teams / Outlook / 终端 / Jira / EHR 的现有流程
- 明确 MVP 只做会后，不做会中
- 明确先不做多 transcript 自动融合

目标是让 MVP 足够收敛、可验证。

## 5.2 MVP（2025.06 - 2025.08）
MVP 的唯一核心目标是：**显著减少会后纪要整理时间**。

核心能力：
- 接入 Teams / Outlook meeting object
- 主持人 / PM 手动指定主 transcript source
- 自动生成 `Summary / Decisions / Action Items / Risks / Open Questions`
- `AI Draft + Needs Review + Confirmed` 状态体系
- Outlook 邮件草稿生成与发送
- `Project History`

这一阶段不做多 transcript 融合，不做 EHR 正式写入，不做强 memory 召回。

## 5.3 Phase 1（2025.08 - 2025.10）
第二阶段目标是把“会后有纪要”升级成“会后有行动项和任务闭环”。

新增能力：
- action item 路由建议
- Jira draft 生成
- Jira 字段映射与确认创建
- `My Action Items`
- `Project History` 完善

## 5.4 Phase 2（2025.10 - 2025.11）
第三阶段我没有把它讲成“完整 Agent 平台重构”，而是讲成：

**在主 workflow 跑通后，开始把高频、稳定、可复用的 AI 能力抽成模块和 Skills。**

优先抽象：
- Meeting Type Classification
- Minutes Structuring
- Action Item Extraction
- Risk / Blocker Extraction
- Email Draft Generation
- Jira Draft Generation

同时引入：
- `Action Center`
- `AI Ops`
- 首批 Skills 治理

## 5.5 优化与复盘（2025.11 - 2025.12 初）
离职前主要做：
- badcase 分类与修正
- Prompt / Template 调优
- owner / deadline 抽取规则优化
- Jira 草稿采用情况复盘
- 下一阶段路线图梳理（History 召回、Action Center、EHR 路由、AI Ops）

---

## 6. 产品结构与页面体系

## 6.1 页面结构
系统覆盖 9 个页面：

1. `Dashboard`
2. `Meetings`
3. `Meeting Detail`
4. `My Action Items`
5. `Project History`
6. `Templates & Rules`
7. `Integrations & Admin`
8. `Action Center`
9. `AI Ops`

### 每个页面承接什么
- `Dashboard`：会议协同总览
- `Meetings`：会议列表与筛选
- `Meeting Detail`：会后确认工作台
- `My Action Items`：个人任务入口
- `Project History`：按项目查看历史沉淀
- `Templates & Rules`：模板与规则治理
- `Integrations & Admin`：外部系统接入与状态
- `Action Center`：跨会议 follow-up 与任务闭环
- `AI Ops`：AI 效果运营与 badcase 管理

## 6.2 核心页面：Meeting Detail
这是整个系统的核心工作台，采用三栏布局：

- 左栏：会议基础信息 + transcript
- 中栏：AI 结构化结果
- 右栏：Outlook / Jira / EHR 预览与确认操作

它不是一个“看纪要”的页面，而是一个 **会后协同工作台**，用户在这里完成：

- 看结果
- 改结果
- 确认结果
- 发送结果
- 流转结果

---

## 7. 核心 Workflow

## 7.1 主链路
1. `Teams / Outlook / Terminal` 产出会议对象和 transcript
2. 用户选择 `primary transcript source`
3. 系统触发 `Minutes Structuring`
4. AI 输出 `summary / decisions / action items / risks / open questions`
5. `owner / deadline` 这类高风险字段只在有证据时抽取，否则进入 `Needs Review`
6. 用户在 `Meeting Detail` 中查看 AI 结果和 `source_excerpt`
7. 用户确认后再发送 Outlook 邮件或创建 Jira draft
8. 结果沉淀到 `Project History / My Action Items / Action Center`
9. 编辑记录和 badcase 回流到 `AI Ops`

### 一句话版
`输入 -> AI 草稿 -> 人工确认 -> 下游流转 -> 数据沉淀 -> badcase 回流`

## 7.2 状态机
会议状态机：
`scheduled -> in_progress -> ended -> ai_draft_generated -> reviewed -> emailed -> jira_synced`

说明：
- 邮件或 Jira 写入失败时，不回退已确认纪要
- 保留失败状态并允许重试
- action item 级别还有 `needs_review / confirmed / discarded` 等状态

---

## 8. AI 设计与系统边界

## 8.1 核心原则
`ActionHub` 是一个 **workflow-driven system**，AI 不是自治主体，而是关键节点上的受控增强层。

### AI 负责
- 根据会议类型选择模板和处理策略
- 将 transcript 组织成结构化结果
- 识别 `decision / action item / risk / open question`
- 给出 action item 的路由建议
- 在 Phase 2 做跨会议 follow-up 建议

### AI 不负责
- 自动拍板
- 自动发送邮件
- 自动创建 Jira
- 自动强制分派任务

## 8.2 为什么 AI 只能起草，不能自动发邮件 / 建 Jira
因为 Outlook 邮件和 Jira issue 都属于高影响写操作。  
一旦误发、误建，用户信任会快速下降。

所以我的边界设计是：
- AI 可以生成草稿和建议
- 但发送邮件、创建 Jira、后续 EHR 写入都必须人工确认

## 8.3 为什么 `owner / deadline` 宁缺毋滥
因为这是用户最敏感、最容易质疑的字段。  
只要写错一次，用户会连摘要本身都不信。

所以我坚持：
- 抽不到就留空
- 缺失即进入 `Needs Review`
- 不为了“自动化率好看”强行补全

## 8.4 为什么只选一个主 transcript source
MVP 不做多 source 自动融合，而是由主持人 / PM 手动指定主 transcript source。

原因：
- 多源融合会带来版本冲突
- 时间轴对齐复杂
- 内容可能重复或归并错误
- 早期最重要的是建立“一个可信版本”，而不是“最全版本”

---

## 9. AI 模块、Skills 与 Knowledge Layer

## 9.1 模块层
我把系统拆成可评测的 AI 模块，而不是一个总 Prompt：

- Meeting Type Classification
- Minutes Structuring
- Action Item Extraction
- Owner / Deadline Recognition
- Routing Suggestion
- Risk / Blocker Extraction
- Email Draft Generation
- Jira Draft Generation

## 9.2 Skill 层（Phase 2）
当 Workflow 跑通后，再把高频、稳定、可复用能力抽成 Skills，例如：

- `Management Summary Skill`
- `Action Focus Skill`
- `Cross-meeting Follow-up Skill`
- `Blocker Scan Skill`
- `Routing Suggestion Skill`

### 为什么做 Skills，不做全自治 Agent
因为 Skills 更容易：
- 定义边界
- 灰度
- 回滚
- 做评测
- 嵌入页面场景

## 9.3 Knowledge Layer
ActionHub 的知识层不是客服式问答知识库，而是辅助会议协同的上下文层。  
它用于：

- 支撑模板路由
- 补充项目上下文
- 提供历史会议召回
- 提供 owner / 路由映射
- 支撑跨会议 follow-up

### 知识层组成
1. 会议模板库
2. 项目上下文库
3. 历史会议摘要库
4. 路由规则库
5. 组织角色 / owner 映射库

### MVP 与 Phase 2 的区别
- MVP：只做历史沉淀，不主动召回
- Phase 2：做轻量 RAG / memory，用于召回上次会议摘要、历史 action item 和项目背景

---

## 10. 最关键的产品取舍

1. 先做会后，不做会中  
2. 只选一个主 transcript source，不做多源融合  
3. AI 只能起草，不能自动发邮件 / 建 Jira  
4. `owner / deadline` 宁缺毋滥  
5. Phase 2 做 Skills，不做全自治 Agent  
6. Jira 先做 draft，不直接自动建单  
7. 先做 `Project History`，再做 `AI Ops`

这些决策比“多加几个 AI 按钮”更体现 AI PM 判断。

---

## 11. 试点结果

## 11.1 试点范围
- 访谈：`11` 位用户
- 会议回放 / 旁听：`7` 场
- 总覆盖：`107` 场会议
- 会议类型：项目周会、技术评审会、风险同步会

## 11.2 核心结果
- 会后纪要整理中位时长：`31 -> 14` 分钟
- AI 草稿采用率：`72%`
- Action item 提取采纳率：`83%`
- Jira 草稿转正式任务率：`61%`
- 跨会议 follow-up 跟进率：`67%`
- 连续 blocker 识别命中率：`73%`
- badcase 回归通过率：`91%`
- `Project History` 早期周活：`38%`

## 11.3 没完全达标的地方
- `Project History` 使用率前期偏低
- blocker 命中率没有完全达到理想目标
- 跨会议能力只做了灰度，未大范围放量

---

## 12. 最典型的 badcase

## Badcase 1：把讨论误判成 decision
### 现象
技术评审会里，把“倾向建议”写成“已达成结论”。

### 根因
用统一模板硬套不同会议类型，决议边界不清。

### 处理
- 按会议类型拆模板
- 技术评审会中弱化 summary，强化 `open question`
- 增加 `source_excerpt`

### 启发
不是所有问题都靠换模型解决，很多是产品边界和模板设计问题。

## Badcase 2：强行补 owner / deadline
### 现象
模型把模糊表述硬转成明确负责人和日期。

### 根因
追求“完整”压过了“可信”。

### 处理
- 改成宁缺毋滥
- 缺关键字段直接进入 `Needs Review`
- 把人工补写成本做低

### 启发
AI PM 要知道哪些字段一旦错了，用户会迅速失去信任。

---

## 13. 这个项目最体现我能力的地方

我觉得不是“我用了多少 AI 技术”，而是三点：

1. **做了正确的范围收敛**  
   没有追求全场景、会中、全自动，而是先找最容易形成闭环的链路。

2. **把 AI 能力放进了真实业务 Workflow**  
   不是做一个会议总结按钮，而是做成了“纪要 -> 邮件 -> Jira -> 历史 -> AI Ops”的完整链路。

3. **把产品判断做在了边界上**  
   比如：
   - 不做多源融合
   - 不自动发邮件
   - 不自动建 Jira
   - owner / deadline 宁缺毋滥
   - Phase 2 做 Skills，不做全自治 Agent

---

## 14. 复盘

如果再做一次，我会更早做三件事：

1. 更早定义 badcase taxonomy  
2. 更早结构化记录用户编辑行为  
3. 更早做轻量 Skill Registry 和版本治理

### 一句话总结
这个项目最有价值的地方，不是“AI 帮我写了纪要”，而是我把 AI 放进了一个真实企业流程里，并明确了可信边界、人工确认机制、评测口径和 badcase 闭环，让它成为一个 **可验证、可优化、可持续演进的 B 端 AI 产品**。
