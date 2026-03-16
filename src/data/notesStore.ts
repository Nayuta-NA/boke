import { ref } from 'vue'
import type { DiaryEntry } from '@/views/NotesView.vue'
import { detailNotesData } from './notes'

// 创建响应式数据
const diaryEntries = ref<DiaryEntry[]>([...detailNotesData])

// 获取所有随记
const getDiaryEntries = () => {
  return diaryEntries.value
}

// 根据ID查找随记
const findDiaryEntry = (id: string) => {
  return diaryEntries.value.find((entry) => entry.id === id)
}

// 添加新随记
const addDiaryEntry = (entry: Omit<DiaryEntry, 'id'>) => {
  const newEntry: DiaryEntry = {
    id: Date.now().toString(),
    ...entry,
  }
  diaryEntries.value.push(newEntry)
  return newEntry
}

// 更新随记
const updateDiaryEntry = (id: string, updates: Partial<DiaryEntry>) => {
  const index = diaryEntries.value.findIndex((entry) => entry.id === id)
  if (index !== -1) {
    diaryEntries.value[index] = { ...diaryEntries.value[index], ...updates }
    return diaryEntries.value[index]
  }
  return null
}

// 删除随记
const deleteDiaryEntry = (id: string) => {
  const index = diaryEntries.value.findIndex((entry) => entry.id === id)
  if (index !== -1) {
    diaryEntries.value.splice(index, 1)
    return true
  }
  return false
}

export const notesStore = {
  diaryEntries,
  getDiaryEntries,
  findDiaryEntry,
  addDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry
}