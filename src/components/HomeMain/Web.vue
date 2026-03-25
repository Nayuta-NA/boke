<template>
  <div style="z-index: 2; position: relative">
    <!-- 传递标题、介绍，通过 v-slot:main 传递前端技术内容 -->
    <HomeMainBOX
      title="项目技术"
      introduce="设计及开发项目，不限于开发完成的项目"
      height="auto"
      :more-path="morePath"
    >
      <template v-slot:main>
        <section class="py-16" style="background-color: var(--navbar-color)">
          <div class="container mx-auto px-4">
            <!-- 标题栏（保持原样式逻辑） -->

            <!-- 内容区：技术栈 + 项目展示 -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- 技术栈卡片 -->
              <div
                class="rounded-xl shadow-sm p-6 lg:col-span-1"
                style="background-color: var(--app-background)"
              >
                <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center">
                  <i class="fas fa-code text-primary mr-2"></i>
                  技术栈
                </h3>
                <div class="space-y-6">
                  <div v-for="(category, index) in techCategories" :key="index">
                    <h4 class="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
                      {{ category.name }}
                    </h4>
                    <div class="flex flex-wrap gap-3">
                      <span
                        v-for="(item, i) in category.items"
                        :key="i"
                        class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {{ item }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 项目展示 -->
              <div class="lg:col-span-2 space-y-6">
                <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center">
                  <i class="fas fa-project-diagram text-primary mr-2"></i>
                  项目展示
                </h3>
                <div
                  v-for="project in projects"
                  :key="project.id"
                  class="rounded-xl shadow-sm overflow-hidden group cursor-pointer"
                  style="background-color: var(--app-background)"
                  @click="goToProjectDetail(project)"
                >
                  <div class="md:flex">
                    <!-- 项目图片 -->
                    <div class="md:w-1/3 relative h-48 md:h-auto">
                      <img
                        :src="project.cover"
                        :alt="project.title"
                        class="w-full h-full object-cover"
                      />
                      <span
                        class="absolute top-4 left-4 px-2 py-1 bg-primary/90 text-white text-xs font-medium rounded"
                      >
                        {{ project.framework }}
                      </span>
                    </div>
                    <!-- 项目信息 -->
                    <div class="p-6 md:w-2/3">
                      <h4
                        class="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors duration-200"
                      >
                        {{ project.title }}
                      </h4>
                      <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ project.desc }}</p>
                      <!-- 技术标签 -->
                      <div class="flex flex-wrap gap-2 mb-4">
                        <span
                          v-for="(tag, i) in project.tags"
                          :key="i"
                          class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {{ tag }}
                        </span>
                      </div>
                      <!-- 操作链接 -->
                      <div class="flex items-center justify-between">
                        <span
                          class="text-primary text-sm font-medium hover:text-primary/80 transition-colors duration-200"
                        >
                          查看详情
                        </span>
                        <div class="flex space-x-3">
                          <a
                            :href="project.github"
                            class="text-gray-400 hover:text-primary transition-colors duration-200"
                            target="_blank"
                            @click.stop
                          >
                            <i class="fab fa-github"></i>
                          </a>
                          <a
                            :href="project.demo"
                            class="text-gray-400 hover:text-primary transition-colors duration-200"
                            target="_blank"
                            @click.stop
                          >
                            <i class="fas fa-external-link-alt"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </HomeMainBOX>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import HomeMainBOX from '@/components/HomeMainBOX.vue'
import { useFrontendStore } from '@/stores/frontend'
import { storeToRefs } from 'pinia'

// 定义技术栈分类类型
interface TechCategory {
  name: string
  items: string[]
}

// 定义项目类型
interface Project {
  id: number
  title: string
  cover: string
  framework: string
  desc: string
  tags: string[]
  link: string
  github: string
  demo: string
}

const frontendStore = useFrontendStore()
const { techCategories, projects } = storeToRefs(frontendStore)

// 使用store中的数据
const techCategoriesData = frontendStore.getHomeTechCategories()
const projectsData = frontendStore.getHomeProjects()

const morePath = '/frontend'
const router = useRouter()

// 跳转到项目详情页
const goToProjectDetail = (project: Project) => {
  // 如果项目有特定链接，则跳转到该链接
  if (project.link && project.link !== 'javascript:void(0)') {
    window.open(project.link, '_blank')
  } else {
    // 否则跳转到前端项目页面
    router.push('/frontend/projects')
  }
}
</script>
