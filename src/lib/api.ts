import axios from 'axios';

// API 基础配置
const API_BASE_URL = 'http://localhost:5000'; // 修改为后端服务器端口 5000

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器，自动附加用户 ID
apiClient.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取当前登录用户 ID
    const userId = localStorage.getItem('userId');
    if (userId) {
      config.headers['x-user-id'] = userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 定义通用的 API 接口
interface APIResponse<T> {
  data: T;
  message?: string;
}

// 定义通用的 API 服务接口
interface ApiService<T, ID = number | string> {
  getAll(): Promise<APIResponse<T[]>>;
  getById(id: ID): Promise<APIResponse<T>>;
  create(data: Omit<T, 'id'>): Promise<APIResponse<T>>;
  update(id: ID, data: Partial<T>): Promise<APIResponse<T>>;
  delete(id: ID): Promise<APIResponse<T>>;
}

// 登录接口定义
interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  userPicture?: string;
  userName?: string;
  userRole?: string;
  webLogo?: string;
  mainColor?: string;
}

// 文章 API 服务
export const articleAPI: ApiService<any, number> = {
  getAll: () => apiClient.get('/api/db/articles'),
  getById: (id: number) => apiClient.get(`/api/db/articles/${id}`),
  create: (data: any) => apiClient.post('/api/db/articles', data),
  update: (id: number, data: any) => apiClient.put(`/api/db/articles/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/db/articles/${id}`),
};

// 笔记 API 服务
export const noteAPI: ApiService<any, string> = {
  getAll: () => apiClient.get('/api/db/notes'),
  getById: (id: string) => apiClient.get(`/api/db/notes/${id}`),
  create: (data: any) => apiClient.post('/api/db/notes', data),
  update: (id: string, data: any) => apiClient.put(`/api/db/notes/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/db/notes/${id}`),
};

// 旅行 API 服务
export const travelAPI: ApiService<any, string> = {
  getAll: () => apiClient.get('/api/db/travels'),
  getById: (id: string) => apiClient.get(`/api/db/travels/${id}`),
  create: (data: any) => apiClient.post('/api/db/travels', data),
  update: (id: string, data: any) => apiClient.put(`/api/db/travels/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/db/travels/${id}`),
};

// 用户 API 服务
export const userAPI: ApiService<any, number> = {
  getAll: () => apiClient.get('/api/db/users'),
  getById: (id: number) => apiClient.get(`/api/db/users/${id}`),
  create: (data: any) => apiClient.post('/api/db/users', data),
  update: (id: number, data: any) => apiClient.put(`/api/db/users/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/db/users/${id}`),
};

// 评论 API 服务
export const reviewAPI: ApiService<any, string> = {
  getAll: () => apiClient.get('/api/db/reviews'),
  getById: (id: string) => apiClient.get(`/api/db/reviews/${id}`),
  create: (data: any) => apiClient.post('/api/db/reviews', data),
  update: (id: string, data: any) => apiClient.put(`/api/db/reviews/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/db/reviews/${id}`),
};

// 资源 API 服务
export const resourceAPI: ApiService<any, string> = {
  getAll: () => apiClient.get('/api/db/resources'),
  getById: (id: string) => apiClient.get(`/api/db/resources/${id}`),
  create: (data: any) => apiClient.post('/api/db/resources', data),
  update: (id: string, data: any) => apiClient.put(`/api/db/resources/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/db/resources/${id}`),
};

// 项目 API 服务
export const projectAPI: ApiService<any, string> = {
  getAll: () => apiClient.get('/api/db/projects'),
  getById: (id: string) => apiClient.get(`/api/db/projects/${id}`),
  create: (data: any) => apiClient.post('/api/db/projects', data),
  update: (id: string, data: any) => apiClient.put(`/api/db/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/db/projects/${id}`),
};

// 书籍 API 服务
export const bookAPI: ApiService<any, string> = {
  getAll: () => apiClient.get('/api/db/books'),
  getById: (id: string) => apiClient.get(`/api/db/books/${id}`),
  create: (data: any) => apiClient.post('/api/db/books', data),
  update: (id: string, data: any) => apiClient.put(`/api/db/books/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/db/books/${id}`),
};

// 登录 API 服务
export const authAPI = {
  login: (credentials: LoginCredentials) => apiClient.post<LoginResponse>('/api/login', credentials),
};

// 最新活动 API 服务
export const activityAPI = {
  getRecentActivities: () => apiClient.get('/api/recent-activities'),
};