<template>
  <div id="app">
    <Layout v-if="shouldShowLayout" />
    <router-view v-slot="{ Component, route }">
      <transition :name="(route.meta.transition as string) || 'fade'" mode="out-in">
        <div :class="shouldShowLayout ? 'app-container' : ''">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useGlobalSettingsStore } from '@/stores/globalSettings'
import Layout from '@/components/Layout.vue'

const route = useRoute()
const authStore = useAuthStore()
const globalSettingsStore = useGlobalSettingsStore()

// 定义不需要布局的路由名称
const noLayoutRoutes = ['login', 'register', 'wall', 'global-settings']

// 计算是否应该显示布局组件
const shouldShowLayout = computed(() => {
  return authStore.isAuthenticated && !noLayoutRoutes.includes(route.name as string)
})

// 动态更新主题色 CSS 变量
const updateThemeColor = (color: string) => {
  document.documentElement.style.setProperty('--primary-color', color)
  // 同时更新 hover 等状态的颜色（稍微深一点的色调）
  const hoverColor = adjustColorBrightness(color, -10)
  document.documentElement.style.setProperty('--primary-color-hover', hoverColor)
  
  // 更新所有使用主题色的 CSS 变量
  document.documentElement.style.setProperty('--ant-primary-color', color)
  document.documentElement.style.setProperty('--ant-primary-color-hover', hoverColor)
  
  // 更新阴影色
  const rgbaColor = hexToRgba(color, 0.2)
  document.documentElement.style.setProperty('--ant-primary-shadow', rgbaColor)
}

// 动态更新主题背景 CSS 变量
const updateThemeBackground = (background: { type: string; color: string; imageUrl: string }) => {
  if (background.type === 'color') {
    document.documentElement.style.setProperty('--app-background', background.color)
    document.documentElement.style.setProperty('--app-background-image', 'none')
  } else if (background.type === 'image' && background.imageUrl) {
    document.documentElement.style.setProperty('--app-background-image', `url(${background.imageUrl})`)
    document.documentElement.style.setProperty('--app-background', '#f5f5f5')
  }
}

// 调整颜色亮度的辅助函数
const adjustColorBrightness = (hex: string, amount: number): string => {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount))
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}

// 将十六进制颜色转换为 RGBA
const hexToRgba = (hex: string, alpha: number): string => {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) & 0x00ff
  const g = (num >> 8) & 0x00ff
  const b = num & 0x0000ff
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 监听主题色变化
watch(
  () => globalSettingsStore.themeColor.primary,
  (newColor) => {
    updateThemeColor(newColor)
  },
  { immediate: true }
)

// 监听主题背景变化
watch(
  () => globalSettingsStore.themeBackground,
  (newBackground) => {
    updateThemeBackground(newBackground)
  },
  { immediate: true, deep: true }
)

// 在组件挂载时初始化认证状态
authStore.initializeAuth()
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background-color: var(--app-background, #f5f5f0);
  background-image: var(--app-background-image, none);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}
</style>

<style>
.app-container {
  position: relative;
  min-height: 100vh;
  padding-top: 80px; /* 为导航栏留出空间 */
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
</style>
