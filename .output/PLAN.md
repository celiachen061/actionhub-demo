# 开发计划

## 一、前端开发

### 基础设施
- [x] 新建 `frontend/` 项目结构（`Vue 3 + TypeScript + Pinia + Vue Router`）
- [x] 搭建 `AppShell`：左侧导航 + 顶部导航 + `中 / EN` 切换
- [x] 建立全局主题样式、页面布局容器、表格/卡片/状态标签等通用组件
- [x] 建立 `services/`、`stores/`、`router/`、`types/` 目录与基础约定
- [x] 建立 Mock 数据层，所有页面数据带 `[Mock]` 标识

### 页面范围
本次前端开发以 [`/Users/celiachen/Desktop/AI Projects/Espressif ActionHub/.output/demo-script.md`](/Users/celiachen/Desktop/AI%20Projects/Espressif%20ActionHub/.output/demo-script.md) 为演示主线，同时补齐其余页面的前端展示与基础交互，统一使用 Mock 数据：

- `Dashboard`
- `Meetings`
- `Meeting Detail`
- `My Action Items`
- `Project History`
- `Templates & Rules`
- `Integrations & Admin`
- `Action Center`
- `AI Ops`

#### 页面 1：Dashboard
- 功能：
  - 展示今日/本周会议
  - 展示待确认纪要、待发送邮件、待同步 Jira、未完成 action items、blocker 提醒
  - 提供 `中 / EN` 切换
  - 支持点击会议或待办入口跳转到 `Meeting Detail`
- Mock 数据：
  - 会议卡片 `3` 条
  - KPI 卡片 `5` 组
  - blocker / 风险提醒 `2-3` 条
  - AI 处理效果概览 `1` 组
- 跳转：
  - `Dashboard -> Meeting Detail`
  - `Dashboard -> Action Center`
  - `Dashboard -> AI Ops`
- [x] 开发完成

#### 页面 2：Meeting Detail
- 功能：
  - 三栏布局：左栏会议信息与 transcript，中栏 AI 结构化结果，右栏邮件/Jira 预览
  - 右栏「会议纪要邮件」「Jira Target」：卡片内仅预览；**查看/修改** 打开弹窗编辑，**推送** 视为最终确认；Jira 与 Jira Cloud `POST /rest/api/3/issue` 字段对齐（见 `AI-architecture.md` 5.3），Outlook 与 Graph **`sendMail`** 对齐（见 `AI-architecture.md` 5.4）。**分发与同步**标题区不展示「AI 提取」胶囊（与当前前端一致）。
  - 展示 `AI Draft / Needs Review / Confirmed / Confidence`
  - 支持修改一个 `owner` 或 `deadline`
  - 支持查看 Outlook 邮件草稿
  - 支持查看 Jira draft
  - 支持返回或跳转到 `Action Center`
- Mock 数据：
  - transcript 分段 `8-12` 条
  - `Summary / Decisions / Action Items / Risks / Open Questions`
  - 至少 `1` 条 `Needs Review`
  - 邮件草稿 `1` 份
  - Jira 草稿 `2-3` 条
- 跳转：
  - `Dashboard -> Meeting Detail`
  - `Meeting Detail -> Action Center`
- [x] 开发完成

#### 页面 3：Action Center
- 功能：
  - 展示跨会议 action item 聚合列表
  - 展示逾期项、待补 `owner / deadline`、跨会议未关闭事项
  - 展示 `AI Skills` 推荐：`Action Focus`、`Cross-meeting Follow-up`、`Blocker Scan`
  - 支持跳转回相关 `Meeting Detail`
- Mock 数据：
  - action item 表格 `6-8` 行
  - KPI 卡片 `4` 组
  - AI 洞察 Banner `2` 组
  - Skills 推荐卡片 `3` 张
- 跳转：
  - `Action Center -> Meeting Detail`
  - `Dashboard -> Action Center`
- [x] 开发完成

#### 页面 4：AI Ops
- 功能：
  - 展示 badcase 分类
  - 展示模块级指标与 Skill 版本状态
  - 展示回归状态、失败率、采用率
  - 展示一个 badcase 列表和详情抽屉/侧栏
- Mock 数据：
  - 指标卡片 `4-6` 组
  - Skill 版本记录 `3` 条
  - badcase 列表 `5-6` 条
  - 回归状态与趋势信息 `1-2` 组
- 跳转：
  - `Dashboard -> AI Ops`
- [x] 开发完成

#### 页面 5：Meetings
- 功能：
  - 顶部筛选条
  - 会议列表与状态标签
  - 右侧概要预览
  - 支持跳转到 `Meeting Detail`
- Mock 数据：
  - 会议列表 `3` 条
  - 筛选项 `4` 组
  - 右侧概要卡片 `2` 组
- 跳转：
  - `Meetings -> Meeting Detail`
- [x] 开发完成

#### 页面 6：My Action Items
- 功能：
  - KPI 概览
  - 筛选条
  - 任务列表
  - 右侧详情抽屉态展示
  - 支持返回 `Meeting Detail`
- Mock 数据：
  - KPI 卡片 `3` 组
  - 任务列表 `3` 条
  - 详情卡片 `1` 组
- 跳转：
  - `My Action Items -> Meeting Detail`
- [x] 开发完成

#### 页面 7：Project History
- 功能：
  - 项目与时间筛选
  - 历史会议列表
  - 跨会议模式提醒
  - 支持跳转 `Meeting Detail`
- Mock 数据：
  - 历史会议 `3` 条
  - 模式提醒 `2` 组
- 跳转：
  - `Project History -> Meeting Detail`
- [x] 开发完成

#### 页面 8：Templates & Rules
- 功能：
  - 模板列表
  - 模板详情
  - 模块开关
  - 邮件模板与路由规则展示
- Mock 数据：
  - 模板 `3` 条
  - 模块开关 `5` 项
  - 规则说明 `2` 组
- 跳转：
  - 页面内交互为主
- [x] 开发完成

#### 页面 9：Integrations & Admin
- 功能：
  - 集成状态表
  - 最近同步日志
  - 终端状态
  - 测试连接 / 重新授权按钮
- Mock 数据：
  - 集成状态 `4` 条
  - 同步日志 `2` 条
  - 终端状态 `1` 组
- 跳转：
  - 页面内交互为主
- [x] 开发完成

### 前端交付边界
- [x] 所有页面遵循原型和 `ui-design-spec.md`
- [x] 演示链路可在 `5-8` 分钟内完整走通
- [x] `owner / deadline` 编辑、邮件草稿查看、Jira draft 查看、跨会议闭环、AI Ops 指标这几个关键动作可见
- [x] 全部为 Mock 数据，不接真实后端
- [x] 其余页面具备前端展示和基础交互，可作为补充演示页
- [ ] 用户启动验收通过

## 二、后端开发（前端验收通过后补齐）

> 待前端验收通过后，按业务功能拆解填写。当前只预留最小可运行 Demo 所需 mock API 边界。

### 预留后端范围
- `GET /meetings`
- `GET /meetings/{meeting_id}`
- `PATCH /meetings/{meeting_id}/minutes`
- `GET /action-center/items`
- `GET /ai-ops/metrics`
- `GET /ai-ops/badcases`
- `PATCH /me/preferences/language`

### 后端目标
- [ ] 新建 `backend/` 目录，基于 `FastAPI + PyCore` 提供最小 mock API
- [ ] 用静态内存数据返回演示链路所需响应
- [ ] 保持与前端类型字段一致，方便后续替换真实实现

## 三、前端增量同步记录（2026-03）

> 以下为相对初版计划的已落地增量，用于保持文档与当前演示版本一致。

### 已同步完成
- [x] `Project History` 由 Tab 形态升级为「左侧可搜索项目栏 + 右侧时间轴 + 风险提示」，支持几十个项目的可扩展展示。
- [x] `Action Center` 表格区固定至少可见 `10` 行，其余内容纵向滚动；与「我的行动项」统一为标题点击打开右侧详情。
- [x] `Action Center` 右侧详情区已与左侧表格高度对齐，并对齐「我的行动项」详情结构与交互。
- [x] `Templates & Rules` 重构为设置中心形态：左侧分类导航、右侧详情编辑，补齐 `Extraction Rules / Auto-Routing Sync / Email Template / AI Governance / Security & Audit / Skills Registry`。
- [x] `Templates & Rules` 页面开关统一为滑动开关，弱化黑边按钮风格，优化 `AI 提取模块` 字号层级。
- [x] 顶部导航已合并为「账号与部门」单一筛选器，部门按账号权限动态过滤并可直接切换上下文。
- [x] 左侧导航顺序已调整为「我的行动项」后紧跟「行动中心」。
- [x] 全站完成一轮中英文文案巡检，修复多处中文界面仍显示英文小标题的问题（芯片/系统专有名词保留英文）。

### 待用户验收关注点
- [ ] 中文界面是否仍存在零星英文说明文案（主要集中在长段落与 mock 文案）。
- [ ] `Project History` 与 `Action Center` 在真实数据接入后的信息密度与滚动体验是否仍满足预期。
