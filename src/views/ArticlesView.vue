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
      readTime: '5分钟阅读',
      commentCount: 0,
      tags: newArticleForm.tags || [],
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
</style>
