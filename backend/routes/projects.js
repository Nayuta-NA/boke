const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/projects.json');

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

// 获取所有项目
router.get('/', async (req, res) => {
  try {
    const projects = await readData();
    // 按创建时间倒序排列
    const sortedProjects = projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个项目
router.get('/:id', async (req, res) => {
  try {
    const projects = await readData();
    const project = projects.find((p) => p.id == req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新项目
router.post('/', async (req, res) => {
  try {
    const { title, description, image, framework, tags, demo, github } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: '标题和描述为必填项' });
    }

    const projects = await readData();

    // 生成唯一 ID
    const newId = uuidv4();

    const newProject = {
      id: newId,
      title: title.trim(),
      description: description.trim(),
      image: image || '',
      framework: framework || 'Other',
      tags: tags || [],
      demo: demo || '',
      github: github || '',
      createdAt: new Date().toISOString(),
    };

    projects.push(newProject);
    await writeData(projects);
    res.status(201).json(newProject);
  } catch (error) {
    console.error('创建项目错误:', error);
    res.status(500).json({ error: error.message });
  }
});

// 更新项目
router.put('/:id', async (req, res) => {
  try {
    const projects = await readData();
    const index = projects.findIndex((p) => p.id == req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // 验证必填字段
    if (req.body.title && req.body.description) {
      projects[index] = {
        ...projects[index],
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        image: req.body.image !== undefined ? req.body.image : projects[index].image,
        framework: req.body.framework || projects[index].framework,
        tags: req.body.tags !== undefined ? req.body.tags : projects[index].tags,
        demo: req.body.demo !== undefined ? req.body.demo : projects[index].demo,
        github: req.body.github !== undefined ? req.body.github : projects[index].github,
        id: projects[index].id, // 确保 ID 不会被修改
      };
      await writeData(projects);
      res.json(projects[index]);
    } else {
      return res.status(400).json({ error: '标题和描述为必填项' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除项目
router.delete('/:id', async (req, res) => {
  try {
    const projects = await readData();
    const index = projects.findIndex((p) => p.id == req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const deletedProject = projects.splice(index, 1)[0];
    await writeData(projects);
    res.json(deletedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
