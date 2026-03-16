<template>
  <div
    class="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg"
  >
    <!-- First Marquee -->
    <Marquee pause-on-hover class="[--duration:60s]">
      <ReviewCard
        v-for="review in firstRow"
        :key="review.id"
        :img="review.img"
        :name="review.name"
        :username="review.username"
        :body="review.body"
        :created-at="review.createdAt"
      />
    </Marquee>

    <!-- Second Marquee (reverse) -->
    <Marquee reverse pause-on-hover class="[--duration:60s]">
      <ReviewCard
        v-for="review in secondRow"
        :key="review.id"
        :img="review.img"
        :name="review.name"
        :username="review.username"
        :body="review.body"
        :created-at="review.createdAt"
      />
    </Marquee>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Marquee from '@/components/pl/Marquee.vue'
import ReviewCard from '@/components/pl/ReviewCard.vue'

interface Review {
  id: string
  name: string
  username: string
  body: string
  img: string
  createdAt: string
}

// 定义props接收传入的评论数据
const props = defineProps<{
  reviews?: Review[]
}>()

// 默认评论数据
const defaultReviews = [
  {
    id: 'default1',
    name: 'Jack',
    username: '@jack',
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: 'https://avatar.vercel.sh/jack',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default2',
    name: 'Jill',
    username: '@jill',
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: 'https://avatar.vercel.sh/jill',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default3',
    name: 'John',
    username: '@john',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/john',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default4',
    name: 'Jane',
    username: '@jane',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/jane',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default5',
    name: 'Jenny',
    username: '@jenny',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/jenny',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default6',
    name: 'James',
    username: '@james',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/james',
    createdAt: new Date().toISOString(),
  },
]

// 使用传入的数据，如果没有则使用默认数据
const reviews = ref<Review[]>(props.reviews || defaultReviews)

// 监听传入的评论数据变化
watch(
  () => props.reviews,
  (newReviews) => {
    if (newReviews && newReviews.length > 0) {
      reviews.value = newReviews
    } else {
      reviews.value = defaultReviews
    }
  },
)

// 分割评论到两行
const firstRow = ref<Review[]>(reviews.value.slice(0, Math.ceil(reviews.value.length / 2)))
const secondRow = ref<Review[]>(reviews.value.slice(Math.ceil(reviews.value.length / 2)))

// 当数据变化时，重新分割评论
watch(reviews, (newReviews) => {
  firstRow.value = newReviews.slice(0, Math.ceil(newReviews.length / 2))
  secondRow.value = newReviews.slice(Math.ceil(newReviews.length / 2))
})
</script>
