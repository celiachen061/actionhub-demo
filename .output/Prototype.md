# Prototype

## 1. 原型交付说明

本阶段采用 **Pencil MCP** 完成高保真原型设计，主原型文件为：

- `.output/pencil-new.pen`

本次原型基于 `.output/ui-design-spec.md` 输出，并在用户多轮反馈后完成以下优化：

- 全局视觉统一为 **Modern Enterprise Collaboration UI**
- AI 表达从“大面积渐变”收敛为 **轻量渐变 + 浅色状态 + 结构化依据可视化**
- 所有页面均检查并修正了：
  - 内容重叠
  - 超出画布
  - 表格列挤压
  - 文本超出容器

---

## 2. 当前已完成原型范围

### 2.1 已完成页面

| 页面 | 阶段 | 原型状态 | 说明 |
|------|------|----------|------|
| Dashboard | MVP | 已完成 | 总览、待确认纪要、待同步 Jira、风险、系统状态 |
| Meetings | MVP | 已完成 | 会议筛选、列表、右侧概要预览 |
| Meeting Detail | MVP | 已完成 | Transcript / AI Structured Result / Preview & Actions 三栏工作台 |
| My Action Items | Phase 1 | 已完成 | Action item 列表、详情抽屉、AI 排序提示 |
| Project History | Phase 1 | 已完成 | 历史会议表格、跨会议模式识别提示 |
| Templates & Rules | MVP | 已完成 | 模板列表、AI 模块开关、邮件模板、路由规则 |
| Integrations & Admin | MVP | 已完成 | 集成卡片、终端状态、同步日志 |

### 2.2 Phase 2 说明

`Action Center` 与 `AI Ops` 已在设计说明书中定义为 **Phase 2 增强页**，当前状态如下：

- 已在导航中保留入口
- 已将 Phase 2 的核心 AI 能力拆解并植入现有页面中进行感知验证
- **当前 `.pen` 中未单独绘制这 2 个独立页面**

也就是说，当前原型的完成范围是：

> **7 个核心页面原型 + Phase 2 能力在现有页面中的轻量前置表达**

---

## 3. 各页面关键设计结果

### 3.1 Dashboard（MVP）

- AI 每日简报卡片采用轻量渐变背景
- 增加趋势洞察提示：
  - 决策落实率周环比变化
  - 连续风险提醒
- Pending Actions 中加入 AI 路由提示：
  - `AI 建议确认`
  - `AI 已自动路由至 Jira`
- Risks 区域强化高优先级视觉提醒

### 3.2 Meetings（MVP）

- 顶部为筛选条 + 搜索框
- 中部为会议列表表格
- 右侧为 Meeting Preview 预览区
- 新增 AI 主动提醒 Banner：
  - 未处理 action items
  - Jira 同步中断
- Summary 状态加入置信度表达

### 3.3 Meeting Detail（MVP）

- 左栏：Transcript
- 中栏：AI Structured Result
- 右栏：邮件 / Jira / 操作确认区

本页面是 AI 感知最强的核心工作台，新增与优化点包括：

- `AI Draft / Needs Review / Confidence` 状态体系
- Summary / Decisions / Action Items / Risks 的 section 级置信度 badge
- AI 来源依据芯片：
  - 例如“09:33 · Emily — 关键决策依据”
- Transcript 被引用段落高亮
- 遗漏项提示：
  - `AI 还识别到 1 项可能遗漏的 Action Item`

### 3.4 My Action Items（Phase 1）

- 顶部 KPI：Pending / Overdue / Needs Review
- 列表区展示任务、来源会议、截止时间、状态、路由去向
- 右侧抽屉展示任务详情与 Jira 状态
- 加入 AI 排序提示 Banner：
  - `AI 已按截止日期 & 依赖关系重新排序`
- 加入状态建议提示：
  - `Jira 已关闭，是否标记完成？`

### 3.5 Project History（Phase 1）

- 支持项目 / 时间 / 类型筛选
- 历史会议以结构化表格展示
- 新增跨会议模式识别提醒：
  - 识别同类 blocker 在多场会议中重复出现
- 行内加入会议关联图标，表达跨会议延续关系

### 3.6 Templates & Rules（MVP）

- 左侧模板列表
- 右侧模板详情与模块配置
- 支持 Summary / Decisions / Action Items / Risks / Open Questions 开关
- 增加 AI 模块历史采用率
- 默认模板增加 `AI 推荐` 标识

### 3.7 Integrations & Admin（MVP）

- Active Integrations 卡片区
- Meeting Room Terminals 状态区
- Recent Sync Logs 日志区
- 强化系统连通性、状态可视化、异常提示
- 页面风格已根据参考图调整为更现代的集成卡片布局

---

## 4. 本轮新增的 AI 小巧思

本轮在 MVP / Phase 1 范围内补充了多处“轻 AI 感知”设计，用于增强用户对 AI 参与流程的理解与信任：

### 4.1 AI 主动洞察

- Dashboard 趋势提醒
- Meetings 智能筛选 Banner
- Project History 跨会议模式识别

### 4.2 AI 可信度表达

- Meeting Detail section 级 confidence
- Meetings 列表级 summary confidence
- AI 来源依据标注 + transcript 定位

### 4.3 AI 建议而非黑箱自动化

- Pending Actions 的 AI 路由建议
- My Action Items 的状态修正建议
- Meeting Detail 的遗漏项提示
- Templates & Rules 的模块采用率反馈

---

## 5. 视觉与交互统一结论

当前原型已经形成以下统一性：

- 品牌视觉：`ActionHub` 新 Logo（蓝紫渐变 + 闪电符号）
- AI 视觉：浅靛蓝 / 紫色微强调，不喧宾夺主
- 状态颜色：
  - Success 绿色
  - Warning 橙色
  - Danger 红色
  - AI Accent 靛蓝
- 页面结构统一：
  - 左侧导航
  - 顶部工具栏
  - 主工作区
  - 详情页使用三栏 / 列表页使用表格 + 抽屉

---

## 6. 进入阶段 C 前的说明

当前 B2 原型阶段已完成的交付物：

- `.output/pencil-new.pen`
- `.output/Prototype.md`

建议进入阶段 C 时按以下边界推进：

1. 以当前 **7 个已完成页面原型** 作为 PRD 定稿基准
2. 将 `Action Center / AI Ops` 作为 **Phase 2 增强页** 在最终 PRD 中继续细化
3. 保持所有功能描述与当前原型一致，不新增未确认交互

---

## 7. 待确认问题

请确认以下两点：

- [ ] 当前 B2 原型范围是否确认通过（7 个核心页面 + Phase 2 能力前置表达）
- [ ] 是否进入阶段 C，输出最终版 `PRD.md`、`roadmap-final.md`、`prototype-final.md`、`architecture-blueprint.md`
