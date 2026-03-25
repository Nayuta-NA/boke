import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userAPI } from '@/lib/api'

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
  interests?: string[]
  introduction?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = (userData: User) => {
    // 直接使用从后端获取的用户数据
    user.value = {
      id: userData.id,
      username: userData.username,
      email: userData.email || '',
      name: userData.name || userData.username,
      // 保留后端返回的所有字段
      ...(userData.password && { password: userData.password }),
      ...(userData.avatar && { avatar: userData.avatar }),
      ...(userData.userPicture && { userPicture: userData.userPicture }),
      ...(userData.userName && { userName: userData.userName }),
      ...(userData.userRole && { userRole: userData.userRole }),
      ...(userData.webLogo && { webLogo: userData.webLogo }),
      ...(userData.mainColor && { mainColor: userData.mainColor }),
      ...(userData.interests && { interests: userData.interests }),
      ...(userData.introduction && { introduction: userData.introduction }),
    }

    // 只保存用户 ID 到 localStorage，用于标识当前登录用户
    localStorage.setItem('userId', String(user.value.id))
  }

  const logout = () => {
    user.value = null
    // 清除存储的用户 ID
    localStorage.removeItem('userId')
  }

  const initializeAuth = async () => {
    // 从 localStorage 获取已登录用户的 ID
    const savedUserId = localStorage.getItem('userId')
    
    if (savedUserId) {
      try {
        const userId = parseInt(savedUserId)
        if (!isNaN(userId)) {
          // 通过 API 获取用户数据
          await fetchUser(userId)
        } else {
          // ID 格式不正确，清除它
          localStorage.removeItem('userId')
        }
      } catch (error) {
        console.error('初始化认证状态失败:', error)
        // 如果获取失败，清除存储的 ID
        localStorage.removeItem('userId')
      }
    }
  }

  // 从 API 获取用户数据
  const fetchUser = async (userId: number) => {
    try {
      const response = await userAPI.getById(userId)
      const userData = response.data
      
      user.value = {
        id: userData.id,
        username: userData.username,
        email: userData.email || '',
        name: userData.name || userData.username,
        ...(userData.avatar && { avatar: userData.avatar }),
        ...(userData.userPicture && { userPicture: userData.userPicture }),
        ...(userData.userName && { userName: userData.userName }),
        ...(userData.userRole && { userRole: userData.userRole }),
        ...(userData.webLogo && { webLogo: userData.webLogo }),
        ...(userData.mainColor && { mainColor: userData.mainColor }),
        ...(userData.interests && { interests: userData.interests }),
        ...(userData.introduction && { introduction: userData.introduction }),
      }
      
      return user.value
    } catch (error) {
      console.error('获取用户数据失败:', error)
      throw error
    }
  }

  // 刷新用户数据
  const refreshUser = async () => {
    if (user.value?.id) {
      return await fetchUser(user.value.id)
    }
    return null
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initializeAuth,
    fetchUser,
    refreshUser,
  }
})
