<template>
  <div class="register-page">
    <!-- 左侧角色区域 -->
    <div class="characters-section">
      <div class="characters-wrapper">
        <!-- 四个角色容器 -->
        <div class="character-container">
          <!-- 紫色角色 - 高矩形 -->
          <div
            ref="purpleRef"
            class="character character-purple"
            :class="{ blinking: isPurpleBlinking }"
            :style="getCharacterBodyStyle('purple')"
          >
            <div class="character-face" :style="getCharacterFaceStyle('purple')">
              <div class="eyes">
                <div class="eye-ball" :class="{ blinking: isPurpleBlinking }">
                  <div class="pupil" :style="getEyeStyle('purple', 1)"></div>
                </div>
                <div class="eye-ball" :class="{ blinking: isPurpleBlinking }">
                  <div class="pupil" :style="getEyeStyle('purple', 2)"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 黑色角色 - 高矩形 -->
          <div
            ref="blackRef"
            class="character character-black"
            :class="{ blinking: isBlackBlinking }"
            :style="getCharacterBodyStyle('black')"
          >
            <div class="character-face" :style="getCharacterFaceStyle('black')">
              <div class="eyes">
                <div class="eye-ball" :class="{ blinking: isBlackBlinking }">
                  <div class="pupil" :style="getEyeStyle('black', 1)"></div>
                </div>
                <div class="eye-ball" :class="{ blinking: isBlackBlinking }">
                  <div class="pupil" :style="getEyeStyle('black', 2)"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 橙色角色 - 半圆形 -->
          <div
            ref="orangeRef"
            class="character character-orange"
            :class="{ blinking: isOrangeBlinking }"
            :style="getCharacterBodyStyle('orange')"
          >
            <div class="character-face" :style="getCharacterFaceStyle('orange')">
              <div class="eyes">
                <div class="pupil-only" :style="getEyeStyle('orange', 1)"></div>
                <div class="pupil-only" :style="getEyeStyle('orange', 2)"></div>
              </div>
            </div>
          </div>

          <!-- 黄色角色 - 高矩形 -->
          <div
            ref="yellowRef"
            class="character character-yellow"
            :class="{ blinking: isYellowBlinking }"
            :style="getCharacterBodyStyle('yellow')"
          >
            <div class="character-face" :style="getCharacterFaceStyle('yellow')">
              <div class="eyes">
                <div class="pupil-only" :style="getEyeStyle('yellow', 1)"></div>
                <div class="pupil-only" :style="getEyeStyle('yellow', 2)"></div>
              </div>
              <div class="mouth-line" :style="getCharacterFaceStyle('yellow')"></div>
            </div>
          </div>
        </div>

        <!-- 互动提示 -->
        <div class="interaction-hint">
          <p class="text-sm">
            <span v-if="focusedField">它们在好奇地看着你输入什么呢~</span>
            <span v-else>创建你的专属账户</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 右侧注册表单 -->
    <div class="register-form-section">
      <div class="form-wrapper">
        <div class="form-header">
          <h1 class="form-title">创建账户</h1>
          <p class="form-subtitle">欢迎加入我们</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <!-- 用户名输入 -->
          <div class="input-group">
            <div class="input-wrapper">
              <UserOutlined class="input-icon" />
              <input
                v-model="registerForm.username"
                type="text"
                placeholder="请输入用户名"
                class="input-field"
                @focus="handleInputFocus('username')"
                @blur="handleInputBlur"
                required
              />
            </div>
          </div>

          <!-- 密码输入 -->
          <div class="input-group">
            <div class="input-wrapper">
              <LockOutlined class="input-icon" />
              <input
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="input-field"
                @focus="handleInputFocus('password')"
                @blur="handleInputBlur"
                required
              />
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                <component :is="showPassword ? 'EyeInvisibleOutlined' : 'EyeOutlined'" />
              </button>
            </div>
          </div>

          <!-- 确认密码输入 -->
          <div class="input-group">
            <div class="input-wrapper">
              <LockOutlined class="input-icon" />
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                class="input-field"
                @focus="handleInputFocus('confirmPassword')"
                @blur="handleInputBlur"
                required
              />
            </div>
          </div>

          <!-- 注册按钮 -->
          <button type="submit" :disabled="loading" class="register-button">
            {{ loading ? '注册中...' : '注册' }}
          </button>

          <!-- 错误信息 -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>

        <!-- 底部信息 -->
        <div class="form-footer">
          <div class="register-link">
            <p>
              已有账户？
              <router-link to="/login" class="link"> 立即登录 </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { message } from 'ant-design-vue'
import { userAPI } from '@/lib/api'
import {
  UserOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

// 状态管理
const loading = ref(false)
const error = ref('')
const focusedField = ref<'username' | 'password' | 'confirmPassword' | null>(null)
const showPassword = ref(false)

// 鼠标位置追踪
const mouseX = ref(0)
const mouseY = ref(0)

// 角色引用
const purpleRef = ref<HTMLDivElement | null>(null)
const blackRef = ref<HTMLDivElement | null>(null)
const orangeRef = ref<HTMLDivElement | null>(null)
const yellowRef = ref<HTMLDivElement | null>(null)

// 眨眼状态
const isPurpleBlinking = ref(false)
const isBlackBlinking = ref(false)
const isOrangeBlinking = ref(false)
const isYellowBlinking = ref(false)

// 互动状态
const isTyping = ref(false)
const isLookingAtEachOther = ref(false)
const isPurplePeeking = ref(false)

// 角色位置计算
const characterPositions = ref({
  purple: { faceX: 0, faceY: 0, bodySkew: 0 },
  black: { faceX: 0, faceY: 0, bodySkew: 0 },
  orange: { faceX: 0, faceY: 0, bodySkew: 0 },
  yellow: { faceX: 0, faceY: 0, bodySkew: 0 },
})

// 鼠标追踪
const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  calculateCharacterPositions()
}

// 计算角色位置
const calculateCharacterPositions = () => {
  const calculatePosition = (ref: HTMLDivElement | null) => {
    if (!ref) return { faceX: 0, faceY: 0, bodySkew: 0 }

    const rect = ref.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 3

    const deltaX = mouseX.value - centerX
    const deltaY = mouseY.value - centerY

    const faceX = Math.max(-15, Math.min(15, deltaX / 20))
    const faceY = Math.max(-10, Math.min(10, deltaY / 30))
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120))

    return { faceX, faceY, bodySkew }
  }

  characterPositions.value = {
    purple: calculatePosition(purpleRef.value),
    black: calculatePosition(blackRef.value),
    orange: calculatePosition(orangeRef.value),
    yellow: calculatePosition(yellowRef.value),
  }
}

// 眨眼效果
const scheduleBlink = (blinkState: any, duration = 150, intervalMin = 3000, intervalMax = 7000) => {
  const randomInterval = Math.random() * (intervalMax - intervalMin) + intervalMin

  const timeout = setTimeout(() => {
    blinkState.value = true
    setTimeout(() => {
      blinkState.value = false
      scheduleBlink(blinkState, duration, intervalMin, intervalMax)
    }, duration)
  }, randomInterval)

  return timeout
}

// 眨眼定时器
let purpleBlinkTimeout: ReturnType<typeof setTimeout>
let blackBlinkTimeout: ReturnType<typeof setTimeout>
let orangeBlinkTimeout: ReturnType<typeof setTimeout>
let yellowBlinkTimeout: ReturnType<typeof setTimeout>

// 偷看密码效果
let purplePeekTimeout: ReturnType<typeof setTimeout>

const schedulePurplePeek = () => {
  purplePeekTimeout = setTimeout(
    () => {
      if (registerForm.password.length > 0 && showPassword.value) {
        isPurplePeeking.value = true
        setTimeout(() => {
          isPurplePeeking.value = false
          schedulePurplePeek()
        }, 800)
      } else {
        schedulePurplePeek()
      }
    },
    Math.random() * 3000 + 2000,
  )
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)

  // 启动眨眼效果
  purpleBlinkTimeout = scheduleBlink(isPurpleBlinking)
  blackBlinkTimeout = scheduleBlink(isBlackBlinking)
  orangeBlinkTimeout = scheduleBlink(isOrangeBlinking, 120, 2000, 5000)
  yellowBlinkTimeout = scheduleBlink(isYellowBlinking, 120, 2500, 6000)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  clearTimeout(purpleBlinkTimeout)
  clearTimeout(blackBlinkTimeout)
  clearTimeout(orangeBlinkTimeout)
  clearTimeout(yellowBlinkTimeout)
  clearTimeout(purplePeekTimeout)
})

// 监听输入状态
const handleInputFocus = (field: 'username' | 'password' | 'confirmPassword') => {
  focusedField.value = field
  isTyping.value = true

  if (field === 'username') {
    isLookingAtEachOther.value = true
    setTimeout(() => {
      isLookingAtEachOther.value = false
    }, 800)
  }

  if (
    (field === 'password' || field === 'confirmPassword') &&
    registerForm.password.length > 0 &&
    showPassword.value
  ) {
    schedulePurplePeek()
  }
}

const handleInputBlur = () => {
  focusedField.value = null
  setTimeout(() => {
    isTyping.value = false
  }, 100)
}

// 计算眼睛样式
const getEyeStyle = (character: string, eyeIndex: number) => {
  const baseStyle = {
    transition: 'all 0.1s ease-out',
  }

  // 密码偷看模式
  if (
    (focusedField.value === 'password' || focusedField.value === 'confirmPassword') &&
    registerForm.password.length > 0 &&
    showPassword.value
  ) {
    if (character === 'purple' && isPurplePeeking.value) {
      return {
        ...baseStyle,
        transform: `translate(4px, 5px)`,
      }
    }
    if (character === 'purple') {
      return {
        ...baseStyle,
        transform: `translate(-4px, -4px)`,
      }
    }
    if (character === 'black') {
      return {
        ...baseStyle,
        transform: `translate(-4px, -4px)`,
      }
    }
    if (character === 'orange' || character === 'yellow') {
      return {
        ...baseStyle,
        transform: `translate(-5px, -4px)`,
      }
    }
  }

  // 互相看模式
  if (isLookingAtEachOther.value) {
    if (character === 'purple') {
      return {
        ...baseStyle,
        transform: `translate(3px, 4px)`,
      }
    }
    if (character === 'black') {
      return {
        ...baseStyle,
        transform: `translate(0px, -4px)`,
      }
    }
  }

  // 输入用户名模式
  if (focusedField.value === 'username') {
    return {
      ...baseStyle,
      transform: `translate(${eyeIndex === 1 ? 2 : 4}px, ${eyeIndex === 1 ? 2 : 4}px)`,
    }
  }

  // 密码回避模式
  if (focusedField.value === 'password' || focusedField.value === 'confirmPassword') {
    return {
      ...baseStyle,
      transform: `translate(${-eyeIndex * 3}px, 0)`,
    }
  }

  return baseStyle
}

// 获取角色身体样式
const getCharacterBodyStyle = (character: string) => {
  const pos = characterPositions.value[character as keyof typeof characterPositions.value]
  const baseStyle = {
    transition: 'all 0.7s ease-in-out',
  }

  // 密码偷看模式
  if (
    (focusedField.value === 'password' || focusedField.value === 'confirmPassword') &&
    registerForm.password.length > 0 &&
    showPassword.value
  ) {
    return {
      ...baseStyle,
      transform: 'skewX(0deg)',
    }
  }

  // 输入模式
  if (
    isTyping.value ||
    ((focusedField.value === 'password' || focusedField.value === 'confirmPassword') &&
      registerForm.password.length > 0)
  ) {
    if (character === 'purple') {
      return {
        ...baseStyle,
        transform: `skewX(${(pos.bodySkew || 0) - 12}deg) translateX(40px)`,
      }
    }
    if (character === 'black') {
      return {
        ...baseStyle,
        transform: `skewX(${(pos.bodySkew || 0) * 1.5}deg)`,
      }
    }
  }

  // 互相看模式
  if (isLookingAtEachOther.value && character === 'black') {
    return {
      ...baseStyle,
      transform: `skewX(${(pos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`,
    }
  }

  // 正常鼠标跟随模式
  return {
    ...baseStyle,
    transform: `skewX(${pos.bodySkew || 0}deg)`,
  }
}

// 获取角色面部位置
const getCharacterFaceStyle = (character: string) => {
  const pos = characterPositions.value[character as keyof typeof characterPositions.value]
  const baseStyle = {
    transition: 'all 0.7s ease-in-out',
  }

  // 密码偷看模式
  if (
    (focusedField.value === 'password' || focusedField.value === 'confirmPassword') &&
    registerForm.password.length > 0 &&
    showPassword.value
  ) {
    if (character === 'purple') {
      return {
        ...baseStyle,
        left: '20px',
        top: '35px',
      }
    }
    if (character === 'black') {
      return {
        ...baseStyle,
        left: '10px',
        top: '28px',
      }
    }
    if (character === 'orange' || character === 'yellow') {
      return {
        ...baseStyle,
        left: '50px',
        top: '85px',
      }
    }
  }

  // 互相看模式
  if (isLookingAtEachOther.value) {
    if (character === 'purple') {
      return {
        ...baseStyle,
        left: '55px',
        top: '65px',
      }
    }
    if (character === 'black') {
      return {
        ...baseStyle,
        left: '32px',
        top: '12px',
      }
    }
  }

  // 正常模式
  return {
    ...baseStyle,
    left: `${45 + (pos.faceX || 0)}px`,
    top: `${40 + (pos.faceY || 0)}px`,
  }
}

// 注册处理
const handleRegister = async () => {
  // 验证密码
  if (registerForm.password !== registerForm.confirmPassword) {
    error.value = '两次输入的密码不一致'
    message.error('两次输入的密码不一致')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await userAPI.create({
      username: registerForm.username,
      password: registerForm.password,
    })

    if (response.data) {
      authStore.login(response.data)
      message.success('注册成功')
      router.push('/')
    }
  } catch (err: any) {
    console.error('注册错误:', err)
    error.value = err.response?.data?.error || '网络错误，请确保后端服务已启动'
    message.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 页面基础样式 */
.register-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
  margin: 0;
}

/* 登录容器 */
.login-container {
  display: flex;
  width: 100%;
  max-width: 1400px;
  height: 100vh;
  background: white;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
}

/* 左侧角色区域 */
.characters-section {
  flex: 3;
  max-width: 60%;
  height: 100vh;
  background: linear-gradient(135deg, #35c9b9 0%, #2a9d8f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
}

.characters-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

/* 角色容器 - 固定尺寸 */
.character-container {
  position: relative;
  width: 550px;
  height: 400px;
}

/* 卡通角色基础样式 */
.character {
  position: absolute;
  bottom: 0;
  transition: all 0.7s ease-in-out;
  transform-origin: bottom center;
}

/* 紫色角色 - 高矩形 */
.character-purple {
  left: 70px;
  width: 180px;
  height: 400px;
  background-color: #6c3ff5;
  border-radius: 10px 10px 0 0;
  z-index: 1;
}

.character-purple.blinking .eye-ball {
  height: 2px !important;
  transition: height 0.15s ease-out;
}

/* 黑色角色 - 高矩形 */
.character-black {
  left: 240px;
  width: 120px;
  height: 310px;
  background-color: #2d2d2d;
  border-radius: 8px 8px 0 0;
  z-index: 2;
}

.character-black.blinking .eye-ball {
  height: 2px !important;
  transition: height 0.15s ease-out;
}

/* 橙色角色 - 半圆形 */
.character-orange {
  left: 0px;
  width: 240px;
  height: 200px;
  background-color: #ff9b6b;
  border-radius: 120px 120px 0 0;
  z-index: 3;
}

.character-orange.blinking .pupil-only {
  height: 2px !important;
  transition: height 0.12s ease-out;
}

/* 黄色角色 - 高矩形 */
.character-yellow {
  left: 310px;
  width: 140px;
  height: 230px;
  background-color: #e8d754;
  border-radius: 70px 70px 0 0;
  z-index: 4;
}

.character-yellow.blinking .pupil-only {
  height: 2px !important;
  transition: height 0.12s ease-out;
}

/* 面部特征 */
.character-face {
  position: absolute;
  width: 100%;
  height: 100%;
}

.eyes {
  position: absolute;
  display: flex;
  gap: 8px;
}

/* 眼白 + 瞳孔结构 */
.eye-ball {
  width: 18px;
  height: 18px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.15s ease-out;
}

.pupil {
  width: 7px;
  height: 7px;
  background-color: #2d2d2d;
  border-radius: 50%;
  transition: all 0.1s ease-out;
}

/* 只有瞳孔（无眼白） */
.pupil-only {
  width: 12px;
  height: 12px;
  background-color: #2d2d2d;
  border-radius: 50%;
  transition: all 0.2s ease-out;
}

/* 嘴巴线条 */
.mouth-line {
  position: absolute;
  width: 80px;
  height: 4px;
  background-color: #2d2d2d;
  border-radius: 2px;
}

/* 互动提示 */
.interaction-hint {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 16px 24px;
  border-radius: 16px;
  text-align: center;
  max-width: 280px;
}

.interaction-hint p {
  color: white;
  font-size: 14px;
  line-height: 1.6;
}

/* 右侧表单区域 */
.register-form-section {
  flex: 2;
  height: 100vh;
  padding: 60px 80px;
  display: flex;
  align-items: center;
  background: white;
}

.form-wrapper {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}

.form-header {
  margin-bottom: 40px;
}

.form-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.input-group {
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 18px;
  pointer-events: none;
}

.input-field {
  width: 100%;
  padding: 14px 48px 14px 48px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #1f2937;
  transition: all 0.3s ease;
  outline: none;
}

.input-field:focus {
  background: white;
  border-color: #35c9b9;
  box-shadow: 0 0 0 4px rgba(53, 201, 185, 0.1);
}

.input-field::placeholder {
  color: #9ca3af;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 18px;
  transition: color 0.3s ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #6b7280;
}

.register-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #35c9b9 0%, #2a9d8f 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(53, 201, 185, 0.3);
}

.register-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #2a9d8f 0%, #1f8a7a 100%);
  box-shadow: 0 6px 20px rgba(53, 201, 185, 0.4);
  transform: translateY(-2px);
}

.register-button:active:not(:disabled) {
  transform: translateY(0);
}

.register-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 12px;
  background: #fdf2f2;
  border-radius: 8px;
  font-size: 14px;
}

.form-footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.register-link .link {
  color: #35c9b9;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-link .link:hover {
  color: #2a9d8f;
}

/* 响应式调整 */
@media (max-width: 900px) {
  .register-page {
    padding: 0;
  }

  .login-container {
    flex-direction: column;
    height: auto;
    max-width: 100%;
  }

  .characters-section {
    padding: 30px 20px;
    min-height: 300px;
    max-width: 100%;
  }

  .character-container {
    width: 100%;
    height: 300px;
  }

  .character-purple {
    width: 140px;
    height: 300px;
    left: 50px;
  }

  .character-black {
    width: 90px;
    height: 230px;
    left: 180px;
  }

  .character-orange {
    width: 180px;
    height: 150px;
    left: 0;
  }

  .character-yellow {
    width: 100px;
    height: 170px;
    left: 230px;
  }

  .eye-ball {
    width: 14px;
    height: 14px;
  }

  .pupil {
    width: 5px;
    height: 5px;
  }

  .pupil-only {
    width: 9px;
    height: 9px;
  }

  .register-form-section {
    padding: 40px 30px;
  }

  .form-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .character-container {
    width: 100%;
    height: 250px;
  }

  .character-purple {
    width: 120px;
    height: 250px;
    left: 40px;
  }

  .character-black {
    width: 80px;
    height: 200px;
    left: 155px;
  }

  .character-orange {
    width: 160px;
    height: 130px;
    left: 0;
  }

  .character-yellow {
    width: 90px;
    height: 150px;
    left: 200px;
  }

  .eye-ball {
    width: 12px;
    height: 12px;
  }

  .pupil {
    width: 4px;
    height: 4px;
  }

  .pupil-only {
    width: 8px;
    height: 8px;
  }

  .register-form-section {
    padding: 30px 20px;
  }

  .form-title {
    font-size: 24px;
  }

  .input-field {
    padding: 12px 42px 12px 42px;
  }
}
</style>
