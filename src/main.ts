import './assets/main.css'
import 'uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 导入 Ant Design Vue 及其样式
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'
import router from './router'

// 创建应用实例
const app = createApp(App)

// 使用 Ant Design Vue
app.use(Antd)

// 使用 Pinia 和 Router
app.use(createPinia())
app.use(router)

// 初始化认证状态（确保在挂载前完成）
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')