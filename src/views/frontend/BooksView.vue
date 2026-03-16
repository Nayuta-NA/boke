<template>
  <div class="books-view">
    <div class="page-header">
      <InteractiveHoverButton text="返回" class="bg-[#f0f2f5] text-[#666]" @click="goBack" />
      <h1 class="page-title">书本推荐</h1>
    </div>

    <div class="books-container">
      <div class="books-grid">
        <div class="book-card" v-for="book in books" :key="book.id" @click="viewBookDetail(book)">
          <div class="book-cover">
            <img :src="book.cover" :alt="book.title" />
          </div>
          <div class="book-content">
            <h2 class="book-title">{{ book.title }}</h2>
            <p class="book-author">{{ book.author }}</p>
            <div class="book-tags">
              <a-tag
                v-for="(tag, i) in book.tags"
                :key="i"
                class="book-tag"
                :color="getTagColor(tag)"
              >
                {{ tag }}
              </a-tag>
            </div>
            <p class="book-description">{{ book.description }}</p>
            <div class="book-rating">
              <a-rate :value="book.rating" disabled />
              <span class="rating-text">{{ book.rating }}星推荐</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 书籍详情模态框 -->
    <a-modal
      v-model:open="bookModalVisible"
      :title="selectedBook?.title"
      width="100%"
      :style="{ maxWidth: '800px' }"
      @cancel="bookModalVisible = false"
      :footer="null"
    >
      <div class="book-detail" v-if="selectedBook">
        <div class="detail-header">
          <div class="detail-cover">
            <img :src="selectedBook.cover" :alt="selectedBook.title" />
          </div>
          <div class="detail-info">
            <h3 class="detail-title">{{ selectedBook.title }}</h3>
            <p class="detail-author">作者：{{ selectedBook.author }}</p>
            <p class="detail-publisher">出版社：{{ selectedBook.publisher }}</p>
            <p class="detail-publication">出版时间：{{ selectedBook.publicationDate }}</p>
            <div class="detail-tags">
              <a-tag
                v-for="(tag, i) in selectedBook.tags"
                :key="i"
                class="detail-tag"
                :color="getTagColor(tag)"
              >
                {{ tag }}
              </a-tag>
            </div>
            <div class="detail-rating">
              <a-rate :value="selectedBook.rating" disabled />
              <span class="rating-text">{{ selectedBook.rating }}星推荐</span>
            </div>
          </div>
        </div>
        <div class="detail-content">
          <h4>书籍简介</h4>
          <p class="detail-description">{{ selectedBook.description }}</p>
          <h4>推荐理由</h4>
          <p class="detail-recommendation">{{ selectedBook.recommendation }}</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import InteractiveHoverButton from '@/components/button.vue'

// 导入图片
import jsndkImg from '@/IMG/tstp/jsndk.png'
import vuesj from '@/IMG/tstp/vuesj.png'
import jsgj from '@/IMG/tstp/jsgj.png'
import jsjzc from '@/IMG/tstp/jsjzc.png'
interface Book {
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

// 书籍推荐
const books: Book[] = [
  {
    id: 1,
    title: 'JavaScript高级程序设计',
    author: 'Nicholas C. Zakas',
    cover: jsgj,
    description: '本书是JavaScript经典图书的新版，全面介绍了JavaScript的核心概念和实践技巧。',
    recommendation:
      '这是学习JavaScript不可或缺的参考书，涵盖了从基础语法到高级特性的全部内容，适合各个层次的开发者阅读。',
    tags: ['JavaScript', '编程', '前端'],
    rating: 5,
    publisher: '人民邮电出版社',
    publicationDate: '2019年',
  },
  {
    id: 2,
    title: 'Vue.js设计与实现',
    author: '霍春阳',
    cover: vuesj,
    description: '深入解析Vue.js的设计原理和实现细节，帮助读者更好地理解和使用Vue框架。',
    recommendation:
      '如果你想深入了解Vue.js的内部机制，这本书是不二之选。作者是Vue.js核心团队成员，对框架的设计有深刻理解。',
    tags: ['Vue', '框架', '源码分析'],
    rating: 5,
    publisher: '电子工业出版社',
    publicationDate: '2020年',
  },
  {
    id: 3,
    title: '你不知道的JavaScript',
    author: 'Kyle Simpson',
    cover: jsndkImg, // 使用导入的图片变量
    description: '深入探讨JavaScript语言核心机制，帮助读者真正理解JavaScript的工作原理。',
    recommendation:
      '这本书能够帮助你建立对JavaScript更深入的理解，特别是作用域、闭包、this机制等核心概念。',
    tags: ['JavaScript', '深入理解', '原理'],
    rating: 5,
    publisher: '机械工业出版社',
    publicationDate: '2018年',
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
    publicationDate: '2020年',
  },
]

// 模态框相关
const bookModalVisible = ref(false)
const selectedBook = ref<Book | null>(null)

// 返回上一页
const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  // 尽快触发loaded事件，减少等待时间
  const event = new Event('loaded')
  window.dispatchEvent(event)
})

// 查看书籍详情
const viewBookDetail = (book: Book) => {
  selectedBook.value = book
  bookModalVisible.value = true
}

// 获取标签颜色
const getTagColor = (tag: string) => {
  const colors = ['blue', 'green', 'purple', 'orange', 'cyan', 'magenta']
  const index = tag.charCodeAt(0) % colors.length
  return colors[index]
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
