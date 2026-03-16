// 统一的文章数据
export interface Article {
  id: number
  title: string
  cover?: string
  category: string
  desc: string
  excerpt: string
  author: string
  date: string
  readTime: string
  commentCount: number
  link: string
  tags?: string[]
}

// 统一的文章数据
export const articlesData: Article[] = [
  {
    id: 1,
    title: 'Tailwind CSS 实用技巧与最佳实践',
    category: '前端',
    desc: '探索Tailwind CSS的高级用法，包括自定义配置、响应式设计和优化技巧，帮助你更高效地构建现代Web界面...',
    excerpt:
      '探索Tailwind CSS的高级用法，包括自定义配置、响应式设计和优化技巧，帮助你更高效地构建现代Web界面...',
    author: '张小明',
    date: '2023-10-15',
    readTime: '8分钟阅读',
    commentCount: 24,
    link: '/articles/1',
    tags: ['CSS', 'Tailwind', '前端框架'],
  },
  {
    id: 3,
    title: 'JavaScript异步编程完全指南：从回调到Promise',
    category: '前端',
    desc: '深入理解JavaScript异步编程的核心概念，掌握从回调函数到Promise再到async/await的演进过程...',
    excerpt:
      '深入理解JavaScript异步编程的核心概念，掌握从回调函数到Promise再到async/await的演进过程...',
    author: '李小红',
    date: '2023-09-15',
    readTime: '15分钟阅读',
    commentCount: 42,
    link: '/articles/3',
    tags: ['JavaScript', '异步编程', 'Promise'],
  },
  {
    id: 4,
    title: 'Vue 3 Composition API 全面解析',

    category: '前端',
    desc: 'Vue 3 Composition API 的详细解析，包括与 Options API 的对比，以及如何更好地组织和重用组件逻辑...',
    excerpt:
      'Vue 3 Composition API 的详细解析，包括与 Options API 的对比，以及如何更好地组织和重用组件逻辑...',
    author: '王小刚',
    date: '2023-08-22',
    readTime: '10分钟阅读',
    commentCount: 31,
    link: '/articles/4',
    tags: ['Vue', 'Composition API', '前端框架'],
  },
  {
    id: 6,
    title: '响应式Web设计的最新趋势',

    category: '前端',
    desc: '探讨响应式Web设计的最新趋势和技术，包括CSS Grid、Flexbox和移动优先的设计方法...',
    excerpt: '探讨响应式Web设计的最新趋势和技术，包括CSS Grid、Flexbox和移动优先的设计方法...',
    author: '李小红',
    date: '2023-07-12',
    readTime: '9分钟阅读',
    commentCount: 18,
    link: '/articles/6',
    tags: ['响应式设计', 'CSS', '移动优先'],
  },
  // {
  //   id: 7,
  //   title: '探索冰岛：极光与温泉的奇幻之旅',
  //   cover:
  //     'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  //   category: '旅游',
  //   desc: '冰岛旅行的全面指南，包括黄金圈路线、蓝湖温泉、极光观测点和当地特色美食推荐...',
  //   excerpt: '冰岛旅行的全面指南，包括黄金圈路线、蓝湖温泉、极光观测点和当地特色美食推荐...',
  //   author: '张小明',
  //   date: '2023-06-25',
  //   readTime: '16分钟阅读',
  //   commentCount: 45,
  //   link: '/articles/7',
  //   tags: ['冰岛', '极光', '温泉'],
  // },
  {
    id: 8,
    title: 'TypeScript高级类型详解',

    category: '前端',
    desc: '深入学习TypeScript的高级类型系统，包括泛型、条件类型、映射类型和类型推断等...',
    excerpt: '深入学习TypeScript的高级类型系统，包括泛型、条件类型、映射类型和类型推断等...',
    author: '王小刚',
    date: '2023-06-10',
    readTime: '13分钟阅读',
    commentCount: 33,
    link: '/articles/8',
    tags: ['TypeScript', '类型系统', '泛型'],
  },
  {
    id: 10,
    title: 'Tailwind CSS 实用技巧与最佳实践',
    category: '111',
    desc: '探索Tailwind CSS的高级用法，包括自定义配置、响应式设计和优化技巧，帮助你更高效地构建现代Web界面...',
    excerpt:
      '探索Tailwind CSS的高级用法，包括自定义配置、响应式设计和优化技巧，帮助你更高效地构建现代Web界面...',
    author: '张小明',
    date: '2023-10-15',
    readTime: '8分钟阅读',
    commentCount: 24,
    link: '/articles/1',
    tags: ['CSS', 'Tailwind', '前端框架'],
  },
]

// 按类别分组文章
export const getArticlesByCategory = () => {
  const travelArticles = articlesData.filter((article) => article.category === '旅游')
  const techArticles = articlesData.filter((article) => article.category === '前端')
  const otherArticles = articlesData.filter(
    (article) => !['旅游', '前端'].includes(article.category)
  )

  return {
    travelArticles,
    techArticles,
    otherArticles,
  }
}
