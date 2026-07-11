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

  // ---- helpers -------------------------------------------------------
  function formatResult(num) {
    if (!Number.isFinite(num)) return 'Error'
    // Strip floating-point noise (e.g. 0.1 + 0.2 → 0.30000000000000004)
    const s = parseFloat(num.toPrecision(12)).toString()
    return s.length > 16 ? parseFloat(num.toPrecision(10)).toString() : s
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

    expression.value = `${prev} ${op} ${operand} =`
    display.value = formatResult(result)
    firstOperand.value = null
    pendingOp.value = null
    waiting.value = true
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

  // ---- expose --------------------------------------------------------
  return {
    // state
    display,
    expression,
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
  }
}
