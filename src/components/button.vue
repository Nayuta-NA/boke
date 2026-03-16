<template>
  <button
    ref="buttonRef"
    :class="
      cn(
        'group relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold',
        'bg-white text-gray-800 hover:bg-gray-50',
        'border-gray-200 hover:border-gray-300',
        'shadow-sm hover:shadow-md',
        'transition-all duration-300',
        props.class,
      )
    "
    @click="$emit('click')"
    :disabled="disabled"
  >
    <div class="flex items-center gap-2">
      <div
        class="size-2 scale-100 rounded-lg bg-primary transition-all duration-300 group-hover:scale-[100.8]"
      ></div>
      <span
        class="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0"
      >
        {{ text }}
      </span>
    </div>

    <div
      class="absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 text-primary opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100"
    >
      <span class="whitespace-nowrap">{{ text }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-arrow-right"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80">
      <div class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
    </div>
  </button>
</template>

<script lang="ts" setup>
import { cn } from '@/lib/utils'
import { ref } from 'vue'

interface Props {
  text?: string
  class?: string
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Button',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const buttonRef = ref<HTMLButtonElement>()
</script>

<style></style>