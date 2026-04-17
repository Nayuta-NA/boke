<template>
  <div class="articles-view">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="tabs-nav">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-button', { active: activeTab === index }]"
          @click="activeTab = index"
        >
          {{ tab.title }}
        </button>
      </div>

      <div class="actions-section">
        <!-- 编辑分类按钮 - 仅登录用户可见 -->
        <button v-if="canCreate()" class="edit-category-btn" @click="showCategoryManager">
          <SettingOutlined />
          编辑分类
        </button>

        <!-- 新建文章按钮 - 仅登录用户可见 -->
        <button v-if="canCreate()" class="create-article-btn" @click="showCreateModal">
          <PlusOutlined />
          新建文章
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 文章列表 - 使用新的卡片布局 -->
    <template v-else>
      <!-- 动态渲染每个 Tab -->
      <div
        v-for="(tab, tabIndex) in tabs"
        :key="tabIndex"
        v-show="activeTab === tabIndex"
        class="category-section"
      >
        <div class="articles-container">
          <!-- 根据分类的 cardType 使用对应的卡片组件 -->
          <ArticlesCard1
            v-if="tab.cardType === 'card1'"
            v-for="article in getArticlesByCategory(tab.title)"
            :key="`card1-${article.id}`"
            :article="article"
          />
          <ArticlesCard2
            v-else
            v-for="article in getArticlesByCategory(tab.title)"
            :key="`card2-${article.id}`"
            :article="article"
          />
        </div>
        <!-- 加载更多按钮 -->
        <div v-if="getArticlesByCategory(tab.title).length > 9" class="load-more-container">
          <button class="load-more-btn" @click="showAllArticles(tabIndex)">
            {{ showAllMap.get(tabIndex) ? '收起' : '加载更多' }}
          </button>
        </div>
      </div>
    </template>

    <!-- 创建文章模态框 -->
    <div v-if="createModalVisible" class="modal-overlay" @click="handleCancelCreate">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>新建文章</h3>
          <button class="close-btn" @click="handleCancelCreate">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>文章标题 <span class="required">*</span></label>
            <input
              v-model="newArticleForm.title"
              type="text"
              placeholder="请输入文章标题"
              class="form-input"
            />
          </div>
          <div class="form-item">
            <label>文章分类 <span class="required">*</span></label>
            <select v-model="newArticleForm.category" class="form-select">
              <option value="" disabled>请选择分类</option>
              <option v-for="tab in tabs" :key="tab.title" :value="tab.title">
                {{ tab.title }}
              </option>
            </select>
          </div>
          <div class="form-item">
            <label>封面图片 URL</label>
            <input
              v-model="newArticleForm.cover"
              type="text"
              placeholder="请输入封面图片链接（可选）"
              class="form-input"
            />
          </div>
          <div class="form-item">
            <label>文章摘要 <span class="required">*</span></label>
            <textarea
              v-model="newArticleForm.excerpt"
              placeholder="请输入文章摘要（100 字以内）"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
          <div class="form-item">
            <label>文章内容 <span class="required">*</span></label>
            <textarea
              v-model="newArticleForm.desc"
              placeholder="请输入文章内容"
              class="form-textarea"
              rows="6"
            ></textarea>
          </div>
          <div class="form-item">
            <label>标签（用逗号分隔）</label>
            <input
              v-model="newArticleForm.tags"
              type="text"
              placeholder="例如：Vue, JavaScript, 前端"
              class="form-input"
            />
          </div>
          <!-- 省份 - 城市级联选择器 -->
          <div class="form-item">
            <label>所在地区</label>
            <div class="location-selectors">
              <select
                v-model="newArticleForm.province"
                class="form-select"
                @change="handleProvinceChange"
              >
                <option value="" disabled>请选择省份</option>
                <option v-for="province in provinces" :key="province" :value="province">
                  {{ province }}
                </option>
              </select>
              <select
                v-model="newArticleForm.city"
                class="form-select"
                :disabled="!newArticleForm.province"
              >
                <option value="" disabled>请选择城市</option>
                <option v-for="city in availableCities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="handleCancelCreate">取消</button>
          <button class="btn-confirm" @click="handleCreateArticle" :disabled="confirmLoading">
            {{ confirmLoading ? '创建中...' : '创建' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 分类管理模态框 -->
    <div v-if="categoryManagerVisible" class="modal-overlay" @click="handleCancelCategoryManager">
      <div class="modal-content category-manager" @click.stop>
        <div class="modal-header">
          <h3>编辑分类</h3>
          <button class="close-btn" @click="handleCancelCategoryManager">×</button>
        </div>
        <div class="modal-body">
          <div class="category-list">
            <div v-for="(tab, index) in tabs" :key="index" class="category-item">
              <span class="category-name">{{ tab.title }}</span>
              <div class="category-actions">
                <span class="card-type-badge" :class="tab.cardType === 'card1' ? 'card1' : 'card2'">
                  {{ tab.cardType === 'card1' ? '旅游盒子' : '技术' }}
                </span>
                <button
                  v-if="tab.title !== '旅游' && tab.title !== '技术'"
                  class="delete-category-btn"
                  @click="deleteCategory(index)"
                  title="删除分类"
                >
                  <DeleteOutlined />
                </button>
              </div>
            </div>
          </div>
          <div class="add-category-section">
            <div class="form-item">
              <label>新增分类</label>
              <div class="add-category-input">
                <input
                  v-model="newCategoryName"
                  type="text"
                  placeholder="请输入分类名称"
                  class="form-input"
                  @keyup.enter="addCategory"
                />
                <select v-model="newCategoryCardType" class="form-select card-type-select">
                  <option value="card1">旅游盒子</option>
                  <option value="card2">技术</option>
                </select>
                <button
                  class="add-category-btn"
                  @click="addCategory"
                  :disabled="!newCategoryName.trim()"
                >
                  <PlusOutlined />
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="handleCancelCategoryManager">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import ArticlesCard2 from '@/components/ArticlesCard/ArticlesCard2.vue'
import ArticlesCard1 from '@/components/ArticlesCard/ArticlesCard1.vue'
import { useArticlesStore } from '@/stores/articles'
import { useAuthStore } from '@/stores/auth'
import { canCreate } from '@/lib/permissions'
// import Marquee from '@/components/pl/Marquee.vue'
// import Recommend from '@/components/Recommend/index.vue'

// 标签数据 - 从后端动态加载
const tabs = ref<any[]>([])

const activeTab = ref(0)
const isLoading = ref(true)

// 分类管理相关
const categoryManagerVisible = ref(false)
const newCategoryName = ref('')
const newCategoryCardType = ref('card1') // 默认使用 card1(旅游盒子)

// 使用文章 store
const articlesStore = useArticlesStore()

// 响应式文章数据 - 使用 Map 来存储每个分类的文章
const articlesByCategory = ref<Map<string, any[]>>(new Map())

// 控制显示全部文章的变量 - 使用 Map 来存储每个 tab 的状态
const showAllMap = ref<Map<number, boolean>>(new Map())

// 获取指定分类的文章
const getArticlesByCategory = (categoryName: string) => {
  const articles = articlesByCategory.value.get(categoryName) || []
  const showAll = showAllMap.value.get(activeTab.value) || false
  if (showAll) {
    return articles
  }
  return articles.slice(0, 9)
}

// 展示所有文章 (统一处理)
const showAllArticles = (tabIndex: number) => {
  const current = showAllMap.value.get(tabIndex) || false
  showAllMap.value.set(tabIndex, !current)
}

// 引入路由器
const router = useRouter()

// 新建文章模态框相关
const createModalVisible = ref(false)
const confirmLoading = ref(false)

// 新文章表单数据
interface ArticleForm {
  title: string
  category: string | undefined
  cover: string
  excerpt: string
  desc: string
  tags: string[]
  province: string
  city: string
}

const newArticleForm = reactive<ArticleForm>({
  title: '',
  category: undefined,
  cover: '',
  excerpt: '',
  desc: '',
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

// 计算可用城市列表
const availableCities = computed(() => {
  if (!newArticleForm.province) {
    return []
  }
  return citiesMap[newArticleForm.province] || []
})

// 处理省份选择变化
const handleProvinceChange = () => {
  // 选择省份后清空城市选择
  newArticleForm.city = ''
}

// 显示分类管理模态框
const showCategoryManager = () => {
  categoryManagerVisible.value = true
}

// 关闭分类管理模态框
const handleCancelCategoryManager = () => {
  categoryManagerVisible.value = false
  newCategoryName.value = ''
}

// 添加分类
const addCategory = async () => {
  const name = newCategoryName.value.trim()
  if (!name) {
    message.warning('请输入分类名称')
    return
  }

  try {
    const response = await fetch('http://localhost:5000/api/db/articles/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, cardType: newCategoryCardType.value }),
    })

    if (!response.ok) {
      const error = await response.json()
      if (response.status === 400 && error.error === '该分类已存在') {
        message.warning('该分类已存在')
      } else {
        throw new Error(error.error || '添加失败')
      }
      return
    }

    const newCategory = await response.json()
    tabs.value.push({
      title: newCategory.name,
      id: newCategory.id,
      isDefault: newCategory.isDefault,
      cardType: newCategory.cardType || 'card1',
    })
    newCategoryName.value = ''
    newCategoryCardType.value = 'card1' // 重置为默认值
    message.success('分类添加成功')
  } catch (error) {
    console.error('添加分类失败:', error)
    message.error('添加失败，请重试')
  }
}

// 删除分类
const deleteCategory = async (index: number) => {
  const category = tabs.value[index]

  // 只有"旅游"和"技术"分类不能删除
  if (category.title === '旅游' || category.title === '技术') {
    message.warning('系统核心分类不能删除')
    return
  }

  // 获取该分类下的文章数量
  const articlesInCategory = articlesByCategory.value.get(category.title) || []
  const articlesCount = articlesInCategory.length

  Modal.confirm({
    title: '确认删除',
    content: `删除分类"${category.title}"后，该分类下的${articlesCount}篇文章也将被删除。删除后将无法恢复。确定要删除吗？`,
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/db/articles/categories/${category.id}`,
          {
            method: 'DELETE',
          },
        )

        if (!response.ok) {
          const error = await response.json()
          if (response.status === 400 && error.articlesCount) {
            message.warning(error.error)
          } else if (response.status === 403) {
            message.warning('系统核心分类不能删除')
          } else {
            throw new Error(error.error || '删除失败')
          }
          return
        }

        // 后端已经级联删除了文章，只需重新加载数据
        await loadCategories()
        await loadArticles()

        message.success('分类及该分类下的所有文章已删除')
      } catch (error) {
        console.error('删除分类失败:', error)
        message.error('删除失败，请重试')
      }
    },
  })
}

// 跳转到详情页
const goToDetail = (id: number) => {
  router.push(`/articles/${id}`)
}

// 显示创建文章模态框
const showCreateModal = () => {
  createModalVisible.value = true
}

// 处理创建文章
const handleCreateArticle = async () => {
  if (
    !newArticleForm.title ||
    !newArticleForm.category ||
    !newArticleForm.excerpt ||
    !newArticleForm.desc
  ) {
    message.warning('请填写必填项')
    return
  }
  confirmLoading.value = true
  try {
    // 准备文章数据
    const articleData = {
      ...newArticleForm,
      // 只有用户主动上传了封面图才使用，否则不设置封面
      ...(newArticleForm.cover && { cover: newArticleForm.cover }),
      author: '张小明',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 分钟阅读',
      commentCount: 0,
      tags: newArticleForm.tags || [],
      link: '', // 添加必需的 link 字段
      category: newArticleForm.category!, // 使用非空断言，因为前面已经验证过
      // 清理省份和城市字段，如果为空则不发送
      ...(newArticleForm.province && { province: newArticleForm.province }),
      ...(newArticleForm.city && { city: newArticleForm.city }),
    }
    // 调用 store 的创建方法
    await articlesStore.createArticle(articleData)
    // 重新加载分类数据
    await loadArticles()
    // 重置表单
    Object.assign(newArticleForm, {
      title: '',
      category: undefined,
      cover: '',
      excerpt: '',
      desc: '',
      tags: [],
      province: '',
      city: '',
    })
    // 关闭模态框
    createModalVisible.value = false
    message.success('文章创建成功')
  } catch (error) {
    message.error('创建文章失败')
    console.error('创建文章失败:', error)
  } finally {
    confirmLoading.value = false
  }
}

// 取消创建文章
const handleCancelCreate = () => {
  createModalVisible.value = false
  // 重置表单
  Object.assign(newArticleForm, {
    title: '',
    category: undefined,
    cover: '',
    excerpt: '',
    desc: '',
    tags: [],
    province: '',
    city: '',
  })
}

// 根据分类过滤文章
const loadArticles = async () => {
  try {
    // 从 store 获取文章数据
    await articlesStore.fetchArticles()
    // 按分类过滤文章
    const allArticles = articlesStore.articles

    // 清空现有数据
    articlesByCategory.value.clear()

    // 遍历所有文章，根据文章的 category 字段分配到对应的分类
    allArticles.forEach((article: any) => {
      const category = article.category
      if (!category) return

      // 获取该分类现有的文章数组
      const existing = articlesByCategory.value.get(category) || []
      existing.push(article)
      // 更新 Map
      articlesByCategory.value.set(category, existing)
    })

    // 确保每个分类都有对应的数组 (即使为空)
    tabs.value.forEach((tab) => {
      if (!articlesByCategory.value.has(tab.title)) {
        articlesByCategory.value.set(tab.title, [])
      }
    })
  } catch (error) {
    console.error('加载文章失败:', error)
    message.error('加载文章失败')
  }
}

// 从后端加载分类数据
const loadCategories = async () => {
  try {
    console.log('=== 开始加载分类数据 ===')
    const response = await fetch('http://localhost:5000/api/db/articles/categories')
    console.log('=== 加载分类数据 ===')
    console.log('响应状态:', response.status)
    
    if (!response.ok) {
      throw new Error('加载分类失败')
    }
    const categories = await response.json()
    console.log('后端返回的分类数据:', categories)

    // 转换为 tabs 格式 - 严格按照数据库的 name 字段
    tabs.value = categories.map((cat: any) => ({
      title: cat.name, // 使用数据库的 name 字段
      id: cat.id,
      isDefault: cat.isDefault,
      cardType: cat.cardType || 'card1', // 使用数据库的 cardType 字段
    }))
    
    console.log('前端处理后的 tabs:', tabs.value)

    // 如果后端没有分类数据，使用默认分类
    if (tabs.value.length === 0) {
      console.log('后端无分类数据，使用默认分类')
      tabs.value = [
        { title: '旅游', id: 1, isDefault: true, cardType: 'card1' },
        { title: '前端', id: 2, isDefault: true, cardType: 'card2' },
        { title: '生活', id: 3, isDefault: true, cardType: 'card2' },
      ]
    }
  } catch (error) {
    console.error('加载分类失败:', error)
    console.log('使用默认分类')
    // 使用默认分类
    tabs.value = [
      { title: '旅游', id: 1, isDefault: true, cardType: 'card1' },
      { title: '前端', id: 2, isDefault: true, cardType: 'card2' },
      { title: '生活', id: 3, isDefault: true, cardType: 'card2' },
    ]
  }
}

// 页面加载完成后触发事件
onMounted(async () => {
  // 尽快触发 loaded 事件，减少等待时间
  const event = new Event('loaded')
  window.dispatchEvent(event)
  // 从后端加载分类数据
  await loadCategories()
  // 从后端加载文章数据
  await loadArticles()
  isLoading.value = false
})
</script>

<style scoped>
.articles-view {
  padding: 2rem;
  max-width: 90%;
  margin: 0 auto;
  margin-top: -2%;
}

/* 头部区域 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

/* 标签导航样式 */
.tabs-nav {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tab-button {
  padding: 10px 24px;
  border: none;
  border-radius: 25px;
  background-color: #f5f5f5;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background-color: #e8e8e8;
  color: #333;
}

.tab-button.active {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(64, 224, 208, 0.3);
}

.actions-section {
  display: flex;
  align-items: center;
}

.create-article-btn {
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.create-article-btn:hover {
  background-color: var(--primary-color-hover);
  box-shadow: 0 4px 12px var(--ant-primary-shadow);
  transform: translateY(-2px);
}

/* 编辑分类按钮样式 */
.edit-category-btn {
  padding: 10px 20px;
  background-color: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  margin-right: 12px;
}

.edit-category-btn:hover {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px var(--ant-primary-shadow);
  transform: translateY(-2px);
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #666;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 分类区域 */
.category-section {
  margin-bottom: 2rem;
}

/* 文章容器样式 - 优化后的网格布局 */
.articles-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  min-height: 400px;
}

/* 加载更多按钮样式 */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.load-more-btn {
  padding: 12px 32px;
  background-color: white;
  border: 2px solid #e5e7eb;
  border-radius: 30px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px var(--ant-primary-shadow);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .tabs-nav {
    justify-content: center;
  }

  .actions-section {
    justify-content: center;
  }

  .articles-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .articles-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: #f3f4f6;
  color: #4b5563;
}

.modal-body {
  padding: 24px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #ef4444;
  margin-left: 4px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:hover,
.form-select:hover,
.form-textarea:hover {
  border-color: var(--primary-color);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--ant-primary-shadow);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 省份 - 城市选择器布局 */
.location-selectors {
  display: flex;
  gap: 12px;
}

.location-selectors .form-select {
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-confirm {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #6b7280;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
}

.btn-confirm {
  background-color: var(--primary-color);
  color: white;
}

.btn-confirm:hover {
  background-color: var(--primary-color-hover);
  box-shadow: 0 4px 12px var(--ant-primary-shadow);
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 分类管理模态框样式 */
.category-manager .modal-body {
  padding: 24px;
}

.category-list {
  margin-bottom: 24px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.category-item:hover {
  background-color: #f3f4f6;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.category-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-type-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.card-type-badge.card1 {
  background-color: #4caf50;
}

.card-type-badge.card2 {
  background-color: #2196f3;
}

.delete-category-btn {
  padding: 6px 10px;
  background-color: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.delete-category-btn:hover {
  background-color: #fecaca;
  transform: scale(1.05);
}

.add-category-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
}

.add-category-input {
  display: flex;
  gap: 12px;
}

.add-category-input .form-input {
  flex: 1;
}

.add-category-input .card-type-select {
  width: 140px;
  flex-shrink: 0;
}

.add-category-btn {
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.add-category-btn:hover:not(:disabled) {
  background-color: var(--primary-color-hover);
  box-shadow: 0 4px 12px var(--ant-primary-shadow);
  transform: translateY(-2px);
}

.add-category-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式模态框 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
}
</style>
