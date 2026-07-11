# Windows Calculator Vue3

使用 **Vue 3 + Vite** 实现的 Windows 10/11 风格计算器。项目采用 **AI 辅助编程** 方式开发，按工程化流程分阶段迭代，保留完整开发过程记录。

> 🔍 查看完整 AI 编程过程：[AI_CONVERSATION.md](AI_CONVERSATION.md)

---

## 项目介绍

本项目还原了 Windows 自带计算器的**标准模式**界面与交互，支持四则运算、连续计算、百分比、正负切换等功能。

**项目目的**：

- 验证 AI 辅助编程在标准前端项目中的工程可行性
- 实践 "需求拆解 → 分阶段开发 → 小粒度 Git 提交" 的工作流
- 产出一份可供招聘方审阅的完整开发过程记录

**AI 辅助开发方式**：人工制定开发计划并拆解阶段 → AI 按阶段生成代码 → 人工 Review 并确认 → Git 提交 → 进入下一阶段。整个过程严格遵循 `布局 → 逻辑 → 样式` 的顺序，每阶段只关注一个维度。

---

## 技术栈

| 技术 | 说明 |
|------|------|
| [Vue 3](https://vuejs.org/) | Composition API + `<script setup>` 语法 |
| [Vite](https://vitejs.dev/) | 开发服务器 & 构建工具 |
| JavaScript (ES Module) | 计算引擎 & 组件逻辑 |
| Vue Composables | `useCalculator()` 状态管理 |
| CSS Grid | 4×6 按钮网格布局 |
| CSS Custom Properties | 25 个设计令牌，统一主题管理 |
| Git | 版本管理，5 次小粒度提交 |

**零第三方 UI 库**：所有样式纯手写，无 Bootstrap / Element Plus / Tailwind 依赖。

---

## 功能列表

| 功能 | 说明 |
|------|------|
| ➕ 四则运算 | 加（+）、减（−）、乘（×）、除（÷） |
| 🔗 连续计算 | `5 + 3 − 2 =` 自动链式求值 |
| 🔄 运算符覆盖 | `5 + − 3 =` → 运算符切换 |
| 🔁 连续等号 | `5 + 3 = = =` → 重复上一次运算 |
| 🔢 小数计算 | 支持小数点输入，防重复 |
| 🧹 C / CE 清除 | C 全部清除，CE 仅清当前输入 |
| ⌫ 退格删除 | 逐位删除，自动处理边界 |
| ± 正负切换 | `5 → −5 → 5` |
| % 百分比 | `100 %` → 1 |
| ⚠️ 除零处理 | `5 ÷ 0 =` → 显示 "Error" |
| 🎯 浮点精度 | `0.1 + 0.2 = 0.3`（非 0.30000000000000004） |
| 🎨 Windows 风格 UI | Segoe UI 字体、蓝色等号按钮、三态按钮交互 |
| 📱 响应式 | ≤360px 移动端全宽适配 |

---

## 项目结构

```
windows-calculator/
├── AI_CONVERSATION.md              # AI 编程过程完整记录
├── README.md                       # 本文件
├── index.html                      # Vite 入口 HTML
├── package.json                    # 项目配置
├── vite.config.js                  # Vite 配置
│
├── docs/
│   └── ai_logs/
│       ├── phase0_scaffold.md      # 阶段 0 日志
│       ├── phase1_layout.md        # 阶段 1 日志
│       ├── phase2_logic.md         # 阶段 2 日志
│       └── phase3_style.md         # 阶段 3 日志
│
└── src/
    ├── main.js                     # Vue 应用入口
    ├── App.vue                     # 根组件（组装 + 事件路由）
    │
    ├── assets/
    │   └── styles/
    │       ├── variables.css       # 25 个 CSS 设计令牌
    │       ├── base.css            # 全局 reset
    │       └── calculator.css      # 卡片布局 + 响应式
    │
    ├── components/
    │   ├── CalculatorDisplay.vue   # 双行显示屏
    │   ├── CalculatorButton.vue    # 可复用按钮原子组件
    │   └── CalculatorKeypad.vue    # 4×6 CSS Grid 键盘
    │
    └── composables/
        └── useCalculator.js        # 核心计算引擎（237 行）
```

### 组件说明

| 组件 | 职责 |
|------|------|
| **CalculatorDisplay** | 双行显示屏，Props: `expression`（表达式）+ `currentValue`（当前值），右对齐 |
| **CalculatorButton** | 可复用按钮，Props: `label`（文字）+ `type`（number/operator/function）+ `variant`（可选，如 equals），支持三态交互 |
| **CalculatorKeypad** | 24 按钮 CSS Grid 布局，声明式 `buttons[]` 配置，事件向上冒泡 |
| **useCalculator** | Composition API 计算引擎，7 个响应式状态 + 10 个方法，处理全部计算逻辑 |

---

## 开发流程

本项目采用 **AI 辅助编程 + 分阶段开发** 模式，共经历 4 个阶段：

| 阶段 | 内容 | Git Commit |
|------|------|------------|
| **Phase 0** | 项目脚手架 — Vue3 + Vite 初始化 | `6214080` |
| **Phase 1** | 布局阶段 — HTML 结构 + 组件拆分 + CSS Grid | `bddc7a1` |
| **Phase 2** | 逻辑阶段 — 计算引擎 + 事件路由 + 10 个方法 | `94c829d` |
| **Phase 3** | 样式阶段 — Windows 视觉主题 + 响应式 | `bbd8429` |
| **Phase 4** | 收尾阶段 — AI_CONVERSATION.md 记录文档 | `5dc82b4` |

每个阶段遵循：**需求明确 → AI 生成 → 编译验证 → 人工 Review → Git 提交 → 确认进入下一阶段**。

---

## Git 提交记录

```
5dc82b4 docs: add AI_CONVERSATION.md — complete AI-assisted development record
bbd8429 style: apply Windows Calculator visual theme
94c829d feat(logic): implement calculator computation engine
bddc7a1 feat(layout): add calculator display, button, and keypad grid components
6214080 chore: scaffold Vue3 + Vite project for Windows Calculator
```

所有提交遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

---

## 运行方式

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器访问
# http://localhost:5173
```

**生产构建**：

```bash
npm run build    # 输出到 dist/
npm run preview  # 预览构建产物
```

---

## AI 协作说明

本项目是 **"人工主导、AI 执行"** 协作模式的实践案例。详细过程记录在：

📄 **[AI_CONVERSATION.md](AI_CONVERSATION.md)**

### 协作要点

- **需求拆解**：将完整需求拆分为独立阶段（脚手架 → 布局 → 逻辑 → 样式），每个阶段有明确的输入和输出边界
- **阶段开发**：每阶段 AI 只负责当前关注维度，通过否定式约束（"不要创建"、"不实现"、"不修改"）防止越界
- **人工 Review**：每阶段完成后人工审核代码质量、推演边界场景、确认 Git 状态后再提交
- **小粒度提交**：5 次提交对应 5 个可验证的里程碑，每次提交独立可回退

### 分工

| AI 负责 | 人负责 |
|---------|--------|
| 代码生成 & 编译验证 | 需求分析 & 阶段规划 |
| 架构建议 & 选项分析 | 最终决策 & 代码审核 |
| 文档草稿 & 日志记录 | Git 提交 & 质量把关 |
| 测试场景列举 | 边界推演 & 手动验证 |
