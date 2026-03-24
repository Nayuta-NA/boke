import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ConfigItem {
  id: string
  name: string
  enabled: boolean
  description: string
  subItems?: SubConfigItem[]
}

export interface SubConfigItem {
  id: string
  name: string
  enabled: boolean
}

export interface ThemeColor {
  primary: string
}

// 新增：主题背景配置接口
export interface ThemeBackground {
  type: 'color' | 'image'  // 背景类型：颜色或图片
  color: string  // 背景颜色
  imageUrl: string  // 背景图片 URL
}

// 新增：导航栏配置接口
export interface NavbarConfig {
  backgroundColor: string  // 导航栏背景颜色
}

export const useGlobalSettingsStore = defineStore('globalSettings', () => {
  // 从 localStorage 恢复数据
  const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage`, error)
      return defaultValue
    }
  }

  // 保存到 localStorage
  const saveToStorage = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage`, error)
    }
  }

  // 全局配置
  const themeColor = ref<ThemeColor>(
    loadFromStorage<ThemeColor>('themeColor', {
      primary: '#40e0d0'
    })
  )
  
  // 新增：主题背景配置
  const themeBackground = ref<ThemeBackground>(
    loadFromStorage<ThemeBackground>('themeBackground', {
      type: 'color',
      color: '#f5f5f0',  // 默认米白色背景
      imageUrl: ''
    })
  )
  
  // 新增：导航栏颜色配置
  const navbarConfig = ref<NavbarConfig>(
    loadFromStorage<NavbarConfig>('navbarConfig', {
      backgroundColor: '#ffffff'  // 默认白色导航栏
    })
  )
  
  const avatarUrl = ref<string>(
    loadFromStorage<string>('avatarUrl', 'https://via.placeholder.com/80')
  )

  // 页面配置
  const pageConfigs = ref<ConfigItem[]>(
    loadFromStorage<ConfigItem[]>('pageConfigs', [
      {
        id: 'home',
        name: '首页',
        enabled: true,
        description: '配置首页展示内容和布局',
        subItems: [
          { id: 'home-card', name: '首页卡片展示', enabled: true },
          { id: 'travel-card', name: '旅行卡片', enabled: true },
          { id: 'tech-card', name: '项目技术卡片', enabled: true }
        ]
      },
      {
        id: 'wall',
        name: '留言区',
        enabled: true,
        description: '管理留言墙功能和展示',
        subItems: []
      },
      {
        id: 'articles',
        name: '文章页',
        enabled: true,
        description: '配置文章列表和详情页',
        subItems: []
      },
      {
        id: 'travel',
        name: '旅行页',
        enabled: true,
        description: '管理旅行记录和地图展示',
        subItems: []
      },
      {
        id: 'tech',
        name: '技术页',
        enabled: true,
        description: '前端资源和技术展示',
        subItems: []
      }
    ])
  )

  // 计算属性：获取当前选中的配置（默认第一个）
  const selectedConfig = ref<ConfigItem | null>(pageConfigs.value[0])

  // Actions - 修改时自动保存到 localStorage
  const updateThemeColor = (colors: ThemeColor) => {
    themeColor.value = colors
    saveToStorage('themeColor', colors)
  }

  // 新增：更新主题背景
  const updateThemeBackground = (background: ThemeBackground) => {
    themeBackground.value = background
    saveToStorage('themeBackground', background)
  }

  // 新增：更新导航栏颜色
  const updateNavbarConfig = (config: NavbarConfig) => {
    navbarConfig.value = config
    saveToStorage('navbarConfig', config)
  }

  const updateAvatar = (url: string) => {
    avatarUrl.value = url
    saveToStorage('avatarUrl', url)
  }

  const togglePageConfig = (configId: string, enabled: boolean) => {
    const config = pageConfigs.value.find(c => c.id === configId)
    if (config) {
      config.enabled = enabled
      saveToStorage('pageConfigs', pageConfigs.value)
    }
  }

  const toggleSubItem = (configId: string, subItemId: string, enabled: boolean) => {
    const config = pageConfigs.value.find(c => c.id === configId)
    if (config && config.subItems) {
      const subItem = config.subItems.find(s => s.id === subItemId)
      if (subItem) {
        subItem.enabled = enabled
        saveToStorage('pageConfigs', pageConfigs.value)
      }
    }
  }

  const selectConfig = (configId: string) => {
    const config = pageConfigs.value.find(c => c.id === configId)
    selectedConfig.value = config || null
  }

  return {
    // State
    themeColor,
    themeBackground,  // 新增
    navbarConfig,  // 新增
    avatarUrl,
    pageConfigs,
    selectedConfig,
    
    // Actions
    updateThemeColor,
    updateThemeBackground,  // 新增
    updateNavbarConfig,  // 新增
    updateAvatar,
    togglePageConfig,
    toggleSubItem,
    selectConfig
  }
})