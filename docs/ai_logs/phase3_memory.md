# 阶段 3.6: Memory 功能实现

## 时间
2026-07-11

## 本阶段需求
在保持现有计算逻辑稳定的情况下，实现标准计算器 Memory 区域全部功能：MS / MR / M+ / M- / MC。

## AI 执行内容摘要

### 1. useCalculator.js — 新增 Memory 状态与方法

**新增状态**：

| 状态 | 类型 | 初始值 | 说明 |
|------|------|--------|------|
| `memoryValue` | `ref(null)` | `null` | 存储的记忆数值（number 或 null） |

**新增方法（5 个）**：

| 方法 | 功能 | 关键逻辑 |
|------|------|----------|
| `memoryStore()` | MS — 存储 | `memoryValue.value = parseFloat(display.value)` |
| `memoryRecall()` | MR — 读取 | 设置 `display = formatResult(memoryValue)`，`waiting = true` |
| `memoryAdd()` | M+ — 累加 | `memoryValue += parseFloat(display)`，null 时从 0 开始 |
| `memorySubtract()` | M- — 累减 | `memoryValue -= parseFloat(display)`，null 时从 0 开始 |
| `memoryClear()` | MC — 清除 | `memoryValue.value = null` |

**设计要点**：
- Memory 操作不修改 `expression`（显示表达式不受影响）
- MR 后设置 `waiting = true`，符合 Windows Calculator 行为（下一数字输入替换显示）
- 所有运算通过 `parseFloat` 处理当前 display 值

### 2. CalculatorButton.vue — 新增 disabled 和 memory 类型

- 新增 `disabled` prop（Boolean, 默认 false）
- `type` validator 新增 `'memory'` 选项
- 新增 `.btn--memory` 样式：
  - 透明背景，小字号（12px），28px 高度
  - 禁用态：`#b0b0b0` 灰色，`cursor: default`
  - 启用态 hover/active：浅灰背景 `#e0e0e0` / `#d0d0d0`
- `<button>` 元素绑定 `:disabled="disabled"`

### 3. CalculatorKeypad.vue — Memory Row 接入事件系统

- 新增 `memoryValue` prop（Number, default null）
- `hasMemory` computed：`props.memoryValue !== null`
- memory 按钮由 CalculatorButton 组件渲染（替换 Phase 3.5 的纯展示 disabled 按钮）
- 按钮配置含 `disabled` 函数引用，模板中调用以保持响应式：

| 按钮 | 禁用条件 |
|------|----------|
| MC | `!hasMemory`（无记忆时禁用） |
| MR | `!hasMemory`（无记忆时禁用） |
| M+ | 始终可用 |
| M- | 始终可用 |
| MS | 始终可用 |
| M∨ | 始终禁用（无记忆栈实现） |

- 点击事件沿用现有冒泡机制：`@click → $emit('buttonClick', { label, type: 'memory', action })`

### 4. App.vue — Memory 事件路由

- 从 `useCalculator` 解构 `memoryValue` 及 5 个 memory 方法
- 模板中传递 `:memoryValue="memoryValue"` 给 CalculatorKeypad
- `handleButtonClick` 新增 `type === 'memory'` 分支：

```
type === 'memory'
  ├── 'MC' → memoryClear()
  ├── 'MR' → memoryRecall()
  ├── 'M+' → memoryAdd()
  ├── 'M-' → memorySubtract()
  ├── 'MS' → memoryStore()
  └── 'M∨' → (不处理)
```

## 修改文件清单

| 文件 | 操作 | 行数变化 |
|------|------|----------|
| `src/composables/useCalculator.js` | 修改 | +37 行（1 状态 + 5 方法 + 导出） |
| `src/components/CalculatorButton.vue` | 修改 | +17 行（disabled prop + memory 样式） |
| `src/components/CalculatorKeypad.vue` | 修改 | 重写 memory-row（inline button → CalculatorButton） |
| `src/App.vue` | 修改 | +11 行（memory 解构 + 路由 + prop 传递） |
| `docs/ai_logs/phase3_memory.md` | 新建 | 本文件 |

## 设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| Memory 类型 | 新增 CalculatorButton 'memory' type | 视觉上需要明显区别于主按钮（小、轻、文本化），同时复用组件 |
| 禁用逻辑 | Keypad 中 computed `hasMemory` + 函数式 disabled | 保持响应式，memoryValue 变化时 MC/MR 自动切换禁用态 |
| M∨ 按钮 | 始终禁用 | 单值记忆无栈，保留按钮仅为视觉还原 |
| M+/M- 初始值 | `memoryValue \|\| 0` | null 时从 0 开始累加，与 Windows Calculator 行为一致 |
| Memory 不修改 expression | 独立于计算流程 | Memory 是独立功能线，不应污染表达式显示 |

## 测试案例

| # | 操作 | 预期结果 |
|---|------|----------|
| 1 | `100 MS C MR` | 恢复显示 100 |
| 2 | `50 M+ 50 M+ C MR` | 恢复显示 100 |
| 3 | `200 MS 50 M- C MR` | 恢复显示 150 |
| 4 | `100 MS MC` | MC 按钮变灰（禁用），MR 按钮变灰（禁用） |
| 5 | `100 MS` | MC / MR 按钮变亮（可用） |
| 6 | `100 MS C CE MR` | CE 后 MR 仍可恢复 100 |
| 7 | `50 MS C 30 M+ MR` | 恢复显示 80（50 + 30） |
| 8 | `0 MS` | memory 存储 0，MC/MR 可用 |
| 9 | Memory null 后点击 MR | 无操作（guard clause） |
| 10 | `5 + 3 =` 之后 `MS C MR` | 恢复 8（不影响计算逻辑） |

## 已知局限

| 项目 | 说明 |
|------|------|
| M∨ 下拉 | Windows Calculator 支持记忆栈列表，本项目仅单值 |
| Memory 持久化 | 页面刷新后 memory 丢失（无 localStorage） |
| Memory 表达式 | MS/M+/M- 操作不产生 expression 变化 |

## 遇到的问题
无。Memory 功能一次性通过编译（Vite 446ms），所有测试案例验证通过。
