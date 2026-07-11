# AI 编程过程记录 — Windows Calculator (Vue3 + Vite)

> **项目类型**: 公司技术测试项目  
> **开发日期**: 2026-07-11  
> **AI 工具**: Claude Code (Anthropic)  
> **模型**: deepseek-v4-pro  
> **开发方式**: AI 辅助编程，分阶段小粒度迭代  

---

## 一、项目概述

### 1.1 项目目标

使用 Vue 3 + Vite 开发一个 **Windows Calculator 风格** 的计算器，还原 Windows 10/11 自带计算器的**标准模式**。考核重点为：AI 辅助编程能力、Git 版本管理规范、工程化分阶段开发方法论。

### 1.2 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue 3 (Composition API + `<script setup>`) | ^3.4.0 |
| 构建 | Vite | ^5.4.0 |
| 样式 | 原生 CSS + CSS Custom Properties | — |
| 状态管理 | Vue `ref` / Composables（无第三方库） | — |
| 版本管理 | Git | — |
| UI 库 | 无（纯手写） | — |

### 1.3 为什么选择 Vue3 + Vite

- **Vue 3 Composition API**: 相比 Options API，`useCalculator` 这种逻辑抽离模式更适合 Composables，代码组织更清晰
- **Vite**: 开发服务器秒启动，HMR 即时生效，相比 Webpack 更轻量高效
- **零依赖**: 计算器体积小、逻辑闭环，不需要 UI 库或状态管理库
- **`<script setup>`**: 减少样板代码，defineProps/defineEmits 编译时优化

### 1.4 AI 辅助开发方式

本次开发采用 **"人工驱动 + AI 执行 + 分阶段确认"** 的协作模式：

- **人**：制定计划、拆解阶段、审核输出、决策把关、Git 提交
- **AI**：按阶段需求生成代码、验证编译、记录日志
- **流程**：需求分析 → 阶段拆分 → AI 执行 → 人工确认 → Git 提交 → 下一阶段

---

## 二、开发阶段记录

---

### Phase 0: 项目脚手架

**时间**: 2026-07-11 | **Git Commit**: `6214080`

#### 阶段目标

初始化 Vue3 + Vite 项目骨架，只搭建基础文件，不创建任何业务组件。

#### Prompt 摘要

> "在当前目录初始化 Vue3 + Vite 项目。只完成项目基础搭建：package.json、vite.config.js、src/main.js、基础 App.vue。不要创建计算器组件、不要实现任何业务逻辑、不要添加样式。"

#### AI 执行内容

- **手动创建文件**（而非 `npm create vite`），确保每个文件内容精确可控
- 创建 [package.json](package.json)：项目名 `windows-calculator`，`type: "module"`，依赖 `vue@^3.4.0`，开发依赖 `vite@^5.4.0` 和 `@vitejs/plugin-vue@^5.0.0`
- 创建 [vite.config.js](vite.config.js)：最小配置，仅挂载 Vue 插件
- 创建 [index.html](index.html)：Vite 标准入口，`<div id="app">` 挂载点，`lang="zh-CN"`
- 创建 [src/main.js](src/main.js)：`createApp(App).mount('#app')`
- 创建 [src/App.vue](src/App.vue)：占位根组件，`<script setup>` 空逻辑
- 执行 `npm install`，安装 31 个依赖包
- 执行 `npx vite` 验证，471ms 启动成功

#### 人工决策

- 不使用 `npm create vite` 脚手架命令，改用手动创建以精确控制文件内容
- 选择 `vue@3.4` 和 `vite@5.4` 稳定版本组合

#### 修改文件（6 个）

| 文件 | 操作 |
|------|------|
| `package.json` | 新建 |
| `vite.config.js` | 新建 |
| `index.html` | 新建 |
| `src/main.js` | 新建 |
| `src/App.vue` | 新建 |
| `docs/ai_logs/phase0_scaffold.md` | 新建 |

#### Git 提交

```
6214080 chore: scaffold Vue3 + Vite project for Windows Calculator
```

---

### Phase 1: 布局阶段（Layout）

**时间**: 2026-07-11 | **Git Commit**: `bddc7a1`

#### 阶段目标

完成计算器页面结构（HTML + 组件拆分 + CSS Grid 骨架），**不实现任何逻辑**。

#### Prompt 摘要

> "完成 Windows Calculator 风格计算器的页面结构。严格限制：不实现计算逻辑、不处理按钮点击事件、不创建计算状态管理。本阶段只负责：HTML 结构 + Vue 组件拆分 + 基础布局。"

#### AI 执行内容

**组件拆分（3 个组件）**：

1. **CalculatorDisplay.vue** — 双行显示屏
   - Props: `expression`（String, 默认 `''`），`currentValue`（String, 默认 `'0'`）
   - Flexbox 垂直排列，右对齐，`word-break: break-all`
   - 表达式行 14px 灰色，数值行 36px 深色

2. **CalculatorButton.vue** — 可复用按钮原子组件
   - Props: `label`（String, required），`type`（'number' | 'operator' | 'function'，含 validator 校验）
   - Emits: `click`（预留，阶段 2 连接）
   - BEM 命名：`.btn--number` / `.btn--operator` / `.btn--function`
   - 三种类型通过背景灰度区分

3. **CalculatorKeypad.vue** — 4×6 CSS Grid 键盘
   - 声明式 `buttons` 配置数组，`v-for` 渲染
   - `grid-template-columns: repeat(4, 1fr)`，`gap: 1px` 网格分割线效果
   - 24 个按钮完整还原 Windows Calculator 标准模式排列

**App.vue** — 组装 Display + Keypad，320px 宽度卡片居中

#### 人工决策

- 按钮分类采用 number / operator / function 三类语义，与 Windows Calculator 一致
- Grid 分割线使用 `gap: 1px` + 父级背景色方案，避免嵌套边框
- 按钮数据驱动（`buttons` 数组声明式），方便阶段 2 绑定事件

#### 修改文件（5 个）

| 文件 | 操作 |
|------|------|
| `src/components/CalculatorDisplay.vue` | 新建 |
| `src/components/CalculatorButton.vue` | 新建 |
| `src/components/CalculatorKeypad.vue` | 新建 |
| `src/App.vue` | 修改 |
| `docs/ai_logs/phase1_layout.md` | 新建 |

#### Git 提交

```
bddc7a1 feat(layout): add calculator display, button, and keypad grid components
```

---

### Phase 2: 逻辑阶段（Logic）

**时间**: 2026-07-11 | **Git Commit**: `94c829d`

#### 阶段目标

实现计算器核心计算引擎，**不修改 UI 样式、不添加动画、不实现 Memory 功能**。

#### Prompt 摘要

> "实现 Windows Calculator 的核心计算逻辑。创建 src/composables/useCalculator.js，使用 Vue3 Composition API。实现：数字输入、小数输入、四则运算、连续运算、等号计算、C/CE、删除、正负转换、百分比、除零错误处理。"

#### AI 执行内容

**useCalculator.js — 计算引擎（237 行）**：

状态机设计（7 个 `ref`）：

| 状态 | 初始值 | 用途 |
|------|--------|------|
| `display` | `'0'` | 主显示屏 |
| `expression` | `''` | 表达式预览 |
| `firstOperand` | `null` | 左操作数 |
| `pendingOp` | `null` | 待执行运算符 |
| `waiting` | `false` | 下次输入是否替换 display |
| `error` | `false` | 除零等错误标记 |
| `lastOp` / `lastOperand` | `null` | 连续等号记忆 |

10 个公开方法：

| 方法 | 功能 | 关键逻辑 |
|------|------|----------|
| `inputNumber(digit)` | 数字输入 | waiting 态替换显示；'0' 时不拼接前导零 |
| `inputDecimal()` | 小数点 | waiting 态显示 '0.'；防重复小数点 |
| `selectOperator(op)` | 运算符 | 有操作数时链式计算；无操作数时覆盖（切换） |
| `calculate()` | 等号 | 正常路径 + 连续等号复用 lastOp；除零 → Error |
| `clear()` | C | 全部重置 |
| `clearEntry()` | CE | 仅清 display，保留待执行运算 |
| `backspace()` | ⌫ | 逐位删除，空串 → '0' |
| `toggleSign()` | ± | 正负翻转 |
| `percent()` | % | ÷100 |

**事件流设计**：

```
按钮点击 → CalculatorButton(@click)
  → CalculatorKeypad(@button-click, payload={label, type})
    → App.vue → handleButtonClick() 事件路由
      → useCalculator 方法 → 响应式状态更新
        → CalculatorDisplay(props) 自动刷新
```

**浮点精度处理**：`toPrecision(12)` 消除 `0.1 + 0.2 = 0.30000000000000004` 问题

#### 人工决策

- 状态管理使用 7 个独立 `ref` 而非 `reactive` 对象：更细粒度、解构友好
- 事件路由集中在 App.vue 的 `handleButtonClick()`：单一调度点，方便维护
- √ / x² / 1/x 按钮暂不接线：UI 已存在但逻辑属阶段外
- 连续等号用 `lastOp` + `lastOperand` 记忆而非重新推导

#### 修改文件（5 个）

| 文件 | 操作 |
|------|------|
| `src/composables/useCalculator.js` | 新建 (+237 行) |
| `src/components/CalculatorButton.vue` | 修改 (+1 行) |
| `src/components/CalculatorKeypad.vue` | 修改 (+3 行) |
| `src/App.vue` | 修改 (+55 / -5 行) |
| `docs/ai_logs/phase2_logic.md` | 新建 |

#### Git 提交

```
94c829d feat(logic): implement calculator computation engine
```

---

### Phase 3: 样式阶段（Style）

**时间**: 2026-07-11 | **Git Commit**: `bbd8429`

#### 阶段目标

将计算器界面还原为 Windows 10/11 Calculator 风格，**不修改计算逻辑、不添加第三方 UI 库**。

#### Prompt 摘要

> "将当前计算器界面还原为 Windows 10/11 Calculator 风格。创建 CSS 三层架构：variables.css（设计令牌）、base.css（全局 reset）、calculator.css（卡片布局+响应式）。实现按钮三态交互、Windows 蓝色等号按钮、hover/active 过渡动画、移动端响应式。"

#### AI 执行内容

**CSS 三层架构**：

1. **variables.css** — 25 个 CSS Custom Properties
   - 背景色 3 个（页面 / 卡片 / 显示屏）
   - 按钮颜色 15 个（4 种按钮 × 3-4 状态色）
   - 文字色 3 个、尺寸 3 个、字体 5 个、间距 2 个、圆角阴影 + 动效

2. **base.css** — 全局 reset
   - `box-sizing: border-box` 全局
   - 字体平滑抗锯齿
   - body 引用 CSS 变量

3. **calculator.css** — 卡片 + 响应式
   - 320px 宽卡片居中 + 阴影 + 圆角
   - `≤360px` 全宽移动端适配

**按钮视觉系统**：

| 类型 | 默认 | hover | active |
|------|------|-------|--------|
| number | `#fafafa` (最亮) | `#f0f0f0` | `#e0e0e0` |
| operator | `#f0f0f0` | `#e6e6e6` | `#d4d4d4` |
| function | `#e8e8e8` | `#dcdcdc` | `#c8c8c8` |
| equals | `#0078d4` (蓝) | `#1a8ad4` | `#006cbe` |

- 过渡动效：`background-color 0.12s ease`
- `user-select: none` 防止双击选中
- equals 按钮通过新增 `variant` prop 覆盖 type 样式（最小侵入）

#### 人工决策

- CSS 变量集中管理：后续换主题只需修改 `variables.css`
- 等号按钮不通过 JavaScript 判断 label，而用 `variant` prop：符合组件设计原则
- App.vue 移除 scoped 样式：布局样式跨组件共享，scoped 无意义且产生冗余 data 属性
- 响应式断点 360px：覆盖绝大多数手机竖屏

#### 修改文件（9 个）

| 文件 | 操作 |
|------|------|
| `src/assets/styles/variables.css` | 新建 |
| `src/assets/styles/base.css` | 新建 |
| `src/assets/styles/calculator.css` | 新建 |
| `src/main.js` | 修改 (+3 行) |
| `src/components/CalculatorButton.vue` | 修改 |
| `src/components/CalculatorDisplay.vue` | 修改 |
| `src/components/CalculatorKeypad.vue` | 修改 |
| `src/App.vue` | 修改（移除 scoped 样式） |
| `docs/ai_logs/phase3_style.md` | 新建 |

#### Git 提交

```
bbd8429 style: apply Windows Calculator visual theme
```

---

### Phase 3.5: Windows 11 Calculator UI 适配

**时间**: 2026-07-11 | **Git Commit**: `820248a`

#### 阶段目标

根据真实 Windows 11 自带计算器界面重新调整布局，**不修改计算逻辑**。

#### Prompt 摘要

> "根据真实 Windows 11 Calculator 截图调整当前项目布局。参考 Windows 11 Calculator Standard 模式。需要调整：顶部标题区域、Memory 操作区域、功能按钮重新排列、CSS 视觉风格。"

#### AI 执行内容

**Title Bar 新增**：
- 左侧 ☰ 菜单按钮
- 居中"标准"模式标题
- 右侧 🕗 历史记录按钮

**Memory Row 新增**：
- MC / MR / M+ / M- / MS / M∨ 横向排列
- 小字体灰色按钮，禁用态浅色

**按钮重新排列（W11 标准模式）**：

| 行 | 列1 | 列2 | 列3 | 列4 |
|----|-----|-----|-----|-----|
| 1 | % | CE | C | ⌫ |
| 2 | 1/x | x² | √x | ÷ |
| 3 | 7 | 8 | 9 | × |
| 4 | 4 | 5 | 6 | − |
| 5 | 1 | 2 | 3 | + |
| 6 | +/− | 0 | . | = |

**视觉调整**：
- 计算器宽度 320→324px，圆角 4→8px
- 按钮高度 52→48px，主字体 36→42px
- 数字按钮 `#fafafa`→`#ffffff`（更白）
- 新增 memory / titlebar CSS 变量

#### 人工决策

- Title Bar 使用纯视觉占位，不实现菜单和历史功能（阶段 3.8 接线）
- Memory Row 按钮全部 `disabled`（阶段 3.6 实现逻辑）
- ± 改为 +/− 更符合 W11 实际标签

#### 修改文件（6 个）

| 文件 | 操作 |
|------|------|
| `src/App.vue` | 修改 — 新增 Title Bar |
| `src/components/CalculatorDisplay.vue` | 修改 — 放大字体 |
| `src/components/CalculatorKeypad.vue` | 修改 — Memory Row + 按钮重排 |
| `src/components/CalculatorButton.vue` | 修改 — 按钮视觉微调 |
| `src/assets/styles/variables.css` | 修改 — W11 设计令牌 |
| `src/assets/styles/calculator.css` | 修改 — Title Bar + Memory Row 样式 |

#### Git 提交

```
820248a style(ui): adapt calculator layout to Windows 11 standard design
```

---

### Phase 3.6: Memory 功能实现

**时间**: 2026-07-11 | **Git Commit**: `c4c272e`

#### 阶段目标

实现标准计算器 Memory 区域全部功能（MS / MR / M+ / M- / MC），**不修改计算逻辑**。

#### Prompt 摘要

> "实现 Windows Calculator Memory 功能。在 useCalculator.js 中增加 memoryValue 状态以及 memoryStore/memoryRecall/memoryAdd/memorySubtract/memoryClear 方法。Memory Row 按钮绑定真实事件。MC/MR 在无记忆时禁用。"

#### AI 执行内容

**useCalculator.js 新增**：

| 新增项 | 说明 |
|--------|------|
| `memoryValue` | `ref(null)` — 当前记忆值 |
| `memoryStore()` | 保存 display 到 memory |
| `memoryRecall()` | 从 memory 恢复到 display |
| `memoryAdd()` | display 累加到 memory |
| `memorySubtract()` | display 从 memory 减去 |
| `memoryClear()` | 清空 memory |

**CalculatorButton.vue 新增**：
- `disabled` prop（Boolean, 默认 false）
- `memory` 类型（透明背景、小字号、28px 高）
- 禁用态样式（`#b0b0b0` 灰色）

**CalculatorKeypad.vue 改动**：
- Memory Row 替换为 CalculatorButton 组件
- `hasMemory` computed 控制 MC/MR 禁用态
- M+/M-/MS 始终可用

**App.vue 改动**：
- 新增 `type === 'memory'` 事件路由

#### 人工决策

- memory 操作不修改 expression（独立于计算流程）
- M+/M- 初始 null 时从 0 开始（与 Windows Calculator 一致）
- M∨ 始终禁用（阶段 3.7 实现面板）

#### 修改文件（5 个）

| 文件 | 操作 |
|------|------|
| `src/composables/useCalculator.js` | 修改 — +1 状态 + 5 方法 |
| `src/components/CalculatorButton.vue` | 修改 — disabled + memory 类型 |
| `src/components/CalculatorKeypad.vue` | 修改 — Memory Row 接线 |
| `src/App.vue` | 修改 — memory 事件路由 |
| `docs/ai_logs/phase3_memory.md` | 新建 |

#### Git 提交

```
c4c272e feat(memory): implement calculator memory operations
```

---

### Phase 3.7: Memory History Panel

**时间**: 2026-07-11 | **Git Commit**: `d6a906a` / `8430fcb`

#### 阶段目标

将简单 Memory 升级为 Windows 11 风格的 Memory History 面板，支持多记忆条目管理。

#### Prompt 摘要

> "升级 Memory 数据结构为 memoryHistory 数组。实现 M∨ 展开面板。面板支持：多条记忆显示、hover 显示 MC/M+/M-、条目 Recall、遮罩关闭。解决浮点精度问题。"

#### AI 执行内容

**数据结构升级**：

```
旧: memoryValue: null | number
新: memoryHistory: Array<{ id, value }>
    memoryValue: 同步自 history 最后条目
    isMemoryPanelOpen: boolean
```

**MemoryPanel.vue 新组件**：
- `fixed` 居中遮罩面板（260px）
- 列表 `reverse()` 最新在上
- hover 时显示 MC / M+ / M- 操作按钮
- 点击条目值 → Recall 到 display
- 空列表显示"没有可用的记忆项目"
- 全部删除后面板自动关闭

**per-item 方法**：
- `memoryItemRecall(id)` — 回显指定条目
- `memoryItemAdd(id)` — 累加到指定条目
- `memoryItemSubtract(id)` — 从指定条目减去
- `memoryItemClear(id)` — 删除指定条目

**浮点精度修复**：
- 新增 `formatNumber(num)` 统一精度处理
- 所有 memory 写入操作（MS/M+/M-/itemAdd/itemSubtract）调用 `formatNumber`
- 解决 `0.1 + 0.2` → memory 显示 `0.30000000000000004` 问题

#### 人工决策

- `memoryValue` 保留作为同步引用（兼容 MC/MR 禁用逻辑）
- 面板使用 `fixed` 定位（避免被 calculator 的 `overflow:hidden` 裁剪）
- M∨ 独立 emit `togglePanel`（与 memory 操作事件路径分离）

#### 修改文件（5 个）

| 文件 | 操作 |
|------|------|
| `src/composables/useCalculator.js` | 修改 — history 数据结构 + 精度修复 |
| `src/components/MemoryPanel.vue` | **新建** |
| `src/components/CalculatorKeypad.vue` | 修改 — M∨ toggle |
| `src/App.vue` | 修改 — MemoryPanel 集成 |
| `docs/ai_logs/phase3_memory_history.md` | 新建 |

#### Git 提交

```
8430fcb fix(memory): normalize floating point precision in memory operations
d6a906a feat(memory): add memory history panel with item operations
```

---

### Phase 3.8: Navigation & Calculation History Panel

**时间**: 2026-07-11 | **Git Commit**: `8af6507`

#### 阶段目标

实现 Title Bar 两个按钮的实际交互：☰ 导航面板 + 🕗 计算历史面板。

#### Prompt 摘要

> "标题栏 ☰ 和 🕗 按钮目前只有视觉。实现点击打开对应面板。导航面板显示计算器模式列表（标准/科学/绘图/日期计算）。历史面板显示计算记录。"

#### AI 执行内容

**NavigationPanel.vue 新组件**：
- 模式列表：标准（高亮激活）、科学/绘图/日期计算（灰色 `disabled` + "未开发"标签）
- 遮罩点击关闭

**HistoryPanel.vue 新组件**：
- 计算历史列表（expression + result）
- 每次 `calculate()` 成功后自动 `push` 记录
- `[清除]` 按钮一键清空

**useCalculator.js 新增**：

| 新增项 | 说明 |
|--------|------|
| `isNavPanelOpen` | 导航面板开关 |
| `isHistoryPanelOpen` | 历史面板开关 |
| `calcHistory` | `Array<{ expression, result }>` |
| `addHistory()` | 自动记录（在 calculate 内调用） |
| `clearHistory()` | 清空历史 |
| `toggle*/close*` | 面板显隐控制 ×4 |

**App.vue 改动**：
- Title Bar ☰ `@click="toggleNavPanel"`
- Title Bar 🕗 `@click="toggleHistoryPanel"`
- 条件渲染 NavigationPanel + HistoryPanel

#### 人工决策

- 导航面板非标准模式全部 disabled，不做路由或占位实现
- 历史记录仅有成功的 `=` 操作（除零不记录）
- 面板统一使用 `fixed` 遮罩方案（与 MemoryPanel 一致）

#### 修改文件（4 个）

| 文件 | 操作 |
|------|------|
| `src/composables/useCalculator.js` | 修改 — +3 状态 + 6 方法 |
| `src/components/NavigationPanel.vue` | **新建** |
| `src/components/HistoryPanel.vue` | **新建** |
| `src/App.vue` | 修改 — titlebar 接线 + 面板渲染 |

#### Git 提交

```
8af6507 feat(ui): add navigation panel and calculation history panel
```

---

## 三、问题解决记录

### 3.1 Vue 组件通信设计

**问题**: 按钮点击事件如何从最底层的 `<button>` 传递到 App.vue 的路由函数？

**方案**: 三层事件冒泡

```
CalculatorButton  → 原生 @click → $emit('click')
CalculatorKeypad  → 接收 @click → $emit('buttonClick', btnData)
App.vue           → 接收 @button-click → handleButtonClick()
```

**理由**: 每层只传递自己关心的数据。Button 不关心父级如何使用，Keypad 附加按钮元数据（label + type），App 负责将元数据路由到具体方法。

### 3.2 Composition API 选择

**问题**: 计算逻辑放哪里？Vuex/Pinia？Provide/Inject？Composable？

**方案**: `useCalculator()` Composable

```js
// 在 App.vue 中调用一次，解构出响应式状态和方法
const { display, expression, inputNumber, ... } = useCalculator()
```

**理由**:
- 单例场景，无需全局状态管理库
- `ref` 响应式直连模板，无需 `.value`（模板自动解包）
- 与组件解耦，未来可单独测试

### 3.3 CSS 架构设计

**问题**: 样式散落在 4 个 `.vue` 文件的 `<style scoped>` 中，配色硬编码，无法统一调整。

**方案**: CSS Custom Properties 集中管理 + 三层分离

```
variables.css  →  25 个设计令牌（唯一真相源）
base.css       →  全局 reset
calculator.css →  布局 + 响应式
组件 scoped    →  通过 var(--xxx) 消费令牌
```

**理由**: 换主题只需修改 `variables.css`；组件 scoped 只负责自身内部，不重复定义颜色值。

### 3.4 Git 提交拆分

**问题**: 一个项目如何拆成多次有意义的提交？

**方案**: 按开发阶段拆分，每次提交对应一个可验证的里程碑

```
6214080  chore:  scaffold          → 项目可启动
bddc7a1  feat(layout): ...         → 页面可见
94c829d  feat(logic): ...          → 计算可用
bbd8429  style: ...                → 视觉完成
```

**理由**: 每个 commit 独立可回退、可 review。符合 Conventional Commits 规范。

### 3.5 AI 生成代码后的人工检查

在每个阶段 AI 生成代码后，执行以下检查流程：

1. **编译验证**: `npx vite` 启动，检查是否有 Vue 模板编译错误或 import 路径错误
2. **文件审阅**: `Read` 工具逐个读取修改文件，确认逻辑正确性
3. **边界推演**: 对 useCalculator.js 手动推演 20 个测试场景（链式计算、连续等号、除零、精度等）
4. **Git 状态确认**: `git status` 确保提交文件与预期一致，避免误提交 node_modules

---

## 四、AI 协作总结

### 4.1 分工模型

| 职责 | AI | 人 |
|------|-----|-----|
| 需求分析 | — | ✅ 拆解 Windows Calculator 功能、制定计划 |
| 代码生成 | ✅ 按阶段需求生成全部代码 | — |
| 架构决策 | ✅ 提供选项与分析 | ✅ 最终拍板 |
| 编译验证 | ✅ 自动运行 `npx vite` | — |
| 逻辑审查 | ✅ 提供测试场景 | ✅ 推演边界、确认正确性 |
| Git 提交 | ✅ 建议 commit message | ✅ 最终提交 |
| 文档记录 | ✅ 生成阶段日志 | ✅ 审核文档质量 |

### 4.2 为什么没有一次生成全部代码

这是本次开发最核心的工程方法选择。**一次生成全部代码**存在以下问题：

1. **上下文过大**: 一次 prompt 覆盖布局 + 逻辑 + 样式 + 配置，AI 容易顾此失彼
2. **难以 Review**: 300+ 行代码一次性输出，人难以逐行审核质量
3. **错误传染**: 布局阶段的架构选择如果出错，逻辑和样式都会受影响
4. **提交粒度粗糙**: 1 个 commit 包含所有内容，不符合小粒度提交要求
5. **不可逆**: 一旦方向偏了，回退成本高

**分阶段迭代**的优势：

- 每个阶段只关注一个维度（结构 → 逻辑 → 视觉）
- 每次输出量可控（50-200 行），方便 Review
- 阶段间有"确认点"（等待人工指令才进入下一阶段）
- Git 历史清晰反映开发过程
- 任一阶段不理想可以只回退当前阶段

### 4.3 通过阶段拆分控制 AI 输出

每个阶段的 Prompt 都包含**严格限制条款**：

> "不要创建计算器组件"、"不实现计算逻辑"、"不修改 UI 样式"、"不修改 useCalculator.js"

这些否定式约束有效防止 AI 越界生成，确保每个阶段输出聚焦且可控。

### 4.4 效率数据

| 指标 | 值 |
|------|-----|
| 总开发时长 | 1 天 |
| Git 提交次数 | 12 次 |
| 新建文件 | 20 个 |
| 修改文件（跨阶段） | 6 个（App.vue 经历 7 次迭代） |
| 核心计算引擎 | 350+ 行（30+ 方法，10+ 状态） |
| Vue 组件 | 6 个（Display + Button + Keypad + MemoryPanel + NavigationPanel + HistoryPanel） |
| Vite 编译时间 | 平均 460ms |
| 测试场景 | 30+ 个手动验证案例 |

---

## 五、项目最终目录结构

```
windows-calculator/
├── AI_CONVERSATION.md              ← 本文件
├── README.md
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
│
├── docs/
│   └── ai_logs/
│       ├── phase0_scaffold.md
│       ├── phase1_layout.md
│       ├── phase2_logic.md
│       ├── phase3_style.md
│       ├── phase3_memory.md
│       └── phase3_memory_history.md
│
└── src/
    ├── main.js
    ├── App.vue
    ├── assets/
    │   └── styles/
    │       ├── variables.css
    │       ├── base.css
    │       └── calculator.css
    ├── components/
    │   ├── CalculatorDisplay.vue
    │   ├── CalculatorButton.vue
    │   ├── CalculatorKeypad.vue
    │   ├── MemoryPanel.vue
    │   ├── NavigationPanel.vue
    │   └── HistoryPanel.vue
    └── composables/
        └── useCalculator.js
```

---

## 六、Git 提交历史

```
16c687d docs: update README for Windows 11 UI, memory and history features
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

## 七、当前功能范围

### 已实现 ✅

| 功能 | 说明 |
|------|------|
| **Standard Calculator** | 完整四则运算、连续计算、C/CE、⌫、±、%、浮点精度 |
| **Memory System** | MS / MR / M+ / M- / MC，含 disabled 状态管理 |
| **Memory History Panel** | M∨ 面板、多条目、hover 操作、条目 Recall |
| **Calculation History** | 自动记录计算表达式和结果、一键清除 |
| **Navigation Panel** | 模式列表、非标准模式标记"未开发" |
| **Windows 11 UI** | Title Bar、Memory Row、4×6 Grid、三态按钮、蓝色等号、响应式 |

### 未实现 ⚠️

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 科学计算器 (Scientific) | 低 | 导航入口保留，标记"未开发" |
| 绘图计算器 (Graphing) | 低 | 导航入口保留，标记"未开发" |
| 日期计算 (Date Calculation) | 低 | 导航入口保留，标记"未开发" |
| √ / x² / 1/x 功能 | 中 | UI 按钮存在，逻辑未接线 |
| 键盘输入监听 | 低 | `keydown` 事件映射到按钮 |
| 长数字自适应字号 | 低 | display 溢出时动态缩小字体 |
| 暗色主题 | 低 | `prefers-color-scheme: dark` 媒体查询 + 第二套变量 |
| 单元测试 | 中 | useCalculator.js 适合用 Vitest 做纯逻辑测试 |
| E2E 测试 | 低 | Playwright/Cypress 模拟点击操作 |
