# BUG 修复报告

> 修复时间：2026-03-24 21:12:52

---

## 一、用户原话

> /bugfix 完全没变呀  
> 看红框，没改呀，还是很大  
> 悬浮框右侧不需要留白那么多，和左侧保持一致  
> 右侧还是很大

---

## 二、问题分析

### 现象
首页 `Pending Actions` 区域中，每行右侧箭头与卡片右边界之间留白过大，视觉上与左侧不对称；多次调参后用户感知“没有变化”。

### 触发条件
打开首页（Dashboard）查看 `Pending Actions` 两条 action 行即可稳定复现。

### 错误信息
无控制台报错，属于前端 UI 布局问题。

---

## 三、可能原因猜测

1. **[最可能]** 行布局策略（grid + 绝对定位）在当前结构下导致箭头位置表现不符合预期  
   - 依据：即便改 `right` 值，用户视觉上仍认为右侧留白过大

2. **[较可能]** 行容器的负外边距与内边距策略叠加，放大了“可见空白”感知  
   - 依据：为整条 hover 效果使用了 `margin: 0 -20px; padding: 10px 20px`

3. **[可能]** 内容区与箭头分离布局让箭头与文本关系弱，导致“右边空”更明显  
   - 依据：箭头独立定位，文本区宽度变化不会影响箭头视觉锚点

---

## 四、根本原因

**位置**：`frontend/src/pages/DashboardPage.vue`

**原因**：`Pending Actions` 行使用 `grid` 与绝对定位箭头，结合整条 hover 的负外边距/内边距策略后，箭头位置在用户视觉上仍形成较大右侧留白；布局机制不够稳定和直观。

**问题代码（修复前关键点）**：
```css
.dashboard-action-row {
  grid-template-columns: minmax(0, 1fr);
  position: relative;
}

.dashboard-action-arrow {
  position: absolute;
  right: 8px;
}
```

---

## 五、解决方案

**修复方式**：将 `Pending Actions` 行改为 `flex` 两端布局（`justify-content: space-between`），让箭头回归正常文档流的右侧锚点，不再依赖绝对定位，减少视觉错觉。

**修复代码（关键片段）**：
```css
.dashboard-action-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.dashboard-action-arrow {
  align-self: center;
  flex-shrink: 0;
}
```

**修改文件列表**：
- `frontend/src/pages/DashboardPage.vue`：调整 `Pending Actions` 行布局与箭头定位策略

---

## 六、验证结果

- [x] 问题不再复现（右侧留白显著收紧）
- [x] 相关功能正常（整行点击跳转、hover 高亮、状态展示均正常）
- [x] 未引入新问题（lint 通过、构建通过）

---

## 七、经验总结

**教训**：在“整条 hover + 右侧图标”场景中，绝对定位不一定是最佳方案，容易与容器内边距策略叠加造成视觉误判。

**预防**：优先采用更直观的流式布局（flex/grid 正常流）实现两端对齐，减少依赖绝对定位；遇到“看起来没变”的反馈时优先替换布局模型而非继续微调像素值。
