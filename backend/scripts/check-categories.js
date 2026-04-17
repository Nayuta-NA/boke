const { sequelize } = require('../config/database')

;(async () => {
  try {
    console.log('=== 检查数据库表 ===')

    // 检查表是否存在
    const tables = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='article_categories'",
      { type: sequelize.QueryTypes.SELECT },
    )

    if (tables.length === 0) {
      console.log('❌ article_categories 表不存在！')
      console.log('请运行以下命令创建表：')
      console.log('node scripts/init-db.js')
      process.exit(1)
    }

    console.log('✅ article_categories 表存在')

    // 查询所有分类
    const categories = await sequelize.query('SELECT * FROM article_categories ORDER BY id', {
      type: sequelize.QueryTypes.SELECT,
    })

    console.log('\n=== 分类数据 ===')
    if (categories.length === 0) {
      console.log('表中没有数据')
    } else {
      categories.forEach((cat) => {
        console.log(`ID: ${cat.id}, 名称：${cat.name}, 用户：${cat.userId}, 类型：${cat.cardType}`)
      })
    }

    process.exit(0)
  } catch (error) {
    console.error('错误:', error.message)
    process.exit(1)
  }
})()
