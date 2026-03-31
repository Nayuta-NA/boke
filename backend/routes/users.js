const express = require('express')
const router = express.Router()
const { User } = require('../models')

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 根据 ID 获取用户
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 创建用户
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body

    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' })
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } })
    if (existingUser) {
      return res.status(409).json({ error: '用户名已存在' })
    }

    const user = await User.create({
      username,
      password, // 注意：实际项目中应该使用 bcrypt 加密
      userPicture: '',
      userName: '',
      userRole: 'user',
      webLogo: '',
      mainColor: '#1890ff',
    })

    // 不返回密码字段
    const userWithoutPassword = user.toJSON()
    delete userWithoutPassword.password

    res.status(201).json(userWithoutPassword)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 更新用户
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }
    await user.update(req.body)
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 删除用户
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }
    await user.destroy()
    res.json({ message: '用户已删除' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
