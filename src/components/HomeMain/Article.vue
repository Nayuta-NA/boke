<template>
  <div style="z-index: 2; position: relative">
    <!-- 传递title、introduce和更合理的height -->
    <HomeMainBOX
      title="文章"
      introduce="精心挑选的高质量文章，涵盖技术分享、旅行体验和生活随想"
      height="auto"
      :more-path="morePath"
    >
      <template v-slot:main>
        <!-- 新增 py-16：给文章列表添加垂直内边距，让内容更饱满 -->
        <div class="py-16" style="background-color: var(--navbar-color)">
          <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div
                v-for="article in articles"
                :key="article.id"
                class="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-pointer"
                style="background-color: var(--app-background)"
                @click="goToArticleDetail(article.id)"
              >
                <div class="relative h-48 overflow-hidden">
                  <!-- 根据是否有有效封面图显示图片或占位符 -->
                  <img
                    v-if="article.cover"
                    :src="article.cover"
                    :alt="article.title"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    @error="($event) => handleImageError($event, article)"
                  />
                  <div
                    v-else
                    class="flex items-center justify-center w-full h-full bg-gray-600 text-white font-bold text-2xl"
                  >
                    {{ article.title.substring(0, 10) }}
                  </div>
                  <span
                    class="absolute top-4 left-4 px-3 py-1 bg-primary/90 text-white text-xs font-medium rounded-full"
                  >
                    {{ article.category }}
                  </span>
                </div>
                <div class="p-6">
                  <h3
                    class="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors duration-200"
                  >
                    {{ article.title }}
                  </h3>
                  <p class="text-gray-600 mb-4 line-clamp-3">{{ article.desc }}</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <img
                        src="/src/IMG/TX/TX.jpg"
                        alt="作者头像"
                        class="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p class="text-sm font-medium text-gray-800">{{ article.author }}</p>
                        <p class="text-xs text-gray-500">
                          {{ article.date }} · {{ article.readTime }}
                        </p>
                      </div>
                    </div>
                    <span class="text-gray-400 text-sm">
                      <i class="far fa-comment mr-1"></i>
                      {{ article.commentCount }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </HomeMainBOX>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HomeMainBOX from '@/components/HomeMainBOX.vue'
import { useArticlesStore } from '@/stores/articles'

interface Article {
  id: number
  title: string
  cover?: string
  category: string
  desc: string
  author: string
  date: string
  readTime: string
  commentCount: number
  link: string
}

const articles = ref<Article[]>([])
const loading = ref(true)
const morePath = '/articles'
const router = useRouter()

// 获取文章 store
const articlesStore = useArticlesStore()

// 加载文章数据
const loadArticles = async () => {
  try {
    await articlesStore.fetchArticles()
    // 只取前3篇文章
    articles.value = articlesStore.articles.slice(0, 3)
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArticles()
})

// 跳转到文章详情页
const goToArticleDetail = (id: number) => {
  router.push(`/articles/${id}`)
}

// 处理图片加载错误
const handleImageError = (event: Event, article: Article) => {
  const target = event.target as HTMLImageElement
  // 隐藏图片
  target.style.display = 'none'

  // 在图片位置添加占位符
  const parent = target.parentElement
  if (parent && !parent.querySelector('.image-placeholder')) {
    const placeholder = document.createElement('div')
    placeholder.className =
      'image-placeholder flex items-center justify-center w-full h-full bg-gray-600 text-white font-bold text-2xl'
    placeholder.textContent = article.title.substring(0, 10)
    parent.appendChild(placeholder)
  }
}
</script>

<style scoped></style>