<template>
  <div class="home-view">
    <!-- 其他内容 -->
    
    <!-- 旅行记忆板块 -->
    <div class="travel-memory-section">
      <h2 class="section-title">旅行记忆</h2>
      <p class="section-subtitle">记录旅途中的美好瞬间，分享世界各地的风景与人情</p>
      
      <div class="gallery-container">
        <div class="gallery-masonry">
          <!-- 使用真实照片数据 -->
          <div 
            v-for="(photo, index) in travelsStore.travels" 
            :key="photo.id" 
            class="masonry-item"
            :class="getMasonryClass(index)"
          >
            <div class="photo-card">
              <div class="photo-wrapper">
                <img 
                  :src="photo.url" 
                  :alt="photo.name" 
                  class="photo-image"
                />
                <div class="photo-overlay">
                  <div class="photo-details">
                    <h3 class="photo-title">{{ photo.name }}</h3>
                    <div class="photo-meta">
                      <span class="location">{{ photo.location }}</span>
                      <span class="year">{{ photo.year }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 如果没有照片，显示提示信息 -->
          <div v-if="travelsStore.travels.length === 0" class="no-photos">
            <p>暂无旅行照片</p>
          </div>
        </div>
        
        <!-- 更多按钮 -->
        <div class="more-button">
          <a-button type="primary" @click="goToTravelPage">更多</a-button>
        </div>
      </div>
    </div>
    
    <!-- 其他内容 -->
  </div>
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
.travel-memory-section {
  margin: 40px 0;
  padding: 30px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

.gallery-container {
  width: 100%;
}

.gallery-masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-auto-rows: 10px;
  gap: 20px;
  padding: 10px;
}

.masonry-item {
  break-inside: avoid;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.masonry-item.small {
  grid-row: span 1;
}

.photo-card {
  position: relative;
  height: 0;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  background: white;
  transition: all 0.3s ease;
}

.photo-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.photo-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.photo-card:hover .photo-image {
  transform: scale(1.08);
}

.photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
}

.photo-card:hover .photo-overlay {
  opacity: 1;
}

.photo-details {
  padding: 20px;
  color: white;
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.photo-card:hover .photo-details {
  transform: translateY(0);
}

.photo-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.photo-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  opacity: 0.9;
}

.location {
  font-weight: 500;
}

.year {
  font-weight: 300;
}

.no-photos {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.no-photos p {
  font-size: 20px;
  color: #94a3b8;
  margin: 0;
}

.more-button {
  text-align: right;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .gallery-masonry {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 1024px) {
  .gallery-masonry {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 14px;
  }
  
  .travel-memory-section {
    padding: 24px;
  }
  
  .section-title {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .travel-memory-section {
    padding: 16px;
  }
  
  .gallery-masonry {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
    gap: 16px;
  }
  
  .photo-wrapper {
    aspect-ratio: 16/9 !important;
  }
  
  .section-title {
    font-size: 22px;
  }
}

@media (max-width: 480px) {
  .travel-memory-section {
    padding: 12px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .gallery-masonry {
    gap: 12px;
  }
}

/* 新增：为不同尺寸的照片设置固定宽高比 */
.masonry-item .photo-card {
  /* 默认小尺寸 */
  padding-top: 75%; /* 4:3 比例 */
}
</style>