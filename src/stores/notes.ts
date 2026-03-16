import { defineStore } from 'pinia';
import { noteAPI } from '@/lib/api';

export interface Note {
  id: string;
  title: string;
  icon: string;
  date: string;
  readTime: string;
  desc: string;
  tags: any;
  content?: string;
  mood?: string;
  weather?: string;
  time?: string;
  province?: string; // 添加省份字段，用于地理关联
}

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as Note[],
    currentNote: null as Note | null,
    loading: false,
  }),

  actions: {
    // 获取所有笔记
    async fetchNotes() {
      this.loading = true;
      try {
        const response = await noteAPI.getAll();
        this.notes = response.data;
      } catch (error) {
        console.error('获取笔记列表失败:', error);
        // 如果API调用失败，可以考虑使用本地数据作为后备
        console.log('尝试使用本地数据...');
      } finally {
        this.loading = false;
      }
    },

    // 获取单个笔记
    async fetchNoteById(id: string) {
      this.loading = true;
      try {
        const response = await noteAPI.getById(id);
        this.currentNote = response.data;
        return response.data;
      } catch (error) {
        console.error(`获取笔记 ${id} 失败:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 创建新笔记
    async createNote(noteData: Omit<Note, 'id'>) {
      this.loading = true;
      try {
        const response = await noteAPI.create(noteData);
        this.notes.push(response.data);
        return response.data;
      } catch (error) {
        console.error('创建笔记失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 更新笔记
    async updateNote(id: string, noteData: Partial<Note>) {
      this.loading = true;
      try {
        const response = await noteAPI.update(id, noteData);
        const index = this.notes.findIndex(note => note.id === id);
        if (index !== -1) {
          this.notes[index] = response.data;
        }
        if (this.currentNote && this.currentNote.id === id) {
          this.currentNote = response.data;
        }
        return response.data;
      } catch (error) {
        console.error(`更新笔记 ${id} 失败:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 删除笔记
    async deleteNote(id: string) {
      this.loading = true;
      try {
        await noteAPI.delete(id);
        this.notes = this.notes.filter(note => note.id !== id);
        if (this.currentNote && this.currentNote.id === id) {
          this.currentNote = null;
        }
      } catch (error) {
        console.error(`删除笔记 ${id} 失败:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});