<template>
  <div class="articles-view">
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

    <!-- 内容区域 -->
    <div v-else class="tabs-content">
      <div v-if="activeTab === 0" class="tab-pane">
        <div class="articles-container">
          <div
            v-for="article in displayedTravelArticles"
            :key="article.id"
            class="article-card-wrapper"
            @click="goToDetail(article.id)"
          >
            <!-- 使用修改后的ArticlesCard2组件，突出图片展示 -->
            <div class="enhanced-article-card">
              <!-- 图片区域 -->
              <div
                v-if="article.cover"
                class="image-section rounded-8px overflow-hidden m-10px flex items-center justify-center group"
                :style="{
                  backgroundColor: '#4b5563',
                }"
              >
                <img
                  :src="article.cover"
                  :alt="article.title"
                  class="w-full h-full object-cover"
                  @error="onImageError"
                />
              </div>

              <!-- 无图片时的默认占位符 -->
              <div
                v-else
                class="image-section rounded-8px overflow-hidden m-10px flex items-center justify-center group"
                :style="{
                  backgroundColor: '#4b5563',
                }"
              >
                <span class="text-4xl font-bold text-white text-center px-2">
                  {{ getDisplayText(article.title) }}
                </span>
              </div>

              <div class="text-box flex flex-col w-60% ml-10px">
                <div
                  class="title text-20px font-bold mb-8px mt-10px transition-all duration-300 hover:text-teal-500"
                >
                  {{ article.title }}
                </div>
                <div class="excerpt text-16px text-gray-500 line-clamp-2">
                  {{ article.excerpt }}
                </div>
                <div class="data-time text-14px text-gray-400 mt-8px">
                  发布时间：{{ article.date }}
                </div>

                <div class="article-meta mt-8px flex gap-2">
                  <span class="read-time text-14px text-gray-500">{{ article.readTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 展示更多按钮 -->
        <div class="load-more-container" v-if="travelArticlesRef.length > 9">
          <button class="load-more-btn" @click="showAllTravel = !showAllTravel">
            {{ showAllTravel ? '收起' : '加载更多' }}
          </button>
        </div>
      </div>

      <div v-if="activeTab === 1" class="tab-pane">
        <div class="articles-container">
          <div
            v-for="article in displayedTechArticles"
            :key="article.id"
            class="article-card-wrapper"
            @click="goToDetail(article.id)"
          >
            <ArticlesCard2 :article="article" />
          </div>
        </div>

        <!-- 展示更多按钮 -->
        <div class="load-more-container" v-if="techArticlesRef.length > 9">
          <button class="load-more-btn" @click="showAllTech = !showAllTech">
            {{ showAllTech ? '收起' : '查看更多' }}
          </button>
        </div>
      </div>

      <div v-if="activeTab === 2" class="tab-pane">
        <div class="articles-container">
          <div
            v-for="article in displayedOtherArticles"
            :key="article.id"
            class="article-card-wrapper"
            @click="goToDetail(article.id)"
          >
            <ArticlesCard2 :article="article" />
          </div>
        </div>

        <!-- 展示更多按钮 -->
        <div class="load-more-container" v-if="otherArticlesRef.length > 9">
          <button class="load-more-btn" @click="showAllOther = !showAllOther">
            {{ showAllOther ? '收起' : '查看更多' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 新建文章模态框 -->
    <a-modal
      v-model:open="createModalVisible"
      title="新建文章"
      @ok="handleCreateArticle"
      @cancel="handleCancelCreate"
      :confirm-loading="confirmLoading"
    >
      <a-form :model="newArticleForm" layout="vertical">
        <a-form-item label="文章标题" required>
          <a-input v-model:value="newArticleForm.title" placeholder="请输入文章标题" />
        </a-form-item>

        <a-form-item label="文章分类" required>
          <a-select v-model:value="newArticleForm.category" placeholder="请选择文章分类">
            <a-select-option value="旅游">旅游</a-select-option>
            <a-select-option value="前端">前端</a-select-option>
            <a-select-option value="生活">生活</a-select-option>
            <a-select-option value="技术">技术</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="封面图片URL">
          <a-input v-model:value="newArticleForm.cover" placeholder="请输入封面图片URL" />
        </a-form-item>

        <a-form-item label="文章摘要" required>
          <a-textarea
            v-model:value="newArticleForm.excerpt"
            placeholder="请输入文章摘要"
            :rows="3"
          />
        </a-form-item>

        <a-form-item label="文章内容" required>
          <a-textarea v-model:value="newArticleForm.desc" placeholder="请输入文章内容" :rows="5" />
        </a-form-item>

        <a-form-item label="标签">
          <a-select
            v-model:value="newArticleForm.tags"
            mode="tags"
            placeholder="请输入标签（回车确认）"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <Marquee style="margin-top: 20px"></Marquee>
    <!-- <Recommend /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import ArticlesCard2 from '@/components/ArticlesCard/ArticlesCard2.vue'
import { useArticlesStore } from '@/stores/articles'
import Marquee from '@/components/pl/Marquee.vue'
import Recommend from '@/components/Recommend/index.vue'

// 标签数据
const tabs = [{ title: 'TravelBlog' }, { title: 'WebBlog' }, { title: 'otherBlog' }]

const activeTab = ref(0)
const isLoading = ref(true) // 添加加载状态

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
      (article: any) => article.category === '技术' || article.category === '前端'
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

// 图片加载错误处理
const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

// 获取要显示的文本（限制为10个字符）
const getDisplayText = (title: string) => {
  if (!title) return 'A'
  // 限制标题长度为10个字符
  return title.trim().substring(0, 10)
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #40e0d0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
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

/* 标签导航样式 */
.tabs-nav {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tab-button {
  padding: 8px 20px;
  border: 1px solid #40e0d0;
  border-radius: 30px;
  background-color: transparent;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background-color: #40e0d0;
  color: white;
}

.tab-button.active {
  background-color: #40e0d0;
  color: white;
  border-color: #40e0d0;
}

.actions-section {
  display: flex;
  align-items: center;
}

.create-article-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #40e0d0;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.create-article-btn:hover {
  background-color: #34c7ba;
}

/* 文章容器样式 - 修改为一行三列 */
.articles-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 1rem 0;
}

.article-card-wrapper {
  cursor: pointer;
  transition: transform 0.3s;
}

.article-card-wrapper:hover {
  transform: translateY(-5px);
}

/* 为TravelBlog增强的文章卡片 */
.enhanced-article-card {
  display: flex;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 180px;
  overflow: hidden;
}

.enhanced-article-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.image-section {
  width: 160px;
  height: 160px;
  flex-shrink: 0;
}

.text-box {
  flex: 1;
  padding: 10px;
  overflow: hidden;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 10px;
  transition: all 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title:hover {
  color: #40e0d0;
}

.excerpt {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 8px;
}

.data-time {
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 8px;
}

.article-meta {
  display: flex;
  gap: 8px;
}

.read-time {
  font-size: 14px;
  color: #9ca3af;
}

/* 加载更多按钮样式 */
.load-more-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  margin-top: 20px; /* 可选：增加顶部间距 */
}

.load-more-btn {
  padding: 10px 24px;
  background-color: #f0f0f0; /* 浅灰色背景 */
  border: 1px solid #d9d9d9; /* 细边框 */
  border-radius: 25px; /* 圆角矩形 */
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease; /* 平滑过渡效果 */
}

.load-more-btn:hover {
  background-color: #40e0d0; /* 悬停时背景变为青绿色 */
  color: white; /* 悬停时文字变为白色 */
  border-color: #40e0d0; /* 悬停时边框变为青绿色 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .tabs-nav {
    justify-content: flex-start;
  }

  .actions-section {
    justify-content: center;
  }

  .articles-container {
    grid-template-columns: 1fr;
  }

  .enhanced-article-card {
    flex-direction: column;
    height: auto;
  }

  .image-section {
    width: 100%;
    height: 200px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .articles-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
