<template>
  <div class="articles-view">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="tabs-nav">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-button', { active: activeTab === index }]"
          @click="activeTab = index"
        >
          {{ tab.title }}
        </button>
      </div>

      <div class="actions-section">
        <button class="create-article-btn" @click="showCreateModal">
          <PlusOutlined />
          新建文章
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 文章列表 - 使用新的卡片布局 -->
    <template v-else>
      <!-- TravelBlog -->
      <div v-if="activeTab === 0" class="category-section">
        <div class="articles-container">
          <ArticlesCard1
            v-for="article in displayedTravelArticles"
            :key="article.id"
            :article="article"
          />
        </div>
        <div v-if="travelArticlesRef.length > 9" class="load-more-container">
          <button class="load-more-btn" @click="showAllTravelArticles">
            {{ showAllTravel ? '收起' : '加载更多' }}
          </button>
        </div>
      </div>

      <!-- WebBlog -->
      <div v-if="activeTab === 1" class="category-section">
        <div class="articles-container">
          <ArticlesCard2
            v-for="article in displayedTechArticles"
            :key="article.id"
            :article="article"
          />
        </div>
        <div v-if="techArticlesRef.length > 9" class="load-more-container">
          <button class="load-more-btn" @click="showAllTechArticles">
            {{ showAllTech ? '收起' : '查看更多' }}
          </button>
        </div>
      </div>

      <!-- otherBlog -->
      <div v-if="activeTab === 2" class="category-section">
        <div class="articles-container">
          <ArticlesCard2
            v-for="article in displayedOtherArticles"
            :key="article.id"
            :article="article"
          />
        </div>
        <div v-if="otherArticlesRef.length > 9" class="load-more-container">
          <button class="load-more-btn" @click="showAllOtherArticles">
            {{ showAllOther ? '收起' : '查看更多' }}
          </button>
        </div>
      </div>
    </template>

    <!-- 创建文章模态框 -->
    <div v-if="createModalVisible" class="modal-overlay" @click="handleCancelCreate">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>新建文章</h3>
          <button class="close-btn" @click="handleCancelCreate">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>文章标题 <span class="required">*</span></label>
            <input
              v-model="newArticleForm.title"
              type="text"
              placeholder="请输入文章标题"
              class="form-input"
            />
          </div>
          <div class="form-item">
            <label>文章分类 <span class="required">*</span></label>
            <select v-model="newArticleForm.category" class="form-select">
              <option value="" disabled>请选择分类</option>
              <option value="旅游">旅游</option>
              <option value="前端">前端</option>
              <option value="技术">技术</option>
              <option value="生活">生活</option>
            </select>
          </div>
          <div class="form-item">
            <label>封面图片 URL</label>
            <input
              v-model="newArticleForm.cover"
              type="text"
              placeholder="请输入封面图片链接（可选）"
              class="form-input"
            />
          </div>
          <div class="form-item">
            <label>文章摘要 <span class="required">*</span></label>
            <textarea
              v-model="newArticleForm.excerpt"
              placeholder="请输入文章摘要（100 字以内）"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
          <div class="form-item">
            <label>文章内容 <span class="required">*</span></label>
            <textarea
              v-model="newArticleForm.desc"
              placeholder="请输入文章内容"
              class="form-textarea"
              rows="6"
            ></textarea>
          </div>
          <div class="form-item">
            <label>标签（用逗号分隔）</label>
            <input
              v-model="newArticleForm.tags"
              type="text"
              placeholder="例如：Vue, JavaScript, 前端"
              class="form-input"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="handleCancelCreate">取消</button>
          <button class="btn-confirm" @click="handleCreateArticle" :disabled="confirmLoading">
            {{ confirmLoading ? '创建中...' : '创建' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import ArticlesCard2 from '@/components/ArticlesCard/ArticlesCard2.vue'
import ArticlesCard1 from '@/components/ArticlesCard/ArticlesCard1.vue'
import { useArticlesStore } from '@/stores/articles'
// import Marquee from '@/components/pl/Marquee.vue'
// import Recommend from '@/components/Recommend/index.vue'

// 标签数据
const tabs = [{ title: '旅游' }, { title: '前端' }, { title: '生活' }]

const activeTab = ref(0)
const isLoading = ref(true)

// 控制显示全部文章的变量
const showAllTravel = ref(false)
const showAllTech = ref(false)
const showAllOther = ref(false)

// 使用文章 store
const articlesStore = useArticlesStore()

// 响应式文章数据
const travelArticlesRef = ref<any[]>([])
const techArticlesRef = ref<any[]>([])
const otherArticlesRef = ref<any[]>([])

// 计算属性：根据是否显示全部来决定每类文章显示的数量
const displayedTravelArticles = computed(() => {
  if (showAllTravel.value) {
    return travelArticlesRef.value
  }
  return travelArticlesRef.value.slice(0, 9)
})

const displayedTechArticles = computed(() => {
  if (showAllTech.value) {
    return techArticlesRef.value
  }
  return techArticlesRef.value.slice(0, 9)
})

const displayedOtherArticles = computed(() => {
  if (showAllOther.value) {
    return otherArticlesRef.value
  }
  return otherArticlesRef.value.slice(0, 9)
})

// 引入路由器
const router = useRouter()

// 新建文章模态框相关
const createModalVisible = ref(false)
const confirmLoading = ref(false)

// 新文章表单数据
const newArticleForm = reactive({
  title: '',
  category: undefined as string | undefined,
  cover: '',
  excerpt: '',
  desc: '',
  tags: [] as string[],
})

// 跳转到详情页
const goToDetail = (id: number) => {
  router.push(`/articles/${id}`)
}

// 显示创建文章模态框
const showCreateModal = () => {
  createModalVisible.value = true
}

// 处理创建文章
const handleCreateArticle = async () => {
  if (
    !newArticleForm.title ||
    !newArticleForm.category ||
    !newArticleForm.excerpt ||
    !newArticleForm.desc
  ) {
    message.warning('请填写必填项')
    return
  }
  confirmLoading.value = true
  try {
    // 准备文章数据
    const articleData = {
      ...newArticleForm,
      cover:
        newArticleForm.cover ||
        'https://design.gemcoder.com/staticResource/echoAiSystemImages/default-article-cover.jpg',
      author: '张小明',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 分钟阅读',
      commentCount: 0,
      tags: newArticleForm.tags || [],
      link: '', // 添加必需的 link 字段
      category: newArticleForm.category!, // 使用非空断言，因为前面已经验证过
    }
    // 调用 store 的创建方法
    await articlesStore.createArticle(articleData)
    // 重新加载分类数据
    await loadArticles()
    // 重置表单
    Object.assign(newArticleForm, {
      title: '',
      category: undefined,
      cover: '',
      excerpt: '',
      desc: '',
      tags: [],
    })
    // 关闭模态框
    createModalVisible.value = false
    message.success('文章创建成功')
  } catch (error) {
    message.error('创建文章失败')
    console.error('创建文章失败:', error)
  } finally {
    confirmLoading.value = false
  }
}

// 取消创建文章
const handleCancelCreate = () => {
  createModalVisible.value = false
  // 重置表单
  Object.assign(newArticleForm, {
    title: '',
    category: undefined,
    cover: '',
    excerpt: '',
    desc: '',
    tags: [],
  })
}

// 根据分类过滤文章
const loadArticles = async () => {
  try {
    // 从 store 获取文章数据
    await articlesStore.fetchArticles()
    // 按分类过滤文章
    const allArticles = articlesStore.articles
    travelArticlesRef.value = allArticles.filter((article: any) => article.category === '旅游')
    techArticlesRef.value = allArticles.filter(
      (article: any) => article.category === '技术' || article.category === '前端',
    )
    otherArticlesRef.value = allArticles.filter((article: any) => article.category === '生活')
  } catch (error) {
    console.error('加载文章失败:', error)
    message.error('加载文章失败')
  }
}

// 展示所有旅游文章
const showAllTravelArticles = () => {
  showAllTravel.value = !showAllTravel.value
}

// 展示所有技术文章
const showAllTechArticles = () => {
  showAllTech.value = !showAllTech.value
}

// 展示所有其他文章
const showAllOtherArticles = () => {
  showAllOther.value = !showAllOther.value
}

// 页面加载完成后触发事件
onMounted(async () => {
  // 尽快触发loaded事件，减少等待时间
  const event = new Event('loaded')
  window.dispatchEvent(event)
  // 从后端加载文章数据
  await loadArticles()
  isLoading.value = false
})
</script>

<style scoped>
.articles-view {
  padding: 2rem;
  max-width: 90%;
  margin: 0 auto;
  margin-top: -2%;
}

/* 头部区域 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

/* 标签导航样式 */
.tabs-nav {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tab-button {
  padding: 10px 24px;
  border: none;
  border-radius: 25px;
  background-color: #f5f5f5;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background-color: #e8e8e8;
  color: #333;
}

.tab-button.active {
  background-color: #40e0d0;
  color: white;
  box-shadow: 0 4px 12px rgba(64, 224, 208, 0.3);
}

.actions-section {
  display: flex;
  align-items: center;
}

.create-article-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #40e0d0;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.create-article-btn:hover {
  background-color: #34c7ba;
  box-shadow: 0 4px 12px rgba(64, 224, 208, 0.4);
  transform: translateY(-2px);
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #666;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #40e0d0;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 分类区域 */
.category-section {
  margin-bottom: 2rem;
}

/* 文章容器样式 - 优化后的网格布局 */
.articles-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  min-height: 400px;
}

/* 加载更多按钮样式 */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.load-more-btn {
  padding: 12px 32px;
  background-color: white;
  border: 2px solid #e5e7eb;
  border-radius: 30px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background-color: #40e0d0;
  color: white;
  border-color: #40e0d0;
  box-shadow: 0 4px 12px rgba(64, 224, 208, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .tabs-nav {
    justify-content: center;
  }

  .actions-section {
    justify-content: center;
  }

  .articles-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .articles-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: #f3f4f6;
  color: #4b5563;
}

.modal-body {
  padding: 24px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #ef4444;
  margin-left: 4px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #40e0d0;
  box-shadow: 0 0 0 3px rgba(64, 224, 208, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-confirm {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #6b7280;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
}

.btn-confirm {
  background-color: #40e0d0;
  color: white;
}

.btn-confirm:hover {
  background-color: #34c7ba;
  box-shadow: 0 4px 12px rgba(64, 224, 208, 0.3);
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式模态框 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
}
</style>
