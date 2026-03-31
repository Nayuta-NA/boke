<template>
  <div class="resources-view">
    <div class="page-header">
      <InteractiveHoverButton text="返回" class="bg-white text-gray-700 hover:bg-gray-100" @click="goBack" />
      <h1 class="page-title">学习资源</h1>
      <div class="header-actions">
        <a-button 
          v-if="canCreate()" 
          type="primary" 
          @click="showAddModal"
          class="create-button"
        >
          <template #icon><i class="fas fa-plus"></i></template>
          新建资源
        </a-button>
      </div>
    </div>

    <div class="resources-container">
      <div class="resources-grid">
        <div 
          v-for="resource in resources" 
          :key="resource.id"
          class="resource-card"
        >
          <div class="resource-icon">
            <i :class="resource.icon"></i>
          </div>
          <div class="resource-content">
            <h2 class="resource-title">{{ resource.title }}</h2>
            <p class="resource-description">{{ resource.description }}</p>
          </div>
          <div class="resource-actions">
            <a 
              :href="resource.url"
              target="_blank"
              class="visit-btn"
              title="访问资源"
            >
              <i class="fas fa-external-link-alt"></i>
            </a>
            <a-button 
              v-if="canDelete()"
              type="text" 
              danger
              size="small"
              @click="confirmDelete(resource)"
              class="delete-btn"
              title="删除资源"
            >
              <i class="fas fa-trash"></i>
            </a-button>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="!isLoading && resources.length === 0" class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>暂无资源</p>
        <a-button v-if="canCreate()" type="primary" @click="showAddModal">添加第一个资源</a-button>
      </div>
    </div>

    <!-- 新建资源弹窗 -->
    <a-modal
      v-model:open="isModalVisible"
      title="新建学习资源"
      @ok="handleAddResource"
      :confirmLoading="isSubmitting"
      okText="确定"
      cancelText="取消"
    >
      <a-form :model="newResource" layout="vertical">
        <a-form-item label="资源标题" required>
          <a-input
            v-model:value="newResource.title"
            placeholder="请输入资源标题"
            maxLength="100"
          />
        </a-form-item>
        
        <a-form-item label="资源描述" required>
          <a-textarea
            v-model:value="newResource.description"
            placeholder="请输入资源描述"
            :rows="3"
            maxLength="500"
          />
        </a-form-item>
        
        <a-form-item label="资源链接" required>
          <a-input
            v-model:value="newResource.url"
            placeholder="请输入资源链接 (如：https://example.com)"
          />
        </a-form-item>
        
        <a-form-item label="图标类名">
          <a-input
            v-model:value="newResource.icon"
            placeholder="Font Awesome 图标类名 (如：fab fa-vuejs)"
          />
          <div class="form-help">
            使用 Font Awesome 图标，例如：fab fa-vuejs, fas fa-code 等
            <a href="https://fontawesome.com/icons" target="_blank" class="help-link">查看图标库</a>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import InteractiveHoverButton from '@/components/button.vue'
import { useFrontendStore } from '@/stores/frontend'
import { canCreate, canDelete } from '@/lib/permissions'

interface ResourceForm {
  title: string
  description: string
  url: string
  icon: string
}

const router = useRouter()
const frontendStore = useFrontendStore()

// 使用 store 中的资源数据
const resources = computed(() => frontendStore.allResources)
const isLoading = ref(true)
const isModalVisible = ref(false)
const isSubmitting = ref(false)

// 新资源表单数据
const newResource = ref<ResourceForm>({
  title: '',
  description: '',
  url: '',
  icon: 'fas fa-link', // 默认图标
})

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 显示新建资源弹窗
const showAddModal = () => {
  if (!canCreate()) {
    message.warning('请先登录')
    router.push('/login')
    return
  }
  // 重置表单
  newResource.value = {
    title: '',
    description: '',
    url: '',
    icon: 'fas fa-link',
  }
  isModalVisible.value = true
}

// 处理新建资源
const handleAddResource = async () => {
  if (!canCreate()) {
    message.warning('请先登录')
    router.push('/login')
    return
  }
  
  // 验证必填字段
  if (!newResource.value.title.trim()) {
    message.error('请输入资源标题')
    return
  }
  
  if (!newResource.value.description.trim()) {
    message.error('请输入资源描述')
    return
  }
  
  if (!newResource.value.url.trim()) {
    message.error('请输入资源链接')
    return
  }
  
  try {
    isSubmitting.value = true
    
    // 验证 URL 格式
    let url = newResource.value.url.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    
    await frontendStore.addResource({
      title: newResource.value.title.trim(),
      description: newResource.value.description.trim(),
      url: url,
      icon: newResource.value.icon.trim() || 'fas fa-link',
    })
    
    message.success('资源添加成功')
    isModalVisible.value = false
  } catch (error: any) {
    message.error(error.message || '添加失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 确认删除资源
const confirmDelete = (resource: any) => {
  if (!canDelete()) {
    message.warning('请先登录')
    router.push('/login')
    return
  }
  
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除资源 "${resource.title}" 吗？此操作不可恢复。`,
    okText: '确定删除',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      try {
        await frontendStore.deleteResource(resource.id)
        message.success('删除成功')
      } catch (error: any) {
        message.error(error.message || '删除失败，请重试')
      }
    },
  })
}

// 加载数据
onMounted(async () => {
  try {
    await frontendStore.loadResources()
  } catch (error) {
    message.error('加载资源失败')
  } finally {
    isLoading.value = false
    
    // 触发 loaded 事件
    const event = new Event('loaded')
    window.dispatchEvent(event)
  }
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
  position: relative;
}

.header-actions {
  position: absolute;
  right: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
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
  position: relative;
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

.resource-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.resource-card:hover .resource-actions {
  opacity: 1;
}

.visit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f2f5;
  color: #666;
  transition: all 0.3s;
  text-decoration: none;
}

.visit-btn:hover {
  background: #40e0d0;
  color: white;
  transform: scale(1.1);
}

.delete-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  opacity: 1 !important;
}

.delete-btn:hover {
  background: #ff4d4f;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 16px;
  display: block;
}

.empty-state p {
  font-size: 18px;
  margin-bottom: 24px;
}

.form-help {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.help-link {
  color: #1890ff;
  margin-left: 4px;
}

@media (max-width: 768px) {
  .resources-view {
    padding: 16px;
  }
  
  .page-header {
    padding: 16px;
    flex-wrap: wrap;
  }
  
  .header-actions {
    position: static;
    margin-top: 12px;
  }
  
  .page-title {
    font-size: 20px;
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
    font-size: 18px;
  }
  
  .resource-description {
    font-size: 14px;
  }
  
  .resource-actions {
    flex-direction: row;
    gap: 8px;
  }
}
</style>