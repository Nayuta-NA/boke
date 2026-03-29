const express = require('express');
const router = express.Router();
const { Travel } = require('../models');

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

// 获取所有旅行记录（根据登录用户过滤）
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const travels = await Travel.findAll({
      where: { userId },
      order: [['year', 'DESC']]
    });
    res.json(travels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 根据 ID 获取旅行记录
router.get('/:id', async (req, res) => {
  try {
    const travel = await Travel.findByPk(req.params.id);
    if (!travel) {
      return res.status(404).json({ error: '旅行记录不存在' });
    }
    res.json(travel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建旅行记录
router.post('/', async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const travelData = {
      ...req.body,
      userId,
    };
    const travel = await Travel.create(travelData);
    res.status(201).json(travel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新旅行记录
router.put('/:id', async (req, res) => {
  try {
    const travel = await Travel.findByPk(req.params.id);
    if (!travel) {
      return res.status(404).json({ error: '旅行记录不存在' });
    }
    await travel.update(req.body);
    res.json(travel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除旅行记录
router.delete('/:id', async (req, res) => {
  try {
    const travel = await Travel.findByPk(req.params.id);
    if (!travel) {
      return res.status(404).json({ error: '旅行记录不存在' });
    }
    await travel.destroy();
    res.json({ message: '旅行记录已删除' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
