# Node.js + SQLite + Sequelize 数据库使用指南

## 📦 项目结构

```
backend/
├── config/
│   └── database.js          # 数据库配置文件
├── models/
│   ├── index.js             # Model 索引和关联关系
│   ├── User.js              # 用户模型
│   ├── Article.js           # 文章模型
│   ├── Note.js              # 笔记模型
│   ├── Review.js            # 评论模型
│   └── Travel.js            # 旅行记录模型
├── routes/
│   ├── index.js             # 路由索引
│   ├── users.js             # 用户路由
│   ├── articles.js          # 文章路由
│   ├── notes.js             # 笔记路由
│   ├── reviews.js           # 评论路由
│   └── travels.js           # 旅行记录路由
├── scripts/
│   ├── init-db.js           # 数据库初始化脚本
│   └── migrate-data.js      # 数据迁移脚本
├── data/
│   ├── database.sqlite      # SQLite 数据库文件（自动生成）
│   ├── users.json           # 原始 JSON 数据
│   ├── articles.json        # 原始 JSON 数据
│   ├── notes.json           # 原始 JSON 数据
│   ├── reviews.json         # 原始 JSON 数据
│   └── travels.json         # 原始 JSON 数据
└── server.js                # 主服务器文件
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

已安装的主要依赖：
- `sequelize` - ORM 框架
- `sqlite3` - SQLite 数据库驱动
- `pg-hstore` - PostgreSQL HSTORE 支持（Sequelize 需要）

### 2. 初始化数据库

运行以下命令创建数据库表结构：

```bash
node scripts/init-db.js
```

执行成功后会显示：
```
✅ 数据库连接成功!
🔄 开始同步数据库...
✅ 数据库同步完成！
✅ 所有表已创建：
   - users
   - articles
   - notes
   - reviews
   - travels
```

### 3. 迁移数据

将现有的 JSON 数据导入到 SQLite 数据库：

```bash
node scripts/migrate-data.js
```

执行成功后会显示：
```
🚀 开始数据迁移...

✅ 数据库连接成功!
✅ 数据库表结构已就绪

📝 开始迁移用户数据...
✅ 成功迁移 4 个用户
📝 开始迁移文章数据...
✅ 成功迁移 XX 篇文章
📝 开始迁移笔记数据...
✅ 成功迁移 XX 篇笔记
📝 开始迁移评论数据...
✅ 成功迁移 XX 条评论
📝 开始迁移旅行记录数据...
✅ 成功迁移 XX 条旅行记录

🎉 所有数据迁移完成！
```

### 4. 启动服务器

```bash
node server.js
```

或如果使用 nodemon：

```bash
nodemon server.js
```

## 📡 API 端点

服务器启动后，提供两套 API 端点：

### 数据库 API（推荐）

基于 SQLite + Sequelize 的 API：

```
GET    /api/db/users          - 获取所有用户
GET    /api/db/users/:id      - 获取指定用户
POST   /api/db/users          - 创建用户
PUT    /api/db/users/:id      - 更新用户
DELETE /api/db/users/:id      - 删除用户

GET    /api/db/articles       - 获取所有文章
GET    /api/db/articles/:id   - 获取指定文章
POST   /api/db/articles       - 创建文章
PUT    /api/db/articles/:id   - 更新文章
DELETE /api/db/articles/:id   - 删除文章

GET    /api/db/notes          - 获取所有笔记
GET    /api/db/notes/:id      - 获取指定笔记
POST   /api/db/notes          - 创建笔记
PUT    /api/db/notes/:id      - 更新笔记
DELETE /api/db/notes/:id      - 删除笔记

GET    /api/db/reviews        - 获取所有评论
GET    /api/db/reviews/:id    - 获取指定评论
POST   /api/db/reviews        - 创建评论
PUT    /api/db/reviews/:id    - 更新评论
DELETE /api/db/reviews/:id    - 删除评论

GET    /api/db/travels        - 获取所有旅行记录
GET    /api/db/travels/:id    - 获取指定旅行记录
POST   /api/db/travels        - 创建旅行记录
PUT    /api/db/travels/:id    - 更新旅行记录
DELETE /api/db/travels/:id    - 删除旅行记录
```

### 文件 API（兼容旧版）

基于 JSON 文件的 API（原有功能保持不变）：

```
GET    /api/articles
GET    /api/notes
GET    /api/travels
GET    /api/users
GET    /api/reviews
GET    /api/comments
... 等等
```

## 💾 数据模型

### User（用户）
```javascript
{
  id: INTEGER (主键，自增),
  username: STRING (唯一，必填),
  password: STRING (必填),
  email: STRING,
  name: STRING,
  avatar: STRING,
  userPicture: STRING,
  userName: STRING,
  userRole: STRING (默认 'user'),
  webLogo: STRING,
  mainColor: STRING (默认 '#1890ff'),
  introduction: TEXT,
  interests: JSON,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Article（文章）
```javascript
{
  id: INTEGER (主键，自增),
  title: STRING (必填),
  category: STRING,
  desc: TEXT,
  excerpt: STRING,
  author: STRING,
  date: STRING,
  readTime: STRING,
  province: STRING,
  city: STRING,
  commentCount: INTEGER (默认 0),
  link: STRING,
  tags: JSON,
  likeCount: INTEGER (默认 0),
  comments: JSON,
  content: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Note（笔记）
```javascript
{
  id: INTEGER (主键，自增),
  title: STRING (必填),
  content: TEXT (必填),
  date: STRING,
  tags: JSON,
  likeCount: INTEGER (默认 0),
  commentCount: INTEGER (默认 0),
  createdAt: DATE,
  updatedAt: DATE
}
```

### Review（评论）
```javascript
{
  id: INTEGER (主键，自增),
  title: STRING (必填),
  content: TEXT (必填),
  rating: FLOAT,
  date: STRING,
  tags: JSON,
  likeCount: INTEGER (默认 0),
  commentCount: INTEGER (默认 0),
  createdAt: DATE,
  updatedAt: DATE
}
```

### Travel（旅行记录）
```javascript
{
  id: INTEGER (主键，自增),
  title: STRING (必填),
  category: STRING,
  desc: TEXT,
  excerpt: STRING,
  author: STRING,
  date: STRING,
  readTime: STRING,
  province: STRING,
  city: STRING,
  commentCount: INTEGER (默认 0),
  link: STRING,
  tags: JSON,
  likeCount: INTEGER (默认 0),
  comments: JSON,
  content: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

## 🔧 常用操作

### 重置数据库

如果要删除所有数据并重新创建：

1. 删除 `data/database.sqlite` 文件
2. 重新运行初始化脚本：
   ```bash
   node scripts/init-db.js
   node scripts/migrate-data.js
   ```

### 查看数据库内容

可以使用 SQLite 客户端工具查看数据库：

```bash
# 安装 SQLite 命令行工具后
sqlite3 data/database.sqlite

# 查看表
.tables

# 查看用户数据
SELECT * FROM users;

# 退出
.exit
```

### 添加新的 Model

1. 在 `models/` 目录创建新的 Model 文件
2. 在 `models/index.js` 中导出并定义关联关系
3. 在 `routes/` 目录创建对应的路由文件
4. 在 `server.js` 中注册新路由
5. 更新数据迁移脚本（如需要）

## 📝 注意事项

1. **数据库文件位置**: SQLite 数据库文件位于 `data/database.sqlite`，请勿手动删除
2. **数据一致性**: 使用数据库 API 后，JSON 文件中的数据不会自动同步
3. **密码安全**: 生产环境请使用 bcrypt 等加密库对密码进行哈希处理
4. **性能优化**: 对于大量数据的查询，建议添加索引和分页
5. **备份**: 定期备份 `database.sqlite` 文件

## 🎯 优势

使用 SQLite + Sequelize 的优势：

- ✅ 更快的查询速度
- ✅ 更好的数据一致性
- ✅ 支持复杂查询和关联
- ✅ 事务支持
- ✅ 数据验证
- ✅ 迁移和种子数据支持
- ✅ 保留原有 JSON API 作为备选

## 🆘 故障排除

### 数据库连接失败

检查 `config/database.js` 中的配置是否正确，确保 `data/` 目录存在。

### 数据迁移失败

1. 确保 JSON 数据格式正确
2. 确保数据库表已经创建
3. 查看详细错误信息

### 路由 404

确保在 `server.js` 中正确注册了路由，检查路由前缀 `/api/db/`。

## 📚 参考资源

- [Sequelize 官方文档](https://sequelize.org/)
- [SQLite 官网](https://www.sqlite.org/)
- [Express 官网](https://expressjs.com/)
