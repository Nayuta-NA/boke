<template>
  <section class="travel-memory-section">
    <h2 class="section-title">旅行记忆</h2>
    <p class="section-subtitle">记录旅途中的美好瞬间,分享世界各地的风景与人情</p>

    <div class="gallery-container">
      <div class="gallery-masonry" v-if="travelPhotos.length > 0">
        <div
          v-for="(photo, index) in travelPhotos"
          :key="photo.name"
          :class="['masonry-item', getMasonryClass(index)]"
        >
          <div class="photo-card">
            <div class="photo-wrapper">
              <img :src="photo.url" :alt="photo.name" class="photo-image" />
            </div>

            <div class="photo-overlay">
              <div class="photo-details">
                <h3 class="photo-title">{{ photo.name }}</h3>
                <div class="photo-meta">
                  <span class="location">📍 {{ photo.location }}</span>
                  <span class="year">📅 {{ photo.year }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="no-photos" v-else>
        <p>暂无旅行照片</p>
      </div>
    </div>

    <div class="more-button">
      <a href="#" @click.prevent="goToTravelPage" class="more-link"> 查看更多 → </a>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTravelsStore } from '@/stores/travels'
import { useRouter } from 'vue-router'

const travelsStore = useTravelsStore()
const router = useRouter()

// 获取旅行照片
const travelPhotos = computed(() => {
  return travelsStore.travels
})

// 根据索引获取网格类名
const getMasonryClass = (index) => {
  // 所有照片都使用相同的尺寸
  return 'small'
}

// 跳转到旅行页面
const goToTravelPage = () => {
  router.push('/travel')
}
</script>

<style scoped>
/* ========== 旅行记忆 - 现代杂志风 ========== */

/* 外层容器：渐变背景 + 柔和阴影 */
.travel-memory-section {
  margin: 40px 0;
  padding: 36px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.02),
    0 10px 15px -3px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;
}

/* 添加微妙的噪点纹理 */
.travel-memory-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.5;
}

/* 标题：渐变色 + 更大字号 */
.section-title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 6px;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

/* 副标题：更优雅的灰色 */
.section-subtitle {
  font-size: 15px;
  color: #64748b;
  margin-bottom: 32px;
  font-weight: 400;
  letter-spacing: 0.2px;
}

.gallery-container {
  width: 100%;
  position: relative;
  z-index: 1;
}

.gallery-masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-auto-rows: 10px;
  gap: 24px;
  padding: 4px;
}

.masonry-item {
  break-inside: avoid;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.masonry-item.small {
  grid-row: span 1;
}

/* 卡片核心：杂志风设计 */
.photo-card {
  position: relative;
  height: 0;
  overflow: hidden;
  border-radius: 18px;
  background: #ffffff;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

/* 悬停效果：更柔和的阴影 + 光晕 */
.photo-card:hover {
  transform: translateY(-8px) scale(1.015);
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.08),
    0 20px 40px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(99, 102, 241, 0.1),
    0 0 40px rgba(99, 102, 241, 0.08);
}

.photo-wrapper {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* 照片：更平滑的缩放动画 */
.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  filter: brightness(0.98);
}

.photo-card:hover .photo-image {
  transform: scale(1.1);
  filter: brightness(1.05);
}

/* 遮罩层：渐变更柔和 */
.photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(15, 23, 42, 0.9) 0%,
    rgba(15, 23, 42, 0.6) 30%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  display: flex;
  align-items: flex-end;
}

.photo-card:hover .photo-overlay {
  opacity: 1;
}

/* 信息详情：胶囊式设计 */
.photo-details {
  padding: 24px;
  color: white;
  transform: translateY(16px);
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
}

.photo-card:hover .photo-details {
  transform: translateY(0);
}

/* 标题：更大更优雅 */
.photo-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  letter-spacing: -0.3px;
  line-height: 1.3;
}

/* 元数据：胶囊标签风格 */
.photo-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.location {
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.year {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 12px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
}

/* 无照片状态：更优雅的空状态 */
.no-photos {
  text-align: center;
  padding: 100px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 20px;
  border: 2px dashed #e2e8f0;
  position: relative;
  overflow: hidden;
}

.no-photos::before {
  content: '';
  position: absolute;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.no-photos p {
  font-size: 18px;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.3px;
  position: relative;
}

/* 更多按钮：渐变风格 */
.more-button {
  text-align: right;
  margin-top: 28px;
  position: relative;
  z-index: 1;
}

.more-link {
  display: inline-block;
  padding: 10px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.more-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

/* ========== 响应式优化 ========== */

@media (max-width: 1400px) {
  .gallery-masonry {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 1024px) {
  .gallery-masonry {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 18px;
  }
  .travel-memory-section {
    padding: 28px;
  }
  .section-title {
    font-size: 28px;
  }
  .photo-details {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .travel-memory-section {
    padding: 20px;
    margin: 24px 0;
  }
  .gallery-masonry {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
    gap: 20px;
  }
  .section-title {
    font-size: 26px;
  }
  .section-subtitle {
    font-size: 14px;
    margin-bottom: 24px;
  }
  .photo-title {
    font-size: 18px;
  }
  .photo-meta {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .travel-memory-section {
    padding: 16px;
    margin: 16px 0;
  }
  .section-title {
    font-size: 24px;
  }
  .gallery-masonry {
    gap: 16px;
  }
  .photo-details {
    padding: 16px;
  }
  .photo-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
}

/* 为不同尺寸的照片设置固定宽高比 */
.masonry-item .photo-card {
  /* 默认小尺寸 4:3 比例 */
  padding-top: 75%;
}
</style>
