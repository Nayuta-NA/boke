import axios from 'axios';

// API 基础配置
const API_BASE_URL = 'http://localhost:5000'; // 修改为后端服务器端口5000

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  getAll: () => apiClient.get('/api/articles'),
  getById: (id: number) => apiClient.get(`/api/articles/${id}`),
  create: (data: any) => apiClient.post('/api/articles', data),
  update: (id: number, data: any) => apiClient.put(`/api/articles/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/articles/${id}`),
};

// 笔记 API 服务
export const noteAPI: ApiService<any, string> = {
  getAll: () => apiClient.get('/api/notes'),
  getById: (id: string) => apiClient.get(`/api/notes/${id}`),
  create: (data: any) => apiClient.post('/api/notes', data),
  update: (id: string, data: any) => apiClient.put(`/api/notes/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/notes/${id}`),
};

// 旅行 API 服务
export const travelAPI: ApiService<any, string> = {
  getAll: () => apiClient.get('/api/travels'),
  getById: (id: string) => apiClient.get(`/api/travels/${id}`),
  create: (data: any) => apiClient.post('/api/travels', data),
  update: (id: string, data: any) => apiClient.put(`/api/travels/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/travels/${id}`),
};

// 用户 API 服务
export const userAPI: ApiService<any, number> = {
  getAll: () => apiClient.get('/api/users'),
  getById: (id: number) => apiClient.get(`/api/users/${id}`),
  create: (data: any) => apiClient.post('/api/users', data),
  update: (id: number, data: any) => apiClient.put(`/api/users/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/users/${id}`),
};

// 评论 API 服务
export const reviewAPI: ApiService<any, string> = {
  getAll: () => apiClient.get('/api/reviews'),
  getById: (id: string) => apiClient.get(`/api/reviews/${id}`),
  create: (data: any) => apiClient.post('/api/reviews', data),
  update: (id: string, data: any) => apiClient.put(`/api/reviews/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/reviews/${id}`),
};

// 登录 API 服务
export const authAPI = {
  login: (credentials: LoginCredentials) => apiClient.post<LoginResponse>('/api/login', credentials),
};

// 最新活动 API 服务
export const activityAPI = {
  getRecentActivities: () => apiClient.get('/api/recent-activities'),
};