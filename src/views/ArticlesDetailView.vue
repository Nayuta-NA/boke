<template>
  <div class="article-detail-container">
    <!-- 主要内容区域 -->
    <div class="detail-main" v-if="currentArticle">
      <div class="content-wrapper">
        <!-- 关闭按钮 - 放在白色区域内右上角 -->
        <div class="close-button" @click="goBack">
          <CloseOutlined />
        </div>

        <!-- 文章头部 -->
        <div class="article-header">
          <h1 class="article-title">
            {{ currentArticle.title }}
          </h1>
          <div class="article-meta">
            <div class="meta-left">
              <span class="category-text">{{ currentArticle.category }}</span>
              <span class="meta-divider">/</span>
              <span class="author-text">{{ currentArticle.author }}</span>
              <span class="publish-date">{{ formatDate(currentArticle.date) }}</span>
            </div>
            <div class="meta-right">
              <span class="meta-item">
                <LikeOutlined /> {{ currentArticle.commentCount || 0 }}
              </span>
              <span class="meta-item">
                <EyeOutlined /> 674
              </span>
              <span class="meta-item">
                <MessageOutlined /> 7
              </span>
            </div>
          </div>
        </div>

        <!-- 摘要或题记 -->
        <div class="article-excerpt-box" v-if="currentArticle.excerpt">
          {{ currentArticle.excerpt }}
        </div>

        <!-- 文章内容 -->
        <div class="article-content">
          <div class="content-text" v-html="currentArticle.desc"></div>

          <!-- 图片展示 -->
          <div v-if="currentArticle.cover" class="article-image">
            <img
              :src="currentArticle.cover"
              :alt="currentArticle.title"
              @error="handleImageError"
            />
          </div>

          <!-- 标签区域 -->
          <div class="article-tags" v-if="currentArticle.tags && currentArticle.tags.length">
            <a-tag v-for="tag in currentArticle.tags" :key="tag" class="tag-item">
              {{ tag }}
            </a-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 右侧悬浮工具栏 -->
    <div class="floating-toolbar" v-if="currentArticle">
      <!-- 点赞按钮 -->
      <button class="toolbar-btn" @click="handleLike">
        <LikeOutlined />
        <span class="btn-text">{{ likeCount }}</span>
      </button>

      <!-- 评论按钮 -->
      <button class="toolbar-btn" @click="handleComment">
        <MessageOutlined />
        <span class="btn-text">7</span>
      </button>

      <!-- 分享按钮 -->
      <button class="toolbar-btn" @click="handleShare">
        <ShareAltOutlined />
      </button>

      <!-- 编辑按钮（仅登录用户可见） -->
      <button 
        v-if="authStore.isAuthenticated" 
        class="toolbar-btn edit-btn" 
        @click="openEditDrawer"
      >
        <EditOutlined />
      </button>

      <!-- 删除按钮（仅登录用户可见） -->
      <button 
        v-if="authStore.isAuthenticated" 
        class="toolbar-btn delete-btn" 
        @click="showDeleteConfirm"
      >
        <DeleteOutlined />
      </button>
    </div>

    <!-- 编辑文章的抽屉 -->
    <a-drawer
      v-model:visible="showEditDrawer"
      title="编辑文章"
      placement="right"
      :width="720"
      :destroy-on-close="true"
    >
      <a-form
        :model="editForm"
        layout="vertical"
        autocomplete="off"
      >
        <a-form-item label="标题" name="title" :rules="[{ required: true, message: '请输入标题' }]">
          <a-input v-model:value="editForm.title" placeholder="请输入标题" size="large" />
        </a-form-item>

        <!-- 封面图片上传 -->
        <a-form-item label="封面图片" name="cover">
          <div class="upload-container">
            <a-upload
              name="file"
              :multiple="false"
              :before-upload="beforeUpload"
              :show-upload-list="false"
              accept="image/*"
            >
              <a-button type="dashed" size="large" block>
                <UploadOutlined /> 选择图片
              </a-button>
            </a-upload>
            <div class="upload-hint">支持 JPG、PNG 格式，大小不超过 2MB(原图上传)</div>
            <div v-if="previewUrl" class="image-preview">
              <img :src="previewUrl" alt="预览" />
              <a-button type="link" @click="removeImage" size="small" danger>
                <DeleteOutlined /> 删除
              </a-button>
            </div>
            <div v-else-if="editForm.cover && !previewUrl" class="image-preview">
              <img :src="editForm.cover" alt="当前封面" />
              <span class="current-image-label">当前封面</span>
            </div>
          </div>
        </a-form-item>

        <a-form-item
          label="分类"
          name="category"
          :rules="[{ required: true, message: '请选择分类' }]"
        >
          <a-select v-model:value="editForm.category" placeholder="请选择分类" size="large">
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
          <a-input v-model:value="editForm.author" placeholder="请输入作者" size="large" />
        </a-form-item>

        <a-form-item label="日期" name="date" :rules="[{ required: true, message: '请选择日期' }]">
          <a-date-picker
            v-model:value="editForm.date"
            value-format="YYYY-MM-DD"
            style="width: 100%"
            placeholder="请选择日期"
            size="large"
          />
        </a-form-item>

        <a-form-item
          label="阅读时间"
          name="readTime"
          :rules="[{ required: true, message: '请输入阅读时间' }]"
        >
          <a-input v-model:value="editForm.readTime" placeholder="例如：5 分钟" size="large" />
        </a-form-item>

        <a-form-item label="摘要" name="excerpt">
          <a-textarea
            v-model:value="editForm.excerpt"
            placeholder="请输入文章摘要（题记）"
            :rows="3"
          />
        </a-form-item>

        <a-form-item label="内容" name="desc" :rules="[{ required: true, message: '请输入内容' }]">
          <a-textarea
            v-model:value="editForm.desc"
            placeholder="请输入文章内容"
            :rows="12"
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
        <a-button @click="handleEditCancel" style="margin-right: 8px;">取消</a-button>
        <a-button @click="handleEditSave" type="primary">保存</a-button>
      </template>
    </a-drawer>

    <!-- 返回顶部按钮 -->
    <div class="back-to-top" @click="scrollToTop">
      <VerticalAlignTopOutlined />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  LikeOutlined,
  EyeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  EditOutlined,
  DeleteOutlined,
  VerticalAlignTopOutlined,
  CloseOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { useArticlesStore } from '@/stores/articles'
import type { Article } from '@/stores/articles'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const currentArticle = ref<Article | null>(null)
const showEditDrawer = ref(false)
const likeCount = ref(0)
const previewUrl = ref('')
const selectedFile = ref<File | null>(null)

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

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 上传前验证
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }
  
  // 限制为 2MB，避免后端 413 错误
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB，请使用压缩工具处理后再上传!')
    return false
  }

  selectedFile.value = file
  
  // 创建预览 URL 并直接更新表单
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64Data = e.target?.result as string
    previewUrl.value = base64Data
    editForm.cover = base64Data
    console.log('图片已选择，Base64 长度:', base64Data.length, '文件大小:', Math.round(file.size / 1024), 'KB')
  }
  reader.onerror = () => {
    message.error('图片读取失败')
  }
  reader.readAsDataURL(file)
  
  return false // 阻止自动上传
}

// 删除图片
const removeImage = () => {
  previewUrl.value = ''
  selectedFile.value = null
  editForm.cover = ''
}

// 点赞处理
const handleLike = () => {
  likeCount.value++
  message.success('点赞成功')
}

// 评论处理
const handleComment = () => {
  message.info('评论功能开发中')
}

// 分享处理
const handleShare = () => {
  message.success('分享链接已复制')
}

// 保存编辑
const handleEditSave = async () => {
  if (!currentArticle.value) return

  try {
    // 准备更新的数据
    const articleData = {
      ...editForm,
      date:
        typeof editForm.date === 'string'
          ? editForm.date
          : (editForm.date as dayjs.Dayjs).format('YYYY-MM-DD'),
    }

    console.log('=== 开始更新文章 ===')
    console.log('文章 ID:', currentArticle.value.id)
    console.log('更新数据:', JSON.stringify(articleData, null, 2))
    console.log('封面图片数据:', articleData.cover ? `有图片 (${articleData.cover.length} 字符)` : '无图片')

    const updatedArticle = await articlesStore.updateArticle(currentArticle.value.id, articleData)

    console.log('更新成功:', updatedArticle)
    
    currentArticle.value = { ...updatedArticle }
    message.success('文章更新成功')
    showEditDrawer.value = false
    previewUrl.value = ''
    selectedFile.value = null
  } catch (error) {
    console.error('更新文章失败:', error)
    message.error('更新失败，请重试')
  }
}

// 取消编辑
const handleEditCancel = () => {
  showEditDrawer.value = false
  previewUrl.value = ''
  selectedFile.value = null
}

// 打开编辑抽屉
const openEditDrawer = () => {
  if (currentArticle.value) {
    Object.assign(editForm, {
      ...currentArticle.value,
      date: dayjs(currentArticle.value.date),
    })
    if (currentArticle.value.cover) {
      previewUrl.value = currentArticle.value.cover
    }
    showEditDrawer.value = true
    console.log('打开编辑抽屉，当前封面:', editForm.cover ? '有' : '无')
  }
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
          router.push('/articles')
        } catch (error) {
          console.error('删除文章失败:', error)
          message.error('删除失败，请重试')
        }
      }
    },
  })
}

// 返回顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// 返回列表页
const goBack = () => {
  router.push('/articles')
}

onMounted(async () => {
  const articleId = parseInt(route.params.id as string)

  try {
    const article = await articlesStore.fetchArticleById(articleId)
    if (article) {
      currentArticle.value = { ...article }
      likeCount.value = article.commentCount || 0

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
  background: #ffffff;
  padding: 0;
  position: relative;
}

.detail-main {
  display: flex;
  justify-content: center;
  padding-top: 60px;
}

.content-wrapper {
  width: 100%;
  max-width: 800px;
  padding: 0 24px;
  position: relative;
}

/* 关闭按钮样式 - 位于白色内容区域内 */
.close-button {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #666;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
  transform: rotate(90deg);
}

/* 移除对header的样式影响，避免与顶部导航栏冲突 */

/* 文章头部样式 */
.article-header {
  margin-bottom: 40px;
  padding-top: 20px;
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-text {
  color: #1890ff;
  font-weight: 500;
}

.meta-divider {
  color: #d9d9d9;
}

.author-text {
  color: #666;
}

.publish-date {
  color: #999;
}

.meta-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
}

.meta-item:hover {
  color: #1890ff;
}

/* 摘要框样式 */
.article-excerpt-box {
  background: #f5f7fa;
  padding: 24px 32px;
  border-radius: 8px;
  margin-bottom: 40px;
  font-size: 15px;
  color: #555;
  line-height: 1.8;
  font-style: italic;
}

/* 文章内容样式 */
.article-content {
  margin-bottom: 60px;
}

.content-text {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 32px;
}

.content-text p {
  margin-bottom: 24px;
  text-align: justify;
}

.article-image {
  margin: 32px 0;
  border-radius: 12px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: auto;
  display: block;
}

.article-tags {
  display: flex;
  gap: 8px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.tag-item {
  font-size: 13px;
  padding: 4px 12px;
  background: #f5f5f5;
  border: none;
  border-radius: 16px;
}

/* 右侧悬浮工具栏 */
.floating-toolbar {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
}

.toolbar-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 18px;
  color: #666;
}

.toolbar-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.toolbar-btn.edit-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.toolbar-btn.delete-btn:hover {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.btn-text {
  font-size: 12px;
  margin-top: 2px;
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #000000;
  color: #ffffff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;
  z-index: 100;
}

.back-to-top:hover {
  background: #333333;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 图片上传预览样式 */
.upload-container {
  width: 100%;
}

.image-preview {
  margin-top: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.image-preview img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #e8e8e8;
}

.image-preview button {
  flex-shrink: 0;
}

.image-preview .current-image-label {
  font-size: 13px;
  color: #666;
}

/* 如果没有图片，显示提示 */
.upload-hint {
  margin-top: 8px;
  font-size: 13px;
  color: #999;
}

/* 加载状态 */
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

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-main {
    padding-top: 20px;
  }

  .content-wrapper {
    padding: 0 16px;
  }

  .article-title {
    font-size: 24px;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .meta-right {
    gap: 12px;
  }

  .article-excerpt-box {
    padding: 16px 20px;
  }

  .content-text {
    font-size: 15px;
  }

  .floating-toolbar {
    right: 16px;
    top: auto;
    bottom: 100px;
    transform: none;
    flex-direction: row;
    justify-content: center;
  }

  .toolbar-btn {
    width: 44px;
    height: 44px;
  }

  .back-to-top {
    right: 16px;
    bottom: 20px;
    width: 44px;
    height: 44px;
  }

  .close-button {
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
}
</style>