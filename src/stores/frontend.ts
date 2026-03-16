import { defineStore } from 'pinia'
import { 
  homeTechCategories as staticHomeTechCategories, 
  homeProjects as staticHomeProjects, 
  detailProjects as staticDetailProjects 
} from '@/data/frontend'

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

export const useFrontendStore = defineStore('frontend', {
  state: () => ({
    techCategories: [] as TechCategory[],
    projects: [] as Project[],
    detailProjects: [] as Project[],
    loading: false,
  }),

  getters: {
    homeTechCategories(): TechCategory[] {
      return this.techCategories
    },
    
    homeProjects(): Project[] {
      return this.projects
    },
    
    allDetailProjects(): Project[] {
      return this.detailProjects
    }
  },

  actions: {
    // 初始化数据
    initializeData() {
      this.techCategories = JSON.parse(JSON.stringify(staticHomeTechCategories))
      this.projects = JSON.parse(JSON.stringify(staticHomeProjects))
      this.detailProjects = JSON.parse(JSON.stringify(staticDetailProjects))
    },
    
    // 获取首页技术类别
    getHomeTechCategories() {
      if (this.techCategories.length === 0) {
        this.initializeData()
      }
      return this.techCategories
    },
    
    // 获取首页项目
    getHomeProjects() {
      if (this.projects.length === 0) {
        this.initializeData()
      }
      return this.projects
    },
    
    // 获取详细项目
    getDetailProjects() {
      if (this.detailProjects.length === 0) {
        this.initializeData()
      }
      return this.detailProjects
    },
    
    // 添加新项目
    addProject(project: Omit<Project, 'id'>) {
      const newId = Math.max(...this.detailProjects.map(p => p.id), 0) + 1
      const newProject: Project = {
        ...project,
        id: newId
      }
      
      this.detailProjects.push(newProject)
      this.projects.push(newProject)
      
      return newProject
    },
    
    // 更新项目
    updateProject(id: number, updates: Partial<Project>) {
      const index = this.detailProjects.findIndex(project => project.id === id)
      if (index !== -1) {
        this.detailProjects[index] = { ...this.detailProjects[index], ...updates }
        
        // 同时更新首页项目列表中的项目
        const homeIndex = this.projects.findIndex(project => project.id === id)
        if (homeIndex !== -1) {
          this.projects[homeIndex] = { ...this.projects[homeIndex], ...updates }
        }
        
        return this.detailProjects[index]
      }
      return null
    },
    
    // 删除项目
    deleteProject(id: number) {
      const index = this.detailProjects.findIndex(project => project.id === id)
      if (index !== -1) {
        this.detailProjects.splice(index, 1)
      }
      
      const homeIndex = this.projects.findIndex(project => project.id === id)
      if (homeIndex !== -1) {
        this.projects.splice(homeIndex, 1)
      }
    }
  }
})