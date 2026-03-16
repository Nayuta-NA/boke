import { defineStore } from 'pinia';
import { travelAPI } from '@/lib/api';

export interface TravelPhoto {
  id: string;
  url: string;
  name: string;
  location: string;
  year: number;
  colSpan?: number;
  province?: string;
}

export const useTravelsStore = defineStore('travels', {
  state: () => ({
    travels: [] as TravelPhoto[],
    currentTravel: null as TravelPhoto | null,
    loading: false,
  }),

  actions: {
    // 获取所有旅行照片
    async fetchTravels() {
      this.loading = true;
      try {
        const response = await travelAPI.getAll();
        this.travels = response.data;
      } catch (error) {
        console.error('获取旅行照片列表失败:', error);
        // 如果API调用失败，可以考虑使用本地数据作为后备
        console.log('尝试使用本地数据...');
      } finally {
        this.loading = false;
      }
    },

    // 获取单个旅行照片
    async fetchTravelById(id: string) {
      this.loading = true;
      try {
        const response = await travelAPI.getById(id);
        this.currentTravel = response.data;
        return response.data;
      } catch (error) {
        console.error(`获取旅行照片 ${id} 失败:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 创建新旅行照片
    async createTravel(travelData: Omit<TravelPhoto, 'id'>) {
      this.loading = true;
      try {
        const response = await travelAPI.create(travelData);
        this.travels.push(response.data);
        return response.data;
      } catch (error) {
        console.error('创建旅行照片失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 更新旅行照片
    async updateTravel(id: string, travelData: Partial<TravelPhoto>) {
      this.loading = true;
      try {
        const response = await travelAPI.update(id, travelData);
        const index = this.travels.findIndex(travel => travel.id === id);
        if (index !== -1) {
          this.travels[index] = response.data;
        }
        if (this.currentTravel && this.currentTravel.id === id) {
          this.currentTravel = response.data;
        }
        return response.data;
      } catch (error) {
        console.error(`更新旅行照片 ${id} 失败:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 删除旅行照片
    async deleteTravel(id: string) {
      this.loading = true;
      try {
        await travelAPI.delete(id);
        this.travels = this.travels.filter(travel => travel.id !== id);
        if (this.currentTravel && this.currentTravel.id === id) {
          this.currentTravel = null;
        }
      } catch (error) {
        console.error(`删除旅行照片 ${id} 失败:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});