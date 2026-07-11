# 阶段 2: 逻辑阶段（Logic）

## 时间
2026-07-11

## 本阶段需求
实现 Windows Calculator 的核心计算逻辑，**不修改样式、不添加动画、不实现 Memory 功能、不添加键盘监听**。

## AI 执行内容摘要

### 1. useCalculator.js — 计算引擎

#### 状态设计（7 个 ref）

| 状态 | 类型 | 初始值 | 说明 |
|------|------|--------|------|
| `display` | `ref('0')` | `'0'` | 主显示屏内容 |
| `expression` | `ref('')` | `''` | 表达式预览行 |
| `firstOperand` | `ref(null)` | `null` | 二元运算左操作数 |
| `pendingOp` | `ref(null)` | `null` | 待执行运算符 |
| `waiting` | `ref(false)` | `false` | 下一输入是否替换 display |
| `error` | `ref(false)` | `false` | 错误标记 |
| `lastOp` / `lastOperand` | `ref(null)` | `null` | 连续等号记忆 |

#### 核心方法（10 个）

**inputNumber(digit)**
- 错误态 → 自动清理
- `waiting` 为 true → 替换显示
- `display === '0'` → 替换（不拼接前导零）

**inputDecimal()**
- `waiting` 为 true → 显示 `'0.'`
- 已含小数点 → 忽略（防止多个小数点）

**selectOperator(op)**
- 存在待执行运算且用户已输入数字 → 先 `calculate()` 再设新运算符（链式计算）
- 紧跟运算符按键（`waiting === true`）→ 覆盖（运算符切换）
- 设置 `waiting = true`，等待下一个操作数
- 清除 `lastOp` / `lastOperand`（新运算链开始）

**calculate()**
- 正常路径：`firstOperand ⨁ display`
- 连续等号：`display ⨁ lastOperand`（用记忆的运算符和操作数）
- 除零：设置 error 态，display 显示 `'Error'`
- 浮点精度处理：`toPrecision(12)` 消除 `0.1+0.2` 类问题

**clear()** — 全部重置为初始态

**clearEntry()** — 仅清 display 为 `'0'`，保留待执行运算

**backspace()** — 逐位删除，空串 → `'0'`，单独负号 → `'0'`

**toggleSign()** — 正负翻转，`'0'` 无操作

**percent()** — 当前值 ÷100

#### 辅助函数

- **formatResult(num)**: 精度格式化，最大 16 位
- **compute(a, op, b)**: 纯四则运算，除零返回 null

### 2. CalculatorButton.vue 修改
- 在 `<button>` 元素上添加 `@click="$emit('click')"`，将原生 click 事件暴露给父组件

### 3. CalculatorKeypad.vue 修改
- 添加 `defineEmits(['buttonClick'])`
- `CalculatorButton` 上绑定 `@click="$emit('buttonClick', btn)"`，将按钮完整配置 `{ label, type }` 向上传递

### 4. App.vue 修改
- 引入 `useCalculator` 解构全部状态和方法
- 新增 `handleButtonClick({ label, type })` 事件路由：

```
type === 'number'
  ├── label === '.'  → inputDecimal()
  └── label !== '.'  → inputNumber(label)

type === 'operator'
  ├── label === '='  → calculate()
  └── label !== '='  → selectOperator(label)

type === 'function'
  ├── 'C'   → clear()
  ├── 'CE'  → clearEntry()
  ├── '⌫'  → backspace()
  ├── '±'   → toggleSign()
  ├── '%'   → percent()
  └── 其他  → (预留，不处理)
```

- 模板中将 `expression` 和 `display` 传给 `CalculatorDisplay`
- 监听 `@button-click` 事件

## 修改文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/composables/useCalculator.js` | **新建** | 核心计算引擎（237 行） |
| `src/components/CalculatorButton.vue` | **修改** | 添加 `@click` 事件发射 |
| `src/components/CalculatorKeypad.vue` | **修改** | 添加 `buttonClick` emit + 事件绑定 |
| `src/App.vue` | **修改** | 集成 useCalculator，事件路由 |

## 设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| 状态管理 | Vue `ref`（7 个独立 ref） | 轻量、透明，符合 Composition API 惯例 |
| 运算符覆盖 | `waiting` 为 true 时直接替换 | 还原 Windows Calculator 行为 |
| 连续等号 | `lastOp` + `lastOperand` 记忆 | 保持与 Windows Calculator 一致 |
| 浮点精度 | `toPrecision(12)` | 覆盖绝大多数用例且避免科学计数法 |
| 事件路由 | App.vue 集中 switch | 逻辑在一处，方便调试和维护 |
| √/x²/1/x | 占位不实现 | 本阶段范围外，按钮存在但无操作 |

## 测试案例（手动验证清单）

### 基础运算
| # | 操作 | 预期结果 |
|---|------|----------|
| 1 | `5 + 3 =` | display: 8, expression: "5 + 3 =" |
| 2 | `10 − 4 =` | display: 6 |
| 3 | `6 × 7 =` | display: 42 |
| 4 | `15 ÷ 3 =` | display: 5 |
| 5 | `1 ÷ 3 =` | display: 0.333333333333 |

### 连续运算
| # | 操作 | 预期结果 |
|---|------|----------|
| 6 | `5 + 3 − 2 =` | 先算 5+3=8 再算 8−2=6 |
| 7 | `2 × 3 + 4 =` | 先算 2×3=6 再算 6+4=10 |

### 运算符覆盖
| # | 操作 | 预期结果 |
|---|------|----------|
| 8 | `5 + − 3 =` | display: 2 (5−3) |

### 连续等号
| # | 操作 | 预期结果 |
|---|------|----------|
| 9 | `5 + 3 = = =` | 8 → 11 → 14 |

### 特殊功能
| # | 操作 | 预期结果 |
|---|------|----------|
| 10 | `C` | 全部重置，display: 0 |
| 11 | `5 0 CE` | display: 0（仅清当前输入） |
| 12 | `123 ⌫` | display: 12 |
| 13 | `5 ±` | display: −5 |
| 14 | `100 %` | display: 1 |
| 15 | `5 ÷ 0 =` | display: "Error" |
| 16 | Error 后按 `5` | 自动恢复，display: 5 |

### 小数与精度
| # | 操作 | 预期结果 |
|---|------|----------|
| 17 | `0.1 + 0.2 =` | display: 0.3（非 0.30000000000000004） |
| 18 | `.5 + .5 =` | display: 1 |

### 边界情况
| # | 操作 | 预期结果 |
|---|------|----------|
| 19 | `5 =`（无运算符按等号） | display: 5（不变） |
| 20 | `5 + 3 =` 后按 `8` | 开始新输入，display: 8 |

## 当前组件树（带数据流）
```
App.vue  ← useCalculator() 提供全部状态与方法
├── CalculatorDisplay.vue
│   props: expression (String), currentValue (String)  ← display
│
└── CalculatorKeypad.vue  ← @button-click → handleButtonClick()
    └── CalculatorButton.vue ×24  ← @click → 冒泡至 Keypad
```

## 遇到的问题
无。逻辑阶段一次性通过编译，Vite 457ms 启动无错误。

## 已知未实现功能
| 功能 | 状态 |
|------|------|
| √ (开方) | 按钮存在，未接线 |
| x² (平方) | 按钮存在，未接线 |
| 1/x (倒数) | 按钮存在，未接线 |
| MC/MR/M+/M-/MS | 暂未加入 UI |
| 键盘输入监听 | 未实现 |
| 长数字字号缩放 | 未实现 |
