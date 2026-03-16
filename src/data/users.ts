// 用户相关数据类型和模拟数据

export interface User {
  id: number
  username: string
  password?: string
  email: string
  name: string
  avatar?: string
  userPicture?: string
  userName?: string
  userRole?: string
  webLogo?: string
  mainColor?: string
}

export interface UserProfile {
  name: string
  title: string
  bio: string
  skills: string[]
  hobbies: string[]
}

export interface UserStats {
  articles: number
  travels: number
  countries: number
  cities: number
  notes: number
  projects: number
}

// 模拟用户数据
export const users: User[] = [
  {
    id: 1,
    username: 'nayuta',
    password: '$2a$10$92IXUNpkjO0rOQ5HiiBJeM3Ir9F1lhnGcOpRa3zTDMJYO7rb6BRFO',
    email: 'nayuta@example.com',
    name: 'Nayuta',
    avatar: '/src/IMG/TX/TX.jpg',
    userPicture: '/src/IMG/TX/TX.jpg',
    userName: 'Nayuta',
    userRole: 'admin',
    webLogo: '/src/IMG/TX/TX.jpg',
    mainColor: '#1890ff'
  },
  {
    id: 2,
    username: 'zhangxiaoming',
    password: '$2a$10$92IXUNpkjO0rOQ5HiiBJeM3Ir9F1lhnGcOpRa3zTDMJYO7rb6BRFO',
    email: 'zhangxm@example.com',
    name: '张小明',
    avatar: '/src/IMG/TX/TX.jpg',
    userPicture: '/src/IMG/TX/TX.jpg',
    userName: '张小明',
    userRole: 'user',
    webLogo: '/src/IMG/TX/TX.jpg',
    mainColor: '#52c41a'
  },
  {
    id: 3,
    username: 'lisi',
    password: '$2a$10$92IXUNpkjO0rOQ5HiiBJeM3Ir9F1lhnGcOpRa3zTDMJYO7rb6BRFO',
    email: 'lisi@example.com',
    name: '李四',
    avatar: '/src/IMG/TX/TX.jpg',
    userPicture: '/src/IMG/TX/TX.jpg',
    userName: '李四',
    userRole: 'user',
    webLogo: '/src/IMG/TX/TX.jpg',
    mainColor: '#f5222d'
  }
]

// 模拟用户个人资料数据
export const userProfiles: Record<number, UserProfile> = {
  1: {
    name: 'Nayuta',
    title: '系统管理员',
    bio: '欢迎来到我的个人空间，这里记录了我的旅行、技术分享和生活感悟。',
    skills: [
      'Vue.js', 'TypeScript', 'Node.js', 'CSS3 & HTML5', 
      'Responsive Design', 'React', 'Angular', 'Webpack'
    ],
    hobbies: ['编程', '旅行', '摄影', '阅读']
  },
  2: {
    name: '张小明',
    title: '前端开发工程师 & 旅行爱好者',
    bio: '热爱技术与旅行的开发者，专注于前端技术研究与实践，喜欢在代码世界里探索，在真实世界中行走。通过文字记录技术成长与旅行见闻，分享生活中的点点滴滴。',
    skills: [
      'Vue.js', 'TypeScript', 'Node.js', 'CSS3 & HTML5', 
      'Responsive Design', 'React', 'Angular', 'Webpack'
    ],
    hobbies: ['编程', '阅读', '旅行', '摄影', '骑行']
  },
  3: {
    name: '李四',
    title: '后端开发工程师',
    bio: '专注于后端技术开发，热爱开源项目，喜欢研究各种新技术。',
    skills: [
      'Java', 'Spring Boot', 'MySQL', 'Redis', 'Docker'
    ],
    hobbies: ['编程', '阅读', '音乐', '电影']
  }
}

// 模拟用户统计数据
export const userStats: Record<number, UserStats> = {
  1: {
    articles: 20,
    travels: 25,
    countries: 8,
    cities: 35,
    notes: 40,
    projects: 15
  },
  2: {
    articles: 12,
    travels: 15,
    countries: 5,
    cities: 20,
    notes: 25,
    projects: 8
  },
  3: {
    articles: 5,
    travels: 8,
    countries: 3,
    cities: 10,
    notes: 15,
    projects: 12
  }
}

// 模拟用户技能分类数据
export const userSkillCategories: Record<number, any[]> = {
  1: [
    {
      name: '前端开发',
      items: ['Vue.js', 'React', 'Angular', 'TypeScript', 'JavaScript']
    },
    {
      name: '样式与设计',
      items: ['CSS3', 'Sass/Less', 'Tailwind CSS', 'Responsive Design']
    },
    {
      name: '构建与工具',
      items: ['Webpack', 'Vite', 'Git', 'npm/yarn', 'ESLint']
    },
    {
      name: '其他技能',
      items: ['Node.js', 'UI/UX设计', 'PWA', 'RESTful API']
    }
  ],
  2: [
    {
      name: '前端开发',
      items: ['Vue.js', 'React', 'Angular', 'TypeScript', 'JavaScript']
    },
    {
      name: '样式与设计',
      items: ['CSS3', 'Sass/Less', 'Tailwind CSS', 'Responsive Design']
    },
    {
      name: '构建与工具',
      items: ['Webpack', 'Vite', 'Git', 'npm/yarn', 'ESLint']
    },
    {
      name: '其他技能',
      items: ['Node.js', 'UI/UX设计', 'PWA', 'RESTful API']
    }
  ],
  3: [
    {
      name: '后端开发',
      items: ['Java', 'Spring Boot', 'MyBatis', 'Hibernate']
    },
    {
      name: '数据库',
      items: ['MySQL', 'PostgreSQL', 'Redis', 'MongoDB']
    },
    {
      name: '运维与部署',
      items: ['Docker', 'Kubernetes', 'Linux', 'Nginx']
    },
    {
      name: '其他技能',
      items: ['微服务', '消息队列', 'API设计']
    }
  ]
}