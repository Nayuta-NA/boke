<template>
  <footer class="bg-white border-t border-gray-200 pt-16 pb-8">
    <div class="container mx-auto px-4">
      <!-- 页脚内容网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <!-- 关于我 -->
        <div>
          <div class="flex items-center space-x-2 mb-6">
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-teal-300 flex items-center justify-center"
            >
              <span class="text-white font-bold text-xl">B</span>
            </div>
            <h3 class="text-xl font-bold text-gray-800">个人博客</h3>
          </div>
          <p class="text-gray-600 mb-6">
            分享前端开发经验、旅行见闻和生活随想，用简约的方式呈现有价值的内容。
          </p>
          <!-- 社交媒体 -->
          <div class="flex space-x-4">
            <a
              v-for="(social, index) in socialLinks"
              :key="index"
              :href="social.link"
              class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors duration-200"
              target="_blank"
            >
              <i :class="`fab ${social.icon}`"></i>
            </a>
          </div>
        </div>

        <!-- 快速链接 -->
        <div>
          <h4 class="text-lg font-bold text-gray-800 mb-6">快速链接</h4>
          <ul class="space-y-3">
            <li v-for="(link, index) in quickLinks" :key="index">
              <a
                :href="link.url"
                class="text-gray-600 hover:text-primary transition-colors duration-200"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- 文章分类 -->
        <div>
          <h4 class="text-lg font-bold text-gray-800 mb-6">文章分类</h4>
          <ul class="space-y-3">
            <li v-for="(category, index) in articleCategories" :key="index">
              <a
                :href="category.url"
                class="text-gray-600 hover:text-primary transition-colors duration-200"
              >
                {{ category.name }} ({{ category.count }})
              </a>
            </li>
          </ul>
        </div>

        <!-- 联系方式 -->
        <div>
          <h4 class="text-lg font-bold text-gray-800 mb-6">联系方式</h4>
          <ul class="space-y-4">
            <li class="flex items-start">
              <i class="fas fa-envelope text-primary mt-1 mr-3"></i>
              <span class="text-gray-600">{{ contact.email }}</span>
            </li>
            <li class="flex items-start">
              <i class="fas fa-phone text-primary mt-1 mr-3"></i>
              <span class="text-gray-600">{{ contact.phone }}</span>
            </li>
            <li class="flex items-start">
              <i class="fas fa-map-marker-alt text-primary mt-1 mr-3"></i>
              <span class="text-gray-600">{{ contact.address }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="border-t border-gray-200 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-500 text-sm mb-4 md:mb-0">© 2023 个人博客. 保留所有权利.</p>
          <div class="flex space-x-6">
            <a
              href="javascript:void(0)"
              class="text-gray-500 text-sm hover:text-primary transition-colors duration-200"
            >
              隐私政策
            </a>
            <a
              href="javascript:void(0)"
              class="text-gray-500 text-sm hover:text-primary transition-colors duration-200"
            >
              使用条款
            </a>
            <a
              href="javascript:void(0)"
              class="text-gray-500 text-sm hover:text-primary transition-colors duration-200"
            >
              Cookie政策
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 定义数据类型
interface SocialLink {
  icon: string
  link: string
}

interface QuickLink {
  name: string
  url: string
}

interface ArticleCategory {
  name: string
  count: number
  url: string
}

interface ContactInfo {
  email: string
  phone: string
  address: string
}

// 社交媒体数据
const socialLinks: SocialLink[] = [
  { icon: 'fa-github', link: 'javascript:void(0)' },
  { icon: 'fa-twitter', link: 'javascript:void(0)' },
  { icon: 'fa-linkedin', link: 'javascript:void(0)' },
  { icon: 'fa-instagram', link: 'javascript:void(0)' },
]

// 快速链接数据
const quickLinks: QuickLink[] = [
  { name: '首页', url: 'javascript:void(0)' },
  { name: '文章', url: 'javascript:void(0)' },
  { name: '旅游', url: 'javascript:void(0)' },
  { name: '随记', url: 'javascript:void(0)' },
  { name: '前端', url: 'javascript:void(0)' },
  { name: '关于我', url: 'javascript:void(0)' },
  { name: '联系方式', url: 'javascript:void(0)' },
]

// 文章分类数据
const articleCategories: ArticleCategory[] = [
  { name: '前端开发', count: 24, url: 'javascript:void(0)' },
  { name: '旅行体验', count: 18, url: 'javascript:void(0)' },
  { name: '生活随想', count: 32, url: 'javascript:void(0)' },
  { name: '技术教程', count: 15, url: 'javascript:void(0)' },
  { name: '项目分享', count: 9, url: 'javascript:void(0)' },
  { name: '读书心得', count: 12, url: 'javascript:void(0)' },
  { name: '工具推荐', count: 7, url: 'javascript:void(0)' },
]

// 联系方式数据
const contact: ContactInfo = {
  email: 'contact@example.com',
  phone: '+86 123 4567 8910',
  address: '北京市朝阳区某某街道123号',
}
</script>
