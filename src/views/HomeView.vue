<template>
  <div class="home-view">
    <div class="content">
      <div style="overflow: hidden">
        <homeTop></homeTop>
      </div>
      <div class="main-content-grid">
        <web />
        <Picture />
        <Article />
        <Notes />
        <LeaveMessage />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  position: relative;
  width: 100%;
  padding-top: 2rem; /* 为固定导航栏留出空间 */
}

.content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 1rem;
  width: 90%;
  margin: 0 auto;
  border-radius: 8px;
}

.main-content-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem; /* 增加模块间的间距 */
}

.main-content-grid > div {
  width: 100%;
}
</style>

<script setup lang="ts">
import homeTop from '@/components/homeTop/homeTop.vue'
import Picture from '@/components/HomeMain/picture.vue'
import Article from '@/components/HomeMain/Article.vue'
import Notes from '@/components/HomeMain/Notes.vue'
import web from '@/components/HomeMain/web.vue'
import Emain from '@/components/HomeMain/Emain.vue'
import LeaveMessage from '@/components/HomeMain/LeaveMessage.vue'
</script>
