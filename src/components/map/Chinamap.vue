<template>
  <div class="china-map-container">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import chinaJson from '@/components/map/chinaMap.json'

const router = useRouter()

// 获取主题色
const primaryColor = computed(() => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color')
    .trim() || '#40e0d0'
})

// 定义组件属性
const props = defineProps({
  visitedCities: {
    type: Array,
    default: () => [],
  },
})

// 省份到省会映射表
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

// 移除原有配置变量，简化为仅支持访问城市功能
const avatarUrl = ref(tx)

// 地图容器和实例
const mapContainer = ref(null)
const chart = ref(null)

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
    const isVisited = props.visitedCities.some(
      (city) => city.includes(provinceName) || provinceName.includes(city)
    )
    const capitalInfo = provinceToCapital.value[provinceName] || { name: '', lng: null, lat: null }

    return {
      name: feature.properties.name,
      visited: isVisited,
      capital: capitalInfo,
      displayName: provinceName, // 添加displayName用于跳转
    }
  })

  // 生成城市数据（访问过的城市）
  const cityData = props.visitedCities
    .map((cityName) => {
      // 简化处理，实际项目中可能需要更复杂的映射
      const cityCoords = Object.values(provinceToCapital.value).find((capital) =>
        capital.name.includes(cityName)
      )

      return {
        name: cityName,
        value: cityCoords ? [cityCoords.lng, cityCoords.lat] : [0, 0],
      }
    })
    .filter((city) => city.value[0] !== 0) // 过滤掉找不到坐标的

  const option = {
    // 鼠标悬停提示框
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return `${params.name}`
      },
    },
    // 视觉映射配置（控制访问过/未访问过的省份颜色）
    visualMap: {
      min: 0,
      max: 1,
      inRange: {
        color: ['#e0e0e0', primaryColor.value],
      },
      show: false, // 隐藏视觉映射图例
    },
    // 地理坐标系配置
    geo: {
      map: 'china',  // 修改：使用 'map' 替代 'mapType'
      roam: false,
      zoom: 1.2,
      selectedMode: false,
      label: {
        emphasis: { show: false },
      },
      itemStyle: {
        areaColor: '#f0f0f0',
        borderColor: '#fff',
        borderWidth: 1,
      },
      emphasis: {
        itemStyle: {
          areaColor: '#cceee8',
        },
      },
    },
    // 系列列表（定义图表数据和样式）
    series: [
      // 省份数据系列
      {
        name: '访问状态',
        type: 'map',
        geoIndex: 0,
        data: provinceData.map((province) => ({
          name: province.name,
          value: province.visited ? 1 : 0,
          displayName: province.displayName // 添加 displayName 用于跳转
        })),
      },
      // 城市标记系列
      {
        name: '访问城市',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: cityData,
        symbolSize: 10,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
        },
        hoverAnimation: true,
        label: {
          show: false,
        },
        itemStyle: {
          color: primaryColor.value,
          shadowBlur: 10,
          shadowColor: primaryColor.value,
        },
        emphasis: {
          label: { show: true },
        },
      },
    ],
  }

  try {
    chart.value.setOption(option)
    
    // 添加点击事件监听
    chart.value.on('click', (params) => {
      if (params.seriesType === 'map' && params.data.value === 1) {
        // 只有已点亮的省份才可点击跳转
        const provinceName = params.data.displayName
        if (provinceName) {
          router.push(`/province/${provinceName}`)
        }
      }
    })
  } catch (error) {
    console.error('设置地图配置失败:', error)
  }
}

// 窗口大小变化处理
const handleResize = () => {
  if (chart.value) {
    chart.value.resize()
  }
}

// 生命周期钩子
onMounted(() => {
  initMap()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chart.value) chart.value.dispose()
})

// 监听访问城市列表变化，自动更新地图
watch(() => props.visitedCities, updateMap, { deep: true })
</script>

<style scoped>
.china-map-container {
  width: 100%;
  height: calc(100vh);
  min-height: 500px;
  box-sizing: border-box;
}
.map-container {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .china-map-container {
    height: calc(100vh);
    padding: 8px;
  }
  .map-container {
    border-radius: 8px;
  }
  .map-container :deep(.echarts-label) {
    font-size: 10px !important;
    padding: 1px 4px !important;
  }
}
</style>
