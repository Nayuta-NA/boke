<template>
  <div class="books-view">
    <div class="page-header">
      <InteractiveHoverButton text="返回" class="bg-[#f0f2f5] text-[#666]" @click="goBack" />
      <h1 class="page-title flex">书本推荐</h1>
      <div class="ml-50vw">
        <a-button v-if="canCreate()" type="primary" @click="showAddModal" class="create-button">
          <template #icon><i class="fas fa-plus"></i></template>
          新建书籍
        </a-button>
      </div>
    </div>

    <!-- 书籍列表容器 -->
    <div class="books-container">
      <div class="books-grid">
        <div v-for="book in books" :key="book.id" class="book-card" @click="viewBookDetail(book)">
          <div class="book-cover">
            <img
              :src="getBookCover(book.cover)"
              :alt="book.title"
              @error="handleImageError"
              style="width: 100%; height: 100%; object-fit: cover"
            />
          </div>
          <div class="book-content">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author }}</p>

            <div class="book-tags">
              <a-tag
                v-for="tag in book.tags.slice(0, 3)"
                :key="tag"
                :color="getTagColor(tag)"
                class="book-tag"
              >
                {{ tag }}
              </a-tag>
            </div>

            <p class="book-description">
              {{ book.description?.slice(0, 100) || '暂无简介'
              }}{{ book.description && book.description.length > 100 ? '...' : '' }}
            </p>

            <div class="book-rating">
              <a-rate :value="book.rating" disabled />
              <span class="rating-text">{{ book.rating.toFixed(1) }}</span>

              <div class="actions" style="margin-left: auto">
                <a-button
                  v-if="canDelete()"
                  type="text"
                  danger
                  size="small"
                  @click.stop="confirmDelete(book)"
                >
                  删除
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div v-if="books.length === 0" class="empty-state">
        <a-empty description="暂无书籍推荐">
          <a-button v-if="canCreate()" type="primary" @click="showAddModal">
            添加第一本书籍
          </a-button>
        </a-empty>
      </div>
    </div>

    <!-- 书籍详情弹窗 -->
    <a-modal
      v-model:open="bookModalVisible"
      :title="selectedBook?.title"
      width="800px"
      :footer="null"
    >
      <div v-if="selectedBook" class="book-detail">
        <div class="detail-header">
          <div class="detail-cover">
            <img
              :src="getBookCover(selectedBook.cover)"
              :alt="selectedBook.title"
              @error="handleImageError"
              style="width: 100%; height: 100%; object-fit: cover"
            />
          </div>
          <div class="detail-info">
            <h2 class="detail-title">{{ selectedBook.title }}</h2>
            <p class="detail-author">作者：{{ selectedBook.author }}</p>
            <p v-if="selectedBook.publisher" class="detail-publisher">
              出版社：{{ selectedBook.publisher }}
            </p>
            <p v-if="selectedBook.publicationDate" class="detail-publication">
              出版时间：{{ selectedBook.publicationDate }}
            </p>

            <div class="detail-tags">
              <a-tag
                v-for="tag in selectedBook.tags"
                :key="tag"
                :color="getTagColor(tag)"
                class="detail-tag"
              >
                {{ tag }}
              </a-tag>
            </div>

            <div class="detail-rating">
              <a-rate :value="selectedBook.rating" disabled />
              <span class="rating-text">{{ selectedBook.rating.toFixed(1) }} 分</span>
            </div>
          </div>
        </div>

        <div class="detail-content">
          <h4>书籍简介</h4>
          <p class="detail-description">{{ selectedBook.description || '暂无简介' }}</p>

          <h4>推荐理由</h4>
          <p class="detail-recommendation">{{ selectedBook.recommendation || '暂无推荐理由' }}</p>
        </div>
      </div>
    </a-modal>

    <!-- 新建书籍弹窗 -->
    <a-modal
      v-model:open="isModalVisible"
      title="新建书籍推荐"
      @ok="handleAddBook"
      :confirmLoading="isSubmitting"
      okText="确定"
      cancelText="取消"
    >
      <a-form :model="newBook" layout="vertical">
        <a-form-item label="书名" required>
          <a-input v-model:value="newBook.title" placeholder="请输入书名" maxLength="200" />
        </a-form-item>

        <a-form-item label="作者" required>
          <a-input v-model:value="newBook.author" placeholder="请输入作者" maxLength="100" />
        </a-form-item>

        <a-form-item label="封面图片 URL">
          <a-input v-model:value="newBook.cover" placeholder="请输入封面图片链接 (可选)" />
        </a-form-item>

        <a-form-item label="出版社">
          <a-input v-model:value="newBook.publisher" placeholder="请输入出版社" maxLength="100" />
        </a-form-item>

        <a-form-item label="出版时间">
          <a-input
            v-model:value="newBook.publicationDate"
            placeholder="请输入出版时间"
            maxLength="50"
          />
        </a-form-item>

        <a-form-item label="书籍简介">
          <a-textarea
            v-model:value="newBook.description"
            placeholder="请输入书籍简介"
            :rows="3"
            maxLength="1000"
          />
        </a-form-item>

        <a-form-item label="推荐理由">
          <a-textarea
            v-model:value="newBook.recommendation"
            placeholder="请输入推荐理由"
            :rows="3"
            maxLength="1000"
          />
        </a-form-item>

        <a-form-item label="标签">
          <a-select
            v-model:value="newBook.tags"
            mode="tags"
            placeholder="添加标签 (按 Enter 确认)"
            :maxTagCount="5"
          />
        </a-form-item>

        <a-form-item label="评分">
          <a-rate v-model:value="newBook.rating" :count="5" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import InteractiveHoverButton from '@/components/button.vue'
import { canCreate, canDelete } from '@/lib/permissions'

// 导入图片
import jsndkImg from '@/IMG/tstp/jsndk.png'
import vuesj from '@/IMG/tstp/vuesj.png'
import jsgj from '@/IMG/tstp/jsgj.png'
import jsjzc from '@/IMG/tstp/jsjzc.png'

interface BookItem {
  id: number
  title: string
  author: string
  cover: string
  description: string
  recommendation: string
  tags: string[]
  rating: number
  publisher: string
  publicationDate: string
}

const router = useRouter()

// 本地书籍数据（使用导入的图片）
const books = ref<BookItem[]>([
  {
    id: 1,
    title: 'JavaScript 高级程序设计',
    author: 'Nicholas C. Zakas',
    cover: jsgj,
    description: '本书是 JavaScript 经典图书的新版，全面介绍了 JavaScript 的核心概念和实践技巧。',
    recommendation:
      '这是学习 JavaScript 不可或缺的参考书，涵盖了从基础语法到高级特性的全部内容，适合各个层次的开发者阅读。',
    tags: ['JavaScript', '编程', '前端'],
    rating: 5,
    publisher: '人民邮电出版社',
    publicationDate: '2019 年',
  },
  {
    id: 2,
    title: 'Vue.js 设计与实现',
    author: '霍春阳',
    cover: vuesj,
    description: '深入解析 Vue.js 的设计原理和实现细节，帮助读者更好地理解和使用 Vue 框架。',
    recommendation:
      '如果你想深入了解 Vue.js 的内部机制，这本书是不二之选。作者是 Vue.js 核心团队成员，对框架的设计有深刻理解。',
    tags: ['Vue', '框架', '源码分析'],
    rating: 5,
    publisher: '电子工业出版社',
    publicationDate: '2020 年',
  },
  {
    id: 3,
    title: '你不知道的 JavaScript',
    author: 'Kyle Simpson',
    cover: jsndkImg,
    description: '深入探讨 JavaScript 语言核心机制，帮助读者真正理解 JavaScript 的工作原理。',
    recommendation:
      '这本书能够帮助你建立对 JavaScript 更深入的理解，特别是作用域、闭包、this 机制等核心概念。',
    tags: ['JavaScript', '深入理解', '原理'],
    rating: 5,
    publisher: '机械工业出版社',
    publicationDate: '2018 年',
  },
  {
    id: 4,
    title: '计算机组成与设计',
    author: 'David A. Patterson',
    cover: jsjzc,
    description: '深入讲解计算机硬件系统的设计原理和实现方法，是计算机科学领域的经典教材。',
    recommendation:
      '对于想要深入理解计算机体系结构和硬件设计的读者来说，这是一本权威且实用的参考书。内容全面且深入浅出，适合计算机专业的学生和工程师阅读。',
    tags: ['计算机组成', '体系结构', '硬件设计'],
    rating: 5,
    publisher: '机械工业出版社',
    publicationDate: '2020 年',
  },
])

// 模态框相关
const bookModalVisible = ref(false)
const selectedBook = ref<BookItem | null>(null)
const isModalVisible = ref(false)
const isSubmitting = ref(false)

// 新书籍表单数据
const newBook = ref({
  title: '',
  author: '',
  cover: '',
  description: '',
  recommendation: '',
  tags: [] as string[],
  rating: 5,
  publisher: '',
  publicationDate: '',
})

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 显示新建书籍弹窗
const showAddModal = () => {
  if (!canCreate()) {
    message.warning('请先登录')
    router.push('/login')
    return
  }
  // 重置表单
  newBook.value = {
    title: '',
    author: '',
    cover: '',
    description: '',
    recommendation: '',
    tags: [],
    rating: 5,
    publisher: '',
    publicationDate: '',
  }
  isModalVisible.value = true
}

// 处理新建书籍
const handleAddBook = async () => {
  if (!canCreate()) {
    message.warning('请先登录')
    router.push('/login')
    return
  }

  // 验证必填字段
  if (!newBook.value.title.trim()) {
    message.error('请输入书名')
    return
  }

  if (!newBook.value.author.trim()) {
    message.error('请输入作者')
    return
  }

  try {
    isSubmitting.value = true

    // 演示模式，未实际保存
    console.log('新建书籍:', newBook.value)
    books.value.push({
      ...newBook.value,
      id: Date.now(),
    } as BookItem)
    message.success('书籍添加成功')
    isModalVisible.value = false
  } catch (error: any) {
    message.error(error.message || '添加失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // 尽快触发 loaded 事件，减少等待时间
  const event = new Event('loaded')
  window.dispatchEvent(event)
})

// 查看书籍详情
const viewBookDetail = (book: BookItem) => {
  selectedBook.value = book
  bookModalVisible.value = true
}

// 获取标签颜色
const getTagColor = (tag: string) => {
  const colors = ['blue', 'green', 'purple', 'orange', 'cyan', 'magenta']
  const index = tag.charCodeAt(0) % colors.length
  return colors[index]
}

// 处理图片加载失败
const handleImageError = (e: Event) => {
  const imgElement = e.currentTarget as HTMLImageElement
  if (imgElement) {
    // 根据图片尺寸设置对应的占位图
    const isLarge = imgElement.width >= 180 || imgElement.height >= 240
    const placeholderUrl = isLarge
      ? 'https://via.placeholder.com/180x240?text=No+Cover'
      : 'https://via.placeholder.com/150x200?text=No+Cover'

    if (imgElement.src !== placeholderUrl) {
      imgElement.src = placeholderUrl
    }
  }
}

// 获取书籍封面图片 URL（处理防盗链问题）
const getBookCover = (coverUrl: string | undefined) => {
  if (!coverUrl || coverUrl.trim() === '') {
    return 'https://via.placeholder.com/180x240?text=No+Cover'
  }
  // 本地图片直接返回
  return coverUrl
}

// 确认删除书籍
const confirmDelete = (book: BookItem) => {
  if (!canDelete()) {
    message.warning('请先登录')
    router.push('/login')
    return
  }

  Modal.confirm({
    title: '确认删除',
    content: `确定要删除书籍 "${book.title}" 吗？此操作不可恢复。`,
    okText: '确定删除',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      try {
        const index = books.value.findIndex((b: BookItem) => b.id === book.id)
        if (index !== -1) {
          books.value.splice(index, 1)
          message.success('删除成功')
        }
      } catch (error: any) {
        message.error(error.message || '删除失败，请重试')
      }
    },
  })
}
</script>

<style scoped>
.books-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
  padding: 16px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.page-title {
  display: flex;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.back-button {
  background: #f0f2f5;
  border: none;
  border-radius: 8px;
  color: #666;
  transition: all 0.3s;
  padding: 8px 16px;
}

.back-button:hover {
  background: #e1e5e9;
  color: #333;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 12px;
  padding: 40px;
}

.books-container {
  padding: 20px 0;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.book-card {
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;
}

.book-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.book-cover {
  width: 150px;
  height: 200px;
  flex-shrink: 0;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-content {
  padding: 20px;
  flex: 1;
}

.book-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.book-author {
  font-size: 16px;
  color: #666;
  margin: 0 0 16px 0;
}

.book-tags {
  margin-bottom: 16px;
}

.book-tag {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 16px;
  margin-right: 8px;
  margin-bottom: 8px;
}

.book-description {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.book-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-text {
  font-size: 14px;
  color: #888;
}

.book-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e8e8e8;
}

/* 模态框样式 */
.book-detail {
  padding: 20px 0;
}

.detail-header {
  display: flex;
  gap: 24px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-cover {
  width: 180px;
  height: 240px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.detail-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-info {
  flex: 1;
}

.detail-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.detail-author,
.detail-publisher,
.detail-publication {
  font-size: 16px;
  color: #666;
  margin: 0 0 8px 0;
}

.detail-tags {
  margin: 16px 0;
}

.detail-tag {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.detail-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.detail-content h4 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 24px 0 16px 0;
}

.detail-description,
.detail-recommendation {
  font-size: 16px;
  color: #555;
  line-height: 1.7;
  margin: 0 0 16px 0;
}

@media (max-width: 768px) {
  .books-view {
    padding: 16px;
  }

  .page-header {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .books-grid {
    grid-template-columns: 1fr;
  }

  .book-card {
    flex-direction: column;
  }

  .book-cover {
    width: 100%;
    height: 250px;
  }

  .detail-header {
    flex-direction: column;
  }

  .detail-cover {
    width: 150px;
    height: 200px;
    margin: 0 auto;
  }
}
</style>
