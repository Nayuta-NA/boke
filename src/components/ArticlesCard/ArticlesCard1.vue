<template>
  <div class="article-card-wrapper" @click="goToDetail(article.id)">
    <div class="modern-card">
      <!-- 图片区域 - 占据主要视觉 -->
      <div class="card-image">
        <img
          :src="
            article.cover ||
            'https://design.gemcoder.com/staticResource/echoAiSystemImages/default-article-cover.jpg'
          "
          :alt="article.title"
          @error="onImageError"
        />
        <!-- 分类标签 - 浮动在图片上 -->
        <div class="category-tag">
          {{ article.category }}
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="card-content">
        <!-- 标题 -->
        <h3 class="article-title">{{ article.title }}</h3>

        <!-- 摘要 -->
        <p class="article-excerpt">{{ article.excerpt }}</p>

        <!-- 底部信息 -->
        <div class="card-footer">
          <div class="meta-left">
            <span class="date-icon">📅</span>
            <span class="publish-date">{{ article.date }}</span>
          </div>
          <div class="meta-right">
            <span class="read-time">⏱ {{ article.readTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  article: any
}>()

const router = useRouter()

const goToDetail = (id: number) => {
  router.push(`/articles/${id}`)
}

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>

<style scoped>
.article-card-wrapper {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-card-wrapper:hover {
  transform: translateY(-8px);
}

.modern-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.article-card-wrapper:hover .modern-card {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #40e0d0;
}

/* 图片区域 */
.card-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-card-wrapper:hover .card-image img {
  transform: scale(1.08);
}

/* 分类标签 */
.category-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #40e0d0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 内容区域 */
.card-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 标题 */
.article-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.5;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  transition: color 0.3s;
}

.article-card-wrapper:hover .article-title {
  color: #40e0d0;
}

/* 摘要 */
.article-excerpt {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 16px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  flex: 1;
}

/* 底部信息 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.meta-left,
.meta-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.date-icon {
  font-size: 14px;
}

.publish-date {
  font-size: 13px;
  color: #9ca3af;
  font-weight: 500;
}

.read-time {
  font-size: 13px;
  color: #9ca3af;
  padding: 4px 10px;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.3s;
}

.article-card-wrapper:hover .read-time {
  background: #40e0d0;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-image {
    height: 180px;
  }

  .card-content {
    padding: 16px;
  }

  .article-title {
    font-size: 16px;
  }

  .article-excerpt {
    font-size: 13px;
  }
}
</style>
