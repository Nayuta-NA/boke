# MitakaNAY 后端 API

这是一个为 MitakaNAY 前端项目提供数据支持的 Node.js 后端服务，实现了对文章、笔记、旅行和用户数据的增删改查功能。

## 功能特性

- RESTful API 设计
- 基于 JSON 文件的数据存储
- 支持文章、笔记、旅行和用户数据的完整 CRUD 操作
- 跨域资源共享 (CORS) 支持

## 技术栈

- Node.js
- Express.js
- JSON 文件存储
- UUID 生成器

## API 端点

### 文章 (Articles)

- `GET /api/articles` - 获取所有文章
- `GET /api/articles/:id` - 获取特定文章
- `POST /api/articles` - 创建新文章
- `PUT /api/articles/:id` - 更新特定文章
- `DELETE /api/articles/:id` - 删除特定文章

### 笔记 (Notes)

- `GET /api/notes` - 获取所有笔记
- `GET /api/notes/:id` - 获取特定笔记
- `POST /api/notes` - 创建新笔记
- `PUT /api/notes/:id` - 更新特定笔记
- `DELETE /api/notes/:id` - 删除特定笔记

### 旅行 (Travels)

- `GET /api/travels` - 获取所有旅行记录
- `GET /api/travels/:id` - 获取特定旅行记录
- `POST /api/travels` - 创建新旅行记录
- `PUT /api/travels/:id` - 更新特定旅行记录
- `DELETE /api/travels/:id` - 删除特定旅行记录

### 用户 (Users)

- `GET /api/users` - 获取所有用户
- `GET /api/users/:id` - 获取特定用户
- `POST /api/users` - 创建新用户
- `PUT /api/users/:id` - 更新特定用户
- `DELETE /api/users/:id` - 删除特定用户

## 数据结构

### Article
```json
{
  "id": 1,
  "title": "文章标题",
  "cover": "封面图片链接（可选）",
  "category": "分类",
  "desc": "描述",
  "excerpt": "摘要",
  "author": "作者",
  "date": "日期",
  "readTime": "阅读时间",
  "commentCount": 评论数,
  "link": "链接",
  "tags": ["标签1", "标签2"]
}
```

### Note
```json
{
  "id": "唯一ID",
  "title": "标题",
  "icon": "图标",
  "date": "日期",
  "readTime": "阅读时间",
  "desc": "描述",
  "tags": "标签（可为null）"
}
```

### Travel
```json
{
  "id": "唯一ID",
  "url": "图片链接",
  "name": "名称",
  "location": "位置",
  "year": 年份,
  "province": "省份（可选）",
  "colSpan": 占列数
}
```

### User
```json
{
  "id": 1,
  "username": "用户名",
  "email": "邮箱",
  "name": "姓名",
  "avatar": "头像路径"
}
```

## 安装与运行

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动服务器：
   ```bash
   npm start
   # 或使用 nodemon 进行开发
   npm run dev
   ```

3. 服务器将在 http://localhost:5001 上运行

## 环境变量

- `PORT` - 服务器端口（默认为 5001）