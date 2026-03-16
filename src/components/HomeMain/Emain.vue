<template>
  <div>1</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 响应式邮箱状态
const email = ref('')

// 表单提交处理（实际项目需对接接口）
const handleSubmit = () => {
  console.log('订阅邮箱：', email.value)
  // 这里可添加接口请求逻辑（如调用后端订阅接口）
  alert(`订阅成功！我们将向 ${email.value} 发送更新`)
  email.value = '' // 清空输入框
}
</script>
