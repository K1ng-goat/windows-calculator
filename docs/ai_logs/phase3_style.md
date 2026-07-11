# 阶段 3: 样式阶段（Style）

## 时间
2026-07-11

## 本阶段需求
将计算器界面还原为 Windows 10/11 Calculator 视觉风格，**不修改计算逻辑、不添加第三方 UI 库**。

## AI 执行内容摘要

### 1. CSS 架构 — 三层分离

```
src/assets/styles/
├── variables.css    ← 设计令牌（CSS Custom Properties）
├── base.css         ← 全局 reset + body 基础样式
└── calculator.css   ← 计算器卡片布局 + 响应式
```

#### variables.css — 设计令牌（25 个变量）

| 分组 | 变量数 | 涵盖 |
|------|--------|------|
| 背景色 | 3 | 页面 / 计算器 / 显示屏 |
| 按钮色 | 15 | number / operator / function / equals 各 3-4 个状态色 |
| 文字色 | 3 | primary / secondary / btn |
| 边框 | 1 | 分割线 |
| 尺寸 | 3 | 容器宽度 / 按钮高度 / 显示屏高度 |
| 字体 | 5 | 家族 / 大小(4 级) |
| 间距 | 2 | grid gap / display padding |
| 圆角阴影 | 2 | 4px 圆角 / 卡片阴影 |
| 动效 | 1 | 0.12s ease 过渡 |

#### base.css — 全局重置
- `box-sizing: border-box` 全局应用
- 字体平滑抗锯齿（`-webkit-font-smoothing`）
- body 使用 CSS 变量字体族和背景色

#### calculator.css — 卡片布局
- `.app` — flexbox 居中，`min-height: 100vh`
- `.calculator` — 320px 最大宽度，白色卡片，阴影，圆角，`overflow: hidden`
- 响应式：≤360px 时全宽、去圆角、去阴影，适配移动端

### 2. 组件样式更新

#### CalculatorButton.vue
- 新增 `variant` prop（可选），用于覆盖 type 样式（equals 按钮）
- 样式全部改用 CSS 变量引用
- 增加三态：默认 → `:hover` → `:active`（逐级加深）
- 增加 `transition: background-color 0.12s ease` 平滑过渡
- `user-select: none` 防止双击选中文字
- equals 按钮 `variant="equals"`：
  - 背景色：Windows 蓝 `#0078d4`
  - 文字：白色
  - 边框：同背景色
- 按钮类型灰度梯度（由亮到暗）：number > operator > function

#### CalculatorDisplay.vue
- 样式全部改用 CSS 变量
- 去除原有 `border` 和 `border-radius`（由 `.calculator` 统一控制）
- 表达式行：14px 灰色（`#888888`），最小高度 20px
- 数值行：36px 浅黑（`#1a1a1a`），font-weight 300

#### CalculatorKeypad.vue
- grid gap 改用 `var(--gap-grid)` 变量
- 去除原有的 `border` 和 `border-radius`（卡片统一控制）
- 等号按钮配置增加 `variant: 'equals'`

#### App.vue
- **移除 `<style scoped>`** 块（样式迁入 `calculator.css`）
- 逻辑代码零变化

### 3. main.js 更新
- 新增 3 行 CSS 导入：`variables.css` → `base.css` → `calculator.css`
- 加载顺序：变量先行（供后续文件引用）

### 4. 视觉效果对照

| 元素 | Windows 10/11 | 本项目 |
|------|--------------|--------|
| 页面背景 | 浅灰 | `#e8e8e8` |
| 卡片背景 | 浅灰/白 | `#f2f2f2` |
| 数字按钮 | 白色调 | `#fafafa` → hover `#f0f0f0` |
| 运算符按钮 | 浅灰 | `#f0f0f0` → hover `#e6e6e6` |
| 功能按钮 | 中灰 | `#e8e8e8` → hover `#dcdcdc` |
| 等号按钮 | 蓝色强调 | `#0078d4` 白色文字 |
| 按钮高度 | ~52px | `52px` |
| 字体 | Segoe UI | `Segoe UI`, system-ui |
| 圆角 | 微圆角 | `4px` |

## 修改文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/assets/styles/variables.css` | **新建** | 25 个 CSS 自定义属性 |
| `src/assets/styles/base.css` | **新建** | 全局 reset |
| `src/assets/styles/calculator.css` | **新建** | 卡片布局 + 响应式 |
| `src/main.js` | **修改** | +3 行 CSS 导入 |
| `src/components/CalculatorButton.vue` | **修改** | variant prop + Windows 三态按钮样式 |
| `src/components/CalculatorDisplay.vue` | **修改** | Windows 风格显示屏样式 |
| `src/components/CalculatorKeypad.vue` | **修改** | 等号增加 variant, 样式用变量 |
| `src/App.vue` | **修改** | 移除 `<style scoped>`（迁入 calculator.css） |
| `docs/ai_logs/phase3_style.md` | **新建** | AI 过程记录 |

## 设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| CSS 架构 | 变量 + 全局 reset + 卡片布局 三层分离 | 可维护，换主题只需改变量 |
| 等号按钮 | `variant` prop 覆盖 type | 不改动组件通信方式，最小侵入 |
| 过渡动效 | `0.12s ease` 仅背景色 | 短促，不影响操作节奏 |
| 按钮三态 | 默认 / hover / active | Windows UWP 标准交互模式 |
| 响应式 | `max-width` + `@media ≤360px` | 手机全宽显示，桌面居中卡片 |
| App.vue 无 scoped | 迁入全局 calculator.css | 布局样式跨组件共享，scoped 无意义 |

## 当前目录结构
```
windows-calculator/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
├── docs/
│   └── ai_logs/
│       ├── phase0_scaffold.md
│       ├── phase1_layout.md
│       ├── phase2_logic.md
│       └── phase3_style.md
└── src/
    ├── main.js
    ├── App.vue                          ← 无 scoped 样式
    ├── assets/
    │   └── styles/
    │       ├── variables.css            ← 设计令牌
    │       ├── base.css                 ← 全局 reset
    │       └── calculator.css           ← 卡片 + 响应式
    ├── components/
    │   ├── CalculatorDisplay.vue
    │   ├── CalculatorButton.vue         ← 新增 variant prop
    │   └── CalculatorKeypad.vue
    └── composables/
        └── useCalculator.js             ← 未修改
```

## 遇到的问题
无。样式阶段一次性通过编译（Vite 464ms）。
