<template>
  <div class="resources-view">
    <div class="page-header">
      <InteractiveHoverButton text="返回" class="bg-white text-gray-700 hover:bg-gray-100" @click="goBack" />
      <h1 class="page-title">学习资源</h1>
    </div>

    <div class="resources-container">
      <div class="resources-grid">
        <a 
          v-for="resource in resources" 
          :key="resource.id"
          :href="resource.url"
          target="_blank"
          class="resource-card"
        >
          <div class="resource-icon">
            <i :class="resource.icon"></i>
          </div>
          <div class="resource-content">
            <h2 class="resource-title">{{ resource.title }}</h2>
            <p class="resource-description">{{ resource.description }}</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import InteractiveHoverButton from '@/components/button.vue'
import { useRouter } from 'vue-router'

interface Resource {
  id: number
  title: string
  description: string
  icon: string
  url: string
}

const router = useRouter()
const isLoading = ref(true)

const resources = ref<Resource[]>([
  {
    id: 1,
    title: 'MDN Web Docs',
    description: 'Web开发权威文档，包含HTML、CSS、JavaScript等技术的详细说明',
    icon: 'fab fa-mdn',
    url: 'https://developer.mozilla.org/zh-CN/'
  },
  {
    id: 2,
    title: 'Vue.js官方文档',
    description: 'Vue 3完整指南和API参考，学习现代前端框架的最佳资源',
    icon: 'fab fa-vuejs',
    url: 'https://vuejs.org/'
  },
  {
    id: 3,
    title: 'React官方文档',
    description: 'React库的官方学习资源，涵盖Hooks、状态管理等核心概念',
    icon: 'fab fa-react',
    url: 'https://reactjs.org/'
  },
  {
    id: 4,
    title: 'TypeScript文档',
    description: 'TypeScript语言官方文档，学习类型安全的JavaScript开发',
    icon: 'fas fa-code',
    url: 'https://www.typescriptlang.org/'
  },
  {
    id: 5,
    title: 'Tailwind CSS',
    description: '实用优先的CSS框架文档，快速构建现代化用户界面',
    icon: 'fas fa-wind',
    url: 'https://tailwindcss.com/'
  },
  {
    id: 6,
    title: 'Webpack',
    description: '现代JavaScript应用的静态模块打包器官方文档',
    icon: 'fas fa-cube',
    url: 'https://webpack.js.org/'
  }
])

const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  // 尽快触发loaded事件，减少等待时间
  const event = new Event('loaded')
  window.dispatchEvent(event)
  
  // 模拟数据加载完成
  setTimeout(() => {
    isLoading.value = false
  }, 100)
})
</script>

<style scoped>
.resources-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
  padding: 16px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.back-button {
  background: #f0f2f5;
  border: none;
  border-radius: 8px;
  color: #666;
  transition: all 0.3s;
}

.back-button:hover {
  background: #e1e5e9;
  color: #333;
}

.resources-container {
  padding: 20px 0;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.resource-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 30px;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.resource-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.resource-icon {
  font-size: 32px;
  color: #40e0d0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(64, 224, 208, 0.1);
  border-radius: 16px;
}

.resource-content {
  flex: 1;
}

.resource-title {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.resource-description {
  font-size: 16px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .resources-view {
    padding: 16px;
  }
  
  .page-header {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .resources-grid {
    grid-template-columns: 1fr;
  }
  
  .resource-card {
    padding: 20px;
  }
  
  .resource-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
  
  .resource-title {
    font-size: 20px;
  }
  
  .resource-description {
    font-size: 15px;
  }
}
</style>