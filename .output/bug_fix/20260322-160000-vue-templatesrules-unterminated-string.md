# BUG 修复报告

> 修复时间：2026-03-22（会话内修复）

---

## 一、用户原话

> [plugin:vite:vue] Error parsing JavaScript expression: Unterminated string constant. (1:1)
> /Users/celiachen/Desktop/AI Projects/Espressif ActionHub/frontend/src/pages/TemplatesRulesPage.vue:71:33
>
> （堆栈指向 `@vue/compiler-sfc` 解析插值表达式失败）

---

## 二、问题分析

### 现象

- `npm run dev` 时 Vite overlay 报错，`.vue` 单文件无法编译。

### 触发条件

- 打开或热更新 `TemplatesRulesPage.vue` 即出现。

### 错误信息

```
Error parsing JavaScript expression: Unterminated string constant. (1:1)
```

指向模板第 71 行附近 `{{ '{{' }}summary{{ '}}' }}` 一类写法。

---

## 三、可能原因猜测

1. **[最可能]** 在 `{{ }}` 插值内书写展示「字面量 `{{summary}}`」的转义方式不合法，导致表达式解析器认为字符串未闭合。
2. **[较可能]** 模板中嵌套引号与 `{{` 边界冲突。
3. **[可能]** 编译器版本对插值内字符串拼接规则更严格。

---

## 四、根本原因

**位置**：`frontend/src/pages/TemplatesRulesPage.vue` 模板内 `<pre>` 中的邮件示例行。

**原因**：试图用 `{{ '{{' }}summary{{ '}}' }}` 在模板里输出字面量 `{{summary}}`。Vue 会将 `{{ ... }}` 整体当作 **JavaScript 表达式** 解析，该组合在边界处产生 **未闭合的字符串常量**，触发 `Unterminated string constant`。

---

## 五、解决方案

**修复方式**：不在模板插值里拼接「假的大括号」，改为在 `<script setup>` 中定义 **普通字符串常量**（内含字面量 `{{summary}}` 等），模板中仅 `{{ emailBodyExample }}` 一次插值输出整段文本。

**修改文件**：

- `frontend/src/pages/TemplatesRulesPage.vue`
  - `<pre>` 内改为：`{{ emailBodyExample }}`
  - `script` 中新增：`const emailBodyExample = \`...\``

---

## 六、验证结果

- [x] 不再使用易混淆的嵌套 `{{ '{{' }}...` 写法
- [x] 邮件示例内容与修复前语义一致（占位符展示）

---

## 七、经验总结

**教训**：需要在 UI 中展示 **Vue 插值语法本身**（如 `{{name}}`）时，优先用 **脚本常量**、**`v-pre`** 或 **`v-text` 绑定字符串**，避免在 `{{ }}` 里再拼大括号。

**预防**：代码审查时关注模板内「演示用」占位符；可抽成 `const` 或 i18n 文案。
