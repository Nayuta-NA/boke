import './assets/main.css'
import 'uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 导入 Ant Design Vue 及其样式
import Antd, { message } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'
import router from './router'

// 配置全局 message 默认持续时间为 1 秒
message.config({
  duration: 1,
  top: '8px',
  getContainer: () => document.body
})

// 创建应用实例
const app = createApp(App)

// 使用 Ant Design Vue
app.use(Antd)

// 使用 Pinia 和 Router
const pinia = createPinia()
app.use(pinia)
app.use(router)

// 初始化认证状态（在应用挂载前完成）
import { useAuthStore } from './stores/auth'

// 等待认证初始化完成后再挂载应用
useAuthStore().initializeAuth().finally(() => {
  app.mount('#app')
})