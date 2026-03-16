<template>
  <i :class="name" :style="style"></i>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  size?: string | number
}>()

const style = computed(() => {
  if (props.size) {
    const sizeValue = typeof props.size === 'number' ? `${props.size}px` : props.size
    return { fontSize: sizeValue, width: sizeValue, height: sizeValue }
  }
  return {}
})
</script>