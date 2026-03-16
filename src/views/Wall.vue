<template>
  <div class="wall">
    <div
      style="
        font-size: 30px;
        font-weight: 800;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
      "
    >
      留言墙
      <div style="font-weight: 300; font-size: 24px; margin-top: 30px">
        很多事情值得记录，当然也值得回味。
      </div>
    </div>

    <div class="tabs flex mt-10 jus justify-center">
      <button :class="{ active: activeTab === '全部' }" @click="activeTab = '全部'">全部</button>
      <button :class="{ active: activeTab === '留言' }" @click="activeTab = '留言'">留言</button>
      <button :class="{ active: activeTab === '目标' }" @click="activeTab = '目标'">目标</button>
      <button :class="{ active: activeTab === '理想' }" @click="activeTab = '理想'">理想</button>
      <button :class="{ active: activeTab === '过去' }" @click="activeTab = '过去'">过去</button>
      <button :class="{ active: activeTab === '将来' }" @click="activeTab = '将来'">将来</button>
      <button :class="{ active: activeTab === '爱情' }" @click="activeTab = '爱情'">爱情</button>
      <button :class="{ active: activeTab === '亲情' }" @click="activeTab = '亲情'">亲情</button>
      <button :class="{ active: activeTab === '友情' }" @click="activeTab = '友情'">友情</button>
      <button :class="{ active: activeTab === '秘密' }" @click="activeTab = '秘密'">秘密</button>
      <button :class="{ active: activeTab === '信条' }" @click="activeTab = '信条'">信条</button>
      <button :class="{ active: activeTab === '无题' }" @click="activeTab = '无题'">无题</button>
    </div>
  </div>
  <div v-if="loading" class="loading">加载中...</div>
  <div v-else-if="error" class="error">{{ error }}</div>
  <div v-else class="messages mr-5% ml-5%" ref="messagesContainerRef">
    <div
      v-for="message in displayedMessages"
      :key="message.id"
      :class="['message', message.color || 'default']"
    >
      <div class="message-header">
        <span style="font-size: 14px; color: #000">{{
          formatDate(message.createdAt || message.date)
        }}</span>
        <span style="font-size: 14px; color: #000">{{ message.type || '留言' }}</span>
      </div>
      <div class="message-content">
        {{ message.body || message.content }}
      </div>
      <div class="message-footer" style="font-weight: 800; display: flex; justify-content: end">
        <span>{{ message.name || message.author || '匿名' }}</span>
      </div>
    </div>
    <div v-if="loadingMore" class="loading-more">加载更多...</div>
  </div>

  <!-- 右下角圆形按钮 - 在抽屉打开时隐藏 -->
  <div v-show="!showDrawer" class="circle-button" @click="showDrawer = true">
    <PlusOutlined />
  </div>

  <!-- Ant Design 右抽屉 -->
  <a-drawer
    v-model:open="showDrawer"
    title="添加留言"
    placement="right"
    size="large"
    :body-style="{ paddingBottom: '80px' }"
  >
    <template #footer>
      <div class="drawer-footer">
        <a-button @click="closeDrawer">取消</a-button>
        <a-button type="primary" @click="submitMessage" :loading="submitting">提交</a-button>
      </div>
    </template>

    <div class="form-container">
      <a-form :model="newMessageForm" layout="vertical">
        <a-form-item label="背景颜色">
          <div class="color-options">
            <div
              v-for="color in colorOptions"
              :key="color.value"
              class="color-option"
              :class="{ selected: newMessageForm.color === color.value }"
              :style="{ backgroundColor: color.bgColor }"
              @click="newMessageForm.color = color.value"
            >
              {{ color.label }}
            </div>
          </div>
        </a-form-item>
        <a-form-item label="留言类型">
          <a-select v-model:value="newMessageForm.type" placeholder="选择留言类型">
            <a-select-option value="留言">留言</a-select-option>
            <a-select-option value="目标">目标</a-select-option>
            <a-select-option value="理想">理想</a-select-option>
            <a-select-option value="过去">过去</a-select-option>
            <a-select-option value="将来">将来</a-select-option>
            <a-select-option value="爱情">爱情</a-select-option>
            <a-select-option value="亲情">亲情</a-select-option>
            <a-select-option value="友情">友情</a-select-option>
            <a-select-option value="秘密">秘密</a-select-option>
            <a-select-option value="信条">信条</a-select-option>
            <a-select-option value="无题">无题</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="昵称（可选）">
          <a-input v-model:value="newMessageForm.name" placeholder="请输入您的昵称" />
        </a-form-item>

        <a-form-item label="留言内容" required>
          <a-textarea
            v-model:value="newMessageForm.body"
            placeholder="请输入您的留言内容..."
            :rows="6"
            :maxlength="500"
            show-word-limit
          />
        </a-form-item>
      </a-form>

      <!-- 免责声明 -->
      <div class="disclaimer mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 class="font-bold text-base mb-2">免责声明</h3>
        <p class="text-xs leading-relaxed">
          请不要利用此平台服务制作、上传、下载、复制、发布、传播或者转载如下内容：
        </p>
        <ol class="list-decimal list-inside text-xs mt-2 space-y-1">
          <li>反对宪法所确定的基本原则的；</li>
          <li>危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</li>
          <li>损害国家荣誉和利益的；</li>
          <li>煽动民族仇恨、民族歧视，破坏民族团结的；</li>
          <li>破坏国家宗教政策，宣扬邪教和封建迷信的；</li>
          <li>散布谣言，扰乱社会秩序，破坏社会稳定的；</li>
          <li>散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</li>
          <li>侮辱或者诽谤他人，侵害他人合法权益的；</li>
          <li>含有法律、行政法规禁止的其他内容的信息。</li>
        </ol>
      </div>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { reviewAPI } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { message } from 'ant-design-vue'
import { Drawer, Form, Input, Select, Button, Textarea, SelectOption } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

interface Message {
  id: string
  createdAt?: string
  date?: string
  type?: string
  body?: string
  content?: string
  likes?: number
  comments?: number
  name?: string
  author?: string
  color?: string
}

const messages = ref<Message[]>([])
const displayedMessages = ref<Message[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const activeTab = ref('全部')
const loadingMore = ref(false)
const allLoaded = ref(false)
const pageSize = 15
const messagesContainerRef = ref<HTMLElement | null>(null)

// 添加留言相关的响应式数据
const showDrawer = ref(false)
const submitting = ref(false)
const authStore = useAuthStore()

// 新增留言表单数据
const newMessageForm = ref({
  type: '留言',
  name: authStore.user?.username || '',
  body: '',
  color: 'default',
})

// 颜色选项 - 与后端API规范保持一致
const colorOptions = [
  { value: 'default', label: '默认', bgColor: '#f0f0f0' },
  { value: 'green', label: '绿色', bgColor: 'rgba(168, 237, 138, 0.3)' },
  { value: 'pink', label: '粉色', bgColor: 'rgba(252, 175, 162, 0.3)' },
  { value: 'blue', label: '蓝色', bgColor: 'rgba(146, 230, 245, 0.3)' },
  { value: 'light-blue', label: '黄色', bgColor: 'rgba(255, 227, 148, 0.3)' },
]

const filteredMessages = computed(() => {
  if (activeTab.value === '全部') {
    return messages.value
  }
  return messages.value.filter((message) => (message.type || '留言') === activeTab.value)
})

const formatDate = (dateString?: string) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  // 如果是今年，则不显示年份
  const now = new Date()
  if (year === now.getFullYear()) {
    return `${month}/${day} ${hours}:${minutes}`
  }
  return `${year}/${month}/${day} ${hours}:${minutes}`
}

// 提交留言
const submitMessage = async () => {
  if (!newMessageForm.value.body.trim()) {
    message.warning('留言内容不能为空')
    return
  }

  submitting.value = true

  try {
    // 准备提交的数据，确保颜色值符合后端规范
    const submitData = {
      ...newMessageForm.value,
      // 如果选择了'default'颜色，将其转换为后端可接受的格式或保留'default'
      color: newMessageForm.value.color || 'default',
      createdAt: new Date().toISOString(),
    }

    // 发送请求到后端API
    const response = await reviewAPI.create(submitData)

    // 添加新留言到列表的开头
    messages.value.unshift(response.data)

    // 更新显示的消息
    updateDisplayedMessages()

    // 显示成功消息
    message.success('留言添加成功！')

    // 清空表单
    newMessageForm.value = {
      type: '留言',
      name: authStore.user?.username || '',
      body: '',
      color: 'default',
    }

    // 关闭抽屉
    showDrawer.value = false
  } catch (err) {
    console.error('Failed to submit message:', err)
    message.error('留言提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 关闭抽屉
const closeDrawer = () => {
  showDrawer.value = false

  // 清空表单
  newMessageForm.value = {
    type: '留言',
    name: authStore.user?.username || '',
    body: '',
    color: 'default',
  }
}

onMounted(async () => {
  try {
    const response = await reviewAPI.getAll()
    messages.value = response.data.map((msg: any) => ({
      ...msg,
      // 直接使用后端返回的颜色，不再随机生成
      color: msg.color || 'default',
    }))

    // 初始化显示前12条数据
    displayedMessages.value = [...filteredMessages.value].slice(0, pageSize)
    allLoaded.value = filteredMessages.value.length <= pageSize
  } catch (err) {
    console.error('Failed to fetch messages:', err)
    error.value = '加载留言数据失败'
  } finally {
    loading.value = false
  }
})

// 监听标签变化，更新显示的消息
const updateDisplayedMessages = () => {
  displayedMessages.value = [...filteredMessages.value].slice(0, pageSize)
  allLoaded.value = filteredMessages.value.length <= pageSize
}

// 监听activeTab的变化
watch(activeTab, updateDisplayedMessages)

// 滚动加载更多数据
const handleScroll = () => {
  if (loadingMore.value || allLoaded.value) return

  // 检测是否滚动到底部
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
    loadMoreMessages()
  }
}

const loadMoreMessages = async () => {
  if (loadingMore.value || allLoaded.value) return

  loadingMore.value = true

  try {
    // 计算当前已显示的数量
    const currentLength = displayedMessages.value.length
    const remainingMessages = filteredMessages.value.slice(currentLength, currentLength + pageSize)

    if (remainingMessages.length === 0) {
      allLoaded.value = true
    } else {
      // 模拟加载延迟
      await new Promise((resolve) => setTimeout(resolve, 500))
      displayedMessages.value.push(...remainingMessages)

      if (displayedMessages.value.length >= filteredMessages.value.length) {
        allLoaded.value = true
      }
    }
  } catch (err) {
    console.error('Error loading more messages:', err)
  } finally {
    loadingMore.value = false
  }
}

// 监听页面滚动事件
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 返回顶部功能
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// 导入onUnmounted
import { onUnmounted } from 'vue'
</script>

<style scoped>
.wall {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.tabs button {
  margin-right: 10px;
  padding: 5px 10px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
}

.tabs button.active {
  background-color: #007bff;
  color: white;
}

.messages {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.message {
  padding: 20px;
  border-radius: 8px;
  height: 25vh; /* 设置每个卡片高度为25vh */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.message.green {
  background: rgba(168, 237, 138, 0.3);
}

.message.pink {
  background: rgba(252, 175, 162, 0.3);
}

.message.blue {
  background: rgba(146, 230, 245, 0.3);
}

.message.light-blue {
  background: rgba(255, 227, 148, 0.3);
}

.message.default {
  background-color: #f0f0f0;
}

.message-header,
.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-content {
  flex-grow: 1;
  margin: 15px 0;
  overflow: hidden;
  font-size: 18px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.loading-more {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  grid-column: 1 / -1; /* 让加载提示横跨整个网格 */
}

/* 右下角圆形按钮样式 */
.circle-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #000;
  cursor: pointer;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.circle-button:hover {
  background-color: #333;
  transform: scale(1.1);
  transition: all 0.3s ease;
}

/* 抽屉底部按钮样式 */
.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 颜色选项样式 */
.color-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid transparent;
  font-size: 12px;
  color: #333;
}

.color-option.selected {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
</style>
