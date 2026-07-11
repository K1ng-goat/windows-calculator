<script setup>
import CalculatorDisplay from './components/CalculatorDisplay.vue'
import CalculatorKeypad from './components/CalculatorKeypad.vue'
import MemoryPanel from './components/MemoryPanel.vue'
import { useCalculator } from './composables/useCalculator.js'

const {
  display,
  expression,
  memoryValue,
  memoryHistory,
  isMemoryPanelOpen,
  inputNumber,
  inputDecimal,
  selectOperator,
  calculate,
  clear,
  clearEntry,
  backspace,
  toggleSign,
  percent,
  memoryStore,
  memoryRecall,
  memoryAdd,
  memorySubtract,
  memoryClear,
  memoryItemRecall,
  memoryItemAdd,
  memoryItemSubtract,
  memoryItemClear,
  toggleMemoryPanel,
  closeMemoryPanel,
} = useCalculator()

/**
 * Route a button click from the keypad to the correct handler.
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
      case '±':
      case '+/−': toggleSign(); break
      case '%':  percent();      break
      default: break
    }
  }

  if (type === 'memory') {
    switch (label) {
      case 'MC': memoryClear();     break
      case 'MR': memoryRecall();    break
      case 'M+': memoryAdd();       break
      case 'M-': memorySubtract();  break
      case 'MS': memoryStore();     break
      default: break
    }
  }
}
</script>

<template>
  <div class="app">
    <div class="calculator">
      <!-- Title bar -->
      <div class="titlebar">
        <button class="titlebar__btn" aria-label="菜单">☰</button>
        <span class="titlebar__title">标准</span>
        <button class="titlebar__btn" aria-label="历史记录">🕗</button>
      </div>

      <CalculatorDisplay
        :expression="expression"
        :currentValue="display"
      />
      <CalculatorKeypad
        :memoryValue="memoryValue"
        @button-click="handleButtonClick"
        @toggle-panel="toggleMemoryPanel"
      />
    </div>

    <!-- Memory panel — rendered outside calculator for proper stacking -->
    <MemoryPanel
      v-if="isMemoryPanelOpen"
      :memoryHistory="memoryHistory"
      @close="closeMemoryPanel"
      @recall="memoryItemRecall"
      @mc="memoryItemClear"
      @m-plus="memoryItemAdd"
      @m-minus="memoryItemSubtract"
    />
  </div>
</template>
