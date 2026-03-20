import { defineStore } from 'pinia';
import { articleAPI } from '@/lib/api';

export interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  likeCount: number;
}

export interface Article {
  id: number;
  title: string;
  cover?: string;
  category: string;
  desc: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  commentCount: number;
  link: string;
  tags?: string[];
  likeCount?: number;
  comments?: Comment[];
}

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    articles: [] as Article[],
    currentArticle: null as Article | null,
    loading: false,
  }),

  actions: {
    // 获取所有文章
    async fetchArticles() {
      this.loading = true;
      try {
        const response = await articleAPI.getAll();
        this.articles = response.data;
      } catch (error) {
        console.error('获取文章列表失败:', error);
        // 如果API调用失败，可以考虑使用本地数据作为后备
        console.log('尝试使用本地数据...');
      } finally {
        this.loading = false;
      }
    },

    // 获取单个文章
    async fetchArticleById(id: number) {
      this.loading = true;
      try {
        const response = await articleAPI.getById(id);
        this.currentArticle = response.data;
        return response.data;
      } catch (error) {
        console.error(`获取文章 ${id} 失败:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 创建新文章
    async createArticle(articleData: Omit<Article, 'id'>) {
      this.loading = true;
      try {
        const response = await articleAPI.create(articleData);
        this.articles.push(response.data);
        return response.data;
      } catch (error) {
        console.error('创建文章失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 更新文章
    async updateArticle(id: number, articleData: Partial<Article>) {
      this.loading = true;
      try {
        const response = await articleAPI.update(id, articleData);
        const index = this.articles.findIndex(article => article.id === id);
        if (index !== -1) {
          this.articles[index] = response.data;
        }
        if (this.currentArticle && this.currentArticle.id === id) {
          this.currentArticle = response.data;
        }
        return response.data;
      } catch (error) {
        console.error(`更新文章 ${id} 失败:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 删除文章
    async deleteArticle(id: number) {
      this.loading = true;
      try {
        await articleAPI.delete(id);
        this.articles = this.articles.filter(article => article.id !== id);
        if (this.currentArticle && this.currentArticle.id === id) {
          this.currentArticle = null;
        }
      } catch (error) {
        console.error(`删除文章 ${id} 失败:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});