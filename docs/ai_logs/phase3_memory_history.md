# 阶段 3.7: Memory History 面板

## 时间
2026-07-11

## 本阶段需求
将简单 Memory 升级为 Windows 11 风格的 Memory History 面板，支持多记忆条目管理。

## 需求分析

### Windows 11 Calculator Memory 机制

| 特性 | W11 行为 | 本项目实现 |
|------|----------|-----------|
| 记忆栈 | 多个记忆值以列表保存 | `memoryHistory: Array<{ id, value }>` |
| MS | 当前值入栈 | `memoryHistory.push()` |
| MR | 回显最近记忆值 | `display = memoryValue` |
| M+ | 累加到最近一条 | `last.value += display` |
| M- | 从最近一条减去 | `last.value -= display` |
| MC (主行) | 清除最近记忆 | `memoryHistory.pop()` |
| M∨ | 展开记忆面板 | `isMemoryPanelOpen = !` |
| 面板 MC | 删除指定条目 | `memoryHistory.splice(idx, 1)` |
| 面板 M+ | 累加到指定条目 | `item.value += display` |
| 面板 M- | 从指定条目减去 | `item.value -= display` |
| 条目点击 | 回显该条目值 | `display = item.value` |
| hover 操作 | 悬停显示 MC/M+/M- | `v-show="hoverId === item.id"` |

## AI 执行内容摘要

### 1. useCalculator.js — 数据结构升级

**旧结构**：
```js
const memoryValue = ref(null)  // 单值
```

**新结构**：
```js
const memoryHistory = ref([])          // Array<{ id, value }>
const memoryValue = ref(null)          // 最后条目的值（兼容旧逻辑）
const isMemoryPanelOpen = ref(false)   // 面板开关
let nextMemoryId = 1                   // 自增 ID
```

**新增辅助函数**：`syncMemoryValue()` — 每次 `memoryHistory` 变更后同步 `memoryValue`

**方法变更**：

| 方法 | 旧逻辑 | 新逻辑 |
|------|--------|--------|
| `memoryStore()` | `memoryValue.value = value` | `memoryHistory.push({ id, value })` + sync |
| `memoryAdd()` | 修改 memoryValue | 修改 last item.value + sync |
| `memorySubtract()` | 修改 memoryValue | 修改 last item.value + sync（首次 push -value） |
| `memoryClear()` | `memoryValue.value = null` | `memoryHistory.pop()` + sync |

**新增面板方法**：

| 方法 | 功能 |
|------|------|
| `memoryItemRecall(id)` | 回显指定条目到 display |
| `memoryItemAdd(id)` | 当前值累加到指定条目 |
| `memoryItemSubtract(id)` | 当前值从指定条目减去 |
| `memoryItemClear(id)` | 删除指定条目 |
| `toggleMemoryPanel()` | 切换面板显隐（空栈时忽略） |
| `closeMemoryPanel()` | 关闭面板 |

### 2. MemoryPanel.vue — 新组件

**Props**: `memoryHistory` (Array)

**Emits**: `close`, `recall`, `mc`, `mPlus`, `mMinus`

**功能**：
- 记忆列表以 `reverse()` 顺序展示（最新在上）
- 每项显示数值，点击该值 → `recall(id)`
- hover 时显示 MC / M+ / M- 操作按钮
- 空列表面板显示 "没有可用的记忆项目"
- 点击背景遮罩关闭面板

**样式**：
- `position: fixed` 全屏遮罩 + 居中面板
- 白色 260px 宽卡片，8px 圆角，阴影
- 标题 "记忆" + 分割线
- 列表项 hover 浅灰背景
- 操作按钮 12px 灰色文字

### 3. CalculatorKeypad.vue — M∨ 接入

- M∨ 按钮 `disabled` 跟随 `hasMemory`（无记忆时禁用）
- M∨ 点击触发 `@togglePanel` 事件（不经过 buttonClick 路由）
- 其他 memory 按钮不变

### 4. App.vue — 面板集成

- 导入 `MemoryPanel` 组件
- 解构新状态：`memoryHistory`、`isMemoryPanelOpen`
- 解构新方法：6 个 memory panel 方法
- `@toggle-panel` → `toggleMemoryPanel()`
- MemoryPanel 通过 `v-if` 条件渲染
- 面板事件：`@close` `@recall` `@mc` `@m-plus` `@m-minus`

## 修改文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/composables/useCalculator.js` | **修改** | memoryHistory 数组 + 11 个方法 |
| `src/components/MemoryPanel.vue` | **新建** | 记忆面板组件（列表 + hover 操作） |
| `src/components/CalculatorKeypad.vue` | **修改** | M∨ 接入 toggle 事件 |
| `src/App.vue` | **修改** | MemoryPanel 集成 + 事件路由 |
| `docs/ai_logs/phase3_memory_history.md` | **新建** | 本文件 |

## 设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| memoryValue 保留 | 独立 ref + sync | 兼容 Keypad 的 disabled 逻辑和 MR 逻辑 |
| 面板定位 | `fixed` 居中 overlay | 避免被 calculator 的 `overflow:hidden` 裁剪 |
| 面板关闭触发 | 遮罩 click.self | 减少 DOM 事件监听，Vue 模板内处理 |
| 列表排序 | `reverse()` 最新在上 | 与 Windows 11 面板一致 |
| hover 按钮 | `v-show` 非 `v-if` | 避免频繁 DOM 创建销毁 |
| M∨ 事件路径 | 独立 emit `togglePanel` | 与内存操作逻辑分离，不走 handleButtonClick |

## 测试步骤

| # | 操作 | 预期 |
|---|------|------|
| 1 | `100 MS 200 MS` → M∨ | 面板显示 200, 100（最新在上） |
| 2 | 面板 hover 200 → MC | 该项删除，面板剩 100 |
| 3 | 面板 hover 100 → M+ | 100 + 当前display值 |
| 4 | 面板点击 100 | display 恢复 100，面板关闭 |
| 5 | 面板 hover 100 → M- | 100 - 当前display值 |
| 6 | 删除所有条目 | 面板自动关闭 |
| 7 | 无记忆时 M∨ | 禁用（灰色） |
| 8 | 有记忆时 M∨ | 可用，点击展开/关闭 |
| 9 | 点击遮罩空白区 | 面板关闭 |
| 10 | MC 主行按钮 | 删除最近一条记忆 |
| 11 | M+ 主行按钮 | 累加到最近一条记忆 |
| 12 | `50 MS C 30 M+` → M∨ | 面板显示 80 |

## 已知局限

| 项目 | 说明 |
|------|------|
| 记忆最大值 | M- 可能产生负数，无下限限制 |
| 面板滚动 | 列表超过 max-height: 360px 时滚动 |
| 移动端面板 | 260px 固定宽度，小屏可能溢出（未特殊处理） |
| localStorage | 无持久化 |

## 遇到的问题
无。Memory History 功能一次性通过编译（Vite 434ms）。
