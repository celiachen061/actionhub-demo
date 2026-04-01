# reference-options

# 阶段 R：参考方案 A / B / C

本文件基于前面的竞品调研，输出三套参考方案。  
推荐采用：

- **A 作为主方案**
- **B 吸收界面工作台表达**
- **C 吸收 Phase 2 闭环升级思路**

---

## 方案 A：微软生态融合型（推荐主方案）

### 1. 核心定位
以 Teams / Outlook 为会议入口与上下文基础，以 Web 工作台承接会后纪要确认、邮件发送、Jira 路由和 EHR 预留通知能力的内部协同平台。

### 2. 适用原因
- 最贴近 Espressif 现有工具链
- 最像真实内部系统增强，而不是凭空做一个新工具
- 最适合“最终版展示 + 分阶段讲 MVP / Phase 1 / Phase 2”的叙事
- 更容易解释硬件终端的角色：输入源，而不是产品主体

### 3. 页面结构
#### MVP 页面
1. Dashboard
2. Meetings
3. Meeting Detail
4. My Action Items（轻量）
5. Project History
6. Templates & Rules（轻量）
7. Integrations & Admin

#### Phase 2 页面
8. Action Center
9. AI Ops

### 4. 关键交互
- 从 Teams / Outlook meeting object 进入会议详情
- 会议结束后自动生成 AI 草稿（默认自动，允许关闭）
- 主持人 / PM 手动指定主 transcript source
- AI 输出 Summary / Decisions / Action Items / Risks / Open Questions
- 主持人 / PM 确认后生成 Outlook 邮件
- action item 建议路由到 Jira / EHR / Email only
- MVP 先真正落地 Jira
- 同一项目下历史会议列表可查

### 5. 视觉方向
- 70% 微软企业协同风
- 30% 现代 AI SaaS 风
- 关键词：
  - 专业
  - 克制
  - 稳重
  - 高信息密度
  - AI Draft 可见但不过分炫技

### 6. 优点
- 最真实
- 最容易站住企业工具链背景
- 面试官最容易接受
- 与时间线、阶段演进最匹配

### 7. 风险
- 如果界面做得太保守，会偏“传统系统”
- 如果只讲集成而不讲工作台价值，会被误解为 Teams 外挂功能

### 8. 建议吸收
- 从 B 吸收三栏工作台式 `Meeting Detail`
- 从 C 吸收 Phase 2 的 `Action Center`

---

## 方案 B：会议工作台型（推荐用于核心页面表现）

### 1. 核心定位
把会议结果的查看、编辑、确认、任务同步集中在一个工作台页面中，突出 AI 结果到会后协同的承接。

### 2. 页面结构
1. Dashboard
2. Meetings
3. Meeting Detail（三栏）
4. My Action Items
5. Project History
6. Integrations

### 3. 关键交互
#### `Meeting Detail` 三栏布局
- 左栏：会议信息 + transcript 时间线
- 中栏：Summary / Decisions / Action Items / Risks / Open Questions
- 右栏：Outlook 邮件预览 + Jira / EHR 同步面板 + AI 状态标签

#### 核心动作
- 直接编辑 AI Draft
- 逐条确认 action item
- 补 owner / deadline
- 标记 needs_review
- 一键生成 Outlook 邮件草稿
- 一键生成 Jira draft

### 4. 视觉方向
- 更偏现代 AI SaaS
- 强调卡片化与内容模块化
- AI 结构化结果更突出
- 适合作品集原型展示

### 5. 优点
- 最容易讲“AI 结果 + 人工确认 + 系统同步”的价值
- 页面展示冲击力强
- 容易让面试官快速理解产品主价值

### 6. 风险
- 如果完全按 B 讲，会削弱真实微软生态背景
- 容易显得像一个“理想化新平台”

### 7. 适合使用方式
- 不作为产品定位主方案
- 作为 MVP 核心页面的展示样式使用
- 尤其适合：
  - Figma 原型
  - 作品集展示
  - 面试现场页面 walkthrough

---

## 方案 C：行动项闭环型（推荐用于 Phase 2）

### 1. 核心定位
把会议结果从“纪要内容”升级为“可持续追踪的协同对象”，重点放在 action item 的跨会议跟进与连续 blocker 追踪。

### 2. 页面结构
1. Dashboard
2. Action Center
3. Meeting Detail
4. Project History
5. Knowledge & Follow-up
6. AI Ops

### 3. 关键交互
- 在 Action Center 统一查看所有项目 action items
- 支持按项目 / owner / deadline / 状态筛选
- 支持查看连续两次会议未关闭事项
- 支持查看某个 blocker 的连续会议历史
- 会前自动带出未完成 action items（Phase 2）
- 对 Jira 状态做回写追踪（后续）

### 4. 视觉方向
- 更偏项目管理 / 任务系统风格
- 信息密度更高
- 更强调“推进”和“状态”

### 5. 优点
- 最能体现你和普通会议纪要工具的差异
- 非常适合讲 memory / follow-up / 闭环价值
- 很适合做 Phase 2 的长期价值叙事

### 6. 风险
- 不适合作为 MVP 主展示
- 一开始就讲 C，会让项目显得过大、过重
- 容易弱化 MVP 的第一痛点：会后整理耗时

### 7. 适合使用方式
- 用于 Phase 2 版本规划
- 用于 PRD 里的 Action Center / AI Ops 章节
- 用于面试时回答“这个项目后面还能怎么扩展”

---

## 综合推荐

### 最佳组合
- **主方案：A**
- **核心页面表达：B**
- **闭环升级与长期演进：C**

### 推荐原因
#### 为什么主方案是 A
- 与现有 Teams / Outlook / Jira 工具链最一致
- 最真实
- 最容易解释“为什么不是直接用 Teams 自带能力”
- 最适合讲内部协同平台

#### 为什么页面表现吸收 B
- `Meeting Detail` 需要更像“工作台”而不是“详情页”
- AI Draft、Needs Review、邮件预览、Jira 预览等内容更适合 B 的三栏表达

#### 为什么 Phase 2 吸收 C
- 你的后续价值不应只停留在“会后纪要”
- Action Center、历史追踪、memory、连续 blocker 才是更长期的壁垒

---

## 对原型设计的具体建议

### 产品形态
- Web 工作台为主
- 会议室终端只作为输入源状态显示
- Teams / Outlook / Jira / EHR 作为集成对象

### 首页风格
- 偏企业协同后台
- 有一定现代 AI 感
- 不消费级
- 不浮夸

### 核心页面优先级
1. Meeting Detail
2. Dashboard
3. Meetings
4. Project History
5. My Action Items
6. Integrations
7. Templates
8. Phase 2 的 Action Center / AI Ops

---

## 最终结论
本项目不适合做成“通用会议机器人”，也不适合做成“理想化 AI SaaS”。

最合理的方案是：

**以 A 方案做主线：微软生态融合型内部协同平台**  
**以 B 的三栏工作台形式呈现核心页面**  
**以 C 的行动项闭环能力作为 Phase 2 增强方向**

这套组合最符合：
- 真实场景
- 项目复杂度
- AI 必要性
- 作品集展示效果
- 面试叙事稳定性