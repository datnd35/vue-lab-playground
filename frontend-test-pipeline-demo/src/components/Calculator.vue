<template>
  <div class="calculator">
    <input v-model.number="a" type="number" aria-label="a" />
    <input v-model.number="b" type="number" aria-label="b" />
    <div class="ops">
      <button @click="setOp('+')">+</button>
      <button @click="setOp('-')">-</button>
      <button @click="setOp('*')">*</button>
      <button @click="setOp('/')">/</button>
    </div>
    <div class="result">Result: {{ result }}</div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { calculate } from '../utils/calculator'

export default {
  name: 'Calculator',
  setup() {
    const a = ref<number | null>(0)
    const b = ref<number | null>(0)
    const op = ref<string>('+')

    const setOp = (v: string) => (op.value = v)

    const result = computed(() => {
      return calculate(a.value ?? 0, b.value ?? 0, op.value)
    })

    return { a, b, op, setOp, result }
  },
}
</script>

<style scoped>
.calculator {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.ops button {
  margin-right: 0.25rem;
}
</style>
