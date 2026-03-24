<!-- src/views/NotesView.vue -->
<template>
  <div class="notes-view">
    <div class="notes-header">
      <h1 class="page-title">我的随记</h1>
      <div class="header-actions">
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索随记内容..."
          style="width: 250px; margin-right: 16px"
          @search="onSearch"
        />
      </div>
    </div>

    <div class="notes-layout">
      <!-- 左侧日历区域 -->
      <div class="calendar-section">
        <a-card :bordered="false" class="section-card">
          <a-calendar v-model:value="selectedDate" @select="onSelectDate" :fullscreen="false">
            <template #headerRender="{ value, onChange }">
              <div class="calendar-header">
                <a-select
                  :value="value.year()"
                  @change="(year: number) => handleChangeYear(year, value, onChange)"
                  style="width: 80px"
                >
                  <a-select-option v-for="year in years" :key="year" :value="year">
                    {{ year }}年
                  </a-select-option>
                </a-select>

                <a-select
                  :value="value.month()"
                  @change="(month: number) => handleChangeMonth(month, value, onChange)"
                  style="width: 70px; margin-left: 8px"
                >
                  <a-select-option v-for="month in 12" :key="month - 1" :value="month - 1">
                    {{ month }}月
                  </a-select-option>
                </a-select>
              </div>
            </template>
            <template #dateFullCell="{ current }">
              <div class="calendar-full-cell" :class="{ 'has-entry': hasEntryForDate(current) }">
                <div class="calendar-date-number">{{ current.date() }}</div>
              </div>
            </template>
          </a-calendar>

          <div class="stats-summary">
            <div class="stat-item">
              <div class="stat-value">{{ totalEntries }}</div>
              <div class="stat-label">总随记数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ currentMonthEntries }}</div>
              <div class="stat-label">本月新增</div>
            </div>
          </div>
        </a-card>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content-section">
        <a-card :bordered="false" class="section-card">
          <template #title>
            <div class="content-header">
              <span>{{
                searchText ? '搜索结果' : selectedDate.format('YYYY年MM月DD日') + ' 的随记'
              }}</span>
              <a-tag
                :color="
                  searchText ? 'green' : entriesForSelectedDate.length > 0 ? 'blue' : 'orange'
                "
              >
                {{ searchText ? searchResults.length : entriesForSelectedDate.length }} 条记录
              </a-tag>
            </div>
          </template>

          <div class="diary-list">
            <a-list
              :data-source="searchText ? searchResults : entriesForSelectedDate"
              :loading="loading"
              :pagination="pagination"
            >
              <template #renderItem="{ item }">
                <a-list-item class="diary-item">
                  <div class="diary-link" @click="viewDetail(item)">
                    <div class="diary-main">
                      <h3 class="diary-title">
                        {{
                          item.content.length > 30
                            ? item.content.substring(0, 30) + '...'
                            : item.content
                        }}
                      </h3>
                      <div class="diary-meta">
                        <div class="meta-info">
                          <span class="diary-time">
                            <ClockCircleOutlined />
                            {{ item.date }} {{ formatTime(item.time) }}
                          </span>
                          <a-tag :color="getMoodColor(item.mood)" v-if="item.mood" class="mood-tag">
                            {{ item.mood }}
                          </a-tag>
                        </div>
                        <div class="weather-info" :class="getWeatherClass(item.weather)">
                          <span class="weather-icon">{{ getWeatherIcon(item.weather) }}</span>
                          <span class="weather-text">{{ item.weather }}</span>
                        </div>
                      </div>
                      <!-- 只显示摘要内容 -->
                      <div class="diary-content">{{ getSummary(item.content) }}</div>
                      <div class="diary-tags" v-if="item.tags && item.tags.length">
                        <a-tag
                          v-for="tag in item.tags"
                          :key="tag"
                          color="default"
                          class="content-tag"
                        >
                          {{ tag }}
                        </a-tag>
                      </div>
                    </div>
                  </div>
                </a-list-item>
              </template>
              <template #empty>
                <a-empty
                  :description="searchText ? '没有找到匹配的随记内容' : '当天暂无随记内容'"
                />
              </template>
            </a-list>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ClockCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { useNotesStore } from '@/stores/notes'
import { storeToRefs } from 'pinia'

interface Note {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  content: string
  mood?: string
  tags?: string[]
  weather?: string // 添加天气字段
}

const router = useRouter()
const searchText = ref('')
const selectedDate = ref<Dayjs>(dayjs())
const loading = ref(false)

const notesStore = useNotesStore()
const { notes } = storeToRefs(notesStore)

// 将notes数组转换为Note类型
const diaryEntries = computed(() => {
  // 确保数据已存在且有值
  return notes.value.map((note) => ({
    id: note.id,
    date: note.date,
    time: note.time || '00:00',
    content: note.content || note.desc || '',
    mood: note.mood,
    tags: note.tags || [],
    weather: note.weather,
  }))
})

// 分页配置
const pagination = {
  pageSize: 5,
  showSizeChanger: false,
  hideOnSinglePage: true,
}

// 搜索结果
const searchResults = computed(() => {
  if (!searchText.value.trim()) {
    return []
  }

  const searchLower = searchText.value.trim().toLowerCase()
  return diaryEntries.value
    .filter(
      (entry: Note) =>
        entry.content.toLowerCase().includes(searchLower) ||
        (entry.mood && entry.mood.toLowerCase().includes(searchLower)) ||
        (entry.tags && entry.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))) ||
        (entry.weather && entry.weather.toLowerCase().includes(searchLower)) ||
        entry.date.includes(searchLower),
    )
    .sort((a: Note, b: Note) => {
      // 按日期时间倒序排列
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date)
      }
      return (b.time || '').localeCompare(a.time || '')
    })
})

// 计算属性
const entriesForSelectedDate = computed(() => {
  const selectedDateString = selectedDate.value.format('YYYY-MM-DD')
  return diaryEntries.value
    .filter((entry: Note) => entry.date === selectedDateString)
    .sort((a: Note, b: Note) => (b.time || '').localeCompare(a.time || ''))
})

const totalEntries = computed(() => diaryEntries.value.length)

const currentMonthEntries = computed(() => {
  const currentMonth = dayjs().format('YYYY-MM')
  return diaryEntries.value.filter((entry: Note) => entry.date.startsWith(currentMonth)).length
})

const years = computed(() => {
  const currentYear = dayjs().year()
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
})

// 获取主题色的计算属性（实时从 CSS 变量中读取）
const primaryColor = computed(() => {
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() ||
    '#40e0d0'
  )
})

// 十六进制颜色转 RGBA
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 方法
const onSelectDate = (date: Dayjs) => {
  selectedDate.value = date
  // 清除搜索文本，回到日期选择模式
  searchText.value = ''
  message.info(`选择了日期: ${date.format('YYYY年MM月DD日')}`)
}

const handleChangeYear = (year: number, value: Dayjs, onChange: Function) => {
  const newValue = value.year(year)
  onChange(newValue)
}

const handleChangeMonth = (month: number, value: Dayjs, onChange: Function) => {
  const newValue = value.month(month)
  onChange(newValue)
}

const formatTime = (time: string) => {
  return dayjs(`2023-01-01 ${time}`).format('HH:mm')
}

const getMoodColor = (mood: string) => {
  const moodColors: Record<string, string> = {
    开心: 'green',
    平静: 'blue',
    思考: 'purple',
    兴奋: 'orange',
    疲惫: 'gray',
    沮丧: 'red',
  }
  return moodColors[mood] || 'default'
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

// 判断某天是否有随记
const hasEntryForDate = (date: Dayjs) => {
  const dateString = date.format('YYYY-MM-DD')
  return diaryEntries.value.some((entry: Note) => entry.date === dateString)
}

const getSummary = (content: string) => {
  // 获取内容的前150个字符作为摘要
  return content.substring(0, 150) + (content.length > 150 ? '...' : '')
}

const onSearch = (value: string) => {
  searchText.value = value
  if (value.trim()) {
    message.info(`找到 ${searchResults.value.length} 条匹配的随记`)
  } else {
    message.info('已清空搜索')
  }
}

const viewDetail = (entry: Note) => {
  router.push(`/notes/${entry.id}`)
}

onMounted(async () => {
  // 从后端加载数据到store
  await notesStore.fetchNotes()
  console.log('随记数据已从后端加载到store')
  // 触发loaded事件
  const event = new Event('loaded')
  window.dispatchEvent(event)
})
</script>

<style scoped>
.notes-view {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  min-height: 100vh;
  max-width: 1400px; /* 限制最大宽度 */
  margin: 0 auto; /* 居中显示 */
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
}

.notes-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  align-items: start;
}

.section-card {
  background: #ffffff;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.calendar-header {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

.calendar-full-cell {
  text-align: center;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-date-number {
  position: relative;
  z-index: 1;
}

.calendar-full-cell.has-entry::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background-color: v-bind(primaryColor);
  border-radius: 50%;
}

.stats-summary {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: v-bind(primaryColor);
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  margin-top: 4px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
}

.diary-list {
  min-height: 300px;
}

.diary-item {
  flex-direction: column;
  align-items: stretch !important;
  padding: 24px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.diary-item:last-child {
  border-bottom: none;
}

.diary-item:hover {
  background-color: #fafafa;
}

.diary-link {
  color: inherit;
  text-decoration: none;
  flex: 1;
  cursor: pointer;
  padding: 0 30px;
}

.diary-main {
  flex: 1;
}

.diary-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #1a1a1a;
  line-height: 1.4;
}

.diary-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  align-items: center;
}

.meta-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.diary-time {
  font-size: 14px;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  gap: 6px;
}

.mood-tag {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  padding: 4px 10px;
  border-radius: 12px;
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

.diary-content {
  font-size: 16px;
  color: #595959;
  line-height: 1.7;
  margin-bottom: 20px;
  white-space: pre-wrap;
  transition: color 0.3s;
}

.diary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.content-tag {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  background: v-bind(hexToRgba(primaryColor, 0.1));
  border: 1px solid v-bind(primaryColor) !important;
  color: v-bind(primaryColor) !important;
}

.action-btn {
  color: #8c8c8c;
  margin: 0 6px;
  font-size: 16px;
}

.action-btn:hover {
  color: v-bind(primaryColor) !important;
}

.diary-modal :deep(.ant-modal-content) {
  border-radius: 16px;
  overflow: hidden;
}

.diary-modal :deep(.ant-modal-header) {
  background: #f8f9fa;
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 24px;
}

.diary-modal :deep(.ant-modal-title) {
  color: v-bind(primaryColor);
  font-size: 22px;
  font-weight: 600;
}

.diary-modal :deep(.ant-modal-body) {
  padding: 24px;
}

.diary-modal :deep(.ant-modal-footer) {
  padding: 16px 24px;
  background: #f8f9fa;
  border-top: 1px solid #f0f0f0;
}

.mood-selector :deep(.ant-select-selection-item),
.weather-selector :deep(.ant-select-selection-item) {
  color: v-bind(primaryColor);
}

.tag-selector :deep(.ant-select-selection-item) {
  background-color: v-bind(hexToRgba(primaryColor, 0.1));
  border-color: v-bind(primaryColor) !important;
  color: v-bind(primaryColor);
}

.content-textarea :deep(.ant-input) {
  border-color: v-bind(hexToRgba(primaryColor, 0.3));
  border-radius: 12px;
  min-height: 180px;
  font-size: 16px;
}

.content-textarea :deep(.ant-input:focus) {
  border-color: v-bind(primaryColor);
  box-shadow: 0 0 0 2px v-bind(hexToRgba(primaryColor, 0.2));
}

@media (max-width: 992px) {
  .notes-layout {
    grid-template-columns: 1fr;
  }

  .notes-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .diary-link {
    padding: 0 20px;
  }

  .diary-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .meta-info {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max_width: 768px) {
  .notes-view {
    padding: 16px;
  }

  .notes-header {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .diary-title {
    font-size: 20px;
  }

  .diary-content {
    font-size: 15px;
  }
}
</style>
