# MitakaNAY 权限控制说明

## 概述

本项目实现了基于用户登录状态的权限控制系统。未登录用户可以访问除个人页面（`/profile`）和全局设置页面（`/settings/global`）外的所有公开页面，但无法使用编辑、删除、创建等需要权限的功能。

## 文件结构

### 核心文件

1. **`src/lib/permissions.ts`** - 权限控制工具函数
   - `isAuthenticated()` - 检查用户是否已登录
   - `canAccessRoute(route)` - 检查是否可以访问指定路由
   - `canEdit()` - 检查是否有编辑权限
   - `canDelete()` - 检查是否有删除权限
   - `canCreate()` - 检查是否有创建权限
   - `getCurrentUserId()` - 获取当前登录用户的 ID

2. **`src/router/index.ts`** - 路由配置
   - 使用 `canAccessRoute()` 函数在路由守卫中控制页面访问
   - 受保护的路由：`/profile`、`/settings/global`

3. **`src/stores/auth.ts`** - 认证状态管理
   - 管理用户登录状态
   - 从后端 API 获取用户数据
   - 通过 localStorage 持久化用户 ID

## 使用方法

### 1. 在组件模板中控制按钮显示

``vue
<template>
  <!-- 创建功能 -->
  <button v-if="canCreate()" @click="handleCreate">
    <PlusOutlined /> 添加
  </button>
  
  <!-- 编辑功能 -->
  <button v-if="canEdit()" @click="handleEdit">
    <EditOutlined /> 编辑
  </button>
  
  <!-- 删除功能 -->
  <button v-if="canDelete()" @click="handleDelete">
    <DeleteOutlined /> 删除
  </button>
</template>

<script setup>
import { canCreate, canEdit, canDelete } from '@/lib/permissions'
</script>
```

### 2. 在组件方法中进行权限验证

``typescript
const handleCreate = () => {
  if (!canCreate()) {
    message.warning('请先登录')
    router.push('/login')
    return
  }
  // 执行创建逻辑
}

const handleEdit = () => {
  if (!canEdit()) {
    message.warning('请先登录')
    return
  }
  // 执行编辑逻辑
}

const handleDelete = () => {
  if (!canDelete()) {
    message.warning('请先登录')
    return
  }
  // 执行删除逻辑
}
```

### 3. 完整的组件示例

``vue
<template>
  <div class="my-component">
    <h1>{{ title }}</h1>
    
    <!-- 仅登录用户可见的操作按钮 -->
    <button v-if="canEdit()" @click="handleEdit">编辑</button>
    <button v-if="canDelete()" @click="handleDelete">删除</button>
    
    <!-- 所有用户都可见的内容 -->
    <div class="content">{{ content }}</div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { canEdit, canDelete } from '@/lib/permissions'

const authStore = useAuthStore()

const handleEdit = () => {
  if (!canEdit()) {
    message.warning('请先登录')
    router.push('/login')
    return
  }
  // 编辑逻辑
}

const handleDelete = () => {
  if (!canDelete()) {
    message.warning('请先登录')
    return
  }
  // 删除逻辑
}
</script>
```

## 已实现权限控制的页面

### 1. ArticlesDetailView.vue（文章详情）
- ✅ 编辑按钮 - 仅登录用户可见
- ✅ 删除按钮 - 仅登录用户可见

### 2. ProvinceDetailView.vue（省份详情 - 旅行照片）
- ✅ 添加照片按钮 - 仅登录用户可见
- ✅ 删除照片按钮 - 仅登录用户可见

### 3. NotesDetailView.vue（笔记详情）
- ✅ 编辑按钮 - 仅登录用户可见

### 4. ArticlesView.vue（文章列表）
- ✅ 新建文章按钮 - 仅登录用户可见

### 5. TravelView.vue（旅行记录）
- ✅ 新建足迹记录按钮 - 仅登录用户可见

## 待添加权限控制的页面

以下页面可能需要根据实际功能添加权限控制：

- **NotesView.vue** - 笔记列表页（如需添加笔记功能）
- **TravelView.vue** - 旅行记录页（如需添加/编辑/删除功能）
- **ArticlesView.vue** - 文章列表页（如需添加/编辑/删除功能）
- **FrontendView.vue** - 前端资源页（如需添加/编辑/删除功能）
- **ArticlesDetailView.vue** - 文章详情页的评论功能

## 路由规则

### 公开路由（无需登录）
- `/` - 首页
- `/articles` - 文章列表
- `/articles/:id` - 文章详情
- `/travel` - 旅行记录
- `/travel/:province` - 省份详情
- `/notes` - 笔记列表
- `/notes/:id` - 笔记详情
- `/frontend` - 前端资源
- `/frontend/*` - 前端资源子页面
- `/login` - 登录
- `/register` - 注册
- `/wall` - 留言墙

### 受保护路由（需要登录）
- `/profile` - 个人资料
- `/settings/global` - 全局设置

## 导航栏显示逻辑

### Layout 组件行为
- **始终显示**：导航栏在所有页面都显示（除了登录、注册、留言墙、全局配置页）
- **未登录状态**：
  - ✅ 显示所有公开页面链接（首页、文章、旅游、随记、前端）
  - ❌ 隐藏"个人"链接
  - ✅ 显示"登录"和"注册"按钮
- **已登录状态**：
  - ✅ 显示所有页面链接（包括"个人"）
  - ✅ 显示用户下拉菜单（包含"个人中心"和"登出"）

## 注意事项

1. **统一导入**：在需要使用权限控制的组件中，统一从 `@/lib/permissions` 导入函数
2. **用户体验**：在未登录时点击需要权限的按钮，应提示用户并跳转到登录页
3. **样式一致性**：建议使用 `v-if` 隐藏按钮，而不是禁用，以保持界面简洁
4. **后端验证**：重要的权限验证应在后端 API 层面也进行验证，确保数据安全

## 测试场景

### 场景 1：未登录用户访问
1. 访问 `/articles` - ✅ 允许访问
2. 查看文章详情 - ✅ 允许访问
3. 尝试编辑文章 - ❌ 不显示编辑按钮
4. 访问 `/profile` - ❌ 重定向到 `/login`

### 场景 2：已登录用户访问
1. 访问任意公开页面 - ✅ 允许访问
2. 查看编辑/删除按钮 - ✅ 显示操作按钮
3. 访问 `/profile` - ✅ 允许访问
4. 执行编辑/删除操作 - ✅ 允许执行

## 相关文件

- `src/lib/permissions.ts` - 权限控制函数
- `src/router/index.ts` - 路由守卫配置
- `src/stores/auth.ts` - 认证状态管理
- `src/views/ProvinceDetailView.vue` - 权限控制示例
- `src/views/NotesDetailView.vue` - 权限控制示例
- `src/views/ArticlesDetailView.vue` - 权限控制示例
