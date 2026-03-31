const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/resources.json');

// 读取数据的辅助函数
const readData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

// 写入数据的辅助函数
const writeData = async (data) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

// 获取所有资源
router.get('/', async (req, res) => {
  try {
    const resources = await readData();
    // 按创建时间倒序排列
    const sortedResources = resources.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedResources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个资源
router.get('/:id', async (req, res) => {
  try {
    const resources = await readData();
    const resource = resources.find((r) => r.id == req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新资源
router.post('/', async (req, res) => {
  try {
    const { title, description, icon, url } = req.body;

    if (!title || !description || !url) {
      return res.status(400).json({ error: '标题、描述和链接为必填项' });
    }

    const resources = await readData();

    // 生成唯一ID
    const newId = uuidv4();

    const newResource = {
      id: newId,
      title: title.trim(),
      description: description.trim(),
      icon: icon || 'fas fa-link',
      url: url.trim(),
      createdAt: new Date().toISOString(),
    };

    resources.push(newResource);
    await writeData(resources);
    res.status(201).json(newResource);
  } catch (error) {
    console.error('创建资源错误:', error);
    res.status(500).json({ error: error.message });
  }
});

// 更新资源
router.put('/:id', async (req, res) => {
  try {
    const resources = await readData();
    const index = resources.findIndex((r) => r.id == req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // 验证必填字段
    if (req.body.title && req.body.description && req.body.url) {
      resources[index] = {
        ...resources[index],
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        icon: req.body.icon || resources[index].icon,
        url: req.body.url.trim(),
        id: resources[index].id, // 确保ID不会被修改
      };
      await writeData(resources);
      res.json(resources[index]);
    } else {
      return res.status(400).json({ error: '标题、描述和链接为必填项' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除资源
router.delete('/:id', async (req, res) => {
  try {
    const resources = await readData();
    const index = resources.findIndex((r) => r.id == req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    const deletedResource = resources.splice(index, 1)[0];
    await writeData(resources);
    res.json(deletedResource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
