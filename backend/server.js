const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

// 导入数据库配置和模型
const { testConnection } = require('./config/database');
const { User, Article, Note, Review, Travel } = require('./models');

// 导入路由
const userRoutes = require('./routes/users');
const articleRoutes = require('./routes/articles');
const noteRoutes = require('./routes/notes');
const reviewRoutes = require('./routes/reviews');
const travelRoutes = require('./routes/travels');
const resourceRoutes = require('./routes/resources');
const projectRoutes = require('./routes/projects');
const bookRoutes = require('./routes/books');

const app = express()
const PORT = process.env.PORT || 5000

// 配置文件上传
const UPLOAD_DIR = path.join(__dirname, 'uploads')
// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    // 使用UUID生成唯一的文件名，防止冲突
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueFilename)
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制文件大小为 5MB
  },
  fileFilter: function (req, file, cb) {
    // 只允许图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('只允许上传图片文件!'))
    }
  },
})

// Multer 错误处理中间件
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer 错误:', err.code, err.message)
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: '文件大小超过限制 (5MB)' })
    }
    return res.status(400).json({ error: err.message })
  } else if (err) {
    console.error('上传错误:', err.message)
    return res.status(400).json({ error: err.message })
  }
  next()
})

// 中间件
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
// 静态文件服务，用于提供上传的图片
app.use('/uploads', express.static(UPLOAD_DIR))

// 数据库路由
app.use('/api/db/users', userRoutes);
app.use('/api/db/articles', articleRoutes);
app.use('/api/db/notes', noteRoutes);
app.use('/api/db/reviews', reviewRoutes);
app.use('/api/db/travels', travelRoutes);
app.use('/api/db/resources', resourceRoutes);
app.use('/api/db/projects', projectRoutes);
app.use('/api/db/books', bookRoutes);

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data')
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json')
const NOTES_FILE = path.join(DATA_DIR, 'notes.json')
const TRAVELS_FILE = path.join(DATA_DIR, 'travels.json')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json') // 添加留言数据文件路径
const RESOURCES_FILE = path.join(DATA_DIR, 'resources.json') // 添加资源数据文件路径

// 读取数据的辅助函数
const readData = async (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        // 如果文件不存在，返回空数组
        if (err.code === 'ENOENT') {
          console.log(`File does not exist, returning empty array: ${filePath}`)
          resolve([])
          return
        }
        console.error(`Error reading file ${filePath}:`, err)
        reject(err)
        return
      }
      try {
        const jsonData = JSON.parse(data)
        resolve(jsonData)
      } catch (parseErr) {
        console.error(`Error parsing JSON from ${filePath}:`, parseErr)
        reject(parseErr)
      }
    })
  })
}

// 写入数据的辅助函数
const writeData = async (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error(`Error writing file ${filePath}:`, err)
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// API 路由

// 上传图片的路由
app.post('/api/upload', upload.single('image'), async (req, res) => {
  console.log('=== 图片上传请求 ===')
  console.log('Request headers:', req.headers)
  console.log('Request body:', req.body)
  console.log('Uploaded file:', req.file)
  
  if (!req.file) {
    console.error('没有接收到文件')
    return res.status(400).json({ error: '没有上传文件' })
  }

  try {
    // 返回上传文件的路径
    const imageUrl = `/uploads/${req.file.filename}`
    console.log('图片上传成功:', imageUrl)
    res.json({
      success: true,
      filename: req.file.filename,
      url: imageUrl,
    })
  } catch (error) {
    console.error('上传文件错误:', error)
    res.status(500).json({ error: error.message })
  }
})

// Articles 相关路由
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await readData(ARTICLES_FILE)
    res.json(articles)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/articles/:id', async (req, res) => {
  try {
    const articles = await readData(ARTICLES_FILE)
    const article = articles.find((a) => a.id == req.params.id)
    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }
    res.json(article)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/articles', async (req, res) => {
  try {
    const articles = await readData(ARTICLES_FILE)
    const newArticle = {
      id: articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1,
      ...req.body,
    }
    articles.push(newArticle)
    await writeData(ARTICLES_FILE, articles)
    res.status(201).json(newArticle)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/articles/:id', async (req, res) => {
  try {
    const articles = await readData(ARTICLES_FILE)
    const index = articles.findIndex((a) => a.id == req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'Article not found' })
    }
    articles[index] = { ...articles[index], ...req.body }
    await writeData(ARTICLES_FILE, articles)
    res.json(articles[index])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/articles/:id', async (req, res) => {
  try {
    const articles = await readData(ARTICLES_FILE)
    const index = articles.findIndex((a) => a.id == req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'Article not found' })
    }
    const deletedArticle = articles.splice(index, 1)[0]
    await writeData(ARTICLES_FILE, articles)
    res.json(deletedArticle)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Notes 相关路由
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await readData(NOTES_FILE)
    res.json(notes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/notes/:id', async (req, res) => {
  try {
    const notes = await readData(NOTES_FILE)
    const note = notes.find((n) => n.id == req.params.id)
    if (!note) {
      return res.status(404).json({ error: 'Note not found' })
    }
    res.json(note)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/notes', async (req, res) => {
  try {
    const notes = await readData(NOTES_FILE)
    const newNote = {
      id: uuidv4(),
      ...req.body,
    }
    notes.push(newNote)
    await writeData(NOTES_FILE, notes)
    res.status(201).json(newNote)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/notes/:id', async (req, res) => {
  try {
    const notes = await readData(NOTES_FILE)
    const index = notes.findIndex((n) => n.id == req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'Note not found' })
    }
    notes[index] = { ...notes[index], ...req.body }
    await writeData(NOTES_FILE, notes)
    res.json(notes[index])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const notes = await readData(NOTES_FILE)
    const index = notes.findIndex((n) => n.id == req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'Note not found' })
    }
    const deletedNote = notes.splice(index, 1)[0]
    await writeData(NOTES_FILE, notes)
    res.json(deletedNote)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Travels 相关路由
app.get('/api/travels', async (req, res) => {
  try {
    const travels = await readData(TRAVELS_FILE)
    res.json(travels)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/travels/:id', async (req, res) => {
  try {
    const travels = await readData(TRAVELS_FILE)
    const travel = travels.find((t) => t.id == req.params.id)
    if (!travel) {
      return res.status(404).json({ error: 'Travel not found' })
    }
    res.json(travel)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/travels', async (req, res) => {
  try {
    const travels = await readData(TRAVELS_FILE)
    const newTravel = {
      id: uuidv4(),
      ...req.body,
    }
    travels.push(newTravel)
    await writeData(TRAVELS_FILE, travels)
    res.status(201).json(newTravel)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/travels/:id', async (req, res) => {
  try {
    const travels = await readData(TRAVELS_FILE)
    const index = travels.findIndex((t) => t.id == req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'Travel not found' })
    }
    travels[index] = { ...travels[index], ...req.body }
    await writeData(TRAVELS_FILE, travels)
    res.json(travels[index])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/travels/:id', async (req, res) => {
  try {
    const travels = await readData(TRAVELS_FILE)
    const index = travels.findIndex((t) => t.id == req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'Travel not found' })
    }
    const deletedTravel = travels.splice(index, 1)[0]
    await writeData(TRAVELS_FILE, travels)
    res.json(deletedTravel)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Users 相关路由
app.get('/api/users', async (req, res) => {
  try {
    const users = await readData(USERS_FILE)
    // 在返回用户列表时不包含密码字段
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
    res.json(usersWithoutPassword)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/users/:id', async (req, res) => {
  try {
    const users = await readData(USERS_FILE)
    const user = users.find((u) => u.id == req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    // 在返回单个用户时不包含密码字段
    const { password, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 登录 API 端点
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    const users = await readData(USERS_FILE)
    const user = users.find((u) => u.username === username)

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // 这里我们使用简单的字符串比较，实际项目中应该使用 bcrypt 进行密码哈希比较
    // 由于我们使用的是预设的bcrypt哈希值 "$2a$10$92IXUNpkjO0rOQ5HiiBJeM3Ir9F1lhnGcOpRa3zTDMJYO7rb6BRFO" 对应明文 "password"
    if (password !== 'password' && user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // 返回用户信息，但不包含密码
    const { password: pwd, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/users', async (req, res) => {
  try {
    const users = await readData(USERS_FILE)
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      password: '$2a$10$92IXUNpkjO0rOQ5HiiBJeM3Ir9F1lhnGcOpRa3zTDMJYO7rb6BRFO', // 默认密码hash: password
      userPicture: '',
      userName: '',
      userRole: 'user',
      webLogo: '',
      mainColor: '#1890ff',
      ...req.body,
    }
    users.push(newUser)
    await writeData(USERS_FILE, users)
    // 不返回密码字段
    const { password, ...newUserWithoutPassword } = newUser
    res.status(201).json(newUserWithoutPassword)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/users/:id', async (req, res) => {
  try {
    const users = await readData(USERS_FILE)
    const index = users.findIndex((u) => u.id == req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' })
    }
    users[index] = {
      ...users[index],
      ...req.body,
    }
    await writeData(USERS_FILE, users)
    res.json(users[index])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/users/:id', async (req, res) => {
  try {
    const users = await readData(USERS_FILE)
    const index = users.findIndex((u) => u.id == req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' })
    }
    const deletedUser = users.splice(index, 1)[0]
    await writeData(USERS_FILE, users)
    res.json(deletedUser)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 获取最新活动的API接口
app.get('/api/recent-activities', async (req, res) => {
  try {
    // 并行获取所有数据源
    const [articles, notes, travels] = await Promise.all([
      readData(ARTICLES_FILE),
      readData(NOTES_FILE),
      readData(TRAVELS_FILE),
    ])

    // 合并所有活动并添加类型标识
    const activities = []

    // 处理文章数据
    articles.forEach((item) => {
      activities.push({
        id: item.id,
        type: '文章',
        title: item.title || item.name || '无标题',
        desc: item.description || item.content?.substring(0, 100) || '暂无描述',
        date: item.date || item.createdAt || new Date().toISOString(),
        ...item,
      })
    })

    // 处理笔记数据
    notes.forEach((item) => {
      activities.push({
        id: item.id,
        type: '随记',
        title: item.title || item.name || '无标题',
        desc: item.content?.substring(0, 100) || item.description || '暂无描述',
        date: item.date || item.createdAt || new Date().toISOString(),
        ...item,
      })
    })

    // 处理旅行数据
    travels.forEach((item) => {
      activities.push({
        id: item.id,
        type: '旅行',
        title: item.name || '无标题',
        desc: item.location || '暂无描述',
        date: item.date || item.createdAt || new Date().toISOString(),
        ...item,
      })
    })

    // 按日期降序排列（最新的在前）
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    res.json(activities)
  } catch (error) {
    console.error('获取最新活动失败:', error)
    res.status(500).json({ error: error.message })
  }
})

// Reviews 相关路由
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await readData(REVIEWS_FILE)
    // 按创建时间倒序排列，确保最新的在最前面
    const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json(sortedReviews)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/reviews/:id', async (req, res) => {
  try {
    const reviews = await readData(REVIEWS_FILE)
    const review = reviews.find((r) => r.id == req.params.id)
    if (!review) {
      return res.status(404).json({ error: 'Review not found' })
    }
    res.json(review)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 验证颜色值是否符合规范
const isValidColor = (color) => {
  const validColors = ['pink', 'green', 'blue', 'light-blue', 'default']
  return validColors.includes(color)
}

app.post('/api/reviews', async (req, res) => {
  try {
    // 验证请求体
    const { name, body, type, color } = req.body

    if (!body || body.trim().length === 0) {
      return res.status(400).json({ error: '留言内容不能为空' })
    }

    // 验证颜色值是否符合规范
    let validatedColor = color || 'default'
    if (!isValidColor(validatedColor)) {
      validatedColor = 'default' // 如果颜色无效，使用默认值
    }

    // 验证类型是否符合规范
    const validTypes = [
      '留言',
      '目标',
      '理想',
      '过去',
      '将来',
      '爱情',
      '亲情',
      '友情',
      '秘密',
      '信条',
      '无题',
    ]
    let validatedType = type || '留言'
    if (!validTypes.includes(validatedType)) {
      validatedType = '留言' // 如果类型无效，使用默认值
    }

    const reviews = await readData(REVIEWS_FILE)

    // 生成唯一ID
    const newId = uuidv4()

    const newReview = {
      id: newId,
      name: name || '匿名',
      body: body.trim(),
      color: validatedColor,
      type: validatedType,
      createdAt: new Date().toISOString(),
    }

    reviews.push(newReview)
    await writeData(REVIEWS_FILE, reviews)
    res.status(201).json(newReview)
  } catch (error) {
    console.error('创建留言错误:', error)
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/reviews/:id', async (req, res) => {
  try {
    const reviews = await readData(REVIEWS_FILE)
    const index = reviews.findIndex((r) => r.id == req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'Review not found' })
    }

    // 验证颜色值是否符合规范
    if (req.body.color && !isValidColor(req.body.color)) {
      return res.status(400).json({ error: '颜色值不符合规范' })
    }

    // 验证类型是否符合规范
    if (req.body.type) {
      const validTypes = [
        '留言',
        '目标',
        '理想',
        '过去',
        '将来',
        '爱情',
        '亲情',
        '友情',
        '秘密',
        '信条',
        '无题',
      ]
      if (!validTypes.includes(req.body.type)) {
        return res.status(400).json({ error: '类型不符合规范' })
      }
    }

    reviews[index] = {
      ...reviews[index],
      ...req.body,
      id: reviews[index].id, // 确保ID不会被修改
    }
    await writeData(REVIEWS_FILE, reviews)
    res.json(reviews[index])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const reviews = await readData(REVIEWS_FILE)
    const index = reviews.findIndex((r) => r.id == req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'Review not found' })
    }
    const deletedReview = reviews.splice(index, 1)[0]
    await writeData(REVIEWS_FILE, reviews)
    res.json(deletedReview)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Comments 相关路由（文章评论）
app.get('/api/comments', async (req, res) => {
  try {
    const articles = await readData(ARTICLES_FILE)
    const { articleId } = req.query
    
    if (!articleId) {
      return res.status(400).json({ error: '缺少文章 ID 参数' })
    }
    
    // 查找对应文章
    const article = articles.find((a) => a.id == articleId)
    if (!article) {
      return res.status(404).json({ error: '文章不存在' })
    }
    
    // 返回文章的评论，如果没有评论则返回空数组
    const comments = article.comments || []
    // 按创建时间倒序排列
    const sortedComments = comments.sort((a, b) => new Date(b.date) - new Date(a.date))
    res.json(sortedComments)
  } catch (error) {
    console.error('获取评论错误:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/comments', async (req, res) => {
  try {
    const { articleId, author, content } = req.body
    
    if (!articleId) {
      return res.status(400).json({ error: '缺少文章 ID' })
    }
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: '评论内容不能为空' })
    }
    
    const articles = await readData(ARTICLES_FILE)
    const articleIndex = articles.findIndex((a) => a.id == articleId)
    
    if (articleIndex === -1) {
      return res.status(404).json({ error: '文章不存在' })
    }
    
    // 生成唯一 ID
    const newId = uuidv4()
    
    const newComment = {
      id: newId,
      author: author || '访客',
      content: content.trim(),
      date: new Date().toISOString(),
      likeCount: 0,
    }
    
    // 确保文章有 comments 数组
    if (!articles[articleIndex].comments) {
      articles[articleIndex].comments = []
    }
    
    // 添加评论到文章
    articles[articleIndex].comments.push(newComment)
    
    // 更新文章的评论计数
    articles[articleIndex].commentCount = (articles[articleIndex].commentCount || 0) + 1
    
    await writeData(ARTICLES_FILE, articles)
    
    console.log('评论已保存:', newComment)
    res.status(201).json(newComment)
  } catch (error) {
    console.error('创建评论错误:', error)
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/comments/:id', async (req, res) => {
  try {
    const { articleId } = req.query
    const commentId = req.params.id
    
    if (!articleId) {
      return res.status(400).json({ error: '缺少文章 ID' })
    }
    
    const articles = await readData(ARTICLES_FILE)
    const articleIndex = articles.findIndex((a) => a.id == articleId)
    
    if (articleIndex === -1) {
      return res.status(404).json({ error: '文章不存在' })
    }
    
    const article = articles[articleIndex]
    const commentIndex = (article.comments || []).findIndex((c) => c.id == commentId)
    
    if (commentIndex === -1) {
      return res.status(404).json({ error: '评论不存在' })
    }
    
    // 删除评论
    const deletedComment = article.comments.splice(commentIndex, 1)[0]
    
    // 更新文章的评论计数
    if (article.commentCount > 0) {
      article.commentCount--
    }
    
    await writeData(ARTICLES_FILE, articles)
    
    console.log('评论已删除:', deletedComment)
    res.json(deletedComment)
  } catch (error) {
    console.error('删除评论错误:', error)
    res.status(500).json({ error: error.message })
  }
})

// 启动服务器
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`)
  
  // 初始化数据库连接
  try {
    await testConnection();
    console.log('✅ 数据库已连接');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
  }
  
  console.log(`\nAPI endpoints available:`)
  console.log(`\n=== 数据库 API (SQLite) ===`)
  console.log(`  Users: GET/POST/PUT/DELETE /api/db/users`)
  console.log(`  Articles: GET/POST/PUT/DELETE /api/db/articles`)
  console.log(`  Notes: GET/POST/PUT/DELETE /api/db/notes`)
  console.log(`  Reviews: GET/POST/PUT/DELETE /api/db/reviews`)
  console.log(`  Travels: GET/POST/PUT/DELETE /api/db/travels`)
  console.log(`\n=== 文件 API (JSON) ===`)
  console.log(`  Articles: GET/POST/PUT/DELETE /api/articles`)
  console.log(`  Notes: GET/POST/PUT/DELETE /api/notes`)
  console.log(`  Travels: GET/POST/PUT/DELETE /api/travels`)
  console.log(`  Users: GET/POST/PUT/DELETE /api/users`)
  console.log(`  Reviews: GET/POST/PUT/DELETE /api/reviews`)
  console.log(`  Recent Activities: GET /api/recent-activities`)
  console.log(`  Comments: GET/POST/DELETE /api/comments`)
  console.log(`  Upload: POST /api/upload`)
  console.log(`  Uploads served from: /uploads/*`)
})
















