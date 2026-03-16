<template>
  <div class="flex w-full flex-row items-center justify-between py-4">
    <!-- <p>
      {{
        `Current direction : ${ORBIT_DIRECTION.Clockwise === direction ? 'Clockwise' : 'CounterClockwise'}`
      }}
    </p> -->
    <!-- <button
      class="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
      @click="switchDirection"
    >
      {{
        `Switch to : ${ORBIT_DIRECTION.Clockwise === direction ? 'CounterClockwise' : 'Clockwise'}`
      }}
    </button> -->
  </div>
  <div
    class="relative flex h-[800px] w-full flex-col items-center justify-center overflow-hidden rounded-lg"
  >
    <span class="pointer-events-none text-center text-8xl font-semibold leading-none"> 🌍 </span>
    <!-- <Orbit
      class="items-center justify-center border-none bg-transparent text-xl"
      :radius="190"
      :duration="20"
      :delay="200"
      :direction="direction"
      path
    >
      🪨
    </Orbit>
    <Orbit
      class="items-center justify-center border-none bg-transparent text-4xl"
      :radius="100"
      :delay="4"
      :direction="direction"
      path
    >
      🌕
    </Orbit> -->
    <Orbit
      class="items-center justify-center border-none bg-transparent text-4xl"
      :radius="350"
      :delay="4"
      :direction="direction"
      path1
    >
      <div class="w-45px h-45px rounded-full animate-orbit">
        <img :src="vue3" alt="" />
      </div>
    </Orbit>
    <Orbit
      class="items-center justify-center border-none bg-transparent text-4xl"
      :radius="350"
      :delay="3"
      :direction="reverse"
      path1
    >
      <div class="w-45px h-45px rounded-full animate-orbit">
        <img :src="Google" alt="" />
      </div>
    </Orbit>
    <Orbit
      class="items-center justify-center border-none bg-transparent text-4xl"
      :radius="350"
      :delay="14"
      :direction="direction"
      path1
    >
      <div class="w-[150px] h-[150px] rounded-full overflow-hidden animate-orbit">
        <img :src="currentUserAvatar" alt="头像" class="w-full h-full object-cover" />
      </div>
    </Orbit>
    <Orbit
      class="items-center justify-center border-none bg-transparent text-4xl"
      :radius="280"
      :delay="10"
      :direction="direction"
      path
    >
      🪐
    </Orbit>
    <Orbit
      class="items-center justify-center border-none bg-transparent text-4xl"
      :radius="280"
      :delay="8"
      :direction="reverse"
      path
    >
      <div class="w-45px h-45px rounded-full animate-orbit">
        <img :src="github" alt="" />
      </div>
    </Orbit>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ORBIT_DIRECTION, type OrbitDirection } from './Orbit'
import Orbit from './Orbit.vue'
import github from '@/components/Orbit/image/github.png'
import Google from '@/components/Orbit/image/谷歌.png'
import vue3 from '@/components/Orbit/image/vue3.png'
// 移除了导入固定头像的代码
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const currentUserAvatar = computed(() => {
  // 使用当前登录用户的头像，如果没有则使用默认头像
  return authStore.user?.userPicture || authStore.user?.avatar || '/src/IMG/TX/TX.jpg'
})

const direction = ref<OrbitDirection>(ORBIT_DIRECTION.Clockwise)
const reverse = ref<OrbitDirection>(ORBIT_DIRECTION.CounterClockwise)
function switchDirection() {
  if (ORBIT_DIRECTION.Clockwise === direction.value) {
    direction.value = ORBIT_DIRECTION.CounterClockwise
    return
  }

  direction.value = ORBIT_DIRECTION.Clockwise
}
</script>