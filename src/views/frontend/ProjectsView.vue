<template>
  <div class="projects-view">
    <div class="page-header">
      <InteractiveHoverButton text="返回" class="bg-[#f0f2f5] text-[#666]" @click="goBack" />
      <h1 class="page-title">前端项目展示</h1>
      <div class="header-actions">
        <a-button v-if="canCreate()" type="primary" @click="showAddModal" class="create-button">
          <template #icon><i class="fas fa-plus"></i></template>
          新建项目
        </a-button>
      </div>
    </div>

    <div class="projects-container">
      <div
        class="project-card"
        v-for="project in projects"
        :key="project.id"
        @click="viewProjectDetail(project)"
      >
        <div class="project-image">
          <img :src="project.image" :alt="project.title" />
          <div class="project-overlay">
            <span class="framework-tag">{{ project.framework }}</span>
          </div>
        </div>
        <div class="project-content">
          <h2 class="project-title">{{ project.title }}</h2>
          <p class="project-description">{{ project.description }}</p>
          <div class="project-tags">
            <a-tag v-for="(tag, i) in project.tags" :key="i" class="project-tag">
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
            <a-button
              v-if="canDelete()"
              size="small"
              danger
              class="action-button delete-button"
              @click.stop="confirmDelete(project)"
            >
              <i class="fas fa-trash"></i>
              删除
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
          <img :src="selectedProject.image" :alt="selectedProject.title" />
        </div>
        <div class="detail-content">
          <p class="detail-description">{{ selectedProject.description }}</p>
          <div class="detail-tags">
            <a-tag v-for="(tag, i) in selectedProject.tags" :key="i" class="detail-tag">
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

    <!-- 新建项目弹窗 -->
    <a-modal
      v-model:open="isModalVisible"
      title="新建前端项目"
      @ok="handleAddProject"
      :confirmLoading="isSubmitting"
      okText="确定"
      cancelText="取消"
    >
      <a-form :model="newProject" layout="vertical">
        <a-form-item label="项目标题" required>
          <a-input v-model:value="newProject.title" placeholder="请输入项目标题" maxLength="100" />
        </a-form-item>

        <a-form-item label="项目描述" required>
          <a-textarea
            v-model:value="newProject.description"
            placeholder="请输入项目描述"
            :rows="3"
            maxLength="500"
          />
        </a-form-item>

        <a-form-item label="项目图片上传">
          <div class="image-upload-container">
            <div class="upload-preview" v-if="newProject.image">
              <img :src="newProject.image" alt="预览图片" class="preview-image" />
              <button class="remove-image-btn" @click="removeImage">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <a-upload
              v-else
              name="file"
              :before-upload="beforeImageUpload"
              :show-upload-list="false"
              accept="image/*"
            >
              <div class="upload-area">
                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                <p class="upload-text">点击上传图片</p>
                <p class="upload-hint">支持 JPG、PNG 格式，最大 5MB</p>
              </div>
            </a-upload>
          </div>
        </a-form-item>

        <a-form-item label="技术框架">
          <a-select v-model:value="newProject.framework" placeholder="请选择技术框架">
            <a-select-option value="Vue 3">Vue 3</a-select-option>
            <a-select-option value="React">React</a-select-option>
            <a-select-option value="Angular">Angular</a-select-option>
            <a-select-option value="JavaScript">JavaScript</a-select-option>
            <a-select-option value="TypeScript">TypeScript</a-select-option>
            <a-select-option value="Other">Other</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="标签">
          <a-select
            v-model:value="newProject.tags"
            mode="tags"
            placeholder="添加标签 (按 Enter 确认)"
            :maxTagCount="5"
          />
        </a-form-item>

        <a-form-item label="Demo 地址">
          <a-input v-model:value="newProject.demo" placeholder="请输入 Demo 链接 (可选)" />
        </a-form-item>

        <a-form-item label="GitHub 地址">
          <a-input v-model:value="newProject.github" placeholder="请输入 GitHub 仓库链接 (可选)" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import InteractiveHoverButton from '@/components/button.vue'
import { useFrontendStore } from '@/stores/frontend'
import { canCreate, canDelete } from '@/lib/permissions'

// 定义项目类型 (与 store 中的 Project 类型兼容)
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

// 获取主题色的计算属性（实时从 CSS 变量中读取）
const primaryColor = computed(() => {
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() ||
    '#40e0d0'
  )
})

// 十六进制颜色转 RGBA
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const router = useRouter()
const frontendStore = useFrontendStore()

// 使用 store 中的项目数据
const projects = computed(() => frontendStore.allProjectItems)

// 模态框相关
const projectModalVisible = ref(false)
const selectedProject = ref<Project | null>(null)
const isModalVisible = ref(false)
const isSubmitting = ref(false)

// 新项目表单数据
const newProject = ref({
  title: '',
  description: '',
  image: '',
  framework: 'Vue 3',
  tags: [] as string[],
  demo: '',
  github: '',
})

// 图片上传相关
const beforeImageUpload = async (file: File): Promise<boolean> => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    message.error('只能上传图片文件！')
    return false
  }

  if (!isLt5M) {
    message.error('图片大小不能超过 5MB！')
    return false
  }

  try {
    // 将图片上传到后端
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('上传失败')
    }

    const result = await response.json()
    if (result.url) {
      // 使用完整的 URL 地址
      newProject.value.image = 'http://localhost:5000' + result.url
      message.success('图片上传成功')
    }

    return false // 阻止默认上传行为
  } catch (error: any) {
    message.error(error.message || '上传失败，请重试')
    return false
  }
}

// 移除图片
const removeImage = () => {
  newProject.value.image = ''
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 显示新建项目弹窗
const showAddModal = () => {
  if (!canCreate()) {
    message.warning('请先登录')
    router.push('/login')
    return
  }
  // 重置表单
  newProject.value = {
    title: '',
    description: '',
    image: '',
    framework: 'Vue 3',
    tags: [],
    demo: '',
    github: '',
  }
  isModalVisible.value = true
}

// 处理新建项目
const handleAddProject = async () => {
  if (!canCreate()) {
    message.warning('请先登录')
    router.push('/login')
    return
  }

  // 验证必填字段
  if (!newProject.value.title.trim()) {
    message.error('请输入项目标题')
    return
  }

  if (!newProject.value.description.trim()) {
    message.error('请输入项目描述')
    return
  }

  try {
    isSubmitting.value = true

    await frontendStore.addProjectItem({
      title: newProject.value.title.trim(),
      description: newProject.value.description.trim(),
      image: newProject.value.image || '',
      framework: newProject.value.framework,
      tags: newProject.value.tags,
      demo: newProject.value.demo,
      github: newProject.value.github,
    })

    message.success('项目添加成功')
    isModalVisible.value = false
  } catch (error: any) {
    message.error(error.message || '添加失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 确认删除项目
const confirmDelete = (project: Project) => {
  if (!canDelete()) {
    message.warning('请先登录')
    router.push('/login')
    return
  }

  Modal.confirm({
    title: '确认删除',
    content: `确定要删除项目 "${project.title}" 吗？此操作不可恢复。`,
    okText: '确定删除',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      try {
        await frontendStore.deleteProjectItem(project.id)
        message.success('删除成功')
      } catch (error: any) {
        message.error(error.message || '删除失败，请重试')
      }
    },
  })
}

// 查看项目详情
const viewProjectDetail = (project: Project) => {
  selectedProject.value = project
  projectModalVisible.value = true
}

onMounted(() => {
  // 尽快触发 loaded 事件，减少等待时间
  const event = new Event('loaded')
  window.dispatchEvent(event)

  // 从后端加载项目数据
  frontendStore.loadProjectItems().catch((error) => {
    message.error('加载项目失败')
  })
})

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
  justify-content: space-between;
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
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
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
  background: v-bind(hexToRgba(primaryColor, 0.9));
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
  background: v-bind(hexToRgba(primaryColor, 0.1));
  border: 1px solid v-bind(primaryColor) !important;
  color: v-bind(primaryColor) !important;
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

.delete-button {
  margin-left: auto;
}

.demo-button {
  background-color: v-bind(primaryColor) !important;
  border-color: v-bind(primaryColor) !important;
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
  background: v-bind(hexToRgba(primaryColor, 0.1));
  border: 1px solid v-bind(primaryColor) !important;
  color: v-bind(primaryColor) !important;
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

/* 图片上传样式 */
.image-upload-container {
  width: 100%;
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.upload-area:hover {
  border-color: v-bind(primaryColor);
  background: v-bind(hexToRgba(primaryColor, 0.05));
}

.upload-icon {
  font-size: 48px;
  color: v-bind(primaryColor);
  margin-bottom: 12px;
}

.upload-text {
  font-size: 14px;
  color: #333;
  margin: 8px 0 4px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.upload-preview {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.remove-image-btn:hover {
  background: rgba(255, 0, 0, 0.8);
  transform: scale(1.1);
}
</style>
