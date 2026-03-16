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
            <img :src="authStore.user.avatar" :alt="`${currentUserProfile.name}的头像`" class="avatar-img" />
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
                    <span 
                      v-for="skill in category.items" 
                      :key="skill"
                      class="skill-tag"
                    >
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
                <span 
                  v-for="hobby in currentUserProfile.hobbies" 
                  :key="hobby"
                  class="hobby-tag"
                >
                  {{ hobby }}
                </span>
              </div>
            </div>
          </div>

          <!-- 右侧内容 -->
          <div class="content-right">
            <!-- 足迹地图 -->
            <div class="profile-section">
              <h2 class="section-title">足迹地图</h2>
              <div class="map-container">
                <ChinaMap :visited-cities="visitedCities" />
              </div>
              <div class="cities-summary">
                <p>已访问 <span class="highlight">{{ currentUserStats?.cities || 0 }}</span> 个城市， 
                  踏足 <span class="highlight">{{ currentUserStats?.countries || 0 }}</span> 个国家/地区
                </p>
              </div>
            </div>

            <!-- 最新活动 -->
            <div class="profile-section">
              <h2 class="section-title">最新活动</h2>
              <div class="activities-container">
                <div 
                  v-for="activity in recentActivities" 
                  :key="activity.id"
                  class="activity-card"
                >
                  <div class="activity-type" :class="getActivityTypeClass(activity.type)">
                    {{ activity.type }}
                  </div>
                  <div class="activity-content">
                    <h3 class="activity-title">{{ activity.title }}</h3>
                    <p class="activity-date">{{ activity.date }}</p>
                    <p class="activity-desc">{{ activity.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ChinaMap from '@/components/map/Chinamap.vue'
import { profileInfo, skillCategories, statsData } from '@/data/profile'
import { activityAPI } from '@/lib/api'

const authStore = useAuthStore()

// 当前用户个人资料
const currentUserProfile = computed(() => {
  if (authStore.user) {
    return {
      name: authStore.user.userName || authStore.user.username,
      title: authStore.user.userRole ? `${authStore.user.userRole}` : '前端开发工程师 & 旅行爱好者',
      bio: '热爱技术与旅行的开发者，专注于前端技术研究与实践，喜欢在代码世界里探索，在真实世界中行走。通过文字记录技术成长与旅行见闻，分享生活中的点点滴滴。',
      skills: [
        'Vue.js', 'TypeScript', 'Node.js', 'CSS3 & HTML5', 
        'Responsive Design', 'React', 'Angular', 'Webpack'
      ],
      hobbies: ['编程', '阅读', '旅行', '摄影', '骑行']
    }
  }
  return profileInfo
})

// 当前用户统计数据
const currentUserStats = computed(() => {
  if (authStore.user) {
    // 这里可以从后端API获取用户统计数据
    return {
      articles: authStore.user.articlesCount || 12,
      travels: authStore.user.travelsCount || 8,
      countries: authStore.user.countriesCount || 3,
      cities: authStore.user.citiesCount || 15,
      notes: authStore.user.notesCount || 24,
      projects: authStore.user.projectsCount || 5
    }
  }
  return statsData
})

// 当前用户技能分类
const currentUserSkillCategories = computed(() => {
  if (authStore.user) {
    return [
      {
        name: '前端技术',
        items: ['Vue.js', 'TypeScript', 'React', 'Angular', 'HTML/CSS']
      },
      {
        name: '后端技术', 
        items: ['Node.js', 'Python', 'Java', 'Express', 'MongoDB']
      },
      {
        name: '其他技能',
        items: ['Git', 'Docker', 'AWS', 'CI/CD', 'Agile']
      }
    ]
  }
  return skillCategories
})

// 最新活动数据
const recentActivities = ref<any[]>([])

// 获取最新活动
const loadRecentActivities = async () => {
  try {
    const response = await activityAPI.getRecentActivities()
    recentActivities.value = response.data.slice(0, 5) // 只取最近的5条
  } catch (error) {
    console.error('获取最新活动失败:', error)
    // 如果API失败，可以使用一些默认数据
    recentActivities.value = [
      {
        id: 1,
        type: '文章',
        title: '欢迎来到个人页面',
        date: new Date().toISOString().split('T')[0],
        desc: '这是您的个人页面，您可以在这里查看个人信息和活动。'
      }
    ]
  }
}

onMounted(() => {
  loadRecentActivities()
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
    countries: '国家',
    cities: '城市',
    notes: '随记',
    projects: '项目'
  }
  return labels[key] || key
}

// 获取活动类型样式类
const getActivityTypeClass = (type: string) => {
  const typeClasses: Record<string, string> = {
    '文章': 'article-type',
    '旅行': 'travel-type',
    '随记': 'note-type'
  }
  return typeClasses[type] || ''
}

// 模拟访问过的城市（实际项目中应根据用户数据获取）
const visitedCities = ref(['北京', '上海', '西安', '成都', '广州', '深圳', '杭州', '南京'])
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
  background: linear-gradient(135deg, #40e0d0, #40c4d0);
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
  color: #40e0d0;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(64, 224, 208, 0.2);
}

.stat-value {
  font-size: 2.2rem;
  font-weight: bold;
  color: #40e0d0;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.stat-label {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

/* 内容区域 */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

.profile-section {
  margin-bottom: 2rem;
}

.section-title {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #40e0d0;
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
  color: #40e0d0;
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* 兴趣爱好 */
.hobbies-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.hobby-tag {
  background: #40e0d0;
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.95rem;
}

/* 地图部分 */
.map-container {
  height: 350px;
  margin-bottom: 1.5rem;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.cities-summary {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
}

.highlight {
  color: #40e0d0;
  font-weight: bold;
}

/* 最新活动 */
.activities-container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.activity-card {
  display: flex;
  gap: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
}

.activity-card:hover {
  transform: translateX(5px);
}

.activity-type {
  flex-shrink: 0;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  align-self: flex-start;
}

.article-type {
  background: #40e0d0;
}

.travel-type {
  background: #ff9a8b;
}

.note-type {
  background: #a188ff;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 0.3rem 0;
}

.activity-date {
  font-size: 0.9rem;
  color: #999;
  margin: 0 0 0.5rem 0;
}

.activity-desc {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  background: #40e0d0;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.3s;
}

.login-link:hover {
  background: #35c9b9;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-grid {
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