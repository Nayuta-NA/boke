<template>
  <div class="province-detail-view">
    <div class="header-section">
      <button class="back-button" @click="goBack"><ArrowLeftOutlined /> 返回</button>
      <h1 class="province-title">{{ province }}</h1>
      <div class="province-stats">
        <span class="photo-count">{{ provincePhotos.length }} 张照片</span>
        <button class="add-photo-btn" @click="showUploadModal"><PlusOutlined /> 添加照片</button>
      </div>
    </div>

    <div class="gallery-container" v-if="provincePhotos.length > 0">
      <div class="gallery-masonry">
        <div
          v-for="(photo, index) in provincePhotos"
          :key="photo.id || index"
          class="masonry-item"
          :class="getMasonryClass(index)"
        >
          <div class="photo-card">
            <div class="photo-wrapper">
              <img :src="photo.url" :alt="photo.name" class="photo-image" loading="lazy" />
              <div class="photo-overlay">
                <div class="photo-details">
                  <h3 class="photo-title">{{ photo.name }}</h3>
                  <div class="photo-meta">
                    <span class="location">{{ photo.location }}</span>
                    <span class="year">{{ photo.year }}</span>
                  </div>
                  <div class="photo-actions">
                    <a-button @click="deletePhoto(photo.id)" danger size="small"> 删除 </a-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="no-photos" v-else>
      <p>暂无{{ province }}的旅行照片</p>
      <button class="add-first-photo-btn" @click="showUploadModal">
        <PlusOutlined /> 添加第一张照片
      </button>
    </div>

    <!-- 上传照片模态框 -->
    <a-modal
      v-model:open="uploadModalVisible"
      title="上传照片"
      @ok="handleUploadPhoto"
      @cancel="closeUploadModal"
      :confirm-loading="uploadConfirmLoading"
    >
      <a-form :model="uploadForm" layout="vertical">
        <a-form-item label="选择照片" required>
          <a-upload
            name="image"
            :multiple="false"
            :showUploadList="true"
            :beforeUpload="beforeUpload"
            :accept="'image/*'"
            :customRequest="customUpload"
            :fileList="fileList"
            @remove="handleRemoveFile"
          >
            <a-button> <UploadOutlined /> 选择图片 </a-button>
          </a-upload>
          <div v-if="uploadForm.url" class="image-preview">
            <img :src="uploadForm.url" alt="预览" class="preview-image" />
          </div>
        </a-form-item>

        <a-form-item label="照片名称" required>
          <a-input v-model:value="uploadForm.name" placeholder="请输入照片名称" />
        </a-form-item>

        <a-form-item label="地点" required>
          <a-input v-model:value="uploadForm.location" placeholder="请输入地点" />
        </a-form-item>

        <a-form-item label="年份" required>
          <a-input-number
            v-model:value="uploadForm.year"
            :min="1900"
            :max="new Date().getFullYear()"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { useTravelsStore } from '@/stores/travels'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const travelsStore = useTravelsStore()

// 获取省份名称
const province = computed(() => route.params.province)

// 获取该省份的照片
const provincePhotos = computed(() => {
  return travelsStore.travels.filter((photo) => photo.province === province.value)
})

// 上传相关
const uploadModalVisible = ref(false)
const uploadConfirmLoading = ref(false)
const fileList = ref([])

const uploadForm = reactive({
  url: '',
  name: '',
  location: '',
  province: '',
  year: new Date().getFullYear(),
})

// 根据索引获取网格类名
const getMasonryClass = (index) => {
  // 特殊布局规则
  if (index === 0) return 'featured' // 第一张图片作为特色图片
  if (index % 7 === 1) return 'wide' // 每第7n+1张图片横向扩展
  if (index % 9 === 3) return 'tall' // 每第9n+3张图片纵向扩展
  if (index % 11 === 5) return 'large' // 每第11n+5张图片大尺寸
  if (index % 5 === 0 && index !== 0) return 'medium' // 每第5n张图片中等尺寸
  return 'small' // 默认小尺寸
}

// 返回上一页
const goBack = () => {
  router.push('/travel')
}

// 显示上传模态框
const showUploadModal = () => {
  uploadForm.province = province.value
  uploadModalVisible.value = true
}

// 关闭上传模态框
const closeUploadModal = () => {
  uploadModalVisible.value = false
  resetUploadForm()
}

// 重置上传表单
const resetUploadForm = () => {
  uploadForm.url = ''
  uploadForm.name = ''
  uploadForm.location = ''
  uploadForm.year = new Date().getFullYear()
  fileList.value = []
}

// 处理上传照片
const handleUploadPhoto = async () => {
  if (
    !uploadForm.url ||
    !uploadForm.name ||
    !uploadForm.location ||
    !uploadForm.province ||
    !uploadForm.year
  ) {
    message.error('请填写完整信息')
    return
  }

  uploadConfirmLoading.value = true
  try {
    // 确保上传的URL被正确传递
    const travelData = {
      ...uploadForm,
      url: uploadForm.url, // 显式传递url字段
    }
    await travelsStore.createTravel(travelData)
    message.success('照片上传成功')
    uploadModalVisible.value = false
    resetUploadForm()
    await travelsStore.fetchTravels() // 重新获取数据
  } catch (error) {
    message.error('上传照片失败: ' + error.message)
  } finally {
    uploadConfirmLoading.value = false
  }
}

// 自定义上传函数
const customUpload = async (options) => {
  const formData = new FormData()
  formData.append('image', options.file)

  try {
    // 使用与API配置一致的上传地址
    const response = await axios.post('/api/upload', formData, {
      baseURL: 'http://localhost:5000',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.success) {
      // 确保URL包含完整的后端服务器地址
      uploadForm.url = `http://localhost:5000${response.data.url}`
      fileList.value = [
        { uid: options.file.uid, name: options.file.name, status: 'done', response: response.data },
      ]
      message.success('图片上传成功')
    } else {
      message.error('图片上传失败')
      options.onError(new Error('上传失败'))
    }
  } catch (error) {
    message.error('图片上传失败: ' + error.message)
    options.onError(error)
  }
}

// 文件移除
const handleRemoveFile = () => {
  uploadForm.url = ''
  fileList.value = []
}

// 限制上传文件类型
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('图片大小不能超过5MB!')
  }
  return isImage && isLt5M
}

// 删除照片
const deletePhoto = async (photoId) => {
  try {
    await travelsStore.deleteTravel(photoId)
    message.success('照片删除成功')
    await travelsStore.fetchTravels() // 重新获取数据
  } catch (error) {
    message.error('删除照片失败: ' + error.message)
  }
}

// 初始化数据
onMounted(async () => {
  await travelsStore.fetchTravels()
})
</script>

<style scoped>
.province-detail-view {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #f8fafc;
  color: #334155;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  background-color: #f1f5f9;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.province-title {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  text-align: center;
  background: linear-gradient(135deg, #40e0d0, #2a9d8f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.province-stats {
  font-size: 18px;
  color: #64748b;
  font-weight: 500;
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

.masonry-item.featured {
  grid-column: span 2;
  grid-row: span 4;
}

.masonry-item.wide {
  grid-column: span 2;
  grid-row: span 2;
}

.masonry-item.tall {
  grid-row: span 3;
}

.masonry-item.large {
  grid-column: span 2;
  grid-row: span 3;
}

.masonry-item.medium {
  grid-row: span 2;
}

.masonry-item.small {
  grid-row: span 1;
}

.photo-card {
  position: relative;
  height: 0; /* 高度由 padding-top 控制 */
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

.masonry-item.featured .photo-wrapper {
}

.masonry-item.tall .photo-wrapper,
.masonry-item.large .photo-wrapper {
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

/* 响应式设计 */
@media (max-width: 1400px) {
  .gallery-masonry {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .masonry-item.featured,
  .masonry-item.large {
    grid-column: span 2;
    grid-row: span 3;
  }
}

@media (max-width: 1024px) {
  .gallery-masonry {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 14px;
  }

  .header-section {
    padding: 16px;
  }

  .province-title {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .province-detail-view {
    padding: 15px;
  }

  .header-section {
    flex-direction: column;
    text-align: center;
    padding: 16px 12px;
  }

  .gallery-masonry {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
    gap: 16px;
  }

  .masonry-item.featured,
  .masonry-item.wide,
  .masonry-item.large,
  .masonry-item.tall {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }

  .photo-wrapper {
    aspect-ratio: 16/9 !important;
  }

  .province-title {
    font-size: 26px;
  }

  .back-button {
    padding: 8px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .province-detail-view {
    padding: 10px;
  }

  .header-section {
    padding: 12px;
  }

  .province-title {
    font-size: 24px;
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

.masonry-item.featured .photo-card {
  padding-top: 62.5%; /* 16:10 比例 */
}

.masonry-item.wide .photo-card {
  padding-top: 50%; /* 2:1 比例 */
}

.masonry-item.tall .photo-card {
  padding-top: 125%; /* 4:5 比例 */
}

.masonry-item.large .photo-card {
  padding-top: 66.67%; /* 3:2 比例 */
}

.masonry-item.medium .photo-card {
  padding-top: 100%; /* 1:1 比例 */
}

/* 修正图片容器样式 */
.photo-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.masonry-item.featured .photo-wrapper {
}

.masonry-item.tall .photo-wrapper,
.masonry-item.large .photo-wrapper {
}
</style>
