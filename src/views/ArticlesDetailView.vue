<template>
  <div class="article-detail-container">
    <!-- 主要内容区域 -->
    <div class="detail-main" v-if="currentArticle">
      <div class="content-wrapper">
        <!-- 文章卡片 -->
        <div class="article-card">
          <!-- 返回按钮和操作按钮 -->
          <div class="action-section">
            <a-button @click="goBack" class="back-button" size="large">
              <template #icon>
                <ArrowLeftOutlined />
              </template>
              返回文章列表
            </a-button>

            <!-- 编辑和删除按钮，仅在用户登录时显示 -->
            <div class="edit-delete-buttons" v-if="authStore.isAuthenticated">
              <a-button @click="openEditModal" class="edit-button" type="primary" size="large">
                <template #icon>
                  <EditOutlined />
                </template>
                编辑
              </a-button>
              <a-button
                @click="showDeleteConfirm"
                class="delete-button"
                type="default"
                danger
                size="large"
              >
                <template #icon>
                  <DeleteOutlined />
                </template>
                删除
              </a-button>
            </div>
          </div>

          <!-- 文章内容 -->
          <div class="article-content">
            <div class="content-header">
              <h1 class="article-title">
                {{ currentArticle.title }}
              </h1>
              <div class="article-meta">
                <div class="meta-info">
                  <span class="article-date">
                    <CalendarOutlined />
                    {{ formatDate(currentArticle.date) }}
                  </span>
                  <span class="article-author">
                    <UserOutlined />
                    {{ currentArticle.author }}
                  </span>
                  <span class="article-read-time">
                    <ClockCircleOutlined />
                    {{ currentArticle.readTime }}
                  </span>
                  <a-tag :color="getCategoryColor(currentArticle.category)" class="category-tag">
                    {{ currentArticle.category }}
                  </a-tag>
                </div>
              </div>
            </div>

            <!-- 封面图片或默认占位符 -->
            <div v-if="currentArticle.cover" class="cover-image">
              <img
                :src="currentArticle.cover"
                :alt="currentArticle.title"
                @error="handleImageError"
              />
            </div>

            <!-- 默认占位符 -->

            <div class="content-text" v-html="currentArticle.desc"></div>

            <div class="article-tags" v-if="currentArticle.tags && currentArticle.tags.length">
              <span class="tags-label">标签：</span>
              <a-tag v-for="tag in currentArticle.tags" :key="tag" class="tag-item">
                {{ tag }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 编辑文章的模态框 -->
    <a-modal
      v-model:visible="showEditModal"
      title="编辑文章"
      :width="800"
      :destroy-on-close="true"
      @cancel="handleEditCancel"
    >
      <a-form
        :model="editForm"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
        layout="vertical"
      >
        <a-form-item label="标题" name="title" :rules="[{ required: true, message: '请输入标题' }]">
          <a-input v-model:value="editForm.title" placeholder="请输入标题" />
        </a-form-item>

        <a-form-item label="封面图片链接" name="cover">
          <a-input v-model:value="editForm.cover" placeholder="请输入封面图片链接" />
        </a-form-item>

        <a-form-item
          label="分类"
          name="category"
          :rules="[{ required: true, message: '请选择分类' }]"
        >
          <a-select v-model:value="editForm.category" placeholder="请选择分类">
            <a-select-option value="前端">前端</a-select-option>
            <a-select-option value="旅游">旅游</a-select-option>
            <a-select-option value="生活">生活</a-select-option>
            <a-select-option value="技术">技术</a-select-option>
            <a-select-option value="设计">设计</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="作者"
          name="author"
          :rules="[{ required: true, message: '请输入作者' }]"
        >
          <a-input v-model:value="editForm.author" placeholder="请输入作者" />
        </a-form-item>

        <a-form-item label="日期" name="date" :rules="[{ required: true, message: '请选择日期' }]">
          <a-date-picker
            v-model:value="editForm.date"
            value-format="YYYY-MM-DD"
            style="width: 100%"
            placeholder="请选择日期"
          />
        </a-form-item>

        <a-form-item
          label="阅读时间"
          name="readTime"
          :rules="[{ required: true, message: '请输入阅读时间' }]"
        >
          <a-input v-model:value="editForm.readTime" placeholder="例如：5分钟" />
        </a-form-item>

        <a-form-item label="内容" name="desc" :rules="[{ required: true, message: '请输入内容' }]">
          <a-textarea
            v-model:value="editForm.desc"
            placeholder="请输入文章内容"
            :rows="8"
            :auto-size="{ minRows: 6, maxRows: 12 }"
          />
        </a-form-item>

        <a-form-item label="标签" name="tags">
          <a-select
            v-model:value="editForm.tags"
            mode="tags"
            placeholder="请输入标签"
            style="width: 100%"
          >
          </a-select>
        </a-form-item>
      </a-form>

      <template #footer>
        <a-button @click="handleEditCancel">取消</a-button>
        <a-button @click="handleEditSave" type="primary">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { useArticlesStore, type Article } from '@/stores/articles'
import { useAuthStore } from '@/stores/auth'

interface Article {
  id: number
  title: string
  cover: string
  category: string
  desc: string
  excerpt: string
  author: string
  date: string
  readTime: string
  commentCount: number
  link: string
  tags?: string[]
}

const route = useRoute()
const router = useRouter()
const currentArticle = ref<Article | null>(null)
const showEditModal = ref(false)

// 获取文章 store 和认证 store
const articlesStore = useArticlesStore()
const authStore = useAuthStore()

// 编辑表单类型，日期字段需要支持 Dayjs 类型
interface EditForm extends Omit<Article, 'date'> {
  date: string | dayjs.Dayjs
}

// 初始化编辑表单
const editForm = reactive<EditForm>({
  id: 0,
  title: '',
  cover: '',
  category: '',
  desc: '',
  excerpt: '',
  author: '',
  date: '',
  readTime: '',
  commentCount: 0,
  link: '',
  tags: [],
})

// 处理图片加载错误 - 隐藏损坏的图片
const handleImageError = (event: any) => {
  event.target.style.display = 'none'
}

// 获取标题的第一个字符（中文或英文首字母）
const getFirstChar = (title: string) => {
  if (!title) return 'A'
  const firstChar = title.trim().charAt(0).toUpperCase()
  return firstChar.match(/[A-Z0-9]/) ? firstChar : firstChar
}

// 根据标题生成默认背景颜色
const getDefaultColor = (title: string) => {
  if (!title) return '#3b82f6' // 默认蓝色

  // 根据标题第一个字符生成哈希值
  let hash = 0
  const str = title.trim().charAt(0).toUpperCase()
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  // 使用哈希值生成颜色
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 70%, 50%)`
}

// 获取分类标签颜色
const getCategoryColor = (category: string) => {
  const categoryColors: Record<string, string> = {
    前端: 'blue',
    旅游: 'green',
    生活: 'purple',
    技术: 'orange',
    设计: 'pink',
  }
  return categoryColors[category] || 'default'
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 返回列表页面
const goBack = () => {
  router.push('/articles')
}

// 显示删除确认对话框
const showDeleteConfirm = () => {
  Modal.confirm({
    title: '确认删除',
    content: '您确定要删除这篇文章吗？此操作不可撤销。',
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      if (currentArticle.value) {
        try {
          await articlesStore.deleteArticle(currentArticle.value.id)
          message.success('删除成功')
          router.push('/articles') // 删除后返回文章列表
        } catch (error) {
          console.error('删除文章失败:', error)
          message.error('删除失败，请重试')
        }
      }
    },
  })
}

// 打开编辑模态框
const openEditModal = () => {
  if (currentArticle.value) {
    // 复制当前文章数据到编辑表单，处理日期格式
    Object.assign(editForm, {
      ...currentArticle.value,
      date: dayjs(currentArticle.value.date), // 转换为 dayjs 对象
    })
    showEditModal.value = true
  }
}

// 保存编辑
const handleEditSave = async () => {
  if (!currentArticle.value) return

  try {
    // 更新文章，确保日期为字符串格式
    const updatedArticle = await articlesStore.updateArticle(currentArticle.value.id, {
      ...editForm,
      date:
        typeof editForm.date === 'string'
          ? editForm.date
          : (editForm.date as dayjs.Dayjs).format('YYYY-MM-DD'),
    })

    // 更新当前显示的文章
    currentArticle.value = { ...updatedArticle }

    message.success('文章更新成功')
    showEditModal.value = false
  } catch (error) {
    console.error('更新文章失败:', error)
    message.error('更新失败，请重试')
  }
}

// 取消编辑
const handleEditCancel = () => {
  showEditModal.value = false
}

onMounted(async () => {
  // 从路由参数中获取文章ID
  const articleId = parseInt(route.params.id as string)

  try {
    // 从 store 获取文章
    const article = await articlesStore.fetchArticleById(articleId)
    if (article) {
      currentArticle.value = { ...article } // 创建副本避免直接修改原始数据

      // 触发loaded事件
      const event = new Event('loaded')
      window.dispatchEvent(event)
    } else {
      message.error('未找到指定的文章')
      router.push('/articles')
    }
  } catch (error) {
    console.error('获取文章失败:', error)
    message.error('获取文章失败')
    router.push('/articles')
  }
})
</script>

<style scoped>
.article-detail-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 20px;
}

.detail-main {
  display: flex;
  justify-content: center;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
}

.article-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.article-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
  transform: translateY(-5px);
}

.back-section {
  padding: 24px 40px 0;
}

.back-button {
  background: #f0f2f5;
  border: none;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #e1e5e9 !important;
  border: none;
}

.article-content {
  padding: 20px 40px 40px;
}

.action-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px 0;
  flex-wrap: wrap;
  gap: 12px;
}

.edit-delete-buttons {
  display: flex;
  gap: 12px;
}

.edit-button {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
  transition: all 0.3s ease;
}

.edit-button:hover,
.edit-button:focus {
  background: #40a9ff;
  border-color: #40a9ff;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.delete-button {
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;
  transition: all 0.3s ease;
}

.delete-button:hover,
.delete-button:focus {
  background: #ff7875;
  border-color: #ff7875;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

.content-header {
  margin-bottom: 30px;
}

.article-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.article-date,
.article-author,
.article-read-time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.category-tag {
  font-size: 12px;
  padding: 2px 8px;
}

.cover-image,
.cover-placeholder {
  width: 100%;
  max-height: 500px;
  margin: 20px 0 30px;
  border-radius: 12px;
  overflow: hidden;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-placeholder {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-size: 120px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
}

.content-text {
  font-size: 18px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 30px;
}

.content-text p {
  margin-bottom: 20px;
  text-align: justify;
}

.article-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.tags-label {
  font-size: 14px;
  color: #666;
}

.tag-item {
  font-size: 12px;
  margin: 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(64, 224, 208, 0.3);
  border-top: 5px solid #40e0d0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .article-detail-container {
    padding: 20px 10px;
  }

  .action-section {
    padding-left: 20px;
    padding-right: 20px;
    flex-direction: column;
    align-items: stretch;
  }

  .edit-delete-buttons {
    justify-content: center;
  }

  .article-content {
    padding-left: 20px;
    padding-right: 20px;
  }

  .article-title {
    font-size: 24px;
  }

  .content-text {
    font-size: 16px;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .cover-image,
  .cover-placeholder {
    margin: 15px 0 20px;
  }

  .cover-placeholder {
    height: 300px;
  }

  .placeholder-text {
    font-size: 80px;
  }
}
</style>
