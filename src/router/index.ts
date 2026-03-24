import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import ArticlesView from '../views/ArticlesView.vue'
import TravelView from '../views/TravelView.vue'
import NotesView from '../views/NotesView.vue'
import NotesDetailView from '../views/NotesDetailView.vue'
import FrontendView from '../views/FrontendView.vue'
import ProvinceDetailView from '../views/ProvinceDetailView.vue'
import ProjectsView from '../views/frontend/ProjectsView.vue'
import GamesView from '../views/frontend/GamesView.vue'
import ResourcesView from '../views/frontend/ResourcesView.vue'
import BooksView from '../views/frontend/BooksView.vue'
import ArticlesDetailView from '../views/ArticlesDetailView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import Wall from '../views/Wall.vue'
import GlobalSettingsView from '../views/GlobalSettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { transition: 'slide', requiresAuth: true }
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticlesView,
      meta: { transition: 'slide', requiresAuth: true }
    },
    {
      path: '/articles/:id',
      name: 'articles-detail',
      component: ArticlesDetailView,
      props: true,
      meta: { transition: 'slide', requiresAuth: true }
    },
    {
      path: '/travel',
      name: 'travel',
      component: TravelView,
      meta: { transition: 'slide', requiresAuth: true }
    },
    {
      path: '/travel/:province',
      name: 'province-detail',
      component: ProvinceDetailView,
      props: true,
      meta: { transition: 'slide', requiresAuth: true }
    },
    {
      path: '/notes',
      name: 'notes',
      component: NotesView,
      meta: { transition: 'slide', requiresAuth: true }
    },
    {
      path: '/notes/:id',
      name: 'notes-detail',
      component: NotesDetailView,
      props: true,
      meta: { transition: 'slide', requiresAuth: true }
    },
    {
      path: '/frontend',
      name: 'frontend',
      component: FrontendView,
      meta: { transition: 'slide', requiresAuth: true }
    },
    {
      path: '/frontend/projects',
      name: 'projects',
      component: ProjectsView,
      meta: { transition: 'slide', requiresAuth: true }
    },
    {
      path: '/frontend/games',
      name: 'games',
      component: GamesView,
      meta: { transition: 'slide', requiresAuth: true }
    },
    {
      path: '/frontend/resources',
      name: 'resources',
      component: ResourcesView,
      meta: { transition: 'slide', requiresAuth: true }
    },
    {
      path: '/frontend/books',
      name: 'books',
      component: BooksView,
      meta: { transition: 'slide', requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { transition: 'slide', requiresAuth: true }
    },
    {
      path: '/wall',
      name: 'wall',
      component: Wall,
      meta: { transition: 'slide', standalone: true } // 添加 standalone 属性以标识为独立页面
    },
    {
      path: '/settings/global',
      name: 'global-settings',
      component: GlobalSettingsView,
      meta: { transition: 'slide', standalone: true, requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { transition: 'slide' }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { transition: 'slide' }
    }
  ]
})

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  // 初始化认证状态
  const authStore = useAuthStore()
  authStore.initializeAuth()
  
  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // 如果路由需要认证但用户未登录，则重定向到登录页
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    // 如果已登录用户尝试访问登录或注册页面，则重定向到首页
    next('/')
  } else {
    // 其他情况允许访问
    next()
  }
})

export default router