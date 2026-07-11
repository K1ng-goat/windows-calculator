<script setup>
import CalculatorButton from './CalculatorButton.vue'

defineEmits(['buttonClick'])

const buttons = [
  // Row 1 — function row
  { label: '%',  type: 'function' },
  { label: '√',  type: 'function' },  // √
  { label: 'x²', type: 'function' },  // x²
  { label: '1/x', type: 'function' },
  // Row 2 — clear + operator
  { label: 'CE', type: 'function' },
  { label: 'C',  type: 'function' },
  { label: '⌫', type: 'function' },  // ⌫
  { label: '÷', type: 'operator' },  // ÷
  // Row 3 — digits
  { label: '7', type: 'number' },
  { label: '8', type: 'number' },
  { label: '9', type: 'number' },
  { label: '×', type: 'operator' },  // ×
  // Row 4
  { label: '4',  type: 'number' },
  { label: '5',  type: 'number' },
  { label: '6',  type: 'number' },
  { label: '−', type: 'operator' },  // −
  // Row 5
  { label: '1', type: 'number' },
  { label: '2', type: 'number' },
  { label: '3', type: 'number' },
  { label: '+', type: 'operator' },
  // Row 6 — bottom row
  { label: '±', type: 'function' },  // ±
  { label: '0',  type: 'number' },
  { label: '.',  type: 'number' },
  { label: '=',  type: 'operator' },
]
</script>

<template>
  <div class="keypad">
    <CalculatorButton
      v-for="btn in buttons"
      :key="btn.label + btn.type"
      :label="btn.label"
      :type="btn.type"
      @click="$emit('buttonClick', btn)"
    />
  </div>
</template>

<style scoped>
.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 1px;
  background: #e0e0e0;
  border: 1px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 4px 4px;
}
</style>
