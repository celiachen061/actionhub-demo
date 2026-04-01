# Espressif ActionHub 路线图定稿

## 1. Mission
围绕 Espressif 内部混合会议场景，构建一个连接 `Teams`、`Outlook`、会议室终端、`Jira` 与 `EHR` 的会议决议与行动项推进平台，把“会后人工整理、任务手动创建、历史会议割裂”的流程，升级为“结构化纪要 + 人工确认 + 任务流转 + 历史追踪 + AI 持续优化”的闭环协同系统。

## 2. 用户与价值
### 核心用户
- 项目经理 / PM
- 研发负责人 / Tech Lead
- 项目核心成员

### 辅助用户
- 参会成员

### 后台用户
- 管理员

### 核心价值
1. 降低会后纪要整理成本。
2. 降低 action item 漏提、漏同步风险。
3. 让会议结果从一次性邮件升级为可追踪项目资产。
4. 把 AI 从“单次生成”升级为“可监控、可优化、可复用能力”。

## 3. 路线图总览
| 阶段 | 时间窗口 | 目标 | 关键产出 |
|------|----------|------|----------|
| 阶段 0 | 2025.06 | 明确试点边界和主流程 | 试点范围、会议类型、核心链路、数据契约 |
| V1 / MVP | 2025.06 - 2025.08 | 跑通会后纪要闭环 | 会议对象接入、结构化纪要、邮件发送、历史沉淀 |
| V1.5 / Phase 1 | 2025.08 - 2025.10 | 跑通任务流转闭环 | Jira draft、我的任务、历史增强、任务关联 |
| V2 / Phase 2 | 2025.10 - 2025.11 | 跑通 AI 模块化闭环 | Action Center、AI Ops、AI Skills、模块指标、badcase 机制 |
| 优化与复盘 | 2025.11 - 2025.12 初 | 稳定能力并明确下阶段投入 | 指标复盘、模板调优、回归体系、未来路线 |

## 4. 阶段 0：需求收敛与试点定义
### 目标
收敛试点范围，确保 MVP 只聚焦最真实、最可验证的会后协同问题。

### 核心工作
- 明确试点用户：PM、研发负责人、项目核心成员
- 明确试点会议类型：项目周会、技术评审会、风险同步会
- 梳理当前流程：订会、记录、发纪要、建 Jira
- 明确平台边界：平台只做会后结构化与协同闭环，不替代会议本身
- 明确 MVP 不做多 transcript 自动融合

### 阶段结果
- 试点范围确定
- 核心链路确定
- 数据契约初版确定

## 5. V1：MVP
### 目标
优先解决“会后纪要邮件整理耗时”和“会议结果不可快速确认”两个最直接问题。

### 页面范围
- `Dashboard`
- `Meetings`
- `Meeting Detail`
- `Project History`
- `Templates & Rules`
- `Integrations & Admin`

### 核心能力
- 接入 `Teams / Outlook` 会议对象
- 主持人 / PM 手动指定主 transcript source
- 自动生成 `Summary`、`Decisions`、`Action Items`、`Risks / Blockers`、`Open Questions`
- 主持人 / PM 确认和编辑 AI 草稿
- Outlook 邮件预览与发送
- 按项目查看历史会议
- 轻量模板配置
- 基础集成状态查看
- 顶部全局 `中 / EN` 语言切换

### 成功指标
- 会后纪要整理中位时长从 `30` 分钟降到 `15` 分钟以内
- Outlook 纪要发送中位时延从 `20` 分钟降到 `5` 分钟以内
- AI 草稿采用率达到 `>= 70%`
- Project History 周活查看率达到 `>= 40%`

## 6. V1.5：Phase 1
### 目标
把“会后有纪要”推进为“会后有行动项和任务闭环”。

### 页面范围
- `My Action Items`
- `Project History` 增强
- `Meeting Detail` 中 Jira 预览与确认能力增强

### 核心能力
- Action item 路由建议
- Jira 任务草稿生成
- Jira 字段映射确认
- 轻量 `My Action Items`
- 会议结果与 Jira 任务建立关联
- 项目历史页增强任务上下文

### 成功指标
- Action item 提取采纳率达到 `>= 80%`
- Jira 草稿转正式任务率达到 `>= 60%`
- 需要人工补写 owner / deadline 的 action items 占比控制在 `<= 25%`

## 7. V2：Phase 2
### 目标
把已经跑通的 AI 节点抽象成高频、稳定、可复用的能力模块与 `AI Skills`，并补齐跨会议闭环视角。

### 页面范围
- `Action Center`
- `AI Ops`
- `AI Skills` 能力层
- 对现有页面的 AI 微交互增强

### 核心能力
- 识别并抽象高频 AI 模块
- 统一模块输入输出定义
- 将高频模块封装成面向场景的 `AI Skills`
- 从模块级视角优化 prompt、模板、badcase
- `Action Center` 聚合所有项目 action items
- `AI Ops` 管理 badcase、模板效果、Skill 版本与识别质量
- 引入跨会议连续事项、连续 blocker 的识别与提示

### 优先抽象模块
- `Meeting Type Classification`
- `Minutes Structuring`
- `Action Item Extraction`
- `Risk / Blocker Extraction`
- `Cross-meeting Follow-up Skill`
- `Management Summary Skill`
- `Email Draft Generation`
- `Jira Draft Generation`

### 成功指标
- 跨会议未完成事项跟进率达到 `>= 65%`
- 连续 blocker 识别命中率达到 `>= 75%`
- 需要人工改写 owner / deadline 的 action items 占比降到 `<= 15%`
- 模块级 badcase 回归通过率达到 `>= 90%`

## 8. 优化与复盘阶段
### 目标
在已上线能力基础上做稳定化、效果复盘和下一阶段规划。

### 核心工作
- Badcase 分类与修正
- 模板与 prompt 调优
- Owner / deadline 抽取策略优化
- Jira 草稿采用情况复盘
- 纪要修改率分析
- 梳理下一阶段 backlog

### 输出
- 阶段性复盘结论
- 下阶段路线图
- 继续投入的 AI 模块优先级

## 9. 为什么这样排
### 为什么 V1 先聚焦会后
最痛的问题不是会中实时辅助，而是会后没人整理、任务易漏、手工建单成本高。V1 先解决最直接、最容易验证的问题。

### 为什么 V1.5 再做任务流转
会议纪要只能解决“记录”，不能解决“推进”。把 action item 与 Jira 打通，是产品从纪要工具升级为协同系统的关键一步。

### 为什么 V2 再做模块化
只有在 MVP 和任务流转阶段真正跑通后，才能看清哪些 AI 节点值得抽象成模块，因此把模块化放在 V2 更现实，也更利于稳定性。

### 为什么不一开始做全自治 Agent
会议决议、邮件发送和任务创建都属于高影响动作，企业协同场景需要明确人工确认边界，因此产品坚持“AI 生成草稿，人来确认再流转”的模式。

## 10. 关键依赖
### V1
- `Teams / Outlook` 接口可用
- 可用 transcript source
- 基础会议模板配置
- 项目归属信息可用

### V1.5
- `Jira` 接口可用
- Action item 到 Jira 字段映射稳定
- 历史会议沉淀结构稳定

### V2
- 历史会议结构化数据稳定
- 模板与 prompt 版本管理可用
- Skill Registry 与版本管理可用
- Badcase 分类与回归机制建立
- 聚合任务状态口径统一

## 11. 最终演进路径
**V1：会后整理效率工具**  
自动纪要 + 邮件同步 + 历史留存

**V1.5：会议结果推进系统**  
Action item 提取 + Jira 路由 + 我的任务

**V2：模块化 AI 协同系统**  
Action Center + AI Ops + AI Skills + 模块级优化闭环

**V3+：会议协同智能中枢**  
多源融合 + 历史召回 + 组织级效率分析 + 更细粒度路由能力
