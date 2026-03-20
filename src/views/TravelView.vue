<template>
  <div class="travel-view-container">
    <!-- 遮罩层 -->
    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <!-- 左侧文章卡片侧边栏 -->
    <div v-if="isSidebarOpen" class="article-sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">{{ selectedProvinceName }}的旅行故事</h2>
        <button class="close-btn" @click="closeSidebar">
          <CloseOutlined />
        </button>
      </div>
      <div class="sidebar-content">
        <div
          v-for="travel in selectedProvinceArticles"
          :key="travel.id"
          class="article-card"
          @click="goToArticle(travel.id)"
        >
          <img :src="travel.cover" :alt="travel.title" class="article-cover" />
          <div class="article-info">
            <h3 class="article-title">{{ travel.title }}</h3>
            <p class="article-excerpt">{{ travel.city }}</p>
            <div class="article-meta">
              <span class="article-year">{{ travel.date }}</span>
            </div>
          </div>
        </div>
        <div v-if="selectedProvinceArticles.length === 0" class="no-articles">
          <p>暂无该省份的旅行记录</p>
        </div>
      </div>
    </div>

    <div class="china-map-container">
      <div ref="mapContainer" class="map-container"></div>
    </div>

    <!-- 省份图册展示区域 -->
    <div class="province-gallery-section">
      <div class="section-header">
        <h2 class="section-title">我的足迹</h2>
        <button class="create-btn" @click="showCreateModal"><PlusOutlined /> 新建记录</button>
      </div>

      <div class="provinces-grid">
        <div
          v-for="province in highlightedProvinces"
          :key="province"
          class="province-card"
          @click="goToProvinceDetail(province)"
        >
          <div class="province-header">
            <h3 class="province-name">{{ province }}</h3>
            <span class="photo-count">{{ getProvincePhotoCount(province) }} 张照片</span>
          </div>
          <div class="province-photos">
            <div
              v-for="(photo, index) in getProvincePhotos(province)"
              :key="index"
              class="photo-item"
              :class="{ featured: index === 0 }"
            >
              <img :src="photo.url" :alt="photo.name" class="photo-image" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建记录模态框 -->
    <a-modal
      v-model:open="createModalVisible"
      title="新建旅行记录"
      @ok="handleCreateRecord"
      @cancel="handleCancelCreate"
      :confirm-loading="confirmLoading"
    >
      <a-form :model="newRecordForm" layout="vertical">
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
          <div v-if="newRecordForm.url" class="image-preview">
            <img :src="newRecordForm.url" alt="预览" class="preview-image" />
          </div>
        </a-form-item>

        <a-form-item label="照片名称" required>
          <a-input v-model:value="newRecordForm.name" placeholder="请输入照片名称" />
        </a-form-item>

        <a-form-item label="地点" required>
          <a-input v-model:value="newRecordForm.location" placeholder="请输入地点" />
        </a-form-item>

        <a-form-item label="所属省份" required>
          <a-select v-model:value="newRecordForm.province" placeholder="请选择所属省份">
            <a-select-option v-for="province in allProvinces" :key="province" :value="province">
              {{ province }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="年份" required>
          <a-input-number
            v-model:value="newRecordForm.year"
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
import { ref, onMounted, onBeforeUnmount, watch, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { PlusOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import chinaJson from '@/components/map/chinaMap.json'
import { useTravelsStore } from '@/stores/travels'
import { useArticlesStore } from '@/stores/articles'
import axios from 'axios'

const router = useRouter()
const travelsStore = useTravelsStore()
const articlesStore = useArticlesStore()

// 省份到省会的映射
const provinceToCapital = ref({
  北京: { name: '北京（直辖市）', lng: 116.4074, lat: 39.9042 },
  天津: { name: '天津（直辖市）', lng: 117.1902, lat: 39.1255 },
  上海: { name: '上海（直辖市）', lng: 121.4737, lat: 31.2304 },
  重庆: { name: '重庆', lng: 106.5049, lat: 29.5331 },
  河北: { name: '石家庄', lng: 114.4995, lat: 38.0339 },
  山西: { name: '太原', lng: 112.5492, lat: 37.857 },
  辽宁: { name: '沈阳', lng: 123.4291, lat: 41.7968 },
  吉林: { name: '长春', lng: 125.3245, lat: 43.8866 },
  黑龙江: { name: '哈尔滨', lng: 126.6424, lat: 45.7569 },
  江苏: { name: '南京', lng: 118.7778, lat: 32.0583 },
  浙江: { name: '杭州', lng: 120.1551, lat: 30.2741 },
  安徽: { name: '合肥', lng: 117.283, lat: 31.8611 },
  福建: { name: '福州', lng: 119.3062, lat: 26.0753 },
  江西: { name: '南昌', lng: 115.8921, lat: 28.6764 },
  山东: { name: '济南', lng: 117.0009, lat: 36.6753 },
  河南: { name: '郑州', lng: 113.6654, lat: 34.7579 },
  湖北: { name: '武汉', lng: 114.3054, lat: 30.5928 },
  湖南: { name: '长沙', lng: 112.9829, lat: 28.115 },
  广东: { name: '广州', lng: 113.2645, lat: 23.1291 },
  海南: { name: '海口', lng: 110.3418, lat: 20.0304 },
  四川: { name: '成都', lng: 104.0657, lat: 30.6595 },
  贵州: { name: '贵阳', lng: 106.7135, lat: 26.5784 },
  云南: { name: '昆明', lng: 102.7122, lat: 25.0406 },
  陕西: { name: '西安', lng: 108.948, lat: 34.2632 },
  甘肃: { name: '兰州', lng: 103.8343, lat: 36.0611 },
  青海: { name: '西宁', lng: 101.7789, lat: 36.6171 },
  台湾: { name: '台北', lng: 121.507, lat: 25.044 },
  内蒙古: { name: '呼和浩特', lng: 111.6708, lat: 40.8187 },
  广西: { name: '南宁', lng: 108.3201, lat: 22.8241 },
  西藏: { name: '拉萨', lng: 91.1322, lat: 29.6604 },
  宁夏: { name: '银川', lng: 106.2782, lat: 38.4663 },
  新疆: { name: '乌鲁木齐', lng: 87.6177, lat: 43.8865 },
})

import tx from '@/components/Orbit/image/tx.jpg'

// 核心配置变量
const avatarUrl = ref(tx)
const currentCityConfig = ref({
  name: '',
  longitude: 135,
  latitude: 35,
})
const targetCityConfig = ref({
  name: '成都',
  longitude: 104.0657,
  latitude: 30.6595,
})
const highlightedProvinces = ref(['西藏', '浙江', '云南', '江苏', '四川', '重庆'])
const styleConfig = ref({
  mainColor: '#40e0d0',
  avatarSize: 60,
  arrowWidth: 2,
  targetMarkerSize: 10,
})

// 所有省份列表
const allProvinces = Object.keys(provinceToCapital.value)

// 地图容器和实例
const mapContainer = ref(null)
const chart = ref(null)

// 新建记录模态框相关
const createModalVisible = ref(false)
const confirmLoading = ref(false)

// 照片展示模态框相关
const photoModalVisible = ref(false)
const currentProvince = ref('')
const currentProvincePhotos = ref([])

// 新记录表单数据
const newRecordForm = reactive({
  url: '',
  name: '',
  location: '',
  province: undefined,
  year: new Date().getFullYear(),
})

// 文件列表
const fileList = ref([])

// 侧边栏相关
const isSidebarOpen = ref(false)
const selectedProvinceName = ref('')
const selectedProvinceArticles = ref([])

// 自定义上传函数
const customUpload = async (options) => {
  const formData = new FormData()
  formData.append('image', options.file)

  try {
    const response = await axios.post('http://localhost:3000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.success) {
      newRecordForm.url = response.data.url
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

// 文件移除处理
const handleRemoveFile = () => {
  newRecordForm.url = ''
  fileList.value = []
}

// 上传前校验
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('图片大小不能超过5MB!')
    return false
  }
  return true
}

// 初始化地图
const initMap = () => {
  if (!mapContainer.value) {
    console.error('地图容器 DOM 不存在，请检查 ref 配置')
    return
  }
  if (chart.value) chart.value.dispose()

  try {
    chart.value = echarts.init(mapContainer.value)
    echarts.registerMap('china', chinaJson)
    updateMap()
  } catch (error) {
    console.error('初始化地图失败:', error)
  }
}

// 更新地图（控制省份样式、省会标记）
const updateMap = () => {
  if (!chart.value) return

  // 生成省份数据：处理名称后缀 + 关联省会
  const provinceData = chinaJson.features.map((feature) => {
    let provinceName = feature.properties.name
    provinceName = provinceName.replace(/省|自治区|直辖市|特别行政区/g, '')
    const isHighlighted = highlightedProvinces.value.some(
      (prov) => provinceName.includes(prov) || prov.includes(provinceName),
    )
    const capitalInfo = provinceToCapital.value[provinceName] || { name: '', lng: null, lat: null }

    return {
      name: feature.properties.name,
      displayName: provinceName,
      value: isHighlighted ? 1 : 0,
      capital: capitalInfo.name,
      capitalLng: capitalInfo.lng,
      capitalLat: capitalInfo.lat,
    }
  })

  const capitalBlackMarkers = provinceData
    .filter((item) => item.value === 1 && item.capitalLng && item.capitalLat)
    .map((item) => ({
      name: item.capital,
      value: [item.capitalLng, item.capitalLat],
    }))

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const { name, capital, value } = params.data
        return value === 1
          ? `<div>省份：${name}</div><div>省会：${capital}</div>`
          : `<div>${name}</div>`
      },
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: styleConfig.value.mainColor,
      borderWidth: 1,
      textStyle: { color: '#333' },
      padding: 8,
      borderRadius: 4,
    },
    geo: {
      map: 'china',
      roam: false,
      zoom: 1.2,
      itemStyle: {
        borderColor: '#ffffff',
        borderWidth: 1.5,
        shadowBlur: 2,
        shadowColor: 'rgba(0, 0, 0, 0.05)',
      },
    },
    visualMap: {
      show: false,
      pieces: [
        { value: 1, color: styleConfig.value.mainColor },
        { value: 0, color: '#f1f5f9' }, // 未点亮省份 → 浅灰色，无绿色
      ],
    },
    series: [
      // 1. 省份地图（控制"点亮/未点亮"样式）
      {
        name: '中国省份',
        type: 'map',
        mapType: 'china',
        roam: false,
        zoom: 1.2,
        label: {
          show: true,
          formatter: (params) => (params.data.value === 1 ? params.data.capital : ''),
          fontSize: 12,
          color: '#fff',
          fontWeight: 'bold',
          padding: [2, 6],
          borderRadius: 2,
        },
        itemStyle: {
          borderColor: '#ffffff',
          borderWidth: 1.5,
          shadowBlur: 2,
          shadowColor: 'rgba(0, 0, 0, 0.05)',
          // 显式控制颜色：点亮→主色，未点亮→浅灰
          color: (params) => (params.data.value === 1 ? styleConfig.value.mainColor : '#f1f5f9'),
        },
        emphasis: {
          itemStyle: {
            color: styleConfig.value.mainColor,
          },
        },
        data: provinceData,
      },
      // 2. 省会黑点标记（仅点亮省份显示，纯黑色圆点）
      {
        name: '省会黑点标记',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'circle', // 圆点形状
        symbolSize: 8,
        itemStyle: {
          color: '#000', // 确保是黑色
          borderColor: '#fff', // 白色边框区分
          borderWidth: 1,
        },
        data: capitalBlackMarkers,
      },
      // 3. 当前城市头像
      {
        name: '当前城市',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: styleConfig.value.avatarSize,
        symbol: `image://${avatarUrl.value}`,
        itemStyle: {
          borderRadius: '50%',
          borderColor: styleConfig.value.mainColor,
          borderWidth: 2,
          shadowBlur: 5,
          shadowColor: `${styleConfig.value.mainColor}80`,
          clip: true,
        },
        label: {
          show: true,
          formatter: currentCityConfig.value.name,
          fontSize: 14,
          color: styleConfig.value.mainColor,
          offset: [0, 40],
          fontWeight: 'bold',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: [3, 8],
          borderRadius: 4,
        },
        data: [
          {
            name: currentCityConfig.value.name,
            value: [currentCityConfig.value.longitude, currentCityConfig.value.latitude],
          },
        ],
        emphasis: {
          scale: true,
          scaleSize: 3,
        },
      },
      // 4. 指向目标城市的箭头
      {
        name: '指向目标城市的箭头',
        type: 'lines',
        coordinateSystem: 'geo',
        effect: {
          show: true,
          period: 4,
          trailLength: 0.2,
          color: styleConfig.value.mainColor,
          symbolSize: 6,
        },
        lineStyle: {
          normal: {
            color: styleConfig.value.mainColor,
            width: styleConfig.value.arrowWidth,
            curveness: 0.1,
          },
        },
        data: [
          {
            coords: [
              [currentCityConfig.value.longitude, currentCityConfig.value.latitude],
              [targetCityConfig.value.longitude, targetCityConfig.value.latitude],
            ],
            symbol: ['none', 'arrow'],
          },
        ],
      },
      // 5. 目标城市标记
      {
        name: '目标城市标记',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: styleConfig.value.targetMarkerSize,
        symbol: 'circle',
        itemStyle: {
          color: styleConfig.value.mainColor,
          borderColor: '#fff',
          borderWidth: 2,
        },
        data: [
          {
            name: targetCityConfig.value.name,
            value: [targetCityConfig.value.longitude, targetCityConfig.value.latitude],
          },
        ],
      },
    ],
  }

  try {
    chart.value.setOption(option)

    // 添加点击事件监听 - 点击地图省份时显示文章侧边栏
    chart.value.on('click', (params) => {
      if (params.seriesType === 'map' && params.data.value === 1) {
        // 只有已点亮的省份才可点击
        const provinceName = params.data.displayName
        if (provinceName) {
          console.log('点击地图省份:', provinceName)
          selectProvince(provinceName)
        }
      }
    })
  } catch (error) {
    console.error('设置地图配置失败:', error)
  }
}

// 窗口 resize 处理
const handleResize = () => chart.value && chart.value.resize()

// 显示创建模态框
const showCreateModal = () => {
  createModalVisible.value = true
}

// 处理创建记录
const handleCreateRecord = () => {
  if (
    !newRecordForm.url ||
    !newRecordForm.name ||
    !newRecordForm.location ||
    !newRecordForm.province
  ) {
    message.warning('请填写所有必填项')
    return
  }

  confirmLoading.value = true

  // 模拟创建记录的异步操作
  setTimeout(() => {
    try {
      // 创建新记录对象
      const newRecord = {
        url: newRecordForm.url,
        name: newRecordForm.name,
        location: newRecordForm.location,
        province: newRecordForm.province,
        year: newRecordForm.year,
      }

      // 将新记录添加到数据源中
      detailTravelData.push(newRecord)

      // 更新按省份组织的数据
      if (!provinceTravelData[newRecordForm.province]) {
        provinceTravelData[newRecordForm.province] = []
      }
      provinceTravelData[newRecordForm.province].push(newRecord)

      // 如果该省份之前未点亮，现在将其添加到点亮列表中
      if (!highlightedProvinces.value.includes(newRecordForm.province)) {
        highlightedProvinces.value.push(newRecordForm.province)
        // 更新地图显示
        updateMap()
      }

      // 重置表单
      Object.assign(newRecordForm, {
        url: '',
        name: '',
        location: '',
        province: undefined,
        year: new Date().getFullYear(),
      })

      // 关闭模态框
      createModalVisible.value = false
      confirmLoading.value = false

      message.success('记录创建成功')
    } catch (error) {
      confirmLoading.value = false
      message.error('创建记录失败')
    }
  }, 1000)
}

// 取消创建记录
const handleCancelCreate = () => {
  createModalVisible.value = false

  // 重置表单
  Object.assign(newRecordForm, {
    url: '',
    name: '',
    location: '',
    province: undefined,
    year: new Date().getFullYear(),
  })
}

// 获取省份照片数量
const getProvincePhotoCount = (province) => {
  return travelsStore.travels.filter((travel) => travel.province === province).length
}

// 获取省份照片
const getProvincePhotos = (province) => {
  return travelsStore.travels.filter((travel) => travel.province === province).slice(0, 3) // 只显示前3张
}

// 显示省份照片
const showProvincePhotos = (province) => {
  currentProvince.value = province
  currentProvincePhotos.value = getProvincePhotos(province)
  photoModalVisible.value = true
}

// 关闭照片模态框
const closePhotoModal = () => {
  photoModalVisible.value = false
  currentProvince.value = ''
  currentProvincePhotos.value = []
}

// 选择省份（从 articles.json 筛选该省份的旅游文章）
const selectProvince = async (province) => {
  console.log('点击省份:', province)

  // 确保已加载文章数据
  if (articlesStore.articles.length === 0) {
    await articlesStore.fetchArticles()
  }

  // 从 articles.json 中筛选该省份的旅游文章
  const allArticles = articlesStore.articles

  const filteredArticles = allArticles.filter(
    (article) => article.category === '旅游' && article.province === province,
  )

  console.log(`筛选 ${province} 的文章:`, filteredArticles)

  if (filteredArticles.length === 0) {
    message.info(`暂无${province}的旅行记录`)
  }

  selectedProvinceName.value = province
  selectedProvinceArticles.value = filteredArticles
  isSidebarOpen.value = true
}

// 关闭侧边栏
const closeSidebar = () => {
  isSidebarOpen.value = false
  selectedProvinceName.value = ''
  selectedProvinceArticles.value = []
}

// 跳转到文章详情页
const goToArticle = (articleId) => {
  router.push(`/articles/${articleId}`)
}

// 跳转到省份详情页
const goToProvinceDetail = (province) => {
  router.push(`/travel/${province}`)
}

// 监听配置变化，自动更新地图
watch(
  [
    currentCityConfig,
    targetCityConfig,
    highlightedProvinces,
    avatarUrl,
    styleConfig,
    provinceToCapital,
  ],
  updateMap,
  { deep: true },
)

// 生命周期钩子
onMounted(() => {
  setTimeout(initMap, 300)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chart.value) chart.value.dispose()
})
</script>

<style scoped>
.travel-view-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.china-map-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.map-container {
  width: 100%;
  height: 500px;
}

.province-gallery-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #40e0d0;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.create-btn:hover {
  background-color: #34c7ba;
}

.provinces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.province-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.province-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.image-preview {
  margin-top: 12px;
  text-align: center;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.province-header {
  padding: 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.province-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.photo-count {
  font-size: 14px;
  color: #64748b;
}

.province-photos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 4px;
  background: #f1f5f9;
}

.photo-item {
  aspect-ratio: 1;
  overflow: hidden;
}

.photo-item.featured {
  grid-column: span 2;
  grid-row: span 2;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo-item:hover .photo-image {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .travel-view-container {
    padding: 12px;
  }

  .provinces-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
}

/* 遮罩层 */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* 左侧文章卡片侧边栏 */
.article-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 450px;
  background: white;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: #f3f4f6;
  color: #1a1a1a;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.article-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.article-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.article-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.article-info {
  padding: 16px;
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.article-excerpt {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #9ca3af;
}

.article-location {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-year {
  font-weight: 500;
}

.no-articles {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  font-size: 16px;
}
</style>
