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
  /** Optional style override — used for the equals button. */
  variant: {
    type: String,
    default: '',
  },
})

defineEmits(['click'])
</script>

<template>
  <button
    class="btn"
    :class="`btn--${variant || type}`"
    :aria-label="label"
    @click="$emit('click')"
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
  height: var(--btn-height);
  border: 1px solid var(--color-border);
  font-size: var(--font-size-btn-number);
  font-family: var(--font-family);
  color: var(--color-text-btn);
  cursor: pointer;
  outline: none;
  user-select: none;
  transition: background-color var(--transition-btn);
}

/* ---- number ------------------------------------------------------ */
.btn--number {
  background: var(--color-btn-number);
  font-weight: 400;
}
.btn--number:hover   { background: var(--color-btn-number-hover); }
.btn--number:active  { background: var(--color-btn-number-active); }

/* ---- operator ---------------------------------------------------- */
.btn--operator {
  background: var(--color-btn-operator);
  font-size: var(--font-size-btn-operator);
  font-weight: 400;
}
.btn--operator:hover  { background: var(--color-btn-operator-hover); }
.btn--operator:active { background: var(--color-btn-operator-active); }

/* ---- function ---------------------------------------------------- */
.btn--function {
  background: var(--color-btn-function);
  font-size: var(--font-size-btn-function);
  font-weight: 400;
}
.btn--function:hover  { background: var(--color-btn-function-hover); }
.btn--function:active { background: var(--color-btn-function-active); }

/* ---- equals (Windows accent blue) -------------------------------- */
.btn--equals {
  background: var(--color-btn-equals);
  font-size: var(--font-size-btn-operator);
  font-weight: 400;
  color: var(--color-btn-equals-text);
  border-color: var(--color-btn-equals);
}
.btn--equals:hover  { background: var(--color-btn-equals-hover); }
.btn--equals:active { background: var(--color-btn-equals-active); }
</style>
