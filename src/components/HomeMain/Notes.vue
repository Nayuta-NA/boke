<template>
  <div style="z-index: 2; position: relative">
    <!-- 传递标题、介绍，通过 v-slot:main 传递随记内容 -->
    <HomeMainBOX
      title="日常随记"
      introduce="记录生活中的点滴思考和灵感瞬间"
      bg="white"
      height="750px"
      :more-path="morePath"
    >
      <template v-slot:main>
        <section class="py-8 bg-white">
          <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="note in displayedNotes"
                :key="note.id"
                class="bg-gray-50 rounded-xl p-6 hover:shadow-sm transition-shadow duration-300 border border-gray-100"
              >
                <div class="flex items-start mb-4">
                  <!-- 头像 -->
                  <img
                    :src="'/src/IMG/TX/TX.jpg'"
                    class="flex-shrink-0 w-10 h-10 rounded-full"
                    alt="作者头像"
                  />
                  <!-- 标题与日期 -->
                  <div class="ml-4">
                    <h3 class="text-lg font-bold text-gray-800 mb-1">{{ note.title }}</h3>
                    <p class="text-gray-500 text-sm">{{ note.date }} · {{ note.readTime }}</p>
                  </div>
                </div>
                <!-- 内容摘要 -->
                <p class="text-gray-600 mb-4 line-clamp-3">{{ note.desc }}</p>
                <!-- 阅读更多 -->
                <router-link
                  :to="`/notes/${note.id}`"
                  class="inline-flex items-center text-primary text-sm font-medium hover:text-primary/80 transition-colors duration-200"
                >
                  阅读更多
                  <i class="fas fa-long-arrow-alt-right ml-1"></i>
                </router-link>
              </div>
            </div>
          </div>
        </section>
      </template>
    </HomeMainBOX>
  </div>
</template>

<script setup lang="ts">
import HomeMainBOX from '@/components/HomeMainBOX.vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'

const router = useRouter()
const notesStore = useNotesStore()
const authStore = useAuthStore()
const { notes } = storeToRefs(notesStore)

// 在组件挂载时获取数据
onMounted(async () => {
  await notesStore.fetchNotes()
})

// 监听登录状态变化，确保登录后重新获取数据
watch(
  () => authStore.isAuthenticated,
  async (newVal) => {
    if (newVal) {
      await notesStore.fetchNotes()
    }
  },
  { immediate: true },
)

// 使用统一数据的前 4 条记录
const displayedNotes = notes.value.slice(0, 4)

const morePath = '/notes'
</script>

<style scoped></style>
