<template>
  <div class="province-detail-view">
    <div class="header-section">
      <button class="back-button" @click="goBack"><ArrowLeftOutlined /> 返回</button>
      <h1 class="province-title">{{ province }}</h1>
      <div class="province-stats">
        <span class="photo-count">{{ provincePhotos.length }} 张照片</span>
        <!-- 添加照片按钮 - 仅登录用户可见 -->
        <button v-if="canCreate()" class="add-photo-btn" @click="showUploadModal">
          <PlusOutlined /> 添加照片
        </button>
      </div>
    </div>

    <div class="gallery-container" v-if="provincePhotos.length > 0">
      <!-- 瀑布流布局 -->
      <div class="waterfall-grid">
        <div
          v-for="(photo, index) in provincePhotos"
          :key="photo.id || index"
          class="waterfall-item"
        >
          <div class="photo-card">
            <!-- 右上角删除按钮 - 仅登录用户可见 -->
            <button v-if="canDelete()" class="delete-btn" @click.stop="deletePhoto(photo.id)">
              <CloseOutlined />
            </button>

            <div class="photo-wrapper" @click="openPhotoModal(photo, index)">
              <img :src="photo.url" :alt="photo.name" class="photo-image" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="no-photos" v-else>
      <p>暂无{{ province }}的旅行照片</p>
      <!-- 添加第一张照片按钮 - 仅登录用户可见 -->
      <button v-if="canCreate()" class="add-first-photo-btn" @click="showUploadModal">
        <PlusOutlined /> 添加第一张照片
      </button>
    </div>

    <!-- 照片详情模态框 -->
    <div v-if="isPhotoModalOpen" class="photo-modal-overlay" @click="closePhotoModal">
      <div class="photo-modal-content" @click.stop>
        <button class="modal-close-btn" @click="closePhotoModal">
          <CloseOutlined />
        </button>

        <!-- 左右切换按钮 -->
        <button class="nav-btn prev-btn" @click="navigatePhoto(-1)" :disabled="currentIndex === 0">
          <LeftOutlined />
        </button>
        <button
          class="nav-btn next-btn"
          @click="navigatePhoto(1)"
          :disabled="currentIndex === provincePhotos.length - 1"
        >
          <RightOutlined />
        </button>

        <!-- 单张大图展示 -->
        <div class="photo-viewer">
          <img :src="currentPhoto?.url" :alt="currentPhoto?.name" class="viewer-image" />
        </div>

        <!-- 底部计数器和导航点 -->
        <div class="modal-footer">
          <span class="photo-counter">{{ currentIndex + 1 }} / {{ provincePhotos.length }}</span>
          <div class="pagination-dots">
            <span
              v-for="(photo, index) in provincePhotos"
              :key="photo.id || index"
              class="dot"
              :class="{ active: index === currentIndex }"
              @click="goToPhoto(index)"
            ></span>
          </div>
        </div>
      </div>
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
          <a-upload-dragger
            name="image"
            :multiple="true"
            :showUploadList="true"
            :beforeUpload="beforeUpload"
            :accept="'image/*'"
            :customRequest="customUpload"
            :fileList="fileList"
            @remove="handleRemoveFile"
          >
            <p class="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p class="ant-upload-hint">支持单次或批量上传，每次最多上传 10 张图片</p>
          </a-upload-dragger>

          <!-- 预览区域 -->
          <div v-if="previewImages.length > 0" class="preview-grid">
            <div v-for="(img, index) in previewImages" :key="index" class="preview-item">
              <img :src="img" alt="预览" class="preview-image" />
            </div>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  ArrowLeftOutlined,
  PlusOutlined,
  UploadOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  InboxOutlined,
} from '@ant-design/icons-vue'
import { useTravelsStore } from '@/stores/travels'
import { useAuthStore } from '@/stores/auth'
import { canCreate, canDelete } from '@/lib/permissions'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const travelsStore = useTravelsStore()
const authStore = useAuthStore()

// 获取省份名称
const province = computed(() => route.params.province)

// 获取该省份的照片
const provincePhotos = computed(() => {
  return travelsStore.travels.filter((photo) => photo.province === province.value)
})

// 模态框相关
const isPhotoModalOpen = ref(false)
const currentPhoto = ref(null)
const currentIndex = ref(0)

// 打开照片模态框
const openPhotoModal = (photo, index) => {
  currentPhoto.value = photo
  currentIndex.value = index
  isPhotoModalOpen.value = true
}

// 关闭照片模态框
const closePhotoModal = () => {
  isPhotoModalOpen.value = false
  currentPhoto.value = null
  currentIndex.value = 0
}

// 导航照片
const navigatePhoto = (direction) => {
  const newIndex = currentIndex.value + direction
  if (newIndex >= 0 && newIndex < provincePhotos.value.length) {
    currentIndex.value = newIndex
    currentPhoto.value = provincePhotos.value[newIndex]
  }
}

// 跳转到指定照片
const goToPhoto = (index) => {
  currentIndex.value = index
  currentPhoto.value = provincePhotos.value[index]
}

// 上传相关
const uploadModalVisible = ref(false)
const uploadConfirmLoading = ref(false)
const fileList = ref([])
const previewImages = ref([])

const uploadForm = reactive({
  url: '',
  province: '',
  name: '',
  location: '',
  year: new Date().getFullYear(),
})

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
  previewImages.value = []
}

// 处理上传照片 - 修改为支持批量上传
const handleUploadPhoto = async () => {
  if (fileList.value.length === 0) {
    message.error('请选择照片')
    return
  }

  uploadConfirmLoading.value = true
  try {
    // 创建文件列表的副本，避免在上传过程中被修改
    const filesToUpload = [...fileList.value]

    // 批量上传所有选中的图片 - 改为串行处理，避免并发冲突
    for (const fileItem of filesToUpload) {
      // 从 response 中获取正确的 URL
      const imageUrl = fileItem.url || `http://localhost:5000${fileItem.response?.url}`

      const travelData = {
        url: imageUrl,
        province: province.value,
        name: uploadForm.name,
        location: uploadForm.location,
        year: uploadForm.year,
      }
      console.log('上传旅行数据:', travelData) // 调试用
      await travelsStore.createTravel(travelData)
    }

    message.success(`成功上传 ${filesToUpload.length} 张照片`)
    uploadModalVisible.value = false
    resetUploadForm()

    // 重新获取最新数据，确保显示所有照片
    await travelsStore.fetchTravels()
  } catch (error) {
    message.error('上传照片失败：' + error.message)
  } finally {
    uploadConfirmLoading.value = false
  }
}

// 自定义上传函数 - 修改为累积添加文件
const customUpload = async (options) => {
  const formData = new FormData()
  formData.append('image', options.file)

  try {
    const response = await axios.post('/api/upload', formData, {
      baseURL: 'http://localhost:5000',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.success) {
      const imageUrl = `http://localhost:5000${response.data.url}`

      // 累积添加文件到列表，而不是替换
      fileList.value.push({
        uid: options.file.uid,
        name: options.file.name,
        status: 'done',
        url: imageUrl,
        response: response.data,
      })

      // 累积添加预览图片
      previewImages.value.push(imageUrl)

      message.success(`${options.file.name} 上传成功`)
      options.onSuccess(response.data)
    } else {
      message.error('图片上传失败')
      options.onError(new Error('上传失败'))
    }
  } catch (error) {
    message.error('图片上传失败：' + error.message)
    options.onError(error)
  }
}

// 文件移除 - 修改为只移除指定文件
const handleRemoveFile = (file) => {
  // 从 fileList 中移除对应的文件
  fileList.value = fileList.value.filter((item) => item.uid !== file.uid)

  // 从 previewImages 中移除对应的预览图
  if (file.url) {
    previewImages.value = previewImages.value.filter((url) => url !== file.url)
  }

  // 如果所有文件都被移除，重置上传表单的 url
  if (fileList.value.length === 0) {
    uploadForm.url = ''
  }
}

// 限制上传文件类型
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('图片大小不能超过 5MB!')
  }
  return isImage && isLt5M
}

// 删除照片
const deletePhoto = async (photoId) => {
  try {
    await travelsStore.deleteTravel(photoId)
    message.success('照片删除成功')
    await travelsStore.fetchTravels()
  } catch (error) {
    message.error('删除照片失败：' + error.message)
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
  background: var(--app-background);
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: var(--app-background);
  color: #334155;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  background-color: var(--navbar-color);
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

/* 瀑布流布局 */
.waterfall-grid {
  column-count: 4;
  column-gap: 16px;
  padding: 10px;
}

.waterfall-item {
  break-inside: avoid;
  margin-bottom: 16px;
}

.photo-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: var(--app-background);
  transition: all 0.3s ease;
}

.photo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 右上角删除按钮 */
.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 59, 48, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 20;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.photo-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(255, 59, 48, 1);
  transform: scale(1.15);
}

.photo-wrapper {
  width: 100%;
  cursor: pointer;
}

.photo-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
}

.photo-card:hover .photo-image {
  transform: scale(1.05);
}

.no-photos {
  text-align: center;
  padding: 80px 20px;
  background: var(--app-background);
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.no-photos p {
  font-size: 20px;
  color: #94a3b8;
  margin: 0;
}

/* 照片模态框样式 */
.photo-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.photo-modal-content {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn {
  position: absolute;
  top: 30px;
  right: 30px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 32px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 100;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* 左右切换按钮 */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  font-size: 32px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 100;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.prev-btn {
  left: 30px;
}

.next-btn {
  right: 30px;
}

/* 照片查看器 */
.photo-viewer {
  width: 100%;
  height: 100%;
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

/* 底部计数器和导航点 */
.modal-footer {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 100;
}

.photo-counter {
  font-size: 18px;
  color: white;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.pagination-dots {
  display: flex;
  gap: 10px;
  align-items: center;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: scale(1.2);
}

.dot.active {
  background: white;
  width: 14px;
  height: 14px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .waterfall-grid {
    column-count: 3;
  }
}

@media (max-width: 1024px) {
  .waterfall-grid {
    column-count: 3;
    column-gap: 14px;
  }

  .header-section {
    padding: 16px;
  }

  .province-title {
    font-size: 28px;
  }

  .nav-btn {
    width: 50px;
    height: 50px;
    font-size: 28px;
  }

  .prev-btn {
    left: 20px;
  }

  .next-btn {
    right: 20px;
  }

  .delete-btn {
    width: 32px;
    height: 32px;
    font-size: 16px;
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

  .waterfall-grid {
    column-count: 2;
    column-gap: 12px;
  }

  .province-title {
    font-size: 26px;
  }

  .back-button {
    padding: 8px 16px;
    font-size: 14px;
  }

  .nav-btn {
    width: 45px;
    height: 45px;
    font-size: 24px;
  }

  .modal-close-btn {
    top: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
    font-size: 28px;
  }

  .modal-footer {
    bottom: 30px;
  }

  .delete-btn {
    width: 30px;
    height: 30px;
    font-size: 14px;
    top: 8px;
    right: 8px;
  }
}

@media (max-width: 480px) {
  .waterfall-grid {
    column-count: 2;
    column-gap: 10px;
  }

  .province-title {
    font-size: 24px;
  }
}
</style>
