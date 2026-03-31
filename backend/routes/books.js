const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/books.json');

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

// 获取所有书籍
router.get('/', async (req, res) => {
  try {
    const books = await readData();
    // 按创建时间倒序排列
    const sortedBooks = books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个书籍
router.get('/:id', async (req, res) => {
  try {
    const books = await readData();
    const book = books.find((b) => b.id == req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新书籍
router.post('/', async (req, res) => {
  try {
    const { title, author, cover, description, recommendation, tags, rating, publisher, publicationDate } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: '书名和作者为必填项' });
    }

    const books = await readData();

    // 生成唯一 ID
    const newId = uuidv4();

    const newBook = {
      id: newId,
      title: title.trim(),
      author: author.trim(),
      cover: cover || '',
      description: description || '',
      recommendation: recommendation || '',
      tags: tags || [],
      rating: rating || 5,
      publisher: publisher || '',
      publicationDate: publicationDate || '',
      createdAt: new Date().toISOString(),
    };

    books.push(newBook);
    await writeData(books);
    res.status(201).json(newBook);
  } catch (error) {
    console.error('创建书籍错误:', error);
    res.status(500).json({ error: error.message });
  }
});

// 更新书籍
router.put('/:id', async (req, res) => {
  try {
    const books = await readData();
    const index = books.findIndex((b) => b.id == req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // 验证必填字段
    if (req.body.title && req.body.author) {
      books[index] = {
        ...books[index],
        title: req.body.title.trim(),
        author: req.body.author.trim(),
        cover: req.body.cover !== undefined ? req.body.cover : books[index].cover,
        description: req.body.description !== undefined ? req.body.description : books[index].description,
        recommendation: req.body.recommendation !== undefined ? req.body.recommendation : books[index].recommendation,
        tags: req.body.tags !== undefined ? req.body.tags : books[index].tags,
        rating: req.body.rating !== undefined ? req.body.rating : books[index].rating,
        publisher: req.body.publisher !== undefined ? req.body.publisher : books[index].publisher,
        publicationDate: req.body.publicationDate !== undefined ? req.body.publicationDate : books[index].publicationDate,
        id: books[index].id, // 确保 ID 不会被修改
      };
      await writeData(books);
      res.json(books[index]);
    } else {
      return res.status(400).json({ error: '书名和作者为必填项' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除书籍
router.delete('/:id', async (req, res) => {
  try {
    const books = await readData();
    const index = books.findIndex((b) => b.id == req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const deletedBook = books.splice(index, 1)[0];
    await writeData(books);
    res.json(deletedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
