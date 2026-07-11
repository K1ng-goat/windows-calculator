<script setup>
defineEmits(['close'])
</script>

<template>
  <div class="panel-backdrop" @click.self="$emit('close')">
    <div class="panel">
      <div class="panel__header">计算器</div>

      <div class="panel__list">
        <!-- Active mode -->
        <button class="panel__item panel__item--active">
          <span class="panel__item-icon">📱</span>
          <span>标准</span>
        </button>

        <!-- Disabled modes -->
        <button class="panel__item panel__item--disabled" disabled>
          <span class="panel__item-icon">🔬</span>
          <span>科学</span>
          <span class="panel__item-tag">未开发</span>
        </button>
        <button class="panel__item panel__item--disabled" disabled>
          <span class="panel__item-icon">📈</span>
          <span>绘图</span>
          <span class="panel__item-tag">未开发</span>
        </button>
        <button class="panel__item panel__item--disabled" disabled>
          <span class="panel__item-icon">📅</span>
          <span>日期计算</span>
          <span class="panel__item-tag">未开发</span>
        </button>
      </div>
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
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.panel__header {
  padding: 14px 16px 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  border-bottom: 1px solid #e8e8e8;
}

.panel__list {
  padding: 4px 0;
}

.panel__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-family: var(--font-family);
  color: var(--color-text-primary);
  cursor: pointer;
  text-align: left;
}

.panel__item:hover:not(:disabled) {
  background: #f5f5f5;
}

.panel__item--active {
  background: #e8f4fd;
  font-weight: 500;
}

.panel__item--active:hover {
  background: #dcecf8;
}

.panel__item--disabled {
  color: #b0b0b0;
  cursor: default;
}

.panel__item-icon {
  font-size: 16px;
  width: 24px;
  text-align: center;
}

.panel__item-tag {
  margin-left: auto;
  font-size: 11px;
  color: #c0c0c0;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
}
</style>
