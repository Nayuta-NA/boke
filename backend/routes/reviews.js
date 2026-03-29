const express = require('express');
const router = express.Router();
const { Review } = require('../models');

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

// 获取所有评论（根据登录用户过滤）
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const reviews = await Review.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 根据 ID 获取评论
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ error: '评论不存在' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建评论
router.post('/', async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const reviewData = {
      ...req.body,
      userId,
    };
    const review = await Review.create(reviewData);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新评论
router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ error: '评论不存在' });
    }
    await review.update(req.body);
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除评论
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ error: '评论不存在' });
    }
    await review.destroy();
    res.json({ message: '评论已删除' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
