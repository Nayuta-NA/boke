<template>
  <div class="projects-view">
    <div class="page-header">
      <InteractiveHoverButton text="返回" class="bg-[#f0f2f5] text-[#666]" @click="goBack" />
      <h1 class="page-title">前端项目展示</h1>
    </div>

    <div class="projects-container">
      <div 
        class="project-card" 
        v-for="project in projects" 
        :key="project.id"
        @click="viewProjectDetail(project)"
      >
        <div class="project-image">
          <img :src="project.image" :alt="project.title">
          <div class="project-overlay">
            <span class="framework-tag">{{ project.framework }}</span>
          </div>
        </div>
        <div class="project-content">
          <h2 class="project-title">{{ project.title }}</h2>
          <p class="project-description">{{ project.description }}</p>
          <div class="project-tags">
            <a-tag 
              v-for="(tag, i) in project.tags" 
              :key="i" 
              class="project-tag"
            >
              {{ tag }}
            </a-tag>
          </div>
          <div class="project-actions">
            <a-button 
              v-if="project.demo" 
              type="primary" 
              size="small" 
              class="action-button demo-button"
              @click.stop="openDemo(project.demo)"
            >
              <i class="fas fa-external-link-alt"></i>
              Demo
            </a-button>
            <a-button 
              v-if="project.github" 
              size="small" 
              class="action-button github-button"
              @click.stop="openGithub(project.github)"
            >
              <i class="fab fa-github"></i>
              源码
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目详情模态框 -->
    <a-modal
      v-model:open="projectModalVisible"
      :title="selectedProject?.title"
      width="100%"
      :style="{ maxWidth: '800px' }"
      @cancel="projectModalVisible = false"
      :footer="null"
    >
      <div class="project-detail" v-if="selectedProject">
        <div class="detail-image">
          <img :src="selectedProject.image" :alt="selectedProject.title">
        </div>
        <div class="detail-content">
          <p class="detail-description">{{ selectedProject.description }}</p>
          <div class="detail-tags">
            <a-tag 
              v-for="(tag, i) in selectedProject.tags" 
              :key="i" 
              class="detail-tag"
            >
              {{ tag }}
            </a-tag>
          </div>
          <div class="detail-actions">
            <a-button 
              v-if="selectedProject.demo" 
              type="primary" 
              size="large" 
              class="detail-button"
              @click="openDemo(selectedProject.demo)"
            >
              <i class="fas fa-external-link-alt"></i>
              查看Demo
            </a-button>
            <a-button 
              v-if="selectedProject.github" 
              size="large" 
              class="detail-button"
              @click="openGithub(selectedProject.github)"
            >
              <i class="fab fa-github"></i>
              GitHub源码
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import InteractiveHoverButton from '@/components/button.vue'

interface Project {
  id: number
  title: string
  description: string
  image: string
  framework: string
  tags: string[]
  demo?: string
  github?: string
}

const router = useRouter()

// 项目数据
const projects: Project[] = [
  {
    id: 1,
    title: '数据可视化仪表盘',
    description: '基于Vue 3和ECharts构建的响应式数据可视化仪表盘，支持多种图表类型和数据筛选功能，适用于企业级数据展示场景。',
    image: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/935d1bafb9beae758115e88caa37125c.png',
    framework: 'Vue 3',
    tags: ['Vue 3', 'ECharts', 'TypeScript', 'Ant Design'],
    demo: 'javascript:void(0)',
    github: 'javascript:void(0)'
  },
  {
    id: 2,
    title: '响应式电子商务网站',
    description: '基于React和Redux构建的全功能电子商务网站，包含商品展示、购物车、结账流程和用户中心等模块，支持响应式设计。',
    image: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/ca2fcd9bb044f7aba96ce65fcbc00059.png',
    framework: 'React',
    tags: ['React', 'Redux', 'Tailwind CSS', 'REST API'],
    demo: 'javascript:void(0)',
    github: 'javascript:void(0)'
  },
  {
    id: 3,
    title: 'PWA天气应用',
    description: '基于原生JavaScript开发的渐进式Web应用，提供实时天气数据和5天预报，支持离线访问和添加到主屏幕。',
    image: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/420c4323ce5b988e00b5cba62f9e45bc.png',
    framework: 'JavaScript',
    tags: ['JavaScript', 'PWA', 'IndexedDB', 'Weather API'],
    demo: 'javascript:void(0)',
    github: 'javascript:void(0)'
  }
]

// 模态框相关
const projectModalVisible = ref(false)
const selectedProject = ref<Project | null>(null)

// 返回上一页
const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  // 尽快触发loaded事件，减少等待时间
  const event = new Event('loaded')
  window.dispatchEvent(event)
  
  // 模拟数据加载完成（如果需要视觉上的加载状态）
  setTimeout(() => {
    // 这里可以添加加载状态控制，但不影响事件触发时机
  }, 100)
})

// 查看项目详情
const viewProjectDetail = (project: Project) => {
  selectedProject.value = project
  projectModalVisible.value = true
}

// 打开Demo链接
const openDemo = (url: string) => {
  if (url && url !== 'javascript:void(0)') {
    window.open(url, '_blank')
  } else {
    message.info('暂无Demo地址')
  }
}

// 打开GitHub链接
const openGithub = (url: string) => {
  if (url && url !== 'javascript:void(0)') {
    window.open(url, '_blank')
  } else {
    message.info('暂无源码地址')
  }
}
</script>

<style scoped>
.projects-view {
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

.projects-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.project-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;
}

.project-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.project-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  top: 16px;
  left: 16px;
}

.framework-tag {
  background: rgba(64, 224, 208, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.project-content {
  padding: 24px;
}

.project-title {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.project-description {
  font-size: 15px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.project-tags {
  margin-bottom: 20px;
}

.project-tag {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 16px;
  background: #f0fafa;
  border: 1px solid #40e0d0 !important;
  color: #40e0d0 !important;
  margin-right: 8px;
  margin-bottom: 8px;
}

.project-actions {
  display: flex;
  gap: 12px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
}

.demo-button {
  background-color: #40e0d0 !important;
  border-color: #40e0d0 !important;
}

.github-button {
  border-color: #d9d9d9;
  color: #666;
}

/* 模态框样式 */
.project-detail {
  padding: 20px 0;
}

.detail-image {
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-description {
  font-size: 16px;
  color: #555;
  line-height: 1.7;
  margin-bottom: 24px;
}

.detail-tags {
  margin-bottom: 30px;
}

.detail-tag {
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 20px;
  background: #f0fafa;
  border: 1px solid #40e0d0 !important;
  color: #40e0d0 !important;
  margin-right: 10px;
  margin-bottom: 10px;
}

.detail-actions {
  display: flex;
  gap: 16px;
}

.detail-button {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .projects-view {
    padding: 16px;
  }
  
  .page-header {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .projects-container {
    grid-template-columns: 1fr;
  }
  
  .project-image {
    height: 200px;
  }
  
  .detail-actions {
    flex-direction: column;
  }
}
</style>