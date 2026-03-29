const express = require('express');
const router = express.Router();
const { Note } = require('../models');

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

// 获取所有笔记（根据登录用户过滤）
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const notes = await Note.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 根据 ID 获取笔记
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({ error: '笔记不存在' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建笔记
router.post('/', async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const noteData = {
      ...req.body,
      userId,
    };
    const note = await Note.create(noteData);
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新笔记
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({ error: '笔记不存在' });
    }
    await note.update(req.body);
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除笔记
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({ error: '笔记不存在' });
    }
    await note.destroy();
    res.json({ message: '笔记已删除' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
