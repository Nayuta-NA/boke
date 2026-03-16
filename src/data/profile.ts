// 个人页面统一数据
import { articlesData } from './articles'
import { detailTravelData } from './travels'
import { detailNotesData } from './notes'

// 个人基本信息
export interface ProfileInfo {
  name: string
  title: string
  bio: string
  skills: string[]
  hobbies: string[]
}

// 统计数据
export interface StatsData {
  articles: number
  travels: number
  countries: number
  cities: number
  notes: number
  projects: number
}

// 旅行地点信息
export interface TravelLocation {
  name: string
  location: string
  year: number
}

// 技能分类
export interface SkillCategory {
  name: string
  items: string[]
}

// 个人数据
export const profileInfo: ProfileInfo = {
  name: '张小明',
  title: '前端开发工程师 & 旅行爱好者',
  bio: '热爱技术与旅行的开发者，专注于前端技术研究与实践，喜欢在代码世界里探索，在真实世界中行走。通过文字记录技术成长与旅行见闻，分享生活中的点点滴滴。',
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

// 技能分类数据
export const skillCategories: SkillCategory[] = [
  {
    name: '前端开发',
    items: ['Vue.js', 'React', 'Angular', 'TypeScript', 'JavaScript'],
  },
  {
    name: '样式与设计',
    items: ['CSS3', 'Sass/Less', 'Tailwind CSS', 'Responsive Design'],
  },
  {
    name: '构建与工具',
    items: ['Webpack', 'Vite', 'Git', 'npm/yarn', 'ESLint'],
  },
  {
    name: '其他技能',
    items: ['Node.js', 'UI/UX设计', 'PWA', 'RESTful API'],
  },
]

// 统计数据
export const statsData: StatsData = {
  articles: articlesData.length,
  travels: detailTravelData.filter((item) => item.location === '中国' && item.province).length,
  countries: [...new Set(detailTravelData.map((item) => item.location))].length,
  cities: [
    ...new Set(
      detailTravelData.filter((item) => item.location === '中国').map((item) => item.name)
    ),
  ].length,
  notes: detailNotesData.length,
  projects: 3, // 默认项目数量，将在组件中动态更新
}

// 访问过的城市（用于地图展示）
export const visitedCities = [
  ...new Set(detailTravelData.filter((item) => item.location === '中国').map((item) => item.name)),
]

// 旅行足迹数据
export const travelFootprints: TravelLocation[] = detailTravelData.map((travel) => ({
  name: travel.name,
  location: travel.location,
  year: travel.year,
}))

// 最新活动（文章、旅行、随记的混合）
export const recentActivities = [
  ...articlesData.slice(0, 3).map((item) => ({
    id: item.id,
    type: '文章',
    title: item.title,
    date: item.date,
    desc: item.desc,
  })),
  ...detailTravelData.slice(0, 3).map((item) => ({
    id: item.name,
    type: '旅行',
    title: item.name,
    date: `${item.year}年`,
    desc: `在${item.location}的精彩旅程`,
  })),
  ...detailNotesData.slice(0, 3).map((item) => ({
    id: item.id,
    type: '随记',
    title: item.title,
    date: item.date,
    desc: item.desc,
  })),
]
  .sort((a, b) => {
    // 简单按日期排序
    return b.date.localeCompare(a.date)
  })
  .slice(0, 6)
