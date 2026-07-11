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
  padding: 12px 16px;
  min-height: 120px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px 4px 0 0;
}

.display__expression {
  font-size: 14px;
  color: #888;
  min-height: 20px;
  word-break: break-all;
  text-align: right;
}

.display__value {
  font-size: 36px;
  font-weight: 300;
  color: #222;
  word-break: break-all;
  text-align: right;
  line-height: 1.2;
}
</style>
