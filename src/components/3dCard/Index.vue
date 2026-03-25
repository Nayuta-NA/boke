<template>
  <ClientOnly>
    <CardContainer>
      <CardBody
        class="group/card relative size-auto rounded-xl border border-black/[0.1] p-6 sm:w-[30rem] dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]"
        :style="{ padding: '5%', backgroundColor: 'var(--navbar-color)' }"
      >
        <CardItem :translate-z="50" class="text-xl font-bold text-neutral-600 dark:text-white">
          <div class="font-bold" style="font-size: 24px">Welcome to:</div>
        </CardItem>
        <CardItem
          as="p"
          translate-z="60"
          class="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-300"
        >
          <div>
            <file-words
              :words="siteTitleWords"
              :duration="3500"
              class="mainCorlor text-65px font-bold jianghu"
              style="margin-left: 15%; margin-top: 15%"
            />
          </div>
        </CardItem>
        <div class="flex items-center justify-between">
          <CardItem
            as="p"
            class="h-1px items-center justify-center"
            style="margin-top: 10%; border-bottom: 3px solid black; width: 100%"
          >
          </CardItem>
        </div>
        <div class="mt-5 flex items-center">
          <CardItem as="p" class="items-center justify-center text-20px">
            {{ welcomeText }}:
          </CardItem>
        </div>
        <div class="mt-5 flex items-center" style="float: right">
          <CardItem as="p" class="items-center justify-center text-25px flex flex-col">
            <div class="mt-2 english" v-for="(interest, index) in userInterests" :key="index">
              {{ interest }}
            </div>
          </CardItem>
        </div>
        <div class="flex items-center justify-between" style="margin-top: 55%">
          <CardItem
            as="button"
            class="rounded-xl mainBg px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-black"
          >
            Get Started
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import CardBody from './CardBody.vue'
import CardContainer from './CardContainer.vue'
import CardItem from './CardItem.vue'
import fileWords from '@/components/FileWords/fileWords.vue'

const authStore = useAuthStore()
const siteTitleWords = ref(['CrowdKang', '时序碎影札'])
const welcomeText = ref('CrowdK is a')

// 用户兴趣列表，将根据登录用户动态更新
const userInterests = ref([
  'Elementary Web Code',
  'Travel enthusiast',
  'Writing enthusiast',
  'Photography enthusiast',
])

onMounted(() => {
  // 获取当前用户信息并打印到控制台
  if (authStore.user) {
    console.log('当前登录用户信息:', authStore.user)
    welcomeText.value = `${authStore.user.name || authStore.user.username} is a`

    // 更新网站标题为当前用户名 (使用 name 字段)
    siteTitleWords.value = [authStore.user.name || authStore.user.username || 'User', '时序碎影札']

    // 更新兴趣列表为当前用户的真实兴趣 (使用 interests 字段)
    if (authStore.user.interests && authStore.user.interests.length > 0) {
      userInterests.value = [...authStore.user.interests]
    }
  } else {
    console.log('当前没有登录用户')
  }
})

// 监听用户状态变化，如果用户登录状态改变，更新显示内容
watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      console.log('用户状态更新:', newUser)
      welcomeText.value = `${newUser.name || newUser.username} is a`

      // 更新网站标题为当前用户名 (使用 name 字段)
      siteTitleWords.value = [newUser.name || newUser.username || 'User', '时序碎影札']

      // 更新兴趣列表为当前用户的真实兴趣 (使用 interests 字段)
      if (newUser.interests && newUser.interests.length > 0) {
        userInterests.value = [...newUser.interests]
      }
    } else {
      console.log('用户已退出登录')
      welcomeText.value = 'CrowdK is a'
      siteTitleWords.value = ['CrowdKang', '时序碎影札']
      userInterests.value = [
        'Elementary Web Code',
        'Travel enthusiast',
        'Writing enthusiast',
        'Photography enthusiast',
      ]
    }
  },
  { immediate: true },
)
</script>
<style scoped>
.ma-bt {
  margin-bottom: 5px;
}

.english {
  font-family: Arial, sans-serif;
}
</style>
