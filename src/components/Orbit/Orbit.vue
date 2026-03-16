<template>
  <!-- <svg v-if="path" class="pointer-events-none absolute inset-0 size-full">
    
    <circle class="stroke-foreground/2 stroke-1" cx="50%" cy="50%" :r="radius" fill="none" />
  </svg> -->
  <svg v-if="path" class="pointer-events-none absolute inset-0 size-full">
    <circle
      style="stroke: #e0e0e0; stroke-width: 1px; stroke-opacity: 0.8"
      cx="50%"
      cy="50%"
      :r="radius"
      fill="none"
    />
  </svg>
  <svg v-if="path1" class="pointer-events-none absolute inset-0 size-full">
    <circle
      style="stroke: #e0e0e0; stroke-width: 1px; stroke-opacity: 0.8; stroke-dasharray: 5, 5"
      cx="50%"
      cy="50%"
      :r="radius"
      fill="none"
    />
  </svg>
  <div :class="cn('absolute flex size-full transform-gpu animate-orbit', props.class)">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { cn } from '@/lib/utils'
import { ORBIT_DIRECTION, type Props } from './Orbit'
import { computed } from 'vue'

const props = withDefaults(defineProps<Props>(), {
  direction: () => ORBIT_DIRECTION.Clockwise,
  duration: 20,
  delay: 10,
  radius: 50,
  path: false,
})

const negativeDelay = computed(() => -props.delay)
</script>

<style scoped>
@keyframes orbit {
  0% {
    transform: rotate(0deg) translateY(calc(v-bind(radius) * 1px)) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateY(calc(v-bind(radius) * 1px)) rotate(-360deg);
  }
}

.animate-orbit {
  animation: orbit calc(v-bind(duration) * 1s) linear infinite;
  animation-delay: calc(v-bind(negativeDelay) * 1s);
  animation-direction: v-bind(direction);
}
</style>
