# 阶段 0: 项目脚手架

## 时间
2026-07-11

## 本阶段需求
1. 在当前目录初始化 Vue3 + Vite 项目
2. 只完成基础搭建：`package.json`、`vite.config.js`、`index.html`、`src/main.js`、基础 `App.vue`
3. 不创建计算器组件、不实现业务逻辑、不添加额外样式
4. 通过 npm 启动验证

## AI 执行内容摘要

### 文件创建
AI 采用手动创建文件的方式（而非 `npm create vite`），确保每个文件内容精确可控：

1. **package.json** — 定义项目名为 `windows-calculator`，依赖 `vue: ^3.4.0`，开发依赖 `vite: ^5.4.0` 和 `@vitejs/plugin-vue: ^5.0.0`，`type: "module"` 启用 ES Module
2. **vite.config.js** — 最小配置，仅引入 `@vitejs/plugin-vue` 插件
3. **index.html** — Vite 标准入口 HTML，`lang="zh-CN"`，`<div id="app">` 挂载点，`<script type="module" src="/src/main.js">` 模块入口
4. **src/main.js** — Vue 3 标准入口，`createApp(App).mount('#app')`
5. **src/App.vue** — 占位根组件，`<script setup>` 空逻辑，模板仅显示提示文字，`scoped` 样式做居中展示

### 依赖安装
执行 `npm install`，成功安装 31 个包，audit 报告 2 个低风险漏洞（不阻塞开发）。

### 启动验证
执行 `npx vite --host 0.0.0.0 --port 5173`，服务器在 471ms 内启动完成：
- Local: `http://localhost:5173/`
- Network: `http://192.168.1.10:5173/`
- `curl` 验证返回完整 HTML，包含 Vite client 注入脚本

## 修改文件清单

| 文件 | 操作 |
|------|------|
| `package.json` | 新建 |
| `vite.config.js` | 新建 |
| `index.html` | 新建 |
| `src/main.js` | 新建 |
| `src/App.vue` | 新建 |
| `docs/ai_logs/phase0_scaffold.md` | 新建（本文件） |

## 遇到的问题
无。项目脚手架搭建顺利完成。

## 当前目录结构
```
windows-calculator/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── node_modules/
├── docs/
│   └── ai_logs/
│       └── phase0_scaffold.md
└── src/
    ├── main.js
    └── App.vue
```
