<template>
  <div
    class="article flex bg-#ffffff rounded-8px shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    style="height: 180px;"
    @click="goToDetail(article.id)"
  >
    <!-- 图片区域 -->
    <div 
      v-if="article.cover"
      class="w-160px h-160px rounded-8px overflow-hidden m-10px flex items-center justify-center group"
      :style="{
        backgroundColor: '#4b5563'
      }"
    >
      <img 
        :src="article.cover" 
        :alt="article.title" 
        class="w-full h-full object-cover"
        @error="onImageError"
      >
    </div>
    
    <!-- 无图片时的默认占位符 -->
    <div 
      v-else
      class="w-160px h-160px rounded-8px overflow-hidden m-10px flex items-center justify-center group"
      :style="{
        backgroundColor: '#4b5563'
      }"
    >
      <span class="text-4xl font-bold text-white text-center px-2">
        {{ getDisplayText(article.title) }}
      </span>
    </div>
    
    <div class="text-box flex flex-col w-60% ml-10px">
      <div
        class="title text-20px font-bold mb-8px mt-10px transition-all duration-300 hover:text-teal-500"
      >{{ article.title }}</div>
      <div class="excerpt text-16px text-gray-500 line-clamp-2">{{ article.excerpt }}</div>
      <div class="data-time text-14px text-gray-400 mt-8px">发布时间：{{ article.date }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  cover?: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  commentCount: number;
}

const props = defineProps<{
  article: Article;
}>();

const router = useRouter()

const goToDetail = (id: number) => {
  router.push(`/articles/${id}`)
}

// 处理图片加载失败
const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  // 隐藏图片元素
  target.style.display = 'none';
};

// 获取要显示的文本（限制为10个字符）
const getDisplayText = (title: string) => {
  if (!title) return 'A';
  // 限制标题长度为10个字符
  return title.trim().substring(0, 10);
};
</script>