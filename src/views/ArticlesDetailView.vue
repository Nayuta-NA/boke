<template>
  <div class="article-detail-container">
    <!-- 关闭按钮 - 固定在页面右上角 -->
    <div class="close-button-fixed" @click="goBack">
      <CloseOutlined />
    </div>

    <!-- 主要内容区域 -->
    <div class="detail-main" v-if="currentArticle">
      <div class="content-wrapper">
        <!-- 文章头部 -->
        <div class="article-header">
          <h1 class="article-title">
            {{ currentArticle.title }}
          </h1>
          <div class="article-meta">
            <div class="meta-left">
              <span class="category-text">{{ currentArticle.category }}</span>
              <span class="meta-divider">/</span>
              <span class="author-text">{{ currentArticle.author }}</span>
              <span class="publish-date">{{ formatDate(currentArticle.date) }}</span>
            </div>
            <div class="meta-right">
              <span class="meta-item"> <LikeOutlined /> {{ currentArticle.likeCount || 0 }} </span>
              <span class="meta-item"> <MessageOutlined /> {{ comments.length }} </span>
            </div>
          </div>
        </div>

        <!-- 摘要或题记 -->
        <div class="article-excerpt-box" v-if="currentArticle.excerpt">
          {{ currentArticle.excerpt }}
        </div>

        <!-- 文章内容 -->
        <div class="article-content">
          <!-- 编辑模式工具栏 -->
          <div v-if="isEditMode" class="edit-toolbar">
            <div class="toolbar-left">
              <span class="toolbar-hint">点击文字可直接编辑，Ctrl+S 保存</span>
            </div>
            <div class="toolbar-actions">
              <a-button @click="cancelEdit" size="small">取消</a-button>
              <a-button type="primary" @click="saveEdit" size="small">保存</a-button>
            </div>
          </div>

          <!-- 查看模式 - 管理员可点击编辑 -->
          <div
            v-if="!isEditMode && authStore.isAuthenticated"
            class="content-text"
            role="button"
            title="点击编辑文章内容"
            v-html="currentArticle.desc"
            @click="handleContentClick"
          ></div>

          <!-- 查看模式 - 普通用户只读 -->
          <div v-else-if="!isEditMode" class="content-text" v-html="currentArticle.desc"></div>

          <!-- 编辑模式 - 可编辑区域 -->
          <div
            v-else
            class="content-text editable"
            contenteditable="true"
            v-html="editContent"
            @input="handleContentInput"
            @keydown="handleKeyDown"
            @keyup="handleKeyup"
            @click="handleContentClick"
            ref="editableRef"
          ></div>

          <!-- 斜杠命令菜单 -->
          <div
            v-if="showSlashMenu"
            class="slash-menu"
            :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
          >
            <div class="slash-menu-item" @click="insertHeadingFromSlash">
              <div class="slash-menu-icon">
                <FontColorsOutlined />
              </div>
              <div class="slash-menu-text">
                <div class="slash-menu-title">标题</div>
                <div class="slash-menu-desc">将当前行转换为标题</div>
              </div>
            </div>

            <div class="slash-menu-item" @click="showLinkCardModal = true">
              <div class="slash-menu-icon">
                <LinkOutlined />
              </div>
              <div class="slash-menu-text">
                <div class="slash-menu-title">链接卡片</div>
                <div class="slash-menu-desc">插入链接卡片组件</div>
              </div>
            </div>

            <div class="slash-menu-item" @click="insertCodeBlockFromSlash">
              <div class="slash-menu-icon">
                <CodeOutlined />
              </div>
              <div class="slash-menu-text">
                <div class="slash-menu-title">代码块</div>
                <div class="slash-menu-desc">插入 TypeScript 代码块</div>
              </div>
            </div>
          </div>

          <!-- 图片展示 -->
          <div v-if="currentArticle.cover" class="article-image">
            <img
              :src="currentArticle.cover"
              :alt="currentArticle.title"
              @error="handleImageError"
            />
          </div>

          <!-- 标签区域 -->
          <div class="article-tags" v-if="currentArticle.tags && currentArticle.tags.length">
            <a-tag v-for="tag in currentArticle.tags" :key="tag" class="tag-item">
              {{ tag }}
            </a-tag>
          </div>
        </div>

        <!-- 链接卡片编辑对话框 -->
        <a-modal
          v-model:open="showLinkCardModal"
          title="插入链接卡片"
          width="520px"
          @ok="confirmLinkCard"
          @cancel="showLinkCardModal = false"
          okText="插入"
          cancelText="取消"
        >
          <a-form layout="vertical">
            <a-form-item label="卡片标题" required>
              <a-input v-model:value="linkCardTitle" placeholder="请输入卡片标题" size="large" />
            </a-form-item>
            <a-form-item label="卡片描述" required>
              <a-textarea
                v-model:value="linkCardDesc"
                placeholder="请输入卡片描述"
                :rows="2"
                size="large"
              />
            </a-form-item>
            <a-form-item label="链接地址" required>
              <a-input
                v-model:value="linkCardUrl"
                placeholder="请输入链接地址 (https://...)"
                size="large"
              />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 右侧悬浮工具栏 -->
    <div class="floating-toolbar" v-if="currentArticle">
      <!-- 点赞按钮 -->
      <button class="toolbar-btn" @click="handleLike">
        <LikeOutlined />
        <span class="btn-text">{{ likeCount }}</span>
      </button>

      <!-- 评论按钮 -->
      <button class="toolbar-btn" @click="handleComment">
        <MessageOutlined />
        <span class="btn-text">{{ comments.length }}</span>
      </button>

      <!-- 分享按钮 -->
      <button class="toolbar-btn" @click="handleShare">
        <ShareAltOutlined />
      </button>

      <!-- 编辑文章（抽屉方式 - 仅登录用户可见） -->
      <button v-if="authStore.isAuthenticated" class="toolbar-btn edit-btn" @click="openEditDrawer">
        <EditOutlined />
      </button>

      <!-- 删除按钮（仅登录用户可见） -->
      <button
        v-if="authStore.isAuthenticated"
        class="toolbar-btn delete-btn"
        @click="showDeleteConfirm"
      >
        <DeleteOutlined />
      </button>
    </div>

    <!-- 编辑文章的抽屉 -->
    <a-drawer
      v-model:open="showEditDrawer"
      title="编辑文章"
      placement="right"
      :width="720"
      :destroy-on-close="true"
      :z-index="1005"
    >
      <a-form :model="editForm" layout="vertical" autocomplete="off">
        <a-form-item label="标题" name="title" :rules="[{ required: true, message: '请输入标题' }]">
          <a-input v-model:value="editForm.title" placeholder="请输入标题" size="large" />
        </a-form-item>

        <!-- 封面图片上传 -->
        <a-form-item label="封面图片" name="cover">
          <div class="upload-container">
            <a-upload
              name="file"
              :multiple="false"
              :before-upload="beforeUpload"
              :show-upload-list="false"
              accept="image/*"
            >
              <a-button type="dashed" size="large" block> <UploadOutlined /> 选择图片 </a-button>
            </a-upload>
            <div class="upload-hint">支持 JPG、PNG 格式，大小不超过 2MB(原图上传)</div>
            <div v-if="previewUrl" class="image-preview">
              <img :src="previewUrl" alt="预览" />
              <a-button type="link" @click="removeImage" size="small" danger>
                <DeleteOutlined /> 删除
              </a-button>
            </div>
            <div v-else-if="editForm.cover && !previewUrl" class="image-preview">
              <img :src="editForm.cover" alt="当前封面" />
              <span class="current-image-label">当前封面</span>
            </div>
          </div>
        </a-form-item>

        <a-form-item
          label="分类"
          name="category"
          :rules="[{ required: true, message: '请选择分类' }]"
        >
          <a-select v-model:value="editForm.category" placeholder="请选择分类" size="large">
            <a-select-option value="前端">前端</a-select-option>
            <a-select-option value="旅游">旅游</a-select-option>
            <a-select-option value="生活">生活</a-select-option>
            <a-select-option value="技术">技术</a-select-option>
            <a-select-option value="设计">设计</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="作者"
          name="author"
          :rules="[{ required: true, message: '请输入作者' }]"
        >
          <a-input v-model:value="editForm.author" placeholder="请输入作者" size="large" />
        </a-form-item>

        <a-form-item label="日期" name="date" :rules="[{ required: true, message: '请选择日期' }]">
          <a-date-picker
            v-model:value="editForm.date"
            value-format="YYYY-MM-DD"
            style="width: 100%"
            placeholder="请选择日期"
            size="large"
          />
        </a-form-item>

        <a-form-item
          label="阅读时间"
          name="readTime"
          :rules="[{ required: true, message: '请输入阅读时间' }]"
        >
          <a-input v-model:value="editForm.readTime" placeholder="例如：5 分钟" size="large" />
        </a-form-item>

        <a-form-item label="摘要" name="excerpt">
          <a-textarea
            v-model:value="editForm.excerpt"
            placeholder="请输入文章摘要（题记）"
            :rows="3"
          />
        </a-form-item>

        <a-form-item label="内容" name="desc" :rules="[{ required: true, message: '请输入内容' }]">
          <div
            style="
              background: #f5f7fa;
              padding: 12px;
              border-radius: 6px;
              border: 1px solid #e8e8e8;
            "
          >
            <p style="margin: 0 0 8px 0; color: #666; font-size: 13px">
              ℹ️ 文章内容请在正文区域直接编辑，支持富文本格式
            </p>
            <p style="margin: 0; color: #999; font-size: 12px">
              当前内容长度：{{ (editForm.desc || '').replace(/<[^>]*>/g, '').length }} 字符
            </p>
          </div>
        </a-form-item>

        <a-form-item label="标签" name="tags">
          <a-select
            v-model:value="editForm.tags"
            mode="tags"
            placeholder="请输入标签"
            style="width: 100%"
          >
          </a-select>
        </a-form-item>

        <!-- 省份 - 城市级联选择器 -->
        <a-form-item label="所在地区" name="location">
          <div class="location-selectors">
            <a-select
              v-model:value="editForm.province"
              placeholder="请选择省份"
              size="large"
              style="flex: 1"
              show-search
              @change="handleEditProvinceChange"
            >
              <a-select-option v-for="province in provinces" :key="province" :value="province">
                {{ province }}
              </a-select-option>
            </a-select>
            <a-select
              v-model:value="editForm.city"
              placeholder="请选择城市"
              size="large"
              style="flex: 1"
              :disabled="!editForm.province"
              show-search
            >
              <a-select-option v-for="city in availableEditCities" :key="city" :value="city">
                {{ city }}
              </a-select-option>
            </a-select>
          </div>
        </a-form-item>
      </a-form>

      <template #footer>
        <a-button @click="handleEditCancel" style="margin-right: 8px">取消</a-button>
        <a-button @click="handleEditSave" type="primary">保存</a-button>
      </template>
    </a-drawer>

    <!-- 评论区 -->
    <div class="comments-section" v-if="currentArticle">
      <div class="comments-container bg-#ffffff border-radius-10">
        <!-- 评论输入框 -->
        <div class="comment-input-area">
          <a-textarea
            v-model:value="commentInput"
            placeholder="说点什么~"
            :rows="3"
            class="comment-textarea"
          />
          <div class="comment-input-footer">
            <div class="comment-user-info">
              <a-avatar :size="32" class="user-avatar">
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              <span class="user-name">{{ authStore.user?.username || '访客' }}</span>
            </div>
            <a-button type="primary" @click="handlePostComment" :disabled="!commentInput.trim()">
              评论
            </a-button>
          </div>
        </div>

        <!-- 评论标题 -->
        <div class="comments-header">
          <h3 class="comments-title">评论 {{ comments.length }}</h3>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-avatar">
              <a-avatar :size="40" class="avatar-icon">
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-date">{{ formatDate(comment.date) }}</span>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
              <div class="comment-actions">
                <div class="comment-action-item" @click="handleLikeComment(comment)">
                  <LikeOutlined />
                  <span>{{ comment.likeCount || 0 }}</span>
                </div>
                <div class="comment-action-item">
                  <MessageOutlined />
                </div>
                <!-- 删除评论按钮 - 仅登录用户可见 -->
                <div
                  v-if="authStore.isAuthenticated"
                  class="comment-action-item delete-comment-btn"
                  @click="handleDeleteComment(comment)"
                >
                  <DeleteOutlined />
                  <span>删除</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 到底提示 -->
        <div class="no-more-text" v-if="comments.length > 0">已经到底了</div>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <div class="back-to-top" @click="scrollToTop">
      <VerticalAlignTopOutlined />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick, computed } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  EditOutlined,
  DeleteOutlined,
  VerticalAlignTopOutlined,
  CloseOutlined,
  UploadOutlined,
  UserOutlined,
  PlusOutlined,
  LinkOutlined,
  CodeOutlined,
  FontColorsOutlined,
  FieldTimeOutlined,
  MinusOutlined,
  FormatPainterOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { useArticlesStore } from '@/stores/articles'
import type { Article } from '@/stores/articles'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const currentArticle = ref<Article | null>(null)
const showEditDrawer = ref(false)
const likeCount = ref(0)
const previewUrl = ref('')
const selectedFile = ref<File | null>(null)
const commentInput = ref('')
const comments = ref([])

// 编辑模式相关状态
const isEditMode = ref(false)
const editContent = ref('')
const editableRef = ref<HTMLElement | null>(null)

// 保存光标位置 - 已删除，不再需要
// let savedSelection: Range | null = null

// const saveSelection = () => {
//   const selection = window.getSelection()
//   if (selection && selection.rangeCount > 0) {
//     savedSelection = selection.getRangeAt(0).cloneRange()
//   }
// }

// 恢复光标位置 - 已删除，不再需要
// const restoreSelection = () => {
//   if (savedSelection) {
//     const selection = window.getSelection()
//     if (selection) {
//       selection.removeAllRanges()
//       selection.addRange(savedSelection)
//     }
//   }
// }

// 斜杠命令菜单相关状态
const showSlashMenu = ref(false)
const menuPosition = reactive({ top: 0, left: 0 })
const slashMenuRange = ref<Range | null>(null)
// 链接卡片相关状态
const showLinkCardModal = ref(false)
const linkCardTitle = ref('')
const linkCardDesc = ref('')
const linkCardUrl = ref('')

// 获取文章 store 和认证 store
const articlesStore = useArticlesStore()
const authStore = useAuthStore()

// 编辑表单类型，日期字段需要支持 Dayjs 类型
interface EditForm extends Omit<Article, 'date'> {
  date: string | dayjs.Dayjs
}

// 初始化编辑表单
const editForm = reactive<EditForm>({
  id: 0,
  title: '',
  cover: '',
  category: '',
  desc: '',
  excerpt: '',
  author: '',
  date: '',
  readTime: '',
  commentCount: 0,
  link: '',
  tags: [],
  province: '',
  city: '',
})

// 省份和城市数据
const provinces = [
  '北京市',
  '天津市',
  '上海市',
  '重庆市',
  '河北省',
  '山西省',
  '辽宁省',
  '吉林省',
  '黑龙江省',
  '江苏省',
  '浙江省',
  '安徽省',
  '福建省',
  '江西省',
  '山东省',
  '河南省',
  '湖北省',
  '湖南省',
  '广东省',
  '海南省',
  '四川省',
  '贵州省',
  '云南省',
  '陕西省',
  '甘肃省',
  '青海省',
  '台湾省',
  '内蒙古自治区',
  '广西壮族自治区',
  '西藏自治区',
  '宁夏回族自治区',
  '新疆维吾尔自治区',
  '香港特别行政区',
  '澳门特别行政区',
]

const citiesMap: Record<string, string[]> = {
  北京市: ['北京市'],
  天津市: ['天津市'],
  上海市: ['上海市'],
  重庆市: ['重庆市'],
  河北省: [
    '石家庄市',
    '唐山市',
    '秦皇岛市',
    '邯郸市',
    '邢台市',
    '保定市',
    '张家口市',
    '承德市',
    '沧州市',
    '廊坊市',
    '衡水市',
  ],
  山西省: [
    '太原市',
    '大同市',
    '阳泉市',
    '长治市',
    '晋城市',
    '朔州市',
    '晋中市',
    '运城市',
    '忻州市',
    '临汾市',
    '吕梁市',
  ],
  辽宁省: [
    '沈阳市',
    '大连市',
    '鞍山市',
    '抚顺市',
    '本溪市',
    '丹东市',
    '锦州市',
    '营口市',
    '阜新市',
    '辽阳市',
    '盘锦市',
    '铁岭市',
    '朝阳市',
    '葫芦岛市',
  ],
  吉林省: [
    '长春市',
    '吉林市',
    '四平市',
    '辽源市',
    '通化市',
    '白山市',
    '松原市',
    '白城市',
    '延边朝鲜族自治州',
  ],
  黑龙江省: [
    '哈尔滨市',
    '齐齐哈尔市',
    '鸡西市',
    '鹤岗市',
    '双鸭山市',
    '大庆市',
    '伊春市',
    '佳木斯市',
    '七台河市',
    '牡丹江市',
    '黑河市',
    '绥化市',
    '大兴安岭地区',
  ],
  江苏省: [
    '南京市',
    '无锡市',
    '徐州市',
    '常州市',
    '苏州市',
    '南通市',
    '连云港市',
    '淮安市',
    '盐城市',
    '扬州市',
    '镇江市',
    '泰州市',
    '宿迁市',
  ],
  浙江省: [
    '杭州市',
    '宁波市',
    '温州市',
    '嘉兴市',
    '湖州市',
    '绍兴市',
    '金华市',
    '衢州市',
    '舟山市',
    '台州市',
    '丽水市',
  ],
  安徽省: [
    '合肥市',
    '芜湖市',
    '蚌埠市',
    '淮南市',
    '马鞍山市',
    '淮北市',
    '铜陵市',
    '安庆市',
    '黄山市',
    '滁州市',
    '阜阳市',
    '宿州市',
    '六安市',
    '亳州市',
    '池州市',
    '宣城市',
  ],
  福建省: [
    '福州市',
    '厦门市',
    '莆田市',
    '三明市',
    '泉州市',
    '漳州市',
    '南平市',
    '龙岩市',
    '宁德市',
  ],
  江西省: [
    '南昌市',
    '景德镇市',
    '萍乡市',
    '九江市',
    '新余市',
    '鹰潭市',
    '赣州市',
    '吉安市',
    '宜春市',
    '抚州市',
    '上饶市',
  ],
  山东省: [
    '济南市',
    '青岛市',
    '淄博市',
    '枣庄市',
    '东营市',
    '烟台市',
    '潍坊市',
    '济宁市',
    '泰安市',
    '威海市',
    '日照市',
    '临沂市',
    '德州市',
    '聊城市',
    '滨州市',
    '菏泽市',
  ],
  河南省: [
    '郑州市',
    '开封市',
    '洛阳市',
    '平顶山市',
    '安阳市',
    '鹤壁市',
    '新乡市',
    '焦作市',
    '濮阳市',
    '许昌市',
    '漯河市',
    '三门峡市',
    '南阳市',
    '商丘市',
    '信阳市',
    '周口市',
    '驻马店市',
    '济源市',
  ],
  湖北省: [
    '武汉市',
    '黄石市',
    '十堰市',
    '宜昌市',
    '襄阳市',
    '鄂州市',
    '荆门市',
    '孝感市',
    '荆州市',
    '黄冈市',
    '咸宁市',
    '随州市',
    '恩施土家族苗族自治州',
    '仙桃市',
    '潜江市',
    '天门市',
    '神农架林区',
  ],
  湖南省: [
    '长沙市',
    '株洲市',
    '湘潭市',
    '衡阳市',
    '邵阳市',
    '岳阳市',
    '常德市',
    '张家界市',
    '益阳市',
    '郴州市',
    '永州市',
    '怀化市',
    '娄底市',
    '湘西土家族苗族自治州',
  ],
  广东省: [
    '广州市',
    '韶关市',
    '深圳市',
    '珠海市',
    '汕头市',
    '佛山市',
    '江门市',
    '湛江市',
    '茂名市',
    '肇庆市',
    '惠州市',
    '梅州市',
    '汕尾市',
    '河源市',
    '阳江市',
    '清远市',
    '东莞市',
    '中山市',
    '潮州市',
    '揭阳市',
    '云浮市',
  ],
  海南省: [
    '海口市',
    '三亚市',
    '三沙市',
    '儋州市',
    '五指山市',
    '琼海市',
    '文昌市',
    '万宁市',
    '东方市',
    '定安县',
    '屯昌县',
    '澄迈县',
    '临高县',
    '白沙黎族自治县',
    '昌江黎族自治县',
    '乐东黎族自治县',
    '陵水黎族自治县',
    '保亭黎族苗族自治县',
    '琼中黎族苗族自治县',
  ],
  四川省: [
    '成都市',
    '自贡市',
    '攀枝花市',
    '泸州市',
    '德阳市',
    '绵阳市',
    '广元市',
    '遂宁市',
    '内江市',
    '乐山市',
    '南充市',
    '眉山市',
    '宜宾市',
    '广安市',
    '达州市',
    '雅安市',
    '巴中市',
    '资阳市',
    '阿坝藏族羌族自治州',
    '甘孜藏族自治州',
    '凉山彝族自治州',
  ],
  贵州省: [
    '贵阳市',
    '六盘水市',
    '遵义市',
    '安顺市',
    '毕节市',
    '铜仁市',
    '黔西南布依族苗族自治州',
    '黔东南苗族侗族自治州',
    '黔南布依族苗族自治州',
  ],
  云南省: [
    '昆明市',
    '曲靖市',
    '玉溪市',
    '保山市',
    '昭通市',
    '丽江市',
    '普洱市',
    '临沧市',
    '楚雄彝族自治州',
    '红河哈尼族彝族自治州',
    '文山壮族苗族自治州',
    '西双版纳傣族自治州',
    '大理白族自治州',
    '德宏傣族景颇族自治州',
    '怒江傈僳族自治州',
    '迪庆藏族自治州',
  ],
  陕西省: [
    '西安市',
    '铜川市',
    '宝鸡市',
    '咸阳市',
    '渭南市',
    '延安市',
    '汉中市',
    '榆林市',
    '安康市',
    '商洛市',
  ],
  甘肃省: [
    '兰州市',
    '嘉峪关市',
    '金昌市',
    '白银市',
    '天水市',
    '武威市',
    '张掖市',
    '平凉市',
    '酒泉市',
    '庆阳市',
    '定西市',
    '陇南市',
    '临夏回族自治州',
    '甘南藏族自治州',
  ],
  青海省: [
    '西宁市',
    '海东市',
    '海北藏族自治州',
    '黄南藏族自治州',
    '海南藏族自治州',
    '果洛藏族自治州',
    '玉树藏族自治州',
    '海西蒙古族藏族自治州',
  ],
  台湾省: ['台北市', '新北市', '台中市', '台南市', '高雄市', '基隆市', '新竹市', '嘉义市'],
  内蒙古自治区: [
    '呼和浩特市',
    '包头市',
    '乌海市',
    '赤峰市',
    '通辽市',
    '鄂尔多斯市',
    '呼伦贝尔市',
    '巴彦淖尔市',
    '乌兰察布市',
    '兴安盟',
    '锡林郭勒盟',
    '阿拉善盟',
  ],
  广西壮族自治区: [
    '南宁市',
    '柳州市',
    '桂林市',
    '梧州市',
    '北海市',
    '防城港市',
    '钦州市',
    '贵港市',
    '玉林市',
    '百色市',
    '贺州市',
    '河池市',
    '来宾市',
    '崇左市',
  ],
  西藏自治区: ['拉萨市', '日喀则市', '昌都市', '林芝市', '山南市', '那曲市', '阿里地区'],
  宁夏回族自治区: ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'],
  新疆维吾尔自治区: [
    '乌鲁木齐市',
    '克拉玛依市',
    '吐鲁番市',
    '哈密市',
    '昌吉回族自治州',
    '博尔塔拉蒙古自治州',
    '巴音郭楞蒙古自治州',
    '阿克苏地区',
    '喀什地区',
    '和田地区',
    '伊犁哈萨克自治州',
    '塔城地区',
    '阿勒泰地区',
  ],
  香港特别行政区: ['香港岛', '九龙', '新界'],
  澳门特别行政区: ['澳门半岛', '氹仔', '路环'],
}

// 计算可用城市列表（用于编辑表单）
const availableEditCities = computed(() => {
  if (!editForm.province) {
    return []
  }
  return citiesMap[editForm.province] || []
})

// 处理编辑表单的省份选择变化
const handleEditProvinceChange = () => {
  // 选择省份后清空城市选择
  editForm.city = ''
}

// 处理图片加载错误 - 隐藏损坏的图片
const handleImageError = (event: any) => {
  event.target.style.display = 'none'
}

// 加载文章详情
const loadArticle = async () => {
  const articleId = Number(route.params.id)
  if (!articleId) {
    message.error('文章 ID 无效')
    return
  }

  try {
    await articlesStore.fetchArticleById(articleId)
    currentArticle.value = articlesStore.currentArticle
    if (currentArticle.value) {
      // 初始化评论列表
      fetchComments(currentArticle.value.id)
      // 使用文章的 likeCount，如果没有则使用 commentCount 作为默认值
      likeCount.value = currentArticle.value.likeCount || currentArticle.value.commentCount || 0

      // 如果是管理员，显示编辑提示
      if (authStore.isAuthenticated) {
        message.info({
          content: '点击文章内容区域即可直接编辑，按 Ctrl+S 保存',
          duration: 1,
        })
      }

      const event = new Event('loaded')
      window.dispatchEvent(event)
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    message.error('加载文章失败，请稍后重试')
    router.push('/articles')
  }
}

// 获取评论列表
const fetchComments = async (articleId: number) => {
  try {
    const response = await fetch(`http://localhost:5000/api/comments?articleId=${articleId}`)
    if (!response.ok) {
      throw new Error('获取评论失败')
    }
    const data = await response.json()
    comments.value = data
  } catch (error) {
    console.error('获取评论失败:', error)
    comments.value = []
  }
}

// 处理内容区域点击（启动编辑）
const handleContentClick = () => {
  if (authStore.isAuthenticated && !isEditMode.value) {
    startEdit()
  }
}

// 快速启动编辑（无需点击按钮）
const enableEditMode = () => {
  if (!authStore.isAuthenticated || !currentArticle.value) return
  startEdit()
}

// 开始编辑
const startEdit = () => {
  if (!currentArticle.value) return
  isEditMode.value = true
  editContent.value = currentArticle.value.desc
  nextTick(() => {
    if (editableRef.value) {
      editableRef.value.focus()
      // 将光标移动到内容末尾
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(editableRef.value)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  })
}

// 处理内容输入
const handleContentInput = (event: Event) => {
  // 不在这里更新 editContent.value，避免 Vue 重渲染导致光标跳转
  // 只在保存时从 editableRef.value.innerHTML 读取内容

  // 检测斜杠命令
  checkSlashMenu()
}

// 检测斜杠命令
const checkSlashMenu = () => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) {
    console.log('[Slash] No selection')
    return
  }

  const range = selection.getRangeAt(0)
  let textNode = range.startContainer

  // 如果是元素节点，尝试查找文本节点
  if (textNode.nodeType === Node.ELEMENT_NODE) {
    const childNodes = textNode.childNodes
    for (let i = childNodes.length - 1; i >= 0; i--) {
      if (childNodes[i].nodeType === Node.TEXT_NODE) {
        textNode = childNodes[i]
        break
      }
    }
  }

  // 只在文本节点中检测
  if (textNode.nodeType !== Node.TEXT_NODE) {
    console.log('[Slash] Not a text node')
    return
  }

  const text = textNode.textContent || ''
  const textBeforeCursor = text.substring(0, range.startOffset)

  console.log('[Slash] Full text:', text)
  console.log('[Slash] Text before cursor:', textBeforeCursor)

  // 获取当前行（最后一个换行符到光标位置）
  const lastNewlineIndex = textBeforeCursor.lastIndexOf('\n')
  const currentLine = textBeforeCursor.substring(lastNewlineIndex + 1)

  console.log('[Slash] Current line:', currentLine)

  // 检测当前行是否只有 /（允许前面有空格）
  const trimmedLine = currentLine.trim()
  console.log('[Slash] Trimmed line:', trimmedLine)

  if (trimmedLine === '/') {
    console.log('[Slash] SHOW MENU!')
    showSlashMenu.value = true
    slashMenuRange.value = range.cloneRange()

    nextTick(() => {
      const rect = range.getBoundingClientRect()
      // 使用视口坐标，不需要加 scrollY/scrollX
      menuPosition.top = rect.bottom + 8
      menuPosition.left = rect.left
      console.log('[Slash] Menu position:', menuPosition)
    })
  } else {
    console.log('[Slash] HIDE MENU')
    showSlashMenu.value = false
    slashMenuRange.value = null
  }
}

// 处理键盘快捷键
const handleKeyDown = (event: KeyboardEvent) => {
  // Ctrl/Cmd + S 保存
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault()
    saveEdit()
  }
  // Tab 键插入代码块
  if (event.key === 'Tab' && !event.shiftKey) {
    // 可以在这里自定义 Tab 行为
  }
}

// 处理键盘事件
const handleKeyup = (event: KeyboardEvent) => {
  // ESC 键关闭菜单
  if (event.key === 'Escape' && showSlashMenu.value) {
    showSlashMenu.value = false
    return
  }
}

// 取消编辑
const cancelEdit = () => {
  isEditMode.value = false
  editContent.value = ''
}

// 保存编辑
const saveEdit = async () => {
  if (!currentArticle.value || !editableRef.value) return

  try {
    // 直接从 DOM 读取内容，而不是从 editContent.value
    const contentFromDOM = editableRef.value.innerHTML

    const articleData = {
      ...currentArticle.value,
      desc: contentFromDOM,
    }

    console.log('保存内容:', contentFromDOM)

    await articlesStore.updateArticle(currentArticle.value.id, articleData)
    currentArticle.value = { ...articleData }
    isEditMode.value = false
    editContent.value = ''
    message.success('内容已保存')
  } catch (error) {
    console.error('保存文章失败:', error)
    message.error('保存失败，请重试')
  }
}

// 在光标位置插入 HTML
const insertHtmlAtCursor = (html: string) => {
  const selection = window.getSelection()
  if (!selection || !editableRef.value) return

  const range = selection.getRangeAt(0)
  const div = document.createElement('div')
  div.innerHTML = html
  const nodes = Array.from(div.childNodes)

  nodes.forEach((node, index) => {
    const clonedNode = node.cloneNode(true)
    if (index === 0) {
      range.insertNode(clonedNode)
    } else {
      range.collapse(false)
      range.insertNode(clonedNode)
    }
  })

  // 移动光标到插入内容的末尾
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)

  // 更新编辑内容
  editContent.value = editableRef.value.innerHTML
}

// 通用函数：准备插入环境（恢复光标、删除斜杠）
const prepareInsert = (): { textNode: Node | null; range: Range | null } | null => {
  if (!slashMenuRange.value) return null

  const selection = window.getSelection()
  if (!selection) return null

  selection.removeAllRanges()
  selection.addRange(slashMenuRange.value)

  let textNode = slashMenuRange.value.startContainer
  if (textNode.nodeType === Node.ELEMENT_NODE) {
    const childNodes = textNode.childNodes
    for (let i = childNodes.length - 1; i >= 0; i--) {
      if (childNodes[i].nodeType === Node.TEXT_NODE) {
        textNode = childNodes[i]
        break
      }
    }
  }

  if (textNode.nodeType !== Node.TEXT_NODE) return null

  const text = textNode.textContent || ''
  const textBeforeCursor = text.substring(0, slashMenuRange.value.startOffset)
  const currentLine = textBeforeCursor.split('\n').pop()?.trim()

  if (currentLine === '/') {
    const newText =
      text.substring(0, slashMenuRange.value.startOffset - 1) +
      text.substring(slashMenuRange.value.startOffset)
    textNode.textContent = newText
    return { textNode, range: slashMenuRange.value }
  }

  return null
}

// 关闭菜单并清理状态
const closeSlashMenu = () => {
  showSlashMenu.value = false
  slashMenuRange.value = null
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 上传前验证
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }

  // 限制为 2MB，避免后端 413 错误
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB，请使用压缩工具处理后再上传!')
    return false
  }

  selectedFile.value = file

  // 创建预览 URL 并直接更新表单
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64Data = e.target?.result as string
    previewUrl.value = base64Data
    editForm.cover = base64Data
    console.log(
      '图片已选择，Base64 长度:',
      base64Data.length,
      '文件大小:',
      Math.round(file.size / 1024),
      'KB',
    )
  }
  reader.onerror = () => {
    message.error('图片读取失败')
  }
  reader.readAsDataURL(file)

  return false // 阻止自动上传
}

// 发表评论
const handlePostComment = async () => {
  if (!commentInput.value.trim()) {
    message.warning('请输入评论内容')
    return
  }

  if (!currentArticle.value) {
    message.error('文章不存在')
    return
  }

  try {
    const response = await fetch('http://localhost:5000/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articleId: currentArticle.value.id,
        author: authStore.user?.username || '访客',
        content: commentInput.value,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '发表评论失败')
    }

    const newComment = await response.json()

    // 将新评论添加到列表（倒序排列，所以用 push）
    comments.value.push(newComment)
    commentInput.value = ''

    // 更新文章的评论数
    if (currentArticle.value) {
      currentArticle.value.commentCount = (currentArticle.value.commentCount || 0) + 1
    }

    message.success('评论成功')
  } catch (error) {
    console.error('发表评论失败:', error)
    message.error('评论失败，请重试')
  }
}

// 点赞评论
const handleLikeComment = (comment: any) => {
  comment.likeCount = (comment.likeCount || 0) + 1
  message.success('点赞成功')
}

// 删除评论
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const handleDeleteComment = async (comment: any) => {
  if (!currentArticle.value) {
    message.error('文章不存在')
    return
  }

  const articleId = currentArticle.value.id

  Modal.confirm({
    title: '确认删除',
    content: '您确定要删除这条评论吗？此操作不可撤销。',
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/comments/${comment.id}?articleId=${articleId}`,
          {
            method: 'DELETE',
          },
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '删除评论失败')
        }

        // 从列表中移除评论
        comments.value = comments.value.filter((c) => c.id !== comment.id)

        // 更新文章的评论数
        if (currentArticle.value) {
          currentArticle.value.commentCount = Math.max(
            0,
            (currentArticle.value.commentCount || 0) - 1,
          )
        }

        message.success('评论已删除')
      } catch (error) {
        console.error('删除评论失败:', error)
        message.error('删除失败，请重试')
      }
    },
  })
}

// 删除图片
const removeImage = () => {
  previewUrl.value = ''
  selectedFile.value = null
  editForm.cover = ''
}

// 点赞处理
const handleLike = () => {
  likeCount.value++
  message.success('点赞成功')
}

// 评论处理
const handleComment = () => {
  // 滚动到评论区
  const commentsSection = document.querySelector('.comments-section')
  if (commentsSection) {
    commentsSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// 分享处理
const handleShare = () => {
  message.success('分享链接已复制')
}

// 保存编辑
const handleEditSave = async () => {
  if (!currentArticle.value) return

  try {
    // 准备更新的数据
    const articleData = {
      ...editForm,
      date:
        typeof editForm.date === 'string'
          ? editForm.date
          : (editForm.date as dayjs.Dayjs).format('YYYY-MM-DD'),
    }

    console.log('=== 开始更新文章 ===')
    console.log('文章 ID:', currentArticle.value.id)
    console.log('更新数据:', JSON.stringify(articleData, null, 2))
    console.log(
      '封面图片数据:',
      articleData.cover ? `有图片 (${articleData.cover.length} 字符)` : '无图片',
    )

    const updatedArticle = await articlesStore.updateArticle(currentArticle.value.id, articleData)

    console.log('更新成功:', updatedArticle)

    currentArticle.value = { ...updatedArticle }
    message.success('文章更新成功')
    showEditDrawer.value = false
    previewUrl.value = ''
    selectedFile.value = null
  } catch (error) {
    console.error('更新文章失败:', error)
    message.error('更新失败，请重试')
  }
}

// 取消编辑
const handleEditCancel = () => {
  showEditDrawer.value = false
  previewUrl.value = ''
  selectedFile.value = null
}

// 打开编辑抽屉
const openEditDrawer = () => {
  if (currentArticle.value) {
    Object.assign(editForm, {
      ...currentArticle.value,
      date: dayjs(currentArticle.value.date),
    })
    if (currentArticle.value.cover) {
      previewUrl.value = currentArticle.value.cover
    }
    console.log('打开编辑抽屉 - 省份:', editForm.province, '城市:', editForm.city)
    console.log('所有省份数据:', provinces)
    console.log('editForm 完整数据:', editForm)
    showEditDrawer.value = true
    console.log('打开编辑抽屉，当前封面:', editForm.cover ? '有' : '无')
  }
}

// 显示删除确认对话框
const showDeleteConfirm = () => {
  Modal.confirm({
    title: '确认删除',
    content: '您确定要删除这篇文章吗？此操作不可撤销。',
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      if (currentArticle.value) {
        try {
          await articlesStore.deleteArticle(currentArticle.value.id)
          message.success('删除成功')
          router.push('/articles')
        } catch (error) {
          console.error('删除文章失败:', error)
          message.error('删除失败，请重试')
        }
      }
    },
  })
}

// 返回顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// 返回列表页
const goBack = () => {
  router.push('/articles')
}

// 组件挂载时加载文章
onMounted(() => {
  loadArticle()
})

// 斜杠菜单 - 插入标题
const insertHeadingFromSlash = () => {
  const result = prepareInsert()
  if (!result) return

  // 插入 H2 标题，并在后面添加一个带占位文本的段落
  // 这样用户回车后会自然进入普通段落模式
  const headingHtml = '<h2>标题</h2><p>在此输入正文内容...</p>'
  insertHtmlAtCursor(headingHtml)

  closeSlashMenu()
}

// 斜杠菜单 - 插入代码块
const insertCodeBlockFromSlash = () => {
  const result = prepareInsert()
  if (!result) return

  // TypeScript 代码块模板
  const defaultCode = `// TypeScript 代码示例
interface User {
  id: number
  name: string
  email: string
}

const createUser = (user: User): User => {
  return user
}`

  const codeHtml = `<pre style="background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; margin: 20px 0; border: 1px solid #e1e4e8;"><code class="language-typescript" style="font-family: 'Courier New', 'Consolas', monospace; font-size: 13px; color: #24292e; line-height: 1.5;">${defaultCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre><p><br/></p>`

  insertHtmlAtCursor(codeHtml)
  closeSlashMenu()
}

// 确认插入链接卡片
const confirmLinkCard = () => {
  if (!linkCardTitle.value.trim()) {
    message.warning('请输入卡片标题')
    return
  }
  if (!linkCardDesc.value.trim()) {
    message.warning('请输入卡片描述')
    return
  }
  if (!linkCardUrl.value.trim()) {
    message.warning('请输入链接地址')
    return
  }

  // 恢复光标位置
  if (slashMenuRange.value) {
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(slashMenuRange.value)

      // 获取当前文本节点
      let textNode = slashMenuRange.value.startContainer
      if (textNode.nodeType === Node.ELEMENT_NODE) {
        const childNodes = textNode.childNodes
        for (let i = childNodes.length - 1; i >= 0; i--) {
          if (childNodes[i].nodeType === Node.TEXT_NODE) {
            textNode = childNodes[i]
            break
          }
        }
      }

      if (textNode.nodeType === Node.TEXT_NODE) {
        const text = textNode.textContent || ''
        const textBeforeCursor = text.substring(0, slashMenuRange.value.startOffset)
        const lines = textBeforeCursor.split('\n')
        const currentLine = lines[lines.length - 1].trim()

        if (currentLine === '/') {
          // 删除斜杠
          const newText =
            text.substring(0, slashMenuRange.value.startOffset - 1) +
            text.substring(slashMenuRange.value.startOffset)
          textNode.textContent = newText
        }
      }
    }
  }

  // 创建链接卡片 HTML
  const linkCardHtml = `
    <div style="border: 1px solid #e8e8e8; border-radius: 8px; padding: 16px; margin: 20px 0; background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); transition: all 0.3s ease; cursor: pointer;" onmouseover="this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.2)'; this.style.borderColor='#667eea'" onmouseout="this.style.boxShadow='none'; this.style.borderColor='#e8e8e8'">
      <a href="${linkCardUrl.value}" target="_blank" style="text-decoration: none; color: inherit;">
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #333;">${linkCardTitle.value}</h3>
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #666; line-height: 1.6;">${linkCardDesc.value}</p>
        <div style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: #1890ff;">
          <span>访问链接</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </div>
      </a>
    </div>
    <p><br/></p>
  `

  insertHtmlAtCursor(linkCardHtml)
  showLinkCardModal.value = false
  showSlashMenu.value = false
  slashMenuRange.value = null
  linkCardTitle.value = ''
  linkCardDesc.value = ''
  linkCardUrl.value = ''

  message.success('链接卡片已插入')
}
</script>

<style scoped>
.article-detail-container {
  min-height: 100vh;
  margin-top: -7vh;
  z-index: 1000;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  background: #ffffff;
  padding: 0;
  position: relative;
}

.detail-main {
  display: flex;
  justify-content: center;
  padding-top: 60px;
}

.content-wrapper {
  width: 100%;
  max-width: 800px;
  padding: 0 24px;
  position: relative;
}

/* 关闭按钮样式 - 固定在页面右上角 */
.close-button-fixed {
  position: fixed;
  top: 90px;
  right: 40px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #666;
  transition: all 0.3s ease;
  z-index: 1000;
}

.close-button-fixed:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #ff4d4f;
  transform: rotate(90deg);
}

/* 文章头部样式 */
.article-header {
  margin-bottom: 40px;
  padding-top: 20px;
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-text {
  color: #1890ff;
  font-weight: 500;
}

.meta-divider {
  color: #d9d9d9;
}

.author-text {
  color: #666;
}

.publish-date {
  color: #999;
}

.meta-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
}

.meta-item:hover {
  color: #1890ff;
}

/* 摘要框样式 */
.article-excerpt-box {
  background: #f5f7fa;
  padding: 24px 32px;
  border-radius: 8px;
  margin-bottom: 40px;
  font-size: 15px;
  color: #555;
  line-height: 1.8;
  font-style: italic;
}

/* 文章内容样式 */
.article-content {
  margin-bottom: 60px;
  position: relative;
}

/* 编辑模式工具栏 */
.edit-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.toolbar-hint {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  font-weight: 500;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.toolbar-actions .ant-btn {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
}

.toolbar-actions .ant-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 查看模式内容区域 */
.content-text {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 32px;
}

.content-text :deep(p) {
  margin-bottom: 24px;
  text-align: justify;
}

.content-text :deep(h2) {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 32px 0 20px 0;
  line-height: 1.4;
}

.content-text :deep(h3) {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 24px 0 16px 0;
  line-height: 1.4;
}

.content-text :deep(h4) {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 20px 0 12px 0;
}

.content-text :deep(a) {
  color: #1890ff;
  text-decoration: none;
  border-bottom: 1px solid #1890ff;
  transition: all 0.3s ease;
}

.content-text :deep(a:hover) {
  color: #096dd9;
  border-bottom-color: #096dd9;
}

.content-text :deep(hr) {
  border: none;
  border-top: 2px solid #e8e8e8;
  margin: 32px 0;
}

.content-text :deep(blockquote) {
  border-left: 4px solid #1890ff;
  padding: 16px 20px;
  margin: 24px 0;
  background: #f5f7fa;
  color: #666;
  font-style: italic;
  border-radius: 0 8px 8px 0;
}

.content-text :deep(pre) {
  background: #f6f8fa;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 24px 0;
  border: 1px solid #e1e4e8;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
}

.content-text :deep(code) {
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 13px;
  color: #24292e;
  line-height: 1.5;
}

.content-text :deep(ul),
.content-text :deep(ol) {
  margin: 16px 0;
  padding-left: 32px;
}

.content-text :deep(li) {
  margin-bottom: 8px;
}

/* 管理员可编辑提示样式 */
.content-text[role='button'] {
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.content-text[role='button']:hover {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  border-radius: 8px;
}

.content-text[role='button']::after {
  content: '✏️ 点击编辑';
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(102, 126, 234, 0.9);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.content-text[role='button']:hover::after {
  opacity: 1;
  transform: translateY(0);
}

/* 可编辑内容区域 */
.content-text.editable {
  min-height: 500px;
  padding: 24px;
  border: 2px dashed #667eea;
  border-radius: 12px;
  background: linear-gradient(to bottom, #f8f9ff, #ffffff);
  outline: none;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
}

.content-text.editable:focus {
  border-color: #764ba2;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

.content-text.editable :deep(h2) {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 32px 0 20px 0;
  line-height: 1.4;
}

.content-text.editable :deep(h3) {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 24px 0 16px 0;
  line-height: 1.4;
}

.content-text.editable :deep(h4) {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 20px 0 12px 0;
}

.content-text.editable :deep(p) {
  margin-bottom: 16px;
}

.content-text.editable :deep(a) {
  color: #1890ff;
  text-decoration: none;
  border-bottom: 1px solid #1890ff;
  transition: all 0.3s ease;
}

.content-text.editable :deep(a:hover) {
  color: #096dd9;
  border-bottom-color: #096dd9;
}

.content-text.editable :deep(hr) {
  border: none;
  border-top: 2px solid #e8e8e8;
  margin: 32px 0;
}

.content-text.editable :deep(blockquote) {
  border-left: 4px solid #1890ff;
  padding: 16px 20px;
  margin: 24px 0;
  background: #f5f7fa;
  color: #666;
  font-style: italic;
  border-radius: 0 8px 8px 0;
}

.content-text.editable :deep(pre) {
  background: #f6f8fa;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 24px 0;
  border: 1px solid #e1e4e8;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
}

.content-text.editable :deep(code) {
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 13px;
  color: #24292e;
  line-height: 1.5;
}

.content-text.editable :deep(ul),
.content-text.editable :deep(ol) {
  margin: 16px 0;
  padding-left: 32px;
}

.content-text.editable :deep(li) {
  margin-bottom: 8px;
}

/* 斜杠命令菜单样式 */
.slash-menu {
  position: fixed;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  min-width: 280px;
  z-index: 1000;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slash-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.slash-menu-item:hover {
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-color: #667eea;
}

.slash-menu-item:last-child {
  margin-bottom: 0;
}

.slash-menu-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecef 100%);
  border-radius: 8px;
  font-size: 20px;
  transition: all 0.2s ease;
}

.slash-menu-item:hover .slash-menu-icon {
  transform: scale(1.05);
}

.slash-menu-item:hover .slash-menu-icon:first-child {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.slash-menu-item:hover:nth-child(2) .slash-menu-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #ffffff;
}

.slash-menu-item:hover:nth-child(3) .slash-menu-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #ffffff;
}

.slash-menu-text {
  flex: 1;
}

.slash-menu-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.slash-menu-desc {
  font-size: 13px;
  color: #999;
  line-height: 1.4;
}

/* 插入菜单样式 */
.insert-menu {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.insert-menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
}

.insert-menu-item:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
}

.menu-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecef 100%);
  border-radius: 12px;
  font-size: 26px;
  transition: all 0.3s ease;
}

.menu-icon-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.menu-icon-subtitle {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #ffffff;
}

.menu-icon-link {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #ffffff;
}

.menu-icon-code {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #ffffff;
}

.menu-icon-divider {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: #ffffff;
}

.menu-icon-quote {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #ffffff;
}

.insert-menu-item:hover .menu-icon {
  transform: scale(1.1) rotate(-5deg);
}

.menu-text {
  flex: 1;
}

.menu-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.menu-desc {
  font-size: 13px;
  color: #999;
  line-height: 1.4;
}

/* 编辑内容按钮样式 */
.toolbar-btn.edit-content-btn {
  color: #52c41a;
  border-color: #52c41a;
}

.toolbar-btn.edit-content-btn:hover {
  color: #73d13d;
  border-color: #73d13d;
  background: #f6ffed;
}

/* 右侧悬浮工具栏 */
.floating-toolbar {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
}

.toolbar-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 18px;
  color: #666;
}

.toolbar-btn.close-btn {
  font-size: 20px;
}

.toolbar-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.toolbar-btn.close-btn:hover {
  background: #f5f5f5;
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.toolbar-btn.edit-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.toolbar-btn.delete-btn:hover {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.btn-text {
  font-size: 12px;
  margin-top: 2px;
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #000000;
  color: #ffffff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;
  z-index: 100;
}

.back-to-top:hover {
  background: #333333;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 图片上传预览样式 */
.upload-container {
  width: 100%;
}

.image-preview {
  margin-top: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.image-preview img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #e8e8e8;
}

.image-preview button {
  flex-shrink: 0;
}

.image-preview .current-image-label {
  font-size: 13px;
  color: #666;
}

/* 如果没有图片，显示提示 */
.upload-hint {
  margin-top: 8px;
  font-size: 13px;
  color: #999;
}

/* 省份 - 城市选择器布局 */
.location-selectors {
  display: flex;
  gap: 12px;
}

.location-selectors .ant-select {
  flex: 1;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(64, 224, 208, 0.3);
  border-top: 5px solid #40e0d0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 评论区样式 */
.comments-section {
  background: #f5f7fa;
  padding: 60px 0;
  margin-top: 80px;
}

.comments-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

.comment-input-area {
  padding: 24px;
  margin-bottom: 32px;
}

.comment-textarea {
  font-size: 14px;
  line-height: 1.6;
}

.comment-input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.comment-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  background: #1890ff;
}

.user-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.comments-header {
  margin-bottom: 24px;
}

.comments-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.comments-list {
  display: flex;
  flex-direction: column;
  max-height: 500px;
  overflow-y: auto;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.comment-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.comment-avatar {
  flex-shrink: 0;
}

.avatar-icon {
  background: #1890ff;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.comment-author {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.comment-date {
  font-size: 13px;
  color: #999;
}

.comment-text {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 16px;
  text-align: justify;
}

.comment-actions {
  display: flex;
  gap: 20px;
}

.comment-action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s ease;
}

.comment-action-item:hover {
  color: #1890ff;
}

.comment-action-item.delete-comment-btn:hover {
  color: #ff4d4f;
}

.no-more-text {
  text-align: center;
  padding: 24px;
  font-size: 13px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-main {
    padding-top: 20px;
  }

  .content-wrapper {
    padding: 0 16px;
  }

  .article-title {
    font-size: 24px;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .meta-right {
    gap: 12px;
  }

  .article-excerpt-box {
    padding: 16px 20px;
  }

  .content-text {
    font-size: 15px;
  }

  .floating-toolbar {
    right: 16px;
    top: auto;
    bottom: 100px;
    transform: none;
    flex-direction: row;
    justify-content: center;
  }

  .toolbar-btn {
    width: 44px;
    height: 44px;
  }

  .back-to-top {
    right: 16px;
    bottom: 20px;
    width: 44px;
    height: 44px;
  }
}
</style>
