const express = require('express');
const router = express.Router();
const { Article } = require('../models');

// 获取当前登录用户的 ID（从请求头或查询参数）
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

// 获取所有文章（根据登录用户过滤）
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

module.exports = router;
