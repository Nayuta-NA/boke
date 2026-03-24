<template>
  <div class="resource-card">
    <div class="card-content">
      <div class="icon-placeholder">
        <i :class="resource.icon"></i>
      </div>
      <div class="text-content">
        <h3 class="title">{{ resource.title }}</h3>
        <p class="description">{{ resource.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Resource {
  id: number
  title: string
  description: string
  icon: string
  url: string
}

defineProps<{
  resource: Resource
}>()
</script>

<style scoped>
.resource-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-placeholder {
  width: 48px;
  height: 48px;
  background: var(--primary-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.text-content {
  flex: 1;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>