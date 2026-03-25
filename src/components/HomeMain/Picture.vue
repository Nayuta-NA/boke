<template>
  <div style="z-index: 2; position: relative">
    <HomeMainBOX
      title="旅行记忆"
      introduce="记录旅途中的美好瞬间，分享世界各地的风景与人情"
      height="auto"
      :more-path="morePath"
    >
      <template v-slot:main>
        <section class="py-16" style="background-color: var(--navbar-color)">
          <div
            v-if="provincePhotos.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
          >
            <div
              v-for="(province, index) in provincePhotos.slice(0, 3)"
              :key="province.name"
              class="group relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-sm cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1"
              style="background-color: var(--app-background)"
              @mouseenter="() => handleMouseEnter(index)"
              @mouseleave="handleMouseLeave"
              @click="() => handleCardClick(province.name)"
            >
              <!-- 整体布局容器 -->
              <div class="absolute inset-0 p-4 flex gap-3 h-full">
                <!-- 左侧图片区域 -->
                <div
                  :style="{
                    width: hoveredIndex === index ? '100%' : '72%',
                    height: hoveredIndex === index ? '100%' : '75%',
                    transformOrigin: 'top right',
                  }"
                  class="rounded-lg overflow-hidden relative transition-all duration-[2000ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                  :class="{
                    'rounded-none': hoveredIndex === index,
                  }"
                >
                  <img
                    :src="
                      province.coverUrl ||
                      'https://placehold.co/150x200/e5e5e5/999?text=' + province.name
                    "
                    :alt="province.name"
                    class="h-full w-full object-cover"
                    @error="handleImageError"
                  />

                  <!-- 悬停时显示在图片中央的文字 - hover 开始时即缓慢出现 -->
                  <div
                    class="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-[2000ms] ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none z-20"
                  >
                    <span
                      class="text-3xl font-bold text-white tracking-[0.5em] mb-2 drop-shadow-lg"
                    >
                      {{ province.name }}
                    </span>
                    <span class="text-lg font-medium text-white tracking-[0.3em] drop-shadow-lg">
                      {{ province.englishName }}
                    </span>
                  </div>
                </div>

                <!-- 右侧横向文字区域 - hover 时隐藏 -->
                <div
                  v-if="hoveredIndex !== index"
                  class="w-[28%] h-full flex items-center justify-center rounded-lg p-3 transition-opacity duration-[2000ms] ease-[cubic-bezier(0.4,0,0.2,1)] opacity-100 group-hover:opacity-0"
                  style="background-color: var(--navbar-color)"
                >
                  <div class="flex gap-1">
                    <span
                      v-for="(char, index) in province.englishName.split('')"
                      :key="index"
                      class="scatter-letter"
                      :style="getLetterStyle(index)"
                    >
                      {{ char }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 底部两个横向区域 - hover 时隐藏 -->
              <div
                class="absolute bottom-4 left-4 right-4 h-[18%] flex gap-3 transition-opacity duration-[2000ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-0"
              >
                <!-- 左下区域 -->
                <div
                  class="w-[65%] h-full rounded-lg p-3 flex flex-col justify-center"
                  style="background-color: var(--navbar-color)"
                >
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM10 16a6 6 0 110-12 6 6 0 010 12z" />
                      <path
                        d="M10 6a1 1 0 011 1v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2H7a1 1 0 010-2h2V7a1 1 0 011-1z"
                      />
                    </svg>
                    <span class="text-xs font-medium text-gray-600"
                      >THE SIGNIFICANCE OF TRAVEL</span
                    >
                  </div>
                  <p class="text-xs text-gray-500">Recording different stories</p>
                </div>

                <!-- 右下区域 -->
                <div
                  class="w-[35%] h-full rounded-lg p-3 flex items-center justify-center"
                  style="background-color: var(--navbar-color)"
                >
                  <div class="flex flex-col items-center gap-1">
                    <h3 class="text-sm font-bold text-gray-800">{{ province.name }}</h3>
                    <span class="text-xs text-gray-500">{{ province.count }}张照片</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="py-20 px-6 text-center bg-white rounded-lg">
            <p class="text-base font-medium text-stone-400">暂无旅行照片</p>
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalSettingsStore } from '@/stores/globalSettings'

// 定义省份照片类型
interface ProvincePhoto {
  name: string
  englishName: string
  coverUrl: string
  count: number
}

const travelsStore = useTravelsStore()
const router = useRouter()
const globalSettings = useGlobalSettingsStore()

// 从全局配置获取颜色
const navbarColor = computed(() => globalSettings.navbarConfig.backgroundColor)
const backgroundColor = computed(() => globalSettings.themeBackground.color)

// 确保数据已加载
onMounted(() => {
  if (travelsStore.travels.length === 0) {
    travelsStore.fetchTravels()
  }
})

const { travels } = storeToRefs(travelsStore)

// 只显示西藏、江苏、云南三个省份
const targetProvinces = ['西藏', '江苏', '云南']

// 省份对应的英文名和关键词
const provinceKeywords: Record<string, string> = {
  西藏: 'TIBET',
  江苏: 'JIANGSU',
  云南: 'YUNNAN',
}

// 处理省份数据
const provincePhotos = computed((): ProvincePhoto[] => {
  const result: ProvincePhoto[] = []

  targetProvinces.forEach((province) => {
    const provinceTravels = travels.value.filter((t: any) => t.province === province)
    if (provinceTravels.length > 0) {
      result.push({
        name: province,
        englishName: provinceKeywords[province] || province,
        coverUrl: provinceTravels[0].url,
        count: provinceTravels.length,
      })
    }
  })

  return result
})

const morePath = '/travel'

// 悬停状态追踪
const hoveredIndex = ref<number | null>(null)

// 处理鼠标进入事件
const handleMouseEnter = (index: number) => {
  hoveredIndex.value = index
}

// 处理鼠标离开事件
const handleMouseLeave = () => {
  hoveredIndex.value = null
}

// 计算文字 hover 时的散开消失样式
const getLetterStyle = (index: number) => {
  // 定义八个方向的散开路径
  const directions = [
    { x: -120, y: -120 }, // 左上
    { x: 120, y: -120 }, // 右上
    { x: -120, y: 120 }, // 左下
    { x: 120, y: 120 }, // 右下
    { x: -160, y: 0 }, // 左
    { x: 160, y: 0 }, // 右
    { x: 0, y: -160 }, // 上
    { x: 0, y: 160 }, // 下
  ]

  const direction = directions[index % directions.length]

  // 只在悬停时设置变量
  if (hoveredIndex.value !== -1) {
    return {
      '--scatter-x': `${direction.x}px`,
      '--scatter-y': `${direction.y}px`,
    }
  }

  return {}
}

// 图片加载失败时的处理
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://placehold.co/400x600?text=Image+Not+Found'
}

// 点击卡片跳转对应省份图册
const handleCardClick = (provinceName: string) => {
  router.push(`/travel/${encodeURIComponent(provinceName)}`)
}
</script>

<style scoped>
/* 基础散开文字样式 */
.scatter-letter {
  display: inline-block;
  will-change: transform, opacity;
  transform: translate(0, 0);
  opacity: 1;
  transition-property: transform, opacity;
  transition-timing-function: ease-out;
  transition-duration: 700ms;
}

/* 悬停时散开效果 - 只在有 CSS 变量时应用变换 */
.group:hover .scatter-letter {
  transform: translate(var(--scatter-x, 0), var(--scatter-y, 0));
  opacity: 0;
}
</style>
