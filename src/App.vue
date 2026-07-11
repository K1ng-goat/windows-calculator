<script setup>
import CalculatorDisplay from './components/CalculatorDisplay.vue'
import CalculatorKeypad from './components/CalculatorKeypad.vue'
import { useCalculator } from './composables/useCalculator.js'

const {
  display,
  expression,
  inputNumber,
  inputDecimal,
  selectOperator,
  calculate,
  clear,
  clearEntry,
  backspace,
  toggleSign,
  percent,
} = useCalculator()

/**
 * Route a button click from the keypad to the correct handler.
 *
 * Dispatch rules:
 *  - number type + digit label  → inputNumber(digit)
 *  - number type + '.' label    → inputDecimal()
 *  - operator type + '='        → calculate()
 *  - operator type + other      → selectOperator(op)
 *  - function type              → switch on label
 */
function handleButtonClick({ label, type }) {
  if (type === 'number') {
    if (label === '.') {
      inputDecimal()
    } else {
      inputNumber(label)
    }
    return
  }

  if (type === 'operator') {
    if (label === '=') {
      calculate()
    } else {
      selectOperator(label)
    }
    return
  }

  if (type === 'function') {
    switch (label) {
      case 'C':  clear();        break
      case 'CE': clearEntry();   break
      case '⌫': backspace(); break
      case '±': toggleSign(); break
      case '%':  percent();      break
      // √, x², 1/x — reserved for future implementation
      default: break
    }
  }
}
</script>

<template>
  <div class="app">
    <div class="calculator">
      <CalculatorDisplay
        :expression="expression"
        :currentValue="display"
      />
      <CalculatorKeypad
        @button-click="handleButtonClick"
      />
    </div>
  </div>
</template>
