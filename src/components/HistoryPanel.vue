<script setup>
defineProps({
  calcHistory: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['close', 'clear'])
</script>

<template>
  <div class="panel-backdrop" @click.self="$emit('close')">
    <div class="panel">
      <div class="panel__header">
        <span>历史记录</span>
        <button
          v-if="calcHistory.length"
          class="panel__clear-btn"
          @click="$emit('clear')"
        >清除</button>
      </div>

      <div class="panel__list" v-if="calcHistory.length">
        <div
          v-for="(item, idx) in [...calcHistory].reverse()"
          :key="idx"
          class="panel__item"
        >
          <span class="panel__item-expr">{{ item.expression }}</span>
          <span class="panel__item-result">{{ item.result }}</span>
        </div>
      </div>

      <div v-else class="panel__empty">没有历史记录</div>
    </div>
  </div>
</template>

<style scoped>
.panel-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
}

.panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  max-height: 400px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  border-bottom: 1px solid #e8e8e8;
}

.panel__clear-btn {
  background: none;
  border: none;
  font-size: 13px;
  font-family: var(--font-family);
  color: var(--color-btn-equals);
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 4px;
}

.panel__clear-btn:hover {
  background: #e8f4fd;
}

.panel__list {
  overflow-y: auto;
  padding: 4px 0;
}

.panel__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  min-height: 36px;
  font-size: 14px;
}

.panel__item:hover {
  background: #f5f5f5;
}

.panel__item-expr {
  color: var(--color-text-secondary);
}

.panel__item-result {
  color: var(--color-text-primary);
  font-weight: 500;
}

.panel__empty {
  padding: 24px 16px;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-secondary);
}
</style>
