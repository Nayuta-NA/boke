// 迁移脚本：为现有数据库添加 article_categories 表
const { sequelize } = require('../config/database');

const migrate = async () => {
  try {
    console.log('🔄 开始迁移数据库...');
    
    // 1. 创建 article_categories 表
    console.log('📋 创建 article_categories 表...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS article_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        userId INTEGER NOT NULL,
        isDefault BOOLEAN DEFAULT false,
        cardType VARCHAR(20) DEFAULT 'card1',
        order INTEGER DEFAULT 0,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ article_categories 表创建成功');
    
    // 2. 检查是否已有默认分类
    const [existingCategories] = await sequelize.query(`
      SELECT COUNT(*) as count FROM article_categories WHERE isDefault = true
    `);
    
    if (existingCategories[0].count === 0) {
      // 3. 插入默认分类
      console.log('\n📋 插入默认分类...');
      const defaultCategories = [
        { name: '旅游', isDefault: true, order: 0, cardType: 'card1' },
        { name: '前端', isDefault: true, order: 1, cardType: 'card2' },
        { name: '生活', isDefault: true, order: 2, cardType: 'card2' },
      ];
      
      const now = new Date().toISOString();
      for (const category of defaultCategories) {
        await sequelize.query(`
          INSERT INTO article_categories (name, userId, isDefault, cardType, order, createdAt, updatedAt)
          VALUES (?, 1, ?, ?, ?, ?, ?)
        `, {
          replacements: [category.name, category.isDefault, category.cardType, category.order, now, now]
        });
        console.log(`   ✓ 插入分类:${category.name} (${category.cardType})`);
      }
      console.log('✅ 默认分类插入成功');
    } else {
      console.log('ℹ️  默认分类已存在，跳过插入');
    }
    
    // 4. 从现有文章中提取分类并填充
    console.log('\n📋 从现有文章提取分类...');
    const [articles] = await sequelize.query(`
      SELECT DISTINCT category FROM articles WHERE category IS NOT NULL AND category != ''
    `);
    
    if (articles && articles.length > 0) {
      console.log(`找到 ${articles.length} 个不同的分类`);
      
      // 获取当前最大 order 值
      const [maxOrderResult] = await sequelize.query(`
        SELECT MAX(order) as maxOrder FROM article_categories
      `);
      let currentOrder = maxOrderResult[0]?.maxOrder || 2;
      
      for (const article of articles) {
        const categoryName = article.category;
        
        // 检查分类是否已存在
        const [existing] = await sequelize.query(`
          SELECT * FROM article_categories WHERE name = ?
        `, {
          replacements: [categoryName],
          type: sequelize.QueryTypes.SELECT
        });
        
        if (!existing || existing.length === 0) {
          // 确定卡片类型：如果分类名包含"旅游"则用 card1，否则用 card2
          const cardType = categoryName.includes('旅游') ? 'card1' : 'card2';
          currentOrder++;
          
          const now = new Date().toISOString();
          await sequelize.query(`
            INSERT INTO article_categories (name, userId, isDefault, cardType, order, createdAt, updatedAt)
            VALUES (?, 1, false, ?, ?, ?, ?)
          `, {
            replacements: [categoryName, cardType, currentOrder, now, now]
          });
          console.log(`   ✓ 添加分类:${categoryName} (${cardType})`);
        }
      }
      console.log('✅ 文章分类提取完成');
    } else {
      console.log('ℹ️  没有找到文章分类');
    }
    
    console.log('\n✅ 数据库迁移完成!');
    console.log('✅ 请重启后端服务以应用更改');
    
  } catch (error) {
    console.error('❌ 迁移失败:', error);
    throw error;
  }
};

// 执行迁移
migrate()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));