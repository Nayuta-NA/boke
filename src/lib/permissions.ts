import { useAuthStore } from '@/stores/auth'

/**
 * 检查用户是否已登录
 */
export const isAuthenticated = (): boolean => {
  const authStore = useAuthStore()
  return authStore.isAuthenticated
}

/**
 * 检查路由是否需要认证权限
 * @param route - 路由对象
 */
export const routeRequiresAuth = (route: any): boolean => {
  return route.matched.some((record: any) => record.meta.requiresAuth)
}

/**
 * 检查是否可以访问指定路由
 * @param to - 目标路由
 * @returns 是否允许访问
 */
export const canAccessRoute = (to: any): boolean => {
  // 个人页面和全局设置页面需要登录
  const protectedRoutes = ['/profile', '/settings/global']
  
  if (protectedRoutes.includes(to.path)) {
    return isAuthenticated()
  }
  
  // 其他路由都可以访问（包括登录/注册页面）
  return true
}

/**
 * 检查用户是否有编辑权限
 * @returns 是否有编辑权限
 */
export const canEdit = (): boolean => {
  return isAuthenticated()
}

/**
 * 检查用户是否有删除权限
 * @returns 是否有删除权限
 */
export const canDelete = (): boolean => {
  return isAuthenticated()
}

/**
 * 检查用户是否有创建权限
 * @returns 是否有创建权限
 */
export const canCreate = (): boolean => {
  return isAuthenticated()
}

/**
 * 获取当前登录用户的 ID
 * @returns 用户 ID，未登录返回 null
 */
export const getCurrentUserId = (): number | null => {
  const userId = localStorage.getItem('userId')
  return userId ? parseInt(userId) : null
}
