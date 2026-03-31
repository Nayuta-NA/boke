const express = require('express');
const router = express.Router();
const { Article, sequelize } = require('../models');

// 获取当前登录用户的 ID(从请求头或查询参数)
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

// 获取所有文章 (根据登录用户过滤)
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const articles = await Article.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取所有分类 (从现有文章中提取)
// 注意：这个路由必须在 /:id 路由之前定义，否则会被 /:id 拦截
router.get('/categories', async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    
    // 首先尝试从 article_categories 表获取
    const [dbCategories] = await sequelize.query(`
      SELECT id, name, isDefault, cardType, [order] 
      FROM article_categories 
      WHERE userId = ? OR isDefault = true
      ORDER BY [order] ASC, createdAt ASC
    `, {
      replacements: [userId],
      type: sequelize.QueryTypes.SELECT
    });
    
    if (dbCategories && dbCategories.length > 0) {
      return res.json(dbCategories);
    }
    
    // 如果 article_categories 表不存在或没有数据，从文章中提取
    const articles = await Article.findAll({
      attributes: ['category'],
      where: { userId },
      raw: true
    });
    
    // 提取唯一的分类
    const categorySet = new Set();
    articles.forEach(article => {
      if (article.category) {
        categorySet.add(article.category);
      }
    });
    
    // 转换为数组并映射为对象
    const categories = Array.from(categorySet).map((name, index) => ({
      id: index + 1,
      name,
      isDefault: true,
      cardType: index === 0 ? 'card1' : 'card2', // 第一个分类默认为 card1，其他为 card2
    }));
    
    // 如果没有任何分类，返回默认分类
    if (categories.length === 0) {
      categories.push(
        { id: 1, name: '旅游', isDefault: true, cardType: 'card1' },
        { id: 2, name: '前端', isDefault: true, cardType: 'card2' },
        { id: 3, name: '生活', isDefault: true, cardType: 'card2' }
      );
    }
    
    res.json(categories);
  } catch (error) {
    console.error('获取分类失败:', error);
    // 返回默认分类
    res.json([
      { id: 1, name: '旅游', isDefault: true, cardType: 'card1' },
      { id: 2, name: '前端', isDefault: true, cardType: 'card2' },
      { id: 3, name: '生活', isDefault: true, cardType: 'card2' }
    ]);
  }
});

// 根据 ID 获取文章
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ error: '文章不存在' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建文章
router.post('/', async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const articleData = {
      ...req.body,
      userId,
    };
    const article = await Article.create(articleData);
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新文章
router.put('/:id', async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ error: '文章不存在' });
    }
    await article.update(req.body);
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除文章
router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ error: '文章不存在' });
    }
    await article.destroy();
    res.json({ message: '文章已删除' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建分类
router.post('/categories', async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { name, cardType = 'card1' } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: '分类名称不能为空' });
    }
    
    // 检查分类是否已存在
    const [existingCategories] = await sequelize.query(`
      SELECT * FROM article_categories WHERE name = ? AND (userId = ? OR isDefault = true)
    `, {
      replacements: [name.trim(), userId],
      type: sequelize.QueryTypes.SELECT
    });
    
    if (existingCategories && existingCategories.length > 0) {
      return res.status(400).json({ error: '该分类已存在' });
    }
    
    // 获取最大的 order 值
    const [maxOrderResult] = await sequelize.query(`
      SELECT MAX([order]) as maxOrder FROM article_categories WHERE userId = ?
    `, {
      replacements: [userId],
      type: sequelize.QueryTypes.SELECT
    });
    
    const maxOrder = maxOrderResult?.maxOrder || 0;
    const newOrder = maxOrder + 1;
    
    // 插入新分类
    const result = await sequelize.query(`
      INSERT INTO article_categories (name, userId, isDefault, cardType, [order], createdAt, updatedAt)
      VALUES (?, ?, false, ?, ?, datetime('now'), datetime('now'))
    `, {
      replacements: [name.trim(), userId, cardType, newOrder],
      type: sequelize.QueryTypes.INSERT
    });
    
    const newCategory = {
      id: result[0],
      name: name.trim(),
      isDefault: false,
      cardType: cardType,
      order: newOrder
    };
    
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({ error: '创建分类失败' });
  }
});

// 删除分类
router.delete('/categories/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = getUserIdFromRequest(req);
    
    // 检查分类是否存在
    const categories = await sequelize.query(`
      SELECT * FROM article_categories WHERE id = ?
    `, {
      replacements: [categoryId],
      type: sequelize.QueryTypes.SELECT
    });
    
    console.log('查询到的分类:', categories);
    
    if (!categories || categories.length === 0) {
      return res.status(404).json({ error: '分类不存在' });
    }
    
    const category = categories[0];
    
    // 检查是否是核心分类 (旅游或技术)
    if (category.name === '旅游' || category.name === '技术') {
      return res.status(403).json({ error: '系统核心分类不能删除' });
    }
    
    // 获取该分类下的所有文章
    const articles = await sequelize.query(`
      SELECT id FROM articles WHERE category = ? AND user_id = ?
    `, {
      replacements: [category.name, userId],
      type: sequelize.QueryTypes.SELECT
    });
    
    console.log('查询到的文章:', articles);
    
    const articlesCount = articles?.length || 0;
    
    // 级联删除该分类下的所有文章
    if (articlesCount > 0) {
      await sequelize.query(`
        DELETE FROM articles WHERE category = ? AND user_id = ?
      `, {
        replacements: [category.name, userId],
        type: sequelize.QueryTypes.DELETE
      });
    }
    
    // 删除分类
    await sequelize.query(`
      DELETE FROM article_categories WHERE id = ? AND userId = ?
    `, {
      replacements: [categoryId, userId],
      type: sequelize.QueryTypes.DELETE
    });
    
    res.json({ 
      message: '分类删除成功',
      deletedArticlesCount: articlesCount 
    });
  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({ error: '删除分类失败' });
  }
});

module.exports = router;
