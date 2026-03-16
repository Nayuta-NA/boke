<template>
  <div
    class="flex flex-col rounded-lg bg-white dark:bg-gray-800 p-4 shadow-md transition-all duration-300 hover:shadow-lg mx-4 w-[320px] sm:w-[350px] md:w-[400px]"
  >
    <div class="flex items-center gap-3 mb-2">
      <img
        src="https://avatar.vercel.sh/jack"
        :alt="`${name}'s avatar`"
        class="h-12 w-12 rounded-full object-cover"
        loading="lazy"
      />
      <div class="flex flex-col">
        <h3 class="font-semibold text-gray-900 dark:text-white text-base">{{ name }}</h3>
        <span class="text-gray-500 dark:text-gray-400 text-sm"> {{ formatDate(createdAt) }}</span>
      </div>
    </div>
    <p class="leading-relaxed text-gray-700 dark:text-gray-300 flex-grow">
      {{ body }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface ReviewCardProps {
  name: string
  username: string
  body: string

  createdAt: string
}

const props = defineProps<ReviewCardProps>()

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleDateString('zh-CN', options)
}
</script>
