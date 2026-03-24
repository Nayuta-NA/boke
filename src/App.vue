<template>
  <div id="app">
    <Layout v-if="shouldShowLayout" />
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <div :class="shouldShowLayout ? 'app-container' : ''">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Layout from '@/components/Layout.vue'

const route = useRoute()
const authStore = useAuthStore()

// 定义不需要布局的路由名称
const noLayoutRoutes = ['login', 'register', 'wall', 'global-settings']

// 计算是否应该显示布局组件
const shouldShowLayout = computed(() => {
  return authStore.isAuthenticated && !noLayoutRoutes.includes(route.name as string)
})

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
  background-color: #f5f5f0;
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
