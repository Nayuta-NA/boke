<template>
  <a-layout>
    <a-layout-header :class="['header', { hidden: isHidden }]">
      <div class="navigation">
        <div class="left-nav">
          <router-link to="/" class="jianghu">时序碎影札</router-link>
        </div>

        <div class="centerBox">
          <router-link to="/" exact-active-class="router-link-active">首页</router-link>
          <router-link to="/articles" exact-active-class="router-link-active">文章</router-link>
          <router-link to="/travel" exact-active-class="router-link-active">旅游</router-link>
          <router-link to="/notes" exact-active-class="router-link-active">随记</router-link>
          <router-link to="/frontend" exact-active-class="router-link-active">前端</router-link>
          <!-- 个人链接仅对登录用户可见 -->
          <router-link 
            v-if="authStore.isAuthenticated" 
            to="/profile" 
            exact-active-class="router-link-active"
          >
            个人
          </router-link>
        </div>

        <div class="right-nav">
          <!-- 已登录显示用户菜单，未登录显示登录/注册按钮 -->
          <div v-if="authStore.isAuthenticated" class="icon-placeholders">
            <a-dropdown>
              <a class="ant-dropdown-link user-dropdown" @click.prevent>
                {{ authStore.user?.name }}
                <DownOutlined />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <router-link to="/profile">个人中心</router-link>
                  </a-menu-item>
                  <a-menu-item @click="handleLogout"> 登出 </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          
          <!-- 未登录时显示登录/注册按钮 -->
          <div v-else class="auth-buttons">
            <router-link to="/login" class="auth-btn login-btn">登录</router-link>
            <router-link to="/register" class="auth-btn register-btn">注册</router-link>
          </div>
        </div>
      </div>
    </a-layout-header>
    
    <!-- 主内容区域 -->
    <slot />
  </a-layout>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useGlobalSettingsStore } from '@/stores/globalSettings'

const authStore = useAuthStore()
const router = useRouter()
const globalSettingsStore = useGlobalSettingsStore()

// 从 store 获取导航栏配置
const navbarConfig = computed(() => globalSettingsStore.navbarConfig)

// 监听导航栏颜色变化，更新 CSS 变量
watch(
  () => navbarConfig.value.backgroundColor,
  (newColor) => {
    // 不再需要设置 CSS 变量，由 App.vue 统一管理
  },
  { immediate: true }
)

// 控制导航栏显示/隐藏的状态
const isHidden = ref(false)
let lastScrollTop = 0
const hideThreshold = 10 // 滚动超过10px开始隐藏

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  // 如果滚动距离超过阈值
  if (scrollTop > lastScrollTop && scrollTop > hideThreshold) {
    // 向下滚动且滚动距离大于阈值，隐藏导航栏
    isHidden.value = true
  } else {
    // 向上滚动或在顶部，显示导航栏
    isHidden.value = false
  }

  lastScrollTop = scrollTop
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleLogout = () => {
  authStore.logout()
  message.success('登出成功')
  router.push('/login')
}
</script>

<style scoped>
.header {
  padding: 0 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid #eaeaea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: 64px;
  transition: transform 0.3s ease-in-out;
  background-color: var(--navbar-color, #ffffff);
}

.header.hidden {
  transform: translateY(-100%);
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  height: 64px; /* 明确设置高度 */
}

.centerBox {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  align-items: center;
  height: 64px; /* 明确设置高度 */
}

.right-nav {
  display: flex;
  align-items: center;
  gap: 1rem; /* 添加间距，避免元素重叠 */
}

.icon-placeholders {
  display: flex;
  gap: 1rem; /* 为图标之间添加间距 */
  align-items: center;
}

.jianghu {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
}

.navigation a {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  opacity: 0.9;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-sizing: border-box;
  height: 40px; /* 固定高度 */
  display: flex;
  align-items: center;
  margin: 12px 0; /* 上下留白，避免紧贴容器边缘 */
}

.navigation a:hover {
  background-color: rgba(233, 236, 239, 0.7);
  opacity: 1;
}

.navigation .router-link-active {
  background-color: var(--primary-color);
  color: white;
  opacity: 1;
  padding: 0.25rem 0.8rem;
  border-radius: 16px;
  box-sizing: border-box;
  height: 40px; /* 固定高度 */
  display: flex;
  align-items: center;
  margin: 12px 0; /* 上下留白，避免紧贴容器边缘 */
}

.icon {
  font-size: 1.2rem;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon:hover {
  background-color: rgba(233, 236, 239, 0.7);
}

.user-dropdown {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 40px;
  color: inherit;
  text-decoration: none;
}

.user-dropdown:hover {
  background-color: rgba(233, 236, 239, 0.7);
}

/* 未登录时的认证按钮 */
.auth-buttons {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.auth-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  font-size: 14px;
  white-space: nowrap;
}

.login-btn {
  background-color: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.login-btn:hover {
  background-color: var(--primary-color);
  color: white;
}

.register-btn {
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
  color: white;
}

.register-btn:hover {
  background-color: var(--primary-hover-color, var(--primary-color));
  opacity: 0.9;
  color: white;
}

@media (max-width: 768px) {
  .navigation {
    flex-wrap: wrap;
  }

  .centerBox {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
    flex-wrap: wrap;
  }

  .centerBox a {
    padding: 0.3rem 0.5rem;
    font-size: 0.9rem;
  }

  .right-nav {
    margin-left: auto;
  }

  .user-dropdown {
    padding: 0.3rem 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
