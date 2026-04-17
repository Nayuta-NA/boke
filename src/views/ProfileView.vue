<template>
  <div class="profile-view" v-if="authStore.isAuthenticated && currentUserProfile">
    <div class="profile-container">
      <!-- 个人头部信息 -->
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar-placeholder" v-if="!authStore.user?.avatar">
            <span class="avatar-text">{{ getInitials(currentUserProfile.name) }}</span>
          </div>
          <div class="avatar-image" v-else>
            <img
              :src="authStore.user.avatar"
              :alt="`${currentUserProfile.name}的头像`"
              class="avatar-img"
            />
          </div>
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ currentUserProfile.name }}</h1>
          <p class="profile-title">{{ currentUserProfile.title }}</p>
          <p class="profile-bio">{{ currentUserProfile.bio }}</p>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card" v-for="(value, key) in currentUserStats" :key="key">
            <div class="stat-value">{{ value }}</div>
            <div class="stat-label">{{ getStatLabel(key) }}</div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="profile-content">
        <div class="content-grid">
          <!-- 左侧内容 -->
          <div class="content-left">
            <!-- 技能部分 -->
            <div class="profile-section">
              <h2 class="section-title">技能</h2>
              <div class="skills-container">
                <div
                  v-for="category in currentUserSkillCategories"
                  :key="category.name"
                  class="skill-category"
                >
                  <h3 class="category-title">{{ category.name }}</h3>
                  <div class="skill-tags">
                    <span v-for="skill in category.items" :key="skill" class="skill-tag">
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 兴趣爱好 -->
            <div class="profile-section">
              <h2 class="section-title">兴趣爱好</h2>
              <div class="hobbies-container">
                <span v-for="hobby in currentUserProfile.hobbies" :key="hobby" class="hobby-tag">
                  {{ hobby }}
                </span>
              </div>
            </div>
          </div>

          <!-- 右侧内容：足迹地图 -->
          <div class="content-right">
            <!-- 足迹地图 -->
            <div class="profile-section map-section">
              <h2 class="section-title">旅行足迹</h2>
              <div class="map-container">
                <ChinaMap :visited-cities="visitedCities" class="profile-map" />
              </div>
              <div class="cities-summary">
                <p>
                  已访问 <span class="highlight">{{ currentUserStats?.cities || 0 }}</span> 个城市
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 文章统计和随记统计 - 水平对齐 -->
        <div class="charts-grid">
          <!-- 文章统计图表 -->
          <div class="profile-section">
            <h2 class="section-title">文章统计</h2>
            <div class="chart-container">
              <div class="chart-header">
                <div class="chart-tabs">
                  <button
                    :class="['chart-tab', { active: chartPeriod === '7' }]"
                    @click="chartPeriod = '7'"
                  >
                    近 7 天
                  </button>
                  <button
                    :class="['chart-tab', { active: chartPeriod === '30' }]"
                    @click="chartPeriod = '30'"
                  >
                    近 30 天
                  </button>
                </div>
              </div>
              <div ref="chartRef" class="echart-chart"></div>
            </div>
          </div>

          <!-- 随记统计图表 -->
          <div class="profile-section">
            <h2 class="section-title">随记统计</h2>
            <div class="chart-container">
              <div class="chart-header">
                <div class="chart-tabs">
                  <button
                    :class="['chart-tab', { active: notesChartPeriod === '7' }]"
                    @click="notesChartPeriod = '7'"
                  >
                    近 7 天
                  </button>
                  <button
                    :class="['chart-tab', { active: notesChartPeriod === '30' }]"
                    @click="notesChartPeriod = '30'"
                  >
                    近 30 天
                  </button>
                </div>
              </div>
              <div ref="notesChartRef" class="echart-chart"></div>
            </div>
          </div>
        </div>

        <!-- 全局快速配置 - 横跨两列 -->
        <div class="quick-config-section">
          <div class="quick-config-card" @click="goToConfig">
            <div class="config-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M19.4 15C19.7988 14.8291 20.1096 14.5009 20.2775 14.0901C20.4454 13.6793 20.4597 13.2209 20.3176 12.8001L19.9976 11.8501C20.0644 11.4201 20.0644 10.9801 19.9976 10.5501L20.3176 9.6001C20.4597 9.17927 20.4454 8.72094 20.2775 8.31014C20.1096 7.89934 19.7988 7.57115 19.4 7.4001L18.9176 7.1901C18.5568 6.8701 18.2576 6.4901 18.0376 6.0701L17.6376 5.3101C17.4268 4.9101 17.0768 4.5901 16.6576 4.4101C16.2384 4.2301 15.7776 4.2101 15.3476 4.3501L14.8276 4.5201C14.4168 4.3501 14.0368 4.1201 13.7076 3.8401L13.2776 3.4701C12.9768 3.2101 12.5968 3.0501 12.1976 3.0101C11.7984 2.9701 11.3976 3.0501 11.0476 3.2401L10.5676 3.5001C10.1568 3.6701 9.7168 3.7501 9.2776 3.7301H8.7276C8.2776 3.7301 7.8476 3.9101 7.5376 4.2301L7.1876 4.5901C6.8668 4.9201 6.4768 5.1701 6.0476 5.3201L5.5876 5.4801C5.1576 5.6301 4.7876 5.9101 4.5376 6.2801C4.2876 6.6501 4.1676 7.0901 4.1976 7.5301L4.2776 8.0701C4.1168 8.4801 4.0368 8.9201 4.0476 9.3601C4.0584 9.8001 4.1576 10.2301 4.3376 10.6301L4.5876 11.1701C4.5876 11.6101 4.4976 12.0401 4.3276 12.4501L4.0876 13.0201C3.9268 13.4001 3.8776 13.8201 3.9476 14.2301C4.0176 14.6401 4.2076 15.0201 4.4876 15.3201L4.8376 15.6901C5.1568 16.0301 5.3768 16.4501 5.4776 16.9101C5.5784 17.3701 5.5576 17.8501 5.4176 18.3001L5.1576 19.1401C5.0268 19.5601 5.0676 20.0201 5.2676 20.4101C5.4676 20.8001 5.8076 21.0901 6.2176 21.2101L6.6776 21.3501C7.0968 21.4801 7.4568 21.7301 7.7276 22.0701C7.9984 22.4101 8.3676 22.6501 8.7876 22.7601C9.2076 22.8701 9.6576 22.8401 10.0676 22.6701L10.5476 22.4701C10.9568 22.6401 11.4068 22.7201 11.8576 22.7001C12.3084 22.6801 12.7476 22.5601 13.1376 22.3501L13.6176 22.0901C14.0268 21.8701 14.4968 21.7801 14.9576 21.8301C15.4184 21.8801 15.8576 22.0501 16.2276 22.3201L16.6176 22.6001C17.0068 22.8801 17.4876 23.0201 17.9676 22.9901C18.4476 22.9601 18.9076 22.7601 19.2676 22.4201L19.6076 22.1001C19.9468 21.7801 20.3668 21.5801 20.8176 21.5201C21.2684 21.4601 21.7176 21.5601 22.0976 21.8001L22.4776 22.0401C22.8576 22.2801 23.1776 22.6201 23.3876 23.0101C23.5976 23.4001 23.6876 23.8501 23.6476 24.3001V24.3001"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="config-content">
              <h3>全局快速配置</h3>
              <p>管理系统设置、权限、通知等配置项</p>
            </div>
            <div class="config-arrow">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <button class="enter-config-btn" @click="goToConfig">
            进入配置页面
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="profile-unauthenticated" v-else>
    <div class="unauthenticated-content">
      <h2>请先登录</h2>
      <p>您需要登录才能查看个人页面</p>
      <router-link to="/login" class="login-link">前往登录</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ChinaMap from '@/components/map/Chinamap.vue'
import { profileInfo, skillCategories, statsData } from '@/data/profile'
import { activityAPI, articleAPI, travelAPI, noteAPI, projectAPI } from '@/lib/api'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const chartRef = ref<HTMLElement | null>(null)
const notesChartRef = ref<HTMLElement | null>(null)
const chartPeriod = ref<'7' | '30'>('7')
const notesChartPeriod = ref<'7' | '30'>('7')
let chartInstance: echarts.ECharts | null = null
let notesChartInstance: echarts.ECharts | null = null

// 真实的统计数据
const realStats = ref({
  articles: 0,
  travels: 0,
  cities: 0,
  notes: 0,
  projects: 0,
})

// 真实访问过的城市列表
const visitedCities = ref<string[]>([])

// 获取主题色的计算属性（实时从 CSS 变量中读取）
const primaryColor = computed(() => {
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() ||
    '#40e0d0'
  )
})

// 加载真实数据
const loadRealData = async () => {
  try {
    // 获取文章数量
    const articlesResponse = await articleAPI.getAll()
    realStats.value.articles = articlesResponse.data.length

    // 获取旅行记录和城市
    const travelsResponse = await travelAPI.getAll()
    const travels = travelsResponse.data
    realStats.value.travels = travels.length
    
    // 从旅行记录中提取城市（使用 province 字段）
    const citiesSet = new Set<string>()
    travels.forEach((travel: any) => {
      // 优先使用 province 字段，其次从 location 中提取
      if (travel.province) {
        citiesSet.add(travel.province)
      }
      // 如果 location 看起来像城市名（不包含"·"等特殊符号），也加入
      if (travel.location && !travel.location.includes('·') && travel.location.length <= 4) {
        citiesSet.add(travel.location)
      }
    })
    visitedCities.value = Array.from(citiesSet)
    realStats.value.cities = citiesSet.size

    // 获取随记数量
    const notesResponse = await noteAPI.getAll()
    realStats.value.notes = notesResponse.data.length

    // 获取项目数量
    const projectsResponse = await projectAPI.getAll()
    realStats.value.projects = projectsResponse.data.length
  } catch (error) {
    console.error('加载真实数据失败:', error)
  }
}

// 当前用户个人资料
const currentUserProfile = computed(() => {
  if (authStore.user) {
    return {
      name: authStore.user.name || authStore.user.username,
      title: authStore.user.userRole ? `${authStore.user.userRole}` : '前端开发工程师 & 旅行爱好者',
      bio:
        authStore.user.introduction ||
        '热爱技术与旅行的开发者，专注于前端技术研究与实践，喜欢在代码世界里探索，在真实世界中行走。通过文字记录技术成长与旅行见闻，分享生活中的点点滴滴。',
      skills: [
        'Vue.js',
        'TypeScript',
        'Node.js',
        'CSS3 & HTML5',
        'Responsive Design',
        'React',
        'Angular',
        'Webpack',
      ],
      hobbies: ['编程', '阅读', '旅行', '摄影', '骑行'],
    }
  }
  return profileInfo
})

// 当前用户统计数据（使用真实数据）
const currentUserStats = computed(() => {
  return {
    articles: realStats.value.articles || 0,
    travels: realStats.value.travels || 0,
    cities: realStats.value.cities || 0,
    notes: realStats.value.notes || 0,
    projects: realStats.value.projects || 0,
  }
})

// 当前用户技能分类
const currentUserSkillCategories = computed(() => {
  if (authStore.user) {
    return [
      {
        name: '前端技术',
        items: ['Vue.js', 'TypeScript', 'React', 'Angular', 'HTML/CSS'],
      },
      {
        name: '后端技术',
        items: ['Node.js', 'Python', 'Java', 'Express', 'MongoDB'],
      },
      {
        name: '其他技能',
        items: ['Git', 'Docker', 'AWS', 'CI/CD', 'Agile'],
      },
    ]
  }
  return skillCategories
})

// 随记统计数据
const notesChartData = ref<any[]>([])

// 获取随记统计数据
const loadNotesChartData = async (days: number) => {
  try {
    const notesResponse = await noteAPI.getAll()
    const notes = notesResponse.data
    
    // 按日期统计随记数量
    const dateMap = new Map<string, number>()
    const now = new Date()
    
    // 初始化最近 N 天的数据
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      dateMap.set(dateStr, 0)
    }
    
    // 统计实际随记数量
    notes.forEach((note: any) => {
      const noteDate = new Date(note.createdAt || note.created_at || note.date)
      const dateStr = noteDate.toISOString().split('T')[0]
      if (dateMap.has(dateStr)) {
        dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
      }
    })
    
    // 转换为数组格式
    notesChartData.value = Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  } catch (error) {
    console.error('获取随记统计数据失败:', error)
    notesChartData.value = []
  }
}

// 初始化随记统计图表
const initNotesChart = () => {
  if (!notesChartRef.value) return

  if (!notesChartInstance) {
    notesChartInstance = echarts.init(notesChartRef.value)
  }

  const dates = notesChartData.value.map((item) => item.date.slice(5)) // 只显示 MM-DD
  const counts = notesChartData.value.map((item) => item.count)

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e0e0',
      textStyle: { color: '#333' },
      formatter: '{b}<br />新增随记：{c}篇',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#e0e0e0' } },
      axisLabel: { color: '#666' },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLine: { lineStyle: { color: '#e0e0e0' } },
      axisLabel: { color: '#666' },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
    },
    series: [
      {
        data: counts,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: primaryColor.value,
          borderColor: '#fff',
          borderWidth: 2,
        },
        lineStyle: {
          color: primaryColor.value,
          width: 3,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: hexToRgba(primaryColor.value, 0.3) },
            { offset: 1, color: hexToRgba(primaryColor.value, 0.05) },
          ]),
        },
      },
    ],
  }

  notesChartInstance.setOption(option)
}

// 监听随记统计周期变化
watch(notesChartPeriod, async () => {
  await loadNotesChartData(parseInt(notesChartPeriod.value))
  initNotesChart()
})

// 模拟文章新增数据
const generateMockData = (days: number) => {
  const data = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    // 随机生成 0-10 篇文章
    const count = Math.floor(Math.random() * 11)
    data.push({ date: dateStr, count })
  }

  return data
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const mockData = generateMockData(parseInt(chartPeriod.value))
  const dates = mockData.map((item) => item.date.slice(5)) // 只显示 MM-DD
  const counts = mockData.map((item) => item.count)

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e0e0',
      textStyle: { color: '#333' },
      formatter: '{b}<br />新增文章：{c}篇',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#e0e0e0' } },
      axisLabel: { color: '#666' },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLine: { lineStyle: { color: '#e0e0e0' } },
      axisLabel: { color: '#666' },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
    },
    series: [
      {
        data: counts,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: primaryColor.value,
          borderColor: '#fff',
          borderWidth: 2,
        },
        lineStyle: {
          color: primaryColor.value,
          width: 3,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: hexToRgba(primaryColor.value, 0.3) },
            { offset: 1, color: hexToRgba(primaryColor.value, 0.05) },
          ]),
        },
      },
    ],
  }

  chartInstance.setOption(option)
}

// 监听周期变化
watch(chartPeriod, () => {
  initChart()
})

// 十六进制颜色转 RGBA
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 跳转全局配置页面
const goToConfig = () => {
  router.push('/settings/global')
}

onMounted(async () => {
  // 加载真实数据
  await loadRealData()
  
  // 初始化文章统计图表
  // 延迟初始化图表，确保 DOM 已渲染
  setTimeout(() => {
    initChart()
  }, 100)

  // 加载随记统计数据并初始化图表
  await loadNotesChartData(parseInt(notesChartPeriod.value))
  setTimeout(() => {
    initNotesChart()
  }, 150)

  // 窗口大小变化时重新渲染图表
  window.addEventListener('resize', () => {
    chartInstance?.resize()
    notesChartInstance?.resize()
  })
})

// 获取姓名首字母
const getInitials = (name: string) => {
  return name.charAt(0)
}

// 获取统计标签
const getStatLabel = (key: string) => {
  const labels: Record<string, string> = {
    articles: '文章',
    travels: '旅行',
    cities: '城市',
    notes: '随记',
    projects: '项目',
  }
  return labels[key] || key
}
</script>

<style scoped>
.profile-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.profile-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
}

/* 个人头部信息 */
.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, v-bind(primaryColor), v-bind(hexToRgba(primaryColor, 0.8)));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  font-weight: bold;
}

.avatar-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 2.2rem;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.profile-title {
  font-size: 1.2rem;
  color: v-bind(primaryColor);
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.profile-bio {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.7;
  margin: 0;
}

/* 统计信息 */
.stats-section {
  margin-bottom: 2.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px v-bind(hexToRgba(primaryColor, 0.2));
}

.stat-value {
  font-size: 2.2rem;
  font-weight: bold;
  color: v-bind(primaryColor);
  margin-bottom: 0.5rem;
  line-height: 1;
}

.stat-label {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

/* 内容区域 */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

.content-left {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.content-right {
  display: flex;
  flex-direction: column;
}

.map-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.map-section .section-title {
  flex-shrink: 0;
}

.profile-section {
  margin-bottom: 0;
}

.section-title {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid v-bind(primaryColor);
  display: inline-block;
}

/* 技能部分 */
.skills-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skill-category {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.2rem;
}

.category-title {
  font-size: 1.1rem;
  color: v-bind(primaryColor);
  margin: 0 0 1rem 0;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.skill-tag {
  background: white;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 兴趣爱好 */
.hobbies-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.hobby-tag {
  background: v-bind(primaryColor);
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.95rem;
}

/* 图表网格 - 水平对齐 */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

/* 文章统计图表 */
.chart-container {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-tabs {
  display: flex;
  gap: 0.5rem;
}

.chart-tab {
  padding: 0.5rem 1rem;
  border: none;
  background: white;
  color: #666;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.chart-tab:hover {
  background: v-bind(hexToRgba(primaryColor, 0.1));
  color: v-bind(primaryColor);
}

.chart-tab.active {
  background: v-bind(primaryColor);
  color: white;
}

.echart-chart {
  width: 100%;
  height: 280px;
}

/* 全局快速配置 */
.quick-config-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quick-config-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(
    135deg,
    v-bind(primaryColor) 0%,
    v-bind(hexToRgba(primaryColor, 0.8)) 100%
  );
  border-radius: 10px;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px v-bind(hexToRgba(primaryColor, 0.3));
}

.quick-config-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px v-bind(hexToRgba(primaryColor, 0.45));
}

.config-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.config-icon svg {
  width: 28px;
  height: 28px;
}

.config-content {
  flex: 1;
  color: white;
}

.config-content h3 {
  margin: 0 0 0.3rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.config-content p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.95;
}

.config-arrow {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: transform 0.3s ease;
}

.quick-config-card:hover .config-arrow {
  transform: translateX(5px);
}

.config-arrow svg {
  width: 20px;
  height: 20px;
}

.enter-config-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.9rem 1.5rem;
  background: white;
  color: v-bind(primaryColor);
  border: 2px solid v-bind(primaryColor);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px v-bind(hexToRgba(primaryColor, 0.2));
}

.enter-config-btn:hover {
  background: v-bind(primaryColor);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px v-bind(hexToRgba(primaryColor, 0.35));
}

.enter-config-btn svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.enter-config-btn:hover svg {
  transform: translateX(5px);
}

/* 地图部分 */
.map-container {
  flex: 1;
  min-height: 400px;
  margin-bottom: 1.5rem;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.map-container :deep(.china-map-container) {
  height: 100% !important;
  min-height: 400px !important;
  padding: 0 !important;
}

.map-container :deep(.map-container) {
  height: 100% !important;
  min-height: 400px !important;
}

.profile-map {
  height: 100%;
  width: 100%;
}

.cities-summary {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  flex-shrink: 0;
}

.highlight {
  color: v-bind(primaryColor);
  font-weight: bold;
}

/* 未认证状态 */
.profile-unauthenticated {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 2rem;
}

.unauthenticated-content {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.unauthenticated-content h2 {
  color: #333;
  margin-bottom: 1rem;
}

.unauthenticated-content p {
  color: #666;
  margin-bottom: 2rem;
}

.login-link {
  display: inline-block;
  padding: 0.8rem 2rem;
  background: v-bind(primaryColor);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.3s;
}

.login-link:hover {
  background: v-bind(hexToRgba(primaryColor, 0.85));
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-grid,
  .charts-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-info {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .profile-view {
    padding: 1rem;
  }

  .profile-container {
    padding: 1.5rem;
  }

  .profile-name {
    font-size: 1.8rem;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .map-container {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .activity-card {
    flex-direction: column;
  }

  .map-container {
    height: 250px;
  }
}
</style>
