import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
      ...(userData.interests && { interests: userData.interests })
    }
    
    // 保存到 localStorage
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const initializeAuth = () => {
    // 从 localStorage 恢复用户状态
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        user.value = userData
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e)
      }
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initializeAuth
  }
})