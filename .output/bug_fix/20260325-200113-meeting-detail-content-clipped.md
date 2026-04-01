# BUG 修复报告

> 修复时间：2026-03-25 20:01:13

---

## 一、用户原话

> /bugfix 还是不对

---

## 二、问题分析

### 现象
`Meeting Detail` 页面中出现“内容显示不全/被裁切”的问题，用户反馈此前修复无效。

### 触发条件
进入会议详情页后，三栏布局中部分区域（尤其中栏与右栏）在当前视口下出现内容可视区域不足。

### 错误信息
无控制台报错，属于前端布局与滚动容器约束问题。

---

## 三、可能原因猜测

1. **[最可能] Grid 子项未设置 `min-height: 0`**
   - 依据：三栏为 grid 布局，内部又使用独立滚动容器，若子项默认为 `min-height: auto`，常见表现是内部滚动区域被挤压裁切。

2. **[较可能] 多层 `overflow` 组合导致裁切**
   - 依据：页面和子容器存在 `overflow: hidden/auto` 叠加。

3. **[可能] 高度计算链路冲突**
   - 依据：此前存在视口高度与壳层高度二次计算问题，虽已调整但可能仍受约束影响。

---

## 四、根本原因

**位置**：`frontend/src/pages/MeetingDetailPage.vue`（样式区）

**原因**：三栏 grid 子容器（`.left-column`、`.middle-column`、`.right-column`）缺少 `min-height: 0`，导致内部滚动容器在有限高度下无法正确收缩，表现为内容未完整显示。

**问题代码（修复前）**：
```css
.left-column {
  border-right: 1px solid #e2e8f0;
  border-radius: 0;
  overflow: auto;
}

.middle-column {
  padding: 0 16px 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.right-column {
  padding: 14px 12px 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
```

---

## 五、解决方案

**修复方式**：为三栏 grid 子容器补齐 `min-height: 0`，确保内部滚动区域可正常计算和显示完整内容。

**修复代码**：
```css
.left-column {
  min-height: 0;
  border-right: 1px solid #e2e8f0;
  border-radius: 0;
  overflow: auto;
}

.middle-column {
  min-height: 0;
  padding: 0 16px 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.right-column {
  min-height: 0;
  padding: 14px 12px 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
```

**修改文件列表**：
- `frontend/src/pages/MeetingDetailPage.vue`：补充三栏容器的 `min-height: 0`。

---

## 六、验证结果

- [x] 已完成代码修复
- [x] 目标文件无新增 linter 错误
- [ ] 需用户在本地页面刷新后确认“内容显示不全”是否彻底消失

---

## 七、经验总结

**教训**：在 Grid/Flex 布局下嵌套滚动容器时，`min-height: 0`/`min-width: 0` 是关键约束，缺失时极易出现“内容被裁切但无报错”。

**预防**：后续涉及多栏+独立滚动布局时，将 `min-height: 0` 纳入样式检查清单。
