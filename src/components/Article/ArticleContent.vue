<template>
  <div class="article-content">
    <div class="content-header">
      <h1 class="article-title">
        {{ article.title }}
      </h1>
      <div class="article-meta">
        <div class="meta-info">
          <span class="article-date">
            <CalendarOutlined />
            {{ formatDate(article.date) }}
          </span>
          <span class="article-author">
            <UserOutlined />
            {{ article.author }}
          </span>
          <span class="article-read-time">
            <ClockCircleOutlined />
            {{ article.readTime }}
          </span>
          <a-tag :color="getCategoryColor(article.category)" class="category-tag">
            {{ article.category }}
          </a-tag>
        </div>
      </div>
    </div>

    <!-- 封面图片或默认占位符 -->
    <div v-if="article.cover" class="cover-image">
      <img :src="article.cover" :alt="article.title" @error="handleImageError" />
    </div>

    <!-- 文章内容 -->
    <div class="content-text" v-html="article.desc"></div>

    <!-- 标签区域 -->
    <div class="article-tags" v-if="article.tags && article.tags.length">
      <span class="tags-label">标签：</span>
      <a-tag v-for="tag in article.tags" :key="tag" class="tag-item">
        {{ tag }}
      </a-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons-vue'
import type { Article } from '@/stores/articles'

interface Props {
  article: Article
}

const props = defineProps<Props>()

// 处理图片加载错误 - 隐藏损坏的图片
const handleImageError = (event: any) => {
  event.target.style.display = 'none'
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
</script>

<style scoped>
.article-content {
  padding: 20px 40px 40px;
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

.cover-image {
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

@media (max-width: 768px) {
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

  .cover-image {
    margin: 15px 0 20px;
  }
}
</style>
