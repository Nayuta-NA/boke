import { defineStore } from 'pinia';
import axios from 'axios';

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    articles: [] as Article[],
  }),
  actions: {
    async fetchArticles() {
      try {
        const response = await axios.get('/api/articles'); // 根据实际情况调整API路径
        this.articles = response.data; // 假设返回的数据格式为数组
      } catch (error) {
        console.error('获取文章列表失败:', error);
        throw new Error('获取文章列表失败');
      }
    },
    async fetchArticleById(id: number) {
      try {
        const response = await axios.get(`/api/articles/${id}`); // 根据实际情况调整API路径
        return response.data;
      } catch (error) {
        console.error('获取单篇文章失败:', error);
        throw new Error('获取单篇文章失败');
      }
    },
  },
});