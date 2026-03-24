<template>
  <div class="leave-message">
    <h2 class="title">留言墙</h2>
    <pl :reviews="reviews" />
    <button @click="goToWall">进入留言墙</button> <!-- 添加跳转按钮 -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import pl from '../pl/index.vue'
import { useRouter } from 'vue-router' // 导入 vue-router

const router = useRouter() // 初始化 router

interface Review {
  name: string
  body: string
  createdAt: string
}

const reviews = ref<Review[]>([])

onMounted(() => {
  fetchReviews()
})

const fetchReviews = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/reviews')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    reviews.value = data
  } catch (error) {
    console.error('获取留言数据失败:', error)
    reviews.value = [
      {
        name: '访客',
        body: '这是一个精选留言示例。',
        createdAt: new Date().toISOString(),
      },
      {
        name: '用户',
        body: '感谢这个网站，很喜欢！',
        createdAt: new Date().toISOString(),
      },
    ]
  }
}

// 添加跳转方法
const goToWall = () => {
  router.push('/wall') // 跳转到留言墙页面
}
</script>

<style scoped>
.leave-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
}

button:hover {
  background-color: var(--primary-color-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 224, 208, 0.3);
}
</style>