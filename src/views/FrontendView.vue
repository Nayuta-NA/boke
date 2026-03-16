<template>
  <div class="frontend-view">
    <div class="header-section">
      <h1 class="page-title">前端技术</h1>
      <p class="page-description">分享前端开发经验、技术教程和项目展示</p>
    </div>

    <div class="content-container">
      <!-- 技术专长部分 -->
      <section class="section-card">
        <h2 class="section-title">
          <i class="fas fa-star"></i>
          技术专长
        </h2>
        <div class="skills-grid">
          <div class="skill-category" v-for="(category, index) in skillCategories" :key="index">
            <h3 class="category-title">{{ category.name }}</h3>
            <div class="skills-list">
              <a-tag
                v-for="(skill, i) in category.skills"
                :key="i"
                class="skill-tag"
                :color="getSkillColor(skill)"
              >
                {{ skill }}
              </a-tag>
            </div>
          </div>
        </div>
      </section>

      <!-- 功能导航部分 -->
      <section class="section-card">
        <h2 class="section-title">
          <i class="fas fa-th-large"></i>
          更多
        </h2>
        <div class="navigation-grid">
          <div
            class="nav-card"
            v-for="item in navigationItems"
            :key="item.id"
            @click="goToPage(item.path)"
          >
            <div class="nav-icon" :class="item.iconClass">
              <i :class="item.icon"></i>
            </div>
            <div class="nav-content">
              <h3 class="nav-title">{{ item.title }}</h3>
              <p class="nav-description">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useFrontendStore } from '@/stores/frontend'
import { storeToRefs } from 'pinia'

interface SkillCategory {
  name: string
  skills: string[]
}

interface NavigationItem {
  id: number
  title: string
  description: string
  icon: string
  iconClass: string
  path: string
}

// 技能分类
const skillCategories: SkillCategory[] = [
  {
    name: '前端框架',
    skills: ['Vue.js', 'React'],
  },
  {
    name: '构建工具',
    skills: ['Vite', 'Webpack'],
  },
  {
    name: '状态管理',
    skills: ['Vuex', 'Pinia', 'Redux'],
  },
  {
    name: 'UI框架',
    skills: ['Ant Design', 'Element Plus', 'Tailwind CSS'],
  },
  {
    name: '语言基础',
    skills: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
  },
]

// 导航项
const navigationItems: NavigationItem[] = [
  {
    id: 1,
    title: '项目展示',
    description: '查看我的前端项目作品集，包含完整的项目介绍和技术细节',
    icon: 'fas fa-laptop-code',
    iconClass: 'projects-icon',
    path: '/frontend/projects',
  },

  {
    id: 3,
    title: '学习资源',
    description: '整理的优质前端学习资源，包括文档、教程和社区',
    icon: 'fas fa-book',
    iconClass: 'resources-icon',
    path: '/frontend/resources',
  },
  {
    id: 4,
    title: '书本推荐',
    description: '推荐的前端相关书籍，帮助系统学习前端知识',
    icon: 'fas fa-book-open',
    iconClass: 'books-icon',
    path: '/frontend/books',
  },
]

const frontendStore = useFrontendStore()

// 使用store中的数据
const projects = frontendStore.getDetailProjects()

// 获取技能标签颜色
const getSkillColor = (skill: string) => {
  const colors = ['blue', 'green', 'purple', 'orange', 'cyan', 'magenta']
  const index = skill.charCodeAt(0) % colors.length
  return colors[index]
}

// 跳转到指定页面
const router = useRouter() // 添加这行以定义 router
const goToPage = (path: string) => {
  router.push(path)
}

// 移除了 onMounted 钩子中关于 isLoading 的逻辑，因为不再需要模拟加载
onMounted(() => {
  // 尽快触发loaded事件，减少等待时间
  const event = new Event('loaded')
  window.dispatchEvent(event)
})
</script>

<style scoped>
.frontend-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.page-description {
  font-size: 18px;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 30px;
  transition: all 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 技能部分样式 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.skill-category {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  font-size: 14px;
  padding: 6px 14px;
  border-radius: 20px;
}

/* 导航部分样式 */
.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.nav-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-card:hover {
  background: #eef2f5;
  transform: translateY(-4px);
}

.nav-icon {
  font-size: 28px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.projects-icon {
  color: #40e0d0;
  background: rgba(64, 224, 208, 0.1);
}

.games-icon {
  color: #6d59db;
  background: rgba(109, 89, 219, 0.1);
}

.resources-icon {
  color: #ff9800;
  background: rgba(255, 152, 0, 0.1);
}

.books-icon {
  color: #e91e63;
  background: rgba(233, 30, 99, 0.1);
}

.nav-content {
  flex: 1;
}

.nav-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.nav-description {
  font-size: 15px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .frontend-view {
    padding: 16px;
  }

  .header-section {
    padding: 24px 16px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-description {
    font-size: 16px;
  }

  .section-card {
    padding: 20px;
  }

  .section-title {
    font-size: 22px;
  }

  .skills-grid,
  .navigation-grid {
    grid-template-columns: 1fr;
  }

  .nav-card {
    padding: 20px;
  }

  .nav-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }

  .nav-title {
    font-size: 18px;
  }

  .nav-description {
    font-size: 14px;
  }
}
</style>
