# 阶段 1: 布局阶段（Layout）

## 时间
2026-07-11

## 本阶段需求
完成 Windows Calculator 风格计算器的页面结构，**不实现任何逻辑**。仅负责：
- HTML 结构
- Vue 组件拆分
- 基础 CSS Grid 布局

## AI 执行内容摘要

### 1. CalculatorDisplay.vue（显示屏组件）
- 使用 `defineProps` 接收 `expression`（String, 默认 `''`）和 `currentValue`（String, 默认 `'0'`）
- 两行显示：表达式（上方小字灰色）+ 当前值（下方大字深色）
- Flexbox 垂直排列，右对齐，`word-break: break-all` 处理长数字
- 预留 `min-height: 120px`，上方圆角（`4px 4px 0 0`）

### 2. CalculatorButton.vue（可复用按钮组件）
- 两个 props：
  - `label`（String, required）— 按钮文字
  - `type`（String, 'number' | 'operator' | 'function'）— 通过 `validator` 校验
- 使用 `defineEmits(['click'])` 预留点击事件（阶段 2 连接）
- BEM 命名：`.btn--number` / `.btn--operator` / `.btn--function`
- 三种类型通过背景色灰度区分：number 最亮 → operator 中等 → function 最深
- 统一高度 52px，`aria-label` 无障碍支持

### 3. CalculatorKeypad.vue（键盘网格组件）
- 声明式按钮配置数组 `buttons`，每条记录 `{ label, type }`
- 使用 `v-for` 遍历渲染 `CalculatorButton`
- CSS Grid：`grid-template-columns: repeat(4, 1fr)`，`grid-template-rows: repeat(6, 1fr)`
- `gap: 1px` 实现网格分割线效果（背景色从缝隙透出）

#### 按钮排列（24 个，还原 Windows Calculator 标准模式）

| 行 | 列1 | 列2 | 列3 | 列4 |
|----|-----|-----|-----|-----|
| 1 | % | √ | x² | 1/x |
| 2 | CE | C | ⌫ | ÷ |
| 3 | 7 | 8 | 9 | × |
| 4 | 4 | 5 | 6 | − |
| 5 | 1 | 2 | 3 | + |
| 6 | ± | 0 | . | = |

### 4. App.vue（根组件）
- 引入 `CalculatorDisplay` 和 `CalculatorKeypad`
- 使用占位变量 `expression = ''`、`currentValue = '0'` 传给 Display
- `.calculator` 容器：宽度 320px，`box-shadow` 卡片效果，居中显示
- 背景色 `#e8e8e8`，模拟 Windows 桌面背景

### 启动验证
- `npx vite` 在 460ms 内启动完成
- 无编译错误，无 Vue 模板警告
- 页面渲染 24 个按钮 + 显示屏

## 修改文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/components/CalculatorDisplay.vue` | 新建 | 双行显示屏，接收 props |
| `src/components/CalculatorButton.vue` | 新建 | 可复用按钮，支持 3 种 type |
| `src/components/CalculatorKeypad.vue` | 新建 | 4×6 CSS Grid 按钮网格 |
| `src/App.vue` | 修改 | 替换占位内容，组装 Display + Keypad |

## 设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| 按钮数据驱动 | `buttons` 数组声明式渲染 | 阶段 2 方便绑定事件和扩展 |
| 按钮 type 分类 | number / operator / function | 与 Windows Calculator 三类按钮语义一致 |
| Grid 分割线 | `gap: 1px` + 父级背景色 | 无需多层嵌套，简洁可靠 |
| 容器宽度 | 320px | Windows 标准计算器近似尺寸 |
| 显示区 | Flexbox 右对齐 | 计算器显示屏的通用交互规范 |

## 当前组件树
```
App.vue
├── CalculatorDisplay.vue  (props: expression, currentValue)
└── CalculatorKeypad.vue
    └── CalculatorButton.vue × 24  (props: label, type)
```

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
│       └── phase1_layout.md
└── src/
    ├── main.js
    ├── App.vue
    └── components/
        ├── CalculatorDisplay.vue
        ├── CalculatorButton.vue
        └── CalculatorKeypad.vue
```

## 遇到的问题
无。布局阶段顺利完成。
