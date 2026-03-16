<template>
  <div
    class="article-card relative flex items-start bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    style="height: auto; min-height: 180px"
  >
    <!-- 文章背景图或默认占位符 -->
    <div
      v-if="article.cover"
      class="article-bg absolute inset-0 z-0"
      :style="{
        backgroundImage: `url('${article.cover}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.7)',
      }"
    ></div>

    <!-- 默认占位符 -->
    <div
      v-else
      class="absolute inset-0 z-0 flex items-center justify-center"
      :style="{
        backgroundColor: getDefaultColor(article.title),
      }"
    >
      <span class="text-6xl font-bold text-white opacity-80">
        {{ getFirstChar(article.title) }}
      </span>
    </div>

    <!-- 文章内容，置于背景图上方 -->
    <div class="article-content relative z-10 p-6 md:p-8 w-full">
      <!-- 分类标识（若需要可添加） -->
      <!-- <div class="category-badge absolute top-4 left-4 z-20 px-2.5 py-1 text-xs font-medium rounded-full bg-orange-500 text-white">
        {{ article.category }}
      </div> -->

      <h3
        class="article-title text-2xl md:text-2xl font-bold mb-3 text-white transition-colors duration-300 group-hover:text-orange-300"
        style="line-height: 1.3"
      >
        {{ article.title }}
      </h3>
      <p
        class="article-excerpt text-white/80 text-sm md:text-base line-clamp-2 mb-4"
        style="line-height: 1.5"
      >
        {{ article.excerpt }}
      </p>
      <div class="article-meta flex items-center justify-between text-white/70 text-sm mt-2">
        <span class="publish-date flex items-center">
          <i class="fa fa-calendar-o mr-1.5"></i>
          {{ article.date }}
        </span>
        <span class="read-time flex items-center">
          <i class="fa fa-clock-o mr-1.5"></i>
          {{ article.readTime }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Article {
  id: number
  title: string
  excerpt: string
  cover?: string
  category: string
  date: string
  readTime: string
  author: string
  commentCount: number
}

const props = defineProps<{
  article: Article
}>()

// 获取文章标题的第一个字符
const getFirstChar = (title: string) => {
  if (!title) return 'A'
  return title.trim().charAt(0).toUpperCase()
}

// 获取要显示的文本（限制为10个字符）
const getDisplayText = (title: string) => {
  if (!title) return 'A'
  // 限制标题长度为10个字符
  return title.trim().substring(0, 10)
}

// 使用统一的深灰色背景
const getDefaultColor = (title: string) => {
  return '#4b5563' // 深灰色
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
