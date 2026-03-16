<template>
  <div class="games-view">
    <div class="page-header">
      <InteractiveHoverButton text="返回" class="bg-[#f0f2f5] text-[#666]" @click="goBack" />
      <h1 class="page-title">前端小游戏</h1>
    </div>

    <div class="games-container">
      <div 
        class="game-card" 
        v-for="game in games" 
        :key="game.id"
        @click="playGame(game)"
      >
        <div class="game-image">
          <img :src="game.image" :alt="game.title">
          <div class="game-overlay">
            <span class="game-type">{{ game.type }}</span>
          </div>
        </div>
        <div class="game-content">
          <h2 class="game-title">{{ game.title }}</h2>
          <p class="game-description">{{ game.description }}</p>
          <div class="game-tags">
            <a-tag 
              v-for="(tag, i) in game.tags" 
              :key="i" 
              class="game-tag"
              color="blue"
            >
              {{ tag }}
            </a-tag>
          </div>
          <div class="game-actions">
            <a-button 
              type="primary" 
              size="small" 
              class="action-button play-button"
            >
              <i class="fas fa-play"></i>
              开始游戏
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏详情模态框 -->
    <a-modal
      v-model:open="gameModalVisible"
      :title="selectedGame?.title"
      width="100%"
      :style="{ maxWidth: '800px' }"
      @cancel="gameModalVisible = false"
      :footer="null"
    >
      <div class="game-detail" v-if="selectedGame">
        <div class="detail-image">
          <img :src="selectedGame.image" :alt="selectedGame.title">
        </div>
        <div class="detail-content">
          <p class="detail-description">{{ selectedGame.description }}</p>
          <div class="detail-tags">
            <a-tag 
              v-for="(tag, i) in selectedGame.tags" 
              :key="i" 
              class="detail-tag"
              color="blue"
            >
              {{ tag }}
            </a-tag>
          </div>
          <div class="detail-actions">
            <a-button 
              type="primary" 
              size="large" 
              class="detail-button"
              @click="startGame(selectedGame.link)"
            >
              <i class="fas fa-play"></i>
              开始游戏
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import InteractiveHoverButton from '@/components/button.vue'

interface Game {
  id: number
  title: string
  description: string
  image: string
  type: string
  tags: string[]
  link: string
}

const router = useRouter()

// 前端小游戏
const games: Game[] = [
  {
    id: 1,
    title: '贪吃蛇游戏',
    description: '使用Canvas API开发的经典贪吃蛇游戏，支持键盘和触摸控制，具有计分和难度递增功能。通过这个项目可以学习Canvas绘图、键盘事件处理和游戏循环等前端技术。',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    type: 'Canvas',
    tags: ['Canvas', '游戏', '交互', '动画'],
    link: 'javascript:void(0)'
  },
  {
    id: 2,
    title: '俄罗斯方块',
    description: '基于Vue实现的俄罗斯方块游戏，支持多种操作方式和难度选择，具有排行榜功能。通过这个项目可以学习Vue组件通信、状态管理和复杂逻辑处理等技术。',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    type: 'Vue',
    tags: ['Vue', '游戏', '动画', '状态管理'],
    link: 'javascript:void(0)'
  },
  {
    id: 3,
    title: '扫雷',
    description: '使用React开发的经典扫雷游戏，支持自定义难度和计时功能，界面简洁美观。通过这个项目可以学习React Hooks、组件设计和复杂状态处理等技术。',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    type: 'React',
    tags: ['React', '游戏', '逻辑', 'Hooks'],
    link: 'javascript:void(0)'
  },
  {
    id: 4,
    title: '2048小游戏',
    description: '使用原生JavaScript实现的2048数字合并游戏，支持手势滑动和键盘操作。通过这个项目可以学习原生JavaScript操作DOM、事件处理和移动端适配等技术。',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    type: 'JavaScript',
    tags: ['JavaScript', '游戏', '算法', '移动端'],
    link: 'javascript:void(0)'
  }
]

// 模态框相关
const gameModalVisible = ref(false)
const selectedGame = ref<Game | null>(null)

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 玩游戏
const playGame = (game: Game) => {
  selectedGame.value = game
  gameModalVisible.value = true
}

// 开始游戏
const startGame = (link: string) => {
  if (link && link !== 'javascript:void(0)') {
    window.open(link, '_blank')
  } else {
    message.info('游戏正在开发中，敬请期待！')
  }
}

onMounted(() => {
  // 尽快触发loaded事件，减少等待时间
  const event = new Event('loaded')
  window.dispatchEvent(event)
})
</script>

<style scoped>
.games-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
  padding: 16px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.back-button {
  background: #f0f2f5;
  border: none;
  border-radius: 8px;
  color: #666;
  transition: all 0.3s;
}

.back-button:hover {
  background: #e1e5e9;
  color: #333;
}

.games-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.game-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;
}

.game-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.game-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.game-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.game-card:hover .game-image img {
  transform: scale(1.05);
}

.game-overlay {
  position: absolute;
  top: 16px;
  right: 16px;
}

.game-type {
  background: rgba(109, 89, 219, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.game-content {
  padding: 24px;
}

.game-title {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.game-description {
  font-size: 15px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.game-tags {
  margin-bottom: 20px;
}

.game-tag {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 16px;
  margin-right: 8px;
  margin-bottom: 8px;
}

.game-actions {
  display: flex;
  justify-content: flex-end;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
}

.play-button {
  background-color: #6d59db !important;
  border-color: #6d59db !important;
}

/* 模态框样式 */
.game-detail {
  padding: 20px 0;
}

.detail-image {
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-description {
  font-size: 16px;
  color: #555;
  line-height: 1.7;
  margin-bottom: 24px;
}

.detail-tags {
  margin-bottom: 30px;
}

.detail-tag {
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 20px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.detail-actions {
  display: flex;
  justify-content: center;
}

.detail-button {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  padding: 0 32px;
  background-color: #6d59db !important;
  border-color: #6d59db !important;
}

@media (max-width: 768px) {
  .games-view {
    padding: 16px;
  }
  
  .page-header {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .games-container {
    grid-template-columns: 1fr;
  }
  
  .game-image {
    height: 200px;
  }
}
</style>