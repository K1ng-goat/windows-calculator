<script setup>
import { ref } from 'vue'

defineProps({
  memoryHistory: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['close', 'recall', 'mc', 'mPlus', 'mMinus'])

const hoverId = ref(null)
</script>

<template>
  <div class="panel-backdrop" @click.self="$emit('close')">
    <div class="panel">
      <div class="panel__header">记忆</div>

      <div class="panel__list" v-if="memoryHistory.length">
        <div
          v-for="item in [...memoryHistory].reverse()"
          :key="item.id"
          class="panel__item"
          @mouseenter="hoverId = item.id"
          @mouseleave="hoverId = null"
        >
          <!-- value — click to recall -->
          <button
            class="panel__item-value"
            @click="$emit('recall', item.id)"
          >{{ item.value }}</button>

          <!-- actions — reveal on hover -->
          <div v-show="hoverId === item.id" class="panel__item-actions">
            <button
              class="panel__action"
              @click.stop="$emit('mc', item.id)"
            >MC</button>
            <button
              class="panel__action"
              @click.stop="$emit('mPlus', item.id)"
            >M+</button>
            <button
              class="panel__action"
              @click.stop="$emit('mMinus', item.id)"
            >M-</button>
          </div>
        </div>
      </div>

      <div v-else class="panel__empty">没有可用的记忆项目</div>
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
  width: 260px;
  max-height: 360px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel__header {
  padding: 12px 16px 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  border-bottom: 1px solid #e8e8e8;
}

.panel__list {
  overflow-y: auto;
  padding: 4px 0;
}

.panel__item {
  display: flex;
  align-items: center;
  padding: 6px 16px;
  min-height: 36px;
  font-size: 14px;
}

.panel__item:hover {
  background: #f5f5f5;
}

.panel__item-value {
  flex: 1;
  text-align: left;
  background: none;
  border: none;
  font-size: 14px;
  font-family: var(--font-family);
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 0;
}

.panel__item-actions {
  display: flex;
  gap: 6px;
  margin-left: 12px;
}

.panel__action {
  background: none;
  border: none;
  font-size: 12px;
  font-family: var(--font-family);
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
}

.panel__action:hover {
  background: #e8e8e8;
  color: var(--color-text-primary);
}

.panel__empty {
  padding: 24px 16px;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-secondary);
}
</style>
