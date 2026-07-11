# Windows Calculator Vue3

使用 **Vue 3 + Vite** 实现的 **Windows 11 风格标准计算器**。项目采用 **AI 辅助编程** 方式开发，按工程化流程分阶段迭代，保留完整开发过程记录。

> 🔍 查看完整 AI 编程过程：[AI_CONVERSATION.md](AI_CONVERSATION.md)

---

## 项目介绍

本项目还原了 **Windows 11 自带计算器的标准模式（Standard）**界面与交互，包括完整的计算逻辑、Memory 记忆系统、Memory History 面板、计算历史记录和导航面板。

**项目目的**：

- 验证 AI 辅助编程在标准前端项目中的工程可行性
- 实践 "需求拆解 → 分阶段开发 → 小粒度 Git 提交" 的工作流
- 产出一份可供招聘方审阅的完整开发过程记录

**AI 辅助开发方式**：人工制定开发计划并拆解阶段 → AI 按阶段生成代码 → 人工 Review 并确认 → Git 提交 → 进入下一阶段。整个过程严格遵循 `脚手架 → 布局 → 逻辑 → 样式 → Memory → UI 交互` 的顺序，每阶段只关注一个维度。

---

## 当前实现范围

| 模式 | 状态 | 说明 |
|------|------|------|
| **标准 (Standard)** | ✅ 已实现 | 完整功能，包括四则运算、Memory、历史记录 |
| 科学 (Scientific) | ⚠️ 未开发 | 导航入口保留，标记为"未开发" |
| 绘图 (Graphing) | ⚠️ 未开发 | 导航入口保留，标记为"未开发" |
| 日期计算 (Date Calculation) | ⚠️ 未开发 | 导航入口保留，标记为"未开发" |

> 未开发模式的导航入口仅用于保持 Windows Calculator 导航结构一致，后续可扩展。

---

## 技术栈

| 技术 | 说明 |
|------|------|
| [Vue 3](https://vuejs.org/) | Composition API + `<script setup>` 语法 |
| [Vite](https://vitejs.dev/) | 开发服务器 & 构建工具 |
| JavaScript (ES Module) | 计算引擎 & 组件逻辑 |
| Vue Composables | `useCalculator()` 集中状态管理 |
| CSS Grid | 4×6 按钮网格 + Memory Row 布局 |
| CSS Custom Properties | 25+ 设计令牌，统一主题管理 |
| Git | 版本管理，15 次小粒度提交 |

**零第三方 UI 库**：所有样式纯手写，无 Bootstrap / Element Plus / Tailwind 依赖。

---

## 功能列表

### 基础计算

| 功能 | 说明 |
|------|------|
| ➕ 四则运算 | 加（+）、减（−）、乘（×）、除（÷） |
| 🔗 连续计算 | `5 + 3 − 2 =` 自动链式求值 |
| 🔄 运算符覆盖 | `5 + − 3 =` → 运算符自动切换 |
| 🔁 连续等号 | `5 + 3 = = =` → 重复上一次运算 |
| 🔢 小数计算 | 支持小数点输入，自动防重复 |
| 🧹 C / CE 清除 | C 全部清除，CE 仅清当前输入 |
| ⌫ 退格删除 | 逐位删除，自动处理边界 |
| ± 正负切换 | `5 → −5 → 5` |
| % 百分比 | `100 %` → 1 |
| ⚠️ 除零处理 | `5 ÷ 0 =` → 显示 "Error" |
| 🎯 浮点精度 | `0.1 + 0.2 = 0.3`（非 0.30000000000000004） |

### Memory 系统

| 功能 | 说明 |
|------|------|
| 💾 MS | Memory Store — 保存当前值到记忆 |
| 📋 MR | Memory Recall — 从记忆恢复到显示 |
| ➕ M+ | Memory Add — 当前值累加到记忆 |
| ➖ M- | Memory Subtract — 当前值从记忆减去 |
| 🗑️ MC | Memory Clear — 清除记忆 |

### Memory History Panel

| 功能 | 说明 |
|------|------|
| 📂 M∨ 展开 | 点击 M∨ 打开 Memory History 面板 |
| 📝 多条目 | 支持多条记忆值保存和展示 |
| 👆 Recall | 点击条目值恢复到显示屏 |
| 🎯 MC / M+ / M- | 每条记忆 hover 时显示操作按钮 |
| 🔒 自动关闭 | 删除全部条目后面板自动关闭 |

### 计算历史

| 功能 | 说明 |
|------|------|
| 🕗 历史面板 | 点击右上角历史按钮展开 |
| 📊 表达式 + 结果 | 每次成功计算自动记录 |
| 🧹 清除历史 | 一键清空全部历史记录 |

### Navigation 导航

| 功能 | 说明 |
|------|------|
| ☰ 导航菜单 | 点击左上角菜单按钮展开 |
| 📱 模式列表 | 标准（当前）/ 科学 / 绘图 / 日期计算 |
| 🏷️ 未开发标记 | 非标准模式显示灰色"未开发"标签 |

### UI / UX

| 功能 | 说明 |
|------|------|
| 🪟 Windows 11 布局 | Title Bar + Memory Row + 4×6 Grid |
| 🎨 三态按钮 | 默认 / hover / active 逐级加深 |
| 🔵 蓝色等号 | Windows 强调色 `#0078d4` |
| 📱 响应式 | ≤360px 移动端全宽适配 |
| 🔲 面板遮罩 | 点击遮罩区域关闭面板 |

---

## 项目结构

```
windows-calculator/
├── AI_CONVERSATION.md                # AI 编程过程完整记录
├── README.md                         # 本文件
├── index.html                        # Vite 入口 HTML
├── package.json                      # 项目配置
├── vite.config.js                    # Vite 配置
│
├── docs/
│   └── ai_logs/
│       ├── phase0_scaffold.md        # 阶段 0 — 脚手架
│       ├── phase1_layout.md          # 阶段 1 — 布局
│       ├── phase2_logic.md           # 阶段 2 — 逻辑
│       ├── phase3_style.md           # 阶段 3 — 样式
│       ├── phase3_memory.md          # 阶段 3.6 — Memory
│       └── phase3_memory_history.md  # 阶段 3.7 — Memory Panel
│
└── src/
    ├── main.js                       # Vue 应用入口
    ├── App.vue                       # 根组件（组装 + 事件路由）
    │
    ├── assets/
    │   └── styles/
    │       ├── variables.css         # CSS 设计令牌
    │       ├── base.css              # 全局 reset
    │       └── calculator.css        # 布局 + Title Bar + 响应式
    │
    ├── components/
    │   ├── CalculatorDisplay.vue     # 双行显示屏
    │   ├── CalculatorButton.vue      # 可复用按钮（6 种样式变体）
    │   ├── CalculatorKeypad.vue      # Memory Row + 4×6 Grid
    │   ├── MemoryPanel.vue           # Memory History 面板
    │   ├── HistoryPanel.vue          # 计算历史面板
    │   └── NavigationPanel.vue       # 模式导航面板
    │
    └── composables/
        └── useCalculator.js          # 核心引擎（状态 + 计算 + Memory + 历史）
```

### 组件说明

| 组件 | 职责 |
|------|------|
| **CalculatorDisplay** | 双行显示屏，Props: `expression` + `currentValue`，右对齐 |
| **CalculatorButton** | 可复用按钮原子组件，6 种样式变体（number / operator / function / equals / memory / disabled），支持三态交互 |
| **CalculatorKeypad** | Memory Row（6 个记忆按钮）+ 4×6 CSS Grid 键盘，声明式配置驱动 |
| **MemoryPanel** | Memory History 面板，hover 显示 MC / M+ / M- 操作按钮，支持条目召回 |
| **HistoryPanel** | 计算历史面板，自动记录每次成功计算，支持一键清除 |
| **NavigationPanel** | 模式导航面板，标准模式高亮，未开发模式灰色禁用 |
| **useCalculator** | Composition API 引擎，20+ 响应式状态 + 30+ 方法，覆盖全部逻辑 |

---

## 开发流程

本项目采用 **AI 辅助编程 + 分阶段开发** 模式，共经历 8 个阶段：

| 阶段 | 内容 | Git Commit |
|------|------|------------|
| **Phase 0** | 项目脚手架 — Vue3 + Vite 初始化 | `6214080` |
| **Phase 1** | 布局阶段 — HTML 结构 + 组件拆分 + CSS Grid | `bddc7a1` |
| **Phase 2** | 逻辑阶段 — 计算引擎 + 事件路由 | `94c829d` |
| **Phase 3** | 样式阶段 — Windows 10 视觉主题 | `bbd8429` |
| **Phase 3.5** | Windows 11 布局 — Title Bar + Memory Row + 按钮重排 | `820248a` |
| **Phase 3.6** | Memory 功能 — MS / MR / M+ / M- / MC | `c4c272e` |
| **Phase 3.7** | Memory History Panel — 多条目记忆面板 | `d6a906a` |
| **Phase 3.8** | Navigation & History Panel — 导航菜单 + 计算历史 | `8af6507` |

每个阶段遵循：**需求明确 → AI 生成 → 编译验证 → 人工 Review → Git 提交 → 确认进入下一阶段**。

---

## Git 提交记录

```
8af6507 feat(ui): add navigation panel and calculation history panel
d6a906a feat(memory): add memory history panel with item operations
c4c272e feat(memory): implement calculator memory operations
820248a style(ui): adapt calculator layout to Windows 11 standard design
8430fcb fix(memory): normalize floating point precision in memory operations
608cfc8 docs: add README.md — project overview with tech stack, features, and AI collaboration notes
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

- **需求拆解**：将完整需求拆分为独立阶段，每个阶段有明确的输入和输出边界
- **阶段开发**：每阶段 AI 只负责当前关注维度，通过否定式约束（"不要创建"、"不实现"、"不修改"）防止越界
- **人工 Review**：每阶段完成后人工审核代码质量、推演边界场景、确认 Git 状态后再提交
- **小粒度提交**：11 次提交对应 11 个可验证的里程碑，每次提交独立可回退

### 分工

| AI 负责 | 人负责 |
|---------|--------|
| 代码生成 & 编译验证 | 需求分析 & 阶段规划 |
| 架构建议 & 选项分析 | 最终决策 & 代码审核 |
| 文档草稿 & 日志记录 | Git 提交 & 质量把关 |
| 测试场景列举 | 边界推演 & 手动验证 |
