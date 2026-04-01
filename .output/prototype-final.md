# Espressif ActionHub 原型定稿说明

## 1. 交付文件
本轮原型采用 `Pencil MCP` 完成，高保真原型主文件为：

- `.output/pencil-new.pen`

本说明文件作为阶段 C 的原型定稿说明，基于最终确认后的页面状态整理。

## 2. 视觉方向
### 2.1 风格
整体采用 `Modern Enterprise Collaboration UI`，强调：

- 企业级信息架构清晰
- 现代、轻量、可信的协同产品质感
- AI 感存在，但不喧宾夺主
- 中高信息密度下仍保持可读性

### 2.2 视觉结论
- 页面背景以浅灰蓝为主
- 卡片、表格、面板以白底为主
- AI 区域使用浅渐变、浅状态底和证据可视化
- 状态色统一：
  - Success 绿色
  - Warning 橙色
  - Danger 红色
  - AI Accent 靛蓝

### 2.3 品牌与全局元素
- 已统一使用 `ActionHub` 主题 Logo
- 左侧导航统一包含页面阶段标识
- 顶部导航统一包含搜索、项目切换、通知、用户信息
- 顶部最右侧统一加入 `中 / EN` 切换按钮

## 3. 最终确认的页面范围
| 页面 | 阶段 | 状态 | 说明 |
|------|------|------|------|
| `Dashboard` | MVP | 已确认 | 会议总览、待确认纪要、待同步 Jira、风险与系统状态 |
| `Meetings` | MVP | 已确认 | 会议筛选、列表、状态、右侧预览 |
| `Meeting Detail` | MVP | 已确认 | 飞书妙记风格的 transcript + AI 结构化结果工作台 |
| `My Action Items` | Phase 1 | 已确认 | 个人任务列表、详情抽屉、AI 排序建议 |
| `Project History` | Phase 1 | 已确认 | 按项目沉淀历史会议、跨会议模式识别提示 |
| `Templates & Rules` | MVP | 已确认 | 模板、模块开关、邮件模板、路由规则 |
| `Integrations & Admin` | MVP | 已确认 | 集成卡片、终端状态、同步日志 |
| `Action Center` | Phase 2 | 已确认 | 跨会议 action items 聚合、筛选、闭环跟踪 |
| `AI Ops` | Phase 2 | 已确认 | 模块指标、badcase 管理、优化建议 |

## 4. 各页面定稿重点
### 4.1 Dashboard
- 作为总览入口，突出待确认纪要、待同步 Jira、风险与 blocker。
- 增加 AI 趋势提醒与轻量洞察。
- 系统状态区聚合 Teams / Outlook / Jira / EHR 与终端状态。

### 4.2 Meetings
- 采用筛选条 + 列表 + 预览区布局。
- 会议信息、来源、纪要状态、邮件状态、Jira 状态集中展示。
- 通过状态标签和 AI 提示降低扫描成本。

### 4.3 Meeting Detail
- 页面已恢复并定稿为正确内容。
- 视觉参考 `飞书妙记`，Transcript 区采用时间线式阅读体验。
- AI 结构化结果区与全局 AI 画风统一：
  - `AI Draft / Needs Review / Confidence`
  - 证据芯片
  - Transcript 引用高亮
  - 遗漏 action item 提示
- 右侧保留 Outlook / Jira 预览与确认动作。

### 4.4 My Action Items
- 提供 Pending / Overdue / Needs Review KPI。
- 支持按项目、状态、截止时间筛选。
- 以任务处理效率为中心，增加 AI 排序与状态修正建议。

### 4.5 Project History
- 以项目为主线查看历史会议。
- 增加跨会议模式识别提醒，强调“连续 blocker”和“连续未关闭事项”。

### 4.6 Templates & Rules
- 采用左右布局，左侧模板列表，右侧规则和模块配置。
- 强调模板化 prompt 和模块开关，不把复杂设置塞入业务工作台。

### 4.7 Integrations & Admin
- 采用更现代的集成卡片布局。
- 清晰展示连接状态、同步日志和终端在线情况。

### 4.8 Action Center
- 已单独绘制为 Phase 2 页面。
- 包含 KPI、AI 洞察 Banner、筛选条和 action item 表格。
- 表格间距、标签显示、列对齐已完成修正。
- 页面目标是让跨会议 follow-up 真正可见、可筛、可处理。

### 4.9 AI Ops
- 已单独绘制为 Phase 2 页面。
- 包含模块性能指标、badcase 列表、错误类型和优化建议区。
- 页面目标是让 AI 优化工作不再停留在零散反馈，而能沉淀为后台运营能力。

## 5. 本轮统一加入的 AI 设计小巧思
### 5.1 主动洞察
- Dashboard 趋势提醒
- Meetings 待处理提醒
- Project History 连续问题识别
- Action Center 重复 follow-up 提示

### 5.2 可信度表达
- Meeting Detail section 级 confidence
- 列表级状态与证据标签
- 来源片段可视化

### 5.3 建议而非替代
- Action item 路由建议
- 我的任务状态修正建议
- 可能遗漏事项提醒
- AI Ops 优化建议卡片

## 6. 全局交互定稿
### 6.1 语言切换
- 所有页面顶部导航最右侧均有 `中 / EN` 切换。
- 切换目标是全站文案统一切换，不改变业务数据。

### 6.2 布局规范
- 左侧全局导航保持固定结构
- 顶部为高频工具区
- 列表页使用表格 + 预览 / 抽屉
- 详情页使用双栏或三栏工作台

### 6.3 质量结论
本轮原型已完成以下收口：
- 修正内容重叠
- 修正超出画布
- 修正表格列挤压与间距不均
- 修正文案过长时的容器裁切与显示
- 修正 Meeting Detail 误替换问题
- 修正 Action Center 表格标签显示异常

## 7. 阶段 C 使用边界
最终 PRD、路线图与架构蓝图，应以当前确认后的 9 个页面原型为准，不再以旧版“7 页核心范围”作为基线。

## 8. 结论
原型阶段已完成并确认，当前 `pencil-new.pen` 可以作为：

- 最终 PRD 功能对齐依据
- 前端实现的页面结构依据
- 后端接口字段设计的展示参考
- Phase 2 能力拆分与后台运营视图的视觉基线
