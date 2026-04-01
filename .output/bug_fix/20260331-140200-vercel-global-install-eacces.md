# BUG 修复报告

> 修复时间：2026-03-31 14:02:00

---

## 一、用户原话

> /bugfix @/Users/celiachen/.cursor/projects/Users-celiachen-Desktop-AI-Projects-Espressif-ActionHub/terminals/1.txt:13-61

---

## 二、问题分析

### 现象
在前端目录执行 `npm i -g vercel` 时安装失败，CLI 未能成功安装。

### 触发条件
用户尝试将 `vercel` 作为全局 npm 包安装到系统目录。

### 错误信息
```text
npm error code EACCES
npm error syscall mkdir
npm error path /usr/local/lib/node_modules/vercel
npm error Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/vercel'
```

---

## 三、可能原因猜测

1. **[最可能]** 当前用户对 `/usr/local/lib/node_modules` 没有写权限
   - 依据：报错明确指向 `EACCES` 和系统级安装目录

2. **[较可能]** 使用 `npm i -g` 触发了全局安装，需要管理员权限
   - 依据：`-g` 会写入全局目录，而不是项目目录

3. **[可能]** 当前 Node 版本过新，导致部分依赖出现兼容性警告
   - 依据：日志中出现 `EBADENGINE`，但这是 warning，不是本次安装失败的直接原因

---

## 四、根本原因

**位置**：`/usr/local/lib/node_modules/vercel`

**原因**：执行 `npm i -g vercel` 会向系统级 npm 全局目录写入文件，而当前登录用户对该目录没有写权限，因此操作系统拒绝创建目录并返回 `EACCES`。

**问题代码**：
```bash
npm i -g vercel
```

---

## 五、解决方案

**修复方式**：不再使用全局安装，改为项目内直接执行 `npx vercel`；如确实需要全局安装，则改用用户级 npm prefix，而不是写入 `/usr/local/lib/node_modules`。

**修复代码**：
```bash
npx vercel
```

**备选方案**：
```bash
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bash_profile
source ~/.bash_profile
npm i -g vercel
```

**修改文件列表**：
- `.output/bug_fix/20260331-140200-vercel-global-install-eacces.md`：新增本次问题修复报告

---

## 六、验证结果

- [x] 已确认根因是全局安装权限不足
- [x] 已给出无需管理员权限的替代方案 `npx vercel`
- [x] 未修改业务代码，不会引入前后端功能副作用

---

## 七、经验总结

**教训**：CLI 工具在 macOS 上使用 `npm i -g` 时，常会因为系统目录权限导致失败；优先使用 `npx` 或项目本地依赖更稳妥。

**预防**：后续安装部署类工具时，优先采用以下顺序：
1. `npx <tool>`
2. `npm i -D <tool>` 后用 `npx`
3. 确需全局安装时，先配置用户级 npm 全局目录

