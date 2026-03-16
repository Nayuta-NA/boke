<template>
  <div class="relative h-[500px] w-full overflow-hidden rounded-lg">
    <div class="mt-[64px] flex justify-center px-12">
      <TestimonialSlider :testimonials="testimonials" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { rand } from "@vueuse/core";
import tx from '@/components/Orbit/image/tx.jpg'
import TestimonialSlider from "@/components/Recommend/TestimonialSlider.vue";
const testimonials = [
  {
    img: tx,
    quote: "每一次点击都像踏上新的旅途，界面流畅得如同沿着海岸线自驾——旅行博客的体验感被拉满了！",
    name: "陈旅行",
    role: "旅行博主 · 行迹无疆",
  },
  {
    // 👇 新增 ?nat=cn
    img: tx,
    quote: "作为前端开发者，第一次见这么丝滑的交互！组件加载像 ES 模块树摇一样高效，UI 细节堪比精心重构的组件库。",
    name: "李前端",
    role: "前端工程师 · 码上先锋",
  },
  {
    // 👇 新增 ?nat=cn
    img:tx,
    quote: "从人文随笔到冷门知识，界面切换比翻书还自然，仿佛每个博客卡片都藏着一个待拆的盲盒惊喜。",
    name: "王杂谈",
    role: "内容创作者 · 杂谈小馆",
  },
  {
    // 👇 新增 ?nat=cn
    img: tx,
    quote: "旅行攻略的展示太直观了，像有个向导在界面里带路；技术博客的代码片段也能优雅呈现，这就是我想要的「多面博客」！",
    name: "张跨界",
    role: "旅行爱好者 · 前端学习者",
  },
];
function getRandomNumber() {
  return rand(1, 99);
}
</script>