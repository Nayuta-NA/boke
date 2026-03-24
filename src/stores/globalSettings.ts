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

export const useGlobalSettingsStore = defineStore('globalSettings', () => {
  // 全局配置
  const themeColor = ref<ThemeColor>({
    primary: '#40e0d0'
  })
  const avatarUrl = ref('https://via.placeholder.com/80')

  // 页面配置
  const pageConfigs = ref<ConfigItem[]>([
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
      description: '前端资源和技术栈展示',
      subItems: []
    }
  ])

  // 计算属性：获取当前选中的配置（默认第一个）
  const selectedConfig = ref<ConfigItem | null>(pageConfigs.value[0])

  // Actions
  const updateThemeColor = (colors: ThemeColor) => {
    themeColor.value = colors
  }

  const updateAvatar = (url: string) => {
    avatarUrl.value = url
  }

  const togglePageConfig = (configId: string, enabled: boolean) => {
    const config = pageConfigs.value.find(c => c.id === configId)
    if (config) {
      config.enabled = enabled
    }
  }

  const toggleSubItem = (configId: string, subItemId: string, enabled: boolean) => {
    const config = pageConfigs.value.find(c => c.id === configId)
    if (config && config.subItems) {
      const subItem = config.subItems.find(s => s.id === subItemId)
      if (subItem) {
        subItem.enabled = enabled
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
    avatarUrl,
    pageConfigs,
    selectedConfig,
    
    // Actions
    updateThemeColor,
    updateAvatar,
    togglePageConfig,
    toggleSubItem,
    selectConfig
  }
})
