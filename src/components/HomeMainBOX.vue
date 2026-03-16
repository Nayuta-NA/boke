<template>
  <div class="custom-container" :style="{ height: Height, background: bgc }">
    <div class="title flex items-center mt-40px" v-if="title">
      <div class="jianghu text-2xl font-bold mr-2">
        {{ title }}
      </div>
      <div class="text-gray-600">{{ introduce || '这里是介绍区域' }}</div>
    </div>
    <!-- 内容区域：用flex:1填充剩余高度，确保占满垂直空间 -->
    <div class="main-content" :style="{ background: bgc }">
      <slot name="main">
        <div class="default-content">哈哈哈哈哈</div>
      </slot>
    </div>
    <!-- 底部按钮区域 -->
    <div class="bottom">
      <InteractiveHoverButton 
        text="更多" 
        class="bg-[#40e0d0] text-white hover:bg-[#34c7ba]" 
        @click="goToMore"
        :loading="loading"
        :disabled="loading"
      />
      
      <!-- 页面跳转加载动画 -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p class="loading-text">页面跳转中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  title?: string
  height?: string
  introduce?: string
  bg?: string
  morePath?: string // 添加更多按钮跳转路径
}>()

const router = useRouter()
const loading = ref(false)
let timeoutId: number | null = null

// 更合理的高度计算：若未传height，自动计算为"视口高度 - 上下预留空间"
const Height = computed(() => props.height && props.height !== 'auto' ? props.height : 'auto')
const bgc = computed(() => props.bg || '#F9F9F9')

// 跳转到更多页面
const goToMore = () => {
  if (props.morePath) {
    loading.value = true
    
    // 设置超时机制，避免加载时间过长
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = window.setTimeout(() => {
      loading.value = false
      timeoutId = null
    }, 1500) // 1.5秒后自动关闭加载状态
    
    // 使用nextTick确保在路由跳转前显示加载状态
    router.push(props.morePath).finally(() => {
      loading.value = false
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    })
  }
}

import InteractiveHoverButton from './button.vue'
import TextGenerateEffect from './TextGenerateEffect.vue'
</script>

<style scoped>
.custom-container {
  margin-top: 2rem;
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  position: relative;
}

.title {
  font-size: 16px;
  color: #1f2937;
  line-height: 1.5;
  /* 文艺清晰的字体 */
  font-family: 'Georgia', 'Times New Roman', 'Songti SC', serif;
}

.jianghu {
  font-size: 34px;
  margin-right: 0.5rem;
  /* 文艺清晰的主标题字体样式 */
  font-family: 'Georgia', 'Songti SC', 'STSong', serif;
  font-weight: 600;
  letter-spacing: 1px;
  color: #2c3e50;
}

.main-content {
  flex: 1;
  min-height: 300px;
  overflow-y: auto;
  padding: 8px;
  background-color: #f9fafb;
  border-radius: 4px;
}

.default-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.bottom {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #6b7280;
  margin-bottom: 20px;
  position: relative;
}

/* 按钮样式（若InteractiveHoverButton内部用.btn类） */
.btn {
  width: 100px;
  height: 43px;
  color: #40e0d0;
  background-color: white;
  border-radius: 8%;
  border: 1px solid #40e0d0;
  cursor: pointer;
  transition: all 0.3s;
}
.btn:hover {
  background-color: #40e0d0;
  color: white;
}

/* 加载状态样式 */
.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 页面跳转加载动画样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  border-radius: 20px;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #40e0d0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  color: #40e0d0;
  font-weight: 500;
}
</style>