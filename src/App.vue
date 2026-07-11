<script setup>
import CalculatorDisplay from './components/CalculatorDisplay.vue'
import CalculatorKeypad from './components/CalculatorKeypad.vue'

// Placeholder — logic will be added in Phase 2
const expression = ''
const currentValue = '0'
</script>

<template>
  <div class="app">
    <div class="calculator">
      <CalculatorDisplay
        :expression="expression"
        :currentValue="currentValue"
      />
      <CalculatorKeypad />
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: #e8e8e8;
}

.calculator {
  width: 320px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
</style>
