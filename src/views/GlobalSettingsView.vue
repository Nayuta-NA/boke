<template>
  <div class="global-settings">
    <div class="page-header">
      <div class="header-content">
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <h1 class="page-title">全局配置</h1>
      </div>
    </div>

    <div class="settings-content">
      <!-- 全局配置 -->
      <div class="settings-section">
        <div class="section-header">
          <svg
            class="section-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <h2 class="section-title">全局配置</h2>
        </div>

        <div class="config-list-full">
          <!-- 主题颜色 -->
          <div class="config-card-full">
            <div class="card-header">
              <h3 class="card-title">主题颜色</h3>
              <a-button @click="resetToDefault" class="reset-button">
                <svg
                  class="reset-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3 3v5h5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                恢复默认
              </a-button>
            </div>
            <div class="card-body">
              <p class="card-desc">修改网站主色调配置</p>

              <div class="theme-color-editor">
                <!-- 左侧：16 进制输入 -->
                <div class="color-input-wrapper">
                  <label class="input-label">色值（16 进制）</label>
                  <a-input
                    v-model:value="localHexColor"
                    @blur="handleHexColorBlur"
                    placeholder="40E0D0"
                    class="hex-input"
                  >
                    <template #prefix>
                      <span class="hash-symbol">#</span>
                    </template>
                  </a-input>
                </div>

                <!-- 右侧：色盘 -->
                <div class="color-picker-wrapper">
                  <div
                    class="color-palette cursor-pointer"
                    :style="{ backgroundColor: localPrimaryColor }"
                    @click="triggerColorPicker"
                  >
                    <span class="palette-text" :style="{ color: primaryColor }">{{
                      localPrimaryColor
                    }}</span>
                  </div>
                  <input
                    ref="colorInputRef"
                    type="color"
                    v-model="localPrimaryColor"
                    @change="handleColorChange"
                    class="color-picker-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 导航栏颜色 -->
          <div class="config-card-full">
            <div class="card-header">
              <h3 class="card-title">导航栏颜色</h3>
              <a-button @click="resetNavbarToDefault" class="reset-button">
                <svg
                  class="reset-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3 3v5h5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                恢复默认
              </a-button>
            </div>
            <div class="card-body">
              <p class="card-desc">自定义导航栏背景颜色</p>

              <div class="theme-color-editor">
                <!-- 左侧：16 进制输入 -->
                <div class="color-input-wrapper">
                  <label class="input-label">色值（16 进制）</label>
                  <a-input
                    v-model:value="localNavbarHexColor"
                    @blur="handleNavbarHexColorBlur"
                    placeholder="FFFFFF"
                    class="hex-input"
                  >
                    <template #prefix>
                      <span class="hash-symbol">#</span>
                    </template>
                  </a-input>
                </div>

                <!-- 右侧：色盘 -->
                <div class="color-picker-wrapper">
                  <div
                    class="color-palette cursor-pointer"
                    :style="{ backgroundColor: localNavbarColor }"
                    @click="triggerNavbarColorPicker"
                  >
                    <span class="palette-text" :style="{ color: primaryColor }">{{
                      localNavbarColor
                    }}</span>
                  </div>
                  <input
                    ref="navbarColorInputRef"
                    type="color"
                    v-model="localNavbarColor"
                    @change="handleNavbarColorChange"
                    class="color-picker-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 主题背景 -->
          <div class="config-card-full">
            <div class="card-header">
              <h3 class="card-title">主题背景</h3>
              <a-button @click="resetBackgroundToDefault" class="reset-button">
                <svg
                  class="reset-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3 3v5h5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                恢复默认
              </a-button>
            </div>
            <div class="card-body">
              <p class="card-desc">设置页面背景颜色或图片</p>

              <div class="background-config">
                <!-- 背景类型选择 -->
                <div class="background-type-selector">
                  <label class="type-label">背景类型：</label>
                  <a-radio-group
                    v-model:value="localBackgroundType"
                    @change="handleBackgroundTypeChange"
                    button-style="solid"
                    class="theme-radio-group"
                  >
                    <a-radio-button value="color">纯色背景</a-radio-button>
                    <a-radio-button value="image">图片背景</a-radio-button>
                  </a-radio-group>
                </div>

                <!-- 纯色背景配置 -->
                <div v-show="localBackgroundType === 'color'" class="background-color-config">
                  <div class="theme-color-editor">
                    <div class="color-input-wrapper">
                      <label class="input-label">背景颜色</label>
                      <a-input
                        v-model:value="localBgHexColor"
                        @blur="handleBgHexColorBlur"
                        placeholder="F5F5F0"
                        class="hex-input"
                      >
                        <template #prefix>
                          <span class="hash-symbol">#</span>
                        </template>
                      </a-input>
                    </div>

                    <div class="color-picker-wrapper">
                      <div
                        class="color-palette cursor-pointer"
                        :style="{ backgroundColor: localBgColor }"
                        @click="triggerBgColorPicker"
                      >
                        <span class="palette-text" :style="{ color: primaryColor }">{{
                          localBgColor
                        }}</span>
                      </div>
                      <input
                        ref="bgColorInputRef"
                        type="color"
                        v-model="localBgColor"
                        @change="handleBgColorChange"
                        class="color-picker-hidden"
                      />
                    </div>
                  </div>
                </div>

                <!-- 图片背景配置 -->
                <div v-show="localBackgroundType === 'image'" class="background-image-config">
                  <div class="image-upload-section">
                    <label class="input-label">上传背景图片</label>
                    <div class="upload-area">
                      <input
                        ref="bgImageInput"
                        type="file"
                        accept="image/*"
                        @change="handleBackgroundImageUpload"
                        class="file-input"
                      />
                      <div class="upload-placeholder" @click="triggerBgImageUpload">
                        <svg
                          class="upload-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <polyline
                            points="17 8 12 3 7 8"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <line
                            x1="12"
                            y1="3"
                            x2="12"
                            y2="15"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <span class="upload-text">点击上传图片</span>
                        <span class="upload-hint">支持 JPG、PNG 格式，大小不超过 5MB</span>
                      </div>
                    </div>

                    <!-- 图片预览 -->
                    <div v-if="localBackgroundImageUrl" class="image-preview">
                      <img
                        :src="localBackgroundImageUrl"
                        alt="Background Preview"
                        class="preview-image"
                        @error="handleImageError"
                      />
                      <a-button
                        type="danger"
                        size="small"
                        class="remove-image-btn"
                        @click="removeBackgroundImage"
                      >
                        移除图片
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 网站头像 -->
          <div class="config-card-full">
            <div class="card-header">
              <h3 class="card-title">网站头像</h3>
            </div>
            <div class="card-body">
              <p class="card-desc">上传和管理网站头像图片</p>
              <div class="avatar-display">
                <div class="avatar-box">
                  <img :src="avatarUrl" alt="Avatar" class="avatar-image" />
                </div>
              </div>
              <div class="card-actions">
                <a-button type="primary" class="config-button">配置</a-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 页面配置 - 左右布局 -->
      <div class="settings-section page-config-section">
        <div class="section-header">
          <svg
            class="section-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <h2 class="section-title">页面配置</h2>
        </div>

        <div class="page-layout">
          <!-- 左侧：配置项列表 -->
          <div class="config-list">
            <div
              v-for="config in pageConfigs"
              :key="config.id"
              class="list-item"
              :class="{ active: selectedConfigId === config.id }"
              @click="selectConfig(config.id)"
            >
              <div class="list-item-header">
                <h3 class="list-item-title">{{ config.name }}</h3>
                <a-switch
                  v-model:checked="config.enabled"
                  @change="handlePageConfigToggle(config.id, $event)"
                  class="custom-switch small-switch"
                />
              </div>
              <p class="list-item-desc">{{ config.description }}</p>

              <!-- 子配置项 -->
              <div v-if="config.subItems && config.subItems.length > 0" class="sub-items">
                <div v-for="subItem in config.subItems" :key="subItem.id" class="sub-item">
                  <span class="sub-item-name">{{ subItem.name }}</span>
                  <div class="sub-item-status">
                    <span class="status-tag" :class="subItem.enabled ? 'enabled' : 'disabled'">
                      {{ subItem.enabled ? '展示' : '关闭' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：当前配置详情 -->
          <div class="config-preview">
            <div class="preview-header">
              <h3 class="preview-title">
                <svg
                  class="preview-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.005 16.545a2.997 2.997 0 012.997-2.997A2.997 2.997 0 0115 16.545V21h7V9.005a2.997 2.997 0 01-2.997-2.997A2.997 2.997 0 0116.545 9H21v7h-4.995a2.997 2.997 0 01-2.997 2.997 2.997 2.997 0 01-2.997-2.997V21h-7v-4.995z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                当前配置详情：{{ selectedConfig?.name }}
              </h3>
            </div>

            <div class="preview-content">
              <div class="preview-card">
                <div class="preview-row">
                  <span class="preview-label">页面名称：</span>
                  <span class="preview-value">{{ selectedConfig?.name }}</span>
                </div>

                <div class="preview-row">
                  <span class="preview-label">启用状态：</span>
                  <span class="preview-value">
                    <span
                      class="status-badge"
                      :class="selectedConfig?.enabled ? 'enabled' : 'disabled'"
                    >
                      {{ selectedConfig?.enabled ? '已启用' : '已禁用' }}
                    </span>
                  </span>
                </div>

                <div class="preview-row">
                  <span class="preview-label">功能描述：</span>
                  <span class="preview-value desc">{{ selectedConfig?.description }}</span>
                </div>

                <!-- 子配置项详情 -->
                <div
                  v-if="selectedConfig?.subItems && selectedConfig.subItems.length > 0"
                  class="preview-subitems"
                >
                  <div class="preview-subtitle">子配置项详情</div>
                  <div
                    v-for="subItem in selectedConfig.subItems"
                    :key="subItem.id"
                    class="preview-subitem"
                  >
                    <div class="subitem-header">
                      <span class="subitem-name">{{ subItem.name }}</span>
                      <span class="status-tag" :class="subItem.enabled ? 'enabled' : 'disabled'">
                        {{ subItem.enabled ? '展示' : '关闭' }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="preview-actions">
                  <a-button
                    type="primary"
                    class="config-button"
                    :disabled="!selectedConfig?.enabled"
                  >
                    <svg
                      class="button-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    编辑配置
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 返回按钮 -->
      <div class="back-section">
        <a-button @click="goBack" class="back-button">
          <svg class="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          返回个人页面
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Input, message } from 'ant-design-vue'
import { useGlobalSettingsStore } from '@/stores/globalSettings'

const router = useRouter()
const store = useGlobalSettingsStore()

// 颜色选择器引用
const colorInputRef = ref<HTMLInputElement | null>(null)
const navbarColorInputRef = ref<HTMLInputElement | null>(null)
const bgColorInputRef = ref<HTMLInputElement | null>(null)
const bgImageInput = ref<HTMLInputElement | null>(null)

// 从 store 获取数据
const themeColor = computed(() => store.themeColor)
const themeBackground = computed(() => store.themeBackground)
const navbarConfig = computed(() => store.navbarConfig)
const avatarUrl = computed(() => store.avatarUrl)
const pageConfigs = computed(() => store.pageConfigs)
const selectedConfig = computed(() => store.selectedConfig)

// 本地状态用于双向绑定
const selectedConfigId = ref(pageConfigs.value[0]?.id || '')

// 主题颜色本地状态
const localPrimaryColor = ref(themeColor.value.primary)
const localHexColor = ref(themeColor.value.primary.replace('#', ''))

// 导航栏颜色本地状态
const localNavbarColor = ref(navbarConfig.value.backgroundColor)
const localNavbarHexColor = ref(navbarConfig.value.backgroundColor.replace('#', ''))

// 主题背景本地状态
const localBackgroundType = ref(themeBackground.value.type)
const localBgColor = ref(themeBackground.value.color)
const localBgHexColor = ref(themeBackground.value.color.replace('#', ''))
const localBackgroundImageUrl = ref(themeBackground.value.imageUrl)

// 获取主题色的计算属性（实时从 CSS 变量中读取）
const primaryColor = computed(() => {
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() ||
    '#40e0d0'
  )
})

// 十六进制颜色转 RGBA
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 监听 store 变化，同步本地状态
watch(
  () => themeColor.value.primary,
  (newVal) => {
    localPrimaryColor.value = newVal
    localHexColor.value = newVal.replace('#', '')
  },
)

// 监听导航栏颜色变化
watch(
  () => navbarConfig.value.backgroundColor,
  (newVal) => {
    localNavbarColor.value = newVal
    localNavbarHexColor.value = newVal.replace('#', '')
  },
)

// 监听主题背景变化
watch(
  () => themeBackground.value,
  (newVal, oldVal) => {
    // 只在值真正变化时更新本地状态，避免循环更新
    if (newVal.type !== oldVal?.type) {
      localBackgroundType.value = newVal.type
    }
    if (newVal.color !== oldVal?.color) {
      localBgColor.value = newVal.color
      localBgHexColor.value = newVal.color.replace('#', '')
    }
    if (newVal.imageUrl !== oldVal?.imageUrl) {
      localBackgroundImageUrl.value = newVal.imageUrl
    }
  },
  { deep: true },
)

// 初始化选中第一个配置
onMounted(() => {
  if (pageConfigs.value.length > 0) {
    selectedConfigId.value = pageConfigs.value[0].id
    store.selectConfig(pageConfigs.value[0].id)
  }
})

// 触发颜色选择器
const triggerColorPicker = () => {
  if (colorInputRef.value) {
    colorInputRef.value.click()
  }
}

// 触发导航栏颜色选择器
const triggerNavbarColorPicker = () => {
  if (navbarColorInputRef.value) {
    navbarColorInputRef.value.click()
  }
}

// 触发背景颜色选择器
const triggerBgColorPicker = () => {
  if (bgColorInputRef.value) {
    bgColorInputRef.value.click()
  }
}

// 触发背景图片上传
const triggerBgImageUpload = () => {
  if (bgImageInput.value) {
    bgImageInput.value.click()
  }
}

// 处理颜色变化
const handleColorChange = () => {
  localHexColor.value = localPrimaryColor.value.replace('#', '')
  store.updateThemeColor({
    primary: localPrimaryColor.value,
  })
}

const handleHexColorChange = (value: string) => {
  // 移除可能存在的 # 号和空格
  let hexValue = value.replace('#', '').trim()

  // 验证 16 进制颜色格式 (支持 3 位和 6 位)
  if (/^[0-9A-Fa-f]{3,6}$/.test(hexValue)) {
    // 如果是 3 位简写，扩展为 6 位
    if (hexValue.length === 3) {
      hexValue = hexValue
        .split('')
        .map((c) => c + c)
        .join('')
    }
    const formattedColor = '#' + hexValue.toUpperCase()
    localPrimaryColor.value = formattedColor
    localHexColor.value = hexValue.toUpperCase()
    store.updateThemeColor({
      primary: formattedColor,
    })
  } else {
    // 格式不正确时，只更新输入框，不更新 store 和色盘
    localHexColor.value = hexValue.toUpperCase()
  }
}

// 处理输入框失去焦点
const handleHexColorBlur = () => {
  let hexValue = localHexColor.value.replace('#', '').trim()

  // 验证 16 进制颜色格式 (支持 3 位和 6 位)
  if (/^[0-9A-Fa-f]{3,6}$/.test(hexValue)) {
    // 如果是 3 位简写，扩展为 6 位
    if (hexValue.length === 3) {
      hexValue = hexValue
        .split('')
        .map((c) => c + c)
        .join('')
    }
    const formattedColor = '#' + hexValue.toUpperCase()
    localPrimaryColor.value = formattedColor
    localHexColor.value = hexValue.toUpperCase()
    store.updateThemeColor({
      primary: formattedColor,
    })
  } else {
    // 格式不正确，恢复为之前的有效值
    message.warning('颜色格式不正确，请输入有效的十六进制颜色值')
    localHexColor.value = themeColor.value.primary.replace('#', '')
  }
}

// 处理导航栏颜色变化
const handleNavbarColorChange = () => {
  localNavbarHexColor.value = localNavbarColor.value.replace('#', '')
  store.updateNavbarConfig({
    backgroundColor: localNavbarColor.value,
  })
}

const handleNavbarHexColorChange = (value: string) => {
  let hexValue = value.replace('#', '').trim()

  if (/^[0-9A-Fa-f]{3,6}$/.test(hexValue)) {
    // 如果是 3 位简写，扩展为 6 位
    if (hexValue.length === 3) {
      hexValue = hexValue
        .split('')
        .map((c) => c + c)
        .join('')
    }
    const formattedColor = '#' + hexValue.toUpperCase()
    localNavbarColor.value = formattedColor
    localNavbarHexColor.value = hexValue.toUpperCase()
    store.updateNavbarConfig({
      backgroundColor: formattedColor,
    })
  } else {
    // 格式不正确时，只更新输入框
    localNavbarHexColor.value = hexValue.toUpperCase()
  }
}

// 处理导航栏输入框失去焦点
const handleNavbarHexColorBlur = () => {
  let hexValue = localNavbarHexColor.value.replace('#', '').trim()

  // 验证 16 进制颜色格式 (支持 3 位和 6 位)
  if (/^[0-9A-Fa-f]{3,6}$/.test(hexValue)) {
    // 如果是 3 位简写，扩展为 6 位
    if (hexValue.length === 3) {
      hexValue = hexValue
        .split('')
        .map((c) => c + c)
        .join('')
    }
    const formattedColor = '#' + hexValue.toUpperCase()
    localNavbarColor.value = formattedColor
    localNavbarHexColor.value = hexValue.toUpperCase()
    store.updateNavbarConfig({
      backgroundColor: formattedColor,
    })
  } else {
    // 格式不正确，恢复为之前的有效值
    message.warning('颜色格式不正确，请输入有效的十六进制颜色值')
    localNavbarHexColor.value = navbarConfig.value.backgroundColor.replace('#', '')
  }
}

// 处理背景颜色变化
const handleBgColorChange = () => {
  localBgHexColor.value = localBgColor.value.replace('#', '')
  updateBackground({
    type: 'color',
    color: localBgColor.value,
    imageUrl: '',
  })
}

const handleBgHexColorChange = (value: string) => {
  let hexValue = value.replace('#', '').trim()

  if (/^[0-9A-Fa-f]{3,6}$/.test(hexValue)) {
    // 如果是 3 位简写，扩展为 6 位
    if (hexValue.length === 3) {
      hexValue = hexValue
        .split('')
        .map((c) => c + c)
        .join('')
    }
    const formattedColor = '#' + hexValue.toUpperCase()
    localBgColor.value = formattedColor
    localBgHexColor.value = hexValue.toUpperCase()
    updateBackground({
      type: 'color',
      color: formattedColor,
      imageUrl: '',
    })
  } else {
    // 格式不正确时，只更新输入框
    localBgHexColor.value = hexValue.toUpperCase()
  }
}

// 处理背景输入框失去焦点
const handleBgHexColorBlur = () => {
  let hexValue = localBgHexColor.value.replace('#', '').trim()

  // 验证 16 进制颜色格式 (支持 3 位和 6 位)
  if (/^[0-9A-Fa-f]{3,6}$/.test(hexValue)) {
    // 如果是 3 位简写，扩展为 6 位
    if (hexValue.length === 3) {
      hexValue = hexValue
        .split('')
        .map((c) => c + c)
        .join('')
    }
    const formattedColor = '#' + hexValue.toUpperCase()
    localBgColor.value = formattedColor
    localBgHexColor.value = hexValue.toUpperCase()
    updateBackground({
      type: 'color',
      color: formattedColor,
      imageUrl: '',
    })
  } else {
    // 格式不正确，恢复为之前的有效值
    message.warning('颜色格式不正确，请输入有效的十六进制颜色值')
    localBgHexColor.value = themeBackground.value.color.replace('#', '')
  }
}

// 处理背景类型变化
const handleBackgroundTypeChange = (value: any) => {
  if (value === 'color') {
    localBackgroundType.value = 'color'
    updateBackground({
      type: 'color',
      color: localBgColor.value,
      imageUrl: '',
    })
  } else if (value === 'image') {
    localBackgroundType.value = 'image'
    // 如果有图片 URL 则使用，否则保持空
    updateBackground({
      type: 'image',
      color: '',
      imageUrl: localBackgroundImageUrl.value || themeBackground.value.imageUrl,
    })
  }
}

// 处理背景图片 URL 变化
const handleBackgroundImageUrlChange = (value: string) => {
  updateBackground({
    type: 'image',
    color: '',
    imageUrl: value,
  })
}

// 处理背景图片上传
const handleBackgroundImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 文件类型校验
  if (!file.type.startsWith('image/')) {
    message.error('请选择图片文件（支持 JPG、PNG 等格式）')
    return
  }

  // 文件大小校验（5MB）
  if (file.size > 5 * 1024 * 1024) {
    message.error('图片大小不能超过 5MB')
    return
  }

  // 读取文件并转换为 Base64
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    localBackgroundImageUrl.value = result
    localBackgroundType.value = 'image' // 确保设置为 image 类型

    updateBackground({
      type: 'image',
      color: '',
      imageUrl: result,
    })

    message.success('背景图片上传成功')
  }
  reader.onerror = () => {
    message.error('图片读取失败')
  }
  reader.readAsDataURL(file)

  // 清空 input，允许重复选择同一文件
  target.value = ''
}

// 更新背景配置
const updateBackground = (background: { type: string; color: string; imageUrl: string }) => {
  store.updateThemeBackground({
    type: background.type as 'color' | 'image',
    color: background.color,
    imageUrl: background.imageUrl,
  })
}

// 处理图片加载错误
const handleImageError = () => {
  message.error('图片加载失败，请检查 URL 是否正确')
  localBackgroundImageUrl.value = ''
  updateBackground({
    type: 'color',
    color: localBgColor.value,
    imageUrl: '',
  })
}

// 移除背景图片
const removeBackgroundImage = () => {
  localBackgroundImageUrl.value = ''
  localBackgroundType.value = 'color' // 移除后切换回纯色背景
  updateBackground({
    type: 'color',
    color: localBgColor.value,
    imageUrl: '',
  })
  message.success('已移除背景图片')
}

// 恢复默认颜色
const resetToDefault = () => {
  const defaultColor = '#40E0D0'
  localPrimaryColor.value = defaultColor
  localHexColor.value = '40E0D0'
  store.updateThemeColor({
    primary: defaultColor,
  })
}

// 恢复导航栏默认颜色
const resetNavbarToDefault = () => {
  const defaultColor = '#FFFFFF'
  localNavbarColor.value = defaultColor
  localNavbarHexColor.value = 'FFFFFF'
  store.updateNavbarConfig({
    backgroundColor: defaultColor,
  })
}

// 恢复背景默认设置
const resetBackgroundToDefault = () => {
  const defaultColor = '#F5F5F0'
  localBackgroundType.value = 'color'
  localBgColor.value = defaultColor
  localBgHexColor.value = 'F5F5F0'
  localBackgroundImageUrl.value = ''
  store.updateThemeBackground({
    type: 'color',
    color: defaultColor,
    imageUrl: '',
  })
}

const handlePageConfigToggle = (configId: string, checked: boolean) => {
  store.togglePageConfig(configId, checked)
}

// 选择配置项
const selectConfig = (configId: string) => {
  selectedConfigId.value = configId
  store.selectConfig(configId)
}

const goBack = () => {
  router.push('/profile')
}
</script>

<style scoped>
.global-settings {
  min-height: calc(100vh - 60px);
  background: white;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 36px;
  height: 36px;
  color: v-bind(primaryColor);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.settings-content {
  max-width: 1400px;
  margin: 0 auto;
}

.settings-section {
  margin-bottom: 2.5rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid v-bind(primaryColor);
}

.section-icon {
  width: 28px;
  height: 28px;
  color: v-bind(primaryColor);
}

.section-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

/* 全局配置垂直列表 - 替换旧的 config-grid 样式 */
.config-list-full {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.config-card-full {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  width: 100%;
}

.config-card-full:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px v-bind(hexToRgba(primaryColor, 0.15));
  border-color: v-bind(primaryColor);
}

/* 移除旧的 config-grid 相关样式 */
.config-grid {
  display: none; /* 废弃旧的网格布局 */
}

/* 主题颜色编辑器 */
.theme-color-editor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
  align-items: start;
}

/* 背景配置样式 */
.background-config {
  margin-top: 1rem;
}

.background-type-selector {
  margin-bottom: 1.5rem;
}

.type-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  margin-right: 1rem;
}

/* 主题色单选按钮样式 */
.theme-radio-group :deep(.ant-radio-button-wrapper) {
  color: #666;
}

.theme-radio-group :deep(.ant-radio-button-wrapper-checked) {
  background: v-bind(primaryColor);
  border-color: v-bind(primaryColor);
  color: white;
}

.theme-radio-group :deep(.ant-radio-button-wrapper:hover) {
  color: v-bind(primaryColor);
}

.background-color-config,
.background-image-config {
  margin-top: 1rem;
}

.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-url-input {
  width: 100%;
}

.url-icon {
  width: 16px;
  height: 16px;
  color: #999;
}

/* 页面配置 - 左右布局 */
.page-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  min-height: 500px;
}

.config-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
}

.list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px v-bind(hexToRgba(primaryColor, 0.15));
}

.list-item.active {
  border-color: v-bind(primaryColor);
  background: white;
  box-shadow: 0 6px 20px v-bind(hexToRgba(primaryColor, 0.2));
}

.list-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.list-item-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.list-item-desc {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

/* 子配置项 */
.sub-items {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.sub-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.sub-item-name {
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
}

.status-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.status-tag.enabled {
  background: linear-gradient(
    135deg,
    v-bind(primaryColor) 0%,
    v-bind(hexToRgba(primaryColor, 0.8)) 100%
  );
  color: white;
}

.status-tag.disabled {
  background: #e9ecef;
  color: #999;
}

.small-switch {
  transform: scale(0.9);
}

/* 右侧预览区 */
.config-preview {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
  padding: 1.5rem;
  border: 2px solid v-bind(primaryColor);
}

.preview-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid v-bind(primaryColor);
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.preview-icon {
  width: 24px;
  height: 24px;
  color: v-bind(primaryColor);
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.preview-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.preview-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.preview-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #666;
  min-width: 100px;
  flex-shrink: 0;
}

.preview-value {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  flex: 1;
}

.preview-value.desc {
  color: #666;
  font-weight: 400;
  line-height: 1.6;
}

.status-badge {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
}

.status-badge.enabled {
  background: linear-gradient(
    135deg,
    v-bind(primaryColor) 0%,
    v-bind(hexToRgba(primaryColor, 0.8)) 100%
  );
  color: white;
}

.status-badge.disabled {
  background: #e9ecef;
  color: #999;
}

/* 子配置项详情 */
.preview-subitems {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e9ecef;
}

.preview-subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.preview-subitem {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 0.8rem;
}

.subitem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subitem-name {
  font-size: 0.95rem;
  color: #333;
  font-weight: 600;
}

.preview-actions {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e9ecef;
  text-align: right;
}

.button-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
  vertical-align: middle;
}

/* 保留原有的 config-card 样式用于页面配置部分 */
.config-card,
.page-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.config-card:hover,
.page-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px v-bind(hexToRgba(primaryColor, 0.15));
  border-color: v-bind(primaryColor);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-desc {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.avatar-display {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;
}

.avatar-box {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.avatar-image:hover {
  border-color: v-bind(primaryColor);
  transform: scale(1.05);
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.config-button {
  background: linear-gradient(
    135deg,
    v-bind(primaryColor) 0%,
    v-bind(hexToRgba(primaryColor, 0.8)) 100%
  );
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.5rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.config-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px v-bind(hexToRgba(primaryColor, 0.4));
}

.config-button:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.back-section {
  text-align: center;
  margin-top: 3rem;
  padding-bottom: 2rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 2rem;
  background: white;
  color: v-bind(primaryColor);
  border: 2px solid v-bind(primaryColor);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: v-bind(primaryColor);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px v-bind(hexToRgba(primaryColor, 0.3));
}

.back-icon {
  width: 18px;
  height: 18px;
}

/* 恢复默认按钮样式 */
.reset-button {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  color: #666;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.reset-button:hover {
  color: v-bind(primaryColor);
  border-color: v-bind(primaryColor);
  background: v-bind(hexToRgba(primaryColor, 0.05));
  transform: translateY(-1px);
  box-shadow: 0 2px 8px v-bind(hexToRgba(primaryColor, 0.15));
}

.reset-icon {
  width: 14px;
  height: 14px;
}

/* 图片上传区域 */
.upload-area {
  position: relative;
  width: 100%;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.upload-placeholder {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.upload-placeholder:hover {
  border-color: v-bind(primaryColor);
  background: v-bind(hexToRgba(primaryColor, 0.05));
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #999;
  margin-bottom: 1rem;
}

.upload-text {
  display: block;
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.upload-hint {
  display: block;
  font-size: 0.85rem;
  color: #999;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .page-layout {
    grid-template-columns: 1fr;
  }

  .config-preview {
    order: -1;
  }
}

@media (max-width: 1024px) {
  .theme-color-editor {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .global-settings {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.3rem;
  }
}

.color-palette {
  height: 120px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  min-width: 200px;
}

.color-palette::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%);
  pointer-events: none;
}

.palette-text {
  background: rgba(255, 255, 255, 0.95);
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
  white-space: nowrap;
}
</style>
