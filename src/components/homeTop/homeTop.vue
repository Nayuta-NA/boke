<template>
  <div class="home-view max-h-110vh w-100%">
    <Bg class="background" :color="primaryColor" :count="50" />
    <div class="content">
      <div style="transform: translateY(-50px) scaleY(1.02)">
        <earthOrbit path />
        <div style="transform: scale(0.8) translateY(-870px)">
          <Card3d></Card3d>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Bg from '@/components/ui/bg.vue'
import earthOrbit from '@/components/Orbit/Index.vue'
import Card3d from '@/components/3dCard/Index.vue'

// 获取主题色
const primaryColor = ref('#40e0d0')

onMounted(() => {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color')
    .trim()
  if (color) {
    primaryColor.value = color
  }
})
</script>