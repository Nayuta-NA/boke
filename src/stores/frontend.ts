import { defineStore } from 'pinia'
import { 
  homeTechCategories as staticHomeTechCategories, 
  homeProjects as staticHomeProjects, 
  detailProjects as staticDetailProjects 
} from '@/data/frontend'
import { resourceAPI, projectAPI, bookAPI } from '@/lib/api'

// 定义技术栈分类类型
export interface TechCategory {
  name: string
  items: string[]
}

// 定义项目类型
export interface ProjectItem {
  id: string
  title: string
  description: string
  image: string
  framework: string
  tags: string[]
  demo?: string
  github?: string
  createdAt: string
}

// 定义书籍类型
export interface BookItem {
  id: string
  title: string
  author: string
  cover: string
  description: string
  recommendation: string
  tags: string[]
  rating: number
  publisher: string
  publicationDate: string
  createdAt: string
}

// 定义资源类型
export interface Resource {
  id: string
  title: string
  description: string
  icon: string
  url: string
  createdAt: string
}

// 定义旧的项目类型 (用于首页静态数据)
export interface Project {
  id: number
  title: string
  description: string
  image: string
  framework: string
  tags: string[]
  demo?: string
  github?: string
}

export const useFrontendStore = defineStore('frontend', {
  state: () => ({
    techCategories: [] as TechCategory[],
    projects: [] as Project[],
    detailProjects: [] as Project[],
    resources: [] as Resource[],
    projectItems: [] as ProjectItem[],
    bookItems: [] as BookItem[],
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
    },
    
    allResources(): Resource[] {
      return this.resources
    },
    
    allProjectItems(): ProjectItem[] {
      return this.projectItems
    },
    
    allBookItems(): BookItem[] {
      return this.bookItems
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
    
    // 从后端加载资源列表
    async loadResources() {
      try {
        this.loading = true
        const response = await resourceAPI.getAll()
        this.resources = response.data
        return this.resources
      } catch (error) {
        console.error('加载资源失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 添加新资源
    async addResource(resource: Omit<Resource, 'id' | 'createdAt'>) {
      try {
        const response = await resourceAPI.create(resource)
        const newResource = response.data
        this.resources.unshift(newResource) // 添加到数组开头
        return newResource
      } catch (error) {
        console.error('添加资源失败:', error)
        throw error
      }
    },
    
    // 删除资源
    async deleteResource(id: string) {
      try {
        await resourceAPI.delete(id)
        const index = this.resources.findIndex(r => r.id === id)
        if (index !== -1) {
          this.resources.splice(index, 1)
        }
      } catch (error) {
        console.error('删除资源失败:', error)
        throw error
      }
    },
    
    // 更新资源
    async updateResource(id: string, updates: Partial<Resource>) {
      try {
        const response = await resourceAPI.update(id, updates)
        const index = this.resources.findIndex(r => r.id === id)
        if (index !== -1) {
          this.resources[index] = response.data
        }
        return response.data
      } catch (error) {
        console.error('更新资源失败:', error)
        throw error
      }
    },
    
    // 从后端加载项目列表
    async loadProjectItems() {
      try {
        this.loading = true
        const response = await projectAPI.getAll()
        this.projectItems = response.data
        return this.projectItems
      } catch (error) {
        console.error('加载项目失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 添加新项目
    async addProjectItem(project: Omit<ProjectItem, 'id' | 'createdAt'>) {
      try {
        const response = await projectAPI.create(project)
        const newProject = response.data
        this.projectItems.unshift(newProject)
        return newProject
      } catch (error) {
        console.error('添加项目失败:', error)
        throw error
      }
    },
    
    // 删除项目
    async deleteProjectItem(id: string) {
      try {
        await projectAPI.delete(id)
        const index = this.projectItems.findIndex(p => p.id === id)
        if (index !== -1) {
          this.projectItems.splice(index, 1)
        }
      } catch (error) {
        console.error('删除项目失败:', error)
        throw error
      }
    },
    
    // 从后端加载书籍列表
    async loadBookItems() {
      try {
        this.loading = true
        const response = await bookAPI.getAll()
        this.bookItems = response.data
        return this.bookItems
      } catch (error) {
        console.error('加载书籍失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 添加新书籍
    async addBookItem(book: Omit<BookItem, 'id' | 'createdAt'>) {
      try {
        const response = await bookAPI.create(book)
        const newBook = response.data
        this.bookItems.unshift(newBook)
        return newBook
      } catch (error) {
        console.error('添加书籍失败:', error)
        throw error
      }
    },
    
    // 删除书籍
    async deleteBookItem(id: string) {
      try {
        await bookAPI.delete(id)
        const index = this.bookItems.findIndex(b => b.id === id)
        if (index !== -1) {
          this.bookItems.splice(index, 1)
        }
      } catch (error) {
        console.error('删除书籍失败:', error)
        throw error
      }
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
