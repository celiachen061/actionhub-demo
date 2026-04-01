# ActionHub Demo 上线说明（Vercel）

## 1. 当前可上线范围

- 当前仓库只有 `frontend/`，没有 `backend/`
- 前端为 `Vue 3 + Vite` 静态站点
- 默认是 `Mock Demo` 形态，适合先做演示站上线
- 路由使用 `hash` 模式，可直接部署到静态托管平台

## 2. 已准备好的部署配置

- `frontend/vercel.json`
  - `framework: vite`
  - `buildCommand: npm run build`
  - `outputDirectory: dist`

## 3. 推荐上线方式

### 方式 A：命令行最快

在 `frontend/` 目录执行：

```bash
npx vercel
```

首次执行时：

1. 选择登录方式
2. 选择创建新项目
3. 确认当前目录为 `frontend/`
4. 确认构建命令为 `npm run build`
5. 确认输出目录为 `dist`

正式发布：

```bash
npx vercel --prod
```

> 注意：不要使用 `npm i -g vercel`，优先使用 `npx vercel`

### 方式 B：Vercel 控制台导入

1. 登录 Vercel
2. 导入项目
3. Root Directory 选择 `frontend`
4. Framework Preset 选择 `Vite`
5. Build Command 填 `npm run build`
6. Output Directory 填 `dist`
7. 点击 Deploy

## 4. 域名建议

如果只是先给面试官、评审或客户演示：

- 先用 `*.vercel.app` 默认域名即可
- 等确认需要正式对外再绑自定义域名

如果要绑定正式域名：

1. 先购买域名（如阿里云、腾讯云、Cloudflare Registrar、Namecheap）
2. 在 Vercel 项目里添加自定义域名
3. 按 Vercel 提示去域名服务商配置 DNS

## 5. 上线前自检

在 `frontend/` 目录执行：

```bash
npm run build
```

预期结果：

- 成功生成 `dist/`
- 没有 TypeScript 构建报错
- 打开站点后可访问 `Dashboard`
- 各页面切换正常
- `Meeting Detail`、`Action Center`、`AI Ops` 可正常浏览

## 6. 当前限制

- 这是 Demo 站，不是正式生产系统
- 数据来自前端 Mock，不会持久化
- Outlook / Jira / AI Ops 等目前是演示数据，不会真正调用外部服务
