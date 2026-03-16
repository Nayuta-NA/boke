<template>
  <div class="notes-detail-container">
    <!-- 主要内容区域 -->
    <div class="detail-main" v-if="currentEntry">
      <div class="content-wrapper">
        <!-- 随记卡片 -->
        <div class="diary-card">
          <!-- 返回按钮 -->
          <div class="back-section">
            <a-button @click="goBack" class="back-button" size="large">
              <template #icon>
                <ArrowLeftOutlined />
              </template>
              返回随记列表
            </a-button>
          </div>

          <!-- 随记内容 -->
          <div class="diary-content">
            <div class="content-header">
              <h1 class="diary-title">
                {{
                  currentEntry.content.length > 50
                    ? currentEntry.content.substring(0, 50) + '...'
                    : currentEntry.content
                }}
              </h1>
              <div class="diary-meta">
                <div class="meta-info">
                  <span class="diary-date">
                    <CalendarOutlined />
                    {{ formatDateTime(currentEntry.date, currentEntry.time) }}
                  </span>
                  <a-tag
                    :color="getMoodColor(currentEntry.mood)"
                    v-if="currentEntry.mood"
                    class="mood-tag"
                  >
                    {{ currentEntry.mood }}
                  </a-tag>
                </div>
                <div class="weather-info" :class="getWeatherClass(currentEntry.weather)">
                  <span class="weather-icon">{{ getWeatherIcon(currentEntry.weather) }}</span>
                  <span class="weather-text">{{ currentEntry.weather }}</span>
                </div>
              </div>
            </div>

            <div class="content-text">{{ currentEntry.content }}</div>

            <div class="diary-tags" v-if="currentEntry.tags && currentEntry.tags.length">
              <span class="tags-label">标签：</span>
              <a-tag v-for="tag in currentEntry.tags" :key="tag" class="tag-item">
                {{ tag }}
              </a-tag>
            </div>
          </div>

          <!-- 编辑按钮 -->
          <div class="edit-section">
            <a-button @click="editEntry" type="primary" class="edit-button">
              <template #icon>
                <EditOutlined />
              </template>
              编辑随记
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 当没有选中条目时显示空状态 -->
    <div class="detail-main" v-else>
      <div class="content-wrapper">
        <a-empty description="未找到随记内容">
          <a-button @click="goBack" type="primary">返回随记列表</a-button>
        </a-empty>
      </div>
    </div>

    <!-- 编辑模态框 -->
    <a-modal
      v-model:open="modalVisible"
      title="编辑随记"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
      width="600px"
      :maskClosable="false"
    >
      <a-form layout="vertical">
        <a-form-item label="日期和时间">
          <a-date-picker
            v-model:value="formState.datetime"
            show-time
            format="YYYY-MM-DD HH:mm"
            placeholder="选择日期和时间"
            style="width: 100%"
            class="datetime-picker"
          />
        </a-form-item>

        <a-form-item label="心情">
          <a-select v-model:value="formState.mood" placeholder="选择心情" style="width: 100%">
            <a-select-option value="开心">😊 开心</a-select-option>
            <a-select-option value="平静">😌 平静</a-select-option>
            <a-select-option value="思考">🤔 思考</a-select-option>
            <a-select-option value="兴奋">🤩 兴奋</a-select-option>
            <a-select-option value="疲惫">😴 疲惫</a-select-option>
            <a-select-option value="沮丧">😞 沮丧</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="天气">
          <a-select v-model:value="formState.weather" placeholder="选择天气" style="width: 100%">
            <a-select-option value="晴天">☀️ 晴天</a-select-option>
            <a-select-option value="多云">⛅ 多云</a-select-option>
            <a-select-option value="阴天">☁️ 阴天</a-select-option>
            <a-select-option value="小雨">🌧️ 小雨</a-select-option>
            <a-select-option value="大雨">⛈️ 大雨</a-select-option>
            <a-select-option value="雪天">❄️ 雪天</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="标签">
          <a-select
            v-model:value="formState.tags"
            mode="tags"
            placeholder="添加标签（回车确认）"
            style="width: 100%"
            class="tag-selector"
          />
        </a-form-item>

        <a-form-item label="内容">
          <a-textarea
            v-model:value="formState.content"
            placeholder="记录你的想法..."
            :rows="8"
            :maxlength="1000"
            show-count
            class="content-textarea"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined, CalendarOutlined, EditOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'
import { useNotesStore } from '@/stores/notes'
import { storeToRefs } from 'pinia'

interface Note {
  id: string
  date: string
  time: string
  content: string
  mood?: string
  tags?: string[]
  weather?: string
}

const route = useRoute()
const router = useRouter()
const modalVisible = ref(false)

const notesStore = useNotesStore()
const { notes } = storeToRefs(notesStore)

// 表单状态
const formState = reactive({
  datetime: dayjs(),
  content: '',
  mood: undefined as string | undefined,
  tags: [] as string[],
  weather: undefined as string | undefined,
})

// 获取心情标签颜色
const getMoodColor = (mood?: string) => {
  const moodColors: Record<string, string> = {
    开心: 'green',
    平静: 'blue',
    思考: 'purple',
    兴奋: 'orange',
    疲惫: 'gray',
    沮丧: 'red',
  }
  return mood ? moodColors[mood] || 'default' : 'default'
}

// 获取天气图标
const getWeatherIcon = (weather?: string) => {
  const weatherIcons: Record<string, string> = {
    晴天: '☀️',
    多云: '⛅',
    阴天: '☁️',
    小雨: '🌧️',
    大雨: '⛈️',
    雪天: '❄️',
  }
  return weather ? weatherIcons[weather] || '🌈' : '🌈'
}

// 获取天气样式类
const getWeatherClass = (weather?: string) => {
  const weatherClasses: Record<string, string> = {
    晴天: 'weather-sunny',
    多云: 'weather-cloudy',
    阴天: 'weather-overcast',
    小雨: 'weather-rainy',
    大雨: 'weather-stormy',
    雪天: 'weather-snowy',
  }
  return weather
    ? `weather-info ${weatherClasses[weather] || 'weather-other'}`
    : 'weather-info weather-other'
}

// 格式化日期时间
const formatDateTime = (date?: string, time?: string) => {
  if (!date || !time) return ''
  return dayjs(`${date} ${time}`).format('YYYY年MM月DD日 HH:mm')
}

// 返回列表页面
const goBack = () => {
  router.push('/notes')
}

// 编辑条目
const editEntry = () => {
  if (currentEntry.value) {
    // 初始化表单数据
    const entry = currentEntry.value
    formState.datetime = dayjs(`${entry.date} ${entry.time || '00:00'}`)
    formState.content = entry.content
    formState.mood = entry.mood
    formState.tags = entry.tags || []
    formState.weather = entry.weather
    modalVisible.value = true
  }
}

// 处理模态框确认
const handleModalOk = async () => {
  if (!formState.content.trim()) {
    message.warning('请输入随记内容')
    return
  }

  if (currentEntry.value) {
    // 更新当前条目
    const date = formState.datetime.format('YYYY-MM-DD')
    const time = formState.datetime.format('HH:mm')

    try {
      await notesStore.updateNote(currentEntry.value.id, {
        date,
        time,
        content: formState.content,
        mood: formState.mood,
        tags: [...formState.tags],
        weather: formState.weather,
      })
      
      message.success('更新成功')
      modalVisible.value = false
    } catch (error) {
      message.error('更新失败')
      console.error('更新笔记失败:', error)
    }
  }
}

// 处理模态框取消
const handleModalCancel = () => {
  modalVisible.value = false
}

// 使用路由参数获取当前条目ID
const currentEntryId = computed(() => route.params.id as string)
const currentEntry = computed<Note | null>(() => {
  if (currentEntryId.value) {
    const note = notes.value.find((note) => note.id === currentEntryId.value)
    if (note) {
      return {
        id: note.id,
        date: note.date,
        time: note.time || '00:00',
        content: note.content || note.desc || '',
        mood: note.mood,
        tags: note.tags || [],
        weather: note.weather
      }
    }
  }
  return null
})

onMounted(async () => {
  // 从后端加载数据到store
  await notesStore.fetchNotes();
  console.log('随记详情数据已从后端加载到store');
})
</script>

<style scoped>
.notes-detail-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 20px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.diary-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.diary-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.back-section {
  padding: 30px 40px 20px;
}

.back-button {
  border-radius: 12px;
  padding: 8px 20px;
  font-size: 16px;
  border: 1px solid #40e0d0;
  color: #40e0d0;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #40e0d0;
  color: white;
}

.diary-content {
  padding: 20px 40px 40px;
}

.content-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.diary-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  line-height: 1.4;
}

.diary-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.meta-info {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.diary-date {
  font-size: 16px;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mood-tag {
  font-size: 14px;
  padding: 6px 16px;
  border-radius: 20px;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  padding: 6px 16px;
  border-radius: 20px;
  background: #f0fafa;
}

.weather-sunny {
  color: #ff9800;
  background: #fff8e1;
}

.weather-cloudy {
  color: #2196f3;
  background: #e3f2fd;
}

.weather-overcast {
  color: #607d8b;
  background: #eceff1;
}

.weather-rainy {
  color: #03a9f4;
  background: #e1f5fe;
}

.weather-stormy {
  color: #3f51b5;
  background: #e8eaf6;
}

.weather-snowy {
  color: #00bcd4;
  background: #e0f7fa;
}

.weather-other {
  color: #4caf50;
  background: #e8f5e9;
}

.content-text {
  font-size: 18px;
  line-height: 1.8;
  color: #454545;
  white-space: pre-wrap;
  margin-bottom: 30px;
}

.diary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.tags-label {
  font-size: 16px;
  color: #8c8c8c;
  font-weight: 500;
}

.tag-item {
  font-size: 14px;
  padding: 6px 16px;
  border-radius: 20px;
  background: #f0fafa;
  border: 1px solid #40e0d0 !important;
  color: #40e0d0 !important;
}

.edit-section {
  padding: 30px 40px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.edit-button {
  font-size: 16px;
  border-radius: 12px;
  background: #40e0d0;
  border-color: #40e0d0;
  transition: all 0.3s ease;
}

.edit-button:hover {
  background: #35c9b9;
  border-color: #35c9b9;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 224, 208, 0.3);
}

@media (max-width: 768px) {
  .notes-detail-container {
    padding: 20px 10px;
  }

  .back-section,
  .diary-content,
  .edit-section {
    padding-left: 20px;
    padding-right: 20px;
  }

  .diary-title {
    font-size: 28px;
  }

  .content-text {
    font-size: 16px;
  }

  .diary-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>