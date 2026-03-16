<template>
  <div class="flex items-center justify-center px-4">
    <div class="mx-auto text-4xl font-normal text-neutral-600 dark:text-neutral-400">
      Vuejs: The
      <FlipWords
        :words="['Progressive', 'Approachable', 'Performant', 'Versatile']"
        :duration="3000"
        class="text-4xl !text-primary"
      />
    </div>
  </div>
</template>
<script>
import FlipWords from './fileWords.vue'
</script>
