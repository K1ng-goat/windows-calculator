<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'number',
    validator: (value) => ['number', 'operator', 'function'].includes(value),
  },
})

defineEmits(['click'])
</script>

<template>
  <button
    class="btn"
    :class="`btn--${type}`"
    :aria-label="label"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 52px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  cursor: pointer;
  outline: none;
}

.btn--number {
  background: #fafafa;
  color: #333;
  font-weight: 400;
}

.btn--operator {
  background: #f0f0f0;
  color: #333;
  font-size: 20px;
  font-weight: 400;
}

.btn--function {
  background: #e8e8e8;
  color: #333;
  font-size: 14px;
  font-weight: 400;
}
</style>
