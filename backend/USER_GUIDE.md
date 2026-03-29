# 多用户数据管理说明

## 📋 概述

数据库系统已支持多用户功能。所有数据表都包含 `user_id` 字段，用于关联数据到特定用户。

## 👤 当前用户配置

### 默认用户：nayuta
- **ID**: 1
- **用户名**: nayuta
- **角色**: admin
- **密码**: 123456

### 其他用户（暂无数据）
- **zhangxiaoming** (ID: 2)
- **lisi** (ID: 3)
- **wangwu** (ID: 4)

## 🔄 数据归属规则

### 1. 数据查询
- 所有查询接口默认返回 **nayuta** 用户的数据
- 可通过请求头或查询参数指定其他用户

### 2. 数据创建
- 新创建的数据会自动关联到当前登录用户
- 如果未指定用户，默认关联到 nayuta (ID=1)

### 3. 数据隔离
- 每个用户的数据完全隔离
- 用户只能查看和管理自己的数据

## 🌐 API 使用方式

### 方式一：通过请求头指定用户
```javascript
// 前端调用示例
fetch('/api/db/articles', {
  headers: {
    'X-User-ID': '1'  // 指定获取 nayuta 的数据
  }
});

// 创建文章时
fetch('/api/db/articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': '1'
  },
  body: JSON.stringify({
    title: '我的文章',
    content: '内容...'
  })
});
```

### 方式二：通过查询参数指定用户
```javascript
// 获取指定用户的数据
fetch('/api/db/articles?userId=1');

// 创建数据（不推荐，建议用请求头）
fetch('/api/db/articles?userId=1', {
  method: 'POST',
  body: JSON.stringify({...})
});
```

### 方式三：不指定（默认 nayuta）
```javascript
// 默认返回 nayuta 的数据
fetch('/api/db/articles');
fetch('/api/db/notes');
fetch('/api/db/travels');
fetch('/api/db/reviews');
```

## 🔧 路由修改说明

所有路由文件都已更新，包含用户过滤逻辑：

### 修改的路由文件
- ✅ `routes/articles.js` - 文章路由
- ✅ `routes/notes.js` - 笔记路由
- ✅ `routes/travels.js` - 旅行记录路由
- ✅ `routes/reviews.js` - 评论路由

### 通用模式
每个路由都包含以下函数：
```javascript
const getUserIdFromRequest = (req) => {
  // 优先从请求头获取
  const userIdHeader = req.headers['x-user-id'];
  if (userIdHeader && !isNaN(parseInt(userIdHeader))) {
    return parseInt(userIdHeader);
  }
  
  // 从查询参数获取
  const userIdQuery = req.query.userId;
  if (userIdQuery && !isNaN(parseInt(userIdQuery))) {
    return parseInt(userIdQuery);
  }
  
  // 默认返回 nayuta 的 ID (1)
  return 1;
};
```

## 📊 数据模型变更

### 新增字段
所有数据模型都新增了 `userId` 字段：

```javascript
// Article, Note, Review, Travel 都包含
userId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 1,  // 默认为 nayuta
  field: 'user_id',
}
```

### 数据库表结构
```sql
-- articles 表
CREATE TABLE articles (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  -- ... 其他字段
  user_id INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME,
  updated_at DATETIME
);

-- notes 表
CREATE TABLE notes (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  -- ... 其他字段
  user_id INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME,
  updated_at DATETIME
);

-- travels 表
CREATE TABLE travels (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  -- ... 其他字段
  user_id INTEGER NOT NULL DEFAULT 1
);

-- reviews 表
CREATE TABLE reviews (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  body TEXT NOT NULL,
  -- ... 其他字段
  user_id INTEGER NOT NULL DEFAULT 1
);
```

## 🚀 使用场景

### 场景一：单用户模式（当前）
所有数据都属于 nayuta，无需传递用户 ID：
```javascript
// 直接调用即可
GET /api/db/articles
POST /api/db/notes
```

### 场景二：多用户模式
前端登录后，将用户 ID 传递给后端：
```javascript
// 假设用户登录成功，获取到用户 ID
const currentUserId = authStore.user.id;

// 所有请求都带上用户 ID
axios.get('/api/db/articles', {
  headers: { 'X-User-ID': currentUserId }
});

axios.post('/api/db/articles', {
  title: '新文章',
  content: '...'
}, {
  headers: { 'X-User-ID': currentUserId }
});
```

### 场景三：管理员查看所有数据
管理员可以查看和管理所有用户的数据：
```javascript
// 管理员可以切换查看不同用户的数据
GET /api/db/articles?userId=1  // nayuta 的数据
GET /api/db/articles?userId=2  // zhangxiaoming 的数据
GET /api/db/articles?userId=3  // lisi 的数据
```

## 💾 数据迁移

### 历史数据
当前数据库中的所有历史数据都已关联到 nayuta 用户（ID=1）。

### 迁移脚本
`scripts/migrate-data.js` 已更新，确保所有导入的数据都设置正确的用户 ID：
```javascript
await Article.findOrCreate({
  where: { id: articleData.id },
  defaults: {
    ...restData,
    userId: 1, // 所有数据都属于 nayuta 用户
  },
});
```

## 🔒 安全建议

### 1. 后端验证
虽然前端会传递用户 ID，但后端应该进行身份验证：
```javascript
// TODO: 添加 JWT 或 Session 验证
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: '未授权' });
  }
  // 验证 token 并解析用户 ID
  next();
};
```

### 2. 权限控制
确保用户只能操作自己的数据：
```javascript
router.put('/:id', async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const article = await Article.findByPk(req.params.id);
  
  // 验证数据所有权
  if (article.userId !== userId) {
    return res.status(403).json({ error: '无权操作' });
  }
  
  await article.update(req.body);
  res.json(article);
});
```

## 📝 注意事项

1. **默认行为**: 如果不传递用户 ID，所有操作都针对 nayuta 用户
2. **数据隔离**: 查询时会自动加上 `where: { userId }` 条件
3. **创建数据**: 创建时会自动附加当前用户 ID
4. **历史兼容**: 原有的 JSON 文件 API 保持不变，作为备选方案

## 🎯 下一步计划

### 已完成 ✅
- [x] 数据模型添加 userId 字段
- [x] 数据迁移脚本更新
- [x] 路由添加用户过滤
- [x] 所有历史数据关联到 nayuta

### 待完成 📋
- [ ] 集成用户认证系统（JWT/Session）
- [ ] 前端登录后自动传递用户 ID
- [ ] 添加数据所有权验证
- [ ] 管理员界面（查看所有用户数据）
