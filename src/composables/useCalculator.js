import { ref } from 'vue'

/**
 * Windows Calculator — core computation engine.
 *
 * State machine overview:
 *   - `display`         → what the user sees on screen
 *   - `expression`      → formula shown above the display
 *   - `firstOperand`    → left-hand side of a pending binary operation
 *   - `pendingOp`       → operator waiting for right-hand operand
 *   - `waiting`         → next digit replaces display instead of appending
 *   - `lastOp` / `lastOperand` → stored on first "=" so repeated "=" can
 *     re-apply the same operation with the same operand.
 */

export function useCalculator() {
  // ---- reactive state ------------------------------------------------
  const display = ref('0')
  const expression = ref('')
  const firstOperand = ref(null)   // string
  const pendingOp = ref(null)       // '+' | '−' | '×' | '÷' | null
  const waiting = ref(false)        // display will be overwritten
  const error = ref(false)

  // for repeated-equals
  const lastOp = ref(null)
  const lastOperand = ref(null)

  // memory — history stack
  const memoryHistory = ref([])      // Array<{ id: number, value: number }>
  const memoryValue = ref(null)       // number | null — last item value
  const isMemoryPanelOpen = ref(false)
  let nextMemoryId = 1

  // navigation & history panels
  const isNavPanelOpen = ref(false)
  const isHistoryPanelOpen = ref(false)
  const calcHistory = ref([])         // Array<{ expression: string, result: string }>

  /** Sync memoryValue to reflect the last history entry. */
  function syncMemoryValue() {
    const len = memoryHistory.value.length
    memoryValue.value = len > 0 ? memoryHistory.value[len - 1].value : null
  }

  // ---- helpers -------------------------------------------------------

  /** Return a number with floating-point noise removed. */
  function formatNumber(num) {
    if (!Number.isFinite(num)) return num
    return parseFloat(num.toPrecision(12))
  }

  /** Format a number for display (returns string). */
  function formatResult(num) {
    if (!Number.isFinite(num)) return 'Error'
    const cleaned = formatNumber(num)
    const s = cleaned.toString()
    return s.length > 16 ? parseFloat(cleaned.toPrecision(10)).toString() : s
  }

  function compute(a, op, b) {
    switch (op) {
      case '+':  return a + b
      case '−':  return a - b
      case '×':  return a * b
      case '÷':  return b === 0 ? null : a / b
      default:   return null
    }
  }

  function clearError() {
    if (error.value) {
      error.value = false
      display.value = '0'
      expression.value = ''
      firstOperand.value = null
      pendingOp.value = null
      waiting.value = false
      lastOp.value = null
      lastOperand.value = null
    }
  }

  // ---- public API ----------------------------------------------------

  /** Append a digit (0-9) to the current display. */
  function inputNumber(digit) {
    clearError()
    if (waiting.value) {
      display.value = digit
      waiting.value = false
    } else {
      display.value = display.value === '0' ? digit : display.value + digit
    }
  }

  /** Append a decimal point if one doesn't already exist. */
  function inputDecimal() {
    clearError()
    if (waiting.value) {
      display.value = '0.'
      waiting.value = false
      return
    }
    if (!display.value.includes('.')) {
      display.value += '.'
    }
  }

  /**
   * Select an operator (+, −, ×, ÷).
   * - If a pending operation exists AND the user has typed a number,
   *   calculate the pending result first (chaining).
   * - If the user presses an operator right after another operator
   *   (waiting === true), simply override.
   */
  function selectOperator(op) {
    clearError()

    // Chain: compute pending before switching to new operator
    if (pendingOp.value && !waiting.value) {
      calculate()
    }

    // Now set up the new pending operation
    firstOperand.value = display.value
    pendingOp.value = op
    waiting.value = true
    expression.value = `${firstOperand.value} ${op}`

    // Invalidate repeated-equals state (new operator starts new chain)
    lastOp.value = null
    lastOperand.value = null
  }

  /**
   * Execute the pending operation ("=").
   *
   * On the first press the pending operation is executed normally and
   * `lastOp` / `lastOperand` are memorised.  Subsequent presses with no
   * intervening input reuse that memorised operation (“repeated equals”).
   */
  function calculate() {
    clearError()

    if (pendingOp.value === null) return

    const curr = parseFloat(display.value)
    let prev
    let op
    let operand

    if (waiting.value && lastOp.value !== null) {
      // Repeated equals — reuse the last operator & operand
      prev = curr
      op = lastOp.value
      operand = lastOperand.value
    } else {
      // Normal path
      prev = parseFloat(firstOperand.value)
      op = pendingOp.value
      operand = curr

      // Remember for potential repeated equals
      lastOp.value = op
      lastOperand.value = operand
    }

    const result = compute(prev, op, operand)

    // Division by zero
    if (result === null) {
      error.value = true
      display.value = 'Error'
      expression.value = ''
      firstOperand.value = null
      pendingOp.value = null
      waiting.value = true
      lastOp.value = null
      lastOperand.value = null
      return
    }

    const exprStr = `${prev} ${op} ${operand} =`
    const resultStr = formatResult(result)

    expression.value = exprStr
    display.value = resultStr
    firstOperand.value = null
    pendingOp.value = null
    waiting.value = true

    // Record to calculation history
    calcHistory.value.push({ expression: exprStr, result: resultStr })
  }

  /** Clear everything (C). */
  function clear() {
    display.value = '0'
    expression.value = ''
    firstOperand.value = null
    pendingOp.value = null
    waiting.value = false
    error.value = false
    lastOp.value = null
    lastOperand.value = null
  }

  /** Clear current entry only (CE). */
  function clearEntry() {
    if (error.value) { clear(); return }
    display.value = '0'
    waiting.value = false
  }

  /** Delete the last character (⌫). */
  function backspace() {
    if (error.value) { clear(); return }
    if (waiting.value) return

    if (display.value.length > 1) {
      display.value = display.value.slice(0, -1)
    } else {
      display.value = '0'
    }
    // Edge case: deleting the digit left a lone minus sign
    if (display.value === '-') {
      display.value = '0'
    }
  }

  /** Toggle positive / negative (±). */
  function toggleSign() {
    clearError()
    if (display.value === '0') return

    display.value = display.value.startsWith('-')
      ? display.value.slice(1)
      : '-' + display.value
  }

  /** Convert to percentage (÷100). */
  function percent() {
    clearError()
    const value = parseFloat(display.value)
    if (isNaN(value)) return
    display.value = formatResult(value / 100)
  }

  // ---- memory operations -------------------------------------------

  /** MS — push current display value onto the memory stack. */
  function memoryStore() {
    const value = formatNumber(parseFloat(display.value))
    if (isNaN(value)) return
    memoryHistory.value.push({ id: nextMemoryId++, value })
    syncMemoryValue()
  }

  /** MR — recall the most recent memory value to the display. */
  function memoryRecall() {
    clearError()
    if (memoryValue.value === null) return
    display.value = formatResult(memoryValue.value)
    waiting.value = true
  }

  /** M+ — add current display value to the most recent memory entry. */
  function memoryAdd() {
    const value = formatNumber(parseFloat(display.value))
    if (isNaN(value)) return
    const last = memoryHistory.value[memoryHistory.value.length - 1]
    if (last) {
      last.value = formatNumber(last.value + value)
    } else {
      memoryHistory.value.push({ id: nextMemoryId++, value })
    }
    syncMemoryValue()
  }

  /** M− — subtract current display value from the most recent memory entry. */
  function memorySubtract() {
    const value = formatNumber(parseFloat(display.value))
    if (isNaN(value)) return
    const last = memoryHistory.value[memoryHistory.value.length - 1]
    if (last) {
      last.value = formatNumber(last.value - value)
    } else {
      memoryHistory.value.push({ id: nextMemoryId++, value: -value })
    }
    syncMemoryValue()
  }

  /** MC — remove the most recent memory entry. */
  function memoryClear() {
    memoryHistory.value.pop()
    syncMemoryValue()
  }

  // ---- memory panel (per-item) operations ---------------------------

  /** Recall a specific memory item to the display. */
  function memoryItemRecall(id) {
    clearError()
    const item = memoryHistory.value.find(m => m.id === id)
    if (!item) return
    display.value = formatResult(item.value)
    waiting.value = true
    isMemoryPanelOpen.value = false
  }

  /** Add current display value to a specific memory item. */
  function memoryItemAdd(id) {
    const value = formatNumber(parseFloat(display.value))
    if (isNaN(value)) return
    const item = memoryHistory.value.find(m => m.id === id)
    if (item) {
      item.value = formatNumber(item.value + value)
      syncMemoryValue()
    }
  }

  /** Subtract current display value from a specific memory item. */
  function memoryItemSubtract(id) {
    const value = formatNumber(parseFloat(display.value))
    if (isNaN(value)) return
    const item = memoryHistory.value.find(m => m.id === id)
    if (item) {
      item.value = formatNumber(item.value - value)
      syncMemoryValue()
    }
  }

  /** Remove a specific memory item from the stack. */
  function memoryItemClear(id) {
    const idx = memoryHistory.value.findIndex(m => m.id === id)
    if (idx !== -1) {
      memoryHistory.value.splice(idx, 1)
      syncMemoryValue()
    }
    // Auto-close panel when last item is removed
    if (memoryHistory.value.length === 0) {
      isMemoryPanelOpen.value = false
    }
  }

  /** Toggle the memory panel open / closed. */
  function toggleMemoryPanel() {
    if (memoryHistory.value.length === 0) return
    isMemoryPanelOpen.value = !isMemoryPanelOpen.value
  }

  /** Close the memory panel. */
  function closeMemoryPanel() {
    isMemoryPanelOpen.value = false
  }

  // ---- navigation panel ---------------------------------------------

  function toggleNavPanel() {
    isNavPanelOpen.value = !isNavPanelOpen.value
  }

  function closeNavPanel() {
    isNavPanelOpen.value = false
  }

  // ---- history panel ------------------------------------------------

  function toggleHistoryPanel() {
    isHistoryPanelOpen.value = !isHistoryPanelOpen.value
  }

  function closeHistoryPanel() {
    isHistoryPanelOpen.value = false
  }

  function clearHistory() {
    calcHistory.value = []
  }

  // ---- expose --------------------------------------------------------
  return {
    // state
    display,
    expression,
    memoryValue,
    memoryHistory,
    isMemoryPanelOpen,
    // methods
    inputNumber,
    inputDecimal,
    selectOperator,
    calculate,
    clear,
    clearEntry,
    backspace,
    toggleSign,
    percent,
    // memory row
    memoryStore,
    memoryRecall,
    memoryAdd,
    memorySubtract,
    memoryClear,
    // memory panel
    memoryItemRecall,
    memoryItemAdd,
    memoryItemSubtract,
    memoryItemClear,
    toggleMemoryPanel,
    closeMemoryPanel,
    // navigation & history
    isNavPanelOpen,
    isHistoryPanelOpen,
    calcHistory,
    toggleNavPanel,
    closeNavPanel,
    toggleHistoryPanel,
    closeHistoryPanel,
    clearHistory,
  }
}
