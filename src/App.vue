<script setup>
import CalculatorDisplay from './components/CalculatorDisplay.vue'
import CalculatorKeypad from './components/CalculatorKeypad.vue'
import MemoryPanel from './components/MemoryPanel.vue'
import NavigationPanel from './components/NavigationPanel.vue'
import HistoryPanel from './components/HistoryPanel.vue'
import { useCalculator } from './composables/useCalculator.js'

const {
  display,
  expression,
  memoryValue,
  memoryHistory,
  isMemoryPanelOpen,
  isNavPanelOpen,
  isHistoryPanelOpen,
  calcHistory,
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
  toggleNavPanel,
  closeNavPanel,
  toggleHistoryPanel,
  closeHistoryPanel,
  clearHistory,
} = useCalculator()

function handleButtonClick({ label, type }) {
  if (type === 'number') {
    if (label === '.') { inputDecimal() } else { inputNumber(label) }
    return
  }
  if (type === 'operator') {
    if (label === '=') { calculate() } else { selectOperator(label) }
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
      <div class="titlebar">
        <button class="titlebar__btn" aria-label="菜单" @click="toggleNavPanel">☰</button>
        <span class="titlebar__title">标准</span>
        <button class="titlebar__btn" aria-label="历史记录" @click="toggleHistoryPanel">🕗</button>
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

    <NavigationPanel
      v-if="isNavPanelOpen"
      @close="closeNavPanel"
    />

    <HistoryPanel
      v-if="isHistoryPanelOpen"
      :calcHistory="calcHistory"
      @close="closeHistoryPanel"
      @clear="clearHistory"
    />

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
