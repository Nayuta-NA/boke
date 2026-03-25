<!-- src/views/NotesView.vue -->
<template>
  <div class="notes-view">
    <div class="notes-layout">
      <!-- 左侧区域：日历 + 日记列表 -->
      <div class="left-section">
        <!-- 日历 - 固定不动 -->
        <div class="calendar-card">
          <a-calendar v-model:value="selectedDate" @select="onSelectDate" :fullscreen="false">
            <template #headerRender="{ value, onChange }">
              <div class="calendar-header">
                <a-select
                  :value="value.year()"
                  @change="(year: number) => handleChangeYear(year, value, onChange)"
                  style="width: 80px"
                  size="small"
                >
                  <a-select-option v-for="year in years" :key="year" :value="year">
                    {{ year }}
                  </a-select-option>
                </a-select>

                <a-select
                  :value="value.month()"
                  @change="(month: number) => handleChangeMonth(month, value, onChange)"
                  style="width: 70px; margin-left: 8px"
                  size="small"
                >
                  <a-select-option v-for="month in 12" :key="month - 1" :value="month - 1">
                    {{ month }}
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
        </div>

        <!-- 日记列表 - 可滚动区域 -->
        <div class="notes-list-container" @scroll="handleScroll">
          <div
            v-for="item in displayList"
            :key="item.id"
            class="note-card"
            :class="[
              { active: selectedNote?.id === item.id },
              `weather-${item.weather || 'default'}`,
            ]"
            @click="selectNote(item)"
          >
            <div class="weather-icon-bg">{{ getWeatherIcon(item.weather) }}</div>
            <div class="note-date">{{ item.date }}</div>
            <div class="note-title">{{ item.title || getNoteTitle(item.content) }}</div>
            <div class="note-content">{{ getCardContent(item.content) }}</div>
          </div>

          <!-- 加载更多按钮 -->
          <div class="load-more" v-if="hasMore">
            <a-button @click="loadMore" block>加载更多</a-button>
          </div>

          <!-- 空状态 -->
          <div class="empty-list" v-if="sortedEntries.length === 0">
            <a-empty description="暂无日记记录" />
          </div>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="right-section" :class="[`weather-${rightSectionWeather}`]">
        <!-- 固定在右下角的操作按钮组 -->
        <div class="floating-action-buttons" v-if="selectedNote && authStore.isAuthenticated">
          <button class="action-btn edit-btn-float" @click="showEditModal" title="编辑日记">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="action-btn add-btn-float" @click="showCreateModal" title="新建日记">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button class="action-btn delete-btn-float" @click="handleDeleteNote" title="删除日记">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              ></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>

        <!-- 情况 1：未选择日期且未选中日记 - 提示选择 -->
        <div class="empty-detail" v-if="!selectedDate && !selectedNote">
          <a-empty description="请选择一个日期或点击左侧日记查看详情" />
        </div>

        <!-- 情况 2：选择了日期 - 显示该日期的卡片列表供选择 -->
        <div
          class="notes-selection"
          v-else-if="selectedDate && entriesForSelectedDate.length > 0 && !selectedNote"
        >
          <div class="selection-header">
            <h3 class="selection-title">
              {{ selectedDate.format('YYYY 年 MM 月 DD 日') }} 共有
              {{ entriesForSelectedDate.length }} 篇日记
            </h3>
            <p class="selection-subtitle">请选择一篇查看详情</p>
          </div>

          <div class="selection-cards">
            <div
              v-for="note in entriesForSelectedDate"
              :key="note.id"
              class="selection-card"
              :class="[
                { selected: (selectedNote as Note | null)?.id === note.id },
                `weather-${note.weather || 'default'}`,
              ]"
              @click="selectNote(note)"
            >
              <div class="selection-card-time">{{ note.time }}</div>
              <div class="selection-card-weather">
                {{ getWeatherIcon(note.weather) }} {{ note.weather }}
              </div>
              <div class="selection-card-content">{{ getCardContent(note.content) }}</div>
              <div class="selection-card-mood" v-if="note.mood">
                <a-tag :color="getMoodColor(note.mood)" size="small">{{ note.mood }}</a-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 情况 3：选择了日期且选中了日记 - 只显示详情 -->
        <div class="note-detail" v-else-if="selectedDate && selectedNote">
          <div class="detail-header">
            <div class="detail-meta">
              <h1 class="detail-main-title">
                {{ selectedNote.title || getNoteTitle(selectedNote.content) }}
              </h1>

              <div class="detail-sub-meta">
                <span class="detail-date">{{ selectedNote.date }} {{ selectedNote.time }}</span>
                <span class="weather-icon" :title="selectedNote.weather">{{
                  getWeatherIcon(selectedNote.weather)
                }}</span>
                <a-tag
                  :color="getMoodColor(selectedNote.mood)"
                  size="small"
                  v-if="selectedNote.mood"
                  >{{ selectedNote.mood }}</a-tag
                >
                <a-tag
                  v-for="tag in selectedNote.tags"
                  :key="tag"
                  color="default"
                  size="small"
                  class="detail-tag"
                  >{{ tag }}</a-tag
                >
              </div>
            </div>
          </div>

          <div class="detail-content">
            <p class="detail-text">{{ selectedNote.content }}</p>
          </div>
        </div>

        <!-- 情况 4：选择了日期但该日期没有日记 - 空状态 -->
        <div class="empty-detail" v-else-if="selectedDate && entriesForSelectedDate.length === 0">
          <a-empty description="该日期暂无日记">
            <template #image>
              <svg viewBox="0 0 1024 1024" width="200" height="200">
                <path
                  fill="#f0f0f0"
                  d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                />
                <path
                  fill="#f0f0f0"
                  d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.1 1.5 3.9 3.5 4.7l171 123.6c3.6 2.6 8.6 1.8 11.2-1.8l21-29.1c2.6-3.6 1.8-8.6-1.8-11.2z"
                />
              </svg>
            </template>
            <p style="color: #8c8c8c; margin-top: 16px">
              {{ selectedDate.format('YYYY 年 MM 月 DD 日') }} 还没有记录
            </p>
            <a-button type="primary" @click="showCreateModal">
              <template #icon>➕</template>
              写一篇日记
            </a-button>
          </a-empty>
        </div>

        <!-- 情况 5：未选择日期但选中了日记（从左侧列表点击） - 直接显示详情 -->
        <div class="note-detail" v-else-if="selectedNote && !selectedDate">
          <div class="detail-header">
            <div class="detail-meta">
              <h1 class="detail-main-title">
                {{ selectedNote.title || getNoteTitle(selectedNote.content) }}
              </h1>
              <div class="detail-sub-meta">
                <span class="detail-date">{{ selectedNote.date }} {{ selectedNote.time }}</span>
                <span class="weather-icon" :title="selectedNote.weather">{{
                  getWeatherIcon(selectedNote.weather)
                }}</span>
                <a-tag
                  :color="getMoodColor(selectedNote.mood)"
                  size="small"
                  v-if="selectedNote.mood"
                  >{{ selectedNote.mood }}</a-tag
                >
                <a-tag
                  v-for="tag in selectedNote.tags"
                  :key="tag"
                  color="default"
                  size="small"
                  class="detail-tag"
                  >{{ tag }}</a-tag
                >
              </div>
            </div>
          </div>

          <div class="detail-content">
            <p class="detail-text">{{ selectedNote.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建日记模态框 -->
    <a-modal
      v-model:open="createModalVisible"
      title="新建日记"
      @ok="handleCreateNote"
      @cancel="handleCancelCreate"
      :confirm-loading="confirmLoading"
      width="800px"
    >
      <a-form :model="newNoteForm" layout="vertical">
        <a-form-item label="日期" required>
          <a-date-picker
            v-model:value="newNoteForm.date"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </a-form-item>

        <a-form-item label="标题">
          <a-input
            v-model:value="newNoteForm.title"
            placeholder="给日记起个标题（可选）"
            maxlength="100"
            show-count
          />
        </a-form-item>

        <a-form-item label="天气">
          <a-select v-model:value="newNoteForm.weather" placeholder="请选择天气">
            <a-select-option value="晴天">☀️ 晴天</a-select-option>
            <a-select-option value="多云">⛅ 多云</a-select-option>
            <a-select-option value="阴天">☁️ 阴天</a-select-option>
            <a-select-option value="小雨">🌧️ 小雨</a-select-option>
            <a-select-option value="大雨">⛈️ 大雨</a-select-option>
            <a-select-option value="雪天">❄️ 雪天</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="心情">
          <a-select v-model:value="newNoteForm.mood" placeholder="请选择心情">
            <a-select-option value="开心">开心</a-select-option>
            <a-select-option value="平静">平静</a-select-option>
            <a-select-option value="思考">思考</a-select-option>
            <a-select-option value="兴奋">兴奋</a-select-option>
            <a-select-option value="疲惫">疲惫</a-select-option>
            <a-select-option value="沮丧">沮丧</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="标签">
          <a-select
            v-model:value="newNoteForm.tags"
            mode="tags"
            placeholder="输入标签后按回车添加"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="日记内容" required>
          <a-textarea
            v-model:value="newNoteForm.content"
            placeholder="记录今天的点点滴滴..."
            :rows="10"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑日记模态框 -->
    <a-modal
      v-model:open="editModalVisible"
      title="编辑日记"
      @ok="handleEditNote"
      @cancel="handleCancelEdit"
      :confirm-loading="confirmLoading"
      width="800px"
    >
      <a-form :model="editNoteForm" layout="vertical">
        <a-form-item label="日期" required>
          <a-date-picker
            v-model:value="editNoteForm.date"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </a-form-item>

        <a-form-item label="标题">
          <a-input
            v-model:value="editNoteForm.title"
            placeholder="日记标题（可选）"
            maxlength="100"
            show-count
          />
        </a-form-item>

        <a-form-item label="天气">
          <a-select v-model:value="editNoteForm.weather" placeholder="请选择天气">
            <a-select-option value="晴天">☀️ 晴天</a-select-option>
            <a-select-option value="多云">⛅ 多云</a-select-option>
            <a-select-option value="阴天">☁️ 阴天</a-select-option>
            <a-select-option value="小雨">🌧️ 小雨</a-select-option>
            <a-select-option value="大雨">⛈️ 大雨</a-select-option>
            <a-select-option value="雪天">❄️ 雪天</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="心情">
          <a-select v-model:value="editNoteForm.mood" placeholder="请选择心情">
            <a-select-option value="开心">开心</a-select-option>
            <a-select-option value="平静">平静</a-select-option>
            <a-select-option value="思考">思考</a-select-option>
            <a-select-option value="兴奋">兴奋</a-select-option>
            <a-select-option value="疲惫">疲惫</a-select-option>
            <a-select-option value="沮丧">沮丧</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="标签">
          <a-select
            v-model:value="editNoteForm.tags"
            mode="tags"
            placeholder="输入标签后按回车添加"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="日记内容" required>
          <a-textarea
            v-model:value="editNoteForm.content"
            placeholder="修改日记内容..."
            :rows="10"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { useNotesStore } from '@/stores/notes'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

interface Note {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  title: string
  content: string
  mood?: string
  tags?: string[]
  weather?: string
}

const selectedDate = ref<Dayjs>(dayjs())
const selectedNote = ref<Note | null>(null)
const currentPage = ref(1)
const pageSize = 4 // 默认显示 4 条

// 新建日记相关
const createModalVisible = ref(false)
const confirmLoading = ref(false)
const newNoteForm = reactive({
  date: dayjs().format('YYYY-MM-DD'),
  title: '',
  weather: undefined as string | undefined,
  mood: undefined as string | undefined,
  tags: [] as string[],
  content: '',
})

// 编辑日记相关
const editModalVisible = ref(false)
const editNoteForm = reactive({
  id: '',
  date: '',
  title: '',
  weather: undefined as string | undefined,
  mood: undefined as string | undefined,
  tags: [] as string[],
  content: '',
})

const notesStore = useNotesStore()
const { notes } = storeToRefs(notesStore)

const authStore = useAuthStore()

const diaryEntries = computed(() => {
  return notes.value.map((note) => ({
    id: note.id,
    date: note.date,
    time: note.time || '00:00',
    title: note.title || '',
    content: note.content || note.desc || '',
    mood: note.mood,
    tags: note.tags || [],
    weather: note.weather,
  }))
})

// 按日期倒序排列
const sortedEntries = computed(() => {
  return [...diaryEntries.value].sort((a, b) => {
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date)
    }
    return (b.time || '').localeCompare(a.time || '')
  })
})

// 当前选中日期的日记
const entriesForSelectedDate = computed(() => {
  const dateString = selectedDate.value.format('YYYY-MM-DD')
  return diaryEntries.value.filter((entry: Note) => entry.date === dateString)
})

// 当前页显示的数据
const displayList = computed(() => {
  const start = 0
  const end = currentPage.value * pageSize
  return sortedEntries.value.slice(start, end)
})

const hasMore = computed(() => {
  return currentPage.value * pageSize < sortedEntries.value.length
})

const totalEntries = computed(() => diaryEntries.value.length)

const currentMonthEntries = computed(() => {
  const currentMonth = dayjs().format('YYYY-MM')
  return diaryEntries.value.filter((entry: Note) => entry.date.startsWith(currentMonth)).length
})

// 右侧区域天气类名
const rightSectionWeather = computed(() => {
  if (selectedNote.value?.weather) {
    return selectedNote.value.weather
  }
  // 如果是单日日记，使用该日记的天气
  if (entriesForSelectedDate.value.length === 1 && !selectedNote.value) {
    return entriesForSelectedDate.value[0].weather || 'default'
  }
  return 'default'
})

const years = computed(() => {
  const currentYear = dayjs().year()
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
})

const primaryColor = computed(() => {
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() ||
    '#40e0d0'
  )
})

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 获取日记标题 (第一行或前 30 字)
const getNoteTitle = (content: string) => {
  const firstLine = content.split('\n')[0]
  return firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine
}

// 获取卡片内容 (前 20 字)
const getCardContent = (content: string) => {
  const text = content.replace(/\n/g, ' ')
  return text.length > 20 ? text.substring(0, 20) + '...' : text
}

const getWeatherIcon = (weather?: string) => {
  const weatherIcons: Record<string, string> = {
    晴天: '☀️',
    多云: '⛅',
    阴天: '☁️',
    小雨: '🌧️',
    大雨: '⛈️',
    雪天: '❄️',
  }
  return weather ? weatherIcons[weather] || '🌈' : ''
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

const hasEntryForDate = (date: Dayjs) => {
  const dateString = date.format('YYYY-MM-DD')
  return diaryEntries.value.some((entry: Note) => entry.date === dateString)
}

const formatTime = (time: string) => {
  return dayjs(`2023-01-01 ${time}`).format('HH:mm')
}

const selectNote = (note: Note) => {
  // 保留 selectedDate，让详情页面显示
  selectedNote.value = note
}

const loadMore = () => {
  if (hasMore.value) {
    currentPage.value++
    message.success('已加载更多日记')
  }
}

// 监听列表容器滚动，实现滚动加载
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight

  // 距离底部 100px 时触发加载
  if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore.value) {
    loadMore()
  }
}

const onSelectDate = (date: Dayjs) => {
  selectedDate.value = date
  // 切换日期时重置选中的日记，显示卡片选择列表
  selectedNote.value = null

  // 查找该日期的日记
  const notesOnDate = entriesForSelectedDate.value

  if (notesOnDate.length === 0) {
    message.info(`${date.format('YYYY 年 MM 月 DD 日')} 暂无日记`)
  }
  // 有多条时也不自动选中，让用户在右侧卡片中选择
}

const handleChangeYear = (year: number, value: Dayjs, onChange: Function) => {
  const newValue = value.year(year)
  onChange(newValue)
}

const handleChangeMonth = (month: number, value: Dayjs, onChange: Function) => {
  const newValue = value.month(month)
  onChange(newValue)
}

// 显示创建日记模态框
const showCreateModal = () => {
  createModalVisible.value = true
}

// 处理创建日记
const handleCreateNote = async () => {
  if (!newNoteForm.date || !newNoteForm.content) {
    message.warning('请填写必填项')
    return
  }

  confirmLoading.value = true

  try {
    // 准备日记数据
    const noteData = {
      title: newNoteForm.title || getNoteTitle(newNoteForm.content),
      icon: '📝',
      date: newNoteForm.date,
      time: dayjs().format('HH:mm'),
      content: newNoteForm.content,
      desc: newNoteForm.content,
      readTime: '1 分钟阅读',
      mood: newNoteForm.mood,
      tags: newNoteForm.tags,
      weather: newNoteForm.weather,
    }

    // 调用 store 的创建方法
    await notesStore.createNote(noteData)

    // 重置表单
    Object.assign(newNoteForm, {
      date: dayjs().format('YYYY-MM-DD'),
      title: '',
      weather: undefined,
      mood: undefined,
      tags: [],
      content: '',
    })

    // 关闭模态框
    createModalVisible.value = false
    message.success('日记创建成功')

    // 如果是当天创建的，自动选中该日期查看卡片列表
    if (newNoteForm.date === selectedDate.value?.format('YYYY-MM-DD')) {
      // 保持当前日期选择，让用户在卡片中选择
      selectedNote.value = null
    } else {
      // 创建的是其他日期，跳转到该日期
      selectedDate.value = dayjs(newNoteForm.date)
      selectedNote.value = null
    }
  } catch (error) {
    console.error('创建日记失败:', error)
    message.error('创建日记失败')
  } finally {
    confirmLoading.value = false
  }
}

// 取消创建日记
const handleCancelCreate = () => {
  createModalVisible.value = false
  Object.assign(newNoteForm, {
    date: dayjs().format('YYYY-MM-DD'),
    title: '',
    weather: undefined,
    mood: undefined,
    tags: [],
    content: '',
  })
}

// 显示编辑日记模态框
const showEditModal = () => {
  if (!selectedNote.value) {
    message.warning('请先选择要编辑的日记')
    return
  }

  // 填充表单数据
  editNoteForm.id = selectedNote.value.id
  editNoteForm.date = selectedNote.value.date
  editNoteForm.title = selectedNote.value.title || ''
  editNoteForm.weather = selectedNote.value.weather
  editNoteForm.mood = selectedNote.value.mood
  editNoteForm.tags = [...(selectedNote.value.tags || [])]
  editNoteForm.content = selectedNote.value.content

  editModalVisible.value = true
}

// 处理编辑日记
const handleEditNote = async () => {
  if (!editNoteForm.date || !editNoteForm.content) {
    message.warning('请填写必填项')
    return
  }

  confirmLoading.value = true

  try {
    // 准备更新数据
    const updatedData = {
      title: editNoteForm.title || getNoteTitle(editNoteForm.content),
      date: editNoteForm.date,
      time: selectedNote.value?.time || dayjs().format('HH:mm'),
      content: editNoteForm.content,
      desc: editNoteForm.content,
      readTime: '1 分钟阅读',
      mood: editNoteForm.mood,
      tags: editNoteForm.tags,
      weather: editNoteForm.weather,
    }

    // 调用 store 的更新方法
    await notesStore.updateNote(editNoteForm.id, updatedData)

    // 更新选中的日记
    if (selectedNote.value) {
      selectedNote.value = {
        ...selectedNote.value,
        ...updatedData,
      }
    }

    // 关闭模态框
    editModalVisible.value = false
    message.success('日记更新成功')
  } catch (error) {
    console.error('更新日记失败:', error)
    message.error('更新日记失败')
  } finally {
    confirmLoading.value = false
  }
}

// 取消编辑日记
const handleCancelEdit = () => {
  editModalVisible.value = false
  Object.assign(editNoteForm, {
    id: '',
    date: '',
    title: '',
    weather: undefined,
    mood: undefined,
    tags: [],
    content: '',
  })
}

// 处理删除日记
const handleDeleteNote = async () => {
  if (!selectedNote.value) {
    message.warning('请先选择要删除的日记')
    return
  }

  try {
    // 显示二次确认对话框
    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: '确认删除',
        content: `确定要删除这篇日记吗？删除后将无法恢复。`,
        okText: '确认删除',
        cancelText: '取消',
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      })
    })

    // 如果用户取消，直接返回
    if (!confirmed) {
      return
    }

    // 调用 store 的删除方法
    await notesStore.deleteNote(selectedNote.value.id)

    // 重置选中状态
    selectedNote.value = null

    message.success('日记删除成功')
  } catch (error) {
    console.error('删除日记失败:', error)
    message.error('删除日记失败')
  }
}

// 监听日期变化，重置分页和选中状态
watch(selectedDate, () => {
  currentPage.value = 1
  selectedNote.value = null // 切换日期时重置选中
})

onMounted(async () => {
  await notesStore.fetchNotes()
  console.log('随记数据已从后端加载到 store')
  const event = new Event('loaded')
  window.dispatchEvent(event)

  // 默认不选中任何日记，等待用户点击
  selectedNote.value = null
})
</script>

<style scoped>
.notes-view {
  padding: 24px;
  background: var(--app-color);
  min-height: 100vh;
}

.notes-layout {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 24px;
  max-width: 1600px;
  margin: 0 auto;
  align-items: start;
}

/* 左侧区域 */
.left-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100vh - 48px); /* 固定高度 */
}

/* 日历卡片 - 固定不动 */
.calendar-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex-shrink: 0; /* 不收缩 */
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
  font-size: 16px;
  font-weight: 500;
}

.calendar-full-cell.has-entry::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
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
  font-size: 32px;
  font-weight: 600;
  color: v-bind(primaryColor);
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  margin-top: 4px;
}

/* 日记列表容器 - 可滚动 */
.notes-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  overflow-y: auto; /* 仅列表区域滚动 */
  padding-right: 8px;
  min-height: 0; /* 重要：允许 flex 子项缩小 */
}

.note-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  min-height: 100px;
  flex-shrink: 0; /* 不压缩 */
}

.note-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.note-card.active {
  border-color: v-bind(primaryColor);
  background: v-bind(hexToRgba(primaryColor, 0.02));
}

/* 天气背景效果 */
.note-card.weather-晴天 {
  background: linear-gradient(135deg, #fff7e6 0%, #ffffff 100%);
}

.note-card.weather-晴天::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: sun-pulse 3s ease-in-out infinite;
}

.note-card.weather-多云 {
  background: linear-gradient(135deg, #f0f4f8 0%, #ffffff 100%);
}

.note-card.weather-多云::before {
  content: '';
  position: absolute;
  top: -15px;
  right: -10px;
  width: 70px;
  height: 50px;
  background: radial-gradient(ellipse, rgba(200, 210, 220, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: cloud-float 4s ease-in-out infinite;
}

.note-card.weather-阴天 {
  background: linear-gradient(135deg, #e8e8e8 0%, #ffffff 100%);
}

.note-card.weather-阴天::before {
  content: '';
  position: absolute;
  top: -10px;
  right: -15px;
  width: 75px;
  height: 45px;
  background: radial-gradient(ellipse, rgba(150, 150, 150, 0.3) 0%, transparent 70%);
  border-radius: 50%;
}

.note-card.weather-小雨 {
  background: linear-gradient(135deg, #e6f3ff 0%, #ffffff 100%);
}

.note-card.weather-小雨::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 70px;
  height: 70px;
  background: radial-gradient(circle, rgba(100, 181, 246, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: rain-drop 2s ease-in-out infinite;
}

.note-card.weather-大雨 {
  background: linear-gradient(135deg, #c5e1f5 0%, #ffffff 100%);
}

.note-card.weather-大雨::before {
  content: '';
  position: absolute;
  top: -25px;
  right: -25px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(66, 133, 244, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: rain-heavy 1.5s ease-in-out infinite;
}

.note-card.weather-雪天 {
  background: linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%);
}

.note-card.weather-雪天::before {
  content: '';
  position: absolute;
  top: -15px;
  right: -15px;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(200, 220, 255, 0.5) 0%, transparent 70%);
  border-radius: 50%;
  animation: snow-fall 5s ease-in-out infinite;
}

.note-card.weather-default {
  background: #ffffff;
}

/* 天气图标背景 */
.weather-icon-bg {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 36px;
  opacity: 0.15;
  filter: grayscale(30%);
  transition: all 0.3s ease;
  z-index: 1;
}

.note-card:hover .weather-icon-bg {
  opacity: 0.25;
  transform: scale(1.1) rotate(5deg);
}

.note-date {
  font-size: 16px;
  color: #8c8c8c;
  font-weight: 500;
  margin-bottom: 10px;
  position: relative;
  z-index: 2;
}

.note-title {
  font-size: 18px;
  color: #1a1a1a;
  font-weight: 600;
  margin-bottom: 10px;
  position: relative;
  z-index: 2;
}

.note-content {
  font-size: 15px;
  color: #595959;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: relative;
  z-index: 2;
}

/* 加载更多按钮 */
.load-more {
  margin-top: 8px;
  flex-shrink: 0;
}

/* 空列表状态 */
.empty-list {
  padding: 40px 0;
  text-align: center;
  flex-shrink: 0;
}

/* 动画效果 */
@keyframes sun-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
}

@keyframes cloud-float {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-5px);
  }
}

@keyframes rain-drop {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.3;
  }
  50% {
    transform: translateY(3px);
    opacity: 0.5;
  }
}

@keyframes rain-heavy {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translateY(5px) scale(1.05);
    opacity: 0.6;
  }
}

@keyframes snow-fall {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(4px);
    opacity: 0.7;
  }
}

/* 右侧区域 */
.right-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 40px;
  padding-top: 50px; /* 为顶部操作栏留出空间 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  min-height: calc(100vh - 48px);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-left: 20px; /* 左侧留出打孔空间 */
}

/* 左侧打孔效果 */
.right-section::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 0;
  bottom: 0;
  width: 20px;
  background-image: radial-gradient(circle, #ffffff 6px, transparent 7px);
  background-size: 20px 40px; /* 调整孔洞间距 */
  background-repeat: repeat-y;
  z-index: 10;
}

/* 右侧页面天气效果 */
.right-section.weather-晴天 {
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
}

.right-section.weather-晴天::after {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: sun-pulse-slow 5s ease-in-out infinite;
}

.right-section.weather-多云 {
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
}

.right-section.weather-多云::after {
  content: '';
  position: absolute;
  top: -30px;
  right: -20px;
  width: 140px;
  height: 80px;
  background: radial-gradient(ellipse, rgba(200, 210, 220, 0.25) 0%, transparent 70%);
  border-radius: 50%;
  animation: cloud-float-slow 6s ease-in-out infinite;
}

.right-section.weather-阴天 {
  background: linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%);
}

.right-section.weather-阴天::after {
  content: '';
  position: absolute;
  top: -20px;
  right: -30px;
  width: 150px;
  height: 70px;
  background: radial-gradient(ellipse, rgba(150, 150, 150, 0.2) 0%, transparent 70%);
  border-radius: 50%;
}

.right-section.weather-小雨 {
  background: linear-gradient(135deg, #e6f3ff 0%, #ffffff 100%);
}

.right-section.weather-小雨::after {
  content: '';
  position: absolute;
  top: -40px;
  right: -40px;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(100, 181, 246, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: rain-drop-slow 3s ease-in-out infinite;
}

.right-section.weather-大雨 {
  background: linear-gradient(135deg, #d6e9f9 0%, #ffffff 100%);
}

.right-section.weather-大雨::after {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(66, 133, 244, 0.25) 0%, transparent 70%);
  border-radius: 50%;
  animation: rain-heavy-slow 2s ease-in-out infinite;
}

.right-section.weather-雪天 {
  background: linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%);
}

.right-section.weather-雪天::after {
  content: '';
  position: absolute;
  top: -30px;
  right: -30px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(200, 220, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: snow-fall-slow 7s ease-in-out infinite;
}

.right-section.weather-default {
  background: #ffffff;
}

@keyframes sun-pulse-slow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.35;
  }
}

@keyframes cloud-float-slow {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-8px);
  }
}

@keyframes rain-drop-slow {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.2;
  }
  50% {
    transform: translateY(5px);
    opacity: 0.35;
  }
}

@keyframes rain-heavy-slow {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.25;
  }
  50% {
    transform: translateY(8px) scale(1.08);
    opacity: 0.4;
  }
}

@keyframes snow-fall-slow {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.3;
  }
  50% {
    transform: translateY(6px);
    opacity: 0.45;
  }
}

/* 日记详情 */
.note-detail {
  position: relative;
  z-index: 1;
  height: calc(100vh - 120px); /* 固定高度 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-header {
  padding-bottom: 24px;
  flex-shrink: 0; /* 不收缩 */
}

.detail-meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}

.detail-main-title {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.detail-sub-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding-bottom: 16px;
  border-bottom: 3px solid v-bind(primaryColor);
}

.detail-date {
  font-size: 18px;
  font-weight: 500;
  color: #595959;
}

.weather-icon {
  font-size: 24px;
}

.detail-content {
  line-height: 2.2;
  color: #333;
  font-size: 24px; /* 增大字体 */
  /* 使用更随意的手写体风格字体 */
  font-family: 'Xingkai SC', 'STXingkai', 'Marker Felt', 'KaiTi', 'Comic Sans MS', cursive;
  /* 滚动区域 */
  overflow-y: auto;
  flex: 1; /* 占据剩余空间 */
  min-height: 0; /* 允许 flex 子项缩小 */
}

.detail-text {
  white-space: pre-wrap;
  margin-bottom: 24px;
  line-height: 2.8em; /* 匹配行间距 */
  /* 使用更随意的手写体风格 */
  font-family: 'Xingkai SC', 'STXingkai', 'Marker Felt', 'KaiTi', 'Comic Sans MS', cursive;

  /* 调整横线背景 - 更细更淡 */
  background-image: linear-gradient(#d0d0d0 1px, transparent 1px);
  background-size: 100% 2.8em; /* 增大行间距 */
  /* 调整背景位置，让横线距离文字更远 */
  background-position: 0 2em;
  padding: 0 10px;
}

.detail-tag {
  font-size: 14px;
  padding: 6px 16px;
  border-radius: 16px;
}

/* 空状态 */
.empty-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 120px);
  text-align: center;
  position: relative;
  z-index: 1;
}

/* 多条日记选择区域 */
.notes-selection {
  position: relative;
  z-index: 1;
}

.selection-header {
  margin-bottom: 32px;
  text-align: center;
}

.selection-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.selection-subtitle {
  font-size: 16px;
  color: #8c8c8c;
}

.selection-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.selection-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.selection-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.selection-card.selected {
  border-color: v-bind(primaryColor);
  background: v-bind(hexToRgba(primaryColor, 0.02));
}

/* 选择卡片的天气效果 */
.selection-card.weather-晴天 {
  background: linear-gradient(135deg, #fff7e6 0%, #ffffff 100%);
}

.selection-card.weather-多云 {
  background: linear-gradient(135deg, #f0f4f8 0%, #ffffff 100%);
}

.selection-card.weather-阴天 {
  background: linear-gradient(135deg, #e8e8e8 0%, #ffffff 100%);
}

.selection-card.weather-小雨 {
  background: linear-gradient(135deg, #e6f3ff 0%, #ffffff 100%);
}

.selection-card.weather-大雨 {
  background: linear-gradient(135deg, #c5e1f5 0%, #ffffff 100%);
}

.selection-card.weather-雪天 {
  background: linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%);
}

.selection-card.weather-default {
  background: #ffffff;
}

.selection-card-time {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 8px;
  font-weight: 500;
}

.selection-card-weather {
  font-size: 16px;
  margin-bottom: 12px;
}

.selection-card-content {
  font-size: 14px;
  color: #595959;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.selection-card-mood {
  display: inline-block;
}

/* 选中后的详情 */
.selected-detail {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 2px solid #f0f0f0;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条样式 */
.notes-list-container::-webkit-scrollbar {
  width: 8px;
}

.notes-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.notes-list-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.notes-list-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 滚动条样式 - 内容区域 */
.detail-content::-webkit-scrollbar {
  width: 6px;
}

.detail-content::-webkit-scrollbar-track {
  background: transparent;
}

.detail-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.detail-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 992px) {
  .notes-layout {
    grid-template-columns: 1fr;
  }

  .left-section {
    height: auto;
  }

  .calendar-card {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .right-section {
    min-height: auto;
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .notes-view {
    padding: 16px;
  }

  .calendar-card {
    padding: 16px;
  }

  .note-card {
    padding: 16px;
  }

  .detail-title {
    font-size: 24px;
  }

  .detail-content {
    font-size: 16px;
  }

  .selection-cards {
    grid-template-columns: 1fr;
  }
}

/* 右下角悬浮操作按钮组 */
.floating-action-buttons {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 1000;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: #ffffff;
  padding: 0;
}

.action-btn svg {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.edit-btn-float {
  color: #595959;
}

.edit-btn-float:hover {
  background: v-bind(primaryColor);
  color: #ffffff;
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(64, 224, 208, 0.4);
}

.add-btn-float {
  color: #595959;
}

.add-btn-float:hover {
  background: v-bind(primaryColor);
  color: #ffffff;
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(64, 224, 208, 0.4);
}

.delete-btn-float {
  color: #595959;
}

.delete-btn-float:hover {
  background: #ff4d4f;
  color: #ffffff;
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(255, 77, 79, 0.4);
}
</style>
