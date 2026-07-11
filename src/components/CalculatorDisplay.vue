<script setup>
defineProps({
  expression: {
    type: String,
    default: '',
  },
  currentValue: {
    type: String,
    default: '0',
  },
})
</script>

<template>
  <div class="display">
    <div class="display__expression">{{ expression }}</div>
    <div class="display__value">{{ currentValue }}</div>
  </div>
</template>

<style scoped>
.display {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  padding: var(--padding-display);
  min-height: var(--display-min-height);
  background: var(--color-display-bg);
}

.display__expression {
  font-size: var(--font-size-display-expr);
  color: var(--color-text-secondary);
  min-height: 20px;
  word-break: break-all;
  text-align: right;
  line-height: 1.4;
}

.display__value {
  font-size: var(--font-size-display-value);
  font-weight: 300;
  color: var(--color-text-primary);
  word-break: break-all;
  text-align: right;
  line-height: 1.2;
}
</style>
