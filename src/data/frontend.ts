// 统一的前端技术数据

// 定义技术栈分类类型
export interface TechCategory {
  name: string
  items: string[]
}

// 定义项目类型
export interface Project {
  id: number
  title: string
  cover: string
  framework: string
  desc: string
  tags: string[]
  link: string
  github: string
  demo: string
}

// 首页展示的技术栈数据
export const homeTechCategories: TechCategory[] = [
  {
    name: '前端基础',
    items: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript'],
  },
  {
    name: '框架与库',
    items: ['React', 'Vue', 'Angular', 'Tailwind CSS', 'Sass'],
  },
  {
    name: '工具与工程化',
    items: ['Webpack', 'Vite', 'Git', 'npm/yarn', 'ESLint'],
  },
  {
    name: '其他技能',
    items: ['UI/UX设计', '响应式设计', 'PWA', 'RESTful API'],
  },
]

// 首页展示的项目数据
export const homeProjects: Project[] = [
  {
    id: 1,
    title: '数据可视化仪表盘',
    cover:
      'https://design.gemcoder.com/staticResource/echoAiSystemImages/935d1bafb9beae758115e88caa37125c.png',
    framework: 'React',
    desc: '基于React和ECharts构建的响应式数据可视化仪表盘，支持多种图表类型和数据筛选功能。',
    tags: ['React', 'ECharts', 'TypeScript', 'Ant Design'],
    link: '/frontend/projects',
    github: 'javascript:void(0)',
    demo: 'javascript:void(0)',
  },
  {
    id: 2,
    title: '响应式电子商务网站',
    cover:
      'https://design.gemcoder.com/staticResource/echoAiSystemImages/ca2fcd9bb044f7aba96ce65fcbc00059.png',
    framework: 'Vue',
    desc: '基于Vue和Vuex构建的全功能电子商务网站，包含商品展示、购物车、结账流程和用户中心等模块。',
    tags: ['Vue', 'Vuex', 'Tailwind CSS', 'REST API'],
    link: '/frontend/projects',
    github: 'javascript:void(0)',
    demo: 'javascript:void(0)',
  },
  {
    id: 3,
    title: 'PWA天气应用',
    cover:
      'https://design.gemcoder.com/staticResource/echoAiSystemImages/420c4323ce5b988e00b5cba62f9e45bc.png',
    framework: 'JavaScript',
    desc: '基于原生JavaScript开发的渐进式Web应用，提供实时天气数据和5天预报，支持离线访问和添加到主屏幕。',
    tags: ['JavaScript', 'PWA', 'IndexedDB', 'Weather API'],
    link: '/frontend/projects',
    github: 'javascript:void(0)',
    demo: 'javascript:void(0)',
  },
]

// 详情页使用的完整项目数据（可以扩展更多）
export const detailProjects: Project[] = [
  ...homeProjects,
  {
    id: 4,
    title: '移动应用开发',
    cover:
      'https://design.gemcoder.com/staticResource/echoAiSystemImages/mobile-app.png',
    framework: 'React Native',
    desc: '使用React Native开发的跨平台移动应用，支持iOS和Android平台，具有良好的性能和用户体验。',
    tags: ['React Native', 'Redux', 'Firebase'],
    link: '/frontend/projects',
    github: 'javascript:void(0)',
    demo: 'javascript:void(0)',
  },
  {
    id: 5,
    title: 'Node.js后端服务',
    cover:
      'https://design.gemcoder.com/staticResource/echoAiSystemImages/backend-service.png',
    framework: 'Node.js',
    desc: '基于Node.js和Express构建的RESTful API服务，支持用户认证、数据管理和文件上传等功能。',
    tags: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    link: '/frontend/projects',
    github: 'javascript:void(0)',
    demo: 'javascript:void(0)',
  },
]