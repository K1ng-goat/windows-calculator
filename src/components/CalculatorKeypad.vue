<script setup>
import { computed } from 'vue'
import CalculatorButton from './CalculatorButton.vue'

const props = defineProps({
  memoryValue: {
    type: Number,
    default: null,
  },
})

defineEmits(['buttonClick', 'togglePanel'])

const hasMemory = computed(() => props.memoryValue !== null)

const memoryBtns = [
  { label: 'MC', action: 'memoryClear',     disabled: () => !hasMemory.value },
  { label: 'MR', action: 'memoryRecall',    disabled: () => !hasMemory.value },
  { label: 'M+', action: 'memoryAdd',       disabled: () => false },
  { label: 'M-', action: 'memorySubtract',  disabled: () => false },
  { label: 'MS', action: 'memoryStore',     disabled: () => false },
  { label: 'M∨', action: 'togglePanel',     disabled: () => !hasMemory.value },
]

const buttons = [
  // Row 1 — function row (W11 layout)
  { label: '%',   type: 'function' },
  { label: 'CE',  type: 'function' },
  { label: 'C',   type: 'function' },
  { label: '⌫',  type: 'function' },
  // Row 2 — advanced ops
  { label: '1/x', type: 'function' },
  { label: 'x²',  type: 'function' },
  { label: '√x',  type: 'function' },
  { label: '÷',  type: 'operator' },
  // Row 3 — digits
  { label: '7', type: 'number' },
  { label: '8', type: 'number' },
  { label: '9', type: 'number' },
  { label: '×', type: 'operator' },
  // Row 4
  { label: '4',  type: 'number' },
  { label: '5',  type: 'number' },
  { label: '6',  type: 'number' },
  { label: '−', type: 'operator' },
  // Row 5
  { label: '1', type: 'number' },
  { label: '2', type: 'number' },
  { label: '3', type: 'number' },
  { label: '+', type: 'operator' },
  // Row 6 — bottom row
  { label: '+/−', type: 'function' },
  { label: '0',   type: 'number' },
  { label: '.',   type: 'number' },
  { label: '=',   type: 'operator', variant: 'equals' },
]
</script>

<template>
  <div class="keypad-area">
    <!-- Memory row -->
    <div class="memory-row">
      <CalculatorButton
        v-for="mb in memoryBtns"
        :key="mb.label"
        :label="mb.label"
        type="memory"
        :disabled="mb.disabled()"
        @click="mb.action === 'togglePanel'
          ? $emit('togglePanel')
          : $emit('buttonClick', { label: mb.label, type: 'memory', action: mb.action })"
      />
    </div>

    <!-- Main button grid -->
    <div class="keypad">
      <CalculatorButton
        v-for="btn in buttons"
        :key="btn.label + btn.type"
        :label="btn.label"
        :type="btn.type"
        :variant="btn.variant || ''"
        @click="$emit('buttonClick', btn)"
      />
    </div>
  </div>
</template>

<style scoped>
.keypad-area {
  background: var(--color-border);
}

.memory-row {
  display: flex;
  align-items: center;
  gap: 2px;
  height: var(--memory-row-height);
  padding: 0 6px;
  background: var(--color-calculator-bg);
}

.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: var(--gap-grid);
}
</style>
