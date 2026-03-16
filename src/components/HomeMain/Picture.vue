<template>
  <div style="z-index: 2; position: relative">
    <!-- 传递标题、介绍，通过v-slot:main传递照片列表 -->
    <HomeMainBOX
      title="旅行记忆"
      introduce="记录旅途中的美好瞬间，分享世界各地的风景与人情"
      bg="white"
      height="auto"
      :more-path="morePath"
    >
      <template v-slot:main>
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <!-- 照片网格布局 -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div
                v-for="(photo, index) in displayedPhotos"
                :key="photo.id || index"
                class="aspect-square rounded-xl overflow-hidden group relative"
                :class="photo.colSpan ? `md:col-span-${photo.colSpan}` : ''"
              >
                <img
                  :src="photo.url"
                  :alt="photo.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  @error="handleImageError"
                />
                <!-- hover 显示的信息层 -->
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
                >
                  <div class="p-4 text-white">
                    <h3 class="font-medium">{{ photo.name }}</h3>
                    <p class="text-sm text-gray-200">{{ photo.location }}, {{ photo.year }}</p>
                  </div>
                </div>
              </div>
              
              <!-- 如果没有数据，显示提示信息 -->
              <div v-if="displayedPhotos.length === 0" class="col-span-full text-center py-10">
                <p class="text-gray-500">暂无旅行照片</p>
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
import { useTravelsStore } from '@/stores/travels'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

// 定义照片类型（保持原数据结构）
interface TravelPhoto {
  id: string;
  url: string
  name: string
  location: string
  year: number
  colSpan?: number // md 屏幕下的列跨度（可选）
  province?: string
}

const travelsStore = useTravelsStore()

// 确保数据已加载
onMounted(() => {
  if (travelsStore.travels.length === 0) {
    travelsStore.fetchTravels()
  }
})

const { travels } = storeToRefs(travelsStore)

// 使用store中的数据，如果数据为空则显示前10条
const displayedPhotos = computed(() => {
  return travels.value.slice(0, 10)
})

const morePath = '/travel'

// 图片加载失败时的处理
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://placehold.co/300x300?text=Image+Not+Found' // 占位图片
}
</script>

<style scoped>
</style>